<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <data-form
            ref="dataForm"
            @submit="getAutoReplyList"
            :column="1"
            :showHeader="false"
        >
            <!--默认显示项-->
            <template #default>
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
                            {{ $t('yes') }}
                        </a-radio-button>
                        <a-radio-button :value="false">
                            {{ $t('no') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </template>
            <template #action>
                <a-button type="primary" @click="set_up_send_mail_time"
                    >{{ $t('action.set_up_send_mail_time') }}
                </a-button>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="id"
                style="table-layout:fixed;"
                @on-page-change="getAutoReplyList"
                @change="sorter => onTableChange(sorter)"
                :scroll="{ y: 700 }"
            >
                <a-table-column
                    :title="$t('columns.name')"
                    key="name"
                    width="20%"
                    align="left"
                >
                    <template slot-scope="row">
                        {{ row.name }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.from_time')"
                    key="from_time"
                    align="center"
                    width="10%"
                >
                    <template slot-scope="row">
                        {{ row.from_time | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.to_time')"
                    key="to_time"
                    align="center"
                    width="10%"
                >
                    <template slot-scope="row">
                        {{ row.to_time | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.country')"
                    key="country"
                    align="center"
                    width="5%"
                >
                    <template slot-scope="row">
                        {{ row.country }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.interval_number')"
                    key="interval_number"
                    align="center"
                    width="5%"
                >
                    <template slot-scope="row">
                        {{ row.interval_number }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.interval_type')"
                    key="interval_type"
                    align="center"
                    width="8%"
                >
                    <template slot-scope="row">
                        {{ row.interval_type }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.nextcall')"
                    key="nextcall"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.nextcall | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.write_uid')"
                    key="write_uid"
                    align="center"
                    width="12%"
                >
                    <template slot-scope="row"
                        >{{ row.write_uid | dict2(customerServiceUser) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.write_date')"
                    key="write_date"
                    align="center"
                    width="10%"
                    :sorter="true"
                >
                    <template slot-scope="row">
                        {{ row.write_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.active')"
                    key="active"
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
import { Vue, Component, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { PageService } from '~/bootstrap/services/page.service'
import { HelpdeskService } from '../../services/helpdesk.service'
import PageContainer from '../../shared/components/page-container.vue'
import { OperateLogService } from '../../services/operatelog.service'
import { formConfig } from '../../config/form.config'
import SetUpSendTimeCustomerWizard from '../../components/ticket/set-up-send-mail-time-customer.vue'
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

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'customer-auto-reply-manage'
})
@Component({
    components: {
        SetUpSendTimeCustomerWizard
    }
})
export default class CustomerAutoReplyManage extends Vue {
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

    private detail: any = ''

    private langList: any[] = []

    private recvEmailList: any[] = []

    private order_by: any = 'write_date desc'

    private created() {
        this.getCustomerServiceUserList()
    }

    private mounted() {
        this.getAutoReplyList()
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

    private getAutoReplyList() {
        this.dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                ...formConfig.condition
            })

            if (this.order_by) {
                params['order_by'] = this.order_by
            }

            this.helpdeskService
                .query_send_customer_email_time(
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

    private onDetail(row) {}

    private set_up_send_mail_time() {
        this.$modal
            .open(
                SetUpSendTimeCustomerWizard,
                {},
                {
                    title: this.$t('action.set_up_send_mail_time'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getAutoReplyList()
            })
    }

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.order_by = column + ' ' + order
        } else {
            this.order_by = ''
        }

        this.getAutoReplyList()
    }
}
</script>
<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "name": "Name",
            "from_time": "From Time",
            "to_time": "To Time",
            "country": "Country",
            "interval_type": "Interval Unit",
            "write_uid": "Writer",
            "write_date": "Write Date",
            "user_id": "UserID",
            "active": "Active",
            "interval_number": "Interval number",
            "nextcall": "Next Execution Date"
        },
        "action": {
            "operate": "operate",
            "more": "more",
            "detail": "Detail",
            "set_up_send_mail_time": "set up send mail time"
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
            "name": "名称",
            "from_time": "起始时间",
            "to_time": "终止时间",
            "country": "国家代码",
            "interval_type": "间隔单位",
            "write_uid": "修改人",
            "write_date": "修改日期",
            "user_id": "执行用户",
            "active": "Active",
            "interval_number": "间隔数值",
            "nextcall": "下次执行时间"
        },
        "action": {
            "operate": "操作",
            "more": "更多",
            "detail": "详情",
            "set_up_send_mail_time": "设置发送邮件时间"
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
