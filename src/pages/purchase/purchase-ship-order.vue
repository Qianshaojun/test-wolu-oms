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
                    :label="$t('columns.name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['name']"
                        :style="{ width: '240px' }"
                        size="small"
                        :placeholder="$t('plzInput')"
                    />
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
                            v-for="item of $dict.PurchaseShipOrderState"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ $t(item.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.source_doc')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['source_doc']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['default_code']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
            </template>
            <template #action>
                <!-- <a-button type="primary" @click="onCreate">{{
                    $t('action.create')
                }}</a-button> -->
                <a-button
                    type="primary"
                    @click="onCreate()"
                    style="margin-left: 2px"
                    >{{ $t('action.create') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="onMakePackageOrder()"
                    :disabled="!selectedRowKeys.length"
                    style="margin-left: 2px"
                    >{{ $t('action.make_package_order') }}
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
                <!-- <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay">
                        <a-menu-item
                            @click="downloadContract"
                            :disabled="!selectedRowKeys.length"
                            >{{
                                $t('action.download_purchase_contract')
                            }}</a-menu-item
                        >
                    </a-menu>
                    <a-button style="margin-left: 2px"
                        >{{ $t('action.download') }}<a-icon type="down" />
                    </a-button>
                </a-dropdown> -->
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
                    :scroll="{ x: 1000, y: 400 }"
                >
                    <span slot="check_render" slot-scope="text"
                        ><a-checkbox disabled :checked="text" />
                    </span>
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <template slot="name" slot-scope="text, row">
                        <a @click.stop="onRowClick(row)">{{ row.name }}</a>
                    </template>
                    <template slot="vendor" slot-scope="text">
                        {{ getVendorName(text) }}
                    </template>
                    <template slot="user_render" slot-scope="text">
                        <span v-if="!text"></span>
                        <span v-else>{{ text | dict2(systemUsers) }}</span>
                    </template>
                    <template slot="state" slot-scope="text">
                        <span>{{
                            text | dict('PurchaseShipOrderState') | translate
                        }}</span></template
                    >
                    <template slot="operation" slot-scope="row">
                        <a-dropdown>
                            <a-menu slot="overlay">
                                <a-menu-item @click="onRowClick(row)">
                                    {{ $t('columns.detail') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'approved')"
                                    v-if="row.state == 'confirm'"
                                >
                                    {{ $t('action.verify') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'draft')"
                                    v-if="
                                        row.state == 'confirm' ||
                                            row.state == 'approved'
                                    "
                                >
                                    {{ $t('action.reset') }}
                                </a-menu-item>
                                <a-menu-item
                                    @click="onVerify(row, 'confirm')"
                                    v-if="row.state == 'draft'"
                                >
                                    {{ $t('action.confirm') }}
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
                <template slot="name" slot-scope="text, row">
                    <a @click.stop="onRowClick(row)">{{ row.name }}</a>
                </template>
                <template slot="vendor" slot-scope="text">
                    {{ getVendorName(text) }}
                </template>
                <template slot="user_render" slot-scope="text">
                    <span v-if="!text"></span>
                    <span v-else>{{ text | dict2(systemUsers) }}</span>
                </template>
                <template slot="state" slot-scope="text">
                    <span>{{
                        text | dict('PurchaseShipOrderState') | translate
                    }}</span></template
                >
                <template slot="operation" slot-scope="row">
                    <a-dropdown>
                        <a-menu slot="overlay">
                            <a-menu-item @click="onRowClick(row)">
                                {{ $t('columns.detail') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'approved')"
                                v-if="row.state == 'confirm'"
                            >
                                {{ $t('action.verify') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'draft')"
                                v-if="
                                    row.state == 'confirm' ||
                                        row.state == 'approved'
                                "
                            >
                                {{ $t('action.reset') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="onVerify(row, 'confirm')"
                                v-if="row.state == 'draft'"
                            >
                                {{ $t('action.confirm') }}
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
import MakePackageOrder from '../../components/purchase/make-package-order.vue'
import UUID from 'uuidjs'
import LogView from '@/shared/common/log-view.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import GroupbyTable from '~/components/common/groupby-table.vue'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'purchase-ship-order'
})
@Component({
    components: {
        UpdateProductQtyCode,
        CommonPage,
        AutoColumnTable,
        GroupbyTable
    }
})
export default class PurchaseShipOrder extends Vue {
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

    private queryUrl: any = 'ship_order/query_all_ship_orders'

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
                            name: 'like',
                            source_doc: 'in_or_like',
                            default_code: 'in_or_like',
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
            name: 'purchase-ship-order-edit'
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
            'ship_order/query_one_ship_orders',
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
                    data[0]['product_volume'] = parseInt(
                        record.sum_product_volume
                    )
                    let index = 'purchaseshiporderedit' + record.id
                    let params: any = {
                        index: index,
                        id: record.id,
                        info: data,
                        component: 'PurchaseShipOrderEdit'
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
            'ship_order/delete_ship_order',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { ids: this.selectedRowKeys },
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
            'ship_order/delete_ship_order',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { ids: [record.id] },
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
            'ship_order/change_ship_order_state',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        order_ids: [record.id],
                        old_state: record.state,
                        new_state: state
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

    private downloadContract() {}

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
                        'ship_order/change_ship_order_state',
                        CommonService.getMenuCode()
                    )
                    this.publicService
                        .modify(
                            new RequestParams(
                                {
                                    order_ids: [record.id],
                                    old_state: record.state,
                                    new_state: state,
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

    private async onMakePackageOrder() {
        for (let i in this.selectedRowKeys) {
            let item = this.data.find(x => x.id == this.selectedRowKeys[i])
            if (
                item &&
                item.state !== 'approved' &&
                item &&
                item.state !== 'approved/package'
            ) {
                this.$message.error(
                    '采购合同状态必须是 approved 或者 approved/package'
                )
                return
            }
        }

        this.innerAction.setActionAPI(
            'ship_order/query_ship_order_items',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    { order_ids: this.selectedRowKeys },
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
                            MakePackageOrder,
                            {
                                lines: data,
                                ids: this.selectedRowKeys
                            },
                            {
                                title: this.$t('action.make_package_order'),
                                width: '1300px'
                            }
                        )
                        .subscribe(
                            data => {
                                this.$message.success('Create Success')
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
                    object_name: 'order2',
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
            "name": "Ship Order No.",
            "order_company_id": "Order company id",
            "order_date": "Order date",
            "purchase_requirement": "Purchase requirement",
            "source_doc": "Source doc",
            "state": "State",
            "user_purchase": "User purchase",
            "vendor_id": "Vendor id"
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
            "download_purchase_contract": "Download Purchase Contract",
            "verify_mome": "Memo",
            "change_give_date": "Change Give Date",
            "make_package_order": "Make Package Order",
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
        "page_name": "Purchase Ship Order Edit"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "columns": {
            "approved_user": "审核人",
            "change_give_date": "更改交期",
            "give_date": "合同交期",
            "make_user": "制单员",
            "merchandiser": "跟单员",
            "name": "发货单号",
            "order_company_id": "公司",
            "order_date": "订单日期",
            "purchase_requirement": "采购需求",
            "source_doc": "实际发货合同号",
            "state": "状态",
            "user_purchase": "采购员",
            "vendor_id": "供应商"
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
            "download_purchase_contract": "下载采购合同",
            "verify_mome": "备注",
            "change_give_date": "修改采购交期",
            "make_package_order": "创建货柜",
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
        "page_name": "发货合同编辑"
    }
}
</i18n>
