<template>
    <section class="component edit-customer">
        <div class="title-box">
            <div class="title">
                <span style="margin-left:20px;">{{ weekly_title }}</span>
            </div>
        </div>
        <div class="desc-box">
            <p class="title">
                {{ $t('weekly_content') }}：<span
                    class="edit"
                    v-if="!editAble"
                    @click="editWeekly()"
                    ><a-icon type="form"
                /></span>
            </p>
            <a-textarea
                rows="3"
                v-if="editAble"
                v-model="weeklyContent"
                v-decorator="[
                    `weekly_content`,
                    { initialValue: weeklyContent }
                ]"
                style="width: 100%;"
                :autoFocus="!weekly.id"
                ref="wkct"
                @change="handleWeeklyChange"
            />
            <div
                class="description"
                style="overflow-x:hidden;max-height:200px;overflow-y:scroll;"
                v-else
            >
                {{ weeklyContent }}
            </div>
        </div>
        <div class="desc-box">
            <p class="title">{{ $t('additional_content') }}：</p>
            <a-textarea
                rows="1"
                v-if="editAble"
                v-model="additionalContent"
                v-decorator="[
                    `additional_content`,
                    { initialValue: additionalContent }
                ]"
                style="width: 100%;"
                @change="handleAddtionalChange"
            />
            <div
                class="description"
                style="overflow-x:hidden;max-height:100px;overflow-y:scroll;"
                v-else
            >
                {{ additionalContent }}
            </div>
            <p v-if="editAble" style="margin-top:10px;">
                <a-button
                    type="primary"
                    style="margin-left:88%;float:left;"
                    size="small"
                    @click="saveWeekly"
                    >{{ $t('action.save') }}</a-button
                >
                <a-button
                    v-if="save_flag"
                    type="default"
                    style="margin-left:5px;float:left;"
                    size="small"
                    @click="cancelSaveWeekly"
                    >{{ $t('action.cancel') }}</a-button
                >
            </p>
        </div>

        <div style="clear:both;"></div>
        <div class="desc-box">
            <p class="title">{{ $t('next_week_plans') }}:</p>
            <div class="sub-tasks">
                <data-table
                    :data="weekly.case_ids"
                    :pagination="false"
                    style="table-layout:fixed;"
                    rowKey="case_id"
                    :scroll="{ y: 260 }"
                    bordered
                >
                    <a-table-column
                        :title="$t('case_id')"
                        key="id"
                        data-index="id"
                        align="left"
                        width="10%"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('case_title')"
                        key="case_title"
                        align="left"
                        width="40%"
                    >
                        <template slot-scope="row">
                            <a @click="toDetail(row.id)">{{
                                row.case_title
                            }}</a>
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('executive_officer')"
                        key="responsible_user_id"
                        align="left"
                        width="20%"
                    >
                        <template slot-scope="row">
                            {{ row.responsible_user_id | dict2(systemUsers) }}
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('state')"
                        key="state"
                        align="center"
                        width="10%"
                    >
                        <template slot-scope="row">{{
                            row.state | dict2(stateList)
                        }}</template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.actions')"
                        key="action"
                        align="center"
                        width="20%"
                    >
                        <template slot-scope="row">
                            <a @click="editCase(row.id)">
                                <a-icon type="edit" />
                            </a>
                            <a-popconfirm
                                :title="$t('delete')"
                                :okText="$t('action.ok')"
                                :cancelText="$t('action.cancel')"
                                placement="left"
                                @confirm="onDelete(row.id)"
                            >
                                <a
                                    style="cursor:pointer;margin-left:12px;"
                                    class="btnDel"
                                    ><a-icon type="delete"
                                /></a>
                            </a-popconfirm>
                        </template>
                    </a-table-column>
                </data-table>
            </div>
            <div style="margin-top:10px;" v-if="weekly.id">
                <a class="add-btn" @click="onCreate"
                    ><a-icon type="plus" /> {{ $t('add_next_schedule') }}</a
                >
            </div>
        </div>
        <div class="msg-box">
            <p class="title">
                <a-icon
                    type="message"
                    style="color:#00c4ff;width:10px;margin-right:5px;"
                />&nbsp;&nbsp;{{ $t('work_process') }}：
            </p>
            <a-list
                v-if="comments.length"
                :data-source="comments"
                class="comment-lsit"
                :header="
                    `${comments.length} ${
                        comments.length > 1 ? 'replies' : 'reply'
                    }`
                "
                item-layout="horizontal"
            >
                <a-list-item slot="renderItem" slot-scope="item">
                    <a-comment
                        :author="
                            filterUser(item.author) + ' ' + item.create_time
                        "
                        :avatar="item.avatar"
                        :content="item.content"
                        :datetime="item.datetime"
                    >
                        <template slot="actions">
                            <span
                                v-if="item.delete"
                                key="comment-basic-delete"
                                @click="deleteMessage(item.id)"
                                ><a-icon type="delete" style="font-size:14px;"
                            /></span>
                            <span
                                v-if="item.attachment_ids.length"
                                key="comment-basic-reply-to"
                                @click="attachDetail"
                                ><a-icon type="link" style="font-size:14px;"
                            /></span>
                            <ul class="attach-list">
                                <li
                                    v-for="i of item.attachment_ids"
                                    :key="i.id"
                                >
                                    <a @click="attachDetail(i.id)">{{
                                        i.name
                                    }}</a>
                                </li>
                            </ul>
                        </template>
                    </a-comment>
                </a-list-item>
            </a-list>
            <a-comment>
                <div slot="content">
                    <a-form-item>
                        <a-textarea
                            :rows="1"
                            class="comment-input"
                            :value="commentValue"
                            placeholder="Input comment"
                            @change="handleChange"
                        />
                        <a-button
                            :disabled="!weekly.id"
                            html-type="submit"
                            class="sub-comment-btn"
                            :loading="submitting"
                            type="primary"
                            @click="sendComment"
                        >
                            submit
                        </a-button>
                        <a-upload
                            :file-list="fileList"
                            :remove="handleRemove"
                            :before-upload="beforeUpload"
                        >
                            <a-button :disabled="!weekly.id">
                                <a-icon type="upload" /> {{ $t('attach_file') }}
                            </a-button>
                        </a-upload>
                    </a-form-item>
                </div>
            </a-comment>
        </div>
        <!-- <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" type="primary" @click="cancel">{{
                $t('action.cancel')
            }}</a-button>
        </div> -->
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { ProductService } from '@/services/product.service'
import moment from 'moment'
import { CaseService } from '../../services/case.service'
import reqwest from 'reqwest'
import { formConfig } from '../../config/form.config'
import appConfig from '../../config/app.config'
import ScheduleEdit from '../../components/schedule/schedule-edit.vue'
import ScheduleDetail from '../../components/schedule/schedule-detail.vue'
import { WorkweekService } from '../../services/workweek.service'
import { CommonService } from '@/shared/utils/common.service'
import { PageService } from '../../bootstrap/services/page.service'
import store from '@/store'

