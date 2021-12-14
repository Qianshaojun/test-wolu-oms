<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 16, offset: 2 }"
        >
            <a-row :gutter="24">
                <a-col :span="20" v-show="warehouse">
                    <a-form-item label="ID">
                        <a-input
                            v-decorator="[`id`]"
                            placeholder="ID"
                            size="small"
                            style="width: 200px;"
                            :disabled="!!warehouse"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item
                        :label="$t('columns.access_rule_name')"
                        required
                    >
                        <a-input
                            v-decorator="[
                                `access_rule_name`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            placeholder=""
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item
                        :label="$t('columns.access_rule_type')"
                        required
                    >
                        <a-select
                            v-decorator="[
                                `access_rule_type`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            style="width: 200px"
                            :placeholder="$t('columns.access_rule_type')"
                        >
                            <a-select-option :value="10">10</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.priority')" required>
                        <a-input-number
                            v-decorator="[
                                `priority`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            placeholder=""
                            :min="0"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.table_name')" required>
                        <a-input
                            v-decorator="[
                                `table_name`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            placeholder=""
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.access_condition')">
                        <p>
                            {{ access_condition }}
                            <a @click="editCondtion(access_condition)"
                                ><a-icon type="edit"
                            /></a>
                        </p>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('cancel')
            }}</a-button>
            <a-button type="primary" @click="onSubmit">{{
                $t('submit')
            }}</a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import moment from 'moment'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { SystemService } from '../../services/system.service'
import { CommonService } from '@/shared/utils/common.service'
import { formConfig } from '@/config/form.config'
import ConditionItemEdit from '~/components/basic_manage/condition-item-edit.vue'

@Component({
    components: {
        ConditionItemEdit
    }
})
export default class DataAccessRuleEdit extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private warehouse

    @Prop()
    private saveFlag

    private systemService = new SystemService()
    // 分页服务
    private pageService = new PageService()

    private loadingService = new LoadingService()

    private form: any

    private subSystemList: any[] = []

    private modelList: any[] = []

    private subModelList: any[] = []

    private access_condition: any = ''

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public mounted() {
        if (this.warehouse) {
            this.access_condition = this.warehouse.access_condition
            this.setFormValues()
        }
    }

    public setFormValues() {
        this.form.setFieldsValue(this.warehouse)
    }

    private created() {
        this.form = this.$form.createForm(this)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['save_flag'] = this.saveFlag
                values['access_condition'] = this.access_condition
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        this.systemService
            .save_data_access_rule(
                new RequestParams(data, { loading: this.loadingService })
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

    private editCondtion(row) {
        this.$modal
            .open(
                ConditionItemEdit,
                {
                    info: this.access_condition
                },
                {
                    title: '编辑规则条件',
                    width: '60%'
                }
            )
            .subscribe(data => {
                this.access_condition = data
            })
    }
}
</script>

<i18n>
{
  "en-us":{
      "submit": "Submit",
      "cancel": "Cancel",
      "columns": {
        "access_rule_name": "Access Rule Name",
        "access_rule_type": "Access Rule Type",
        "active": "Active",
        "access_condition": "Access Condition",
        "table_name": "Table Name",
        "priority": "Priority"
    }
  },
  "zh-cn":{
      "submit": "提交",
      "cancel": "取消",
       "columns":{    
         "access_rule_name": "规则名称",
         "access_rule_type": "规则类型",
         "active": "激活",
         "access_condition": "规则内容",
         "table_name": "数据表名",
         "priority": "优先级"
    }
  }
}
</i18n>
