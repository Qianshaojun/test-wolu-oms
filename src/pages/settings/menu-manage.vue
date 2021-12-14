<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form
            :extends="extendItems"
            ref="dataForm"
            @submit="getCustomerList"
            :column="3"
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
                <a-form-item label="菜单名称" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['menu_name']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item label="英文名称" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['menu_name_eng']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item label="菜单URL" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['menu_url']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item label="是否显示" style="height:35px;margin:0;">
                    <a-radio-group
                        v-decorator="['navigate_menu', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true">
                            {{ $t('yes') }}
                        </a-radio-button>
                        <a-radio-button :value="false">
                            {{ $t('no') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </template>
            <template #action>
                <a-button type="primary" @click="onCreateUser()" v-auth="'new'">
                    {{ $t('actions.new') }}
                </a-button>
                <a-popconfirm
                    title="确定要删除吗？"
                    okText="确定"
                    cancelText="取消"
                    placement="top"
                    @confirm="onBatchDelete()"
                    :disabled="!selectedRowKeys.length"
                >
                    <a-button
                        type="primary"
                        :disabled="!selectedRowKeys.length"
                    >
                        {{ $t('actions.delete') }}
                    </a-button>
                </a-popconfirm>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="menu_code"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getCustomerList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                style="table-layout:fixed;"
            >
                <a-table-column
                    title="菜单名称"
                    key="menu_name"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a @click="editUrls(row)">{{ row.menu_name }}</a>
                    </template>
                </a-table-column>
                <a-table-column
                    title="英文名称"
                    dataIndex="menu_name_eng"
                    key="menu_name_eng"
                    width="12%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    title="URL"
                    dataIndex="menu_url"
                    key="menu_url"
                    width="14%"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    title="子系统"
                    key="sub_system_code"
                    width="12%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.sub_system_name }}
                    </template>
                </a-table-column>
                <a-table-column
                    title="模块"
                    key="model_code"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.model_name }}
                    </template>
                </a-table-column>
                <a-table-column
                    title="子模块"
                    key="sub_model_code"
                    width="12%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.sub_model_name }}
                    </template>
                </a-table-column>
                <a-table-column
                    title="API"
                    key="api_id"
                    width="12%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.api_id | dict2(apiList) }}
                    </template>
                </a-table-column>
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
                    :title="$t('columns.query_name_list')"
                    dataIndex="query_name_list"
                    key="query_name_list"
                    width="20%"
                    align="center"
                >
                    <template slot-scope="query_name_list">
                        <span :title="query_name_list">
                            {{
                                query_name_list
                                    ? query_name_list.length > 23
                                        ? query_name_list.substr(0, 20) + '...'
                                        : query_name_list
                                    : ''
                            }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    title="是否显示"
                    key="navigate_menu"
                    width="6%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-checkbox :checked="row.navigate_menu" disabled />
                    </template>
                </a-table-column>
                <a-table-column
                    title="功能描述"
                    dataIndex="menu_description"
                    key="menu_description"
                    width="10%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    title="备注"
                    dataIndex="memo"
                    key="memo"
                    width="10%"
                    align="center"
                ></a-table-column>
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
                                    >编辑
                                </a-menu-item>
                                <a-menu-item @click="editButton(row)"
                                    >{{ $t('button') }}
                                </a-menu-item>
                                <a-popconfirm
                                    :title="$t('delete')"
                                    :okText="$t('actions.ok')"
                                    :cancelText="$t('actions.cancel')"
                                    placement="left"
                                    @confirm="onDelete(row)"
                                >
                                    <a-menu-item
                                        style="cursor:pointer;margin-left:12px;"
                                        class="btnDel"
                                        >删除
                                    </a-menu-item>
                                </a-popconfirm>
                            </a-menu>
                            <a-button>
                                更多操作
                                <a-icon type="down" />
                            </a-button>
                        </a-dropdown>
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
        <a-drawer
            :title="$t('edit_api')"
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
            <MenuApiEdit
                :info="[]"
                :menuID="currentMenuID"
                :apiList="apiList"
                :systemUsers="systemUsers"
                :cnt="cnt"
            />
        </a-drawer>
        <a-drawer
            :title="$t('edit_button')"
            placement="bottom"
            width="100%"
            :height="600"
            :visible="buttonDrawerVisible"
            :body-style="{
                padding: '10px 30px 30px 30px',
                overflow: 'hidden'
            }"
            :closable="true"
            :maskClosable="false"
            @close="buttonDrawerVisible = false"
        >
            <MenuButtonEdit :menuID="currentMenuID" :cnt="cnt"></MenuButtonEdit>
        </a-drawer>
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
import MenuEdit from '~/components/setting/menu-edit.vue'
import MenuApiEdit from '~/components/setting/menu-api-edit.vue'
import MenuButtonEdit from '~/components/setting/menu-button-edit.vue'
import { formConfig } from '../../config/form.config'
import { InnerActionService } from '../../bootstrap/services/inner.action.service'
import { PublicService } from '../../services/public.service'
import { namespace } from 'vuex-class'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'menu-manage'
})
@Component({
    components: {
        MenuEdit,
        MenuApiEdit,
        MenuButtonEdit
    }
})
export default class MenuManage extends Vue {
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

