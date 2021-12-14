<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form
            :extends="extendItems"
            ref="dataForm"
            @submit="getDataList"
            :column="1"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item label="角色名">
                    <a-tree-select
                        show-search
                        allowClear
                        v-decorator="['role_code']"
                        :style="{ width: '340px' }"
                        :dropdown-style="{
                            maxHeight: '300px',
                            overflow: 'auto'
                        }"
                        size="small"
                        :tree-data="roleList"
                        :placeholder="$t('plzSelect')"
                        tree-default-expand-all
                    >
                    </a-tree-select>
                </a-form-item>
                <a-form-item label="菜单名称">
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['menu_name']"
                        :style="{ width: '340px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item label="用户登录名">
                    <a-select
                        showSearch
                        v-decorator="['user_id']"
                        :style="{ width: '340px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        :filterOption="filterSelectOption"
                        allowClear
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of systemUsers"
                            :key="item.code"
                            :value="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item :label="$t('accessRight')">
                    <a-select
                        showSearch
                        v-decorator="['data_access_rule_id']"
                        size="small"
                        :style="{ width: '340px' }"
                        :filterOption="filterSelectOption"
                        :placeholder="$t('plzSelect')"
                        mode="multiple"
                    >
                        <a-select-option :value="0">
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.id"
                            v-for="item of dataRuleAccessList"
                            :key="item.id"
                            :title="$t(item.access_rule_name)"
                        >
                            {{ $t(item.access_rule_name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                :showExportBtn="false"
                rowKey="index"
                @on-page-change="getDataList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                :scroll="{ x: '90%', y: 500 }"
                @change="tableChange"
                style="table-layout:fixed;"
            >
                <a-table-column
                    title="菜单名称"
                    width="20%"
                    align="center"
                    :sorter="true"
                >
                    <template slot-scope="row">
                        {{ row.menu_name }}
                    </template>
                </a-table-column>
                <a-table-column
                    title="角色"
                    dataIndex="role_name"
                    width="25%"
                    align="center"
                    :sorter="true"
                ></a-table-column>
                <a-table-column
                    title="用户登录名"
                    dataIndex="login_name"
                    width="20%"
                    align="left"
                    :sorter="true"
                >
                </a-table-column>
                <a-table-column
                    title="访问权限"
                    dataIndex="access_rule_name"
                    width="25%"
                    align="left"
                >
                </a-table-column>
            </data-table>
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
import MenuEdit from '~/components/setting/menu-edit.vue'
import MenuApiEdit from '~/components/setting/menu-api-edit.vue'
import { formConfig } from '../../config/form.config'
import { InnerActionService } from '../../bootstrap/services/inner.action.service'
import { PublicService } from '../../services/public.service'
import { namespace } from 'vuex-class'
import UUID from 'uuidjs'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'menu-access-manage'
})
@Component({
    components: {
        MenuEdit,
        MenuApiEdit
    }
})
export default class MenuAccessManage extends Vue {
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

    private subSystemList: any[] = []

    private defaultSubSystemCode: any = ''

    private apiList: any = []

    private roleList: any = []

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
        this.getRoleList()
        this.getDataRuleAccessList()
        this.getSystemuser()
    }

    /**
     * 获取访问权限数据
     */
    private dataRuleAccessList: any = []

    private getDataRuleAccessList() {
        this.systemService
            .query_all_data_access_rule(
                new RequestParams({
                    page_index: 1,
                    page_size: 1000
                })
            )
            .subscribe(data => {
                this.dataRuleAccessList = data
            })
    }

    /**
     * 获取角色数据
     */
    private getRoleList() {
        this.systemService
            .queryAllRoles(
                new RequestParams({
                    role_name: '',
                    order_by: 'role_priority asc'
                })
            )
            .subscribe(
                data => {
                    if (data.length) {
                        this.roleList = this.formatRoleList(data)
                        console.log('this.roleList', this.roleList)
                    }
                },
                err => {
                    this.$message.error('角色查询失败！')
                }
            )
    }

    private formatRoleList(list) {
        let ret: any = []
        console.log('list', list)
        if (list.length) {
            for (let i in list) {
                let item: any = {
                    key: list[i].role_name_eng,
                    value: list[i].role_code,
                    title: list[i].role_name
                }
                let role_catg: any = list[i].role_catg
                    ? list[i].role_catg
                    : '未分组'
                let exist = ret.find(x => x.title == role_catg)
                if (exist) {
                    exist.children.push(item)
                } else {
                    ret.push({
                        key: i,
                        title: role_catg,
                        value: role_catg,
                        disabled: true,
                        children: [item]
                    })
                }
            }
        }
        ret.unshift({
            key: 'user_role_menu',
            title: '用户菜单',
            value: 'user_role_menu'
        })
        return ret
    }

    private orderBy: string = ''

    private tableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getDataList()
    }

    /**
     * 获取列表数据
     */
    private getDataList() {
        this.dataForm
            .validateFields()
            .then(values => {
                let params: any = CommonService.createQueryCondition(values, {
                    role_name: 'like',
                    menu_name: 'like',
                    data_access_rule_id: 'in',
                    ...formConfig.condition
                })
                if (this.orderBy) {
                    params['order_by'] = this.orderBy
                }
                this.innerAction.setActionAPI(
                    'system/query_all_role_menu_user',
                    CommonService.getMenuCode('role-manage')
                )
                this.publicService
                    .queryPagination(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService,
                            innerAction: this.innerAction
                        })
                    )
                    .subscribe(
                        data => {
                            let msg: any = this.$t('tips.save_success')
                            this.data = data.map(x => {
                                x['index'] = UUID.generate()
                                return x
                            })
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

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
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
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel"
        },
        "delete": "Are you sure delete?",
        "plzSelect": "Please Select",
        "userRoleMenu": "User Role Menu",
        "accessRight": "Access Right"
    },
    "zh-cn": {
        "columns": {
            "query_name_list": "查询所有列",
            "interface_full_name": "接口全名"
        },
        "desc": "这是订单页面1",
        "edit_api": "编辑接口",
        "actions": {
            "delete": "删除",
            "cancel": "取消",
            "ok": "确定"
        },
        "delete": "确定要删除吗?",
        "plzSelect": "请选择",
        "userRoleMenu": "用户角色菜单",
        "accessRight": "访问权限"
    }
}
</i18n>