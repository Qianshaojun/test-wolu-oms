<template>
    <section class="component order-base-detail">
        <div style="padding:0 20px 10px 0px;" v-show="editAble">
            <a-button @click="addBtn" type="default" size="small">
                <a-icon type="plus" />
                {{ $t('actions.add') }}
            </a-button>
        </div>
        <a-table
            :dataSource="data"
            :pagination="false"
            style="table-layout:fixed;"
            rowKey="index"
            :customRow="
                rowKey => ({
                    on: {
                        // 单击每行
                        click: () => {
                            currentRow = rowKey.index
                        }
                    }
                })
            "
            :scroll="{ x: 2500, y: 500 }"
            bordered
        >
            <a-table-column
                :title="$t('product_id')"
                key="default_code"
                align="center"
            >
                <template slot-scope="row">
                    <a-auto-complete
                        v-if="
                            currentRow == row.index &&
                                editable &&
                                state &&
                                row.id != 'summary'
                        "
                        :dataSource="skuSource"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '300px' }"
                        :defaultValue="row.default_code"
                        @search="onSkuSearch"
                        @change="e => onRowChange(row, 'default_code', e)"
                        size="small"
                        :style="{ width: '100%', background: '#ecc5e9' }"
                        placeholder="input for search"
                        @blur="onSkuBlur(row)"
                    >
                        <template slot="dataSource">
                            <a-select-option
                                v-for="opt in skuSource"
                                :key="opt"
                                :value="opt"
                                :title="opt"
                            >
                                {{ opt }}
                            </a-select-option>
                            <a-select-option
                                key="all"
                                disabled
                                class="show-all"
                            >
                                <a @click="searchMore(row)">
                                    Search More
                                </a>
                            </a-select-option>
                        </template>
                    </a-auto-complete>
                    <span v-else>{{ row.default_code }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('product_qty')"
                key="product_qty"
                align="right"
                style="width:'80px';"
            >
                <template slot-scope="row">
                    <a-input-number
                        decimalSeparator=","
                        v-if="
                            currentRow == row.index &&
                                editable &&
                                state &&
                                row.id != 'summary'
                        "
                        v-decorator="['product_qty']"
                        :value="row.product_qty"
                        :min="0"
                        size="small"
                        :style="{ width: '100%', background: '#ecc5e9' }"
                        @change="e => onRowChange(row, 'product_qty', e)"
                    />
                    <span v-else>{{ row.product_qty }}</span>
                </template>
            </a-table-column>
            <a-table-column title="FBA" key="is_fba" align="center">
                <template slot-scope="row">
                    <span v-if="row.id != 'summary'">
                        <a-checkbox disabled :checked="row.is_fba" />
                    </span>
                    <span v-else> </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('ist_box_qty')"
                key="ist_box_qty"
                align="center"
            >
                <template slot-scope="row">
                    <span v-if="row.id != 'summary'">
                        <a-checkbox disabled :checked="row.ist_box_qty" />
                    </span>
                    <span v-else> </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('sales_expected_give_date')"
                key="sales_expected_give_date"
                align="center"
            >
                <template slot-scope="row">
                    <a-date-picker
                        class="required"
                        v-if="
                            currentRow == row.index &&
                                editable &&
                                state &&
                                row.id != 'summary'
                        "
                        v-decorator="['sales_expected_give_date']"
                        :default-value="
                            row.sales_expected_give_date
                                ? moment(
                                      row.sales_expected_give_date,
                                      'YYYY-MM-DD'
                                  )
                                : null
                        "
                        :style="{ width: '100%', background: '#ecc5e9' }"
                        size="small"
                        format="YYYY-MM-DD"
                        @change="
                            e =>
                                onRowChange(
                                    row,
                                    'sales_expected_give_date',
                                    e.format('YYYY-MM-DD').toString()
                                )
                        "
                    />
                    <span v-else>{{ row.sales_expected_give_date }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('date_expected')"
                key="date_expected"
                align="center"
            >
                <template slot-scope="row">
                    <a-date-picker
                        class="required"
                        v-if="
                            currentRow == row.index &&
                                editable &&
                                state &&
                                row.id != 'summary'
                        "
                        v-decorator="['date_expected']"
                        :default-value="
                            row.date_expected
                                ? moment(row.date_expected, 'YYYY-MM-DD')
                                : null
                        "
                        :style="{ width: '100%', background: '#ecc5e9' }"
                        size="small"
                        format="YYYY-MM-DD"
                        @change="
                            e =>
                                onRowChange(
                                    row,
                                    'date_expected',
                                    e.format('YYYY-MM-DD').toString()
                                )
                        "
                    />
                    <span v-else>{{ row.date_expected }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('product_uom')"
                key="product_uom"
                align="center"
            >
                <template slot-scope="row">
                    <span>{{
                        row.id && row.id != 'summary' ? 'Units' : ''
                    }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('warehouse_id')"
                key="warehouse_id"
                align="center"
            >
                <template slot-scope="row">
                    <a-select
                        class="required"
                        v-if="
                            currentRow == row.index &&
                                editable &&
                                state &&
                                row.id != 'summary'
                        "
                        v-decorator="[
                            'warehouse_id',
                            { initialValue: $dict.WarehouseId[0].value }
                        ]"
                        :value="row.warehouse_id"
                        :style="{ width: '100%', background: '#ecc5e9' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '120px' }"
                        size="small"
                        @change="e => onRowChange(row, 'warehouse_id', e)"
                    >
                        <a-select-option
                            v-for="i of $dict.WarehouseId"
                            :key="i.value"
                            :value="i.value"
                            :title="$t(i.label)"
                        >
                            {{ $t(i.label) }}
                        </a-select-option>
                    </a-select>
                    <span v-else>
                        {{ row.warehouse_id | dict('WarehouseId') | translate }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column :title="$t('dept_id')" key="dept_id" align="center">
                <template slot-scope="row">
                    <span>{{ getDepartName(row.dept_id) }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('is_special_check')"
                key="is_special_check"
                align="center"
            >
                <template slot-scope="row">
                    <span v-if="row.id != 'summary'">
                        <a-checkbox disabled :checked="row.is_special_check" />
                    </span>
                    <span v-else> </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('import_memo')"
                key="import_memo"
                align="center"
            >
                <template slot-scope="row">
                    <!-- <a-textarea
                        v-if="currentRow == row.index && editable"
                        v-decorator="['buyer_change_give_date_memo']"
                        :value="row.buyer_change_give_date_memo"
                        :style="{ width: '100%' }"
                        size="small"
                        @change="
                            e =>
                                onRowChange(
                                    row,
                                    'buyer_change_give_date_memo',
                                    e
                                )
                        "
                    /> -->
                    <span>{{ row.import_memo }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('give_date')"
                key="give_date"
                align="center"
            >
                <template slot-scope="row">
                    <!-- <a-date-picker
                        v-if="currentRow == row.index && editable"
                        v-decorator="['give_date']"
                        :default-value="
                            row.give_date
                                ? moment(row.give_date, 'YYYY-MM-DD')
                                : null
                        "
                        :style="{ width: '100%' }"
                        size="small"
                        format="YYYY-MM-DD"
                        @change="
                            e =>
                                onRowChange(
                                    row,
                                    'give_date',
                                    e.format('YYYY-MM-DD').toString()
                                )
                        "
                    /> -->
                    <span>{{ row.give_date }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('buyer_change_give_date')"
                key="buyer_change_give_date"
                align="center"
            >
                <template slot-scope="row">
                    <!-- <a-date-picker
                        v-if="currentRow == row.index && editable"
                        v-decorator="['buyer_change_give_date']"
                        :default-value="
                            row.buyer_change_give_date
                                ? moment(
                                      row.buyer_change_give_date,
                                      'YYYY-MM-DD'
                                  )
                                : null
                        "
                        :style="{ width: '100%' }"
                        size="small"
                        format="YYYY-MM-DD"
                        @change="
                            e =>
                                onRowChange(
                                    row,
                                    'buyer_change_give_date',
                                    e.format('YYYY-MM-DD').toString()
                                )
                        "
                    /> -->
                    <span>{{ row.buyer_change_give_date }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('buyer_change_give_date_memo')"
                key="buyer_change_give_date_memo"
                align="center"
            >
                <template slot-scope="row">
                    <!-- <a-textarea
                        v-if="currentRow == row.index && editable"
                        v-decorator="['buyer_change_give_date_memo']"
                        :value="row.buyer_change_give_date_memo"
                        :style="{ width: '100%' }"
                        size="small"
                        @change="
                            e =>
                                onRowChange(
                                    row,
                                    'buyer_change_give_date_memo',
                                    e
                                )
                        "
                    /> -->
                    <span>{{ row.buyer_change_give_date_memo }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('real_pre_purchase_order')"
                key="real_pre_purchase_order"
                align="center"
            >
                <template slot-scope="row">
                    <!-- <a-input
                        v-if="currentRow == row.index && editable"
                        v-decorator="['real_pre_purchase_order']"
                        :value="row.real_pre_purchase_order"
                        :style="{ width: '100%' }"
                        size="small"
                        @change="
                            e => onRowChange(row, 'real_pre_purchase_order', e)
                        "
                    /> -->
                    <span>{{ row.real_pre_purchase_order }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('finish_qty')"
                key="finish_qty"
                align="right"
            >
                <template slot-scope="row">
                    <!-- <a-input-number
                        decimalSeparator=","
                        v-if="currentRow == row.index && editable"
                        v-decorator="['finish_qty']"
                        :value="row.finish_qty"
                        :min="0"
                        size="small"
                        :style="{ width: '100%', background: '#ecc5e9' }"
                        @change="e => onRowChange(row, 'finish_qty', e)"
                    /> -->
                    <span>{{ row.finish_qty }}</span>
                </template>
            </a-table-column>
            <a-table-column :title="$t('mrate')" key="mrate" align="center">
                <template slot-scope="row">
                    <!-- <a-input-number
                        decimalSeparator=","
                        v-if="currentRow == row.index && editable"
                        v-decorator="['mrate']"
                        :value="row.mrate"
                        :min="0"
                        size="small"
                        :style="{ width: '100%', background: '#ecc5e9' }"
                        @change="e => onRowChange(row, 'mrate', e)"
                    /> -->
                    <span>{{ row.mrate }}</span>
                </template>
            </a-table-column>

            <a-table-column :title="$t('state')" key="state" align="center">
                <template slot-scope="row">
                    <!-- <a-select
                        v-if="currentRow == row.index && editable"
                        v-decorator="['state']"
                        :value="row.state"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '120px' }"
                        size="small"
                        @change="e => onRowChange(row, 'state', e)"
                    >
                        <a-select-option
                            v-for="i of $dict.ReplenishmentState"
                            :key="i.value"
                            :value="i.value"
                            :title="$t(i.label)"
                        >
                            {{ $t(i.label) }}
                        </a-select-option>
                    </a-select> -->
                    <span>
                        {{ row.state | dict('ReplenishmentState') | translate }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('sales_change_give_date')"
                key="sales_change_give_date"
                align="center"
            >
                <template slot-scope="row">
                    <a-date-picker
                        v-if="
                            currentRow == row.index &&
                                editable &&
                                row.id != 'summary'
                        "
                        v-decorator="['sales_change_give_date']"
                        :default-value="
                            row.sales_change_give_date
                                ? moment(
                                      row.sales_change_give_date,
                                      'YYYY-MM-DD'
                                  )
                                : null
                        "
                        :style="{ width: '100%' }"
                        size="small"
                        format="YYYY-MM-DD"
                        @change="
                            e =>
                                onRowChange(
                                    row,
                                    'sales_change_give_date',
                                    e.format('YYYY-MM-DD').toString()
                                )
                        "
                    />
                    <span v-else>{{ row.sales_change_give_date }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('sales_change_give_date_memo')"
                key="sales_change_give_date_memo"
                align="center"
            >
                <template slot-scope="row">
                    <a-textarea
                        v-if="
                            currentRow == row.index &&
                                editable &&
                                row.id != 'summary'
                        "
                        v-decorator="['sales_change_give_date_memo']"
                        :value="row.sales_change_give_date_memo"
                        :style="{ width: '100%' }"
                        size="small"
                        @change="
                            e =>
                                onRowChange(
                                    row,
                                    'sales_change_give_date_memo',
                                    e
                                )
                        "
                    />
                    <span v-else>{{ row.sales_change_give_date_memo }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('sale_range_from')"
                key="sale_range_from"
                align="center"
            >
                <template slot-scope="row">
                    <a-month-picker
                        v-if="
                            currentRow == row.index &&
                                editable &&
                                row.id != 'summary'
                        "
                        v-decorator="['sale_range_from']"
                        :default-value="
                            row.sale_range_from
                                ? moment(row.sale_range_from, 'YYYY-MM')
                                : null
                        "
                        :style="{ width: '100%' }"
                        size="small"
                        format="YYYY-MM"
                        class="required"
                        @change="
                            e =>
                                onRowChange(
                                    row,
                                    'sale_range_from',
                                    e.format('YYYY-MM').toString()
                                )
                        "
                    />
                    <span v-else>{{ row.sale_range_from }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('sale_range_to')"
                key="sale_range_to"
                align="center"
            >
                <template slot-scope="row">
                    <a-month-picker
                        v-if="
                            currentRow == row.index &&
                                editable &&
                                row.id != 'summary'
                        "
                        v-decorator="['sale_range_to']"
                        :default-value="
                            row.sale_range_to
                                ? moment(row.sale_range_to, 'YYYY-MM')
                                : null
                        "
                        :style="{ width: '100%' }"
                        size="small"
                        format="YYYY-MM"
                        class="required"
                        @change="
                            e =>
                                onRowChange(
                                    row,
                                    'sale_range_to',
                                    e.format('YYYY-MM').toString()
                                )
                        "
                    />
                    <span v-else>{{ row.sale_range_to }}</span>
                </template>
            </a-table-column>
            <a-table-column :title="$t('note')" key="note" align="center">
                <template slot-scope="row">
                    <a-textarea
                        v-if="
                            currentRow == row.index &&
                                editable &&
                                row.id != 'summary'
                        "
                        v-decorator="['note']"
                        :value="row.note"
                        :style="{ width: '100%' }"
                        size="small"
                        @change="e => onRowChange(row, 'note', e)"
                    />
                    <span v-else>{{ row.note }}</span>
                </template>
            </a-table-column>
            <a-table-column :title="$t('cp_note')" key="cp_note" align="center">
                <template slot-scope="row">
                    <a-textarea
                        v-if="
                            currentRow == row.index &&
                                editable &&
                                row.id != 'summary'
                        "
                        v-decorator="['cp_note']"
                        :value="row.cp_note"
                        :style="{ width: '100%' }"
                        size="small"
                        @change="e => onRowChange(row, 'cp_note', e)"
                    />
                    <span v-else>{{ row.cp_note }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('user_purchase')"
                key="user_purchase"
                align="center"
            >
                <template slot-scope="row">
                    <!-- <a-select
                        v-if="currentRow == row.index && editable"
                        v-decorator="['user_purchase']"
                        :value="row.user_purchase"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '200px' }"
                        size="small"
                        @change="e => onRowChange(row, 'user_purchase', e)"
                    >
                        <a-select-option
                            v-for="i of systemUsers"
                            :key="i.code"
                            :value="i.code"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select> -->
                    <span>
                        {{ row.user_purchase | dict2(systemUsers) }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('merchandiser')"
                key="merchandiser"
                align="center"
            >
                <template slot-scope="row">
                    <!-- <a-select
                        v-if="currentRow == row.index && editable"
                        v-decorator="['merchandiser']"
                        :value="row.merchandiser"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '200px' }"
                        size="small"
                        @change="e => onRowChange(row, 'merchandiser', e)"
                    >
                        <a-select-option
                            v-for="i of systemUsers"
                            :key="i.code"
                            :value="i.code"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select> -->
                    <span>
                        {{ row.merchandiser | dict2(systemUsers) }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('product_manual_version')"
                key="product_manual_version"
                align="center"
            >
                <template slot-scope="row">
                    <!-- <a-select
                        v-if="currentRow == row.index && editable"
                        v-decorator="['product_manual_version']"
                        :value="row.product_manual_version"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '200px' }"
                        size="small"
                        @change="
                            e => onRowChange(row, 'product_manual_version', e)
                        "
                    >
                        <a-select-option
                            v-for="i of manualVersionList"
                            :key="i.id"
                            :value="i.id"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select> -->
                    <span>
                        {{ row.product_manual_version }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('product_specification_version')"
                key="product_specification_version"
                align="center"
            >
                <template slot-scope="row">
                    <!-- <a-select
                        v-if="currentRow == row.index && editable"
                        v-decorator="['product_specification_version']"
                        :value="row.product_specification_version"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '200px' }"
                        size="small"
                        @change="
                            e =>
                                onRowChange(
                                    row,
                                    'product_specification_version',
                                    e
                                )
                        "
                    >
                        <a-select-option
                            v-for="i of specVersionList"
                            :key="i.id"
                            :value="i.id"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select> -->
                    <span>
                        {{ row.product_specification_version }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('actions.action')"
                key="action"
                align="center"
            >
                <template slot-scope="row">
                    <a @click="onDel(row)" v-if="state && row.id != 'summary'">
                        {{ $t('actions.delete') }}
                    </a>
                    <a @click="e => cancelBtn(e)" v-if="row.id != 'summary'">
                        {{ $t('actions.cancel') }}
                    </a>
                </template>
            </a-table-column>
        </a-table>
    </section>
</template>

<style>
.ant-select-auto-complete.ant-select-sm .ant-input,
.required .ant-calendar-picker-input,
.required .ant-select-selection--single {
    background-color: #ecc5e9;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ProductService } from '@/services/product.service'
import { RequestParams } from '@/core/http'
import { CommonService } from '@/shared/utils/common.service'
import { formConfig } from '@/config/form.config'
import SearchProduct from '@/components/product/search-product.vue'
import { PickingService } from '../../services/picking.service'
import { LoadingService } from '@/bootstrap/services/loading.service'
import UUID from 'uuidjs'
import moment from 'moment'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { Mutation, namespace } from 'vuex-class'

const datasModule = namespace('datasModule')

@Component({
    components: {}
})
export default class AddReplenishDetail extends Vue {
    @Prop()
    info: any

    @Prop()
    systemUsers: any

    @Prop()
    editAble: any

    @Prop()
    state: any

    private currentRow: any = ''

    private editable: any = true

    private data: any[] = []

    private skuSource: any[] = []

    private skuQueryResult: any[] = []

    private productService = new ProductService()

    private pickingService = new PickingService()

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private operateCnt: any = 0

    private moment = moment

    private manualVersionList: any = []

    private specVersionList: any = []

    private summaryList: any = ['product_qty']

    @datasModule.State
    private departmentList

    @datasModule.Action
    private getDepartmentList

    private mounted() {
        this.editable = this.editAble
        if (this.info && this.info.length) {
            this.data = this.info.map(x => {
                x['index'] = UUID.generate()
                x['save_flag'] = 1
                return x
            })
        }
    }

    @Watch('info')
    private onInfoChange() {
        if (this.info && this.info.length) {
            this.data = this.info.map(x => {
                if (!x.index) {
                    x['index'] = UUID.generate()
                    x['save_flag'] = 1
                }
                return x
            })
            if (
                this.summaryList != undefined &&
                this.summaryList.length &&
                this.data.length
            ) {
                let sm = this.data.find(x => x.id == 'summary')
                let ret: any = CommonService.getSummaryData(
                    this.data,
                    this.summaryList
                )
                if (sm) {
                    for (let i of this.summaryList) {
                        sm[i] = ret[i]
                    }
                } else {
                    ret['id'] = 'summary'
                    ret['index'] = 'summary'
                    this.data.push(ret)

                    this.$nextTick(() => {
                        let querySelector = 'tr[data-row-key="summary"]'
                        let tr: any = document.querySelector(querySelector)
                        tr.style.background = '#fdfdfd'
                    })
                }
            }
        }
    }

    @Watch('editAble')
    private onEditAbleChange() {
        this.editable = this.editAble
    }

    @Watch('data')
    private onDataChange() {
        if (this.data.length) {
            let sm = this.data.find(x => x.id == 'summary')
            if (sm) {
                let ret: any = CommonService.getSummaryData(
                    this.data,
                    this.summaryList
                )
                for (let i of this.summaryList) {
                    sm[i] = ret[i]
                }
            }
        }
    }

    private created() {
        this.getManualVersion()
        this.getSpecVersion()
        this.getDepartmentList()
    }

    private getManualVersion() {
        this.productService
            .query_manual_version(new RequestParams({}))
            .subscribe(
                data => {
                    this.manualVersionList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getSpecVersion() {
        this.productService
            .query_specification_version(new RequestParams({}))
            .subscribe(
                data => {
                    this.specVersionList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private addBtn() {
        this.currentRow = UUID.generate()
        let item = {
            index: this.currentRow,
            save_flag: 0,
            alerts: 0,
            ann_sales: 0,
            buyer_change_give_date: null,
            buyer_change_give_date_memo: null,
            cp_note: '',
            date_expected: null,
            default_code: '',
            eqty: 0,
            finish_qty: 0,
            give_date: null,
            ist_box_qty: false,
            is_special_check: false,
            merchandiser: null,
            mrate: 0,
            note: '',
            period: '',
            persist: 0,
            product_id: 0,
            product_manual_code: '',
            product_manual_url: '',
            product_manual_version: '',
            product_qty: 1,
            product_specification_url: '',
            product_specification_version: '',
            product_ve: '',
            real_pre_purchase_order: '',
            sales_change_give_date: null,
            sales_change_give_date_memo: '',
            sales_expected_give_date: null,
            sequence: 10,
            sqty: 0,
            state: '',
            user_purchase: null,
            warehouse_id: this.$dict.WarehouseId[0].value
        }
        let pos = this.data.length > 0 ? this.data.length - 1 : 0
        this.data.splice(pos, 0, item)
        this.$emit('change', this.data)
    }

    private onRowChange(row, column, value) {
        if (
            Object.prototype.toString.call(value) === '[object InputEvent]' ||
            Object.prototype.toString.call(value) === '[object Event]' ||
            Object.prototype.toString.call(value) === '[object Object]'
        ) {
            if (value.target != undefined && value.target.value != undefined) {
                row[column] = value.target.value
            } else {
                row[column] = value
            }
        } else {
            row[column] = value
        }

        if (column === 'default_code') {
            let productItem = this.skuQueryResult.find(
                x => x.default_code == value
            )
            if (productItem) {
                row.default_code = productItem.default_code
                row.product_id = productItem.product_id
            } else {
                row.default_code = ''
                row.product_id = 0
            }
        }

        this.$emit('change', this.data)
    }

    private cancelBtn(e) {
        e.stopPropagation()
        this.currentRow = -1
    }

    private onDel(row) {
        this.currentRow = -1
        if (row.id) {
            let item = this.data.find(x => x.index === row.index)
            this.innerAction.setActionAPI(
                'purchase_management/delete_purchase_requirement_line',
                CommonService.getMenuCode('replenishment-demand')
            )
            this.publicService
                .modify(
                    new RequestParams(
                        { req_line_id_list: [item.id], state: item.state },
                        {
                            loading: this.loadingService,
                            innerAction: this.innerAction
                        }
                    )
                )
                .subscribe(
                    data => {
                        this.$message.success('删除成功')
                        this.data = this.data.filter(x => x.id != row.id)
                        this.$emit('change', this.data)
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        } else {
            this.data = this.data.filter(x => x.index !== row.index)
        }
    }

    private onSkuSearch(key) {
        let params: any = CommonService.createQueryCondition(
            { default_code: key },
            {
                default_code: 'like',
                ...formConfig.condition
            }
        )
        params['page_index'] = 1
        params['page_size'] = 10
        params['active_ignore'] = true
        this.productService
            .queryAsyncProductInfo(
                new RequestParams(params, { loading: this.loadingService })
            )
            .subscribe(data => {
                if (data && data.length) {
                    this.skuSource = data.map(x => x.default_code)
                    this.skuQueryResult = data
                }
            })
    }

    private searchMore(row) {
        let _that = this
        this.$modal
            .open(
                SearchProduct,
                {},
                {
                    title: '搜索产品',
                    width: '60%'
                }
            )
            .subscribe(data => {
                //sku不能重复
                let item = this.data.find(x => x.index === row.index)
                // item['name'] = '[' + data.default_code + ']' + data.name
                item['product_id'] = data.product_id
                item['default_code'] = data.default_code
                this.currentRow = -1
                setTimeout(function() {
                    _that.currentRow = row.index
                }, 100)
            })
    }

    private serverDelete(id, state) {
        //save
        this.innerAction.setActionAPI(
            'purchase_management/delete_purchase_requirement_line',
            CommonService.getMenuCode('replenishment-demand')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { req_line_id_list: [id], state: state },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('删除成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getDepartName(department) {
        let ret: any = department
        let item = this.departmentList.find(x => x.id == department)
        if (item) {
            ret = item.dept_name
        }
        return ret
    }

    private onSkuBlur(row) {
        if (row.product_id == 0) {
            row.default_code = ''
            this.$message.error('请输入正确的SKU,或者从列表中选择SKU')
            let cr = this.currentRow
            this.currentRow = ''
        }
    }
}
</script>

<i18n>
{
    "en-us": {
        "alerts": "alerts",
        "ann_sales": "ann_sales",
        "buyer_change_give_date": "buyer_change_give_date",
        "buyer_change_give_date_memo": "buyer_change_give_date_memo",
        "cp_note": "cp_note",
        "date_expected": "date_expected",
        "eqty": "eqty",
        "finish_qty": "finish_qty",
        "give_date": "give_date",
        "id": "id",
        "ist_box_qty": "ist_box_qty",
        "merchandiser": "merchandiser",
        "mrate": "mrate",
        "dept_id": "Department",
        "note": "note",
        "period": "period",
        "persist": "persist",
        "product_id": "product_id",
        "product_manual_code": "product_manual_code",
        "product_manual_url": "product_manual_url",
        "product_manual_version": "product_manual_version",
        "product_qty": "product_qty",
        "product_specification_url": "product_specification_url",
        "product_specification_version": "product_specification_version",
        "product_uom": "product_uom",
        "product_ve": "product_ve",
        "real_pre_purchase_order": "real_pre_purchase_order",
        "sales_change_give_date": "sales_change_give_date",
        "sales_change_give_date_memo": "sales_change_give_date_memo",
        "sales_expected_give_date": "sales_expected_give_date",
        "sequence": "sequence",
        "sqty": "sqty",
        "state": "state",
        "user_purchase": "user_purchase",
        "warehouse_id": "warehouse_id",
        "import_memo": "Import Memo",
        "sale_range_from": "Sale Range From",
        "sale_range_to": "Sale Range To",
        "is_special_check" :"Is Need Special Check",
        "actions": {
            "add": "Add",
            "action": "Action",
            "save": "Save",
            "delete": "Delete",
            "cancel": "Cancel"
        }
    },
    "zh-cn": {
        "alerts": "alerts",
        "ann_sales": "ann_sales",
        "buyer_change_give_date": "采购变更交期",
        "buyer_change_give_date_memo": "采购变更交期备注",
        "cp_note": "客诉备注",
        "date_expected": "期望入库",
        "eqty": "eqty",
        "finish_qty": "已发货数量",
        "give_date": "合同交期",
        "id": "id",
        "ist_box_qty": "箱数",
        "merchandiser": "跟单员",
        "mrate": "装箱率",
        "dept_id": "部门",
        "note": "备注",
        "period": "period",
        "persist": "persist",
        "product_id": "产品",
        "product_manual_code": "product_manual_code",
        "product_manual_url": "product_manual_url",
        "product_manual_version": "说明书版本号",
        "product_qty": "产品数量",
        "product_specification_url": "product_specification_url",
        "product_specification_version": "工艺单版本号",
        "product_uom": "产品计量单位",
        "product_ve": "product_ve",
        "real_pre_purchase_order": "实际采购合同号",
        "sales_change_give_date": "运营变更交期",
        "sales_change_give_date_memo": "运营变更交期备注",
        "sales_expected_give_date": "运营期望交期",
        "sequence": "sequence",
        "sqty": "需求个数",
        "state": "状态",
        "user_purchase": "采购员",
        "warehouse_id": "仓库",
        "import_memo": "合同交期备注",
        "sale_range_from": "预售开始月份",
        "sale_range_to": "预售结束月份",
        "is_special_check" :"是否需特批",
        "actions": {
            "add": "新增",
            "action": "操作",
            "save": "保存",
            "delete": "删除",
            "cancel": "取消"
        }
    }
}
</i18n>
