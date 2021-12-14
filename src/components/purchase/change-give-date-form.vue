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
                <a-col :span="20">
                    <a-form-item :label="$t('columns.change_give_date')">
                        <a-date-picker
                            v-decorator="[`change_give_date`]"
                            format="YYYY-MM-DD"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item
                        :label="$t('columns.change_give_date_memo')"
                        required
                    >
                        <a-textarea
                            v-decorator="[
                                `change_give_date_memo`,
                                { rules: rules.required }
                            ]"
                            size="small"
                        >
                        </a-textarea>
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

@Component({
    components: {}
})
export default class ChangeGiveDateForm extends Vue {
    @Emit('modal.submit')
    private submit(value) {
        return value
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    private form: any

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private created() {
        this.form = this.$form.createForm(this)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                this.submit(values)
            }
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
          "change_give_date":"Change Give Date",
          "change_give_date_memo":"Change Give Date Memo"
    }
  },
  "zh-cn":{
       "submit": "提交",
       "cancel": "取消",
       "columns":{    
            "change_give_date":"修改交期",
            "change_give_date_memo":"修改交期说明"
        }
  }
}
</i18n>
