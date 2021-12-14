<template>
    <section>
        <data-form
            ref="dataForm"
            @submit="getDataList"
            :column="2"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 16, offset: 1 }"
            :pageName="pageName"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        v-decorator="['default_code']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
            </template>
        </data-form>
        <a-card class="margin-y" style="margin:0 !important;">
            <AutoColumnTable
                :stripe="true"
                :data="data"
                :page="pageService"
                :queryNameAuth="allNameAuth"
                rowKey="id"
                :columns="columnList"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getDataList"
                @onClick="
                    record => {
                        selectedRowKeys = [record]
                    }
                "
                @tbchange="onTableChange"
                :scroll="{ x: 2000, y: 400 }"
            >
                <span slot="check_render" slot-scope="text"
                    ><a-checkbox disabled :checked="text" />
                </span>
                <span slot="show_message_tips" slot-scope="text" :title="text">
                    {{
                        text
                            ? text.length > 20
                                ? text.substr(0, 17) + '...'
                                : text
                            : ''
                    }}
                </span>
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
            </AutoColumnTable>
        </a-card>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import PageContainer from '../../shared/components/page-container.vue'
import AutoColumnTable from '../../shared/components/auto-column-table.vue'
import { PageService } from '../../bootstrap/services/page.service'

@Page({
    layout: 'workspace',
    name: 'list-page-content'
})
@Component({
    components: {
        AutoColumnTable
    }
})
export default class ListPageContent extends Vue {
    @Ref()
    readonly pageContainer!: PageContainer

    @Prop()
    pageName: any

    private pageService = new PageService()

    // 表格数据源
    private page_flag: any = ''

    private orderBy: any = ''

    private data: any = []

    private allNameAuth: any = []
    private columnList: any = []
    private selectedRowKeys: any = []

    private created() {}

    private mounted() {
        // console.log(this.pageName)
    }

    private getDataList() {}

    private onTableChange(pagination, filters, sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getDataList()
    }
}
</script>

<i18n>
{
  "en-us": {
    "no": "no",
    "desc": "this is a Order Page1"
  },
  "zh-cn": {
    "no": "无",      
    "desc": "这是订单页面1"
  }
}
</i18n>
