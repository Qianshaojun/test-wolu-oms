<template>
    <page-container ref="pageContainer" :showHeader="false">
        <!-- <template #header-action> -->
        <!-- <a-button type="primary" @click="onCreate">{{
                $t('action.create')
            }}</a-button> -->
        <!-- </template> -->
        <data-form
            ref="dataForm"
            @submit="getDataList"
            :column="2"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 15, offset: 0 }"
            :actions="true"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        v-decorator="['sku']"
                        :style="{ width: '200px', 'margin-right': '5px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    ></a-input>
                    <a-select
                        v-decorator="['operate', { initialValue: '=' }]"
                        :style="{ width: '100px' }"
                        size="small"
                    >
                        <a-select-option value="ilike">
                            {{ $t('forms.operator_like') }}
                        </a-select-option>
                        <a-select-option value="=">
                            {{ $t('forms.operator_equal') }}
                        </a-select-option>
                        <a-select-option value="in_or_like">
                            {{ $t('forms.operator_list') }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.money_type')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['money_type']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option key="人民币" value="人民币">
                            人民币
                        </a-select-option>
                        <a-select-option key="欧元" value="欧元">
                            欧元
                        </a-select-option>
                        <a-select-option key="美金" value="美金">
                            美金
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.operator')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['operator']"
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
                    :label="$t('columns.z_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['cn_category']"
                        style="width: 110px"
                        @change="handleFatherCateChange"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        allowClear
                    >
                        <a-select-option
                            v-for="cate in fatherCates"
                            :key="cate"
                        >
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                    <a-select
                        v-model="selectedList"
                        mode="multiple"
                        :placeholder="$t('plzSelect')"
                        style="width: 204px;margin-left:5px"
                        size="small"
                    >
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.de_prod_status')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['de_sale_status']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of $dict.PriceCheckProdStatus"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ $t(item.label) }}
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
                            未归档
                        </a-radio-button>
                        <a-radio-button :value="false">
                            已归档
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.uk_prod_status')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['uk_sale_status']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of $dict.PriceCheckProdStatus"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ $t(item.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.compute_state')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['compute_state']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option key="update" value="update">
                            update
                        </a-select-option>
                        <a-select-option key="new" value="new">
                            new
                        </a-select-option>
                        <a-select-option key="allnew" value="allnew">
                            allnew
                        </a-select-option>
                        <a-select-option key="computed" value="computed">
                            computed
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.write_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['write_date']"
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
                        @click="fill3days"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.3days') }}
                    </a-button>
                    <a-button
                        @click="fill7days"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.7days') }}
                    </a-button>
                </a-form-item>
                <a-form-item
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
                    <a-checkbox
                        v-decorator="['ref_vendor_product']"
                        :defaultChecked="false"
                        size="small"
                        style="margin-left:5px;"
                    />
                    {{ $t('ref_vendor_product') }}
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="onCreate()"
                >
                    {{ $t('action.create') }}
                </a-button>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="onTestCalc()"
                >
                    {{ $t('action.test_calc') }}
                </a-button>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="onPreCheck()"
                    :disabled="!selectedRowKeys.length"
                >
                    {{ $t('action.pre_check') }}
                </a-button>
                <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay">
                        <a-menu-item
                            @click="onDelete"
                            :disabled="!selectedRowKeys.length"
                            >Delete
                        </a-menu-item>
                        <a-menu-item @click="calcShipFee"
                            >{{ $t('action.calc_ship_fee') }}
                        </a-menu-item>
                        <a-menu-item @click="onDealUpdate"
                            >{{ $t('action.deal_update_for_check') }}
                        </a-menu-item>
                        <a-menu-item @click="onDealNew"
                            >{{ $t('action.deal_new') }}
                        </a-menu-item>
                        <a-menu-item @click="onDealAllNew"
                            >{{ $t('action.deal_allnew') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="onFlagToUpdate('update')"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.flag_to_update') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="onFlagToUpdate('new')"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.flag_to_new') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="onFlagToUpdate('allnew')"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.flag_to_allnew') }}
                        </a-menu-item>
                        <a-menu-item @click="onReCheckForShip"
                            >{{ $t('action.recheck_for_ship') }}
                        </a-menu-item>
                        <a-menu-item @click="onReCheckForSku"
                            >{{ $t('action.recheck_for_sku') }}
                        </a-menu-item>
                        <a-menu-item @click="onReCheckForUpdate"
                            >{{ $t('action.recheck_for_update') }}
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 2px"
                        >Action
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="onImportPrice()"
                >
                    {{ $t('action.price_check_import') }}
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
                            onTrClick(record)
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 1560, y: 500 }"
                    :queryUrl="queryUrl"
                    :menu_code="menu_code"
                    :queryCondition="queryConsition"
                    :selectedRowCnt="selectedRowKeys.length"
                >
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <template slot="user_render" slot-scope="text">
                        <span v-if="typeof text == 'number'">
                            {{ text | dict2(systemUsers) }}
                        </span>
                        <span v-else-if="typeof text == 'object'">
                            <span v-for="item of text" :key="item">
                                {{ item | dict2(systemUsers) }}<br />
                            </span>
                        </span>
                        <span v-else>
                            {{ text }}
                        </span>
                    </template>
                    <template slot="sku" slot-scope="text, row">
                        <a @click="onRowClick(row)">{{ row.sku }}</a>
                    </template>
                    <template slot="active" slot-scope="text">
                        <span v-if="text">未归档</span>
                        <span v-else>已归档</span>
                    </template>
                    <template slot="sale_status" slot-scope="text">
                        {{ text | dict('PriceCheckProdStatus') | translate }}
                    </template>
                    <template slot="compute_state" slot-scope="text, row">
                        {{ row.compute_state }} {{ changeColor(row) }}
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
                :scrollX="1560"
                :scrollY="500"
                @rowClick="onTrClick"
            >
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
                <template slot="user_render" slot-scope="text">
                    <span v-if="typeof text == 'number'">
                        {{ text | dict2(systemUsers) }}
                    </span>
                    <span v-else-if="typeof text == 'object'">
                        <span v-for="item of text" :key="item">
                            {{ item | dict2(systemUsers) }}<br />
                        </span>
                    </span>
                    <span v-else>
                        {{ text }}
                    </span>
                </template>
                <template slot="sku" slot-scope="text, row">
                    <a @click="onRowClick(row)">{{ row.sku }}</a>
                </template>
                <template slot="active" slot-scope="text">
                    <span v-if="text">未归档</span>
                    <span v-else>已归档</span>
                </template>
                <template slot="sale_status" slot-scope="text">
                    {{ text | dict('PriceCheckProdStatus') | translate }}
                </template>
                <template slot="compute_state" slot-scope="text, row">
                    {{ row.compute_state }} {{ changeColor(row) }}
                </template>
            </GroupbyTable>
        </a-card>
        <a-card class="margin-y" v-if="current">
            <SellerView
                :seller="current"
                :activeFeeTypes="activeFeeTypes"
            ></SellerView>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import { ReportService } from '../../services/report.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import ProductCateEdit from '@/components/product/product-cate-edit.vue'
