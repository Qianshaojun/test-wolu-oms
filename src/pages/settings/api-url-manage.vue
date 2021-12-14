<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form
            :extends="extendItems"
            ref="dataForm"
            @submit="getApiList"
            :column="2"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item label="子系统">
                    <a-select
                        v-decorator="[
                            'sub_system_code',
                            {
                                initialValue: ''
                            },
                            {
                                rules: rules.required
                            }
                        ]"
                        size="small"
                        style="width: 200px;"
                        @change="e => onSystemChange(e)"
                    >
                        <a-select-option value="">
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.sub_system_code"
                            v-for="item of subSystemList"
                            :key="item.sub_system_code"
                        >
                            {{ $t(item.sub_system_name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.api_name')"
                    style="height:35px;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['api_name']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item label="模块">
                    <a-select
                        v-decorator="['model_code', { initialValue: '' }]"
                        size="small"
                        style="width: 200px;"
                        @change="e => onModelChange(e)"
                    >
                        <a-select-option value="">
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.model_code"
                            v-for="item of modelList"
                            :key="item.model_code"
                        >
                            {{ $t(item.model_name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.api_address')"
                    style="height:35px;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['api_address']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item label="子模块">
                    <a-select
                        v-decorator="['sub_model_code', { initialValue: '' }]"
                        size="small"
                        style="width: 200px;"
                    >
                        <a-select-option value="">
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.sub_model_code"
                            v-for="item of subModelList"
                            :key="item.sub_model_code"
                        >
                            {{ $t(item.sub_model_name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <!--折叠显示项-->
            <!-- <template #collapse>
            </template> -->
            <template #action>
                <a-button type="primary" @click="onCreate()"
                    >{{ $t('action.create') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="onBatchStop(1)"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('actions.active') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="onBatchStop(0)"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('actions.stop') }}
                </a-button>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex">
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
                style="table-layout:fixed;"
                :scroll="{ x: '120%', y: 500 }"
            >
                <a-table-column
                    title="ID"
                    key="id"
                    dataIndex="id"
                    width="5%"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.api_name')"
                    key="api_name"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a @click="onTrClick(row.id)">{{ row.api_name }}</a>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.api_address')"
                    dataIndex="api_address"
                    key="api_address"
                    width="15%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.interface_full_name')"
                    dataIndex="interface_full_name"
                    key="interface_full_name"
                    width="20%"
                    align="center"
                >
                    <template slot-scope="interface_full_name">
                        <span :title="interface_full_name">
                            {{
                                interface_full_name
                                    ? interface_full_name.length > 17
                                        ? interface_full_name.substr(0, 17) +
                                          '...'
                                        : interface_full_name
                                    : ''
                            }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.use_common_function')"
                    dataIndex="use_common_function"
                    key="use_common_function"
                    width="6%"
                    align="center"
                >
                    <template slot-scope="use_common_function">
                        <span v-if="use_common_function"
                            ><input type="checkbox" checked disabled
                        /></span>
                        <span v-else><input type="checkbox" disabled/></span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.use_sql_text')"
                    dataIndex="use_sql_text"
                    key="use_sql_text"
                    width="6%"
                    align="center"
                >
                    <template slot-scope="use_sql_text">
                        <span v-if="use_sql_text"
                            ><input type="checkbox" checked disabled
                        /></span>
                        <span v-else><input type="checkbox" disabled/></span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.sql_text')"
                    dataIndex="sql_text"
                    key="sql_text"
                    width="10%"
                    align="left"
                >
                    <template slot-scope="sql_text">
                        <span :title="sql_text">
                            {{
                                sql_text
                                    ? sql_text.length > 17
                                        ? sql_text.substr(0, 17) + '...'
                                        : sql_text
                                    : ''
                            }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.table_name')"
                    dataIndex="table_name"
                    key="table_name"
                    width="10%"
                    align="left"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.single_log_table')"
                    dataIndex="single_log_table"
                    key="single_log_table"
                    width="6%"
                    align="center"
                >
                    <template slot-scope="single_log_table">
                        <span v-if="single_log_table"
                            ><input type="checkbox" checked disabled
                        /></span>
                        <span v-else><input type="checkbox" disabled/></span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.log_table_name')"
                    dataIndex="log_table_name"
                    key="log_table_name"
                    width="10%"
                    align="left"
                ></a-table-column>
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
                    :title="$t('columns.sub_system_code')"
                    key="sub_system_code"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.sub_system_code[1] }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.model_code')"
                    key="model_code"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.model_code[1] }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.sub_model_code')"
                    key="sub_model_code"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.sub_model_code[1] }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.write_date')"
                    key="write_date"
                    width="10%"
                    align="center"
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
                >
                    <template slot-scope="row">
                        {{ row.write_uid[1] }}
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
                                <a-menu-item @click="onEdit(row)"
                                    >{{ $t('actions.edit') }}
                                </a-menu-item>
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
                                {{ $t('actions.more') }}
                                <a-icon type="down" />
                            </a-button>
                        </a-dropdown>
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
        <a-drawer
            :title="$t('actions.edit_lines')"
            placement="bottom"
            width="100%"
            :height="600"
            :visible="drawerVisible"
            :body-style="{
                padding: '10px 30px 30px 30px',
                overflow: 'hidden'
            }"
            :closable="true"
            :maskClosable="false"
            @close="onClose"
        >
            <EditLines :info="editLines" :apiID="apiID" />
        </a-drawer>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { SystemService } from '~/services/system.service'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import ApiUrlEdit from '~/components/setting/api-url-edit.vue'
import EditLines from '~/components/setting/edit-lines.vue'
import { formConfig } from '../../config/form.config'
import { namespace } from 'vuex-class'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'api-url-manage'
})
@Component({
    components: {
        ApiUrlEdit,
        EditLines
    }
})
export default class ApiUrlManage extends Vue {
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

    private editLines: any = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private subSystemList: any[] = []

    private subModelList: any = []

    private modelList: any = []

    private defaultSubSystemCode: any = ''

    private defaultModuleCode: any = ''

    private defaultSubModuleCode: any = ''

    private apiID: any = 0

    // 详情项
    private drawerVisible: any = false

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

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
                ApiUrlEdit,
                {
                    saveFlag: 0,
                    interfaceData: {}
                },
                {
                    title: '新增Api'
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
                this.systemService
                    .query_all_system_api(
                        new RequestParams(
                            CommonService.createQueryCondition(values, {
                                api_name: 'like',
                                api_address: 'like',
                                ...formConfig.condition
                            }),
                            {
                                page: this.pageService,
                                loading: this.loadingService
                            }
                        )
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
                ApiUrlEdit,
                {
                    saveFlag: 1,
                    interfaceData: row
                },
                {
                    title: '编辑Api'
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
            .active_system_api(
                new RequestParams(
                    {
                        api_id_list: [row.id],
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
            .active_system_api(
                new RequestParams(
                    {
                        api_id_list: this.selectedRowKeys,
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
                        this.defaultSubSystemCode = data[0].sub_system_code
                        this.getModuleList()
                    }
                },
                () => {
                    this.$message.error('子系统获取失败')
                }
            )
    }

    private getModuleList() {
        this.systemService
            .queryAllSystemModule(
                new RequestParams({
                    sub_system_code: this.defaultSubSystemCode
                })
            )
            .subscribe(
                data => {
                    this.modelList = data.filter(x => x.status === 20)
                    if (data.length) {
                        this.defaultModuleCode = data[0].model_code
                        this.getSubModule()
                    }
                },
                () => {
                    this.$message.error('模块获取失败')
                }
            )
    }

    private getSubModule() {
        this.subModelList = []
        this.systemService
            .queryAllSubSystemModule(
                new RequestParams({ model_code: this.defaultModuleCode })
            )
            .subscribe(
                data => {
                    this.subModelList = data.filter(x => x.status === 20)
                    if (data.length) {
                        this.defaultSubModuleCode = data[0].sub_model_code
                    }
                },
                () => {
                    this.$message.error('子模块获取失败')
                }
            )
    }

    private onSystemChange(e) {
        this.defaultSubSystemCode = e
        if (e !== '') {
            this.getModuleList()
        }
    }

    private onModelChange(e) {
        this.defaultModuleCode = e
        if (e !== '') {
            this.getSubModule()
        }
    }

    private onTrClick(row) {
        //apiID
        this.innerAction.setActionAPI(
            'system_management/query_api_column_info',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    { api_id: row },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.query_success')
                    this.editLines = data
                    this.apiID = row
                    this.drawerVisible = true
                },
                err => {
                    this.$message.error(err.message)
                }
            )

        //
    }

    private onClose() {
        this.drawerVisible = false
    }
}
</script>

<i18n>
{
    "en-us": {
        "columns": {
            "api_name": "Api Name",
            "api_address": "Api Address",
            "active": "Active",
            "sub_system_code": "Sub System",
            "model_code": "Model",
            "sub_model_code": "Sub Model",
            "write_date": "Write Date",
            "write_uid": "Write User",
            "interface_full_name": "Interface Full Name",
            "use_common_function": "Use Common function",
            "use_sql_text": "Use sql text",
            "sql_text": "Sql text",
            "table_name": "Table name",
            "single_log_table": "Single log table",
            "log_table_name": "Log table name"
        },
        "actions": {
            "edit": "Edit",
            "active": "Active",
            "stop": "Stop",
            "more": "more",
            "edit_api": "Edit Api",
            "add_api": "Add Api",
            "edit_lines": "Edit Columns"
        }
    },
    "zh-cn": {
        "columns": {
            "api_name": "Api名称",
            "api_address": "Api地址",
            "active": "激活",
            "sub_system_code": "子系统",
            "model_code": "模块",
            "sub_model_code": "子模块",
            "write_date": "创建时间",
            "write_uid": "创建者",
            "interface_full_name": "接口全名",
            "use_common_function": "使用通用方法",
            "use_sql_text": "使用自定义脚本",
            "sql_text": "自定义脚本",
            "table_name": "表名",
            "single_log_table": "单独日志表",
            "log_table_name": "日志表"
        },
        "actions": {
            "edit": "编辑",
            "active": "激活",
            "stop": "停用",
            "more": "更多操作",
            "edit_api": "编辑Api",
            "add_api": "新增Api",
            "edit_lines": "编辑显示列"
        }
    }
}
</i18n>
