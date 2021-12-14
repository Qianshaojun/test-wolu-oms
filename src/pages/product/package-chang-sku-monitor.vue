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
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 18 }"
            @reset="formReset"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('forms.quick_search')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="[
                            'fuzzy_search_code',
                            { initialValue: 'sku' }
                        ]"
                        :style="{ width: '130px' }"
                        size="small"
                    >
                        <a-select-option value="sku">
                            {{ $t('columns.default_code') }}
                        </a-select-option>
                        <a-select-option value="package_name">
                            {{ $t('columns.package_name') }}
                        </a-select-option>
                        <a-select-option value="change_no">
                            {{ $t('columns.change_no') }}
                        </a-select-option>
                    </a-select>
                    <a-input
                        v-decorator="['fuzzy_search_value']"
                        :placeholder="$t('plzInput')"
                        :style="{ width: '145px', margin: '0 5px' }"
                        size="small"
                    ></a-input>
                    <a-select
                        v-decorator="[
                            'fuzzy_search_operator',
                            { initialValue: 10 }
                        ]"
                        :style="{ width: '100px' }"
                        size="small"
                    >
                        <a-select-option :value="10">
                            {{ $t('forms.operator_like') }}
                        </a-select-option>
                        <a-select-option :value="20">
                            {{ $t('forms.operator_equal') }}
                        </a-select-option>
                        <a-select-option :value="30">
                            {{ $t('forms.operator_list') }}
                        </a-select-option>
                        <a-select-option :value="40">
                            {{ $t('forms.in_or_like') }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['z_category']"
                        style="width: 120px;"
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
                        style="width: 120px;margin-left:5px"
                        placeholder="子类"
                        size="small"
                    >
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.ship_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['ship_date']"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.eta_time')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['eta_time']"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.inbound_time')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['inbound_time']"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.etd_time')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['etd_time']"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.warehouse')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['warehouse_id', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value="">
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="de">DE</a-radio-button>
                        <a-radio-button value="uk">UK</a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.etd_email_time')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['etd_email_time', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value="">
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="not null"
                            >{{ $t('action.yes') }}
                        </a-radio-button>
                        <a-radio-button value="null"
                            >{{ $t('action.no') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.is_change_note')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['is_change_note', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value="">
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true"
                            >{{ $t('action.yes') }}
                        </a-radio-button>
                        <a-radio-button :value="false"
                            >{{ $t('action.no') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.sale_out_email_time')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'sale_out_email_time',
                            { initialValue: '' }
                        ]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value="">
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="not null"
                            >{{ $t('action.yes') }}
                        </a-radio-button>
                        <a-radio-button value="null"
                            >{{ $t('action.no') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.ship_status')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['ship_status', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value="">
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of $dict.ShipStatus"
                            :key="item.value"
                            >{{ $t(item.label) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.inbound_email_time')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'inbound_email_time',
                            { initialValue: '' }
                        ]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value="">
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="not null"
                            >{{ $t('action.yes') }}
                        </a-radio-button>
                        <a-radio-button value="null"
                            >{{ $t('action.no') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-button
                    type="primary"
                    @click="onUpdateMemo"
                    :disabled="!selectedRowKeys.length"
                    style="margin-left: 2px"
                    >{{ $t('action.update_add_memo') }}
                </a-button>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important;">
            <div v-if="!groupbyList.length">
                <AutoColumnTable
                    :stripe="true"
                    :data="data"
                    :page="pageService"
                    :queryNameAuth="allNameAuth"
                    rowKey="id"
                    :columns="columnList"
                    :rowSelection="{
                        selectedRowKeys: selectedRowKeys,
                        onChange: keys => (selectedRowKeys = keys)
                    }"
                    @on-page-change="getManualList"
                    @onClick="
                        record => {
                            selectedRowKeys = [record]
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 1560, y: 500 }"
                    :queryUrl="queryUrl"
                    :menu_code="menu_code"
                    :queryCondition="queryCondition"
                    :selectedRowCnt="selectedRowKeys.length"
                >
                    <span slot="check_render" slot-scope="text"
                        ><a-checkbox disabled :checked="text" />
                    </span>
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <span slot="only_show_date" slot-scope="text"
                        >{{ text ? moment(text).format('YYYY-MM-DD') : '' }}
                    </span>
                    <template slot="message_render" slot-scope="text">
                        <span :title="text">{{
                            text
                                ? text.length > 18
                                    ? text.substr(0, 15) + '...'
                                    : text
                                : ''
                        }}</span>
                    </template>
                    <template slot="ship_status" slot-scope="text, row">
                        {{ row.ship_status | dict('ShipStatus') | translate }}
                    </template>
                </AutoColumnTable>
            </div>
            <GroupbyTable
                v-else
                ref="groupbyTable"
                :groupByColumn="groupbyList"
                :oColumns="columnList"
                :queryNameAuth="allNameAuth"
                :urlStr="queryUrl"
                @selectChange="onSelectChange"
                :scrollX="1560"
                :scrollY="500"
            >
                <span slot="check_render" slot-scope="text"
                    ><a-checkbox disabled :checked="text" />
                </span>
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
                <span slot="only_show_date" slot-scope="text"
                    >{{ text ? moment(text).format('YYYY-MM-DD') : '' }}
                </span>
                <template slot="message_render" slot-scope="text">
                    <span :title="text">{{
                        text
                            ? text.length > 18
                                ? text.substr(0, 15) + '...'
                                : text
                            : ''
                    }}</span>
                </template>
                <template slot="ship_status" slot-scope="text, row">
                    {{ row.ship_status | dict('ShipStatus') | translate }}
                </template>
            </GroupbyTable>
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
import UploadExcel from '~/shared/common/upload-excel.vue'
import router from '../../router'
import moment from 'moment'
import SellerView from '~/components/seller_instance/seller_view.vue'
import SellerApiEdit from '~/components/seller_instance/seller-api-edit.vue'
import { ReportService } from '../../services/report.service'
import { ProductService } from '../../services/product.service'
import ManualDetail from '@/components/product/manual-detail.vue'
import ExportCommon from '@/components/common/export-common.vue'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { PublicService } from '@/services/public.service'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import UpdatePackageChangeMemo from '@/components/product/update-package-change-memo.vue'

const userModule = namespace('userModule')
const allUsersModule = namespace('allUsersModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'package-chang-sku-monitor'
})
@Component({
    components: {
        SellerView,
        UploadExcel,
        SellerApiEdit,
        GroupbyTable,
        AutoColumnTable
    }
})
export default class ProductChangSkuMonitor extends Vue {
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

    private innerActionService = new InnerActionService()
    private publicService = new PublicService()

    // 表格数据源
    private data: any[] = []
    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []
    // 表格选择项
    private selectedRowKeys: any[] = []

    private query_conditions: any = []

    private menu_code: any = ''

    private groupbyList: any = []

    private allNameAuth: any = []

    private columnList: any = []

    private queryUrl: any =
        'purchase_management/query_all_package_product_monitor_list'
    private queryCondition: any = []

    private orderBy: any = ''

    public created() {
        this.getCn_cate()
    }

    public mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
        this.menu_code = this.dataForm.menu_code
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

    private moment = moment

    private initialDate: any = []

    /**
     * 获取订单数据
     */
    private getManualList() {
        let params: any = {}
        this.getQueryCondition().then(nowConditions => {
            this.queryCondition = nowConditions
            if (this.groupbyList.length) {
                let groupbyTable: any = this.$refs.groupbyTable
                groupbyTable.getFirstTableData(nowConditions)
            } else {
                params.query_condition = nowConditions
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
                            page: this.pageService,
                            loading: this.loadingService,
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
            }
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

                    let operator = 'like'
                    let fuzzy_search_value = values['fuzzy_search_value']
                    let fuzzy_search_code = values['fuzzy_search_code']

                    let fuzzy_search_operator = values['fuzzy_search_operator']
                    if (fuzzy_search_operator == 10) {
                        operator = 'like'
                    } else if (fuzzy_search_operator == 30) {
                        operator = 'in_or_='
                    } else if (fuzzy_search_operator == 40) {
                        operator = 'in_or_like'
                    }

                    if (fuzzy_search_value) {
                        values[fuzzy_search_code] = fuzzy_search_value
                    }

                    if (values['ref_bind_value']) {
                        let keyName = values['ref_bind_type']
                        values[keyName] = values['ref_bind_value']
                    }

                    delete values['fuzzy_search_value']
                    delete values['fuzzy_search_code']
                    delete values['fuzzy_search_operator']

                    this.query_conditions = CommonService.createQueryCondition(
                        values,
                        {
                            sku: operator,
                            package_name: operator,
                            change_no: operator,
                            active: '=',
                            z_sub_category: 'in',
                            ref_basic_no: 'like',
                            ref_combine_no: 'like',
                            ...formConfig.condition
                        }
                    )

                    var nowConditions: any[] = []
                    for (var item of this.query_conditions.query_condition) {
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
                            if (
                                [
                                    'etd_email_time',
                                    'inbound_email_time',
                                    'sale_out_email_time'
                                ].includes(item.query_name)
                            ) {
                                if (item.value == 'not null') {
                                    item.operate = 'not null'
                                } else if (item.value == 'null') {
                                    item.operate = 'null'
                                }
                            }

                            nowConditions.push(item)
                        }
                    }
                    reslove(nowConditions)
                })
                .catch(err => {
                    this.$message.error(JSON.stringify(err))
                })
        })
    }

    private onEdit(row) {
        router.push({
            name: 'seller-edit',
            params: { seller: row }
        })
    }

    private onUpdateMemo() {
        if (this.selectedRowKeys.length > 1) {
            this.$message.error('只能选择一条数据进行更新')
            return
        }
        let name = this.data
            .filter(x => this.selectedRowKeys.includes(x.id))
            .map(x => x)
        this.$modal
            .open(
                UpdatePackageChangeMemo,
                {
                    params: name[0]
                },
                {
                    title: this.$t('action.update_add_memo'),
                    width: '800px'
                }
            )
            .subscribe(data => {
                this.$message.success('Update Success')
                this.getManualList()
            })
    }

    private onDelete(row) {}

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

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }

    private onTypeChange(e) {
        this.$nextTick(function() {
            this.getManualList()
        })
    }

    private formReset(param) {
        this.selectedList = []
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
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "package_name": "Package Name",
            "change_no": "Change No.",
            "actions": "Actions",
            "default_code": "Default Code",
            "operator": "Operator",
            "ship_status": "Ship Status",
            "warehouse": "Warehouse",
            "ship_date": "Ship Date",
            "inbound_time": " Inbound Time",
            "is_change_note": "Is Change Note",
            "eta_time": "ETA Time",
            "etd_time": "ETD Time",
            "etd_email_time": "ETD Email",
            "inbound_email_time": "Inbound Email",
            "sale_out_email_time": "Sale Out Email"
        },
        "action": {
            "create": "Create",
            "update_add_memo": "Update Add Memo",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "yes": "Yes",
            "no": "No"
        },
        "forms": {
            "quick_search": "Quick Search",
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search",
            "operator_list": "Multi Search",
            "in_or_like": "Multi Like Search",
            "ref_bind_search": "Association Search"
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
            "package_name": "货柜号",
            "change_no": "变更单号",
            "actions": "操作",
            "default_code": "SKU",
            "operator": "操作",
            "ship_status": "货运状态",
            "warehouse": "仓库",
            "ship_date": "发船日期",
            "inbound_time": " 入库日期",
            "is_change_note": "变更备注",
            "eta_time": "ETA日期",
            "etd_time": "ETD日期",
            "etd_email_time": "ETD邮件",
            "inbound_email_time": "入库邮件",
            "sale_out_email_time": "历史售空邮件"
        },
        "action": {
            "create": "新建",
            "update_add_memo": "更新追加备注",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "yes": "是",
            "no": "否"
        },
        "forms": {
            "quick_search": "快速查找",
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量查询",
            "in_or_like": "批量模糊",
            "ref_bind_search": "通用关联查找"
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
