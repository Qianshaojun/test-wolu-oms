<template>
    <page-container ref="pageContainer" :showHeader="false">
        <section class="component sentEmailDetail">
            <a-card>
                <!--左上状态-->
                <div style="position:absolute;top:10px;right:10px;">
                    <div class="progress-bar">
                        <li
                            :value="item.value"
                            v-for="item of $dict.SentEmailStatus"
                            :key="item.value"
                            :class="{ active: detailInfo.state == item.value }"
                            style="font-size: 12px;"
                        >
                            <span>{{ $t(item.label) }}</span>
                        </li>
                    </div>
                </div>

                <div class="buttonGroup">
                    <template v-if="isEdit">
                        <a-button @click="save" type="primary" icon="baocun"
                            >{{ $t('save') }}
                        </a-button>
                        <a-button @click="back" type="primary" icon="left"
                            >{{ $t('back') }}
                        </a-button>
                    </template>
                    <template v-else>
                        <a-button
                            @click="edit"
                            type="primary"
                            icon="bianji"
                            v-if="detailInfo.state === 'outgoing'"
                            >{{ $t('edit') }}
                        </a-button>
                        <a-button
                            @click="modifyEmailStatus('outgoing')"
                            type="primary"
                            icon="zhongzhi"
                            v-if="detailInfo.state === 'exception'"
                            >{{ $t('retry') }}
                        </a-button>
                        <template v-if="detailInfo.state === 'outgoing'">
                            <a-button @click="send" type="primary" icon="paper"
                                >{{ $t('send') }}
                            </a-button>
                        </template>
                        <template
                            v-if="
                                detailInfo.state === 'outgoing' ||
                                    detailInfo.state === 'cancel'
                            "
                        >
                            <a-button
                                @click="modifyEmailStatus('cancel')"
                                type="primary"
                                icon="close"
                                >{{ $t('cancel') }}
                            </a-button>
                        </template>
                    </template>
                </div>

                <h2 v-if="!isEdit">{{ detailInfo.subject }}</h2>
                <div class="main">
                    <template v-if="isEdit">
                        <a-form
                            :form="form"
                            :labelCol="{ span: 2 }"
                            :wrapperCol="{ span: 14 }"
                        >
                            <a-row>
                                <a-col :span="12">
                                    <a-form-item :label="$t('title')">
                                        <a-input
                                            v-decorator="[
                                                'subject',
                                                {
                                                    initialValue:
                                                        detailInfo.subject
                                                }
                                            ]"
                                            :placeholder="$t('plzInput')"
                                            class="flexWidth"
                                        />
                                    </a-form-item>
                                    <a-form-item :label="$t('from')">
                                        <a-input
                                            v-decorator="['email_from']"
                                            :placeholder="$t('plzInput')"
                                            class="flexWidth"
                                        />
                                    </a-form-item>

                                    <a-form-item :label="$t('to')">
                                        <a-textarea
                                            v-decorator="['email_to']"
                                            :placeholder="$t('plzInput')"
                                            class="flexWidth"
                                            :rows="2"
                                        />
                                    </a-form-item>
                                    <a-form-item :label="$t('date')">
                                        <a-input
                                            v-decorator="['scheduled_date']"
                                            :placeholder="$t('plzInput')"
                                            class="flexWidth"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item :label="$t('custom')">
                                        <a-select
                                            v-decorator="['recipient_ids']"
                                            class="flexWidth"
                                            :placeholder="$t('plzSelect')"
                                            mode="multiple"
                                            :filterOption="filterSelectOption"
                                        >
                                            <a-select-option
                                                v-for="(item,
                                                index) in customList"
                                                :key="index"
                                                :value="item.id"
                                            >
                                                {{ item.name }}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-item>
                                    <a-form-item :label="$t('copyTo')">
                                        <a-input
                                            v-decorator="['email_cc']"
                                            :placeholder="$t('plzInput')"
                                            class="flexWidth"
                                        />
                                    </a-form-item>
                                    <a-form-item :label="$t('reply')">
                                        <a-input
                                            v-decorator="['reply_to']"
                                            :placeholder="$t('plzInput')"
                                            class="flexWidth"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-form>
                    </template>
                    <template v-else>
                        <a-form
                            :form="form"
                            :labelCol="{ span: 2 }"
                            :wrapperCol="{ span: 14 }"
                        >
                            <a-row>
                                <a-col :span="12">
                                    <a-form-item :label="$t('from')">
                                        {{ detailInfo.email_from }}
                                    </a-form-item>

                                    <a-form-item :label="$t('to')">
                                        {{ detailInfo.email_to }}
                                    </a-form-item>
                                    <a-form-item :label="$t('custom')"
                                        >{{ customName }}
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item :label="$t('copyTo')"
                                        >{{ detailInfo.email_cc }}
                                    </a-form-item>
                                    <a-form-item :label="$t('reply')">
                                        {{ detailInfo.reply_to }}
                                    </a-form-item>
                                    <a-form-item :label="$t('date')">
                                        {{
                                            detailInfo.scheduled_date
                                                | datetolocal
                                        }}
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-form>
                    </template>

                    <a-tabs type="card" @change="changeTab">
                        <a-tab-pane key="body" :tab="$t('body')">
                            <quill-editor
                                v-model="content"
                                :options="editorOption"
                                :style="{ height: messageHeight }"
                                style="margin-bottom:60px"
                                v-if="isEdit"
                            >
                            </quill-editor>
                            <template v-else>
                                <div
                                    v-html="detailInfo.body_html"
                                    style="padding: 0 10px"
                                ></div>
                            </template>
                        </a-tab-pane>
                        <a-tab-pane key="advanced" :tab="$t('advance')">
                            <emailAdvanced
                                :is-edit="isEdit"
                                ref="emailAdvanced"
                                :detailInfo="detailInfo"
                            ></emailAdvanced>
                        </a-tab-pane>
                        <a-tab-pane key="attachments" :tab="$t('attachments')">
                            <emailAttachment
                                :list="attList"
                                :is-edit="isEdit"
                            ></emailAttachment>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-card>
        </section>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Page } from '@/core/decorators'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { LoadingService } from '@/bootstrap/services/loading.service'
