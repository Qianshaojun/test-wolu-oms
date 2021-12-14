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
        <data-form ref="dataForm" @submit="getSellerList" :column="1">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.year')"
                    style="height:35px;margin:0;"
                >
                    <a-input-number
                        v-decorator="['year']"
                        :style="{ width: '150px' }"
                        size="small"
                        :placeholder="$t('plzInput')"
                        :min="0"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.month')"
                    style="height:35px;margin:0;"
                >
                    <a-input-number
                        v-decorator="['month']"
                        :style="{ width: '150px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                        :min="0"
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
            </template>
            <!--操作行为项-->
            <template #action>
                <a-button type="primary" @click="onCreate"
                    >{{ $t('action.create') }}
                </a-button>
                <a-popconfirm
                    :title="$t('delete')"
                    :okText="$t('action.ok')"
                    :cancelText="$t('action.cancel')"
                    placement="left"
                    @confirm="onBatchDelete()"
                    :disabled="!selectedRowKeys.length"
                >
                    <a-button type="primary" :disabled="!selectedRowKeys.length"
                        >{{ $t('action.delete') }}
                    </a-button>
                </a-popconfirm>
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
                :scroll="{ x: 600, y: 480 }"
            >
                <a-table-column
                    :title="$t('columns.year')"
                    key="year"
                    width="20%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.year }}</template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.month')"
                    key="month"
                    width="20%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.month }}</template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.warehouse')"
                    key="warehouse"
                    width="20%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.warehouse | dict2(warehouseList) }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.shipment_price')"
                    key="shipment_price"
                    width="20%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.shipment_price }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.actions')"
                    key="action"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-dropdown>
                            <a-menu slot="overlay">
                                <a-menu-item @click="onEdit(row)"
                                    >{{ $t('action.edit') }}
                                </a-menu-item>
                                <a-popconfirm
                                    :title="$t('delete')"
                                    :okText="$t('action.ok')"
                                    :cancelText="$t('action.cancel')"
                                    placement="left"
                                    @confirm="onDelete(row)"
                                >
                                    <a-menu-item
                                        style="cursor:pointer;margin-left:12px;"
                                        class="btnDel"
                                        >{{ $t('action.delete') }}
                                    </a-menu-item>
                                </a-popconfirm>
                            </a-menu>
                            <a-button>
                                {{ $t('action.more') }}
                                <a-icon type="down" />
                            </a-button>
                        </a-dropdown>
                    </template>
                </a-table-column>
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
import { PurchaseService } from '../../services/purchase.service'

const userModule = namespace('userModule')
const allUsersModule = namespace('allUsersModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'ocean-shipping-fee'
})
@Component({
    components: {
        AddOceanShippingFee
    }
})
export default class OceanShippingFee extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private purchaseService = new PurchaseService()
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
                this.getSellerList()
            })
    }

    public created() {}

    /**
     * 获取订单数据
     */
    private getSellerList() {
        this.dataForm.validateFields().then((values: any) => {
            this.purchaseService
                .query_all_boat_shipping_fee(
                    new RequestParams(
                        CommonService.createQueryCondition(values, {
                            warehouse: 'like',
                            ...formConfig.condition
                        }),
                        {
                            page: this.pageService,
                            loading: this.loadingService
                        }
                    )
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
                this.getSellerList()
            })
    }

    private onDelete(row) {
        this.purchaseService
            .delete_boat_shipping_fee(
                new RequestParams(
                    {
                        fee_id_list: [row.id]
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('delete_success')
                    this.$message.success(msg)
                    this.getSellerList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onBatchDelete() {
        this.purchaseService
            .delete_boat_shipping_fee(
                new RequestParams(
                    {
                        fee_id_list: this.selectedRowKeys
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('delete_success')
                    this.$message.success(msg)
                    this.getSellerList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onStatusChange(e) {
        this.$nextTick(function() {
            this.getSellerList()
        })
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "year": "Year",
            "month": "Month",
            "warehouse": "Warehouse",
            "shipment_price": "Shipment Price"
        },
        "action": {
            "create": "Create",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More"
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
            "year": "年份",
            "month": "月份",
            "warehouse": "仓库",
            "shipment_price": "海运费"
        },
        "action": {
            "create": "新建",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作"
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
