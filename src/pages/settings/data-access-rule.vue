<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form
            :extends="extendItems"
            ref="dataForm"
            @submit="getApiList"
            :column="1"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.access_rule_name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['access_rule_name']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <!-- <a-form-item label="员工编号" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['employee_id']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item> -->
            </template>
            <!--折叠显示项-->
            <!-- <template #collapse>
            </template> -->
            <template #action>
                <a-button type="primary" @click="onCreate()">{{
                    $t('action.create')
                }}</a-button>
                <a-button
                    type="primary"
                    @click="onBatchStop(1)"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('actions.active') }}</a-button
                >
                <a-button
                    type="primary"
                    @click="onBatchStop(0)"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('actions.stop') }}</a-button
                >
            </template>
        </data-form>
        <a-card class="margin-y">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getApiList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                @change="onTableChange"
                style="table-layout:fixed;"
            >
                <a-table-column
                    title="ID"
                    key="id"
                    dataIndex="id"
                    width="6%"
                    align="center"
                    :sorter="true"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.access_rule_name')"
                    key="access_rule_name"
                    width="12%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.access_rule_name }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.access_rule_type')"
                    dataIndex="access_rule_type"
                    key="access_rule_type"
                    width="8%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.access_condition')"
                    dataIndex="access_condition"
                    key="access_condition"
                    width="30%"
                    align="center"
                >
                    <template slot-scope="text">
                        <span :title="text">
                            {{ text.substr(0, 60) }}
                            {{ text.length > 57 ? '...' : '' }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.active')"
                    dataIndex="active"
                    key="active"
                    width="6%"
                    align="center"
                >
                    <template slot-scope="active">
                        <span v-if="active"
                            ><input type="checkbox" checked disabled
                        /></span>
                        <span v-else><input type="checkbox" disabled/></span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.priority')"
                    dataIndex="priority"
                    key="priority"
                    width="8%"
                    align="center"
                    :sorter="true"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.table_name')"
                    dataIndex="table_name"
                    key="table_name"
                    width="12%"
                    align="center"
                    :sorter="true"
                >
                    <template slot-scope="text">
                        <span :title="text">
                            {{ text.substr(0, 40) }}
                            {{ text.length > 37 ? '...' : '' }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.write_date')"
                    key="write_date"
                    width="10%"
                    align="center"
                    :sorter="true"
                >
                    <template slot-scope="row">
                        {{ row.write_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.write_uid')"
                    key="write_uid"
                    width="10%"
                    align="center"
                    :sorter="true"
                >
                    <template slot-scope="row">
                        {{ row.write_uid | dict2(systemUsers) }}
                    </template>
                </a-table-column>
                <a-table-column
                    title="操作"
                    key="action"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-dropdown>
                            <a-menu slot="overlay">
                                <a-menu-item @click="onEdit(row)">{{
                                    $t('actions.edit')
                                }}</a-menu-item>
                                <a-menu-item @click="onActive(row)">
                                    <span v-if="row.active">{{
                                        $t('actions.stop')
                                    }}</span>
                                    <span v-else>{{
                                        $t('actions.active')
                                    }}</span>
                                </a-menu-item>
                            </a-menu>
                            <a-button>
                                {{ $t('actions.more') }} <a-icon type="down" />
                            </a-button>
                        </a-dropdown>
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
        <a-card class="margin-y" v-if="current">
            <CustomerDetail :customer="current"></CustomerDetail>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { WareHouseService } from '~/services/warehouse.service'
import { SystemService } from '~/services/system.service'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import DataAccessRuleEdit from '~/components/setting/data-access-rule-edit.vue'
import { formConfig } from '../../config/form.config'
import { namespace } from 'vuex-class'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'data-access-rule'
})
@Component({
    components: {
        DataAccessRuleEdit
    }
})
export default class DataAccessRule extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    // 订单服务
    private systemService = new SystemService()
    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    // 表格数据源
    private data: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private subSystemList: any = []

    private modelList: any = []

    private orderBy: any = 'id desc'

    // 详情项
    private current = null

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private created() {
        this.getSubSystemList()
        this.getSystemuser()
    }

    private onCreate() {
        this.$modal
            .open(
                DataAccessRuleEdit,
                {
                    saveFlag: 0
                },
                {
                    title: this.$t('actions.add_data_access_rule'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getApiList()
            })
    }

    /**
     * 获取订单数据
     */
    private getApiList() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                let params: any = CommonService.createQueryCondition(values, {
                    access_rule_name: 'like',
                    ...formConfig.condition
                })
                if (this.orderBy) {
                    params['order_by'] = this.orderBy
                }
                this.systemService
                    .query_all_data_access_rule(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService
                        })
                    )
                    .subscribe(data => {
                        this.data = data
                        this.selectedRowKeys = []
                    })
            })
            .catch(err => {
                // 异常处理
            })
    }

    /**
     * 编辑
     */
    private onEdit(row) {
        this.$modal
            .open(
                DataAccessRuleEdit,
                {
                    saveFlag: 1,
                    warehouse: row
                },
                {
                    title: this.$t('actions.edit_data_access_rule'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.$message.success('更新成功')
                this.getApiList()
            })
    }
    /**
     * 删除订单操作
     */
    private onDelete(id) {}

    private onStatusChange(e) {
        this.$nextTick(function() {
            this.getApiList()
        })
    }

    private onActive(row) {
        this.systemService
            .active_data_access_rule(
                new RequestParams(
                    {
                        rule_id_list: [row.id],
                        active: row.active ? 0 : 1
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getApiList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onBatchStop(state) {
        this.systemService
            .active_data_access_rule(
                new RequestParams(
                    {
                        rule_id_list: this.selectedRowKeys,
                        active: state
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getApiList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getSubSystemList() {
        this.systemService
            .queryAllSubSystem(
                new RequestParams(
                    CommonService.createQueryCondition(
                        { status: 20 },
                        {
                            ...formConfig.condition
                        }
                    ),
                    {
                        page: this.pageService
                    }
                )
            )
            .subscribe(
                data => {
                    this.subSystemList = data.filter(x => x.status === 20)
                    if (data.length) {
                        this.getModuleList(data[1].sub_system_code)
                    }
                },
                () => {
                    this.$message.error('子系统获取失败')
                }
            )
    }

    private getsubSystemName(code) {
        let name = ''
        let item = this.subSystemList.find(x => x.sub_system_code === code)
        if (item) {
            name = item.sub_system_name
        }

        return name
    }

    private getModuleName(moduleCode) {
        let name = ''
        let item = this.modelList.find(x => x.model_code === moduleCode)
        if (item) {
            name = item.model_name
        }
        return name
    }

    private getModuleList(subSystemCode) {
        if (this.modelList.length == 0) {
            this.systemService
                .queryAllSystemModule(
                    new RequestParams({
                        sub_system_code: subSystemCode
                    })
                )
                .subscribe(
                    data => {
                        this.modelList = data
                    },
                    () => {
                        this.$message.error('模块获取失败')
                    }
                )
        }
    }

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getApiList()
    }
}
</script>

<i18n>
{
  "en-us": {
    "columns": {
        "access_rule_name": "Access Rule Name",
        "access_rule_type": "Access Rule Type",
        "active": "Active",
        "access_condition": "Access Condition",
        "table_name": "Table Name",
        "sub_model_code": "Sub Model",
        "write_date": "Write Date",
        "write_uid": "Write User",
        "priority": "Priority"
    },
    "actions": {
        "edit": "Edit",
        "active": "Active",
        "stop": "Stop",
        "more": "more",
        "edit_data_access_rule": "Edit Data Access Rule",
        "add_data_access_rule": "Add Data Access Rule"
    }
  },
  "zh-cn": {
    "columns": {
        "access_rule_name": "规则名称",
        "access_rule_type": "规则类型",
        "active": "激活",
        "access_condition": "规则内容",
        "table_name": "数据表名",
        "sub_model_code": "子模块",
        "write_date": "修改时间",
        "write_uid": "修改人",
        "priority": "优先级"
    },
    "actions": {
        "edit": "编辑",
        "active": "激活",
        "stop": "停用",
        "more": "更多操作",
        "edit_data_access_rule": "编辑行数据访问规则",
        "add_data_access_rule": "新增行数据访问规则"
    }
  }
}
</i18n>
