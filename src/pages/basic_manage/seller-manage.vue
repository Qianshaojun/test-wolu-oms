<template>
    <page-container ref="pageContainer" @changeSearchState="showhideSearch">
        <template #header-action>
            <a-button type="primary" @click="onCreate">{{
                $t('action.create')
            }}</a-button>
            <!-- <a-button type="primary" @click="onBatchUpload">{{
                $t('action.batch-create')
            }}</a-button>-->
        </template>
        <data-form
            :extends="extendItems"
            ref="dataForm"
            @submit="getSellerList"
            :column="4"
            :showSearch="showSearch"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.seller_full_name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['seller_full_name']"
                        :style="{ width: '160px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.seller_name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['seller_name']"
                        :style="{ width: '160px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.platform')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="[
                            'platform',
                            {
                                initialValue: ''
                            }
                        ]"
                        :style="{ width: '100px' }"
                        size="small"
                    >
                        <a-select-option value>{{
                            $t('dict.all')
                        }}</a-select-option>
                        <a-select-option
                            :value="item.value"
                            v-for="item of $dict.SellerPlatform"
                            :key="item.value"
                            >{{ $t(item.label) }}</a-select-option
                        >
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.dept_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="[
                            'dept_id',
                            {
                                initialValue: ''
                            }
                        ]"
                        :style="{ width: '100px' }"
                        size="small"
                    >
                        <a-select-option value>{{
                            $t('dict.all')
                        }}</a-select-option>
                        <a-select-option
                            v-for="i of topDepartmentList"
                            :key="i.id"
                            :value="i.id"
                            :title="i.dept_name"
                        >
                            {{ i.dept_name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
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
                    <a-button
                        type="primary"
                        :disabled="!selectedRowKeys.length"
                        >{{ $t('action.cancel') }}</a-button
                    >
                </a-popconfirm>
            </template>
        </data-form>
        <a-card class="margin-y" style="margin:0 !important;">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="seller_code"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getSellerList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                style="table-layout:fixed;"
            >
                <a-table-column
                    :title="$t('columns.seller_name')"
                    key="seller_name"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.seller_name }}</template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.seller_full_name')"
                    key="seller_full_name"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">{{
                        row.seller_full_name
                    }}</template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.platform')"
                    key="platform"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">{{
                        row.platform | dict('SellerPlatform') | translate
                    }}</template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.company_id')"
                    key="company_id"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">{{
                        companyDict[row.company_id]
                    }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.seller_id')"
                    key="seller_id"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">{{
                        sellerDict[row.seller_id]
                    }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.dept_id')"
                    key="dept_id"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">{{
                        getDepartName(row.dept_id)
                    }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.status')"
                    data-index="status"
                    key="status"
                    align="center"
                    width="6%"
                >
                    <template slot-scope="status">
                        <span v-if="status == 10" style="color:blue;">
                            {{
                                status
                                    | dict('SellerInstanceStatus')
                                    | translate
                            }}
                        </span>
                        <span v-else-if="status == 60" style="color:gray;">
                            {{
                                status
                                    | dict('SellerInstanceStatus')
                                    | translate
                            }}
                        </span>
                        <span
                            v-else-if="status == 100 || status == 200"
                            style="color:red;"
                        >
                            {{
                                status
                                    | dict('SellerInstanceStatus')
                                    | translate
                            }}
                        </span>
                        <span v-else style="color:#333;">
                            {{
                                status
                                    | dict('SellerInstanceStatus')
                                    | translate
                            }}
                        </span>
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.who_responsible')"
                    key="who_responsible"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ searchUserName(row.who_responsible) }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.write_uid')"
                    key="write_uid"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ searchUserName(row.write_uid) }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.write_time')"
                    key="write_time"
                    :sorter="true"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.write_date | datetolocal }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.seller_code')"
                    key="seller_code"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row" @click="onView(row)">
                        {{ row.seller_code }}
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
                                <a-menu-item @click="onEdit(row)">{{
                                    $t('action.edit')
                                }}</a-menu-item>
                                <a-menu-item @click="onCopy(row)">{{
                                    $t('action.copy')
                                }}</a-menu-item>
                                <a-menu-item @click="onPass(row)">{{
                                    $t('action.pass')
                                }}</a-menu-item>
                                <a-menu-item @click="onApiEdit(row)">{{
                                    $t('action.onApiEdit')
                                }}</a-menu-item>
                                <a-popconfirm
                                    :title="$t('cancel')"
                                    :okText="$t('action.ok')"
                                    :cancelText="$t('action.cancel')"
                                    placement="left"
                                    @confirm="onDelete(row)"
                                >
                                    <a-menu-item
                                        style="cursor:pointer;margin-left:12px;"
                                        class="btnDel"
                                        >{{ $t('action.cancel') }}</a-menu-item
                                    >
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

        <a-card class="margin-y" v-if="current">
            <SellerView
                :seller="current"
                :activeFeeTypes="activeFeeTypes"
                :departmentList="departmentList"
            ></SellerView>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { SellerInstanceService } from '~/services/seller-instance.service'
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
import SellerView from '~/components/seller_instance/seller_view.vue'
import SellerApiEdit from '~/components/seller_instance/seller-api-edit.vue'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

