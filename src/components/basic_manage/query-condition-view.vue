<template>
    <section class="component customer-detail">
        <a-tabs
            defaultActiveKey="base"
            v-model="activeKey"
            @change="e => paneChange(e)"
        >
            <a-tab-pane :tab="$t('query_condition_detail')" key="base">
                <data-table
                    :stripe="true"
                    :data="current"
                    rowKey="search_code"
                    @onClick="
                        record => {
                            this.selectedRowKeys = [record]
                            onTrClick(record)
                        }
                    "
                    style="table-layout:fixed;"
                    :scroll="{ y: 200 }"
                >
                    <a-table-column
                        :title="$t('action.action')"
                        key="action"
                        align="center"
                        width="6.5%"
                    >
                        <template slot-scope="row">
                            <a-menu slot="overlay">
                                <a-popconfirm
                                    :title="$t('action.delete')"
                                    :okText="$t('action.ok')"
                                    :cancelText="$t('action.cancel')"
                                    placement="left"
                                    @confirm="onDelete(row)"
                                >
                                    <a-button>{{
                                        $t('action.delete')
                                    }}</a-button>
                                </a-popconfirm>
                            </a-menu>
                        </template>
                    </a-table-column>
                    <!-- <a-table-column
                        :title="$t('columns.menu_code')"
                        key="menu_code"
                        width="6.5%"
                        align="left"
                    >
                        <template slot-scope="row">{{ row.menu_code }}</template>
                    </a-table-column> -->
                    <a-table-column
                        :title="$t('columns.search_type')"
                        data-index="search_type"
                        key="search_type"
                        width="6.5%"
                        align="center"
                    >
                        <template slot-scope="search_type">
                            <span>
                                {{
                                    search_type | dict('SearchType') | translate
                                }}
                            </span>
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.user_id')"
                        key="week_0_sales"
                        width="6.5%"
                        align="center"
                    >
                        <template slot-scope="row">{{ row.user_id }}</template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.is_share')"
                        key="is_share"
                        data-index="is_share"
                        width="6.5%"
                        align="center"
                    >
                        <template slot-scope="is_share">
                            <span v-if="is_share">
                                <input type="checkbox" checked disabled />
                            </span>
                            <span v-else>
                                <input type="checkbox" disabled />
                            </span>
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.default_search')"
                        key="default_search"
                        data-index="default_search"
                        width="6.5%"
                        align="left"
                    >
                        <template slot-scope="default_search">
                            <span v-if="default_search">
                                <input type="checkbox" checked disabled />
                            </span>
                            <span v-else>
                                <input type="checkbox" disabled />
                            </span>
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.search_name')"
                        data-index="search_name"
                        key="search_name"
                        width="6.5%"
                        align="left"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.search_display_name')"
                        data-index="search_display_name"
                        key="search_display_name"
                        width="6.5%"
                        align="left"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.query_condition')"
                        key="query_condition"
                        width="15.5%"
                        align="left"
                    >
                        <template slot-scope="row">{{
                            row.query_condition
                        }}</template>
                    </a-table-column>

                    <a-table-column
                        :title="$t('columns.sort_order')"
                        data-index="sort_order"
                        key="sort_order"
                        width="6.5%"
                        align="right"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.memo')"
                        data-index="memo"
                        key="memo"
                        width="6.5%"
                        align="left"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.search_code')"
                        key="search_code"
                        width="6.5%"
                        align="left"
                    >
                        <template slot-scope="row">{{
                            row.search_code
                        }}</template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.write_uid')"
                        data-index="write_uid"
                        key="write_uid"
                        width="6.5%"
                        align="center"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.write_date')"
                        data-index="write_date"
                        key="write_date"
                        width="6.5%"
                        align="center"
                    ></a-table-column>
                </data-table>
            </a-tab-pane>

            <a-tab-pane :tab="$t('logs')" key="log">
                <a-table
                    :dataSource="logs"
                    style="table-layout:fixed;"
                    rowKey="log_content"
                    bordered
                >
                    <a-table-column
                        :title="$t('columns.log_content')"
                        key="log_content"
                        data-index="log_content"
                        align="left"
                        width="40%"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.log_type')"
                        key="log_type"
                        data-index="log_type"
                        align="center"
                        width="15%"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.who_log')"
                        key="who_log"
                        data-index="who_log"
                        align="center"
                        width="15%"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.log_date')"
                        key="log_date"
                        data-index="log_date"
                        align="center"
                        width="20%"
                    ></a-table-column>
                    <a-table-column
                        title="IP"
                        key="log_ip"
                        data-index="log_ip"
                        align="center"
                    ></a-table-column>
                </a-table>
            </a-tab-pane>
        </a-tabs>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { PageService } from '~/bootstrap/services/page.service'
