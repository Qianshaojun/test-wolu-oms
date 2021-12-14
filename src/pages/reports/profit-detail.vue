<template>
    <page-container ref="pageContainer">
        <data-form ref="dataForm" @submit="getCategoryProfit" :column="1">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.shop_type')"
                    style="height:35px;margin:0;"
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
                            >{{ item }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.country')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['country']"
                        mode="multiple"
                        style="width: 28%"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option
                            v-for="country of countryList"
                            :key="country"
                            :value="country"
                        >
                            {{ country }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.order_date')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['order_date']"
                        mode="multiple"
                        style="width: 28%"
                        size="small"
                        :placeholder="$t('plzSelect')"
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
                        style="width: 120px"
                        @change="handleFatherCateChange"
                        size="small"
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
                        style="width: 40%;margin-left:25px"
                        placeholder="sub category"
                        size="small"
                    >
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <template #action>
                <span style="margin-left:50px;color:black">{{
                    $t('abnormal_price')
                }}</span>
                <a-switch v-model="price_switch" @change="priceOnChange" />
                <span style="margin-left:50px">{{
                    $t('abnormal_shipping')
                }}</span>
                <a-switch v-model="fee_switch" @change="feeOnChange" />
                <JsonExcel
                    class="export-excel-wrapper"
                    :data="dataDetail"
                    :fields="json_fields_sku"
                    name="sku毛利导出明细.xls"
                >
                    <a-button type="primary" :disabled="!dataDetail.length"
                        >{{ $t('export_excel_detail') }}
                    </a-button>
                </JsonExcel>
                <JsonExcel
                    class="export-excel-wrapper"
                    :data="selectedRows"
                    :fields="json_fields_cate"
                    name="品类毛利导出明细.xls"
                >
                    <a-button type="primary" :disabled="!selectedRows.length"
                        >{{ $t('export_excel_cate') }}
                    </a-button>
                </JsonExcel>
            </template>
        </data-form>
        <a-card class="margin-y">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: (keys, select_rows) => {
                        selectedRows = select_rows
                        selectedRowKeys = keys
                    }
                }"
                @on-page-change="getCategoryProfit"
                @onClick="
                    record => {
                        this.selectCategory(record)
                    }
                "
                :scroll="{ y: 160 }"
                style="table-layout:fixed;"
            >
                <a-table-column
                    :title="$t('columns.cn_sub_category')"
                    data-index="cn_sub_category"
                    key="cn_sub_category"
                    align="left"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.bp_sale_num')"
                    data-index="bp_sale_num"
                    key="bp_sale_num"
                    align="right"
                    :sorter="
                        (a, b) => {
                            return a.bp_sale_num - b.bp_sale_num
                        }
                    "
                >
                    <template slot-scope="bp_sale_num"
                        >{{ bp_sale_num | datatofixed(2) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.price_subtotal')"
                    data-index="price_subtotal"
                    key="price_subtotal"
                    align="right"
                    :sorter="
                        (a, b) => {
                            return a.price_subtotal - b.price_subtotal
                        }
                    "
                >
                    <template slot-scope="price_subtotal"
                        >{{ price_subtotal | datatofixed(2) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.product_price_total')"
                    data-index="product_price_total"
                    key="product_price_total"
                    align="right"
                    :sorter="
                        (a, b) => {
                            return a.product_price_total - b.product_price_total
                        }
                    "
                >
                    <template slot-scope="product_price_total"
                        >{{ product_price_total | datatofixed(2) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.product_price_percent')"
                    data-index="product_price_percent"
                    key="product_price_percent"
                    align="right"
                    :sorter="
                        (a, b) => {
                            return (
                                a.product_price_percent -
                                b.product_price_percent
                            )
                        }
                    "
                >
                    <template slot-scope="product_price_percent"
                        >{{ product_price_percent | toPercent }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.profit')"
                    data-index="profit"
                    key="profit"
                    align="right"
                    :sorter="
                        (a, b) => {
                            return a.profit - b.profit
                        }
                    "
                >
                    <template slot-scope="profit"
                        >{{ profit | datatofixed(2) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.profit_percent')"
                    data-index="profit_percent"
                    key="profit_percent"
                    align="right"
                    :sorter="
                        (a, b) => {
                            return a.profit_percent - b.profit_percent
                        }
                    "
                >
                    <template slot-scope="profit_percent"
                        >{{ profit_percent | toPercent }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.refund')"
                    data-index="refund"
                    key="refund"
                    align="right"
                    :sorter="
                        (a, b) => {
                            return a.refund - b.refund
                        }
                    "
                >
                    <template slot-scope="refund"
                        >{{ refund | datatofixed(2) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.refund_percent')"
                    data-index="refund_percent"
                    key="refund_percent"
                    align="right"
                    :sorter="
                        (a, b) => {
                            return a.refund_percent - b.refund_percent
                        }
                    "
                >
                    <template slot-scope="refund_percent"
                        >{{ refund_percent | toPercent }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.shipment_fee')"
                    data-index="shipment_fee"
                    key="shipment_fee"
                    align="right"
                    :sorter="
                        (a, b) => {
                            return a.shipment_fee - b.shipment_fee
                        }
                    "
                >
                    <template slot-scope="shipment_fee"
                        >{{ shipment_fee | datatofixed(2) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.shipment_fee_percent')"
                    data-index="shipment_fee_percent"
                    key="shipment_fee_percent"
                    align="right"
                    :sorter="
                        (a, b) => {
                            return (
                                a.shipment_fee_percent - b.shipment_fee_percent
                            )
                        }
                    "
                >
                    <template slot-scope="shipment_fee_percent"
                        >{{ shipment_fee_percent | toPercent }}
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
        <a-card class="margin-y">
            <template>
                <section class="component customer-detail">
                    <data-table
                        :data="dataDetail"
                        style="table-layout:fixed;"
                        rowKey="id"
                        @on-page-change="getDetailData"
                        :stripe="true"
                        :scroll="{ y: 500 }"
                    >
                        <a-table-column
                            :title="$t('columns.sku')"
                            data-index="sku"
                            key="sku"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.cn_sub_category')"
                            data-index="cn_sub_category"
                            key="cn_sub_category"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.bp_sale_num')"
                            data-index="bp_sale_num"
                            key="bp_sale_num"
                            align="right"
                            :sorter="
                                (a, b) => {
                                    return a.bp_sale_num - b.bp_sale_num
                                }
                            "
                        >
                            <template slot-scope="bp_sale_num"
                                >{{ bp_sale_num | datatofixed(2) }}
                            </template>
                        </a-table-column>
                        <a-table-column
                            :title="$t('columns.price_subtotal')"
                            data-index="price_subtotal"
                            key="price_subtotal"
                            align="right"
                            :sorter="
                                (a, b) => {
                                    return a.price_subtotal - b.price_subtotal
                                }
                            "
                        >
                            <template slot-scope="price_subtotal"
                                >{{ price_subtotal | datatofixed(2) }}
                            </template>
                        </a-table-column>
                        <a-table-column
                            :title="$t('columns.product_price_total')"
                            data-index="product_price_total"
                            key="product_price_total"
                            align="right"
                            :sorter="
                                (a, b) => {
                                    return (
                                        a.product_price_total -
                                        b.product_price_total
                                    )
                                }
                            "
                        >
                            <template slot-scope="product_price_total"
                                >{{ product_price_total | datatofixed(2) }}
                            </template>
                        </a-table-column>
                        <a-table-column
                            :title="$t('columns.product_price_percent')"
                            data-index="product_price_percent"
                            key="product_price_percent"
                            align="right"
                            :sorter="
                                (a, b) => {
                                    return (
                                        a.product_price_percent -
                                        b.product_price_percent
                                    )
                                }
                            "
                        >
                            <template slot-scope="product_price_percent"
                                >{{ product_price_percent | toPercent }}
                            </template>
                        </a-table-column>
                        <a-table-column
                            :title="$t('columns.profit')"
                            data-index="profit"
                            key="profit"
                            align="right"
                            :sorter="
                                (a, b) => {
                                    return a.profit - b.profit
                                }
                            "
                        >
                            <template slot-scope="profit"
                                >{{ profit | datatofixed(2) }}
                            </template>
                        </a-table-column>
                        <a-table-column
                            :title="$t('columns.profit_percent')"
                            data-index="profit_percent"
                            key="profit_percent"
                            align="right"
                            :sorter="
                                (a, b) => {
                                    return a.profit_percent - b.profit_percent
                                }
                            "
                        >
                            <template slot-scope="profit_percent"
                                >{{ profit_percent | toPercent }}
                            </template>
                        </a-table-column>
                        <a-table-column
                            :title="$t('columns.refund')"
                            data-index="refund"
                            key="refund"
                            align="right"
                            :sorter="
                                (a, b) => {
                                    return a.refund - b.refund
                                }
                            "
                        >
                            <template slot-scope="refund"
                                >{{ refund | datatofixed(2) }}
                            </template>
                        </a-table-column>
                        <a-table-column
                            :title="$t('columns.refund_percent')"
                            data-index="refund_percent"
                            key="refund_percent"
                            align="right"
                            :sorter="
                                (a, b) => {
                                    return a.refund_percent - b.refund_percent
                                }
                            "
                        >
                            <template slot-scope="refund_percent"
                                >{{ refund_percent | toPercent }}
                            </template>
                        </a-table-column>
                        <a-table-column
                            :title="$t('columns.normal_product_price')"
                            data-index="normal_product_price"
                            key="normal_product_price"
                            align="right"
                            :sorter="
                                (a, b) => {
                                    return (
                                        a.normal_product_price -
                                        b.normal_product_price
                                    )
                                }
                            "
                        >
                            <template slot-scope="normal_product_price, row"
                                ><span
                                    :style="
                                        row.normal_product_price >
                                        row.per_product_price
                                            ? 'color: red'
                                            : ''
                                    "
                                    >{{
                                        normal_product_price | datatofixed(2)
                                    }}</span
                                ></template
                            >
                        </a-table-column>
                        <a-table-column
                            :title="$t('columns.per_product_price')"
                            data-index="per_product_price"
                            key="per_product_price"
                            align="right"
                            :sorter="
                                (a, b) => {
                                    return (
                                        a.per_product_price -
                                        b.per_product_price
                                    )
                                }
                            "
                        >
                            <template slot-scope="normal_product_price, row"
                                ><span
                                    :style="
                                        row.normal_product_price >
                                        row.per_product_price
                                            ? 'color: red'
                                            : ''
                                    "
                                    >{{
                                        normal_product_price | datatofixed(2)
                                    }}</span
                                ></template
                            >
                        </a-table-column>

                        <a-table-column
                            :title="$t('columns.normal_shipment_fee')"
                            data-index="normal_shipment_fee"
                            key="normal_shipment_fee"
                            align="right"
                            :sorter="
                                (a, b) => {
                                    return (
                                        a.normal_shipment_fee -
                                        b.normal_shipment_fee
                                    )
                                }
                            "
                        >
                            <template slot-scope="normal_shipment_fee, row"
                                ><span
                                    :style="
                                        row.normal_shipment_fee <
                                        row.per_shipment_fee
                                            ? 'color: orange'
                                            : ''
                                    "
                                    >{{
                                        normal_shipment_fee | datatofixed(2)
                                    }}</span
                                ></template
                            >
                        </a-table-column>
                        <a-table-column
                            :title="$t('columns.per_shipment_fee')"
                            data-index="per_shipment_fee"
                            key="per_shipment_fee"
                            align="right"
                            :sorter="
                                (a, b) => {
                                    return (
                                        a.per_shipment_fee - b.per_shipment_fee
                                    )
                                }
                            "
                        >
                            <template slot-scope="per_shipment_fee, row"
                                ><span
                                    :style="
                                        row.normal_shipment_fee <
                                        row.per_shipment_fee
                                            ? 'color: orange'
                                            : ''
                                    "
                                    >{{
                                        per_shipment_fee | datatofixed(2)
                                    }}</span
                                ></template
                            >
                        </a-table-column>

                        <a-table-column
                            :title="$t('columns.shipment_fee')"
                            data-index="shipment_fee"
                            key="shipment_fee"
                            align="right"
                            :sorter="
                                (a, b) => {
                                    return a.shipment_fee - b.shipment_fee
                                }
                            "
                        >
                            <template slot-scope="shipment_fee"
                                >{{ shipment_fee | datatofixed(2) }}
                            </template>
                        </a-table-column>
                        <a-table-column
                            :title="$t('columns.shipment_fee_percent')"
                            data-index="shipment_fee_percent"
                            key="shipment_fee_percent"
                            align="right"
                            :sorter="
                                (a, b) => {
                                    return (
                                        a.shipment_fee_percent -
                                        b.shipment_fee_percent
                                    )
                                }
                            "
                        >
                            <template slot-scope="shipment_fee_percent"
                                >{{ shipment_fee_percent | toPercent }}
                            </template>
                        </a-table-column>
                    </data-table>
                </section>
            </template>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Ref, Watch } from 'vue-property-decorator'
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
import JsonExcel from 'vue-json-excel/JsonExcel.vue'
import moment from 'moment'
import datatofixedFilter from '@/shared/filters/datatofixed.filter'

@Page({
    layout: 'workspace',
    name: 'profit-detail'
})
@Component({
    components: {
        JsonExcel
    },
    filters: {
        toPercent(value: Number) {
            if (value && typeof value == 'number') {
                return (value * 100).toFixed(1) + '%'
            }
            return value
        }
    }
})
export default class ProfitDetail extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    // private pageService_detail = new PageService()

    private reportService = new ReportService()

    private shopType: any = [
        'B2C',
        'Amazon',
        'Ebay',
        'Wish',
        'Cdiscount',
        'Aliexpress'
    ]

    private priceOnChange(value) {
        this.price_switch = value
    }

    private feeOnChange(value) {
        this.fee_switch = value
    }

    private swichData() {
        let tempdata: any = []
        if (this.price_switch && !this.fee_switch) {
            tempdata = this.init_dataDetail.filter(
                x => x.per_product_price < x.normal_product_price
            )
        } else if (this.fee_switch && !this.price_switch) {
            tempdata = this.init_dataDetail.filter(
                x => x.per_shipment_fee > x.normal_shipment_fee
            )
        } else if (this.fee_switch && this.price_switch) {
            tempdata = this.init_dataDetail.filter(
                x =>
                    x.per_shipment_fee > x.normal_shipment_fee ||
                    x.per_product_price < x.normal_product_price
            )
        } else {
            tempdata = this.init_dataDetail
        }
        this.dataDetail = tempdata
    }

    private rules = {
        required: [{ required: true }]
    }

    @Watch('price_switch')
    private onPriceSwitchChange() {
        this.swichData()
    }

    @Watch('fee_switch')
    private onFeeSwitchChange() {
        this.swichData()
    }

    private price_switch: Boolean = false
    private fee_switch: Boolean = false

    private selectedRowKeys: any = []
    private selectedRows: any = []

    private cn_sub_category_list: any = []
    private selectedList: any = []
    private countryList: any = []

    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedSet: any = new Set()
    private data: any = []
    private dataDetail: any = []
    private init_dataDetail: any = []

    private toPecent(value: Number) {
        if (value && typeof value == 'number') {
            return (value * 100).toFixed(1) + '%'
        }
        return value
    }

    private json_fields_sku: any = {
        Sku: 'sku',
        中文子类: 'cn_sub_category',
        销量: {
            field: 'bp_sale_num',
            callback: value => {
                return datatofixedFilter(value, 2)
            }
        },
        总销售额: {
            field: 'price_subtotal',
            callback: value => {
                return datatofixedFilter(value, 2)
            }
        },
        成本总额: {
            field: 'product_price_total',
            callback: value => {
                return datatofixedFilter(value, 2)
            }
        },
        成本占比: {
            field: 'product_price_percent',
            callback: value => {
                return this.toPecent(value)
            }
        },
        毛利: {
            field: 'profit',
            callback: value => {
                return datatofixedFilter(value, 2)
            }
        },
        毛利率: {
            field: 'profit_percent',
            callback: value => {
                return this.toPecent(value)
            }
        },
        退款: {
            field: 'refund',
            callback: value => {
                return datatofixedFilter(value, 2)
            }
        },
        退款占比: {
            field: 'refund_percent',
            callback: value => {
                return this.toPecent(value)
            }
        },
        产品最低价: {
            field: 'normal_product_price',
            callback: value => {
                return datatofixedFilter(value, 2)
            }
        },
        产品销售单价: {
            field: 'per_product_price',
            callback: value => {
                return datatofixedFilter(value, 2)
            }
        },
        理论运费: {
            field: 'normal_shipment_fee',
            callback: value => {
                return datatofixedFilter(value, 2)
            }
        },
        实际运费: {
            field: 'per_shipment_fee',
            callback: value => {
                return datatofixedFilter(value, 2)
            }
        },
        运费: {
            field: 'shipment_fee',
            callback: value => {
                return datatofixedFilter(value, 2)
            }
        },
        运费占比: {
            field: 'shipment_fee_percent',
            callback: value => {
                return this.toPecent(value)
            }
        }
    }

    private json_fields_cate: any = {
        中文子类: 'cn_sub_category',
        销量: {
            field: 'bp_sale_num',
            callback: value => {
                return datatofixedFilter(value, 2)
            }
        },
        总销售额: {
            field: 'price_subtotal',
            callback: value => {
                return datatofixedFilter(value, 2)
            }
        },
        成本总额: {
            field: 'product_price_total',
            callback: value => {
                return datatofixedFilter(value, 2)
            }
        },
        成本占比: {
            field: 'product_price_percent',
            callback: value => {
                return this.toPecent(value)
            }
        },
        毛利: {
            field: 'profit',
            callback: value => {
                return datatofixedFilter(value, 2)
            }
        },
        毛利率: {
            field: 'profit_percent',
            callback: value => {
                return this.toPecent(value)
            }
        },
        退款: {
            field: 'refund',
            callback: value => {
                return datatofixedFilter(value, 2)
            }
        },
        退款占比: {
            field: 'refund_percent',
            callback: value => {
                return this.toPecent(value)
            }
        },
        运费: {
            field: 'shipment_fee',
            callback: value => {
                return datatofixedFilter(value, 2)
            }
        },
        运费占比: {
            field: 'shipment_fee_percent',
            callback: value => {
                return this.toPecent(value)
            }
        }
    }

    private created() {
        this.getCn_cate()
        this.getOrderDateList()
        this.getCountryList()
    }

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }

    private getDetailData() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                // if (!values['shop_type'] || values['shop_type'].length == 0) {
                //     this.$message.error('请选择平台')
                //     return false
                // }
                if (values['order_date'] && values['order_date'].length == 0) {
                    delete values['order_date']
                }
                if (
                    values['cn_category'] &&
                    values['cn_category'].length == 0
                ) {
                    delete values['cn_category']
                }
                if (values['country'] && values['country'].length == 0) {
                    delete values['country']
                }
                let cn_sub_category_list = Array.from(this.selectedSet)
                if (cn_sub_category_list.length > 0) {
                    values['cn_sub_category'] = cn_sub_category_list
                } else if (
                    cn_sub_category_list.length === 0 &&
                    this.selectedList.length > 0
                ) {
                    values['cn_sub_category'] = this.selectedList
                } else {
                    this.$message.warn('请检查查询条件')
                    return false
                }
                let params: any = CommonService.createQueryCondition(values, {
                    shop_type: 'like',
                    cn_sub_category: 'in',
                    order_date: 'in',
                    country: 'in'
                })

                var nowConditions: any[] = []
                for (var item of params.query_condition) {
                    nowConditions.push(item)
                }
                params.query_condition = nowConditions
                this.reportService
                    .query_sku_profit_data(
                        new RequestParams(params, {
                            loading: this.loadingService
                        })
                    )
                    .subscribe(
                        data => {
                            for (let i = 0; i < data.length; i++) {
                                data[i].id = i
                            }
                            this.init_dataDetail = data
                            this.swichData()
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

    @Watch('selectedSet')
    private onChangeSelectedSet() {
        if (this.selectedSet.size > 0) {
            this.getDetailData()
        }
    }

    @Watch('selectedRowKeys')
    private onChangeSelectedRowKeys() {
        let tempSet = new Set()
        for (let i of this.selectedRowKeys) {
            let row = this.data.find(x => x.id == i)
            if (row) {
                tempSet.add(row.cn_sub_category)
            }
        }
        if (!this.eqSet(tempSet, this.selectedSet)) {
            this.selectedSet = tempSet
        }
    }

    private eqSet(as, bs) {
        if (as.size !== bs.size) {
            return false
        }
        for (var i of as) {
            if (!bs.has(i)) {
                return false
            }
        }
        return true
    }

    private getCountryList() {
        this.reportService.query_country_list(new RequestParams()).subscribe(
            data => {
                this.countryList = data
            },
            error => {
                this.$message.error(error.message)
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

    private selectCategory(record) {
        let set = new Set(this.selectedRowKeys)
        if (set.has(record)) {
            set.delete(record)
        } else {
            set.add(record)
        }
        this.selectedRowKeys = Array.from(set)
        this.selectedRows = []
        for (let i of this.selectedRowKeys) {
            this.selectedRows.push(this.data.find(x => x.id == i))
        }
    }

    private getCategoryProfit(sorter) {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                // if (!values['shop_type'] || values['shop_type'].length == 0) {
                //     this.$message.error('请选择平台')
                //     return false
                // }
                if (values['order_date'] && values['order_date'].length == 0) {
                    delete values['order_date']
                }
                if (values['country'] && values['country'].length == 0) {
                    delete values['country']
                }
                if (this.selectedList.length > 0) {
                    values['cn_sub_category'] = this.selectedList
                }
                let params: any = CommonService.createQueryCondition(values, {
                    shop_type: 'like',
                    cn_sub_category: 'in',
                    order_date: 'in',
                    country: 'in'
                })

                var nowConditions: any[] = []
                for (var item of params.query_condition) {
                    nowConditions.push(item)
                }
                this.reportService
                    .query_category_profit_data(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService
                        })
                    )
                    .subscribe(
                        data => {
                            for (let i = 0; i < data.length; i++) {
                                data[i].id = i
                            }
                            this.data = data
                            this.selectedRowKeys = []
                            this.init_dataDetail = []
                            this.dataDetail = []
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
<style>
.export-excel-wrapper {
    float: right;
    margin-left: 30px;
}
</style>
<i18n>
{
    "en-us": {
        "columns": {
            "shop_type": "platform",
            "cn_sub_category": "cn sub category",
            "order_date": "Order Date",
            "bp_sale_num": "Sale Number",
            "country": "Country",
            "customer": "Customer",
            "normal_product_price": "Normal Product Price",
            "per_product_price": "Per Product Price",
            "price_subtotal": "Price Subtotal",
            "product_price_percent": "Product Price Percent",
            "product_price_total": "Product Price Total",
            "profit": "Profit",
            "profit_percent": "Profit Percent",
            "refund": "Refund",
            "refund_percent": "Refund Percent",
            "per_shipment_fee": "Per Shipment Fee",
            "normal_shipment_fee": "Normal Shipment Fee",
            "shipment_fee": "Shipment Fee",
            "shipment_fee_percent": "Shipment Fee Percent",
            "sku": "Sku"
        },
        "export_excel_detail": "Export Excel Sku",
        "export_excel_cate": "Export Excel Category",
        "abnormal_price": "Abnormal Price",
        "abnormal_shipping": "Abnormal Shipping"
    },
    "zh-cn": {
        "columns": {
            "shop_type": "平台",
            "cn_sub_category": "中文子类",
            "order_date": "订单日期",
            "bp_sale_num": "销量",
            "country": "国家",
            "customer": "订单类型",
            "normal_product_price": "产品最低价",
            "per_product_price": "产品销售单价",
            "price_subtotal": "总销售额",
            "product_price_percent": "成本占比",
            "product_price_total": "成本总额",
            "profit": "毛利",
            "profit_percent": "毛利率",
            "refund": "退款",
            "refund_percent": "退款占比",
            "per_shipment_fee": "实际运费",
            "normal_shipment_fee": "理论运费",
            "shipment_fee": "运费",
            "shipment_fee_percent": "运费占比",
            "sku": "Sku"
        },
        "export_excel_detail": "导出sku明细",
        "export_excel_cate": "导出品类明细",
        "abnormal_price": "价格异常",
        "abnormal_shipping": "运费异常"
    }
}
</i18n>