const userModule = namespace('userModule')
const allUsersModule = namespace('allUsersModule')
const pageParamsModule = namespace('pageParamsModule')
const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'seller-manage'
})
@Component({
    components: {
        SellerView,
        SellerApiEdit
    }
})
export default class ProductManage extends Vue {
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

    // Loading服务
    private sellerInstanceService = new SellerInstanceService()

    private userService = new UserService()

    private companyService = new CompanyService()

    private publicService = new PublicService()

    private innerAction = new InnerActionService()

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    // 表格数据源
    private data: any[] = []

    private showBtn: any = false

    private sellerDict = {}

    private companyDict = {}

    private sellerInstanceDict = {}

    // 表格选择项
    private selectedRowKeys: any[] = []

    // 详情项

    private activeFeeTypes: any[] = []

    private current = null

    private get rules() {
        return {}
    }

    private onCreate() {
        router.push({
            name: 'seller-edit',
            params: { departmentList: this.departmentList }
        })
    }

    @allUsersModule.State
    private users

    @allUsersModule.Mutation('changeUsers')
    private changeUsers

    @datasModule.State
    private departmentList

    @datasModule.Action
    private getDepartmentList

    private topDepartmentList: any[] = []

    public created() {
        this.updateAllUsers()
        this.getSellerDropDownList()
        this.getCompanyList()
        this.getDepartmentList()
    }

    public mounted() {
        this.topDepartmentList = this.departmentList.filter(
            x => x.dept_type == 30
        )
    }

    private updateAllUsers() {
        var that = this
        this.userService.all(new RequestParams('')).subscribe(data => {
            that.changeUsers(data)
        })
    }

    private getCompanyList() {
        this.companyService.getList(new RequestParams()).subscribe(data => {
            for (let i of data) {
                this.companyDict[i.code] = i.name
            }
        })
    }

    private getSellerDropDownList() {
        this.sellerInstanceService
            .queryOdooSellerList(new RequestParams())
            .subscribe(data => {
                for (let i of data) {
                    this.sellerDict[i.code] = i.name
                }
            })
    }

    private searchUserName(user_id) {
        let ret = ''
        let user = this.users.filter(x => x.code === user_id)
        if (user) {
            ret = user[0].name
        }
        return ret
    }

