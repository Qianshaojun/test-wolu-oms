<template>
    <section class="component customer-detail">
        <a-tabs defaultActiveKey="log">
            <a-tab-pane :tab="$t('log')" key="log">
                <a-table
                    :dataSource="detail"
                    style="table-layout:fixed;"
                    rowKey="index"
                    :scroll="{ y: 300 }"
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
            <!-- <a-tab-pane :tab="$t('product')" key="product">
                33
            </a-tab-pane> -->
        </a-tabs>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component({
    components: {}
})
export default class ServerCustomerMapDetail extends Vue {
    @Prop()
    detail: any
}
</script>

<i18n>
{
  "en-us":{
    "log":"Log",
    "columns":{
       "log_content":"log_content",
       "log_type":"log_type",
       "who_log":"who_log",
       "log_date":"log_date"
    }
  },
  "zh-cn":{
    "log":"日志",
    "columns":{
       "log_content":"日志",
       "log_type":"类型",
       "who_log":"操作人",
       "log_date":"日期"
    }
  }
}
</i18n>
