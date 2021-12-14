<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action>
            <!-- <a-button type="primary" @click="onCreate">{{
                $t('action.create')
            }}</a-button> -->
        </template>
        <data-form ref="dataForm" @submit="getManualList" :column="1">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.type')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['type', { initialValue: '^EZT-' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onTypeChange(e)"
                    >
                        <a-radio-button value="^EZT-"
                            >{{ $t('columns.part') }}
                        </a-radio-button>
                        <a-radio-button value="^B\d{1}-"
                            >{{ $t('columns.b_product') }}
                        </a-radio-button>
                        <a-radio-button value="^N\d{1}-"
                            >{{ $t('columns.n_product') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        v-decorator="['default_code']"
                        :style="{ width: '280px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    ></a-input>
                    <a-select
                        v-decorator="['operator', { initialValue: 'ilike' }]"
                        :style="{ width: '100px', 'margin-left': '5px' }"
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
                        style="width: 16%;margin-left:5px"
                        placeholder="子类"
                        size="small"
                    >
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay">
                        <a-menu-item @click="importBTypeBasicProduct"
                            >{{ $t('action.import_b_basic_product') }}
                        </a-menu-item>
                        <a-menu-item @click="importETZBasicProduct"
                            >{{ $t('action.import_etz_basic_product') }}
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
                <a-badge :count="cnt" v-if="$hasButtonAuth('reissue')">
                    <a-button
                        type="primary"
                        b
                        @click="numberModify"
                        style="margin-left: 2px"
                        v-auth="'reissue'"
                    >
                        {{ $t('action.reissue_parts_number_modify') }}
                    </a-button>
                </a-badge>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important;">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getManualList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                style="table-layout:fixed;"
            >
                <a-table-column
                    :title="$t('columns.default_code')"
                    key="default_code"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a @click="toPageDetail(row.id, row.default_code)">{{
                            row.default_code
                        }}</a>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.product_number')"
                    key="product_number"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.product_number }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.name')"
                    key="name"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        ><span :title="row.name">
                            {{
                                row.name
                                    ? row.name.substr(0, 15) +
                                      (row.name.length > 15 ? '...' : '')
                                    : ''
                            }}
                        </span></template
                    >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.de_renew_available_qty')"
                    key="de_renew_available_qty"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.de_renew_available_qty }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.fba_stock_qty')"
                    key="fba_stock_qty"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.fba_stock_qty }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.location_code')"
                    key="location_code"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.location_code }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.location_quantity')"
                    key="location_quantity"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.location_quantity }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.min_pack')"
                    key="min_pack"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.min_pack }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.pack_product')"
                    key="pack_product"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.pack_product }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.pre_sale')"
                    key="pre_sale"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-checkbox :checked="row.pre_sale" :disabled="true" />
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.pre_sale_quantity')"
                    key="pre_sale_quantity"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.pre_sale_quantity }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.stock_available_quantity')"
                    key="stock_available_quantity"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.stock_available_quantity }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.stock_de_available_qty')"
                    key="stock_de_available_qty"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.stock_de_available_qty }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.stock_de_onhand_qty')"
                    key="stock_de_onhand_qty"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.stock_de_onhand_qty }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.stock_details')"
                    key="stock_details"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row"
                        ><span :title="row.stock_details">
                            {{
                                row.stock_details
                                    ? row.stock_details.substr(0, 15) +
                                      (row.stock_details.length > 15
                                          ? '...'
                                          : '')
                                    : ''
                            }}
                        </span></template
                    >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.stock_onhand_quantity')"
                    key="stock_onhand_quantity"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.stock_onhand_quantity }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.stock_uk_available_qty')"
                    key="stock_uk_available_qty"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.stock_uk_available_qty }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.stock_uk_onhand_qty')"
                    key="stock_uk_onhand_qty"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.stock_uk_onhand_qty }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.frei_field_4')"
                    key="frei_field_4"
                    :sorter="true"
                    width="14%"
                    align="center"
                >
                    <template slot-scope="row">
                        <span :title="row.frei_field_4">
                            {{
                                row.frei_field_4
                                    ? row.frei_field_4.substr(0, 15) +
                                      (row.frei_field_4.length > 15
                                          ? '...'
                                          : '')
                                    : ''
                            }}
                        </span>
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
import SellerView from '~/components/seller_instance/seller_view.vue'
import SellerApiEdit from '~/components/seller_instance/seller-api-edit.vue'
import { ReportService } from '../../services/report.service'
import { ProductService } from '../../services/product.service'
import UploadExcel from '@/shared/common/upload-excel.vue'
import ReissuePartNumberModify from '../../components/product/reissue-part-number-modify.vue'

const userModule = namespace('userModule')
const allUsersModule = namespace('allUsersModule')
const pageParamsModule = namespace('pageParamsModule')
const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'product-parts'
})
@Component({
    components: {
        SellerView,
        SellerApiEdit
    }
})
export default class ProductParts extends Vue {
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

    private reportService = new ReportService()

    private productService = new ProductService()

    // 表格数据源
    private data: any[] = []
    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []
    private cnt: any = 0

    // 表格选择项
    private selectedRowKeys: any[] = []

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private create() {
        this.getSystemuser()
    }

    private get rules() {
        return {}
    }

