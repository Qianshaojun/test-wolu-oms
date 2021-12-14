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
                    <a-form-item label="子系统编码">
                        <a-input
                            v-decorator="[`sub_system_code`]"
                            placeholder="子系统编码"
                            size="small"
                            style="width: 200px;"
                            :disabled="!!warehouse"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="子系统名称" required>
                        <a-input
                            v-decorator="[
                                `sub_system_name`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            placeholder="子系统名称"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="英文名称" required>
                        <a-input
                            v-decorator="[
                                `sub_system_name_eng`,
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
                    <a-form-item :label="$t('columns.icon')" required>
                        <a-input
                            v-decorator="[
                                `sub_system_icon`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            :placeholder="$t('columns.icon')"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="排序">
                        <a-input-number
                            v-decorator="[`sort_order`]"
                            placeholder="排序"
                            size="small"
                            :min="0"
                            style="width: 200px;"
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
export default class AddSubSystem extends Vue {
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
        let obj = {}
        if (this.warehouse) {
            obj = {
                sub_system_code: this.warehouse.sub_system_code,
                sub_system_name: this.warehouse.sub_system_name,
                sub_system_name_eng: this.warehouse.sub_system_name_eng,
                sub_system_icon: this.warehouse.sub_system_icon,
                sort_order: this.warehouse.sort_order,
                memo: this.warehouse.memo
            }
        }
        this.form.setFieldsValue(obj)
    }

    private created() {
        this.form = this.$form.createForm(this)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['save_flag'] = this.saveFlag
                if (!this.saveFlag) {
                    values['sub_system_code'] = ''
                }
                values['status'] = 20
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        this.systemService
            .saveSubSystem(
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
    "en-us": {
        "columns": {
            "code": "WareHouse Code",
            "name": "Customer Info",
            "icon": "icon"
        }
    },
    "zh-cn": {
        "columns": {
            "code": "仓库编码",
            "name": "仓库名称",
            "icon": "图标"
        }
    }
}
</i18n>