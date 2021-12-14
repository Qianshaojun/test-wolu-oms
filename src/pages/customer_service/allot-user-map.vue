<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <data-form
            ref="dataForm"
            @submit="getDataList"
            :column="1"
            :labelCol="{ span: 3 }"
            :wrapperCol="{ span: 16, offset: 1 }"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.user_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        :filterOption="filterSelectOption"
                        v-decorator="['user_id', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        allowClear
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of customerServiceUser"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.status')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['status', { initialValue: 20 }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of $dict.EmailGroupStatus"
                            :key="item.value"
                            >{{ $t(item.label) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.customer_email')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['customer_email']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.recv_email')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        :filterOption="filterSelectOption"
                        v-decorator="['recv_email', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        allowClear
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of recvEmailList"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.allot_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['allot_date']"
                        size="small"
                        format="YYYY-MM-DD HH:mm"
                    />
                </a-form-item>
            </template>
            <template #action>
                <a-button
                    @click="onAssignUser"
                    :disabled="!selectedRowKeys.length"
                    type="primary"
                    >{{ $t('action.change_allot_user') }}
                </a-button>
                <a-button
                    @click="activeData"
                    :disabled="!selectedRowKeys.length"
                    type="primary"
                    >{{ $t('action.activeData') }}
                </a-button>
                <a-button
                    @click="inactiveData"
                    :disabled="!selectedRowKeys.length"
                    type="primary"
                    >{{ $t('action.inactiveData') }}
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
                    @on-page-change="getDataList"
                    @onClick="
                        record => {
                            selectedRowKeys = [record]
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 2000, y: 400 }"
                >
                    <template slot="status" slot-scope="text, row">
                        {{ row.status | dict('EmailGroupStatus') | translate }}
                    </template>
                    <template slot="user_ranger" slot-scope="text">
                        {{ text | dict2(customerServiceUser) }}
                    </template>
                    <template slot="date_ranger" slot-scope="text">
                        {{ text | datetolocal }}
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
                @rowClick="onRowClick"
            >
                <template slot="status" slot-scope="text, row">
                    {{ row.status | dict('EmailGroupStatus') | translate }}
                </template>
                <template slot="user_ranger" slot-scope="text">
                    {{ text | dict2(customerServiceUser) }}
                </template>
                <template slot="date_ranger" slot-scope="text">
                    {{ text | datetolocal }}
                </template>
            </GroupbyTable>
        </a-card>
        <!-- <a-card v-if="detail">
            <ServerCustomerMapDetail :detail="detail"></ServerCustomerMapDetail>
        </a-card>         -->
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
import { formConfig } from '@/config/form.config'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import UUID from 'uuidjs'
import UploadExcel from '@/shared/common/upload-excel.vue'
import ServerCustomerMapDetail from '../../components/customer/server-customer-map-detail.vue'
import ChangeAllotUser from '../../components/customer/change-allot-user.vue'
import { TicketService } from '../../services/ticket.service'
import { UserService } from '@/services/user.service'
import { OperateLogService } from '../../services/operatelog.service'
import moment from 'moment'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'allot-user-map'
})
@Component({
    components: {
        ChangeAllotUser,
        ServerCustomerMapDetail,
        GroupbyTable,
        AutoColumnTable
    }
})
export default class ServerCustomerMap extends Vue {
    // 表格组件
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    // 表格数据源
    private data: any[] = []

    private reasonList: any = []

    private groupbyList: any = []

    private allNameAuth: any = []

    private currencyList: any = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private customerServiceUser: any[] = []
    private customerServiceUserDict: any = {}
    private recvEmailList: any[] = []
    private ticketService = new TicketService()
    private userService = new UserService()
    private operateLogService = new OperateLogService()
    private detail: any = ''

    private orderBy: any = ''

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private columnList: any = []

    private queryUrl: any = '/helpdesk/query_server_customer'

    private get rules() {
        return {}
    }

    public created() {
        this.getSystemuser()
        this.getCustomerServiceUserList()
        this.getRecvEmailList()
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
    }

    private onGroupbyListChange() {
        this.groupbyList = this.dataForm.checkedGroupbyList
    }

