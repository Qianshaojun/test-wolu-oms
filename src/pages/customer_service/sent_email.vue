<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <section class="component edit-customer ">
            <data-form
                ref="dataForm"
                @submit="getEmailList"
                v-show="isShow"
                :customLayout="true"
                :actions="true"
            >
                <template #default>
                    <a-row>
                        <a-col :span="6">
                            <a-form-item
                                :label="$t('receiver')"
                                style="height:35px;margin:0;"
                            >
                                <a-input
                                    v-decorator="['email_to']"
                                    size="small"
                                    :placeholder="$t('plzInput')"
                                ></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :span="10">
                            <a-form-item
                                :label="$t('status')"
                                style="height:35px;margin:0;"
                            >
                                <a-radio-group
                                    v-decorator="[
                                        'state',
                                        {
                                            initialValue: ''
                                        }
                                    ]"
                                    size="small"
                                    buttonStyle="solid"
                                    @change="e => onStatusChange(e)"
                                >
                                    <a-radio-button value>
                                        {{ $t('dict.all') }}
                                    </a-radio-button>
                                    <a-radio-button
                                        :value="item.value"
                                        v-for="item of $dict.SentEmailStatus"
                                        :key="item.value"
                                        >{{ $t(item.label) }}
                                    </a-radio-button>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="6">
                            <a-form-item
                                :label="$t('addresser')"
                                style="height:35px;margin:0;"
                            >
                                <a-input
                                    v-decorator="['email_from']"
                                    size="small"
                                    :placeholder="$t('plzInput')"
                                ></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :span="10">
                            <a-form-item
                                :label="$t('time')"
                                style="height:35px;margin:0;"
                            >
                                <a-range-picker
                                    show-time
                                    v-decorator="['date', { initialValue: [] }]"
                                    :style="{ width: '260px' }"
                                    format="YYYY-MM-DD HH:mm"
                                    size="small"
                                />
                                <a-button
                                    @click="fillToday('date')"
                                    size="small"
                                    type="primary"
                                    style="margin-left:5px;"
                                    >{{ $t('today') }}
                                </a-button>
                                <a-button
                                    @click="fillYesterday('date')"
                                    size="small"
                                    type="primary"
                                    style="margin-left:5px;"
                                    >{{ $t('yesterday') }}
                                </a-button>
                                <a-button
                                    @click="fill3day('date')"
                                    size="small"
                                    type="primary"
                                    style="margin-left:5px;"
                                    >{{ $t('3day') }}
                                </a-button>
                                <a-button
                                    @click="fill3days('date')"
                                    size="small"
                                    type="primary"
                                    style="margin-left:5px;"
                                    >{{ $t('3days') }}
                                </a-button>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="6">
                            <a-form-item
                                :label="$t('title')"
                                style="height:35px;margin:0;"
                            >
                                <a-input
                                    v-decorator="['subject']"
                                    size="small"
                                    :placeholder="$t('plzInput')"
                                ></a-input>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </template>
            </data-form>

            <a-card class="margin-y autoFlex">
                <template v-if="groupByList.length">
                    <GroupByTable
                        ref="groupByTable"
                        :groupByColumn="groupByList"
                        :oColumns="columnList"
                        :queryNameAuth="allNameAuth"
                        :urlStr="queryPageUrl"
                        @selectChange="onSelectChange"
                        @rowClick="onTrClick"
                    >
                        <span slot="state" slot-scope="text">
                            {{ text | dict('SentEmailStatus') | translate }}
                        </span>
                        <span slot="date" slot-scope="text">
                            {{ text | datetolocal }}
                        </span>
                        <span slot="subject" slot-scope="text, row">
                            <a @click="onDetail(row)">
                                {{ text }}
                            </a>
                        </span>
                        <span
                            slot="operation"
                            slot-scope="text, row"
                            style="text-align: center"
                        >
                            <a-dropdown>
                                <a-menu slot="overlay">
                                    <a-menu-item @click="onDetail(row)">
                                        {{ $t('action.detail') }}
                                    </a-menu-item>
                                    <template v-if="row.state === 'outgoing'">
                                        <a-menu-item @click="onSend(row)">{{
                                            $t('action.send')
                                        }}</a-menu-item>
                                    </template>
                                    <template
                                        v-if="
                                            row.state === 'outgoing' ||
                                                row.state === 'cancel'
                                        "
                                    >
                                        <a-menu-item
                                            @click="
                                                onChangeStatus('cancel', row)
                                            "
                                            style="color:red"
                                            >{{
                                                $t('action.cancel')
                                            }}</a-menu-item
                                        >
                                    </template>

                                    <a-menu-item
                                        @click="onChangeStatus('outgoing', row)"
                                        v-if="row.state === 'exception'"
                                        >{{ $t('action.retry') }}</a-menu-item
                                    >
                                </a-menu>
                                <a-button>
                                    {{ $t('action.more') }}
                                    <a-icon type="down" />
                                </a-button>
                            </a-dropdown>
                        </span>
                    </GroupByTable>
                </template>
                <template v-else>
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
                        @on-page-change="getEmailList"
                        @onClick="
                            record => {
                                selectedRowKeys = [record]
                                onTrClick(record)
                            }
                        "
                        @tbchange="onTableChange"
                        :scroll="{
                            x: 1200
                        }"
                    >
                        <span slot="state" slot-scope="text">
                            {{ text | dict('SentEmailStatus') | translate }}
                        </span>
                        <span slot="date" slot-scope="text">
                            {{ text | datetolocal }}
                        </span>
                        <span slot="subject" slot-scope="text, row">
                            <a @click="onDetail(row)">
                                {{ text }}
                            </a>
                        </span>
                        <span
                            slot="operation"
                            slot-scope="text, row"
                            style="text-align: center"
                        >
                            <a-dropdown>
                                <a-menu slot="overlay">
                                    <a-menu-item @click="onDetail(row)">
                                        {{ $t('action.detail') }}
                                    </a-menu-item>
                                    <template v-if="row.state === 'outgoing'">
                                        <a-menu-item @click="onSend(row)">{{
                                            $t('action.send')
                                        }}</a-menu-item>
                                    </template>
                                    <template
                                        v-if="
                                            row.state === 'outgoing' ||
                                                row.state === 'cancel'
                                        "
                                    >
                                        <a-menu-item
                                            @click="
                                                onChangeStatus('cancel', row)
                                            "
                                            style="color:red"
                                            >{{
                                                $t('action.cancel')
                                            }}</a-menu-item
                                        >
                                    </template>

                                    <a-menu-item
                                        @click="onChangeStatus('outgoing', row)"
                                        v-if="row.state === 'exception'"
                                        >{{ $t('action.retry') }}</a-menu-item
                                    >
                                </a-menu>
                                <a-button>
                                    {{ $t('action.more') }}
                                    <a-icon type="down" />
                                </a-button>
                            </a-dropdown>
                        </span>
                    </AutoColumnTable>
                </template>
            </a-card>
        </section>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Page } from '@/core/decorators'
