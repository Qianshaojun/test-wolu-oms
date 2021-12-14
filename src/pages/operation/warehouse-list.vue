<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <data-form
            ref="dataForm"
            @submit="getDataList"
            :column="2"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 16, offset: 1 }"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :label="$t('columns.name')"
                        v-decorator="['name']"
                        :placeholder="$t('plzInput')"
                        size="small"
                    />
                </a-form-item>
            </template>
            <template #action>
                <a-button
                    type="primary"
                    :disabled="!needSaveNotes.length"
                    @click="changeNote"
                    >{{ $t('action.save') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="onCreate"
                    style="margin-left: 2px"
                    >{{ $t('action.create') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="onDelete"
                    :disabled="!selectedRowKeys.length"
                    style="margin-left: 2px"
                    >{{ $t('action.delete') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="onImport"
                    style="margin-left: 2px"
                    >{{ $t('action.import') }}
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
                    rowKey="index"
                    :columns="columnList"
                    :rowSelection="{
                        selectedRowKeys: selectedRowKeys,
                        onChange: keys => (selectedRowKeys = keys)
                    }"
                    @on-page-change="getDataList"
                    @onClick="
                        record => {
                            selectedRowKeys = [record]
                            onRowClick(record)
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 2000, y: 400 }"
                >
                    <template slot="name" slot-scope="text, row">
                        <a-input
                            size="small"
                            v-if="editRow.index == row.index"
                            :value="row.name"
                            @change="
                                e => handleChange(e.target.value, row, 'name')
                            "
                        />
                        <span v-else>{{ row.name }}</span></template
                    >
                    <template slot="contact" slot-scope="text, row">
                        <a-input
                            size="small"
                            v-if="editRow.index == row.index"
                            :value="row.contact"
                            @change="
                                e =>
                                    handleChange(e.target.value, row, 'contact')
                            "
                        />
                        <span v-else>{{ row.contact }}</span></template
                    >
                    <template slot="currency_id" slot-scope="text, row">
                        <a-select
                            class="required"
                            v-if="editRow.index == row.index"
                            v-decorator="['currency_id']"
                            :value="row.currency_id"
                            :style="{ width: '100%' }"
                            size="small"
                            @change="e => handleChange(e, row, 'currency_id')"
                        >
                            <a-select-option
                                v-for="i of currencyList"
                                :key="i.code"
                                :value="i.code"
                            >
                                {{ i.name }}
                            </a-select-option>
                        </a-select>
                        <span v-else>{{
                            typeof row.currency_id == 'object' &&
                            row.currency_id.length == 2
                                ? row.currency_id[0]
                                : row.currency_id | dict2(currencyList)
                        }}</span></template
                    >
                    <template slot="unloading_fee" slot-scope="text, row">
                        <a-input
                            size="small"
                            v-if="editRow.index == row.index"
                            :value="row.unloading_fee"
                            @change="
                                e =>
                                    handleChange(
                                        e.target.value,
                                        row,
                                        'unloading_fee'
                                    )
                            "
                        />
                        <span v-else>{{ row.unloading_fee }}</span></template
                    >
                    <template slot="counting_fee" slot-scope="text, row">
                        <a-input-number
                            size="small"
                            v-if="editRow.index == row.index"
                            :value="row.counting_fee"
                            :min="0"
                            @change="e => handleChange(e, row, 'counting_fee')"
                        />
                        <span v-else>{{ row.counting_fee }}</span></template
                    >
                    <template slot="free_storage_period" slot-scope="text, row">
                        <a-input-number
                            size="small"
                            v-if="editRow.index == row.index"
                            :value="row.free_storage_period"
                            :min="0"
                            @change="
                                e => handleChange(e, row, 'free_storage_period')
                            "
                        />
                        <span v-else>{{
                            row.free_storage_period
                        }}</span></template
                    >
                    <template
                        slot="arrival_overtime_fee_1"
                        slot-scope="text, row"
                    >
                        <a-input-number
                            size="small"
                            v-if="editRow.index == row.index"
                            :value="row.arrival_overtime_fee_1"
                            :min="0"
                            @change="
                                e =>
                                    handleChange(
                                        e,
                                        row,
                                        'arrival_overtime_fee_1'
                                    )
                            "
                        />
                        <span v-else>{{
                            row.arrival_overtime_fee_1
                        }}</span></template
                    >
                    <template
                        slot="arrival_overtime_fee_2"
                        slot-scope="text, row"
                    >
                        <a-input-number
                            size="small"
                            v-if="editRow.index == row.index"
                            :value="row.arrival_overtime_fee_2"
                            :min="0"
                            @change="
                                e =>
                                    handleChange(
                                        e,
                                        row,
                                        'arrival_overtime_fee_2'
                                    )
                            "
                        />
                        <span v-else>{{
                            row.arrival_overtime_fee_2
                        }}</span></template
                    >
                    <template
                        slot="arrival_overtime_fee_3"
                        slot-scope="text, row"
                    >
                        <a-input-number
                            size="small"
                            v-if="editRow.index == row.index"
                            :value="row.arrival_overtime_fee_3"
                            :min="0"
                            @change="
                                e =>
                                    handleChange(
                                        e,
                                        row,
                                        'arrival_overtime_fee_3'
                                    )
                            "
                        />
                        <span v-else>{{
                            row.arrival_overtime_fee_3
                        }}</span></template
                    >
                    <template slot="labeling_fee" slot-scope="text, row">
                        <a-input-number
                            size="small"
                            v-if="editRow.index == row.index"
                            :value="row.labeling_fee"
                            :min="0"
                            @change="e => handleChange(e, row, 'labeling_fee')"
                        />
                        <span v-else>{{ row.labeling_fee }}</span></template
                    >
                    <template slot="replacement_fee" slot-scope="text, row">
                        <a-input-number
                            size="small"
                            v-if="editRow.index == row.index"
                            :value="row.replacement_fee"
                            :min="0"
                            @change="
                                e => handleChange(e, row, 'replacement_fee')
                            "
                        />
                        <span v-else>{{ row.replacement_fee }}</span></template
                    >
                    <template slot="pallet_fee" slot-scope="text, row">
                        <a-input-number
                            size="small"
                            v-if="editRow.index == row.index"
                            :value="row.pallet_fee"
                            :min="0"
                            @change="e => handleChange(e, row, 'pallet_fee')"
                        />
                        <span v-else>{{ row.pallet_fee }}</span></template
                    >
                    <template slot="pallet_transfer_fee" slot-scope="text, row">
                        <a-input-number
                            size="small"
                            v-if="editRow.index == row.index"
                            :value="row.pallet_transfer_fee"
                            :min="0"
                            @change="
                                e => handleChange(e, row, 'pallet_transfer_fee')
                            "
                        />
                        <span v-else>{{
                            row.pallet_transfer_fee
                        }}</span></template
                    >
                    <template slot="parcel_transfer_fee" slot-scope="text, row">
                        <a-input-number
                            size="small"
                            v-if="editRow.index == row.index"
                            :value="row.parcel_transfer_fee"
                            :min="0"
                            @change="
                                e => handleChange(e, row, 'parcel_transfer_fee')
                            "
                        />
                        <span v-else>{{
                            row.parcel_transfer_fee
                        }}</span></template
                    >
                    <template
                        slot="parcel_final_logistics_fee"
                        slot-scope="text, row"
                    >
                        <a-input-number
                            size="small"
                            v-if="editRow.index == row.index"
                            :value="row.parcel_final_logistics_fee"
                            :min="0"
                            @change="
                                e =>
                                    handleChange(
                                        e,
                                        row,
                                        'parcel_final_logistics_fee'
                                    )
                            "
                        />
                        <span v-else>{{
                            row.parcel_final_logistics_fee
                        }}</span></template
                    >
                    <template
                        slot="pallet_logistics_fee"
                        slot-scope="text, row"
                    >
                        <a-input
                            size="small"
                            v-if="editRow.index == row.index"
                            :value="row.pallet_logistics_fee"
                            @change="
                                e =>
                                    handleChange(
                                        e.target.value,
                                        row,
                                        'pallet_logistics_fee'
                                    )
                            "
                        />
                        <span v-else>{{
                            row.pallet_logistics_fee
                        }}</span></template
                    >
                    <template
                        slot="transfer_instruction_fee"
                        slot-scope="text, row"
                    >
                        <a-input-number
                            size="small"
                            v-if="editRow.index == row.index"
                            :value="row.transfer_instruction_fee"
                            :min="0"
                            @change="
                                e =>
                                    handleChange(
                                        e,
                                        row,
                                        'transfer_instruction_fee'
                                    )
                            "
                        />
                        <span v-else>{{
                            row.transfer_instruction_fee
                        }}</span></template
                    >
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
                <template slot="name" slot-scope="text, row">
                    <a-input
                        size="small"
                        v-if="editRow.index == row.index"
                        :value="row.name"
                        @change="e => handleChange(e.target.value, row, 'name')"
                    />
                    <span v-else>{{ row.name }}</span></template
                >
                <template slot="contact" slot-scope="text, row">
                    <a-input
                        size="small"
                        v-if="editRow.index == row.index"
                        :value="row.contact"
                        @change="
                            e => handleChange(e.target.value, row, 'contact')
                        "
                    />
                    <span v-else>{{ row.contact }}</span></template
                >
                <template slot="currency_id" slot-scope="text, row">
                    <a-select
                        class="required"
                        v-if="editRow.index == row.index"
                        v-decorator="['currency_id']"
                        :value="row.currency_id"
                        :style="{ width: '100%' }"
                        size="small"
                        @change="e => handleChange(e, row, 'currency_id')"
                    >
                        <a-select-option
                            v-for="i of currencyList"
                            :key="i.code"
                            :value="i.code"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select>
                    <span v-else>{{
                        typeof row.currency_id == 'object' &&
                        row.currency_id.length == 2
                            ? row.currency_id[0]
                            : row.currency_id | dict2(currencyList)
                    }}</span></template
                >
                <template slot="unloading_fee" slot-scope="text, row">
                    <a-input
                        size="small"
                        v-if="editRow.index == row.index"
                        :value="row.unloading_fee"
                        @change="
                            e =>
                                handleChange(
                                    e.target.value,
                                    row,
                                    'unloading_fee'
                                )
                        "
                    />
                    <span v-else>{{ row.unloading_fee }}</span></template
                >
                <template slot="counting_fee" slot-scope="text, row">
                    <a-input-number
                        size="small"
                        v-if="editRow.index == row.index"
                        :value="row.counting_fee"
                        :min="0"
                        @change="e => handleChange(e, row, 'counting_fee')"
                    />
                    <span v-else>{{ row.counting_fee }}</span></template
                >
                <template slot="free_storage_period" slot-scope="text, row">
                    <a-input-number
                        size="small"
                        v-if="editRow.index == row.index"
                        :value="row.free_storage_period"
                        :min="0"
                        @change="
                            e => handleChange(e, row, 'free_storage_period')
                        "
                    />
                    <span v-else>{{ row.free_storage_period }}</span></template
                >
                <template slot="arrival_overtime_fee_1" slot-scope="text, row">
                    <a-input-number
                        size="small"
                        v-if="editRow.index == row.index"
                        :value="row.arrival_overtime_fee_1"
                        :min="0"
                        @change="
                            e => handleChange(e, row, 'arrival_overtime_fee_1')
                        "
                    />
                    <span v-else>{{
                        row.arrival_overtime_fee_1
                    }}</span></template
                >
                <template slot="arrival_overtime_fee_2" slot-scope="text, row">
                    <a-input-number
                        size="small"
                        v-if="editRow.index == row.index"
                        :value="row.arrival_overtime_fee_2"
                        :min="0"
                        @change="
                            e => handleChange(e, row, 'arrival_overtime_fee_2')
                        "
                    />
                    <span v-else>{{
                        row.arrival_overtime_fee_2
                    }}</span></template
                >
                <template slot="arrival_overtime_fee_3" slot-scope="text, row">
                    <a-input-number
                        size="small"
                        v-if="editRow.index == row.index"
                        :value="row.arrival_overtime_fee_3"
                        :min="0"
                        @change="
                            e => handleChange(e, row, 'arrival_overtime_fee_3')
                        "
                    />
                    <span v-else>{{
                        row.arrival_overtime_fee_3
                    }}</span></template
                >
                <template slot="labeling_fee" slot-scope="text, row">
                    <a-input-number
                        size="small"
                        v-if="editRow.index == row.index"
                        :value="row.labeling_fee"
                        :min="0"
                        @change="e => handleChange(e, row, 'labeling_fee')"
                    />
                    <span v-else>{{ row.labeling_fee }}</span></template
                >
                <template slot="replacement_fee" slot-scope="text, row">
                    <a-input-number
                        size="small"
                        v-if="editRow.index == row.index"
                        :value="row.replacement_fee"
                        :min="0"
                        @change="e => handleChange(e, row, 'replacement_fee')"
                    />
                    <span v-else>{{ row.replacement_fee }}</span></template
                >
                <template slot="pallet_fee" slot-scope="text, row">
                    <a-input-number
                        size="small"
                        v-if="editRow.index == row.index"
                        :value="row.pallet_fee"
                        :min="0"
                        @change="e => handleChange(e, row, 'pallet_fee')"
                    />
                    <span v-else>{{ row.pallet_fee }}</span></template
                >
                <template slot="pallet_transfer_fee" slot-scope="text, row">
                    <a-input-number
                        size="small"
                        v-if="editRow.index == row.index"
                        :value="row.pallet_transfer_fee"
                        :min="0"
                        @change="
                            e => handleChange(e, row, 'pallet_transfer_fee')
                        "
                    />
                    <span v-else>{{ row.pallet_transfer_fee }}</span></template
                >
                <template slot="parcel_transfer_fee" slot-scope="text, row">
                    <a-input-number
                        size="small"
                        v-if="editRow.index == row.index"
                        :value="row.parcel_transfer_fee"
                        :min="0"
                        @change="
                            e => handleChange(e, row, 'parcel_transfer_fee')
                        "
                    />
                    <span v-else>{{ row.parcel_transfer_fee }}</span></template
                >
                <template
                    slot="parcel_final_logistics_fee"
                    slot-scope="text, row"
                >
                    <a-input-number
                        size="small"
                        v-if="editRow.index == row.index"
                        :value="row.parcel_final_logistics_fee"
                        :min="0"
                        @change="
                            e =>
                                handleChange(
                                    e,
                                    row,
                                    'parcel_final_logistics_fee'
                                )
                        "
                    />
                    <span v-else>{{
                        row.parcel_final_logistics_fee
                    }}</span></template
                >
                <template slot="pallet_logistics_fee" slot-scope="text, row">
                    <a-input
                        size="small"
                        v-if="editRow.index == row.index"
                        :value="row.pallet_logistics_fee"
                        @change="
                            e =>
                                handleChange(
                                    e.target.value,
                                    row,
                                    'pallet_logistics_fee'
                                )
                        "
                    />
                    <span v-else>{{ row.pallet_logistics_fee }}</span></template
                >
                <template
                    slot="transfer_instruction_fee"
                    slot-scope="text, row"
                >
                    <a-input-number
                        size="small"
                        v-if="editRow.index == row.index"
                        :value="row.transfer_instruction_fee"
                        :min="0"
                        @change="
                            e =>
                                handleChange(e, row, 'transfer_instruction_fee')
                        "
                    />
                    <span v-else>{{
                        row.transfer_instruction_fee
                    }}</span></template
                >
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
import AddReplenishContract from '~/components/purchase/add-replenish-contract.vue'
import PurchaseReturn from '~/components/purchase/purchase-return.vue'
import { formConfig } from '@/config/form.config'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import UUID from 'uuidjs'
import UploadExcel from '@/shared/common/upload-excel.vue'
import { CurrencyService } from '@/services/currency.service'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'warehouse-list'
})
@Component({
    components: {
        AddReplenishContract,
        PurchaseReturn,
        GroupbyTable,
        AutoColumnTable
    }
})
export default class WarehouseList extends Vue {
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
    private currencyService = new CurrencyService()
    // 表格数据源
    private data: any[] = []

    private reasonList: any = []

    private groupbyList: any = []

    private allNameAuth: any = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private current = null
    private orderBy: any = ''

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private currencyList: any = []

    private columnList: any = []

    private editRow: any = {
        index: null
    }

    private queryUrl: any = '/overseas_warehouse_list/query_all'

    private get rules() {
        return {}
    }

    public created() {
        this.getSystemuser()
        this.getcurrency()
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
    }

    private onGroupbyListChange() {
        this.groupbyList = this.dataForm.checkedGroupbyList
    }

    private getcurrency() {
        this.currencyService.getCurrency(new RequestParams({})).subscribe(
            data => {
                this.currencyList = data
            },
            err => {}
        )
    }

    /**
     * 获取订单数据
     */
    private getDataList() {
        this.dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                name: 'in_or_like',
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
                            value: new Date(
                                item.value[0].format('YYYY-MM-DD') + ' 00:00:00'
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
                                x['index'] = UUID.generate()
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

    private onCreate() {
        let item = {
            index: UUID.generate(),
            save_flag: 0,
            id: 0,
            name: '',
            contact: '',
            currency_id: null,
            unloading_fee: '',
            counting_fee: 0,
            free_storage_period: 0,
            arrival_overtime_fee_1: 0,
            arrival_overtime_fee_2: 0,
            arrival_overtime_fee_3: 0,
            labeling_fee: 0,
            replacement_fee: 0,
            pallet_fee: 0,
            pallet_transfer_fee: 0,
            parcel_transfer_fee: 0,
            parcel_final_logistics_fee: 0,
            pallet_logistics_fee: '',
            transfer_instruction_fee: 0
        }
        this.data.push(item)

        this.needSaveNotes.push(item)
    }

    private getUserName(code) {
        let ret: any = code
        let item = this.systemUsers.find(x => x.code == code)
        if (item) {
            ret = item.name
        }
        return ret
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

    private calcStyle(row) {
        this.$nextTick(() => {
            if (row.date_approve && !row.new_product) {
                let no_order_7day: any = row.no_order_7day
                let no_order_3day: any = row.no_order_3day

                let sp: any = document.getElementById('id' + row.id)
                let tr = sp.parentNode.parentNode
                if (no_order_7day) {
                    tr.style.color = 'red'
                } else if (no_order_3day) {
                    tr.style.color = '#f90'
                }
            }
        })
    }

    private onRowClick(row) {
        this.editRow = {
            index: row
        }
    }

    private needSaveNotes: any = []

    private handleChange(e, row, column) {
        row[column] = e
        let item = this.needSaveNotes.find(x => x.index == row.index)
        if (item) {
            item[column] = e
        } else {
            let note: any = {
                index: row.index,
                id: row.id,
                save_flag: 1
            }
            note[column] = e
            this.needSaveNotes.push(note)
        }
    }

    private changeNote(row) {
        let create_list: any = []
        let edit_list: any = []
        let delete_list: any = []
        let params = JSON.parse(JSON.stringify(this.needSaveNotes))
        for (let i of params) {
            delete i.index
            if (i.id > 0) {
                if (i.save_flag == 2) {
                    delete_list.push(i.id)
                } else {
                    edit_list.push(i)
                }
            } else {
                delete i.id
                create_list.push(i)
            }
        }

        this.innerAction.setActionAPI(
            '/overseas_warehouse_list/modify_record',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        create_list: create_list,
                        edit_list: edit_list,
                        delete_list: delete_list
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.needSaveNotes = []
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDelete() {
        for (let i of this.selectedRowKeys) {
            let item = this.data.find(x => x.index == i)
            if (!item) {
                this.$message.error('数据错误')
            }
            if (item.id == 0) {
                this.data = this.data.filter(y => y.index != i)
            } else {
                this.needSaveNotes = this.needSaveNotes.filter(
                    z => z.index != i
                )
                this.needSaveNotes.push({
                    index: i,
                    id: item.id,
                    save_flag: 2
                })
            }
        }
        this.$message.success('删除成功，请点击“保存”按钮执行操作')
    }

    private onImport() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        '/overseas_warehouse_list/import_excel_batch_modify'
                },
                {
                    title: this.$t('action.import')
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
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "name": "Name"
        },
        "action": {
            "create": "Add Item",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "export": "Export",
            "import": "Import",
            "replenish_split": "ReplenishSplit",
            "add_replenishment_contract": "Add Replenishment Contract",
            "purchase_return": "Purchase Return",
            "save": "Save",
            "import": "Import"
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
            "name": "海外仓合作公司名称"
        },
        "action": {
            "create": "新增行",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "export": "导出",
            "import": "导入",
            "replenish_split": "拆分补货需求",
            "return_purchase": "退回补货",
            "add_replenishment_contract": "新建采购合同",
            "purchase_return": "退回补货",
            "save": "保存",
            "import": "导入"
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
