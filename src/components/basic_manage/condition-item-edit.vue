<template>
    <section class="component customer-detail">
        <div>
            <a-button size="small" @click="addRule" style="margin-left: 10px"
                >新增
            </a-button>

            <data-table :data="ruleData" rowKey="index">
                <a-table-column
                    :title="$t('columns.query_name')"
                    data-index="query_name"
                    key="query_name"
                    align="left"
                    width="30%"
                >
                    <template slot-scope="query_name, row">
                        <a-input
                            :value="query_name"
                            @change="e => onInputChange(e, row, 'query_name')"
                            size="small"
                        />
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.operate')"
                    data-index="operate"
                    key="operate"
                    align="center"
                    width="20%"
                >
                    <template slot-scope="operate, row">
                        <a-select
                            :value="operate"
                            v-decorator="[`operate`]"
                            style="width: 100%"
                            placeholder="Please select"
                            size="small"
                            @change="e => onInputChange(e, row, 'operate')"
                        >
                            <a-select-option
                                :value="item.value"
                                v-for="item in $dict.Operators"
                                :key="item.value"
                            >
                                {{ item.label }}
                            </a-select-option>
                        </a-select>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.value')"
                    data-index="value"
                    key="value"
                    align="center"
                    width="40%"
                >
                    <template slot-scope="value, row">
                        <a-input
                            :value="value"
                            @change="e => onInputChange(e, row, 'value')"
                            size="small"
                        />
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('action.action')"
                    key="action"
                    align="center"
                    width="10%"
                >
                    <template slot-scope="row">
                        <a-button type="link" @click="onCancel(row)"
                            >{{ $t('action.delete') }}
                        </a-button>
                    </template>
                </a-table-column>
            </data-table>
        </div>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel"
                >{{ $t('action.cancel') }}
            </a-button>
            <a-button type="primary" @click="onSubmit"
                >{{ $t('action.commit') }}
            </a-button>
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
import UUID from 'uuidjs'

@Component({
    components: {}
})
export default class ConditionItemEdit extends Vue {
    @Emit('modal.submit')
    private submit(params) {
        return params
    }

    @Emit('modal.cancel')
    private cancel() {}

    @Prop()
    info: any

    private index: any = 0
    // 表格数据源
    private ruleData: any[] = []

    private mounted() {
        if (this.info) {
            let data = JSON.parse(this.info)
            this.ruleData = data.map(x => {
                if (typeof x.value == 'object') {
                    x.value = JSON.stringify(x.value)
                }
                x.index = UUID.generate()
                return x
            })
        }
    }

    private addRule() {
        let ruleParam = {
            query_name: '',
            operate: '=',
            value: '',
            index: UUID.generate()
        }
        this.ruleData.push(ruleParam)
    }

    private onSubmit() {
        let flag = 1
        let condition_list = this.ruleData.map(x => {
            // try {
            //     if (x.value.includes('[') && x.value.includes(']')) {
            //         x.value = eval(x.value)
            //     }
            // } catch (e) {
            //     this.$message.error('请检查输入value是否正确')
            //     flag = 0
            // }

            delete x.index
            return x
        })
        if (flag) {
            this.submit(JSON.stringify(condition_list))
        }
    }

    /**
     * 单元格编辑
     */
    private onInputChange(e, row, column) {
        if (
            Object.prototype.toString.call(e) === '[object InputEvent]' ||
            Object.prototype.toString.call(e) === '[object Event]' ||
            Object.prototype.toString.call(e) === '[object Object]'
        ) {
            row[column] = e.target.value
        } else {
            row[column] = e
        }
    }

    /**
     * 取消编辑数据
     */
    private onCancel(row) {
        this.ruleData = this.ruleData.filter(x => x.index !== row.index)
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "",
        "columns": {
            "query_name": "Query Name",
            "operate": "Operate",
            "value": "Value"
        },
        "action": {
            "create": "Create",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Ok",
            "cancel": "Cancel",
            "commit": "Commit"
        }
    },
    "zh-cn": {
        "desc": "",
        "columns": {
            "query_name": "查询名称",
            "operate": "操作符",
            "value": "值"
        },

        "action": {
            "create": "新建",
            "edit": "编辑查询条件",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "commit": "提交"
        }
    }
}
</i18n>
