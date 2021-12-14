<template>
    <page-container ref="pageContainer" @changeSearchState="showHideSearch">
        <!-- <template #header-action>
            <a-button type="primary" @click="onCreate">
                {{ $t('action.create') }}
            </a-button>
        </template> -->
        <data-form
            ref="dataForm"
            @submit="getSkuSaleList"
            :column="1"
            :showSearch="showSearch"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item label="sku" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['default_code']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.buyTime')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        v-decorator="[
                            'order_date',
                            {
                                rules: rules.required,
                                initialValue: [start_date, end_date]
                            }
                        ]"
                        size="small"
                        :style="{ width: '240px' }"
                    />
                    <a-radio-group
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onTimeChange(e)"
                    >
                        <a-radio-button value="one_month"
                            >{{ $t('near_one_month') }}
                        </a-radio-button>
                        <a-radio-button value="three_month"
                            >{{ $t('near_three_month') }}
                        </a-radio-button>
                        <a-radio-button value="half_year"
                            >{{ $t('near_half_year') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.operator')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['operator']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.department')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['department']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_category')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['z_category']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
            </template>
        </data-form>
        <a-card class="margin-y">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="default_code"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: (keys, selectedRows) => {
                        selectedRowKeys = keys
                        this.changeCharts(keys, selectedRows)
                    }
                }"
                @on-page-change="getSkuSaleList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                        getDetailSales(record)
                    }
                "
                :scroll="{ y: 160 }"
                @change="sorter => onTableChange(sorter)"
                style="table-layout:fixed;"
            >
                <a-table-column
                    title="sku"
                    data-index="default_code"
                    key="default_code"
                    width="6%"
                    align="left"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.order_qty')"
                    data-index="order_qty"
                    key="order_qty"
                    width="6%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.sales_qty')"
                    data-index="sales_qty"
                    key="sales_qty"
                    width="6%"
                    align="right"
                    :sorter="true"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.total_amount')"
                    data-index="total_amount"
                    key="total_amount"
                    width="6%"
                    align="right"
                ></a-table-column>

                <a-table-column
                    :title="$t('columns.presale_order_qty')"
                    data-index="presale_order_qty"
                    key="presale_order_qty"
                    width="6%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.presale_sales_qty')"
                    data-index="presale_sales_qty"
                    key="presale_sales_qty"
                    width="6%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.presale_total_amount')"
                    data-index="presale_total_amount"
                    key="presale_total_amount"
                    width="6%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.uk_order_qty')"
                    data-index="uk_order_qty"
                    key="uk_order_qty"
                    width="6%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.uk_sales_qty')"
                    data-index="uk_sales_qty"
                    key="uk_sales_qty"
                    width="6%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.uk_presale_order_qty')"
                    data-index="uk_presale_order_qty"
                    key="uk_presale_order_qty"
                    width="6%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.uk_presale_sales_qty')"
                    data-index="uk_presale_sales_qty"
                    key="uk_presale_sales_qty"
                    width="6%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.uk_total_amount')"
                    data-index="uk_total_amount"
                    key="uk_total_amount"
                    width="6%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.uk_total_tax')"
                    data-index="uk_total_tax"
                    key="uk_total_tax"
                    width="6%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.operator')"
                    data-index="operator"
                    key="operator"
                    width="6%"
                    align="left"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.department')"
                    data-index="department"
                    key="department"
                    width="6%"
                    align="left"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.z_category')"
                    data-index="z_category"
                    key="z_category"
                    width="6%"
                    align="left"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.z_sub_category')"
                    data-index="z_sub_category"
                    key="z_sub_category"
                    width="6%"
                    align="left"
                ></a-table-column>
            </data-table>
        </a-card>
        <a-card class="margin-y">
            <template>
                <section class="component customer-detail">
                    <a-tabs defaultActiveKey="base" v-model="activeKey">
                        <a-tab-pane :tab="$t('sku_sale_report')" key="base">
                            <ve-histogram
                                :data="chartData1"
                                :settings="chartSettings"
                            ></ve-histogram>
                        </a-tab-pane>
                        <a-tab-pane
                            :tab="$t('sku_sale_detail')"
                            key="detail_sales"
                        >
                            <a-table
                                :dataSource="chartData1.rows"
                                :page="pageService"
                                style="table-layout:fixed;"
                                rowKey="default_code"
                                bordered
                            >
                                <a-table-column
                                    :title="$t('columns.order_date')"
                                    data-index="order_date"
                                    key="order_date"
                                    width="7%"
                                    align="center"
                                ></a-table-column>
                                <a-table-column
                                    :title="$t('columns.order_qty')"
                                    data-index="order_qty"
                                    key="order_qty"
                                    width="7%"
                                    align="right"
                                ></a-table-column>
                                <a-table-column
                                    :title="$t('columns.sales_qty')"
                                    data-index="sales_qty"
                                    key="sales_qty"
                                    width="7%"
                                    align="right"
                                ></a-table-column>
                                <a-table-column
                                    :title="$t('columns.total_amount')"
                                    data-index="total_amount"
                                    key="total_amount"
                                    width="7%"
                                    align="right"
                                ></a-table-column>
                                <a-table-column
                                    :title="$t('columns.total_tax')"
                                    data-index="total_tax"
                                    key="total_tax"
                                    width="7%"
                                    align="right"
                                ></a-table-column>

                                <a-table-column
                                    :title="$t('columns.presale_order_qty')"
                                    data-index="presale_order_qty"
                                    key="presale_order_qty"
                                    width="6%"
                                    align="right"
                                ></a-table-column>
                                <a-table-column
                                    :title="$t('columns.presale_sales_qty')"
                                    data-index="presale_sales_qty"
                                    key="presale_sales_qty"
                                    width="6%"
                                    align="right"
                                ></a-table-column>
                                <a-table-column
                                    :title="$t('columns.presale_total_amount')"
                                    data-index="presale_total_amount"
                                    key="presale_total_amount"
                                    width="8%"
                                    align="right"
                                ></a-table-column>
                                <a-table-column
                                    :title="$t('columns.presale_total_tax')"
                                    data-index="presale_total_tax"
                                    key="presale_total_tax"
                                    width="6%"
                                    align="right"
                                ></a-table-column>
                                <a-table-column
                                    :title="$t('columns.uk_order_qty')"
                                    data-index="uk_order_qty"
                                    key="uk_order_qty"
                                    width="6%"
                                    align="right"
                                ></a-table-column>
                                <a-table-column
                                    :title="$t('columns.uk_sales_qty')"
                                    data-index="uk_sales_qty"
                                    key="uk_sales_qty"
                                    width="6%"
                                    align="right"
                                ></a-table-column>
                                <a-table-column
                                    :title="$t('columns.uk_presale_order_qty')"
                                    data-index="uk_presale_order_qty"
                                    key="uk_presale_order_qty"
                                    width="6%"
                                    align="right"
                                ></a-table-column>
                                <a-table-column
                                    :title="$t('columns.uk_presale_sales_qty')"
                                    data-index="uk_presale_sales_qty"
                                    key="uk_presale_sales_qty"
                                    width="6%"
                                    align="right"
                                ></a-table-column>
                                <a-table-column
                                    :title="$t('columns.uk_total_amount')"
                                    data-index="uk_total_amount"
                                    key="uk_total_amount"
                                    width="6%"
                                    align="right"
                                ></a-table-column>
                                <a-table-column
                                    :title="$t('columns.uk_total_tax')"
                                    data-index="uk_total_tax"
                                    key="uk_total_tax"
                                    width="6%"
                                    align="right"
                                ></a-table-column>
                            </a-table>
                        </a-tab-pane>
                    </a-tabs>
                </section>
            </template>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import router from '../../router'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { namespace } from 'vuex-class'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '@/shared/utils/common.service'