import moment from 'moment'
import PreProductPriceDetail from '../../components/product/pre-product-price-detail.vue'
import PreProductPriceCheck from '../../components/product/pre-product-price-check.vue'
import UUID from 'uuidjs'
import TestCalc from '../../components/product/test-calc.vue'
import SetPreProductFloatPrice from '@/components/product/set-pre-product-float-price.vue'
import UploadExcel from '@/shared/common/upload-excel.vue'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'product_price_check'
})
@Component({
    components: {
        GroupbyTable,
        AutoColumnTable,
        PreProductPriceDetail,
        PreProductPriceCheck
    }
})
export default class ProductPriceCheck extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private reportService = new ReportService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    // 表格数据源
    private data: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private current = null

    private groupbyList: any = []

    private allNameAuth: any = []

    private columnList: any = []

    private queryUrl: any = 'product_management/query_all_product_price_check'

    private queryConsition: any = []

    private orderBy: any = ''

    private menu_code: any = ''

    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @datasModule.State
    private currencyList

    @datasModule.Action
    private getcurrency

    @datasModule.State
    private departmentList

    @datasModule.Action
    private getDepartmentList

    @pageParamsModule.Mutation('addCommonPageInfo')
    private addCommonPageInfo
    innerActionService: any

    @datasModule.State
    private vendorFullNameList

    @datasModule.Action
    private getVendorFullNameList

    private get rules() {
        return {}
    }

    public created() {
        this.getCn_cate()
        this.getSystemuser()
        this.getcurrency()
        this.getDepartmentList()
        this.getVendorFullNameList()
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
        this.menu_code = this.dataForm.menu_code
    }

    private getCn_cate() {
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

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
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

    private onStatusChange(e) {
        this.$nextTick(function() {
            this.getDataList()
        })
    }

    private getQueryCondition() {
        return new Promise((reslove, reject) => {
            this.dataForm
                .validateFields()
                .then((values: any) => {
                    let vendor_operate = '='
                    if (values['ref_vendor_product']) {
                        vendor_operate = 'like'
                    }
                    delete values['ref_vendor_product']

                    if (this.selectedList.length > 0) {
                        values['cn_sub_category'] = this.selectedList
                    }

                    let operate = values['operate']
                    delete values['operate']

                    if (operate == 'in' && values['sku']) {
                        values['sku'] = values['sku'].split(',')
                    }
                    let params: any = CommonService.createQueryCondition(
                        values,
                        {
                            sku: operate,
                            vendor_id: vendor_operate,
                            operator: '=',
                            cn_sub_category: 'in',
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

    private onTrClick(record) {
        let info = this.data.find(x => x.id == record)
        // if (info) {
        //     this.onDetail(info)
        // } else if (this.groupbyList.length) {
        //     this.onDetail({ id: record })
        // }
    }

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getDataList()
    }

    private onApprove() {
        let skuArr = this.data.filter(x =>
            this.selectedRowKeys.includes(x.index)
        )

        for (let i of skuArr) {
            if (i.approve_state === 20 || i.approve_state === 30) {
                this.$message.error('只能对待审核和已预期的数据进行审核')
                return
            }
        }
        this.$modal
            .open(
                PreProductPriceDetail,
                {
                    detail: skuArr
                },
                {
                    title: '预调价审核',
                    width: '1000px'
                }
            )
            .subscribe(data => {
                //sku不能重复
            })
    }

    private moment = moment

    private initialDate: any = []

    private fillToday() {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )

        let values = this.dataForm.getValues()

        this.initialDate = [startDate, endDate]
        values['write_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fill3days() {
        let day = new Date()
        let endDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 72 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['write_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fill7days() {
        let day = new Date()
        let endDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 168 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['write_date'] = this.initialDate
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

    private onTestCalc() {
        this.$modal
            .open(
                TestCalc,
                {
                    fatherCates: this.fatherCates,
                    sonCates: this.sonCates,
                    cateDict: this.cateDict,
                    departmentList: this.departmentList,
                    systemUsers: this.systemUsers
                },
                {
                    title: this.$t('action.test_calc'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.$message.success('修改成功')
            })
    }

    private onPreCheck() {
        let skuList = this.data
            .filter(x => this.selectedRowKeys.includes(x.index))
            .map(y => y.sku)

        this.innerAction.setActionAPI(
            'product_management/query_product_price_check_for_try_calculate',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    { sku_list: skuList },
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
                            PreProductPriceCheck,
                            {
                                detail: data
                            },
                            {
                                title: this.$t('action.pre_check'),
                                width: '1000px'
                            }
                        )
                        .subscribe(data => {
                            this.$message.success('修改成功')
                        })
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onRowClick(row) {
        this.innerAction.setActionAPI(
            'product_management/query_product_price_check_info',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    { price_id: row.id },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    data[0]['id'] = row.id
                    // data[0]['state'] = record.state
                    let index = 'productpricecheckedit' + row.id
                    let params: any = {
                        index: index,
                        id: row.id,
                        info: data,
                        component: 'ProductPriceCheckEdit'
                    }
                    this.addCommonPageInfo(params)

                    let baseName = this.$t('page_name')

                    this.$router.push({
                        name: 'common-page',
                        path: `/common-page/${index}`,
                        params: {
                            id: index,
                            name: row.sku + '-' + baseName
                        }
                    })
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onCreate() {
        router.push({
            name: 'product_price_check_new'
        })
    }

    private onDelete() {
        let ids = this.data
            .filter(x => this.selectedRowKeys.includes(x.index))
            .map(y => y.id)
        this.innerAction.setActionAPI(
            'product_management/delete_product_price_check',
            CommonService.getMenuCode('product_price_check')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        price_id_list: ids
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('删除成功!')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDealUpdate() {
        this.innerAction.setActionAPI(
            'product_management/update_recompute_price',
            CommonService.getMenuCode('product_price_check')
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
                    this.$message.success('修改成功!')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDealNew() {
        this.innerAction.setActionAPI(
            'product_management/new_recompute_price',
            CommonService.getMenuCode('product_price_check')
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
                    this.$message.success('修改成功!')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDealAllNew() {
        this.innerAction.setActionAPI(
            'product_management/all_new_recompute_price',
            CommonService.getMenuCode('product_price_check')
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
                    this.$message.success('修改成功!')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onFlagToUpdate(state) {
        let ids = this.data
            .filter(x => this.selectedRowKeys.includes(x.index))
            .map(y => y.id)
        this.innerAction.setActionAPI(
            'product_management/update_product_price_check_state',
            CommonService.getMenuCode('product_price_check')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        price_id_list: ids,
                        compute_state: state
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('修改成功!')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onReCheckForShip() {
        this.innerAction.setActionAPI(
            'product_management/recompute_all_shipment_fee',
            CommonService.getMenuCode('product_price_check')
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
                    this.$message.success('修改成功!')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onReCheckForSku() {
        this.innerAction.setActionAPI(
            'product_management/create_same_common_sku_price_info',
            CommonService.getMenuCode('product_price_check')
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
                    this.$message.success('修改成功!')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onReCheckForUpdate() {
        this.innerAction.setActionAPI(
            'product_management/sync_same_common_sku_price_info',
            CommonService.getMenuCode('product_price_check')
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
                    this.$message.success('修改成功!')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onImportPrice() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        '/system_api/upload?inner_action=product_management/import_product_price_check_info&menu_code=' +
                        CommonService.getMenuCode('product_price_check')
                },
                {
                    title: '产品核价导入',
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

    private changeColor(row) {
        this.$nextTick(() => {
            if (
                ['update', 'new', 'allnew', 'computed'].includes(
                    row.compute_state
                )
            ) {
                let querySelector = 'tr[data-row-key="' + row.index + '"'
                let tr: any = document.querySelector(querySelector)
                if (row.compute_state === 'update') {
                    tr.style.color = '#bbbbbb'
                }
                // else if (row.compute_state === 'new') {
                //     tr.style.color = '#bbbbbb'
                // } else if (row.compute_state === 'allnew') {
                //     tr.style.color = '#bbbbbb'
                // } else {
                //     tr.style.color = '#bbbbbb'
                // }
            }
        })
    }

    private calcShipFee() {
        this.innerAction.setActionAPI(
            'product_management/compute_shipment_fee',
            CommonService.getMenuCode('product_price_check')
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
                    this.$message.success('操作成功!')
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
        "ref_vendor_product": "Reference Vendor Product",
        "columns": {
            "login": "Login",
            "approve_user": "Approve User",
            "active": "Active",
            "de_prod_status": "DE Product Status",
            "uk_prod_status": "UK Product Status",
            "write_date": "Write Date",
            "approve_date": "Approve Date",
            "money_type": "Currency",
            "compute_state": "Comput State",
            "vendor_id": "Vendor"
        },
        "action": {
            "create": "Create",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "delete_confirm": "Confirm to Delete?",
            "approve": "Approve",
            "today": "One day",
            "3days": "3 days",
            "7days": "7 days",
            "test_calc": "Multiprofit/sea trial",
            "pre_check": "Pre price adjustment",
            "set_prod_float_price": "Set Prod Float Price",
            "excel_import_prod_float_price": "Excel import prod float price",
            "excel_import_prod_discount": "Excel import prod discount",
            "de_cancel_prod_float": "DE cancel prod float",
            "cancel_prod_float": "UK Cancel prod float",
            "cancel_prod_discount": "Cancel prod discount",
            "send_change_email": "Send change email",
            "deal_new": "处理新加核价(new)",
            "deal_allnew": "处理新加数据获取核价(allnew)",
            "flag_to_update": "标注为update",
            "flag_to_new": "标注为new",
            "flag_to_allnew": "标注为allnew",
            "recheck_for_ship": "物流费用变动后一键重新核价",
            "recheck_for_sku": "插入相同通用货号基础产品核价",
            "recheck_for_update": "一键更新相同通用货号核价数据",
            "price_check_import": "产品核价导入",
            "calc_ship_fee": "计算自发货运费"
        },
        "forms": {
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search",
            "operator_list": "Multi Search"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "cancel": "Are you sure cancel?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "page_name": "ProdPriceCheckDetail"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "ref_vendor_product": "供应商关联货号",
        "columns": {
            "login": "运营",
            "approve_user": "审核人",
            "active": "归档状态",
            "de_prod_status": "DE产品状态",
            "uk_prod_status": "UK产品状态",
            "write_date": "更新时间",
            "approve_date": "审核日期",
            "money_type": "币种",
            "compute_state": "核价状态",
            "vendor_id": "供应商"
        },
        "action": {
            "create": "新建",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "delete_confirm": "确定要删除吗?",
            "approve": "批量审核",
            "today": "1天内",
            "3days": "3天内",
            "7days": "7天内",
            "test_calc": "多档毛利/海运试算",
            "pre_check": "预调价",
            "set_prod_float_price": "设置产品浮动价格",
            "excel_import_prod_float_price": "Excel导入产品浮动价格",
            "excel_import_prod_discount": "Excel导入产品折扣",
            "de_cancel_prod_float": "DE取消产品浮动",
            "cancel_prod_float": "UK取消产品浮动",
            "cancel_prod_discount": "取消产品折扣",
            "send_change_email": "发送浮动变更邮件",
            "deal_update_for_check": "处理更新核价(update)",
            "deal_new": "处理新加核价(new)",
            "deal_allnew": "处理新加数据获取核价(allnew)",
            "flag_to_update": "标注为update",
            "flag_to_new": "标注为new",
            "flag_to_allnew": "标注为allnew",
            "recheck_for_ship": "物流费用变动后一键重新核价",
            "recheck_for_sku": "插入相同通用货号基础产品核价",
            "recheck_for_update": "一键更新相同通用货号核价数据",
            "price_check_import": "产品核价导入",
            "calc_ship_fee": "计算自发货运费"
        },
        "forms": {
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量模糊"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "page_name": "核价详情"
    }
}
</i18n>
