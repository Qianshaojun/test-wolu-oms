<template>
    <section
        class="component full-absolute chat-user-input padding-x flex-column"
        :style="{ height: inputHeight + 52 + 'px' }"
    >
        <div>
            <a-select
                show-search
                defaultValue="Select Template"
                style="width: 200px"
                class="priority-container margin-y"
                :filter-option="filterOption"
                :dropdown-match-select-width="false"
                :dropdown-style="{ width: '300px' }"
            >
                <!-- <div v-for="item of templates" :key="item.name"> -->
                <a-select-option
                    v-for="item of active_templates"
                    :key="item.id"
                    :value="item.id"
                    @click="renderTemplate(item)"
                    style="position: relative;"
                    class="template_option"
                >
                    {{ item.name }}
                    <span
                        class="option_btn"
                        style="position: absolute;right:15px;"
                    >
                        <a-icon
                            v-if="item.is_star"
                            type="star"
                            @click="unStar(item)"
                            theme="filled"
                        />
                        <a-icon v-else type="star" @click="onStar(item)" />

                        <a-icon
                            type="edit"
                            style="margin-left:5px"
                            @click="onEdit(item)"
                        />
                        <a-icon
                            type="delete"
                            style="margin-left:5px"
                            @click="onDelete(item)"
                        />
                    </span>
                </a-select-option>
                <!-- </div> -->
            </a-select>
            <a-icon
                type="reload"
                @click="reloadTemplate()"
                style="margin-left: 15px;font-size: 22px;"
            />
            <a-button style="margin-left: 10px;" @click="createTemplate()">{{
                $t('createTemplate')
            }}</a-button>
        </div>

        <quill-editor
            v-model="content"
            :options="editorOption"
            @focus="focusHeightLine()"
            @blur="blurHeightLine()"
            :style="{ height: messageHeight }"
            style="margin-bottom:40px"
        >
        </quill-editor>

        <div
            class="flex-row align-items-center justify-content-between margin-y"
        >
            <div>
                <a-tooltip
                    :title="$t('Will not sync with Amazon')"
                    style="float:left;"
                >
                    <a-button class="margin-right" @click="setReply()">{{
                        $t('Set Replied')
                    }}</a-button>
                </a-tooltip>
                <!-- <a-upload
                    :fileList="fileList"
                    name="file"
                    :remove="handleRemove"
                    :beforeUpload="beforeUpload"
                    :multiple="true"
                >
                    <a-button>
                        <a-icon type="upload" />
                        {{ $t('Upload Attachment') }}
                    </a-button>
                </a-upload> -->
                <a-upload-dragger
                    name="file"
                    :multiple="true"
                    :file-list="fileList"
                    :showUploadList="false"
                    :remove="handleRemove"
                    :before-upload="beforeUpload"
                    style="width:350px;height:32px;display:inline-block;"
                >
                    <p style="line-height:0;">
                        {{ $t('attach_or_drag_file') }}
                    </p>
                </a-upload-dragger>
                <ul class="upfile-list" v-if="fileList.length">
                    <li v-for="file of fileList" :key="file.name">
                        <span class="title"
                            ><a-icon type="paper-clip" /> {{ file.name }}</span
                        >
                        <span class="cbx"
                            ><input
                                type="checkbox"
                                name="shipmentPic"
                                :value="file.name"
                                class="ship-pic"
                                @change="onShipmentPicSelect(file)"
                            />
                            {{ $t('set_to_shipment') }}</span
                        >
                        <span class="del"
                            ><a @click="handleRemove(file)"
                                ><a-icon type="delete"/></a
                        ></span>
                    </li>
                </ul>

                <!-- <a-button class="margin-right">Action2</a-button> -->
                <!-- <a-button class="margin-right">Action3</a-button> -->
            </div>
            <div>
                <a-button
                    type="primary"
                    style="margin-right: 10px;"
                    @click="onSendMessage(true)"
                    >{{ $t('send_now') }}</a-button
                >
                <a-button type="primary" @click="onSendMessage(false)">{{
                    $t('send')
                }}</a-button>
            </div>
        </div>
    </section>
