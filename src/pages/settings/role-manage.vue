<template>
    <page-container ref="pageContainer">
        <a-card>
            <div style="width:40%;min-height:600px;float:left;">
                <div class="x-mdl-div2" style="min-height:600px;">
                    <div class="header">
                        <span class="title">角色列表</span>
                        <span class="new" @click="addRole">+ 新增</span>
                    </div>
                    <a-input-search
                        style="margin-bottom: 8px"
                        placeholder="Search"
                        @change="e => onChange(e)"
                    />
                    <a-tree
                        :expanded-keys="expandedKeys"
                        :auto-expand-parent="autoExpandParent"
                        @select="e => onRoleClick(e)"
                        @expand="onExpand"
                        :tree-data="roleList"
                        show-icon
                    >
                        <a-icon slot="floder" type="folder" />
                        <template slot="custom" slot-scope="item">
                            <span
                                class="mdl-name2"
                                v-if="item.title.indexOf(searchValue) > -1"
                            >
                                {{
                                    item.title.substr(
                                        0,
                                        item.title.indexOf(searchValue)
                                    )
                                }}
                                <span style="color: #f50">{{
                                    searchValue
                                }}</span>
                                {{
                                    item.title.substr(
                                        item.title.indexOf(searchValue) +
                                            searchValue.length
                                    )
                                }}
                            </span>
                            <span v-else class="mdl-name2">{{
                                item.title
                            }}</span>
                            <span
                                v-if="defaultRoleCode == item.data.role_code"
                                style="float:right;"
                            >
                                <a
                                    type="primary"
                                    class="edit2"
                                    @click="() => editRole(item.data)"
                                    ><a-icon type="edit"
                                /></a>
                                <a
                                    type="primary"
                                    class="delete2"
                                    @click="e => deleteRole(item.data)"
                                    ><a-icon type="delete"
                                /></a>
                            </span>
                        </template>
                    </a-tree>
                </div>
            </div>
            <div style="width:60%;float:left;display:inline-block;">
                <div class="x-mdl-div2" style="min-height:300px;">
                    <div class="header">
                        <span class="title">对应用户</span>
                        <span
                            class="new"
                            @click="addRoleUser"
                            v-if="defaultRoleCode"
                            >+ 新增</span
                        >
                    </div>
                    <ul class="list" style="height:263px;overflow-y:scroll;">
                        <li
                            v-for="item of roleUserList"
                            :key="item.user_id"
                            :class="
                                currentUserLi == item.user_id ? 'active' : ''
                            "
                            @click="
                                e => {
                                    onUserClick(item.user_id)
                                }
                            "
                        >
                            <p class="mdl-name">
                                {{ item.login_name
                                }}<a
                                    class="delete"
                                    @click="
                                        e => {
                                            e.stopPropagation()
                                            deleteRoleUser(item)
                                        }
                                    "
                                >
                                    <a-icon type="delete" />
                                </a>
                                <a
                                    class="edit"
                                    @click="
                                        e => {
                                            e.stopPropagation()
                                            addUserMenu(item)
                                        }
                                    "
                                    title="增加权限"
                                >
                                    <a-icon type="plus-circle" />
                                </a>
                            </p>
                        </li>
                    </ul>
                </div>
                <div class="x-mdl-div2" style="min-height:300px;">
                    <div class="header">
                        <span class="title">对应菜单</span>
                        <span class="access_rule">访问规则</span>
                        <span class="column_authority">列权限</span>
                        <span class="column_authority">{{
                            $t('button_authority')
                        }}</span>
                        <span
                            class="new"
                            @click="addRoleMenu"
                            v-if="defaultRoleCode"
                            >+ 新增</span
                        >
                    </div>
                    <ul class="list" style="height:263px;overflow-y:scroll;">
                        <li v-for="item of roleMenuList" :key="item.menu_code">
                            <p class="mdl-name" style="position:relative;">
                                <span :title="item.menu_name">
                                    {{
                                        item.menu_name &&
                                        item.menu_name.length > 20
                                            ? item.menu_name.substr(0, 17) +
                                              '...'
                                            : item.menu_name
                                    }}</span
                                >
                                <span style="position: absolute;left:33%;">
                                    <a-select
                                        showSearch
                                        v-model="item.data_access_rule_id"
                                        style="width: 120px;"
                                        size="small"
                                        :filterOption="filterSelectOption"
                                        @change="
                                            e =>
                                                onDataAccessRuleChange(
                                                    e,
                                                    item.menu_code
                                                )
                                        "
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
                                </span>
                                <span
                                    :title="item.query_name_list"
                                    style="position: absolute;left:60%;"
                                    ><a @click="configMenuColumn(item, 'role')">
                                        {{
                                            item.query_name_list
                                                ? item.query_name_list.length >
                                                  10
                                                    ? item.query_name_list.substr(
                                                          0,
                                                          7
                                                      ) + '...'
                                                    : item.query_name_list
                                                : '未配置'
                                        }}</a
                                    >
                                </span>
                                <span
                                    :title="item.button_name_list"
                                    style="position: absolute;left:84%;"
                                    ><a
                                        @click="
                                            configButtonColumn(item, 'role')
                                        "
                                    >
                                        {{
                                            item.button_name_list
                                                ? item.button_name_list.length >
                                                  10
                                                    ? item.button_name_list.substr(
                                                          0,
                                                          7
                                                      ) + '...'
                                                    : item.button_name_list
                                                : '未配置'
                                        }}
                                    </a>
                                </span>
                                <a
                                    class="delete"
                                    @click="
                                        e => {
                                            e.stopPropagation()
                                            deleteRoleMenu(item)
                                        }
                                    "
                                >
                                    <a-icon type="delete" />
                                </a>
                            </p>
                        </li>
                        <li v-for="item of userMenuList" :key="item.menu_code">
                            <p
                                class="mdl-name"
                                style="color:blue;position:relative;"
                            >
                                <span :title="item.menu_name">
                                    {{
                                        item.menu_name &&
                                        item.menu_name.length > 20
                                            ? item.menu_name.substr(0, 17) +
                                              '...'
                                            : item.menu_name
                                    }}</span
                                >
                                <span style="position: absolute;left:33%;">
                                    <a-select
                                        showSearch
                                        v-model="item.data_access_rule_id"
                                        style="width: 120px;"
                                        size="small"
                                        @change="
                                            e =>
                                                onUserDataAccessRuleChange(
                                                    e,
                                                    item.menu_code
                                                )
                                        "
                                        :filterOption="filterSelectOption"
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
                                </span>
                                <span
                                    :title="item.query_name_list"
                                    style="position: absolute;left:60%;"
                                    ><a @click="configMenuColumn(item, 'user')">
                                        {{
                                            item.query_name_list
                                                ? item.query_name_list.length >
                                                  10
                                                    ? item.query_name_list.substr(
                                                          0,
                                                          7
                                                      ) + '...'
                                                    : item.query_name_list
                                                : '未配置'
                                        }}</a
                                    >
                                </span>
                                <span
                                    :title="item.button_name_list"
                                    style="position: absolute;left:84%;"
                                    ><a
                                        @click="
                                            configButtonColumn(item, 'role')
                                        "
                                    >
                                        {{
                                            item.button_name_list
                                                ? item.button_name_list.length >
                                                  10
                                                    ? item.button_name_list.substr(
                                                          0,
                                                          7
                                                      ) + '...'
                                                    : item.button_name_list
                                                : '未配置'
                                        }}
                                    </a>
                                </span>
                                <a
                                    class="delete"
                                    @click="
                                        e => {
                                            e.stopPropagation()
                                            deleteUserMenu(item)
                                        }
                                    "
                                >
                                    <a-icon type="delete" />
                                </a>
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </a-card>
        <a-drawer
            :title="$t('action.menu_column_authority')"
            placement="bottom"
            width="100%"
            :height="600"
            :visible="drawerVisible"
            :body-style="{
                padding: '10px 30px 30px 30px',
                overflow: 'hidden'
            }"
            :closable="true"
            @close="onMenuColumnAuthorityClose"
        >
            <MenuColumnAuthority
                :menuID="currenctMenuCode"
                :curKey="currentKey"
                :settingType="settingsType"
                :openCount="openCount"
            />
        </a-drawer>

        <a-drawer
            :title="$t('button_authority')"
            placement="bottom"
            width="100%"
            :height="600"
            :visible="buttonDrawerVisible"
            :body-style="{
                padding: '10px 30px 30px 30px',
                overflow: 'hidden'
            }"
            :closable="true"
            @close="onMenuColumnAuthorityClose"
        >
            <MenuButtonAuthority
                :menuID="currenctMenuCode"
                :curKey="currentKey"
                :settingType="settingsType"
                :openCount="openCount"
            ></MenuButtonAuthority>
        </a-drawer>
    </page-container>
