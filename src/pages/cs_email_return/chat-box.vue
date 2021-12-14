<template>
    <div ref="container">
        <div class="chat-box-container" :class="{ moving: moving }">
            <a-spin :spinning="spinning" size="large" class="scopeSpin">
                <div class="chat-header-wrap wrap">
                    <chat-header></chat-header>
                </div>
                <div style="display: flex;margin-top: 10px">
                    <div style="width: 30%;border-right:solid 3px #c8c8c8">
                        <chat-user-list></chat-user-list>
                    </div>
                    <div
                        style="flex: 1;overflow: auto;height: 100vh;padding-bottom: 80px"
                    >
                        <chat-integration></chat-integration>
                    </div>
                </div>
            </a-spin>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref, Watch } from 'vue-property-decorator'

import { Page } from '@/core/decorators'

import ChatUserInput from '~/components/cs_email_return/chat-user-input.vue'
import ChatUserMessage from '~/components/cs_email_return/chat-user-message.vue'
import ChatUserOrder from '~/components/cs_email_return/chat-user-order.vue'
import ChatUserList from '~/components/cs_email_return/chat-user-list.vue'
import ChatHeader from '~/components/cs_email_return/chat-header.vue'
import ChatIntegration from '~/components/cs_email_return/chat-integration.vue'
import { EmailService } from '~/services/cs-email.service'
import { formConfig } from '../../config/form.config'
import { CommonService } from '../../shared/utils/common.service'
import { namespace } from 'vuex-class'
import { RequestParams } from '~/core/http'

const chatModule = namespace('chatModule')

@Page({
    layout: 'empty',
    name: 'chat-box'
})
@Component({
    components: {
        ChatHeader,
        ChatUserList,
        ChatIntegration
    }
})
export default class ChatBox extends Vue {
    @Ref('container')
    private container!: HTMLDivElement

    private moving = false

    @chatModule.State
    private spinning

    @chatModule.State
    private inputHeight

    @chatModule.State
    private clientHeight

    @chatModule.State
    private clientWidth

    @chatModule.Mutation('changeInputHieght')
    private changeInputHieght

    @chatModule.Mutation('changeSpinning')
    private changeSpinning

    @chatModule.Mutation('updateUserList')
    private updateUserList

    @chatModule.Mutation('changeChatUser')
    private changeChatUser

    @chatModule.Mutation('updateUserMessage')
    private updateUserMessage

    @chatModule.Mutation('updateClientHeight')
    private updateClientHeight

    private query_condition: any = []

    private emailService = new EmailService()

    private queryChatUserList() {
        this.changeSpinning(true)
        let that = this
        this.emailService
            .getEmailUserList(
                new RequestParams({ query_condition: this.query_condition })
            )
            .subscribe(
                data => {
                    that.updateUserList(data)
                    that.changeSpinning(false)
                },
                err => {
                    that.$message.error(err.message)
                    that.changeSpinning(false)
                }
            )
        // .toPromise()
        // .then(
        //     result => {
        //         that.updateUserList(result)
        //         if (result.length !== 0) {
        //             that.changeChatUser(result[0].id)
        //             that.emailService
        //                 .getCurrentUserMessage(
        //                     new RequestParams({
        //                         customer_id: result[0].id,
        //                         incoming_email: result[0].incoming_email
        //                     })
        //                 )
        //                 .subscribe(
        //                     data => {
        //                         that.changeSpinning(false)
        //                         that.updateUserMessage(data.messages)
        //                     },
        //                     err => {
        //                         that.changeSpinning(false)
        //                         that.$message.error(err.message)
        //                     }
        //                 )
        //         } else {
        //             that.changeSpinning(false)
        //         }
        //     },
        //     err => {
        //         that.changeSpinning(false)
        //         that.$message.error(err.message)
        //     }
        // )
    }

    private created() {
        this.query_condition.push({
            query_name: 'is_reply',
            operate: '=',
            value: false
        })

        this.queryChatUserList()
    }

    private get gridTemplateRows() {
        return '60px auto'
    }

    private get gridTemplateColumns() {
        let left_width = this.clientWidth * 0.25
        return left_width.toString() + 'px auto'
    }

    public mounted() {
        this.setupDrag()
        this.updateClientHeight()
    }

    private setupDrag() {
        var that = this
        this.container.onmouseup = () => (this.moving = false)
        this.container.onmouseleave = () => (this.moving = false)
        this.container.onmousemove = ({ movementY }) => {
            if (!this.moving) return
            if (movementY > 0 && that.inputHeight <= 200) return
            this.changeInputHieght(that.inputHeight - movementY)
            // this.inputHeight -= movementY
        }
    }

    // grid-template-rows: 60px auto 219px;
}
</script>

<style lang="less">
.chat-box-container {
    background: #ffffff;
    height: 100%;
    width: 100%;
    min-height: 600px;
    min-width: 800px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 10px #7a7a7a;

    &.moving {
        cursor: row-resize !important;
    }
}

.background {
    background-color: #a7a7a7;
}

.wrap {
    position: relative;
}

.chat-header-wrap {
    grid-area: chat-header;
    box-shadow: 0px 5px 5px #dadce0;
}

.user-list-wrap {
    grid-area: user-list;
}

.chat-integration {
    grid-area: chat-integration;
}

.scopeSpin .ant-spin-lg .ant-spin-dot i {
    width: 30px;
    height: 30px;
}
</style>

<i18n>
{
    "en-us": {
        "today": "Today"
    },
    "zh-cn": {
        "today": "今天"
    }
}
</i18n>