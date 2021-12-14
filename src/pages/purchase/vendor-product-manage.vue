<template>
    <page-container ref="pageContainer" :showHeader="true">
        <template #header-action></template>
        <data-form ref="dataForm" @submit="getVendorProductList" :column="2">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('forms.quick_search')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="[
                            'fuzzy_search_code',
                            { initialValue: 10 }
                        ]"
                        :style="{ width: '100px' }"
                        size="small"
                    >
                        <a-select-option :value="10">
                            {{ $t('columns.product_code') }}
                        </a-select-option>
                        <a-select-option :value="20">
                            {{ $t('columns.z_category') }}
                        </a-select-option>
                        <a-select-option :value="30">
                            {{ $t('columns.z_sub_category') }}
                        </a-select-option>
                    </a-select>
                    <a-input
                        v-decorator="['fuzzy_search_value']"
                        :style="{ width: '195px', 'margin-left': '5px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.state')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['price_state', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="draft">
                            {{ $t('dict.draft') }}
                        </a-radio-button>
                        <a-radio-button value="pre_confirm">
                            {{ $t('dict.wait_approve') }}
                        </a-radio-button>
                        <a-radio-button value="auto_confirm">
                            auto confirm
                        </a-radio-button>
                        <a-radio-button value="confirmed">
                            {{ $t('dict.approved') }}
                        </a-radio-button>
                        <a-radio-button value="expired">
                            {{ $t('dict.expired') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.search_type')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['id', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="not_null" key="not_null"
                            >{{ $t('dict.is_exist') }}
                        </a-radio-button>
                        <a-radio-button value="null" key="null"
                            >{{ $t('dict.not_exist') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.name')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="[`name`]"
                        style="width: 300px"
                        :placeholder="$t('plzSelect')"
                        size="small"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item in vendorFullNameList"
                            :key="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-button type="primary" @click="importInfo" v-auth="'import'"
                    >{{ $t('action.import_btn') }}
                </a-button>
                <a-button
                    type="primary"
                    style="margin-left:10px"
                    @click="onApprove"
                    :disabled="!selectedRowKeys.length"
                    v-auth="'audit'"
                    >{{ $t('action.approve') }}
                </a-button>
                <a-button
                    type="primary"
                    style="margin-left:10px"
                    @click="onExtension"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.extension') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="showLog"
                    style="margin-left: 2px"
                    v-auth="'show_log'"
                    >{{ $t('action.showlog') }}
                </a-button>
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
                @on-page-change="getVendorProductList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                style="table-layout:fixed;"
            >
                <a-table-column
                    :title="$t('columns.product_code')"
                    key="default_code"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a @click="onEdit(row)">{{ row.default_code }}</a>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.z_category')"
                    key="z_category"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.z_category }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.z_sub_category')"
                    key="z_sub_category"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.z_sub_category }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.name')"
                    key="name"
                    align="center"
                    width="15%"
                >
                    <template slot-scope="row">
                        {{ row.name | dict2(vendorFullNameList) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.price')"
                    key="price"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.price }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.currency_id')"
                    key="currency_id"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.currency_id | dict2(currencyList) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.current_exchange_rate')"
                    key="current_exchange_rate"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.current_exchange_rate }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.allocation_ratio')"
                    key="allocation_ratio"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ (row.allocation_ratio * 100).toFixed(2) }}%
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.min_qty')"
                    key="min_qty"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.min_qty }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.state')"
                    key="price_state"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.price_state | dict2(stateList) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.date_start')"
                    key="date_start"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ currentDateToLocal(row.date_start) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.date_end')"
                    key="date_end"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ currentDateToLocal(row.date_end) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.memo')"
                    key="price_change_memo"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.price_change_memo }}
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { UserService } from '~/services/user.service'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { CompanyService } from '~/services/company.service'
import { PublicService } from '~/services/public.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { InnerActionService } from '~/bootstrap/services/inner.action.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import UploadExcel from '~/shared/common/upload-excel.vue'
import UUID from 'uuidjs'
import appConfig from '@/config/app.config'
import LogView from '@/shared/common/log-view.vue'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'vendor-product-manage'
})
@Component({
    components: {}
})
export default class VendorManage extends Vue {
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
    private innerActionService = new InnerActionService()
    private publicService = new PublicService()

    // 分页服务
    private pageService = new PageService()

    // 表格数据源
    private data: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    @datasModule.State
    private vendorFullNameList

    @datasModule.Action
    private getVendorFullNameList

    private get rules() {
        return {}
    }

    private currentDateToLocal(date) {
        return CommonService.dateToLocal(date, 'yyyy-MM-dd')
    }

