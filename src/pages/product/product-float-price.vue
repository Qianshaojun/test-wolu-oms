<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <data-form ref="dataForm" @submit="getSellerList" :column="1">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.sku')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['sku']"
                        :style="{ width: '310px' }"
                        size="small"
                    />
                </a-form-item>

                <a-form-item
                    :label="$t('columns.dept_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['dept_id']"
                        :style="{ width: '310px' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '310px' }"
                        :filterOption="filterSelectOption"
                        size="small"
                        mode="multiple"
                        :placeholder="$t('plzSelect')"
                        allowClear
                    >
                        <a-select-option
                            v-for="i of departmentList"
                            :key="i.id"
                            :value="i.id"
                            :title="i.dept_name"
                        >
                            {{ i.dept_name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item
                    :label="$t('columns.cn_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['cn_category', { initialValue: '' }]"
                        :style="{ width: '90px' }"
                        @change="handleFatherCateChange"
                        placeholder="Please Select"
                        :filterOption="filterSelectOption"
                        size="small"
                        allowClear
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="cate in fatherCates"
                            :key="cate"
                            :title="cate"
                        >
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                    <a-select
                        showSearch
                        :style="{ width: '215px', 'margin-left': '5px' }"
                        placeholder="Please Select"
                        v-decorator="['cn_sub_category', { initialValue: '' }]"
                        :filterOption="filterSelectOption"
                        size="small"
                        mode="multiple"
                        allowClear
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="cate in sonCates"
                            :key="cate"
                            :title="cate"
                        >
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item
                    :label="$t('columns.float_platform')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['float_platform', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.no') }}
                        </a-radio-button>
                        <a-radio-button value="amazon">
                            {{ $t('dict.amazon') }}
                        </a-radio-button>
                        <a-radio-button value="ebay">
                            {{ $t('dict.ebay') }}
                        </a-radio-button>
                        <a-radio-button value="all">
                            {{ $t('dict.all_platform') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.uk_float_platform')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'uk_float_platform',
                            { initialValue: '' }
                        ]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.no') }}
                        </a-radio-button>
                        <a-radio-button value="amazon">
                            {{ $t('dict.amazon') }}
                        </a-radio-button>
                        <a-radio-button value="ebay">
                            {{ $t('dict.ebay') }}
                        </a-radio-button>
                        <a-radio-button value="all">
                            {{ $t('dict.all_platform') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.compute_state')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['compute_state', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="update">
                            {{ $t('dict.update') }}
                        </a-radio-button>
                        <a-radio-button value="allnew">
                            {{ $t('dict.allnew') }}
                        </a-radio-button>
                        <a-radio-button value="new">
                            {{ $t('dict.new') }}
                        </a-radio-button>
                        <a-radio-button value="computed">
                            {{ $t('dict.computed') }}
                        </a-radio-button>
                        <a-radio-button value="inactive">
                            {{ $t('dict.inactive') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-popconfirm
                    :title="$t('action.deCancelProductFloat')"
                    :okText="$t('action.ok')"
                    :cancelText="$t('action.cancel')"
                    placement="left"
                    @confirm="deCancelProductFloat()"
                    :disabled="!selectedRowKeys.length"
                >
                    <a-button
                        type="primary"
                        :disabled="!selectedRowKeys.length"
                        v-auth="'cancel_de'"
                        >{{ $t('action.deCancelProductFloat') }}
                    </a-button>
                </a-popconfirm>
                <a-popconfirm
                    :title="$t('action.ukCancelProductFloat')"
                    :okText="$t('action.ok')"
                    :cancelText="$t('action.cancel')"
                    placement="left"
                    @confirm="ukCancelProductFloat()"
                    :disabled="!selectedRowKeys.length"
                >
                    <a-button
                        type="primary"
                        :disabled="!selectedRowKeys.length"
                        v-auth="'cancel_uk'"
                        >{{ $t('action.ukCancelProductFloat') }}
                    </a-button>
                </a-popconfirm>
                <a-popconfirm
                    :title="$t('action.onCancelProductDiscount')"
                    :okText="$t('action.ok')"
                    :cancelText="$t('action.cancel')"
                    placement="left"
                    @confirm="onCancelProductDiscount()"
                    :disabled="!selectedRowKeys.length"
                >
                    <a-button
                        type="primary"
                        :disabled="!selectedRowKeys.length"
                        v-auth="'cancel_pd'"
                        >{{ $t('action.onCancelProductDiscount') }}
                    </a-button>
                </a-popconfirm>
                <a-button
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="setProductFloatPrice()"
                    v-auth="'set_fp'"
                    >{{ $t('action.setProductFloatPrice') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="importProductFloatPrice()"
                    v-auth="'import_fp'"
                    >{{ $t('action.importProductFloatPrice') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="importProductDiscount()"
                    v-auth="'import_pd'"
                    >{{ $t('action.importProductDiscount') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="sendFloatEmailNow()"
                    v-auth="'send_email'"
                    >{{ $t('action.sendFloatEmailNow') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="viewLog()"
                    :disabled="selectedRowKeys.length !== 1"
                    >{{ $t('action.viewLog') }}
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
                        columnWidth: 85,
                        onChange: keys => (selectedRowKeys = keys)
                    }"
                    @on-page-change="getSellerList"
                    @onClick="
                        record => {
                            selectedRowKeys = [record]
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: defaultScrollX, y: 500 }"
                >
                    <span slot="check_render" slot-scope="text"
                        ><a-checkbox disabled :checked="text" />
                    </span>
                    <template slot="sku" slot-scope="text">
                        {{ text }}
                    </template>
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <template slot="platform" slot-scope="text">
                        {{ text | dict2(platformList) }}
                    </template>
                    <template slot="compute_state" slot-scope="text">
                        {{ text | dict2(stateList) }}
                    </template>
                    <template slot="warehouse" slot-scope="text">
                        <span v-if="text == 'uk'">UK</span>
                        <span v-else-if="text == 'de'">DE</span>
                        <span v-else-if="text == 'all'">ALL</span>
                        <span v-else>{{ text }}</span>
                    </template>
                    <template
                        slot="message_render"
                        slot-scope="text"
                        :title="text"
                    >
                        <span :title="text">
                            {{
                                text
                                    ? text.length > 20
                                        ? text.substr(0, 17) + '...'
                                        : text
                                    : ''
                            }}
                        </span>
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
                :scrollX="defaultScrollX"
                :scrollY="500"
            >
                <span slot="check_render" slot-scope="text"
                    ><a-checkbox disabled :checked="text" />
                </span>
                <template slot="sku" slot-scope="text">
                    {{ text }}
                </template>
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
                <template slot="platform" slot-scope="text">
                    {{ text | dict2(platformList) }}
                </template>
                <template slot="compute_state" slot-scope="text">
                    {{ text | dict2(stateList) }}
                </template>
                <template slot="warehouse" slot-scope="text">
                    <span v-if="text == 'uk'">UK</span>
                    <span v-else-if="text == 'de'">DE</span>
                    <span v-else-if="text == 'all'">ALL</span>
                    <span v-else>{{ text }}</span>
                </template>
                <template slot="message_render" slot-scope="text" :title="text">
                    <span :title="text">
                        {{
                            text
                                ? text.length > 20
                                    ? text.substr(0, 17) + '...'
                                    : text
                                : ''
                        }}
                    </span>
                </template>
            </GroupbyTable>
        </a-card>
    </page-container>
</template>
<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { PublicService } from '~/services/public.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { InnerActionService } from '~/bootstrap/services/inner.action.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import setProductFloatPrice from '~/components/product/set-product-float-price.vue'
import LogView from '~/shared/common/log-view.vue'
import { ReportService } from '../../services/report.service'

import router from '../../router'
import { PurchaseService } from '../../services/purchase.service'
import UploadExcel from '~/shared/common/upload-excel.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import GroupbyTable from '~/components/common/groupby-table.vue'

const userModule = namespace('userModule')
const allUsersModule = namespace('allUsersModule')
const pageParamsModule = namespace('pageParamsModule')
const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'product-float-price'
})
@Component({
    components: {
        setProductFloatPrice,
        LogView,
        AutoColumnTable,
        GroupbyTable
    }
})
export default class ProductFloatPrice extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // Loading服务
    private loadingService = new LoadingService()
    private innerActionService = new InnerActionService()
    private publicService = new PublicService()
    // 分页服务
    private pageService = new PageService()
    private reportService = new ReportService()

    private purchaseService = new PurchaseService()
    // 表格数据源
    private data: any[] = []

    @datasModule.State
    private departmentList

    @datasModule.Action
    private getDepartmentList

    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []

    private orderBy: any = ''

    private columnList: any = []
    private allNameAuth: any = []
    private groupbyList: any = []
    private queryConsition: any = []
    private defaultScrollX: any = 1500

    private queryUrl: any = 'product_management/query_all_product_price_float'

    private stateList: any = [
        {
            code: 'update',
            name: this.$t('dict.update')
        },
        {
            code: 'allnew',
            name: this.$t('dict.allnew')
        },
        {
            code: 'computed',
            name: this.$t('dict.computed')
        },
        {
            code: 'inactive',
            name: this.$t('dict.inactive')
        },
        {
            code: 'new',
            name: this.$t('dict.new')
        }
    ]

    private platformList: any = [
        {
            code: 'amazon',
            name: this.$t('dict.amazon')
        },
        {
            code: 'ebay',
            name: this.$t('dict.ebay')
        },
        {
            code: 'all',
            name: this.$t('dict.all_platform')
        }
    ]

    // 表格选择项
    private selectedRowKeys: any[] = []

    private current = null

    private get rules() {
        return {}
    }

    public created() {
        this.getDepartmentList()

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

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
    }

    @Watch('columnList')
    private onColumnListChange() {
        this.defaultScrollX = this.dataForm.columnWidthTotal
    }

    /**
     * 获取订单数据
     */
    private getSellerList() {
        // let item = this.columnList.find(x => x.key === 'sku')
        // item['fixed'] = 'left'

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
                this.innerActionService.setActionAPI(
                    this.queryUrl,
                    CommonService.getMenuCode()
                )
                this.publicService
                    .queryPagination(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService,
                            innerAction: this.innerActionService
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

    private getQueryCondition() {
        return new Promise((reslove, reject) => {
            this.dataForm
                .validateFields()
                .then((values: any) => {
                    this.innerActionService.setActionAPI(
                        'product_management/query_all_product_price_float',
                        CommonService.getMenuCode()
                    )

                    if (this.selectedList.length > 0) {
                        values['cn_sub_category'] = this.selectedList
                    }

                    if (values.cn_sub_category) {
                        delete values['cn_category']
                    }

                    let params: any = CommonService.createQueryCondition(
                        values,
                        {
                            sku: 'in_or_like',
                            cn_sub_category: 'in',
                            cn_category: '=',
                            dept_id: 'in',
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

    private setProductFloatPrice() {
        let data: any = false
        if (this.selectedRowKeys.length == 1) {
            data = this.data.filter(x => x.id == this.selectedRowKeys[0])
        }
        this.$modal
            .open(
                setProductFloatPrice,
                {
                    price_id_list: this.selectedRowKeys,
                    platformList: this.platformList,
                    data: data
                },
                {
                    title: this.$t('Set Product Float Price'),
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.getSellerList()
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importProductFloatPrice() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        '/system_api/upload?inner_action=product_management/import_product_float_price&menu_code=' +
                        CommonService.getMenuCode(),
                    attachmentUrlPath:
                        '/system/download_import_template?type=ProductPriceImport'
                },
                {
                    title: 'Import Product Float Price',
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

    private importProductDiscount() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        '/system_api/upload?inner_action=product_management/import_product_discount_price&menu_code=' +
                        CommonService.getMenuCode(),
                    attachmentUrlPath:
                        '/system/download_import_template?type=ProductDiscountImport'
                },
                {
                    title: 'Import Product Discount',
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

    private deCancelProductFloat() {
        this.onCancelProductFloat('de')
    }

    private ukCancelProductFloat() {
        this.onCancelProductFloat('uk')
    }

    private onCancelProductFloat(warehouse: any) {
        this.innerActionService.setActionAPI(
            'product_management/cancel_product_float_price',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        price_id_list: this.selectedRowKeys,
                        warehouse: warehouse
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerActionService
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getSellerList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onCancelProductDiscount() {
        this.innerActionService.setActionAPI(
            'product_management/cancel_product_discount_price',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        price_id_list: this.selectedRowKeys
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerActionService
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getSellerList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private sendFloatEmailNow() {
        this.innerActionService.setActionAPI(
            'product_management/send_float_email_now',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService,
                        innerAction: this.innerActionService
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getSellerList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private viewLog() {
        this.$modal
            .open(
                LogView,
                {
                    record_code: this.selectedRowKeys[0],
                    object_name: 'product_price_log',
                    is_special_table: true
                },
                {
                    title: 'Log',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {},
                err => {
                    this.$message.error(err.message)
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

    private onTableChange(pagination, filters, sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getSellerList()
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "Set Product Float Price": "Set Product Float Price",
        "columns": {
            "sku": "SKU",
            "month": "Month",
            "warehouse": "Warehouse",
            "shipment_price": "Shipment Price",
            "write_date": "Write Date",
            "operator": "Operator",
            "cn_category": "Cn Category",
            "cn_sub_category": "cn sub category",
            "de_mfn_lowest_price": "de_mfn_lowest_price",
            "de_fba_lowest_price": "de_fba_lowest_price",
            "fr_mfn_lowest_price": "fr_mfn_lowest_price",
            "fr_fba_lowest_price": "fr_fba_lowest_price",
            "gb_own_lowest_price": "gb_own_lowest_price",
            "gb_own_fba_lowest_price": "gb_own_fba_lowest_price",
            "it_mfn_lowest_price": "it_mfn_lowest_price",
            "it_fba_lowest_price": "it_fba_lowest_price",
            "es_mfn_lowest_price": "es_mfn_lowest_price",
            "es_fba_lowest_price": "es_fba_lowest_price",
            "nl_mfn_lowest_price": "nl_mfn_lowest_price",
            "nl_fba_lowest_price": "nl_fba_lowest_price",
            "se_fba_lowest_price": "se_fba_lowest_price",
            "pl_mfn_lowest_price": "pl_mfn_lowest_price",
            "pl_fba_lowest_price": "pl_fba_lowest_price",
            "de_prime_normal_price": "de_prime_normal_price",
            "float_price": "de float_price",
            "uk_float_price": "uk float price",
            "fr_float_price": "fr float price",
            "es_float_price": "es float price",
            "it_float_price": "it float price",
            "nl_float_price": "nl float price",
            "pl_float_price": "pl float price",
            "float_platform": "float_platform",
            "uk_float_platform": "uk_float_platform",
            "discount_percent": "Discount Percent",
            "discount_warehouse": "discount Warehouse",
            "discount_start": "discount_start",
            "discount_end": "discount_end",
            "change_reason": "change_reason",
            "compute_state": "compute_state",
            "de_float_instance": "de_float_instance",
            "dept_id": "Department"
        },
        "action": {
            "create": "Create",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "deCancelProductFloat": "Cancel DE Float Price",
            "ukCancelProductFloat": "Cancel UK Float Price",
            "onCancelProductDiscount": "Cancel Product Discount",
            "setProductFloatPrice": "Set Float Price",
            "importProductFloatPrice": "Import Float Price",
            "importProductDiscount": "Import Product Discount",
            "sendFloatEmailNow": "Send Float Price Change Notification Email",
            "viewLog": "View Log"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "cancel": "Are you sure cancel?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "dict": {
            "update": "update",
            "allnew": "allnew",
            "computed": "computed",
            "inactive": "inactive",
            "new": "new",
            "amazon": "Amazon",
            "ebay": "Ebay",
            "all_platform": "All Platform"
        }
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "Set Product Float Price": "设置产品浮动价格",
        "columns": {
            "sku": "SKU",
            "year": "年份",
            "warehouse": "仓库",
            "write_date": "更新时间",
            "operator": "运营",
            "cn_category": "中文分类",
            "cn_sub_category": "中文子类",
            "de_mfn_lowest_price": "de_mfn最低定价",
            "de_fba_lowest_price": "de_fba最低定价",
            "fr_mfn_lowest_price": "fr_mfn最低定价",
            "fr_fba_lowest_price": "fr_fba最低定价",
            "gb_own_lowest_price": "gb_own最低定价",
            "gb_own_fba_lowest_price": "gb_own_fba最低定价",
            "it_mfn_lowest_price": "it_mfn最低定价",
            "it_fba_lowest_price": "it_fba最低定价",
            "es_mfn_lowest_price": "es_mfn最低定价",
            "es_fba_lowest_price": "es_fba最低定价",
            "nl_mfn_lowest_price": "nl_mfn最低定价",
            "nl_fba_lowest_price": "nl_fba最低定价",
            "se_fba_lowest_price": "se_fba最低定价",
            "pl_mfn_lowest_price": "pl_mfn最低定价",
            "pl_fba_lowest_price": "pl_fba最低定价",
            "de_prime_normal_price": "DE-Prime正常定价",
            "float_price": "DE站点浮动值",
            "uk_float_price": "UK站点浮动值",
            "fr_float_price": "FR站点浮动值",
            "es_float_price": "ES站点浮动值",
            "it_float_price": "IT站点浮动值",
            "nl_float_price": "NL站点浮动值",
            "pl_float_price": "PL站点浮动值",
            "float_platform": "德仓浮动平台",
            "uk_float_platform": "英仓浮动平台",
            "discount_percent": "折扣百分比",
            "discount_warehouse": "折扣仓库",
            "discount_start": "折扣开始时间",
            "discount_end": "折扣结束时间",
            "change_reason": "变动原因",
            "compute_state": "状态",
            "de_float_instance": "DE浮动站点",
            "dept_id": "部门"
        },
        "action": {
            "create": "新建",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "deCancelProductFloat": "DE取消产品浮动",
            "ukCancelProductFloat": "UK取消产品浮动",
            "onCancelProductDiscount": "取消产品折扣",
            "setProductFloatPrice": "设置产品浮动价格",
            "importProductFloatPrice": "导入产品浮动价格",
            "importProductDiscount": "导入产品折扣",
            "sendFloatEmailNow": "发送浮动变更通知邮件",
            "viewLog": "查看日志"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "dict": {
            "update": "变更需核价",
            "allnew": "新加数据获取核价",
            "computed": "已核价",
            "inactive": "已归档",
            "new": "新加需核价",
            "amazon": "Amazon平台",
            "ebay": "Ebay平台",
            "all_platform": "所有平台"
        }
    }
}
</i18n>