</template>

<style lang="stylus">
.x-tb-header {
    font-size: 16px;
    font-weight: 600;
}

.x-tb-hd-btn-box {
    margin-left: 20px;
}

.x-mdl-div2 {
    width: 100%;
    float: left;
    border: 1px solid #ebedf0;
}

.x-mdl-div2 .header {
    width: 100%;
    border-bottom: 1px solid #ebedf0;
    background: #f2f2f2;
    line-height: 35px;
}

.x-mdl-div2 .header .title {
    margin-left: 15px;
    font-weight: 600;
    color: #222;
}

.x-mdl-div2 .header .access_rule {
    margin-left: 32%;
    font-weight: 600;
    color: #222;
}

.x-mdl-div2 .header .column_authority {
    margin-left: 18%;
    font-weight: 600;
    color: #222;
}

.x-mdl-div2 .header .new {
    float: right;
    margin-right: 30px;
    color: #0099cc;
    cursor: pointer;
}

.x-mdl-div2 .list {
    width: 100%;
    padding: 0;
    margin: 0;
    height: 100%;
    display: inline-block;
}

.x-mdl-div2 .list li {
    list-style: none;
    line-height: 40px;
    margin: 0;
    padding: 10px 5% 0 5%;
    border-bottom: 1px solid #f5f5f5;
}

