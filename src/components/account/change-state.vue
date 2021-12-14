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
                    <a-form-item label="Invoice ID">
                        <a-input
                            :value="invoice.id"
                            style="width: 300px"
                            disabled
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="State">
                        <a-select
                            v-decorator="[
                                'state',
                                { initialValue: invoice.state }
                            ]"
                            style="width: 200px"
                        >
                            <a-select-option key="draft" value="draft"
                                >Draft</a-select-option
                            >
                            <a-select-option key="open" value="open"
                                >Open</a-select-option
                            >
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">取消</a-button>
            <a-button type="primary" @click="onSubmit">提交</a-button>
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { UserService } from '~/services/user.service'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'

@Component({
    components: {}
})
export default class ChangeState extends Vue {
    @Emit('modal.submit')
    private submit(values) {
        return values
    }

    @Emit('modal.cancel')
    private cancel() {}

    @Prop()
    private invoice

    private form: any

    private userService = new UserService()

    public mounted() {}

    public created() {
        this.form = this.$form.createForm(this)
    }

    public setFormValues() {
        this.form.setFieldsValue(this.invoice)
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
            "code":"WareHouse Code",
            "name":"Customer Info"
      }
  },
  "zh-cn":{
       "columns":{    
           "code":"仓库编码",
           "name":"仓库名称"
      }
  }
}
</i18n>
