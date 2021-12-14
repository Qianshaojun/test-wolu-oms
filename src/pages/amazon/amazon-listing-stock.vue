<template>
    <page-container ref="pageContainer" @changeSearchState="showHideSearch">
        <data-form
            ref="dataForm"
            @submit="getAmazonListingStockList"
            :column="1"
            :showSearch="showSearch"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.import_time')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        v-decorator="['import_time']"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.write_back_time')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        v-decorator="['write_back_time']"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.amazon_sku')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['amazon_sku']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.basic_product_sku')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['basic_product_sku']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <!-- <a-form-item
                    :label="$t('columns.auto_state')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['auto_state', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onStatusChange(e)"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of $dict.OrderStatus"
                            :key="item.value"
                            >{{ $t(item.label) }}</a-radio-button
                        >
                    </a-radio-group>
                </a-form-item>     -->
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
                    @click="save()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.save') }}
                </a-button>
            </template>
        </data-form>
        <a-card class="margin-y" style="margin:0 !important">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="id"
                style="table-layout:fixed;"
                :scroll="{ y: 360, x: 3000 }"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: (keys, select_rows) => {
                        selectedRows = select_rows
                        selectedRowKeys = keys
                    }
                }"
                @on-page-change="getAmazonListingStockList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                        onTrClick(record)
                    }
                "
            >
                <a-table-column
                    :title="$t('columns.actions')"
                    :width="60"
                    key="action"
                    align="center"
                >
                    <template slot-scope="row">
                        <a @click="OnEdit(row)">{{ $t('action.edit') }}</a>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.import_time')"
                    key="import_time"
                    align="left"
                    dataIndex="import_time"
                >
                    <template slot-scope="import_time">
                        {{ import_time | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.compute_time')"
                    key="compute_time"
                    align="right"
                    dataIndex="compute_time"
                >
                    <template slot-scope="compute_time">
                        {{ compute_time | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.write_back_time')"
                    key="write_back_time"
                    align="left"
                    dataIndex="write_back_time"
                >
                    <template slot-scope="write_back_time">
                        {{ write_back_time | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.amazon_sku')"
                    key="amazon_sku"
                    align="left"
                    dataIndex="amazon_sku"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.amazon_asin')"
                    key="amazon_asin"
                    align="left"
                    dataIndex="amazon_asin"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.amazon_price')"
                    key="amazon_price"
                    align="left"
                    dataIndex="amazon_price"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.instance_id')"
                    key="instance_id"
                    align="left"
                    dataIndex="instance_id"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.user_id')"
                    key="user_id"
                    align="left"
                    dataIndex="user_id"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.basic_product_sku')"
                    key="basic_product_sku"
                    align="left"
                    dataIndex="basic_product_sku"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.basic_related_qty')"
                    key="basic_related_qty"
                    align="left"
                    dataIndex="basic_related_qty"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.category')"
                    key="category"
                    align="left"
                    dataIndex="category"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.sub_category')"
                    key="sub_category"
                    align="left"
                    dataIndex="sub_category"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.auto_state')"
                    key="auto_state"
                    align="left"
                    dataIndex="auto_state"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.warehouse')"
                    key="warehouse"
                    align="left"
                    dataIndex="warehouse"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.basic_odoo_stock')"
                    key="basic_odoo_stock"
                    align="left"
                    dataIndex="basic_odoo_stock"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.odoo_stock')"
                    key="odoo_stock"
                    align="left"
                    dataIndex="odoo_stock"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.critical_value')"
                    key="critical_value"
                    align="left"
                    dataIndex="critical_value"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.from_value')"
                    key="from_value"
                    align="left"
                    dataIndex="from_value"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.to_value')"
                    key="to_value"
                    align="left"
                    dataIndex="to_value"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.pull_off_value')"
                    key="pull_off_value"
                    align="left"
                    dataIndex="pull_off_value"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.write_back_value')"
                    key="write_back_value"
                    align="left"
                    dataIndex="write_back_value"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.history_write_back_value')"
                    key="history_write_back_value"
                    align="left"
                    dataIndex="history_write_back_value"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.average_sale_num')"
                    key="average_sale_num"
                    align="left"
                    dataIndex="average_sale_num"
                >
                </a-table-column>
            </data-table>
        </a-card>
        <a-card v-if="selectedRows[0]">
            <LogView
                :object_name="object_name"
                :record_code="record_code"
            ></LogView>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { AmazonListingStockService } from '~/services/amazon_listing_stock.service'
import DataForm from '~/shared/components/data-form.vue'
import LogView from '~/shared/common/log-view.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import { Theme } from '@fullcalendar/core'
import moment from 'moment'
import AmazonListingEdit from '~/components/product/amazon-listing-edit.vue'

const datasModule = namespace('datasModule')
const userModule = namespace('userModule')

@Page({
    layout: 'workspace',
    name: 'amazon-listing-stock-manage'
})
@Component({
    components: {
        LogView
    }
})
@Component({
    components: {
        AmazonListingEdit
    }
})
export default class AmazonListingStockManage extends Vue {
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private amazonListingStockService = new AmazonListingStockService()

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    // 表格数据源
    private data: any[] = []

    private object_name = 'amazon_listing_stock'

    private record_code = ''
    // 表格选择项
    private selectedRowKeys: any[] = []

    private selectedRows: any[] = []

    private moment = moment

    private userDict = {}

    private showSearch: any = true

    private showHideSearch(flag) {
        this.showSearch = flag
    }

    private created() {
        this.getSystemuser()
        this.systemUsers.map(x => (this.userDict[x.code] = x.name))
    }

    private mounted() {}

    private getAmazonListingStockList() {
        this.dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                amazon_sku: 'ilike',
                basic_product_sku: 'ilike',
                ...formConfig.condition
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
            params.query_condition = nowConditions
            this.amazonListingStockService
                .queryAll(
                    new RequestParams(params, {
                        page: this.pageService,
                        loading: this.loadingService
                    })
                )
                .subscribe(
                    data => {
                        for (let item of data) {
                            item['import_time_start'] = moment
                                .parseZone(item['import_time'])
                                .local()
                                .format('YYYY-MM-DD HH:mm:ss')
                            item['import_time_end'] = moment
                                .parseZone(item['write_back_time'])
                                .local()
                                .format('YYYY-MM-DD HH:mm:ss')
                        }
                        this.data = data
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private OnEdit(row) {
        this.$modal
            .open(
                AmazonListingEdit,
                {
                    saveFlag: 1,
                    row: row
                },
                {
                    title: 'Edit Amazon Listing Stock: ' + row.amazon_sku
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getAmazonListingStockList()
            })
    }

    private mergeUser() {
        this.amazonListingStockService
            .mergeUser(
                new RequestParams(
                    { amazon_listing_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('认领Listing成功!')
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
        "desc": "",
        "columns": {
            "import_time": "Import Time",
            "compute_time": "Compute Time",
            "write_back_time": "Write Back Time",
            "amazon_sku": "Amazon Sku",
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
        "action": {
            "merge_user": "Merge User",
            "merge_auto": "Merge Auto",
            "cancel_auto": "Cancel Auto",
            "edit": "Edit",
            "save": "Save"
        },
        "delete": "Are you sure delete?",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "yes": "Yes",
        "no": "No"
    },
    "zh-cn": {
        "desc": "",
        "columns": {
            "import_time": "导入时间",
            "compute_time": "计算时间",
            "write_back_time": "写回时间",
            "amazon_sku": "Amazon SKU",
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
        "action": {
            "merge_user": "认领Listing",
            "merge_auto": "标记托管",
            "cancel_auto": "取消托管",
            "edit": "编辑",
            "save": "保存"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "yes": "是",
        "no": "否"
    }
}
</i18n>