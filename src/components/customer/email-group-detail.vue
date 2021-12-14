<template>
    <section class="component customer-detail">
        <a-tabs
            defaultActiveKey="base"
            v-model="activeKey"
            @change="e => paneChange(e)"
        >
            <a-tab-pane :tab="$t('base')" key="base">
                <a-table
                    :dataSource="ruleData"
                    :pagination="false"
                    style="table-layout:fixed;max-height:300px;"
                    rowKey="id"
                    :scroll="{ y: 300 }"
                    bordered
                >
                    <a-table-column
                        :title="$t('cs_group_name')"
                        key="cs_group_name"
                        align="center"
                    >
                        <template slot-scope="row">
                            {{ row.cs_group_name }}
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('user_id')"
                        key="user_id"
                        align="center"
                    >
                        <template slot-scope="row">
                            {{ row.user_id | dict2(customerList) }}
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('allot_ratio')"
                        key="allot_ratio"
                        align="right"
                    >
                        <template slot-scope="row">
                            {{ row.allot_ratio }}
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('member_ratio')"
                        key="member_ratio"
                        align="right"
                    >
                        <template slot-scope="row">
                            {{ row.member_ratio }}
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('cs_ratio')"
                        key="cs_ratio"
                        align="right"
                    >
                        <template slot-scope="row">
                            {{ row.cs_ratio }}
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('status')"
                        key="status"
                        align="center"
                    >
                        <template slot-scope="row">
                            <span style="color:red" v-if="row.status == 60">
                                {{
                                    row.status
                                        | dict('EmailGroupStatus')
                                        | translate
                                }}
                            </span>
                            <span v-else>
                                {{
                                    row.status
                                        | dict('EmailGroupStatus')
                                        | translate
                                }}
                            </span>
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('write_date')"
                        key="write_date"
                        align="center"
                    >
                        <template slot-scope="row">
                            {{ row.write_date | datetolocal }}
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('write_uid')"
                        key="write_uid"
                        data-index="write_uid"
                        align="center"
                    >
                        <template slot-scope="row">
                            {{ row.write_uid | dict2(customerList) }}
                        </template>
                    </a-table-column>
                </a-table>
            </a-tab-pane>
            <a-tab-pane :tab="$t('log')" key="log">
                <a-table
                    :dataSource="logs"
                    style="table-layout:fixed;"
                    rowKey="index"
                    :scroll="{ y: 300 }"
                    bordered
                >
                    <a-table-column
                        :title="$t('columns.log_content')"
                        key="log_content"
                        data-index="log_content"
                        align="left"
                        width="40%"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.log_type')"
                        key="log_type"
                        data-index="log_type"
                        align="center"
                        width="15%"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.who_log')"
                        key="who_log"
                        data-index="who_log"
                        align="center"
                        width="15%"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.log_date')"
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
            <!-- <a-tab-pane :tab="$t('product')" key="product">
                33
            </a-tab-pane> -->
        </a-tabs>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import OrderBaseDetail from './order-base-detail.vue'
import OrderCustomerDetail from './order-customer-detail.vue'
import OrderProductDetail from './order-product-detail.vue'
import { OperateLogService } from '@/services/operatelog.service'
import { LoadingService } from '@/bootstrap/services/loading.service'
import { RequestParams } from '@/core/http'
import moment from 'moment'
import UUID from 'uuidjs'

@Component({
    components: {}
})
export default class EmailGroupDetail extends Vue {
    @Prop()
    detail: any

    @Prop()
    customerList: any

    private activeKey: any = 'base'

    private operateLogService = new OperateLogService()

    private loadingService = new LoadingService()

    private logs: any[] = []

    private ruleData: any = []

    private mounted() {
        if (this.detail.length) {
            this.ruleData = this.detail.map(x => {
                x['index'] = UUID.generate()
                x['member_ratio'] = ''
                x['cs_ratio'] = ''
                return x
            })

            this.refreshData()
        }
    }

    @Watch('detail')
    onDetailChange() {
        if (this.detail.length) {
            this.ruleData = this.detail.map(x => {
                x['index'] = UUID.generate()
                x['member_ratio'] = ''
                x['cs_ratio'] = ''
                return x
            })

            this.refreshData()
        }
        this.logs = []
        if (this.activeKey == 'log') {
            this.getLogs()
        }
    }

    private refreshData() {
        let groupArr: any = {}
        for (let i in this.ruleData) {
            if (this.ruleData[i].status == 20) {
                if (groupArr[this.ruleData[i].cs_group_name] != undefined) {
                    groupArr[this.ruleData[i].cs_group_name].push(i)
                } else {
                    groupArr[this.ruleData[i].cs_group_name] = [i]
                }
            }
        }
        let total = 0
        for (let index in groupArr) {
            total = total + groupArr[index].length
        }

        for (let i in this.ruleData) {
            if (this.ruleData[i].status == 20) {
                this.ruleData[i].cs_ratio =
                    Math.floor(
                        (groupArr[this.ruleData[i].cs_group_name].length *
                            1000) /
                            total
                    ) / 10
                let allot_ratio: any = this.ruleData
                    .filter(
                        x =>
                            x.cs_group_name == this.ruleData[i].cs_group_name &&
                            x.status == 20
                    )
                    .reduce((total, item) => {
                        return total + parseInt(item.allot_ratio)
                    }, 0)
                this.ruleData[i].member_ratio =
                    Math.floor(
                        (this.ruleData[i].allot_ratio * 1000) / allot_ratio
                    ) / 10
            }
        }
    }

    private paneChange(key) {
        if (key === 'log' && !this.logs.length) {
            this.getLogs()
        }
    }

    private getLogs() {
        this.operateLogService
            .viewUserOperateChangedLog(
                new RequestParams(
                    {
                        object_name: 'ticket_email_group_list',
                        record_code: this.detail[0].group_id.toString()
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(data => {
                let index = 1
                for (var item of data) {
                    var sysuser = this.customerList.find(
                        x => x.code === item.who_log
                    )
                    item['who_log'] = sysuser ? sysuser.name : item.who_log
                    let localTime = moment.utc(item['log_date']).toDate()
                    item['log_date'] = moment(localTime).format(
                        'YYYY-MM-DD HH:mm'
                    )
                    item['index'] = index++
                }
                this.logs = data
            })
    }
}
</script>

<i18n>
{
  "en-us":{
    "base":"Order Info",
    "customer":"Customer Info",
    "product":"Product Info",
    "user_id":"UserID",
    "allot_ratio":"Allot Ratio",
    "status":"Status",
    "write_date":"Create Date",
    "write_uid":"Creator",
    "log":"Log",
    "cs_group_name":"CS Group Name",
    "cs_ratio":"CS Ratio(%)",
    "member_ratio": "Member Ratio(%)",
    "columns":{
       "log_content":"log_content",
       "log_type":"log_type",
       "who_log":"who_log",
       "log_date":"log_date"
    }
  },
  "zh-cn":{
    "base":"客服分配比例",
    "customer":"客户信息",
    "product":"产品信息",
    "user_id":"客服",
    "allot_ratio":"分配比例",
    "status":"状态",
    "write_date":"创建时间",
    "write_uid":"创建者",
    "log":"日志",
    "cs_group_name":"CS 分组",
    "cs_ratio":"分组占比(%)",
    "member_ratio": "组里个人占比(%)",
    "columns":{
       "log_content":"日志",
       "log_type":"类型",
       "who_log":"操作人",
       "log_date":"日期"
    }
  }
}
</i18n>
