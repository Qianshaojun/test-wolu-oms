<template>
    <page-container ref="pageContainer" @changeSearchState="showHideSearch">
        <template #header-action>
            <a-button type="primary" @click="onCreateSaleTrend"
                >{{ $t('action.create') }}
            </a-button>
        </template>
        <data-form
            ref="dataForm"
            @submit="getPreSaleList"
            :column="1"
            :showSearch="showSearch"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.presale_type')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['presale_type', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onStatusChange(e)"
                    >
                        <a-radio-button value
                            >{{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of $dict.PresaleType"
                            :key="item.value"
                            >{{ $t(item.label) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.warehouse_id')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['warehouse_id', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onStatusChange(e)"
                    >
                        <a-radio-button value
                            >{{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of $dict.WarehouseId"
                            :key="item.value"
                            >{{ $t(item.label) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.presale_object')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['presale_object']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="pre_sale"
                @on-page-change="getPreSaleList"
                style="table-layout:fixed;"
            >
                <a-table-column
                    :title="$t('columns.actions')"
                    key="action"
                    width="12%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a @click="OnEdit(row)">{{ $t('action.edit') }}</a>
                        <a
                            style="float:right;margin-right:15px;"
                            @click="OnCopy(row)"
                            >{{ $t('action.copy') }}</a
                        >
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.presale_object')"
                    data-index="presale_object"
                    key="presale_object"
                    width="7%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.presale_type')"
                    key="presale_type"
                    width="7%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{
                            row.presale_type | dict('PresaleType') | translate
                        }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.warehouse_id')"
                    data-index="warehouse_id"
                    key="warehouse_id"
                    width="7%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.is_presale')"
                    key="is_presale"
                    width="7%"
                    align="center"
                >
                    <template slot-scope="row">
                        <span v-if="row.is_presale">
                            <input type="checkbox" checked disabled />
                        </span>
                        <span v-else>
                            <input type="checkbox" disabled />
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.is_second_presale')"
                    key="is_second_presale"
                    width="7%"
                    align="center"
                >
                    <template slot-scope="row">
                        <span v-if="row.is_second_presale">
                            <input type="checkbox" checked disabled />
                        </span>
                        <span v-else>
                            <input type="checkbox" disabled />
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.presale_ratio')"
                    data-index="presale_ratio"
                    key="presale_ratio"
                    width="7%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.presale_days')"
                    data-index="presale_days"
                    key="presale_days"
                    width="7%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.purchase_cycle')"
                    data-index="purchase_cycle"
                    key="purchase_cycle"
                    width="7%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.sale_cycle')"
                    data-index="sale_cycle"
                    key="sale_cycle"
                    width="7%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.department')"
                    data-index="department"
                    key="department"
                    width="7%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.operator')"
                    data-index="operator"
                    key="operator"
                    width="7%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.z_sub_category')"
                    data-index="z_sub_category"
                    key="z_sub_category"
                    width="7%"
                    align="center"
                ></a-table-column>
            </data-table>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import router from '../../router'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { namespace } from 'vuex-class'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '@/shared/utils/common.service'
import PreSaleEdit from '~/components/product/pre-sale-edit.vue'
import { PreSaleService } from '../../services/presale.service'

@Page({
    layout: 'workspace',
    name: 'product-pre-sale'
})
@Component({
    components: {
        PreSaleEdit
    }
})
export default class ProductPreSale extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private showSearch: any = true

    private showHideSearch(flag) {
        this.showSearch = flag
    }

    // 表格数据源
    private data: any[] = []
    // 表格选择项
    private selectedRowKeys: any[] = []

    private orderBy: any = ''

    private preSaleService = new PreSaleService()

    private product: any = []

    private chartData1: any = []

    /**
     * 获取销售趋势数据
     */
    private getPreSaleList() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                let params: any = CommonService.createQueryCondition(values, {
                    cn_sub_category: 'like'
                })
                if (this.orderBy) {
                    params['order_by'] = this.orderBy
                }

                this.preSaleService
                    .queryAll(
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
                // 异常处理
            })
    }

    private onStatusChange(e) {
        this.$nextTick(function() {
            this.getPreSaleList()
        })
    }

    private onCreateSaleTrend() {
        this.$modal
            .open(
                PreSaleEdit,
                {
                    saveFlag: 0
                },
                {
                    title: '新建产品预售数据'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getPreSaleList()
            })
    }

    private OnEdit(row) {
        this.$modal
            .open(
                PreSaleEdit,
                {
                    saveFlag: 1,
                    row: row
                },
                {
                    title: '编辑产品预售数据: ' + row.presale_object
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getPreSaleList()
            })
    }

    private OnCopy(row) {
        this.$modal
            .open(
                PreSaleEdit,
                {
                    saveFlag: 0,
                    row: row
                },
                {
                    title: '新建产品预售数据: ' + row.presale_object
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getPreSaleList()
            })
    }
}
</script>
<i18n>
{
    "en-us": {
        "desc": "",
        "columns": {
            "presale_type": "presale_type",
            "warehouse_id": "warehouse_id",
            "presale_object": "presale_object",
            "is_presale": "Is Presale",
            "is_second_presale": "Is Second Presale",
            "presale_ratio": "Presale_ratio",
            "presale_days": "Presale_days",
            "purchase_cycle": "Purchase Cycle",
            "sale_cycle": "Sale Cycle"
        },
        "action": {
            "create": "Create",
            "copy": "Copy",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Ok",
            "cancel": "Cancel",
            "more": "More"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success"
    },
    "zh-cn": {
        "desc": "",
        "columns": {
            "presale_type": "预售类型",
            "warehouse_id": "仓库",
            "presale_object": "预售设置对象",
            "is_presale": "第一期预售",
            "is_second_presale": "第二期预售",
            "presale_ratio": "预售系数",
            "presale_days": "预售天数",
            "purchase_cycle": "采购周期/天",
            "sale_cycle": "销售周期/天"
        },
        "action": {
            "create": "新建",
            "copy": "复制",
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
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功"
    }
}
</i18n>
