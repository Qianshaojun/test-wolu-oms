<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <data-form
            ref="dataForm"
            @submit="getDataList"
            :column="2"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 16, offset: 0 }"
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
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.vendor_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['vendor_id', { initialValue: '' }]"
                        :style="{ width: '240px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
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
                    :label="$t('columns.order_company_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['order_company_id', { initialValue: '' }]"
                        :style="{ width: '240px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
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
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.order_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['order_date']"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.give_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['give_date']"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.make_user')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['make_user']"
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
                    :label="$t('columns.state')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['state', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of $dict.PurchaseContractState"
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
                    :label="$t('columns.purchase_requirement')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['purchase_requirement']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.source_doc1')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['source_doc1']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.is_manual_url')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'product_manual_url',
                            { initialValue: '' }
                        ]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true" :key="true"
                            >{{ $t('action.yes') }}
                        </a-radio-button>
                        <a-radio-button :value="false" :key="false"
                            >{{ $t('action.no') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.is_specification_url')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'product_specification_url',
                            { initialValue: '' }
                        ]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true" :key="true"
                            >{{ $t('action.yes') }}
                        </a-radio-button>
                        <a-radio-button :value="false" :key="false"
                            >{{ $t('action.no') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </template>
            <template #action>
                <!-- <a-button type="primary" @click="onCreate">{{
                    $t('action.create')
                }}</a-button> -->
                <a-button
                    type="primary"
                    @click="onSyncProduct()"
                    :disabled="!selectedRowKeys.length"
                    style="margin-left: 2px"
                    >{{ $t('action.sync_product_info') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="onChangeGiveDate()"
                    :disabled="!selectedRowKeys.length"
                    style="margin-left: 2px"
                    v-auth="'change_give_date'"
                    >{{ $t('action.change_give_date') }}
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
                    @click="updateProduct"
                    style="margin-left: 2px"
                    :disabled="!selectedRowKeys.length"
                    v-auth="'update'"
                    >{{ $t('action.update_product_qty_code') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="exportContract"
                    style="margin-left: 2px"
                    :disabled="!selectedRowKeys.length"
                    v-auth="'export_contract'"
                    >{{ $t('action.export_contract') }}
                </a-button>
                <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay">
                        <a-menu-item
                            @click="downloadManual"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.download_manual') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="downloadSpecification"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.download_specification') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="downloadRmbNewContract"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.download_rmb_new_contract') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="downloadUsdNewContract"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.download_usd_new_contract') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="downloadRmbContract"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.download_rmb_contract') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="downloadUsdContract"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.download_usd_contract') }}
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 2px"
                        >{{ $t('action.download') }}
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown>
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
                    <span slot="name" slot-scope="text, row">
                        <a @click.stop="onRowClick(row)">{{ row.name }}</a>
                    </span>
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
                    <span slot="state" slot-scope="text, row">
                        <span>{{
                            row.state
                                | dict('PurchaseContractState')
                                | translate
                        }}</span>
                    </span>
                    <template slot="company" slot-scope="text">
                        <span>{{ getCompanyName(text) }}</span>
                    </template>
                    <template slot="vendor" slot-scope="text">
                        <span>{{ getVendorName(text) }}</span>
                    </template>
                    <template slot="operation" slot-scope="row">
                        <a-dropdown>
                            <a-menu slot="overlay">
                                <a-menu-item @click="onRowClick(row)">
                                    {{ $t('columns.detail') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="verifyWithMemo(row, 'approved')"
                                    v-if="row.state == 'confirm'"
                                >
                                    {{ $t('action.verify') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'draft')"
                                    v-if="row.state == 'refuse'"
                                >
                                    {{ $t('action.reset') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'confirm')"
                                    v-if="row.state == 'draft'"
                                >
                                    {{ $t('action.confirm') }}
                                </a-menu-item>
                                <!-- <a-menu-item
                                @click="onVerify(row, 'cancel')"
                                v-if="row.state == 'confirm'"
                            >
                                {{ $t('action.cancel') }}
                            </a-menu-item> -->
                                <a-menu-item
                                    @click="verifyWithMemo(row, 'refuse')"
                                    v-if="row.state == 'confirm'"
                                >
                                    {{ $t('action.refuse') }}
                                </a-menu-item>
                                <a-menu-item @click="downloadBatchNumber(row)">
                                    {{ $t('action.download_batch_number') }}
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
                <span slot="name" slot-scope="text, row">
                    <a @click.stop="onRowClick(row)">{{ row.name }}</a>
                </span>
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
                <span slot="state" slot-scope="text, row">
                    <span>{{
                        row.state | dict('PurchaseContractState') | translate
                    }}</span>
                </span>
                <template slot="company" slot-scope="text">
                    <span>{{ getCompanyName(text) }}</span>
                </template>
                <template slot="vendor" slot-scope="text">
                    <span>{{ getVendorName(text) }}</span>
                </template>
                <template slot="operation" slot-scope="row">
                    <a-dropdown>
                        <a-menu slot="overlay">
                            <a-menu-item @click="onRowClick(row)">
                                {{ $t('columns.detail') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="verifyWithMemo(row, 'approved')"
                                v-if="row.state == 'confirm'"
                            >
                                {{ $t('action.verify') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'draft')"
                                v-if="row.state == 'refuse'"
                            >
                                {{ $t('action.reset') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'confirm')"
                                v-if="row.state == 'draft'"
                            >
                                {{ $t('action.confirm') }}
                            </a-menu-item>
                            <!-- <a-menu-item
                                @click="onVerify(row, 'cancel')"
                                v-if="row.state == 'confirm'"
                            >
                                {{ $t('action.cancel') }}
                            </a-menu-item> -->
                            <a-menu-item
                                @click="verifyWithMemo(row, 'refuse')"
                                v-if="row.state == 'confirm'"
                            >
                                {{ $t('action.refuse') }}
                            </a-menu-item>
                            <a-menu-item @click="downloadBatchNumber(row)">
                                {{ $t('action.download_batch_number') }}
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
import { formConfig } from '@/config/form.config'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import UploadExcel from '@/shared/common/upload-excel.vue'
import UpdateProductQtyCode from '../../components/purchase/update-product-qty-code.vue'
import appConfig from '@/config/app.config'
import ModifyMemo from '../../components/cs_email_return/chat-modify-memo.vue'
import ChangeGiveDateForm from '@/components/purchase/change-give-date-form.vue'
import UUID from 'uuidjs'
import LogView from '@/shared/common/log-view.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import GroupbyTable from '~/components/common/groupby-table.vue'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'purchase-contract-manage'
})
@Component({
    components: {
        UpdateProductQtyCode,
        CommonPage,
        LogView,
        AutoColumnTable,
        GroupbyTable
    }
})
export default class PurchaseContractManage extends Vue {
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

    private queryUrl: any = 'purchase_management/query_all_purchase_order'

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
        this.getVendorFullNameList()
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
                            name: 'in_or_like',
                            default_code: 'in_or_like',
                            purchase_requirement: 'in_or_like',
                            source_doc1: 'in_or_like',
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

    private onSyncProduct() {
        this.innerAction.setActionAPI(
            'purchase_management/sync_purchase_order_product_info',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { order_id_list: this.selectedRowKeys },
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

    private onRowClick(record) {
        this.innerAction.setActionAPI(
            'purchase_management/query_purchase_order_info',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    { order_id: record.id },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    data[0]['id'] = record.id
                    // data[0]['state'] = record.state
                    let index = 'purchasecontractedit' + record.id
                    let params: any = {
                        index: index,
                        id: record.id,
                        info: data,
                        component: 'PurchaseContractEdit'
                    }
                    this.addCommonPageInfo(params)

                    let baseName = this.$t('page_name')

                    this.$router.push({
                        name: 'common-page',
                        path: `/common-page/${index}`,
                        params: {
                            id: index,
                            name: record.name + '-' + baseName
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
            'purchase_management/delete_purchase_order',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { order_id_list: this.selectedRowKeys },
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
            'purchase_management/delete_purchase_order',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { order_id_list: [record.id] },
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
            'purchase_management/update_purchase_order_state',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { order_id_list: [record.id], state: state },
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

    private updateProduct() {
        if (this.selectedRowKeys.length > 1) {
            this.$message.error('只能选择一条数据进行拆分')
            return
        }
        let item = this.data.find(x => x.id == this.selectedRowKeys[0])
        if (item && item.state == 'draft') {
            this.$message.error('只能选择已审核的数据进行拆分')
            return
        }
        this.innerAction.setActionAPI(
            'purchase_management/query_purchase_order_info',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    { order_id: this.selectedRowKeys[0] },
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
                        data[0]['state'] = row.state
                        data[0]['id'] = row.id
                    }
                    this.$modal
                        .open(
                            UpdateProductQtyCode,
                            {
                                info: data[0],
                                systemUsers: this.systemUsers,
                                vendorList: this.vendorFullNameList
                            },
                            {
                                title: this.$t(
                                    'action.update_product_qty_code'
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

    private downloadBatchNumber(row) {
        window.open(
            appConfig.server +
                '/system_api/download?inner_action=purchase_management/download_batch_number&menu_code=' +
                CommonService.getMenuCode() +
                '&order_id=' +
                row.id
        )
    }

    private downloadSpecification() {
        let urlParams = encodeURIComponent(JSON.stringify(this.selectedRowKeys))
        window.open(
            appConfig.server +
                '/system_api/download?inner_action=purchase_management/download_product_specification&menu_code=' +
                CommonService.getMenuCode() +
                '&order_id_list=' +
                urlParams
        )
    }

    private downloadManual() {
        let urlParams = encodeURIComponent(JSON.stringify(this.selectedRowKeys))
        window.open(
            appConfig.server +
                '/system_api/download?inner_action=purchase_management/download_product_manual&menu_code=' +
                CommonService.getMenuCode() +
                '&order_id_list=' +
                urlParams
        )
    }

    private downloadRmbContract() {
        let urlParams = encodeURIComponent(JSON.stringify(this.selectedRowKeys))
        window.open(
            appConfig.server +
                '/system_api/download?inner_action=purchase_management/export_purchase_order_excel&menu_code=' +
                CommonService.getMenuCode() +
                '&export_type=RMB&order_id_list=' +
                urlParams +
                '&use_product_link=false'
        )
    }

    private downloadRmbNewContract() {
        let urlParams = encodeURIComponent(JSON.stringify(this.selectedRowKeys))
        window.open(
            appConfig.server +
                '/system_api/download?inner_action=purchase_management/export_purchase_order_excel&menu_code=' +
                CommonService.getMenuCode() +
                '&export_type=RMB&order_id_list=' +
                urlParams +
                '&use_product_link=true'
        )
    }

    private downloadUsdContract() {
        let urlParams = encodeURIComponent(JSON.stringify(this.selectedRowKeys))
        window.open(
            appConfig.server +
                '/system_api/download?inner_action=purchase_management/export_purchase_order_excel&menu_code=' +
                CommonService.getMenuCode() +
                '&export_type=USD&order_id_list=' +
                urlParams +
                '&use_product_link=false'
        )
    }

    private downloadUsdNewContract() {
        let urlParams = encodeURIComponent(JSON.stringify(this.selectedRowKeys))
        window.open(
            appConfig.server +
                '/system_api/download?inner_action=purchase_management/export_purchase_order_excel&menu_code=' +
                CommonService.getMenuCode() +
                '&export_type=USD&order_id_list=' +
                urlParams +
                '&use_product_link=true'
        )
    }

    private exportContract() {
        let urlParams = encodeURIComponent(JSON.stringify(this.selectedRowKeys))
        window.open(
            appConfig.server +
                '/system_api/download?inner_action=purchase_management/export_purchase_order&menu_code=' +
                CommonService.getMenuCode() +
                '&order_ids=' +
                urlParams
        )
    }

    private verifyWithMemo(record, state) {
        this.$modal
            .open(
                ModifyMemo,
                {},
                {
                    title: this.$t('action.verify_mome')
                }
            )
            .subscribe(
                data => {
                    this.innerAction.setActionAPI(
                        'purchase_management/update_purchase_order_state',
                        CommonService.getMenuCode()
                    )
                    this.publicService
                        .modify(
                            new RequestParams(
                                {
                                    order_id_list: [record.id],
                                    state: state,
                                    approve_memo: data
                                },
                                {
                                    loading: this.loadingService,
                                    innerAction: this.innerAction
                                }
                            )
                        )
                        .subscribe(
                            data => {
                                this.$message.success('操作成功')
                                let item = this.data.find(
                                    x => x.id == record.id
                                )
                                if (item) {
                                    item.state = state
                                }
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

    private onChangeGiveDate() {
        this.$modal
            .open(
                ChangeGiveDateForm,
                {},
                {
                    title: this.$t('action.change_give_date')
                }
            )
            .subscribe(
                data => {
                    this.innerAction.setActionAPI(
                        'purchase_management/update_purchase_order_give_date',
                        CommonService.getMenuCode()
                    )
                    this.publicService
                        .modify(
                            new RequestParams(
                                {
                                    order_id_list: this.selectedRowKeys,
                                    change_give_date: data.change_give_date,
                                    change_give_date_memo:
                                        data.change_give_date_memo
                                },
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
                    object_name: 'order',
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
            "approved_user": "Approved user",
            "change_give_date": "Change give date",
            "give_date": "Give date",
            "make_user": "Make user",
            "merchandiser": "Merchandiser",
            "name": "Order No.",
            "order_company_id": "Order company id",
            "order_date": "Order date",
            "purchase_requirement": "Purchase requirement",
            "source_doc1": "Source doc1",
            "state": "State",
            "user_purchase": "User purchase",
            "vendor_id": "Vendor id",
            "warehouse_id": "Warehouse",
            "is_specification_url": "Have specification url",
            "is_manual_url": "Have Manual url"
        },
        "action": {
            "action": "Action",
            "create": "Create",
            "download": "Download",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "export": "Export",
            "import": "Import",
            "sync_product_info": "Synchronize Product",
            "verify": "Verify",
            "reset": "Reset",
            "confirm": "Confirm",
            "refuse": "Refuse",
            "update_product_qty_code": "Update Product Qty&Code",
            "download_manual": "Download Manual",
            "download_specification": "Download Specification",
            "download_batch_number": "Download Batch Number",
            "download_rmb_contract": "Download RMB Make Order",
            "download_rmb_new_contract": "Download RMB Make Order new(Use Product Lick)",
            "download_usd_contract": "Download USD Make Order",
            "download_usd_new_contract": "Download USD Make Order New(Use Product Lick)",
            "export_contract": "Export Contract",
            "verify_mome": "Memo",
            "change_give_date": "Change Give Date",
            "showlog": "View Log",
            "yes": "Yes",
            "no": "No"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "cancel": "Are you sure cancel?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "page_name": "Purchase Contract Edit"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "columns": {
            "approved_user": "审核人",
            "change_give_date": "更改交期",
            "give_date": "合同交期",
            "make_user": "制单员",
            "merchandiser": "跟单员",
            "name": "订单号",
            "order_company_id": "公司",
            "order_date": "订单日期",
            "purchase_requirement": "采购需求",
            "source_doc1": "发票号",
            "state": "状态",
            "user_purchase": "采购员",
            "vendor_id": "供应商",
            "warehouse_id": "仓库",
            "is_specification_url": "是否有工艺单附件",
            "is_manual_url": "是否有说明书附件"
        },
        "action": {

            "action": "操作",
            "create": "新建",
            "download": "下载",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "export": "导出",
            "import": "导入",
            "sync_product_info": "同步产品信息",
            "verify": "审核",
            "reset": "重置",
            "confirm": "确认",
            "refuse": "确认拒绝",
            "update_product_qty_code": "变更产品货号及数量",
            "download_manual": "下载说明书",
            "download_specification": "下载工艺单",
            "download_batch_number": "下载批次号",
            "download_rmb_contract": "人民币采购合同",
            "download_rmb_new_contract": "人民币采购合同(使用产品链接)",
            "download_usd_contract": "美元采购合同",
            "download_usd_new_contract": "美元采购合同(使用产品链接)",
            "export_contract": "导出采购合同",
            "verify_mome": "备注",
            "change_give_date": "修改采购交期",
            "showlog": "查看日志",
            "yes": "是",
            "no": "否"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "page_name": "采购合同编辑"
    }
}
</i18n>
