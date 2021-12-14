<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form
            ref="dataForm"
            @submit="getSkuList"
            :column="1"
            @reset="formReset"
        >
            <!--默认显示项-->
            <template #default>
                <!-- <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        v-decorator="['default_code']"
                        :style="{ width: '300px' }"
                        size="small"
                        :placeholder="$t('split_query_condition')"
                    ></a-input>
                </a-form-item> -->
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-select
                        v-decorator="['type', { initialValue: 'basic' }]"
                        :style="{ width: '120px' }"
                        size="small"
                    >
                        <a-select-option value="basic">
                            {{ $t('columns.basic') }}
                        </a-select-option>
                        <a-select-option value="pack">
                            {{ $t('columns.pack') }}
                        </a-select-option>
                    </a-select>
                    <a-input
                        v-decorator="['default_code']"
                        :style="{ width: '195px', margin: '0 5px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    ></a-input>
                    <a-select
                        v-decorator="['operator', { initialValue: 'ilike' }]"
                        :style="{ width: '100px' }"
                        size="small"
                    >
                        <a-select-option value="ilike">
                            {{ $t('forms.operator_like') }}
                        </a-select-option>
                        <a-select-option value="=">
                            {{ $t('forms.operator_equal') }}
                        </a-select-option>
                        <a-select-option value="in">
                            {{ $t('forms.operator_list') }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['z_category']"
                        style="width: 120px"
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
                        style="width: 300px;margin-left:5px"
                        placeholder="子类"
                        size="small"
                    >
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.de_prod_status')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['de_sale_status']"
                        :style="{ width: '260px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of $dict.PriceCheckProdStatus"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ $t(item.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.uk_prod_status')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['uk_sale_status']"
                        :style="{ width: '260px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of $dict.PriceCheckProdStatus"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ $t(item.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <template #action>
                <JsonExcel
                    class="export-excel-wrapper"
                    :data="dataDetail"
                    :fields="json_fields_basic"
                    name="基础货号数据.xls"
                >
                    <a-button type="primary" :disabled="!init_dataDetail.length"
                        >{{ $t('export_excel_basic') }}
                    </a-button>
                </JsonExcel>
                <JsonExcel
                    class="export-excel-wrapper"
                    :data="dataDetail"
                    :fields="json_fields_commmon"
                    name="通用货号数据.xls"
                >
                    <a-button type="primary" :disabled="!data.length"
                        >{{ $t('export_excel_common') }}
                    </a-button>
                </JsonExcel>
                <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay">
                        <a-menu-item @click="importBasicProduct"
                            >{{ $t('action.import_basic_product') }}
                        </a-menu-item>
                        <a-menu-item @click="importBTypeBasicProduct"
                            >{{ $t('action.import_b_basic_product') }}
                        </a-menu-item>
                        <a-menu-item @click="importETZBasicProduct"
                            >{{ $t('action.import_etz_basic_product') }}
                        </a-menu-item>
                        <a-menu-item @click="importShipmentBasicProduct"
                            >{{ $t('action.import_shipment_basic_product') }}
                        </a-menu-item>
                        <a-menu-item @click="importSetBasicProduct"
                            >{{ $t('action.import_set_basic_product') }}
                        </a-menu-item>
                        <a-menu-item @click="importUpdatePackProduct"
                            >{{ $t('action.import_update_pack_product') }}
                        </a-menu-item>
                        <a-menu-item @click="importCreatePackProduct"
                            >{{ $t('action.import_create_pack_product') }}
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 2px" v-auth="'import'">
                        {{ $t('action.import_btn') }}
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown>
                <a-button type="primary" @click="importInstockInfo"
                    >{{ $t('action.import_instock_info') }}
                </a-button>
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
                @on-page-change="getSkuList"
                @onClick="
                    record => {
                        this.selectCommonSKU(record)
                    }
                "
                :scroll="{ y: 300 }"
                style="table-layout:fixed;"
            >
                <a-table-column
                    :title="$t('columns.common_sku')"
                    key="common_sku"
                    align="left"
                >
                    <template slot-scope="row">
                        <a
                            @click="
                                toPageDetail(
                                    row.product_tmpl_id,
                                    row.common_sku
                                )
                            "
                            >{{ row.common_sku }}</a
                        >
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.z_category')"
                    data-index="z_category"
                    key="z_category"
                    align="left"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.z_sub_category')"
                    data-index="z_sub_category"
                    key="z_sub_category"
                    align="left"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.weight1')"
                    data-index="weight1"
                    key="weight1"
                    align="right"
                    :sorter="
                        (a, b) => {
                            return a.weight1 - b.weight1
                        }
                    "
                >
                    <template slot-scope="weight1"
                        >{{ weight1 | datatofixed(2) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.max_size')"
                    data-index="max_size"
                    key="max_size"
                    align="left"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.carton_size')"
                    data-index="carton_size"
                    key="carton_size"
                    align="left"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.package_size_container')"
                    data-index="package_size_container"
                    key="package_size_container"
                    align="left"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.min_pack')"
                    data-index="min_pack"
                    key="min_pack"
                    align="left"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.product_ve')"
                    data-index="product_ve"
                    key="product_ve"
                    align="left"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.purchase_ve')"
                    data-index="purchase_ve"
                    key="purchase_ve"
                    align="left"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.product_url')"
                    key="product_url"
                >
                    <template slot-scope="row">
                        <!-- <a
                            title="Download the Product Manual(产品说明书)"
                            :href="row.product_url"
                            target="_blank"
                            v-if="
                                row.product_url && row.product_url.length > 10
                            "
                            >{{ row.common_sku }}</a
                        >
                        <span v-else>
                            {{ row.common_sku }}
                        </span> -->
                        <a @click="showManualDetail(row.common_sku)">{{
                            row.common_sku
                        }}</a>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.actions')"
                    key="action"
                    align="center"
                >
                    <template slot-scope="row">
                        <a
                            @click="e => showDepartInfo(e, row)"
                            v-auth="'status'"
                        >
                            {{ $t('action.show_depart_info') }}
                        </a>
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
        <a-card class="margin-y">
            <template>
                <section class="component customer-detail">
                    <data-table
                        :data="init_dataDetail"
                        style="table-layout:fixed;"
                        rowKey="id"
                        :rowSelection="{
                            selectedRowKeys: selectedBasicRowKeys,
                            onChange: (keys, select_rows) => {
                                selectedBasicRowKeys = keys
                            }
                        }"
                        @onClick="
                            record => {
                                this.selectBasicSKU(record)
                            }
                        "
                        @on-page-change="getBasicSkuList"
                        :stripe="true"
                        :scroll="{ y: 800 }"
                    >
                        <a-table-column
                            :title="$t('columns.basic_sku')"
                            key="basic_sku"
                            align="left"
                        >
                            <template slot-scope="row">
                                <a
                                    @click="
                                        toPageDetail(
                                            row.product_tmpl_id,
                                            row.basic_sku
                                        )
                                    "
                                    >{{ row.basic_sku }}</a
                                >
                            </template>
                        </a-table-column>
                        <a-table-column
                            :title="$t('columns.common_sku')"
                            data-index="common_sku"
                            key="common_sku"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.z_category')"
                            data-index="z_category"
                            key="z_category"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.z_sub_category')"
                            data-index="z_sub_category"
                            key="z_sub_category"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.stock_available_quantity')"
                            data-index="stock_available_quantity"
                            key="stock_available_quantity"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.stock_de_available_qty')"
                            data-index="stock_de_available_qty"
                            key="stock_de_available_qty"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.stock_uk_available_qty')"
                            data-index="stock_uk_available_qty"
                            key="stock_uk_available_qty"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.de_fba_available_qty')"
                            data-index="de_fba_available_qty"
                            key="de_fba_available_qty"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.fba_stock_qty')"
                            data-index="fba_stock_qty"
                            key="fba_stock_qty"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.de_renew_available_qty')"
                            data-index="de_renew_available_qty"
                            key="de_renew_available_qty"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.pre_sale_quantity')"
                            data-index="pre_sale_quantity"
                            key="pre_sale_quantity"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.location_code')"
                            data-index="location_code"
                            key="location_code"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.min_pack')"
                            data-index="min_pack"
                            key="min_pack"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.pre_sale')"
                            data-index="pre_sale"
                            key="pre_sale"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.frei_field_4')"
                            data-index="frei_field_4"
                            key="frei_field_4"
                            ellipsis="true"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.product_url')"
                            key="product_url"
                        >
                            <template slot-scope="row">
                                <!-- <a
                                    title="Download the Product Manual(产品说明书)"
                                    :href="row.product_url"
                                    target="_blank"
                                    v-if="
                                        row.product_url &&
                                            row.product_url.length > 10
                                    "
                                    >{{ row.basic_sku }}</a
                                >
                                <span v-else>
                                    {{ row.basic_sku }}
                                </span> -->
                                <a @click="showManualDetail(row.basic_sku)">{{
                                    row.basic_sku
                                }}</a>
                            </template>
                        </a-table-column>
                        <a-table-column
                            :title="$t('columns.actions')"
                            key="action"
                            align="center"
                        >
                            <template slot-scope="row">
                                <a @click="e => showDepartInfo(e, row)">
                                    {{ $t('action.show_depart_info') }}
                                </a>
                            </template>
                        </a-table-column>
                    </data-table>
                </section>
            </template>
        </a-card>
        <a-card class="margin-y">
            <template>
                <section class="component customer-detail">
                    <data-table
                        :data="pack_dataDetail"
                        style="table-layout:fixed;"
                        rowKey="id"
                        @on-page-change="getPackSkuList"
                        :rowSelection="{
                            selectedRowKeys: selectedRowKeys,
                            onChange: (keys, select_rows) => {
                                selectedRowKeys = keys
                            }
                        }"
                        :stripe="true"
                        :scroll="{ y: 800 }"
                    >
                        <a-table-column
                            :title="$t('columns.pack_sku')"
                            key="pack_sku"
                            align="left"
                        >
                            <template slot-scope="row">
                                <a
                                    @click="
                                        toPageDetail(
                                            row.product_tmpl_id,
                                            row.pack_sku
                                        )
                                    "
                                    >{{ row.pack_sku }}</a
                                >
                            </template>
                        </a-table-column>
                        <a-table-column
                            :title="$t('columns.qty_uom')"
                            data-index="qty_uom"
                            key="qty_uom"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.basic_sku')"
                            data-index="basic_sku"
                            key="basic_sku"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.z_category')"
                            data-index="z_category"
                            key="z_category"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.z_sub_category')"
                            data-index="z_sub_category"
                            key="z_sub_category"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.weight1')"
                            data-index="weight1"
                            key="weight1"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.min_pack')"
                            data-index="min_pack"
                            key="min_pack"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.product_ve')"
                            data-index="product_ve"
                            key="product_ve"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.purchase_ve')"
                            data-index="purchase_ve"
                            key="purchase_ve"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.max_size')"
                            data-index="max_size"
                            key="max_size"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.carton_size')"
                            data-index="carton_size"
                            key="carton_size"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.package_size_container')"
                            data-index="package_size_container"
                            key="package_size_container"
                            align="left"
                        ></a-table-column>
                        <a-table-column
                            :title="$t('columns.actions')"
                            key="action"
                            align="center"
                        >
                            <template slot-scope="row">
                                <a @click="e => showDepartInfo(e, row)">
                                    {{ $t('action.show_depart_info') }}
                                </a>
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
import UploadExcel from '~/shared/common/upload-excel.vue'
import { CommonService } from '@/shared/utils/common.service'
import { ReportService } from '../../services/report.service'
import { ProductService } from '../../services/product.service'
import JsonExcel from 'vue-json-excel/JsonExcel.vue'
import moment from 'moment'
import datatofixedFilter from '@/shared/filters/datatofixed.filter'
import UUID from 'uuidjs'
import ManualDetail from '~/components/product/manual-detail.vue'
import ExportCommon from '@/components/common/export-common.vue'
import appConfig from '@/config/app.config'
import ProductDepartInfo from '../../components/product/product-depart-info.vue'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'product-manage'
})
@Component({
    components: {
        JsonExcel,
        UploadExcel,
        ManualDetail
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
    private productService = new ProductService()

    @datasModule.Action
    private getDepartmentList

    @datasModule.State
    private departmentList

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

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

    private rules = {
        required: [{ required: true }]
    }

    private price_switch: Boolean = false
    private fee_switch: Boolean = false

    private selectedRowKeys: any = []
    private selectedBasicRowKeys: any = []
    private selectedRows: any = []

    private cn_sub_category_list: any = []
    private selectedList: any = []
    private countryList: any = []

    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedSet: any = new Set()
    private selectedBasicSet: any = new Set()
    private data: any = []
    private dataDetail: any = []
    private init_dataDetail: any = []
    private pack_dataDetail: any = []

    private toPecent(value: Number) {
        if (value && typeof value == 'number') {
            return (value * 100).toFixed(1) + '%'
        }
        return value
    }

    private importBasicProduct() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/product/import_basic_product' },
                {
                    title: '产品基础通用导入',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importBTypeBasicProduct() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/product/import_b_basic_product' },
                {
                    title: '产品基础-B品',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importETZBasicProduct() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/product/import_etz_basic_product' },
                {
                    title: '产品基础-配件',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importShipmentBasicProduct() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/product/import_shipment_basic_product' },
                {
                    title: '产品基础-运费',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importSetBasicProduct() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/product/import_set_basic_product' },
                {
                    title: '产品基础-组序(变体)',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importUpdatePackProduct() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/product/import_update_pack_product' },
                {
                    title: '产品组合通用修改',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importCreatePackProduct() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/product/import_create_pack_product' },
                {
                    title: '产品组合通用创建',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private json_fields_basic: any = {
        基础货号: 'basic_sku',
        通用货号: 'common_sku',
        品类: 'z_categoty',
        子类: 'z_sub_categoty',
        可用库存: {
            field: 'stock_available_quantity',
            callback: value => {
                return datatofixedFilter(value, 2)
            }
        }
    }

    private json_fields_commmon: any = {
        通用货号: 'common_sku',
        品类: 'z_category',
        子类: 'z_sub_category',
        重量: {
            field: 'weight1',
            callback: value => {
                return datatofixedFilter(value, 2)
            }
        },
        PackageSize: 'max_size',
        CartonSize: 'carton_size',
        PackageSizeContainer: 'package_size_container',
        最大包装量: 'min_pack',
        VE: 'product_ve',
        采购VE: 'purchase_ve',
        说明书: 'purchase_url'
    }

    private created() {
        this.getCn_cate()
        this.getDepartmentList()
        this.getSystemuser()
    }

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }

    private getBasicSkuList() {
        let values = {}
        let common_sku_list = Array.from(this.selectedSet)
        if (common_sku_list.length > 0) {
            values['common_sku'] = common_sku_list
        } else if (
            common_sku_list.length === 0 &&
            this.selectedList.length > 0
        ) {
            values['common_sku'] = this.selectedList
        } else {
            this.$message.warn('请检查查询条件')
            return false
        }
        let params: any = CommonService.createQueryCondition(values, {
            common_sku: 'in'
        })

        this.productService
            .query_all_basic_sku(
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
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getPackSkuList() {
        let values = {}
        if (this.selectedBasicRows.length > 0) {
            values['product_id'] = this.selectedBasicRows.map(x => {
                return x.product_id
            })
        } else if (this.selectedBasicRows.length < 0) {
            this.$message.warn('请检查查询条件')
            return false
        } else {
            return false
        }
        let params: any = CommonService.createQueryCondition(values, {
            product_id: 'in'
        })

        this.productService
            .query_all_bp_pack(
                new RequestParams(params, {
                    loading: this.loadingService
                })
            )
            .subscribe(
                data => {
                    for (let i = 0; i < data.length; i++) {
                        data[i].id = i
                    }
                    this.pack_dataDetail = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    @Watch('selectedSet')
    private onChangeSelectedSet() {
        if (this.selectedSet.size > 0) {
            this.getBasicSkuList()
        }
    }

    @Watch('selectedRowKeys')
    private onChangeSelectedRowKeys() {
        let tempSet = new Set()
        for (let i of this.selectedRowKeys) {
            let row = this.data.find(x => x.id == i)
            if (row) {
                // console.log(row)
                if (row.product_id) {
                    tempSet.add(row.product_id)
                } else {
                    tempSet.add(row.common_sku)
                }
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

    private selectCommonSKU(record) {
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

    private selectedBasicRows: any = []

    private selectBasicSKU(record) {
        let set = new Set(this.selectedBasicRowKeys)
        if (set.has(record)) {
            set.delete(record)
        } else {
            set.add(record)
        }
        this.selectedBasicRowKeys = Array.from(set)
        this.selectedBasicRows = []
        for (let i of this.selectedBasicRowKeys) {
            this.selectedBasicRows.push(
                this.init_dataDetail.find(x => x.id == i)
            )
        }
        this.getPackSkuList()
    }

    private getSkuList() {
        this.getQueryCondition()
            .then((params: any) => {
                this.productService
                    .query_all_type_sku(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService
                        })
                    )
                    .subscribe(
                        data => {
                            data.map(x => {
                                for (var key in x) {
                                    if (key == 'common_dict') {
                                        this.data = x[key]['results'].map(a => {
                                            a['id'] = UUID.generate()
                                            return a
                                        })
                                    } else if (key == 'basic_dict') {
                                        this.init_dataDetail = x[key][
                                            'results'
                                        ].map(b => {
                                            b['id'] = UUID.generate()
                                            return b
                                        })
                                    } else if (key == 'pack_dict') {
                                        this.pack_dataDetail = x[key][
                                            'results'
                                        ].map(c => {
                                            c['id'] = UUID.generate()
                                            return c
                                        })
                                    }
                                }
                            })

                            this.selectedRowKeys = []
                            // this.init_dataDetail = []
                            // this.pack_dataDetail = []
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

    private getQueryCondition() {
        return new Promise((reslove, reject) => {
            this.dataForm
                .validateFields()
                .then((values: any) => {
                    if (this.selectedList.length > 0) {
                        values['z_sub_category'] = this.selectedList
                    }
                    let operator = values['operator']
                    let type = values['type']
                    delete values['operator']
                    delete values['type']

                    if (operator == 'in' && values['default_code']) {
                        values['default_code'] = values['default_code'].split(
                            ','
                        )
                    }
                    let params: any = CommonService.createQueryCondition(
                        values,
                        {
                            default_code: operator,
                            z_sub_category: 'in'
                        }
                    )

                    params['sku_type'] = type

                    reslove(params)
                })
                .catch(err => {
                    this.$message.error(JSON.stringify(err))
                })
        })
    }

    private getCommonSkuList(sorter) {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                if (values['sku'] && values['sku'].length == 0) {
                    delete values['sku']
                }
                if (this.selectedList.length > 0) {
                    values['z_sub_category'] = this.selectedList
                }
                let params: any = CommonService.createQueryCondition(values, {
                    sku: 'in_or_rlike',
                    z_sub_category: 'in'
                })

                var nowConditions: any[] = []
                for (var item of params.query_condition) {
                    nowConditions.push(item)
                }
                this.productService
                    .query_all_common_sku(
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
                            this.pack_dataDetail = []
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

    private toPageDetail(id, name) {
        this.$router.push({
            name: 'product-detail',
            path: `/product/product-detail/${id}`,
            params: {
                id: id,
                name: name
            }
        })
    }

    private showManualDetail(sku) {
        let params: any = CommonService.createQueryCondition(
            { sku: sku },
            {
                sku: '='
            }
        )
        this.productService
            .query_all_product_manual(
                new RequestParams(params, {
                    loading: this.loadingService
                })
            )
            .subscribe(
                data => {
                    this.$modal
                        .open(
                            ManualDetail,
                            {
                                list: data
                            },
                            {
                                title: this.$t('manual_detail'),
                                width: '1000px'
                            }
                        )
                        .subscribe()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importInstockInfo() {
        this.getQueryCondition().then((params: any) => {
            let menu_code: any = this.dataForm.menu_code
            let url =
                appConfig.server +
                '/system_api/download?inner_action=product_management/export_product_stock_info&menu_code=' +
                menu_code +
                '&query_condition=' +
                encodeURIComponent(JSON.stringify(params.query_condition)) +
                '&sku_type=' +
                params.sku_type

            window.open(url, '_blank')
        })
    }

    private showDepartInfo(e, row) {
        e.stopPropagation()
        this.$modal
            .open(
                ProductDepartInfo,
                {
                    id: row.product_tmpl_id,
                    departmentList: this.departmentList,
                    systemUsers: this.systemUsers
                },
                {
                    title: this.$t('action.show_depart_info'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                //
            })
    }

    private formReset(param) {
        this.selectedList = []
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
            "common_sku": "Common SKU",
            "pack_sku": "Pack SKU",
            "qty_uom": "Qty Uom",
            "cn_sub_category": "cn sub category",
            "weight1": "Weight1",
            "max_size": "Package Size",
            "carton_size": "Carton Size",
            "package_size_container": "Package Size Container",
            "min_pack": "Min Pack",
            "product_ve": "Product VE",
            "purchase_ve": "Purchase VE",
            "product_url": "Product Introduction",
            "basic_sku": "Basic SKU",
            "stock_available_quantity": "Available Quantity",
            "stock_de_available_qty": "DE Available Quantity",
            "stock_uk_available_qty": "UK Available Quantity",
            "de_fba_available_qty": "DE FBA Available Quantity",
            "fba_stock_qty": "FBA Stock",
            "de_renew_available_qty": "DE Renew Available Quantity",
            "pre_sale_quantity": "Pre Sale Quantity",
            "location_code": "Location Code",
            "pre_sale": "Pre Sale",
            "frei_field_4": "F4",
            "basic": "basic",
            "pack": "pack",
            "de_prod_status": "DE Sale Status",
            "uk_prod_status": "UK Sale Status"
        },
        "action": {
            "import_btn": "Import",
            "import_basic_product": "import_basic_product",
            "import_b_basic_product": "import_b_basic_product",
            "import_etz_basic_product": "import_etz_basic_product",
            "import_shipment_basic_product": "import_shipment_basic_product",
            "import_set_basic_product": "import_set_basic_product",
            "import_update_pack_product": "import_update_pack_product",
            "import_create_pack_product": "import_create_pack_product",
            "import_instock_info": "Import Instock Info",
            "show_depart_info": "Product Status"
        },
        "forms": {
            "quick_search": "Quick Search",
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search",
            "operator_list": "Multi Search"
        },
        "export_excel_baisc": "Export Excel Basic Sku",
        "export_excel_common": "Export Excel Category",
        "manual_detail": "Manual Detail"
    },
    "zh-cn": {
        "columns": {
            "common_sku": "通用货号",
            "pack_sku": "组合货号",
            "qty_uom": "数量对应",
            "cn_sub_category": "中文子类",
            "weight1": "重量",
            "max_size": "Package Size",
            "carton_size": "Carton Size",
            "package_size_container": "Package Size Container",
            "min_pack": "最大包装数",
            "product_ve": "产品VE",
            "purchase_ve": "采购VE",
            "product_url": "产品说明书",
            "basic_sku": "基础货号",
            "stock_available_quantity": "可用库存",
            "stock_de_available_qty": "德仓可用库存",
            "stock_uk_available_qty": "英仓可用库存",
            "de_fba_available_qty": "德仓FBA可用库存",
            "fba_stock_qty": "FBA库存",
            "de_renew_available_qty": "德仓Renew库存",
            "pre_sale_quantity": "预售数量",
            "location_code": "库位",
            "pre_sale": "预售",
            "frei_field_4": "F4",
            "basic": "基础货号",
            "pack": "组合货号",
            "de_prod_status": "德仓销售状态",
            "uk_prod_status": "英仓销售状态"
        },
        "forms": {
            "quick_search": "快速查找",
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量查询"
        },
        "action": {
            "import_btn": "导入",
            "import_basic_product": "ERP产品导入-基础-通用",
            "import_b_basic_product": "ERP产品导入-基础-B品",
            "import_etz_basic_product": "ERP产品导入-基础-配件",
            "import_shipment_basic_product": "ERP产品导入-基础-运费",
            "import_set_basic_product": "ERP产品导入-基础-组序变体",
            "import_update_pack_product": "ERP产品导入-组合-通用修改",
            "import_create_pack_product": "ERP产品导入-组合-通用创建",
            "import_instock_info": "导出库存信息",
            "show_depart_info": "产品状态"
        },
        "export_excel_basic": "导出基础货号数据",
        "export_excel_common": "导出通用货号数据",
        "manual_detail": "产品说明书详情"
    }
}
</i18n>
