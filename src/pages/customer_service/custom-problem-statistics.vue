<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form
            ref="dataForm"
            @submit="getCPStatisticsList"
            :column="2"
            :actions="false"
            :isSwitchShowMode="true"
            :customLayout="true"
            :isShowGroupByButton="false"
            @showCurrentModel="showCurrentModel"
            @reset="restFields"
        >
            <template #default>
                <a-row>
                    <a-col :span="7">
                        <a-form-item
                            :label="$t('statisticalDimension')"
                            :labelCol="{ span: 7 }"
                            :wrapperCol="{ span: 16 }"
                        >
                            <a-select
                                showSearch
                                v-decorator="[
                                    'vendor_id',
                                    { initialValue: '' }
                                ]"
                                size="small"
                                :placeholder="$t('selectSupplier')"
                                mode="multiple"
                                :filterOption="filterSelectOption"
                            >
                                <a-select-option value>
                                    {{ $t('dict.all') }}
                                </a-select-option>
                                <a-select-option
                                    :value="item.code"
                                    v-for="(item, index) in vendorCodeList"
                                    :key="index"
                                >
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="4">
                        <a-form-item
                            style="height:35px;margin:0;"
                            :wrapperCol="{ span: 23 }"
                        >
                            <a-select
                                v-decorator="['z_sub_category']"
                                size="small"
                                showSearch
                                :placeholder="$t('selectClass')"
                                :filterOption="filterSelectOption"
                                :allowClear="true"
                            >
                                <a-select-option
                                    :value="item.z_sub_category"
                                    v-for="(item, index) in thirdClassList"
                                    :key="index"
                                >
                                    {{ item.z_sub_category }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="4">
                        <a-form-item
                            style="height:35px;margin:0;"
                            :wrapperCol="{ span: 23 }"
                        >
                            <a-input
                                v-decorator="['edit_group_sku']"
                                size="small"
                                :placeholder="$t('selectGroup')"
                            ></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="4">
                        <a-form-item
                            style="height:35px;margin:0;"
                            :wrapperCol="{ span: 20 }"
                        >
                            <a-input
                                v-decorator="['sku']"
                                size="small"
                                :placeholder="$t('inputSku')"
                            ></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="7">
                        <a-form-item
                            style="height:35px;margin:0;"
                            :label="$t('date')"
                            :labelCol="{ span: 7 }"
                            :wrapperCol="{ span: 16 }"
                            required
                        >
                            <div style="display: flex">
                                <a-select
                                    v-model="order_period"
                                    size="small"
                                    @change="changeDateType"
                                    style="width:30%;margin: 8px 2px 0 0;"
                                >
                                    <a-select-option value="range"
                                        >{{ $t('byDateRange') }}
                                    </a-select-option>
                                    <a-select-option value="week"
                                        >{{ $t('byWeek') }}
                                    </a-select-option>
                                    <a-select-option value="month"
                                        >{{ $t('byMonth') }}
                                    </a-select-option>
                                    <a-select-option value="quarter"
                                        >{{ $t('byQuarter') }}
                                    </a-select-option>
                                    <a-select-option value="year"
                                        >{{ $t('byYear') }}
                                    </a-select-option>
                                </a-select>

                                <template v-if="order_period === 'range'">
                                    <a-range-picker
                                        size="small"
                                        style="margin-top: 8px"
                                        v-model="norDate"
                                        @change="changeDate"
                                    />
                                </template>
                                <template v-if="order_period === 'week'">
                                    <date-week
                                        @getWeekDate="getStartWeekDate"
                                        :weekDateField="startWeekDate"
                                        id="startWeek"
                                    ></date-week>
                                    -
                                    <date-week
                                        @getWeekDate="getEndWeekDate"
                                        :weekDateField="endWeekDate"
                                        id="endWeek"
                                    ></date-week>
                                </template>
                                <template v-if="order_period === 'month'">
                                    <a-month-picker
                                        size="small"
                                        style="margin-top: 8px"
                                        v-model="startMonthVal"
                                        :disabled-date="disabledStartMonthDate"
                                        @change="changeStartMonthDate"
                                    />
                                    -
                                    <a-month-picker
                                        size="small"
                                        :disabled-date="disabledEndMonthDate"
                                        style="margin-top: 8px"
                                        v-model="endMonthVal"
                                        @change="changeEndMonthDate"
                                    />
                                </template>
                                <template v-if="order_period === 'quarter'">
                                    <date-quarter
                                        @getQuarterDate="getQuarterStartDate"
                                        :quarterDateField="quarterStartDate"
                                        :placeholder="$t('plzSelectStartDate')"
                                        :disabledEndValue="quarterEndDate"
                                        id="startQuarter"
                                    ></date-quarter>
                                    -
                                    <date-quarter
                                        @getQuarterDate="getQuarterEndDate"
                                        :quarterDateField="quarterEndDate"
                                        :placeholder="$t('plzSelectEndDate')"
                                        :disabledStartValue="quarterStartDate"
                                        id="endQuarter"
                                    ></date-quarter>
                                </template>
                                <template v-if="order_period === 'year'">
                                    <a-date-picker
                                        mode="year"
                                        size="small"
                                        format="YYYY"
                                        valueFormat="yyyy"
                                        v-model="startYearVal"
                                        :open="yearStartShowOne"
                                        :disabled-date="disabledStartYearDate"
                                        style="margin-top: 8px"
                                        @panelChange="changeStartYearDate"
                                        @openChange="openStartChangeOne"
                                    />
                                    -
                                    <a-date-picker
                                        mode="year"
                                        size="small"
                                        format="YYYY"
                                        valueFormat="yyyy"
                                        :disabled-date="disabledEndYearDate"
                                        v-model="endYearVal"
                                        :open="yearEndShowOne"
                                        style="margin-top: 8px"
                                        @panelChange="changeEndYearDate"
                                        @openChange="openEndChangeOne"
                                    />
                                </template>
                            </div>
                        </a-form-item>
                    </a-col>
                    <a-col :span="7">
                        <a-form-item
                            style="height:35px;margin:0;"
                            :label="$t('cp_create_date')"
                            :labelCol="{ span: 4 }"
                            :wrapperCol="{ span: 16 }"
                        >
                            <div style="display: flex">
                                <a-select
                                    v-model="cp_period"
                                    size="small"
                                    @change="changeCPDateType"
                                    style="width:30%;margin: 8px 2px 0 0;"
                                >
                                    <a-select-option value="range"
                                        >{{ $t('byDateRange') }}
                                    </a-select-option>
                                    <a-select-option value="week"
                                        >{{ $t('byWeek') }}
                                    </a-select-option>
                                    <a-select-option value="month"
                                        >{{ $t('byMonth') }}
                                    </a-select-option>
                                    <a-select-option value="quarter"
                                        >{{ $t('byQuarter') }}
                                    </a-select-option>
                                    <a-select-option value="year"
                                        >{{ $t('byYear') }}
                                    </a-select-option>
                                </a-select>

                                <template v-if="cp_period === 'range'">
                                    <a-range-picker
                                        size="small"
                                        style="margin-top: 8px"
                                        v-model="norCPDate"
                                        @change="changeCPDate"
                                    />
                                </template>
                                <template v-if="cp_period === 'week'">
                                    <date-week
                                        @getWeekDate="getCPStartWeekDate"
                                        :weekDateField="startCPWeekDate"
                                        id="startCPWeek"
                                    ></date-week>
                                    -
                                    <date-week
                                        @getWeekDate="getCPEndWeekDate"
                                        :weekDateField="endCPWeekDate"
                                        id="endCPWeek"
                                    ></date-week>
                                </template>
                                <template v-if="cp_period === 'month'">
                                    <a-month-picker
                                        size="small"
                                        style="margin-top: 8px"
                                        :disabled-date="
                                            disabledCPStartMonthDate
                                        "
                                        v-model="startCPMonthVal"
                                        @change="changeCPStartMonthDate"
                                    />
                                    -
                                    <a-month-picker
                                        size="small"
                                        :disabled-date="disabledCPEndMonthDate"
                                        v-model="endCPMonthVal"
                                        style="margin-top: 8px"
                                        @change="changeCPEndMonthDate"
                                    />
                                </template>
                                <template v-if="cp_period === 'quarter'">
                                    <date-quarter
                                        @getQuarterDate="getCPQuarterStartDate"
                                        :quarterDateField="quarterCPStartDate"
                                        :placeholder="$t('plzSelectStartDate')"
                                        :disabledEndValue="quarterCPEndDate"
                                        id="startCPQuarter"
                                    ></date-quarter>
                                    -
                                    <date-quarter
                                        @getQuarterDate="getCPQuarterEndDate"
                                        :quarterDateField="quarterCPEndDate"
                                        :placeholder="$t('plzSelectEndDate')"
                                        :disabledStartValue="quarterCPStartDate"
                                        id="endCPQuarter"
                                    ></date-quarter>
                                </template>
                                <template v-if="cp_period === 'year'">
                                    <a-date-picker
                                        mode="year"
                                        size="small"
                                        format="YYYY"
                                        valueFormat="yyyy"
                                        v-model="startCPYearVal"
                                        :open="yearCPStartShowOne"
                                        :disabled-date="disabledCPStartYearDate"
                                        style="margin-top: 8px"
                                        @panelChange="changeCPStartYearDate"
                                        @openChange="openCPStartChangeOne"
                                    />
                                    -
                                    <a-date-picker
                                        mode="year"
                                        size="small"
                                        format="YYYY"
                                        valueFormat="yyyy"
                                        :disabled-date="disabledCPEndYearDate"
                                        v-model="endCPYearVal"
                                        :open="yearCPEndShowOne"
                                        style="margin-top: 8px"
                                        @panelChange="changeCPEndYearDate"
                                        @openChange="openCPEndChangeOne"
                                    />
                                </template>
                            </div>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="7">
                        <a-form-item
                            :label="$t('statisticalForm')"
                            style="height:35px;margin:0;"
                            :labelCol="{ span: 7 }"
                            :wrapperCol="{ span: 8 }"
                        >
                            <a-select
                                v-decorator="[
                                    'statistics_type',
                                    { initialValue: 'sku' }
                                ]"
                                size="small"
                                :placeholder="$t('plzSelect')"
                                @change="changeStatisticsType"
                            >
                                <a-select-option
                                    :value="item.value"
                                    v-for="(item, index) of statisticalFormList"
                                    :key="index"
                                >
                                    {{ $t(item.label) }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
            </template>
            <template #action>
                <a-button @click="watchCPDetail" type="primary"
                    >{{ $t('watchCPDetail') }}
                </a-button>
            </template>
        </data-form>
        <div v-show="currentModel === 'table'">
            <div class="cardTabs">
                <a-tabs type="card" @change="changeTab" v-model="currentTabKey">
                    <a-tab-pane v-for="item in tabs" :key="item.value">
                        <template slot="tab">
                            {{ $t(item.label) }}
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <a-card class="autoFlex">
                <keep-alive>
                    <component
                        ref="child"
                        :is="componentName"
                        :columnList="columnList"
                        :groupByList="groupByList"
                        :allNameAuth="allNameAuth"
                        :statisticsFormType="statisticsFormType"
                        :queryParams="queryParams"
                    ></component>
                </keep-alive>
            </a-card>
        </div>
        <div v-if="currentModel === 'graph'">
            <statistics-graph :queryData="graphQueryData"></statistics-graph>
        </div>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Page } from '@/core/decorators'
