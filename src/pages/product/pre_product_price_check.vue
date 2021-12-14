<template>
    <page-container ref="pageContainer" :showHeader="false">
        <!-- <template #header-action> -->
        <!-- <a-button type="primary" @click="onCreate">{{
                $t('action.create')
            }}</a-button> -->
        <!-- </template> -->
        <data-form
            ref="dataForm"
            @submit="getDataList"
            :column="2"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 15, offset: 0 }"
            :actions="true"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        v-decorator="['sku']"
                        :placeholder="$t('plzInput')"
                        :style="{ width: '200px', 'margin-right': '5px' }"
                        size="small"
                    ></a-input>
                    <a-select
                        v-decorator="['operate', { initialValue: '=' }]"
                        :style="{ width: '100px' }"
                        size="small"
                    >
                        <a-select-option value="ilike">
                            {{ $t('forms.operator_like') }}
                        </a-select-option>
                        <a-select-option value="=">
                            {{ $t('forms.operator_equal') }}
                        </a-select-option>
                        <a-select-option value="in_or_like">
                            {{ $t('forms.operator_list') }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.login')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['operator']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of systemUsers"
                            :key="item.code"
                            :value="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.approve_user')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['approve_user']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of systemUsers"
                            :key="item.code"
                            :value="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.approve_state')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['approve_state', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            v-for="item of $dict.PreProdPriceApproveState"
                            :value="item.value"
                            :key="item.value"
                        >
                            {{ $t(item.label) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.de_prod_status')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['de_sale_status']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of $dict.PriceCheckProdStatus"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ $t(item.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.active')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['active', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true">
                            未归档
                        </a-radio-button>
                        <a-radio-button :value="false">
                            已归档
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.uk_prod_status')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['uk_sale_status']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of $dict.PriceCheckProdStatus"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ $t(item.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.pre_check_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['pre_check_date']"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                    <a-button
                        @click="fillToday"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.today') }}
                    </a-button>

                    <a-button
                        @click="fill3days"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.3days') }}
                    </a-button>
                    <a-button
                        @click="fill7days"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.7days') }}
                    </a-button>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="onApprove()"
                    :disabled="!selectedRowKeys.length"
                >
                    {{ $t('action.approve') }}
                </a-button>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="onExport()"
                    :disabled="!selectedRowKeys.length"
                >
                    {{ $t('action.export') }}
                </a-button>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="onImport()"
                >
                    {{ $t('action.import') }}
                </a-button>
                <!-- <a-popconfirm
                    :title="$t('action.delete_confirm')"
                    :okText="$t('action.delete')"
                    :cancelText="$t('action.cancel')"
                    placement="right"
                    @confirm="onBatchDelete()"
                    :disabled="!selectedRowKeys.length"
                >
                    <a-button
                        type="primary"
                        :disabled="!selectedRowKeys.length"
                        >{{ $t('action.delete') }}</a-button
                    >
                </a-popconfirm> -->
            </template>
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important;">
            <div v-if="!groupbyList.length">
                <AutoColumnTable
                    :stripe="true"
                    :data="data"
                    :page="pageService"
                    :queryNameAuth="allNameAuth"
                    rowKey="index"
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
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <span slot="sku_render" slot-scope="text, row"
                        ><a @click="onApproveOne(row.index)">{{ text }}</a>
                    </span>
                    <template slot="user_render" slot-scope="text">
                        <span v-if="typeof text == 'number'">
                            {{ text | dict2(systemUsers) }}
                        </span>
                        <span v-else-if="typeof text == 'object'">
                            <span v-for="item of text" :key="item">
                                {{ item | dict2(systemUsers) }}<br />
                            </span>
                        </span>
                        <span v-else>
                            {{ text }}
                        </span>
                    </template>
                    <template slot="approve_state" slot-scope="text">
                        {{
                            text | dict('PreProdPriceApproveState') | translate
                        }}
                    </template>
                    <template slot="sale_status" slot-scope="text">
                        {{ text | dict('PriceCheckProdStatus') | translate }}
                    </template>
                    <template slot="active" slot-scope="text">
                        <span v-if="text">未归档</span>
                        <span v-else>已归档</span>
                    </template>
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
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
                <span slot="sku_render" slot-scope="text, row"
                    ><a @click="onApproveOne(row.index)">{{ text }}</a>
                </span>
                <template slot="user_render" slot-scope="text">
                    <span v-if="typeof text == 'number'">
                        {{ text | dict2(systemUsers) }}
                    </span>
                    <span v-else-if="typeof text == 'object'">
                        <span v-for="item of text" :key="item">
                            {{ item | dict2(systemUsers) }}<br />
                        </span>
                    </span>
                    <span v-else>
                        {{ text }}
                    </span>
                </template>
                <template slot="approve_state" slot-scope="text">
                    {{ text | dict('PreProdPriceApproveState') | translate }}
                </template>
                <template slot="active" slot-scope="text">
                    <span v-if="text">未归档</span>
                    <span v-else>已归档</span>
                </template>
                <template slot="sale_status" slot-scope="text">
                    {{ text | dict('PriceCheckProdStatus') | translate }}
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
import PreProductPriceDetail from '../../components/product/pre-product-price-detail.vue'
import UUID from 'uuidjs'
import appConfig from '@/config/app.config'
import UploadExcel from '@/shared/common/upload-excel.vue'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'pre_product_price_check'
})
@Component({
    components: {
        GroupbyTable,
        AutoColumnTable,
        PreProductPriceDetail
    }
})
export default class PreProductPriceCheck extends Vue {
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

    private current = null

    private groupbyList: any = []

    private allNameAuth: any = []

    private columnList: any = []

    private queryUrl: any =
        'product_management/query_all_pre_product_price_check'

    private queryConsition: any = []

    private orderBy: any = ''

    private menu_code: any = ''

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

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
        this.menu_code = this.dataForm.menu_code
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
                            this.data = data.map(x => {
                                x['index'] = UUID.generate()
                                return x
                            })
                            this.selectedRowKeys = []
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
                    let operate = values['operate']
                    delete values['operate']

                    if (operate == 'in' && values['sku']) {
                        values['sku'] = values['sku'].split(',')
                    }
                    let params: any = CommonService.createQueryCondition(
                        values,
                        {
                            sku: operate,
                            operator: '=',
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

    private onApprove() {
        let skuArr = this.data.filter(x =>
            this.selectedRowKeys.includes(x.index)
        )

        for (let i of skuArr) {
            if (i.approve_state === 20 || i.approve_state === 30) {
                this.$message.error('只能对待审核和已预期的数据进行审核')
                return
            }
        }
        this.$modal
            .open(
                PreProductPriceDetail,
                {
                    detail: skuArr
                },
                {
                    title: '预调价审核',
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.$message.success('审核成功')
                this.getDataList()
            })
    }

    private onApproveOne(index) {
        let skuArr = this.data.filter(x => index == x.index)

        for (let i of skuArr) {
            if (i.approve_state === 20 || i.approve_state === 30) {
                this.$message.error('只能对待审核和已预期的数据进行审核')
                return
            }
        }
        this.$modal
            .open(
                PreProductPriceDetail,
                {
                    detail: skuArr
                },
                {
                    title: '预调价审核',
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.$message.success('审核成功')
                this.getDataList()
            })
    }

    private moment = moment

    private initialDate: any = []

    private fillToday() {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )

        let values = this.dataForm.getValues()

        this.initialDate = [startDate, endDate]
        values['pre_check_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fill3days() {
        let day = new Date()
        let endDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 72 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['pre_check_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fill7days() {
        let day = new Date()
        let endDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 168 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['pre_check_date'] = this.initialDate
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

    private onExport() {
        let sku = this.data
            .filter(x => this.selectedRowKeys.includes(x.index))
            .map(y => y.sku)
        let url =
            appConfig.server +
            '/system_api/download?inner_action=product_management/export_pre_product_price_check&menu_code=' +
            this.menu_code +
            '&sku_list=' +
            encodeURIComponent(JSON.stringify(sku))

        window.open(url, '_blank')
    }

    private onImport() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        '/system_api/upload?inner_action=product_management/import_pre_product_price_check&menu_code=' +
                        CommonService.getMenuCode('pre_product_price_check')
                },
                {
                    title: this.$t('action.import')
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
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "login": "Login",
            "approve_user": "Approve User",
            "active": "Active",
            "de_prod_status": "DE Product Status",
            "uk_prod_status": "UK Product Status",
            "pre_check_date": "Pre Check Date",
            "approve_date": "Approve Date",
            "approve_state": "Approve State"
        },
        "action": {
            "create": "Create",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "delete_confirm": "Confirm to Delete?",
            "approve": "Approve",
            "today": "One day",
            "3days": "3 days",
            "7days": "7 days",
            "export": "Export",
            "import": "Import"
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
            "login": "运营",
            "approve_user": "审核人",
            "active": "归档状态",
            "de_prod_status": "DE产品状态",
            "uk_prod_status": "UK产品状态",
            "pre_check_date": "预调价时间",
            "approve_date": "审核日期",
            "approve_state": "审核状态"
        },
        "action": {
            "create": "新建",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "delete_confirm": "确定要删除吗?",
            "approve": "审核",
            "today": "1天内",
            "3days": "3天内",
            "7days": "7天内",
            "export": "预调价导出",
            "import": "审核意见批量导入"
        },
        "forms": {
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量模糊"
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