.x-mdl-div2 .list .mdl-name {
    margin: 0;
    line-height: 25px;
    font-weight: 600;
    color: #222;
}

.x-mdl-div2 .list .memo {
    font-size: 12px;
    color: #999;
    line-height: 20px;
}

.x-mdl-div2 .list li .edit {
    float: right;
    margin-right: 15px;
    color: #0099cc;
    font-size: 18px;
}

.x-mdl-div2 .list li .delete {
    float: right;
    margin-right: 20px;
    color: red;
    font-size: 18px;
}

.x-mdl-div2 .list .active {
    background: #e6f7ff;
}

.x-mdl-div2 .tree-li {
    margin: 0;
    line-height: 25px;
    font-weight: 600;
    color: #222;
    position: relative;
}

.x-mdl-div2 .edit2 {
    margin-left: 20px;
    color: #0099cc;
}

.x-mdl-div2 .delete2 {
    margin-left: 10px;
    color: red;
}

.x-mdl-div2 .mdl-name2 {
    margin: 0;
    line-height: 25px;
    font-weight: 600;
    color: #222;
}

.x-mdl-div2 .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background: none !important;
}

.x-mdl-div2 .ant-tree-treenode-selected {
    background: #e6f7ff !important;
}
</style>

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
import AddRole from '~/components/setting/add-role.vue'
import AddRoleUser from '~/components/setting/add-role-user.vue'
import AddRoleMenu from '~/components/setting/add-role-menu.vue'
import AddUserMenu from '~/components/setting/add-user-menu.vue'
import MenuColumnAuthority from '~/components/setting/menu-column-authority.vue'
import MenuButtonAuthority from '~/components/setting/menu-button-authority.vue'
import { formConfig } from '../../config/form.config'

@Page({
    layout: 'workspace',
    name: 'role-manage'
})
@Component({
    components: {
        AddRole,
        AddRoleUser,
        AddRoleMenu,
        AddUserMenu,
        MenuColumnAuthority,
        MenuButtonAuthority
    }
})
export default class RoleManage extends Vue {
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
    private roleList: any[] = []

    private roleUserList: any[] = []

    private roleMenuList: any[] = []

    private userMenuList: any[] = []

    private roleOriginList: any = []

    private buttonDrawerVisible: boolean = false

    // 表格选择项
    private selectedRowKeys: any[] = []

    private dataRuleAccessList: any = []

    private defaultPartCode: any = ''

    private currentUserLi: any = ''

    private defaultRoleCode: any = ''

    private defaultUserId: any = ''

    private editAble: any = false

    private currentEditMenu: any = ''

    private expandedKeys: any = []

    private autoExpandParent: any = true

    private searchValue: any = ''

    private onSelect(e) {
        this.defaultPartCode = e[0]
    }

    private created() {
        this.getRoleList()
        this.getDataRuleAccessList()
    }

