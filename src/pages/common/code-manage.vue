<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action> </template>
        <data-form
            ref="dataForm"
            @submit="getDataList"
            :column="3"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 10, offset: 1 }"
            :actions="true"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.general_code_group')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :label="$t('columns.general_code_group')"
                        v-decorator="['general_code_group']"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.general_code')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :label="$t('columns.general_code')"
                        v-decorator="['general_code']"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.general_name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :label="$t('columns.general_name')"
                        v-decorator="['general_name']"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.memo')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :label="$t('columns.memo')"
                        v-decorator="['memo']"
                        size="small"
                    />
                </a-form-item>
            </template>
            <template #action>
                <a-button
                    type="primary"
                    @click="onCreate"
                    style="margin-left: 2px"
                    >{{ $t('action.create') }}
                </a-button>
            </template>
        </data-form>
        <a-card class="margin-y" style="margin:0 !important;">
            <div v-if="!groupbyList.length">
                <AutoColumnTable
                    :stripe="true"
                    :data="data"
                    :page="pageService"
                    :queryNameAuth="allNameAuth"
                    rowKey="index"
                    :columns="columnList"
                    @on-page-change="getDataList"
                    @onClick="
                        record => {
                            selectedRowKeys = [record]
                            onRowClick(record)
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ y: 400 }"
                >
                    <template slot="name" slot-scope="text, row">
                        <a @click="onDetail(row)">{{
                            row.general_code_group
                        }}</a></template
                    >
                    <template slot="operation" slot-scope="row">
                        <a @click="onEdit(row)">
                            {{ $t('action.edit') }}
                        </a>
                        <a @click="onDetail(row)" style="margin-left: 5px;">
                            {{ $t('action.detail') }}
                        </a>
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
                    <a @click="onDetail(row)">{{
                        row.general_code_group
                    }}</a></template
                >
                <template slot="operation" slot-scope="row">
                    <a @click="onEdit(row)">
                        {{ $t('action.edit') }}
                    </a>
                    <a @click="onDetail(row)" style="margin-left: 5px;">
                        {{ $t('action.detail') }}
                    </a>
                </template>
            </GroupbyTable>
        </a-card>
        <GeneralCodeDetail
            :info="detailInfo"
            :generalName="generalName"
            :generalMemo="generalMemo"
        ></GeneralCodeDetail>
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
import GeneralCodeGroupEdit from '@/components/common/general-code-group-edit.vue'
import GeneralCodeDetail from '@/components/common/general-code-detail.vue'

@Page({
    layout: 'workspace',
    name: 'code-manage'
})
@Component({
    components: {
        GeneralCodeDetail,
        GroupbyTable,
        AutoColumnTable
    }
})
export default class CodeManage extends Vue {
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

    private detailInfo: any = []

    private groupbyList: any = []

    private allNameAuth: any = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private current = null
    private orderBy: any = ''

    private generalName: any = ''
    private generalMemo: any = ''

    private columnList: any = []

    private editRow: any = {
        index: null
    }

    private queryUrl: any = 'common/query_general_code_group'

    private get rules() {
        return {}
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
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
                general_code_group: 'like',
                general_code: 'like',
                general_name: 'like',
                memo: 'like',
                ...formConfig.condition
            })

            var nowConditions: any[] = []
            for (var item of params.query_condition) {
                nowConditions.push(item)
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

    private onCreate() {
        this.$modal
            .open(
                GeneralCodeGroupEdit,
                {
                    info: [],
                    generalName: ''
                },
                {
                    title: '新增组',
                    width: '800px'
                }
            )
            .subscribe(data => {
                this.getDataList()
            })
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

    private onRowClick(row) {
        this.editRow = {
            index: row
        }
    }

    private onDetail(row) {
        this.innerAction.setActionAPI(
            'common/query_general_code_detail_by_group',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    {
                        group_name: row.general_code_group
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    //showdetail
                    this.generalName = row.general_code_group
                    this.generalMemo = row.memo
                    this.detailInfo = data.map(x => {
                        return {
                            general_code: x.general_code,
                            general_name: x.general_name
                        }
                    })
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onEdit(row) {
        this.innerAction.setActionAPI(
            'common/query_general_code_detail_by_group',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    {
                        group_name: row.general_code_group
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$modal
                        .open(
                            GeneralCodeGroupEdit,
                            {
                                info: data.map(x => {
                                    return {
                                        general_code: x.general_code,
                                        general_name: x.general_name
                                    }
                                }),
                                generalName: row.general_code_group,
                                generalMemo: row.memo,
                                save_flag: 1
                            },
                            {
                                title: '编辑组',
                                width: '800px'
                            }
                        )
                        .subscribe(data => {
                            this.getDataList()
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
    "columns":{
        "general_code_group":"general_code_group",
        "general_code":"general_code",
        "general_name":"general_name",
        "memo":"Description"
    },
    "action":{
      "create":"Add Item",
      "edit":"Edit",
      "delete":"Delete",
      "ok":"Yes",
      "cancel":"Cancel",
      "more":"More",
      "detail":"Detail"
    },
    "rules":{
       "date_range_error":"start date can't later start date"
    },
    "delete":"Are you sure delete?",
    "cancel":"Are you sure cancel?",    
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Delete Success"
  },
  "zh-cn": {
    "desc": "这是订单页面1",
    "columns":{
        "general_code_group":"组名",
        "general_code":"编码",
        "general_name":"值",
        "memo":"说明"
    },
    "action":{
      "create":"新增",
      "edit":"编辑",
      "delete":"删除",
      "ok":"确定",
      "cancel":"取消",
      "more":"更多操作",
      "detail":"详情"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "delete":"是否确认删除?",
    "cancel":"是否确认取消?",    
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "delete_success":"删除成功"
  }
}
</i18n>
