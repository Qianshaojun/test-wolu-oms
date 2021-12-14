<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form ref="dataForm" @submit="getSaleTrendList" :column="1">
            <!--默认显示项-->
            <template #default>
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
                    :label="$t('columns.presale_type')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['trend_type', { initialValue: '' }]"
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
                    :label="$t('columns.cn_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['cn_sub_category']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.year')"
                    style="height:35px;margin:0;"
                >
                    <a-date-picker
                        mode="year"
                        format="YYYY"
                        size="small"
                        :value="yearPick"
                        :open="yearPickShow"
                        :style="{ width: '240px' }"
                        @change="clearTime"
                        @panelChange="handlePanelChange"
                        @openChange="handleOpenChange"
                    />
                </a-form-item>
            </template>
            <template #action>
                <a-button type="primary" @click="onCreateSaleTrend"
                    >{{ $t('action.create') }}
                </a-button>
                <a-button type="primary" @click="import_product_sale_trend()"
                    >{{ $t('action.import_product_sale_trend') }}
                </a-button>
            </template>
        </data-form>
        <a-card class="margin-y">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="sale_trend"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: (keys, selectedRows) => {
                        selectedRowKeys = keys
                        this.changeCharts(keys, selectedRows)
                    }
                }"
                @on-page-change="getSaleTrendList"
                style="table-layout:fixed;"
            >
                <a-table-column
                    :title="$t('columns.actions')"
                    key="action"
                    width="5%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a @click="OnEdit(row)">{{ $t('action.edit') }}</a>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.cn_sub_category')"
                    data-index="cn_sub_category"
                    key="cn_sub_category"
                    width="5%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.warehouse_id')"
                    data-index="warehouse_id"
                    key="warehouse_id"
                    width="5%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.year')"
                    data-index="year"
                    key="year"
                    width="5%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.jan_value')"
                    data-index="jan_value"
                    key="jan_value"
                    width="4%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.feb_value')"
                    data-index="feb_value"
                    key="feb_value"
                    width="4%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.mar_value')"
                    data-index="mar_value"
                    key="mar_value"
                    width="4%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.apr_value')"
                    data-index="apr_value"
                    key="apr_value"
                    width="4%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.may_value')"
                    data-index="may_value"
                    key="may_value"
                    width="4%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.jun_value')"
                    data-index="jun_value"
                    key="jun_value"
                    width="4%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.jul_value')"
                    data-index="jul_value"
                    key="jul_value"
                    width="4%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.aug_value')"
                    data-index="aug_value"
                    key="aug_value"
                    width="4%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.sep_value')"
                    data-index="sep_value"
                    key="sep_value"
                    width="4%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.oct_value')"
                    data-index="oct_value"
                    key="oct_value"
                    width="4%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.nov_value')"
                    data-index="nov_value"
                    key="nov_value"
                    width="4%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.dec_value')"
                    data-index="dec_value"
                    key="dec_value"
                    width="4%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.department')"
                    data-index="department"
                    key="department"
                    width="5%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.operator')"
                    data-index="operator"
                    key="operator"
                    width="5%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.z_category')"
                    data-index="z_category"
                    key="z_category"
                    width="5%"
                    align="center"
                ></a-table-column>
            </data-table>
        </a-card>
        <a-card :title="$t('desc')">
            <ve-line :data="chartData1"></ve-line>
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
import SaleTrendEdit from '~/components/product/sale-trend-edit.vue'
import { SaleTrendService } from '../../services/saletrend.service'
import UploadExcel from '~/shared/common/upload-excel.vue'

