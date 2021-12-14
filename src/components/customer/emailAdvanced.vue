<template>
    <div v-if="isEdit">
        <a-form :form="form" :labelCol="{ span: 3 }" :wrapperCol="{ span: 14 }">
            <a-row>
                <a-col :span="11">
                    <a-form-item :label="$t('autoDelete')">
                        <a-checkbox
                            @change="onChangeAuto"
                            :checked="auto_delete"
                        ></a-checkbox>
                    </a-form-item>
                    <a-form-item :label="$t('receiveNotice')">
                        <a-checkbox
                            @change="onChangeReceive"
                            :checked="receive_notice"
                        ></a-checkbox>
                    </a-form-item>

                    <a-form-item :label="$t('type')">
                        <a-select
                            v-decorator="['message_type']"
                            class="flexWidth"
                            :placeholder="$t('plzSelect')"
                        >
                            <a-select-option
                                v-for="(item, index) in typeList"
                                :key="index"
                                :value="item.value"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item :label="$t('serve')">
                        <a-select
                            v-decorator="['mail_server_id']"
                            class="flexWidth"
                            :placeholder="$t('plzSelect')"
                        >
                            <a-select-option
                                v-for="(item, index) in serverList"
                                :key="index"
                                :value="item.id"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item :label="$t('model')">
                        <a-input
                            v-decorator="['model']"
                            :placeholder="$t('plzInput')"
                            class="flexWidth"
                        />
                    </a-form-item>
                    <a-form-item :label="$t('modelId')">
                        <a-input
                            v-decorator="['res_id']"
                            :placeholder="$t('plzInput')"
                            class="flexWidth"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('mesId')"
                        >{{ detailInfo.message_id }}
                    </a-form-item>
                    <a-form-item :label="$t('reference')">
                        {{ detailInfo.references }}
                    </a-form-item>
                    <a-form-item :label="$t('header')">
                        <a-textarea
                            v-decorator="['headers']"
                            :placeholder="$t('plzInput')"
                            class="flexWidth"
                            :rows="2"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </div>
    <div v-else>
        <a-form :form="form" :labelCol="{ span: 3 }" :wrapperCol="{ span: 14 }">
            <a-row>
                <a-col :span="11">
                    <a-form-item :label="$t('autoDelete')">
                        <a-checkbox :disabled="!isEdit" :checked="auto_delete">
                        </a-checkbox>
                    </a-form-item>
                    <a-form-item :label="$t('receiveNotice')">
                        <a-checkbox
                            :disabled="!isEdit"
                            :checked="receive_notice"
                        >
                        </a-checkbox>
                    </a-form-item>

                    <a-form-item :label="$t('type')">
                        {{
                            detailInfo.message_type === 'email'
                                ? 'Email'
                                : detailInfo.message_type === 'comment'
                                ? 'Comment'
                                : detailInfo.message_type === 'notification'
                                ? 'System notification'
                                : ''
                        }}
                    </a-form-item>
                    <a-form-item :label="$t('serve')">
                        {{ detailInfo.mail_server_id.name }}
                    </a-form-item>
                    <a-form-item :label="$t('model')"
                        >{{ detailInfo.model }}
                    </a-form-item>
                    <a-form-item :label="$t('modelId')"
                        >{{ detailInfo.res_id }}
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('mesId')"
                        >{{ detailInfo.message_id }}
                    </a-form-item>
                    <a-form-item :label="$t('reference')"
                        >{{ detailInfo.references }}
                    </a-form-item>
                    <a-form-item :label="$t('header')"
                        >{{ detailInfo.headers }}
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Page } from '@/core/decorators'
import { CommonService } from '@/shared/utils/common.service'
import { RequestParams } from '@/core/http'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { LoadingService } from '@/bootstrap/services/loading.service'
import { PublicService } from '@/services/public.service'

interface ITypeList {
    name: string
    value: string
}

@Page({
    layout: 'workspace',
    name: 'emailAdvanced'
})
@Component({
    components: {}
})
export default class emailAdvanced extends Vue {
    @Prop({ type: Boolean, default: false })
    isEdit: any
    @Prop({ type: Object, default: {} })
    detailInfo: any
    private innerAction = new InnerActionService()
    private loadingService = new LoadingService()
    private publicService = new PublicService()
    private form: any
    private typeList: ITypeList[] = [
        { name: 'Email', value: 'email' },
        { name: 'Comment', value: 'comment' },
        { name: 'System notification', value: 'notification' }
    ]
    private serverList: any = []
    private auto_delete: boolean = false
    private receive_notice: boolean = false

    private beforeCreate() {
        this.form = this.$form.createForm(this)
    }

    private created() {
        this.getServeList()
    }

    private mounted() {}

    private onChangeAuto(e) {
        this.auto_delete = e.target.checked
    }

    private onChangeReceive(e) {
        this.receive_notice = e.target.checked
    }

    private getServeList() {
        this.innerAction.setActionAPI(
            'helpdesk/query_all_mail_server',
            CommonService.getMenuCode('sent_email')
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
                    this.serverList = data.message
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private setFormValue(value) {
        this.auto_delete = value.auto_delete
        this.receive_notice = value.notification
        this.form.setFieldsValue({
            message_type: value.message_type,
            mail_server_id: value.mail_server_id.id,
            model: value.model,
            res_id: value.res_id,
            headers: value.headers
        })
    }

    private getFormValue() {
        let formData = this.form.getFieldsValue()
        formData.auto_delete = this.auto_delete
        formData.notification = this.receive_notice
        return formData
    }
}
</script>

<i18n>
{
    "en-us": {
        "autoDelete": "Auto Delete",
        "receiveNotice": "Is Notification",
        "type": "Type",
        "serve": "Outgoing mail server",
        "model": "Related Document Model",
        "modelId": "Related Document ID",
        "mesId": "Message-Id",
        "header": "References Headers",
        "reference": "References",
        "plzInput": "pleaseInput",
        "plzSelect": "pleaseSelect"
    },
    "zh-cn": {
        "autoDelete": "自动删除",
        "receiveNotice": "接受通知",
        "type": "类型",
        "serve": "发送邮件服务器",
        "model": "相关文档模型",
        "modelId": "相关文档Id",
        "mesId": "消息Id",
        "header": "参照头",
        "reference": "参照",
        "plzInput": "请输入",
        "plzSelect": "请选择"
    }
}
</i18n>

<style scoped>
.flexWidth {
    width: 80%;
}
</style>