@Component({
    components: { ScheduleEdit, ScheduleDetail }
})
export default class WeeklyDetail extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private systemUsers

    @Prop()
    private weeklyInfo

    @Prop()
    private loginUser

    @Prop()
    private caseTypeList

    @Prop()
    private stateList

    @Prop()
    private loginUID

    @Prop()
    private saveFlag

    @Prop({ default: '' })
    private from

    private comments: any[] = []

    private submitting: any = false

    private commentValue: any = ''

    private weeklyContent: any = ''

    private additionalContent: any = ''

    private fileList: any = []

    private weekly: any = []

    private attachs: any = []

    private attachmentList: any[] = []

    private caseService = new CaseService()

    private workweekService = new WorkweekService()

    private loadingService = new LoadingService()

    private pageService = new PageService()

    private state: any = ''

    private weekly_title: any = ''

    private weekly_id: any = 0

    private currentSubId: any = 0

    private editAble: any = false

    private save_flag: any = 0

    private activeBtnRule: any = [
        {
            state: 'todo',
            list: 'doing,done,need_reply,end,cancel'
        },
        {
            state: 'doing',
            list: 'done,need_reply,end,cancel'
        },
        {
            state: 'done',
            list: 'end,cancel'
        },
        {
            state: 'need_reply',
            list: 'doing,done,end,cancel'
        },
        {
            state: 'end',
            list: 'cancel'
        },
        {
            state: 'cancel',
            list: 'todo,doing'
        }
    ]

    private rules = {
        required: [{ required: true, message: 'required' }]
    }

    private created() {
        // this.getParentCase()
    }

    private mounted() {
        this.save_flag = this.saveFlag
        this.editAble = !this.save_flag
        if (this.weeklyInfo) {
            this.weekly = this.weeklyInfo
            this.weeklyContent = this.weekly.week_summary
            this.additionalContent = this.weekly.additional_content
            this.weekly_title =
                this.filterUser(this.weekly.create_uid) + '的周报'
            this.comments = this.weekly.messages.map(x => {
                if (x.attachment_ids.length) {
                    for (var i of x.attachment_ids) this.attachs.push(i)
                }

                return {
                    author: x.create_uid,
                    avatar:
                        'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                    content: x.content,
                    id: x.id,
                    attachment_ids: x.attachment_ids,
                    create_time: this.datetolocal(x.create_date),
                    delete: false,
                    type: x.type,
                    datetime: moment(this.datetolocal(x.create_date)).fromNow()
                }
            })

            setInterval(this.mytime, 1000)
        } else {
            this.weekly_title = this.filterUser(this.loginUID) + '的周报'
        }
    }

    private filterUser(userID) {
        let ret = 'user'
        let user = this.systemUsers.find(x => x.code == userID)
        if (user) {
            ret = user.name.split('@')[0]
        }
        return ret
    }

    private handleChange(e) {
        this.commentValue = e.target.value
    }

    private handleWeeklyChange(e) {
        this.weeklyContent = e.target.value
    }

    private handleAddtionalChange(e) {
        this.additionalContent = e.target.value
    }

    private handleSubmit(attachment_ids) {
        this.submitting = true
        this.workweekService
            .create_message(
                new RequestParams({
                    week_id: this.weekly.id,
                    content: this.commentValue,
                    attachment_ids: attachment_ids.map(x => x.id)
                })
            )
            .subscribe(
                data => {
                    this.submitting = false
                    this.comments = [
                        {
                            author: this.loginUser,
                            avatar:
                                'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                            content: this.commentValue,
                            id: data,
                            attachment_ids: attachment_ids,
                            create_time: new Date(),
                            delete: false,
                            datetime: moment().fromNow()
                        },
                        ...this.comments
                    ]
                    this.commentValue = ''
                    if (attachment_ids.length) {
                        for (var i of attachment_ids) this.attachs.push(i)
                    }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private async sendComment(data) {
        if (!this.commentValue) {
            return
        }

        if (!this.weekly.id) {
            this.$message.error('请输入本周工作内容！')
            this.editAble = true
            return
        }

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
                            let attachs: any = []
                            for (var i in obj.attachment_ids) {
                                attachs.push({
                                    id: obj.attachment_ids[i],
                                    name: this.fileList[i].name
                                })
                            }

                            this.fileList = []

                            reslove({ attach: attachs })
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
            if (ret.attach) {
                this.handleSubmit(ret.attach || [])
            } else {
                this.$message.error('附件上传失败')
            }
        })
    }

    private attachDetail(id) {
        window.open(
            appConfig.server + '/attachment/view_attachment?attachment_id=' + id
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

    private deleteMessage(id) {
        this.workweekService
            .delete_message(
                new RequestParams({
                    message_id: id
                })
            )
            .subscribe(
                data => {
                    this.$message.success('删除成功')
                    this.comments = this.comments.filter(x => x.id != id)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private mytime() {
        this.comments.map(x => {
            var now = Math.floor(new Date().valueOf() / 1000)
            var dt = Math.floor(new Date(x.create_time).valueOf() / 1000)
            x['delete'] =
                now - dt >= 120 ? false : x.type != 'system' ? true : false
        })
    }

    private editCase(id) {
        this.caseService
            .queryCaseDetail(
                new RequestParams(
                    {
                        case_id: id
                    },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    this.$modal
                        .open(
                            ScheduleEdit,
                            {
                                saveFlag: 1,
                                stock: data[0],
                                stateList: this.stateList,
                                caseTypeList: this.caseTypeList,
                                systemUsers: this.systemUsers,
                                loginUID: this.loginUID
                            },
                            {
                                title: this.$t('action.create'),
                                width: '800px'
                            }
                        )
                        .subscribe(data => {
                            let msg: any = this.$t('save_success')
                            this.$message.success(msg)
                            this.refreshDetail(this.weekly.id)
                        })
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private editWeekly() {
        this.editAble = true
    }

    private refreshDetail(id) {
        this.workweekService
            .query_week_detail(
                new RequestParams(
                    {
                        week_id: id
                    },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    this.weekly = data[0]
                },
                err => {}
            )
    }

    private datetolocal(date, fmt = 'yyyy-MM-dd hh:mm'): string {
        // 空数据处理
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
            fmt = fmt.replace(RegExp.$1, date.getFullYear() + '')
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
        return fmt
    }

    private listClick(id) {
        this.currentSubId = id
    }

    private onDelete(id) {
        this.caseService
            .deleteCase(
                new RequestParams(
                    {
                        case_id: id
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('delete_success')
                    this.$message.success(msg)
                    this.weekly.case_ids = this.weekly.case_ids.filter(
                        x => x.id != id
                    )
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onCreate() {
        if (!this.weekly.id) {
            this.$message.error('请输入本周工作内容！')
            this.editAble = true
            return
        }
        this.$modal
            .open(
                ScheduleEdit,
                {
                    saveFlag: 0,
                    stateList: this.stateList,
                    caseTypeList: this.caseTypeList,
                    systemUsers: this.systemUsers,
                    parentID: this.weekly.case_id,
                    loginUID: this.loginUID,
                    weekID: this.weekly.id
                },
                {
                    title: this.$t('action.create'),
                    width: '800px'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('save_success')
                this.$message.success(msg)
                //刷新
                this.refreshDetail(this.weekly.id)
            })
    }

    private getParentCase() {
        this.caseService
            .getParentCase(
                new RequestParams(
                    {
                        case_id: 3255
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('delete_success')
                    this.$message.success(msg)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private toDetail(id) {
        this.showCaseDetail(id)
    }

    private showCaseDetail(id) {
        this.caseService
            .queryCaseDetail(
                new RequestParams(
                    {
                        case_id: id
                    },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    this.$modal
                        .open(
                            ScheduleDetail,
                            {
                                schedules: data[0],
                                stateList: this.stateList,
                                caseTypeList: this.caseTypeList,
                                systemUsers: this.systemUsers,
                                loginUser: this.loginUser,
                                loginUID: this.loginUID
                            },
                            {
                                title: this.$t('case_detail'),
                                width: '1000px'
                            }
                        )
                        .subscribe(() => {})
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private editWeeklyContent() {
        this.editAble = true
    }

    private saveWeekly() {
        if (this.weeklyContent.length > 0) {
            let param: any = {
                save_flag: this.save_flag,
                week_summary: this.weeklyContent,
                additional_content: this.additionalContent
            }

            if (this.weekly.id) {
                param['id'] = this.weekly.id
            }
            // save values
            this.workweekService.save_week(new RequestParams(param)).subscribe(
                data => {
                    this.$message.success('保存成功')
                    this.weekly['id'] = data[0].id
                    this.save_flag = 1
                    this.editAble = false
                },
                err => {
                    this.$message.error('保存失败')
                }
            )
        } else {
            // this.$message.error('请输入本周工作内容！')
            let wkct: any = this.$refs.wkct
            wkct.focus()
        }
    }

    private cancelSaveWeekly() {
        this.editAble = false
    }
}
</script>

<style>
.parent-bar {
    padding: 0 0 10px 0;
}
.title-box {
    width: 100%;
    padding: 0 0 20px 0;
    border-bottom: 1px solid #eee;
    display: inline-block;
}
.title-box .title {
    font-weight: 600;
    font-size: 20px;
    width: 100%;
    line-height: 30px;
    color: #222;
}
.title-box .status-bar {
    width: 100%;
    margin: 10px 0;
    font-size: 14px;
    color: #333;
}
.desc-box {
    width: 100%;
    padding: 5px 10px;
    border-bottom: 1px solid #eee;
    display: inline-block;
    /* background: #f2f2f2; */
}
.desc-box .title {
    font-size: 16px;
    color: #222;
    margin: 5px;
    position: relative;
}

.desc-box .title .edit {
    position: absolute;
    color: #40a9ff;
    cursor: pointer;
    right: 10px;
}
.desc-box .description {
    font-weight: 600;
    font-size: 16px;
    white-space: pre;
    width: 920px;
    padding: 0 10px;
    /* overflow-x: scroll; */
}
.user-div {
    width: 100%;
    height: 60px;
    margin-top: 20px;
}
.user-div .user-box {
    width: 21%;
    margin: 20px 3% 20px 1%;
    float: left;
}
.avatar-box {
    display: inline-block;
}
.avatar-box .avatar {
    margin-right: 5px;
    float: left;
}
.avatar-box .username {
    line-height: 18px;
    margin: 0;
    color: #333;
}
.avatar-box .date {
    line-height: 18px;
    margin: -10px 0 0 0;
    color: #333;
}
.avatar-box .remark {
    line-height: 18px;
    width: 120px;
    margin: 0;
    color: #999;
}
.joiner-div {
    width: 100%;
    height: 60px;
    margin-top: 10px;
}
.joiner-div .joiner-title {
    margin: 5px 0 0 0;
    padding: 0;
    clear: both;
}
.joiner-div .user-box {
    width: 12%;
    margin: 10px 2%;
    float: left;
}
.joiner-div .add-user-box {
    width: 4%;
    margin: 10px 1%;
    float: left;
}
.joiner-div .add-user-box .add-btn {
    font-size: 30px;
    color: #999;
    cursor: pointer;
}
.msg-box {
    width: 100%;
    padding: 20px 0 0 0;
    display: inline-block;
}
.msg-box .title {
    font-size: 16px;
    color: #222;
}

.comment-input {
    max-width: 88% !important;
    float: left;
}

.sub-comment-btn {
    height: 32px;
    /* position: absolute; */
    float: left;
    right: 0;
}
.ant-comment-inner {
    padding: 0 !important;
}
.msg-box .ant-comment-content {
    min-height: 30px !important;
    height: auto;
    margin: 3px 0 !important;
}
.msg-box .ant-list-items {
    width: 100%;
    max-height: 200px;
    overflow-y: scroll;
}
.msg-box .ant-comment-content-detail {
    word-break: break-all !important;
}
.attach-list {
    margin: 0;
    padding: 0;
}
.attach-list li {
    list-style-type: none;
    float: left;
    line-height: 14px;
}
.btn-box {
    width: 100%;
    height: 50px;
}
.btn-box .btn-div {
    width: 19%;
    padding: 1%;
    float: left;
    text-align: center;
}
.btn-box .btn-div .action-btn {
    width: 60px;
    height: 60px;
}
.status-bar .progress-bar li {
    padding: 0px 10px;
    line-height: 25px;
    background: #ababab;
    display: inline-block;
    color: #fff;
    position: relative;
    min-width: 100px;
    width: auto;
    text-align: center;
}
.status-bar .progress-bar li:after {
    content: '';
    display: block;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 12px solid #ababab;
    position: absolute;
    right: -12px;
    top: 0;
    z-index: 10;
}
.status-bar .progress-bar li:before {
    content: '';
    display: block;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 12px solid #fff;
    position: absolute;
    left: 0px;
    top: 0;
}
.status-bar .progress-bar li {
    padding-left: 25px;
}
.status-bar .progress-bar li:first-child {
    border-radius: 4px 0 0 4px;
}
.status-bar .progress-bar li:first-child:before {
    display: none;
}
.status-bar .progress-bar li.active {
    background-color: #50abe4;
}
.status-bar .progress-bar .clickable {
    background-color: #a6c1e0;
    cursor: pointer;
}
.status-bar .progress-bar .clickable:after {
    border-left-color: #a6c1e0;
}
.status-bar .progress-bar li.active:after {
    border-left-color: #50abe4;
}
.bar-date {
    position: absolute;
    color: #000;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
}
.bar-date span {
    font-size: 12px;
    color: #999;
}
.tab-box {
    min-height: 240px;
}
.sub-list-active {
    background: #d9f0fb;
}
.add-btn {
    padding: 5px 8px;
    line-height: 30px;
    color: #4caf50;
}
</style>

<i18n>
{
  "en-us": {
    "desc": "this is a Order Page1",
    "detail": "Detail",
    "title": "Title",
    "start_time":"Start Time",
    "finish_before":"Finish Before",
    "finish_time":"Finish Time",
    "end_time":"End Time",
    "name":"Title",
    "user_id":"Request Submitter",
    "executive_officer":"Executive Officer",
    "participant":"Participant",
    "weekly_content":"Weekly Content",
    "state":"State",
    "case_type":"Case Type",
    "case_id":"Case ID",
    "case_title":"Title",
    "work_process": "Work record process",
    "add_next_schedule":"Add New Plan",
    "next_week_plans":"Next Week Plans",
    "additional_content":"Addtional Content",
    "case_detail": "Schedule Detail",
    "columns":{
       "product":"Product",
       "basic_product":"Basic Product",
       "location":"Location",
       "isSendLocation":"IsSendLocation",
       "batch":"Batch",
       "reserved_qty":"Reserved Qty",
       "multi_qty":"Multi Qty",
       "time":"Create Time",
       "actions":"Actions",
       "quantity":"Quantity"
    },
    "action":{
      "create":"Create",
      "batch-create":"EXCEL Import",
      "edit":"Edit",
      "delete":"Delete",
      "ok":"Yes",
      "cancel":"Cancel",
      "more":"More",
      "submit":"Submit",
      "save":"Save"
    },
    "rules":{
       "date_range_error":"start date can't later start date"
    },
    "tabs":{
       "base":"Details",
       "sub":"Sub Schedules",
       "attach":"Attachs"
    },
    "delete":"Are you sure delete?"
  },
  "zh-cn": {
    "desc": "这是订单页面1",
    "detail": "详情",
    "title": "工作名称",
    "start_time":"开始时间",
    "finish_before":"期望完成时间",
    "finish_time":"完成时间",
    "end_time":"结束时间",
    "name":"标题",
    "user_id":"需求提交人",
    "executive_officer":"执行负责人",
    "participant":"参与者",
    "weekly_content":"本周工作总结(未完成的，需说明原因)",
    "state":"状态",
    "case_type":"类型",
    "case_id":"ID",
    "case_title":"标题",
    "work_process": "周报内容沟通记录",
    "add_next_schedule":"新增计划",
    "next_week_plans":"下周工作计划",
    "additional_content":"需协调与帮助",
    "case_detail": "工作计划详情",
    "columns":{
       "product":"产品货号",
       "basic_product":"基础产品",
       "location":"存放位置",
       "isSendLocation":"发货位置",
       "batch":"批次",
       "reserved_qty":"已预留库存",
       "multi_qty":"倍数",
       "time":"创建时间",
       "actions":"操作",
       "quantity":"库存数量"
    },
    "action":{
      "create":"新建",
      "batch-create":"EXCEL导入",
      "edit":"编辑",
      "delete":"删除",
      "ok":"确定",
      "cancel":"取消",
      "more":"更多操作",
      "submit":"提交",
      "save":"保存"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "tabs":{
       "base":"日程信息",
       "sub":"子任务",
       "attach":"附件"
    },
    "delete":"是否确认删除?"
  }
}
</i18n>
