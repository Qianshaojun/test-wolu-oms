<template>
    <section class="component order-product-detail" :style="{ height: 'auto' }">
        <label>分组条件：</label>
        <a-select
            v-decorator="['condition', { initialValue: defaultCondition }]"
            :style="{ width: '100px' }"
            size="small"
            @change="e => onConditionChange(e)"
        >
            <a-select-option value>取消分组</a-select-option>
            <a-select-option
                :value="item.key"
                v-for="item of conditions"
                :key="item.key"
                >{{ $t(item.name) }}</a-select-option
            >
        </a-select>
        <a-table
            v-if="!showHz"
            rowKey="key"
            :data-source="data"
            :pagination="false"
        >
            <a-table-column
                title="name"
                key="name"
                data-index="name"
                align="center"
                width="20%"
            ></a-table-column>
            <a-table-column
                title="class"
                key="class"
                data-index="class"
                align="center"
                width="20%"
            ></a-table-column>
            <a-table-column
                title="score"
                key="score"
                data-index="score"
                align="center"
                width="20%"
            ></a-table-column>
            <a-table-column
                title="score2"
                key="score2"
                data-index="score2"
                align="center"
                width="20%"
            ></a-table-column>
            <a-table-column
                title="sex"
                key="sex"
                data-index="sex"
                align="center"
                width="20%"
            ></a-table-column>
        </a-table>
        <a-table
            v-else
            :dataSource="hzData"
            :pagination="false"
            style="table-layout:fixed;"
            rowKey="key"
            class="components-table-demo-nested"
            bordered
            :showHeader="false"
        >
            <a-table-column title="名称" key="name" align="left" width="100%">
                <template slot-scope="row">
                    {{ row.name }}
                </template>
            </a-table-column>
            <a-table
                v-if="showHz"
                slot="expandedRowRender"
                slot-scope="record"
                rowKey="key"
                :data-source="hzData.find(x => x.key === record.key).chirdren"
                :pagination="false"
            >
                <a-table-column
                    title="name"
                    key="name"
                    data-index="name"
                    align="center"
                    width="20%"
                ></a-table-column>
                <a-table-column
                    title="class"
                    key="class"
                    data-index="class"
                    align="center"
                    width="20%"
                ></a-table-column>
                <a-table-column
                    title="score"
                    key="score"
                    data-index="score"
                    align="center"
                    width="20%"
                ></a-table-column>
                <a-table-column
                    title="score2"
                    key="score2"
                    data-index="score2"
                    align="center"
                    width="20%"
                ></a-table-column>
                <a-table-column
                    title="sex"
                    key="sex"
                    data-index="sex"
                    align="center"
                    width="20%"
                ></a-table-column>
            </a-table>
        </a-table>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Table } from 'ant-design-vue'
@Component({
    components: {}
})
export default class TestTable extends Vue {
    private data: any[] = []

    private hzData: any[] = []

    private innerData: any[] = []

    private currentKey: any = ''

    private conditions: any[] = []

    private showHz: any = false

    private defaultCondition: any = ''

    private mounted() {
        this.data = [
            {
                key: 1,
                name: '张三',
                class: '一班',
                score: 23,
                score2: 32,
                sex: 'M'
            },
            {
                key: 2,
                name: '李四',
                class: '一班',
                score: 35,
                score2: 24,
                sex: 'F'
            },
            {
                key: 3,
                name: '王五',
                class: '二班',
                score: 23,
                score2: 25,
                sex: 'M'
            }
        ]

        this.conditions = [
            {
                key: 1,
                name: 'class',
                items: [
                    {
                        column: 'score',
                        rule: 'avg'
                    },
                    {
                        column: 'score2',
                        rule: 'sum'
                    }
                ]
            },
            {
                key: 2,
                name: 'sex',
                items: [
                    {
                        column: 'score',
                        rule: 'avg'
                    },
                    {
                        column: 'score2',
                        rule: 'sum'
                    }
                ]
            }
        ]

        this.huizong()
    }

    private onConditionChange(e) {
        this.defaultCondition = e
        if (e === '') {
            this.showHz = false
        } else {
            this.showHz = true
        }
        this.huizong()
    }

    private huizong() {
        this.hzData = []
        if (!this.defaultCondition) {
            return
        }
        let condition = this.conditions.find(
            x => x.key === this.defaultCondition
        )
        let hzItem = condition.name
        let newData: any[] = []
        for (var i of this.data) {
            let keyName = i[hzItem]
            if (!newData[keyName]) {
                newData[keyName] = {}
                newData[keyName]['chirdren'] = []
            }

            newData[keyName]['chirdren'].push(i)

            for (var cdt of condition.items) {
                let ruleName = cdt.column
                if (!newData[keyName][ruleName]) {
                    newData[keyName][ruleName] = parseFloat(i[ruleName])
                } else {
                    newData[keyName][ruleName] += parseFloat(i[ruleName])
                }
            }
        }

        for (let x in newData) {
            newData[x]['key'] = x
            newData[x]['name'] = x
            for (var cd of condition.items) {
                newData[x]['name'] += '  ' + cd.column + '(' + cd.rule + ':'
                if (cd.rule === 'avg') {
                    let avg = newData[x][cd.column] / newData[x].chirdren.length
                    newData[x]['name'] += avg.toFixed(2) + ')'
                } else {
                    newData[x]['name'] += newData[x][cd.column] + ')'
                }
            }

            newData[x]['name'] += '  total(' + newData[x].chirdren.length + ')'

            this.hzData.push(newData[x])
        }
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
