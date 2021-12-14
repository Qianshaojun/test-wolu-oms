<template>
    <section class="component order-detail">
        <a-tabs
            defaultActiveKey="base"
            :v-model="activeKey"
            @change="e => onPanelChange(e)"
        >
            <a-tab-pane :tab="$t('base')" key="base">
                <div
                    style="width:100%;height:300px;overflow-y: scroll;"
                    v-html="detail.body"
                ></div>
            </a-tab-pane>
            <a-tab-pane :tab="$t('reply')" key="reply">
                <a-table
                    :dataSource="info"
                    :pagination="false"
                    style="table-layout:fixed;"
                    rowKey="id"
                    bordered
                    :scroll="{ y: 400 }"
                >
                    <a-table-column
                        :title="$t('content')"
                        key="content"
                        align="left"
                        data-index="content"
                        width="70%"
                    >
                        <template slot-scope="content">
                            <div v-html="content"></div>
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('sender_id')"
                        key="sender_id"
                        align="center"
                        data-index="sender_id"
                    >
                        <template slot-scope="sender_id">
                            {{ sender_id }}
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('state')"
                        key="state"
                        align="center"
                        data-index="state"
                    >
                        <template slot-scope="state">
                            {{ state }}
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('time')"
                        key="time"
                        align="center"
                        data-index="time"
                    >
                        <template slot-scope="time">
                            {{ time | datetolocal }}
                        </template>
                    </a-table-column>
                </a-table>
            </a-tab-pane>
            <a-tab-pane :tab="$t('log')" key="log">
                <a-table
                    :dataSource="logs"
                    style="table-layout:fixed;"
                    rowKey="id"
                    bordered
                >
                    <a-table-column
                        :title="$t('log_content')"
                        key="log_content"
                        data-index="log_content"
                        align="left"
                        width="40%"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('log_type')"
                        key="log_type"
                        data-index="log_type"
                        align="center"
                        width="15%"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('who_log')"
                        key="who_log"
                        data-index="who_log"
                        align="center"
                        width="15%"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('log_date')"
                        key="log_date"
                        data-index="log_date"
                        align="center"
                        width="20%"
                    ></a-table-column>
                    <a-table-column
                        title="IP"
                        key="log_ip"
                        data-index="log_ip"
                        align="left"
                    >
                    </a-table-column>
                </a-table>
            </a-tab-pane>
        </a-tabs>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { HelpdeskService } from '@/services/helpdesk.service'
import { RequestParams } from '@/core/http'
import { Mutation, namespace } from 'vuex-class'
import moment from 'moment'

const datasModule = namespace('datasModule')

@Component({
    components: {}
})
export default class TicketDetail extends Vue {
    @Prop()
    detail: any

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private activeKey: any = 'base'

    private logs: any[] = []

    @Watch('detail')
    private onDetailChange() {
        this.info = []
        if (this.activeKey == 'reply') {
            this.getReply()
        } else if (this.activeKey == 'log') {
            this.getLogs()
        }
    }

    private created() {
        this.getSystemuser()
    }

    private info: any[] = []

    private helpdeskService = new HelpdeskService()

    private loadingService = new LoadingService()

    private onPanelChange(e) {
        this.activeKey = e
        if (e == 'reply') {
            this.getReply()
        } else if (e == 'log') {
            this.getLogs()
        }
    }

    private getLogs() {
        this.helpdeskService
            .query_ticket_changed_log(
                new RequestParams({
                    ticket_id: this.detail.id
                })
            )
            .subscribe(
                data => {
                    for (var item of data) {
                        var sysuser = this.systemUsers.find(
                            x => x.code === item.who_log
                        )
                        item['who_log'] = sysuser ? sysuser.name : item.who_log
                        let localTime = moment.utc(item['log_date']).toDate()
                        item['log_date'] = moment(localTime).format(
                            'YYYY-MM-DD HH:mm'
                        )
                    }
                    this.logs = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getReply() {
        this.helpdeskService
            .queryTicketReplyContent(
                new RequestParams({
                    ticket_id: this.detail.id
                })
            )
            .subscribe(
                data => {
                    for (var item of data) {
                        var sysuser = this.systemUsers.find(
                            x => x.code === item.sender_id
                        )
                        item['sender_id'] = sysuser
                            ? sysuser.name
                            : item.sender_id
                        let localTime = moment.utc(item['time']).toDate()
                        item['time'] = moment(localTime).format(
                            'YYYY-MM-DD HH:mm'
                        )
                    }
                    this.info = data
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
  "en-us":{
    "base":"Ticket Detail",
    "reply":"Reply",
    "email":"Email",
    "incoming_email":"Incoming Email",
    "is_reply":"Is Reply",
    "is_read":"Is Read",
    "partner_email":"Partner Email",
    "sale_order_num":"Sale Order Num",
    "username":"Username",
    "log_content":"Content",
    "log_type":"Type",
    "who_log":"CreateUser",
    "log_date":"logDate",
    "content":"Content",
    "sender_id":"Sender Id",
    "state":"State",
    "time":"Time",
    "IP":"IP",
    "log":"Log",
    "lastest":"Lastest"
  },
  "zh-cn":{
    "base":"Ticket详情",
    "reply":"邮件回复",
    "email":"Email",
    "incoming_email":"接受邮箱",
    "is_reply":"回复",
    "is_read":"已读",
    "partner_email":"客户邮箱",
    "sale_order_num":"订单号",
    "username":"用户",
    "log_content":"内容",
    "log_type":"类型",
    "who_log":"修改人",
    "log_date":"修改时间",
    "content":"内容",
    "sender_id":"发件人",
    "state":"状态",
    "time":"时间",
    "IP":"IP",
    "log":"日志",
    "lastest":"最后修改"
  }
}
</i18n>
