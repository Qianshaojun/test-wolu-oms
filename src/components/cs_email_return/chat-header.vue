<template>
    <section class="component chat-header padding-x ">
        <template>
            <div>
                <a-input
                    class="margin-x search-input"
                    :placeholder="$t('customer_email')"
                    @keyup.enter="enterSearchUser"
                ></a-input>
                <a style="padding-left:50px;" @click="openFilter">{{
                    $t('Advanced Search')
                }}</a>
            </div>
        </template>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ChatHeaderFilter from '~/components/cs_email_return/chat-header-filter.vue'
import { namespace } from 'vuex-class'
import moment from 'moment'
import { EmailService } from '~/services/cs-email.service'
import { RequestParams } from '~/core/http'

const chatModule = namespace('chatModule')
const userModule = namespace('userModule')

@Component({
    components: {
        ChatHeaderFilter
    }
})
export default class ChatUserInput extends Vue {
    private iconStyle = { fontSize: '16px', color: '#5a5a5a' }
    private tool = 'search'
    private visible = false

    @chatModule.State
    private spinning

    @chatModule.Mutation('changeSpinning')
    private changeSpinning

    mounted() {}

    @chatModule.State
    private userList

    @chatModule.State
    private currentUser

    private query_condition: any = []

    @chatModule.Mutation('clearQueryCondition')
    private clearQueryCondition

    @chatModule.Mutation('updateUserList')
    private updateUserList

    @chatModule.Mutation('updateUserMessage')
    private updateUserMessage

    @chatModule.Mutation('changeChatUser')
    private changeChatUser

    @userModule.State
    private id

    private emailService = new EmailService()

    private enterSearchUser(e) {
        var keyCode = window.event ? e.keyCode : e.which
        this.query_condition = []
        if (keyCode == 13 && e.target.value) {
            this.query_condition.push({
                query_name: 'go_amazon_mails2',
                operate: '=',
                value: e.target.value.replace(/(^\s*)|(\s*$)/g, '')
            })
            this.queryChatUserList(false)
        } else {
            this.query_condition.push({
                query_name: 'is_reply',
                operate: '=',
                value: false
            })
            this.queryChatUserList(false)
        }
    }

    @chatModule.Action('changeChatUser')
    private changeUser

    @chatModule.Mutation('changeInvoiceId')
    private changeInvoiceId

    private queryChatUserList(exists_order_query) {
        let that = this
        this.changeSpinning(true)
        this.emailService
            .getEmailUserList(
                new RequestParams({ query_condition: this.query_condition })
            )
            // .subscribe(
            //     data => {
            //         that.updateUserList(data)
            //         that.changeSpinning(false)
            //     },
            //     err => {
            //         that.$message.error(err.message)
            //         that.changeSpinning(false)
            //     }
            // )
            .toPromise()
            .then(result => {
                that.updateUserList(result)
                if (result.length !== 0) {
                    for (var index = 0; index < result.length; index++) {
                        result[0]['exists_order_query'] = exists_order_query
                    }

                    that.changeInvoiceId(0)
                    that.emailService
                        .getCurrentUserMessage(
                            new RequestParams({
                                customer_id: result[0].email,
                                incoming_email: result[0].incoming_email,
                                partner_email: result[0].partner_email,
                                sale_order_num: result[0].sale_order_num,
                                exists_order_query: exists_order_query
                            })
                        )
                        .subscribe(
                            data => {
                                that.changeUser({
                                    id: result[0].id,
                                    data: data
                                })
                                that.changeSpinning(false)
                            },
                            err => {
                                that.changeSpinning(false)
                                this.$message.error(err.message)
                            }
                        )
                } else {
                    this.$message.error('未找到符号条件的数据')
                    that.changeSpinning(false)
                }
            })
            .catch(result => {
                that.changeSpinning(false)
                this.$message.error(
                    result ? result.message : '查询异常，请联系管理员'
                )
            })
    }

    private openFilter() {
        let that = this
        this.$modal
            .open(
                ChatHeaderFilter,
                {
                    query_condition: that.query_condition
                },
                {
                    title: this.$t('Email Search'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                let exists_query_order_condition = data.filter(
                    item => item.query_name === 'go_amazon_mails1'
                )

                let exists_order_query = false
                if (exists_query_order_condition.length > 0) {
                    exists_order_query = true
                }

                that.query_condition = data
                that.queryChatUserList(exists_order_query)
                that.query_condition = []
            })
    }
}
</script>

<style lang="less" scoped>
.chat-header {
    border-bottom: solid 1px rgb(200, 200, 200);
    height: 60px;
    line-height: 60px;
    box-shadow: 0 5px 5px #dadce0;
}

.search-input {
    border: transparent;
    width: 90%;
}

.logo {
    margin-left: 10px;
    width: 50px;
    height: 50px;
    background-image: url('~@/assets/images/chat-logo.png');

    background-size: 100% auto;
}

.logo-text {
    font-size: 16px;
    font-weight: bolder;
}

.toolbar {
    i {
        padding: 10px;
        border-radius: 100%;
        margin-right: 5px;
        cursor: pointer;

        &:hover {
            background: #e5e5e5;
        }
    }
}
</style>

<i18n>
{
    "en-us": {
        "customer_email": "Please Input Customer Email",
        "today": "Today",
        "Advanced Search": "Advanced Search",
        "Email Search": "Email Search",
        "Customer service": "Customer service",
        "Last message time": "Last message time"
    },
    "zh-cn": {
        "customer_email": "请输入客服邮件",
        "today": "今天",
        "Advanced Search": "高级搜索",
        "Email Search": "邮件搜索",
        "Customer service": "客服",
        "Last message time": "最后消息时间"
    }
}
</i18n>
