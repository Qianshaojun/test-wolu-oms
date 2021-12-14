import { RequestParams } from '~/core/http'
import { EmailService } from '~/services/cs-email.service'
import moment from 'moment'

interface IMessageUser {
    id: number
    username: string
}

interface IMessage {
    sender: IMessageUser
    receiver: IMessageUser
    message: string
}

const dateFormat = date => {
    date = new Date(date)
    var y = date.getFullYear()
    var m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    var d = date.getDate()
    d = d < 10 ? '0' + d : d
    var h = date.getHours()
    var minute = date.getMinutes()
    minute = minute < 10 ? '0' + minute : minute
    var second = date.getSeconds()
    second = minute < 10 ? '0' + second : second
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}

const emailService = new EmailService()

export default {
    namespaced: true,
    state: {
        currentUser: 0,
        userList: [],
        spinning: false,
        inputHeight: 0.2 * document.documentElement.clientHeight,
        activeKey: '1',
        clientHeight: document.documentElement.clientHeight,
        clientWidth: document.documentElement.clientWidth,
        invoiceId: 0,
        checkBoxList: [],
        pickingList: [],
        all_templates: [],
        active_templates: []
    },
    mutations: {
        updateAllTemplates(state, data) {
            state.all_templates = data
        },
        updateActiveTemplates(state, { lang_code, seller_code }) {
            if (lang_code && seller_code) {
                state.active_templates = state.all_templates.filter(
                    x => x.lang_code === lang_code
                )
            } else {
                state.active_templates = state.all_templates
            }
            // state.active_templates = state.all_templates
        },
        replacePickingList(state, data) {
            state.pickingList = data
        },
        changePickingList(state, data) {
            state.pickingList.push(data)
        },
        changeMessageIsReply(state) {
            let target = state.userList.find(x => x.id === state.currentUser)
            target.messages.forEach(element => {
                if (state.checkBoxList.indexOf(element.id) >= 0) {
                    element['is_reply'] = true
                }
            })
        },
        changeCheckBoxList(state, data) {
            let index = state.checkBoxList.indexOf(data)
            if (index != -1) {
                state.checkBoxList.splice(index, 1)
            } else {
                state.checkBoxList.push(data)
            }
        },
        updateEarliest(state) {
            let target = state.userList.find(x => x.id === state.currentUser)
            target.earliest = ''
        },

        changeInputHieght(state, data) {
            state.inputHeight = data
        },

        changeInvoiceId(state, data) {
            state.invoiceId = data
        },

        updateClientHeight(state) {
            state.clientHeight = document.documentElement.clientHeight
            state.clientWidth = document.documentElement.clientWidth
            state.inputHeight = 0.2 * document.documentElement.clientHeight
        },

        changeSpinning(state, data) {
            state.spinning = data
        },

        updateMemo(state, { order_id, memo }) {
            let target = state.userList
                .find(x => x.id === state.currentUser)
                .orders.find(x => x.id === order_id)
            target.memo = memo
        },

        updateUserList(state, data) {
            state.userList = data
            state.invoiceId = 0
        },

        updateUserMessage(state, data) {
            let target = state.userList.find(x => x.id === state.currentUser)
            target.messages = data
            if (state.currentUser.indexOf('members.ebay') >= 0) {
                let not_reply_messages = target.messages.filter(
                    message =>
                        (message.is_owner === false &&
                            message.is_reply === false) ||
                        message.is_reply === null
                )

                if (not_reply_messages.length > 0) {
                    // not_reply_messages.sort(function(a,b){return a.time > b.time})

                    state.checkBoxList.push(
                        not_reply_messages[not_reply_messages.length - 1].id
                    )
                }
                // not_reply_messages.forEach(item => {
                //     state.checkBoxList.push(item.id)
                // })
            }
        },

        changeActiveKey(state, data) {
            state.activeKey = data
        },

        changeChatUser(state, id) {
            state.currentUser = id
            state.activeKey = '1'
            let target = state.userList.find(x => x.id === state.currentUser)
            target.unread = 0
            state.checkBoxList = []
            state.pickingList = []
        },

        addUserMessage(
            state,
            { id, receiver, message, sendername, email_state, time }
        ) {
            let target = state.userList.find(x => x.id === receiver.id)
            target.earliest = null
            target.messages.push({
                id: id,
                content: message,
                time: time,
                is_owner: true,
                state: email_state,
                sendername: sendername,
                origin_id: false
            })
            var data = target.messages
            target.messages = data
            target.earliest = ''
            // target.lastest = dateFormat(Date.now())
        },

        updateMessage(state, { origin_id, id, time }) {
            let message = state.userList
                .find(x => x.id === state.currentUser)
                .messages.find(x => x.id === origin_id)
            message.time = time
            message.state = 'outgoing'
            message.id = id
            var data = message
            message = data
        }
    },

    actions: {
        updateUserList({ dispatch, commit, state }, queryCondition) {
            emailService
                .getEmailUserList(
                    new RequestParams({ query_condition: queryCondition })
                )
                .toPromise()
                .then(result => {
                    commit('updateUserList', result)
                    if (result.length !== 0) {
                        commit('changeChatUser', result[0].id)
                        emailService
                            .getCurrentUserMessage(
                                new RequestParams({
                                    customer_id: result[0].id,
                                    incoming_email: result[0].incoming_email
                                })
                            )
                            .subscribe(data => {
                                commit('updateUserMessage', data.messages)
                                commit('updateUserOrder', data.orders)
                            })
                    }
                })
        },

        changeChatUser({ commit, state }, { id, data }) {
            commit('changeChatUser', id)
            commit('updateUserMessage', data.messages)
        }
    }
}
