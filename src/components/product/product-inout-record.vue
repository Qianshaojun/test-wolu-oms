<template>
    <section class="component order-product-detail">
        <data-table
            :data="data"
            style="table-layout:fixed;"
            rowKey="index"
            :page="pageService"
            @on-page-change="getRecordInfo"
            :scroll="{ y: 600 }"
            :showExportBtn="false"
            bordered
            @change="onTableChange"
        >
            <a-table-column
                :title="$t('product_sku')"
                key="product_sku"
                data-index="product_sku"
                align="left"
                width="8%"
            ></a-table-column>
            <a-table-column
                :title="$t('qty_available')"
                key="qty_available"
                data-index="qty_available"
                align="center"
                width="6%"
            ></a-table-column>
            <a-table-column
                :title="$t('product_qty')"
                key="product_qty"
                align="center"
                width="6%"
            >
                <template slot-scope="row">
                    {{ row.product_qty }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('in_out_warehouse_type')"
                key="in_out_warehouse_type"
                data-index="in_out_warehouse_type"
                align="center"
                width="6%"
            ></a-table-column>
            <a-table-column
                :title="$t('location_dest_name')"
                key="location_dest_name"
                data-index="location_dest_name"
                :filters="wsFilter"
                :filterDropdown="
                    ({
                        setSelectedKeys,
                        selectedKeys,
                        confirm,
                        clearFilters
                    }) => getFilterDom(confirm)
                "
                :filterMultiple="false"
                @filter="(value, record) => onFilter(value, record)"
                align="center"
                width="8%"
            ></a-table-column>
            <a-table-column
                :title="$t('location_from_name')"
                key="location_from_name"
                data-index="location_from_name"
                align="center"
                width="8%"
            ></a-table-column>
            <a-table-column
                :title="$t('state')"
                key="state"
                data-index="state"
                align="center"
                width="6%"
            ></a-table-column>
            <a-table-column
                :title="$t('qty_done')"
                key="qty_done"
                data-index="qty_done"
                align="center"
                width="6%"
            ></a-table-column>
            <a-table-column
                :title="$t('picking_name')"
                key="picking_name"
                data-index="picking_name"
                align="center"
                width="8%"
            ></a-table-column>
            <a-table-column
                :title="$t('operate_user')"
                key="operate_user"
                data-index="operate_user"
                align="center"
                width="8%"
            ></a-table-column>
            <a-table-column
                :title="$t('merge_time')"
                key="merge_time"
                align="center"
                width="6%"
            >
                <template slot-scope="row">
                    {{ row.merge_time | datetolocal }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('done_time')"
                key="done_time"
                align="center"
                :sorter="true"
                width="6%"
            >
                <template slot-scope="row">
                    {{ row.done_time | datetolocal }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('note')"
                key="note"
                data-index="note"
                align="center"
                width="6%"
            ></a-table-column>
        </data-table>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ProductService } from '../../services/product.service'
import { RequestParams } from '@/core/http'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { PublicService } from '@/services/public.service'
import FilterDropdownDom from '~/components/common/filter-dropdown-dom.vue'
import { PageService } from '../../bootstrap/services/page.service'
import { CommonService } from '../../shared/utils/common.service'
@Component({
    components: {
        FilterDropdownDom
    }
})
export default class ProductInoutRecord extends Vue {
    @Prop()
    id: any

    @Prop()
    private systemUsers

    private productService = new ProductService()
    private pageService = new PageService()

    private loadingService = new LoadingService()
    private wareHouse: any = ''

    private data: any[] = []
    private wsFilter: any = []
    private filterValue: any = ''
    private orderBy: any = 'done_time desc'

    private mounted() {
        this.getRecordInfo()
        this.wsFilter = [
            {
                text: this.$t('all'),
                value: ''
            },
            {
                text: 'DE',
                value: 'de'
            },
            {
                text: 'UK',
                value: 'uk'
            },
            {
                text: 'RENEW',
                value: 'c_de_renew'
            }
        ]
    }

    private getRecordInfo() {
        let values: any = { product_tmpl_id: parseInt(this.id) }
        if (this.wareHouse) {
            values['warehouse'] = this.wareHouse
        }

        let params: any = CommonService.createQueryCondition(values, {
            product_tmpl_id: '=',
            warehouse: '='
        })

        if (this.orderBy) {
            params['order_by'] = this.orderBy
        }
        this.productService
            .query_product_stock_operation(
                new RequestParams(params, {
                    page: this.pageService,
                    loading: this.loadingService
                })
            )
            .subscribe(
                data => {
                    this.data = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private sortByTime(a, b) {
        let aTimeString = a ? a.replace(/-/g, '/') : 0
        let bTimeString = b ? b.replace(/-/g, '/') : 0
        let aTime = new Date(aTimeString).getTime()
        let bTime = new Date(bTimeString).getTime()
        return aTime - bTime
    }

    private onWarehouseChange(e) {
        this.wareHouse = e
        this.getRecordInfo()
    }

    private onFilter(confirm, value) {
        confirm()
        this.wareHouse = value
        this.getRecordInfo()
    }

    private getFilterDom(confirm) {
        return this.$createElement('FilterDropdownDom', {
            props: {
                data: this.wsFilter
            },
            on: {
                filter: value => this.onFilter(confirm, value),
                clear: () => this.onFilter(confirm, '')
            },
            attrs: {
                class: 'x-filter'
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
        this.getRecordInfo()
    }
}
</script>

<i18n>
{
  "en-us":{
    "log":"Log",
    "type":"Type",
    "operater":"Operater",
    "date":"Date",
    "product_sku":"Product Sku",
    "qty_available":"Qty Onhand",
    "product_qty":"Product Qty",
    "in_out_warehouse_type":"In Out Warehouse Type",
    "location_dest_name":"Location Dest Name",
    "location_from_name":"Location From  Name",
    "state":"State",
    "qty_done":"Qty Done",
    "picking_name":"Picking Name",
    "operate_user":"Operate User",
    "merge_time":"Merge Time",
    "done_time":"Done Time",
    "note":"Note",
    "warehouse":"Warehouse",
    "all":"All"
  },
  "zh-cn":{
    "log":"日志",
    "type":"类型",
    "operater":"操作人",
    "date":"日期",
    "product_sku":"Product Sku",
    "qty_available":"产品在手数量",
    "product_qty":"产品数量",
    "in_out_warehouse_type":"出入库类型",
    "location_dest_name":"目标库位",
    "location_from_name":"来源库位",
    "state":"状态",
    "qty_done":"完成数量",
    "picking_name":"拣货单",
    "operate_user":"操作人员",
    "merge_time":"合并时间",
    "done_time":"完成时间",
    "note":"备注",
    "warehouse":"仓库",
    "all":"全部"
  }
}
</i18n>
