<template>
    <page-container ref="pageContainer" :showHeader="false">
        <splitpanes
            class="default-theme"
            horizontal
            :style="{ height: splitPanelHeight + 'px' }"
            @resize="page_resize($event)"
            @resized="page_resized($event)"
        >
            <pane max-size="33">
                <template #header-action> </template>
                <data-form
                    ref="dataForm"
                    @submit="getPurchaseProductQualityRateData"
                    :column="2"
                    :style="{
                        'background-color': 'yellow',
                        height: panel1Height
                    }"
                >
                    <!--默认显示项-->
                    <template #default>
                        <a-form-item
                            :label="$t('columns.vendor_name')"
                            style="height:35px;margin:0;"
                        >
                            <a-select
                                showSearch
                                v-decorator="[
                                    'vendor_name',
                                    { initialValue: '' }
                                ]"
                                :style="{
                                    width: '100%',
                                    'max-width': '300px'
                                }"
                                size="small"
                                placeholder="Please Select"
                                mode="multiple"
                                :filterOption="filterSelectOption"
                            >
                                <a-select-option value>
                                    {{ $t('dict.all') }}
                                </a-select-option>
                                <a-select-option
                                    :value="item.code"
                                    v-for="item of vender_data"
                                    :key="item.code"
                                >
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item
                            :label="$t('columns.sku')"
                            style="height:35px;margin:0;"
                        >
                            <a-input
                                :placeholder="$t('fuzzy_search')"
                                v-decorator="['default_code']"
                                :style="{ width: '200px' }"
                                size="small"
                            ></a-input>
                        </a-form-item>
                        <a-form-item
                            :label="$t('columns.cn_category')"
                            style="height:35px;margin:0;"
                        >
                            <a-select
                                showSearch
                                v-decorator="[
                                    'z_category',
                                    { initialValue: '' }
                                ]"
                                :style="{ width: '200px' }"
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
                                >
                                    {{ cate }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item
                            :label="$t('columns.cn_sub_category')"
                            style="height:35px;margin:0;"
                        >
                            <a-select
                                showSearch
                                v-model="selectedList"
                                :style="{ width: '200px' }"
                                placeholder="Please Select"
                                v-decorator="[
                                    'z_sub_category',
                                    { initialValue: '' }
                                ]"
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
                                >
                                    {{ cate }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item
                            :label="$t('columns.query_type')"
                            style="height:35px;margin:0;"
                        >
                            <a-select
                                v-decorator="[
                                    'query_type',
                                    { initialValue: 'month' }
                                ]"
                                style="width: 110px"
                                size="small"
                                @change="e => onChangeQueryType(e)"
                            >
                                <a-select-option
                                    key="year"
                                    value="year"
                                    title="By Year/按年"
                                >
                                    By Year/按年
                                </a-select-option>
                                <a-select-option
                                    key="season"
                                    value="season"
                                    title="By Quarter/按季度"
                                >
                                    By Quarter/按季度
                                </a-select-option>
                                <a-select-option
                                    key="month"
                                    value="month"
                                    title="By Month/按月"
                                >
                                    By Month/按月
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item
                            :label="$t('columns.year')"
                            style="height:35px;margin:0;"
                        >
                            <a-select
                                v-decorator="['year', { initialValue: '2021' }]"
                                style="width: 110px"
                                size="small"
                                allowClear
                            >
                                <a-select-option key="year_2018" value="2018">
                                    2018
                                </a-select-option>
                                <a-select-option key="year_2019" value="2019">
                                    2019
                                </a-select-option>
                                <a-select-option key="year_2020" value="2020">
                                    2020
                                </a-select-option>
                                <a-select-option key="year_2021" value="2021">
                                    2021
                                </a-select-option>
                            </a-select>
                            <span style="color:red" v-if="showToYear">
                                ~
                            </span>
                            <a-select
                                v-decorator="[
                                    'to_year',
                                    { initialValue: '2021' }
                                ]"
                                style="width: 110px"
                                size="small"
                                allowClear
                                v-if="showToYear"
                            >
                                <a-select-option key="year_2018" value="2018">
                                    2018
                                </a-select-option>
                                <a-select-option key="year_2019" value="2019">
                                    2019
                                </a-select-option>
                                <a-select-option key="year_2020" value="2020">
                                    2020
                                </a-select-option>
                                <a-select-option key="year_2021" value="2021">
                                    2021
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </template>
                    <template #action>
                        <a-button type="primary" @click="exportData"
                            >Export</a-button
                        >
                    </template>
                </data-form>
            </pane>
            <pane min-size="20">
                <a-card class="margin-y">
                    <data-table
                        :stripe="true"
                        :data="tableData"
                        :page="pageService"
                        rowKey="default_code"
                        :rowSelection="{
                            selectedRowKeys: selectedRowKeys,
                            onChange: (keys, select_rows) => {
                                selectedRows = select_rows
                                selectedRowKeys = keys
                                this.showProductQualityRateCharDataChart(
                                    select_rows
                                )
                            }
                        }"
                        :columns="columnList"
                        @on-page-change="getPurchaseProductQualityRateData"
                        @onClick="
                            row => {
                                this.selectedRowKeys = [row]
                                let curRow = this.tableData.filter(
                                    item => item.default_code === row
                                )
                                this.showProductQualityRateCharDataChart(curRow)
                            }
                        "
                        @change="sorter => onTableChange(sorter)"
                        :scroll="{ x: 300, y: tableScrollHeight }"
                        style="table-layout:fixed;height:100%; overflow:auto;"
                    >
                    </data-table>
                </a-card>
            </pane>
            <pane min-size="20">
                <a-card title="趋势图" :style="{ height: panel3Height }">
                    <ve-line :data="productQualityRateCharData"></ve-line>
                </a-card>
            </pane>
        </splitpanes>
    </page-container>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { namespace } from 'vuex-class'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '@/shared/utils/common.service'
