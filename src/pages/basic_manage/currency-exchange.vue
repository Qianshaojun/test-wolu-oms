<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form ref="dataForm" @submit="getCurrencyChange" :column="2">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.start_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        v-decorator="['start_date']"
                        format="YYYY-MM-DD"
                        size="small"
                        :style="{ width: '300px' }"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.end_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        v-decorator="['end_date']"
                        format="YYYY-MM-DD"
                        size="small"
                        :style="{ width: '300px' }"
                    />
                </a-form-item>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important;">
            <data-table
                :stripe="true"
                :data="currencyExchangeData"
                :page="pageService"
                rowKey="id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getCurrencyChange"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                @change="sorter => onTableChange(sorter)"
                style="table-layout:fixed;"
            >
                <a-table-column
                    :title="$t('columns.exchange_name')"
                    key="exchange_name"
                    width="20%"
                    align="center"
                >
                    <template slot-scope="row">
                        <span> {{ row.exchange_name }} </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.start_date')"
                    key="start_date"
                    width="10%"
                    align="center"
                    :sorter="true"
                >
                    <template slot-scope="row">
                        <span> {{ row.start_date }} </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.end_date')"
                    key="end_date"
                    width="10%"
                    align="left"
                >
                    <template slot-scope="row">
                        <span>
                            {{ row.end_date }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.start_rate')"
                    key="start_rate"
                    width="10%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span> {{ row.start_rate }} </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.end_rate')"
                    key="end_rate"
                    width="10%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span> {{ row.end_rate }} </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.write_uid')"
                    key="write_uid"
                    width="10%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span> {{ row.write_uid | dict2(systemUsers) }} </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.write_date')"
                    key="write_date"
                    width="10%"
                    align="right"
                >
                    <template slot-scope="row">
                        <span> {{ row.write_date | datetolocal }} </span>
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { namespace } from 'vuex-class'
import moment from 'moment'
import { SystemService } from '../../services/system.service'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'currency-exchange'
})
@Component({
    components: {}
})
export default class CurrencyExchange extends Vue {
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

    private systemService = new SystemService()

    private orderBy: any = 'start_date desc'

    private selectedRows: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private created() {
        this.getSystemuser()
    }

    // 表格数据源
    private currencyExchangeData: any[] = []

    public getCurrencyChange() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                let params: any = CommonService.createQueryCondition(values, {
                    default_code: 'like',
                    z_sub_category: 'like'
                })

                if (this.orderBy) {
                    params['order_by'] = this.orderBy
                }

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
                                value: item.value[0].format('YYYY-MM-DD')
                            })
                        }
                        if (
                            item.value.length == 2 &&
                            item.value[1].constructor.name == 'Moment'
                        ) {
                            nowConditions.push({
                                query_name: item.query_name,
                                operate: '<=',
                                value: item.value[1].format('YYYY-MM-DD')
                            })
                        }
                    } else {
                        nowConditions.push(item)
                    }
                }
                params.query_condition = nowConditions

                this.systemService
                    .queryCurrencyChange(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService
                        })
                    )
                    .subscribe(
                        data => {
                            this.currencyExchangeData = data
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
            .catch(err => {
                this.$message.error(err.message)
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
        this.getCurrencyChange()
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private moment = moment

    private initialDate: any = []
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "exchange_name": "Exchange Name",
            "start_date": "Start Date",
            "end_date": "End Date",
            "start_rate": "Start Rate",
            "end_rate": "End Rate"
        },
        "action": {
            "create": "Create"
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
            "exchange_name": "名称",
            "start_date": "开始日期",
            "end_date": "结束日期",
            "start_rate": "开始汇率",
            "end_rate": "结束汇率"
        },
        "action": {
            "create": "新建"
        },
        "forms": {
            "quick_search": "快速查找",
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
