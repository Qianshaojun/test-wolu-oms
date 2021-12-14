<template>
    <page-container ref="pageContainer" @changeSearchState="showhideSearch">
        <template #header-action>
            <a-button type="primary" @click="onCreate"
                >{{ $t('action.create') }}
            </a-button>
            <!-- <a-button type="primary" @click="onBatchUpload">{{
                $t('action.batch-create')
            }}</a-button>-->
        </template>
        <data-form
            :extends="extendItems"
            ref="dataForm"
            @submit="getCaseList"
            :column="1"
            :showSearch="showSearch"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.state')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['state', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onStatusChange(e)"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.code"
                            v-for="item of stateList"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.case_type')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['case_type', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onStatusChange(e)"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.code"
                            v-for="item of caseTypeList"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['case_title']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.user_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        show-search
                        v-decorator="['user_id']"
                        :style="{ width: '200px' }"
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
                    :label="$t('columns.executive_officer')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        show-search
                        v-decorator="['responsible_user_id']"
                        :style="{ width: '200px' }"
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
                <!-- <a-form-item
                    :label="$t('columns.participant')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        show-search
                        v-decorator="['related_user_ids']"
                        :style="{ width: '200px' }"
                        size="small"
                    >
                        <a-select-option
                            :value="item.code"
                            v-for="item of systemUsers"
                            :key="item.code"
                            >{{ $t(item.name) }}</a-select-option
                        >
                    </a-select>
                </a-form-item> -->
            </template>
            <!--操作行为项-->
            <template #action>
                <a-popconfirm
                    :title="$t('cancel')"
                    :okText="$t('action.ok')"
                    :cancelText="$t('action.cancel')"
                    placement="left"
                    @confirm="onBatchDelete()"
                    :disabled="!selectedRowKeys.length"
                >
                    <a-button type="primary" :disabled="!selectedRowKeys.length"
                        >{{ $t('action.cancel') }}
                    </a-button>
                </a-popconfirm>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important;">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="case_id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getCaseList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                :scroll="{ y: 450 }"
                style="table-layout:fixed;"
            >
                <a-table-column
                    :title="$t('columns.name')"
                    key="case_title"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.case_title }}</template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.description')"
                    key="description"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        ><span :title="row.description">{{
                            row.description.length > 20
                                ? row.description.substr(0, 20) + '...'
                                : row.description
                        }}</span></template
                    >
                </a-table-column>

                <a-table-column
                    :title="$t('columns.user_id')"
                    key="user_id"
                    width="7%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ filterUser(row.user_id) }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.executive_officer')"
                    key="responsible_user_id"
                    width="7%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ filterUser(row.responsible_user_id) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.participant')"
                    key="seller_id"
                    width="12%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{
                            row.related_user_ids
                                .map(x => filterUser(x))
                                .join(',')
                        }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.state')"
                    data-index="state"
                    key="state"
                    align="center"
                    width="6%"
                >
                    <template slot-scope="state">
                        {{ state | dict2(stateList) }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.case_type')"
                    key="case_type"
                    width="6%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.case_type | dict2(caseTypeList) }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.start_time')"
                    key="start_time"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.start_time | datetolocal }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.finish_before')"
                    key="finish_before"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.finish_before | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.finish_time')"
                    key="finish_time"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.finish_time | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.end_time')"
                    key="end_time"
                    width="8%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.end_time | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.actions')"
                    key="action"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-dropdown>
                            <a-menu slot="overlay">
                                <a-menu-item @click="onView(row)">
                                    {{ $t('columns.detail') }}
                                </a-menu-item>
                                <a-menu-item @click="editCase(row.case_id)">
                                    {{ $t('columns.edit') }}
                                </a-menu-item>
                                <a-popconfirm
                                    :title="$t('cancel')"
                                    :okText="$t('action.ok')"
                                    :cancelText="$t('action.cancel')"
                                    placement="left"
                                    @confirm="onCancel(row)"
                                >
                                    <a-menu-item
                                        style="cursor:pointer;margin-left:12px;"
                                        class="btnDel"
                                        >{{ $t('action.cancel') }}
                                    </a-menu-item>
                                </a-popconfirm>
                                <a-popconfirm
                                    :title="$t('delete')"
                                    :okText="$t('action.ok')"
                                    :cancelText="$t('action.cancel')"
                                    placement="left"
                                    @confirm="onDelete(row)"
                                >
                                    <a-menu-item
                                        style="cursor:pointer;margin-left:12px;"
                                        class="btnDel"
                                        >{{ $t('action.delete') }}
                                    </a-menu-item>
                                </a-popconfirm>
                            </a-menu>
                            <a-button>
                                {{ $t('action.more') }}
                                <a-icon type="down" />
                            </a-button>
                        </a-dropdown>
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
import ScheduleDetail from '../../components/schedule/schedule-detail.vue'
import ScheduleEdit from '@/components/schedule/schedule-edit.vue'

const userModule = namespace('userModule')
const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'schedule-list'
})
@Component({
    components: { ScheduleDetail }
})
export default class ScheduleList extends Vue {
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

    public created() {
        this.getSystemuser()
        this.getStateDict()
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
    private getCaseList() {
        this.dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                name: 'like',
                ...formConfig.condition
            })

            this.caseService
                .queryAll(
                    new RequestParams(params, {
                        page: this.pageService,
                        loading: this.loadingService
                    })
                )
                .subscribe(
                    data => {
                        this.data = data
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
                    this.getCaseList()
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
                    this.getCaseList()
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
        this.caseService
            .queryCaseDetail(
                new RequestParams(
                    {
                        case_id: row.case_id
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
                                title: this.$t('cese_detail'),
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
                                systemUsers: this.systemUsers
                            },
                            {
                                title: this.$t('action.edit'),
                                width: '800px'
                            }
                        )
                        .subscribe(data => {
                            let msg: any = this.$t('save_success')
                            this.$message.success(msg)
                            this.getCaseList()
                        })
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "case_detail": "Case Detail",
        "none": "None",
        "columns": {
            "actions": "Actions",
            "start_time": "Start Time",
            "finish_before": "Finish Before",
            "finish_time": "Finish Time",
            "end_time": "End Time",
            "name": "Title",
            "user_id": "Request Submitter",
            "executive_officer": "Executive Officer",
            "participant": "Participant",
            "description": "Description",
            "state": "State",
            "case_type": "Case Type"
        },
        "action": {
            "create": "Create",
            "batch-create": "EXCEL Import",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "copy": "Copy",
            "pass": "Check",
            "onApiEdit": "Api Edit"
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
        "case_detail": "日程详情",
        "none": "无",
        "columns": {
            "actions": "操作",
            "start_time": "开始时间",
            "finish_before": "期望完成时间",
            "finish_time": "完成时间",
            "end_time": "结束时间",
            "name": "标题",
            "user_id": "需求提交人",
            "executive_officer": "执行负责人",

            "participant": "参与者",
            "description": "描述",
            "state": "状态",
            "case_type": "类型"
        },
        "action": {
            "create": "新建",
            "batch-create": "EXCEL导入",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "copy": "复制",
            "pass": "审核",
            "onApiEdit": "api接口管理"
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
