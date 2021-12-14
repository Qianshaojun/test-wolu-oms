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
                    <a-form-item label="当前角色">
                        <a-input
                            v-decorator="[`role_name`]"
                            size="small"
                            style="width: 200px;"
                            :disabled="true"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="用户" required>
                        <a-select
                            v-decorator="['user_id', { initialValue: '' }]"
                            size="small"
                            style="width: 200px;"
                            showSearch
                            :filterOption="filterSelectOption"
                        >
                            <a-select-option value="" key="">
                                --请选择--
                            </a-select-option>
                            <a-select-option
                                :value="item.id"
                                v-for="item of userList"
                                :key="item.id"
                            >
                                {{ $t(item.login) }}
                            </a-select-option>
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
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { SystemService } from '../../services/system.service'

@Component({
    components: {}
})
export default class AddRoleUser extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private info

    private systemService = new SystemService()
    // 分页服务
    private pageService = new PageService()

    private loadingService = new LoadingService()

    private form: any

    private userList: any[] = []

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public mounted() {
        this.setFormValues()
    }

    public setFormValues() {
        this.form.setFieldsValue(this.info)
    }

    private created() {
        this.getUserList()
        this.form = this.$form.createForm(this)
    }

    private getUserList() {
        this.systemService
            .queryRoleNeedAddUser(
                new RequestParams({ role_code: this.info.role_code })
            )
            .subscribe(
                data => {
                    this.userList = data
                },
                err => {
                    this.$message.error('获取用户失败！')
                }
            )
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['role_code'] = this.info.role_code
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        this.systemService
            .addRoleUser(
                new RequestParams(
                    {
                        role_code: this.info.role_code,
                        user_id_list: [data.user_id]
                    },
                    { loading: this.loadingService }
                )
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

    private filterSelectOption(input, option) {
        if (this.userList.length) {
            return (
                option.componentOptions.children[0].text
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
            )
        }
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
