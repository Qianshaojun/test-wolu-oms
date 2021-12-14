<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <data-form
            ref="dataForm"
            @submit="getDataList"
            :column="2"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 16, offset: 0 }"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['name']"
                        style="width:200px;"
                        :placeholder="$t('plzInput')"
                        size="small"
                    />
                </a-form-item>
                <!-- <a-form-item
                    :label="$t('columns.company_name')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['company_name', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Please select"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of companyList"
                            :key="item.code"
                            :value="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item 
                    :label="$t('columns.vendor')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['vendor', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Please select"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of vendorList"
                            :key="item.code"
                            :value="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>-->
                <a-form-item :label="$t('columns.state')">
                    <a-radio-group
                        v-decorator="['state', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of $dict.DePoState"
                            :key="item.value"
                            >{{ $t(item.label) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </template>
            <!-- <template #action>
                <a-button type="primary" @click="onDetail"
                    >{{ $t('action.save') }}
                </a-button>
            </template> -->
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important;">
            <div v-if="!groupbyList.length">
                <AutoColumnTable
                    :stripe="true"
                    :data="data"
                    :page="pageService"
                    :queryNameAuth="allNameAuth"
                    rowKey="id"
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
                    <span slot="check_render" slot-scope="text"
                        ><a-checkbox disabled :checked="text" />
                    </span>
                    <span
                        slot="show_message_tips"
                        slot-scope="text"
                        :title="text"
                    >
                        {{
                            text
                                ? text.length > 20
                                    ? text.substr(0, 17) + '...'
                                    : text
                                : ''
                        }}
                    </span>
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <template slot="name" slot-scope="text, row">
                        <a @click="toPageDetail(row.id, row.name)">{{
                            row.name
                        }}</a>
                    </template>
                    <template slot="vendor" slot-scope="text">
                        {{ text | dict2(vendorList) }}
                    </template>
                    <template slot="company" slot-scope="text">
                        {{ text | dict2(companyList) }}
                    </template>
                    <template slot="state" slot-scope="text">
                        {{ text | dict('DePoState') | translate }}
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
                <span slot="check_render" slot-scope="text"
                    ><a-checkbox disabled :checked="text" />
                </span>
                <span slot="show_message_tips" slot-scope="text" :title="text">
                    {{
                        text
                            ? text.length > 20
                                ? text.substr(0, 17) + '...'
                                : text
                            : ''
                    }}
                </span>
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
                <template slot="name" slot-scope="text, row">
                    <a @click="toPageDetail(row.id, row.name)">{{
                        row.name
                    }}</a>
                </template>
                <template slot="vendor" slot-scope="text">
                    {{ text | dict2(vendorList) }}
                </template>
                <template slot="company" slot-scope="text">
                    {{ text | dict2(companyList) }}
                </template>
                <template slot="state" slot-scope="text">
                    {{ text | dict('DePoState') | translate }}
                </template>
            </GroupbyTable>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import router from '../../router'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { namespace } from 'vuex-class'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import CommonPage from '~/shared/components/common-page.vue'
import { CommonService } from '@/shared/utils/common.service'
import PurchaseCancelAtentioin from '~/components/purchase/purchase-cancel-attention.vue'
import { formConfig } from '@/config/form.config'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import appConfig from '@/config/app.config'
import moment from 'moment'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'purchase-de-po-manage'
})
@Component({
    components: {
        PurchaseCancelAtentioin,
        CommonPage,
        GroupbyTable,
        AutoColumnTable
    }
})
export default class PurchaseDePoManage extends Vue {
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

    // 表格数据源
    private data: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private orderBy: any = 'id desc'
    private queryUrl: any = 'purchase_management/query_all_de_purchase_order'

    private moment = moment

    private groupbyList: any = []

    private columnList: any = []

    private allNameAuth: any = []

