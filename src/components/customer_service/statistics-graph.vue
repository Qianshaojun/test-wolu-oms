<template>
    <div>
        <statistics-pie-chart :query-data="queryData"></statistics-pie-chart>
        <statistics-bar-chart :query-data="queryData"></statistics-bar-chart>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Page } from '@/core/decorators'
import statisticsPieChart from './statistics-pie-chart.vue'
import statisticsBarChart from './statistics-bar-chart.vue'

@Page({
    layout: 'workspace',
    name: 'statistics-graph'
})
@Component({
    components: {
        statisticsPieChart,
        statisticsBarChart
    }
})
export default class statisticsGraph extends Vue {
    @Prop()
    queryData: any
}
</script>

<style lang="less">
.activeDate {
    color: #1890ff;
}

.cardTitle {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 16px !important;
}

.cardTitleDesc {
    color: rgba(0, 0, 0, 0.85);
    font-size: 13px !important;
    margin-left: 100px;

    span {
        cursor: pointer;
    }

    span:hover {
        color: #1890ff;
    }

    span + span {
        margin-left: 20px;
    }
}

._30Width {
    width: 33%;
    text-align: center;
}

.title {
    font-size: 16px !important;
    color: gray;
}

.desc {
    font-size: 18px !important;
    font-weight: bolder;

    color: black;
}
</style>

<i18n>
{
    "en-us": {
    },
    "zh-cn": {}
}
</i18n>
