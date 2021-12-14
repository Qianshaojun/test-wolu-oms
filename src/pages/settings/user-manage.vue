<template>
    <page-container ref="pageContainer">
        <template #header-action>
            <a-button type="primary" @click="onCreateUser()">新建</a-button>
        </template>
        <data-form
            :extends="extendItems"
            ref="dataForm"
            @submit="getCustomerList"
            :column="2"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item label="登录名" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['login_name']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item label="员工编号" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['employee_id']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item label="姓名" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['cn_name']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item label="英文名" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['en_name']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item label="部门" style="height:35px;margin:0;">
                    <a-select
                        showSearch
                        v-decorator="['dept_id']"
                        :style="{ width: '200px' }"
                        size="small"
                        :filterOption="filterSelectOption"
                        mode="multiple"
                    >
                        <a-select-option
                            v-for="i of departmentList"
                            :key="i.id"
                            :value="i.id"
                            :title="i.dept_name"
                        >
                            {{ i.dept_name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <template #action>
                <a-button
                    type="primary"
                    @click="onBatchStop()"
                    :disabled="!selectedRowKeys.length"
                    >停用</a-button
                >
            </template>
        </data-form>
        <a-card class="margin-y">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="user_id"
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
                    title="用户ID"
                    key="user_id"
                    dataIndex="user_id"
                    width="6%"
                    align="left"
                >
                </a-table-column>
                <a-table-column
                    title="登录名"
                    key="login_name"
                    width="14%"
                    align="left"
                >
                    <template slot-scope="row">
                        {{ row.login_name }}
                    </template>
                </a-table-column>
                <a-table-column
                    title="员工编号"
                    dataIndex="employee_id"
                    key="employee_id"
                    width="10%"
                    align="left"
                ></a-table-column>
                <a-table-column
                    title="公司账号"
                    dataIndex="company_account"
                    key="company_account"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="company_account">
                        <span v-if="company_account"
                            ><input type="checkbox" checked disabled
                        /></span>
                        <span v-else><input type="checkbox" disabled/></span>
                    </template>
                </a-table-column>
                <a-table-column
                    title="姓名"
                    dataIndex="cn_name"
                    key="cn_name"
                    width="10%"
                    align="left"
                ></a-table-column>
                <a-table-column
                    title="英文名"
                    dataIndex="en_name"
                    key="en_name"
                    width="10%"
                    align="left"
                ></a-table-column>
                <a-table-column
                    title="手机号"
                    dataIndex="phone_number"
                    key="phone_number"
                    width="10%"
                    align="left"
                ></a-table-column>
                <a-table-column
                    title="部门"
                    key="dept_name_list"
                    dataIndex="dept_name_list"
                    width="10%"
                    align="left"
                >
                    <template slot-scope="dept_name_list">
                        <span :title="dept_name_list">
                            {{
                                dept_name_list
                                    ? dept_name_list.length > 10
                                        ? dept_name_list.substr(0, 10) + '...'
                                        : dept_name_list
                                    : ''
                            }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    title="状态"
                    dataIndex="status"
                    key="status"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="status">
                        <span v-if="status == 20" style="color:gray;">{{
                            status | dict('SystemUserStatus') | translate
                        }}</span>
                        <span v-else-if="status == 100" style="color:red;">{{
                            status | dict('SystemUserStatus') | translate
                        }}</span>
                        <span v-else style="color:#333;">{{
                            status | dict('SystemUserStatus') | translate
                        }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    title="备注"
                    dataIndex="memo"
                    key="memo"
                    width="15%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    title="更新时间"
                    key="create_date"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.write_date | datetolocal }}
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
                                    >编辑</a-menu-item
                                >
                                <a-menu-item @click="onChangePassword(row)"
                                    >修改密码</a-menu-item
                                >
                                <!-- <a-menu-item @click="onSetMenu(row)"
                                    >设置菜单</a-menu-item
                                > -->
                                <a-menu-item @click="onStop(row)"
                                    >停用</a-menu-item
                                >
                            </a-menu>
                            <a-button>
                                更多操作 <a-icon type="down" />
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
import UserEdit from '~/components/setting/user-edit.vue'
import PasswordEdit from '~/components/setting/password-edit.vue'
import { formConfig } from '../../config/form.config'
import { namespace } from 'vuex-class'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'user-manage'
})
@Component({
    components: {
        UserEdit,
        PasswordEdit
    }
})
export default class UserManage extends Vue {
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

    @datasModule.State
    private departmentList

    @datasModule.Action
    private getDepartmentList

    // 详情项
    private current = null

    private created() {
        this.getDepartmentList()
    }

    private onCreateUser() {
        this.$modal
            .open(
                UserEdit,
                {
                    saveFlag: 0,
                    departmentList: this.departmentList
                },
                {
                    title: '新增用户'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getCustomerList()
            })
    }

    /**
     * 获取订单数据
     */
    private getCustomerList() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                values['sub_account'] = false
                this.systemService
                    .queryAllUser(
                        new RequestParams(
                            CommonService.createQueryCondition(values, {
                                login_name: 'like',
                                employee_id: '=',
                                cn_name: 'like',
                                en_name: 'like',
                                dept_id: 'in',
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
                UserEdit,
                {
                    saveFlag: 1,
                    warehouse: row,
                    departmentList: this.departmentList
                },
                {
                    title: '编辑用户'
                }
            )
            .subscribe(data => {
                this.$message.success('更新成功')
                this.getCustomerList()
            })
    }
    /**
     * 删除订单操作
     */
    private onDelete(id) {}

    private onStatusChange(e) {
        this.$nextTick(function() {
            this.getCustomerList()
        })
    }

    private onChangePassword(row) {
        this.$modal
            .open(
                PasswordEdit,
                {
                    user: row
                },
                {
                    title: '修改密码'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
            })
    }

    private onStop(row) {
        this.systemService
            .stopUser(
                new RequestParams(
                    {
                        user_id_list: [row.user_id]
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getCustomerList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onBatchStop() {
        this.systemService
            .stopUser(
                new RequestParams(
                    {
                        user_id_list: this.selectedRowKeys.map(userID => userID)
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getCustomerList()
                    this.selectedRowKeys = []
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onSetMenu(row) {}

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
    "desc": "this is a Order Page1"
  },
  "zh-cn": {
    "desc": "这是订单页面1"
  }
}
</i18n>
