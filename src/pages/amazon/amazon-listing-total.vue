<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <data-form
            ref="dataForm"
            @submit="getAmazonStockPrice"
            :column="2"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 16, offset: 1 }"
        >
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
                        <a-select-option :value="50">
                            {{ $t('columns.basic_product_sku') }}
                        </a-select-option>
                    </a-select>
                    <a-input
                        v-decorator="['fuzzy_search_value']"
                        :placeholder="$t('plzInput')"
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
                        v-decorator="[`user_id`]"
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
                <a-form-item
                    :label="$t('columns.auto_state')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['auto_state', { initialValue: '' }]"
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
                    :label="$t('columns.warehouse')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="[`warehouse`]"
                        style="width: 300px"
                        :placeholder="$t('plzSelect')"
                        size="small"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option value="de">
                            DE
                        </a-select-option>
                        <a-select-option value="uk">
                            UK
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <template #action>
                <a-button
                    type="primary"
                    @click="mergeUser()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.merge_user') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="mergeAuto()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.merge_auto') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="cancelAuto()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.cancel_auto') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="save_changed_data()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.save') }}
                </a-button>
                <a-button @click="uploadFile" type="primary"
                    >{{ $t('action.excel_import') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="showLog"
                    style="margin-left: 2px"
                    >{{ $t('action.showlog') }}
                </a-button>
                <!-- <a-button type="primary" @click="importInfo">导入</a-button>
                <a-button
                    type="primary"
                    @click="exportInfo"
                    style="margin-left:10px"
                    >导出</a-button
                > -->
                <a-button
                    type="primary"
                    style="margin-left:10px"
                    @click="writeBackInventory"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.writeBackInventory') }}
                </a-button>
                <a-button
                    type="primary"
                    style="margin-left:10px"
                    @click="writeBackPrice"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.writeBackPrice') }}
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
                    @on-page-change="getAmazonStockPrice"
                    @onClick="
                        record => {
                            selectedRowKeys = [record]
                            onRowClick(record)
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 2000, y: 400 }"
                >
                    <template slot="open_url" slot-scope="text, row">
                        <span
                            ><a-icon type="amazon" @click="open_url(row)"
                        /></span>
                    </template>
                    <span slot="warning_state" slot-scope="text"
                        >{{ swichStateName(text, warning_state_list) }}
                    </span>
                    <span slot="state" slot-scope="text"
                        >{{ swichStateName(text, state_list) }}
                    </span>
                    <span slot="active_state" slot-scope="text"
                        >{{ swichStateName(text, active_state_list) }}
                    </span>
                    <template
                        slot="write_standard_price"
                        slot-scope="text, row"
                    >
                        <a-input-number
                            decimalSeparator=","
                            v-if="editRow.id == row.id"
                            v-decorator="['write_standard_price']"
                            :value="row.write_standard_price"
                            :style="{
                                width: '100%'
                            }"
                            :min="0"
                            size="small"
                            @change="
                                e => onRowChange(row, 'write_standard_price', e)
                            "
                        />
                        <span v-else>{{ row.write_standard_price }}</span>
                    </template>
                    <template
                        slot="write_discount_price"
                        slot-scope="text, row"
                    >
                        <a-input-number
                            decimalSeparator=","
                            v-if="editRow.id == row.id"
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
                    <template slot="discount_start" slot-scope="text, row">
                        <a-date-picker
                            v-if="editRow.id == row.id"
                            v-decorator="['discount_start']"
                            :value="row.discount_start"
                            format="YYYY-MM-DD"
                            @change="e => onRowChange(row, 'discount_start', e)"
                        />
                        <span v-else>{{ row.discount_start }}</span>
                    </template>
                    <template slot="discount_end" slot-scope="text, row">
                        <a-date-picker
                            v-if="editRow.id == row.id"
                            v-decorator="['discount_end']"
                            :value="row.discount_end"
                            format="YYYY-MM-DD"
                            @change="e => onRowChange(row, 'discount_end', e)"
                        />
                        <span v-else>{{ row.discount_end }}</span>
                    </template>

                    <template slot="critical_value" slot-scope="text, row">
                        <a-input-number
                            decimalSeparator=","
                            v-if="editRow.id == row.id"
                            v-decorator="['critical_value']"
                            :value="row.critical_value"
                            :style="{
                                width: '100%'
                            }"
                            :min="0"
                            size="small"
                            @change="e => onRowChange(row, 'critical_value', e)"
                        />
                        <span v-else>{{ row.critical_value }}</span>
                    </template>
                    <template slot="from_value" slot-scope="text, row">
                        <a-input-number
                            decimalSeparator=","
                            v-if="editRow.id == row.id"
                            v-decorator="['from_value']"
                            :value="row.from_value"
                            :style="{
                                width: '100%'
                            }"
                            :min="0"
                            size="small"
                            @change="e => onRowChange(row, 'from_value', e)"
                        />
                        <span v-else>{{ row.from_value }}</span>
                    </template>
                    <template slot="to_value" slot-scope="text, row">
                        <a-input-number
                            decimalSeparator=","
                            v-if="editRow.id == row.id"
                            v-decorator="['to_value']"
                            :value="row.to_value"
                            :style="{
                                width: '100%'
                            }"
                            :min="0"
                            size="small"
                            @change="e => onRowChange(row, 'to_value', e)"
                        />
                        <span v-else>{{ row.to_value }}</span>
                    </template>
                    <template slot="pull_off_value" slot-scope="text, row">
                        <a-input-number
                            decimalSeparator=","
                            v-if="editRow.id == row.id"
                            v-decorator="['pull_off_value']"
                            :value="row.pull_off_value"
                            :style="{
                                width: '100%'
                            }"
                            :min="0"
                            size="small"
                            @change="e => onRowChange(row, 'pull_off_value', e)"
                        />
                        <span v-else>{{ row.pull_off_value }}</span>
                    </template>
                    <template slot="auto_state" slot-scope="text, row">
                        <span v-if="row.auto_state">
                            <input type="checkbox" checked disabled />
                        </span>
                        <span v-else>
                            <input type="checkbox" disabled />
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
                urlStr="purchase_order_plan/query_all"
                @selectChange="onSelectChange"
                @rowClick="onRowClick"
            >
                <template slot="open_url" slot-scope="text, row">
                    <span><a-icon type="amazon" @click="open_url(row)"/></span>
                </template>
                <template slot="write_standard_price" slot-scope="text, row">
                    <a-input-number
                        decimalSeparator=","
                        v-if="editRow.id == row.id"
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
                <template slot="write_discount_price" slot-scope="text, row">
                    <a-input-number
                        decimalSeparator=","
                        v-if="editRow.id == row.id"
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
                <template slot="discount_start" slot-scope="text, row">
                    <a-date-picker
                        v-if="editRow.id == row.id"
                        v-decorator="['discount_start']"
                        :value="row.discount_start"
                        format="YYYY-MM-DD"
                        @change="e => onRowChange(row, 'discount_start', e)"
                    />
                    <span v-else>{{ row.discount_start }}</span>
                </template>
                <template slot="discount_end" slot-scope="text, row">
                    <a-date-picker
                        v-if="editRow.id == row.id"
                        v-decorator="['discount_end']"
                        :value="row.discount_end"
                        format="YYYY-MM-DD"
                        @change="e => onRowChange(row, 'discount_end', e)"
                    />
                    <span v-else>{{ row.discount_end }}</span>
                </template>

                <template slot="critical_value" slot-scope="text, row">
                    <a-input-number
                        decimalSeparator=","
                        v-if="editRow.id == row.id"
                        v-decorator="['critical_value']"
                        :value="row.critical_value"
                        :style="{
                            width: '100%'
                        }"
                        :min="0"
                        size="small"
                        @change="e => onRowChange(row, 'critical_value', e)"
                    />
                    <span v-else>{{ row.critical_value }}</span>
                </template>
                <template slot="from_value" slot-scope="text, row">
                    <a-input-number
                        decimalSeparator=","
                        v-if="editRow.id == row.id"
                        v-decorator="['from_value']"
                        :value="row.from_value"
                        :style="{
                            width: '100%'
                        }"
                        :min="0"
                        size="small"
                        @change="e => onRowChange(row, 'from_value', e)"
                    />
                    <span v-else>{{ row.from_value }}</span>
                </template>
                <template slot="to_value" slot-scope="text, row">
                    <a-input-number
                        decimalSeparator=","
                        v-if="editRow.id == row.id"
                        v-decorator="['to_value']"
                        :value="row.to_value"
                        :style="{
                            width: '100%'
                        }"
                        :min="0"
                        size="small"
                        @change="e => onRowChange(row, 'to_value', e)"
                    />
                    <span v-else>{{ row.to_value }}</span>
                </template>
                <template slot="pull_off_value" slot-scope="text, row">
                    <a-input-number
                        decimalSeparator=","
                        v-if="editRow.id == row.id"
                        v-decorator="['pull_off_value']"
                        :value="row.pull_off_value"
                        :style="{
                            width: '100%'
                        }"
                        :min="0"
                        size="small"
                        @change="e => onRowChange(row, 'pull_off_value', e)"
                    />
                    <span v-else>{{ row.pull_off_value }}</span>
                </template>
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
import PurchaseCancelAtentioin from '~/components/purchase/purchase-cancel-attention.vue'
import { formConfig } from '@/config/form.config'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import appConfig from '@/config/app.config'
import moment from 'moment'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import LogView from '@/shared/common/log-view.vue'
import { AmazonListingStockService } from '~/services/amazon_listing_stock.service'
import UploadExcel from '~/shared/common/upload-excel.vue'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'amazon-listing-total'
})
@Component({
    components: {
        CommonPage,
        GroupbyTable,
        AutoColumnTable
    }
})
export default class AmazonListingTotal extends Vue {
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
    private amazonListingStockService = new AmazonListingStockService()