import DataForm from '@/shared/components/data-form.vue'
import statisticsGraph from '~/components/customer_service/statistics-graph.vue'
import allTable from '~/components/customer_service/statistics-total-table.vue'
import rtTable from '~/components/customer_service/statistics-rt-table.vue'
import returnTable from '~/components/customer_service/statistics-return-table.vue'
import productTable from '~/components/customer_service/statistics-product-table.vue'
import loTable from '~/components/customer_service/statistics-logistics-table.vue'
import customerTable from '~/components/customer_service/statistics-customer-table.vue'
import csTable from '~/components/customer_service/statistics-cs-table.vue'
import { RequestParams } from '@/core/http'
import { VendorService } from '@/services/vendor.service'
import { LoadingService } from '@/bootstrap/services/loading.service'
import { namespace } from 'vuex-class'
import { CommonService } from '@/shared/utils/common.service'
import dateQuarter from '@/shared/components/date-quarter.vue'
import dateWeek from '@/shared/components/date-week.vue'
import moment from 'moment'
import UUID from 'uuidjs'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { PublicService } from '@/services/public.service'

const datasModule = namespace('datasModule')

interface tabsObj {
    label: string
    value: string
}

@Page({
    layout: 'workspace',
    name: 'custom-problem-statistics'
})
@Component({
    components: {
        statisticsGraph,
        rtTable,
        allTable,
        returnTable,
        productTable,
        loTable,
        customerTable,
        csTable,
        dateQuarter,
        dateWeek
    }
})
export default class customProblemStatistics extends Vue {
    @Ref()
    readonly dataForm!: DataForm

