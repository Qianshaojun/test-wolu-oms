<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form
            ref="dataForm"
            @submit="getDataList"
            :column="2"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 19, offset: 0 }"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        v-decorator="['sku']"
                        :style="{ width: '200px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    ></a-input>
                    <a-select
                        v-decorator="['operate', { initialValue: '=' }]"
                        :style="{ width: '100px', 'margin-left': '5px' }"
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
                    :label="$t('forms.operator')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['operator']"
                        :placeholder="$t('plzInput')"
                        :style="{ width: '200px' }"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('forms.z_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['z_category']"
                        style="width: 110px"
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
                        style="width: 190px;;margin-left: 5px"
                        placeholder="子类"
                        size="small"
                    >
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.is_dynamic_calculation')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'is_dynamic_calculation',
                            { initialValue: '' }
                        ]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true">
                            {{ $t('forms.open') }}
                        </a-radio-button>
                        <a-radio-button :value="false">
                            {{ $t('forms.close') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.write_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        v-decorator="['write_date']"
                        show-time
                        :style="{ width: '300px' }"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                    <a-button
                        @click="fill1day"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('forms.1day') }}
                    </a-button>
                    <a-button
                        @click="fill2day"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('forms.2day') }}
                    </a-button>
                    <a-button
                        @click="fill7day"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('forms.7day') }}
                    </a-button>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.instance')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['instance', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Please select"
                    >
                        <a-select-option value="">
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of $dict.FinalShipSite"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ $t(item.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="manageFinalShip()"
                    :disabled="!selectedRowKeys.length"
                >
                    {{ $t('action.manage_final_ship') }}
                </a-button>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="updateCalcResult()"
                    :disabled="!selectedRowKeys.length"
                >
                    {{ $t('action.update_calc_result') }}
                </a-button>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="onBatchUpdateShipRatio()"
                >
                    {{ $t('action.batch_update_ship_ratio') }}
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
                    rowKey="price_id"
                    :columns="columnList"
                    :rowSelection="{
                        selectedRowKeys: selectedRowKeys,
                        onChange: keys => (selectedRowKeys = keys)
                    }"
                    @on-page-change="getDataList"
                    @onClick="
                        record => {
                            selectedRowKeys = [record]
                            onTrClick(record)
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 1560, y: 500 }"
                    :queryUrl="queryUrl"
                    :menu_code="menu_code"
                    :queryCondition="queryConsition"
                    :selectedRowCnt="selectedRowKeys.length"
                >
                    <template slot="sku" slot-scope="text, row">
                        <a @click="onSkuClick(row)">{{ text }}</a>
                    </template>
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <span slot="user_render" slot-scope="text"
                        >{{ text | dict2(systemUsers) }}
                    </span>
                    <span slot="check_render" slot-scope="text"
                        ><a-checkbox disabled :checked="text" />
                    </span>
                    <template slot="theoretical_freight" slot-scope="text, row">
                        {{ getFreight(row) }}{{ text }}
                    </template>
                    <!-- <template slot="operation" slot-scope="row">
                        <a-dropdown>
                            <a-menu slot="overlay">
                                <a-menu-item @click="onEdit(row)">
                                    {{ $t('action.edit') }}
                                </a-menu-item>
                                <a-popconfirm
                                    :title="$t('action.delete_confirm')"
                                    :okText="$t('action.delete')"
                                    :cancelText="$t('action.cancel')"
                                    placement="left"
                                    @confirm="onDelete(row)"
                                >
                                    <a-menu-item
                                        style="cursor:pointer;margin-left:12px;"
                                        class="btnDel"
                                        >{{ $t('action.delete') }}</a-menu-item
                                    >
                                </a-popconfirm>
                            </a-menu>
                            <a-button>
                                {{ $t('action.more') }}
                                <a-icon type="down" />
                            </a-button>
                        </a-dropdown>
                    </template> -->
                </AutoColumnTable>
            </div>
            <GroupbyTable
                v-else
                ref="groupbyTable"
                :groupByColumn="groupbyList"
                :oColumns="columnList"
                :queryNameAuth="allNameAuth"
                :urlStr="queryUrl"
                @selectChange="onSelectChange"
                :scrollX="1560"
                :scrollY="500"
                @rowClick="onTrClick"
            >
                <template slot="sku" slot-scope="text, row">
                    <a @click="onSkuClick(row)">{{ text }}</a>
                </template>
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
                <span slot="user_render" slot-scope="text"
                    >{{ text | dict2(systemUsers) }}
                </span>
                <span slot="check_render" slot-scope="text"
                    ><a-checkbox disabled :checked="text" />
                </span>
                <template slot="operation" slot-scope="row">
                    <a-dropdown>
                        <a-menu slot="overlay">
                            <a-menu-item @click="onEdit(row)">
                                {{ $t('action.edit') }}
                            </a-menu-item>
                            <a-popconfirm
                                :title="$t('action.delete_confirm')"
                                :okText="$t('action.delete')"
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
            </GroupbyTable>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
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
import { ReportService } from '../../services/report.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import ProductCateEdit from '@/components/product/product-cate-edit.vue'
import moment from 'moment'
import UploadExcel from '@/shared/common/upload-excel.vue'
import FinalShipManage from '@/components/shipment/final-ship-manage.vue'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'final-shipping-de'
})
@Component({
    components: {
        GroupbyTable,
        AutoColumnTable
    }
})
export default class FinalShippingDE extends Vue {
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

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    // 表格数据源
    private data: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private groupbyList: any = []

