<template>
    <page-container ref="pageContainer" :showHeader="false">
        <!-- <template #header-action>
        </template> -->
        <data-form
            ref="dataForm"
            @submit="getUserCustomerEmailList"
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
                        showSearch
                        :filterOption="filterSelectOption"
                        v-decorator="['user_id', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        allowClear
                    >
                        <a-select-option value>{{
                            $t('dict.all')
                        }}</a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of customerServiceUser"
                            :key="item.code"
                            >{{ $t(item.name) }}</a-select-option
                        >
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.status')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['status', { initialValue: '' }]"
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
                            >{{ $t(item.label) }}</a-radio-button
                        >
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
                        <a-select-option value>{{
                            $t('dict.all')
                        }}</a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of recvEmailList"
                            :key="item.code"
                            >{{ $t(item.name) }}</a-select-option
                        >
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
                    >{{ $t('action.change_allot_user') }}</a-button
                >
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
                @on-page-change="getUserCustomerEmailList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                        onTrClick(record)
                    }
                "
                @change="sorter => onTableChange(sorter)"
                :scroll="{ y: 500 }"
            >
                <a-table-column
                    :title="$t('columns.recv_email')"
                    key="recv_email"
                    align="left"
                    width="15%"
                >
                    <template slot-scope="row">
                        {{ row.recv_email }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.user_id')"
                    key="user_id"
                    align="left"
                    width="15%"
                >
                    <template slot-scope="row">
                        {{ row.user_id | dict2(customerServiceUser) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.customer_email')"
                    key="customer_email"
                    width="15%"
                    align="left"
                    dataIndex="customer_email"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.allot_date')"
                    key="allot_date"
                    align="center"
                    width="10%"
                    :sorter="true"
                >
                    <template slot-scope="row">
                        {{ row.allot_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.status')"
                    key="status"
                    width="8%"
                    align="center"
                    dataIndex="status"
                >
                    <template slot-scope="status">
                        {{ status | dict('EmailGroupStatus') | translate }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.write_uid')"
                    key="write_uid"
                    align="center"
                    dataIndex="write_uid"
                    width="10%"
                >
                    <template slot-scope="write_uid">{{
                        write_uid | dict2(customerServiceUser)
                    }}</template>
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
                    :title="$t('columns.memo')"
                    key="memo"
                    align="left"
                    width="10%"
                >
                    <template slot-scope="row">
                        {{ row.memo }}
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
        <a-card v-if="detail">
            <ServerCustomerMapDetail :detail="detail"></ServerCustomerMapDetail>
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
import ChangeAllotUser from '../../components/customer/change-allot-user.vue'
import ServerCustomerMapDetail from '../../components/customer/server-customer-map-detail.vue'
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
import { TicketService } from '../../services/ticket.service'
import moment from 'moment'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'server-customer-map'
})
@Component({
    components: {
        ChangeAllotUser,
        ServerCustomerMapDetail
    }
})
export default class ServerCustomerMap extends Vue {
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

    private ticketService = new TicketService()

    private operateLogService = new OperateLogService()

    private detail: any = ''

    private orderBy: any = ''

    private recvEmailList: any[] = []

    private created() {
        this.getCustomerServiceUserList()
        this.getRecvEmailList()
    }

    private mounted() {}

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

    private getUserCustomerEmailList() {
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

            this.helpdeskService
                .query_all_allot_user(
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
                this.getUserCustomerEmailList()
            })
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
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
        this.getUserCustomerEmailList()
    }
}
</script>
<i18n>
{
  "en-us": {
    "desc": "this is a Order Page1",
    "columns":{
      "email_group_name":"Email Group Name",
      "recv_email_list":"Recv Email List",
      "status":"Status",
      "lang_id":"Language",
      "write_uid":"Creator",
      "write_date":"Create Date",
      "allot_date":"Allot Date",
      "user_id":"Server",
      "customer_email":"Customer Email",
      "recv_email":"Recv Email",
      "memo":"Memo"
    },
    "form":{
       "status":"Status",
       "customer_code":"Customer Code",
       "company_name":"Company Name",
       "contract_start":"Contract Start Date",
       "remote_file_name":"Router url",
       "contract_end":"Contract End Date",
       "female":"Female",
       "field":"Field"
    },
    "action":{
      "operate":"operate",
      "more":"more",
      "detail":"Detail",
      "assign_user":"Assign User",
      "cancel_assign_user":"Cancel Assign User",
      "picking_cancel":"Cancel Picking",
      "confirm_picking_cancel":"Are you sure to cancel the picking?",
      "ok":"Ok",
      "cancel":"Cancel",
      "stop":"Stop",
      "active":"Active",
      "change_allot_user":"Change Allot User"
    },
    "rules":{
       "date_range_error":"start date can't later start date"
    },
    "delete":"Are you sure delete?",
    "fuzzy_search":"Fuzzy Search",
    "yes":"Yes",
    "no":"No"
  },
  "zh-cn": {
    "desc": "这是订单页面1",
    "columns":{
      "email_group_name":"邮件分组名称",
      "recv_email_list":"收件列表",
      "status":"状态",
      "lang_id":"语种",
      "write_uid":"修改人",
      "write_date":"修改时间",
      "allot_date":"分配日期",
      "user_id":"客服",
      "customer_email":"客户邮箱",
      "recv_email":"收件箱",
      "memo":"备注"
    },
    "form":{
       "status":"状态",
       "customer_code":"客户编号",
       "company_name":"公司名称",
       "contract_start":"合同开始日期",
       "contract_end":"合同结束日期",
       "field":"字段"
    },
    "action":{
      "operate":"操作",
      "more":"更多",
      "detail":"详情",
      "assign_user":"分配用户",
      "cancel_assign_user":"取消分配",
      "picking_cancel":"确认取消Picking",
      "confirm_picking_cancel":"你确定要取消Picking",
      "ok":"确定",
      "cancel":"取消",
      "change_allot_user":"修改客服",
      "stop":"停用",
      "active":"启用"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "delete":"是否确认删除?",
    "fuzzy_search":"模糊搜索",
    "yes":"是",
    "no":"否"
  }
}
</i18n>
