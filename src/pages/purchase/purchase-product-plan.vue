<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <data-form
            ref="dataForm"
            @submit="getPurchaseLineList"
            :column="2"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 16, offset: 0 }"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['default_code']"
                        style="width:300px;"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.contact_no')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['real_pre_purchase_order']"
                        :placeholder="$t('plzInput')"
                        style="width:300px;"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.order_name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['order_name']"
                        :placeholder="$t('plzInput')"
                        style="width:300px;"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.vendor_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['vendor_id', { initialValue: '' }]"
                        :style="{ width: '300px' }"
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
                    :label="$t('columns.order_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['order_date']"
                        size="small"
                        format="YYYY-MM-DD"
                        :style="{
                            width: '100%',
                            'max-width': '300px'
                        }"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.give_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['give_date']"
                        size="small"
                        format="YYYY-MM-DD"
                        :style="{
                            width: '100%',
                            'max-width': '300px'
                        }"
                    />
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
                    :label="$t('columns.un_finish_qty')"
                    style="height:35px;margin:0;"
                >
                    <a-input-number
                        style="width:100px"
                        v-decorator="['un_finish_qty_from']"
                        size="small"
                        :min="0"
                        :precision="0"
                        :placeholder="$t('plzInput')"
                        :formatter="limitNumber"
                        :parser="limitNumber"
                    />
                    ~
                    <a-input-number
                        style="width:100px"
                        v-decorator="['un_finish_qty_to']"
                        size="small"
                        :min="0"
                        :precision="0"
                        :formatter="limitNumber"
                        :placeholder="$t('plzInput')"
                        :parser="limitNumber"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.exists_attention')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'exists_attention',
                            { initialValue: defaultBoolValue }
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
                    :label="$t('columns.finish_yn')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['finish_yn', { initialValue: false }]"
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
                    :label="$t('columns.factory_finish')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'factory_finish',
                            { initialValue: defaultBoolValue }
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
                    :label="$t('columns.is_purchase_changed')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'is_purchase_changed',
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
                    :label="$t('columns.new_product')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['new_product', { initialValue: '' }]"
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
            <template #action>
                <a-button
                    type="primary"
                    :disabled="!need_save_data_list.length"
                    @click="save_changed_data()"
                    >{{ $t('action.save') }}
                </a-button>
                <a-popconfirm
                    :title="$t('delete')"
                    :okText="$t('action.ok')"
                    :cancelText="$t('action.cancel')"
                    placement="left"
                    :disabled="!need_save_data_list.length"
                    @confirm="discard_changed_data()"
                >
                    <a-button type="primary"
                        >{{ $t('action.discard') }}
                    </a-button>
                </a-popconfirm>
                <a-button
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="export_unfinish_line()"
                    >{{ $t('action.export_unfinish_line') }}
                </a-button>
                <a-button
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="export_product_specification()"
                    >{{ $t('action.export_product_specification') }}
                </a-button>
                <!-- <a-button
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="view_purchase_change_log()"
                    >{{ $t('action.view_purchase_change_log') }}</a-button
                > -->
                <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay">
                        <a-menu-item
                            @click="edit_finish_qty_vendor"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.edit_finish_qty_vendor') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="change_purchase_info"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.change_purchase_info') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="cancel_attention"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.cancel_attention') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="force_finish_trace"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.force_finish_trace') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="unfinish_trace"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.unfinish_trace') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="qc_confirm_ship"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.qc_confirm_ship') }}
                        </a-menu-item>
                        <a-menu-item @click="import_trace_memo"
                            >{{ $t('action.import_trace_memo_dlg') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="add_trace_memo"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.add_trace_memo_dlg') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="sync_product_supplier"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.sync_product_supplier') }}
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 2px"
                        >{{ $t('action.update_btn') }}
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
                    :row-class-name="tableRowClass"
                    @on-page-change="getPurchaseLineList"
                    @onClick="
                        record => {
                            selectedRowKeys = [record]
                            onRowClick(record)
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 2000, y: 400 }"
                >
                    <span slot="check_render" slot-scope="text"
                        ><a-checkbox disabled :checked="text" />
                    </span>
                    <span slot="vendor_render" slot-scope="text"
                        >{{ getVendorName(text) }}
                    </span>
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
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <template slot="warehouse_render" slot-scope="text">
                        <span v-if="text == 'de'">DE</span>
                        <span v-else-if="text == 'uk'">UK</span>
                        <span v-else>{{ text }}</span>
                    </template>
                    <template slot="note" slot-scope="text, row">
                        <a-textarea
                            size="small"
                            rows="2"
                            cols="40"
                            style="width:90%;margin: 3px 0;"
                            :style="getEditTextChangedStyle(row, 'note')"
                            v-if="editRow.id == row.id"
                            :value="row.note ? row.note : ''"
                            @change="e => handleChange(e.target, row, 'note')"
                        />
                        <span
                            :style="getEditTextChangedStyle(row, 'note')"
                            :title="row.note"
                            v-else
                            >{{
                                row.note
                                    ? row.note.length > 24
                                        ? row.note.substr(0, 27) + '...'
                                        : row.note
                                    : ''
                            }}</span
                        >
                    </template>
                    <template slot="factory_finish" slot-scope="text, row">
                        <a-checkbox
                            :checked="row.factory_finish ? true : false"
                            :style="
                                getEditTextChangedStyle(row, 'factory_finish')
                            "
                            @change="
                                e => handleChange(e, row, 'factory_finish')
                            "
                            v-if="editRow.id == row.id"
                        />
                        <a-checkbox
                            :checked="row.factory_finish ? true : false"
                            disabled="disabled"
                            :style="
                                getEditTextChangedStyle(row, 'factory_finish')
                            "
                            v-else
                        />
                    </template>
                    <span slot="factory_finish_time" slot-scope="text, row">
                        <a-date-picker
                            style="width:90%;margin: 3px 0"
                            :value="
                                row.factory_finish_time
                                    ? moment(
                                          row.factory_finish_time,
                                          'YYYY-MM-DD'
                                      )
                                    : null
                            "
                            size="small"
                            format="YYYY-MM-DD"
                            :style="
                                getEditTextChangedStyle(
                                    row,
                                    'factory_finish_time'
                                )
                            "
                            @change="
                                e => handleChange(e, row, 'factory_finish_time')
                            "
                            v-if="editRow.id == row.id"
                        />
                        <span
                            style="width:90%;margin: 3px 0"
                            :style="
                                getEditTextChangedStyle(
                                    row,
                                    'factory_finish_time'
                                )
                            "
                            v-else
                            >{{
                                row.factory_finish_time
                                    ? moment(row.factory_finish_time).format(
                                          'YYYY-MM-DD'
                                      )
                                    : null
                            }}</span
                        >
                    </span>
                    <span slot="factory_finish_qty" slot-scope="text, row"
                        ><input
                            style="width:90%;margin: 3px 0; border:0px; text-align:right"
                            :style="
                                getEditTextChangedStyle(
                                    row,
                                    'factory_finish_qty'
                                )
                            "
                            :value="row.factory_finish_qty"
                            @change="
                                e =>
                                    handleChange(
                                        e.target,
                                        row,
                                        'factory_finish_qty'
                                    )
                            "
                            v-if="editRow.id == row.id"
                        />
                        <span
                            style="width:90%;margin: 3px 0; border:0px; text-align:right"
                            :style="
                                getEditTextChangedStyle(
                                    row,
                                    'factory_finish_qty'
                                )
                            "
                            v-else
                            >{{ row.factory_finish_qty }}
                        </span>
                    </span>
                </AutoColumnTable>
            </div>
            <GroupbyTable
                v-else
                ref="groupbyTable"
                :groupByColumn="groupbyList"
                :oColumns="columnList"
                :queryNameAuth="allNameAuth"
                :row-class-name="tableRowClass"
                urlStr="purchase_order_plan/query_all"
                @selectChange="onSelectChange"
                @rowClick="onRowClick"
            >
                <span slot="check_render" slot-scope="text"
                    ><a-checkbox disabled :checked="text" />
                </span>
                <span slot="vendor_render" slot-scope="text"
                    >{{ getVendorName(text) }}
                </span>
                <span slot="show_message_tips" slot-scope="text" :title="text">
                    {{
                        text
                            ? text.length > 20
                                ? text.substr(0, 17) + '...'
                                : text
                            : ''
                    }}
                </span>
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
                <template slot="warehouse_render" slot-scope="text">
                    <span v-if="text == 'de'">DE</span>
                    <span v-else-if="text == 'uk'">UK</span>
                    <span v-else>{{ text }}</span>
                </template>
                <template slot="note" slot-scope="text, row">
                    <a-textarea
                        size="small"
                        rows="2"
                        cols="40"
                        style="width:90%;margin: 3px 0;"
                        :style="getEditTextChangedStyle(row, 'note')"
                        v-if="editRow.id == row.id"
                        :value="row.note ? row.note : ''"
                        @change="e => handleChange(e.target, row, 'note')"
                    />
                    <span
                        :style="getEditTextChangedStyle(row, 'note')"
                        :title="row.note"
                        v-else
                        >{{
                            row.note
                                ? row.note.length > 24
                                    ? row.note.substr(0, 27) + '...'
                                    : row.note
                                : ''
                        }}</span
                    >
                </template>
                <template slot="factory_finish" slot-scope="text, row">
                    <a-checkbox
                        :checked="row.factory_finish ? true : false"
                        :style="getEditTextChangedStyle(row, 'factory_finish')"
                        @change="e => handleChange(e, row, 'factory_finish')"
                        v-if="editRow.id == row.id"
                    />
                    <a-checkbox
                        :checked="row.factory_finish ? true : false"
                        disabled="disabled"
                        :style="getEditTextChangedStyle(row, 'factory_finish')"
                        v-else
                    />
                </template>
                <span slot="factory_finish_time" slot-scope="text, row">
                    <a-date-picker
                        style="width:90%;margin: 3px 0"
                        :value="
                            row.factory_finish_time
                                ? moment(row.factory_finish_time, 'YYYY-MM-DD')
                                : null
                        "
                        size="small"
                        format="YYYY-MM-DD"
                        :style="
                            getEditTextChangedStyle(row, 'factory_finish_time')
                        "
                        @change="
                            e => handleChange(e, row, 'factory_finish_time')
                        "
                        v-if="editRow.id == row.id"
                    />
                    <span
                        style="width:90%;margin: 3px 0"
                        :style="
                            getEditTextChangedStyle(row, 'factory_finish_time')
                        "
                        v-else
                        >{{
                            row.factory_finish_time
                                ? moment(row.factory_finish_time).format(
                                      'YYYY-MM-DD'
                                  )
                                : null
                        }}</span
                    >
                </span>
                <span slot="factory_finish_qty" slot-scope="text, row"
                    ><input
                        style="width:90%;margin: 3px 0; border:0px; text-align:right"
                        :style="
                            getEditTextChangedStyle(row, 'factory_finish_qty')
                        "
                        :value="row.factory_finish_qty"
                        @change="
                            e =>
                                handleChange(
                                    e.target,
                                    row,
                                    'factory_finish_qty'
                                )
                        "
                        v-if="editRow.id == row.id"
                    />
                    <span
                        style="width:90%;margin: 3px 0; border:0px; text-align:right"
                        :style="
                            getEditTextChangedStyle(row, 'factory_finish_qty')
                        "
                        v-else
                        >{{ row.factory_finish_qty }}
                    </span>
                </span>
            </GroupbyTable>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import router from '../../router'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { namespace } from 'vuex-class'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import CommonPage from '~/shared/components/common-page.vue'
