<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 17, offset: 1 }"
        >
            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item :label="$t('columns.template_name')" required>
                        <a-input
                            v-decorator="[
                                `template_name`,
                                {
                                    rules: rules.companyName
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('action.cancel')
            }}</a-button>
            <a-button type="primary" @click="onSubmit">{{
                $t('action.submit')
            }}</a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'

@Component({
    components: {}
})
export default class SaveEmailTemplate extends Vue {
    @Emit('modal.submit')
    private submit(values) {
        return values
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private customer

    private form: any

    private rules = {
        companyName: [{ required: true, message: '请填写模板名称' }]
    }

    public mounted() {
        if (this.customer) {
            this.setFormValues()
        }
    }

    public setFormValues() {
        this.form.setFieldsValue(this.customer)
    }

    public created() {
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
        "columns":{
            "template_name":"Template Name",
            "name":"Customer Info"
        },
        "action":{
            "submit":"Submit",
            "cancel":"Cancel"
        }
    },
    "zh-cn":{
        "columns":{    
            "template_name":"模板名称",
            "name":"仓库名称"
        },
        "action":{
            "submit":"提交",
            "cancel":"取消"
        }
  }
}
</i18n>