    /**
     * 获取订单数据
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
                        this.roleOriginList = data.map(x => x)
                        this.roleList = this.formatRoleList(
                            data.sort(this.sortfun)
                        )
                    }
                    this.defaultRoleCode = ''
                    this.expandedKeys = ['0']
                },
                err => {
                    this.$message.error('角色查询失败！')
                }
            )
    }

    private sortfun(a, b) {
        return a.role_priority - b.role_priority
    }

    private formatRoleList(list) {
        let ret: any = []
        if (list.length) {
            for (let i in list) {
                let item: any = {
                    key: list[i].role_name_eng,
                    title:
                        '[' + list[i].role_name_eng + ']' + list[i].role_name,
                    isLeaf: true,
                    scopedSlots: { title: 'custom' },
                    data: list[i]
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
                        slots: {
                            icon: 'floder'
                        },
                        children: [item]
                    })
                }
            }
        }
        return ret
    }

    private getRoleUser() {
        this.roleUserList = []
        this.systemService
            .queryRoleUser(
                new RequestParams(
                    {
                        role_code: this.defaultRoleCode,
                        login_name: null
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.roleUserList = data
                },
                err => {
                    this.$message.error('获取用户失败！')
                }
            )
    }

    private getRoleMenu() {
        this.roleMenuList = []
        this.systemService
            .queryMenuByRole(
                new RequestParams(
                    {
                        role_code: this.defaultRoleCode
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.roleMenuList = data.map(x => {
                        x.data_access_rule_id = x.data_access_rule_id
                            ? x.data_access_rule_id
                            : 0
                        return x
                    })
                },
                err => {
                    this.$message.error('获取菜单失败！')
                }
            )
    }

    private getUserMenu(user_id) {
        this.userMenuList = []
        this.systemService
            .queryMenuByRoleUser(
                new RequestParams(
                    {
                        role_code: this.defaultRoleCode,
                        user_id: user_id
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.userMenuList = data
                        .filter(x => x.menu_type === 'U')
                        .map(x => {
                            x.data_access_rule_id = x.data_access_rule_id
                                ? x.data_access_rule_id
                                : 0
                            return x
                        })
                },
                err => {
                    this.$message.error('获取菜单失败！')
                }
            )
    }

    private addRole() {
        this.$modal
            .open(
                AddRole,
                {
                    saveFlag: 0
                },
                { title: '新增角色' }
            )
            .subscribe((data: any[]) => {
                this.$message.success('操作成功')
                this.getRoleList()
            })
    }

    private editRole(row) {
        this.$modal
            .open(
                AddRole,
                {
                    saveFlag: 1,
                    warehouse: row
                },
                { title: '编辑角色' }
            )
            .subscribe((data: any[]) => {
                this.$message.success('操作成功')
                this.getRoleList()
            })
    }

    private deleteRole(row) {
        let _that = this
        this.$confirm({
            title: this.$t('tip'),
            content: this.$t('tip_content'),
            onOk() {
                _that.systemService
                    .deleteRole(
                        new RequestParams({ role_code_list: [row.role_code] })
                    )
                    .subscribe(
                        () => {
                            _that.$message.success('删除成功')
                            _that.getRoleList()
                        },
                        err => {
                            _that.$message.error('删除失败' + err.message)
                        }
                    )
            },
            onCancel() {}
        })
    }

    private onRoleClick(e) {
        let role = this.roleOriginList.find(x => x.role_name_eng == e[0])
        if (!role) {
            return
        }
        this.defaultRoleCode = role.role_code
        this.getRoleUser()
        this.getRoleMenu()
    }

    private onUserClick(e) {
        this.currentUserLi = e
        this.defaultUserId = e
        this.getUserMenu(e)
    }

    private addRoleUser() {
        let info = this.roleOriginList.find(
            x => x.role_code === this.defaultRoleCode
        )
        this.$modal
            .open(
                AddRoleUser,
                {
                    info: info
                },
                { title: '添加用户' }
            )
            .subscribe((data: any[]) => {
                this.$message.success('操作成功')
                this.getRoleUser()
            })
    }

    private deleteRoleUser(row) {
        let _that = this
        this.$confirm({
            title: this.$t('tip'),
            content: this.$t('tip_content'),
            onOk() {
                _that.systemService
                    .deleteRoleUser(
                        new RequestParams({
                            role_code: _that.defaultRoleCode,
                            user_id_list: [row.user_id]
                        })
                    )
                    .subscribe(
                        () => {
                            _that.$message.success('删除成功')
                            _that.getRoleUser()
                        },
                        err => {
                            _that.$message.error('删除失败' + err.message)
                        }
                    )
            },
            onCancel() {}
        })
    }

    private deleteRoleMenu(row) {
        let _that = this
        this.$confirm({
            title: this.$t('tip'),
            content: this.$t('tip_content'),
            onOk() {
                _that.systemService
                    .deleteRoleMenuRel(
                        new RequestParams(
                            {
                                role_code: _that.defaultRoleCode,
                                menu_code_list: [row.menu_code]
                            },
                            { loading: _that.loadingService }
                        )
                    )
                    .subscribe(
                        () => {
                            _that.$message.success('删除成功')
                            _that.getRoleMenu()
                        },
                        err => {
                            _that.$message.error('删除失败' + err.message)
                        }
                    )
            },
            onCancel() {}
        })
    }

    private addRoleMenu() {
        let info = this.roleOriginList.find(
            x => x.role_code === this.defaultRoleCode
        )

        this.$modal
            .open(
                AddRoleMenu,
                {
                    info: info
                },
                { title: '添加菜单', width: '600px' }
            )
            .subscribe((data: any[]) => {
                this.$message.success('操作成功')
                this.getRoleMenu()
            })
    }

    private addUserMenu(row) {
        row['role_code'] = this.defaultRoleCode
        this.$modal
            .open(
                AddUserMenu,
                {
                    info: row
                },
                { title: '添加用户权限菜单' }
            )
            .subscribe((data: any[]) => {
                this.$message.success('操作成功')
                this.currentUserLi = row.user_id
                this.defaultUserId = row.user_id
                this.getUserMenu(row.user_id)
            })
    }

    private deleteUserMenu(row) {
        this.systemService
            .deleteUserMenu(
                new RequestParams(
                    {
                        user_id: this.defaultUserId,
                        menu_code_list: [row.menu_code]
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                () => {
                    this.$message.success('删除成功')
                    this.getUserMenu(this.defaultUserId)
                },
                err => {
                    this.$message.error('删除失败' + err.message)
                }
            )
    }

    /**
     * 获取订单数据
     */
    private getDataRuleAccessList() {
        this.systemService
            .query_all_data_access_rule(
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
                this.dataRuleAccessList = data
                this.selectedRowKeys = []
            })
    }

    private getAccessRuleName(id) {
        let name = ''
        let item = this.dataRuleAccessList.find(x => (x.id = id))
        if (item) {
            name = item.access_rule_name
        }
        return name
    }

    private onDataAccessRuleChange(e, menuCode) {
        this.systemService
            .update_role_menu_access_rule(
                new RequestParams({
                    data_access_rule_id: e ? e : null,
                    menu_code: menuCode,
                    role_code: this.defaultRoleCode
                })
            )
            .subscribe(
                data => {
                    this.$message.success('修改成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onUserDataAccessRuleChange(e, menuCode) {
        this.systemService
            .update_user_menu_access_rule(
                new RequestParams({
                    data_access_rule_id: e,
                    menu_code: menuCode,
                    user_id: this.defaultUserId
                })
            )
            .subscribe(
                data => {
                    this.$message.success('修改成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private onExpand(expandedKeys) {
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
    }

    private onChange(e) {
        const value = e.target.value
        let roleData = this.roleOriginList.filter(
            x =>
                x.role_name.indexOf(value) > -1 ||
                x.role_name_eng.indexOf(value) > -1
        )
        this.roleList = this.formatRoleList(roleData.sort(this.sortfun))
        const expandedKeys = this.roleList.map(x => {
            if (x.children.find(i => i.title.indexOf(value) > -1)) {
                return x.key
            }
            return null
        })

        Object.assign(this, {
            expandedKeys,
            searchValue: value,
            autoExpandParent: true
        })
    }

    private drawerVisible: any = false
    private currenctMenuCode: any = ''
    private currentKey: any = ''
    private settingsType: any = ''
    private openCount: any = 0

    private configMenuColumn(item, setting_type) {
        let key_id: any = ''
        if (setting_type == 'role') {
            key_id = this.defaultRoleCode
        } else if (setting_type == 'user') {
            key_id = this.defaultUserId + ''
        }

        this.currenctMenuCode = item.menu_code
        this.currentKey = key_id
        this.settingsType = setting_type

        this.drawerVisible = true
        this.openCount++
    }

    private configButtonColumn(item, setting_type) {
        let key_id: any = ''
        if (setting_type == 'role') {
            key_id = this.defaultRoleCode
        } else if (setting_type == 'user') {
            key_id = this.defaultUserId + ''
        }

        this.currenctMenuCode = item.menu_code
        this.currentKey = key_id
        this.settingsType = setting_type
        this.buttonDrawerVisible = true
        this.openCount++
    }

    private onMenuColumnAuthorityClose() {
        this.drawerVisible = false
        this.buttonDrawerVisible = false
        this.getRoleMenu()
        if (this.defaultUserId) {
            this.getUserMenu(this.defaultUserId)
        }
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "tip": "Tip",
        "tip_content": "Are you sure to delete?",
        "action": {
            "menu_column_authority": "Column Authority"
        },
        "button_authority": "Button Authority"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "tip": "提示",
        "tip_content": "确定要删除吗?",
        "action": {
            "menu_column_authority": "列权限"
        },
        "button_authority": "按钮权限"
    }
}
</i18n>
