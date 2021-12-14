<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <data-form
            ref="dataForm"
            @submit="getDataList"
            :column="2"
            :actions="true"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['name']"
                        :style="{ width: '300px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.seller_code')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['seller_code', { initialValue: '' }]"
                        :style="{ width: '240px' }"
                        size="small"
                        placeholder="Please Select"
                        mode="multiple"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of sellerCodeList"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
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
                            是
                        </a-radio-button>
                        <a-radio-button :value="false">
                            否
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.lang_code')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['lang_code', { initialValue: '' }]"
                        :style="{ width: '240px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option key="uk" value="uk"
                            >uk
                        </a-select-option>
                        <a-select-option key="fr" value="fr"
                            >fr
                        </a-select-option>
                        <a-select-option key="de" value="de"
                            >de
                        </a-select-option>
                        <a-select-option key="es" value="es"
                            >es
                        </a-select-option>
                        <a-select-option key="nl" value="nl"
                            >nl
                        </a-select-option>
                        <a-select-option key="it" value="it"
                            >it
                        </a-select-option>
                        <a-select-option key="pl" value="pl"
                            >pl
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.create_uid')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['create_uid', { initialValue: '' }]"
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
                    :label="$t('columns.create_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['create_date', { initialValue: [] }]"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                    <a-button
                        @click="fillToday"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.today') }}
                    </a-button>
                    <a-button
                        @click="fillYestoday"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.yestoday') }}
                    </a-button>
                    <a-button
                        @click="fill3day"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.3day') }}
                    </a-button>
                    <a-button
                        @click="fill3days"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.3days') }}
                    </a-button>
                </a-form-item>
            </template>
            <template #action>
                <a-button @click="onCreateTemplate" type="primary"
                    >{{ $t('action.create_template') }}
                </a-button>
                <a-button @click="importTemplate" type="primary"
                    >{{ $t('action.import_template') }}
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
                    <template slot="active" slot-scope="text">
                        <span v-if="text">已启用</span>
                        <span v-else>未启用</span>
                    </template>
                    <template slot="user_ranger" slot-scope="text">
                        {{ text | dict2(customerServiceUser) }}
                    </template>
                    <template slot="date_ranger" slot-scope="text">
                        {{ text | datetolocal }}
                    </template>
                    <template slot="seller_code" slot-scope="seller_code">
                        <span>{{
                            seller_code ? sellerInstanceDict[seller_code] : ''
                        }}</span>
                    </template>
                    <template slot="operation" slot-scope="row">
                        <a @click="modifyTemplate(row)">编辑 </a>
                        <a @click="changeActive(row, false)" v-if="row.active">
                            停用</a
                        >
                        <a @click="changeActive(row, true)" v-if="!row.active">
                            启用</a
                        >
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
                <template slot="active" slot-scope="text">
                    <span v-if="text">未启用</span>
                    <span v-else>已启用</span>
                </template>
                <template slot="user_ranger" slot-scope="text">
                    {{ text | dict2(customerServiceUser) }}
                </template>
                <template slot="date_ranger" slot-scope="text">
                    {{ text | datetolocal }}
                </template>
                <template slot="seller_code" slot-scope="seller_code">
                    <span>{{
                        seller_code ? sellerInstanceDict[seller_code] : ''
                    }}</span>
                </template>
            </GroupbyTable>
        </a-card>
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
import ModifyEmailTemplate from '../../components/customer/modify-email-template.vue'
import { TicketService } from '../../services/ticket.service'
import { UserService } from '@/services/user.service'
import { OperateLogService } from '../../services/operatelog.service'
import moment from 'moment'
import { SellerInstanceService } from '~/services/seller-instance.service'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'email-template-manage'
})
@Component({
    components: {
        ModifyEmailTemplate,
        GroupbyTable,
        AutoColumnTable
    }
})
export default class EmailTemplate extends Vue {
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
    private sellerInstanceService = new SellerInstanceService()

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
    private sellerCodeList: any[] = []
    private sellerInstanceList: any[] = []

    private orderBy: any = ''

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private columnList: any = []