    // 详情项
    private current = null

    private subSystemList: any[] = []

    private modelList: any[] = []

    private subModelList: any[] = []

    private defaultSubSystemCode: any = ''

    private defaultModuleCode: any = ''

    private defaultSubModuleCode: any = ''

    private apiList: any = []

    private apiInfo: any = []

    private currentMenuID: any = ''

    private drawerVisible: any = false

    private buttonDrawerVisible: boolean = false

    private cnt: any = 0

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private innerAction: any = new InnerActionService()
    private publicService: any = new PublicService()

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private created() {
        this.getSubSystemList()
        this.getApiList()
        this.getSystemuser()
    }

    private onCreateUser() {
        this.$modal
            .open(
                MenuEdit,
                {
                    saveFlag: 0,
                    apiList: this.apiList
                },
                {
                    title: '新增菜单'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getCustomerList()
            })
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

    private getApiList() {
        this.systemService
            .query_all_system_api(
                new RequestParams(
                    {
                        page_index: 1,
                        page_size: 1000
                    },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(data => {
                this.apiList = data.map(x => {
                    return {
                        code: x.id,
                        name: x.api_name
                    }
                })
            })
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

    /**
     * 获取订单数据
     */
    private getCustomerList() {
        this.dataForm
            .validateFields()
            .then(values => {
                this.systemService
                    .queryAllMenu(
                        new RequestParams(
                            CommonService.createQueryCondition(values, {
                                menu_name: 'like',
                                menu_name_eng: 'like',
                                ...formConfig.condition
                            }),
                            {
                                page: this.pageService,
                                loading: this.loadingService
                            }
                        )
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
     * 查看订单详情
     */
    private onDetail(row) {
        this.current = row
        this.$nextTick(() => this.pageContainer.scrollToBottom())
    }

    /**
     * 编辑
     */
    private onEdit(row) {
        this.$modal
            .open(
                MenuEdit,
                {
                    saveFlag: 1,
                    warehouse: row,
                    apiList: this.apiList
                },
                {
                    title: '编辑菜单'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getCustomerList()
            })
    }

    private editButton(row) {
        this.cnt++
        this.buttonDrawerVisible = true
        this.currentMenuID = row.menu_code
    }

    /**
     * 删除订单操作
     */
    private onDelete(row) {
        this.systemService
            .deleteSystemMenu(
                new RequestParams(
                    { menu_code_list: [row.menu_code] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('删除成功')
                    this.getCustomerList()
                },
                err => {
                    this.$message.error('删除失败' + err.message)
                }
            )
    }

    private onBatchDelete() {
        this.systemService
            .deleteSystemMenu(
                new RequestParams(
                    {
                        menu_code_list: this.selectedRowKeys.map(
                            menuCode => menuCode
                        )
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('删除成功')
                    this.getCustomerList()
                    this.selectedRowKeys = []
                },
                err => {
                    this.$message.error('删除失败' + err.message)
                }
            )
    }

    private onSystemChange(e) {
        this.defaultSubSystemCode = e
        this.getModuleList()
    }

    private onModelChange(e) {
        this.defaultModuleCode = e
        this.getSubModule()
    }

    private editUrls(row) {
        this.cnt++
        this.currentMenuID = row.menu_code
        this.drawerVisible = true
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
            "query_name_list": "Query Column List",
            "interface_full_name": "Interface Full Name"
        },
        "desc": "this is a Order Page1",
        "edit_api": "Edit Api",
        "actions": {
            "new": "New",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel"
        },
        "delete": "Are you sure delete?",
        "edit_button": "Edit Button",
        "button": "Set Button",
        "yes": "yes",
        "no": "no"
    },
    "zh-cn": {
        "columns": {
            "query_name_list": "查询所有列",
            "interface_full_name": "接口全名"
        },
        "desc": "这是订单页面1",
        "edit_api": "编辑接口",
        "actions": {
            "new": "新建",
            "delete": "删除",
            "cancel": "取消",
            "ok": "确定"
        },
        "yes": "是",
        "no": "否",
        "delete": "确定要删除吗?",
        "edit_button": "编辑按钮",
        "button": "设置按钮"
    }
}
</i18n>
