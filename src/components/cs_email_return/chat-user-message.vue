<template>
    <section class="component flex-column chat-user-message full-absolute">
        <div class="chat-title flex-row align-items-center">
            <div>
                <div class="username" v-if="userChat">
                    {{ userChat.username }}
                    <span
                        :data-clipboard-text="userChat.email"
                        class="latest"
                        id="copyValue"
                        @click="copyEmail"
                        >{{ userChat.email }}</span
                    >
                </div>
                <div>
                    {{ subject }}
                </div>
            </div>
        </div>

        <div
            ref="message-container"
            class="message-container flex-auto"
            v-if="isMessagesNull"
        >
            <div
                v-for="(item, index) of userChat.messages"
                :key="item.id"
                class="message-item flex-row"
                :class="{
                    'justify-content-start': !item.is_owner,
                    'justify-content-end': item.is_owner,
                    'is-owner': item.is_owner
                }"
            >
                <div v-if="item.state !== 'cancel'">
                    <a-checkbox
                        @change="checkBoxOnChange(item)"
                        v-if="
                            !item.is_owner &&
                                userChat.email.indexOf('members.ebay') >= 0
                        "
                        :checked="isCheck(item)"
                        >{{ item.sendername
                        }}<span>
                            {{ item.time | datetolocal }}
                            <a-icon
                                type="paper-clip"
                                v-if="item.exists_attach"
                                @click.prevent="e => openImage(item, e)"
                            />
                            <span v-if="item.user_id == id">
                                assigned to you</span
                            >
                        </span></a-checkbox
                    >
                    <div
                        style="padding-bottom:3px;padding-left:20px;color:#a5a5a5;padding-right: 20px;
                    text-align: right"
                        v-if="
                            item.is_owner ||
                                userChat.email.indexOf('members.ebay') == -1
                        "
                        :style="{
                            'text-align': !item.is_owner ? 'left' : 'right'
                        }"
                    >
                        {{ item.sendername
                        }}<span>
                            {{ item.time | datetolocal }}
                            <a-icon
                                type="paper-clip"
                                v-if="item.exists_attach"
                                style="color:black"
                                @click.prevent="e => openImage(item, e)"
                            />
                        </span>
                    </div>
                    <div
                        v-if="item.is_owner && item.state === 'exception'"
                        style="padding-bottom:3px;padding-left:20px;color:red;padding-right: 20px;
                    text-align: right; font-size: 20px;"
                    >
                        {{ $t('Send Failed:') }} {{ item.failure_reason }}
                    </div>
                    <!-- <div
                        style="padding-bottom:3px;padding-left:20px;color:#a5a5a5;padding-right: 20px;"
                        :style="{
                            'text-align': !item.is_owner ? 'left' : 'right'
                        }"
                    >
                        {{ item.time | datetolocal }}
                        <a-icon
                            type="paper-clip"
                            v-if="item.exists_attach"
                            style="color:black"
                            @click.prevent="e=>openImage(item,e)"
                        />
                    </div> -->
                    <div class="flex-row align-items-center">
                        <div class="message-action">
                            <a-dropdown :trigger="['click']">
                                <button
                                    class="ant-dropdown-link"
                                    href="#"
                                    style="margin-top: 10px"
                                    :style="{
                                        'margin-left': !item.is_owner
                                            ? '10px'
                                            : '0px',
                                        'margin-bottom': !item.is_owner
                                            ? '1px'
                                            : '10px'
                                    }"
                                >
                                    {{ $t('more_operate') }}
                                </button>
                                <a-menu slot="overlay">
                                    <a-menu-item
                                        v-if="item.state === 'outgoing'"
                                    >
                                        <li
                                            @click="
                                                revertMessage(index, item.id)
                                            "
                                        >
                                            {{ $t('delete') }}
                                        </li>
                                    </a-menu-item>
                                    <a-menu-item
                                        v-if="item.origin_id !== false"
                                    >
                                        <li @click="openSourceMessage(item)">
                                            {{ $t('origin_email') }}
                                        </li>
                                    </a-menu-item>
                                    <a-menu-item v-if="item.exists_attach">
                                        <li
                                            @click.prevent="
                                                e => openImage(item, e)
                                            "
                                        >
                                            {{ $t('images') }}
                                        </li>
                                    </a-menu-item>
                                </a-menu>
                            </a-dropdown>
                        </div>

                        <div
                            class="message-border"
                            :class="{ 'is-owner': item.is_owner }"
                            style="color: black"
                            v-html="item.content"
                            :style="{
                                'max-width':
                                    (clientWidth * 0.75 - 40) * 0.8 + 'px'
                            }"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import moment from 'moment'
