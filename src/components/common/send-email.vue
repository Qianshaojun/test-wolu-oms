<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            style="display:inline-block;"
            layout="inline"
            :form="form"
            :labelCol="{ span: 2 }"
            :wrapperCol="{ span: 21, offset: 1 }"
        >
            <a-row :gutter="24">
                <a-col :span="23">
                    <a-form-item :label="$t('forms.recipient')" required>
                        <a-select
                            mode="tags"
                            v-decorator="[
                                `recipient`,
                                { rules: rules.required },
                                { initialValue: recipient }
                            ]"
                            style="width: 100%"
                            placeholder="Please select"
                            size="small"
                        >
                            <a-select-option
                                v-for="item in recipientList"
                                :key="item.id"
                            >
                                {{ item.email }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="23">
                    <a-form-item :label="$t('forms.subject')" required>
                        <a-input
                            v-decorator="[
                                `subject`,
                                { rules: rules.required },
                                { initialValue: subject }
                            ]"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="23">
                    <a-form-item :label="$t('forms.email_from')" required>
                        <a-select
                            showSearch
                            v-decorator="[
                                `email_from`,
                                { rules: rules.required }
                            ]"
                            style="width: 100%"
                            placeholder="Please select"
                            size="small"
                        >
                            <a-select-option
                                v-for="item in emailFromList"
                                :key="item.id"
                            >
                                {{ item.email }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <quill-editor
                v-model="content"
                :options="editorOption"
                style="height:200px;margin:20px 0;display:inherit;"
            >
            </quill-editor>
            <div style="width:100%;height:150px;">
                <div
                    style="width:60%;height:85%;margin-top:20px;border-right:1px solid #ccc;float:left;"
                >
                    <!-- <a-upload
                        :file-list="fileList"
                        :remove="handleRemove"
                        :before-upload="beforeUpload"
                        style="float:left;"
                    >
                        <a-button>
                            <a-icon type="upload" /> {{ $t('attach_file') }}
                        </a-button>
                    </a-upload> -->
                    <a-upload-dragger
                        name="file"
                        :multiple="true"
                        :file-list="fileList"
                        :remove="handleRemove"
                        :before-upload="beforeUpload"
                        style="width:550px;height:40px;display:inline-block;"
                    >
                        <p style="line-height:10px;">
                            {{ $t('attach_or_drag_file') }}
                        </p>
                    </a-upload-dragger>
                    <div v-if="filename">
                        {{ filename }}
                        <a-icon
                            type="delete"
                            @click="removeFilename"
                            style="float: right;margin-right: 5px;"
                        />
                    </div>
                </div>
                <div
                    style="width:38%;padding:1%;height:90%;margin-top:20px;float:left;"
                >
                    <a-row :gutter="24">
                        <a-col :span="23">
                            <label style="margin-left:15px;">{{
                                $t('use_template')
                            }}</label>
                            <a-form-item required>
                                <a-select
                                    v-decorator="[
                                        `template`,
                                        { initialValue: templateID }
                                    ]"
                                    style="width: 100%"
                                    placeholder="Please select"
                                    size="small"
                                    @change="e => onTemplateChange(e)"
                                >
                                    <a-select-option
                                        v-for="item in templateList"
                                        :key="item.code"
                                    >
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </div>
            </div>
        </a-form>
        <div
            class="flex-row margin-top"
            style="border-top: 1px solid #e8e8e8;padding-top: 10px;position:relative;"
        >
            <a-button
                type="primary"
                class="margin-right"
                :disabled="isAbeld"
                @click="onSubmit"
                >{{ $t('action.send') }}</a-button
            >
            <a-button @click="cancel">{{ $t('action.cancel') }}</a-button>
            <a-button
                @click="saveTemplate"
                style="position:absolute;right:0;top:10px;"
                ><a-icon type="save" />
                {{ $t('action.save_template') }}</a-button
            >
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { MailService } from '../../services/mail.service'
import { quillEditor } from 'vue-quill-editor'
import SaveEmailTemplate from './save-email-template.vue'
import reqwest from 'reqwest'
import { formConfig } from '../../config/form.config'
import appConfig from '../../config/app.config'
import store from '@/store'

