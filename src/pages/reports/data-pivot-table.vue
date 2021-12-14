<template>
    <page-container ref="pageContainer">
        <data-form ref="dataForm" @submit="getdata" :column="1">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.shop_type')"
                    style="height:35px;margin:0;"
                    required
                >
                    <a-radio-group
                        v-decorator="['shop_type', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item"
                            v-for="item of shopType"
                            :key="item"
                            >{{ item }}</a-radio-button
                        >
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.order_date')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['order_date']"
                        mode="multiple"
                        style="width: 100%"
                        placeholder="Please select"
                    >
                        <a-select-option
                            v-for="order_date of order_date_list"
                            :key="order_date"
                            :value="order_date"
                        >
                            {{ order_date }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.cn_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['cn_category']"
                        :default-value="fatherCates[0]"
                        style="width: 120px"
                        @change="handleFatherCateChange"
                        placeholder="category"
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
                        style="width: 80%;margin-left:25px"
                        placeholder="sub category"
                    >
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <template #action>
                <a-button type="primary" @click="createProfitReport">
                    {{ $t('action.create_excel_profit_file') }}
                </a-button>
                <a-button type="primary" @click="downloadProfitReport">
                    {{ $t('action.download_excel_profit_file') }}
                </a-button>
            </template>
        </data-form>
        <a-card>
            <WebDataRocks v-if="isShow" :report="report" toolbar></WebDataRocks>
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
import { ReportService } from '../../services/report.service'
import moment from 'moment'
import zhjson from '../../../src/assets/json/zh.json'
import WebDataRocks from '~/components/common/WebDataRocks.vue'
import appConfig from '../../config/app.config'

@Page({
    layout: 'workspace',
    name: 'profit-pivot'
})
@Component({
    components: {
        WebDataRocks
    }
})
export default class DataPivotTable extends Vue {
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

    private shopType: any = [
        'B2C',
        'Amazon',
        'Ebay',
        'Wish',
        'Cdiscount',
        'Aliexpress'
    ]

    private isShow: Boolean = true

    private rules = {
        required: [{ required: true }]
    }

    private cn_sub_category_list: any = []
    private selectedList: any = []

    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}

    private report: any = {
        dataSource: {
            dataSourceType: 'json',
            data: []
        },
        localization: zhjson,
        slice: {
            rows: [
                {
                    uniqueName: '子类'
                },
                {
                    uniqueName: 'SKU'
                },
                {
                    uniqueName: '订单日期'
                },
                {
                    uniqueName: '国家'
                },
                {
                    uniqueName: '订单类型'
                }
            ],
            columns: [
                {
                    uniqueName: 'Measures'
                }
            ],
            measures: [
                {
                    uniqueName: '销售数量',
                    aggregation: 'sum'
                },
                {
                    uniqueName: '销售额',
                    aggregation: 'sum'
                },
                {
                    uniqueName: '税费',
                    aggregation: 'sum'
                },
                {
                    uniqueName: '平台费',
                    aggregation: 'sum'
                },
                {
                    uniqueName: '产品成本',
                    aggregation: 'sum'
                },
                {
                    uniqueName: '成本占比',
                    aggregation: 'average',
                    format: 'product_price_percent'
                },
                {
                    uniqueName: '退款',
                    aggregation: 'sum'
                },
                {
                    uniqueName: '退款占比',
                    aggregation: 'average',
                    format: 'refund_percent'
                },
                {
                    uniqueName: '运费',
                    aggregation: 'sum'
                },
                {
                    uniqueName: '运费占比',
                    aggregation: 'average',
                    format: 'shipment_fee_percent'
                },
                {
                    uniqueName: '毛利',
                    aggregation: 'sum'
                },
                {
                    uniqueName: '毛利率',
                    aggregation: 'average',
                    format: 'profit_percent'
                },
                {
                    uniqueName: '产品销售单价',
                    aggregation: 'average'
                },
                {
                    uniqueName: '产品最低价',
                    aggregation: 'average'
                },
                {
                    uniqueName: '单品理论运费',
                    aggregation: 'average'
                },
                {
                    uniqueName: '单品实际运费',
                    aggregation: 'average'
                }
            ]
        },
        options: {
            grid: {
                type: 'classic',
                showTotals: 'columns',
                showGrandTotals: 'off'
            }
        },
        formats: [
            {
                name: '',
                thousandsSeparator: ' ',
                decimalSeparator: '.',
                decimalPlaces: 2,
                currencySymbol: '',
                currencySymbolAlign: 'left',
                nullValue: '',
                textAlign: 'right',
                isPercent: false
            },
            {
                name: 'product_price_percent',
                thousandsSeparator: ' ',
                decimalSeparator: '.',
                decimalPlaces: 2,
                currencySymbol: '',
                currencySymbolAlign: 'left',
                nullValue: '',
                textAlign: 'right',
                isPercent: true
            },
            {
                name: 'refund_percent',
                thousandsSeparator: ' ',
                decimalSeparator: '.',
                decimalPlaces: 2,
                currencySymbol: '',
                currencySymbolAlign: 'left',
                nullValue: '',
                textAlign: 'right',
                isPercent: true
            },
            {
                name: 'shipment_fee_percent',
                thousandsSeparator: ' ',
                decimalSeparator: '.',
                decimalPlaces: 2,
                currencySymbol: '',
                currencySymbolAlign: 'left',
                nullValue: '',
                textAlign: 'right',
                isPercent: true
            },
            {
                name: 'profit_percent',
                thousandsSeparator: ' ',
                decimalSeparator: '.',
                decimalPlaces: 2,
                currencySymbol: '',
                currencySymbolAlign: 'left',
                nullValue: '',
                textAlign: 'right',
                isPercent: true
            }
        ]
    }

    private created() {
        this.getCn_cate()
        this.getOrderDateList()
    }

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
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

    private order_date_list: any = []

    private getOrderDateList() {
        this.reportService.query_order_date_list(new RequestParams()).subscribe(
            data => {
                this.order_date_list = data
            },
            error => {
                this.$message.error(error.message)
            }
        )
    }

    private url_pre = appConfig.server

    private createProfitReport() {
        let url = appConfig.server + '/report/create_excel_profit_file'
        window.open(url)
    }

    private downloadProfitReport() {
        let url = appConfig.server + '/report/download_excel_profit_file'
        window.open(url)
    }

    private getdata() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                // if (!values['shop_type'] || values['shop_type'].length == 0) {
                //     this.$message.error('请选择平台')
                //     return false
                // }
                if (this.selectedList.length > 0) {
                    values['cn_sub_category'] = this.selectedList
                }
                let params: any = CommonService.createQueryCondition(values, {
                    shop_type: 'like',
                    cn_sub_category: 'in',
                    order_date: 'in'
                })

                var nowConditions: any[] = []
                for (var item of params.query_condition) {
                    nowConditions.push(item)
                }
                params.query_condition = nowConditions
                this.reportService
                    .query_all_profit_data(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService
                        })
                    )
                    .subscribe(
                        data => {
                            this.report.dataSource.data = data
                            this.isShow = false
                            this.$nextTick(() => (this.isShow = true))
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
            .catch(err => {
                this.$message.error('请检查查询条件')
            })
    }
}
</script>

<i18n>
{
    "en-us": {
        "columns":{
            "shop_type":"platform",
            "cn_sub_category":"cn sub category",
            "order_date":"Order Date"
        }, 
        "action":{
            "create_excel_profit_file":"Create Profit Excel Report",
            "download_excel_profit_file":"Download Profit Excel Report"
        }
    },
    "zh-cn": {
        "columns":{
            "shop_type":"平台",
            "cn_sub_category":"中文子类",
            "order_date":"订单日期"
        }, 
        "action":{
            "downloadZip":"批量下载",
            "delete":"删除",
            "detail":"详情",
            "create_excel_profit_file":"生成毛利报告Excel",
            "download_excel_profit_file":"下载毛利报告Excel"
        } 
    }
}
</i18n>
