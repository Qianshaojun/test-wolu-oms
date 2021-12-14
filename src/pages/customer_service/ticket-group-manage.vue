<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <data-form
            ref="dataForm"
            @submit="getTicketsList"
            :column="1"
            :showHeader="false"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.user_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['user_id', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        showSearch
                        :filterOption="filterSelectOption"
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
                    :label="$t('columns.recv_email')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['recv_email_list', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        showSearch
                        :filterOption="filterSelectOption"
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
                    :label="$t('columns.email_group_name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['email_group_name']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item :label="$t('columns.lang_id')">
                    <a-select
                        v-decorator="['lang_id', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="PLZ Select"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-select-option
                            :value="item.code"
                            v-for="item of langList"
                            :key="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.ticket_type')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['ticket_type_ids', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Please Select"
                        :filterOption="filterSelectOption"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-select-option
                            :value="',' + item.code.toString() + ','"
                            v-for="item of ticketType"
                            :key="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <template #action>
                <a-button type="primary" @click="onCreate"
                    >{{ $t('action.create') }}
                </a-button>
                <a-button
                    @click="onBatchActive"
                    :disabled="!selectedRowKeys.length"
                    type="primary"
                    >{{ $t('action.active') }}
                </a-button>
                <a-button
                    @click="onBatchStop"
                    :disabled="!selectedRowKeys.length"
                    type="primary"
                    >{{ $t('action.stop') }}
                </a-button>
            </template>
        </data-form>
        <a-card class="margin-y">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="id"
                style="table-layout:fixed;"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getTicketsList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                        onTrClick(record)
                    }
                "
                :scroll="{ x: 1200, y: 700 }"
            >
                <a-table-column
                    :title="$t('columns.email_group_name')"
                    key="email_group_name"
                    width="15%"
                    align="left"
                >
                    <template slot-scope="row">
                        <a
                            :title="row.email_group_name"
                            @click="onDetail(row)"
                            >{{ row.email_group_name }}</a
                        >
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.recv_email_list')"
                    key="recv_email_list"
                    align="left"
                    width="40%"
                >
                    <template slot-scope="row">
                        {{ row.recv_email_list.join(',') }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.ticket_type')"
                    key="ticket_type_ids"
                    align="left"
                    width="15%"
                >
                    <template slot-scope="row">
                        {{
                            row.ticket_type_ids
                                .replace(/(^,)|(,$)/g, '')
                                .split(',')
                                .map(x => {
                                    return ticketDict[x]
                                })
                                .join(',')
                        }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.status')"
                    key="status"
                    width="6%"
                    align="center"
                    dataIndex="status"
                >
                    <template slot-scope="status">
                        <span style="color:red" v-if="status == 60">
                            {{ status | dict('EmailGroupStatus') | translate }}
                        </span>
                        <span v-else>
                            {{ status | dict('EmailGroupStatus') | translate }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.lang_id')"
                    key="lang_id"
                    align="center"
                    width="6%"
                    dataIndex="lang_id"
                >
                    <template slot-scope="lang_id">
                        {{ lang_id | dict2(langList) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.write_uid')"
                    key="write_uid"
                    align="center"
                    dataIndex="write_uid"
                    width="8%"
                >
                    <template slot-scope="write_uid"
                        >{{ write_uid | dict2(customerServiceUser) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.write_date')"
                    key="write_date"
                    align="center"
                    width="10%"
                >
                    <template slot-scope="row">
                        {{ row.write_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('action.operate')"
                    key="action"
                    align="center"
                    width="8%"
                >
                    <template slot-scope="row">
                        <a-dropdown>
                            <a-menu slot="overlay">
                                <a-menu-item @click="onDetail(row)">
                                    {{ $t('action.detail') }}
                                </a-menu-item>
                                <a-menu-item @click="onEdit(row)">
                                    {{ $t('action.edit') }}
                                </a-menu-item>
                                <a-menu-item @click="onStop(row)">
                                    {{ $t('action.stop') }}
                                </a-menu-item>
                                <a-menu-item @click="onActive(row)">
                                    {{ $t('action.active') }}
                                </a-menu-item>
                            </a-menu>
                            <a-button>
                                {{ $t('action.more') }}
                                <a-icon type="down" />
                            </a-button>
                        </a-dropdown>
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
        <a-card v-if="detail">
            <EmailGroupDetail
                :detail="detail"
                :customerList="customerServiceUser"
            ></EmailGroupDetail>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { PageService } from '~/bootstrap/services/page.service'
import { HelpdeskService } from '../../services/helpdesk.service'
import PageContainer from '../../shared/components/page-container.vue'
import { OperateLogService } from '../../services/operatelog.service'
import { formConfig } from '../../config/form.config'
import EmailGroupEdit from '../../components/customer/email-group-edit.vue'
import EmailGroupDetail from '../../components/customer/email-group-detail.vue'
import DataForm from '~/shared/components/data-form.vue'
import { RequestParams } from '../../core/http'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { CommonService } from '../../shared/utils/common.service'
import { Mutation, namespace } from 'vuex-class'
import appConfig from '../../config/app.config'
import ModifyAddress from '../picking/modify-address.vue'
import { UserService } from '@/services/user.service'
import { MailService } from '../../services/mail.service'
import AssignUser from '../../components/ticket/assign-user.vue'
import { GeneralService } from '../../services/general.service'
import { TicketService } from '../../services/ticket.service'
import { parse } from 'uuidjs'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'ticket-group-manage'
})
@Component({
    components: {
        EmailGroupEdit,
        EmailGroupDetail
    }
})
export default class TicketManage extends Vue {
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    private helpdeskService = new HelpdeskService()

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    // 表格数据源
    private data: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private customerServiceUser: any[] = []

    private customerServiceUserDict: any = {}

    private sellerCodeList: any[] = []

    private siteList: any[] = []

    private ticketType: any[] = []

    private ticketDict: any = {}

    private userService = new UserService()

    private mailService = new MailService()

    private generalService = new GeneralService()

    private ticketService = new TicketService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private detail: any = ''

    private langList: any[] = []

    private recvEmailList: any[] = []

    private csGroup: any = []

    private created() {
        this.getCustomerServiceUserList()
        this.getLangList()
        this.getRecvEmailList()
        this.getTicketTypeList()
        this.getCsGroup()
    }

    private mounted() {}

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
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

    private getLangList() {
        this.generalService.queryLangList(new RequestParams()).subscribe(
            data => {
                this.langList = data
            },
            err => {
                let err_msg: any = this.$t('lang_err')
                this.$message.error(err_msg)
            }
        )
    }

    private getTicketTypeList() {
        this.mailService.query_ticket_type(new RequestParams()).subscribe(
            data => {
                this.ticketType = data
                for (let i of data) {
                    this.ticketDict[i.code] = i.name
                }
            },
            err => {
                this.$message.error(err.message)
            }
        )
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

    private getTicketsList() {
        this.dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                user_id: '=',
                email_group_name: 'like',
                recv_email_list: 'like',
                ticket_type_ids: 'like',
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
            this.helpdeskService
                .query_all_email_group(
                    new RequestParams(params, {
                        page: this.pageService,
                        loading: this.loadingService
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
    }

    private onTrClick(record) {
        let row = this.data.find(x => x.id == record)
        if (row) {
            this.onDetail(row)
        }
    }

    private onDetail(row) {
        this.helpdeskService
            .query_user_allot_ratio(
                new RequestParams(
                    {
                        group_id: row.id
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.detail = data.map(x => {
                        x['group_id'] = row.id
                        return x
                    })

                    this.$nextTick(() => this.pageContainer.scrollToBottom())
                },
                err => {
                    let info: any = []
                    this.detail = info
                    this.$message.error(err.message)
                }
            )
    }

    private onCreate() {
        this.$modal
            .open(
                EmailGroupEdit,
                {
                    saveFlag: 0,
                    langList: this.langList,
                    customerList: this.customerServiceUser,
                    recvEmailList: this.recvEmailList,
                    csGroup: this.csGroup
                },
                {
                    title: this.$t('action.add_group'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getTicketsList()
            })
    }

    private onEdit(row) {
        let info = Object.assign({}, row)
        info.ticket_type_ids = info.ticket_type_ids
            .replace(/(^,)|(,$)/g, '')
            .split(',')
            .map(x => parseInt(x))
        this.$modal
            .open(
                EmailGroupEdit,
                {
                    saveFlag: 1,
                    info: info,
                    langList: this.langList,
                    customerList: this.customerServiceUser,
                    recvEmailList: this.recvEmailList,
                    csGroup: this.csGroup
                },
                {
                    title: this.$t('action.edit_group'),
                    width: '1200px'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getTicketsList()
            })
    }

    private onStop(row) {
        this.helpdeskService
            .cancel_email_group_status(
                new RequestParams(
                    {
                        group_id_list: [row.id]
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                () => {
                    this.$message.success('操作成功')
                    this.selectedRowKeys = []
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onActive(row) {
        this.helpdeskService
            .active_email_group_status(
                new RequestParams(
                    {
                        group_id_list: [row.id]
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                () => {
                    this.$message.success('操作成功')
                    this.selectedRowKeys = []
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onBatchStop() {
        this.helpdeskService
            .cancel_email_group_status(
                new RequestParams(
                    {
                        group_id_list: this.selectedRowKeys
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                () => {
                    this.$message.success('操作成功')
                    this.selectedRowKeys = []
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onBatchActive() {
        this.helpdeskService
            .active_email_group_status(
                new RequestParams(
                    {
                        group_id_list: this.selectedRowKeys
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                () => {
                    this.$message.success('操作成功')
                    this.selectedRowKeys = []
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getCsGroup() {
        this.innerAction.setActionAPI(
            'common/query_customer_service_group_info',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    { code_group: 'cs_group_name' },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.csGroup = data
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
            "user_id": "UserID",
            "email_group_name": "Email Group Name",
            "customer_email": "Customer Email",
            "recv_email": "Recv Email",
            "ticket_type": "Ticket Type"
        },
        "form": {
            "status": "Status",
            "customer_code": "Customer Code",
            "company_name": "Company Name",
            "contract_start": "Contract Start Date",
            "remote_file_name": "Router url",
            "contract_end": "Contract End Date",
            "female": "Female",
            "field": "Field"
        },
        "action": {
            "operate": "operate",
            "more": "more",
            "detail": "Detail",
            "assign_user": "Assign User",
            "cancel_assign_user": "Cancel Assign User",
            "picking_cancel": "Cancel Picking",
            "confirm_picking_cancel": "Are you sure to cancel the picking?",
            "ok": "Ok",
            "cancel": "Cancel",
            "assign_user": "Assign User",
            "stop": "Stop",
            "active": "Active",
            "edit": "Edit",
            "add_group": "Add Email Group",
            "edit_group": "Edit Email Group"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "yes": "Yes",
        "no": "No"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "columns": {
            "email_group_name": "邮件分组名称",
            "recv_email_list": "收件列表",
            "status": "状态",
            "lang_id": "语种",
            "write_uid": "创建人",
            "write_date": "创建时间",
            "allot_date": "分配日期",
            "user_id": "客服",
            "email_group_name": "分组名",
            "recv_email": "收件箱",
            "ticket_type": "邮件类型"
        },
        "form": {
            "status": "状态",
            "customer_code": "客户编号",
            "company_name": "公司名称",
            "contract_start": "合同开始日期",
            "contract_end": "合同结束日期",
            "field": "字段"
        },
        "action": {
            "operate": "操作",
            "more": "更多",
            "detail": "详情",
            "assign_user": "分配用户",
            "cancel_assign_user": "取消分配",
            "picking_cancel": "确认取消Picking",
            "confirm_picking_cancel": "你确定要取消Picking",
            "ok": "确定",
            "cancel": "取消",
            "assign_user": "分配用户",
            "stop": "停用",
            "active": "启用",
            "edit": "编辑",
            "add_group": "新建邮件分组",
            "edit_group": "编辑邮件分组"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "yes": "是",
        "no": "否"
    }
}
</i18n>