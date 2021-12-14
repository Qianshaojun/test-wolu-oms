<template>
    <section class="component">
        <a-spin :spinning="spinning">
            <a-tabs
                default-active-key="started"
                type="card"
                @change="e => onPanelChange(e)"
            >
                <a-tab-pane :tab="$t('started_template')" key="started">
                    <div class="xg-template-div">
                        <div
                            class="ant-transfer-list left-div"
                            style="width:250px;height:450px;padding-top:0;"
                        >
                            <div
                                style="width: 100%;height:45px;overflow: auto;padding-top:5px;padding-left:14px;"
                            >
                                <a-input-search
                                    :placeholder="$t('input search text')"
                                    style="width: 220px"
                                    @change="e => onTempSelectSearch(e)"
                                />
                            </div>
                            <ul class="list">
                                <li
                                    v-for="item of startedTemplateList"
                                    :key="item.id"
                                    @click="onTempLiClick(item)"
                                    :class="
                                        currenctTemplateId == item.id
                                            ? 'active'
                                            : ''
                                    "
                                >
                                    <p class="mdl-name">
                                        <span :title="item.name">
                                            {{ item.name.substr(0, 20) }}
                                            {{
                                                item.name.length > 20
                                                    ? '...'
                                                    : ''
                                            }}
                                        </span>
                                    </p>
                                </li>
                            </ul>
                            <div class="cb-btn-div-bottom">
                                <span
                                    class="cb-btn"
                                    @click="changeSequence('top')"
                                    >{{ $t('action.template_move_top') }}</span
                                >
                                <span
                                    class="cb-btn"
                                    @click="changeSequence('up')"
                                    >{{ $t('action.template_up') }}</span
                                >
                                <span
                                    class="cb-btn"
                                    @click="changeSequence('down')"
                                    >{{ $t('action.template_down') }}</span
                                >
                                <span class="cb-btn" @click="unStar">{{
                                    $t('action.template_remove')
                                }}</span>
                            </div>
                        </div>
                        <div
                            class="ant-transfer-list right-div"
                            style="width:650px;height:450px;margin-left:40px;padding-top:0;overflow-y: scroll;"
                        >
                            <a-card :title="$t('template_show')">
                                <div v-html="content"></div>
                            </a-card>
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane :tab="$t('all_template')" key="all">
                    <div class="xg-template-div">
                        <div
                            class="ant-transfer-list left-div"
                            style="width:250px;height:450px;padding-top:0;"
                        >
                            <div
                                style="width: 100%;height:45px;overflow: auto;padding-top:5px;padding-left:14px;"
                            >
                                <a-input-search
                                    :placeholder="$t('input search text')"
                                    style="width: 220px"
                                    @change="e => onTempSelectSearch(e)"
                                />
                            </div>
                            <ul class="list">
                                <li
                                    v-for="item of allTemplateList"
                                    :key="item.id"
                                    @click="onTempLiClick(item)"
                                    :class="
                                        currenctTemplateId == item.id
                                            ? 'active'
                                            : ''
                                    "
                                >
                                    <p class="mdl-name">
                                        <span :title="item.name">
                                            {{ item.name.substr(0, 20) }}
                                            {{
                                                item.name.length > 20
                                                    ? '...'
                                                    : ''
                                            }}
                                        </span>
                                    </p>
                                </li>
                            </ul>
                            <div class="cb-btn-div-bottom">
                                <span
                                    class="cb-btn"
                                    @click="onStar"
                                    v-if="showBtn"
                                    >{{ $t('action.template_start') }}</span
                                >
                                <span class="cb-btn" @click="unStar" v-else>{{
                                    $t('action.template_unstart')
                                }}</span>
                            </div>
                        </div>
                        <div
                            class="ant-transfer-list right-div"
                            style="width:650px;height:450px;margin-left:40px;padding-top:0;overflow-y: scroll;"
                        >
                            <a-card :title="$t('template_show')">
                                <div v-html="content"></div>
                            </a-card>
                        </div>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </a-spin>

        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('action.cancel')
            }}</a-button>
            <a-button type="primary" @click="submit">{{
                $t('action.save')
            }}</a-button>
        </div>
    </section>