@Page({
    layout: 'workspace',
    name: 'product-sale-trend'
})
@Component({
    components: {
        SaleTrendEdit
    }
})
export default class ProductSaleTrend extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private yearPick = null

    private yearPickShow = false

    // 表格数据源
    private data: any[] = []
    // 表格选择项
    private selectedRowKeys: any[] = []

    private orderBy: any = ''

    private handleOpenChange(status) {
        this.yearPickShow = status
    }

    // 得到年份选择器的值
    private handlePanelChange(value) {
        this.yearPick = value.format('YYYY')
        this.yearPickShow = false
    }

    // 清除时间
    private clearTime() {
        this.yearPick = null
    }

    private saletrendService = new SaleTrendService()

    private product: any = []

    private chartData1: any = []

    /**
     * 获取销售趋势数据
     */
    private getSaleTrendList() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                values['year'] = this.yearPick
                let params: any = CommonService.createQueryCondition(values, {
                    cn_sub_category: 'like'
                })
                if (this.orderBy) {
                    params['order_by'] = this.orderBy
                }

                this.saletrendService
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
            this.getSaleTrendList()
        })
    }

    private onCreateSaleTrend() {
        this.$modal
            .open(
                SaleTrendEdit,
                {
                    saveFlag: 0
                },
                {
                    title: '新建销售趋势数据'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getSaleTrendList()
            })
    }

    private OnEdit(row) {
        this.$modal
            .open(
                SaleTrendEdit,
                {
                    saveFlag: 1,
                    row: row
                },
                {
                    title: '编辑销售趋势数据: ' + row.cn_sub_category
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getSaleTrendList()
            })
    }

    private changeCharts(selectedRowKeys, selectedRows) {
        this.chartData1 = {
            columns: ['日期'],
            rows: [
                { 日期: '一月' },
                { 日期: '二月' },
                { 日期: '三月' },
                { 日期: '四月' },
                { 日期: '五月' },
                { 日期: '六月' },
                { 日期: '七月' },
                { 日期: '八月' },
                { 日期: '九月' },
                { 日期: '十月' },
                { 日期: '十一月' },
                { 日期: '十二月' }
            ]
        }

        for (let sr of selectedRows) {
            let new_name =
                sr['cn_sub_category'] +
                '-' +
                sr['year'] +
                '-' +
                sr['warehouse_id']
            if (this.chartData1.columns.indexOf(new_name) < 0) {
                this.chartData1.columns.push(new_name)
                this.chartData1.rows[0][new_name] = sr['jan_value']
                this.chartData1.rows[1][new_name] = sr['feb_value']
                this.chartData1.rows[2][new_name] = sr['mar_value']
                this.chartData1.rows[3][new_name] = sr['apr_value']
                this.chartData1.rows[4][new_name] = sr['may_value']
                this.chartData1.rows[5][new_name] = sr['jun_value']
                this.chartData1.rows[6][new_name] = sr['jul_value']
                this.chartData1.rows[7][new_name] = sr['aug_value']
                this.chartData1.rows[8][new_name] = sr['sep_value']
                this.chartData1.rows[9][new_name] = sr['oct_value']
                this.chartData1.rows[10][new_name] = sr['nov_value']
                this.chartData1.rows[11][new_name] = sr['dec_value']
            }
        }
        this.selectedRowKeys = selectedRowKeys
    }

    private import_product_sale_trend() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        '/product_pre_sale/upload_cn_sub_category_sale_trend',
                    attachmentUrlPath:
                        '/attachment/download_import_template?type=categorySaleTrendImport'
                },
                {
                    title: 'Excel导入'
                }
            )
            .subscribe(
                () => {},
                err => {
                    this.$message.error(err)
                }
            )
    }
}
</script>
<i18n>
{
    "en-us": {
        "desc": "Sale Trend",
        "columns": {
            "warehouse_id": "warehouse_id",
            "year": "Year",
            "jan_value": "January",
            "feb_value": "February",
            "mar_value": "March",
            "apr_value": "April",
            "may_value": "May",
            "jun_value": "June",
            "jul_value": "July",
            "aug_value": "August",
            "sep_value": "September",
            "oct_value": "October",
            "nov_value": "November",
            "dec_value": "December",
            "cn_sub_category": "cn_sub_category",
            "presale_type": "Trend Type"
        },
        "action": {
            "create": "Create",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Ok",
            "cancel": "Cancel",
            "import_product_sale_trend": "Import",
            "more": "More"
        },
        "rules": {
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success"
    },
    "zh-cn": {
        "desc": "销售趋势",
        "columns": {
            "warehouse_id": "仓库",
            "year": "年份",
            "jan_value": "一月",
            "feb_value": "二月",
            "mar_value": "三月",
            "apr_value": "四月",
            "may_value": "五月",
            "jun_value": "六月",
            "jul_value": "七月",
            "aug_value": "八月",
            "sep_value": "九月",
            "oct_value": "十月",
            "nov_value": "十一月",
            "dec_value": "十二月",
            "cn_sub_category": "中文子类",
            "presale_type": "趋势类型"
        },
        "action": {
            "create": "新建",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "import_product_sale_trend": "导入",
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
