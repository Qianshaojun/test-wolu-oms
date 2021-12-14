<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form
            ref="dataForm"
            @submit="getTicketsList"
            :column="2"
            :showHeader="false"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.seller_name')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        :filterOption="filterSelectOption"
                        v-decorator="['mcompany', { initialValue: '' }]"
                        :style="{
                            width: '100%',
                            'max-width': '300px'
                        }"
                        size="small"
                        placeholder="Please Select"
                        @change="e => onSellerCodeChange(e)"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-select-option
                            :value="item.code"
                            v-for="item of sellerCodeList"
                            :key="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.title')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['name']"
                        :style="{ width: '300px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.site_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['country3', { initialValue: '' }]"
                        :style="{
                            width: '100%',
                            'max-width': '300px'
                        }"
                        size="small"
                        placeholder="Please Select"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-select-option
                            :value="item.code"
                            v-for="item of siteList"
                            :key="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item
                    :label="$t('columns.receive_datetime')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        :show-time="isShowTime"
                        v-decorator="['recv_datetime']"
                        size="small"
                        :format="dateFormat"
                        :style="{
                            width: '100%',
                            'max-width': '300px'
                        }"
                    >
                        <template slot="renderExtraFooter">
                            <a-checkbox
                                @change="changeTime"
                                :default-checked="defaultDateCheck"
                            >
                                {{ $t('isNoSelectTime') }}
                            </a-checkbox>
                        </template>
                    </a-range-picker>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.ticket_type')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['ticket_type', { initialValue: '' }]"
                        :style="{
                            width: '100%',
                            'max-width': '300px'
                        }"
                        size="small"
                        placeholder="Please Select"
                        mode="multiple"
                        :filterOption="filterSelectOption"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-select-option
                            :value="item.code"
                            v-for="item of ticketType"
                            :key="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.stock_picking_cancelled')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'stock_picking_cancelled',
                            { initialValue: '' }
                        ]"
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
            <template #collapse>
                <a-form-item
                    :label="$t('columns.is_allot')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['is_allot', { initialValue: '' }]"
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

                <a-form-item
                    :label="$t('columns.assign_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        :show-time="isShowTimeExtra"
                        v-decorator="['assign_date']"
                        size="small"
                        :format="dateFormatExtra"
                        :style="{
                            width: '100%',
                            'max-width': '300px'
                        }"
                    >
                        <template slot="renderExtraFooter">
                            <a-checkbox
                                @change="changeTimeExtra"
                                :default-checked="defaultDateCheckExtra"
                            >
                                {{ $t('isNoSelectTime') }}
                            </a-checkbox>
                        </template>
                    </a-range-picker>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.user_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['user_id', { initialValue: '' }]"
                        :style="{ width: '300px' }"
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
                    :label="$t('columns.is_reply')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['is_reply', { initialValue: '' }]"
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
                <a-form-item
                    :label="$t('columns.is_read')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['is_read', { initialValue: '' }]"
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
                <a-form-item
                    :label="$t('columns.exists_attach')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['exists_attach', { initialValue: '' }]"
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
                <a-form-item
                    :label="$t('columns.go_amazon_mails2')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['go_amazon_mails2']"
                        :style="{ width: '300px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.incoming_email')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['incoming_email']"
                        :style="{ width: '300px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
            </template>
            <template #action>
                <a-button
                    @click="onBatchAssignUser"
                    :disabled="!selectedRowKeys.length"
                    type="primary"
                    >{{ $t('action.assign_user') }}
                </a-button>
                <a-button
                    @click="onBatchAutoAssignUser"
                    :disabled="!selectedRowKeys.length"
                    type="primary"
                    >{{ $t('action.auto_assign_user') }}
                </a-button>
                <a-button
                    @click="onBatchCancelAssignUser"
                    :disabled="!selectedRowKeys.length"
                    type="primary"
                    >{{ $t('action.cancel_assign_user') }}
                </a-button>
                <a-popconfirm
                    :title="$t('action.confirm_picking_cancel')"
                    :okText="$t('action.ok')"
                    :cancelText="$t('action.cancel')"
                    placement="right"
                    @confirm="onBatchCancelPicking()"
                    :disabled="!selectedRowKeys.length"
                >
                    <a-button
                        style="cursor:pointer;margin-left:12px;"
                        type="primary"
                        :disabled="!selectedRowKeys.length"
                        >{{ $t('action.picking_cancel') }}
                    </a-button>
                </a-popconfirm>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex">
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
                    @on-page-change="getTicketsList"
                    @onDblClick="
                        record => {
                            selectedRowKeys = [record]
                            onTrClick(record)
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 1500, y: 400 }"
                >
                    <template slot="name" slot-scope="text, row">
                        <a-popover :title="row.name" trigger="hover">
                            <template slot="content">
                                <div
                                    :id="row.id"
                                    v-html="row.content"
                                    style="height:340px;overflow-y:scroll"
                                ></div>
                            </template>
                            <span
                                :class="calcStyle(row)"
                                :title="row.name"
                                @mouseenter="getContent(row)"
                                >{{
                                    row.name && row.name.length > 68
                                        ? row.name.substr(0, 65) + '...'
                                        : row.name
                                }}</span
                            >
                            <a-icon
                                v-if="row.is_reply"
                                type="check"
                                style="color:blue"
                            ></a-icon>
                        </a-popover>
                        <!-- <div v-else>
                            <span
                                :class="calcStyle(row)"
                                :title="row.name"
                                @mouseenter="getContent(row)"
                                >{{
                                    row.name && row.name.length > 95
                                        ? row.name.substr(0, 92) + '...'
                                        : row.name
                                }}</span
                            >
                            <a-icon
                                v-if="row.is_reply"
                                type="check"
                                style="color:blue"
                            ></a-icon>
                        </div> -->
                    </template>
                    <span slot="check_render" slot-scope="text"
                        ><a-checkbox disabled :checked="text" />
                    </span>
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <span slot="ticket_type" slot-scope="text">
                        {{
                            typeof text == 'object' && text[1] !== undefined
                                ? text[1]
                                : text
                        }}
                    </span>
                    <span
                        slot="operation"
                        slot-scope="operation"
                        class="table-operation"
                    >
                        <a-dropdown>
                            <a-menu slot="overlay">
                                <a-menu-item
                                    v-for="action of actions"
                                    :key="action.action"
                                    @click="onAction(action.action, operation)"
                                >
                                    {{ action.name }}
                                </a-menu-item>
                            </a-menu>
                            <a-button style="margin-left: 8px"
                                >{{ $t('action.more') }}<a-icon type="down" />
                            </a-button>
                        </a-dropdown>
                    </span>
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
            >
                <template slot="name" slot-scope="text, row">
                    <!-- <a-popover :title="row.name" trigger="hover">
                        <template slot="content">
                            <div
                                v-html="row.content"
                                style="height:340px;overflow-y:scroll"
                            ></div>
                        </template>
                    </a-popover> -->

                    <span :class="calcStyle(row)" :title="row.name">{{
                        row.name && row.name.length > 68
                            ? row.name.substr(0, 65) + '...'
                            : row.name
                    }}</span>
                    <a-icon
                        v-if="row.is_reply"
                        type="check"
                        style="color:blue"
                    ></a-icon>
                </template>
                <span slot="check_render" slot-scope="text"
                    ><a-checkbox disabled :checked="text" />
                </span>
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
                <span slot="ticket_type" slot-scope="text">
                    {{
                        typeof text == 'object' && text[1] !== undefined
                            ? text[1]
                            : text
                    }}
                </span>
                <span
                    slot="operation"
                    slot-scope="operation"
                    class="table-operation"
                >
                    <a-dropdown>
                        <a-menu slot="overlay">
                            <a-menu-item
                                v-for="action of actions"
                                :key="action.action"
                                @click="onAction(action.action, operation)"
                            >
                                {{ action.name }}
                            </a-menu-item>
                        </a-menu>
                        <a-button style="margin-left: 8px"
                            >{{ $t('action.more') }}<a-icon type="down" />
                        </a-button>
                    </a-dropdown>
                </span>
            </GroupbyTable>
        </a-card>
        <a-card v-if="detail" class="autoFlexDetail">
            <TicketDetail :detail="detail"></TicketDetail>
        </a-card>
    </page-container>