    /**
     * 获取订单数据
     */
    private getSellerList() {
        this.dataForm.validateFields().then((values: any) => {
            this.sellerInstanceService
                .getSellerList(
                    new RequestParams(
                        CommonService.createQueryCondition(values, {
                            seller_full_name: 'in_or_like',
                            seller_name: 'in_or_like',
                            platform: '=',
                            dept_id: '=',
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
                        data.map(
                            x =>
                                (x['seller_id'] =
                                    x['platform'] + '_' + x['seller_id'])
                        )
                        this.data = data
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
            params: { seller: row, departmentList: this.departmentList }
        })
    }
    /**
     * 查看订单详情
     */
    private onView(row) {
        this.current = row
        this.$nextTick(() => this.pageContainer.scrollToBottom())
    }

    @pageParamsModule.Mutation('changeSeller')
    private changeSeller

    private onCopy(row) {
        row['copy'] = 1
        this.changeSeller(row)
        router.push({
            name: 'seller-edit',
            params: { seller: row, departmentList: this.departmentList }
        })
    }

    private onApiEdit(row) {
        this.$modal
            .open(
                SellerApiEdit,
                {
                    row: row
                },
                {
                    title: this.$t('action.edit'),
                    width: '60%'
                }
            )
            .subscribe(data => {
                this.$message.success('Success')
                this.getSellerList()
            })
    }

    private onDelete(row) {
        this.sellerInstanceService
            .seller_delete(
                new RequestParams(
                    {
                        seller_code_list: [row.seller_code]
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('delete_success')
                    this.$message.success(msg)
                    this.getSellerList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onBatchDelete() {
        this.sellerInstanceService
            .seller_delete(
                new RequestParams(
                    {
                        instance_code_list: this.selectedRowKeys
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('delete_success')
                    this.$message.success(msg)
                    this.getSellerList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onPass(row) {
        this.sellerInstanceService
            .change_seller_status(
                new RequestParams(
                    {
                        seller_code: row.seller_code,
                        status: 20
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                () => {
                    this.$message.success('Success')
                    this.getSellerList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getDepartName(department) {
        let ret: any = department
        let item = this.departmentList.find(x => x.id == department)
        if (item) {
            ret = item.dept_name
        }
        return ret
    }
}
</script>

<i18n>
{
  "en-us": {
    "desc": "this is a Order Page1",
    "columns":{
       "product":"Product",
       "basic_product":"Basic Product",
       "location":"Location",
       "isSendLocation":"IsSendLocation",
       "company_id":"company_id",
       "seller_id":"seller_id",
       "instance_id":"instance_id",
       "batch":"Batch",
       "reserved_qty":"Reserved Qty",
       "multi_qty":"Multi Qty",
       "time":"Create Time",
       "seller_id":"Seller Name",    
       "actions":"Actions",
       "quantity":"Quantity",
       "dept_id":"Department",
       "seller_full_name":"Full Name",
       "seller_name":"Short Name"
    },
    "action":{
      "create":"Create",
      "batch-create":"EXCEL Import",
      "edit":"Edit",
      "delete":"Delete",
      "ok":"Yes",
      "cancel":"Cancel",
      "more":"More",
      "copy":"Copy",
      "pass":"Check",
      "onApiEdit":"Api Edit"
    },
    "rules":{
       "date_range_error":"start date can't later start date"
    },
    "delete":"Are you sure delete?",
    "cancel":"Are you sure cancel?",    
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Delete Success"
  },
  "zh-cn": {
    "desc": "这是订单页面1",
    "columns":{
       "product":"产品货号",
       "basic_product":"基础产品",
       "location":"存放位置",
       "isSendLocation":"发货位置",
       "company_id":"公司",
       "seller_id":"店铺",
       "instance_id":"实例",
       "batch":"批次",
       "seller_id":"店铺",    
       "reserved_qty":"已预留库存",
       "multi_qty":"倍数",
       "time":"创建时间",
       "actions":"操作",
       "quantity":"库存数量",
       "dept_id":"部门",
       "seller_full_name":"全称",
       "seller_name":"简称"
    },
    "action":{
      "create":"新建",
      "batch-create":"EXCEL导入",
      "edit":"编辑",
      "delete":"删除",
      "ok":"确定",
      "cancel":"取消",
      "more":"更多操作",
      "copy":"复制",
      "pass":"审核",
      "onApiEdit":"api接口管理"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "delete":"是否确认删除?",
    "cancel":"是否确认取消?",    
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "delete_success":"删除成功"
  }
}
</i18n>
