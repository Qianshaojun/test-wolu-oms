<template>
    <section class="component edit-customer">
        <data-form
            :extends="extendItems"
            ref="dataForm"
            @submit="getPurchasePredictList"
            :column="2"
            :showHeader="false"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.status')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['status', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onStatusChange(e)"
                    >
                        <a-radio-button value>{{
                            $t('dict.all')
                        }}</a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of purchaseStatus"
                            :key="item.value"
                            >{{ $t(item.label) }}</a-radio-button
                        >
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.week_avg_sales')"
                    style="height:35px;margin:0;"
                >
                    <a-input-number
                        v-decorator="['week_avg_sales']"
                        :style="{ width: '80px' }"
                        size="small"
                        :min="0"
                        decimalSeparator=","
                    />
                    <span style="margin:0 5px;">~</span>
                    <a-input-number
                        v-decorator="['week_avg_sales_max']"
                        :style="{ width: '80px' }"
                        size="small"
                        :min="0"
                        decimalSeparator=","
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['z_sub_category']"
                        :style="{ width: '300px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['default_code']"
                        :style="{ width: '300px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.include_presale_order')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'include_presale_order',
                            { initialValue: '' }
                        ]"
                        size="small"
                        :style="{ height: '20px' }"
                    >
                        <a-radio value>{{ $t('dict.all') }}</a-radio>
                        <a-radio value="1">{{ $t('yes') }}</a-radio>
                        <a-radio value="0">{{ $t('no') }}</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.is_presale')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['is_presale', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                    >
                        <a-radio value>{{ $t('dict.all') }}</a-radio>
                        <a-radio value="1">{{ $t('yes') }}</a-radio>
                        <a-radio value="0">{{ $t('no') }}</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.is_second_presale')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'is_second_presale',
                            { initialValue: '' }
                        ]"
                        size="small"
                        :style="{ height: '20px' }"
                    >
                        <a-radio value>{{ $t('dict.all') }}</a-radio>
                        <a-radio value="1">{{ $t('yes') }}</a-radio>
                        <a-radio value="0">{{ $t('no') }}</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.calculate_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        v-decorator="['calculate_date']"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    v-show="!info"
                    :label="$t('columns.warehouse_id')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['warehouse_id', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onStatusChange(e)"
                    >
                        <a-radio-button value>{{
                            $t('dict.all')
                        }}</a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of $dict.WarehouseId"
                            :key="item.value"
                            >{{ $t(item.label) }}</a-radio-button
                        >
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    v-show="!info"
                    :label="$t('columns.exists_exception')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['exists_exception', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                    >
                        <a-radio value>{{ $t('dict.all') }}</a-radio>
                        <a-radio value="1">{{ $t('yes') }}</a-radio>
                        <a-radio value="0">{{ $t('no') }}</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    v-show="!info"
                    :label="$t('columns.purchase_status')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['purchase_status', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onStatusChange(e)"
                    >
                        <a-radio-button value>{{
                            $t('dict.all')
                        }}</a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of $dict.PurchaseStatus"
                            :key="item.value"
                            >{{ $t(item.label) }}</a-radio-button
                        >
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.vendor_name')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['vendor_name', { initialValue: '' }]"
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
                            v-for="item of vender_data"
                            :key="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>

            <template #action>
                <a-button
                    type="primary"
                    @click="onPurchaseApply()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.purchase_apply') }}</a-button
                >
                <a-button
                    type="primary"
                    @click="exportRows()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.export') }}</a-button
                >
                <a-button
                    type="primary"
                    @click="reCalculate()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.edit') }}</a-button
                >
                <a-button
                    type="primary"
                    v-show="!info"
                    @click="verify_sales()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.active') }}</a-button
                >
                <a-button
                    type="primary"
                    v-show="info === 'predict-confirm'"
                    @click="verify_sales_manager()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.confirm') }}</a-button
                >
                <a-button
                    type="primary"
                    v-show="info === 'predict-approve'"
                    @click="verify_sales_director()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.verify') }}</a-button
                >
                <a-button
                    type="primary"
                    v-show="!info"
                    @click="confirm_sales()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.to_draft') }}</a-button
                >
                <a-button
                    type="primary"
                    v-show="info === 'predict-confirm'"
                    @click="confirm_sales_manager()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.confirm_refuse') }}</a-button
                >
                <a-button
                    type="primary"
                    v-show="info === 'predict-confirm'"
                    @click="return_sales_manager()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.return') }}</a-button
                >
                <a-button
                    type="primary"
                    v-show="info === 'predict-confirm'"
                    @click="confirm_return_sales_manager()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.confirm_return_sales_manager') }}</a-button
                >
                <a-button
                    type="primary"
                    v-show="info === 'predict-approve'"
                    @click="refuse_sales_director()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.refuse') }}</a-button
                >
            </template>
        </data-form>
        <a-card class="margin-y">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="calculate_code"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: (keys, select_rows) => {
                        selectedRows = select_rows
                        selectedRowKeys = keys
                    }
                }"
                @on-page-change="getPurchasePredictList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                        onTrClick(record)
                    }
                "
                style="table-layout:fixed;"
                @change="sorter => onTableChange(sorter)"
                :scroll="{ y: 320, x: 3600 }"
                size="small"
            >
                <a-table-column
                    title="SKU"
                    key="default_code"
                    width="4.4%"
                    align="left"
                    :sorter="true"
                >
                    <template slot-scope="row">
                        <span :class="calcStyle(row)">{{
                            row.default_code
                        }}</span></template
                    >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.purchase_sku')"
                    key="purchase_sku"
                    width="4.4%"
                    align="left"
                    :sorter="true"
                >
                    <template slot-scope="row">
                        <span :title="row.purchase_sku">{{
                            row.purchase_sku
                                ? row.purchase_sku.substr(0, 10) + '...'
                                : ''
                        }}</span></template
                    >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.de_available_qty')"
                    key="de_available_qty"
                    :style="{ 'min-width': '500px !important' }"
                    width="3.2%"
                    class="minWidth160"
                >
                    <template slot-scope="row">
                        DE:{{ row.de_available_qty }}
                        <br />
                        <span style="color:red;">UK:</span
                        >{{ row.uk_available_qty }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.month_1_transit_qty')"
                    data-index="month_1_transit_qty"
                    key="month_1_transit_qty"
                    width="2.2%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.month_2_transit_qty')"
                    data-index="month_2_transit_qty"
                    key="month_2_transit_qty"
                    width="2.2%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.transit_qty')"
                    data-index="transit_qty"
                    key="transit_qty"
                    width="2.2%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.month_1_unship_qty')"
                    data-index="month_1_unship_qty"
                    key="month_1_unship_qty"
                    width="2.2%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.month_2_unship_qty')"
                    data-index="month_2_unship_qty"
                    key="month_2_unship_qty"
                    width="2.2%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.month_3_unship_qty')"
                    data-index="month_3_unship_qty"
                    key="month_3_unship_qty"
                    width="2.2%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.unship_qty')"
                    data-index="unship_qty"
                    key="unship_qty"
                    width="2.2%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.week_sales') + '一'"
                    key="week_1_sales"
                    width="2%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span
                            style="color:red;"
                            v-if="row.presale_week_1_sales > 0"
                            :title="row.presale_week_1_sales"
                            >{{ row.week_1_sales }}</span
                        >
                        <span
                            style="color:blue;"
                            v-else-if="row.presale_week_1_sales == -1"
                            >{{ row.week_1_sales }}</span
                        >
                        <span v-else>{{ row.week_1_sales }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.week_sales') + '二'"
                    key="week_2_sales"
                    width="2%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span
                            style="color:red;"
                            v-if="row.presale_week_2_sales > 0"
                            :title="row.presale_week_2_sales"
                            >{{ row.week_2_sales }}</span
                        >
                        <span
                            style="color:blue;"
                            v-else-if="row.presale_week_2_sales == -1"
                            >{{ row.week_2_sales }}</span
                        >
                        <span v-else>{{ row.week_2_sales }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.week_sales') + '三'"
                    key="week_3_sales"
                    width="2%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span
                            style="color:red;"
                            v-if="row.presale_week_3_sales > 0"
                            :title="row.presale_week_3_sales"
                            >{{ row.week_3_sales }}</span
                        >
                        <span
                            style="color:blue;"
                            v-else-if="row.presale_week_3_sales == -1"
                            >{{ row.week_3_sales }}</span
                        >
                        <span v-else>{{ row.week_3_sales }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.week_sales') + '四'"
                    key="week_4_sales"
                    width="2%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span
                            style="color:red;"
                            v-if="row.presale_week_4_sales > 0"
                            :title="row.presale_week_4_sales"
                            >{{ row.week_4_sales }}</span
                        >
                        <span
                            style="color:blue;"
                            v-else-if="row.presale_week_4_sales == -1"
                            >{{ row.week_4_sales }}</span
                        >
                        <span v-else>{{ row.week_4_sales }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.week_sales') + '五'"
                    key="week_5_sales"
                    width="2%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span
                            style="color:red;"
                            v-if="row.presale_week_5_sales > 0"
                            :title="row.presale_week_5_sales"
                            >{{ row.week_5_sales }}</span
                        >
                        <span
                            style="color:blue;"
                            v-else-if="row.presale_week_5_sales == -1"
                            >{{ row.week_5_sales }}</span
                        >
                        <span v-else>{{ row.week_5_sales }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.week_sales') + '六'"
                    key="week_6_sales"
                    width="2%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span
                            style="color:red;"
                            v-if="row.presale_week_6_sales > 0"
                            :title="row.presale_week_6_sales"
                            >{{ row.week_6_sales }}</span
                        >
                        <span
                            style="color:blue;"
                            v-else-if="row.presale_week_6_sales == -1"
                            >{{ row.week_6_sales }}</span
                        >
                        <span v-else>{{ row.week_6_sales }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.week_sales') + '七'"
                    key="week_7_sales"
                    width="2%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span
                            style="color:red;"
                            v-if="row.presale_week_7_sales > 0"
                            :title="row.presale_week_7_sales"
                            >{{ row.week_7_sales }}</span
                        >
                        <span
                            style="color:blue;"
                            v-else-if="row.presale_week_7_sales == -1"
                            >{{ row.week_7_sales }}</span
                        >
                        <span v-else>{{ row.week_7_sales }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.week_sales') + '八'"
                    key="week_8_sales"
                    width="2%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span
                            style="color:red;"
                            v-if="row.presale_week_8_sales > 0"
                            :title="row.presale_week_8_sales"
                            >{{ row.week_8_sales }}</span
                        >
                        <span
                            style="color:blue;"
                            v-else-if="row.presale_week_8_sales == -1"
                            >{{ row.week_8_sales }}</span
                        >
                        <span v-else>{{ row.week_8_sales }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.week_sales') + '九'"
                    key="week_9_sales"
                    width="2%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span
                            style="color:red;"
                            v-if="row.presale_week_9_sales > 0"
                            :title="row.presale_week_9_sales"
                            >{{ row.week_9_sales }}</span
                        >
                        <span
                            style="color:blue;"
                            v-else-if="row.presale_week_9_sales == -1"
                            >{{ row.week_9_sales }}</span
                        >
                        <span v-else>{{ row.week_9_sales }}</span>
                    </template></a-table-column
                >
                <a-table-column
                    :title="$t('columns.week_sales') + '十'"
                    key="week_10_sales"
                    width="2%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span
                            style="color:red;"
                            v-if="row.presale_week_10_sales > 0"
                            :title="row.presale_week_10_sales"
                            >{{ row.week_10_sales }}</span
                        >
                        <span
                            style="color:blue;"
                            v-else-if="row.presale_week_10_sales == -1"
                            >{{ row.week_10_sales }}</span
                        >
                        <span v-else>{{ row.week_10_sales }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.week_sales') + '十一'"
                    key="week_11_sales"
                    width="2%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span
                            style="color:red;"
                            v-if="row.presale_week_11_sales > 0"
                            :title="row.presale_week_11_sales"
                            >{{ row.week_11_sales }}</span
                        >
                        <span
                            style="color:blue;"
                            v-else-if="row.presale_week_11_sales == -1"
                            >{{ row.week_11_sales }}</span
                        >
                        <span v-else>{{ row.week_11_sales }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.week_sales') + '十二'"
                    key="week_12_sales"
                    width="2%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span
                            style="color:red;"
                            v-if="row.presale_week_12_sales > 0"
                            :title="row.presale_week_12_sales"
                            >{{ row.week_12_sales }}</span
                        >
                        <span
                            style="color:blue;"
                            v-else-if="row.presale_week_12_sales == -1"
                            >{{ row.week_12_sales }}</span
                        >
                        <span v-else>{{ row.week_12_sales }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.week_0_sales')"
                    key="week_0_sales"
                    width="3%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span
                            style="color:red;"
                            v-if="row.presale_week_0_sales > 0"
                            :title="row.presale_week_0_sales"
                            >{{ row.week_0_sales }}</span
                        >
                        <span
                            style="color:blue;"
                            v-else-if="row.presale_week_0_sales == -1"
                            >{{ row.week_0_sales }}</span
                        >
                        <span v-else>{{ row.week_0_sales }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.week_avg_sales')"
                    key="week_avg_sales"
                    data-index="week_avg_sales"
                    width="3%"
                    align="right"
                    :sorter="true"
                >
                    <template slot-scope="week_avg_sales, row">
                        <span
                            v-if="row.include_presale_order"
                            style="color:red;"
                        >
                            {{ week_avg_sales.toFixed(1) }}
                        </span>
                        <span v-else style="color:gray;">
                            {{ week_avg_sales.toFixed(1) }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.cp_qty_ratio')"
                    key="cp_qty_ratio"
                    width="3%"
                    align="right"
                >
                    <template slot-scope="row">{{
                        row.cp_qty_ratio > 0 ? row.cp_qty_ratio.toFixed(1) : 0
                    }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.cp_order_ratio')"
                    key="cp_order_ratio"
                    width="3%"
                    align="right"
                >
                    <template slot-scope="row">{{
                        row.cp_order_ratio > 0
                            ? row.cp_order_ratio.toFixed(1)
                            : 0
                    }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.pre_week_sales') + '一'"
                    key="will_1_sales"
                    width="2%"
                    align="right"
                >
                    <template slot-scope="row">{{
                        row.will_1_sales.toFixed(1)
                    }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.pre_week_sales') + '二'"
                    key="will_2_sales"
                    width="2%"
                    align="right"
                >
                    <template slot-scope="row">{{
                        row.will_2_sales.toFixed(1)
                    }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.pre_week_sales') + '三'"
                    key="will_3_sales"
                    width="2%"
                    align="right"
                >
                    <template slot-scope="row">{{
                        row.will_3_sales.toFixed(1)
                    }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.pre_week_sales') + '四'"
                    key="will_4_sales"
                    width="2%"
                    align="right"
                >
                    <template slot-scope="row">{{
                        row.will_4_sales.toFixed(1)
                    }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.pre_week_sales') + '五'"
                    key="will_5_sales"
                    width="2%"
                    align="right"
                >
                    <template slot-scope="row">{{
                        row.will_5_sales.toFixed(1)
                    }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.pre_week_sales') + '六'"
                    key="will_6_sales"
                    width="2%"
                    align="right"
                >
                    <template slot-scope="row">{{
                        row.will_6_sales.toFixed(1)
                    }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.status')"
                    key="status"
                    width="3%"
                    align="center"
                >
                    <template slot-scope="row">
                        <span
                            v-if="row.status == 100"
                            style="color:red;"
                            :title="row.approve_memo"
                        >
                            {{ row.status | dict('PredictStatus') | translate }}
                        </span>
                        <span
                            v-else-if="row.status == 200"
                            style="color:red;"
                            :title="
                                info === 'predict-approve'
                                    ? row.return_memo
                                    : row.refuse_memo
                            "
                        >
                            {{ row.status | dict('PredictStatus') | translate }}
                        </span>
                        <span v-else>
                            {{ row.status | dict('PredictStatus') | translate }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.purchase_cycle')"
                    key="purchase_cycle"
                    width="3%"
                    align="right"
                >
                    <template slot-scope="row">{{
                        (row.purchase_cycle / 7).toFixed(1)
                    }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.sale_cycle')"
                    key="sale_cycle"
                    width="3%"
                    align="right"
                >
                    <template slot-scope="row">{{
                        (row.sale_cycle / 7).toFixed(1)
                    }}</template>
                </a-table-column>
                <!-- <a-table-column
                    :title="$t('columns.increase_ratio') + 1"
                    data-index="increase_ratio_1"
                    key="increase_ratio_1"
                    width="3%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.increase_ratio') + 2"
                    data-index="increase_ratio_2"
                    key="increase_ratio_2"
                    width="3%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.increase_ratio') + 3"
                    data-index="increase_ratio_3"
                    key="increase_ratio_3"
                    width="3%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.increase_ratio') + 4"
                    data-index="increase_ratio_4"
                    key="increase_ratio_4"
                    width="3%"
                    align="right"
                ></a-table-column> -->
                <a-table-column
                    :title="$t('columns.increase_ratio_text')"
                    key="increase_ratio_text"
                    data-index="increase_ratio_text"
                    width="9%"
                    align="left"
                >
                    <template slot-scope="increase_ratio_text, row">
                        <span
                            v-if="row.increase_ratio_changed"
                            style="color:red;"
                            :title="row.change_increase_memo"
                        >
                            {{ increase_ratio_text }}
                        </span>
                        <span
                            v-else
                            style="color:gray;"
                            :title="row.change_increase_memo"
                        >
                            {{ increase_ratio_text }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.predict_detail') + 1"
                    key="predict_detail1"
                    :style="{ 'min-width': '500px !important' }"
                    width="5.5%"
                    class="minWidth160"
                >
                    <template slot-scope="row">
                        销量：{{ row.first_period_sales.toFixed(1) }}
                        <br />
                        期末库存：{{ row.first_period_end_stock.toFixed(1) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.predict_detail') + 2"
                    key="predict_detail2"
                    :style="{ 'min-width': '500px !important' }"
                    width="5.5%"
                    class="minWidth160"
                >
                    <template slot-scope="row">
                        销量：{{ row.second_period_sales.toFixed(1) }}
                        <br />
                        需求量：{{ row.second_period_need_stock.toFixed(1) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.need_date')"
                    key="need_date"
                    :style="{ 'min-width': '500px !important' }"
                    width="6.5%"
                    class="minWidth160"
                >
                    <template slot-scope="row">
                        开始：{{
                            moment(row.calculate_date, 'YYYY-MM-DD')
                                .add(row.purchase_cycle, 'd')
                                .format('YYYY-MM-DD')
                        }}
                        <br />
                        结束：{{
                            moment(row.calculate_date, 'YYYY-MM-DD')
                                .add(row.purchase_cycle + row.sale_cycle, 'd')
                                .format('YYYY-MM-DD')
                        }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.purchase_status')"
                    data-index="purchase_status"
                    key="purchase_status"
                    width="3%"
                    align="left"
                >
                    <template slot-scope="purchase_status">
                        <span v-if="purchase_status == 10" style="color:gray;">
                            {{
                                purchase_status
                                    | dict('PurchaseStatus')
                                    | translate
                            }}
                        </span>
                        <span
                            v-else-if="purchase_status == 20"
                            style="color:blue;"
                        >
                            {{
                                purchase_status
                                    | dict('PurchaseStatus')
                                    | translate
                            }}
                        </span>
                        <span
                            v-else-if="purchase_status == 30"
                            style="color:#333;"
                        >
                            {{
                                purchase_status
                                    | dict('PurchaseStatus')
                                    | translate
                            }}
                        </span>
                        <span
                            v-else-if="purchase_status == 40"
                            style="color:red;"
                        >
                            {{
                                purchase_status
                                    | dict('PurchaseStatus')
                                    | translate
                            }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.alarm_qty')"
                    data-index="alarm_qty"
                    key="alarm_qty"
                    width="3%"
                    align="right"
                ></a-table-column>
                <!-- <a-table-column
                    :title="$t('columns.operator_detail')"
                    key="operator_detail"
                    width="3%"
                >
                    <template slot-scope="row">
                        部门：{{ row.department }}
                        <br />
                        运营：{{ row.operator }}
                    </template>
                </a-table-column>-->
                <!-- <a-table-column
                    :title="$t('columns.category_detail')"
                    key="category_detail"
                    width="3%"
                >
                    <template slot-scope="row">
                        中文分类：{{ row.z_category }}
                        <br />
                        中文子类：{{ row.z_sub_category }}
                    </template>
                </a-table-column>-->
                <a-table-column
                    :title="$t('columns.vendor_name')"
                    data-index="vendor_name"
                    key="vendor_name"
                    width="5%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.min_qty')"
                    data-index="min_qty"
                    key="min_qty"
                    width="3%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.calculate_date')"
                    data-index="calculate_date"
                    key="calculate_date"
                    width="5%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.warehouse_id')"
                    data-index="warehouse_id"
                    key="warehouse_id"
                    width="3%"
                >
                    <template slot-scope="warehouse_id">
                        <span>
                            {{ warehouse_id | dict('WarehouseId') | translate }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.presale_ratio')"
                    data-index="presale_ratio"
                    key="presale_ratio"
                    width="3%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.presale_days')"
                    data-index="presale_days"
                    key="presale_days"
                    width="3%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.all_is_presale')"
                    key="all_is_presale"
                    width="3%"
                    align="center"
                >
                    <template slot-scope="row">
                        一:
                        <span v-if="row.is_presale">
                            <input type="checkbox" checked disabled />
                        </span>
                        <span v-else>
                            <input type="checkbox" disabled />
                        </span>
                        <br />二:
                        <span v-if="row.is_second_presale">
                            <input type="checkbox" checked disabled />
                        </span>
                        <span v-else>
                            <input type="checkbox" disabled />
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.is_uk_purchase')"
                    key="is_uk_purchase"
                    data-index="is_uk_purchase"
                    width="3%"
                    align="center"
                >
                    <template slot-scope="is_uk_purchase">
                        <span v-if="is_uk_purchase">
                            <input type="checkbox" checked disabled />
                        </span>
                        <span v-else>
                            <input type="checkbox" disabled />
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.write_uid')"
                    data-index="write_uid"
                    key="write_uid"
                    width="3%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.write_date')"
                    key="write_date"
                    width="6%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.write_date | datetolocal }}
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
        <a-card class="" v-if="selectedRows[0]">
            <PurchasePredictView
                :detail="selectedRows[0]"
                :systemUsers="systemUsers"
            ></PurchasePredictView>
        </a-card>
    </section>
</template>

<style>
.red-text {
    color: red;
}
.blue-text {
    color: blue;
}
.green-text {
    color: green;
}
.gray-text {
    color: rgba(129, 127, 127, 0.719);
}
.default-text {
    color: #333;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Emit, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import router from '../../router'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { namespace } from 'vuex-class'
import DataForm from '~/shared/components/data-form.vue'
import PurchaseApply from '~/components/product/purchase-apply.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '@/shared/utils/common.service'
import PurchasePredictView from '~/components/product/purchase-predict-view.vue'
import PurchasePredictEdit from '~/components/product/purchase-predict-edit.vue'
import { PurchaseCalService } from '../../services/purchasecal.service'
import { PreSaleService } from '../../services/presale.service'
import { UserService } from '../../services/user.service'
import appConfig from '@/config/app.config'
import moment from 'moment'
import { formConfig } from '@/config/form.config'
import MemoEdit from './memo-edit.vue'
import { VendorService } from '../../services/vendor.service'

const userModule = namespace('userModule')
const datasModule = namespace('datasModule')

@Component({
    components: {
        PurchaseApply,
        PurchasePredictView,
        PurchasePredictEdit
    }
})
export default class ProductPurchasePredict extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    @Prop()
    info: any

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    // 表格数据源
    private data: any[] = []
    // 表格选择项
    private selectedRowKeys: any[] = []

    private selectedRows: any[] = []

    private purchaseStatus: any[] = []

    private orderBy: any = ''

    private moment = moment

    private purchaseCalService = new PurchaseCalService()

    private presaleService = new PreSaleService()

    private vendorService = new VendorService()
    private vender_data: any[] = []

    private systemUsers
    // @datasModule.State
    // private systemUsers

    // @datasModule.Action
    // private getSystemuser

    @userModule.State
    private username

    // 详情项
    private current = null

    private mounted() {
        if (this.info === '') {
            this.purchaseStatus = this.$dict.PredictStatus
        } else if (this.info === 'predict-confirm') {
            this.purchaseStatus = this.$dict.PredictStatusConfirm
        } else if (this.info === 'predict-approve') {
            this.purchaseStatus = this.$dict.PredictStatusApprove
        }
    }

    public created() {
        // this.getSystemuser()
        const userService = new UserService()
        userService.all(new RequestParams()).subscribe(data => {
            this.systemUsers = data
        })

        this.vendorService
            .get_vendor_ref_list(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    data.push({ code: '未找到', name: '未找到' })
                    this.vender_data = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
        // var _that = this
        // document.onkeydown = function(e) {
        //     let event =
        //         e || window.event || arguments.callee.caller.arguments[0]
        //     if (event.ctrlKey && event.keyCode == 69) {
        //         console.log('Ctrl+E')
        //     }
        // }
    }

    private exportRows() {
        let calculate_date = this.selectedRows[0].calculate_date
        for (let item of this.selectedRows) {
            if (item.calculate_date !== calculate_date) {
                this.$message.error('勾选日期必须一致')
                return
            }
        }
        let urlParams = encodeURIComponent(JSON.stringify(this.selectedRowKeys))
        window.open(
            appConfig.server +
                '/product_purchase_predict/export_purchase_predict_excel?data_set=' +
                urlParams
        )
    }

    /**
     * 获取采购预测数据
     */
    private getPurchasePredictList() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                if (
                    !values['status'] &&
                    ['predict-confirm', 'predict-approve'].includes(this.info)
                ) {
                    values['status'] = this.purchaseStatus
                        .map(x => {
                            return x.value
                        })
                        .join(',')
                }
                let params: any = CommonService.createQueryCondition(values, {
                    z_sub_category: 'like',
                    default_code: 'like',
                    week_avg_sales: '>=',
                    status: '=',
                    week_avg_sales_max: '<='
                })
                var nowConditions: any[] = []
                for (var item of params.query_condition) {
                    if (item.value.constructor == Array) {
                        if (
                            item.value.length == 2 &&
                            item.value[0].constructor.name == 'Moment'
                        ) {
                            nowConditions.push({
                                query_name: item.query_name,
                                operate: '>=',
                                value: item.value[0]
                                    .format('YYYY-MM-DD 00:00:00')
                                    .toString()
                            })
                        }
                        if (
                            item.value.length == 2 &&
                            item.value[1].constructor.name == 'Moment'
                        ) {
                            nowConditions.push({
                                query_name: item.query_name,
                                operate: '<=',
                                value: item.value[1]
                                    .format('YYYY-MM-DD 23:59:59')
                                    .toString()
                            })
                        }
                    } else {
                        nowConditions.push(item)
                    }
                    if (item.query_name == 'week_avg_sales_max') {
                        item.query_name = 'week_avg_sales'
                    }
                    if (
                        item.query_name == 'status' &&
                        item.value.toString().indexOf(',') > -1
                    ) {
                        item.operate = 'in'
                        let status: any[] = item.value.split(',')
                        item.value = status.map(z => parseInt(z))
                    }
                }
                params.query_condition = nowConditions
                if (this.orderBy) {
                    params['order_by'] = this.orderBy
                }
                this.purchaseCalService
                    .queryAll(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService
                        })
                    )
                    .subscribe(
                        data => {
                            for (var item of data) {
                                var sysuser = this.systemUsers.find(
                                    x => x.code === item.write_uid
                                )
                                item['write_uid'] = sysuser
                                    ? sysuser.name
                                    : item.write_uid
                                let localTime = moment
                                    .utc(item['log_date'])
                                    .toDate()
                                item['log_date'] = moment(localTime).format(
                                    'YYYY-MM-DD HH:mm'
                                )
                            }

                            this.data = data
                            this.selectedRowKeys = []
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
            .catch(err => {
                // 异常处理
            })
    }

    private onStatusChange(e) {
        this.$nextTick(function() {
            this.getPurchasePredictList()
        })
    }

    private onTrClick(record) {
        let info = this.data.find(x => x.calculate_code === record)
        this.selectedRows = [info]
    }

    private onPurchaseApply() {
        let rows: any[] = []
        let warehouse_id = this.selectedRows[0]['warehouse_id']
        let default_code_set = new Set()
        let form_data = { warehouse_id: warehouse_id, req_type: 'operational' }
        for (let row of this.selectedRows) {
            if (row.warehouse_id != warehouse_id) {
                this.$message.error('勾选项来源仓库必须一致')
                return false
            }
            if (!default_code_set.has(row.default_code)) {
                default_code_set.add(row.default_code)
            } else {
                this.$message.error('勾选sku不能重复')
                return false
            }
            rows.push({
                default_code: row.default_code,
                date_expected: '',
                sales_expected_give_date: '',
                product_qty: row.second_period_need_stock,
                calculate_code: row.calculate_code,
                min_qty: row.min_qty
            })
        }
        this.$modal
            .open(
                PurchaseApply,
                {
                    rows: rows,
                    warehouse_id: warehouse_id,
                    form_data: form_data
                },
                {
                    title: '生成采购计划',
                    width: '60%'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getPurchasePredictList()
            })
    }

    private reCalculate() {
        if (this.selectedRows.length > 1) {
            this.$message.error('只限选择一条进行重算')
            return
        }
        this.onEdit(this.selectedRows[0])
    }

    private onEdit(row) {
        this.$modal
            .open(
                PurchasePredictEdit,
                {
                    row: row
                },
                {
                    title: '编辑采购预测数据',
                    width: '70%'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getPurchasePredictList()
            })
    }

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getPurchasePredictList()
    }

    private verify_sales() {
        //product_pre_sale/active_purchase_predict
        this.presaleService
            .active_purchase_predict(
                new RequestParams({
                    calculate_code_list: this.selectedRowKeys
                })
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

    private verify_sales_manager() {
        //product_pre_sale/confirm_purchase_predict
        // is_pass: true
        //memo
        this.$modal
            .open(
                MemoEdit,
                {},
                {
                    title: this.$t('edit-memo'),
                    width: '60%'
                }
            )
            .subscribe(data => {
                //sku不能重复
                this.presaleService
                    .confirm_purchase_predict(
                        new RequestParams({
                            calculate_code_list: this.selectedRowKeys,
                            is_pass: true,
                            memo: data.memo
                        })
                    )
                    .subscribe(
                        data => {
                            this.$message.success('操作成功')
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
    }

    private verify_sales_director() {
        //product_pre_sale/approve_purchase_predict
        //is_pass:true
        //memo
        this.$modal
            .open(
                MemoEdit,
                {},
                {
                    title: this.$t('edit-memo'),
                    width: '60%'
                }
            )
            .subscribe(data => {
                //sku不能重复
                this.presaleService
                    .approve_purchase_predict(
                        new RequestParams({
                            calculate_code_list: this.selectedRowKeys,
                            is_pass: true,
                            memo: data.memo
                        })
                    )
                    .subscribe(
                        data => {
                            this.$message.success('操作成功')
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
    }

    private confirm_sales() {
        ///product_pre_sale/renew_purchase_predict
        this.presaleService
            .renew_purchase_predict(
                new RequestParams({
                    calculate_code_list: this.selectedRowKeys
                })
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

    private confirm_sales_manager() {
        //product_pre_sale/return_purchase_predict
        //"need_return": false,
        //"memo":"无需回退2"
        this.$modal
            .open(
                MemoEdit,
                {},
                {
                    title: this.$t('edit-memo'),
                    width: '60%'
                }
            )
            .subscribe(data => {
                //sku不能重复
                this.presaleService
                    .return_purchase_predict(
                        new RequestParams({
                            calculate_code_list: this.selectedRowKeys,
                            is_pass: false,
                            need_return: false,
                            memo: data.memo
                        })
                    )
                    .subscribe(
                        data => {
                            this.$message.success('操作成功')
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
    }

    private confirm_return_sales_manager() {
        //product_pre_sale/return_purchase_predict
        //"need_return": false,
        //"memo":"无需回退2"
        this.$modal
            .open(
                MemoEdit,
                {},
                {
                    title: this.$t('edit-memo'),
                    width: '60%'
                }
            )
            .subscribe(data => {
                //sku不能重复
                this.presaleService
                    .return_purchase_predict(
                        new RequestParams({
                            calculate_code_list: this.selectedRowKeys,
                            is_pass: false,
                            need_return: true,
                            memo: data.memo
                        })
                    )
                    .subscribe(
                        data => {
                            this.$message.success('操作成功')
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
    }

    private return_sales_manager() {
        //product_pre_sale/confirm_purchase_predict
        // is_pass: false
        //memo
        this.$modal
            .open(
                MemoEdit,
                {},
                {
                    title: this.$t('edit-memo'),
                    width: '60%'
                }
            )
            .subscribe(data => {
                //sku不能重复
                this.presaleService
                    .confirm_purchase_predict(
                        new RequestParams({
                            calculate_code_list: this.selectedRowKeys,
                            is_pass: false,
                            memo: data.memo
                        })
                    )
                    .subscribe(
                        data => {
                            this.$message.success('操作成功')
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
    }

    private refuse_sales_director() {
        //product_pre_sale/approve_purchase_predict
        //is_pass:false
        //memo
        this.$modal
            .open(
                MemoEdit,
                {},
                {
                    title: this.$t('edit-memo'),
                    width: '60%'
                }
            )
            .subscribe(data => {
                //sku不能重复
                this.presaleService
                    .approve_purchase_predict(
                        new RequestParams({
                            calculate_code_list: this.selectedRowKeys,
                            is_pass: false,
                            memo: data.memo
                        })
                    )
                    .subscribe(
                        data => {
                            this.$message.success('操作成功')
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
    }

    private calcStyle(row) {
        if (row.exists_exception) {
            return 'red-text'
        } else {
            return 'default-text'
        }
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }
}
</script>

<i18n>
{
  "en-us": {
    "desc": "",
    "columns":{
       "purchase_status": "Purchase Status",
       "include_presale_order":"Include Presale Order",
       "calculate_date":"Calculate Date",
       "warehouse_id":"Warehouse Id",
       "week_sales":"Week Sales",
       "week_0_sales":"Current Week",
       "week_avg_sales": "Week Avg Sales",
       "cp_qty_ratio": "CP Quantity Ratio",
       "cp_order_ratio": "CP Order Ratio",
       "pre_week_sales":"pre_week_sales",
       "is_presale":"is_presale",
       "is_second_presale":"is_second_presale",
       "presale_ratio":"presale_ratio",
       "presale_days":"presale_days",
       "purchase_cycle":"purchase_cycle",
       "predict_detail":"predict_detail",
        "need_detail":"需求详情",
       "all_is_presale":"all_is_presale",
       "is_uk_purchase":"is_uk_purchase",
       "purchase_status":"purchase_status",
       "alarm_qty":"alarm_qty",
       "de_available_qty":"de_available_qty",
       "operator_detail":"operator_detail",
       "category_detail":"category_detail",
       "month_1_transit_qty":"month_1_transit_qty",
       "month_2_transit_qty":"month_2_transit_qty",
       "month_1_unship_qty":"month_1_unship_qty",
       "month_2_unship_qty":"month_2_unship_qty",
       "month_3_unship_qty":"month_3_unship_qty",
       "transit_qty":"transit_qty",
       "increase_ratio":"increase_ratio",
       "unship_qty":"unship_qty",
       "increase_ratio_text":"increase_ratio_text",
       "z_sub_category":"sub category",
       "purchase_sku":"Purchase SKU",
       "exists_exception":"Exception",
       "vendor_name":"Vendor",
       "min_qty":"Min Order QTY"
    },
    "action":{
        "create":"Create",
        "purchase_apply":"Purchase Apply",
        "export":"Export Excel",
        "edit":"Edit",
        "delete":"Delete",
        "ok":"Ok",
        "cancel":"Cancel",
        "verify":"Verify",
        "confirm":"Confirm",
        "confirm_refuse":"Confirm Refuse",
        "return":"Return",
        "refuse":"Refuse",
        "confirm_return_sales_manager":"Confirm Return",
        "active":"Active",
        "to_draft":"To Draft"
    },
    "rules":{

    },
    "delete":"Are you sure delete?",
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Delete Success",
    "edit-memo":"Edit Memo",
    "yes":"Yes",
    "no":"No"
  },
  "zh-cn": {
    "desc": "",
    "columns":{
       "purchase_status": "状态",
       "include_presale_order":"含预售单",
       "calculate_date":"统计日期",
       "warehouse_id":"仓库",
       "week_sales":"销量",
       "week_0_sales":"当周销量",
       "week_avg_sales": "周均销量",
       "cp_qty_ratio": "数量投诉率",
       "cp_order_ratio": "订单投诉率",
       "pre_week_sales":"预测",
       "is_presale":"第一期预售",
       "is_second_presale":"第二期预售",
       "presale_ratio":"预售系数",
       "presale_days":"预售天数",
       "purchase_cycle":"采购周期/周",
       "sale_cycle":"销售周期/周",
       "predict_detail":"预测详情",
       "need_date":"需求时间",
       "all_is_presale":"预售",
       "is_uk_purchase":"uk仓单独补货",
       "purchase_status":"补货状态",
       "alarm_qty":"警戒库存",
       "de_available_qty":"库存详情",
       "operator_detail":"运营详情",
       "category_detail":"分类详情",
       "month_1_transit_qty":"在途一",
       "month_2_transit_qty":"在途二",
       "month_1_unship_qty":"在厂一",
       "month_2_unship_qty":"在厂二",
       "month_3_unship_qty":"在厂三",
       "transit_qty":"在途",
       "increase_ratio":"环比",
       "unship_qty":"在厂",
       "increase_ratio_text":"增长率环比",
       "z_sub_category":"中文子类",
       "purchase_sku":"补货SKU",
       "exists_exception":"异常",
       "vendor_name":"供应商",
       "min_qty":"起订量"
    },
    "action":{
      "create":"新建",
      "purchase_apply":"生成采购单",
      "export":"导出Excel",
      "edit":"重算",
      "delete":"删除",
      "ok":"确定",
      "cancel":"取消",
      "verify":"审核",
      "confirm":"确认",
      "confirm_refuse":"确认拒绝",
      "return":"退回",
      "refuse":"拒绝",
      "confirm_return_sales_manager":"确认退回",
      "active":"激活",
      "to_draft":"重置为草稿"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "delete":"是否确认删除?",
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "delete_success":"删除成功",
    "edit-memo":"填写备注",
    "yes":"是",
    "no":"否"
  }
}
</i18n>
