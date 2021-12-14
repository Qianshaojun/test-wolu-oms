<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <data-form
            ref="dataForm"
            @submit="getDataList"
            :column="1"
            :labelCol="{ span: 3 }"
            :wrapperCol="{ span: 16, offset: 0 }"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :label="$t('columns.name')"
                        v-decorator="['name']"
                        :placeholder="$t('plzInput')"
                        style="width:200px;"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.code')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :label="$t('columns.code')"
                        v-decorator="['code']"
                        :placeholder="$t('plzInput')"
                        style="width:200px;"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.state')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['state', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            v-for="item of $dict.LogisticsProviderState"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ $t(item.label) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </template>
            <template #action>
                <!-- <a-button
                    type="primary"
                    :disabled="!needSaveNotes.length"
                    @click="changeNote"
                    >{{ $t('action.save') }}</a-button
                > -->
                <a-button
                    type="primary"
                    @click="onCreate"
                    style="margin-left: 2px"
                    >{{ $t('action.create') }}
                </a-button>
                <!-- <a-button
                    type="primary"
                    @click="onDelete"
                    :disabled="!selectedRowKeys.length"
                    style="margin-left: 2px"
                    >{{ $t('action.delete') }}
                </a-button> -->
                <!-- <a-button
                    type="primary"
                    @click="onImport"
                    style="margin-left: 2px"
                    >{{ $t('action.import') }}
                </a-button> -->
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
                            onRowClick(record)
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 2000, y: 400 }"
                >
                    <template slot="name" slot-scope="text, row">
                        <a @click="onDetail(row)">{{
                            row.name ? row.name : ''
                        }}</a>
                    </template>
                    <span slot="checkbox_ranger" slot-scope="text"
                        ><a-checkbox disabled :checked="text" />
                    </span>
                    <template slot="prescription" slot-scope="text, row">
                        {{
                            row.prescription
                                | dict('LogisticsProviderAging')
                                | translate
                        }}
                    </template>
                    <template slot="currency_id" slot-scope="text, row">
                        {{ row.currency_id | dict2(currencyList) }}
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
                @rowClick="onRowClick"
            >
                <template slot="name" slot-scope="text, row">
                    <a @click="onDetail(row)">{{ row.name ? row.name : '' }}</a>
                </template>
                <span slot="checkbox_ranger" slot-scope="text"
                    ><a-checkbox disabled :checked="text" />
                </span>
                <template slot="prescription" slot-scope="text, row">
                    {{
                        row.prescription
                            | dict('LogisticsProviderAging')
                            | translate
                    }}
                </template>
                <template slot="currency_id" slot-scope="text, row">
                    {{ row.currency_id | dict2(currencyList) }}
                </template>
            </GroupbyTable>
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
import AddReplenishContract from '~/components/purchase/add-replenish-contract.vue'
import PurchaseReturn from '~/components/purchase/purchase-return.vue'
import { formConfig } from '@/config/form.config'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import UUID from 'uuidjs'
import UploadExcel from '@/shared/common/upload-excel.vue'
import { CurrencyService } from '../../services/currency.service'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'logistics-providers-manage'
})
@Component({
    components: {
        AddReplenishContract,
        PurchaseReturn,
        GroupbyTable,
        AutoColumnTable
    }
})
export default class LogisticsProvidersManage extends Vue {
    // 表格组件
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private currencyService = new CurrencyService()

    // 表格数据源
    private data: any[] = []

    private reasonList: any = []

    private groupbyList: any = []

    private allNameAuth: any = []

    private currencyList: any = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private stateList: any = [
        {
            code: 'active',
            name: 'Active'
        },
        {
            code: 'inactive',
            name: 'Inactive'
        }
    ]

    private current = null
    private orderBy: any = ''

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @pageParamsModule.Mutation('addCommonPageInfo')
    private addCommonPageInfo

    private columnList: any = []

    private editRow: any = {
        index: null
    }

    private queryUrl: any = '/logistics_providers/query_all'

    private get rules() {
        return {}
    }

    public created() {
        this.getSystemuser()
        this.getcurrency()
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
    }

    private onGroupbyListChange() {
        this.groupbyList = this.dataForm.checkedGroupbyList
    }

    private getcurrency() {
        this.currencyService.getCurrency(new RequestParams({})).subscribe(
            data => {
                this.currencyList = data
            },
            err => {}
        )
    }

