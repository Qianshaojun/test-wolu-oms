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
                    <a-form-item label="当前部门">
                        <a-input
                            v-decorator="[`title`]"
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
                                :value="item.code"
                                v-for="item of systemUsers"
                                :key="item.code"
                            >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="部门领导">
                        <a-checkbox v-decorator="[`is_leader`]" />
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
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { CommonService } from '@/shared/utils/common.service'

@Component({
    components: {}
})
export default class AddDeptUser extends Vue {
    @Emit('modal.submit')
    private submit(user) {
        return user
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private info

    @Prop()
    private systemUsers

    private systemService = new SystemService()
    // 分页服务
    private pageService = new PageService()

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

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
        this.form = this.$form.createForm(this)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['dept_id'] = this.info.dept_id
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        this.innerAction.setActionAPI(
            'system/add_dept_user',
            CommonService.getMenuCode('department-management')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        dept_id: this.info.key,
                        user_list: [data.user_id],
                        is_leader: data.is_leader
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                ret => {
                    let msg: any = this.$t('tips.save_success')
                    let user: any =
                        this.systemUsers.find(x => x.code == data.user_id) || []
                    user.is_leader = data.is_leader
                    this.submit(user)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
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
