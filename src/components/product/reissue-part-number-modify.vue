<template>
    <section class="component edit-customer">
        <a-card class="margin-y" style="margin:0 !important;">
            <a-form
                class="data-form"
                :form="form"
                :labelCol="{ span: 7 }"
                :wrapperCol="{ span: 16, offset: 1 }"
            >
                <!--默认显示项-->
                <template #default>
                    <a-row>
                        <a-col :span="12">
                            <a-form-item
                                label="补发单号"
                                style="height:35px;margin:0;"
                            >
                                <a-input
                                    v-decorator="['picking_name']"
                                    :style="{
                                        width: '195px',
                                        'margin-left': '5px'
                                    }"
                                    size="small"
                                ></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                label="补发产品货号"
                                style="height:35px;margin:0;"
                            >
                                <a-input
                                    v-decorator="['default_code']"
                                    :style="{
                                        width: '195px',
                                        'margin-left': '5px'
                                    }"
                                    size="small"
                                ></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                label="临时配件编号"
                                style="height:35px;margin:0;"
                            >
                                <a-input
                                    v-decorator="['tmpl_default_code']"
                                    :style="{
                                        width: '195px',
                                        'margin-left': '5px'
                                    }"
                                    size="small"
                                ></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                label="编号状态"
                                style="height:35px;margin:0;"
                            >
                                <a-radio-group
                                    v-decorator="[
                                        'state',
                                        { initialValue: '未修正' }
                                    ]"
                                    size="small"
                                    :style="{ height: '20px' }"
                                    buttonStyle="solid"
                                >
                                    <a-radio-button value=""
                                        >全部</a-radio-button
                                    >
                                    <a-radio-button value="未修正"
                                        >未修正</a-radio-button
                                    >
                                    <a-radio-button value="已修正"
                                        >已修正</a-radio-button
                                    >
                                    <a-radio-button value="无需修正"
                                        >无需修正</a-radio-button
                                    >
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                label="创建时间"
                                style="height:35px;margin:0;"
                            >
                                <a-range-picker
                                    v-decorator="['create_date']"
                                    show-time
                                    :style="{ width: '300px' }"
                                    format="YYYY-MM-DD HH:mm"
                                    size="small"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                label="中文子类"
                                style="height:35px;margin:0;"
                            >
                                <a-select
                                    v-decorator="['z_category']"
                                    style="width: 100px"
                                    @change="handleFatherCateChange"
                                    placeholder="品类"
                                    size="small"
                                    allowClear
                                >
                                    <a-select-option
                                        v-for="cate in fatherCates"
                                        :key="cate"
                                    >
                                        {{ cate }}
                                    </a-select-option>
                                </a-select>
                                <a-select
                                    v-decorator="['z_sub_category']"
                                    v-model="selectedList"
                                    mode="multiple"
                                    style="width: 164px;margin-left:5px"
                                    placeholder="子类"
                                    size="small"
                                >
                                    <a-select-option
                                        v-for="cate in sonCates"
                                        :key="cate"
                                    >
                                        {{ cate }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </template>
            </a-form>
            <p>
                <a-button
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="before_no_need_modify_sku()"
                    >{{ $t('action.no_need_modify_sku') }}</a-button
                >
                <a-button
                    type="primary"
                    @click="getPartList"
                    style="margin-left:80%;"
                    >{{ $t('search') }}</a-button
                >
            </p>
        </a-card>
        <a-card class="margin-y" style="margin:0 !important;">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                :showExportBtn="false"
                rowKey="id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getPartList"
                :scroll="{ y: 400 }"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                style="table-layout:fixed;"
            >
                <a-table-column
                    title="补发单号"
                    key="picking_name"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.picking_name }}</template>
                </a-table-column>
                <a-table-column
                    title="补发产品货号"
                    key="picking_default_code"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">{{
                        row.picking_default_code
                    }}</template>
                </a-table-column>
                <a-table-column
                    title="中文子类"
                    key="z_sub_category"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">{{
                        row.z_sub_category
                    }}</template>
                </a-table-column>
                <a-table-column
                    title="临时配件编号"
                    key="tmpl_default_code"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">{{
                        row.tmpl_default_code
                    }}</template>
                </a-table-column>
                <a-table-column
                    title="修正后编号"
                    key="default_code"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.default_code
                        }}<a-icon
                            type="edit"
                            @click="onConfirmEdit(row)"
                            style="color:#0cabb3;"
                        />
                    </template>
                </a-table-column>
                <a-table-column
                    title="编号状态"
                    key="state"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.state }}</template>
                </a-table-column>
                <a-table-column
                    title="补发客服"
                    key="create_uid"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">{{
                        userDict[row.create_uid]
                    }}</template>
                </a-table-column>

                <a-table-column
                    title="补发时间"
                    key="create_date"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">{{
                        row.create_date | datetolocal
                    }}</template>
                </a-table-column>
            </data-table>
        </a-card>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">关闭</a-button>
            <!-- <a-button type="primary" @click="onSubmit">提交</a-button> -->
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Ref, Watch } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import DataForm from '~/shared/components/data-form.vue'
import { PageService } from '../../bootstrap/services/page.service'
import { ProductService } from '../../services/product.service'
import { CommonService } from '@/shared/utils/common.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import moment from 'moment'
import router from '../../router'
import { Form } from 'ant-design-vue'
import EditPartDefaultCode from './edit-part-default-code.vue'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { ReportService } from '../../services/report.service'
import { formConfig } from '@/config/form.config'