    private getRecvEmailList() {
        this.ticketService
            .query_fetch_email_server(new RequestParams({}))
            .subscribe(
                data => {
                    this.recvEmailList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getCustomerServiceUserList() {
        this.userService.customerServiceUser(new RequestParams({})).subscribe(
            data => {
                this.customerServiceUser = data
                for (let i of data) {
                    this.customerServiceUserDict[i.code] = i.name
                }
            },
            err => {
                this.$message.error(err.message)
            }
        )
    }

    /**
     * 获取订单数据
     */
    private getDataList() {
        this.dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                user_id: '=',
                customer_email: 'like',
                recv_email: 'like',
                ...formConfig.condition
            })

            var nowConditions: any[] = []
            for (var item of params.query_condition) {
                if (item.value.constructor == Array && item.operate !== 'in') {
                    if (
                        item.value.length == 2 &&
                        item.value[0].constructor.name == 'Moment'
                    ) {
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '>=',
                            value: new Date(item.value[0])
                        })
                    }
                    if (
                        item.value.length == 2 &&
                        item.value[1].constructor.name == 'Moment'
                    ) {
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '<=',
                            value: new Date(item.value[1])
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
            if (this.groupbyList.length) {
                let groupbyTable: any = this.$refs.groupbyTable
                groupbyTable.getFirstTableData(nowConditions)
            } else {
                params.query_condition = nowConditions
                if (this.orderBy) {
                    params['order_by'] = this.orderBy
                }
                this.innerAction.setActionAPI(
                    this.queryUrl,
                    CommonService.getMenuCode()
                )
                this.publicService
                    .queryPagination(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService,
                            innerAction: this.innerAction
                        })
                    )
                    .subscribe(
                        data => {
                            let msg: any = this.$t('tips.save_success')
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

    private onDetail(row) {
        this.operateLogService
            .viewUserOperateChangedLog(
                new RequestParams(
                    {
                        object_name: 'ticket_allot_user_list',
                        record_code: row.id.toString()
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(data => {
                let index = 1
                for (var item of data) {
                    var sysuser = this.customerServiceUser.find(
                        x => x.code === item.who_log
                    )
                    item['who_log'] = sysuser ? sysuser.name : item.who_log
                    let localTime = moment.utc(item['log_date']).toDate()
                    item['log_date'] = moment(localTime).format(
                        'YYYY-MM-DD HH:mm'
                    )
                    item['index'] = index++
                }
                this.detail = data
                this.$nextTick(() => this.pageContainer.scrollToBottom())
            })
    }

    private onAssignUser() {
        this.$modal
            .open(
                ChangeAllotUser,
                {
                    idList: this.selectedRowKeys,
                    serverList: this.customerServiceUser
                },
                {
                    title: this.$t('action.change_allot_user'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getDataList()
            })
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private onTableChange(pagination, filters, sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getDataList()
    }

    private onSelectChange(rowkeys) {
        this.selectedRowKeys = rowkeys
    }

    private activeData() {
        this.innerAction.setActionAPI(
            '/helpdesk/active_allot_user',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        id_list: this.selectedRowKeys
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.getDataList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private inactiveData() {
        this.innerAction.setActionAPI(
            '/helpdesk/inactive_allot_user',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        id_list: this.selectedRowKeys
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.getDataList()
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
        "columns": {
            "email_group_name": "Email Group Name",
            "recv_email_list": "Recv Email List",
            "status": "Status",
            "lang_id": "Language",
            "write_uid": "Creator",
            "write_date": "Create Date",
            "allot_date": "Allot Date",
            "user_id": "Server",
            "customer_email": "Customer Email",
            "recv_email": "Recv Email",
            "memo": "Memo"
        },
        "action": {
            "create": "Add Item",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "export": "Export",
            "import": "Import",
            "change_allot_user": "Change Allot User",
            "inactiveData": "Inactive",
            "activeData": "Active"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "cancel": "Are you sure cancel?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "page_name": "Logistics Provider Detail"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "columns": {
            "email_group_name": "邮件分组名称",
            "recv_email_list": "收件列表",
            "status": "状态",
            "lang_id": "语种",
            "write_uid": "修改人",
            "write_date": "修改时间",
            "allot_date": "分配日期",
            "user_id": "客服",
            "customer_email": "客户邮箱",
            "recv_email": "收件箱",
            "memo": "备注"
        },
        "action": {
            "create": "新建",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "export": "导出",
            "import": "导入",
            "change_allot_user": "修改客服",
            "inactiveData": "禁用",
            "activeData": "启用"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "page_name": "物流商详情"
    }
}
</i18n>