import { PublicService } from '@/services/public.service'
import { RequestParams } from '@/core/http'
import { CommonService } from '@/shared/utils/common.service'
import emailAdvanced from '@/components/customer/emailAdvanced.vue'
import emailAttachment from '@/components/customer/emailAttachment.vue'
import { quillEditor } from 'vue-quill-editor'
import { PartnerService } from '@/services/partner.service'
import { PageService } from '@/bootstrap/services/page.service'

@Page({
    layout: 'workspace',
    name: 'sent-email-wrapper'
})
@Component({
    components: {
        emailAdvanced,
        emailAttachment,
        quillEditor
    }
})
export default class sentEmailDetail extends Vue {
    @Ref('emailAdvanced')
    private emailAdvanced
    /**
     *  服务
     * @private
     */
    private innerAction = new InnerActionService()
    private loadingService = new LoadingService()
    private publicService = new PublicService()
    private partnerService = new PartnerService()
    private pageService = new PageService()
    /**
     *  data
     * @private
     */
    private detailInfo: any = {}
    private emailId: number = 0
    private queryUrl: string = 'helpdesk/query_one_mail_info'
    private isEdit: boolean = false
    private form: any
    private customList: any = []
    private attList: any = []
    private title: string = ''
    private content: string = ''
    private messageHeight = '210px'
    private editorOption = {
        modules: {
            toolbar: [
                ['clean', 'bold', 'italic', 'underline'] // toggled buttons
            ]
        },

        placeholder: '输入任何内容，支持html'
    }
    private customName: string = ''

    private beforeCreate() {
        this.form = this.$form.createForm(this)
    }

    private created() {
        this.emailId = +this.$route.params.id
        this.getDetailInfo()
        this.getCustomList()
    }

    private mounted() {}