import { SkuSaleService } from '../../services/skusale.service'
import moment from 'moment'

@Page({
    layout: 'workspace',
    name: 'product-sku-sale'
})
@Component({
    components: {}
})
export default class ProductSkuSale extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private showSearch: any = true

    private showHideSearch(flag) {
        this.showSearch = flag
    }

    private yearPick = null

    private yearPickShow = false

    private activeKey: any = 'base'

    private start_date: any = ''

    private end_date: any = ''

    // 表格数据源
    private data: any[] = []
    // 表格选择项
    private selectedRowKeys: any[] = []

    private orderBy: any = ''

    private handleOpenChange(status) {
        this.yearPickShow = status
    }

    private SkuSaleService = new SkuSaleService()

    private rules = {
        required: [{ required: true }]
    }

    private chartSettings = {
        axisSite: { right: ['sales_qty'] },
        // yAxisType: ['KMB', 'percent'],
        yAxisName: ['销售金额', '销量']
    }

    private chartData1: any = {
        columns: ['order_date', 'total_amount', 'sales_qty'],
        rows: []
    }

    /**
     * 获取销售趋势数据
     */
    private getSkuSaleList() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                if (
                    values['order_date'][0].constructor.name != 'Moment' ||
                    values['order_date'][1].constructor.name != 'Moment'
                ) {
                    this.$message.error('请填写购买时间段')
                    return false
                }
                let params: any = CommonService.createQueryCondition(values, {
                    default_code: 'like'
                })
                var nowConditions: any[] = []
                for (var item of params.query_condition) {
                    if (item.value.constructor == Array) {
                        if (
                            item.value.length == 2 &&
                            item.value[0].constructor.name == 'Moment'
                        ) {
                            nowConditions.push({
                                query_name: item.query_name,
                                operate: '>=',
                                value: item.value[0]
                                    .format('YYYY-MM-DD 00:00:00')
                                    .toString()
                            })
                        }
                        if (
                            item.value.length == 2 &&
                            item.value[1].constructor.name == 'Moment'
                        ) {
                            nowConditions.push({
                                query_name: item.query_name,
                                operate: '<=',
                                value: item.value[1]
                                    .format('YYYY-MM-DD 23:59:59')
                                    .toString()
                            })
                        }
                    } else {
                        nowConditions.push(item)
                    }
                }
                params.query_condition = nowConditions
                if (this.orderBy) {
                    params['order_by'] = this.orderBy
                }

                this.SkuSaleService.query_sum_all(
                    new RequestParams(params, {
                        page: this.pageService,
                        loading: this.loadingService
                    })
                ).subscribe(
                    data => {
                        this.data = data
                        this.selectedRowKeys = []
                        this.start_date = values['order_date'][0]
                        this.end_date = values['order_date'][1]
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
            })
            .catch(err => {
                // 异常处理
            })
    }

    private onStatusChange(e) {
        this.$nextTick(function() {
            this.getSkuSaleList()
        })
    }

    private onTimeChange(e) {
        if (e.target.value == 'one_month') {
            this.start_date = moment().subtract(1, 'months')
        } else if (e.target.value == 'three_month') {
            this.start_date = moment().subtract(3, 'months')
        } else if (e.target.value == 'half_year') {
            this.start_date = moment().subtract(6, 'months')
        }
        this.end_date = moment()
        let values = this.dataForm.getValues()
        values['order_date'] = [this.start_date, this.end_date]
        var myFirstPromise = new Promise((resolve, reject) => {
            this.dataForm.setValues(values)
        })
        myFirstPromise
            .then(() => {
                this.getSkuSaleList
            })
            .catch()
    }

    private getDetailSales(default_code) {
        this.SkuSaleService.query_by_time(
            new RequestParams(
                {
                    default_code: default_code,
                    start_date: this.start_date
                        .format('YYYY-MM-DD 00:00:00')
                        .toString(),
                    end_date: this.end_date
                        .format('YYYY-MM-DD 23:59:59')
                        .toString()
                },
                { loading: this.loadingService }
            )
        ).subscribe(data => {
            data.sort((a, b) => {
                return a.order_date > b.order_date ? 1 : -1
            })
            this.chartData1.rows = data
        })
    }

    private changeCharts(selectedRowKeys, selectedRows) {
        this.getDetailSales(selectedRows[0].default_code)
    }

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getSkuSaleList()
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "",
        "columns": {
            "buyTime": "Buy Time",
            "order_qty": "Order_qty",
            "sales_qty": "Sales Qty",
            "total_amount": "Total Amount",
            "presale_order_qty": "Presale Order Qty",
            "presale_sales_qty": "Presale Sales Qty",
            "presale_total_amount": "Presale Total Amount",
            "uk_order_qty": "Uk Order Qty",
            "uk_sales_qty": "Uk Sales Qty",
            "uk_presale_order_qty": "Uk Presale Order Qty",
            "uk_presale_sales_qty": "Uk Presale Sales Qty",
            "uk_total_amount": "Uk Total Amount",
            "uk_total_tax": "Uk Total Tax",
            "order_date": "Order Date",
            "presale_total_tax": "Presale Total Tax",
            "total_tax": "Total Tax"
        },
        "action": {
        },
        "rules": {
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "sku_sale_report": "Sku Sale Report",
        "sku_sale_detail": "Sku Sale Detail",
        "near_one_month": "Near One Month",
        "near_three_month": "Near Three Month",
        "near_half_year": "Near Half Year"
    },
    "zh-cn": {
        "desc": "",
        "columns": {
            "buyTime": "购买时间",
            "order_qty": "订单量",
            "sales_qty": "销量",
            "total_amount": "销售金额",
            "presale_order_qty": "预售订单量",
            "presale_sales_qty": "预售销量",
            "presale_total_amount": "预售销售金额",
            "uk_order_qty": "英线订单量",
            "uk_sales_qty": "英线销量",
            "uk_presale_order_qty": "英线预售订单量",
            "uk_presale_sales_qty": "英线预售销量",
            "uk_total_amount": "英线销量额",
            "uk_total_tax": "英线销售税",
            "order_date": "订单日期",
            "presale_total_tax": "预售销售税",
            "total_tax": "销售税"
        },
        "action": {
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "sku_sale_report": "sku销量报表",
        "sku_sale_detail": "sku销量明细",
        "near_one_month": "近一个月",
        "near_three_month": "近三个月",
        "near_half_year": "近半年"
    }
}
</i18n>
