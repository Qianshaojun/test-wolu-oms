<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 19, offset: 1 }"
        >
            <a-row :gutter="24">
                <a-col :span="22" style="margin-left: 7px">
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.start_time')"
                                :labelCol="{ span: 8 }"
                                :wrapperCol="{ span: 14, offset: 2 }"
                            >
                                <a-date-picker
                                    show-time
                                    v-decorator="[`start_time`]"
                                    size="small"
                                    format="YYYY-MM-DD HH:mm"
                                    style="width: 160px;"
                                    :locale="locale"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.finish_before')"
                                :labelCol="{ span: 8 }"
                                :wrapperCol="{ span: 15, offset: 1 }"
                            >
                                <a-date-picker
                                    show-time
                                    v-decorator="[`finish_before`]"
                                    format="YYYY-MM-DD HH:mm"
                                    size="small"
                                    style="width: 160px;"
                                    :locale="locale"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-col>
                <a-col :span="22" style="margin-left: 7px">
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.finish_time')"
                                :labelCol="{ span: 8 }"
                                :wrapperCol="{ span: 14, offset: 2 }"
                            >
                                <a-date-picker
                                    show-time
                                    v-decorator="[`finish_time`]"
                                    format="YYYY-MM-DD HH:mm"
                                    size="small"
                                    style="width: 160px;"
                                    :locale="locale"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.end_time')"
                                :labelCol="{ span: 8 }"
                                :wrapperCol="{ span: 15, offset: 1 }"
                            >
                                <a-date-picker
                                    show-time
                                    v-decorator="[`end_time`]"
                                    format="YYYY-MM-DD HH:mm"
                                    size="small"
                                    style="width: 160px;"
                                    :locale="locale"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-col>
                <a-col :span="22">
                    <a-form-item :label="$t('columns.name')" required>
                        <a-input
                            v-decorator="[
                                `case_title`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            style="width: 100%;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="22">
                    <a-form-item :label="$t('columns.user_id')" required>
                        <a-select
                            show-search
                            v-decorator="[
                                `user_id`,
                                {
                                    initialValue: loginUID
                                },
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            style="width: 100%;"
                            :filter-option="filterOption"
                        >
                            <a-select-option
                                v-for="item of systemUsers"
                                :value="item.code"
                                :key="item.code"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="22">
                    <a-form-item :label="$t('columns.executive_officer')">
                        <a-select
                            show-search
                            v-decorator="[
                                `responsible_user_id`,
                                {
                                    initialValue: loginUID
                                }
                            ]"
                            size="small"
                            style="width: 100%;"
                            :filter-option="filterOption"
                        >
                            <a-select-option
                                v-for="item of systemUsers"
                                :value="item.code"
                                :key="item.code"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="22">
                    <a-form-item :label="$t('columns.participant')">
                        <a-select
                            show-search
                            v-decorator="[`related_user_ids`]"
                            size="small"
                            mode="multiple"
                            style="width: 100%;"
                            :filter-option="filterOption"
                        >
                            <a-select-option
                                v-for="item of systemUsers"
                                :value="item.code.toString()"
                                :key="item.code"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="22">
                    <a-form-item :label="$t('columns.state')" required>
                        <a-select
                            v-decorator="[
                                `state`,
                                {
                                    initialValue: 'todo'
                                },
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            style="width: 100%;"
                        >
                            <a-select-option
                                v-for="item of stateList"
                                :value="item.code"
                                :key="item.code"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="22">
                    <a-form-item :label="$t('columns.case_type')" required>
                        <a-select
                            v-decorator="[
                                `case_type`,
                                {
                                    initialValue: 'other'
                                },
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            style="width: 100%;"
                        >
                            <a-select-option
                                v-for="item of caseTypeList"
                                :value="item.code"
                                :key="item.code"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="22">
                    <a-form-item :label="$t('columns.description')" required>
                        <a-textarea
                            rows="6"
                            v-decorator="[
                                `description`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            style="width: 100%;"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel"
                >{{ $t('action.cancel') }}
            </a-button>
            <a-button type="primary" @click="onSubmit"
                >{{ $t('action.submit') }}
            </a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { ProductService } from '@/services/product.service'
import { CaseService } from '../../services/case.service'
import moment from 'moment'
import { CommonService } from '@/shared/utils/common.service'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'