    // 表格数据源
    private data: any[] = []

    private reasonList: any = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private current = null

    private defaultBoolValue: any = ''

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private switchCodeName(list, value) {
        let ret: any = value
        let item = list.find(x => x.code == value)
        if (item) {
            ret = item.name
        }
        return ret
    }

    private uploadFile() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        '/system_api/upload?inner_action=/amazon/import_excel_modify_record&menu_code=' +
                        CommonService.getMenuCode(),
                    fileExt: '.xlsx,.xls',
                    attachmentUrlPath:
                        '/system/download_import_template?type=AmazonListingImport'
                },
                {
                    title: this.$t('action.excel_import')
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.selectedRowKeys = []
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private open_url(record) {
        let url = 'https://www.amazon.de/dp/' + record.amazon_asin
        window.open(url)
    }

    private swichStateName(value, value_list) {
        let ret: any = value
        let item = value_list.find(x => x.code == value)
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

    private record_code: any = 0
    private orderBy: any = 'id desc'

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
        this.getSystemuser()
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
    private getAmazonStockPrice() {
        this.dataForm.validateFields().then((values: any) => {
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
                    case 50:
                        search_field_name = 'basic_product_sku'
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
                product_price_sku: 'like',
                basic_product_sku: 'ilike'
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
                    '/amazon/query_stock_price_all',
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

    private onTableChange(pagination, filters, sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getAmazonStockPrice()
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
            column == 'write_standard_price' ||
            column == 'write_discount_price' ||
            column == 'discount_start' ||
            column == 'discount_end' ||
            column == 'critical_value' ||
            column == 'from_value' ||
            column == 'to_value' ||
            column == 'pull_off_value'
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
            'amazon_management/batch_save_stock_price',
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

    private onRowChange(row, column, value) {
        if (
            Object.prototype.toString.call(value) === '[object Event]' ||
            Object.prototype.toString.call(value) === '[object Object]'
        ) {
            if (value.target != undefined && value.target.value != undefined) {
                value = value.target.value
            }
        }

        if (row[column] != value) {
            row[column] = value

            if (column == 'write_standard_price') {
                row.write_standard_price_changed = true
                var exists_item_1 = this.need_save_data_list.find(
                    x => x.id == row.id
                )
                if (exists_item_1) {
                    exists_item_1['write_standard_price'] = value
                } else {
                    this.need_save_data_list.push({
                        price_id: row.price_id,
                        id: row.id,
                        write_standard_price: value
                    })
                }
            } else if (column == 'write_discount_price') {
                row.write_discount_price_changed = true

                var exists_item_2 = this.need_save_data_list.find(
                    x => x.id == row.id
                )
                if (exists_item_2) {
                    exists_item_2['write_discount_price'] = value
                } else {
                    this.need_save_data_list.push({
                        price_id: row.price_id,
                        id: row.id,
                        write_discount_price: value
                    })
                }
            } else if (column == 'discount_start') {
                row.discount_start_changed = true

                var exists_item_3 = this.need_save_data_list.find(
                    x => x.id == row.id
                )
                if (exists_item_3) {
                    exists_item_3['discount_start'] = value
                } else {
                    this.need_save_data_list.push({
                        price_id: row.price_id,
                        id: row.id,
                        discount_start: value
                    })
                }
            } else if (column == 'discount_end') {
                row.discount_end_changed = true

                var exists_item_4 = this.need_save_data_list.find(
                    x => x.id == row.id
                )
                if (exists_item_4) {
                    exists_item_4['discount_end'] = value
                } else {
                    this.need_save_data_list.push({
                        price_id: row.price_id,
                        id: row.id,
                        discount_end: value
                    })
                }
            } else if (column == 'critical_value') {
                row.critical_value_changed = true

                var exists_item_5 = this.need_save_data_list.find(
                    x => x.id == row.id
                )
                if (exists_item_5) {
                    exists_item_5['critical_value'] = value
                } else {
                    this.need_save_data_list.push({
                        id: row.id,
                        price_id: row.price_id,
                        critical_value: value
                    })
                }
            } else if (column == 'from_value') {
                row.from_value_changed = true

                var exists_item_6 = this.need_save_data_list.find(
                    x => x.id == row.id
                )
                if (exists_item_6) {
                    exists_item_6['from_value'] = value
                } else {
                    this.need_save_data_list.push({
                        id: row.id,
                        price_id: row.price_id,
                        from_value: value
                    })
                }
            } else if (column == 'to_value') {
                row.to_value_changed = true

                var exists_item_7 = this.need_save_data_list.find(
                    x => x.id == row.id
                )
                if (exists_item_7) {
                    exists_item_7['to_value'] = value
                } else {
                    this.need_save_data_list.push({
                        id: row.id,
                        price_id: row.price_id,
                        to_value: value
                    })
                }
            } else if (column == 'pull_off_value') {
                row.pull_off_value_changed = true

                var exists_item_8 = this.need_save_data_list.find(
                    x => x.id == row.id
                )
                if (exists_item_8) {
                    exists_item_8['pull_off_value'] = value
                } else {
                    this.need_save_data_list.push({
                        id: row.id,
                        price_id: row.price_id,
                        pull_off_value: value
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

    private getBaseProductInfo(row) {
        let inneraction = new InnerActionService()

        inneraction.setActionAPI(
            'amazon_management/update_amazon_listing_bp_info',
            CommonService.getMenuCode('amazon-listing-price')
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
                    this.getAmazonStockPrice()
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
            CommonService.getMenuCode('amazon-listing-price')
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
                    this.getAmazonStockPrice()
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
            CommonService.getMenuCode('amazon-listing-price')
        )

        var price_id_list: any = []
        this.selectedRowKeys.forEach(value => {
            price_id_list.push(
                this.data.filter(item => value === item.id)[0].price_id
            )
        })
        this.publicService
            .modify(
                new RequestParams(
                    { listing_id_list: price_id_list },
                    {
                        loading: this.loadingService,
                        innerAction: inneraction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getAmazonStockPrice()
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
            CommonService.getMenuCode('amazon-listing-price')
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
                    this.getAmazonStockPrice()
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

    private reset_data() {
        for (var index in this.need_save_data_list) {
            var item = this.need_save_data_list[index]

            var obj = this.data.find(x => x.id === item.id)

            if (obj && obj.hasOwnProperty('write_standard_price_changed')) {
                delete obj.write_standard_price_changed
            }

            if (obj && obj.hasOwnProperty('write_discount_price_changed')) {
                delete obj.write_discount_price_changed
            }

            if (obj && obj.hasOwnProperty('discount_start_changed')) {
                delete obj.discount_start_changed
            }

            if (obj && obj.hasOwnProperty('discount_end_changed')) {
                delete obj.discount_end_changed
            }

            if (obj && obj.hasOwnProperty('critical_value_changed')) {
                delete obj.critical_value_changed
            }
            if (obj && obj.hasOwnProperty('from_value_changed')) {
                delete obj.from_value_changed
            }
            if (obj && obj.hasOwnProperty('to_value_changed')) {
                delete obj.to_value_changed
            }
            if (obj && obj.hasOwnProperty('pull_off_value_changed')) {
                delete obj.pull_off_value_changed
            }
        }

        this.need_save_data_list = []
    }

    private discard_changed_data() {
        this.reset_data()
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
                    object_name: 'amazon_listing',
                    is_special_table: false,
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

    private mergeUser() {
        var price_id_list: any = []
        this.selectedRowKeys.forEach(value => {
            price_id_list.push(
                this.data.filter(item => value === item.id)[0].price_id
            )
        })
        this.amazonListingStockService
            .mergeUser(
                new RequestParams(
                    {
                        amazon_listing_id_list: this.selectedRowKeys,
                        price_id_list: price_id_list
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('标注用户成功!')
                    this.getAmazonStockPrice()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private mergeAuto() {
        this.amazonListingStockService
            .mergeAuto(
                new RequestParams(
                    { amazon_listing_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('标注Auto成功!')
                    this.getAmazonStockPrice()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private cancelAuto() {
        this.amazonListingStockService
            .cancelAuto(
                new RequestParams(
                    { amazon_listing_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('取消Auto成功!')
                    this.getAmazonStockPrice()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private writeBackInventory() {
        let inneraction = new InnerActionService()

        inneraction.setActionAPI(
            'amazon_management/write_back_inventory',
            CommonService.getMenuCode('amazon-listing-total')
        )

        var stock_id_list: any = []
        this.selectedRowKeys.forEach(value => {
            stock_id_list.push(
                this.data.filter(item => value === item.id)[0].id
            )
        })
        this.publicService
            .modify(
                new RequestParams(
                    { listing_id_list: stock_id_list },
                    {
                        loading: this.loadingService,
                        innerAction: inneraction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getAmazonStockPrice()
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
            "amazon_sku": "sku",
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
            "discount_end": "discount end",
            "import_time": "Import Time",
            "compute_time": "Compute Time",
            "write_back_time": "Write Back Time",
            "amazon_asin": "Amazon Asin",
            "amazon_price": "Amazon Price",
            "instance_id": "Instance ID",
            "user_id": "User ID",
            "basic_product_sku": "Basic Product SKU",
            "basic_related_qty": "Basic Related Qty",
            "category": "Category",
            "sub_category": "Sub category",
            "basic_odoo_stock": "Basic Odoo Stock",
            "amazon_stock": "Amazon Stock",
            "odoo_stock": "Odoo Stock",
            "critical_value": "Critical Value",
            "from_value": "From Value",
            "to_value": "To value",
            "pull_off_value": "Pull off value",
            "write_back_value": "Write Back Value",
            "history_write_back_value": "History WB",
            "auto_state": "Auto State",
            "warehouse": "Warehouse",
            "average_sale_num": "Average Sale Num"
        },
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
        "action": {
            "actions": "actions",
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
            "discard": "discard",
            "showlog": "View Log",
            "merge_user": "Merge User",
            "merge_auto": "Merge Auto",
            "cancel_auto": "Cancel Auto",
            "getBaseProductInfo": "Get BP Info",
            "getProductPrice": "Get Product Price",
            "computeNeedMerge": "Compute Need Merge",
            "writeBackPrice": "Write Back Price",
            "writeBackInventory": "Write Back Stock",
            "excel_import": "Upload Excel"
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
        "columns": {
            "amazon_sku": "亚马逊sku",
            "cn_category": "中文分类",
            "cn_sub_category": "中文子类",
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
            "discount_end": "折扣结束时间",
            "import_time": "导入时间",
            "compute_time": "计算时间",
            "write_back_time": "写回时间",
            "amazon_asin": "Asin",
            "amazon_price": "售价",
            "instance_id": "Instance",
            "user_id": "用户",
            "basic_product_sku": "基础SKU",
            "basic_related_qty": "基础数量",
            "category": "分类",
            "sub_category": "子类",
            "basic_odoo_stock": "基础库存",
            "amazon_stock": "Amazon库存",
            "odoo_stock": "Odoo库存",
            "critical_value": "临界值",
            "from_value": "From值",
            "to_value": "To值",
            "pull_off_value": "下架值",
            "write_back_value": "写回值",
            "history_write_back_value": "历史写回值",
            "auto_state": "托管状态",
            "warehouse": "仓库",
            "average_sale_num": "平均销量"
        },
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
        "forms": {
            "quick_search": "快速查找",
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量查询"
        },
        "action": {
            "actions": "手动操作",
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
            "showlog": "查看日志",
            "merge_user": "标注用户",
            "merge_auto": "标记托管",
            "cancel_auto": "取消托管",
            "getBaseProductInfo": "获取基础产品信息",
            "getProductPrice": "获取产品价格",
            "computeNeedMerge": "标记需要预警产品",
            "writeBackPrice": "回写价格",
            "writeBackInventory": "回写库存",
            "excel_import": "上传"
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
