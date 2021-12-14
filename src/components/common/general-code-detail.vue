<template>
    <section class="component order-base-detail;height:">
        <a-card class="margin-top order-edit-page">
            <div
                style="padding:0 20px 10px 20px;min-height:40px;display:inline-block;"
            >
                <a-button
                    type="primary"
                    @click="onSubmit()"
                    style="margin-right:5px;"
                    size="small"
                    :disabled="!this.generalName"
                    >{{ $t('action.save') }}</a-button
                >
                <a-button
                    @click="onAdd()"
                    type="default"
                    size="small"
                    style="margin-right:5px;"
                    :disabled="!this.generalName"
                    >{{ $t('action.add') }}
                </a-button>

                <a-button
                    @click="onDelete()"
                    style="margin-right:5px;"
                    :disabled="!this.generalName && !selectedRowKeys.length"
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
                :scroll="{ y: 200 }"
                bordered
            >
                <template slot="general_code" slot-scope="text, row"
                    ><a-input
                        size="small"
                        v-if="currentRow == row.index"
                        :value="row.general_code"
                        @change="
                            e =>
                                handleChange(
                                    e.target.value,
                                    row,
                                    'general_code'
                                )
                        "
                    /><span v-else>{{ row.general_code }}</span></template
                >
                <template slot="general_name" slot-scope="text, row"
                    ><a-input
                        size="small"
                        v-if="currentRow == row.index"
                        :value="row.general_name"
                        @change="
                            e =>
                                handleChange(
                                    e.target.value,
                                    row,
                                    'general_name'
                                )
                        "
                    /><span v-else>{{ row.general_name }}</span></template
                >
            </a-table>
        </a-card>
    </section>
</template>

<style>
.ant-select-auto-complete.ant-select-sm .ant-input,
.required .ant-calendar-picker-input,
.required .ant-select-selection--single {
    background-color: #ecc5e9;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ProductService } from '@/services/product.service'
import { RequestParams } from '@/core/http'
import { CommonService } from '@/shared/utils/common.service'
import { formConfig } from '@/config/form.config'
import { LoadingService } from '@/bootstrap/services/loading.service'
import UUID from 'uuidjs'
import moment from 'moment'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

@Component({
    components: {}
})
export default class GeneralCodeDetail extends Vue {
    @Prop()
    info: any

    @Prop()
    generalName: any

    @Prop()
    generalMemo: any

    private currentRow: any = ''

    private columns: any = ''

    private data: any[] = []

    private orderDetail: any[] = []

    private originData: any = []

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private detailColumns: any = []
    private selectedRowKeys: any = []

    @Watch('info')
    onInfoChange() {
        if (this.info) {
            this.updateOrder()
        }
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
        let index = UUID.generate()
        this.orderDetail.push({
            index: index,
            save_flag: 0,
            general_code: '',
            general_name: ''
        })
        this.currentRow = index
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
                        general_code_group: this.generalName,
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
                            general_code_group: this.generalName
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
  "en-us":{
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
    }
  },
  "zh-cn":{
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
    }
  }
}
</i18n>