    private allNameAuth: any = []

    private columnList: any = []

    private queryUrl: any = 'theoretical_final_freight/query_all'

    private queryConsition: any = []

    private orderBy: any = ''

    private menu_code: any = ''

    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @pageParamsModule.Mutation('changeReplenish')
    private changeReplenish

    @pageParamsModule.Mutation('addCommonPageInfo')
    private addCommonPageInfo

    private get rules() {
        return {}
    }

    public created() {
        this.getCn_cate()
        this.getSystemuser()
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
        this.menu_code = this.dataForm.menu_code
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

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    /**
     * 获取订单数据
     */
    private getDataList() {
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
                this.innerAction.setActionAPI(
                    this.queryUrl,
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
                            this.data = data.map(x => x)
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
        })
    }

    private onStatusChange(e) {
        this.$nextTick(function() {
            this.getDataList()
        })
    }

    private getQueryCondition() {
        return new Promise((reslove, reject) => {
            this.dataForm
                .validateFields()
                .then((values: any) => {
                    values['warehouse'] = 'de'
                    if (this.selectedList.length > 0) {
                        values['z_sub_category'] = this.selectedList
                    }
                    let opert = values['operate']
                    delete values['operate']

                    if (opert == 'in' && values['sku']) {
                        values['sku'] = values['sku'].split(',')
                    }
                    let params: any = CommonService.createQueryCondition(
                        values,
                        {
                            sku: opert,
                            operator: 'like',
                            z_category: 'like',
                            z_sub_category: 'in',
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
                    reslove(nowConditions)
                })
                .catch(err => {
                    this.$message.error(JSON.stringify(err))
                })
        })
    }

    private onTrClick(record) {
        let info = this.data.find(x => x.id == record)
        // if (info) {
        //     this.onDetail(info)
        // } else if (this.groupbyList.length) {
        //     this.onDetail({ id: record })
        // }
    }

    private onSkuClick(row) {
        let index = 'deFinalShip' + row.sku
        let params: any = {
            index: index,
            id: row.sku,
            info: [row],
            component: 'deFinalShip'
        }
        this.addCommonPageInfo(params)

        let baseName = this.$t('page_name')

        this.$router.push({
            name: 'common-page',
            path: `/common-page/${index}`,
            params: {
                id: index,
                name: row.sku + '-' + baseName
            }
        })
    }

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getDataList()
    }

    private onCreate() {
        this.$modal
            .open(
                ProductCateEdit,
                {
                    saveFlag: 0,
                    row: {}
                },
                {
                    title: this.$t('action.create'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('save_success')
                this.$message.success(msg)
                this.getDataList()
            })
    }

    private onEdit(row) {
        this.$modal
            .open(
                ProductCateEdit,
                {
                    saveFlag: 1,
                    row: row
                },
                {
                    title: this.$t('action.edit'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('save_success')
                this.$message.success(msg)
                this.getDataList()
            })
    }

    private onBatchDelete() {
        this.innerAction.setActionAPI(
            'category/delete_product_category',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { ids: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('删除成功!')
                    this.data = this.data.filter(
                        x => !this.selectedRowKeys.includes(x.id)
                    )
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDelete(row) {
        this.innerAction.setActionAPI(
            'category/delete_product_category',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { ids: [row.id] },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('删除成功!')
                    this.data = this.data.filter(x => x.id != row.id)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }

    private moment = moment

    private initialDate: any = []

    private fill1day() {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime())),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()

        this.initialDate = [startDate, endDate]
        values['write_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fill2day() {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['write_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fill7day() {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 168 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['write_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private formatDate(time) {
        // 空数据处理
        if (time === null || time === undefined || time === '') {
            return ''
        }

        let y = time.getFullYear()
        let m = time.getMonth() + 1
        let d = time.getDate()
        let h = time.getHours()
        let mi = time.getMinutes()
        let s = time.getSeconds()
        m = m < 10 ? `0${m}` : m
        d = d < 10 ? `0${d}` : d
        h = h < 10 ? `0${h}` : h
        mi = mi < 10 ? `0${mi}` : mi
        s = s < 10 ? `0${s}` : s
        return `${y}-${m}-${d} 23:59`
    }

    private manageFinalShip() {
        if (this.selectedRowKeys.length > 1) {
            this.$message.error('只能选择一行数据')
            return
        }
        let id = this.selectedRowKeys[0]
        let row = this.data.find(x => x.price_id == id)
        this.onSkuClick(row)
    }

    private onBatchUpdateShipRatio() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        '/system_api/upload?inner_action=theoretical_final_freight/import_theoretical_final_freight&menu_code=' +
                        CommonService.getMenuCode(),
                    uploadParams: { type: 'de' }
                },
                {
                    title: this.$t('action.batch_update_ship_ratio')
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

    private getFreight(row) {
        let instance = row.instance.toLowerCase()

        for (let i in row) {
            if (i.indexOf(instance + '_') == 0) {
                let key =
                    i.substring(instance.length + 1) + '_theoretical_freight'

                row[key] = row[i]
            }
        }
    }

    private updateCalcResult() {
        this.innerAction.setActionAPI(
            'theoretical_final_freight/update_calculation_result',
            CommonService.getMenuCode('')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { id_list: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('修改成功')
                    this.getDataList()
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
        "plzInput": "Please Input",
        "desc": "this is a Order Page1",
        "columns": {
        },
        "forms": {
            "operator": "Operator",
            "1day": "1 Day",
            "2day": "2 Day",
            "7day": "7 Day",
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search",
            "operator_list": "Multi Search",
            "z_category": "Cn Category",
            "is_dynamic_calculation": "Dynamic Calc",
            "open": "Use",
            "close": "Close",
            "write_date": "Update Date",
            "instance": "Site"
        },
        "action": {
            "create": "Create",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "delete_confirm": "Confirm to Delete?",
            "manage_final_ship": "Manage Final Ship",
            "update_calc_result": "Update Calc Result",
            "batch_update_ship_ratio": "Batch Update Ship Ratio(DE)"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "cancel": "Are you sure cancel?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "page_name": "DE_Theoretical_Freight"
    },
    "zh-cn": {
        "plzInput": "请输入",
        "desc": "这是订单页面1",
        "columns": {
        },
        "forms": {
            "operator": "运营",
            "1day": "1天",
            "2day": "2天",
            "7day": "7天",
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量查询",
            "z_category": "中文子类",
            "is_dynamic_calculation": "动态计算",
            "open": "开启",
            "close": "关闭",
            "write_date": "更新时间",
            "instance": "站点"
        },
        "action": {
            "create": "新建",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "delete_confirm": "确定要删除吗?",
            "manage_final_ship": "尾程运费管理",
            "update_calc_result": "更新计算结果",
            "batch_update_ship_ratio": "物流比例批量更新(德仓)"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "page_name": "德仓_尾程运费"
    }
}
</i18n>
