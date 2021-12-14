<template>
    <section
        class=" chat-user-list  "
        style="overflow-y: auto;height: 100vh;padding: 0px 10px 80px 0"
    >
        <div
            class="action-header  "
            style="display: flex;justify-content: space-between;align-items: center;padding: 0 0 12px 12px"
        >
            <div style="font-size:16px;color:black;">
                {{ $t('Message') }}
            </div>

            <div class="action">
                <a-icon
                    v-if="sequence === 'down'"
                    type="swap"
                    @click="changeSequence('up')"
                    :rotate="90"
                />
                <a-icon
                    v-if="sequence === 'up'"
                    type="swap"
                    @click="changeSequence('down')"
                    :rotate="90"
                />
                <a-button
                    type="primary"
                    @click="queryChatUserList"
                    style="margin-right:10px;margin-left:10px"
                    >{{ $t('refresh') }}
                </a-button>
                <a-radio-group
                    v-model="userListFilter"
                    :default_value="userListFilter"
                    @change="filterOnChange"
                >
                    <a-radio-button value="not_replied">
                        {{ $t('not_relpy') }}
                    </a-radio-button>
                    <a-radio-button value="replied">
                        {{ $t('Replied') }}
                    </a-radio-button>
                    <a-radio-button value="all">
                        {{ $t('all') }}
                    </a-radio-button>
                </a-radio-group>
            </div>
        </div>
        <a-collapse
            defaultActiveKey="1"
            :borderd="false"
            v-if="is_replied === false"
        >
            <a-collapse-panel
                :header="groupitem2.title"
                v-for="groupitem2 of groupList"
                :key="groupitem2.key"
                :style="{ display: groupitem2.display, padding: 0 }"
                class="xxx"
            >
                <a-collapse
                    defaultActiveKey="1"
                    :borderd="false"
                    style="margin:0;padding:0;background:#dedede;"
                >
                    <a-collapse-panel
                        :header="groupitem.title + '(' + groupitem.amount + ')'"
                        v-for="groupitem of groupitem2.value"
                        :key="groupitem.key"
                        class="yyy"
                    >
                        <a-collapse
                            v-if="groupitem.value"
                            defaultActiveKey="1"
                            :borderd="false"
                            style="background:#dedede;"
                        >
                            <a-collapse-panel
                                :header="
                                    instanceItem.title +
                                        '(' +
                                        instanceItem.amount +
                                        ')'
                                "
                                v-for="instanceItem of groupitem.value"
                                :key="instanceItem.key"
                            >
                                <div class="list-container flex-auto">
                                    <div
                                        v-for="(user,
                                        index) of instanceItem.value"
                                        :key="user.id"
                                        class="list-item flex-row align-items-center"
                                        :class="{
                                            active: user.id === currentUser
                                        }"
                                        style="border-bottom: solid 1px black;"
                                    >
                                        <div v-if="edit">
                                            <a-checkbox
                                                v-model="user.check"
                                                style="width:20px;text-align:left;"
                                            >
                                            </a-checkbox>
                                        </div>
                                        <div
                                            class="flex-auto"
                                            @click="
                                                swichUser(
                                                    user.id,
                                                    user.email,
                                                    user.seller_code
                                                )
                                            "
                                        >
                                            <div
                                                class="flex-row justify-content-between"
                                            >
                                                <div class="username">
                                                    {{ index + 1 }}:{{
                                                        user.username
                                                    }}
                                                </div>
                                                <div>
                                                    {{
                                                        user.lastest
                                                            | datetolocal
                                                    }}
                                                </div>
                                            </div>
                                            <div
                                                style="color:#7f7f7f;font-weight:500;margin-top:3px"
                                            ></div>
                                            <div>{{ user.incoming_email }}</div>
                                            <div>{{ user.last_order_num }}</div>
                                            <a-tag
                                                color="#f50"
                                                v-if="
                                                    user.earliest !== '' &&
                                                        user.email.indexOf(
                                                            '@members.ebay.'
                                                        ) === -1
                                                "
                                            >
                                                {{ getUserTag(user.earliest) }}
                                            </a-tag>
                                        </div>
                                        <div
                                            class="padding-x"
                                            @click="
                                                swichUser(
                                                    user.id,
                                                    user.email,
                                                    user.seller_code
                                                )
                                            "
                                        >
                                            <a-badge
                                                :count="user.unread"
                                                :numberStyle="
                                                    user.unread === 0
                                                        ? {
                                                              backgroundColor:
                                                                  '#cecece',
                                                              color: '#5a5a5a'
                                                          }
                                                        : {}
                                                "
                                            >
                                            </a-badge>
                                            <span
                                                v-if="user.unread === 0"
                                                style="padding: 10px"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </a-collapse-panel>
                        </a-collapse>
                    </a-collapse-panel>
                </a-collapse>
            </a-collapse-panel>
        </a-collapse>
    </section>
