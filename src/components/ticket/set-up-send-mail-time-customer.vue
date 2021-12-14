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
                    <a-form-item :label="$t('from_datetime')">
                        <a-date-picker
                            show-time
                            v-decorator="[
                                'from_datetime',
                                { initialValue: '' }
                            ]"
                            format="YYYY-MM-DD HH:mm"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('to_datetime')">
                        <a-date-picker
                            show-time
                            v-decorator="['to_datetime', { initialValue: '' }]"
                            format="YYYY-MM-DD HH:mm"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('instances')">
                        <a-select
                            showSearch
                            v-decorator="['instances']"
                            :style="{ width: '200px' }"
                            size="small"
                            placeholder="Please Select"
                            mode="multiple"
                            :filterOption="filterSelectOption"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '300px' }"
                        >
                            <a-select-option
                                :value="item.code"
                                v-for="item of instanceList"
                                :key="item.code"
                                >{{ item.name }}</a-select-option
                            >
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('interval_type')">
                        <a-select
                            v-decorator="[
                                'interval_type',
                                { initialValue: 'minutes' }
                            ]"
                            style="width: 200px"
                        >
                            <a-select-option
                                :key="item.code"
                                :value="item.code"
                                v-for="item of intervalTypes"
                                >{{ item.name }}</a-select-option
                            >
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('interval_number')">
                        <a-input-number
                            v-decorator="[
                                'interval_number',
                                { initialValue: 30 }
                            ]"
                            style="width: 300px"
                            :min="1"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('nextcall')">
                        <a-date-picker
                            show-time
                            v-decorator="[
                                'nextcall',
                                { initialValue: moment(Date.now()) }
                            ]"
                            format="YYYY-MM-DD HH:mm"
                            size="small"
                            style="width: 200px;"
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
import { UserService } from '~/services/user.service'
import { RequestParams } from '../../core/http'
import moment from 'moment'
import { Form } from 'ant-design-vue'
import { HelpdeskService } from '../../services/helpdesk.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { InnerActionService } from '~/bootstrap/services/inner.action.service'
import { PublicService } from '~/services/public.service'
import { CommonService } from '../../shared/utils/common.service'

@Component({
    components: {}
})
export default class SetUpSendTimeCustomerWizard extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {}

    private form: any

    private userService = new UserService()
    private helpdeskService = new HelpdeskService()
    private loadingService = new LoadingService()
    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    public mounted() {}

    private moment = moment

    public created() {
        this.getInstances()
        this.form = this.$form.createForm(this)
    }

    private countryList = [
        { name: 'DE', code: 'de' },
        { name: 'UK', code: 'uk' },
        { name: 'ES', code: 'es' },
        { name: 'NL', code: 'nl' },
        { name: 'FR', code: 'fr' },
        { name: 'IT', code: 'it' }
    ]

    private intervalTypes = [
        { name: 'minutes', code: 'minutes' },
        { name: 'hours', code: 'hours' },
        { name: 'work days', code: 'work_days' },
        { name: 'days', code: 'days' },
        { name: 'weeks', code: 'weeks' },
        { name: 'months', code: 'months' }
    ]

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                this.helpdeskService
                    .set_up_send_mail_time_customer(
                        new RequestParams(values, {
                            loading: this.loadingService
                        })
                    )
                    .subscribe(
                        data => {
                            this.$message.success('Success')
                            this.submit()
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
        })
    }

    private instanceList: any = []
    private getInstances() {
        this.innerAction.setActionAPI(
            '/ticket/query_ticket_instance_list',
            CommonService.getMenuCode('auto-reply-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.instanceList = data
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
    "from_datetime":"From Datetime",
    "to_datetime":"To Datetime",
    "instances":"Instances",
    "interval_type":"Interval Unit",
    "interval_number":"Interval Number",
    "nextcall":"Nextcall",
    "submit":"Submit",
    "cancel":"Cancel"
  },
  "zh-cn": {
    "from_datetime":"开始时间",
    "to_datetime":"结束时间",
    "instances":"站点",
    "interval_type":"间隔单位",
    "interval_number":"间隔数值",
    "nextcall":"下次调用时间",
    "submit":"提交",
    "cancel":"取消"
  }
}
</i18n>
