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
                    <a-form-item label="上级部门">
                        <a-input
                            v-decorator="[`parent_name`]"
                            size="small"
                            style="width: 200px;"
                            disabled
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="部门名称" required>
                        <a-input
                            v-decorator="[
                                `dept_name`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="部门类别" required>
                        <a-select
                            v-decorator="['dept_type', { initialValue: 10 }]"
                            size="small"
                            style="width: 200px;"
                        >
                            <a-select-option value="" key="">
                                --请选择--
                            </a-select-option>
                            <a-select-option :value="10" key="group">
                                {{ this.$t('columns.group') }}
                            </a-select-option>
                            <a-select-option :value="20" key="com">
                                {{ this.$t('columns.company') }}
                            </a-select-option>
                            <a-select-option :value="30" key="top_dept">
                                {{ this.$t('columns.top_department') }}
                            </a-select-option>
                            <a-select-option :value="100" key="other_dept">
                                {{ this.$t('columns.other_department') }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="排序">
                        <a-input-number
                            v-decorator="[
                                `sort_order`,
                                {
                                    initialVlaue: 10
                                }
                            ]"
                            size="small"
                            style="width: 120px;"
                            :min="1"
                            decimalSeparator=","
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
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { CommonService } from '@/shared/utils/common.service'

@Component({
    components: {}
})
export default class AddDept extends Vue {
    @Emit('modal.submit')
    private submit(data) {
        return data
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private info

    @Prop()
    private saveFlag

    private systemService = new SystemService()
    // 分页服务
    private pageService = new PageService()

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private form: any

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public mounted() {
        this.setFormValues()
    }

    public setFormValues() {
        if (this.info.sort_order == undefined) {
            this.info['sort_order'] = 1
        }
        this.form.setFieldsValue(this.info)
    }

    private created() {
        this.form = this.$form.createForm(this)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        this.innerAction.setActionAPI(
            'system/save_department',
            CommonService.getMenuCode('department-management')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        save_flag: this.saveFlag,
                        parent_id: this.info.parent_id,
                        id: this.info.dept_id,
                        dept_name: data.dept_name,
                        dept_type: data.dept_type,
                        sort_order: data.sort_order
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                ret => {
                    this.$message.success('操作成功')

                    this.submit({
                        id: ret.message.dept_id,
                        name: data.dept_name,
                        dept_type: data.dept_type,
                        sort_order: data.sort_order
                    })
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
            "name":"Customer Info",
            "group": "Group",
            "company": "Company",
            "top_department":"Top department",
            "other_department": "Other department"
      }
  },
  "zh-cn":{
       "columns":{    
           "code":"仓库编码",
           "name":"仓库名称",
           "group": "集团",
           "company": "公司",
           "top_department":"一级部门",
           "other_department": "非一级部门"
      }
  }
}
</i18n>