</template>
<style>
.template_option {
    position: relative;
}
.template_option:hover .option_btn {
    opacity: 1;
    transform: translateY(0);
}
.option_btn {
    transition: 0.3s;
    opacity: 0;
    transform: translateY(100%);
}
.upfile-list {
    margin: 20px 0 0 0;
    padding: 0;
}
.upfile-list li {
    list-style: none;
    text-align: left;
    position: relative;
}
.upfile-list li:hover {
    background-color: #f2f2f2;
}
.upfile-list li:hover .del {
    display: block;
    width: 20px;
    position: absolute;
    top: 0;
    right: 0;
}
.upfile-list li .title {
    width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
}
.upfile-list li .cbx {
    width: 100px;
    position: absolute;
    right: 30px;
}
.upfile-list li .del {
    width: 20px;
    position: absolute;
    right: 0;
    display: none;
}
</style>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
const chatModule = namespace('chatModule')
const userModule = namespace('userModule')
import { RequestParams } from '~/core/http'
import { EmailService } from '~/services/cs-email.service'
import reqwest from 'reqwest'
import appConfig from '@/config/app.config'
import ModifyTemplate from '~/components/cs_email_return/chat-message-template.vue'
import store from '@/store'

import { quillEditor } from 'vue-quill-editor'

@Component({
    components: {
        ModifyTemplate,
        quillEditor
    }
})
export default class ChatUserInput extends Vue {
    @Prop()
    token: any

    @userModule.State
    private username

    @userModule.State
    private id

    @chatModule.State
    private userList

    @chatModule.State
    private currentUser

    @chatModule.State
    private inputHeight

    @chatModule.State
    private clientHeight

    @chatModule.State
    private checkBoxList

    @chatModule.Mutation('addUserMessage')
    private addUserMessage

    @chatModule.Mutation('updateMessage')
    private updateMessage

    @chatModule.Mutation('updateEarliest')
    private updateEarliest

    @chatModule.Mutation('changeInputHieght')
    private changeInputHieght

    @chatModule.State
    private spinning

    @chatModule.Mutation('changeSpinning')
    private changeSpinning

    @chatModule.Mutation('changeMessageIsReply')
    changeMessageIsReply

    private new_id = 0

    private message = ''

    private areaHeight = 4

    private uploading: any = false

    private fileList: any[] = []

    private shipmentPic: any = ''

    private editorOption = {
        modules: {
            toolbar: [
                ['clean', 'bold', 'italic', 'underline'] // toggled buttons
                // [{ size: ["small", false, "large", "huge"] }]
            ]
        },

        placeholder: '输入任何内容，支持html'
    }

    private messageHeight = '110px'

    // 邮件服务
    private emailService = new EmailService()

    private filterOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private focusHeightLine() {
        var sum = this.fileList.length * 30
        this.changeInputHieght(this.clientHeight * 0.465 + sum)
        this.areaHeight = 16
        this.messageHeight = '350px'
    }

    private blurHeightLine() {
        var sum = this.fileList.length * 30
        this.changeInputHieght(this.clientHeight * 0.2 + sum)
        this.areaHeight = 4
        this.messageHeight = '110px'
    }

    @chatModule.State
    private active_templates

    @chatModule.State
    private all_templates

    @chatModule.Mutation('updateAllTemplates')
    private updateAllTemplates

    private created() {
        this.reloadTemplate()
    }

