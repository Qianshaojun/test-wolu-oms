<template>
    <a-card id="cpBarGraph">
        <div slot="title">
            <span class="cardTitle">{{ $t('trend') }}</span>
            <span class="cardTitleDesc" v-if="data.length">
                <span
                    @click="changeRange('day')"
                    :class="{ activeDate: activeDateType === 'day' }"
                    >{{ $t('byDay') }}</span
                >
                <span
                    :class="{ activeDate: activeDateType === 'week' }"
                    @click="changeRange('week')"
                    >{{ $t('byWeek') }}</span
                >
                <span
                    :class="{ activeDate: activeDateType === 'month' }"
                    @click="changeRange('month')"
                    >{{ $t('byMonth') }}</span
                >
                <span
                    :class="{ activeDate: activeDateType === 'year' }"
                    @click="changeRange('year')"
                    >{{ $t('byYear') }}</span
                >
            </span>
        </div>
        <a-button slot="extra" v-if="data.length" @click="exportPdf"
            >{{ $t('export') }}
        </a-button>
        <div id="barMap" style="width:100%;height:400px;"></div>
    </a-card>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Page } from '@/core/decorators'
import { RequestParams } from '@/core/http'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { PublicService } from '@/services/public.service'
import { CommonService } from '@/shared/utils/common.service'
import htmlToPdf from '~/assets/js/htmlToPdf'

const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/toolbox')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/grid')
require('echarts/lib/component/legend')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')

@Page({
    layout: 'workspace',
    name: 'statistics-bar-chart'
})
@Component({
    components: {}
})
export default class statisticsBarChart extends Vue {
    @Prop()
    queryData: any

    private data: any = []

    private innerAction = new InnerActionService()
    private publicService = new PublicService()

    private option: any = {
        color: ['#03506F', '#34BE82'], //柱状图,折线图颜色
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        toolbox: {
            feature: {
                saveAsImage: { show: true }
            }
        },
        legend: {
            data: ['客诉订单量', '客诉比例']
        },
        xAxis: [
            {
                type: 'category',
                data: [], //'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '客诉订单量',
                min: 0,
                max: function(val) {
                    return Math.ceil(Number(val.max) / 10) * 10
                },
                splitNumber: 10,
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '客诉比例',
                min: 0,
                max: 1,
                splitNumber: 10,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name: '客诉订单量',
                type: 'bar',
                data: []
            },
            {
                name: '客诉比例',
                type: 'line',
                yAxisIndex: 1,
                data: []
            }
        ]
    }

    private created() {}

    private mounted() {
        this.init()
    }

    private fetchData(obj) {
        obj.query_condition[obj.query_condition.length] = {
            query_name: 'tab',
            operate: '=',
            value: this.activeDateType
        }
        let myChartId = document.getElementById('barMap') as HTMLElement
        this.myChart = echarts.init(myChartId)
        window.addEventListener('resize', () => {
            this.myChart.resize()
        })
        this.myChart.showLoading({ text: 'Loading' })
        this.option.series[0].data = [] //清空数据
        this.option.series[1].data = []
        this.option.xAxis[0].data = []
        this.innerAction.setActionAPI(
            'custom/query_custom_problem_by_cp_period',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(obj, {
                    innerAction: this.innerAction
                })
            )
            .subscribe(
                data => {
                    this.data = data
                    if (data.length) {
                        this.data.forEach(v => {
                            if (this.activeDateType === 'day') {
                                this.option.xAxis[0].data.push(v.day)
                            }
                            if (this.activeDateType === 'week') {
                                this.option.xAxis[0].data.push(v.week)
                            }
                            if (this.activeDateType === 'month') {
                                this.option.xAxis[0].data.push(v.month)
                            }
                            if (this.activeDateType === 'year') {
                                this.option.xAxis[0].data.push(v.year)
                            }
                            this.option.series[0].data.push(v.total)
                            this.option.series[1].data.push(v.rate)
                        })
                        this.myChart.setOption(this.option)
                        this.myChart.hideLoading()
                    } else {
                        myChartId.innerHTML =
                            '<div style="text-align: center;line-height: 400px"  id="noData">No Data</div>'
                        myChartId.removeAttribute('_echarts_instance_')
                    }
                },
                err => {
                    this.$message.error(err.message)
                    this.myChart.hideLoading()
                }
            )
    }

    private activeDateType: string = 'day'

    changeRange(type) {
        this.activeDateType = type
        this.fetchData(this.queryData)
    }

    private myChart: any = null //echarts实例

    private init() {
        let myChartId = document.getElementById('barMap') as HTMLElement
        myChartId.innerHTML =
            "<div style='text-align: center;line-height: 400px' id='noData'>No Data</div>"
        myChartId.removeAttribute('_echarts_instance_')
    }

    /**
     * 导出pdf
     */
    private exportPdf() {
        htmlToPdf.downloadPDF(
            document.getElementById('cpBarGraph'),
            '客诉发生趋势'
        )
    }

    @Watch('queryData')
    getData(val) {
        let queryData: any = JSON.parse(JSON.stringify(val))

        if (queryData.query_condition.length) {
            this.fetchData(queryData)
        }
    }
}
</script>

<i18n>
{
    "en-us": {
        "noData": "No Data",
        "byDay": "By Day",
        "byWeek": "By Week",
        "byMonth": "By Month",
        "byYear": "By Year",
        "export": "Export Graph",
        "trend": "Trend Of Customer Complaints"
    },
    "zh-cn": {
        "noData": "暂无数据",
        "byDay": "按天",
        "byWeek": "按周",
        "byMonth": "按月",
        "byYear": "按年",
        "export": "导出图表",
        "trend": "客诉发生趋势"
    }
}
</i18n>
