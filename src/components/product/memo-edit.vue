<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 2 }"
            :wrapperCol="{ span: 21, offset: 1 }"
        >
            <a-row :gutter="24">
                <a-col :span="22">
                    <a-form-item :label="$t('memo')">
                        <a-textarea
                            v-decorator="['memo']"
                            rows="6"
                        ></a-textarea>
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
export default class MemoEdit extends Vue {
    @Emit('modal.submit')
    private submit(values) {
        return values
    }

    @Emit('modal.cancel')
    private cancel() {}

    @Prop()
    private tickets

    @Prop()
    private userList

    private form: any

    private userService = new UserService()

    public mounted() {}

    public created() {
        this.form = this.$form.createForm(this)
    }

    public setFormValues() {
        this.form.setFieldsValue(this.tickets)
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
