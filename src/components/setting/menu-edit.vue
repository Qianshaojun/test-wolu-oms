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
                    <a-form-item label="菜单编码">
                        <a-input
                            v-decorator="[`menu_code`]"
                            placeholder="菜单编码"
                            size="small"
                            style="width: 200px;"
                            :disabled="!!warehouse"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="名称" required>
                        <a-input
                            v-decorator="[
                                `menu_name`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            placeholder="名称"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="英文名称" required>
                        <a-input
                            v-decorator="[
                                `menu_name_eng`,
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
                    <a-form-item label="Icon">
                        <a-input
                            v-decorator="[`menu_icon`]"
                            placeholder="请输入icon名称"
                            style="width: 200px;"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="URL" required>
                        <a-input
                            v-decorator="[
                                `menu_url`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            style="width: 200px;"
                            placeholder="URL"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="排序" required>
                        <a-input-number
                            v-decorator="[
                                `sort_order`,
                                { rules: rules.required }
                            ]"
                            placeholder="排序"
                            size="small"
                            :min="0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="子系统" required>
                        <a-select
                            v-decorator="[
                                'sub_system_code',
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            style="width: 200px;"
                            @change="e => onSystemChange(e)"
                        >
                            <a-select-option
                                :value="item.sub_system_code"
                                v-for="item of subSystemList"
                                :key="item.sub_system_code"
                            >
                                {{ $t(item.sub_system_name) }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="模块" required>
                        <a-select
                            v-decorator="[
                                'model_code',
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            style="width: 200px;"
                            @change="e => onModelChange(e)"
                        >
                            <a-select-option
                                :value="item.model_code"
                                v-for="item of modelList"
                                :key="item.model_code"
                            >
                                {{ $t(item.model_name) }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="子模块" required>
                        <a-select
                            v-decorator="[
                                'sub_model_code',
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            style="width: 200px;"
                        >
                            <a-select-option
                                :value="item.sub_model_code"
                                v-for="item of subModelList"
                                :key="item.sub_model_code"
                            >
                                {{ $t(item.sub_model_name) }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="API">
                        <a-select
                            showSearch
                            v-decorator="['api_id']"
                            size="small"
                            style="width: 200px;"
                            :filterOption="filterSelectOption"
                        >
                            <a-select-option
                                :value="item.code"
                                v-for="item of apiList"
                                :key="item.code"
                            >
                                {{ $t(item.name) }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="菜单类型">
                        <a-select
                            v-decorator="['menu_kind', { initialValue: 20 }]"
                            size="small"
                            style="width: 200px;"
                        >
                            <a-select-option :value="10" key="public">
                                公用菜单
                            </a-select-option>
                            <a-select-option :value="20" key="oms">
                                OMS菜单
                            </a-select-option>
                            <a-select-option :value="30" key="wms">
                                WMS菜单
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="是否显示">
                        <a-checkbox
                            v-decorator="[
                                `navigate_menu`,
                                { initialValue: navigate_menu }
                            ]"
                            v-model="navigate_menu"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="功能描述">
                        <a-textarea
                            v-decorator="[`menu_description`]"
                            placeholder="功能描述"
                            size="small"
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
import { CommonService } from '@/shared/utils/common.service'
import { formConfig } from '@/config/form.config'

@Component({
    components: {}
})
export default class MenuEdit extends Vue {
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
    private apiList

    @Prop()
    private saveFlag

    private systemService = new SystemService()
    // 分页服务
    private pageService = new PageService()

    private loadingService = new LoadingService()

    private form: any

    private subSystemList: any[] = []

    private modelList: any[] = []

    private subModelList: any[] = []

    private defaultSubSystemCode: any = ''

    private defaultModuleCode: any = ''

    private defaultSubModuleCode: any = ''

    private navigate_menu: any = true

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public mounted() {
        if (this.warehouse) {
            this.navigate_menu = this.warehouse.navigate_menu ? true : false
            this.defaultSubSystemCode = this.warehouse.sub_system_code
            this.defaultModuleCode = this.warehouse.model_code
            this.setFormValues()
        }
    }

    public setFormValues() {
        //修改获取数据
        if (this.warehouse.sub_system_code) {
            this.getModuleList()
        }
        if (this.warehouse.model_code) {
            this.getSubModule()
        }
        this.form.setFieldsValue(this.warehouse)
    }

    private created() {
        this.getSubSystemList()
        this.form = this.$form.createForm(this)
    }

    private getSubSystemList() {
        this.systemService
            .queryAllSubSystem(
                new RequestParams(
                    CommonService.createQueryCondition(
                        { status: 20 },
                        {
                            ...formConfig.condition
                        }
                    ),
                    {
                        page: this.pageService
                    }
                )
            )
            .subscribe(
                data => {
                    this.subSystemList = data.filter(x => x.status === 20)
                },
                () => {
                    this.$message.error('子系统获取失败')
                }
            )
    }

    private getModuleList() {
        this.systemService
            .queryAllSystemModule(
                new RequestParams({
                    sub_system_code: this.defaultSubSystemCode
                })
            )
            .subscribe(
                data => {
                    this.modelList = data.filter(x => x.status === 20)
                },
                () => {
                    this.$message.error('模块获取失败')
                }
            )
    }

    private getSubModule(isChange = 0) {
        this.subModelList = []
        this.systemService
            .queryAllSubSystemModule(
                new RequestParams({ model_code: this.defaultModuleCode })
            )
            .subscribe(
                data => {
                    this.subModelList = data.filter(x => x.status === 20)
                    if (data.length) {
                        this.defaultSubModuleCode = data[0].sub_model_code
                    }
                },
                () => {
                    this.$message.error('子模块获取失败')
                }
            )
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['save_flag'] = this.saveFlag
                if (!this.saveFlag) {
                    values['menu_code'] = ''
                }
                values['status'] = 20
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        this.systemService
            .saveSystemMenu(
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

    private onSystemChange(e) {
        this.defaultSubSystemCode = e
        this.getModuleList()
    }

    private onModelChange(e) {
        this.defaultModuleCode = e
        this.getSubModule(1)
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
