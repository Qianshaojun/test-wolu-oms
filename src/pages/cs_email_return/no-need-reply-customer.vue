<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form
            :extends="extendItems"
            ref="dataForm"
            @submit="getNoNeedReplyList"
            :column="1"
        >
            <!--默认查询-->
            <template #default>
                <a-form-item
                    :label="$t('forms.incoming_email')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['incoming_email', { initialValue: '' }]"
                        :style="{ width: '240px' }"
                        size="small"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of fecthEmailServerList"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.go_amazon_mails2')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['go_amazon_mails2']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.sale_order_num')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['sale_order_num']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.assign_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        v-decorator="['assign_date']"
                        size="small"
                        show-time
                        format="YYYY-MM-DD HH:mm"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('forms.user_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['user_id', { initialValue: '' }]"
                        :style="{ width: '240px' }"
                        size="small"
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
                    :label="$t('forms.no_need_reply')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['no_need_reply', { initialValue: true }]"
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
            <!--操作行为项-->
            <template #action>
                <a-button
                    type="primary"
                    @click="setReply"
                    :disabled="!selectedRowKeys.length"
                >
                    {{ $t('action.setReply') }}
                </a-button>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getNoNeedReplyList"
                @onClick="onTrClick(record)"
                style="table-layout:fixed;"
                :scroll="{ y: 360 }"
            >
                <a-table-column
                    :title="$t('columns.go_amazon_mails2')"
                    key="go_amazon_mails2"
                    data-index="go_amazon_mails2"
                    align="center"
                >
                    <template slot-scope="go_amazon_mails2">
                        <div
                            :data-clipboard-text="go_amazon_mails2"
                            id="copyValue"
                            @click="copyEmail"
                        >
                            {{ go_amazon_mails2 }}
                        </div>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.recv_datetime')"
                    key="recv_datetime"
                    data-index="recv_datetime"
                    align="center"
                >
                    <template slot-scope="recv_datetime"
                        >{{ recv_datetime | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.no_need_reply')"
                    key="no_need_reply"
                    align="center"
                >
                    <template slot-scope="row">
                        <span v-if="row.no_need_reply">
                            <input type="checkbox" checked disabled />
                        </span>
                        <span v-else>
                            <input type="checkbox" disabled />
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.user_id')"
                    key="user_id"
                    data-index="user_id"
                    align="center"
                >
                    <template slot-scope="user_id">
                        {{ user_id | dict2(customerServiceUser) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.assign_date')"
                    key="assign_date"
                    data-index="assign_date"
                    align="center"
                >
                    <template slot-scope="assign_date"
                        >{{ assign_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.incoming_email')"
                    key="incoming_email"
                    data-index="incoming_email"
                    align="center"
                ></a-table-column>
            </data-table>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import OrderDetail from '~/components/orders/order-detail.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import { SellerInstanceService } from '~/services/seller-instance.service'
import Clipboard from 'clipboard'
import { TicketService } from '~/services/ticket.service'
import { UserService } from '~/services/user.service'

import moment from 'moment'
import { EmailService } from '~/services/cs-email.service'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'no-need-reply-customer'
})
@Component({
    components: {}
})
export default class NoNeedReplyCustomer extends Vue {
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
    private emailService = new EmailService()

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    // 表格数据源
    private data: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private created() {
        this.getFetchEmailServerList()

        this.getCustomerServiceUserList()
    }

    private copyEmail() {
        let that = this
        var clipboard = new Clipboard('#copyValue')
        clipboard.on('success', e => {
            this.$message.info(this.$t('Copied Success').toString())
            // 释放内存
            clipboard.destroy()
        })
        clipboard.on('error', e => {
            // 不支持复制
            this.$message.info(this.$t('Copied failure').toString())
            // 释放内存
            clipboard.destroy()
        })
    }

    private mounted() {}

    private fecthEmailServerList: any[] = []
    private ticketService = new TicketService()

    private getFetchEmailServerList() {
        this.ticketService
            .query_fetch_email_server(new RequestParams({}))
            .subscribe(
                data => {
                    this.fecthEmailServerList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private customerServiceUser: any[] = []
    private userService = new UserService()

    private getCustomerServiceUserList() {
        this.userService.customerServiceUser(new RequestParams({})).subscribe(
            data => {
                this.customerServiceUser = data
            },
            err => {
                this.$message.error(err.message)
            }
        )
    }

    private onTrClick(record) {}

    private setReply() {
        this.emailService
            .setNoNeedReplyDone(
                new RequestParams(
                    { id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.getNoNeedReplyList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onCopy() {
        this.$message.info(this.$t('Copied Success').toString())
    }

    private onError() {
        this.$message.info(this.$t('Copied failure').toString())
    }

    /**
     * 获取数据
     */
    private getNoNeedReplyList() {
        this.dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {})

            var nowConditions: any[] = []
            for (var item of params.query_condition) {
                if (item.value.constructor == Array && item.operate !== 'in') {
                    if (item.value.length == 2) {
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
                    if (item.value.length == 2) {
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
                    nowConditions.push(item)
                }
            }
            params.query_condition = nowConditions

            this.emailService
                .queryNoNeedReply(
                    new RequestParams(params, {
                        page: this.pageService,
                        loading: this.loadingService
                    })
                )
                .subscribe(
                    data => {
                        this.data = data
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }
}
</script>

<i18n>
{
    "en-us": {
        "action": {
            "setReply": "Set Reply"
        },
        "columns": {
            "no_need_reply": "No Need Reply",
            "incoming_email": "Receiver",
            "go_amazon_mails2": "Sender",
            "recv_datetime": "Recv Date",
            "sale_order_num": "Order No.",
            "assign_date": "Assign Date",
            "user_id": "Execute User"
        },
        "forms": {
            "no_need_reply": "No Need Reply",
            "incoming_email": "Receiver",
            "go_amazon_mails2": "Sender",
            "sale_order_num": "Order No.",
            "assign_date": "Assign Date",
            "user_id": "Execute User"
        }
    },
    "zh-cn": {
        "action": {
            "setReply": "设为已回复"
        },
        "columns": {
            "no_need_reply": "无需回复",
            "incoming_email": "收件人",
            "go_amazon_mails2": "发件人",
            "recv_datetime": "收件时间",
            "sale_order_num": "订单号",
            "assign_date": "分配时间",
            "user_id": "客服"
        },
        "forms": {
            "no_need_reply": "无需回复",
            "incoming_email": "收件人",
            "go_amazon_mails2": "发件人",
            "sale_order_num": "订单号",
            "assign_date": "分配时间",
            "user_id": "客服"
        }
    }
}
</i18n>
