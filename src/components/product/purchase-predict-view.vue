<template>
    <section class="component customer-detail">
        <a-tabs
            defaultActiveKey="first"
            v-model="activeKey"
            @change="e => paneChange(e)"
        >
            <a-tab-pane :tab="$t('purchase_predict_detail_1')" key="first">
                <a-table
                    :dataSource="detail_first"
                    :page="pageService"
                    style="table-layout:fixed;"
                    bordered
                >
                    <!-- <a-table-column
                        :title="$t('columns.calculate_code')"
                        key="calculate_code"
                        data-index="calculate_code"
                        align="left"

                    ></a-table-column> -->
                    <a-table-column
                        :title="$t('columns.cur_date')"
                        key="cur_date"
                        data-index="cur_date"
                        align="center"
                    >
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.sales_trend')"
                        key="sales_trend"
                        data-index="sales_trend"
                        align="right"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.will_sales')"
                        key="will_sales"
                        data-index="will_sales"
                        align="right"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.transit_qty')"
                        key="transit_qty"
                        data-index="transit_qty"
                        align="right"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.unship_qty')"
                        key="unship_qty"
                        data-index="unship_qty"
                        align="right"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.stock_qty')"
                        key="stock_qty"
                        data-index="stock_qty"
                        align="right"
                    ></a-table-column>
                </a-table>
            </a-tab-pane>
            <a-tab-pane :tab="$t('purchase_predict_detail_2')" key="second">
                <a-table
                    :dataSource="detail_second"
                    :page="pageService"
                    style="table-layout:fixed;"
                    bordered
                >
                    <!-- <a-table-column
                        :title="$t('columns.calculate_code')"
                        key="calculate_code"
                        data-index="calculate_code"
                        align="left"
                    ></a-table-column> -->
                    <a-table-column
                        :title="$t('columns.cur_date')"
                        key="cur_date"
                        data-index="cur_date"
                        align="center"
                    >
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.sales_trend')"
                        key="sales_trend"
                        data-index="sales_trend"
                        align="right"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.will_sales')"
                        key="will_sales"
                        data-index="will_sales"
                        align="right"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.transit_qty')"
                        key="transit_qty"
                        data-index="transit_qty"
                        align="right"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.unship_qty')"
                        key="unship_qty"
                        data-index="unship_qty"
                        align="right"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.stock_qty')"
                        key="stock_qty"
                        data-index="stock_qty"
                        align="right"
                    ></a-table-column>
                </a-table>
            </a-tab-pane>
            <a-tab-pane :tab="$t('half_year_sales')" key="sale_history">
                <a-table
                    :dataSource="sale_history"
                    :page="pageService"
                    style="table-layout:fixed;"
                    bordered
                >
                    <a-table-column
                        :title="$t('columns.order_date')"
                        key="order_date"
                        data-index="order_date"
                        align="center"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.order_qty')"
                        key="order_qty"
                        data-index="order_qty"
                        align="right"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.sales_qty')"
                        key="sales_qty"
                        data-index="sales_qty"
                        align="right"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.presale_order_qty')"
                        key="presale_order_qty"
                        data-index="presale_order_qty"
                        align="right"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.presale_sales_qty')"
                        key="presale_sales_qty"
                        data-index="presale_sales_qty"
                        align="right"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.uk_order_qty')"
                        key="uk_order_qty"
                        data-index="uk_order_qty"
                        align="right"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.uk_sales_qty')"
                        key="uk_sales_qty"
                        data-index="uk_sales_qty"
                        align="right"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.uk_presale_order_qty')"
                        key="uk_presale_order_qty"
                        data-index="uk_presale_order_qty"
                        align="right"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.uk_presale_sales_qty')"
                        key="uk_presale_sales_qty"
                        data-index="uk_presale_sales_qty"
                        align="right"
                    ></a-table-column>
                </a-table>
            </a-tab-pane>
            <a-tab-pane :tab="$t('logs')" key="log">
                <a-table
                    :dataSource="logs"
                    style="table-layout:fixed;"
                    rowKey="log_content"
                    bordered
                >
                    <a-table-column
                        :title="$t('columns.log_content')"
                        key="log_content"
                        data-index="log_content"
                        align="left"
                        width="40%"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.log_type')"
                        key="log_type"
                        data-index="log_type"
                        align="center"
                        width="15%"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.who_log')"
                        key="who_log"
                        data-index="who_log"
                        align="center"
                        width="15%"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.log_date')"
                        key="log_date"
                        data-index="log_date"
                        align="center"
                        width="20%"
                    ></a-table-column>
                    <a-table-column
                        title="IP"
                        key="log_ip"
                        data-index="log_ip"
                        align="left"
                    >
                    </a-table-column>
                </a-table>
            </a-tab-pane>
        </a-tabs>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { PageService } from '~/bootstrap/services/page.service'
import { PurchaseCalService } from '../../services/purchasecal.service'
import { OperateLogService } from '../../services/operatelog.service'
import { RequestParams } from '../../core/http'
import { LoadingService } from '../../bootstrap/services/loading.service'
import moment from 'moment'
@Component({
    components: {}
})
export default class PurchasePredictView extends Vue {
    @Prop()
    detail: any
    @Prop()
    systemUsers: any