    private vendorService = new VendorService()
    private loadingService = new LoadingService()
    private innerAction = new InnerActionService()
    private publicService = new PublicService()

    private currentModel: string = 'table' //区分图表或表格
    private currentComponentName: string = 'allTable' //当前组件
    private currentTabKey: string = 'total_cp' //当前tab
    private cp_period: string = 'quarter' //客诉当前日期类型
    private order_period: string = 'quarter' //订单当前日期类型
    private queryParams: any = {}
    private graphQueryData: any = {} //图表查询数据
    private vendorCodeList: any = []

    private statisticalFormList: any = [
        { label: 'sku', value: 'sku' },
        { label: 'supplier', value: 'vendor' },
        { label: 'editGroupSku', value: 'edit_group_sku' },
        { label: 'subCategory', value: 'sub_category' }
    ]
    private tabs: tabsObj[] = [
        { label: 'tabs.total_complaint_rat', value: 'total_cp' },
        {
            label: 'tabs.wr(rt)_complaint_rat',
            value: 'warehouse_rt_cp'
        },
        {
            label: 'tabs.return_reason_complaint_rat',
            value: 'return_cp'
        },
        {
            label: 'tabs.pro_reason_complaint_rat',
            value: 'product_cp'
        },
        {
            label: 'tabs.log_reason_complaint_rat',
            value: 'logistics_cp'
        },
        {
            label: 'tabs.custom_reason_complaint_rat',
            value: 'customer_cp'
        },
        {
            label: 'tabs.wr(cs)_complaint_rat',
            value: 'warehouse_cs_cp'
        }
    ]

