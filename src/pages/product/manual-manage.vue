<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action>
            <!-- <a-button type="primary" @click="onCreate">{{
                $t('action.create')
            }}</a-button> -->
        </template>
        <data-form
            ref="dataForm"
            @submit="getManualList"
            :column="2"
            @reset="formReset"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        v-decorator="['sku']"
                        :style="{ width: '240px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    ></a-input>
                    <a-select
                        v-decorator="['operator', { initialValue: '=' }]"
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
                    :label="$t('columns.create_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['create_date']"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.import_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['import_date']"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.manual_code')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['manual_code']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.import_status')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['manual_url', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="not_null" key="not_null"
                            >{{ $t('action.import') }}
                        </a-radio-button>
                        <a-radio-button value="null" key="null"
                            >{{ $t('action.not_import') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.manual_version')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['manual_version']"
                        :style="{ width: '240px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="version of versionList"
                            :key="version"
                            :value="version"
                        >
                            {{ version }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['cn_category']"
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
                        style="width: 230px;margin-left:5px"
                        placeholder="子类"
                        size="small"
                    >
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.active')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['active', { initialValue: true }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true">
                            可用
                        </a-radio-button>
                        <a-radio-button :value="false">
                            归档
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-popconfirm
                    :title="$t('cancel')"
                    :okText="$t('action.ok')"
                    :cancelText="$t('action.delete')"
                    placement="left"
                    @confirm="onBatchDelete()"
                    :disabled="!selectedRowKeys.length"
                >
                    <a-button
                        type="primary"
                        :disabled="!selectedRowKeys.length"
                        v-auth="'pigeonhole'"
                    >
                        {{ $t('action.delete') }}
                    </a-button>
                </a-popconfirm>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="resetManual()"
                    v-auth="'reset'"
                >
                    {{ $t('action.resetManual') }}
                </a-button>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="importProductManual()"
                    v-auth="'import'"
                >
                    {{ $t('action.import_product_manual') }}
                </a-button>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="exportProductManual()"
                >
                    {{ $t('action.export_product_manual') }}
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
                @on-page-change="getManualList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                @change="sorter => onTableChange(sorter)"
                style="table-layout:fixed;"
                :queryUrl="queryUrl"
                :queryCondition="queryCondition"
            >
                <a-table-column
                    :title="$t('columns.manual_code')"
                    key="manual_code"
                    width="12%"
                    align="left"
                >
                    <template slot-scope="row">{{ row.manual_code }}</template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.view')"
                    key="manual_url"
                    width="6%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a
                            @click="view_manual_pdf(row.id, row.manual_url)"
                            title="新版说明书"
                        >
                            <a-icon type="file" v-if="row.manual_url" />
                        </a>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.manual_version')"
                    key="manual_version"
                    width="10%"
                    align="left"
                >
                    <template slot-scope="row"
                        >{{ row.manual_version }}
                    </template>
                </a-table-column>

                <a-table-column title="SKU" key="sku" width="15%" align="left">
                    <template slot-scope="row">
                        <span v-if="row.product_url === ''">{{ row.sku }}</span>
                        <span v-else
                            ><a
                                @click="view_old_manual_pdf(row.product_url)"
                                title="老版说明书"
                                >{{ row.sku }}</a
                            ></span
                        ></template
                    >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.doc_code')"
                    key="doc_code"
                    width="12%"
                    align="left"
                >
                    <template slot-scope="row">{{ row.doc_code }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.cn_category')"
                    key="cn_category"
                    width="8%"
                    align="left"
                >
                    <template slot-scope="row">{{ row.cn_category }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.cn_sub_category')"
                    key="cn_sub_category"
                    align="left"
                    width="10%"
                >
                    <template slot-scope="row">
                        {{ row.cn_sub_category }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.create_date')"
                    key="create_date"
                    :sorter="true"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.create_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.import_date')"
                    key="import_date"
                    :sorter="true"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.import_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.active')"
                    key="active"
                    width="6%"
                    align="center"
                >
                    <template slot-scope="row">
                        <span v-if="row.active">
                            <input type="checkbox" checked disabled />
                        </span>
                        <span v-else>
                            <input type="checkbox" disabled />
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
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import UploadExcel from '~/shared/common/upload-excel.vue'
import SellerView from '~/components/seller_instance/seller_view.vue'
import SellerApiEdit from '~/components/seller_instance/seller-api-edit.vue'
import ManualEdit from '~/components/product/manual-edit.vue'
import { ReportService } from '../../services/report.service'
import { ProductService } from '../../services/product.service'
import appConfig from '@/config/app.config'
import { PublicService } from '@/services/public.service'

const userModule = namespace('userModule')
const allUsersModule = namespace('allUsersModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'manual-manage'
})
@Component({
    components: {
        SellerView,
        SellerApiEdit,
        ManualEdit
    }
})
export default class ManualManage extends Vue {
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

    private reportService = new ReportService()

    private productService = new ProductService()

    private orderBy: any = ''

    private queryUrl: any = '/product/query_all_product_manual'
    private queryCondition: any = []

    // 表格数据源
    private data: any[] = []
    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []
    private versionList: any = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private get rules() {
        return {}
    }

    private importProductManual() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/product/import_create_product_manual' },
                {
                    title: '产品说明书导入'
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

    private exportProductManual() {
        this.dataForm.validateFields().then((values: any) => {
            if (this.selectedList.length > 0) {
                values['cn_sub_category'] = this.selectedList
            }
            let operator = values['operator']
            delete values['operator']

            if (operator == 'in' && values['sku']) {
                values['sku'] = values['sku'].split(',')
            }
            let params: any = CommonService.createQueryCondition(values, {
                sku: operator,
                manual_code: 'in_or_like',
                manual_version: '=',
                cn_sub_category: 'in'
            })

            for (let i of params.query_condition) {
                if (i.query_name == 'manual_url') {
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

            let query_condition = encodeURI(
                JSON.stringify(params.query_condition)
            )

            window.open(
                appConfig.server +
                    '/product/export_product_manual?query_condition=' +
                    query_condition
            )
        })
    }

    public created() {
        this.getCn_cate()
        this.getVersionList()
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

    private getVersionList() {
        this.productService
            .query_manual_version(new RequestParams({}))
            .subscribe(
                data => {
                    this.versionList = data
                },
                err => {
                    this.$message.error(err.message)
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
                    values['cn_sub_category'] = this.selectedList
                }
                let operator = values['operator']
                delete values['operator']

                if (operator == 'in' && values['sku']) {
                    values['sku'] = values['sku'].split(',')
                }
                let params: any = CommonService.createQueryCondition(values, {
                    sku: operator,
                    manual_code: 'in_or_like',
                    manual_version: '=',
                    cn_sub_category: 'in'
                })
                var nowConditions: any[] = []

                for (let item of params.query_condition) {
                    if (item.query_name == 'manual_url') {
                        item.operate =
                            item.value == 'null'
                                ? 'null'
                                : item.value == 'not_null'
                                ? 'not null'
                                : '='
                        if (item.operate != '=') {
                            item.value = item.operate
                        }
                    }

                    if (
                        item.value !== undefined &&
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
                            let vle = new Date(startDate.utc())
                            nowConditions.push({
                                query_name: item.query_name,
                                operate: '>=',
                                value: vle
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
                            let vle = new Date(endDate.utc())
                            nowConditions.push({
                                query_name: item.query_name,
                                operate: '<=',
                                value: vle
                            })
                        }
                    } else {
                        nowConditions.push(item)
                    }
                }

                params.query_condition = nowConditions
                this.queryCondition = nowConditions

                if (this.orderBy) {
                    params['order_by'] = this.orderBy
                }

                this.innerActionService.setActionAPI(
                    this.queryUrl,
                    CommonService.getMenuCode()
                )
                this.publicService
                    .queryPagination(
                        new RequestParams(params, {
                            loading: this.loadingService,
                            page: this.pageService,
                            innerAction: this.innerActionService
                        })
                    )
                    .subscribe(
                        data => {
                            this.data = data
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
        this.$modal
            .open(
                ManualEdit,
                {
                    row: row,
                    versionList: this.versionList,
                    fatherCates: this.fatherCates,
                    cateDict: this.cateDict
                },
                {
                    title: this.$t('action.edit'),
                    width: '800px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getManualList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDelete(row) {
        this.productService
            .delete_prod_manual_info(
                new RequestParams(
                    {
                        id_list: [row.id]
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('delete_success')
                    this.$message.success(msg)
                    this.getManualList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private resetManual(row) {
        this.productService
            .reset_prod_manual_info(
                new RequestParams(
                    {
                        id_list: this.selectedRowKeys
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getManualList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onBatchDelete(row) {
        this.productService
            .delete_prod_manual_info(
                new RequestParams(
                    {
                        id_list: this.selectedRowKeys
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('delete_success')
                    this.$message.success(msg)
                    this.getManualList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }

    private view_manual_pdf(id, manual_url) {
        if (manual_url == '') {
            this.$message.info('说明书链接不存在.')
            return
        }

        window.open(
            appConfig.server + '/product/get_product_manual_pdf?manual_id=' + id
        )
    }

    private view_old_manual_pdf(product_url) {
        if (product_url == '') {
            this.$message.info('说明书链接不存在.')
            return
        }

        window.open(
            appConfig.server +
                '/product/get_product_manual_pdf?product_url=' +
                product_url
        )
    }

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }

        this.getManualList()
    }

    private formReset(param) {
        this.selectedList = []
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
            "doc_code": "Document Code",
            "cn_category": "Category",
            "cn_sub_category": "Sub Category",
            "import_date": "Upload Date",
            "create_date": "Import Date",
            "import_status": "Import Status",
            "active": "Active"
        },
        "action": {
            "create": "Create",
            "import_btn": "Import",
            "import_product_manual": "Import Product Manual",
            "export_product_manual": "Export Product Manual",
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
            "resetManual": "Reset"
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
            "doc_code": "文案编码",
            "cn_category": "分类",
            "cn_sub_category": "子类",
            "import_date": "上传时间",
            "create_date": "导入时间",
            "import_status": "说明书上传状态",
            "active": "启用"
        },
        "action": {
            "create": "新建",
            "import_btn": "导入",
            "import_product_manual": "导入产品说明书",
            "export_product_manual": "导出产品说明书",
            "batch-create": "EXCEL导入",
            "edit": "编辑",
            "delete": "归档",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "copy": "复制",
            "pass": "审核",
            "onApiEdit": "api接口管理",
            "import": "已上传",
            "not_import": "未上传",
            "resetManual": "还原"
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
        "delete_success": "归档成功"
    }
}
</i18n>