    public created() {
        this.getCn_cate()
        this.getPartCnt()
        this.getSystemuser()
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

    /**
     * 获取订单数据
     */
    private getManualList() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                if (this.selectedList.length > 0) {
                    values['z_sub_category'] = this.selectedList
                }
                let operator = values['operator']
                delete values['operator']

                if (operator == 'in' && values['default_code']) {
                    values['default_code'] = values['default_code'].split(',')
                }
                let params: any = CommonService.createQueryCondition(values, {
                    default_code: operator,
                    type: '~',
                    z_sub_category: 'in'
                })

                params.query_condition = params.query_condition.map(x => {
                    if (x.query_name == 'type') {
                        x['query_name'] = 'default_code'
                        x['operate'] = 'regular_exp'
                    }
                    return x
                })
                this.productService
                    .query_all_basic_product_info(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService
                        })
                    )
                    .subscribe(
                        data => {
                            this.data = data.map((x, i) => {
                                x['id'] = i + 1
                                return x
                            })
                            this.selectedRowKeys = []
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

    private onEdit(row) {
        router.push({
            name: 'seller-edit',
            params: { seller: row }
        })
    }

    private onDelete(row) {
        // this.sellerInstanceService
        //     .seller_delete(
        //         new RequestParams(
        //             {
        //                 seller_code_list: [row.seller_code]
        //             },
        //             { loading: this.loadingService }
        //         )
        //     )
        //     .subscribe(
        //         data => {
        //             let msg: any = this.$t('delete_success')
        //             this.$message.success(msg)
        //             this.getManualList()
        //         },
        //         err => {
        //             this.$message.error(err.message)
        //         }
        //     )
    }

    private onBatchDelete(row) {}

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }

    private onTypeChange(e) {
        this.$nextTick(function() {
            this.getManualList()
        })
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

    private numberModify() {
        this.$modal
            .open(
                ReissuePartNumberModify,
                {
                    systemUsers: this.systemUsers,
                    fatherCates: this.fatherCates,
                    cateDict: this.cateDict,
                    menuCode: CommonService.getMenuCode()
                },
                {
                    title: this.$t('action.reissue_parts_number_modify'),
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

    private getPartCnt() {
        let params: any = CommonService.createQueryCondition(
            { state: '未修正' },
            {
                state: '='
            }
        )

        this.productService
            .query_all_cs_tmp_product_part(
                new RequestParams(params, {
                    page: this.pageService
                })
            )
            .subscribe(
                data => {
                    this.cnt = data.length
                },
                err => {
                    this.$message.error(err.message)
                }
            )
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
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "manual_code": "Manual Code",
            "manual_version": "Manual Version",
            "seller_id": "Seller Name",
            "actions": "Actions",
            "view": "View",
            "cn_category": "Category",
            "cn_sub_category": "Sub Category",
            "import_date": "Import Date",
            "part": "Parts",
            "b_product": "B Product",
            "n_product": "N Product",
            "type": "Type",
            "de_renew_available_qty": "DE Renew Available Qty",
            "default_code": "Default Code",
            "fba_stock_qty": "Fba Stock Qty",
            "frei_field_4": "Frei Field 4",
            "location_code": "Location Code",
            "location_quantity": "Location Quantity",
            "min_pack": "Min Pack",
            "name": "Name",
            "pack_product": "Pack Product",
            "pre_sale": "Pre Sale",
            "pre_sale_quantity": "Pre Sale Quantity",
            "product_number": "Product Number",
            "product_url": "Product Url",
            "stock_available_quantity": "Stock Available Quantity",
            "stock_de_available_qty": "Stock DE Available Qty",
            "stock_de_onhand_qty": "Stock DE Onhand Qty",
            "stock_details": "Stock Details",
            "stock_onhand_quantity": "Stock Onhand Quantity",
            "stock_uk_available_qty": "Stock UK Available Qty",
            "stock_uk_onhand_qty": "Stock  UK Onhand Qty"
        },
        "action": {
            "create": "Create",
            "batch-create": "EXCEL Import",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "copy": "Copy",
            "pass": "Check",
            "onApiEdit": "Api Edit",
            "import_btn": "Import",
            "import_b_basic_product": "import_b_basic_product",
            "import_etz_basic_product": "import_etz_basic_product",
            "reissue_parts_number_modify": "Reissue part number modification",
            "import_create_pack_product": "import_create_pack_product"
        },
        "forms": {
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
            "manual_code": "说明书编号",
            "manual_version": "说明书版本",
            "time": "创建时间",
            "actions": "操作",
            "view": "查看",
            "cn_category": "分类",
            "cn_sub_category": "子类",
            "import_date": "导入日期",
            "part": "配件",
            "b_product": "B品",
            "n_product": "N品",
            "type": "类型",
            "de_renew_available_qty": "德仓Renew库存",
            "default_code": "SKU",
            "product_number": "Product Number",
            "fba_stock_qty": "FBA库存",
            "frei_field_4": "F4",
            "location_code": "库位",
            "location_quantity": "Location Quantity",
            "min_pack": "Min Pack",
            "name": "Name",
            "pack_product": "Pack Product",
            "pre_sale": "预售",
            "pre_sale_quantity": "预售库存",
            "product_url": "产品链接",
            "stock_available_quantity": "可用库存",
            "stock_de_available_qty": "德仓可用库存",
            "stock_de_onhand_qty": "Stock DE Onhand Qty",
            "stock_details": "Stock Details",
            "stock_onhand_quantity": "Stock Onhand Quantity",
            "stock_uk_available_qty": "英仓可用库存",
            "stock_uk_onhand_qty": "Stock  UK Onhand Qty"
        },
        "action": {
            "create": "新建",
            "batch-create": "EXCEL导入",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "copy": "复制",
            "pass": "审核",
            "onApiEdit": "api接口管理",
            "import_btn": "导入",
            "import_b_basic_product": "ERP产品导入-基础-B品",
            "import_etz_basic_product": "ERP产品导入-基础-配件",
            "reissue_parts_number_modify": "补发配件编号修正",
            "import_create_pack_product": "ERP产品导入-组合-通用创建"
        },
        "forms": {
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