    private dataList: any = '' //查询的数据

    private vender_data: any = []

    private thirdClassList: any = []

    private created() {
        this.getVendorCode()
        this.getThirdClass()
    }

    private columnList: any = []
    private groupByList: any = []
    private allNameAuth: any = []

    private statisticsFormType = '' //统计形式

    private mounted() {
        this.groupByList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
        this.statisticsFormType = 'sku'
    }

    private getVendorCode() {
        this.innerAction.setActionAPI(
            '/vendor/get_vendor_full_name_list',
            CommonService.getMenuCode('vendor-product-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    {
                        return_vendor_code: true
                    },
                    {
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(data => {
                this.vendorCodeList = data
            })
    }

    /**
     * 获取三级分类
     */
    private getThirdClass() {
        this.innerAction.setActionAPI(
            'product/query_z_sub_category',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
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
                    this.thirdClassList = data
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

    private changeDateType(val) {
        this.norDate = null
        this.quarterStartDate = ''
        this.quarterEndDate = ''
        this.startWeekDate = ''
        this.startYearVal = ''
        this.endYearVal = ''
    }

    /**
     * cp
     */
    private changeCPDateType(val) {
        this.norCPDate = null
        this.quarterCPStartDate = ''
        this.quarterCPEndDate = ''
        this.startCPWeekDate = ''
        this.startCPYearVal = ''
        this.endCPYearVal = ''
    }

    /**
     * cp日期范围
     * @private
     */
    private norCPDate: any = null

    private changeCPDate(date, dateString) {
        this.norCPDate = dateString
    }

    /**
     * cp周
     * @private
     */
    private startCPWeekDate: any = ''
    private endCPWeekDate: any = ''

    private getCPStartWeekDate(val) {
        this.startCPWeekDate = val
    }

    private getCPEndWeekDate(val) {
        this.endCPWeekDate = val
    }

    /**
     * cp月
     * @private
     */
    private startCPMonthVal: any = ''
    private endCPMonthVal: any = ''

    private disabledCPStartMonthDate(startValue) {
        const endValue = this.endCPMonthVal
        if (!startValue || !endValue) {
            return false
        }
        return startValue.valueOf() > endValue.valueOf()
    }

    private changeCPStartMonthDate(val) {
        this.startCPMonthVal = val
    }

    private disabledCPEndMonthDate(endValue) {
        const startValue = this.startCPMonthVal
        if (!endValue || !startValue) {
            return false
        }
        return startValue.valueOf() >= endValue.valueOf()
    }

    private changeCPEndMonthDate(val) {
        this.endCPMonthVal = val
    }

    /**
     * cp季度
     * @private
     */
    private quarterCPEndDate: any = ''

    private getCPQuarterStartDate(val) {
        this.quarterCPStartDate = val
    }

    private quarterCPStartDate: any = ''

    private getCPQuarterEndDate(val) {
        this.quarterCPEndDate = val
    }

    /**
     * cp年
     * @private
     */
    private startCPYearVal: any = ''
    private endCPYearVal: any = ''
    private yearCPStartShowOne: boolean = false
    private yearCPEndShowOne: boolean = false

    private disabledCPStartYearDate(startValue) {
        const endValue = this.endCPYearVal
        if (!startValue || !endValue) {
            return false
        }
        return startValue.valueOf() > endValue.valueOf()
    }

    private disabledCPEndYearDate(endValue) {
        const startValue = this.startCPYearVal
        if (!endValue || !startValue) {
            return false
        }
        return startValue.valueOf() >= endValue.valueOf()
    }

    private changeCPStartYearDate(val) {
        this.startCPYearVal = val
        this.yearCPStartShowOne = false
    }

    private changeCPEndYearDate(val) {
        this.endCPYearVal = val
        this.yearCPEndShowOne = false
    }

    private openCPStartChangeOne(status) {
        if (status) {
            this.yearCPStartShowOne = true
        }
    }

    private openCPEndChangeOne(status) {
        if (status) {
            this.yearCPEndShowOne = true
        }
    }

    /**------------------------------------------**/

    /**
     * 订单
     * 月
     */
    private startMonthVal: any = ''
    private endMonthVal: any = ''

    private changeStartMonthDate(val) {
        this.startMonthVal = val
    }

    private changeEndMonthDate(val) {
        this.endMonthVal = val
    }

    private disabledStartMonthDate(startValue) {
        const endValue = this.endMonthVal
        if (!startValue || !endValue) {
            return false
        }
        return startValue.valueOf() > endValue.valueOf()
    }

    private disabledEndMonthDate(endValue) {
        const startValue = this.startMonthVal
        if (!endValue || !startValue) {
            return false
        }
        return startValue.valueOf() >= endValue.valueOf()
    }

    /**
     * 年
     */
    private startYearVal: any = ''
    private endYearVal: any = ''
    private yearStartShowOne: boolean = false
    private yearEndShowOne: boolean = false

    private changeStartYearDate(val) {
        this.startYearVal = val
        this.yearStartShowOne = false
    }

    private changeEndYearDate(val) {
        this.endYearVal = val
        this.yearEndShowOne = false
    }

    private openStartChangeOne(status) {
        if (status) {
            this.yearStartShowOne = true
        }
    }

    private openEndChangeOne(status) {
        if (status) {
            this.yearEndShowOne = true
        }
    }

    private disabledStartYearDate(startValue) {
        const endValue = this.endYearVal
        if (!startValue || !endValue) {
            return false
        }
        return startValue.valueOf() > endValue.valueOf()
    }

    private disabledEndYearDate(endValue) {
        const startValue = this.startYearVal
        if (!endValue || !startValue) {
            return false
        }
        return startValue.valueOf() >= endValue.valueOf()
    }

    /**
     * 获取周日期
     */
    private startWeekDate: any = ''
    private endWeekDate: any = ''

    private getStartWeekDate(date) {
        this.startWeekDate = date
    }

    private getEndWeekDate(date) {
        this.endWeekDate = date
    }

    /**
     * 获取季度日期
     */
    private quarterStartDate: any = ''
    private quarterEndDate: any = ''

    private getQuarterStartDate(date) {
        this.quarterStartDate = date
    }

    private getQuarterEndDate(date) {
        this.quarterEndDate = date
    }

    /**
     * 获取日期范围
     */
    private norDate: any = null

    private changeDate(date, dateString) {
        this.norDate = dateString
    }

    private changeTab(key) {
        switch (key) {
            case 'total_cp':
                this.currentComponentName = 'allTable'
                break
            case 'warehouse_rt_cp':
                this.currentComponentName = 'rtTable'
                break
            case 'return_cp':
                this.currentComponentName = 'returnTable'
                break
            case 'product_cp':
                this.currentComponentName = 'productTable'
                break
            case 'logistics_cp':
                this.currentComponentName = 'loTable'
                break
            case 'customer_cp':
                this.currentComponentName = 'customerTable'
                break
            case 'warehouse_cs_cp':
                this.currentComponentName = 'csTable'
                break
        }
        if (this.queryParams.query_condition) {
            let obj = this.queryParams.query_condition.find(
                v => v.query_name === 'cp_form'
            )
            if (obj) {
                obj.value = key
                this.$nextTick(() => {
                    ;(this.$refs.child as any).getList(this.search_uuid)
                })
            }
        }
    }

    /**
     * 获取当前内容展现形式
     * @param val
     * @private
     */
    private showCurrentModel(type) {
        this.currentModel = type
    }

    /**
     * 获取当前tab显示组件
     * @param val
     * @private
     */
    private get componentName() {
        return this.currentComponentName
    }

    /**
     * 获取统计形式
     * @param val
     * @private
     */
    private changeStatisticsType(val) {
        if (!val) return
        this.statisticsFormType = val
    }

    /**
     * 查看客诉明细
     * @param val
     * @private
     */
    private watchCPDetail() {
        this.$router.push({
            path: '/customer_service/custom-problem',
            query: this.queryParams
        })
    }

    private restFields() {
        this.norDate = null
        this.startMonthVal = ''
        this.endMonthVal = ''
        this.quarterStartDate = ''
        this.quarterEndDate = ''
        this.startWeekDate = ''
        this.endWeekDate = ''
        this.startYearVal = ''
        this.endYearVal = ''
        this.norCPDate = null
        this.startCPMonthVal = ''
        this.endCPMonthVal = ''
        this.quarterCPStartDate = ''
        this.quarterCPEndDate = ''
        this.startCPWeekDate = ''
        this.endCPWeekDate = ''
        this.startCPYearVal = ''
        this.endCPYearVal = ''
    }

    private search_uuid: any = ''

    private getCPStatisticsList() {
        ;(this as any).dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                vendor_id: 'in',
                z_sub_category: 'like',
                edit_group_sku: 'in_or_like',
                sku: 'in_or_like'
            })

            if (params.query_condition.length) {
                if (
                    !this.norDate &&
                    !this.startMonthVal &&
                    !this.quarterStartDate &&
                    !this.startWeekDate &&
                    !this.startYearVal
                ) {
                    let msg: any = this.$t('plzSelectDate')
                    this.$message.error(msg)
                    return
                }
                //处理时间
                if (this.order_period === 'range' && this.norDate.length) {
                    params.query_condition.push(
                        {
                            query_name: 'date_order_start',
                            operate: '=',
                            value: this.norDate[0]
                        },
                        {
                            query_name: 'date_order_end',
                            operate: '=',
                            value: this.norDate[1]
                        },
                        {
                            query_name: 'order_period',
                            operate: '=',
                            value: ''
                        }
                    )
                } else {
                    params.query_condition.push({
                        query_name: 'order_period',
                        operate: '=',
                        value: this.order_period
                    })
                }
                if (this.cp_period === 'range' && this.norCPDate.length) {
                    params.query_condition.push(
                        {
                            query_name: 'cp_create_start',
                            operate: '=',
                            value: this.norCPDate[0]
                        },
                        {
                            query_name: 'cp_create_end',
                            operate: '=',
                            value: this.norCPDate[1]
                        },
                        {
                            query_name: 'cp_period',
                            operate: '=',
                            value: ''
                        }
                    )
                } else if (
                    this.startCPMonthVal ||
                    this.quarterCPStartDate ||
                    this.startCPWeekDate ||
                    this.startCPYearVal
                ) {
                    params.query_condition.push({
                        query_name: 'cp_period',
                        operate: '=',
                        value: this.cp_period
                    })
                }
                if (this.order_period === 'week') {
                    if (
                        this.endWeekDate &&
                        this.endWeekDate < this.startWeekDate
                    ) {
                        this.$message.error('结束日期不能小于开始日期')
                        return
                    }
                    params.query_condition.push({
                        query_name: 'date_order_start',
                        operate: '=',
                        value: this.startWeekDate
                    })
                    params.query_condition.push({
                        query_name: 'date_order_end',
                        operate: '=',
                        value: this.endWeekDate
                    })
                }
                if (this.cp_period === 'week' && this.startCPWeekDate) {
                    if (
                        this.endCPWeekDate &&
                        this.endCPWeekDate < this.startCPWeekDate
                    ) {
                        this.$message.error('结束日期不能小于开始日期')
                        return
                    }
                    params.query_condition.push({
                        query_name: 'cp_create_start',
                        operate: '=',
                        value: this.startCPWeekDate
                    })
                    params.query_condition.push({
                        query_name: 'cp_create_end',
                        operate: '=',
                        value: this.endCPWeekDate
                    })
                }
                if (this.order_period === 'month') {
                    params.query_condition.push({
                        query_name: 'date_order_start',
                        operate: '=',
                        value: moment(this.startMonthVal).format('YYYY-MM')
                    })
                    params.query_condition.push({
                        query_name: 'date_order_end',
                        operate: '=',
                        value: moment(this.endMonthVal).format('YYYY-MM')
                    })
                }
                if (this.cp_period === 'month' && this.startCPMonthVal) {
                    params.query_condition.push({
                        query_name: 'cp_create_start',
                        operate: '=',
                        value: moment(this.startCPMonthVal).format('YYYY-MM')
                    })
                    params.query_condition.push({
                        query_name: 'cp_create_end',
                        operate: '=',
                        value: moment(this.endCPMonthVal).format('YYYY-MM')
                    })
                }
                if (this.order_period === 'quarter') {
                    params.query_condition.push({
                        query_name: 'date_order_start',
                        operate: '=',
                        value: this.quarterStartDate
                    })
                    params.query_condition.push({
                        query_name: 'date_order_end',
                        operate: '=',
                        value: this.quarterEndDate
                    })
                }
                if (this.cp_period === 'quarter' && this.quarterCPStartDate) {
                    params.query_condition.push({
                        query_name: 'cp_create_start',
                        operate: '=',
                        value: this.quarterCPStartDate
                    })
                    params.query_condition.push({
                        query_name: 'cp_create_end',
                        operate: '=',
                        value: this.quarterCPEndDate
                    })
                }
                if (this.order_period === 'year') {
                    params.query_condition.push({
                        query_name: 'date_order_start',
                        operate: '=',
                        value: moment(this.startYearVal).format('YYYY')
                    })
                    params.query_condition.push({
                        query_name: 'date_order_end',
                        operate: '=',
                        value: moment(this.endYearVal).format('YYYY')
                    })
                }
                if (this.cp_period === 'year' && this.startCPYearVal) {
                    params.query_condition.push({
                        query_name: 'cp_create_start',
                        operate: '=',
                        value: moment(this.startCPYearVal).format('YYYY')
                    })
                    params.query_condition.push({
                        query_name: 'cp_create_end',
                        operate: '=',
                        value: moment(this.endCPYearVal).format('YYYY')
                    })
                }
                if (this.currentModel === 'graph') {
                    let _arr: any = params.query_condition.filter(
                        v => v.query_name != 'statistics_type'
                    )
                    params.query_condition = _arr
                    this.queryParams = params
                    this.graphQueryData = this.queryParams
                } else {
                    //处理当前tab
                    params.query_condition[params.query_condition.length] = {
                        query_name: 'cp_form',
                        operate: '=',
                        value: this.currentTabKey
                    }
                    this.queryParams = params
                    this.$nextTick(() => {
                        this.search_uuid = UUID.generate()
                        ;(this.$refs.child as any).getList(this.search_uuid)
                    })
                }
            }
        })
    }
}
</script>

