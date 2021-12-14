<template>
    <section
        class="component order-product-detail"
        :style="{ height: divHeight + 'px', 'overflow-y': 'auto' }"
    >
        <a-table
            :dataSource="data"
            :pagination="false"
            style="table-layout:fixed;"
            rowKey="index"
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
            <a-table-column :title="$t('date')" key="log_date" align="center">
                <template slot-scope="row"
                    >{{ row.log_date | datetolocal }}
                </template>
            </a-table-column>
        </a-table>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({
    components: {}
})
export default class OrderLogDetail extends Vue {
    @Prop()
    private info

    @Prop()
    private height

    @Prop()
    private systemUsers

    private divHeight: any = 100

    @Watch('height')
    private onHeightChange() {
        this.divHeight = this.height
    }

    private data: any[] = []

    private mounted() {
        this.data = this.info
            .map((x, i) => {
                x['index'] = i + 1
                return x
            })
            .sort(this.compare('log_date'))

        this.divHeight = this.height
    }

    @Watch('info')
    private onInfoChange() {
        this.data = this.info
            .map((x, i) => {
                x['index'] = i + 1
                return x
            })
            .sort(this.compare('log_date'))
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
}
</script>

<i18n>
{
    "en-us": {
        "log": "Log",
        "type": "Type",
        "operater": "Operater",
        "date": "Date"
    },
    "zh-cn": {
        "log": "日志",
        "type": "类型",
        "operater": "操作人",
        "date": "日期"
    }
}
</i18n>