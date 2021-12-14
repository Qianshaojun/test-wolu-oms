<template>
    <page-container ref="pageContainer">
        <template #header-action>
            <a-button type="primary" @click="onCreate">{{
                $t('action.create')
            }}</a-button>
        </template>
        <data-form ref="dataForm" @submit="getCaseList" :column="2">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.user_id')"
                    style="height:35px;margin:0;"
                    :labelCol="{ span: 8 }"
                    :wrapperCol="{ span: 15, offset: 1 }"
                >
                    <a-select
                        show-search
                        v-decorator="['user_id', { initialValue: user_id }]"
                        :style="{ width: '200px' }"
                        size="small"
                        :filter-option="handleSearch"
                        @change="e => onUseridChange(e)"
                    >
                        <a-select-option :value="0">
                            {{ $t('none') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of systemUsers"
                            :key="item.code"
                            >{{ $t(item.name) }}</a-select-option
                        >
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.executive_officer')"
                    style="height:35px;margin:0;"
                    :labelCol="{ span: 8 }"
                    :wrapperCol="{ span: 15, offset: 1 }"
                >
                    <a-select
                        show-search
                        v-decorator="[
                            'responsible_user_id',
                            { initialValue: responsible_user }
                        ]"
                        :style="{ width: '200px' }"
                        size="small"
                        :filter-option="handleSearch"
                        @change="e => onResponsibleUserChange(e)"
                    >
                        <a-select-option :value="0">
                            {{ $t('none') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of systemUsers"
                            :key="item.code"
                            >{{ $t(item.name) }}</a-select-option
                        >
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.state')"
                    style="height:35px;margin:0;"
                    :labelCol="{ span: 8 }"
                    :wrapperCol="{ span: 15, offset: 1 }"
                >
                    <a-select
                        mode="multiple"
                        v-decorator="['state', { initialValue: [] }]"
                        :style="{ width: '200px' }"
                        size="small"
                        :filter-option="handleSearch"
                        @change="e => onStateChange(e)"
                    >
                        <a-select-option
                            :value="item.code"
                            v-for="item of stateList"
                            :key="item.code"
                            >{{ $t(item.name) }}</a-select-option
                        >
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.participant')"
                    style="height:35px;margin:0;"
                    :labelCol="{ span: 8 }"
                    :wrapperCol="{ span: 15, offset: 1 }"
                >
                    <a-select
                        show-search
                        v-decorator="[
                            'participant',
                            { initialValue: participant }
                        ]"
                        :style="{ width: '200px' }"
                        size="small"
                        :filter-option="handleSearch"
                        @change="e => onJoinerChange(e)"
                    >
                        <a-select-option :value="0">
                            {{ $t('none') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of systemUsers"
                            :key="item.code"
                            >{{ $t(item.name) }}</a-select-option
                        >
                    </a-select>
                </a-form-item>
            </template>
        </data-form>
        <a-card class="margin-y x-calendar">
            <a-calendar @panelChange="onPanelChange">
                <ul slot="dateCellRender" slot-scope="value" class="events">
                    <li v-for="item in getListData(value)" :key="item.title">
                        <a-tooltip placement="topLeft" :mouseLeaveDelay="0">
                            <template slot="title">
                                {{ item.title }}
                            </template>
                            <a
                                @click="e => showDetail(e, item, value)"
                                style="width:100%;height:20px;display:block;"
                                ><a-badge
                                    v-if="
                                        item.state != 'done' &&
                                            item.state != 'end'
                                    "
                                    :text="item.title"
                                    :status="calcClr(item.state)"
                                />
                                <span
                                    v-else-if="item.state == 'done'"
                                    class="ant-badge ant-badge-status ant-badge-not-a-wrapper"
                                    ><span
                                        class="ant-badge-status-dot ant-badge-status-processing"
                                        style="background: #52c41a;"
                                    ></span
                                    ><span class="ant-badge-status-text">{{
                                        item.title
                                    }}</span></span
                                >
                                <span
                                    v-else
                                    class="ant-badge ant-badge-status ant-badge-not-a-wrapper"
                                    ><span
                                        class="ant-badge-status-dot ant-badge-status-success"
                                        style="background: #01791b;"
                                    ></span
                                    ><span class="ant-badge-status-text">{{
                                        item.title
                                    }}</span></span
                                >
                            </a>
                        </a-tooltip>
                    </li>
                </ul>
            </a-calendar>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { ProductService } from '~/services/product.service'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { CaseService } from '~/services/case.service'
import DataForm from '~/shared/components/data-form.vue'
import BatchProduct from '~/components/stock/batch-product.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import ScheduleEdit from '../../components/schedule/schedule-edit.vue'
import ScheduleDetail from '../../components/schedule/schedule-detail.vue'

const userModule = namespace('userModule')
const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'schedule-manage'
})
@Component({
    components: {
        ScheduleEdit,
        ScheduleDetail
    }
})
export default class ProductManage extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    // Loading服务
    private productService = new ProductService()

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private caseService = new CaseService()
    // 表格数据源
    private data: any[] = []

    private showBtn: any = false

    // 表格选择项
    private selectedRowKeys: any[] = []

    // 详情项
    private detailInfo: any = null

    private dateArr: any = []

    private startQueryDate: any = ''

    private endQueryDate: any = ''

    private stateList: any = ''

    private caseTypeList: any = ''

    @userModule.State
    private id

    @userModule.State
    private username

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private responsible_user: any = 0

    private user_id: any = 0

    private participant: any = 0

    private state: any = []

    private searchAble: any = true

    private get rules() {
        return {}
    }

    private created() {
        this.getStateDict()
        this.responsible_user = this.id
        this.getSystemuser()
        var now = new Date()
        var month = now.getFullYear() + '-' + (now.getMonth() + 1)
    }

    private mounted() {}

    private async getScheduleByMonth(start, end) {
        if (!this.searchAble) {
            return
        }
        await new Promise((reslove, reject) => {
            let params = {
                start_time: start,
                end_time: end,
                user_id: parseInt(this.user_id),
                responsible_user_id: parseInt(this.responsible_user),
                participant: parseInt(this.participant)
            }
            if (this.state.length) {
                params['state'] = this.state
            }
            this.caseService
                .queryAllCalendar(
                    new RequestParams(params, {
                        loading: this.loadingService
                    })
                )
                .subscribe(
                    data => {
                        this.searchAble = false
                        this.data = []
                        for (var item of data) {
                            let end_time = item.finish_time
                                ? item.finish_time
                                : item.finish_before
                            let dateList = this.getDateList(
                                item.start_time,
                                end_time
                            )
                            let content: any = {}
                            if (dateList.length) {
                                content = {
                                    type: 'warning',
                                    title: item.case_title,
                                    content: item.description,
                                    state: item.state,
                                    case_id: item.case_id,
                                    case_type: item.case_type
                                }
                            }
                            for (var i in dateList) {
                                let exist = this.data.find(
                                    x => x.date == dateList[i]
                                )
                                if (exist) {
                                    exist.content.push(content)
                                } else {
                                    this.data.push({
                                        date: dateList[i],
                                        content: [content]
                                    })
                                }
                            }
                        }

                        this.startQueryDate = start
                        this.endQueryDate = end
                        reslove([])
                    },
                    err => {
                        this.$message.error(err.message)
                        reslove([])
                    }
                )
        })
    }

    private getCaseList() {
        this.searchAble = true
        this.getScheduleByMonth(this.startQueryDate, this.endQueryDate)
    }

    private getStateDict() {
        this.caseService.queryCaseType(new RequestParams({})).subscribe(
            data => {
                this.stateList = data.state
                this.caseTypeList = data.case_type
            },
            err => {}
        )
    }

    private getDateList(start, end) {
        let list: any = []
        if (start) {
            let start_date: any = this.dateFormat('YYYY-mm-dd', new Date(start))
            list.push(start_date)
            if (end) {
                let end_date = this.dateFormat('YYYY-mm-dd', new Date(end))
                let days = this.getDaysBetween(start_date, end_date)
                for (var i = 1; i <= days; i++) {
                    var day = new Date(start)

                    var targetday_milliseconds =
                        day.getTime() + 1000 * 60 * 60 * 24 * i

                    day.setTime(targetday_milliseconds)
                    list.push(this.dateFormat('YYYY-mm-dd', day))
                }
            }
        }

        return list || []
    }

    private getDaysBetween(dateString1, dateString2) {
        var startDate = Date.parse(dateString1)
        var endDate = Date.parse(dateString2)
        if (startDate > endDate) {
            return 0
        }
        if (startDate == endDate) {
            return 0
        }
        var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
        return Math.floor(days)
    }

    private getDaysBetween3(start, end) {
        var reg = /[^\d]/g
        var a = new Date(start.replace(reg, '/'))
        var b = new Date(end.replace(reg, '/'))
        var result = {}
        for (; a.getTime() <= b.getTime(); a.setDate(a.getDate() + 1)) {
            null == result[a.getMonth() + 1 + '月']
                ? (result[a.getMonth() + 1 + '月'] = 1)
                : (result[a.getMonth() + 1 + '月'] += 1)
        }
        return result[a.getMonth() + 1 + '月']
    }

    private dateFormat(fmt, date) {
        let ret
        const opt = {
            'Y+': date.getFullYear().toString(), // 年
            'm+': (date.getMonth() + 1).toString(), // 月
            'd+': date.getDate().toString(), // 日
            'H+': date.getHours().toString(), // 时
            'M+': date.getMinutes().toString(), // 分
            'S+': date.getSeconds().toString() // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        }
        for (let k in opt) {
            ret = new RegExp('(' + k + ')').exec(fmt)
            if (ret) {
                fmt = fmt.replace(
                    ret[1],
                    ret[1].length == 1
                        ? opt[k]
                        : opt[k].padStart(ret[1].length, '0')
                )
            }
        }
        return fmt
    }

    private onCreate() {
        this.$modal
            .open(
                ScheduleEdit,
                {
                    saveFlag: 0,
                    stateList: this.stateList,
                    caseTypeList: this.caseTypeList,
                    systemUsers: this.systemUsers,
                    loginUID: this.id
                },
                {
                    title: this.$t('action.create'),
                    width: '800px'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('save_success')
                this.$message.success(msg)
            })
    }

    private queryDateList: any = []
    private timer: any

    private getListData(value) {
        let listData: any = []
        let date = value.format('YYYY-MM-DD')
        let end = new Date(date)
        let end_day = end.getTime() + 1000 * 60 * 60 * 24 * 45
        end.setTime(end_day)

        let exist = this.data.find(x => x.date == date)
        if (exist) {
            listData = exist.content
        } else {
            this.getScheduleByMonth(
                date,
                this.dateFormat('YYYY-mm-dd', end)
            ).then(() => {
                let exist2 = this.data.find(y => y.date == date)
                if (exist2) {
                    listData = exist2.content
                }
            })
        }

        return listData || []
    }

    private showDetail(e, item, date) {
        e.stopPropagation()
        this.caseService
            .queryCaseDetail(
                new RequestParams(
                    {
                        case_id: item.case_id
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
                                loginUser: this.username,
                                loginUID: this.id
                            },
                            {
                                title: date.format('MM-DD'),
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

    private onResponsibleUserChange(e) {
        this.responsible_user = e
    }

    private onUseridChange(e) {
        this.user_id = e
    }

    private onJoinerChange(e) {
        this.participant = e
    }

    private calcClr(state) {
        if (state === 'todo') {
            return 'default'
        } else if (state === 'doing') {
            return 'processing'
        } else if (state === 'done') {
            return 'success'
        } else if (state === 'end') {
            return 'success'
        } else if (state === 'need_reply') {
            return 'warning'
        } else if (state === 'cancel') {
            return 'default'
        }
    }

    private handleSearch(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private onStateChange(e) {
        this.state = e
    }

    private onPanelChange() {
        this.searchAble = true
    }
}
</script>

<style>
.x-calendar .ant-fullcalendar-tbody td {
    border: 1px solid #68defd !important;
}
.x-calendar .ant-fullcalendar-value {
    font-size: 20px;
}
.x-calendar .ant-fullcalendar-selected-day .ant-fullcalendar-value {
    font-size: 28px;
}
.x-calendar
    .ant-fullcalendar-column-header
    .ant-fullcalendar-column-header-inner {
    display: block;
    font-weight: 600;
    font-size: 18px;
}
.events {
    list-style: none;
    margin: 0;
    padding: 0;
}
.events .ant-badge-status {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-overflow: ellipsis;
    font-size: 12px;
}
.notes-month {
    text-align: center;
    font-size: 28px;
}
.notes-month section {
    font-size: 28px;
}

.events .ant-badge-status-dot {
    width: 12px;
    height: 12px;
}

.user-type .ant-select-selection--single {
    background: #e4e3e2;
}
</style>

<i18n>
{
  "en-us": {
    "desc": "this is a Order Page1",
    "none": "None",
    "columns":{
       "state":"State",
       "product":"Product",
       "basic_product":"Basic Product",
       "location":"Location",
       "isSendLocation":"IsSendLocation",
       "batch":"Batch",
       "reserved_qty":"Reserved Qty",
       "multi_qty":"Multi Qty",
       "time":"Create Time",
       "actions":"Actions",
       "quantity":"Quantity",
       "user_id":"Request Submitter",
       "participant":"Participant",
       "executive_officer":"Executive Officer"
    },
    "action":{
      "create":"Create",
      "batch-create":"EXCEL Import",
      "edit":"Edit",
      "delete":"Delete",
      "ok":"Yes",
      "cancel":"Cancel",
      "more":"More",
      "detail":"Detail"
    },
    "rules":{
       "date_range_error":"start date can't later start date"
    },
    "delete":"Are you sure delete?",
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Delete Success"
  },
  "zh-cn": {
    "desc": "这是订单页面1",
    "none": "无",
    "columns":{
       "state":"状态",
       "product":"产品货号",
       "basic_product":"基础产品",
       "location":"存放位置",
       "isSendLocation":"发货位置",
       "batch":"批次",
       "reserved_qty":"已预留库存",
       "multi_qty":"倍数",
       "time":"创建时间",
       "actions":"操作",
       "quantity":"库存数量",
       "user_id":"需求提交人",
       "participant":"参与者",
       "executive_officer":"执行负责人"
    },
    "action":{
      "create":"新建",
      "batch-create":"EXCEL导入",
      "edit":"编辑",
      "delete":"删除",
      "ok":"确定",
      "cancel":"取消",
      "more":"更多操作",
      "detail":"详情"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "delete":"是否确认删除?",
    "fuzzy_search":"模糊搜索",
    "save_success": "保存成功",
    "delete_success":"删除成功"
  }
}
</i18n>