</template>

<style>
.xxx .ant-collapse-content .ant-collapse-content-box {
    padding: 0 !important;
}

.yyy .ant-collapse-content .ant-collapse-content-box {
    padding: 16px !important;
}

.yyy .ant-collapse-header {
    margin-left: 8px;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import moment from 'moment'
import { RequestParams } from '~/core/http'
import { EmailService } from '~/services/cs-email.service'
import { formConfig } from '../../config/form.config'
import { CommonService } from '../../shared/utils/common.service'
import { MailService } from '../../services/mail.service'
// import { CommonService } from '../../shared/utils/common.service'
const chatModule = namespace('chatModule')
const userModule = namespace('userModule')
@Component({
    components: {}
})
export default class ChatUserList extends Vue {
    @chatModule.State
    private userList

    @chatModule.State
    private currentUser

    private query_condition: any = [
        {
            query_name: 'is_reply',
            operate: '=',
            value: false
        }
    ]

    @chatModule.Action('changeChatUser')
    private changeUser

    @chatModule.Mutation('updateUserList')
    private updateUserList

    @chatModule.Mutation('clearQueryCondition')
    private clearQueryCondition

    @chatModule.Mutation('updateUserMessage')
    private updateUserMessage

    @chatModule.Mutation('changeChatUser')
    private changeChatUser

    @chatModule.Mutation('changeInvoiceId')
    private changeInvoiceId

    @chatModule.Mutation('updateActiveTemplates')
    private updateActiveTemplates

    private get moment() {
        return moment
    }

    // 邮件服务
    private emailService = new EmailService()

    private mailService = new MailService()

    private edit = false

    private is_replied = false

    private searchText = ''

    private checkList = {}

    private data = []

    private sequence = 'up'

    private iconStyle = { fontSize: '16px', color: '#5a5a5a' }

    @chatModule.State
    private spinning

    @chatModule.Mutation('changeSpinning')
    private changeSpinning

    private userListFilter = 'not_replied'

    private testList: any = []

    private ticketType: any = []
    private ticketDict: any = {}

    private filterOnChange(target) {
        let value = target.target.value
        this.query_condition = []
        if (value === 'not_replied') {
            this.query_condition.push({
                query_name: 'is_reply',
                operate: '=',
                value: false
            })
        } else if (value === 'replied') {
            this.query_condition.push({
                query_name: 'is_reply',
                operate: '=',
                value: true
            })
        }

        this.queryChatUserList()
    }

    private created() {
        this.getTicketTypeList()
    }

    private getTicketTypeList() {
        this.mailService.query_ticket_type(new RequestParams()).subscribe(
            data => {
                this.ticketType = data
                for (let i of data) {
                    this.ticketDict[i.code] = i.name
                }
                this.ticketDict['-1'] = 'Undefined Ticket Type'
            },
            err => {
                this.$message.error(err.message)
            }
        )
    }

    private queryChatUserList() {
        this.changeInvoiceId(0)
        this.changeSpinning(true)
        let that = this
        this.emailService
            .getEmailUserList(
                new RequestParams({ query_condition: this.query_condition })
            )
            // .subscribe(
            //     data => {
            //         that.updateUserList(data)
            //         that.dateSequence()
            //         that.changeSpinning(false)
            //     },
            //     err => {
            //         that.$message.error(
            //             err ? err.message : '出现错误，但Err message 未正常显示'
            //         )
            //         that.changeSpinning(false)
            //     }
            // )
            .toPromise()
            .then(result => {
                that.updateUserList(result)
                if (result.length !== 0) {
                    that.changeInvoiceId(0)

                    var lang_code = ''
                    switch (true) {
                        case result[0].email.substr(
                            result[0].email.length - '.fr'.length,
                            '.fr'.length
                        ) == '.fr':
                            lang_code = 'fr'
                            break
                        case result[0].email.substr(
                            result[0].email.length - '.de'.length,
                            '.de'.length
                        ) == '.de':
                            lang_code = 'de'
                            break
                        case result[0].email.substr(
                            result[0].email.length - '.es'.length,
                            '.es'.length
                        ) == '.es':
                            lang_code = 'es'
                            break
                        case result[0].email.substr(
                            result[0].email.length - '.nl'.length,
                            '.nl'.length
                        ) == '.nl':
                            lang_code = 'nl'
                            break
                        case result[0].email.substr(
                            result[0].email.length - '.it'.length,
                            '.it'.length
                        ) == '.it':
                            lang_code = 'it'
                            break
                        case result[0].email.substr(
                            result[0].email.length - '.pl'.length,
                            '.pl'.length
                        ) == '.pl':
                            lang_code = 'pl'
                            break
                        case result[0].email.substr(
                            result[0].email.length - '.co.uk'.length,
                            '.co.uk'.length
                        ) == '.co.uk':
                            lang_code = 'uk'
                            break
                    }
                    that.updateActiveTemplates({
                        lang_code: lang_code,
                        seller_code: result[0].seller_code
                    })
                    that.emailService
                        .getCurrentUserMessage(
                            new RequestParams({
                                customer_id: result[0].email,
                                incoming_email: result[0].incoming_email,
                                partner_email: result[0].partner_email
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
    }

    private dateToLocal(date, fmt) {
        if (date === null || date === undefined || date === '') {
            return ''
        }

        // 如果是时间戳则转化为时间
        if (typeof date === 'number') {
            date = new Date(date)
        }

        date = new Date(Date.parse(date.replace(/-/g, '/')))

        let utc = Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        )

        date = new Date(utc)

        const o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            S: date.getMilliseconds() // 毫秒
        }

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(2, 2))
        }

        for (const k in o) {
            // tslint:disable-next-line:max-line-length
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1
                        ? o[k]
                        : ('00' + o[k]).substr(('' + o[k]).length)
                )
            }
        }
        return '20' + fmt
    }

    private getUserTag(earliest) {
        let a = this.dateToLocal(earliest, 'yyyy-MM-dd hh:mm:ss')
        var diff_vlue = Math.ceil(
            moment().diff(moment(a, 'yyyy-MM-DD HH:mm:ss'), 'hours', true)
        )
        if (diff_vlue > 24) {
            return this.$t('Expired') + (diff_vlue - 24).toString() + ' hrs'
        } else {
            return this.$t('Will Expire') + (24 - diff_vlue).toString() + ' hrs'
        }
    }

    private swichUser(id, email, seller_code) {
        this.changeSpinning(true)
        this.changeInvoiceId(0)
        var lang_code = ''
        switch (true) {
            case email.substr(email.length - '.fr'.length, '.fr'.length) ==
                '.fr':
                lang_code = 'fr'
                break
            case email.substr(email.length - '.de'.length, '.de'.length) ==
                '.de':
                lang_code = 'de'
                break
            case email.substr(email.length - '.es'.length, '.es'.length) ==
                '.es':
                lang_code = 'es'
                break
            case email.substr(email.length - '.nl'.length, '.nl'.length) ==
                '.nl':
                lang_code = 'nl'
                break
            case email.substr(email.length - '.it'.length, '.it'.length) ==
                '.it':
                lang_code = 'it'
                break
            case email.substr(email.length - '.pl'.length, '.pl'.length) ==
                '.pl':
                lang_code = 'pl'
                break
            case email.substr(
                email.length - '.co.uk'.length,
                '.co.uk'.length
            ) == '.co.uk':
                lang_code = '.co.uk'
                break
        }
        this.updateActiveTemplates({
            lang_code: lang_code,
            seller_code: seller_code
        })

        var that = this
        var data = this.emailService
            .getCurrentUserMessage(
                new RequestParams({
                    customer_id: this.userList.find(x => x.id === id).email,
                    incoming_email: this.userList.find(x => x.id === id)
                        .incoming_email,
                    partner_email: this.userList.find(x => x.id === id)
                        .partner_email,
                    sale_order_num: this.userList.find(x => x.id === id)
                        .sale_order_num,
                    exists_order_query: this.userList.find(x => x.id === id)
                        .exists_order_query
                })
            )
            .subscribe(
                data => {
                    that.changeUser({ id: id, data: data })
                    that.changeSpinning(false)
                },
                err => {
                    that.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private get chatUserList() {
        return this.userList.filter(
            x =>
                this.searchText === '' ||
                x.username.toLowerCase().includes(this.searchText.toLowerCase())
        )
    }

    private instanceList(data_list) {
        let a = {}
        let result: any = []
        if (data_list.length == 0) {
            return []
        }

        for (var element of data_list) {
            if (element['incoming_email'] in a) {
                a[element['incoming_email']].push(element)
            } else {
                let key = element['incoming_email']
                a[element['incoming_email']] = [element]
            }
        }
        let i = 1
        for (var key in a) {
            result.push({
                title: key,
                value: this.getListByTicketType(a[key]),
                key: i,
                amount: a[key].length
            })
            i++
        }

        return result
    }

    private get groupList() {
        let a = [
            {
                title: this.$t('Today'),
                value: this.instanceList(this.todayUserList),
                key: 1,
                display: this.todayUserList ? 'block' : 'none'
            },
            {
                title: this.$t('Yesterday'),
                value: this.instanceList(this.yesterdayUserList),
                key: 2,
                display: this.yesterdayUserList ? 'block' : 'none'
            },
            {
                title: this.$t('Friday'),
                value: this.instanceList(this.fridayUserList),
                key: 3,
                display: this.fridayUserList ? 'block' : 'none'
            },
            {
                title: this.$t('Thursday'),
                value: this.instanceList(this.thursdayUserList),
                key: 4,
                display: this.thursdayUserList ? 'block' : 'none'
            },
            {
                title: this.$t('Wednesday'),
                value: this.instanceList(this.wednesdayUserList),
                key: 5,
                display: this.wednesdayUserList ? 'block' : 'none'
            },
            {
                title: this.$t('Tuesday'),
                value: this.instanceList(this.tuesdayUserList),
                key: 6,
                display: this.tuesdayUserList ? 'block' : 'none'
            },
            {
                title: this.$t('Monday'),
                value: this.instanceList(this.mondayUserList),
                key: 7,
                display: this.mondayUserList ? 'block' : 'none'
            },
            {
                title: this.$t('History'),
                value: this.instanceList(this.historyUserList),
                key: 8,
                display: this.historyUserList ? 'block' : 'none'
            }
        ]
        return a
    }

    private getListByTicketType(list) {
        let arrs: any = []
        for (let i of list) {
            let ticket_type_id =
                i.ticket_type_id !== undefined && i.ticket_type_id
                    ? i.ticket_type_id
                    : '-1'
            let item = arrs.find(x => x.key === ticket_type_id)
            if (!item) {
                arrs.push({
                    title: this.ticketDict[ticket_type_id],
                    value: [i],
                    key: ticket_type_id,
                    amount: 1,
                    customStyle:
                        'background: #f7f7f7;border-radius: 4px;margin-bottom: 24px;border: 0;'
                })
            } else {
                item.value.push(i)
                item.amount++
            }
        }

        return arrs
    }

    private changeSequence(seq) {
        this.sequence = seq
        this.dateSequence()
    }

    private dateSequence() {
        this.userList.sort((a, b) => {
            if (this.sequence === 'down') {
                return a.earliest.localeCompare(b.earliest)
            } else {
                return b.earliest.localeCompare(a.earliest)
            }
        })
    }

    private get todayUserList() {
        var f = moment()
            .format()
            .split('T')[0]
        return this.userList.filter(
            x =>
                this.dateToLocal(x.lastest, 'yyyy-MM-dd hh:mm:ss').split(
                    ' '
                )[0] === f
        )
    }

    private get yesterdayUserList() {
        var d = moment().day()
        if (d === 1) {
            return false
        }
        var f = moment()
            .subtract(1, 'days')
            .format()
            .split('T')[0]
        return this.userList.filter(
            x =>
                this.dateToLocal(x.lastest, 'yyyy-MM-dd hh:mm:ss').split(
                    ' '
                )[0] === f
        )
    }

    private get mondayUserList() {
        var d = moment().day()
        if (d === 1 || d === 2) {
            return false
        } else if (d === 0) {
            d = 7
        }
        var f = moment()
            .subtract(d - 1, 'days')
            .format()
            .split('T')[0]
        return this.userList.filter(
            x =>
                this.dateToLocal(x.lastest, 'yyyy-MM-dd hh:mm:ss').split(
                    ' '
                )[0] === f
        )
    }

    private get tuesdayUserList() {
        var d = moment().day()
        if (d == 1 || d === 2 || d === 3) {
            return false
        } else if (d === 0) {
            d = 7
        }
        var f = moment()
            .subtract(d - 2, 'days')
            .format()
            .split('T')[0]
        return this.userList.filter(
            x =>
                this.dateToLocal(x.lastest, 'yyyy-MM-dd hh:mm:ss').split(
                    ' '
                )[0] === f
        )
    }

    private get wednesdayUserList() {
        var d = moment().day()
        if (d == 1 || d === 2 || d === 3 || d === 4) {
            return false
        } else if (d === 0) {
            d = 7
        }
        var f = moment()
            .subtract(d - 3, 'days')
            .format()
            .split('T')[0]
        return this.userList.filter(
            x =>
                this.dateToLocal(x.lastest, 'yyyy-MM-dd hh:mm:ss').split(
                    ' '
                )[0] === f
        )
    }

    private get thursdayUserList() {
        var d = moment().day()
        if (d == 1 || d === 2 || d === 3 || d === 4 || d === 5) {
            return false
        } else if (d === 0) {
            d = 7
        }
        var f = moment()
            .subtract(d - 4, 'days')
            .format()
            .split('T')[0]
        return this.userList.filter(
            x =>
                this.dateToLocal(x.lastest, 'yyyy-MM-dd hh:mm:ss').split(
                    ' '
                )[0] === f
        )
    }

    private get fridayUserList() {
        var d = moment().day()
        if (d == 1 || d === 2 || d === 3 || d === 4 || d === 5 || d === 6) {
            return false
        } else if (d === 0) {
            d = 7
        }
        var f = moment()
            .subtract(d - 5, 'days')
            .format()
            .split('T')[0]
        return this.userList.filter(
            x =>
                this.dateToLocal(x.lastest, 'yyyy-MM-dd hh:mm:ss').split(
                    ' '
                )[0] === f
        )
    }

    private get historyUserList() {
        var d = moment().day()
        if (d === 0) {
            d = 7
        }
        var f = moment()
            .subtract(d - 1, 'days')
            .format()
            .split('T')[0]
        return this.userList.filter(x => {
            if (
                this.dateToLocal(x.lastest, 'yyyy-MM-dd hh:mm:ss').split(
                    ' '
                )[0] < f
            ) {
                return true
            } else {
                return false
            }
        })
    }

    private onAllCheck({ target }) {
        const { checked } = target
        if (this.chatUserList) {
            this.chatUserList.forEach(element => {
                element.check = checked
            })
        }
    }
}
</script>

<style lang="less" scoped>
@primary-color: #ae6eef;

.chat-user-list {
    //border-right: solid 1px rgb(200, 200, 200);
}

.list-container {
    background-color: #fff;
    overflow: auto;
}

.action-header {
    .action {
        i {
            margin-left: 15px;
            font-size: 16px;
            cursor: pointer;

            &:hover {
                color: @primary-color;
            }
        }
    }
}

.item-action {
    cursor: pointer;
    font-size: 14px;

    &:hover {
        color: black;
        font-weight: bold;
    }
}

.list-item {
    height: 100px;
    padding: 10px;
    border-bottom: solid 3px transparent;
    padding-right: 15px;

    .username {
        font-weight: bold;
        color: black;
    }

    &.active {
        border-bottom: solid 3px @primary-color;
        color: @primary-color;

        .username {
            color: @primary-color;
        }
    }
}
</style>

<i18n>
{
    "en-us": {
        "Today": "Today",
        "Message": "Message",
        "Replied": "Replied",
        "Refresh unanswered messages": "Refresh unanswered messages",
        "Show answered messages": "Show answered messages",
        "Expired": "Expired",
        "Will Expire": "Will Expire",

        "Yesterday": "Yesterday",
        "Friday": "Friday",
        "Tuesday": "Tuesday",
        "Monday": "Monday",
        "Thursday": "Thursday",
        "Wednesday": "Wednesday",
        "History": "History",
        "refresh": "Refresh",
        "all": "All",
        "not_relpy": "Unanswered"
    },
    "zh-cn": {
        "Today": "今天",
        "Message": "消息",
        "Replied": "已回复",
        "Refresh unanswered messages": "刷新未回复消息",
        "Show answered messages": "显示已回复消息",
        "Expired": "已超期",
        "Will Expire": "距超期",
        "Yesterday": "昨天",
        "Friday": "周五",
        "Tuesday": "周二",
        "Monday": "周一",
        "Thursday": "周四",
        "Wednesday": "周三",
        "History": "历史",
        "refresh": "刷新",
        "all": "全部",
        "not_relpy": "未回复"
    }
}
</i18n>