import { CommonService } from '@/shared/utils/common.service'
import AddReplenishContract from '~/components/purchase/add-replenish-contract.vue'
import PurchaseFinishItem from '~/components/purchase/purchase-finish-item.vue'
import AddTraceMemoDlg from '~/components/purchase/add-purchase-product-plan-memo.vue'
import ImportPurchaseProductPlanMemo from '~/components/purchase/import-purchase-product-plan-memo.vue'
import PurchaseCancelAtentioin from '~/components/purchase/purchase-cancel-attention.vue'
import { formConfig } from '@/config/form.config'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import appConfig from '@/config/app.config'
import moment from 'moment'
import EditFinishQtyVendor from '~/components/purchase/edit-finish-qty-vendor.vue'
import ChangePurchaseInfo from '~/components/purchase/change-purchase-info.vue'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import LogView from '@/shared/common/log-view.vue'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'purchase-product-plan'
})
@Component({
    components: {
        AddReplenishContract,
        EditFinishQtyVendor,
        ChangePurchaseInfo,
        PurchaseFinishItem,
        AddTraceMemoDlg,
        PurchaseCancelAtentioin,
        CommonPage,
        GroupbyTable,
        AutoColumnTable
    }
})
export default class PurchaseProductPlan extends Vue {
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

    private defaultBoolValue: any = ''

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

