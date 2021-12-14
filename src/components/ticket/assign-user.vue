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
                    <a-form-item label="Ticket ID">
                        <a-input
                            :value="ticketIds"
                            style="width: 300px"
                            disabled
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.customer_service')">
                        <a-select
                            showSearch
                            v-decorator="['user_id', { initialValue: '' }]"
                            style="width: 300px"
                            :filterOption="filterSelectOption"
                        >
                            <a-select-option
                                :key="item.code"
                                :value="item.code"
                                v-for="item of userList"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.force_allot')">
                        <a-checkbox
                            :checked="force_allot"
                            @change="e => handleChange(e.target.checked)"
                            :disabled="true"
                        />
                        <br />
                        <span style="color:red">{{
                            $t('columns.force_allot_tips')
                        }}</span>
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
import { UserService } from '~/services/user.service'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'

@Component({
    components: {}
})
export default class AssignUser extends Vue {
    @Emit('modal.submit')
    private submit(values) {
        return values
    }

    @Emit('modal.cancel')
    private cancel() {}

    @Prop()
    private tickets

    @Prop()
    private userList

    private form: any

    private ticketIds: string = this.tickets.join()

    private force_allot: any = true

    private userService = new UserService()

    public mounted() {}

    public created() {
        this.form = this.$form.createForm(this)
    }

    public setFormValues() {
        this.form.setFieldsValue(this.tickets)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            values['force_allot'] = this.force_allot

            if (!values['user_id']) {
                let error_info: any = this.$t('columns.error_submit_info')
                this.$message.error(error_info)
                return
            }

            if (!err) {
                this.submit(values)
            }
        })
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private handleChange(value) {
        this.force_allot = value
    }
}
</script>

<i18n>
{
    "en-us": {
        "columns": {
            "customer_service": "Customer Service",
            "force_allot": "Force Allot",
            "force_allot_tips": "Josef=Emailverkehr vorhandeln，Leo=erste Reklamation;A-KS nicht anwesend; B-KS übernimmt Emails von A-KS.*Haken setzen: am aktuellen Tag werden die Mails von Josef und Leo B zugewiesen；am nächsten Tag bleiben die weitere Reklamation von Josef und Leo immer noch B zugewiesen.*Haken nicht setzen：am aktuellen Tag werden die Mails von Josef und Leo B zugewiesen；am nächsten Tag kehrt die weitere Reklamation von Josef zur A zurück aber von Leo bleibt immer noch B zugewiesen.",
            "error_submit_info": "Please select customer service!!!"
        }
    },
    "zh-cn": {
        "columns": {
            "customer_service": "客服",
            "force_allot": "强制分配",
            "force_allot_tips": "Josef老客户，Leo新客户,A客服请假，B客服临时顶替；*强制勾选：当天Josef+Leo归属B；次日Josef+Leo仍旧归属B；*强制未勾选：当天Josef+Leo归属B；次日Josef归属A，Leo归属B；",
            "error_submit_info": "请选择客服!!!"
        }
    }
}
</i18n>