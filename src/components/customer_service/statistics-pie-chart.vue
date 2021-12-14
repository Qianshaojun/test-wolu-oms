<template>
    <div>
        <a-card>
            <div
                style="display: flex;align-items: center;justify-content: center;height:100px"
            >
                <template v-if="data.length">
                    <div class="_30Width">
                        <p class="title">{{ $t('order_total') }}</p>
                        <p class="desc">{{ data[0].cp_order_total }}个</p>
                    </div>
                    <a-divider type="vertical" style="height:100%" />
                    <div class="_30Width">
                        <p class="title">{{ $t('all_total') }}</p>
                        <p class="desc">{{ data[0].order_total }}个</p>
                    </div>
                    <a-divider type="vertical" style="height:100%" />
                    <div class="_30Width">
                        <p class="title">{{ $t('total_rate') }}</p>
                        <p class="desc">
                            {{ Number(data[0].total_rate * 100).toFixed(2) }}%
                        </p>
                    </div>
                </template>
                <template v-else>
                    {{ $t('noData') }}
                </template>
            </div>
        </a-card>
        <a-card :title="$t('c_rate')" id="cpPieGraph">
            <a-button slot="extra" @click="exportPdf" v-if="data.length"
                >{{ $t('export') }}
            </a-button>
            <div style="display: flex;width:100%">
                <div id="pieMap" style="width:35%;height:400px;"></div>
                <div
                    style="margin-left: 20%;height:400px;overflow-y: auto;overflow-x: hidden"
                    id="reasonList"
                >
                    <p
                        style="color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 16px !important"
                    >
                        {{ reasonListTitle }}
                    </p>
                    <div v-if="reasonList.length">
                        <div
                            v-for="(item, index) in reasonList"
                            :key="index"
                            class="reasonItem"
                            style="width:650px;display: flex;justify-content: space-between"
                        >
                            <span
                                >{{ index + 1 }}、
                                <a-tooltip placement="top">
                                    <template slot="title">
                                        <span>{{ item.name }}</span>
                                    </template>
                                    <span
                                        >{{
                                            item.name
                                                ? item.name.length > 50
                                                    ? item.name.substr(0, 47) +
                                                      '...'
                                                    : item.name
                                                : ''
                                        }}
                                    </span> </a-tooltip
                                >|
                                {{
                                    (
                                        (Number(item.value) /
                                            Number(item.total)) *
                                        100
                                    ).toFixed(2)
                                }}%</span
                            ><span style="text-align: right"
                                >{{ item.value }}个</span
                            >
                        </div>
                    </div>
                    <div v-else style="line-height: 320px">
                        {{ $t('noData') }}
                    </div>
                </div>
            </div>
        </a-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Page } from '@/core/decorators'
import { CommonService } from '@/shared/utils/common.service'
import { RequestParams } from '@/core/http'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { PublicService } from '@/services/public.service'
import { LoadingService } from '@/bootstrap/services/loading.service'
import htmlToPdf from '~/assets/js/htmlToPdf'

const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/chart/pie')

@Page({
    layout: 'workspace',
    name: 'statistics-pie-chart'
})
@Component({
    components: {}
})
export default class statisticsPieChart extends Vue {
    @Prop()
    queryData: any

    private innerAction = new InnerActionService()
    private publicService = new PublicService()
    private loadingService = new LoadingService()

    private data: any = []

    private option: any = {
        tooltip: {
            trigger: 'item',
            formatter: '{b} : {c}个 ({d}%)'
        },
        legend: {
            orient: 'vertical',
            top: '30%',
            right: '0%'
        },
        toolbox: {
            feature: {
                saveAsImage: { show: true }
            }
        },
        graphic: {
            type: 'text',
            left: 'center',
            top: '48%',
            style: {
                text: '',
                textAlign: 'center',
                fill: '#333',
                fontSize: 20,
                fontWeight: 400
            }
        },
        series: [
            {
                center: ['50%', '50%'], //控制饼图位置
                type: 'pie',
                radius: ['40%', '65%'],
                avoidLabelOverlap: true,
                color: [
                    '#D68060',
                    '#F1AE89',
                    '#DFF3E3',
                    '#86ABA1',
                    '#0A043C',
                    '#E6A23C',
                    '#FFE3D8'
                ], //对应数据颜色
                label: {
                    show: true,
                    position: 'left'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '20',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: true
                },
                data: []
            }
        ]
    }

    private mounted() {
        this.init()
    }

    private reasonListTitle: string = ''
    private reasonList: any = []
    private myChart: any = null //echarts实例

    private created() {}

    private init() {
        let myChartId = document.getElementById('pieMap') as any
        myChartId.innerHTML =
            "<div style='text-align: center;line-height: 400px' id='noData'>No Data</div>"
        myChartId.removeAttribute('_echarts_instance_')
    }

