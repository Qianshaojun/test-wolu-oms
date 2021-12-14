<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form ref="dataForm" @submit="getVendorProductList" :column="2">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('forms.quick_search')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="[
                            'fuzzy_search_code',
                            { initialValue: 10 }
                        ]"
                        :style="{ width: '100px' }"
                        size="small"
                    >
                        <a-select-option :value="10">
                            {{ $t('columns.amazon_sku') }}
                        </a-select-option>
                        <a-select-option :value="20">
                            {{ $t('columns.cn_category') }}
                        </a-select-option>
                        <a-select-option :value="30">
                            {{ $t('columns.cn_sub_category') }}
                        </a-select-option>
                        <a-select-option :value="40">
                            {{ $t('columns.product_price_sku') }}
                        </a-select-option>
                    </a-select>
                    <a-input
                        v-decorator="['fuzzy_search_value']"
                        :style="{ width: '195px', 'margin-left': '5px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.state')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['state', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="draft">
                            {{ $t('dict.draft') }}
                        </a-radio-button>
                        <a-radio-button value="write_back">
                            {{ $t('dict.write_back') }}
                        </a-radio-button>
                        <a-radio-button value="merged">
                            {{ $t('dict.merged') }}
                        </a-radio-button>
                        <a-radio-button value="need_merge">
                            {{ $t('dict.need_merge') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.warning_state')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['warning_state', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="lower_warning">
                            {{ $t('dict.lower_warning') }}
                        </a-radio-button>
                        <a-radio-button value="upper_warning">
                            {{ $t('dict.upper_warning') }}
                        </a-radio-button>
                        <a-radio-button value="safe">
                            {{ $t('dict.safe') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.active_state')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['active_state', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="active">
                            {{ $t('dict.active') }}
                        </a-radio-button>
                        <a-radio-button value="inactive">
                            {{ $t('dict.inactive') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>

                <a-form-item
                    :label="$t('columns.merge_user_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="[`merge_user_id`]"
                        style="width: 300px"
                        :placeholder="$t('plzSelect')"
                        size="small"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item in systemUsers"
                            :key="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-button type="primary" @click="importInfo">导入</a-button>
                <a-button
                    type="primary"
                    @click="exportInfo"
                    style="margin-left:10px"
                    >导出
                </a-button>

                <a-button
                    type="primary"
                    style="margin-left:10px"
                    @click="mergeUser"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.mergeUser') }}
                </a-button>
                <a-button
                    type="primary"
                    style="margin-left:10px"
                    @click="writeBackPrice"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.writeBackPrice') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="onSave"
                    style="margin-left:10px"
                    >{{ $t('action.save') }}
                </a-button>
                <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay">
                        <a-menu-item @click="getBaseProductInfo"
                            >{{ $t('action.getBaseProductInfo') }}
                        </a-menu-item>
                        <a-menu-item @click="getProductPrice"
                            >{{ $t('action.getProductPrice') }}
                        </a-menu-item>
                        <a-menu-item @click="computeNeedMerge"
                            >{{ $t('action.computeNeedMerge') }}
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 2px"
                        >{{ $t('action.actions') }}
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown>
            </template>
        </data-form>
        <a-card class="margin-y" style="margin:0 !important;">
            <section class="component edit-customer">
                <CommonPage
                    :page="pageService"
                    @on-page-change="getVendorProductList"
                    :data="data"
                />
                <a-table
                    :dataSource="data"
                    :pagination="false"
                    style="table-layout:fixed;"
                    rowKey="id"
                    :columns="columnList"
                    :customRow="
                        rowKey => ({
                            on: {
                                // 单击每行
                                click: () => {
                                    currentRow = rowKey.id
                                }
                            }
                        })
                    "
                    :rowSelection="{
                        selectedRowKeys: selectedRowKeys,
                        onChange: keys => (selectedRowKeys = keys)
                    }"
                    bordered
                    :scroll="{ x: 3000 }"
                >
                    <template slot="write_standard_price" slot-scope="row">
                        <a-input-number
                            decimalSeparator=","
                            v-if="currentRow == row.id"
                            v-decorator="['write_standard_price']"
                            :value="row.write_standard_price"
                            :style="{
                                width: '100%',
                                background: '#ecc5e9'
                            }"
                            :min="0"
                            size="small"
                            @change="
                                e => onRowChange(row, 'write_standard_price', e)
                            "
                        />
                        <span v-else>{{ row.write_standard_price }}</span>
                    </template>
                    <template slot="write_discount_price" slot-scope="row">
                        <a-input-number
                            decimalSeparator=","
                            v-if="currentRow == row.id"
                            v-decorator="['write_discount_price']"
                            :value="row.write_discount_price"
                            :style="{
                                width: '100%'
                            }"
                            :min="0"
                            size="small"
                            @change="
                                e => onRowChange(row, 'write_discount_price', e)
                            "
                        />
                        <span v-else>{{ row.write_discount_price }}</span>
                    </template>
                    <template slot="discount_start" slot-scope="row">
                        <a-date-picker
                            v-if="currentRow == row.id"
                            v-decorator="['discount_start']"
                            :value="row.discount_start"
                            format="YYYY-MM-DD"
                            @change="e => onRowChange(row, 'discount_start', e)"
                        />
                        <span v-else>{{ row.discount_start }}</span>
                    </template>
                    <template slot="discount_end" slot-scope="row">
                        <a-date-picker
                            v-if="currentRow == row.id"
                            v-decorator="['discount_end']"
                            :value="row.discount_end"
                            format="YYYY-MM-DD"
                            @change="e => onRowChange(row, 'discount_end', e)"
                        />
                        <span v-else>{{ row.discount_end }}</span>
                    </template>
                </a-table>
            </section>
        </a-card>
    </page-container>
</template>

<style>
.ant-select-auto-complete.ant-select-sm .ant-input {
    background-color: #ecc5e9;
}

.required .ant-calendar-picker-input .ant-input-sm {
    background-color: #ecc5e9;
}
</style>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'ant-design-vue'
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
import moment from 'moment'
import { PublicService } from '~/services/public.service'
import { InnerActionService } from '~/bootstrap/services/inner.action.service'
import appConfig from '@/config/app.config'
import UploadExcel from '~/shared/common/upload-excel.vue'
import CommonPage from '~/shared/components/common-page.vue'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'amazon-listing-price'
})
@Component({
    components: { CommonPage }
})
export default class AmazonListingPrice extends Vue {
    @Ref()
    readonly pageContainer!: PageContainer

    @Ref()
    readonly dataForm!: DataForm

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private columnList: any = [
        {
            key: 'import_time',
            title: this.$t('columns.import_time'),
            dataIndex: 'import_time',
            width: 100,
            customRender: (value, row, index) => {
                if (value) {
                    return CommonService.dateToLocal(value)
                }
                return value
            }
        },
        {
            key: 'merge_time',
            title: this.$t('columns.merge_time'),
            dataIndex: 'merge_time',
            width: 100,
            customRender: (value, row, index) => {
                if (value) {
                    return CommonService.dateToLocal(value)
                }
                return value
            }
        },
        {
            key: 'write_back_time',
            title: this.$t('columns.write_back_time'),
            dataIndex: 'write_back_time',
            width: 100,
            customRender: (value, row, index) => {
                if (value) {
                    return CommonService.dateToLocal(value)
                }
                return value
            }
        },
        {
            key: 'amazon_sku',
            title: this.$t('columns.amazon_sku'),
            dataIndex: 'amazon_sku',
            width: 100
        },
        {
            key: 'amazon_asin',
            title: this.$t('columns.amazon_asin'),
            dataIndex: 'amazon_asin',
            width: 100
        },
        {
            key: 'amazon_type',
            title: this.$t('columns.amazon_type'),
            width: 100
        },
        {
            key: 'standard_price',
            title: this.$t('columns.standard_price'),
            dataIndex: 'standard_price',
            width: 100
        },
        {
            key: 'business_price',
            title: this.$t('columns.business_price'),
            dataIndex: 'business_price',
            width: 100
        },
        {
            key: 'instance_id',
            title: this.$t('columns.instance_id'),
            width: 100,
            customRender: (value, row, index) => {
                if (value) {
                    return value.instance_id[1]
                }
                return value
            }
        },
        {
            key: 'product_price_sku',
            title: this.$t('columns.product_price_sku'),
            dataIndex: 'product_price_sku',
            width: 100
        },
        {
            key: 'product_price',
            title: this.$t('columns.product_price'),
            dataIndex: 'product_price',
            width: 100
        },
        {
            key: 'product_related_qty',
            title: this.$t('columns.product_related_qty'),
            dataIndex: 'product_related_qty',
            width: 100
        },
        {
            key: 'cn_category',
            title: this.$t('columns.cn_category'),
            dataIndex: 'cn_category',
            width: 100
        },
        {
            key: 'cn_sub_category',
            title: this.$t('columns.cn_sub_category'),
            dataIndex: 'cn_sub_category',
            width: 100
        },
        {
            key: 'write_standard_price',
            title: this.$t('columns.write_standard_price'),
            width: 100,
            scopedSlots: { customRender: 'write_standard_price' }
        },
        {
            key: 'write_discount_price',
            title: this.$t('columns.write_discount_price'),
            width: 100,
            scopedSlots: { customRender: 'write_discount_price' }
        },
        {
            key: 'discount_start',
            title: this.$t('columns.discount_start'),
            width: 100,
            scopedSlots: { customRender: 'discount_start' }
        },
        {
            key: 'discount_end',
            title: this.$t('columns.discount_end'),
            width: 100,
            scopedSlots: { customRender: 'discount_end' }
        },
        {
            key: 'merge_user_id',
            title: this.$t('columns.merge_user_id'),
            customRender: (value, row, index) => {
                if (value) {
                    return value.merge_user_id[1]
                }
                return value
            },
            width: 100
        },
        {
            key: 'state',
            title: this.$t('columns.state'),
            customRender: (value, row, index) => {
                if (value) {
                    return this.switchCodeName(this.state_list, value.state)
                }
                return value
            },
            width: 100
        },
        {
            key: 'active_state',
            title: this.$t('columns.active_state'),
            customRender: (value, row, index) => {
                if (value) {
                    return this.switchCodeName(
                        this.active_state_list,
                        value.active_state
                    )
                }
                return value
            },
            width: 100
        },
        {
            key: 'warning_state',
            title: this.$t('columns.warning_state'),
            customRender: (value, row, index) => {
                if (value) {
                    return this.switchCodeName(
                        this.warning_state_list,
                        value.warning_state
                    )
                }
                return value
            },
            width: 100
        }
    ]

    private switchCodeName(list, value) {
        let ret: any = value
        let item = list.find(x => x.code == value)
        if (item) {
            ret = item.name
        }
        return ret
    }

    private warning_state_list = [
        {
            code: 'lower_warning',
            name: this.$t('dict.lower_warning')
        },
        {
            code: 'upper_warning',
            name: this.$t('dict.upper_warning')
        },
        {
            code: 'safe',
            name: this.$t('dict.safe')
        }
    ]
    private active_state_list = [
        {
            code: 'active',
            name: this.$t('dict.active')
        },
        {
            code: 'inactive',
            name: this.$t('dict.inactive')
        }
    ]
    private state_list = [
        {
            code: 'draft',
            name: this.$t('dict.draft')
        },
        {
            code: 'need_merge',
            name: this.$t('dict.need_merge')
        },
        {
            code: 'merged',
            name: this.$t('dict.merged')
        },
        {
            code: 'write_back',
            name: this.$t('dict.write_back')
        }
    ]

    private data: any = []

    private loadingService = new LoadingService()
    private publicService = new PublicService()
    private moment = moment
    private pageService = new PageService()

    private selectedRowKeys: any[] = []
    private editable: any = true

    private created() {}

    private mounted() {
        this.getSystemuser()
    }

    private getVendorProductList() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                let fuzzy_search_value = values['fuzzy_search_value']
                if (fuzzy_search_value) {
                    let fuzzy_search_code = values['fuzzy_search_code']
                    let search_field_name = 'amazon_sku'

                    switch (fuzzy_search_code) {
                        case 10:
                            search_field_name = 'amazon_sku'
                            break
                        case 20:
                            search_field_name = 'cn_category'
                            break
                        case 30:
                            search_field_name = 'cn_sub_category'
                            break
                        case 40:
                            search_field_name = 'product_price_sku'
                            break
                        default:
                            search_field_name = 'amazon_sku'
                    }

                    values[search_field_name] = fuzzy_search_value
                }

                delete values['fuzzy_search_value']
                delete values['fuzzy_search_code']

                let params: any = CommonService.createQueryCondition(values, {
                    amazon_sku: 'like',
                    cn_category: 'like',
                    cn_sub_category: 'like',
                    product_price_sku: 'like'
                })
                let inneraction = new InnerActionService()

                inneraction.setActionAPI(
                    'amazon_management/query_all_amazon_listing_price',
                    CommonService.getMenuCode()
                )

                this.publicService
                    .queryPagination(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService,
                            innerAction: inneraction
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
            })
            .catch(err => {
                this.$message.error('请检查查询条件')
            })
    }

    private currentRow: any = ''

    private onRowChange(row, column, value) {
        if (
            Object.prototype.toString.call(value) === '[object InputEvent]' ||
            Object.prototype.toString.call(value) === '[object Event]' ||
            Object.prototype.toString.call(value) === '[object Object]'
        ) {
            if (value.target && value.target.value) {
                row[column] = value.target.value
            } else {
                row[column] = value
            }
        } else {
            row[column] = value
        }
        row.save_flag = 1
    }

    private onSave() {
        let list: any = []
        let flag = false
        for (var i of this.data) {
            if (i.save_flag == 1) {
                list.push({
                    id: i.id,
                    write_standard_price: i.write_standard_price,
                    write_discount_price: i.write_discount_price,
                    discount_start: i.discount_start,
                    discount_end: i.discount_end
                })
                if (!i.write_standard_price) {
                    this.$message.error('需回写标准价格必须填写')
                    break
                }
                if (
                    i.write_discount_price ||
                    i.discount_start ||
                    i.discount_end
                ) {
                    if (
                        i.write_discount_price &&
                        i.discount_start &&
                        i.discount_end
                    ) {
                        flag = true
                    } else {
                        this.$message.error(
                            '需回写折扣价格,折扣开始时间,折扣结束时间须同时填写'
                        )
                        break
                    }
                } else {
                    flag = true
                }
            }
        }
        if (flag) {
            let inneraction = new InnerActionService()
            inneraction.setActionAPI(
                'amazon_management/save_amazon_listing_price',
                CommonService.getMenuCode()
            )
            this.publicService
                .modify(
                    new RequestParams(
                        {
                            listing_list: list
                        },
                        {
                            loading: this.loadingService,
                            innerAction: inneraction
                        }
                    )
                )
                .subscribe(
                    () => {
                        this.$message.success('保存成功')
                        this.getVendorProductList()
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        }
    }

    private mergeUser() {
        let inneraction = new InnerActionService()

        inneraction.setActionAPI(
            'amazon_management/merge_user',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { listing_id_list: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: inneraction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getVendorProductList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private writeBackPrice() {
        let inneraction = new InnerActionService()

        inneraction.setActionAPI(
            'amazon_management/write_back_price',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { listing_id_list: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: inneraction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getVendorProductList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getBaseProductInfo(row) {
        let inneraction = new InnerActionService()

        inneraction.setActionAPI(
            'amazon_management/update_amazon_listing_bp_info',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService,
                        innerAction: inneraction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getVendorProductList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getProductPrice() {
        let inneraction = new InnerActionService()

        inneraction.setActionAPI(
            'amazon_management/update_amazon_listing_product_price',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService,
                        innerAction: inneraction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getVendorProductList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private computeNeedMerge() {
        let inneraction = new InnerActionService()

        inneraction.setActionAPI(
            'amazon_management/compute_need_merge',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService,
                        innerAction: inneraction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getVendorProductList()
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
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "dict": {
            "all": "All",
            "draft": "Draft",
            "lower_warning": "lower Warning",
            "upper_warning": "upper warning",
            "safe": "safe",
            "active": "active",
            "inactive": "inactive",
            "need_merge": "need merge",
            "merged": "merged",
            "write_back": "write back"
        },
        "columns": {
            "amazon_sku": "amazon sku",
            "cn_category": "Chinese Category",
            "cn_sub_category": "Chinese Sub Category",
            "product_price_sku": "product price sku",
            "state": "state",
            "warning_state": "warning state",
            "active_state": "active state",
            "merge_user_id": "merge user",
            "import_time": "import time",
            "merge_time": "merge time",
            "write_back_time": "write back time",
            "amazon_asin": "amazon asin",
            "amazon_type": "amazon type",
            "standard_price": "standard price",
            "business_price": "business price",
            "instance_id": "instance",
            "product_price": "product price",
            "product_related_qty": "product related qty",
            "write_standard_price": "write standard price",
            "write_discount_price": "write discount price",
            "discount_start": "discount start",
            "discount_end": "discount end"
        },
        "action": {
            "mergeUser": "Merge User",
            "import_btn": "Import",
            "writeBackPrice": "Write Back Price",
            "save": "Save",
            "getBaseProductInfo": "Get BP Info",
            "getProductPrice": "Get Product Price",
            "computeNeedMerge": "Compute Need Merge",
            "actions": "Actions"
        },
        "forms": {
            "quick_search": "Quick Search",
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
        "delete_success": "Delete Success"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "dict": {
            "all": "全部",
            "draft": "草稿",
            "lower_warning": "低价预警",
            "upper_warning": "高价预警",
            "safe": "安全",
            "active": "激活",
            "inactive": "未激活",
            "need_merge": "需标记",
            "merged": "已标记",
            "write_back": "回写价格"
        },
        "columns": {
            "amazon_sku": "亚马逊sku",
            "cn_category": "中文分类",
            "cn_sub_category": "中文字类",
            "product_price_sku": "有核价产品",
            "state": "状态",
            "warning_state": "预警状态",
            "active_state": "监听状态",
            "merge_user_id": "标记管理人",
            "import_time": "导入时间",
            "merge_time": "标记时间",
            "write_back_time": "价格回写时间",
            "amazon_asin": "亚马逊asin",
            "amazon_type": "亚马逊类型",
            "standard_price": "正常价格",
            "business_price": "business价格",
            "instance_id": "店铺",
            "product_price": "核价产品价格",
            "product_related_qty": "亚马逊产品和核价产品数量对应关系",
            "write_standard_price": "需回写标准价格",
            "write_discount_price": "需回写折扣价格",
            "discount_start": "折扣开始时间",
            "discount_end": "折扣结束时间"
        },
        "action": {
            "mergeUser": "标注用户",
            "import_btn": "导入",
            "writeBackPrice": "回写价格",
            "save": "保存",
            "getBaseProductInfo": "获取基础产品信息",
            "getProductPrice": "获取产品价格",
            "computeNeedMerge": "标记需要预警产品",
            "actions": "手动执行"
        },
        "forms": {
            "quick_search": "快速查找",
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量查询"
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