import { ProductPurchaseService } from '../../services/product.purchase.service'
import { PurchaseService } from '../../services/purchase.service'
import { VendorService } from '../../services/vendor.service'
import { ReportService } from '../../services/report.service'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'purchase-product-quality-rate'
})
@Component({
    components: { Splitpanes, Pane }
})
export default class PurchaseProductQualityRateReport extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private productPurchaseService = new ProductPurchaseService()
    private purchaseService = new PurchaseService()
    private vendorService = new VendorService()
    private vender_data: any[] = []

    private reportService = new ReportService()
    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []

    private orderBy: any = ''
    private table_width = 350
    private fixed_width = 350

    private selectedRows: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private columnList: any[] = []
    private tableData: any[] = []
    private showToYear: boolean = false

    private splitPanelHeight: any = 700
    private panel1Height: any = 100
    private panel2Height: any = 300
    private panel3Height: any = 300
    private tableScrollHeight: any = 275
    private page_resize(sizeArray: any[]) {
        this.panel1Height = Math.floor(
            (this.splitPanelHeight * Number(sizeArray[0].size)) / 100
        )
        this.panel2Height = Math.floor(
            (this.splitPanelHeight * Number(sizeArray[1].size)) / 100
        )
        this.panel3Height = Math.floor(
            (this.splitPanelHeight * Number(sizeArray[2].size)) / 100
        )
        this.tableScrollHeight = this.panel2Height - 145
    }

    private page_resized(sizeArray: object) {
        this.panel1Height = Math.floor(
            (this.splitPanelHeight * Number(sizeArray[0].size)) / 100
        )
        this.panel2Height = Math.floor(
            (this.splitPanelHeight * Number(sizeArray[1].size)) / 100
        )
        this.panel3Height = Math.floor(
            (this.splitPanelHeight * Number(sizeArray[2].size)) / 100
        )
        this.tableScrollHeight = this.panel2Height - 145
    }

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }

    private onChangeQueryType(value) {
        if (value == 'year') {
            this.showToYear = true
        } else {
            this.showToYear = false
        }
    }

    private created() {
        let h: any =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight
        this.splitPanelHeight = h - 125

        this.panel1Height = Math.floor((this.splitPanelHeight * 30) / 100)
        this.panel2Height = Math.floor((this.splitPanelHeight * 40) / 100)
        this.panel3Height = Math.floor((this.splitPanelHeight * 40) / 100)
        this.tableScrollHeight = this.panel2Height - 145

        this.vendorService
            .get_vendor_ref_list(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    data.push({ code: '未找到', name: '未找到' })
                    this.vender_data = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )

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
        this.columnList = this.getBasicColumnInfo()
    }

    private getBasicColumnInfo() {
        return [
            {
                dataIndex: 'default_code',
                key: 'default_code',
                title: this.$t('columns.sku'),
                width: 100,
                align: 'left'
            },
            {
                dataIndex: 'vendor_name',
                key: 'vendor_name',
                title: this.$t('columns.vendor_name'),
                width: 60,
                align: 'center'
            },
            {
                dataIndex: 'z_category',
                key: 'z_category',
                title: this.$t('columns.cn_category'),
                width: 80,
                align: 'left'
            },
            {
                dataIndex: 'z_sub_category',
                key: 'z_sub_category',
                title: this.$t('columns.cn_sub_category'),
                width: 110,
                align: 'left'
            }
        ]
    }

    private productQualityRateCharData: any = []
    private query_type: String = 'year'

    private showProductQualityRateCharDataChart(selectedRows) {
        let row_list: any[] = []

        for (let column_index in this.columnList) {
            let column_info = this.columnList[column_index]

            if (column_info.children) {
                for (let children_index in column_info.children) {
                    let columnName = column_info.children[children_index].key
                    if (this.isFilterColumn(columnName)) {
                        continue
                    }

                    columnName = columnName
                        .replace('_month', '')
                        .replace('_problem_qty', '')
                        .replace('_', '-')
                    let row: any = { data_date: columnName }
                    row_list.push(row)
                }
            } else {
                let columnName = this.columnList[column_index].key
                if (this.isFilterColumn(columnName)) {
                    continue
                }
                let row: any = { data_date: columnName }
                row_list.push(row)
            }
        }

        this.productQualityRateCharData = {
            columns: ['data_date'],
            rows: row_list
        }

        for (let row of selectedRows) {
            let default_code = row['default_code']

            if (
                this.productQualityRateCharData.columns.indexOf(default_code) <
                0
            ) {
                this.productQualityRateCharData.columns.push(default_code)

                let cell_index = 0
                for (let column_index in this.columnList) {
                    let column_info = this.columnList[column_index]

                    if (column_info.children) {
                        for (let children_index in column_info.children) {
                            let columnName =
                                column_info.children[children_index].key
                            if (this.isFilterColumn(columnName)) {
                                continue
                            }

                            this.productQualityRateCharData.rows[cell_index][
                                default_code
                            ] = row[columnName]

                            cell_index += 1
                        }
                    } else {
                        let columnName = this.columnList[column_index].key
                        if (this.isFilterColumn(columnName)) {
                            continue
                        }

                        this.productQualityRateCharData.rows[column_index][
                            default_code
                        ] = row[columnName]

                        cell_index += 1
                    }
                }
            }
        }
    }

    private isFilterColumn(columnName: any) {
        let fixed_column: string[] = [
            'default_code',
            'vendor_name',
            'z_category',
            'z_sub_category'
        ]

        if (columnName.indexOf('_problem_count') != -1) {
            return true
        }

        if (columnName.indexOf('_problem_qty') != -1) {
            return true
        }

        if (columnName.indexOf('_sale_sum') != -1) {
            return true
        }

        if (fixed_column.indexOf(columnName) != -1) {
            return true
        }

        return false
    }

    private getPurchaseProductQualityRateData() {
        this.columnList = this.getBasicColumnInfo()
        this.getQueryCondition().then((params: any) => {
            this.purchaseService
                .query_all_quality_pass_ratio_report(
                    new RequestParams(params, {
                        page: this.pageService,
                        loading: this.loadingService
                    })
                )
                .subscribe(
                    data => {
                        let new_data: any[] = []
                        let year_list: string[] = []

                        let new_data_dict: any = this.getMonthNewData(data)
                        new_data = new_data_dict.data
                        year_list = new_data_dict.date

                        let other_width: any = 0
                        if (this.query_type == 'month') {
                            other_width = this.getMonthOtherColumns(year_list)
                        } else if (this.query_type == 'year') {
                            other_width = this.getYearOtherColumns(year_list)
                        } else {
                            other_width = this.getSeasonOtherColumns(year_list)
                        }

                        this.table_width = other_width + this.fixed_width
                        this.tableData = new_data
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private getQueryCondition() {
        return new Promise((reslove, reject) => {
            this.dataForm
                .validateFields()
                .then((values: any) => {
                    if (
                        values['vendor_name'] == '' ||
                        values['vendor_name'].length == 0
                    ) {
                        delete values['vendor_name']
                    }

                    if (
                        values['z_category'] == '' ||
                        values['z_category'].length == 0
                    ) {
                        delete values['z_category']
                    }

                    if (
                        values['z_sub_category'] == '' ||
                        values['z_sub_category'].length == 0
                    ) {
                        delete values['z_sub_category']
                    }

                    let params: any = CommonService.createQueryCondition(
                        values,
                        {
                            year: '=',
                            vendor_name: 'in',
                            z_sub_category: 'in'
                        }
                    )

                    this.query_type = ''
                    let query_condition = params['query_condition']
                    let new_query_condition: any[] = []
                    for (let index in query_condition) {
                        if (
                            query_condition[index]['query_name'] == 'query_type'
                        ) {
                            this.query_type = query_condition[index]['value']
                            params['query_type'] = this.query_type

                            continue
                        }

                        new_query_condition.push(query_condition[index])
                    }

                    if (this.query_type == '') {
                        this.$message.info('请选择数据查询类型! ')
                        return
                    }

                    params['query_condition'] = new_query_condition

                    if (this.orderBy) {
                        params['order_by'] = this.orderBy
                    }

                    reslove(params)
                })
                .catch(err => {
                    // 异常处理
                })
        })
    }

    private getMonthNewData(data) {
        let new_data: any[] = []
        let year_list: string[] = []

        for (let index in data) {
            let item: any = data[index]

            for (let year_data_index in item.year_data) {
                let year_data_item = item.year_data[year_data_index]

                let tmpl_year = year_data_item.year

                if (year_list.includes(tmpl_year) == false) {
                    year_list.push(tmpl_year)
                }

                for (let key in year_data_item) {
                    if (key == 'year') {
                        continue
                    }

                    item[tmpl_year + '_' + key] = year_data_item[key]
                }
            }

            delete item.year_data

            new_data.push(item)
        }

        return { data: new_data, date: year_list }
    }

    private getChildrenColumns(year, current_type, currenct_value) {
        let problem_count_width = 80
        let problem_qty_width = 80
        let sale_sum_width = 80
        let pass_ratio_width = 90

        let children_info = [
            {
                dataIndex:
                    year + current_type + currenct_value + '_problem_count',
                key: year + current_type + currenct_value + '_problem_count',
                title: this.$t('columns.problem_count'),
                align: 'right',
                width: problem_count_width,
                customRender: (value, row, index) => {
                    if (!value) {
                        return 0
                    }

                    return value.toFixed(2)
                }
            },
            {
                dataIndex:
                    year + current_type + currenct_value + '_problem_qty',
                key: year + current_type + currenct_value + '_problem_qty',
                title: this.$t('columns.problem_qty'),
                align: 'right',
                width: problem_qty_width,
                customRender: (value, row, index) => {
                    if (!value) {
                        return 0
                    }

                    return value.toFixed(2)
                }
            },
            {
                dataIndex: year + current_type + currenct_value + '_sale_sum',
                key: year + current_type + currenct_value + '_sale_sum',
                title: this.$t('columns.sale_sum'),
                align: 'right',
                width: sale_sum_width,
                customRender: (value, row, index) => {
                    if (!value) {
                        return 0
                    }

                    return value.toFixed(2)
                }
            },
            {
                dataIndex: year + current_type + currenct_value + '_pass_ratio',
                key: year + current_type + currenct_value + '_pass_ratio',
                title: this.$t('columns.pass_ratio'),
                align: 'right',
                width: pass_ratio_width,
                customRender: (value, row, index) => {
                    if (!value) {
                        return 0
                    }

                    return value.toFixed(2)
                }
            }
        ]

        return children_info
    }

    private getSeasonOtherColumns(year_list) {
        let problem_count_width = 80
        let problem_qty_width = 80
        let sale_sum_width = 80
        let pass_ratio_width = 90

        let season_list: string[] = ['1', '2', '3', '4']

        for (let year_index in year_list) {
            let year = year_list[year_index]

            for (let season_index in season_list) {
                let season = season_list[season_index]

                let column_info = {
                    title: this.$t('columns.season_' + season) + '/' + year,
                    children: this.getChildrenColumns(year, '_season_', season)
                }

                this.columnList.push(column_info)
            }
        }

        return (
            (problem_count_width +
                problem_qty_width +
                sale_sum_width +
                pass_ratio_width) *
            year_list.length *
            season_list.length
        )
    }

    private getMonthOtherColumns(year_list) {
        let problem_count_width = 80
        let problem_qty_width = 80
        let sale_sum_width = 80
        let pass_ratio_width = 90

        let month_list: string[] = [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12'
        ]

        for (let year_index in year_list) {
            let year = year_list[year_index]

            for (let month_index in month_list) {
                let month = month_list[month_index]

                let column_info = {
                    title: this.$t('columns.month_' + month) + '/' + year,
                    children: this.getChildrenColumns(year, '_month_', month)
                }

                this.columnList.push(column_info)
            }
        }

        return (
            (problem_count_width +
                problem_qty_width +
                sale_sum_width +
                pass_ratio_width) *
            year_list.length *
            month_list.length
        )
    }

    private getYearOtherColumns(year_list) {
        let problem_count_width = 80
        let problem_qty_width = 80
        let sale_sum_width = 80
        let pass_ratio_width = 90

        for (let year_index in year_list) {
            let year = year_list[year_index]

            let column_info = {
                title: year,
                children: this.getChildrenColumns(year, '', '')
            }

            this.columnList.push(column_info)
        }

        return (
            (problem_count_width +
                problem_qty_width +
                sale_sum_width +
                pass_ratio_width) *
            year_list.length
        )
    }

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }

        this.getPurchaseProductQualityRateData()
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private exportData() {
        this.getQueryCondition().then((x: any) => {
            CommonService.exportData(
                '/purchase_requirement/export_quality_pass_ratio_report',
                { query_condition: x.query_condition }
            )
        })
    }
}
</script>
<i18n>
{
  "en-us": {
    "desc": "Purchase Reduce Cost",
    "columns":{
        "vendor_name":"Vendor",
        "cn_category":"CN Category",
        "cn_sub_category":"CN Sub Category",
        "sku":"SKU",
        "problem_count":"Problem Count",
        "problem_qty":"Problem QTY",
        "sale_sum":"Sales Total",
        "pass_ratio":"Pass Rate",
        "season_1":"Quarter 1",
        "season_2":"Quarter 2",
        "season_3":"Quarter 3",
        "season_4":"Quarter 4",        
        "month_1":"Jan",
        "month_2":"Feb",
        "month_3":"Mar",
        "month_4":"Apl",
        "month_5":"May",
        "month_6":"Jun",
        "month_7":"Jul",
        "month_8":"Aug",
        "month_9":"Sep",
        "month_10":"Oct",
        "month_11":"Nov",
        "month_12":"Dec",
        "query_type": "Calcuate Type",
        "year": "Time"
    },
    "action":{
      "create":"新建",
      "more":"更多操作"
    },
    "rules":{

    },
    "delete":"Are you sure delete?",
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Delete Success"
  },
  "zh-cn": {
    "desc": "采购降本",
    "columns":{
        "vendor_name":"供应商",
        "cn_category":"中文分类",
        "cn_sub_category":"中文子类",
        "sku":"SKU",
        "problem_count":"客诉次数",
        "problem_qty":"客诉产品数量",
        "sale_sum":"销售总数",
        "pass_ratio":"质量合格率",
        "season_1":"1季度",
        "season_2":"2季度",
        "season_3":"3季度",
        "season_4":"4季度",
        "month_1":"1月",
        "month_2":"2月",
        "month_3":"3月",
        "month_4":"4月",
        "month_5":"5月",
        "month_6":"6月",
        "month_7":"7月",
        "month_8":"8月",
        "month_9":"9月",
        "month_10":"10月",
        "month_11":"11月",
        "month_12":"12月",
        "query_type": "统计维度",
        "year": "时间"
    },
    "action":{
      "create":"新建",
      "more":"更多操作"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "delete":"是否确认删除?",
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "delete_success":"删除成功"

  }
}
</i18n>
