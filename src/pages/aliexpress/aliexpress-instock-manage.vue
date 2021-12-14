<template>
    <page-container ref="pageContainer">
        <template #header-action>
            <!-- <a-button type="primary" @click="onCreate">{{
                $t('action.create')
            }}</a-button> -->
        </template>
        <data-form ref="dataForm" @submit="getInstockList" :column="1">
            <!--默认显示项-->
            <template #default>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-select
                        v-decorator="['type', { initialValue: 'basic_sku' }]"
                        :style="{ width: '100px' }"
                        :placeholder="$t('plzSelect')"
                        size="small"
                    >
                        <a-select-option value="basic_sku">
                            {{ $t('columns.basic_sku') }}
                        </a-select-option>
                        <a-select-option value="aliexpress_sku">
                            {{ $t('columns.aliexpress_sku') }}
                        </a-select-option>
                    </a-select>
                    <a-input
                        v-decorator="['default_code']"
                        :style="{ width: '240px', margin: '0 5px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    ></a-input>
                    <a-select
                        v-decorator="['operator', { initialValue: 'ilike' }]"
                        :style="{ width: '100px' }"
                        size="small"
                    >
                        <a-select-option value="ilike">
                            {{ $t('forms.operator_like') }}
                        </a-select-option>
                        <a-select-option value="=">
                            {{ $t('forms.operator_equal') }}
                        </a-select-option>
                        <a-select-option value="in">
                            {{ $t('forms.operator_list') }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['cn_category']"
                        style="width: 120px"
                        @change="handleFatherCateChange"
                        placeholder="品类"
                        size="small"
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
                        style="width: 20%;margin-left:5px"
                        placeholder="子类"
                        size="small"
                    >
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <!--操作行为项-->
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
        <a-card class="margin-y" style="margin:0 !important;">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getInstockList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                        onTrClick(record)
                    }
                "
                style="table-layout:fixed;"
                :scroll="{ x: 2000, y: 400 }"
            >
                <a-table-column
                    :title="$t('columns.id')"
                    key="id"
                    width="4%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.id }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.actions')"
                    key="edit"
                    width="5%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a @click="editValue(row)">{{ $t('action.edit') }}</a>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.import_time')"
                    key="import_time"
                    :sorter="true"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.import_time | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.compute_time')"
                    key="compute_time"
                    :sorter="true"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.compute_time | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.write_back_time')"
                    key="write_back_time"
                    :sorter="true"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.write_back_time | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.aliexpress_sku')"
                    key="aliexpress_sku"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.aliexpress_sku }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.sku_id')"
                    key="sku_id'"
                    width="8%"
                    dataIndex="sku_id"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.country')"
                    key="country'"
                    width="8%"
                    dataIndex="country"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.sku_price')"
                    key="sku_price'"
                    width="8%"
                    dataIndex="sku_price"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.seller_name')"
                    key="seller_name'"
                    width="8%"
                    dataIndex="seller_name"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.merge_user')"
                    key="merge_user'"
                    width="8%"
                    dataIndex="merge_user"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.basic_sku')"
                    key="basic_sku'"
                    width="8%"
                    dataIndex="basic_sku"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.basic_related_qty')"
                    key="basic_related_qty'"
                    width="8%"
                    dataIndex="basic_related_qty"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.cn_category')"
                    key="cn_category'"
                    width="8%"
                    dataIndex="cn_category"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.cn_sub_category')"
                    key="cn_sub_category'"
                    width="8%"
                    dataIndex="cn_sub_category"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.basic_odoo_stock')"
                    key="basic_odoo_stock'"
                    width="8%"
                    dataIndex="basic_odoo_stock"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.aliexpress_stock')"
                    key="aliexpress_stock'"
                    width="8%"
                    dataIndex="aliexpress_stock"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.odoo_stock')"
                    key="odoo_stock'"
                    width="8%"
                    dataIndex="odoo_stock"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.critical_value')"
                    key="critical_value'"
                    width="8%"
                    dataIndex="critical_value"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.from_value')"
                    key="from_value'"
                    width="8%"
                    dataIndex="from_value"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.to_value')"
                    key="to_value'"
                    width="8%"
                    dataIndex="to_value"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.pull_off_value')"
                    key="pull_off_value'"
                    width="8%"
                    dataIndex="pull_off_value"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.write_back_value')"
                    key="write_back_value'"
                    width="8%"
                    dataIndex="write_back_value"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.last_write_back_value')"
                    key="last_write_back_value'"
                    width="8%"
                    dataIndex="last_write_back_value"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.auto_state')"
                    key="auto_state"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-checkbox
                            :checked="row.auto_state"
                            :disabled="true"
                        />
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
        <a-card v-if="selectedRowKeys.length">
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
import { SellerInstanceService } from '~/services/seller-instance.service'
import { UserService } from '~/services/user.service'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { CompanyService } from '~/services/company.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import SellerView from '~/components/seller_instance/seller_view.vue'
import SellerApiEdit from '~/components/seller_instance/seller-api-edit.vue'
import AliexpressListingEdit from '~/components/product/aliexpress-listing-edit.vue'
import { ReportService } from '../../services/report.service'
import { ProductService } from '../../services/product.service'
import { AliexpressService } from '../../services/aliexpress.service'
import LogView from '~/shared/common/log-view.vue'