import { RequestParams } from '~/core/http'
import { EmailService } from '~/services/cs-email.service'
import { CustomProblemService } from '~/services/custom_problem.service'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { ProductService } from '@/services/product.service'
import ChatMessageAttachment from '~/components/cs_email_return/chat-message-attachment.vue'
import Clipboard from 'clipboard'

const datasModule = namespace('datasModule')

const chatModule = namespace('chatModule')
const userModule = namespace('userModule')

@Component({
    components: { ChatMessageAttachment }
})
export default class ChatUserMessage extends Vue {
    private copyEmail() {
        let that = this
        var clipboard = new Clipboard('#copyValue')
        clipboard.on('success', e => {
            this.$message.info(this.$t('Copied Success').toString())
            // 释放内存
            clipboard.destroy()
        })
        clipboard.on('error', e => {
            // 不支持复制
            this.$message.info(this.$t('Copied failure').toString())
            // 释放内存
            clipboard.destroy()
        })
    }

    @userModule.State
    private username

    @userModule.State
    private id

    @chatModule.State
    private currentUser

    @chatModule.State
    private userList

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private iconStyle = { fontSize: '16px', color: '#5a5a5a' }

    private get moment() {
        return moment
    }

    @Ref('message-container')
    private messageContainer

    @Watch('userChat.messages')
    onMessageChange() {
        this.isMessagesNull = true
        this.scrollToBottom()
    }

    @Watch('currentUser')
    onUserChange() {
        this.isMessagesNull = true
        this.scrollToBottom()
    }

    @chatModule.State
    private spinning

    @chatModule.State
    private clientWidth

    @chatModule.Mutation('changeSpinning')
    private changeSpinning

    // 邮件服务
    private emailService = new EmailService()
    private cpService = new CustomProblemService()
    private productService = new ProductService()

    private origin_message: any = []

    private visible = false

    private title: any = ''

    @chatModule.State
    private checkBoxList

    @chatModule.Mutation('changeCheckBoxList')
    private changeCheckBoxList

    private checkBoxOnChange(item) {
        this.changeCheckBoxList(item.id)
    }

    private isCheck(item) {
        if (this.checkBoxList.indexOf(item.id) >= 0) {
            return true
        } else {
            return false
        }
    }

    private get subject() {
        let customer_messages =
            this.userChat &&
            this.userChat.messages.filter(x => x.is_owner == false)
        if (customer_messages && customer_messages.length > 0) {
            return customer_messages[customer_messages.length - 1].name
        } else {
            return ''
        }
    }

    private scrollToBottom() {
        this.$nextTick(() => {
            if (this.messageContainer) {
                this.messageContainer.scrollTo(
                    0,
                    this.messageContainer.scrollHeight
                )
            }
        })
    }

    private isMessagesNull = false

    private created() {
        if (this.userList.length > 0) {
            this.isMessagesNull = true
        }
    }

    private get userChat() {
        if (!this.userList) {
            return []
        }
        return this.userList.find(x => x.id === this.currentUser)
    }

    private productDropList: any = []
    private skuSource: any[] = []
    private order_id: any = null

