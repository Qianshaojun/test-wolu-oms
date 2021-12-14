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
                <a-col :span="20" v-show="!!warehouse">
                    <a-form-item label="角色编码">
                        <a-input
                            v-decorator="[`role_code`]"
                            placeholder="角色编码"
                            size="small"
                            style="width: 200px;"
                            :disabled="!!warehouse"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="角色名称" required>
                        <a-input
                            v-decorator="[
                                `role_name`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            placeholder="角色名称"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="英文名称" required>
                        <a-input
                            v-decorator="[
                                `role_name_eng`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            placeholder="英文名称"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="角色分组" required>
                        <a-input
                            v-decorator="[
                                `role_catg`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            placeholder="角色分组"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="优先级">
                        <a-input-number
                            v-decorator="[`role_priority`]"
                            :default-value="0"
                            size="small"
                            style="width: 120px;"
                            :min="0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="备注">
                        <a-textarea
                            v-decorator="[`memo`]"
                            placeholder="备注"
                            size="small"
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
export default class AddRole extends Vue {
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

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public mounted() {
        this.setFormValues()
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
                if (!this.saveFlag) {
                    values['role_code'] = ''
                }
                values['status'] = 20
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        this.systemService
            .saveRole(new RequestParams(data, { loading: this.loadingService }))
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
