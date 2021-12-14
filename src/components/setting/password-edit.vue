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
                    <a-form-item label="原密码" required>
                        <a-input
                            v-decorator="[
                                `old_password`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            placeholder="原密码"
                            type="password"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="新密码" required>
                        <a-input
                            v-decorator="[
                                `new_password`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            placeholder="新密码"
                            type="password"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="确认密码" required>
                        <a-input
                            v-decorator="[
                                `confirm_password`,
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入确认密码'
                                        },
                                        {
                                            validator: compareToFirstPassword
                                        }
                                    ]
                                }
                            ]"
                            placeholder="确认密码"
                            type="password"
                            size="small"
                            style="width: 200px;"
                        />
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
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { SystemService } from '../../services/system.service'

@Component({
    components: {}
})
export default class UserEdit extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private user

    @Prop()
    private saveFlag

    private systemService = new SystemService()
    // 分页服务
    private pageService = new PageService()

    private loadingService = new LoadingService()

    private form: any

    private company_account: any = false

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private compareToFirstPassword(rule, value, callback) {
        const form = this.form
        if (value && value !== form.getFieldValue('new_password')) {
            callback('两次输入密码不一致')
        } else {
            callback()
        }
    }

    public mounted() {
        if (this.user) {
            this.setFormValues()
        }
    }

    public setFormValues() {
        this.form.setFieldsValue(this.user)
    }

    private created() {
        this.form = this.$form.createForm(this)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                delete values['confirm_password']
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        data['user_id'] = this.user.user_id
        this.systemService
            .changeUserPassword(
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
