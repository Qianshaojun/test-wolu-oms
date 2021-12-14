<template>
    <section class="component edit-customer">
        <a-table
            :dataSource="list"
            :pagination="false"
            style="table-layout:fixed;"
            rowKey="sku"
            bordered
        >
            <a-table-column
                :title="$t('columns.manual_code')"
                key="manual_code"
                width="15%"
                align="center"
            >
                <template slot-scope="row">{{ row.manual_code }}</template>
            </a-table-column>

            <a-table-column
                :title="$t('columns.view')"
                key="manual_url"
                width="6%"
                align="center"
            >
                <template slot-scope="row"
                    ><a
                        :href="row.manual_url"
                        target="_blank"
                        v-if="row.manual_url"
                        ><a-icon type="download"
                    /></a>
                    <span v-else></span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('columns.manual_version')"
                key="manual_version"
                width="10%"
                align="center"
            >
                <template slot-scope="row">{{ row.manual_version }}</template>
            </a-table-column>

            <a-table-column title="SKU" key="sku" width="15%" align="center">
                <template slot-scope="row">{{ row.sku }}</template>
            </a-table-column>
            <a-table-column
                :title="$t('columns.cn_category')"
                key="cn_category"
                width="15%"
                align="center"
            >
                <template slot-scope="row">{{ row.cn_category }}</template>
            </a-table-column>
            <a-table-column
                :title="$t('columns.cn_sub_category')"
                key="cn_sub_category"
                align="center"
                width="15%"
            >
                <template slot-scope="row">
                    {{ row.cn_sub_category }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('columns.import_date')"
                key="import_date"
                :sorter="true"
                width="14%"
                align="center"
            >
                <template slot-scope="row">
                    {{ row.import_date | datetolocal }}
                </template>
            </a-table-column>
        </a-table>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">关闭</a-button>
            <!-- <a-button type="primary" @click="onSubmit">提交</a-button> -->
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'

@Component({
    components: {}
})
export default class ManualDetail extends Vue {
    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private list
}
</script>

<i18n>
{
  "en-us":{
      "columns":{
       "manual_code":"Manual Code",
       "manual_version":"Manual Version",
       "seller_id":"Seller Name",    
       "actions":"Actions",
       "view":"View",
       "cn_category":"Category",
       "cn_sub_category":"Sub Category",
       "import_date":"Import Date"
    }
  },
  "zh-cn":{
       "columns":{
       "manual_code":"说明书编号",
       "manual_version":"说明书版本",
       "time":"创建时间",
       "actions":"操作",
       "view":"查看",
       "cn_category":"分类",
       "cn_sub_category":"子类",
       "import_date":"导入日期"
    }
  }
}
</i18n>