    private saveAttachmentCp(origin_id, data) {
        this.cpService
            .createCpPic(
                new RequestParams({
                    ticket_id: origin_id,
                    cs_memo: '',
                    product_images: data
                })
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                },
                err => {
                    this.$error({
                        title: 'Error Message',
                        content: err.message
                    })
                }
            )
    }

    private revertMessage(index, id) {
        sessionStorage
        let that = this
        var data = this.emailService
            .revertMessage(
                new RequestParams({
                    id: id
                })
            )
            .subscribe(
                data => {
                    that.userChat.messages.splice(index, 1)
                },
                err => {
                    that.$message.error(err.message)
                }
            )
    }

    private openAttachment(origin_id, create_type) {
        let that = this

        let order_id_list: any[] = []
        if (this.order_id) {
            order_id_list.push(this.order_id)
        }
        if (this.origin_message instanceof Array && create_type == 'customer') {
            this.changeSpinning(true)
            this.cpService
                .queryTemplateProductDropList(
                    new RequestParams({
                        order_id_list: order_id_list,
                        customer_email: this.userChat.email
                    })
                )
                .subscribe(
                    data => {
                        this.changeSpinning(false)
                        this.$modal
                            .open(
                                ChatMessageAttachment,
                                {
                                    title: that.title,
                                    origin_message: that.origin_message,
                                    productService: that.productService,
                                    cpService: that.cpService,
                                    ticket_id: origin_id,
                                    create_type: create_type,
                                    changeSpinning: this.changeSpinning,
                                    productList: data
                                },
                                {
                                    title: that.title,
                                    width: '1000px'
                                }
                            )
                            .subscribe()
                    },
                    err => {
                        this.changeSpinning(false)
                        this.$error({
                            title: 'Error Message',
                            content: err.message
                        })
                    }
                )
        } else {
            this.changeSpinning(false)
            this.$modal
                .open(
                    ChatMessageAttachment,
                    {
                        title: that.title,
                        origin_message: that.origin_message,
                        productService: that.productService,
                        cpService: that.cpService,
                        ticket_id: origin_id,
                        create_type: create_type,
                        changeSpinning: this.changeSpinning,
                        productList: []
                    },
                    {
                        title: that.title,
                        width: '1000px'
                    }
                )
                .subscribe()
        }
    }

    private openSourceMessage(item) {
        let origin_id = item.origin_id
        this.changeSpinning(true)
        this.title = this.$t('origin_email')
        var that = this
        var data = this.emailService
            .getOriginMessage(
                new RequestParams({
                    origin_id: origin_id,
                    type: 'email'
                })
            )
            .subscribe(
                data => {
                    that.origin_message = data[0].body
                    that.openAttachment(origin_id, 'customer')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private openImage(item, e) {
        e.stopPropagation()
        let create_type = 'customer'
        if (item.is_owner) {
            create_type = 'owner'
        }
        var that = this
        this.changeSpinning(true)
        var data = this.emailService
            .getOriginMessage(
                new RequestParams({
                    origin_id: item.id,
                    type: 'image',
                    create_type: create_type
                })
            )
            .subscribe(
                data => {
                    if (data.length !== 0) {
                        that.title = this.$t('attachment_img')
                        // that.visible = true
                        that.origin_message = data
                        that.order_id = item.order_id
                        that.openAttachment(item.id, create_type)
                    } else {
                        this.changeSpinning(false)
                        let msg: any = this.$t('no_attachment')
                        this.$message.info(msg)
                    }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }
}
</script>

<style lang="less" scoped>
.chat-title {
    flex-basis: 60px;
    padding: 10px;
    background-color: #fff;
    border-bottom: solid 1px rgb(200, 200, 200);

    .username {
        font-size: 14px;
        color: black;
        font-weight: 500;
    }

    .latest {
        color: #7f7f7f;
    }
}

.message-container {
    overflow: auto;
    height: calc(100% - 60px);
    padding: 0 10px;
}

.message-item {
    margin: 20px 10px;

    .message-action {
        order: 2;
        cursor: pointer;

        .action {
            padding: 5px;
            border-radius: 10px;

            &:hover {
                background: #e5e5e5;
            }
        }
    }

    .message-border {
        order: 1;
    }

    &.is-owner {
        .message-action {
            order: 1;
        }

        .message-border {
            order: 2;
        }
    }
}

.message-border {
    padding: 10px;
    margin: 0 10px;
    min-width: 60%;
    max-width: 100%;
    border-radius: 10px;
    background-color: #ebebeb;
    word-wrap: wrap;
    white-space: pre-wrap;
    word-break: break-all;
    font-family: 'Calibri', 'Helvetica Neue', Helvetica, 'PingFang SC',
        'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    font-size: 14px;

    &.is-owner {
        background-color: #f4ecff;
    }
}

.message-border.is-owner {
    background-color: #d0cbd6;
}
</style>

<i18n>
{
    "en-us": {
        "Send Failed:": "Send Failed:",
        "today": "Today",
        "Copied failure": "Copied failure",
        "Copied Success": "Copied Success",
        "more_operate": "More",
        "delete": "Delete",
        "origin_email": "Origin Email",
        "attachment_img": "Attachment & Image",
        "images": "Check Images",
        "success": "Success",
        "no_attachment": "No Attachment"
    },
    "zh-cn": {
        "Send Failed:": "发送失败:",
        "today": "今天",
        "Copied failure": "复制失败",
        "Copied Success": "复制成功",
        "more_operate": "更多操作",
        "delete": "删除",
        "origin_email": "源邮件",
        "attachment_img": "附件图片",
        "images": "查看图片",
        "success": "操作成功",
        "no_attachment": "无附件"
    }
}
</i18n>