</template>
<style>
.xg-template-div .left-div ul li {
    list-style-type: none;
}
.xg-template-div .left-div ul {
    height: 360px;
    overflow-y: auto;
    padding: 0;
    margin: 0;
}
.xg-template-div .left-div .cb-btn-div {
    width: 250px;
    height: 40px;
    border-top: 1px solid #d9d9d9;
}
.xg-template-div .cb-btn-div-top {
    width: 250px;
    height: 40px;
    border-bottom: 1px solid #d9d9d9;
}
.xg-template-div .cb-btn-div-bottom {
    width: 250px;
    height: 40px;
    border-top: 1px solid #d9d9d9;
}
.xg-template-div .cb-btn-div-top .cb-btn,
.xg-template-div .cb-btn-div-bottom .cb-btn {
    width: 25%;
    line-height: 32px;
    text-align: center;
    display: block;
    float: left;
    cursor: pointer;
}
.xg-template-div .cb-btn-div-top .cb-btn:hover,
.xg-template-div .cb-btn-div-bottom .cb-btn:hover {
    color: #1890ff;
}
.xg-template-div .list {
    width: 100%;
    padding: 0;
    margin: 0;
    height: 100%;
    display: inline-block;
}
.xg-template-div .list li {
    list-style: none;
    line-height: 40px;
    margin: 0;
    padding: 10px 5% 0 5%;
    border-bottom: 1px solid #f5f5f5;
}
.xg-template-div .list .mdl-name {
    margin: 0;
    line-height: 20px;
    font-weight: 600;
    color: #222;
}
.xg-template-div .list .active {
    background: #e6f7ff;
}
.xg-template-div .list li .edit {
    float: right;
    margin-right: 5px;
    color: #0099cc;
    font-size: 18px;
}
</style>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { RequestParams } from '~/core/http'
import moment from 'moment'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import appConfig from '../../config/app.config'
const chatModule = namespace('chatModule')
import { EmailService } from '~/services/cs-email.service'

@Component({
    components: {}
})
export default class ChatTemplateForm extends Vue {
    private startedTemplateList: any = []
    private allTemplateList: any = []
    private content: any = ''
    private emailService = new EmailService()
    private currenctTemplateId: any = ''

    private spinning: any = false
    private changeSpinning(data) {
        this.spinning = data
    }

    private created() {
        this.reloadTemplate()
    }

    private onPanelChange(e) {
        this.reloadTemplate()
        this.currenctTemplateId = ''
        this.content = ''
    }

    private onStar() {
        this.changeSpinning(true)
        var result = this.emailService
            .starTemplate(
                new RequestParams({ template_id: this.currenctTemplateId })
            )
            .subscribe(
                data => {
                    this.$message.success(this.$t('Set Success.').toString())
                    this.reloadTemplate()
                    this.showBtn = false
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private unStar() {
        this.changeSpinning(true)
        var result = this.emailService
            .deleteTemplate(
                new RequestParams({ template_id: this.currenctTemplateId })
            )
            .subscribe(
                data => {
                    this.$message.success(this.$t('Set Success.').toString())
                    this.reloadTemplate()
                    this.showBtn = true
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private changeSequence(type: any) {
        this.changeSpinning(true)
        // var result = this.emailService
        //     .changeSequence(
        //         new RequestParams({
        //             template_id: this.currenctTemplateId,
        //             type: type
        //         })
        //     )
        //     .subscribe(
        //         data => {
        //             this.$message.success(this.$t('Set Success.').toString())
        //             this.reloadTemplate()
        //             this.changeSpinning(false)
        //         },
        //         err => {
        //             this.changeSpinning(false)
        //             this.$message.error(err.message)
        //         }
        //     )
    }

    @Prop()
    private lang_code

    @Prop()
    private seller_code

    private onTempSelectSearch(e) {
        if (e.target.value !== '') {
            var that = this
            this.changeSpinning(true)
            var data = this.emailService
                .getTemplates(
                    new RequestParams({
                        lang_code: this.lang_code,
                        seller_code: this.seller_code,
                        name: e.target.value
                    })
                )
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
        } else {
            this.reloadTemplate()
        }
    }

    private reloadTemplate() {
        var that = this
        this.changeSpinning(true)
        var data = this.emailService
            .getTemplates(
                new RequestParams({
                    lang_code: this.lang_code,
                    seller_code: this.seller_code
                })
            )
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

    @Prop()
    private uid

    private updateAllTemplates(data) {
        this.allTemplateList = data
        this.startedTemplateList = data.filter(x => x.uid === this.uid)
        this.startedTemplateList.sort(function(a, b) {
            return a.sequence - b.sequence
        })
    }

    private showBtn = true

    private onTempLiClick(item) {
        this.currenctTemplateId = item.id
        this.content = item.body_html
        if (item.uid === this.uid) {
            this.showBtn = false
        } else {
            this.showBtn = true
        }
    }

    @Emit('modal.submit')
    private submit() {
        return this.content
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }
}
</script>
<i18n>
{
    "en-us":{
        "started_template": "Started Template",
        "input search text": "Input search",
        "template_show": "Template View",
        "all_template": "All Template",
        "action": {
            "template_move_top": "Top",
            "template_up": "Up",
            "template_down": "Down",
            "template_remove": "Remove",
            "template_start": "Start",
            "template_unstart": "Un Start",
            "cancel": "cancel",
            "save": "submit"
        }
    },
    "zh-cn":{
        "started_template": "已收藏的模板",
        "input search text": "名称模糊搜索",
        "template_show": "模板预览",
        "all_template": "所有模板",
        "action": {
            "template_move_top": "置顶",
            "template_up": "上移",
            "template_down": "下移",
            "template_remove": "移除",
            "template_start": "收藏",
            "template_unstart": "取消收藏",
            "cancel": "取消",
            "save": "提交"
        }
    }
}
</i18n>