    /**
     * 获取订单数据
     */
    private getDataList() {
        this.dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                name: 'in_or_like',
                code: 'like',
                ...formConfig.condition
            })

            var nowConditions: any[] = []
            for (var item of params.query_condition) {
                if (item.value.constructor == Array && item.operate !== 'in') {
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
                            let msg: any = this.$t('tips.save_success')
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

    private onCreate() {
        this.$router.push({
            name: 'logistics-providers-detail'
        })
    }

    private getUserName(code) {
        let ret: any = code
        let item = this.systemUsers.find(x => x.code == code)
        if (item) {
            ret = item.name
        }
        return ret
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private onTableChange(pagination, filters, sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getDataList()
    }

    private onSelectChange(rowkeys) {
        this.selectedRowKeys = rowkeys
    }

    private calcStyle(row) {
        this.$nextTick(() => {
            if (row.date_approve && !row.new_product) {
                let no_order_7day: any = row.no_order_7day
                let no_order_3day: any = row.no_order_3day

                let sp: any = document.getElementById('id' + row.id)
                let tr = sp.parentNode.parentNode
                if (no_order_7day) {
                    tr.style.color = 'red'
                } else if (no_order_3day) {
                    tr.style.color = '#f90'
                }
            }
        })
    }

    private onRowClick(row) {
        this.editRow = {
            index: row
        }
    }

    private needSaveNotes: any = []

    private handleChange(e, row, column) {
        row[column] = e
        let item = this.needSaveNotes.find(x => x.index == row.index)
        if (item) {
            item[column] = e
        } else {
            let note: any = {
                index: row.index,
                id: row.id,
                save_flag: 1
            }
            note[column] = e
            this.needSaveNotes.push(note)
        }
    }

    private changeNote(row) {
        let create_list: any = []
        let edit_list: any = []
        let delete_list: any = []
        let params = JSON.parse(JSON.stringify(this.needSaveNotes))
        for (let i of params) {
            delete i.index
            if (i.id > 0) {
                if (i.save_flag == 2) {
                    delete_list.push(i.id)
                } else {
                    edit_list.push(i)
                }
            } else {
                delete i.id
                create_list.push(i)
            }
        }

        this.innerAction.setActionAPI(
            '/overseas_warehouse_list/modify_record',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        create_list: create_list,
                        edit_list: edit_list,
                        delete_list: delete_list
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.needSaveNotes = []
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onImport() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        '/overseas_warehouse_list/import_excel_batch_modify'
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

    private onDetail(row) {
        this.innerAction.setActionAPI(
            '/logistics_providers/query_detail',
            CommonService.getMenuCode('logistics-providers-detail')
        )
        this.publicService
            .query(
                new RequestParams(
                    { logistics_providers_id: row.logistics_providers_id },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    // data[0]['state'] = row.state
                    row['channel_list'] = data
                    let pm: any = [row]
                    let index =
                        'LogisticsProvidersEdit' + row.logistics_providers_id
                    let params: any = {
                        index: index,
                        id: row.id,
                        info: pm,
                        component: 'LogisticsProvidersEdit'
                    }
                    this.addCommonPageInfo(params)

                    let baseName = this.$t('page_name')

                    this.$router.push({
                        name: 'common-page',
                        path: `/common-page/${index}`,
                        params: {
                            id: index,
                            name: row.name + '-' + baseName
                        }
                    })
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
            "name": "Name",
            "code": "Code",
            "state": "State"
        },
        "action": {
            "create": "Add Item",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "export": "Export",
            "import": "Import",
            "replenish_split": "ReplenishSplit",
            "add_replenishment_contract": "Add Replenishment Contract",
            "purchase_return": "Purchase Return",
            "save": "Save",
            "import": "Import"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "cancel": "Are you sure cancel?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "page_name": "Logistics Provider Detail"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "columns": {
            "name": "物流商名称",
            "code": "物流商编码",
            "state": "状态"
        },
        "action": {
            "create": "新建",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "export": "导出",
            "import": "导入",
            "replenish_split": "拆分补货需求",
            "return_purchase": "退回补货",
            "add_replenishment_contract": "新建采购合同",
            "purchase_return": "退回补货",
            "save": "保存",
            "import": "导入"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "page_name": "物流商详情"
    }
}
</i18n>
