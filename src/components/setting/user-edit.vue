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
                <a-col :span="20" v-show="warehouse">
                    <a-form-item label="用户ID">
                        <a-input
                            v-decorator="[`user_id`]"
                            placeholder="用户ID"
                            size="small"
                            style="width: 200px;"
                            :disabled="!!warehouse"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="登录名" required>
                        <a-input
                            v-decorator="[
                                `login_name`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            placeholder="登录名"
                            size="small"
                            style="width: 200px;"
                            :disabled="!!warehouse"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="员工编号">
                        <a-input
                            v-decorator="[`employee_id`]"
                            placeholder="员工编号"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="公司账号">
                        <a-checkbox
                            v-decorator="[
                                `company_account`,
                                {
                                    valuePropName: 'checked',
                                    initialValue: false
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="姓名">
                        <a-input
                            v-decorator="[`cn_name`]"
                            placeholder="姓名"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="英文名">
                        <a-input
                            v-decorator="[`en_name`]"
                            placeholder="英文名"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="手机号">
                        <a-input
                            v-decorator="[`phone_number`]"
                            placeholder="手机号"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="部门">
                        <a-select
                            showSearch
                            v-decorator="['dept_id']"
                            :style="{ width: '200px' }"
                            size="small"
                            :filterOption="filterSelectOption"
                            mode="multiple"
                        >
                            <a-select-option
                                v-for="i of departmentList"
                                :key="i.id"
                                :value="i.id"
                                :title="i.dept_name"
                            >
                                {{ i.dept_name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="部门领导">
                        <a-checkbox
                            v-decorator="[`is_leader`, { initialValue: false }]"
                            v-model="is_leader"
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
import moment from 'moment'
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
    private warehouse

    @Prop()
    private saveFlag

    @Prop()
    private departmentList

    private systemService = new SystemService()
    // 分页服务
    private pageService = new PageService()

    private loadingService = new LoadingService()

    private form: any

    private certificate: any

    private moment = moment

    private is_leader: any = false

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public mounted() {
        if (this.warehouse) {
            this.is_leader = this.warehouse.is_leader
            this.setFormValues()
        }
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
                values['status'] = 20
                values['employee_id'] = Number(values['employee_id'])
                values['dept_id_list'] = values['dept_id']
                delete values['dept_id']
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        this.systemService
            .saveUser(new RequestParams(data, { loading: this.loadingService }))
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
    "en-us": {
        "columns": {
            "code": "WareHouse Code",
            "name": "Customer Info"
        }
    },
    "zh-cn": {
        "columns": {
            "code": "仓库编码",
            "name": "仓库名称"
        }
    }
}
</i18n>