@Component({
    components: {
        quillEditor
    }
})
export default class SendEmail extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        if (this.changeSpinning) {
            this.changeSpinning(false)
        }
        return
    }

    @Prop()
    private data: any

    @Prop()
    private model

    @Prop()
    private recordID

    @Prop()
    private changeSpinning

    private recipient: any = ''

    private recipientList: any = []

    private emailFromList: any = []

    private subject: any = ''

    private templateID: any = ''

    private form: any

    private loadingService = new LoadingService()

    private mailService = new MailService()

    private templateList: any[] = []

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private fileList: any = []

    private content: any = ''

    private orderId: any = ''

    private attachmentList: any = []

    private filename: any = ''

    private removeFilename() {
        this.filename = ''
        this.attachmentList = []
    }

    private editorOption = {
        placeholder: '输入任何内容，支持html'
    }

    private isAbeld: any = false

    public mounted() {
        this.emailFromList = [
            {
                id: 'odoo@woltu.com',
                email: 'odoo@woltu.com'
            }
        ]
        if (this.data) {
            this.recipient = this.data.recipient ? this.data.recipient : ''
            this.subject = this.data.subject ? this.data.subject : ''
            this.content = this.data.content ? this.data.content : ''
            this.orderId = this.data.orderId ? this.data.orderId : ''
            this.templateID = this.data.templateId ? this.data.templateId : ''
            this.attachmentList = this.data.attachmentList
                ? this.data.attachmentList
                : []
            this.filename = this.data.filename ? this.data.filename : ''
            delete this.data.attachmentList
            delete this.data.filename
            delete this.data.orderId

            this.setFormValues()
        }
        if (this.templateID != '') {
            this.onTemplateChange(this.templateID)
        }
    }

    public setFormValues() {
        this.form.setFieldsValue(this.data)
    }

    public created() {
        // let generateFile = this.base64ToFile('xxxx.png')
        // generateFile['uid'] = Math.ceil(Math.random() * 1000)
        // this.beforeUpload(generateFile)
        this.getTemplateList()
        this.form = this.$form.createForm(this)
    }

    private onSubmit() {
        let loading = this.loading
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['content'] = this.content
                // console.log(values)
                this.sendEmail(values)
            }
        })
    }

    private async sendEmail(data) {
        let that = this
        await new Promise((reslove, reject) => {
            const { fileList } = this
            const formData = new FormData()
            let num = 0
            fileList.forEach(file => {
                formData.append('files' + num.toString(), file)
                num++
            })

            reqwest({
                url:
                    appConfig.server +
                    '/email/create_email_attachment?csrf_token=' +
                    store.state.userModule.token +
                    '&customer_key=' +
                    localStorage.getItem('session_id'),
                method: 'post',
                processData: false,
                data: formData,
                success: data => {
                    try {
                        var obj = eval('(' + data + ')')

                        if (obj.attachment_ids) {
                            this.fileList = []

                            reslove(obj)
                        } else {
                            reject(obj)
                        }
                    } catch (e) {
                        reject(e)
                    }
                },
                error: err => {
                    reject(err)
                }
            })
        }).then((ret: any) => {
            if (ret.attachment_ids) {
                if (ret.attachment_ids.length == 0) {
                    data.files = this.attachmentList
                } else {
                    data.files = ret.attachment_ids.concat(that.attachmentList)
                }
                this.saveCustomer(data)
            } else {
                this.closeLoading()
                this.$message.error('附件上传失败')
            }
        })
    }

    private saveCustomer(data) {
        this.mailService
            .createEmail(
                new RequestParams(
                    {
                        email_to: data.recipient,
                        subject: data.subject,
                        files: data.files,
                        body_html: data.content,
                        email_from: data.email_from
                    },
                    this.loading
                )
            )
            .subscribe(
                data => {
                    this.closeLoading()
                    this.$message.success('发送成功')
                    this.submit()
                },
                err => {
                    this.closeLoading()
                    this.$message.error(err.message)
                }
            )
    }

    private getTemplateList() {
        this.mailService
            .queryEmailTemplate(
                new RequestParams(
                    {
                        model: this.model
                    },
                    this.loading
                )
            )
            .subscribe(
                data => {
                    this.templateList = data
                    this.closeLoading()
                },
                err => {
                    this.closeLoading()
                    this.$message.error(err.message)
                }
            )
    }

    private handleRemove(file) {
        const index = this.fileList.indexOf(file)
        const newFileList = this.fileList.slice()
        newFileList.splice(index, 1)
        this.fileList = newFileList
    }
    private beforeUpload(file) {
        this.fileList = [...this.fileList, file]
        return false
    }

    private async handleUpload() {
        const { fileList } = this
        const formData = new FormData()
        let num = 0
        fileList.forEach(file => {
            formData.append('files' + num.toString(), file)
            num++
        })

        reqwest({
            url:
                appConfig.server +
                '/email/create_email_attachment?csrf_token=' +
                store.state.userModule.token +
                '&customer_key=' +
                localStorage.getItem('session_id'),
            // url: 'http://47.244.150.247:28069/wms/order_new/upload_file',
            method: 'post',
            processData: false,
            data: formData,
            success: data => {
                try {
                    var obj = eval('(' + data + ')')

                    if (obj.attachment_ids) {
                        this.fileList = []
                        return new Promise(reslove => {
                            reslove(obj.attachment_ids)
                        })
                    } else {
                        this.$message.error(JSON.stringify(obj.message))
                    }
                } catch (e) {
                    return new Promise(reject => {
                        reject(e)
                    })
                    // this.$message.error(data)
                }
            },
            error: err => {
                return new Promise(reject => {
                    reject(err)
                })
                // this.$message.error('上传失败.')
            }
        })
    }

    private saveTemplate() {
        this.$modal
            .open(
                SaveEmailTemplate,
                {},
                {
                    title: this.$t('action.save_template')
                }
            )
            .subscribe(data => {})
    }

    private get loading() {
        let loading: any = {}
        this.isAbeld = true
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }
        return loading
    }

    private closeLoading() {
        this.isAbeld = false
        if (this.changeSpinning) {
            this.changeSpinning(false)
        }
    }

    private onTemplateChange(e) {
        this.mailService
            .renderEmailTemplate(
                new RequestParams(
                    {
                        template_id: e,
                        record_id: this.recordID,
                        order_id: this.orderId
                    },
                    this.loading
                )
            )
            .subscribe(
                data => {
                    this.content = data[0].body_html

                    let values = this.form.getFieldsValue()
                    values['subject'] = data[0].subject
                    values['email_from'] = data[0].email_from[0].id
                    this.emailFromList = data[0].email_from
                    if (data[0].email_to) {
                        values['recipient'] = [data[0].email_to]
                    } else {
                        this.$message.warning('未找到该客户邮箱')
                    }
                    this.form.setFieldsValue(values)

                    //处理附件
                    if (data[0].attachments && data[0].attachments.length) {
                        for (let i of data[0].attachments) {
                            let suffix = 'data:application/pdf;base64,'
                            let base64Str = suffix + i[1]
                            let file = this.base64ToFile(i[0], base64Str)
                            file['uid'] = Math.ceil(Math.random() * 1000)
                            this.beforeUpload(file)
                        }
                    }
                    this.closeLoading()
                },
                err => {
                    this.closeLoading()
                    this.$message.error(err.message)
                }
            )
    }

    //file 转 base64
    private base64(file) {
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function() {
            // console.log(reader.result) //获取到base64格式图片
        }
    }

    private base64ToFile(filename, dataurl) {
        var arr: any = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, { type: mime })
    }
}
</script>

