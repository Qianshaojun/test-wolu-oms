<template>
    <section class="component customer-detail">
        <div>
            <a-button size="small" @click="addRule">新增</a-button>

            <data-table :data="ruleData" rowKey="index" :scroll="{ y: 400 }">
                <a-table-column
                    :title="$t('columns.search_display_name')"
                    data-index="search_display_name"
                    key="search_display_name"
                    align="left"
                    width="10%"
                >
                    <template slot-scope="search_display_name, row">
                        <a-input
                            :value="search_display_name"
                            @change="
                                e =>
                                    onInputChange(e, row, 'search_display_name')
                            "
                            size="small"
                        />
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.query_condition')"
                    data-index="query_condition"
                    key="query_condition"
                    align="center"
                    width="50%"
                >
                    <template slot-scope="query_condition, row">
                        {{ query_condition }}

                        <a @click="editCondtion(row)"><a-icon type="edit"/></a>
                        <!-- <a-textarea
                            :value="query_condition"
                            @change="
                                e => onInputChange(e, row, 'query_condition')
                            "
                            :rows="4"
                        /> -->
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.default_search')"
                    data-index="default_search"
                    key="default_search"
                    align="center"
                    width="10%"
                >
                    <template slot-scope="default_search, row">
                        <input
                            type="checkbox"
                            :checked="default_search"
                            @change="
                                e => onInputChange(e, row, 'default_search')
                            "
                            size="small"
                        />
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.sort_order')"
                    data-index="sort_order"
                    key="sort_order"
                    align="center"
                >
                    <template slot-scope="sort_order, row">
                        <a-input-number
                            decimalSeparator=","
                            :value="sort_order"
                            @change="e => onInputChange(e, row, 'sort_order')"
                            :style="{ width: '90px' }"
                            size="small"
                            :min="0"
                        />
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.memo')"
                    data-index="memo"
                    key="memo"
                    align="center"
                >
                    <template slot-scope="memo, row">
                        <a-input
                            :value="memo"
                            @change="e => onInputChange(e, row, 'memo')"
                            :style="{ width: '92px' }"
                            size="small"
                        />
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('action.action')"
                    key="action"
                    align="center"
                    width="60px"
                >
                    <template slot-scope="row">
                        <a-button type="link" @click="onCancel(row)">{{
                            $t('action.delete')
                        }}</a-button>
                    </template>
                </a-table-column>
            </data-table>
        </div>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('action.cancel')
            }}</a-button>
            <a-button type="primary" @click="onSubmit">{{
                $t('action.commit')
            }}</a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { Page } from '~/core/decorators'
import { PageService } from '~/bootstrap/services/page.service'
import PageContainer from '../../shared/components/page-container.vue'
import { SystemService } from '~/services/system.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import ConditionItemEdit from '~/components/basic_manage/condition-item-edit.vue'

@Component({
    components: {}
})
export default class QueryConditionEdit extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {}

    @Prop()
    current: any

    private index: any = 0

    private systemService = new SystemService()
    // 表格数据源
    private ruleData: any[] = []

    private created() {
        this.getQueryConditionDetail()
    }

    private getQueryConditionDetail() {
        this.systemService
            .queryFixedSearchConditionByMenuCode(
                new RequestParams({
                    menu_code: this.current.menu_code
                })
            )
            .subscribe(data => {
                this.ruleData = data
            })
    }

    private addRule() {
        let ruleParam = {
            search_display_name: '',
            query_condition: '',
            default_search: false,
            sort_order: 0,
            memo: '',
            is_share: false,
            index: ++this.index
        }
        this.ruleData.push(ruleParam)
    }

    private onSubmit() {
        let condition_list = this.ruleData.map(x => {
            let item = x
            delete item['index']
            return item
        })
        this.systemService
            .batchCreateSearchCondition(
                new RequestParams({
                    menu_code: this.current.menu_code,
                    condition_list: this.ruleData
                })
            )
            .subscribe(
                () => {
                    this.submit()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    /**
     * 单元格编辑
     */
    private onInputChange(e, row, column) {
        const data = [...this.ruleData]
        let target: any
        if (row.index) {
            target = data.filter(item => row.index === item.index)[0]
        } else {
            target = data.filter(
                item => row.search_code === item.search_code
            )[0]
        }

        if (target) {
            if (
                Object.prototype.toString.call(e) === '[object InputEvent]' ||
                Object.prototype.toString.call(e) === '[object Event]' ||
                Object.prototype.toString.call(e) === '[object Object]'
            ) {
                if (e.target.type == 'checkbox') {
                    target[column] = e.target.checked
                } else {
                    target[column] = e.target.value
                }
            } else {
                target[column] = e
            }

            this.ruleData = data
        }
    }
    /**
     * 取消编辑数据
     */
    private onCancel(row) {
        if (row.index) {
            this.ruleData = this.ruleData.filter(x => x.index !== row.index)
        } else {
            this.ruleData = this.ruleData.filter(
                x => x.search_code !== row.search_code
            )
        }
    }

    private editCondtion(row) {
        this.$modal
            .open(
                ConditionItemEdit,
                {
                    info: row.query_condition
                },
                {
                    title: '编辑条件查询',
                    width: '60%'
                }
            )
            .subscribe(data => {
                row.query_condition = data
            })
    }
}
</script>

<i18n>
{
  "en-us": {
    "desc": "",
    "columns":{
        "search_display_name":"search_display_name",
        "query_condition":"query_condition",
        "default_search":"default_search",
        "sort_order":"sort_order",
        "memo":"memo"
    },
      "action":{
        "create":"Create",
        "edit":"Edit",
        "delete":"Delete",
        "ok":"Ok",
        "cancel":"Cancel",
        "commit":"Commit"
    }
  },
  "zh-cn": {
    "desc": "",
    "columns":{
        "search_display_name":"查询显示名",
        "query_condition":"查询条件",
        "default_search":"默认查询",
        "sort_order":"排序",
        "memo":"备注"
    },
    "action":{
      "create":"新建",
      "edit":"编辑查询条件",
      "delete":"删除",
      "ok":"确定",
      "cancel":"取消",
      "commit":"提交"
    }
  }
}
</i18n>