    private clickPieItem(param) {
        let arr: any = []
        for (let i in param.data.reasonList) {
            arr.push({
                name: i,
                value: param.data.reasonList[i],
                total: param.data.value
            })
        }
        this.reasonListTitle = param.name
        this.reasonList = arr
    }

    @Watch('queryData')
    getData() {
        //清空原因数据
        this.reasonList = []
        this.reasonListTitle = ''
        let myChartId = document.getElementById('pieMap') as any
        this.myChart = echarts.init(myChartId)
        window.addEventListener('resize', () => {
            this.myChart.resize()
        })
        this.myChart.showLoading({ text: 'Loading' })
        this.myChart.on('click', this.clickPieItem) //饼图点击事件

        this.innerAction.setActionAPI(
            'custom/query_custom_problem_dimension',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(this.queryData, {
                    loading: this.loadingService,
                    innerAction: this.innerAction
                })
            )
            .subscribe(
                data => {
                    this.data = data

                    if (this.data.length) {
                        this.handlePieData(data)
                        this.myChart.hideLoading()
                    } else {
                        myChartId.innerHTML =
                            '<div style="text-align: center;line-height: 400px"  id="noData">No Data</div>'
                        myChartId.removeAttribute('_echarts_instance_')
                    }
                },
                err => {
                    this.myChart.hideLoading()
                    this.$message.error(err.message)
                }
            )
    }

    private handlePieData(data) {
        let arr: any = []
        if (data.length) {
            if (data[0].product_reason) {
                arr.push({
                    value: data[0].product_reason.product_reason_total,
                    name: '产品原因',
                    reasonList: data[0].product_reason.detail_product_reason
                })
            }
            if (data[0].logistic_reason) {
                arr.push({
                    value: data[0].logistic_reason.logistic_reason_total,
                    name: '物流原因',
                    reasonList: data[0].logistic_reason.detail_logistic_reason
                })
            }
            if (data[0].warehouse_reason) {
                arr.push({
                    value: data[0].warehouse_reason.warehouse_reason_total,
                    name: '仓库原因（cs）',
                    reasonList: data[0].warehouse_reason.detail_warehouse_reason
                })
            }
            if (data[0].w_warehouse_reason) {
                arr.push({
                    value: data[0].w_warehouse_reason.w_warehouse_reason_total,
                    name: '仓库原因（rt）',
                    reasonList:
                        data[0].w_warehouse_reason.detail_w_warehouse_reason
                })
            }
            if (data[0].w_return_reason) {
                arr.push({
                    value: data[0].w_return_reason.w_return_reason_total,
                    name: '退货原因',
                    reasonList: data[0].w_return_reason.detail_w_return_reason
                })
            }
            if (data[0].customer_reason) {
                arr.push({
                    value: data[0].customer_reason.customer_reason_total,
                    name: '客户原因',
                    reasonList: data[0].customer_reason.detail_customer_reason
                })
            }
            if (data[0].other_reason) {
                arr.push({
                    value: data[0].other_reason.other_reason_total,
                    name: '其他',
                    reasonList: data[0].other_reason.detail_other_reason
                })
            }
            this.option.series[0].data = JSON.parse(JSON.stringify(arr))
            this.option.graphic.style.text = `总投诉率${Number(
                data[0].total_rate * 100
            ).toFixed(2)}%`
            this.myChart.setOption(this.option)
            this.$forceUpdate()
        }
    }

    /**
     * 导出pdf
     */
    private exportPdf() {
        //解决截屏时，滚动条隐藏部分不能截取问题
        let targetDom = document.querySelector('#cpPieGraph') as HTMLElement
        let scrollDom = document.querySelector('#reasonList') as HTMLElement
        let scrollDomHeight = scrollDom.style.height
        scrollDom.style.height = scrollDom.scrollHeight + 'px'
        htmlToPdf.downloadPDF(targetDom, '客诉原因占比')
        scrollDom.style.height = scrollDomHeight
    }
}
</script>

<style scoped>
.reasonItem + .reasonItem {
    margin-top: 8px;
}

.copyDom {
    background-color: white;
    position: absolute;
    top: 0;
    z-index: -1;
}
</style>

<i18n>
{
    "en-us": {
        "noData": "No Data",
        "order_total": "Total Number Of Customer Complaint Orders Within Date Range",
        "all_total": "Total Orders Within Date Range",
        "total_rate": "Total Complaint Rate Within Date Range",
        "c_rate": "Proportion Of Complaints",
        "export": "Export Graph",
        "cause": "Products Cause"
    },
    "zh-cn": {
        "noData": "No Data",
        "order_total": "日期范围内总客诉订单数量",
        "all_total": "日期范围内总订单数",
        "total_rate": "日期范围内总投诉率",
        "c_rate": "客诉原因占比",
        "export": "导出图表",
        "cause": "产品原因"
    }
}
</i18n>