import { SystemService } from '~/services/system.service'
import { OperateLogService } from '../../services/operatelog.service'
import { RequestParams } from '../../core/http'
import { LoadingService } from '../../bootstrap/services/loading.service'
import moment from 'moment'
@Component({
    components: {}
})
export default class QueryConditionView extends Vue {
    @Prop()
    current: any
    @Prop()
    systemUsers: any

    private activeKey: any = 'base'

    // 分页服务
    private pageService = new PageService()

    private operateLogService = new OperateLogService()

    private loadingService = new LoadingService()

    private logs: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private selectedRows: any[] = []

    private systemService = new SystemService()

    @Watch('current')
    onCurrentChange() {
        this.logs = []
        if (this.activeKey == 'log') {
            this.getLogs()
        }
    }

    private paneChange(key) {
        if (key === 'log' && !this.logs.length) {
            this.getLogs()
        }
    }

    private getLogs() {
        this.operateLogService
            .viewUserOperateChangedLog(
                new RequestParams(
                    {
                        object_name: 'system_menu_search_settings',
                        record_code: this.current[0].menu_code
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(data => {
                for (var item of data) {
                    var sysuser = this.systemUsers.find(
                        x => x.code === item.who_log
                    )
                    item['who_log'] = sysuser ? sysuser.name : item.who_log
                    let localTime = moment.utc(item['log_date']).toDate()
                    item['log_date'] = moment(localTime).format(
                        'YYYY-MM-DD HH:mm'
                    )
                }
                this.logs = data
            })
    }

    private onDelete(row) {
        this.systemService
            .DeleteOneSearchCondition(
                new RequestParams(
                    {
                        search_code: row.search_code
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                () => {
                    this.getQueryConditionDetail()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getQueryConditionDetail() {
        this.systemService
            .querySearchConditionByMenuCode(
                new RequestParams({
                    menu_code: this.current[0].menu_code
                })
            )
            .subscribe(data => {
                this.current = data
            })
    }
}
</script>

<i18n>
{
  "en-us": {
    "desc": "",
    "columns":{
       "search_code": "search_code",
       "menu_code": "menu_code",
       "search_type":"search_type",
       "user_id":"user",
       "is_share":"is_share",
       "default_search":"default_search",
       "search_name":"search_name",
       "search_display_name":"search_display_name",
       "query_condition":"query_condition",
       "log_content":"log_content",
       "log_type":"log_type",
       "who_log":"who_log",
       "log_date":"log_date",
       "sort_order":"sort_order",
       "memo":"memo"
    },
    "action":{
        "delete":"Delete",
        "ok":"Ok",
        "cancel":"Cancel"
    },
    "rules":{

    },
    "query_condition_detail":"query_condition_detail",
    "logs":"logs"
  },
  "zh-cn": {
    "desc": "",
    "columns":{
       "search_code": "查询编码",
       "menu_code": "菜单编码",
       "search_type":"查询类型",
       "user_id":"用户",
       "is_share":"共享",
       "default_search":"默认查询",
       "search_name":"查询名称",
       "search_display_name":"查询显示名",
       "query_condition":"查询条件",
       "log_content":"日志",
       "log_type":"类型",
       "who_log":"操作人",
       "log_date":"日期",
       "sort_order":"排序",
       "memo":"备注"
    },
    "action":{
        "delete":"删除",
        "ok":"确定",
        "cancel":"取消"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "query_condition_detail":"查询条件",
    "logs":"操作日志"
  }
}
</i18n>
