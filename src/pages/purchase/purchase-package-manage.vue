<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action> </template>
        <data-form
            ref="dataForm"
            @submit="getDataList"
            :column="3"
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
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['name']"
                        style="width:200px;"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.source_doc1')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['source_doc1']"
                        style="width:200px;"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.package_code')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['package_code']"
                        style="width:200px;"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.company_name')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['company_name', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Please select"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option value="woltu" key="woltu">
                            Woltu
                        </a-select-option>
                        <a-select-option value="eugad" key="eugad">
                            EUGAD
                        </a-select-option>
                        <a-select-option value="situ" key="situ">
                            Situ
                        </a-select-option>
                        <a-select-option value="elight" key="elight">
                            Elight
                        </a-select-option>
                        <a-select-option value="wowo" key="wowo">
                            Wowo
                        </a-select-option>
                        <a-select-option value="meteorsrain" key="meteorsrain">
                            Meteorsrain
                        </a-select-option>
                        <a-select-option value="brichimon" key="brichimon">
                            BRICHIMON LIMITED
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.warehouse_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['warehouse_id', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Please select"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of $dict.WarehouseId"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ $t(item.label) }}
                        </a-select-option>
                    </a-select>
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
                            v-for="item of $dict.PackageOrderState"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ $t(item.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.create_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['create_date']"
                        :style="{ width: '200px' }"
                        format="YYYY-MM-DD"
                        size="small"
                    />
                </a-form-item>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['default_code']"
                        style="width:200px;"
                        size="small"
                    /> </a-form-item
                ><a-form-item
                    :label="$t('columns.vendor_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['vendor_id', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Please select"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of vendorFullNameList"
                            :key="item.code"
                            :value="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.out_number')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['out_number']"
                        style="width:200px;"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.bl_code')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['bl_code']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.yd_memo')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['yd_memo', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="not_null" key="not_null">{{
                            $t('action.not_null')
                        }}</a-radio-button>
                        <a-radio-button value="null" key="null">{{
                            $t('action.null')
                        }}</a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.bl_finish_date')"
                    style="height:35px;margin:0;"
                >
                    <a-date-picker
                        show-time
                        v-decorator="['bl_finish_date']"
                        :style="{ width: '200px' }"
                        format="YYYY-MM-DD"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.bl_finish_date')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'is_bl_finish_date',
                            { initialValue: '' }
                        ]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="not_null" key="not_null">{{
                            $t('action.not_null')
                        }}</a-radio-button>
                        <a-radio-button value="null" key="null">{{
                            $t('action.null')
                        }}</a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </template>
            <template #action>
                <a-button
                    type="primary"
                    @click="onBatchModify()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.batch_modify') }}</a-button
                >
                <a-button
                    type="primary"
                    @click="onUpdateState()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.update_state') }}</a-button
                >
                <a-button type="primary" @click="onCalcNumber()">{{
                    $t('action.calc_number')
                }}</a-button>
                <a-button
                    type="primary"
                    @click="onFlagPd()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.flag_pd') }}</a-button
                >
                <a-button
                    type="primary"
                    @click="onSyncEta()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.sync_eta') }}</a-button
                >
                <a-button
                    type="primary"
                    @click="updatePackageLogistics()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.updatePackageLogistics') }}</a-button
                >
                <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay">
                        <a-menu-item
                            @click="exportPackageOrder"
                            :disabled="!selectedRowKeys.length"
                            >{{
                                $t('action.export_package_order')
                            }}</a-menu-item
                        >
                        <a-menu-item
                            @click="exportPackageOrderSales"
                            :disabled="!selectedRowKeys.length"
                            >{{
                                $t('action.export_package_order_sales')
                            }}</a-menu-item
                        >
                        <a-menu-item
                            @click="exportPackageCheckOutData"
                            :disabled="!selectedRowKeys.length"
                            >{{
                                $t('action.export_package_checkout_data')
                            }}</a-menu-item
                        >
                    </a-menu>
                    <a-button style="margin-left: 2px"
                        >{{ $t('action.export') }}<a-icon type="down" />
                    </a-button>
                </a-dropdown>
                <a-dropdown
                    ><a-menu slot="overlay">
                        <a-menu-item
                            type="primary"
                            @click="onUpdateEta()"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.update_eta') }}</a-menu-item
                        >
                        <a-menu-item type="primary" @click="onImportEta()">{{
                            $t('action.import_eta')
                        }}</a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 2px"
                        >{{ $t('action.eta_operate') }}<a-icon type="down" />
                    </a-button>
                </a-dropdown>
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
                        >{{ $t('action.delete') }}</a-button
                    >
                </a-popconfirm>
                <a-button
                    type="primary"
                    @click="showLog"
                    style="margin-left: 2px"
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
                    <template slot="state" slot-scope="text">
                        <span>{{
                            text | dict('PackageOrderState') | translate
                        }}</span></template
                    >
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
                    <template slot="name" slot-scope="text, row">
                        <a @click.stop="onRowClick(row)">{{ row.name }}</a>
                    </template>
                    <template slot="operation" slot-scope="row">
                        <a-dropdown>
                            <a-menu slot="overlay">
                                <a-menu-item @click="onRowClick(row)">
                                    {{ $t('columns.detail') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'confirm')"
                                    v-if="row.state == 'draft'"
                                >
                                    {{ $t('action.confirm') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'approved')"
                                    v-if="row.state == 'comfirm'"
                                >
                                    {{ $t('action.verify') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'ship')"
                                    v-if="
                                        [
                                            'approved',
                                            'process',
                                            'waiting',
                                            'wait'
                                        ].includes(row.state)
                                    "
                                >
                                    {{ $t('action.ship') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'process')"
                                    v-if="row.state == 'ship'"
                                >
                                    {{ $t('action.process_clearance') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'waiting')"
                                    v-if="row.state == 'process'"
                                >
                                    {{ $t('action.waiting_arrange_in') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'wait')"
                                    v-if="row.state == 'waiting'"
                                >
                                    {{ $t('action.waiting_in') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'land')"
                                    v-if="row.state == 'wait'"
                                >
                                    {{ $t('action.land') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'draft')"
                                    v-if="row.state == 'cancel'"
                                >
                                    {{ $t('action.set_to_draft') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'cancel')"
                                    v-if="
                                        [
                                            'approved',
                                            'confirm',
                                            'ship'
                                        ].includes(row.state)
                                    "
                                >
                                    {{ $t('action.reset') }}
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
                                        >{{ $t('action.delete') }}</a-menu-item
                                    >
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
                <template slot="state" slot-scope="text">
                    <span>{{
                        text | dict('PackageOrderState') | translate
                    }}</span></template
                >
                <span slot="show_message_tips" slot-scope="text" :title="text">
                    {{
                        text
                            ? text.length > 20
                                ? text.substr(0, 17) + '...'
                                : text
                            : ''
                    }}
                </span>
                <template slot="name" slot-scope="text, row">
                    <a @click.stop="onRowClick(row)">{{ row.name }}</a>
                </template>
                <template slot="operation" slot-scope="row">
                    <a-dropdown>
                        <a-menu slot="overlay">
                            <a-menu-item @click="onRowClick(row)">
                                {{ $t('columns.detail') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'confirm')"
                                v-if="row.state == 'draft'"
                            >
                                {{ $t('action.confirm') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'approved')"
                                v-if="row.state == 'comfirm'"
                            >
                                {{ $t('action.verify') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'ship')"
                                v-if="
                                    [
                                        'approved',
                                        'process',
                                        'waiting',
                                        'wait'
                                    ].includes(row.state)
                                "
                            >
                                {{ $t('action.ship') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'process')"
                                v-if="row.state == 'ship'"
                            >
                                {{ $t('action.process_clearance') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'waiting')"
                                v-if="row.state == 'process'"
                            >
                                {{ $t('action.waiting_arrange_in') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'wait')"
                                v-if="row.state == 'waiting'"
                            >
                                {{ $t('action.waiting_in') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'land')"
                                v-if="row.state == 'wait'"
                            >
                                {{ $t('action.land') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'draft')"
                                v-if="row.state == 'cancel'"
                            >
                                {{ $t('action.set_to_draft') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'cancel')"
                                v-if="
                                    ['approved', 'confirm', 'ship'].includes(
                                        row.state
                                    )
                                "
                            >
                                {{ $t('action.reset') }}
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
                                    >{{ $t('action.delete') }}</a-menu-item
                                >
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
import AddReplenishContract from '~/components/purchase/add-replenish-contract.vue'
import PurchaseReturn from '~/components/purchase/purchase-return.vue'
import { formConfig } from '@/config/form.config'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import ModifyPackageOrder from '@/components/purchase/modify-package-order.vue'
import ModifyPackageLogistic from '@/components/purchase/modify-package-logistic.vue'
import GroupbyTable from '~/components/common/groupby-table.vue'

import UpdateEta from '@/components/purchase/update-eta.vue'
import appConfig from '@/config/app.config'
import UploadExcel from '@/shared/common/upload-excel.vue'
import UUID from 'uuidjs'
import LogView from '@/shared/common/log-view.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'purchase-package-manage'
})
@Component({
    components: {
        AddReplenishContract,
        PurchaseReturn,
        CommonPage,
        AutoColumnTable,
        GroupbyTable
    }
})
export default class PurchasePackageManage extends Vue {
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

    // 表格数据源
    private data: any[] = []

    private reasonList: any = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private current = null

    private orderBy: any = 'create_date desc'

    @datasModule.State
    private companyList

    @datasModule.Action
    private getcompany

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @datasModule.State
    private vendorFullNameList

    @datasModule.Action
    private getVendorFullNameList

    @pageParamsModule.Mutation('addCommonPageInfo')
    private addCommonPageInfo

    private columnList: any = []
    private allNameAuth: any = []
    private groupbyList: any = []
    private queryConsition: any = []

    private queryUrl: any = 'purchase_management/query_all_package_order'

    private get rules() {
        return {}
    }

    public created() {
        this.getcompany()
        this.getSystemuser()
        this.getVendorFullNameList()
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
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
                            this.data = data.map(x => {
                                x.ship_date = x.ship_date
                                    ? x.ship_date.toString().substr(0, 10)
                                    : ''
                                x.land_date = x.land_date
                                    ? x.land_date.toString().substr(0, 10)
                                    : ''
                                x.etd_date = x.etd_date
                                    ? x.etd_date.toString().substr(0, 10)
                                    : ''
                                x.af_date = x.af_date
                                    ? x.af_date.toString().substr(0, 10)
                                    : ''
                                return x
                            })
                            this.selectedRowKeys = []
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
                    let params: any = CommonService.createQueryCondition(
                        values,
                        {
                            package_code: 'like',
                            source_doc1: 'in_or_like',
                            name: 'in_or_like',
                            warehouse_id: 'like',
                            default_code: 'in_or_like',
                            out_number: 'like',
                            bl_code: 'in_or_like',
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
                    for (let i of nowConditions) {
                        if (i.query_name == 'is_bl_finish_date') {
                            i.operate =
                                i.value == 'null'
                                    ? 'null'
                                    : i.value == 'not_null'
                                    ? 'not null'
                                    : '='
                            if (i.operate != '=') {
                                i.value = i.operate
                            }
                            i.query_name = 'bl_finish_date'
                        }
                        if (i.query_name == 'yd_memo') {
                            i.operate =
                                i.value == 'null'
                                    ? 'null'
                                    : i.value == 'not_null'
                                    ? 'not null'
                                    : '='
                            if (i.operate != '=') {
                                i.value = i.operate
                            }
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
        this.innerAction.setActionAPI(
            'purchase_requirement/query_pre_make_order_lines',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    { line_ids: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$modal
                        .open(
                            AddReplenishContract,
                            {
                                info: data,
                                systemUsers: this.systemUsers,
                                vendorList: this.vendorFullNameList
                            },
                            {
                                title: this.$t(
                                    'action.add_replenishment_contract'
                                ),
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

    private returnPurchase() {
        this.innerAction.setActionAPI(
            'purchase_requirement/query_pre_make_order_lines',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    { line_ids: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$modal
                        .open(
                            PurchaseReturn,
                            {
                                info: data
                            },
                            {
                                title: this.$t('action.purchase_return'),
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

    private getUserName(code) {
        let ret: any = code
        let item = this.systemUsers.find(x => x.code == code)
        if (item) {
            ret = item.name
        }
        return ret
    }

    private getVendorName(code) {
        let ret: any = code
        let item = this.vendorFullNameList.find(x => x.code == code)
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

    private onRowClick(row) {
        this.innerAction.setActionAPI(
            'purchase_management/query_package_order_info',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    { package_id: row.id },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    data[0].id = row.id
                    data[0].package_lines = data[0].package_lines.map(x => {
                        x['is_change_sku'] = x.is_change_sku ? true : false
                        return x
                    })
                    let index = 'purchasepackageedit' + row.id
                    let params: any = {
                        index: index,
                        id: row.id,
                        info: data,
                        component: 'PurchasePackageEdit'
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

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private onBatchModify() {
        this.$modal
            .open(
                ModifyPackageOrder,
                {
                    ids: this.selectedRowKeys
                },
                {
                    title: this.$t('action.batch_modify'),
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('Update Success')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onUpdateEta() {
        this.$modal
            .open(
                UpdateEta,
                {
                    ids: this.selectedRowKeys
                },
                {
                    title: this.$t('action.update_eta'),
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('Update Success')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDelete(record) {
        this.innerAction.setActionAPI(
            'purchase_management/delete_package_order',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { package_id_list: [record.id] },
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

    private onBatchDelete() {
        this.innerAction.setActionAPI(
            'purchase_management/delete_package_order',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { package_id_list: this.selectedRowKeys },
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
            'purchase_management/update_package_order_state',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { package_id_list: [record.id], state: state },
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

    private exportPackageOrderSales() {
        let urlParams = encodeURIComponent(JSON.stringify(this.selectedRowKeys))
        window.open(
            appConfig.server +
                '/system_api/download?inner_action=purchase_management/export_package_order_for_operation&menu_code=' +
                CommonService.getMenuCode() +
                '&package_id_list=' +
                urlParams
        )
    }

    private exportPackageOrder() {
        let urlParams = encodeURIComponent(JSON.stringify(this.selectedRowKeys))
        window.open(
            appConfig.server +
                '/system_api/download?inner_action=purchase_management/export_package_order&menu_code=' +
                CommonService.getMenuCode() +
                '&package_id_list=' +
                urlParams
        )
    }

    private exportPackageCheckOutData() {
        let urlParams = encodeURIComponent(JSON.stringify(this.selectedRowKeys))
        window.open(
            appConfig.server +
                '/system_api/download?inner_action=purchase_management/export_need_purchase_checkout&menu_code=' +
                CommonService.getMenuCode() +
                '&package_id_list=' +
                urlParams
        )
    }

    private onSyncEta() {
        this.innerAction.setActionAPI(
            'purchase_management/sync_package_eta_date',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { package_id_list: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
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

    private onFlagPd() {
        this.innerAction.setActionAPI(
            'purchase_management/mass_mark_as_is_pd',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { package_id_list: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
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

    private onCalcNumber() {
        this.innerAction.setActionAPI(
            'purchase_management/calculate_package_need_checkout',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
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

    private onUpdateState() {
        this.innerAction.setActionAPI(
            'purchase_management/change_package_state',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { package_id_list: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
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

    private onImportEta() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        '/system_api/upload?inner_action=purchase_management/import_package_eta_clearance_bl_finish_date&menu_code=' +
                        CommonService.getMenuCode()
                },
                {
                    title: '导入ETA,电放, 清关资料时间',
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

    private updatePackageLogistics() {
        this.$modal
            .open(
                ModifyPackageLogistic,
                {
                    ids: this.selectedRowKeys
                },
                {
                    title: this.$t('action.updatePackageLogistics'),
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('Update Success')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
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
                    object_name: 'package',
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
    "columns":{
        "af_date":"AF Date",
        "bl_code":"BL Code",
        "carrier_name":"Carrier Name",
        "check_package_status":"Check Package Status",
        "company_name":"Company Name",
        "display_product":"Display Product",
        "etd_date":"ETD Date",
        "land_date":"Land Date",
        "name":"Name",
        "package_code":"Package Code",
        "predict_eta":"Predict ETA",
        "ship_date":"Ship Date",
        "source_doc1":"Source Doc1",
        "state":"State",
        "warehouse_id":"Warehouse",
        "vendor_id":"Vendor",
        "out_number":"Out Number",
        "bl_finish_date": "BL Finish Date",
        "yd_memo": "YD Memo"
    },
    "action":{
      "create":"Create",
      "edit":"Edit",
      "delete":"Delete",
      "ok":"Yes",
      "cancel":"Cancel",
      "more":"More",
      "export":"Export",
      "import":"Import",
      "replenish_split":"ReplenishSplit",
      "add_replenishment_contract":"Add Replenishment Contract",
      "purchase_return":"Purchase Return",
      "batch_modify":"Batch Modify",
      "updatePackageLogistics":"Update Package Logistic",
      "update_eta": "变更货柜ETA,电放, 清关资料时间",
      "confirm":"Confirm",
      "cancel":"Cancel",
      "reset":"Reset",
      "ship":"Ship",
      "land":"Land",
      "approved":"Approved",
      "process_clearance":"Process Clearance",
      "waiting_arrange_in":"Waiting Arrange In",
      "waiting_in":"Waiting In",
      "import_eta":"导入ETA,电放, 清关资料时间",
      "eta_operate":"ETA,电放, 清关资料时间",
      "sync_eta":"同步货柜ETA时间",
      "flag_pd":"标记盘点",
      "calc_number":"计算货柜产品数量出入",
      "update_state":"Modify State",
      "export_package_order":"Export Package Order",
      "export_package_order_sales":"Export Package Order(for Sales)",
      "set_to_draft":"To Draft",
      "showlog":"View Log",
      "export_package_checkout_data":"Export Package Checkout Order",
      "not_null":"Not Null",
      "null":"Null"
    },
    "rules":{
       "date_range_error":"start date can't later start date"
    },
    "delete":"Are you sure delete?",
    "cancel":"Are you sure cancel?",
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Delete Success",
    "page_name":"Purchase Package Edit"
  },
  "zh-cn": {
    "desc": "这是订单页面1",
    "columns":{
        "af_date":"AF Date",
        "bl_code":"提单号",
        "carrier_name":"运输公司",
        "check_package_status":"检查包裹状态",
        "company_name":"公司",
        "display_product":"Display Product",
        "etd_date":"ETD Date",
        "land_date":"Land Date",
        "name":"货柜号",
        "package_code":"集装箱号",
        "predict_eta":"变更ETA",
        "ship_date":"发货日期",
        "source_doc1":"发票号",
        "state":"状态",
        "warehouse_id":"仓库",
        "vendor_id":"供应商",
        "out_number":"外箱合同号",
        "bl_finish_date": "电放完成时间",
        "yd_memo": "YD Memo"
    },
    "action":{
      "create":"新建补货合同",
      "edit":"编辑",
      "delete":"删除",
      "ok":"确定",
      "cancel":"取消",
      "more":"更多操作",
      "export":"导出",
      "import":"导入",
      "replenish_split":"拆分补货需求",
      "return_purchase":"退回补货",
      "add_replenishment_contract":"新建补货合同",
      "purchase_return":"退回补货",
      "batch_modify":"批量修改货柜信息",
      "updatePackageLogistics":"调整物流信息",
      "update_eta": "变更货柜ETA,电放, 清关资料时间",
      "eta_operate":"ETA,电放, 清关资料时间",
      "confirm":"确认",
      "cancel":"取消",
      "reset":"重置",
      "ship":"Ship",
      "land":"Land",
      "approved":"Approved",
      "process_clearance":"Process Clearance",
      "waiting_arrange_in":"Waiting Arrange In",
      "waiting_in":"Waiting In",
      "import_eta":"导入ETA,电放, 清关资料时间",
      "sync_eta":"同步货柜ETA时间",
      "flag_pd":"标记盘点",
      "calc_number":"计算货柜产品数量出入",
      "update_state":"修改货柜状态",
      "export_package_order":"导出货柜合同",
      "export_package_order_sales":"导出货柜合同(运营)",
      "set_to_draft":"设为草稿",
      "showlog":"查看日志",
      "export_package_checkout_data":"导出货柜差异数据",
      "not_null":"已设置",
      "null":"未设置"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "delete":"是否确认删除?",
    "cancel":"是否确认取消?",
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "delete_success":"删除成功",
    "page_name":"货柜信息编辑"
  }
}
</i18n>
