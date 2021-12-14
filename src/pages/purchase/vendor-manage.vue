<template>
    <page-container ref="pageContainer" :showHeader="true">
        <template #header-action></template>
        <data-form ref="dataForm" @submit="getVendorList" :column="2">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.vendor_name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['vendor_name']"
                        :style="{ width: '195px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    ></a-input>
                    <a-select
                        v-decorator="['operator', { initialValue: '=' }]"
                        :style="{ width: '100px' }"
                        size="small"
                    >
                        <a-select-option value="ilike">
                            {{ $t('forms.operator_like') }}
                        </a-select-option>
                        <a-select-option value="=">
                            {{ $t('forms.operator_equal') }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.vendor_code')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['vendor_code']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.active')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['active', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true">
                            {{ $t('dict.active') }}
                        </a-radio-button>
                        <a-radio-button :value="false">
                            {{ $t('dict.inactive') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-button type="primary" @click="onCreate" v-auth="'new'"
                    >{{ $t('action.create') }}
                </a-button>
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
                        v-auth="'delete'"
                        >{{ $t('action.delete') }}
                    </a-button>
                </a-popconfirm>
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
                @on-page-change="getVendorList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                style="table-layout:fixed;"
            >
                <a-table-column
                    :title="$t('columns.vendor_code')"
                    key="vendor_code"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.vendor_code }}</template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.vendor_name')"
                    key="vendor_name"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a @click="onEdit(row)">{{ row.vendor_name }}</a>
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.vendor_full_name')"
                    key="vendor_full_name"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.vendor_full_name }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.user_purchase')"
                    key="user_purchase"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.user_purchase | dict2(systemUsers) }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.merchandiser')"
                    key="merchandiser"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.merchandiser | dict2(systemUsers) }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.company_id')"
                    key="company_id"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.company_id }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.company_contract')"
                    key="company_contract"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.company_contract }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.contract_phone')"
                    key="contract_phone"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.contract_phone }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.contract_email')"
                    key="contract_email"
                    align="center"
                    width="15%"
                >
                    <template slot-scope="row">
                        {{ row.contract_email }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.company_address')"
                    key="company_address"
                    width="14%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.company_address }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.legal_person')"
                    key="legal_person"
                    width="14%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.legal_person }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.schedule_cycle')"
                    key="schedule_cycle"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.schedule_cycle }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.schedule_type')"
                    key="schedule_type"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ swichScheduleType(row.schedule_type) }}
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
                <a-table-column
                    :title="$t('columns.memo')"
                    key="memo"
                    width="14%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.memo }}
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

import appConfig from '@/config/app.config'

const userModule = namespace('userModule')
const allUsersModule = namespace('allUsersModule')
const pageParamsModule = namespace('pageParamsModule')
const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'vendor-manage'
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

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    // 表格数据源
    private data: any[] = []
    private scheduleTypeList = [
        {
            code: 10,
            name: '不可排期'
        },
        {
            code: 20,
            name: '可短期排期'
        },
        {
            code: 30,
            name: '可长期排期'
        },
        {
            code: '',
            name: ''
        }
    ]
    // 表格选择项
    private selectedRowKeys: any[] = []

    private get rules() {
        return {}
    }

    @pageParamsModule.Mutation('changeVendor')
    private changeVendor

    public created() {
        this.getSystemuser()
    }

    private swichScheduleType(value) {
        var return_value = ''
        switch (value) {
            case 10:
                return_value = '不可排期'
                break
            case 20:
                return_value = '可短期排期'
                break
            case 30:
                return_value = '可长期排期'
                break
            default:
                return_value = ''
        }
        return return_value
    }

    /**
     * 获取订单数据
     */
    private getVendorList() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                let operator = values['operator']
                delete values['operator']

                let params: any = CommonService.createQueryCondition(values, {
                    vendor_name: operator,
                    vendor_code: 'like'
                })
                let ds: any = this.$refs.dataForm

                this.innerActionService.setActionAPI(
                    '/vendor/query_all',
                    ds.menu_code
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
            })
            .catch(err => {
                this.$message.error('请检查查询条件')
            })
    }

    private onEdit(row) {
        this.changeVendor([row])
        router.push({
            name: 'vendor-detail-multi',
            path: `/purchase/vendor-detail-multi/${row.id}`,
            params: {
                id: row.id,
                name: row.vendor_name
            }
        })
    }

    private onCreate() {
        this.$router.push({
            name: 'vendor-detail'
        })
    }

    private onBatchDelete() {
        this.innerActionService.setActionAPI(
            '/vendor/change_active',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { id_list: this.selectedRowKeys, data: false },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerActionService
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.getVendorList()
                },
                err => {
                    this.$message.error(err.message)
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
            "active": "Active",
            "inactive": "Inactive"
        },
        "columns": {
            "vendor_name": "Vendor Name",
            "vendor_full_name": "Vendor Full Name",
            "user_purchase": "Purchase",
            "merchandiser": "Merchandiser",
            "vendor_code": "Vendor Code",
            "company_address": "Company Address",
            "legal_person": "Legal Person",
            "company_id": "Company Id",
            "company_contract": "Company Contract",
            "contract_phone": "Contract Phone",
            "memo": "Memo",
            "contract_email": "Contract Email",
            "active": "Active",
            "schedule_cycle": "Schedule Cycle",
            "schedule_type": "Schedule Type"
        },
        "action": {
            "create": "Create",
            "import_btn": "Import",
            "batch-create": "EXCEL Import",
            "edit": "Edit",
            "delete": "Inactive",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "copy": "Copy",
            "pass": "Check",
            "onApiEdit": "Api Edit",
            "import": "Import",
            "not_import": "Not Import"
        },
        "forms": {
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search",
            "operator_list": "Multi Search"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure Inactive?",
        "cancel": "Are you sure cancel?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Inactive Success"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "dict": {
            "all": "全部",
            "active": "有效",
            "inactive": "无效"
        },
        "columns": {
            "vendor_name": "供应商简称",
            "vendor_full_name": "供应商全称",
            "user_purchase": "采购员",
            "merchandiser": "跟单员",
            "vendor_code": "供应商编码",
            "company_address": "公司地址",
            "legal_person": "法人",
            "company_id": "统一社会信用代码",
            "company_contract": "常用联系人",
            "contract_phone": "联系人电话",
            "memo": "备注",
            "contract_email": "联系人邮箱",
            "active": "状态",
            "schedule_cycle": "排期周期",
            "schedule_type": "排期类型"
        },
        "action": {
            "create": "新建",
            "import_btn": "导入",
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
            "not_import": "未上传"
        },
        "forms": {
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量查询"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认归档?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "归档成功"
    }
}
</i18n>
