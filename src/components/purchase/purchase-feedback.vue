<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 16, offset: 2 }"
        >
            <a-form-item :label="$t('columns.purchase_feedback')" required>
                <a-textarea
                    v-decorator="[
                        `purchase_feedback`,
                        { rules: rules.required }
                    ]"
                    size="small"
                >
                </a-textarea>
            </a-form-item>
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
export default class PurchaseFeedback extends Vue {
    @Emit('modal.submit')
    private submit(value) {
        return value.purchase_feedback
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
          "purchase_feedback":"FeedBack"

    }
  },
  "zh-cn":{
       "submit": "提交",
       "cancel": "取消",
       "columns":{    
            "purchase_feedback":"反馈"

        }
  }
}
</i18n>