const userModule = namespace('userModule')
const allUsersModule = namespace('allUsersModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'aliexpress-instock-manage'
})
@Component({
    components: {
        SellerView,
        SellerApiEdit,
        LogView,
        AliexpressListingEdit
    }
})
export default class AliexpressInstockManage extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private reportService = new ReportService()

    private aliexpressService = new AliexpressService()

    // 表格数据源
    private data: any[] = []
    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []
    private versionList: any = []
    private object_name: any = 'aliexpress_listing_stock'
    private record_code: any = ''

    // 表格选择项
    private selectedRowKeys: any[] = []

    private get rules() {
        return {}
    }

    public created() {
        this.getCn_cate()
    }

    @Watch('selectedRowKeys')
    private onSelectedRowKeysChange() {
        if (this.selectedRowKeys.length && !this.record_code) {
            this.record_code = this.selectedRowKeys[0]
        }
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

    /**
     * 获取订单数据
     */
    private getInstockList() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                if (this.selectedList.length > 0) {
                    values['cn_sub_category'] = this.selectedList
                }
                let operator = values['operator']
                let type = values['type']
                delete values['operator']
                delete values['type']

                if (operator == 'in' && values['default_code']) {
                    values['default_code'] = values['default_code'].split(',')
                }

                if (type == 'basic_sku') {
                    values['basic_sku'] = values['default_code']
                } else {
                    values['aliexpress_sku'] = values['default_code']
                }

                delete values['default_code']

                let params: any = CommonService.createQueryCondition(values, {
                    basic_sku: operator,
                    aliexpress_sku: operator,
                    cn_sub_category: 'in'
                })

                // params['sku_type'] = type

                this.aliexpressService
                    .query_all(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService
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

    private onEdit(row) {
        router.push({
            name: 'seller-edit',
            params: { seller: row }
        })
    }

    private onDelete(row) {
        // this.sellerInstanceService
        //     .seller_delete(
        //         new RequestParams(
        //             {
        //                 seller_code_list: [row.seller_code]
        //             },
        //             { loading: this.loadingService }
        //         )
        //     )
        //     .subscribe(
        //         data => {
        //             let msg: any = this.$t('delete_success')
        //             this.$message.success(msg)
        //             this.getManualList()
        //         },
        //         err => {
        //             this.$message.error(err.message)
        //         }
        //     )
    }

    private onBatchDelete(row) {}

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }

    private onTrClick(record) {
        this.record_code = record
    }

    private editValue(row) {
        this.$modal
            .open(
                AliexpressListingEdit,
                {
                    row: row,
                    saveFlag: 1
                },
                {
                    title: this.$t('action.edit')
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('save_success')
                this.$message.success(msg)
                this.getInstockList()
            })
    }

    private mergeUser() {
        this.aliexpressService
            .mergeUser(
                new RequestParams(
                    { listing_id_list: this.selectedRowKeys },
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
        this.aliexpressService
            .mergeAuto(
                new RequestParams(
                    { listing_id_list: this.selectedRowKeys },
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
        this.aliexpressService
            .cancelAuto(
                new RequestParams(
                    { listing_id_list: this.selectedRowKeys },
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
        "desc": "this is a Order Page1",
        "columns": {
            "actions": "Actions",
            "view": "View",
            "cn_category": "Category",
            "cn_sub_category": "Sub Category",
            "aliexpress_sku": "Aliexpress SKU",
            "basic_sku": "Basic SKU",
            "aliexpress_sku": "Aliexpress Sku",
            "aliexpress_stock": "Aliexpress Stock",
            "auto_state": "Auto State",
            "basic_odoo_stock": "Basic Odoo Stock",
            "basic_related_qty": "Basic Related Qty",
            "basic_sku": "Basic Sku",
            "cn_category": "CN Category",
            "cn_sub_category": "CN Sub Category",
            "compute_time": "Compute Time",
            "critical_value": "Critical Value",
            "from_value": "From Value",
            "id": "ID",
            "import_time": "Import Time",
            "last_write_back_value": "Last Write Back Value",
            "merge_user": "Merge User",
            "odoo_stock": "Odoo Stock",
            "pull_off_value": "Pull Off Value",
            "seller_name": "Seller Name",
            "sku_id": "Sku Id",
            "sku_price": "Sku Price",
            "country": "Country",
            "to_value": "To Value",
            "write_back_time": "Write Back Time",
            "write_back_value": "Write Back Value"
        },
        "action": {
            "create": "Create",
            "batch-create": "EXCEL Import",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "copy": "Copy",
            "pass": "Check",
            "onApiEdit": "Api Edit",
            "merge_user": "Merge User",
            "merge_auto": "Merge Auto",
            "cancel_auto": "Cancel Auto",
            "edit": "Edit",
            "save": "Save"
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
        "delete_success": "Delete Success"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "columns": {
            "actions": "操作",
            "view": "查看",
            "cn_category": "分类",
            "cn_sub_category": "子类",
            "aliexpress_sku": "速卖通货号",
            "basic_sku": "基础货号",
            "aliexpress_stock": "速卖通库存",
            "auto_state": "托管状态",
            "basic_odoo_stock": "基础货号库存",
            "basic_related_qty": "对应基础数量",
            "basic_sku": "基础SKU",
            "cn_category": "品类",
            "cn_sub_category": "子类",
            "compute_time": "计算库存时间",
            "critical_value": "临界值",
            "from_value": "From值",
            "id": "ID",
            "import_time": "导入时间",
            "last_write_back_value": "上次写回值",
            "merge_user": "托管用户",
            "odoo_stock": "Odoo库存",
            "pull_off_value": "下架值",
            "seller_name": "店铺",
            "sku_id": "SkuID",
            "sku_price": "产品售价",
            "country": "发货地",
            "to_value": "To值",
            "write_back_time": "写回时间",
            "write_back_value": "写回值"
        },
        "action": {
            "create": "新建",
            "batch-create": "EXCEL导入",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "copy": "复制",
            "pass": "审核",
            "onApiEdit": "api接口管理",
            "merge_user": "认领Listing",
            "merge_auto": "标记托管",
            "cancel_auto": "取消托管",
            "edit": "编辑",
            "save": "保存"
        },
        "forms": {
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