<style lang="less">
.cardTabs {
    .ant-tabs-bar {
        margin: 0;
    }

    .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container {
        height: 30px;
    }
}
</style>

<i18n>
{
    "en-us": {
        "statisticalDimension": "Statistical Dimension",
        "statisticalForm": "Statistical Form",
        "plzSelect": "Please Select",
        "plzInput": "Please Input",
        "selectSupplier": "Select Suppliers",
        "selectClass": "Select Third Class",
        "selectGroup": "Input Maintain Group",
        "inputSku": "Input SKU",
        "plzSelectDate": "Please Select Date",
        "date": "Order Create Date",
        "week": "Week",
        "month": "Month",
        "quarter": "Quarter",
        "year": "year",
        "byDateRange": "By Date Range",
        "byYear": "By Year",
        "byMonth": "By Month",
        "byWeek": "By Week",
        "byQuarter": "By Quarter",
        "tabs": {
            "total_complaint_rat": "Total Complaint Rat",
            "wr(rt)_complaint_rat": "Warehouse Reason (rt) Complaint Rat",
            "return_reason_complaint_rat": "Return Reason Complaint Rat",
            "pro_reason_complaint_rat": "Product Reason Complaint Rat",
            "log_reason_complaint_rat": "Logistics Reason Complaint Rat",
            "custom_reason_complaint_rat": "Custom Reason Complaint Rat",
            "wr(cs)_complaint_rat": "Warehouse Reason (cs) Complaint Rat"
        },
        "sku": "SKU",
        "supplier": "Vendor",
        "editGroupSku": "Edit Group Sku",
        "plzSelectStartDate": "Please Select Start Date",
        "plzSelectEndDate": "Please Select End Date",
        "watchCPDetail": "Watch CP Detail",
        "subCategory": "Sub Category",
        "cp_create_date": "CP Create Date"
    },
    "zh-cn": {
        "statisticalDimension": "统计维度",
        "statisticalForm": "统计形式",
        "plzSelect": "请选择",
        "plzInput": "请输入",
        "selectSupplier": "选择供应商",
        "selectClass": "选择三级分类",
        "selectGroup": "输入维护组",
        "inputSku": "输入SKU",
        "plzSelectDate": "请选择日期",
        "date": "订单创建日期",
        "week": "周",
        "month": "月",
        "quarter": "季度",
        "year": "年",
        "byDateRange": "按日期范围",
        "byYear": "按年",
        "byMonth": "按月",
        "byWeek": "按周",
        "byQuarter": "按季度",
        "plzSelectStartDate": "请选择开始日期",
        "plzSelectEndDate": "请选择结束日期",
        "watchCPDetail": "查看客诉明细",
        "tabs": {
            "total_complaint_rat": "总投诉率",
            "wr(rt)_complaint_rat": "仓库原因(rt)投诉率",
            "return_reason_complaint_rat": "退货原因投诉率",
            "pro_reason_complaint_rat": "产品原因投诉率",
            "log_reason_complaint_rat": "物流原因投诉率",
            "custom_reason_complaint_rat": "客户原因投诉率",
            "wr(cs)_complaint_rat": "仓库原因(cs)投诉率"
        },
        "sku": "SKU",
        "supplier": "供应商",
        "editGroupSku": "维护组SKU",
        "subCategory": "中文子类",
        "cp_create_date": "客诉创建日期"
    }
}
</i18n>