@Component({
    components: {}
})
export default class ReissuePartNumberModify extends Vue {
    @Emit('modal.cancel')
    private cancel() {
        return
    }

    private form: any

    private pageService = new PageService()

    private productService = new ProductService()

    private publicService = new PublicService()
    private loadingService = new LoadingService()
    private innerAction = new InnerActionService()
    private reportService = new ReportService()

    private selectedRowKeys: any = []

    private data: any = []
    private userDict = {}
    private sonCates: any = []
    private selectedList: any = []

    @Prop()
    private systemUsers

    @Prop()
    private menuCode

    @Prop()
    private fatherCates

    @Prop()
    private cateDict

    private created() {
        this.form = this.$form.createForm(this)
    }

    private mounted() {
        if (this.systemUsers.length) {
            for (let i of this.systemUsers) {
                this.userDict[parseInt(i.code)] = i.name
            }
        }
    }

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }

    private getPartList() {
        this.selectedRowKeys = []

        this.form.validateFields({}, (err, values) => {
            if (!err) {
                if (this.selectedList.length > 0) {
                    values['z_sub_category'] = this.selectedList
                }
                let params: any = CommonService.createQueryCondition(values, {
                    picking_name: 'like',
                    default_code: 'like',
                    tmpl_default_code: 'like',
                    z_sub_category: 'in',
                    ...formConfig.condition
                })
                var nowConditions: any[] = []
                for (var item of params.query_condition) {
                    if (
                        item.value.constructor == Array &&
                        item.operate !== 'in'
                    ) {
                        if (
                            item.value.length == 2 &&
                            item.value[0].constructor.name == 'Moment'
                        ) {
                            let startDate: any = {}
                            for (let key in item.value[0]) {
                                startDate[key] = item.value[0][key]
                            }
                            nowConditions.push({
                                query_name: item.query_name,
                                operate: '>=',
                                value: new Date(startDate.utc())
                            })
                        }
                        if (
                            item.value.length == 2 &&
                            item.value[1].constructor.name == 'Moment'
                        ) {
                            let endDate: any = {}
                            for (let key in item.value[1]) {
                                endDate[key] = item.value[1][key]
                            }
                            nowConditions.push({
                                query_name: item.query_name,
                                operate: '<=',
                                value: new Date(endDate.utc())
                            })
                        }
                    } else {
                        nowConditions.push(item)
                    }
                }
                params.query_condition = nowConditions

                this.productService
                    .query_all_cs_tmp_product_part(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService
                        })
                    )
                    .subscribe(
                        data => {
                            this.data = data
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
        })
    }

    private onConfirmEdit(row) {
        let _that = this
        if (row.state == '已修正') {
            this.$confirm({
                title: this.$t('tip'),
                content: this.$t('tip_content'),
                onOk() {
                    _that.onEditCode(row)
                },
                onCancel() {}
            })
        } else {
            _that.onEditCode(row)
        }
    }

    private onEditCode(row) {
        let params: any = CommonService.createQueryCondition(
            { default_code: 'EZT-' + row.picking_default_code },
            {
                default_code: 'like'
            }
        )
        params['page_index'] = 1
        params['page_size'] = 1000
        this.productService
            .query_all_for_stock_pack_operation(
                new RequestParams(params, { loading: this.loadingService })
            )
            .subscribe(
                data => {
                    this.$modal
                        .open(
                            EditPartDefaultCode,
                            {
                                product_list: data.filter(
                                    x =>
                                        x.default_code.indexOf('TMPL-EZT') == -1
                                ),
                                row: row
                            },
                            {
                                title: '修正编号'
                            }
                        )
                        .subscribe(
                            data => {
                                this.$message.success('修改成功')
                                this.getPartList()
                            },
                            err => {
                                this.$message.error(err.message)
                            }
                        )
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private before_no_need_modify_sku() {
        for (let rowId of this.selectedRowKeys) {
            let curRow = this.data.find(X => X.id == rowId)
            if (!curRow) {
                this.$message.success('错误:请选择行')
                return
            }

            if (curRow.state != '未修正') {
                this.$message.success('只能设置状态为未修正的数据')
                return
            }
        }

        let _that = this
        this.$confirm({
            title: this.$t('tip'),
            content: this.$t('change_state_tip_content'),
            onOk() {
                _that.no_need_modify_sku(_that.selectedRowKeys)
            },
            onCancel() {}
        })
    }

    private no_need_modify_sku(curSelectedRows) {
        this.innerAction.setActionAPI(
            'product_management/set_cs_tmp_product_not_need_modify',
            this.menuCode
        )

        this.publicService
            .modify(
                new RequestParams(
                    {
                        cs_tmp_id_list: curSelectedRows
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    for (let rowId of this.selectedRowKeys) {
                        let curRow = this.data.find(X => X.id == rowId)

                        curRow.state = '无需修正'
                    }

                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                    return
                }
            )
    }

    private getCn_cate() {
        this.reportService.query_category_dict(new RequestParams()).subscribe(
            data => {
                this.cateDict = data[0]
                let cateData = data[0]
                for (let i in cateData) {
                    this.fatherCates.push(i)
                }
            },
            error => {
                this.$message.error(error.message)
            }
        )
    }
}
</script>

<i18n>
{
  "en-us":{
      "columns":{
       "manual_code":"Manual Code",
       "manual_version":"Manual Version",
       "seller_id":"Seller Name",    
       "actions":"Actions",
       "view":"View",
       "cn_category":"Category",
       "cn_sub_category":"Sub Category",
       "import_date":"Import Date"
    },
    "action": {
        "no_need_modify_sku":"No Need Modify SKU"
    },
    "tip": "Tip",
    "tip_content": "Are you sure to edit again?",
    "change_state_tip_content": "Are you sure to change state as no need modify?",
    "search": "Search"
  },
  "zh-cn":{
       "columns":{
       "manual_code":"说明书编号",
       "manual_version":"说明书版本",
       "time":"创建时间",
       "actions":"操作",
       "view":"查看",
       "cn_category":"分类",
       "cn_sub_category":"子类",
       "import_date":"导入日期"
    },
    "action": {
        "no_need_modify_sku":"无需修正"
    },
    "tip": "提示",
    "tip_content": "确定要再次修正吗？",
    "change_state_tip_content": "确认无需修正已选中的临时配件编号?",
    "search": "搜索"
  }
}
</i18n>
