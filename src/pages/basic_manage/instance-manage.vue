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
            @submit="getInstanceList"
            :column="1"
            :showSearch="showSearch"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.instance_full_name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['instance_full_name']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
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
                    <a-button type="primary" :disabled="!selectedRowKeys.length"
                        >{{ $t('action.cancel') }}
                    </a-button>
                </a-popconfirm>
            </template>
        </data-form>
        <a-card class="margin-y" style="margin:0 !important;">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="instance_code"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getInstanceList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                style="table-layout:fixed;"
            >
                <a-table-column
                    :title="$t('columns.instance_name')"
                    key="instance_name"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.instance_name }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.instance_full_name')"
                    key="instance_full_name"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.instance_full_name }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.seller_name')"
                    key="seller_code"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ switchSellerName(row.seller_code) }}
                    </template>
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
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ searchUserName(row.who_responsible) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.company_id')"
                    key="company_id"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ companyDict[row.company_id] }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.seller_id')"
                    key="seller_id"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ sellerDict[row.seller_id] }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.instance_id')"
                    key="instance_id"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ sellerInstanceDict[row.instance_id] }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.site_id')"
                    key="site_id"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ countryDict[row.site_id] }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.encoding')"
                    key="encoding"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.encoding }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.lang_id')"
                    key="lang_id"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ langDict[row.lang_id] }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.write_uid')"
                    key="write_uid"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ searchUserName(row.write_uid) }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.write_time')"
                    key="write_time"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.write_date | datetolocal }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.instance_code')"
                    key="instance_code"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row" @click="onView(row)">
                        {{ row.instance_code }}
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
                                <a-menu-item @click="onEdit(row)"
                                    >{{ $t('action.edit') }}
                                </a-menu-item>
                                <a-menu-item @click="onCopy(row)"
                                    >{{ $t('action.copy') }}
                                </a-menu-item>
                                <a-menu-item @click="onPass(row)"
                                    >{{ $t('action.pass') }}
                                </a-menu-item>
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
                                        >{{ $t('action.cancel') }}
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

        <a-card class="margin-y" v-if="current">
            <InstanceView
                :instance="current"
                :activeFeeTypes="activeFeeTypes"
            ></InstanceView>
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
import { GeneralService } from '~/services/general.service'
import { CountryService } from '~/services/country.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import InstanceView from '~/components/seller_instance/instance_view.vue'

