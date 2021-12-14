<template>
    <page-container ref="pageContainer">
        <template #header-action>
            <a-button type="primary" @click="onCreate"
                >{{ $t('action.create') }}
            </a-button>
            <!-- <a-button type="primary" @click="onBatchUpload">{{
                $t('action.batch-create')
            }}</a-button>-->
        </template>
        <data-form ref="dataForm" @submit="getWeeklyList" :column="1">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.create_uid')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        show-search
                        v-decorator="['create_uid']"
                        :style="{ width: '240px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        :filter-option="handleSearch"
                    >
                        <a-select-option value="">
                            {{ $t('none') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of systemUsers"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.create_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="[
                            'create_date',
                            { initialValue: initialDate }
                        ]"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                    <a-button
                        @click="fillWeek"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.nearly_week') }}
                    </a-button>
                    <a-button
                        @click="fillMonth"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.nearly_month') }}
                    </a-button>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <!-- <template #action>
                <a-popconfirm
                    :title="$t('cancel')"
                    :okText="$t('action.ok')"
                    :cancelText="$t('action.cancel')"
                    placement="left"
                    @confirm="onBatchDelete()"
                    :disabled="!selectedRowKeys.length"
                >
                    <a-button
                        type="primary"
                        :disabled="!selectedRowKeys.length"
                        >{{ $t('action.cancel') }}</a-button
                    >
                </a-popconfirm>
            </template> -->
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important;">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getWeeklyList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                :scroll="{ y: 450 }"
                style="table-layout:fixed;"
            >
                <a-table-column
                    :title="$t('columns.title')"
                    key="title"
                    width="12%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ filterUser(row.create_uid) }} 的周报
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.week_summary')"
                    key="week_summary"
                    width="20%"
                    align="center"
                >
                    <template slot-scope="row"
                        ><a :title="row.week_summary" @click="onView(row)">{{
                            row.week_summary.length > 60
                                ? row.week_summary.substr(0, 60) + '...'
                                : row.week_summary
                        }}</a></template
                    >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.next_week_plans')"
                    key="next_week_plans"
                    width="22%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.next_week_plans }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.addtional_content')"
                    key="addtional_content"
                    width="12%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.addtional_content }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.create_uid')"
                    key="create_uid"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ filterUser(row.create_uid) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.create_date')"
                    key="create_date"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.create_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.actions')"
                    key="action"
                    align="center"
                >
                    <template slot-scope="row">
                        <!-- <a-dropdown>
                            <a-menu slot="overlay"> -->
                        <a @click="onView(row)">
                            {{ $t('columns.detail') }}
                        </a>
                        <!-- <a-menu-item @click="editCase(row.case_id)">
                                    {{ $t('columns.edit') }}
                                </a-menu-item> -->
                        <!-- <a-popconfirm
                                    :title="$t('delete')"
                                    :okText="$t('action.ok')"
                                    :cancelText="$t('action.cancel')"
                                    placement="left"
                                    @confirm="onDelete(row)"
                                >
                                    <a-menu-item
                                        style="cursor:pointer;margin-left:12px;"
                                        class="btnDel"
                                        >{{ $t('action.delete') }}</a-menu-item
                                    >
                                </a-popconfirm> -->
                        <!-- </a-menu>
                            <a-button>
                                {{ $t('action.more') }}
                                <a-icon type="down" />
                            </a-button>
                        </a-dropdown> -->
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { UserService } from '~/services/user.service'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { CompanyService } from '~/services/company.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import { CaseService } from '../../services/case.service'
import { WorkweekService } from '../../services/workweek.service'
import WeeklyDetail from '../../components/schedule/weekly-detail.vue'
import moment from 'moment'

const userModule = namespace('userModule')
const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'weekly-manage'
})
@Component({
    components: { WeeklyDetail }
})
export default class WeeklyManage extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    private showSearch: any = true

    private showhideSearch(flag) {
        this.showSearch = flag
    }

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    private caseService = new CaseService()

    private workweekService = new WorkweekService()

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    // 表格数据源
    private data: any[] = []
    // 表格选择项
    private selectedRowKeys: any[] = []

    private stateList: any = ''

    private caseTypeList: any = ''

    private initialDate: any = []

    private moment = moment

    @userModule.State
    private id

    @userModule.State
    private username

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private get rules() {
        return {}
    }

    private onCreate() {
        this.$modal
            .open(
                WeeklyDetail,
                {
                    saveFlag: 0,
                    stateList: this.stateList,
                    caseTypeList: this.caseTypeList,
                    systemUsers: this.systemUsers,
                    loginUser: this.username,
                    loginUID: this.id
                },
                {
                    title: this.$t('action.create'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('save_success')
                this.$message.success(msg)
            })
    }

    public created() {
        this.getSystemuser()
        this.getStateDict()
    }

    private fillWeek() {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 168 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()

        this.initialDate = [startDate, endDate]
        values['create_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fillMonth() {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.getPreMonthDay(
                day.getFullYear() +
                    '-' +
                    (day.getMonth() + 1) +
                    '-' +
                    day.getDate()
            ),
            'YYYY-MM-DD HH:mm'
        )

        let values = this.dataForm.getValues()

        this.initialDate = [startDate, endDate]
        values['create_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private getPreMonthDay(date) {
        var arr = date.split('-')
        var year = arr[0] //当前年
        var month = arr[1] //当前月
        var day = arr[2] //当前日
        //验证日期格式为YYYY-MM-DD
        var reg = date.match(/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/)
        if (!reg || month > 12 || day > 31) {
            console.log('日期或格式有误！请输入正确的日期格式（年-月-日）')
            return
        }

        var pre_year = year //前一个月的年
        var pre_month: any = parseInt(month) - 1 //前一个月的月，以下几行是上月数值特殊处理
        if (pre_month === 0) {
            pre_year = parseInt(pre_year) - 1
            pre_month = 12
        }
        var pre_day: any = parseInt(day) //前一个月的日，以下几行是特殊处理前一个月总天数
        var pre_month_alldays = new Date(pre_year, pre_month, 0).getDate() //巧妙处理，返回某个月的总天数
        if (pre_day > pre_month_alldays) {
            pre_day = pre_month_alldays
        }
        if (pre_month < 10) {
            //补0
            pre_month = '0' + pre_month
        } else if (pre_day < 10) {
            //补0
            pre_day = '0' + pre_day
        }

        var pre_month_day = pre_year + '-' + pre_month + '-' + pre_day
        return pre_month_day
    }

    private formatDate(time) {
        // 空数据处理
        if (time === null || time === undefined || time === '') {
            return ''
        }

        let y = time.getFullYear()
        let m = time.getMonth() + 1
        let d = time.getDate()
        let h = time.getHours()
        let mi = time.getMinutes()
        let s = time.getSeconds()
        m = m < 10 ? `0${m}` : m
        d = d < 10 ? `0${d}` : d
        h = h < 10 ? `0${h}` : h
        mi = mi < 10 ? `0${mi}` : mi
        s = s < 10 ? `0${s}` : s
        return `${y}-${m}-${d} 23:59`
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

    /**
     * 获取订单数据
     */
    private getWeeklyList() {
        this.dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                user_id: 'like',
                ...formConfig.condition
            })

            var nowConditions: any[] = []
            for (var item of params.query_condition) {
                if (item.value.constructor == Array && item.operate !== 'in') {
                    if (
                        item.value.length == 2 &&
                        item.value[0].constructor.name == 'Moment'
                    ) {
                        let startDate: any = {}
                        for (let key in item.value[0]) {
                            startDate[key] = item.value[0][key]
                        }
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '>=',
                            value: new Date(startDate.utc())
                        })
                    }
                    if (
                        item.value.length == 2 &&
                        item.value[1].constructor.name == 'Moment'
                    ) {
                        let endDate: any = {}
                        for (let key in item.value[1]) {
                            endDate[key] = item.value[1][key]
                        }
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '<=',
                            value: new Date(endDate.utc())
                        })
                    }
                } else {
                    nowConditions.push(item)
                }
            }
            params.query_condition = nowConditions

            this.workweekService
                .query_all(
                    new RequestParams(params, {
                        page: this.pageService,
                        loading: this.loadingService
                    })
                )
                .subscribe(
                    data => {
                        this.data = data.map(x => {
                            x['next_week_plans'] = x.case_ids
                                .map(y => y.case_title)
                                .join(',')
                            return x
                        })
                        this.selectedRowKeys = []
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private onEdit(row) {
        router.push({
            name: 'seller-edit',
            params: { seller: row }
        })
    }

    private onDelete(row) {
        this.caseService
            .deleteCase(
                new RequestParams(
                    {
                        case_id: row.case_id
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('delete_success')
                    this.$message.success(msg)
                    this.getWeeklyList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onCancel(row) {
        this.caseService
            .changeCaseState(
                new RequestParams(
                    {
                        case_id: row.case_id,
                        state: 'cancel'
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getWeeklyList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onStatusChange(e) {}

    private filterUser(userID) {
        let ret = 'user'
        let user = this.systemUsers.find(x => x.code == userID)
        if (user) {
            ret = user.name.split('@')[0]
        }
        return ret
    }

    private onView(row) {
        this.workweekService
            .query_week_detail(
                new RequestParams(
                    {
                        week_id: row.id
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
                            WeeklyDetail,
                            {
                                weeklyInfo: data[0],
                                saveFlag: 1,
                                stateList: this.stateList,
                                caseTypeList: this.caseTypeList,
                                systemUsers: this.systemUsers,
                                loginUser: this.username,
                                loginUID: this.id
                            },
                            {
                                title: this.$t('week_detail'),
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

    private handleSearch(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private editCase(id) {
        // this.caseService
        //     .queryCaseDetail(
        //         new RequestParams(
        //             {
        //                 case_id: id
        //             },
        //             {
        //                 loading: this.loadingService
        //             }
        //         )
        //     )
        //     .subscribe(
        //         data => {
        //             this.$modal
        //                 .open(
        //                     ScheduleEdit,
        //                     {
        //                         saveFlag: 1,
        //                         stock: data[0],
        //                         stateList: this.stateList,
        //                         caseTypeList: this.caseTypeList,
        //                         systemUsers: this.systemUsers
        //                     },
        //                     {
        //                         title: this.$t('action.edit'),
        //                         width: '800px'
        //                     }
        //                 )
        //                 .subscribe(data => {
        //                     let msg: any = this.$t('save_success')
        //                     this.$message.success(msg)
        //                     this.getWeeklyList()
        //                 })
        //         },
        //         err => {
        //             this.$message.error(err.message)
        //         }
        //     )
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "week_detail": "Week Detail",
        "none": "None",
        "columns": {
            "actions": "Actions",
            "start_time": "Start Time",
            "create_uid": "Weekly Submitter",
            "week_summary": "Week Summary",
            "next_week_plans": "Next Week Plans",
            "create_date": "Create Date",
            "addtional_content": "Addtional Content",
            "title": "Title"
        },
        "action": {
            "create": "Create",
            "batch-create": "EXCEL Import",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "nearly_week": "Nearly a Week",
            "nearly_month": "Nearly a Month"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "cancel": "Are you sure cancel?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "week_detail": "周报详情",
        "none": "无",
        "columns": {
            "actions": "操作",
            "start_time": "开始时间",
            "create_uid": "周报提交人",
            "week_summary": "本周工作内容",
            "next_week_plans": "下周工作计划",
            "create_date": "创建时间",
            "addtional_content": "需协调与帮助",
            "title": "标题"
        },
        "action": {
            "create": "新建",
            "batch-create": "EXCEL导入",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "nearly_week": "近一周",
            "nearly_month": "近一月"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功"
    }
}
</i18n>