    private getcurrency() {
        this.innerActionService.setActionAPI(
            '/vendor/get_currency_list',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService,
                        innerAction: this.innerActionService
                    }
                )
            )
            .subscribe(
                data => {
                    this.currencyList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private currencyList: any = []

    @pageParamsModule.Mutation('changeVendorProduct')
    private changeVendorProduct

    public created() {
        this.getcurrency()
        this.getVendorFullNameList()
    }

    private stateList: any[] = [
        { code: 'draft', name: this.$t('dict.draft') },
        { code: 'pre_confirm', name: this.$t('dict.wait_approve') },
        { code: 'auto_confirm', name: '' },
        { code: 'confirmed', name: this.$t('dict.approved') },
        { code: 'expired', name: this.$t('dict.expired') }
    ]

    /**
     * 获取订单数据
     */
    private getVendorProductList() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                let fuzzy_search_value = values['fuzzy_search_value']
                if (fuzzy_search_value) {
                    let fuzzy_search_code = values['fuzzy_search_code']
                    let search_field_name = 'name'

                    switch (fuzzy_search_code) {
                        case 10:
                            search_field_name = 'default_code'
                            break
                        case 20:
                            search_field_name = 'z_category'
                            break
                        case 30:
                            search_field_name = 'z_sub_category'
                            break
                        default:
                            search_field_name = 'name'
                    }

                    values[search_field_name] = fuzzy_search_value
                }

                delete values['fuzzy_search_value']
                delete values['fuzzy_search_code']

                let params: any = CommonService.createQueryCondition(values, {
                    default_code: 'like',
                    z_category: 'like',
                    z_sub_category: 'like',
                    name: '='
                })
                for (let i of params.query_condition) {
                    if (i.query_name == 'id') {
                        i.operate =
                            i.value == 'null'
                                ? 'null'
                                : i.value == 'not_null'
                                ? 'not null'
                                : '='
                        if (i.operate != '=') {
                            i.value = i.operate
                        }
                    }
                }
                this.innerActionService.setActionAPI(
                    '/vendor/query_vendor_product_list',
                    CommonService.getMenuCode()
                )

                this.publicService
                    .queryPagination(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService,
                            innerAction: this.innerActionService
                        })
                    )
                    .subscribe(
                        data => {
                            this.data = data
                            for (let item of this.data) {
                                if (!item.id) {
                                    item.id = UUID.generate()
                                }
                            }
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
        this.changeVendorProduct([row])
        router.push({
            name: 'vendor-product-detail',
            path: `/purchase/vendor-product-detail/${row.id}`,
            params: {
                vendorProduct: row,
                vendorList: this.vendorFullNameList
            }
        })
    }

    private onExtension() {
        this.innerActionService.setActionAPI(
            '/vendor/update_validity_period',
            CommonService.getMenuCode()
        )
        let select_rows = this.data.filter(
            x => this.selectedRowKeys.indexOf(x.id) != -1
        )
        for (let item of select_rows) {
            if (!item.name) {
                this.$message.error('不存在记录不允许执行该动作')
                return
            }
        }
        this.publicService
            .modify(
                new RequestParams(
                    { id_list: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerActionService
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getVendorProductList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onApprove() {
        this.innerActionService.setActionAPI(
            '/vendor/update_vendor_product_state',
            CommonService.getMenuCode()
        )
        let select_rows = this.data.filter(
            x => this.selectedRowKeys.indexOf(x.id) != -1
        )
        for (let item of select_rows) {
            if (!item.name) {
                this.$message.error('不存在记录不允许执行该动作')
                return
            }
        }
        this.publicService
            .modify(
                new RequestParams(
                    { id_list: this.selectedRowKeys, data: 'confirmed' },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerActionService
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getVendorProductList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private importInfo() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        '/system_api/upload?inner_action=/vendor/import_vendor_product&menu_code=' +
                        CommonService.getMenuCode()
                },
                {
                    title: 'Import',
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

    private showLog() {
        if (this.selectedRowKeys.length > 1) {
            this.$message.error('每次只能查看一条数据的日志')
            return
        }
        this.$modal
            .open(
                LogView,
                {
                    object_name: 'supplierinfo',
                    is_special_table: true,
                    record_code: this.selectedRowKeys[0]
                },
                {
                    title: this.$t('action.showlog'),
                    width: '1000px'
                }
            )
            .subscribe(
                () => {
                    //
                },
                err => {
                    this.$message.error('error')
                }
            )
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "dict": {
            "all": "All",
            "draft": "Draft",
            "wait_approve": "Wait Approve",
            "approved": "Approved",
            "expired": "Expired",
            "is_exist": "Is Exist",
            "not_exist": "Not Exist"
        },
        "columns": {
            "product_code": "SKU",
            "z_category": "Chinese Category",
            "z_sub_category": "Chinese Sub Category",
            "name": "Vendor",
            "price": "Price",
            "currency_id": "Currency",
            "current_exchange_rate": "Current Exchange Rate",
            "memo": "Memo",
            "allocation_ratio": "Allocation Ratio",
            "min_qty": "Min Order Qty",
            "state": "State",
            "date_start": "Date Start",
            "date_end": "Date End",
            "search_type": "Search Filter"
        },
        "action": {
            "create": "Create",
            "import_btn": "Import",
            "batch-create": "EXCEL Import",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "copy": "Copy",
            "pass": "Check",
            "onApiEdit": "Api Edit",
            "import": "Import",
            "not_import": "Not Import",
            "approve": "Approve",
            "extension": "Extension",
            "showlog": "View Log"
        },
        "forms": {
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search",
            "operator_list": "Multi Search",
            "quick_search": "Quick Search"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "cancel": "Are you sure cancel?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "plzSelect": "Please Select"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "dict": {
            "all": "全部",
            "draft": "草稿",
            "wait_approve": "待审批",
            "approved": "已审批",
            "expired": "已过期",
            "is_exist": "已存在",
            "not_exist": "不存在"
        },
        "columns": {
            "product_code": "SKU",
            "z_category": "中文分类",
            "z_sub_category": "中文子类",
            "name": "供应商",
            "price": "价格",
            "currency_id": "币种",
            "current_exchange_rate": "当时汇率",
            "memo": "备注",
            "allocation_ratio": "分配比例",
            "min_qty": "最小起订量",
            "state": "状态",
            "date_start": "价格有效期从",
            "date_end": "价格有效期至",
            "search_type": "查询过滤"
        },
        "action": {
            "create": "新建",
            "import_btn": "导入",
            "batch-create": "EXCEL导入",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "copy": "复制",
            "pass": "审核",
            "onApiEdit": "api接口管理",
            "import": "已上传",
            "not_import": "未上传",
            "approve": "审批",
            "extension": "延期",
            "showlog": "查看日志"
        },
        "forms": {
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量查询",
            "quick_search": "快速查询"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "plzSelect": "请选择"
    }
}
</i18n>