<i18n>
{
  "en-us": {
    "use_template":"Use Template",
    "attach_file":"Attach File",
    "attach_or_drag_file":"Click or drag file to this area to upload",
    "forms":{
       "recipient":"Recipients",
       "subject":"Subject",
       "cancel_memo":"Cancel Memo",
       "customer_reason":"Customer Reason",
       "product_problem":"Product Problem",
       "logistic_reason":"Logistic Reason",
       "warehouse_reason":"Warehouse Reason",
       "send_email":"Send Email",
       "email_from":"Email From"
    },
    "action":{
      "send":"Send Email",
      "cancel":"Cancel",
      "save_template":"Save Template"
    }
  },
  "zh-cn": {
      "use_template":"邮件模板",
      "attach_file":"选择附件",
      "attach_or_drag_file":"点击选择或拖动文件到此区域",
     "forms":{
       "recipient":"收件人",
       "subject":"主题",
       "cancel_memo":"取消备注",
       "customer_reason":"客户原因",
       "product_problem":"产品问题",
       "logistic_reason":"逻辑问题",
       "warehouse_reason":"仓库问题",
       "send_email":"发送邮件",
       "email_from":"发件人"
    },
    "action":{
      "send":"发送",
      "cancel":"取消",
      "save_template":"保存邮件模板"
    }
  }
}
</i18n>
