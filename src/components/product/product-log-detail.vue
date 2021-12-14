<template>
    <section class="component order-product-detail">
        <data-table
            :data="data"
            style="table-layout:fixed;"
            rowKey="index"
            @change="onTableChange"
            :page="pageService"
            @on-page-change="getLogInfo"
            :showExportBtn="false"
            :scroll="{ y: 600 }"
            bordered
        >
            <a-table-column
                :title="$t('log')"
                key="log_content"
                data-index="log_content"
                align="left"
                width="40%"
            ></a-table-column>
            <a-table-column
                :title="$t('type')"
                key="log_type"
                data-index="log_type"
                align="center"
                width="15%"
                :filters="logTypeFilter"
                @Filter="onTypeFilter"
            ></a-table-column>
            <a-table-column
                :title="$t('operater')"
                key="who_log"
                align="center"
                width="15%"
            >
                <template slot-scope="row">
                    {{ row.who_log | dict2(systemUsers) }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('date')"
                key="log_date"
                align="center"
                :sorter="true"
            >
                <template slot-scope="row">{{
                    row.log_date | datetolocal
                }}</template>
            </a-table-column>
        </data-table>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ProductService } from '../../services/product.service'
import { RequestParams } from '@/core/http'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { namespace } from 'vuex-class'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { CommonService } from '@/shared/utils/common.service'
import { PageService } from '../../bootstrap/services/page.service'
import DataTable from '~/shared/components/data-table.vue'

const datasModule = namespace('datasModule')

@Component({
    components: {
        DataTable
    }
})
export default class ProductLogDetail extends Vue {
    @Prop()
    id: any

    private data: any[] = []

    private productService = new ProductService()

    private loadingService = new LoadingService()
    private pageService = new PageService()
    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private orderBy: any = 'log_date desc'

    private get logTypeFilter() {
        let types: any = []
        for (let item of this.data) {
            if (types.indexOf(item.log_type) == -1) {
                types.push(item.log_type)
            }
        }
        let value: any = []
        types.forEach(item => {
            value.push({
                text: item,
                value: item
            })
        })
        return value
    }

    private onTypeFilter(value, record) {
        return record.log_type.indexOf(value) === 0
    }

    private created() {
        this.getSystemuser()
        this.getLogInfo()
    }

    private getLogInfo() {
        this.innerAction.setActionAPI(
            'product_management/query_all_product_log',
            CommonService.getMenuCode('product-manage')
        )
        this.publicService
            .queryPagination(
                new RequestParams(
                    {
                        query_condition: [
                            {
                                query_name: 'product_id',
                                operate: '=',
                                value: this.id
                            }
                        ],
                        order_by: this.orderBy
                    },
                    {
                        loading: this.loadingService,
                        page: this.pageService,
                        innerAction: this.innerAction
                    }
                )
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

    private compare = function(prop) {
        return function(obj1, obj2) {
            var val1 = obj1[prop]
            var val2 = obj2[prop]
            if (val1 > val2) {
                return -1
            } else if (val1 < val2) {
                return 1
            } else {
                return 0
            }
        }
    }

    private sortByTime(a, b) {
        let aTimeString = a ? a.replace(/-/g, '/') : 0
        let bTimeString = b ? b.replace(/-/g, '/') : 0
        let aTime = new Date(aTimeString).getTime()
        let bTime = new Date(bTimeString).getTime()
        return aTime - bTime
    }

    private onTableChange(pagination, filters, sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getLogInfo()
    }
}
</script>

<i18n>
{
  "en-us":{
    "log":"Log",
    "type":"Type",
    "operater":"Operater",
    "date":"Date"
  },
  "zh-cn":{
    "log":"日志",
    "type":"类型",
    "operater":"操作人",
    "date":"日期"
  }
}
</i18n>