@Component({
    components: {}
})
export default class ScheduleEdit extends Vue {
    @Emit('modal.submit')
    private submit(params) {
        return params
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private stock

    @Prop()
    private saveFlag

    @Prop()
    private systemUsers

    @Prop()
    private caseTypeList

    @Prop()
    private stateList

    @Prop({ default: '' })
    private parentID

    @Prop({ default: '' })
    private weekID

    @Prop()
    private loginUID

    private form: any

    private locale: any = locale

    private caseService = new CaseService()

    private loadingService = new LoadingService()

    private rules = {
        required: [{ required: true, message: 'required' }]
    }

    public mounted() {
        if (this.stock) {
            this.stock.related_user_ids = this.stock.related_user_ids.map(x =>
                x.toString()
            )
            if (this.stock.start_time) {
                this.stock.start_time = CommonService.dateToLocal(
                    this.stock.start_time
                )
            }
            if (this.stock.finish_time) {
                this.stock.finish_time = CommonService.dateToLocal(
                    this.stock.finish_time
                )
            }
            if (this.stock.end_time) {
                this.stock.end_time = CommonService.dateToLocal(
                    this.stock.end_time
                )
            }
            if (this.stock.finish_before) {
                this.stock.finish_before = CommonService.dateToLocal(
                    this.stock.finish_before
                )
            }
            this.setFormValues()
        }
    }

    public setFormValues() {
        this.form.setFieldsValue(this.stock)
    }

    public created() {
        this.form = this.$form.createForm(this)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['save_flag'] = this.saveFlag
                if (this.saveFlag) {
                    values['case_id'] = this.stock.case_id
                } else {
                    values['case_id'] = 0
                }
                if (values['user_id']) {
                    values['user_id'] = parseInt(values['user_id'])
                }
                if (values['responsible_user_id']) {
                    values['responsible_user_id'] = parseInt(
                        values['responsible_user_id']
                    )
                }
                if (values['related_user_ids']) {
                    values['related_user_ids'] = values[
                        'related_user_ids'
                    ].map(x => parseInt(x))
                }
                if (this.parentID) {
                    values['parent_id'] = this.parentID
                }
                if (this.weekID) {
                    values['week_id'] = this.weekID
                }
                if (values['start_time']) {
                    let type: any = typeof values['start_time']
                    if (type != 'moment') {
                        values['start_time'] = new Date(values['start_time'])
                    }
                }
                if (values['finish_time']) {
                    let type: any = typeof values['finish_time']
                    if (type != 'moment') {
                        values['finish_time'] = new Date(values['finish_time'])
                    }
                }
                if (values['end_time']) {
                    let type: any = typeof values['end_time']
                    if (type != 'moment') {
                        values['end_time'] = new Date(values['end_time'])
                    }
                }
                if (values['finish_before']) {
                    let type: any = typeof values['finish_before']
                    if (type != 'moment') {
                        values['finish_before'] = new Date(
                            values['finish_before']
                        )
                    }
                }
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        this.caseService
            .saveCase(new RequestParams(data, { loading: this.loadingService }))
            .subscribe(
                ret => {
                    data.case_id = ret[0].case_id
                    this.submit(data)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private filterOption(input, option) {
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
        "desc": "this is a Order Page1",
        "none": "None",
        "columns": {
            "start_time": "Start Time",
            "finish_before": "Finish Before",
            "finish_time": "Finish Time",
            "end_time": "End Time",
            "name": "Title",
            "user_id": "Request Submitter",
            "executive_officer": "Executive Officer",
            "participant": "Participant",
            "description": "Description",
            "state": "State",
            "case_type": "Case Type",
            "parent_id": "Parent Case"
        },
        "action": {
            "create": "Create",
            "batch-create": "EXCEL Import",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "submit": "Submit"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "none": "无",
        "columns": {
            "start_time": "开始时间",
            "finish_before": "期望完成时间",
            "finish_time": "完成时间",
            "end_time": "结束时间",
            "name": "标题",
            "user_id": "需求提交人",
            "executive_officer": "执行负责人",
            "participant": "参与者",
            "description": "描述",
            "state": "状态",
            "case_type": "类型",
            "parent_id": "父任务"
        },
        "action": {
            "create": "新建",
            "batch-create": "EXCEL导入",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "submit": "提交"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?"
    }
}
</i18n>
