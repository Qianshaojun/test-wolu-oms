<template>
    <section class="component edit-customer">
        <div style="margin: 10px 10px 20px 10px;">
            <a-form
                class="data-form"
                layout="inline"
                :form="form"
                :labelCol="{ span: 3 }"
                :wrapperCol="{ span: 16, offset: 1 }"
            >
                <a-row :gutter="24">
                    <a-col :span="20">
                        <a-form-item label="组名" required>
                            <a-input
                                v-decorator="[
                                    `general_code_group`,
                                    {
                                        rules: rules.required
                                    }
                                ]"
                                @change="
                                    e => {
                                        generalCodeName = e.target.value
                                    }
                                "
                                size="small"
                                style="width: 200px;"
                                :disabled="generalName !== ''"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="20">
                        <a-form-item label="说明" required>
                            <a-input
                                v-decorator="[`memo`]"
                                @change="
                                    e => {
                                        generalMemo = e.target.value
                                    }
                                "
                                size="small"
                                style="width: 200px;"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
        <div
            style="padding:0 20px 10px 20px;min-height:40px;display:inline-block;"
        >
            <!-- <a-button
                type="primary"
                @click="onSubmit()"
                style="margin-right:5px;"
                size="small"
                >{{ $t('action.save') }}</a-button
            > -->
            <a-button
                @click="onAdd()"
                type="default"
                size="small"
                style="margin-right:5px;"
                >{{ $t('action.add') }}
            </a-button>

            <a-button
                @click="onDelete()"
                style="margin-right:5px;"
                :disabled="!selectedRowKeys.length"
                size="small"
            >
                {{ $t('action.delete') }}
            </a-button>
        </div>
        <a-table
            :dataSource="orderDetail"
            :pagination="false"
            rowKey="index"
            :columns="detailColumns"
            :rowSelection="{
                selectedRowKeys: selectedRowKeys,
                onChange: keys => (selectedRowKeys = keys)
            }"
            :customRow="
                record => ({
                    on: {
                        click: () => {
                            this.selectedRowKeys = [record.index]
                            onTbRowClick(record)
                        }
                    }
                })
            "
            style="table-layout:fixed;"
            :scroll="{ y: 400 }"
            bordered
        >
            <template slot="general_code" slot-scope="text, row"
                ><a-input
                    size="small"
                    v-if="currentRow == row.index"
                    :value="row.general_code"
                    @change="
                        e => handleChange(e.target.value, row, 'general_code')
                    "
                /><span v-else>{{ row.general_code }}</span></template
            >
            <template slot="general_name" slot-scope="text, row"
                ><a-input
                    size="small"
                    v-if="currentRow == row.index"
                    :value="row.general_name"
                    @change="
                        e => handleChange(e.target.value, row, 'general_name')
                    "
                /><span v-else>{{ row.general_name }}</span></template
            >
        </a-table>
        <div class="flex-row justify-content-end margin-top-20">
            <a-button class="margin-right" @click="cancel">取消</a-button>
            <a-button type="primary" @click="onSubmit">提交</a-button>
        </div>
    </section>
</template>

<style>
.required {
    background-color: #ecc5e9;
}
.margin-top-20 {
    margin-top: 20px;
}
</style>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop, Emit } from 'vue-property-decorator'
import { Form } from 'ant-design-vue'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import moment from 'moment'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { LocationService } from '../../services/location.service'
import UUID from 'uuidjs'