import DataForm from '@/shared/components/data-form.vue'
import PageContainer from '@/shared/components/page-container.vue'
import GroupByTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import moment from 'moment'
import { PageService } from '@/bootstrap/services/page.service'
import { CommonService } from '@/shared/utils/common.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { RequestParams } from '@/core/http'
import { LoadingService } from '@/bootstrap/services/loading.service'
import { PublicService } from '@/services/public.service'
import dateMixin from '@/bootstrap/mixins/handleDateMixin'
import { mixins } from 'vue-class-component'

@Page({
    layout: 'workspace',
    name: 'sent_email'
})
@Component({
    components: {
        GroupByTable,
        AutoColumnTable
    }
})
export default class sent_email extends mixins<any>(dateMixin) {
    /**
     *  refs
     * @private
     */

    @Ref()
    readonly pageContainer!: PageContainer

    /**
     *  服务
     * @private
     */
    private pageService = new PageService()
    private innerAction = new InnerActionService()
    private loadingService = new LoadingService()
    private publicService = new PublicService()
    /**
     *  data
     * @private
     */
    private isShow: boolean = true

    private groupByList: any = []
    private columnList: any = []
    private allNameAuth: any = []
    private queryPageUrl: string = 'helpdesk/query_all_mail_mail'
    private rowInfo: any = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    // Auto表格数据源
    private data: any[] = []

    private orderBy: string = ''

    private created() {}

    private mounted() {
        this.groupByList = (this as any).dataForm.checkedGroupbyList
        this.columnList = (this as any).dataForm.tableColumns
        this.allNameAuth = (this as any).dataForm.queryNameAuth
    }

    /**
     *  methods
     * @private
     */

    private onStatusChange(e) {
        this.$nextTick(() => {
            this.getEmailList()
        })
    }

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getEmailList()
    }

    private onSelectChange(rowKeys) {
        this.selectedRowKeys = rowKeys
    }

    private onTrClick() {}

    private getEmailList() {
        ;(this as any).dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                email_to: 'in_or_like',
                email_from: 'in_or_like',
                subject: 'like'
            })
            //处理时间
            let nowConditions = (this as any).transferDate(params)

            if (this.groupByList.length) {
                let groupByTable: any = this.$refs.groupByTable
                groupByTable.getFirstTableData(nowConditions)
            } else {
                params.query_condition = nowConditions
                this.innerAction.setActionAPI(
                    this.queryPageUrl,
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
                            this.$t('tips.save_success')
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
        this.rowInfo = row
        this.$router.push({
            name: 'sent-email-detail',
            params: {
                id: row.id,
                name: `${row.email_to ? row.email_to : ''} 邮件详情`
            }
        })
    }

    private onSend(row) {
        this.innerAction.setActionAPI(
            'helpdesk/send_now_mail_mail',
            CommonService.getMenuCode('sent_email')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        mail_id: row.id
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.getEmailList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onChangeStatus(state, row) {
        this.innerAction.setActionAPI(
            'helpdesk/update_mail_mail_state',
            CommonService.getMenuCode('sent_email')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        mail_id: row.id,
                        state: state
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('成功')
                    this.getEmailList()
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
        "action": {
            "more": "more",
            "cancel": "cancel",
            "detail": "detail",
            "retry": "retry",
            "send": "sendNow"
        },
        "receiver": "recipients",
        "addresser": "addresser",
        "title": "title",
        "time": "time",
        "status": "status",
        "plzInput": "pleaseInput",
        "plzSelect": "pleaseSelect",
        "today": "today",
        "yesterday": "yesterday",
        "3day": "3day",
        "3days": "3days"
    },
    "zh-cn": {
        "action": {
            "more": "更多",
            "cancel": "撤消",
            "detail": "详情",
            "retry": "重新发送",
            "send": "立即发送"
        },
        "receiver": "收件人",
        "addresser": "发件人",
        "title": "标题",
        "time": "时间",
        "status": "状态",
        "plzInput": "请输入",
        "plzSelect": "请选择",
        "today": "今天",
        "yesterday": "昨天",
        "3day": "前天",
        "3days": "近3天"
    }
}
</i18n>
