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
                <a-col :span="20" v-show="interfaceData">
                    <a-form-item label="ID">
                        <a-input
                            v-decorator="[`id`]"
                            placeholder="ID"
                            size="small"
                            style="width: 200px;"
                            :disabled="!!interfaceData"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.api_name')" required>
                        <a-input
                            v-decorator="[
                                `api_name`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            placeholder=""
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.api_address')" required>
                        <a-input
                            v-decorator="[
                                `api_address`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            placeholder=""
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.use_common_function')">
                        <a-checkbox
                            v-decorator="[`use_common_function`]"
                            placeholder=""
                            :checked="interfaceData.use_common_function"
                            @change="e => onUsefunChange(e)"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20" v-if="interfaceData.use_common_function">
                    <a-form-item :label="$t('columns.db_type')">
                        <a-select
                            v-model="dbType"
                            size="small"
                            style="width: 200px;"
                            @change="e => onDbTypeChange(e)"
                        >
                            <a-select-option value="common" key="common">
                                Common
                            </a-select-option>
                            <a-select-option value="wms" key="wms">
                                Wms
                            </a-select-option>
                            <a-select-option value="oms" key="oms">
                                Oms
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20" v-if="interfaceData.use_common_function">
                    <a-form-item :label="$t('columns.api_type')">
                        <a-radio-group
                            v-model="apiType"
                            @change="e => onApiTypeChange(e)"
                        >
                            <a-radio value="query_pagination">
                                分页查询
                            </a-radio>
                            <a-radio value="query">
                                查询
                            </a-radio>
                            <a-radio value="modify">
                                修改
                            </a-radio>
                        </a-radio-group>
                    </a-form-item>
                </a-col>
                <a-col :span="20" v-if="interfaceData.use_common_function">
                    <a-form-item :label="$t('columns.table_name')">
                        <a-input
                            v-decorator="[`table_name`]"
                            placeholder=""
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item
                        :label="$t('columns.interface_full_name')"
                        required
                    >
                        <a-input
                            v-decorator="[
                                `interface_full_name`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            placeholder=""
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item
                        :label="$t('columns.sub_system_code')"
                        required
                    >
                        <a-select
                            v-decorator="[
                                'sub_system_code',
                                {
                                    initialValue: defaultSubSystemCode
                                },
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
                    <a-form-item :label="$t('columns.model_code')" required>
                        <a-select
                            v-decorator="[
                                'model_code',
                                { initialValue: defaultModuleCode },
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
                    <a-form-item :label="$t('columns.sub_model_code')" required>
                        <a-select
                            v-decorator="[
                                'sub_model_code',
                                { initialValue: defaultSubModuleCode },
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
                <a-col :span="20" v-if="interfaceData.use_common_function">
                    <a-form-item :label="$t('columns.use_sql_text')">
                        <a-checkbox
                            v-decorator="[`use_sql_text`]"
                            placeholder=""
                            :checked="interfaceData.use_sql_text"
                            @change="e => onUseSqlChange(e)"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col
                    :span="20"
                    v-if="
                        interfaceData.use_common_function &&
                            interfaceData.use_sql_text
                    "
                >
                    <a-form-item :label="$t('columns.sql_text')">
                        <a-textarea v-decorator="[`sql_text`]"> </a-textarea>
                    </a-form-item>
                </a-col>
                <a-col :span="20" v-if="interfaceData.use_common_function">
                    <a-form-item :label="$t('columns.single_log_table')">
                        <a-checkbox
                            v-decorator="[`single_log_table`]"
                            placeholder=""
                            :checked="interfaceData.single_log_table"
                            @change="e => onLogChange(e)"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col
                    :span="20"
                    v-if="
                        interfaceData.use_common_function &&
                            interfaceData.single_log_table
                    "
                >
                    <a-form-item :label="$t('columns.log_table_name')">
                        <a-input
                            v-decorator="[`log_table_name`]"
                            size="small"
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
export default class ApiUrlEdit extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private interfaceData

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

    private dbType: any = 'common'

    private apiType: any = 'query_pagination'

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public mounted() {
        if (this.interfaceData) {
            this.defaultSubSystemCode = this.interfaceData.sub_system_code
            this.defaultModuleCode = this.interfaceData.model_code
            this.setFormValues()
        }
    }

    public setFormValues() {
        this.form.setFieldsValue(this.interfaceData)
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
                    if (data.length) {
                        this.defaultSubSystemCode = data[1].sub_system_code
                        this.getModuleList()
                    }
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
                    if (data.length) {
                        if (!this.defaultModuleCode) {
                            this.defaultModuleCode = data[0].model_code
                        }

                        this.getSubModule()
                    }
                },
                () => {
                    this.$message.error('模块获取失败')
                }
            )
    }

    private getSubModule(isChange = 0) {
        let moduleCode: any = this.defaultModuleCode
        if (typeof moduleCode == 'object') {
            moduleCode = moduleCode[0]
        }

        this.subModelList = []
        this.systemService
            .queryAllSubSystemModule(
                new RequestParams({ model_code: moduleCode })
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
            if (typeof values.model_code == 'object') {
                values.model_code = values.model_code[0]
            }
            if (typeof values.sub_model_code == 'object') {
                values.sub_model_code = values.sub_model_code[0]
            }
            if (typeof values.sub_system_code == 'object') {
                values.sub_system_code = values.sub_system_code[0]
            }
            if (!err) {
                values['save_flag'] = this.saveFlag
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        this.systemService
            .save_system_api(
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

    private onUsefunChange(e) {
        this.interfaceData.use_common_function = e.target.checked
    }

    private onDbTypeChange(e) {
        this.dbType = e
        this.setFullName(this.dbType, this.apiType)
    }

    private onUseSqlChange(e) {
        this.interfaceData.use_sql_text = e.target.checked
    }

    private onLogChange(e) {
        this.interfaceData.single_log_table = e.target.checked
    }

    private onApiTypeChange(e) {
        this.apiType = e.target.value
        this.setFullName(this.dbType, this.apiType)
    }

    private setFullName(dbType, apiType) {
        let fullName =
            'common_management.SystemManagement.' +
            this.apiType +
            '_for_' +
            this.dbType
        let vls: any = this.form.getFieldsValue()
        vls['interface_full_name'] = fullName
        this.form.setFieldsValue(vls)
    }
}
</script>

<i18n>
{
  "en-us":{
      "submit": "Submit",
      "cancel": "Cancel",
      "columns": {
        "api_name": "Api Name",
        "api_address": "Api Address",
        "active": "Active",
        "sub_system_code": "Sub System",
        "model_code": "Model",
        "sub_model_code": "Sub Model",
        "write_date": "Write Date",
        "write_uid": "Write User",
        "interface_full_name": "Interface Full Name",
        "use_common_function": "Use Common function",
        "use_sql_text": "Use sql text",
        "sql_text": "Sql text",
        "table_name": "Table name",
        "single_log_table": "Single log table",
        "log_table_name": "Log table name",
        "db_type": "DB Type",
        "api_type": "Api Type"
    }
  },
  "zh-cn":{
       "submit": "提交",
       "cancel": "取消",
       "columns":{    
            "api_name": "Api名称",
            "api_address": "Api地址",
            "active": "激活",
            "sub_system_code": "子系统",
            "model_code": "模块",
            "sub_model_code": "子模块",
            "write_date": "创建时间",
            "write_uid": "创建者",
            "interface_full_name": "接口全名",
            "use_common_function": "使用通用方法",
            "use_sql_text": "使用自定义脚本",
            "sql_text": "自定义脚本",
            "table_name": "表名",
            "single_log_table": "单独日志表",
            "log_table_name": "日志表",
            "db_type": "数据库类型",
            "api_type": "接口类型"
        }
  }
}
</i18n>
