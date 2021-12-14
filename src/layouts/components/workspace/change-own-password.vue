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
                    <a-form-item :label="$t('old_password')" required>
                        <a-input
                            v-decorator="[
                                `old_password`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            :placeholder="$t('old_password')"
                            type="password"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('new_password')" required>
                        <a-input
                            v-decorator="[
                                `new_password`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            :placeholder="$t('new_password')"
                            type="password"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('confirm_new_password')" required>
                        <a-input
                            v-decorator="[
                                `confirm_password`,
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: $t('old_password')
                                        },
                                        {
                                            validator: compareToFirstPassword
                                        }
                                    ]
                                }
                            ]"
                            :placeholder="$t('confirm_new_password')"
                            type="password"
                            size="small"
                            style="width: 200px;"
                        />
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
import { RequestParams } from '../../../core/http'
import { Form } from 'ant-design-vue'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '../../../bootstrap/services/loading.service'
import { SystemService } from '../../../services/system.service'

@Component({
    components: {}
})
export default class ChangeOwnPassword extends Vue {
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
        required: [{ required: true, message: 'Required' }]
    }

    private compareToFirstPassword(rule, value, callback) {
        const form = this.form
        if (value && value !== form.getFieldValue('new_password')) {
            callback(this.$t('difference_two_password'))
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
            .changeOwnPassword(
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
      },
      "old_password":"Old PWD",
      "new_password":"New PWD",
      "confirm_new_password":"Confirm PWD",
      "difference_two_password":"Two passwords do not match.",
      "submit":"Confirm",
      "cancel":"Cancel"
  },
  "zh-cn":{
       "columns":{    
           "code":"仓库编码",
           "name":"仓库名称"
      },
      "old_password":"旧密码",
      "new_password":"新密码",
      "confirm_new_password":"确认密码",
      "difference_two_password":"两个密码不匹配",
      "submit":"确认",
      "cancel":"取消"
  }
}
</i18n>
