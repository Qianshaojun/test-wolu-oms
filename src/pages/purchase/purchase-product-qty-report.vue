<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <data-form ref="dataForm" @submit="getDetailList" :column="2">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.default_code')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['default_code']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.prod_status')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['prod_status']"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Select Type"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option value="sale" key="sale"
                            >{{ $t('columns.prod_status_sale') }}
                        </a-select-option>
                        <a-select-option value="stop" key="stop"
                            >{{ $t('columns.prod_status_stop') }}
                        </a-select-option>
                        <a-select-option value="waiting" key="waiting"
                            >{{ $t('columns.prod_status_waiting') }}
                        </a-select-option>
                        <a-select-option value="sz_prod" key="sz_prod"
                            >{{ $t('columns.prod_status_sz_prod') }}
                        </a-select-option>
                        <a-select-option value="uk_sale" key="uk_sale"
                            >{{ $t('columns.prod_status_uk_sale') }}
                        </a-select-option>
                        <a-select-option value="tort_stop" key="tort_stop"
                            >{{ $t('columns.prod_status_tort_stop') }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.cn_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['z_category']"
                        style="width: 110px"
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
                        v-model="selectedList"
                        mode="multiple"
                        style="width: 220px;margin-left:25px"
                        placeholder="子类"
                        size="small"
                    >
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <template #action>
                <a-button type="primary" @click="exportData">Export</a-button>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex">
            <AutoColumnTable
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getDetailList"
                :columns="columnList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                style="table-layout:fixed;"
                :scroll="{ x: 1750, y: 600 }"
            >
                <template slot="prod_status_render" slot-scope="row">
                    <span v-if="row.prod_status == 'sale'">{{
                        $t('columns.prod_status_sale')
                    }}</span>
                    <span v-else-if="row.prod_status == 'stop'">{{
                        $t('columns.prod_status_stop')
                    }}</span>
                    <span v-else-if="row.prod_status == 'waiting'">{{
                        $t('columns.prod_status_waiting')
                    }}</span>
                    <span v-else-if="row.prod_status == 'sz_prod'">{{
                        $t('columns.prod_status_sz_prod')
                    }}</span>
                    <span v-else-if="row.prod_status == 'uk_sale'">{{
                        $t('columns.prod_status_uk_sale')
                    }}</span>
                    <span v-else-if="row.prod_status == 'tort_stop'">{{
                        $t('columns.prod_status_tort_stop')
                    }}</span>
                </template>
            </AutoColumnTable>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { namespace } from 'vuex-class'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '@/shared/utils/common.service'
import { ReportService } from '@/services/report.service'
import { PurchaseService } from '../../services/purchase.service'
import AutoColumnTable from '../../shared/components/auto-column-table.vue'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'purchase-product-qty-report'
})
@Component({
    components: {
        AutoColumnTable
    }
})
export default class PurchaseProdQtyReport extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private reportService = new ReportService()
    private purchaseService = new PurchaseService()

    // 表格选择项
    private selectedRowKeys: any[] = []

    private columnList: any[] = []
    private data: any[] = []

    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []

    private created() {
        this.columnList = this.getBasicColumnInfo()
        this.getCn_cate()
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

    private getBasicColumnInfo() {
        return [
            {
                dataIndex: 'default_code',
                key: 'default_code',
                title: this.$t('columns.default_code'),
                width: 100,
                align: 'left'
            },
            {
                key: 'prod_status',
                title: this.$t('columns.prod_status'),
                width: 80,
                align: 'center',
                scopedSlots: { customRender: 'prod_status_render' }
            },
            {
                dataIndex: 'z_category',
                key: 'z_category',
                title: this.$t('columns.cn_category'),
                width: 80,
                align: 'left'
            },
            {
                dataIndex: 'z_sub_category',
                key: 'z_sub_category',
                title: this.$t('columns.cn_sub_category'),
                width: 110,
                align: 'left'
            },
            {
                dataIndex: 'department',
                key: 'department',
                title: this.$t('columns.department'),
                width: 80,
                align: 'left'
            },
            {
                dataIndex: 'operator',
                key: 'operator',
                title: this.$t('columns.operator'),
                width: 80,
                align: 'center'
            },
            {
                dataIndex: 'stock_de_available_qty',
                key: 'stock_de_available_qty',
                title: this.$t('columns.stock_de_available_qty'),
                width: 80,
                align: 'right'
            },
            {
                dataIndex: 'stock_uk_available_qty',
                key: 'stock_uk_available_qty',
                title: this.$t('columns.stock_uk_available_qty'),
                width: 80,
                align: 'right'
            },
            {
                dataIndex: 'stock_available_qty',
                key: 'stock_available_qty',
                title: this.$t('columns.stock_available_qty'),
                width: 80,
                align: 'right'
            },
            {
                dataIndex: 'de_cur_month',
                key: 'de_cur_month',
                title: this.$t('columns.de_cur_month'),
                width: 80,
                align: 'right'
            },
            {
                dataIndex: 'de_next_month',
                key: 'de_next_month',
                title: this.$t('columns.de_next_month'),
                width: 80,
                align: 'right'
            },
            {
                dataIndex: 'de_third_month',
                key: 'de_third_month',
                title: this.$t('columns.de_third_month'),
                width: 90,
                align: 'right'
            },
            {
                dataIndex: 'uk_cur_month',
                key: 'uk_cur_month',
                title: this.$t('columns.uk_cur_month'),
                width: 80,
                align: 'right'
            },
            {
                dataIndex: 'uk_next_month',
                key: 'uk_next_month',
                title: this.$t('columns.uk_next_month'),
                width: 80,
                align: 'right'
            },
            {
                dataIndex: 'uk_third_month',
                key: 'uk_third_month',
                title: this.$t('columns.uk_third_month'),
                width: 90,
                align: 'right'
            },
            {
                dataIndex: 'cur_month',
                key: 'cur_month',
                title: this.$t('columns.cur_month'),
                width: 80,
                align: 'right'
            },
            {
                dataIndex: 'next_month',
                key: 'next_month',
                title: this.$t('columns.next_month'),
                width: 80,
                align: 'right'
            },
            {
                dataIndex: 'third_month',
                key: 'third_month',
                title: this.$t('columns.third_month'),
                width: 80,
                align: 'right'
            },
            {
                dataIndex: 'de_product_qty',
                key: 'de_product_qty',
                title: this.$t('columns.de_product_qty'),
                width: 80,
                align: 'right'
            },
            {
                dataIndex: 'uk_product_qty',
                key: 'uk_product_qty',
                title: this.$t('columns.uk_product_qty'),
                width: 80,
                align: 'right'
            },
            {
                dataIndex: 'product_qty',
                key: 'product_qty',
                title: this.$t('columns.product_qty'),
                width: 80,
                align: 'right'
            },
            {
                dataIndex: 'total',
                key: 'total',
                title: this.$t('columns.total'),
                width: 80,
                align: 'right'
            }
        ]
    }

    private getQueryCondition() {
        return new Promise((reslove, reject) => {
            this.dataForm
                .validateFields()
                .then((values: any) => {
                    if (this.selectedList.length > 0) {
                        values['z_sub_category'] = this.selectedList
                    }

                    let params: any = CommonService.createQueryCondition(
                        values,
                        {
                            default_code: 'like',
                            z_sub_category: 'in'
                        }
                    )

                    reslove(params)
                })
                .catch(err => {
                    // 异常处理
                })
        })
    }

    private getDetailList() {
        this.getQueryCondition().then((params: any) => {
            this.purchaseService
                .query_all_purchase_prod_qty_info(
                    new RequestParams(params, {
                        page: this.pageService,
                        loading: this.loadingService
                    })
                )
                .subscribe(
                    data => {
                        this.data = data.map((x, i) => {
                            x['id'] = i + 1
                            x['stock_available_qty'] =
                                x.stock_de_available_qty +
                                x.stock_uk_available_qty
                            x['total'] =
                                x.product_qty +
                                x.cur_month +
                                x.next_month +
                                x.third_month +
                                x.stock_available_qty
                            return x
                        })
                        this.selectedRowKeys = []
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }

    private exportData() {
        this.getQueryCondition().then((x: any) => {
            CommonService.exportData(
                '/purchase_requirement/export_purchase_prod_qty_info',
                { query_condition: x.query_condition }
            )
        })
    }
}
</script>
<i18n>
{
    "en-us": {
        "desc": "Purchase Reduce Cost",
        "columns": {
            "cn_category": "CN Category",
            "cn_sub_category": "CN Sub Category",
            "cur_month": "Current Month",
            "de_cur_month": "De Current Month",
            "de_next_month": "De Next Month",
            "de_product_qty": "De Product Qty",
            "de_third_month": "De Third Month",
            "default_code": "Default Code",
            "department": "Department",
            "next_month": "Next Month",
            "operator": "Operator",
            "product_qty": "Product Qty",
            "stock_de_available_qty": "Stock De Available Qty",
            "stock_uk_available_qty": "Stock Uk Available Qty",
            "third_month": "Third Month",
            "uk_cur_month": "Uk Current Month",
            "uk_next_month": "Uk Next Month",
            "uk_product_qty": "Uk Product Qty",
            "uk_third_month": "Uk Third Month",
            "total": "Total",
            "stock_available_qty": "Stock Available Qty",
            "prod_status": "Prod Status",
            "prod_status_sale": "Sale",
            "prod_status_stop": "Stop",
            "prod_status_waiting": "Waiting",
            "prod_status_sz_prod": "SZ Prod",
            "prod_status_uk_sale": "UK Sale",
            "prod_status_tort_stop": "Tort Stop"
        },
        "action": {
            "create": "新建",
            "more": "更多操作"
        },
        "rules": {
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success"
    },
    "zh-cn": {
        "desc": "货柜信息",
        "columns": {
            "vendor_name": "供应商",
            "cn_category": "中文分类",
            "cn_sub_category": "中文子类",
            "default_code": "基础货号",
            "cur_month": "本月在途数量",
            "de_cur_month": "本月德仓在途数量",
            "de_next_month": "次月德仓在途数量",
            "de_product_qty": "德仓在厂数量",
            "de_third_month": "第三月德仓在途数量",
            "department": "部门",
            "next_month": "次月在途数量",
            "operator": "运营",
            "product_qty": "在厂数量",
            "stock_de_available_qty": "德线在仓数量",
            "stock_uk_available_qty": "英线在仓数量",
            "third_month": "第三月在途数量",
            "uk_cur_month": "本月英仓在途数量",
            "uk_next_month": "次月英仓在途数量",
            "uk_product_qty": "英仓在厂数量",
            "uk_third_month": "第三月英仓在途数量",
            "total": "总计",
            "stock_available_qty": "在仓数量",
            "prod_status": "产品状态",
            "prod_status_sale": "正常在售",
            "prod_status_stop": "淘汰停售",
            "prod_status_waiting": "待观察",
            "prod_status_sz_prod": "深圳产品",
            "prod_status_uk_sale": "UK正常在售",
            "prod_status_tort_stop": "侵权停售"
        },
        "action": {
            "create": "新建",
            "more": "更多操作"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功"
    }
}
</i18n>
