<template>
    <AutoColumnTable
        :stripe="true"
        :data="data"
        :page="pageService"
        :queryNameAuth="ownAllNameAuth"
        rowKey="id"
        :loading="loading"
        :columns="ownColumnList"
        :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: keys => (selectedRowKeys = keys)
        }"
        @on-page-change="getList"
        :scroll="{
            x: 1000
        }"
    >
        <template slot="sent_sku_rel_name" slot-scope="scope">
            <a-tooltip placement="top">
                <template slot="title">
                    <span>{{ scope }}</span>
                </template>
                <span
                    >{{
                        scope
                            ? scope.length > 27
                                ? scope.substr(0, 24) + '...'
                                : scope
                            : ''
                    }}
                </span></a-tooltip
            >
        </template>
        <template slot="vendor_no" slot-scope="scope">
            {{ getVendorName(scope) }}
        </template>
    </AutoColumnTable>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Page } from '@/core/decorators'
import { PageService } from '@/bootstrap/services/page.service'
import GroupByTable from '@/components/common/groupby-table.vue'
import AutoColumnTable from '@/shared/components/auto-column-table.vue'
import { CommonService } from '@/shared/utils/common.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { RequestParams } from '@/core/http'
import { PublicService } from '@/services/public.service'
import { LoadingService } from '@/bootstrap/services/loading.service'
import { mixins } from 'vue-class-component'
import CPStatisticsHandleMixin from '@/bootstrap/mixins/CPStatisticsHandleMixin'
import UUID from 'uuidjs'

@Page({
    layout: 'workspace',
    name: 'statistics-customer-table'
})
@Component({
    components: {
        GroupByTable,
        AutoColumnTable
    }
})
export default class statisticsCustomerTable extends mixins<any>(
    CPStatisticsHandleMixin
) {
    @Prop()
    dataList: any

    @Prop()
    columnList: any
    @Prop()
    groupByList: any
    @Prop()
    allNameAuth: any
    @Prop()
    statisticsFormType: any
    @Prop()
    queryParams: any

    private pageService = new PageService()
    private selectedRowKeys: any = []
    private loading: boolean = false

    private data: any = []

    private ownColumnList: any = []
    private ownAllNameAuth: any = []

    private created() {
        this.getDefaultColumnList()
    }

    private mounted() {}

    private actived() {}

    private innerAction = new InnerActionService()
    private publicService = new PublicService()
    private loadingService = new LoadingService()

    private search_uuid: any = ''

    private getList(search_uuid) {
        this.getDefaultColumnList()
        if (this.search_uuid == search_uuid) {
            return
        }
        this.innerAction.setActionAPI(
            'custom/query_all_cp_info',
            CommonService.getMenuCode()
        )
        this.publicService
            .queryPagination(
                new RequestParams(this.queryParams, {
                    page: this.pageService,
                    loading: this.loadingService,
                    innerAction: this.innerAction
                })
            )
            .subscribe(
                data => {
                    this.search_uuid = search_uuid
                    this.data = data
                    this.data.forEach(v => {
                        v.id = UUID.generate()
                    })
                    this.selectedRowKeys = []
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getDefaultColumnList() {
        this.ownColumnList = (this as any).tempHandleColumnList(
            this.columnList,
            'customer_cp'
        )
        this.ownAllNameAuth = (this as any).tempHandleColumnList(
            this.allNameAuth,
            'customer_cp'
        )
        ;(this as any).handleFormTypeColumnList()
        ;(this as any).handleAllNameAuthList()
    }

    @Watch('columnList')
    handleCList(val) {
        this.ownColumnList = (this as any).tempHandleColumnList(
            val,
            'customer_cp'
        )
        ;(this as any).handleFormTypeColumnList()
    }

    @Watch('allNameAuth')
    handleNameList(val) {
        this.ownAllNameAuth = (this as any).tempHandleColumnList(
            val,
            'customer_cp'
        )
        ;(this as any).handleAllNameAuthList()
    }

    @Watch('statisticsFormType')
    handleFormType(val) {}
}
</script>

<i18n>
{
    "en-us": {
        "main_category": "Main Category",
        "category": "Category",
        "sub_category": "Sub Category",
        "vendor_no": "Vendor No",
        "edit_group_sku": "Edit Group SKU"
    },
    "zh-cn": {
        "main_category": "一级分类",
        "category": "二级分类",
        "sub_category": "三级分类",
        "vendor_no": "供应商编码",
        "edit_group_sku": "维护组sku"
    }
}
</i18n>
