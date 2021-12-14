<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form
            ref="dataForm"
            @submit="getCustomProblemList"
            :column="2"
            :showHeader="false"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('orderNo')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['order_name']"
                        :style="{ width: '50%' }"
                        size="small"
                        :placeholder="$t('plzInput')"
                    ></a-input>
                </a-form-item>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        v-decorator="['sku']"
                        :style="{ width: '30%', 'margin-right': '5px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    ></a-input>
                    <a-select
                        v-decorator="['operator', { initialValue: '=' }]"
                        :style="{ width: '30%' }"
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
                <a-form-item label="Product Name" style="height:35px;margin:0;">
                    <a-input
                        v-decorator="['product_name']"
                        :style="{ width: '50%' }"
                        size="small"
                        :placeholder="$t('plzInput')"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('normal_search')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="[
                            'ref_bind_type',
                            { initialValue: 'ref_basic_no' }
                        ]"
                        :style="{ width: '30%' }"
                        size="small"
                    >
                        <a-select-option value="ref_basic_no">
                            {{ $t('ref_basic_no') }}
                        </a-select-option>
                        <a-select-option value="ref_combine_no">
                            {{ $t('ref_combine_no') }}
                        </a-select-option>
                    </a-select>
                    <a-input
                        v-decorator="['ref_bind_value']"
                        :placeholder="$t('plzInput')"
                        :style="{ width: '30%', 'margin-left': '5px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item :label="$t('supplierNo')">
                    <a-select
                        showSearch
                        v-decorator="['vendor_id', { initialValue: '' }]"
                        :style="{ width: '50%' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
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
                <a-form-item :label="$t('logisticsNo')">
                    <a-input
                        v-decorator="['ship_num']"
                        :style="{ width: '61%' }"
                        size="small"
                        :placeholder="$t('plzInput')"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('edit_group_sku')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['edit_group_sku']"
                        :style="{ width: '50%' }"
                        size="small"
                        :placeholder="$t('plzInput')"
                    ></a-input>
                </a-form-item>
                <a-form-item :label="$t('level')" style="height:35px;margin:0;">
                    <a-select
                        :placeholder="$t('plzSelect')"
                        v-decorator="['z_category ']"
                        size="small"
                        :style="{ width: '30%' }"
                        @change="handleFatherCateChange"
                    >
                        <a-select-option
                            v-for="cate in fatherCates"
                            :key="cate"
                        >
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                    <a-select
                        :placeholder="$t('plzSelect')"
                        v-decorator="['z_sub_category']"
                        v-model="selectedCategory"
                        size="small"
                        mode="multiple"
                        :style="{ width: '30%', marginLeft: '5px' }"
                    >
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <template #collapse>
                <a-form-item
                    :label="$t('seller_code')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['seller_code', { initialValue: '' }]"
                        :style="{ width: '25%' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        :filterOption="filterSelectOption"
                        @change="changeSellerCode"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of sellerCodeList"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                    <a-select
                        showSearch
                        v-decorator="['instance_code']"
                        :style="{ width: '41%', marginLeft: '5px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        mode="multiple"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option
                            :value="item.code"
                            v-for="item of sellerInstanceList"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('inactive')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['active', { initialValue: '' }]"
                        size="small"
                        :style="{ width: '50%' }"
                        buttonStyle="solid"
                        @change="e => onStatusChange(e)"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true">
                            {{ $t('no_active') }}
                        </a-radio-button>
                        <a-radio-button :value="false">
                            {{ $t('active') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('creator')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['create_uid', { initialValue: '' }]"
                        :style="{ width: '67%' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value>
                            {{ $t('none') }}
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
                    :label="$t('create_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['create_time', { initialValue: [] }]"
                        :style="{ width: '61%' }"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                    <a-button
                        @click="fillToday('create_time')"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.today') }}
                    </a-button>
                    <a-button
                        @click="fill3days('create_time')"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.3day') }}
                    </a-button>
                    <a-button
                        @click="fill7days('create_time')"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.7day') }}
                    </a-button>
                </a-form-item>
                <a-form-item
                    :label="$t('order_create_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['date_order', { initialValue: [] }]"
                        :style="{ width: '61%' }"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                    <a-button
                        @click="fillToday('date_order')"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.today') }}
                    </a-button>
                    <a-button
                        @click="fill3days('date_order')"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.3day') }}
                    </a-button>
                    <a-button
                        @click="fill7days('date_order')"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.7day') }}
                    </a-button>
                </a-form-item>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex">
            <template v-if="!groupByList.length">
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
                    @on-page-change="getCustomProblemList"
                    @onClick="
                        record => {
                            selectedRowKeys = [record]
                        }
                    "
                    :scroll="{ x: 1600, y: 800 }"
                >
                    <template slot="ship" slot-scope="scope">
                        {{ scope | dict2(reasonList.ship_type) }}
                    </template>
                    <template slot="state" slot-scope="scope">
                        {{ scope | dict2(reasonList.product_status) }}
                    </template>

                    <template slot="w_warehouse_reason" slot-scope="scope">
                        {{ scope | dict2(reasonList.w_warehouse_reason) }}
                    </template>

                    <template slot="w_return_reason" slot-scope="scope">
                        {{ scope | dict2(reasonList.w_return_reason) }}
                    </template>

                    <template slot="customer_reason" slot-scope="scope">
                        {{ scope | dict2(reasonList.customer_reason) }}
                    </template>

                    <template slot="sale_tag" slot-scope="scope, row">
                        <span
                            v-if="productReason[row.default_code] !== undefined"
                        >
                            {{ scope | dict2(productReason[row.default_code]) }}
                        </span>
                        <span v-else>
                            {{ scope }}
                        </span>
                    </template>

                    <template slot="logistic_reason" slot-scope="scope">
                        {{ scope | dict2(reasonList.logistic_reason) }}
                    </template>

                    <template slot="warehouse_reason_cs" slot-scope="scope">
                        {{ scope | dict2(reasonList.warehouse_reason) }}
                    </template>

                    <template slot="is_resturn" slot-scope="scope">
                        <a-checkbox disabled :checked="scope" />
                    </template>

                    <template slot="create_date" slot-scope="scope">
                        {{ scope | datetolocal }}
                    </template>
                    <template slot="date_order" slot-scope="scope">
                        {{ scope | datetolocal }}
                    </template>
                    <template slot="create_uid" slot-scope="scope">
                        {{ scope | dict2(systemUsers) }}
                    </template>
                    <template slot="message_render" slot-scope="text">
                        <span :title="text">{{
                            text
                                ? text.length > 18
                                    ? text.substr(0, 15) + '...'
                                    : text
                                : ''
                        }}</span>
                    </template>
                </AutoColumnTable>
            </template>
            <GroupByTable
                v-else
                ref="groupByTable"
                :groupByColumn="groupByList"
                :oColumns="columnList"
                :queryNameAuth="allNameAuth"
                :urlStr="queryUrl"
                @selectChange="onSelectChange"
                :scrollX="1500"
                :scrollY="800"
            >
                <template slot="ship" slot-scope="scope">
                    {{ scope | dict2(reasonList.ship_type) }}
                </template>
                <template slot="state" slot-scope="scope">
                    {{ scope | dict2(reasonList.product_status) }}
                </template>

                <template slot="w_warehouse_reason" slot-scope="scope">
                    {{ scope | dict2(reasonList.w_warehouse_reason) }}
                </template>

                <template slot="w_return_reason" slot-scope="scope">
                    {{ scope | dict2(reasonList.w_return_reason) }}
                </template>

                <template slot="customer_reason" slot-scope="scope">
                    {{ scope | dict2(reasonList.customer_reason) }}
                </template>

                <template slot="sale_tag" slot-scope="scope, row">
                    <span v-if="productReason[row.default_code] !== undefined">
                        {{ scope | dict2(productReason[row.default_code]) }}
                    </span>
                    <span v-else>
                        {{ scope }}
                    </span>
                </template>
                <template slot="logistic_reason" slot-scope="scope">
                    {{ scope | dict2(reasonList.logistic_reason) }}
                </template>

                <template slot="warehouse_reason_cs" slot-scope="scope">
                    {{ scope | dict2(reasonList.warehouse_reason) }}
                </template>

                <template slot="is_resturn" slot-scope="scope">
                    <a-checkbox disabled :checked="scope" />
                </template>
                <template slot="create_date" slot-scope="scope">
                    {{ scope | datetolocal }}
                </template>
                <template slot="date_order" slot-scope="scope">
                    {{ scope | datetolocal }}
                </template>
                <template slot="create_uid" slot-scope="scope">
                    {{ scope | dict2(systemUsers) }}
                </template>
                <template slot="message_render" slot-scope="text">
                    <span :title="text">{{
                        text
                            ? text.length > 18
                                ? text.substr(0, 15) + '...'
                                : text
                            : ''
                    }}</span>
                </template>
            </GroupByTable>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Page } from '@/core/decorators'
import { PageService } from '@/bootstrap/services/page.service'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import GroupByTable from '~/components/common/groupby-table.vue'
import { namespace } from 'vuex-class'
import moment from 'moment'
import DataForm from '~/shared/components/data-form.vue'
import { RequestParams } from '@/core/http'
import { ReportService } from '@/services/report.service'
import { SellerInstanceService } from '@/services/seller-instance.service'
import { VendorService } from '@/services/vendor.service'
import { LoadingService } from '@/bootstrap/services/loading.service'
import { CommonService } from '@/shared/utils/common.service'
import { mixins } from 'vue-class-component'
import dateMixin from '@/bootstrap/mixins/handleDateMixin'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { PublicService } from '@/services/public.service'
import { CustomProblemService } from '@/services/custom_problem.service'

const datasModule = namespace('datasModule')
@Page({
    layout: 'workspace',
    name: 'custom-problem'
})
@Component({
    components: {
        AutoColumnTable,
        GroupByTable
    }
})
export default class customProblem extends mixins<any>(dateMixin) {
    @Ref()
    readonly dataForm!: DataForm

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private moment = moment

    private pageService = new PageService()
    private reportService = new ReportService()
    private sellerInstanceService = new SellerInstanceService()
    private vendorService = new VendorService()
    private loadingService = new LoadingService()
    private innerAction = new InnerActionService()
    private publicService = new PublicService()
    private customProblemService = new CustomProblemService()

    private groupByList: any = []
    private data: any = []
    private allNameAuth: any = []
    private columnList: any = []
    private selectedRowKeys: any[] = []
    private fatherCates: any[] = []
    private sonCates: any[] = []
    private sellerCodeList: any[] = []
    private sellerInstanceList: any[] = []
    private sourceSellerInstanceList: any[] = []
    private vender_data: any[] = []
    private cateDict: any = {}
    private queryUrl: string = 'custom/query_all_custom_problem'
    private selectedCategory: any = []
    private reasonList: any = {}
    private vendorCodeList: any = []

    private created() {
        this.getSystemuser()
        this.getCn_cate()
        this.getSellerCodeList()
        this.getSellerInstanceList()
        this.getSelectList()
        this.getVendorCode()
        this.getProductReason([''])
    }

    private mounted() {
        this.groupByList = (this as any).dataForm.checkedGroupbyList
        this.columnList = (this as any).dataForm.tableColumns
        this.allNameAuth = (this as any).dataForm.queryNameAuth
        this.getStatisticsData()
    }

    public activated() {
        this.getStatisticsData()
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
     * 根据客诉统计查询客诉明细数据
     */
    private getStatisticsData() {
        let _tempQueryParams: any = []
        if (this.$route.query.query_condition) {
            _tempQueryParams = (this.$route.query
                .query_condition as any).filter(
                v =>
                    v.query_name != 'statistics_type' &&
                    v.query_name != 'cp_form'
            )
        }
        if (_tempQueryParams.length) {
            _tempQueryParams.forEach(v => {
                if (v.query_name === 'edit_group_sku') {
                    v.query_name = 'sent_edit_group_sku'
                }
                if (v.query_name === 'sku') {
                    v.query_name = 'sent_sku'
                }
                if (v.query_name === 'z_sub_category') {
                    v.query_name = 'sent_z_sub_category'
                }
                if (v.query_name === 'vendor_id') {
                    this.dataForm.setValues({
                        vendor_id: v.value
                    })
                }
            })
            let params: any = { query_condition: [] }
            params.query_condition = _tempQueryParams
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
                        this.data = data
                        this.selectedRowKeys = []
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        }
    }

    private productReason: any = []

    public getProductReason(sku) {
        this.innerAction.setActionAPI(
            'product_management/query_product_reason_enum',
            CommonService.getMenuCode('common-menu')
        )
        this.publicService
            .query(
                new RequestParams(
                    {
                        sku_list: sku
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    if (!Object.keys(this.productReason).length) {
                        this.productReason = data
                    } else {
                        for (let i in data) {
                            if (this.productReason[i] === undefined) {
                                this.productReason[i] = data[i]
                            }
                        }
                    }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getSelectList() {
        this.customProblemService
            .queryCpReasonEnum(new RequestParams({}))
            .subscribe(
                data => {
                    if (data.length) {
                        this.reasonList = data[0]
                    }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onSelectChange(rowKeys) {
        this.selectedRowKeys = rowKeys
    }

    private getSellerCodeList() {
        this.sellerInstanceService
            .query_seller_name(new RequestParams({}))
            .subscribe(
                data => {
                    this.sellerCodeList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getSellerInstanceList() {
        this.sellerInstanceService
            .queryInstanceList(new RequestParams())
            .subscribe(
                data => {
                    this.sourceSellerInstanceList = data
                    this.sellerInstanceList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
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

    private onStatusChange(e) {
        e.stopPropagation()
        this.$nextTick(() => {
            this.getCustomProblemList()
        })
    }

    private changeSellerCode(val) {
        this.dataForm.formInstance.setFieldsValue({ instance_code: [] })
        if (val) {
            let obj: any = {}
            this.sellerCodeList.forEach(v => {
                if (v.code == val) {
                    obj = v
                }
            })
            this.sellerInstanceList = this.fuzzyQuery(
                this.sourceSellerInstanceList,
                obj.name
            )
        } else {
            this.sellerInstanceList = this.sourceSellerInstanceList
        }
    }

    /**
     * 模糊搜索
     */
    private fuzzyQuery(list: any, keyWord: string) {
        let reg = new RegExp(keyWord)
        let arr: any = []
        for (let i: number = 0; i < list.length; i++) {
            if (reg.test(list[i].name)) {
                arr.push(list[i])
            }
        }
        return arr
    }

    private getCustomProblemList() {
        this.dataForm.validateFields().then((values: any) => {
            let sku_operate: any = values['operator']
            delete values['operator']

            if (values['ref_bind_value']) {
                let type = values['ref_bind_type']
                values[type] = values['ref_bind_value']
                delete values['ref_bind_value']
            }
            delete values['ref_bind_type']
            if (this.selectedCategory) {
                values['z_sub_category'] = this.selectedCategory
            }

            let params: any = CommonService.createQueryCondition(values, {
                order_name: 'in_or_like',
                sku: sku_operate,
                vendor_id: 'in',
                seller_code: '=',
                instance_code: 'in',
                z_sub_category: 'in'
            })
            //处理时间
            let nowConditions = (this as any).transferDate(params)
            // console.log(nowConditions)
            if (this.groupByList.length) {
                let groupByTable: any = this.$refs.groupByTable
                groupByTable.getFirstTableData(nowConditions)
            } else {
                params.query_condition = nowConditions
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
}
</script>

<i18n>
{
    "en-us": {
        "orderNo": "Order No",
        "normal_search": "Universal Search",
        "supplierNo": "Supplier No",
        "logisticsNo": "Logistics No",
        "report": "CP Report",
        "edit_group_sku": "Edit Group SKU",
        "level": "Sec/Thr Level",
        "seller_code": "Seller Code",
        "inactive": "Inactive Status",
        "creator": "Creator",
        "create_date": "CP Create Date",
        "order_create_date": "Order Create Date",
        "plzInput": "Please Input",
        "plzSelect": "Please Select",
        "ref_combine_no": "Ref Combine No.",
        "ref_basic_no": "Ref Badic No.",
        "active": "Active",
        "no_active": "No Active",
        "forms": {
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search",
            "operator_list": "Multi Search"
        },
        "action": {
            "today": "1Day",
            "3day": "3Day",
            "7day": "7Day"
        }
    },
    "zh-cn": {
        "orderNo": "订单号",
        "normal_search": "通用关联查找",
        "supplierNo": "供应商编码",
        "logisticsNo": "物流单号",
        "report": "运营部客诉原因报表",
        "edit_group_sku": "维护组SKU",
        "level": "二级/三级分类",
        "seller_code": "店铺站点",
        "inactive": "归档状态",
        "creator": "创建人",
        "create_date": "客诉创建时间",
        "order_create_date": "订单创建时间",
        "plzInput": "请输入",
        "plzSelect": "请选择",
        "ref_combine_no": "关联组合查找",
        "ref_basic_no": "关联基础查找",
        "active": "已归档",
        "no_active": "未归档",
        "forms": {
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量查询"
        },
        "action": {
            "today": "1天内",
            "3day": "3天内",
            "7day": "7天内"
        }
    }
}
</i18n>
