<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <data-form
            ref="dataForm"
            @submit="getDataList"
            :column="2"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 16, offset: 1 }"
            :actions="true"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['name']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.req_type')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['req_type', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of $dict.ReplenishmentType"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ $t(item.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.company_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['company_id', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Please select"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of companyList"
                            :key="item.code"
                            :value="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.user_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['user_id']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of systemUsers"
                            :key="item.code"
                            :value="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.date_req')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['date_req']"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.state')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['state', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Please select"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of $dict.ReplenishmentState"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ $t(item.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['default_code']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.warehouse_id')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['warehouse_id', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value
                            >{{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of $dict.WarehouseId"
                            :key="item.value"
                            >{{ $t(item.label) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.is_change_give_date')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'is_change_give_date',
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
                <a-form-item
                    :label="$t('columns.z_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['z_category', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        @change="handleFatherCateChange"
                        placeholder="Please Select"
                        :filterOption="filterSelectOption"
                        size="small"
                        allowClear
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="cate in fatherCates"
                            :key="cate"
                        >
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-model="selectedList"
                        :style="{ width: '200px' }"
                        placeholder="Please Select"
                        v-decorator="['z_sub_category', { initialValue: '' }]"
                        :filterOption="filterSelectOption"
                        size="small"
                        mode="multiple"
                        allowClear
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <template #action>
                <a-button type="primary" @click="onCreate" v-auth="'new'"
                    >{{ $t('action.create') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="onBatchVerify('approved')"
                    style="margin-left: 2px"
                    v-auth="'audit'"
                    >{{ $t('action.verify') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="onSplit()"
                    style="margin-left: 2px"
                    :disabled="!selectedRowKeys.length"
                    >补货明细拆分
                </a-button>
                <a-popconfirm
                    :title="$t('delete')"
                    :okText="$t('action.ok')"
                    :cancelText="$t('action.cancel')"
                    placement="left"
                    @confirm="onBatchDelete()"
                    :disabled="!selectedRowKeys.length"
                >
                    <a-button
                        type="primary"
                        :disabled="!selectedRowKeys.length"
                        v-auth="'delete'"
                        >{{ $t('action.delete') }}
                    </a-button>
                </a-popconfirm>
                <!-- <a-button
                    type="primary"
                    @click="exportInfo"
                    style="margin-left: 2px"
                    >{{ $t('action.export') }}
                </a-button> -->
                <a-button
                    type="primary"
                    @click="importInfo"
                    style="margin-left: 2px"
                    v-auth="'import'"
                    >{{ $t('action.import') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="showLog"
                    style="margin-left: 2px"
                    v-auth="'show_log'"
                    >{{ $t('action.showlog') }}
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
                    <span slot="check_render" slot-scope="text"
                        ><a-checkbox disabled :checked="text" />
                    </span>
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <template slot="user_render" slot-scope="text">
                        <span v-if="!text"></span>
                        <span v-else>{{ text | dict2(systemUsers) }}</span>
                    </template>
                    <span
                        slot="show_message_tips"
                        slot-scope="text"
                        :title="text"
                    >
                        {{
                            text
                                ? text.length > 20
                                    ? text.substr(0, 17) + '...'
                                    : text
                                : ''
                        }}
                    </span>
                    <span slot="name" slot-scope="text, row">
                        <a @click.stop="onRowClick(row)">{{ row.name }}</a>
                    </span>
                    <template slot="company" slot-scope="text">
                        <span>{{ getCompanyName(text) }}</span>
                    </template>
                    <span slot="state" slot-scope="text, row">
                        <span :class="row.state == 'refuse' ? 'refuse' : ''">{{
                            row.state | dict('ReplenishmentState') | translate
                        }}</span>
                    </span>
                    <template slot="operation" slot-scope="row">
                        <a-dropdown>
                            <a-menu slot="overlay">
                                <a-menu-item @click="onRowClick(row)">
                                    {{ $t('columns.detail') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'approved')"
                                    v-if="row.state == 'to approve'"
                                >
                                    {{ $t('action.verify') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'draft')"
                                    v-if="row.state == 'cancel'"
                                >
                                    {{ $t('action.reset') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'to approve')"
                                    v-if="row.state == 'draft'"
                                >
                                    {{ $t('action.confirm') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'cancel')"
                                    v-if="
                                        row.state == 'to approve' ||
                                            row.state == 'draft'
                                    "
                                >
                                    {{ $t('action.cancel') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'refuse')"
                                    v-if="row.state == 'refuse'"
                                >
                                    {{ $t('action.refuse') }}
                                </a-menu-item>
                                <a-popconfirm
                                    :title="$t('delete')"
                                    :okText="$t('action.ok')"
                                    :cancelText="$t('action.cancel')"
                                    placement="left"
                                    @confirm="onDelete(row)"
                                >
                                    <a-menu-item
                                        style="cursor:pointer;margin-left:12px;"
                                        class="btnDel"
                                        >{{ $t('action.delete') }}
                                    </a-menu-item>
                                </a-popconfirm>
                            </a-menu>
                            <a-button>
                                {{ $t('action.more') }}
                                <a-icon type="down" />
                            </a-button>
                        </a-dropdown>
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
                :scrollX="1500"
                :scrollY="400"
                @rowClick="onTrClick"
            >
                <span slot="check_render" slot-scope="text"
                    ><a-checkbox disabled :checked="text" />
                </span>
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
                <template slot="user_render" slot-scope="text">
                    <span v-if="!text"></span>
                    <span v-else>{{ text | dict2(systemUsers) }}</span>
                </template>
                <span slot="show_message_tips" slot-scope="text" :title="text">
                    {{
                        text
                            ? text.length > 20
                                ? text.substr(0, 17) + '...'
                                : text
                            : ''
                    }}
                </span>
                <span slot="name" slot-scope="text, row">
                    <a @click.stop="onRowClick(row)">{{ row.name }}</a>
                </span>
                <template slot="company" slot-scope="text">
                    <span>{{ getCompanyName(text) }}</span>
                </template>
                <span slot="state" slot-scope="text, row">
                    <span :class="row.state == 'refuse' ? 'refuse' : ''">{{
                        row.state | dict('ReplenishmentState') | translate
                    }}</span>
                </span>
                <template slot="operation" slot-scope="row">
                    <a-dropdown>
                        <a-menu slot="overlay">
                            <a-menu-item @click="onRowClick(row)">
                                {{ $t('columns.detail') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'approved')"
                                v-if="row.state == 'to approve'"
                            >
                                {{ $t('action.verify') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'draft')"
                                v-if="row.state == 'cancel'"
                            >
                                {{ $t('action.reset') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'to approve')"
                                v-if="row.state == 'draft'"
                            >
                                {{ $t('action.confirm') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'cancel')"
                                v-if="
                                    row.state == 'to approve' ||
                                        row.state == 'draft'
                                "
                            >
                                {{ $t('action.cancel') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'refuse')"
                                v-if="row.state == 'refuse'"
                            >
                                {{ $t('action.refuse') }}
                            </a-menu-item>
                            <a-popconfirm
                                :title="$t('delete')"
                                :okText="$t('action.ok')"
                                :cancelText="$t('action.cancel')"
                                placement="left"
                                @confirm="onDelete(row)"
                            >
                                <a-menu-item
                                    style="cursor:pointer;margin-left:12px;"
                                    class="btnDel"
                                    >{{ $t('action.delete') }}
                                </a-menu-item>
                            </a-popconfirm>
                        </a-menu>
                        <a-button>
                            {{ $t('action.more') }}
                            <a-icon type="down" />
                        </a-button>
                    </a-dropdown>
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
import CommonPage from '~/shared/components/common-page.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '@/shared/utils/common.service'
import ReplenishSplit from '~/components/purchase/replenish-split.vue'
import { formConfig } from '@/config/form.config'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import UploadExcel from '@/shared/common/upload-excel.vue'
import UUID from 'uuidjs'
import LogView from '../../shared/common/log-view.vue'
import { ReportService } from '../../services/report.service'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import GroupbyTable from '~/components/common/groupby-table.vue'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'replenishment-demand'
})
@Component({
    components: {
        ReplenishSplit,
        CommonPage,
        AutoColumnTable,
        GroupbyTable
    }
})
export default class ReplenishmentDemand extends Vue {
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
    private reportService = new ReportService()

    // 表格数据源
    private data: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private orderBy: any = 'create_date desc'

    private current = null

    @datasModule.State
    private companyList

    @datasModule.Action
    private getcompany

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @pageParamsModule.Mutation('changeReplenish')
    private changeReplenish

    @pageParamsModule.Mutation('addCommonPageInfo')
    private addCommonPageInfo

    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []

    private columnList: any = []
    private allNameAuth: any = []
    private groupbyList: any = []
    private queryConsition: any = []

    private queryUrl: any = 'purchase/query_all_purchase_requirement'

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
    }

    private get rules() {
        return {}
    }

    public created() {
        this.getcompany()
        this.getSystemuser()

        this.reportService.query_category_dict(new RequestParams()).subscribe(
            data => {
                this.cateDict = data[0]
                let cateData = data[0]
                for (let i in cateData) {
                    this.fatherCates.push(i)
                }
            },
            error => {
                this.$message.error(error.message)
            }
        )
    }

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }

    public calcStyle() {
        this.$nextTick(() => {
            let doms: any = window.document.getElementsByClassName('refuse')
            if (doms.length) {
                for (let x in doms) {
                    if (
                        doms[x] != undefined &&
                        doms[x].parentNode != undefined &&
                        doms[x].parentNode.parentNode != undefined &&
                        doms[x].parentNode.parentNode.parentNode != undefined
                    ) {
                        let trDom: any =
                            doms[x].parentNode.parentNode.parentNode
                        let cells = trDom.getElementsByTagName('td')
                        for (var c = 0; c < cells.length; c++) {
                            cells[c].style.color = '#d708da'
                        }
                    }
                }
            }
        })
    }

    private getUserName(code) {
        let ret: any = code
        let item = this.systemUsers.find(x => x.code == code)
        if (item) {
            ret = item.name
        }
        return ret
    }

    private getCompanyName(code) {
        let ret: any = code
        let item = this.companyList.find(x => x.code == code)
        if (item) {
            ret = item.name
        }
        return ret
    }

    /**
     * 获取订单数据
     */
    private getDataList() {
        let params: any = {}
        this.getQueryCondition().then(nowConditions => {
            this.queryConsition = nowConditions

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
                            this.calcStyle()
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
        })
    }

    private getQueryCondition() {
        return new Promise((reslove, reject) => {
            this.dataForm
                .validateFields()
                .then((values: any) => {
                    if (this.selectedList.length > 0) {
                        values['z_sub_category'] = this.selectedList
                    } else {
                        delete values['z_sub_category']
                    }

                    if (!values['z_category']) {
                        delete values['z_category']
                    }

                    let params: any = CommonService.createQueryCondition(
                        values,
                        {
                            name: 'like',
                            default_code: 'in_or_like',
                            z_sub_category: 'in',
                            ...formConfig.condition
                        }
                    )

                    var nowConditions: any[] = []
                    for (var item of params.query_condition) {
                        if (
                            item.value.constructor == Array &&
                            item.operate !== 'in'
                        ) {
                            if (
                                item.value.length == 2 &&
                                item.value[0].constructor.name == 'Moment'
                            ) {
                                nowConditions.push({
                                    query_name: item.query_name,
                                    operate: '>=',
                                    value: new Date(
                                        item.value[0].format('YYYY-MM-DD') +
                                            ' 00:00:00'
                                    )
                                })
                            }
                            if (
                                item.value.length == 2 &&
                                item.value[1].constructor.name == 'Moment'
                            ) {
                                nowConditions.push({
                                    query_name: item.query_name,
                                    operate: '<=',
                                    value: new Date(
                                        item.value[1].format('YYYY-MM-DD') +
                                            ' 23:59:59.999999'
                                    )
                                })
                            }
                        } else {
                            nowConditions.push(item)
                        }
                    }
                    reslove(nowConditions)
                })
                .catch(err => {
                    this.$message.error(JSON.stringify(err))
                })
        })
    }

    private onCreate() {
        this.$router.push({
            name: 'replenishment-edit'
        })
    }

    private exportInfo() {}

    private importInfo() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        '/system_api/upload?inner_action=purchase_management/import_purchase_requirement&menu_code=' +
                        CommonService.getMenuCode(),
                    attachmentUrlPath:
                        '/system/download_import_template?type=PurchaseRequirementImport'
                },
                {
                    title: 'Import',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    // this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onSplit() {
        // if(this.selectedRowKeys.length>1) {
        //     this.$message.error('只能选中一条信息进行拆分')
        // }
        let item = this.data.find(x => x.id == this.selectedRowKeys[0])
        if (!item) {
            return
        }
        if (item.state != 'draft') {
            this.$message.error('只有草稿状态的数据才能进行拆分')
            return
        }
        this.innerAction.setActionAPI(
            'purchase_management/query_purchase_requirement_info',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    { req_id: this.selectedRowKeys[0] },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let row = this.data.find(
                        x => x.id == this.selectedRowKeys[0]
                    )
                    if (row) {
                        data[0]['user_purchase'] = row.user_purchase
                        data[0]['state'] = row.state
                        data[0]['purchase_date'] = row.purchase_date
                        data[0]['id'] = row.id
                    }
                    this.$modal
                        .open(
                            ReplenishSplit,
                            {
                                info: data[0],
                                systemUsers: this.systemUsers
                            },
                            {
                                title: this.$t('action.replenish_split'),
                                width: '1000px'
                            }
                        )
                        .subscribe(
                            data => {
                                this.$message.success('操作成功')
                            },
                            err => {
                                this.$message.error(err.message)
                            }
                        )
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onRowClick(row) {
        this.innerAction.setActionAPI(
            'purchase_management/query_purchase_requirement_info',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    { req_id: row.id },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    data[0]['id'] = row.id
                    // data[0]['state'] = row.state
                    let index = 'replenishmentedit' + row.id
                    let params: any = {
                        index: index,
                        id: row.id,
                        info: data,
                        component: 'ReplenishmentEdit'
                    }
                    this.addCommonPageInfo(params)

                    let baseName = this.$t('page_name')

                    this.$router.push({
                        name: 'common-page',
                        path: `/common-page/${index}`,
                        params: {
                            id: index,
                            name: row.name + '-' + baseName
                        }
                    })
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onBatchDelete() {
        this.innerAction.setActionAPI(
            'purchase_management/delete_purchase_requirement',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { req_id_list: this.selectedRowKeys },
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

    private onDelete(record) {
        this.innerAction.setActionAPI(
            'purchase_management/delete_purchase_requirement',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { req_id_list: [record.id] },
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

    private onVerify(record, state) {
        this.innerAction.setActionAPI(
            'purchase_management/update_purchase_requirement_state',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { req_id_list: [record.id], state: state },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    let item = this.data.find(x => x.id == record.id)
                    if (item) {
                        item.state = state
                    }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onBatchVerify(state) {
        this.innerAction.setActionAPI(
            'purchase_management/update_purchase_requirement_state',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { req_id_list: this.selectedRowKeys, state: state },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    for (let i of this.selectedRowKeys) {
                        let item = this.data.find(x => x.id == i)
                        if (item) {
                            item.state = state
                        }
                    }
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

    private showLog() {
        if (this.selectedRowKeys.length > 1) {
            this.$message.error('每次只能查看一条数据的日志')
            return
        }
        this.$modal
            .open(
                LogView,
                {
                    object_name: 'requirement',
                    is_special_table: true,
                    record_code: this.selectedRowKeys[0]
                },
                {
                    title: this.$t('action.showlog'),
                    width: '1000px'
                }
            )
            .subscribe(
                () => {
                    //
                },
                err => {
                    this.$message.error('error')
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
            "company_id": "Company",
            "date_approve": "Approve Date",
            "date_expected": "Expected Date",
            "sales_expected_give_date": "Expected Give Date",
            "date_req": "Req Date",
            "create_date": "Create Date",
            "id": "Id",
            "merchandiser": "Merchandiser",
            "name": "Name",
            "real_state": "Real State",
            "req_type": "Req Type",
            "state": "State",
            "user_approve": "Approve User",
            "user_id": "Requiremnet User",
            "user_purchase": "Purchase User",
            "warehouse_id": "Warehouse",
            "is_change_give_date": "Give Date Changed",
            "is_together_purchase": "Together Purchase",
            "together_require_name": "Together Require Name"
        },
        "action": {
            "action": "Action",
            "create": "Create",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "export": "Export",
            "import": "Import",
            "replenish_split": "ReplenishSplit",
            "verify": "Verify",
            "reset": "Reset",
            "confirm": "Confirm",
            "refuse": "Refuse",
            "showlog": "View Log"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "cancel": "Are you sure cancel?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "page_name": "Requirement Edit"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "columns": {
            "company_id": "公司",
            "date_approve": "审批日期",
            "date_expected": "期望入库",
            "sales_expected_give_date": "期望交期",
            "date_req": "需求日期",
            "create_date": "创建日期",
            "id": "Id",
            "merchandiser": "跟单员",
            "name": "需求编号",
            "real_state": "Real State",
            "req_type": "补货类型",
            "state": "状态",
            "user_approve": "审批人",
            "user_id": "需求人",
            "user_purchase": "采购员",
            "warehouse_id": "仓库",
            "is_change_give_date": "交期变更",
            "is_together_purchase": "合并补货",
            "together_require_name": "合并补货编号"
        },
        "action": {
            "action": "操作",
            "create": "新建",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "export": "导出",
            "import": "导入",
            "replenish_split": "拆分补货需求",
            "verify": "审核",
            "reset": "重置",
            "confirm": "确认",
            "refuse": "确认拒绝",
            "showlog": "查看日志"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "page_name": "补货需求编辑"
    }
}
</i18n>