@Component({
    components: {}
})
export default class GeneralCodeGroupEdit extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    info: any

    @Prop({ default: '' })
    generalName: any

    @Prop({ default: '' })
    generalMemo: any

    @Prop({ default: 0 })
    private save_flag

    private moment = moment

    private generalCodeName: any = ''

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private locationService = new LocationService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()
    // 表格数据源
    private order: any = []

    private orderDetail: any[] = []

    private originData: any = []

    private menu_code: any = ''

    private editAble: any = false

    private currentRow: any = ''

    private detailColumns: any = []
    private selectedRowKeys: any = []

    private form: any

    @Watch('info')
    onInfoChange() {
        if (this.info) {
            this.updateOrder()
        }
    }

    private rules = {
        required: [{ required: true, message: '请先填写组名' }]
    }

    private created() {
        this.form = this.$form.createForm(this)
    }

    private mounted() {
        this.detailColumns = [
            {
                key: 'general_code',
                title: this.$t('columns.general_code'),
                dataIndex: 'general_code',
                align: 'center',
                scopedSlots: { customRender: 'general_code' }
            },
            {
                key: 'general_name',
                title: this.$t('columns.general_name'),
                dataIndex: 'general_name',
                align: 'center',
                scopedSlots: { customRender: 'general_name' }
            }
        ]

        if (this.info) {
            this.updateOrder()
        }

        if (this.generalName) {
            this.generalCodeName = this.generalName
            this.form.setFieldsValue({
                general_code_group: this.generalName,
                memo: this.generalMemo
            })
        }
    }

    private updateOrder() {
        if (this.info.length) {
            this.orderDetail = JSON.parse(
                JSON.stringify(
                    this.info.map(x => {
                        ;(x['index'] = UUID.generate()), (x['save_flag'] = 1)
                        return x
                    })
                )
            )
        }
    }

    private onAdd() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                let index = UUID.generate()
                this.orderDetail.push({
                    index: index,
                    save_flag: 0,
                    general_code: '',
                    general_name: ''
                })
                this.currentRow = index
            }
        })
    }

    private onSubmit() {
        for (var i of this.orderDetail) {
            if (!i.general_code || !i.general_name) {
                this.$message.error('请先完善明细信息')
                return false
            }
        }
        let params = JSON.parse(JSON.stringify(this.orderDetail))
        this.innerAction.setActionAPI(
            'common/save_general_code_list',
            CommonService.getMenuCode('code-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        save_list: params.map(x => {
                            delete x.index
                            return x
                        }),
                        general_code_group: this.generalCodeName,
                        memo: this.generalMemo
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.submit()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDelete() {
        let delete_list: any = []
        for (let i of this.selectedRowKeys) {
            let item = this.orderDetail.find(x => x.index == i)
            if (!item) {
                continue
            }

            if (item.save_flag === 1) {
                delete_list.push({
                    general_code: item.general_code,
                    general_name: item.general_name
                })
            }
        }

        if (delete_list.length) {
            this.innerAction.setActionAPI(
                'common/delete_general_code_list',
                CommonService.getMenuCode('code-manage')
            )
            this.publicService
                .modify(
                    new RequestParams(
                        {
                            delete_list: delete_list,
                            general_code_group: this.generalCodeName
                        },
                        {
                            loading: this.loadingService,
                            innerAction: this.innerAction
                        }
                    )
                )
                .subscribe(
                    data => {
                        let msg: any = this.$t('tips.save_success')
                        this.$message.success(msg)
                        this.orderDetail = this.orderDetail.filter(
                            x => !this.selectedRowKeys.includes(x.index)
                        )
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        } else {
            let msg: any = this.$t('tips.save_success')
            this.$message.success(msg)
            this.orderDetail = this.orderDetail.filter(
                x => !this.selectedRowKeys.includes(x.index)
            )
        }
    }

    private onTbRowClick(row) {
        this.currentRow = row.index
    }

    private handleChange(e, row, column) {
        row[column] = e
        if (column == 'product_qty') {
            row.available_ship_qty = e - row.shipped_qty
        }
    }
}
</script>

<i18n>
{
  "en-us": {
    "desc": "this is a Order Page1",
    "columns":{
        "general_code":"general_code",
        "general_name":"general_name"
    },
    "action":{
        "split":"Split",
        "edit":"Edit",
        "delete":"Delete",
        "ok":"Yes",
        "more":"More",
        "save":"Save",
        "confirm":"Confirm",
        "cancel":"Cancel",
        "add":"Add"
    },
    "rules":{
       "date_range_error":"start date can't later start date"
    },
    "delete":"Are you sure delete?",
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Delete Success"
  },
  "zh-cn": {
    "desc": "这是订单页面1",
    "columns":{
        "general_code":"编码",
        "general_name":"值"
    },
    "action":{
      "split":"拆分",
      "edit":"编辑",
      "delete":"删除",
      "ok":"确定",
      "more":"更多操作",
      "save":"保存",
      "cancel":"取消",
      "add":"新增"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "delete":"是否确认删除?",
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "delete_success":"删除成功"
  }
}
</i18n>