</template>

<style>
.red-text {
    color: red;
}

.state-text {
    color: #28960c;
}

.orange-text {
    color: orange;
}

.default-text {
    color: #333;
}
</style>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { PageService } from '~/bootstrap/services/page.service'
import { HelpdeskService } from '../../services/helpdesk.service'
import PageContainer from '../../shared/components/page-container.vue'
import { OperateLogService } from '../../services/operatelog.service'
import { formConfig } from '../../config/form.config'
import TicketDetail from '../../components/ticket/ticket-detail.vue'
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
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'ticket-manage'
})
@Component({
    components: {
        TicketDetail,
        GroupbyTable,
        AutoColumnTable
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

    private innerAction = new InnerActionService()
    private publicService = new PublicService()

    private detail: any = ''

    private orderBy: any = ''

    //分组相关变量
    private groupbyList: any = []
    private columnList: any = []
    private allNameAuth: any = []
    private actions: any = [
        {
            name: this.$t('action.detail'),
            action: 'onDetail'
        },
        {
            name: this.$t('action.assign_user'),
            action: 'onAssignUser'
        },
        {
            name: this.$t('action.cancel_assign_user'),
            action: 'onCancelAssign'
        },
        {
            name: this.$t('action.picking_cancel'),
            action: 'onCancelPicking'
        }
    ]

    private queryUrl: any = '/helpdesk/query_all_ticket'

    private created() {
        this.getCustomerServiceUserList()
        this.getSellerNameList()
        this.getTicketTypeList()
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
    }

    private isShowTime: boolean = true
    private dateFormat: string = 'YYYY-MM-DD HH:mm'
    private defaultDateCheck: boolean = false
    private defaultDateCheckExtra: boolean = false
    private isShowTimeExtra: boolean = true
    private dateFormatExtra: string = 'YYYY-MM-DD HH:mm'

    private changeTime(e) {
        if (e.target.checked) {
            this.isShowTime = false
            this.dateFormat = 'YYYY-MM-DD'
            this.defaultDateCheck = true
        } else {
            this.isShowTime = true
            this.dateFormat = 'YYYY-MM-DD HH:mm'
            this.defaultDateCheck = false
        }
    }

    private changeTimeExtra(e) {
        if (e.target.checked) {
            this.isShowTimeExtra = false
            this.dateFormatExtra = 'YYYY-MM-DD'
            this.defaultDateCheckExtra = true
        } else {
            this.isShowTimeExtra = true
            this.dateFormatExtra = 'YYYY-MM-DD HH:mm'
            this.defaultDateCheckExtra = false
        }
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private getTicketsList() {
        this.dataForm.validateFields().then((values: any) => {
            if (
                values['ticket_type'] == '' ||
                values['ticket_type'].length == 0
            ) {
                delete values['ticket_type']
            }
            let params: any = CommonService.createQueryCondition(values, {
                ticket_type: 'in',
                name: 'like',
                incoming_email: 'like',
                go_amazon_mails2: 'like',
                ...formConfig.condition
            })

            var nowConditions: any[] = []
            for (var item of params.query_condition) {
                if (item.value.constructor == Array && item.operate !== 'in') {
                    if (
                        item.value.length == 2 &&
                        item.value[0].constructor.name == 'Moment'
                    ) {
                        //区分是否不需要时间
                        if (
                            this.defaultDateCheck ||
                            this.defaultDateCheckExtra
                        ) {
                            nowConditions.push({
                                query_name: item.query_name,
                                operate: '>=',
                                value: new Date(
                                    item.value[0].format('YYYY-MM-DD') +
                                        ' 00:00:00'
                                )
                            })
                        } else {
                            nowConditions.push({
                                query_name: item.query_name,
                                operate: '>=',
                                value: new Date(item.value[0])
                            })
                        }
                    }
                    if (
                        item.value.length == 2 &&
                        item.value[1].constructor.name == 'Moment'
                    ) {
                        if (
                            this.defaultDateCheck ||
                            this.defaultDateCheckExtra
                        ) {
                            nowConditions.push({
                                query_name: item.query_name,
                                operate: '<=',
                                value: new Date(
                                    item.value[1].format('YYYY-MM-DD') +
                                        ' 23:59:59.999999'
                                )
                            })
                        } else {
                            nowConditions.push({
                                query_name: item.query_name,
                                operate: '<=',
                                value: new Date(item.value[1])
                            })
                        }
                    }
                } else {
                    nowConditions.push(item)
                }
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

    private onTrClick(record) {
        let row = this.data.find(x => x.id == record)
        if (row) {
            this.onDetail(row)
        }
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

    private getSellerNameList() {
        this.mailService.queryTicketSellerName(new RequestParams({})).subscribe(
            data => {
                this.sellerCodeList = data
            },
            err => {
                this.$message.error(err.message)
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

    private getSiteList(key) {
        this.mailService
            .querySiteId(new RequestParams({ ticket_seller_name: key }))
            .subscribe(
                data => {
                    this.siteList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onSellerCodeChange(e) {
        let seller = this.sellerCodeList.find(x => x.code === e)
        if (seller) {
            this.getSiteList(seller.name)
        }
    }

    private onDetail(row) {
        this.helpdeskService
            .queryHelpdeskTicketBody(
                new RequestParams(
                    {
                        ticket_id: row.id
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    data[0].id = row.id
                    this.detail = data[0]
                    // this.$nextTick(() => this.pageContainer.scrollToBottom())
                },
                err => {
                    let info: any = {}
                    info.id = row.id
                    this.detail = info
                    this.$message.error(err.message)
                }
            )
    }

    private onAssignUser(row) {
        this.$modal
            .open(
                AssignUser,
                {
                    tickets: [row.id],
                    userList: this.customerServiceUser
                },
                { title: this.$t('action.assign_user') }
            )
            .subscribe(data => {
                this.helpdeskService
                    .assignTicketUser(
                        new RequestParams(
                            { ticket_id_list: [row.id], user_id: data.user_id },
                            { loading: this.loadingService }
                        )
                    )
                    .subscribe(
                        data => {
                            this.$message.success('分配成功')
                            this.getTicketsList()
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
    }

    private onCancelAssign(row) {
        this.helpdeskService
            .cancelTicketUser(
                new RequestParams(
                    { ticket_id_list: [row.id] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getTicketsList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onCancelPicking(row) {
        this.helpdeskService
            .setPickingCancelledConfirm(
                new RequestParams(
                    {
                        ticket_id_list: [row.id]
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onBatchAssignUser() {
        this.$modal
            .open(
                AssignUser,
                {
                    tickets: this.selectedRowKeys,
                    userList: this.customerServiceUser
                },
                { title: this.$t('action.assign_user') }
            )
            .subscribe(data => {
                this.helpdeskService
                    .assignTicketUser(
                        new RequestParams(
                            {
                                ticket_id_list: this.selectedRowKeys,
                                user_id: data.user_id,
                                force_allot: data.force_allot
                            },
                            { loading: this.loadingService }
                        )
                    )
                    .subscribe(
                        data => {
                            this.$message.success('分配成功')
                            this.getTicketsList()
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
    }

    private onBatchCancelAssignUser() {
        this.helpdeskService
            .cancelTicketUser(
                new RequestParams(
                    { ticket_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getTicketsList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onBatchCancelPicking() {
        this.helpdeskService
            .setPickingCancelledConfirm(
                new RequestParams(
                    {
                        ticket_id_list: this.selectedRowKeys
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onBatchAutoAssignUser() {
        this.helpdeskService
            .auto_allot_email(
                new RequestParams(
                    {
                        ticket_id_list: this.selectedRowKeys
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private calcStyle(row) {
        if (row.state) {
            return 'state-text'
        } else if (row.stock_picking_cancelled) {
            return 'orange-text'
        } else if (!(row.invoice_send in ['0', '1'])) {
            return 'red-text'
        } else {
            return 'default-text'
        }
    }

    private onAction(action, row) {
        if (action == 'onDetail') {
            this.onDetail(row)
        } else if (action == 'onAssignUser') {
            this.onAssignUser(row)
        } else if (action == 'onCancelAssign') {
            this.onCancelAssign(row)
        } else if (action == 'onCancelPicking') {
            this.onCancelPicking(row)
        }
    }

    private onTableChange(pagination, filters, sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getTicketsList()
    }

    private onSelectChange(rowkeys) {
        this.selectedRowKeys = rowkeys
    }

    private getContent(row) {
        if (row.content) {
            return
        }

        this.helpdeskService
            .queryHelpdeskTicketBody(
                new RequestParams(
                    {
                        ticket_id: row.id
                    },
                    { loading: this.loadingService }
                )
            )
            .toPromise()
            .then(data => {
                row['content'] = data && data[0].body
                let dom = window.document.getElementById(row.id)
                if (dom) {
                    dom.innerHTML = data[0].body
                }
            })
    }
}
</script>
<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "open_ticket": "Open Ticket",
            "receive_datetime": "Receive Datetime",
            "customers_name": "Customers Name",
            "subject": "Title",
            "go_amazon_mail1": "Go Amazon Mail1",
            "go_amazon_mail2": "Go Amazon Mail2",
            "ticket_type": "Ticket Type",
            "stock_picking_cancelled": "Stock Picking Cancelled",
            "cancel_memo": "Cancel Memo",
            "picking_cacelled_confirm": "Picking Cacelled Confirm",
            "picking_cacelled_reply": "Picking Cacelled Reply",
            "ticket_state": "Ticket State",
            "invoice_send_status": "Invoice Send Status",
            "customer_email": "Customer Email",
            "go_odoo_order1": "Go Odoo Order1",
            "mcompany": "Company",
            "is_reply": "Is Reply",
            "is_read": "Is Read",
            "assign_date": "Assign Date",
            "user_id": "UserID",
            "seller_name": "Seller Name",
            "site_id": "Site",
            "ticket_type": "Ticket Type",
            "exists_attach": "Exists Attach",
            "incoming_email": "Incoming Email",
            "go_amazon_mails2": "Go Amazon Mails2",
            "title": "Subject",
            "key_title": "Key",
            "key_value": "Value",
            "key_items": "Items",
            "is_allot": "Allot State"
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
            "operation": "operate",
            "more": "more",
            "detail": "Detail",
            "assign_user": "Assign User",
            "auto_assign_user": "Auto Assign User",
            "cancel_assign_user": "Cancel Assign User",
            "picking_cancel": "Cancel Picking",
            "confirm_picking_cancel": "Are you sure to cancel the picking?",
            "ok": "Ok",
            "cancel": "Cancel"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "yes": "Yes",
        "no": "No",
        "isNoSelectTime": "IsNoSelectTime"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "columns": {
            "open_ticket": "打开Ticket",
            "receive_datetime": "收件时间",
            "customers_name": "客户",
            "subject": "标题",
            "go_amazon_mail1": "订单",
            "go_amazon_mail2": "邮箱",
            "ticket_type": "Ticket类型",
            "stock_picking_cancelled": "取消发货",
            "cancel_memo": "取消说明",
            "picking_cacelled_confirm": "确认取消",
            "picking_cacelled_reply": "取消回复",
            "ticket_state": "Ticket 状态",
            "invoice_send_status": "发送状态",
            "customer_email": "客户邮箱",
            "go_odoo_order1": "Odoo 订单1",
            "mcompany": "公司",
            "is_reply": "回复",
            "is_read": "已读",
            "assign_date": "分配日期",
            "user_id": "客服",
            "seller_name": "店铺",
            "site_id": "站点",
            "ticket_type": "邮件类型",
            "exists_attach": "附件",
            "incoming_email": "收件人",
            "go_amazon_mails2": "发件人",
            "title": "标题",
            "key_title": "字段名",
            "key_value": "字段值",
            "key_items": "条数",
            "is_allot": "分配状态"
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
            "operation": "操作",
            "more": "更多",
            "detail": "详情",
            "auto_assign_user": "自动分配",
            "cancel_assign_user": "取消分配",
            "picking_cancel": "确认取消Picking",
            "confirm_picking_cancel": "你确定要取消Picking",
            "ok": "确定",
            "cancel": "取消",
            "assign_user": "手动分配"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "yes": "是",
        "no": "否",
        "isNoSelectTime": "是否不需要时间"
    }
}
</i18n>