    private activeKey: any = 'first'

    // 分页服务
    private pageService = new PageService()

    private purchaseCalService = new PurchaseCalService()

    private operateLogService = new OperateLogService()

    private loadingService = new LoadingService()

    private logs: any[] = []

    private detail_first: any[] = []

    private detail_second: any[] = []

    private sale_history: any[] = []

    private created() {
        this.getdetail_first()
    }

    @Watch('detail')
    onDetailChange() {
        this.logs = []
        this.detail_first = []
        this.detail_second = []
        if (this.activeKey == 'log') {
            this.getLogs()
        } else if (this.activeKey == 'first') {
            this.getdetail_first()
        } else if (this.activeKey == 'second') {
            this.getdetail_second()
        } else if (this.activeKey == 'sale_history') {
            this.getsale_history()
        }
    }

    private paneChange(key) {
        if (key === 'log' && !this.logs.length) {
            this.getLogs()
        } else if (key === 'first' && !this.detail_first.length) {
            this.getdetail_first()
        } else if (key === 'second' && !this.detail_second.length) {
            this.getdetail_second()
        } else if (key === 'sale_history' && !this.sale_history.length) {
            this.getsale_history()
        }
    }

    private getLogs() {
        this.operateLogService
            .viewUserOperateChangedLog(
                new RequestParams(
                    {
                        object_name: 'product_purchase_calculate_list',
                        record_code: this.detail.calculate_code
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(data => {
                for (var item of data) {
                    var sysuser = this.systemUsers.find(
                        x => x.code === item.who_log
                    )
                    item['who_log'] = sysuser ? sysuser.name : item.who_log
                    let localTime = moment.utc(item['log_date']).toDate()
                    item['log_date'] = moment(localTime).format(
                        'YYYY-MM-DD HH:mm'
                    )
                }
                this.logs = data
            })
    }

    private getdetail_first() {
        this.purchaseCalService
            .queryDetail(
                new RequestParams(
                    {
                        calculate_code: this.detail.calculate_code,
                        period_times: 1
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(data => {
                this.detail_first = data
            })
    }

    private getdetail_second() {
        this.purchaseCalService
            .queryDetail(
                new RequestParams(
                    {
                        calculate_code: this.detail.calculate_code,
                        period_times: 2
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(data => {
                this.detail_second = data
            })
    }

    private getsale_history() {
        this.purchaseCalService
            .salesHistory(
                new RequestParams(
                    {
                        default_code: this.detail.default_code,
                        order_date: this.detail.calculate_date
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(data => {
                this.sale_history = data
            })
    }
}
</script>

<i18n>
{
  "en-us": {
    "desc": "",
    "columns":{
    "search_code": "search_code",
       "calculate_code": "calculate_code",
       "cur_date": "cur_date",
       "sales_trend":"sales_trend",
       "will_sales":"will_sales",
       "transit_qty":"transit_qty",
       "unship_qty":"unship_qty",
       "stock_qty":"stock_qty",
       "order_date":"order_date",
       "order_qty":"order_qty",
       "sales_qty":"sales_qty",
       "presale_order_qty":"presale_order_qty",
       "presale_sales_qty":"presale_sales_qty",
       "uk_order_qty":"uk_order_qty",
       "uk_sales_qty":"uk_sales_qty",
       "uk_presale_order_qty":"uk_presale_order_qty",
       "uk_presale_sales_qty":"uk_presale_sales_qty",
       "memo":"memo",
       "log_content":"log_content",
       "log_type":"log_type",
       "who_log":"who_log",
       "log_date":"log_date"
    },
    "action":{

    },
    "rules":{

    },
    "purchase_predict_detail_1":"purchase_predict_detail_1",
    "purchase_predict_detail_2":"purchase_predict_detail_2",
    "half_year_sales":"half_year_sales",
    "logs":"logs"
  },
  "zh-cn": {
    "desc": "",
    "columns":{
       "calculate_code": "统计编码",
       "cur_date": "统计时间",
       "sales_trend":"销售趋势",
       "will_sales":"未来销量",
       "transit_qty":"在途量",
       "unship_qty":"未发货量",
       "stock_qty":"当前库存数",
       "order_date":"购买时间",
       "order_qty":"订单量",
       "sales_qty":"销量",
       "presale_order_qty":"预售订单量",
       "presale_sales_qty":"预售销量",
       "uk_order_qty":"英线订单量",
       "uk_sales_qty":"英线销量",
       "uk_presale_order_qty":"英线预售订单量",
       "uk_presale_sales_qty":"英线预售销量",
       "memo":"备注",
       "log_content":"日志",
       "log_type":"类型",
       "who_log":"操作人",
       "log_date":"日期"
    },
    "action":{

    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "purchase_predict_detail_1":"第一期预算详情",
    "purchase_predict_detail_2":"第二期预算详情",
    "half_year_sales":"近半年销售总量记录",
    "logs":"操作日志"
  }
}
</i18n>