    /**
     *  methods
     * @private
     */
    private getDetailInfo() {
        this.innerAction.setActionAPI(
            this.queryUrl,
            CommonService.getMenuCode('sent_email')
        )
        this.publicService
            .query(
                new RequestParams(
                    {
                        mail_id: this.emailId
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.detailInfo = data.message[0]
                    if (
                        this.detailInfo.recipient_ids &&
                        this.detailInfo.recipient_ids.length
                    ) {
                        let arr: any = []
                        this.detailInfo.recipient_ids.forEach((v: any) => {
                            arr.push(v.name)
                        })
                        this.customName = arr.join()
                    }
                    this.isEdit = false
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    //获取客户列表
    private getCustomList() {
        this.partnerService
            .queryCustomerContact(
                new RequestParams(
                    {},
                    {
                        page: this.pageService
                    }
                )
            )
            .subscribe(
                data => {
                    this.customList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    //更改状态
    private modifyEmailStatus(state) {
        this.innerAction.setActionAPI(
            'helpdesk/update_mail_mail_state',
            CommonService.getMenuCode('sent_email')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        mail_id: this.emailId,
                        state: state
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('成功')
                    this.getDetailInfo()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private edit() {
        this.isEdit = true
        this.content = this.detailInfo.body_html //富文本编辑器获取默认数据
        let obj = this.detailInfo
        let arr: any = []
        //处理客户字段显示
        if (
            this.detailInfo.recipient_ids &&
            this.detailInfo.recipient_ids.length
        ) {
            this.detailInfo.recipient_ids.forEach((v: any) => {
                arr.push(v.id)
            })
        }
        this.$nextTick(() => {
            this.form.setFieldsValue({
                subject: obj.subject,
                email_from: obj.email_from,
                email_to: obj.email_to,
                recipient_ids: arr,
                email_cc: obj.email_cc,
                reply_to: obj.reply_to,
                scheduled_date: obj.scheduled_date
            })
            if (this.emailAdvanced) {
                this.emailAdvanced.setFormValue(this.detailInfo)
            }
        })
    }

    private save() {
        let advanceData = {}
        if (this.emailAdvanced) {
            advanceData = this.emailAdvanced.getFormValue() //tab高级数据
        }
        let baseData = this.form.getFieldsValue()
        let data: object = {
            body_html: this.content,
            id: this.emailId,
            mail_message_id: this.detailInfo.mail_message_id,
            save_flag: 1,
            ...advanceData,
            ...baseData
        }
        this.innerAction.setActionAPI(
            'helpdesk/save_mail_mail',
            CommonService.getMenuCode('sent_email')
        )
        this.publicService
            .modify(
                new RequestParams(data, {
                    loading: this.loadingService,
                    innerAction: this.innerAction
                })
            )
            .subscribe(
                data => {
                    this.getDetailInfo()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private back() {
        this.isEdit = !this.isEdit
    }

    private send() {
        this.innerAction.setActionAPI(
            'helpdesk/send_now_mail_mail',
            CommonService.getMenuCode('sent_email')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        mail_id: this.emailId
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.getDetailInfo()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private changeTab(key) {
        switch (key) {
            case 'advanced':
                this.$nextTick(() => {
                    if (this.emailAdvanced) {
                        this.emailAdvanced.setFormValue(this.detailInfo)
                    }
                })

                break
            case 'attachments':
                this.getAttachmentsList()
                break
        }
    }

    private getAttachmentsList() {
        this.innerAction.setActionAPI(
            'helpdesk/query_one_mail_attachments',
            CommonService.getMenuCode('sent_email')
        )
        this.publicService
            .query(
                new RequestParams(
                    {
                        mail_message_id: this.detailInfo.mail_message_id
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.attList = data.message
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

<style lang="less">
.sentEmailDetail {
    h2 {
        font-size: 20px !important;
        font-weight: bold;
    }

    .buttonGroup {
        margin: 15px 0;

        button:nth-child(1) {
            margin-left: 0;
        }

        button {
            margin-left: 5px;
        }
    }

    .main {
        margin-top: 10px;
    }

    .flexWidth {
        width: 80%;
    }
}
</style>

<i18n>
{
    "en-us": {
        "edit": "edit",
        "send": "send",
        "retry": "retry",
        "save": "save",
        "cancel": "cancel",
        "from": "From",
        "to": "To",
        "custom": "To(Partners)",
        "copyTo": "Cc",
        "reply": "Reply-To",
        "date": "Scheduled Send Date",
        "body": "Body",
        "advance": "Advanced",
        "attachments": "Attachments",
        "plzInput": "pleaseInput",
        "plzSelect": "pleaseSelect",
        "title": "Subject",
        "back": "Back"
    },
    "zh-cn": {
        "edit": "修改",
        "send": "立即发送",
        "retry": "重试",
        "save": "保存",
        "cancel": "取消",
        "from": "发件人",
        "to": "收件人",
        "custom": "客户",
        "copyTo": "抄送人",
        "reply": "回复人",
        "date": "计划发送日期",
        "body": "正文",
        "advance": "高级",
        "attachments": "附件",
        "plzInput": "请输入",
        "plzSelect": "请选择",
        "title": "标题",
        "back": "丢弃"
    }
}
</i18n>