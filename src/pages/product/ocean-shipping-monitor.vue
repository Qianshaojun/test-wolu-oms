<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action>
            <!-- <a-button type="primary" @click="onCreate">{{
                $t('action.create')
            }}</a-button> -->
            <!-- <a-button type="primary" @click="onBatchUpload">{{
                $t('action.batch-create')
            }}</a-button>-->
        </template>
        <data-form ref="dataForm" @submit="getSellerList" :column="2">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.package_number')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['package_number']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('fuzzy_search')"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.cn_sub_category')"
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
                        style="width: 28%;margin-left:5px"
                        placeholder="子类"
                        size="small"
                    >
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        v-decorator="['sku']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('split_query_condition')"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.warehouse')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['warehouse', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onStatusChange(e)"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.code"
                            v-for="item of warehouseList"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.ship_status')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        show-search
                        v-decorator="['ship_status']"
                        :style="{ width: '200px' }"
                        :placeholder="$t('plzSelect')"
                        size="small"
                    >
                        <a-select-option value="">
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.value"
                            v-for="item of $dict.OceanShipStatus"
                            :key="item.value"
                            >{{ $t(item.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.ship_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['ship_date']"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.land_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['land_date']"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <!-- <a-popconfirm
                    :title="$t('delete')"
                    :okText="$t('action.ok')"
                    :cancelText="$t('action.cancel')"
                    placement="left"
                    @confirm="onBatchDelete()"
                    :disabled="!selectedRowKeys.length"
                > -->
                <a-button
                    type="primary"
                    @click="updatePrice"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.update_price') }}
                </a-button>
                <!-- </a-popconfirm> -->
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
                @on-page-change="getSellerList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                style="table-layout:fixed;"
                :scroll="{ x: 2000, y: 470 }"
            >
                <a-table-column
                    :title="$t('columns.package_number')"
                    key="package_number"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.package_number }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.ship_date')"
                    key="ship_date"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.ship_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column title="SKU" key="sku" width="8%" align="center">
                    <template slot-scope="row">{{ row.sku }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.cn_category')"
                    key="cn_category"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.cn_category }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.cn_sub_category')"
                    key="cn_sub_category"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.cn_sub_category }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.product_qty')"
                    key="product_qty"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.product_qty }}</template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.warehouse')"
                    key="warehouse"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.warehouse | dict2(warehouseList) }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.ship_status')"
                    key="ship_status"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{
                            row.ship_status
                                | dict('OceanShipStatus')
                                | translate
                        }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.land_date')"
                    key="land_date"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.land_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.land_time_stock')"
                    key="land_time_stock"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.land_time_stock }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.warning_date')"
                    key="warning_date"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.warning_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.warning_sale_qty')"
                    key="warning_sale_qty"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.warning_sale_qty }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.lowest_float_price')"
                    key="lowest_float_price"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.lowest_float_price }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.fr_mano_lowest_float_price')"
                    key="fr_mano_lowest_float_price"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.fr_mano_lowest_float_price }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.ae_lowest_float_price')"
                    key="ae_lowest_float_price"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.ae_lowest_float_price }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.ws_lowest_float_price')"
                    key="ws_lowest_float_price"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.ws_lowest_float_price }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.we_lowest_float_price')"
                    key="we_lowest_float_price"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.we_lowest_float_price }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.float_price')"
                    key="float_price"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.float_price }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.send_email_time')"
                    key="send_email_time"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.send_email_time | datetolocal }}
                    </template>
                </a-table-column>
                <!-- <a-table-column
                    :title="$t('columns.actions')"
                    key="action"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-dropdown>
                            <a-menu slot="overlay">
                                <a-menu-item @click="onEdit(row)">{{
                                    $t('action.edit')
                                }}</a-menu-item>
                                <a-popconfirm
                                    :title="$t('cancel')"
                                    :okText="$t('action.ok')"
                                    :cancelText="$t('action.cancel')"
                                    placement="left"
                                    @confirm="onDelete(row)"
                                >
                                    <a-menu-item
                                        style="cursor:pointer;margin-left:12px;"
                                        class="btnDel"
                                        >{{ $t('action.cancel') }}</a-menu-item
                                    >
                                </a-popconfirm>
                            </a-menu>
                            <a-button>
                                {{ $t('action.more') }}
                                <a-icon type="down" />
                            </a-button>
                        </a-dropdown>
                    </template>
                </a-table-column> -->
            </data-table>
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
import { Component, Vue, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import AddOceanShippingFee from '~/components/product/add-ocean-shipping-fee.vue'
import router from '../../router'
import { ReportService } from '../../services/report.service'
import { PurchaseService } from '../../services/purchase.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

const userModule = namespace('userModule')
const allUsersModule = namespace('allUsersModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'ocean-shipping-monitor'
})
@Component({
    components: {
        AddOceanShippingFee
    }
})
export default class OceanShippingMonitor extends Vue {
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