const userModule = namespace('userModule')
const allUsersModule = namespace('allUsersModule')
const datasModule = namespace('datasModule')
const sellerModule = namespace('sellerModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'instance-manage'
})
@Component({
    components: {
        InstanceView
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
    private countryService = new CountryService()

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    // 表格数据源
    private data: any[] = []

    private companyService = new CompanyService()
    private showBtn: any = false

    // 表格选择项
    private selectedRowKeys: any[] = []

    // 详情项

    private activeFeeTypes: any[] = []
    private generalService = new GeneralService()
    private langList: any = []
    private countryList: any = []
    private langDict = {}
    private companyDict = {}
    private sellerInstanceDict = {}
    private sellerDict = {}
    private current = null
    private countryDict = {}

    private get rules() {
        return {}
    }

    private onCreate() {
        router.push({
            name: 'instance-edit'
        })
    }

    @allUsersModule.State
    private users

    @allUsersModule.Mutation('changeUsers')
    private changeUsers

    private getcountry() {
        this.countryService.getListCode(new RequestParams()).subscribe(data => {
            this.countryList = data
            for (let i of data) {
                this.countryDict[i.code] = i.name
            }
        })
    }

    public created() {
        this.updateAllUsers()
        this.updateAllSellers()
        this.getCompanyList()
        this.getSellerInstanceList()
        this.getSellerDropDownList()
        this.getLangList()
        this.getcountry()
    }

    private mounted() {
        this.countryList.map(x => (this.countryDict[x.code] = x.name))
    }

    private getLangList() {
        this.generalService.queryLangList(new RequestParams()).subscribe(
            data => {
                this.langList = data
                for (let i of data) {
                    this.langDict[i.code] = i.name
                }
            },
            err => {
                let err_msg: any = this.$t('lang_err')
                this.$message.error(err_msg)
            }
        )
    }

    private getSellerInstanceList() {
        this.sellerInstanceService
            .queryOdooSellerInstanceList(new RequestParams())
            .subscribe(data => {
                for (let i of data) {
                    this.sellerInstanceDict[i.code] = i.name
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

    private getCompanyList() {
        this.companyService.getList(new RequestParams()).subscribe(data => {
            for (let i of data) {
                this.companyDict[i.code] = i.name
            }
        })
    }

    private searchUserName(user_id) {
        return this.users.filter(x => x.code === user_id)[0].name
    }

    private updateAllUsers() {
        var that = this
        this.userService.all(new RequestParams('')).subscribe(data => {
            that.changeUsers(data)
        })
    }

    @sellerModule.State
    private sellers

    @sellerModule.Mutation('changeSellers')
    private changeSellers

    private updateAllSellers() {
        var that = this
        this.sellerInstanceService
            .query_seller_name(new RequestParams(''))
            .subscribe(data => {
                that.changeSellers(data)
            })
    }

    private switchSellerName(seller_code) {
        return this.sellers.filter(x => x.code === seller_code)[0].name
    }

    /**
     * 查看订单详情
     */
    private onView(row) {
        this.current = row
        this.$nextTick(() => this.pageContainer.scrollToBottom())
    }

    /**
     * 获取订单数据
     */
    private getInstanceList() {
        this.dataForm.validateFields().then((values: any) => {
            this.sellerInstanceService
                .getInstanceList(
                    new RequestParams(
                        CommonService.createQueryCondition(values, {
                            instance_full_name: 'like',
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
                        data.map(x => {
                            x['instance_id'] =
                                x['platform'] + '_' + x['instance_id']
                            x['seller_id'] =
                                x['platform'] + '_' + x['seller_id']
                        })
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
            name: 'instance-edit',
            params: { instance: row }
        })
    }

    @pageParamsModule.Mutation('changeSeller')
    private changeSeller

    private onCopy(row) {
        row['copy'] = 1
        this.changeSeller(row)
        router.push({
            name: 'instance-edit',
            params: { instance: row }
        })
    }

    private onDelete(row) {
        this.sellerInstanceService
            .instance_delete(
                new RequestParams(
                    {
                        instance_code_list: [row.instance_code]
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('delete_success')
                    this.$message.success(msg)
                    this.getInstanceList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onBatchDelete() {
        this.sellerInstanceService
            .instance_delete(
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
                    this.getInstanceList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onPass(row) {
        this.sellerInstanceService
            .change_instance_status(
                new RequestParams(
                    {
                        instance_code: row.instance_code,
                        status: 20
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                () => {
                    this.$message.success('Success')
                    this.getInstanceList()
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
        "columns": {
            "product": "Product",
            "basic_product": "Basic Product",
            "location": "Location",
            "isSendLocation": "IsSendLocation",
            "batch": "Batch",
            "company_id": "Company",
            "seller_id": "Seller",
            "instance_id": "Instance",
            "reserved_qty": "Reserved Qty",
            "multi_qty": "Multi Qty",
            "time": "Create Time",
            "actions": "Actions",
            "lang_id": "Language",
            "site_id": "Site",
            "encoding": "Encoding",
            "quantity": "Quantity"
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
            "pass": "Check"
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
        "columns": {
            "product": "产品货号",
            "basic_product": "基础产品",
            "location": "存放位置",
            "company_id": "公司",
            "seller_id": "店铺",
            "instance_id": "实例",
            "isSendLocation": "发货位置",
            "batch": "批次",
            "reserved_qty": "已预留库存",
            "multi_qty": "倍数",
            "time": "创建时间",
            "actions": "操作",
            "lang_id": "语言",
            "site_id": "站点",
            "encoding": "编码",
            "quantity": "库存数量"
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
            "pass": "审核"
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