    private reloadTemplate() {
        var that = this
        this.changeSpinning(true)
        var data = this.emailService
            .getTemplates(new RequestParams())
            .subscribe(
                data => {
                    that.updateAllTemplates(data)
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private createTemplate() {
        let that = this
        this.$modal
            .open(
                ModifyTemplate,
                {},
                {
                    title: this.$t('saveTemplate'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.changeSpinning(true)
                data['save_flag'] = 0
                var result = this.emailService
                    .saveTemplate(new RequestParams(data))
                    .subscribe(
                        data => {
                            this.$message.success(
                                this.$t('Set Success.').toString()
                            )
                            this.reloadTemplate()
                            this.changeSpinning(false)
                        },
                        err => {
                            this.changeSpinning(false)
                            this.$message.error(err.message)
                        }
                    )
            })
    }
    private get receiverUser() {
        const receiver = this.userList.find(x => x.id === this.currentUser)
        return {
            incoming_email: receiver.incoming_email,
            id: receiver.id
        }
    }
    private content = ''

    private get subject() {
        let userChat = this.userList.find(x => x.id === this.currentUser)
        let customer_messages = userChat.messages.filter(
            x => x.is_owner == false
        )
        if (customer_messages.length > 0) {
            return customer_messages[customer_messages.length - 1].name
        } else {
            return ''
        }
    }

    private checkFile() {
        return false
    }

    private onSendMessage(is_send_now) {
        let that = this
        if (this.content.trim() === '') {
            return
        }
        this.message = this.content

        var num = 0

        if (this.checkFile()) {
            this.$error({
                title: 'Error Message',
                content: '亚马逊邮件回复目前仅支持单附件上传及文件大小小于2M'
            })
        } else {
            this.changeSpinning(true)
            if (this.fileList.length > 0) {
                const { fileList } = this
                const formData = new FormData()
                fileList.forEach(file => {
                    formData.append('files' + num.toString(), file)
                    formData.append('shipmentPic', this.shipmentPic)
                    formData.append(
                        'sale_order_num',
                        this.userList.find(x => x.id === this.currentUser)
                            .last_order_num
                    )
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
                    success: result => {
                        try {
                            var obj = eval('(' + result + ')')
                            if (obj.attachment_ids) {
                                var data = this.emailService
                                    .actionSendEmail(
                                        new RequestParams({
                                            customer_id: this.currentUser,
                                            incoming_email: this.userList.find(
                                                x => x.id === this.currentUser
                                            ).incoming_email,
                                            email_content: this.content,
                                            send_now: is_send_now,
                                            file_datas: obj.attachment_ids,
                                            reply_ticket_id_list: this
                                                .checkBoxList,
                                            last_subject: this.subject
                                        })
                                    )
                                    .subscribe(
                                        data => {
                                            this.addUserMessage({
                                                id: data.id,
                                                receiver: that.receiverUser,
                                                message: that.message,
                                                sendername: that.username,
                                                email_state: data.state,
                                                time: data.message
                                            })
                                            this.fileList = []
                                            this.content = ''
                                            this.changeMessageIsReply()
                                            that.changeSpinning(false)
                                        },
                                        err => {
                                            that.changeSpinning(false)
                                            that.$error({
                                                title: 'Error Message',
                                                content: err.message
                                            })
                                        }
                                    )
                                this.changeInputHieght(this.clientHeight * 0.2)
                                this.areaHeight = 4
                                this.messageHeight = '110px'
                            } else {
                                that.changeSpinning(false)
                                this.$message.error(JSON.stringify(obj.message))
                            }
                        } catch (e) {
                            that.changeSpinning(false)
                            this.$message.error(result)
                        }
                    },
                    error: () => {
                        that.changeSpinning(false)
                        this.$message.error(
                            this.$t(
                                'The attachment upload failed, causing the email to fail to be sent.'
                            ).toString()
                        )
                    }
                })
            } else {
                var data = this.emailService
                    .actionSendEmail(
                        new RequestParams({
                            customer_id: this.currentUser,
                            incoming_email: this.userList.find(
                                x => x.id === this.currentUser
                            ).incoming_email,
                            email_content: this.content,
                            send_now: is_send_now,
                            reply_ticket_id_list: this.checkBoxList,
                            last_subject: this.subject
                        })
                    )
                    .subscribe(
                        data => {
                            this.addUserMessage({
                                id: data.id,
                                receiver: that.receiverUser,
                                message: that.message,
                                sendername: that.username,
                                email_state: data.state,
                                time: data.message
                            })
                            this.changeMessageIsReply()
                            this.changeSpinning(false)
                            this.content = ''
                            this.changeInputHieght(215)
                            this.areaHeight = 4
                            this.messageHeight = '110px'
                        },
                        err => {
                            this.changeSpinning(false)
                            this.$error({
                                title: 'Error Message',
                                content: err.message
                            })
                        }
                    )
            }
        }
    }

    private setReply() {
        var data = this.emailService
            .actionSetReply(
                new RequestParams({
                    customer_id: this.userList.find(
                        x => x.id === this.currentUser
                    ).email,
                    incoming_email: this.userList.find(
                        x => x.id === this.currentUser
                    ).incoming_email
                })
            )
            .subscribe(
                data => {
                    this.$message.success(this.$t('Set Success.').toString())
                    this.updateEarliest()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private templateId: any = ''

    private renderTemplate(item) {
        this.templateId = item.id
        this.content = item.body_html
    }

    private updateTemplate() {
        if (this.templateId === '') {
            this.$message.error('未选择模板')
        } else {
            this.changeSpinning(true)
            var result = this.emailService
                .saveTemplate(
                    new RequestParams({
                        content: this.content,
                        name: this.active_templates.find(
                            x => x.id === this.templateId
                        ).name,
                        template_id: this.templateId,
                        save_flag: 1
                    })
                )
                .subscribe(
                    data => {
                        this.$message.success(
                            this.$t('Set Success.').toString()
                        )
                        this.reloadTemplate()
                    },
                    err => {
                        this.changeSpinning(false)
                        this.$message.error(err.message)
                    }
                )
        }
    }

    private handleRemove(file) {
        const index = this.fileList.indexOf(file)
        const newFileList = this.fileList.slice()
        newFileList.splice(index, 1)
        this.fileList = newFileList
        this.changeInputHieght(this.inputHeight - 30)
    }
    private beforeUpload(file) {
        this.fileList = [...this.fileList, file]
        this.changeInputHieght(this.inputHeight + 30)
        return false
    }

    private onDelete(template: any) {
        var result = this.emailService
            .deleteTemplate(new RequestParams({ template_id: template.id }))
            .subscribe(
                data => {
                    this.$message.success(this.$t('Set Success.').toString())
                    this.reloadTemplate()
                    this.templateId = ''
                    this.content = ''
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private onStar(template: any) {
        var result = this.emailService
            .starTemplate(
                new RequestParams({ template_id: template.id, data: true })
            )
            .subscribe(
                data => {
                    this.$message.success(this.$t('Set Success.').toString())
                    this.reloadTemplate()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private unStar(template: any) {
        var result = this.emailService
            .starTemplate(
                new RequestParams({ template_id: template.id, data: false })
            )
            .subscribe(
                data => {
                    this.$message.success(this.$t('Set Success.').toString())
                    this.reloadTemplate()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private onEdit(template: any) {
        let that = this
        this.$modal
            .open(
                ModifyTemplate,
                {
                    template: template
                },
                {
                    title: this.$t('saveTemplate'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.changeSpinning(true)
                data['save_flag'] = 1
                data['template_id'] = template.id
                var result = this.emailService
                    .saveTemplate(new RequestParams(data))
                    .subscribe(
                        data => {
                            this.$message.success(
                                this.$t('Set Success.').toString()
                            )
                            this.reloadTemplate()
                            this.changeSpinning(false)
                            this.content = ''
                        },
                        err => {
                            this.changeSpinning(false)
                            this.$message.error(err.message)
                        }
                    )
            })
    }

    private onShipmentPicSelect(file) {
        let cbx: any = document.getElementsByClassName('ship-pic')
        if (!file.type.includes('image')) {
            this.$message.error('非图片格式，不能选择')
            for (let i of cbx) {
                if (i.value === file.name) {
                    i.checked = false
                }
            }
            return
        }

        for (let i of cbx) {
            if (i.value === file.name) {
                if (i.checked === true) {
                    this.shipmentPic = file.name
                } else {
                    this.shipmentPic = ''
                }
            } else {
                i.checked = false
            }
        }
    }

    private
}
</script>

<style lang="less" scoped>
.chat-user-input {
    border-top: solid 1px rgb(200, 200, 200);
    padding: 5px;
}
</style>

<i18n>
{
    "en-us":{
        "createTemplate": "Create Template",
        "saveTemplate": "Save Template",
        "updateTemplate": "update Template",
        "today":"Today",
        "Will not sync with Amazon":"Will not sync with Amazon",
        "Set Replied":"Set Replied",
        "Upload Attachment":"Upload Attachment",
        "The attachment upload failed, causing the email to fail to be sent.":"The attachment upload failed, causing the email to fail to be sent.",
        "Set Success.":"Set Success.",
        "send":"Send",
        "send_now":"Send Immediately",
        "attach_or_drag_file":"Click or drag file to this area to upload",
        "set_to_shipment":"Set to Shipment"
    },
    "zh-cn":{
        "createTemplate": "创建模板",
        "saveTemplate": "保存模板",
        "updateTemplate": "更新模板",
        "today":"今天",
        "Will not sync with Amazon":"不会同步到亚马逊",
        "Set Replied":"设为已回复",
        "Upload Attachment":"上传附件",
        "The attachment upload failed, causing the email to fail to be sent.":"附件上传失败,导致邮件发送失败。",
        "Set Success.":"设置成功.",
        "send":"发送",
        "send_now":"立刻发送",
        "attach_or_drag_file":"点击选择或拖动文件到此区域",
        "set_to_shipment":"设为物流单"
    }
}
</i18n>