    private queryUrl: any = '/email/query_template_all'

    private get rules() {
        return {}
    }

    public created() {
        this.getSystemuser()
        this.getSellerCodeList()
        this.getCustomerServiceUserList()
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
    }

    private onGroupbyListChange() {
        this.groupbyList = this.dataForm.checkedGroupbyList
    }

    private initialDate: any = []
    private moment = moment

    private fillToday() {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime())),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()

        this.initialDate = [startDate, endDate]
        values['date_order'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fillYestoday() {
        let day = new Date()
        let endDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['date_order'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fill3day() {
        let day = new Date()
        let endDate = moment(
            this.formatDate(new Date(day.getTime() - 48 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 48 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['date_order'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fill3days() {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 48 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['date_order'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private formatDate(time) {
        // 空数据处理
        if (time === null || time === undefined || time === '') {
            return ''
        }

        let y = time.getFullYear()
        let m = time.getMonth() + 1
        let d = time.getDate()
        let h = time.getHours()
        let mi = time.getMinutes()
        let s = time.getSeconds()
        m = m < 10 ? `0${m}` : m
        d = d < 10 ? `0${d}` : d
        h = h < 10 ? `0${h}` : h
        mi = mi < 10 ? `0${mi}` : mi
        s = s < 10 ? `0${s}` : s
        return `${y}-${m}-${d} 23:59`
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

    private sellerInstanceDict: any = {}

    private getSellerCodeList() {
        this.sellerInstanceService
            .query_seller_name(new RequestParams({}))
            .subscribe(
                data => {
                    this.sellerCodeList = data
                    for (let i of data) {
                        this.sellerInstanceDict[i.code] = i.name
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
            if (values['seller_code'] && values['seller_code'].length > 0) {
                values['seller_code'] = values['seller_code'].join(',')
            }

            let params: any = CommonService.createQueryCondition(values, {
                seller_code: 'in_or_=',
                active: '=',
                create_uid: '=',
                name: 'like',
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

    private importTemplate() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        '/system_api/upload?inner_action=/email/import_email_template&menu_code=' +
                        CommonService.getMenuCode(),
                    uploadParams: {},
                    attachmentUrlPath:
                        '/system/download_import_template?type=EmailTemplateImport'
                },
                {
                    title: 'Import',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    if (data.message.create_msg) {
                        this.$message.warning(data.message.create_msg)
                    }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onCreateTemplate() {
        this.$modal
            .open(
                ModifyEmailTemplate,
                {
                    save_flag: 0,
                    sellerCodeList: this.sellerCodeList
                },
                {
                    title: this.$t('action.create_template'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getDataList()
            })
    }

    private modifyTemplate(row) {
        this.$modal
            .open(
                ModifyEmailTemplate,
                {
                    origin_data: row,
                    save_flag: 1,
                    sellerCodeList: this.sellerCodeList
                },
                {
                    title: this.$t('action.modify_template'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getDataList()
            })
    }

    private changeActive(row, data) {
        this.innerAction.setActionAPI(
            '/email/change_active',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { id: row.id, active: data },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getDataList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
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
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "name": "Template Name",
            "seller_code": "Seller",
            "active": "Active",
            "lang_code": "Lang",
            "create_uid": "Creator",
            "create_date": "Create Date"
        },
        "action": {
            "create_template": "Create Template",
            "import_template": "Import Template",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "export": "Export",
            "today": "Today",
            "yestoday": "Yestoday",
            "3day": "3 Day",
            "3days": "3 Days"
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
        "desc": "this is a Order Page1",
        "columns": {
            "name": "模板名称",
            "seller_code": "店铺",
            "active": "是否启用",
            "lang_code": "语种",
            "create_uid": "创建人",
            "create_date": "创建时间"
        },
        "action": {
            "create_template": "创建模板",
            "import_template": "导入模板",
            "delete": "删除",
            "ok": "是",
            "cancel": "取消",
            "export": "导出",
            "today": "今天",
            "yestoday": "昨天",
            "3day": "前天",
            "3days": "近3天"
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
    }
}
</i18n>
