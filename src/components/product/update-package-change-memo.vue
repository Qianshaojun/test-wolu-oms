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
                    <a-form-item :label="$t('columns.package_name')">
                        <a-input
                            v-decorator="['package_name']"
                            disabled
                        ></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="22">
                    <a-form-item :label="$t('columns.memo')">
                        <a-textarea
                            v-decorator="['note_text']"
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
import { CommonService } from '@/shared/utils/common.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { PublicService } from '@/services/public.service'
import { LoadingService } from '@/bootstrap/services/loading.service'

@Component({
    components: {}
})
export default class UpdatePackageChangeMemo extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {}

    @Prop()
    private params

    @Prop()
    private userList

    private form: any

    private userService = new UserService()
    private innerActionService = new InnerActionService()
    private publicService = new PublicService()
    // Loading服务
    private loadingService = new LoadingService()

    public mounted() {
        this.setFormValues()
    }

    public created() {
        this.form = this.$form.createForm(this)
    }

    public setFormValues() {
        console.log(this.params)
        this.form.setFieldsValue(this.params)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                this.saveParams(values)
            }
        })
    }

    private saveParams(params) {
        this.innerActionService.setActionAPI(
            'purchase_management/save_package_product_monitor_list',
            CommonService.getMenuCode('package-chang-sku-monitor')
        )
        this.publicService
            .modify(
                new RequestParams(params, {
                    loading: this.loadingService,
                    innerAction: this.innerActionService
                })
            )
            .subscribe(
                data => {
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
            "meno":"Memo",
            "package_name":"Pachage Name"
      }
  },
  "zh-cn":{
       "columns":{    
           "memo":"备注",
            "package_name":"货柜号"
      }
  }
}
</i18n>