    private companyList: any = []
    private fromPortList: any = []
    private toPortList: any = []
    private vendorList: any = []
    private shipmentItemList: any = []

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
        this.companyList = [
            {
                code: 'woltu',
                name: 'Woltu'
            },
            {
                code: 'eugad',
                name: 'Eugad'
            },
            {
                code: 'situ',
                name: 'Situ'
            },
            {
                code: 'elight',
                name: 'Elight'
            },
            {
                code: 'wowo',
                name: 'WoWo'
            },
            {
                code: 'meteorsRain',
                name: 'MeteorsRain'
            },
            {
                code: 'brichimon',
                name: 'BRICHIMON LIMITED'
            }
        ]
        this.fromPortList = [
            {
                code: 'QINGDAO',
                name: 'QINGDAO'
            },
            {
                code: 'TIANJIN',
                name: 'TIANJIN'
            },
            {
                code: 'XIAMEN',
                name: 'XIAMEN'
            },
            {
                code: 'FUZHOU',
                name: 'FUZHOU'
            },
            {
                code: 'NINGBO',
                name: 'NINGBO'
            },
            {
                code: 'YANTIAN',
                name: 'YANTIAN'
            },
            {
                code: 'SHANGHAI',
                name: 'SHANGHAI'
            },
            {
                code: 'XIAOLAN',
                name: 'XIAOLAN'
            },
            {
                code: 'SHENZHEN',
                name: 'SHENZHEN'
            }
        ]
        this.toPortList = [
            {
                code: 'FELIXSTOWE',
                name: 'FELIXSTOWE'
            },
            {
                code: 'ROTTERDAM',
                name: 'ROTTERDAM'
            },
            {
                code: 'SOUTHAMPTON',
                name: 'SOUTHAMPTON'
            },
            {
                code: 'DUISBURG',
                name: 'DUISBURG'
            },
            {
                code: 'NEUSS',
                name: 'NEUSS'
            }
        ]
        this.vendorList = [
            {
                code: 'wawa',
                name: 'WAWAHOME'
            },
            {
                code: 'ye',
                name: 'YEMELEK'
            },
            {
                code: 'situ',
                name: 'ST-SITU'
            },
            {
                code: 'runheng',
                name: 'RH-RUNHENG'
            },
            {
                code: 'andong',
                name: 'AD-ANDONG'
            },
            {
                code: 'cheng',
                name: 'OH-ORANGE'
            },
            {
                code: 'dy',
                name: 'DY-DEALCRAFTS'
            },
            {
                code: 'ice',
                name: 'ICE-ICEBERG'
            },
            {
                code: 'kd',
                name: 'KD-KENDA'
            },
            {
                code: 'wt',
                name: 'WT-HENAN PROSPER SKINS AND LEATHER'
            },
            {
                code: 'yt',
                name: 'YT-YUTONG'
            },
            {
                code: 'zl',
                name: 'ZL-JINHUA RUNCHN'
            },
            {
                code: 'ykzh',
                name: 'YKZH-YONGKANG ZEHUI'
            },
            {
                code: 'anji',
                name: 'BY-BAOYOU'
            },
            {
                code: 'wj',
                name: 'WJ-WORKING'
            }
        ]
        this.shipmentItemList = [
            {
                code: 'FOB',
                name: 'FOB'
            },
            {
                code: 'CIF',
                name: 'CIF'
            }
        ]
    }

    private onGroupbyListChange() {
        this.groupbyList = this.dataForm.checkedGroupbyList
    }

    /**
     * 获取订单数据
     */
    private getDataList() {
        this.dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                default_code: 'in_or_like',
                order_name: 'like',
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
                            this.data = data
                            this.selectedRowKeys = []
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
        })
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

    private onRowClick(row) {
        let info = this.data.find(x => x.id === row)
    }

    private onSelectChange(rowkeys) {
        this.selectedRowKeys = rowkeys
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private toPageDetail(id, name) {
        this.$router.push({
            name: 'depo-detail',
            path: `/purchase/depo-detail/${id}`,
            params: {
                id: id,
                name: name
            }
        })
    }

    private onDetail(row) {
        this.innerAction.setActionAPI(
            'purchase_management/query_de_purchase_order_detail_by_id',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    { de_po_id: row.id },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {},
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
            "vendor": "Vendor",
            "company_name": "Company Name",
            "state": "State"
        },
        "action": {
            "create": "Create",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Ok",
            "save": "Save",
            "cancel": "Cancel",
            "confirm": "Confirm",
            "export": "Export Excel",
            "import": "Import Excel",
            "view_logs": "Logs",
            "more": "More",
            "discard": "Discard",
            "export_unfinish_line": "Export Unfinish",
            "edit_finish_qty_vendor": "Multi Edit Finish Qty and Vendor",
            "change_purchase_info": "Multi Change Purchase Info",
            "export_product_specification": "Export Manual Specification",
            "view_purchase_change_log": "Logs",
            "update_btn": "More",
            "cancel_attention": "Cancel Attention",
            "force_finish_trace": "Finish Purchase Item",
            "unfinish_trace": "Unfinish Purchase Item",
            "qc_confirm_ship": "QC Confirm Ship",
            "purchase_finish_dlg": "Finish Item",
            "cancel_attention_dlg": "Cancel Attention Item",
            "add_trace_memo_dlg": "Add Trace Memo",
            "import_trace_memo_dlg": "Import Trace Memo",
            "sync_product_supplier": "Sync Product Supplier",
            "showlog": "View Log"
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
            "name": "Name",
            "vendor": "供应商",
            "company_name": "公司",
            "state": "状态"
        },
        "action": {
            "create": "新建",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "save": "保存",
            "cancel": "取消",
            "confirm": "确认",
            "export": "导出Excel",
            "import": "导入Excel",
            "view_logs": "日志",
            "more": "更多操作",
            "discard": "丢弃",
            "export_unfinish_line": "导出未完成",
            "edit_finish_qty_vendor": "批量变更发货数量和供应商",
            "change_purchase_info": "批量修改采购信息",
            "export_product_specification": "导出说明书和工艺单",
            "view_purchase_change_log": "日志",
            "update_btn": "更多",
            "cancel_attention": "取消关注",
            "force_finish_trace": "设置跟踪完成",
            "unfinish_trace": "设置跟踪未完成",
            "qc_confirm_ship": "QC质检完成",
            "purchase_finish_dlg": "强制完成",
            "cancel_attention_dlg": "取消关注",
            "add_trace_memo_dlg": "添加跟踪备注",
            "import_trace_memo_dlg": "导入跟踪备注",
            "sync_product_supplier": "Sync Product Supplier",
            "showlog": "查看日志"
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