    private record_code: any = 0
    private orderBy: any = 'create_date desc'

    private need_save_data_list: any[] = []

    private moment = moment

    private editRow: any = {
        id: null
    }

    private groupbyList: any = []

    private columnList: any = []

    private allNameAuth: any = []

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

    private onGroupbyListChange() {
        this.groupbyList = this.dataForm.checkedGroupbyList
    }

    /**
     * 获取订单数据
     */
    private getPurchaseLineList() {
        this.dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                default_code: 'in_or_like',
                order_name: 'like',
                real_pre_purchase_order: 'like',
                ...formConfig.condition
            })

            var nowConditions: any[] = []
            for (var item of params.query_condition) {
                if (item.value.constructor == Array && item.operate !== 'in') {
                    if (
                        item.value.length == 2 &&
                        item.value[0].constructor.name == 'Moment'
                    ) {
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
                    if (
                        item.value.length == 2 &&
                        item.value[1].constructor.name == 'Moment'
                    ) {
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
                    if (item.query_name == 'un_finish_qty_from') {
                        item.query_name = 'un_finish_qty'
                        item.operate = '>='
                    } else if (item.query_name == 'un_finish_qty_to') {
                        item.query_name = 'un_finish_qty'
                        item.operate = '<='
                    }

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
                    'purchase_order_plan/query_all',
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

    private getUserName(code) {
        let ret: any = code
        let item = this.systemUsers.find(x => x.code == code)
        if (item) {
            ret = item.name
        }
        return ret
    }

    private getVendorName(code) {
        let cd = typeof code == 'object' ? code[0] : code
        let ret: any = cd
        let item = this.vendorFullNameList.find(x => x.code == cd)
        if (item) {
            ret = item.name
        }
        return ret
    }

    private onTableChange(pagination, filters, sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getPurchaseLineList()
    }

    private onRowClick(row) {
        let info = this.data.find(x => x.id === row)

        this.editRow = {
            id: row
        }

        this.record_code = row
    }

    private getEditTextChangedStyle(row, column) {
        if (
            column == 'note' ||
            column == 'factory_finish' ||
            column == 'factory_finish_qty' ||
            column == 'factory_finish_time'
        ) {
            if (row.hasOwnProperty(column + '_changed')) {
                return 'text-align:right;background-color:yellow;font-weight:bolder'
            }

            return 'text-align:right'
        }

        return 'text-align:right'
    }

    private save_changed_data() {
        if (this.need_save_data_list.length == 0) {
            this.$message.info('没有需要保存的数据。')
            return
        }

        this.innerAction.setActionAPI(
            'purchase_order_plan/batch_save',
            CommonService.getMenuCode()
        )

        this.publicService
            .modify(
                new RequestParams(
                    {
                        change_schedule_data_list: this.need_save_data_list
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.reset_data()

                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                    return
                }
            )
    }

    private handleChange(value, row, column) {
        if (
            Object.prototype.toString.call(value) === '[object Event]' ||
            Object.prototype.toString.call(value) === '[object Object]'
        ) {
            if (value.target != undefined && value.target.value != undefined) {
                value = value.target.value
            } else if (
                value.target != undefined &&
                value.target.checked != undefined
            ) {
                value = value.target.checked
            }
        } else {
            value = value.value
        }

        if (row[column] != value) {
            row[column] = value

            if (column == 'note') {
                row.note_changed = true
                var exists_item_1 = this.need_save_data_list.find(
                    x => x.id == row.id
                )
                if (exists_item_1) {
                    exists_item_1['note'] = value
                } else {
                    this.need_save_data_list.push({
                        id: row.id,
                        note: value
                    })
                }
            } else if (column == 'factory_finish') {
                row.factory_finish_changed = true

                var exists_item_2 = this.need_save_data_list.find(
                    x => x.id == row.id
                )
                if (exists_item_2) {
                    exists_item_2['factory_finish'] = value
                } else {
                    this.need_save_data_list.push({
                        id: row.id,
                        factory_finish: value
                    })
                }
            } else if (column == 'factory_finish_time') {
                row.factory_finish_time_changed = true

                var exists_item_3 = this.need_save_data_list.find(
                    x => x.id == row.id
                )
                if (exists_item_3) {
                    exists_item_3['factory_finish_time'] = value
                } else {
                    this.need_save_data_list.push({
                        id: row.id,
                        factory_finish_time: value
                    })
                }
            } else if (column == 'factory_finish_qty') {
                row.factory_finish_qty_changed = true

                var exists_item_4 = this.need_save_data_list.find(
                    x => x.id == row.id
                )
                if (exists_item_4) {
                    exists_item_4['factory_finish_qty'] = value
                } else {
                    this.need_save_data_list.push({
                        id: row.id,
                        factory_finish_qty: value
                    })
                }
            }
        }

        let newdata = {
            ...this.editRow
        }
        newdata[column] = value
        this.editRow = newdata
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private reset_data() {
        for (var index in this.need_save_data_list) {
            var item = this.need_save_data_list[index]

            var obj = this.data.find(x => x.id === item.id)

            if (obj && obj.hasOwnProperty('note_changed')) {
                delete obj.note_changed
            }

            if (obj && obj.hasOwnProperty('factory_finish_changed')) {
                delete obj.factory_finish_changed
            }

            if (obj && obj.hasOwnProperty('factory_finish_time_changed')) {
                delete obj.factory_finish_time_changed
            }

            if (obj && obj.hasOwnProperty('factory_finish_qty_changed')) {
                delete obj.factory_finish_qty_changed
            }
        }

        this.need_save_data_list = []
    }

    private discard_changed_data() {
        this.reset_data()
    }

    private edit_finish_qty_vendor() {
        this.$modal
            .open(
                EditFinishQtyVendor,
                {
                    data: this.data.filter(
                        x => this.selectedRowKeys.indexOf(x.id) !== -1
                    )
                },
                {
                    title: this.$t('action.edit_finish_qty_vendor'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                if (data) {
                    this.$message.success('修改成功')
                    this.reset_data()
                }
            })
    }

    private change_purchase_info() {
        this.$modal
            .open(
                ChangePurchaseInfo,
                {
                    id_list: this.selectedRowKeys,
                    userList: this.systemUsers,
                    vendorList: this.vendorFullNameList
                },
                {
                    title: this.$t('action.change_purchase_info'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                if (data) {
                    this.$message.success('修改成功')
                    this.reset_data()
                }
            })
    }

    private export_unfinish_line() {
        let urlParams = encodeURIComponent(JSON.stringify(this.selectedRowKeys))

        window.open(
            appConfig.server +
                '/system_api/download?inner_action=purchase_order_plan/export_unfinish_make_order&menu_code=' +
                CommonService.getMenuCode() +
                '&id_list=' +
                urlParams
        )
    }

    private export_product_specification() {
        let urlParams = encodeURIComponent(JSON.stringify(this.selectedRowKeys))

        window.open(
            appConfig.server +
                '/system_api/download?inner_action=purchase_order_plan/export_manual_requirement&menu_code=' +
                CommonService.getMenuCode() +
                '&id_list=' +
                urlParams
        )
    }

    private cancel_attention() {
        this.innerAction.setActionAPI(
            'purchase_order_plan/query_purchase_requirement_line',
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
                            PurchaseCancelAtentioin,
                            {
                                info: data
                            },
                            {
                                title: this.$t('action.cancel_attention_dlg'),
                                width: '1000px'
                            }
                        )
                        .subscribe(
                            data => {
                                for (let key of this.selectedRowKeys) {
                                    var obj = this.data.find(x => x.id === key)

                                    obj.exists_attention = false
                                }

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

    private force_finish_trace() {
        this.innerAction.setActionAPI(
            'purchase_order_plan/query_purchase_requirement_line',
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
                            PurchaseFinishItem,
                            {
                                info: data
                            },
                            {
                                title: this.$t('action.purchase_finish_dlg'),
                                width: '1000px'
                            }
                        )
                        .subscribe(
                            data => {
                                for (let key of this.selectedRowKeys) {
                                    var obj = this.data.find(x => x.id === key)

                                    obj.exists_attention = false
                                }

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

    private unfinish_trace() {
        this.innerAction.setActionAPI(
            'purchase_order_plan/unfinish_purchase_item',
            CommonService.getMenuCode()
        )

        this.publicService
            .modify(
                new RequestParams(
                    {
                        id_list: this.selectedRowKeys
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.reset_data()

                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                    return
                }
            )
    }

    private qc_confirm_ship() {
        this.innerAction.setActionAPI(
            'purchase_order_plan/qc_confirm_state',
            CommonService.getMenuCode()
        )

        this.publicService
            .modify(
                new RequestParams(
                    {
                        id_list: this.selectedRowKeys
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.reset_data()

                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                    return
                }
            )
    }

    private sync_product_supplier() {
        this.innerAction.setActionAPI(
            'purchase_order_plan/sync_product_supplier',
            CommonService.getMenuCode()
        )

        this.publicService
            .modify(
                new RequestParams(
                    {
                        id_list: this.selectedRowKeys
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.reset_data()

                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                    return
                }
            )
    }

    private add_trace_memo() {
        this.innerAction.setActionAPI(
            'purchase_order_plan/query_purchase_requirement_line',
            CommonService.getMenuCode()
        )

        let contact_no = this.data.find(x => x.id == this.selectedRowKeys[0])
            .real_pre_purchase_order

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
                line_data => {
                    this.$modal
                        .open(
                            AddTraceMemoDlg,
                            {
                                info: line_data,
                                contact_no: contact_no
                            },
                            {
                                title: this.$t('action.add_trace_memo_dlg'),
                                width: '1000px'
                            }
                        )
                        .subscribe(
                            data => {
                                for (let key of this.selectedRowKeys) {
                                    var obj = this.data.find(x => x.id === key)

                                    obj.exists_attention = false
                                }

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

    private import_trace_memo() {
        this.$modal
            .open(
                ImportPurchaseProductPlanMemo,
                {},
                {
                    title: this.$t('action.import_trace_memo_dlg'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.$message.success('导入成功')
            })
    }

    private onSelectChange(rowkeys) {
        this.selectedRowKeys = rowkeys
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
                    object_name: 'req_line',
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

    //更换行数据样式
    private tableRowClass(record) {
        if (record.exists_attention) {
            if (record.attention_item === 'produce') {
                return 'redRow'
            }
            if (record.attention_item === 'package') {
                return 'greenRow'
            }
            if (record.attention_item === 'materials') {
                return 'blueRow'
            }
        }
        if (record.is_purchase_changed) {
            return 'purpleRow'
        }
        return ''
    }

    //限制数字输入框只能输入整数
    private limitNumber(value) {
        if (typeof value === 'string') {
            return !isNaN(Number(value)) ? value.replace(/\./g, '') : 0
        } else if (typeof value === 'number') {
            return !isNaN(value) ? String(value).replace(/\./g, '') : 0
        } else {
            return 0
        }
    }
}
</script>

<style scoped>
/deep/ .redRow {
    color: red;
}

/deep/ .purpleRow {
    color: purple;
}

/deep/ .greenRow {
    color: green;
}

/deep/ .blueRow {
    color: blue;
}
</style>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "contact_no": "Contact No.",
            "order_name": "Order Name",
            "vendor_id": "Vendor",
            "order_date": "Order Date",
            "give_date": "Give Date",
            "warehouse_id": "Warehouse",
            "exists_attention": "Need Attention",
            "finish_yn": "Trace Finish",
            "factory_finish": "Factory Finish",
            "is_purchase_changed": "Split Line",
            "default_code": "SKU",
            "new_product": "New Product",
            "product_qty": "Purchase QTY",
            "ist_box_qty": "Is Box",
            "cancel_attention_memo": "Cancel Attention Memo",
            "finish_qty": "Finish QTY",
            "date_expected": "Date Expected",
            "factory_finish_time": "Factory Finish Date",
            "factory_finish_qty": "Factory Finish QTY",
            "note": "Note",
            "sales_change_give_date": "Sales Give Date",
            "sales_change_give_date_memo": "Sales Give Date Memo",
            "buyer_change_give_date": "Purchase Give Date",
            "buyer_change_give_date_memo": "Purchase Give Date Memo",
            "latest_give_date": "Latest Give Date",
            "ac_approved": "QC Confirm Ship",
            "user_purchase": "Purchase",
            "merchandiser": "Merchandiser",
            "new_product": "New Product",
            "un_finish_qty": "Unfinish QTY"
        },
        "action": {
            "create": "Create",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Ok",
            "save": "Save",
            "cancel": "Cancel",
            "confirm": "Confirm",
            "export": "Export Excel",
            "import": "Import Excel",
            "view_logs": "Logs",
            "more": "More",
            "discard": "Discard",
            "export_unfinish_line": "Export Unfinish",
            "edit_finish_qty_vendor": "Multi Edit Finish Qty and Vendor",
            "change_purchase_info": "Multi Change Purchase Info",
            "export_product_specification": "Export Manual Specification",
            "view_purchase_change_log": "Logs",
            "update_btn": "More",
            "cancel_attention": "Cancel Attention",
            "force_finish_trace": "Finish Purchase Item",
            "unfinish_trace": "Unfinish Purchase Item",
            "qc_confirm_ship": "QC Confirm Ship",
            "purchase_finish_dlg": "Finish Item",
            "cancel_attention_dlg": "Cancel Attention Item",
            "add_trace_memo_dlg": "Add Trace Memo",
            "import_trace_memo_dlg": "Import Trace Memo",
            "sync_product_supplier": "Sync Product Supplier",
            "showlog": "View Log"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "cancel": "Are you sure cancel?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "columns": {
            "contact_no": "合同号",
            "order_name": "订单号",
            "vendor_id": "供应商",
            "order_date": "订单日期",
            "give_date": "合同交期",
            "warehouse_id": "仓库",
            "exists_attention": "需要关注",
            "finish_yn": "跟踪完成",
            "factory_finish": "生产完成",
            "is_purchase_changed": "拆分明细",
            "default_code": "SKU",
            "new_product": "新品",
            "product_qty": "采购数量",
            "ist_box_qty": "按箱",
            "cancel_attention_memo": "取消关注备注",
            "finish_qty": "完成数量",
            "date_expected": "期望入库",
            "factory_finish_time": "工厂完成时间",
            "factory_finish_qty": "工厂完成数量",
            "note": "Note",
            "sales_change_give_date": "运营交期",
            "sales_change_give_date_memo": "运营交期变更备注",
            "buyer_change_give_date": "采购交期",
            "buyer_change_give_date_memo": "采购交期变更备注",
            "latest_give_date": "最终交期",
            "ac_approved": "QC确认发货",
            "user_purchase": "采购员",
            "merchandiser": "跟单员",
            "new_product": "新品",
            "un_finish_qty": "未完成数量"
        },
        "action": {
            "create": "新建",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "save": "保存",
            "cancel": "取消",
            "confirm": "确认",
            "export": "导出Excel",
            "import": "导入Excel",
            "view_logs": "日志",
            "more": "更多操作",
            "discard": "丢弃",
            "export_unfinish_line": "导出未完成",
            "edit_finish_qty_vendor": "批量变更发货数量和供应商",
            "change_purchase_info": "批量修改采购信息",
            "export_product_specification": "导出说明书和工艺单",
            "view_purchase_change_log": "日志",
            "update_btn": "更多",
            "cancel_attention": "取消关注",
            "force_finish_trace": "设置跟踪完成",
            "unfinish_trace": "设置跟踪未完成",
            "qc_confirm_ship": "QC质检完成",
            "purchase_finish_dlg": "强制完成",
            "cancel_attention_dlg": "取消关注",
            "add_trace_memo_dlg": "添加跟踪备注",
            "import_trace_memo_dlg": "导入跟踪备注",
            "sync_product_supplier": "Sync Product Supplier",
            "showlog": "查看日志"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功"
    }
}
</i18n>
