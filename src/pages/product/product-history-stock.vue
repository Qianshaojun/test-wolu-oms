<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form ref="dataForm" @submit="getProductHistoryStock" :column="2">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.z_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['z_category']"
                        style="width: 200px"
                        @change="handleFatherCateChange"
                        :placeholder="$t('columns.z_category')"
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
                        style="width: 30%;margin-left:5px"
                        :placeholder="$t('columns.z_sub_category')"
                        size="small"
                    >
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['default_code']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.import_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        v-decorator="['import_date']"
                        format="YYYY-MM-DD"
                        size="small"
                        :style="{ width: '200px' }"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.warehouse_name')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['warehouse_name', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px', width: '200px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value
                            >{{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="DE">DE</a-radio-button>
                        <a-radio-button value="UK">UK</a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </template>
            <template #action>
                <a-button type="primary" @click="export_product_history_stock()"
                    >{{ $t('action.export') }}
                </a-button>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important;">
            <data-table
                :stripe="true"
                :data="historyStockData"
                :page="pageService"
                rowKey="id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getProductHistoryStock"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                @change="sorter => onTableChange(sorter)"
                :scroll="{ y: 600, x: 800 }"
                style="table-layout:fixed;"
            >
                <a-table-column
                    :title="$t('columns.import_date')"
                    key="import_date"
                    width="6%"
                    align="center"
                >
                    <template slot-scope="row">
                        <span> {{ row.import_date }} </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.default_code')"
                    key="default_code"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        <span> {{ row.default_code }} </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.name')"
                    key="name"
                    width="58%"
                    align="left"
                >
                    <template slot-scope="row">
                        <span>
                            {{
                                row.name
                                    ? row.name.length > 90
                                        ? row.name.substr(0, 87) + '...'
                                        : row.name
                                    : ''
                            }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.quantity')"
                    key="quantity"
                    width="6%"
                    align="right"
                    :sorter="true"
                >
                    <template slot-scope="row">
                        <span> {{ row.quantity }} </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.eu_price_unit')"
                    key="eu_price_unit"
                    width="5%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span> {{ row.eu_price_unit || 0.0 }} </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.us_price_unit')"
                    key="us_price_unit"
                    width="5%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span> {{ row.us_price_unit || 0.0 }} </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.eu_total')"
                    key="eu_total"
                    width="5%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span> {{ row.eu_total || 0.0 }} </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.warehouse_name')"
                    key="warehouse_name"
                    width="5%"
                    align="center"
                >
                    <template slot-scope="row">
                        <span> {{ row.warehouse_name }} </span>
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { SellerInstanceService } from '~/services/seller-instance.service'
import { UserService } from '~/services/user.service'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { CompanyService } from '~/services/company.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import moment from 'moment'
import { ProductService } from '../../services/product.service'
import { ReportService } from '../../services/report.service'
import appConfig from '../../config/app.config'

const userModule = namespace('userModule')
const allUsersModule = namespace('allUsersModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'product-history-stock'
})
@Component({
    components: {}
})
export default class ProductHistoryStock extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private productService = new ProductService()
    private reportService = new ReportService()

    private orderBy: any = ''

    private selectedRows: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []

    // 表格数据源
    private historyStockData: any[] = []

    public created() {
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

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }

    public getProductHistoryStock() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                if (
                    values['z_category'] != '' &&
                    values['z_sub_category'] != ''
                ) {
                    delete values['z_category']
                }

                let params: any = CommonService.createQueryCondition(values, {
                    default_code: 'like',
                    z_sub_category: 'like'
                })

                if (this.orderBy) {
                    params['order_by'] = this.orderBy
                }

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
                                value: item.value[0].format('YYYY-MM-DD')
                            })
                        }
                        if (
                            item.value.length == 2 &&
                            item.value[1].constructor.name == 'Moment'
                        ) {
                            nowConditions.push({
                                query_name: item.query_name,
                                operate: '<=',
                                value: item.value[1].format('YYYY-MM-DD')
                            })
                        }
                    } else {
                        nowConditions.push(item)
                    }
                }
                params.query_condition = nowConditions

                this.productService
                    .queryProductHistoryStock(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService
                        })
                    )
                    .subscribe(
                        data => {
                            this.historyStockData = data
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
            .catch(err => {
                this.$message.error(err.message)
            })
    }

    private export_product_history_stock() {
        this.dataForm.validateFields().then((values: any) => {
            if (values['z_category'] != '' && values['z_sub_category'] != '') {
                delete values['z_category']
            }

            let params: any = CommonService.createQueryCondition(values, {
                default_code: 'like',
                z_sub_category: 'like'
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
                            value: item.value[0].format('YYYY-MM-DD')
                        })
                    }
                    if (
                        item.value.length == 2 &&
                        item.value[1].constructor.name == 'Moment'
                    ) {
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '<=',
                            value: item.value[1].format('YYYY-MM-DD')
                        })
                    }
                } else {
                    nowConditions.push(item)
                }
            }

            if (nowConditions.length == 0) {
                this.$confirm({
                    title:
                        'Do you want to export all data? It will take a long time to download.',
                    content:
                        'When clicked the Cancel button, the process will stop.',
                    onOk() {
                        let urlParams = encodeURIComponent(
                            JSON.stringify(nowConditions)
                        )
                        window.open(
                            appConfig.server +
                                '/product/export_product_history_stock?query_condition=' +
                                urlParams
                        )
                    },
                    onCancel() {}
                })
            } else {
                let urlParams = encodeURIComponent(
                    JSON.stringify(nowConditions)
                )
                window.open(
                    appConfig.server +
                        '/product/export_product_history_stock?query_condition=' +
                        urlParams
                )
            }
        })
    }

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getProductHistoryStock()
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private moment = moment

    private initialDate: any = []
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "us_price_unit": "Unit Price($)",
            "eu_price_unit": "Unit Price(€)",
            "eu_total": "Total Price",
            "quantity": "QTY",
            "default_code": "SKU",
            "name": "Product Name",
            "import_date": "Date",
            "warehouse_name": "Warehouse",
            "z_sub_category": "Sub Category",
            "z_category": "Category"
        },
        "action": {
            "create": "Create",
            "export": "Export"
        },
        "forms": {
            "quick_search": "Quick Search",
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search",
            "operator_list": "Multi Search"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "cancel": "Are you sure cancel?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "columns": {
            "us_price_unit": "单价($)",
            "eu_price_unit": "单价(€)",
            "eu_total": "总价",
            "quantity": "数量",
            "default_code": "SKU",
            "name": "产品名称",
            "import_date": "日期",
            "warehouse_name": "仓库",
            "z_sub_category": "子类",
            "z_category": "品类"
        },
        "action": {
            "create": "新建",
            "export": "导出"
        },
        "forms": {
            "quick_search": "快速查找",
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量查询"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功"
    }
}
</i18n>