    private purchaseService = new PurchaseService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()
    // 表格数据源
    private data: any[] = []

    private warehouseList: any = [
        {
            code: 'de',
            name: 'DE'
        },
        {
            code: 'uk',
            name: 'UK'
        }
    ]

    private shipStatusList: any = []

    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private current = null

    private get rules() {
        return {}
    }

    private onCreate() {
        this.$modal
            .open(
                AddOceanShippingFee,
                {
                    warehouseList: this.warehouseList,
                    saveFlag: 0
                },
                {
                    title: this.$t('action.create')
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
            })
    }

    public created() {
        this.getCn_cate()
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

    /**
     * 获取订单数据
     */
    private getSellerList() {
        this.dataForm.validateFields().then((values: any) => {
            if (this.selectedList.length > 0) {
                values['cn_sub_category'] = this.selectedList
            }

            let params: any = CommonService.createQueryCondition(values, {
                package_number: 'like',
                sku: 'in_or_like',
                cn_sub_category: 'in',
                ...formConfig.condition
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
            params.query_condition = nowConditions

            this.purchaseService
                .query_all_boat_shipping_fee_monitor(
                    new RequestParams(params, {
                        page: this.pageService,
                        loading: this.loadingService
                    })
                )
                .subscribe(
                    data => {
                        this.data = data
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private onEdit(row) {
        this.$modal
            .open(
                AddOceanShippingFee,
                {
                    info: row,
                    warehouseList: this.warehouseList,
                    saveFlag: 1
                },
                {
                    title: this.$t('action.edit')
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
            })
    }

    private onBatchDelete(row) {}

    private onStatusChange(e) {
        this.$nextTick(function() {
            this.getSellerList()
        })
    }

    private updatePrice() {
        let list = this.data
            .filter(
                x => this.selectedRowKeys.includes(x.id) && x.send_email_time
            )
            .map(y => y.id)
        if (!list.length) {
            this.$message.error('请选择已发送邮件的数据')
            return
        }
        this.innerAction.setActionAPI(
            'purchase_management/update_boat_shipping_fee_monitor',
            CommonService.getMenuCode('ocean-shipping-monitor')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { monitor_id_list: list },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('Update Success')
                    this.getSellerList()
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
            "package_number": "Package Number",
            "ship_date": "Ship Date",
            "land_date": "Land Date",
            "ship_status": "Ship Status",
            "warehouse": "Warehouse",
            "cn_sub_category": "Sub Category",
            "cn_category": "Cn Category",
            "product_qty": "Product Qty",
            "land_time_stock": "Land Time Stock",
            "warning_date": "Warning Date",
            "warning_sale_qty": "Warning Sale Qty",
            "lowest_float_price": "Lowest Float Price",
            "float_price": "Float Price",
            "send_email_time": "Send Email Time",
            "fr_mano_lowest_float_price": "FR-mano lowest float price",
            "ae_lowest_float_price": "AE lowest float price",
            "ws_lowest_float_price": "Wish Standard lowest float price",
            "we_lowest_float_price": "Wish Express lowest float price"
        },
        "action": {
            "create": "Create",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "update_price": "Update Price"
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
            "package_number": "货柜号",
            "ship_date": "发船日期",
            "land_date": "入库日期",
            "ship_status": "货运状态",
            "warehouse": "仓库",
            "cn_sub_category": "中文子类",
            "cn_category": "品类",
            "product_qty": "产品数量",
            "land_time_stock": "T-1库存",
            "warning_date": "预警时间",
            "warning_sale_qty": "预警时销量",
            "lowest_float_price": "最低浮动",
            "float_price": "已设浮动值",
            "send_email_time": "邮件发送时间",
            "fr_mano_lowest_float_price": "法国 Mano 最低浮动价",
            "ae_lowest_float_price": "速卖通最低浮动价",
            "ws_lowest_float_price": "Wish Standard最低浮动价",
            "we_lowest_float_price": "Wish Express最低浮动价"
        },
        "action": {
            "create": "新建",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "update_price": "变更最低价"
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
