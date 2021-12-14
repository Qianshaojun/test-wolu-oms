<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form
            ref="dataForm"
            @submit="getDataList"
            :column="2"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 15, offset: 0 }"
            :actions="true"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.cn_main_category')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['cn_main_category']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('fuzzy_search')"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.purchase_user')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['purchase_user']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of purchase_list"
                            :key="item.name"
                            :value="item.name"
                        >
                            {{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.cn_category')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['cn_category']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('fuzzy_search')"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.purchase_follower')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['purchase_follower']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of purchase_list"
                            :key="item.name"
                            :value="item.name"
                        >
                            {{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.cn_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['cn_sub_category']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('fuzzy_search')"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.develop_team')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['develop_team']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of develop_team_list"
                            :key="item.name"
                            :value="item.name"
                        >
                            {{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.department')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['department']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        @change="e => onDeptChange(e)"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of sale_dept_list"
                            :key="item.name"
                            :value="item.name"
                        >
                            {{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.status')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['status', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="20">
                            {{ $t('action.open') }}
                        </a-radio-button>
                        <a-radio-button :value="200">
                            {{ $t('action.close') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.department_manager')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['department_manager']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of sale_dept_leader_list"
                            :key="item.name"
                            :value="item.name"
                        >
                            {{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.write_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['write_date', { initialValue: [] }]"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                    <a-button
                        @click="fillToday"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.today') }}
                    </a-button>
                    <a-button
                        @click="fill3days"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.3days') }}
                    </a-button>
                    <a-button
                        @click="fill7days"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.7days') }}
                    </a-button>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.operator')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['operator']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of operator_list"
                            :key="item.name"
                            :value="item.name"
                        >
                            {{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-button type="primary" @click="onCreate" v-auth="'create'">
                    {{ $t('action.create') }}
                </a-button>
                <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay">
                        <a-menu-item
                            @click="onEditCategory()"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.edit_category_group') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="onEditCategoryGroupAttr()"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.edit_category_group_attr') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="onCopyCategoryGroupAttr()"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.copy_category_group_attr') }}
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 2px">
                        {{ $t('action.edit_category') }}
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown>
                <!-- <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay">
                        <a-menu-item @click="onImportCategory()"
                            >{{ $t('action.import_category_group') }}
                        </a-menu-item>
                        <a-menu-item @click="onImportCategoryGroupAttr()"
                            >{{ $t('action.import_category_group_attr') }}
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 2px">
                        {{ $t('action.import') }}
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown> -->
                <a-popconfirm
                    :title="$t('action.delete_confirm')"
                    :okText="$t('action.delete')"
                    :cancelText="$t('action.cancel')"
                    placement="right"
                    @confirm="onBatchDelete()"
                    :disabled="!selectedRowKeys.length"
                >
                    <a-button
                        type="primary"
                        :disabled="!selectedRowKeys.length"
                        v-auth="'delete'"
                    >
                        {{ $t('action.delete') }}
                    </a-button>
                </a-popconfirm>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important;">
            <div v-if="!groupbyList.length">
                <AutoColumnTable
                    :stripe="true"
                    :data="data"
                    :page="pageService"
                    :queryNameAuth="allNameAuth"
                    rowKey="id"
                    :columns="columnList"
                    :rowSelection="{
                        selectedRowKeys: selectedRowKeys,
                        onChange: keys => (selectedRowKeys = keys)
                    }"
                    @on-page-change="getDataList"
                    @onClick="
                        record => {
                            selectedRowKeys = [record]
                            onTrClick(record)
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 1560, y: 500 }"
                    :queryUrl="queryUrl"
                    :menu_code="menu_code"
                    :queryCondition="queryConsition"
                    :selectedRowCnt="selectedRowKeys.length"
                >
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <span slot="user_render" slot-scope="text"
                        >{{ text | dict2(systemUsers) }}
                    </span>
                    <template slot="status" slot-scope="text">
                        <span v-if="text == 20"> {{ $t('action.open') }}</span>
                        <span v-else>{{ $t('action.close') }}</span>
                    </template>
                    <template slot="operation" slot-scope="row">
                        <a-dropdown>
                            <a-menu slot="overlay">
                                <!-- <a-menu-item
                                    @click="onEdit(row)"
                                    v-auth="'edit'"
                                >
                                    {{ $t('action.edit') }}
                                </a-menu-item> -->
                                <a-popconfirm
                                    :title="$t('action.delete_confirm')"
                                    :okText="$t('action.delete')"
                                    :cancelText="$t('action.cancel')"
                                    placement="left"
                                    @confirm="onDelete(row)"
                                >
                                    <a-menu-item
                                        style="cursor:pointer;margin-left:12px;"
                                        class="btnDel"
                                        v-auth="'item_delete'"
                                    >
                                        {{ $t('action.delete') }}
                                    </a-menu-item>
                                </a-popconfirm>
                            </a-menu>
                            <a-button>
                                {{ $t('action.more') }}
                                <a-icon type="down" />
                            </a-button>
                        </a-dropdown>
                    </template>
                </AutoColumnTable>
            </div>
            <GroupbyTable
                v-else
                ref="groupbyTable"
                :groupByColumn="groupbyList"
                :oColumns="columnList"
                :queryNameAuth="allNameAuth"
                :urlStr="queryUrl"
                @selectChange="onSelectChange"
                :scrollX="1560"
                :scrollY="500"
                @rowClick="onTrClick"
            >
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
                <span slot="user_render" slot-scope="text"
                    >{{ text | dict2(systemUsers) }}
                </span>
                <template slot="status" slot-scope="text">
                    <span v-if="text == 20"> {{ $t('action.open') }}</span>
                    <span v-else>{{ $t('action.close') }}</span>
                </template>
                <template slot="operation" slot-scope="row">
                    <a-dropdown>
                        <a-menu slot="overlay">
                            <!-- <a-menu-item @click="onEdit(row)" v-auth="'edit'">
                                {{ $t('action.edit') }}
                            </a-menu-item> -->
                            <a-popconfirm
                                :title="$t('action.delete_confirm')"
                                :okText="$t('action.delete')"
                                :cancelText="$t('action.cancel')"
                                placement="left"
                                @confirm="onDelete(row)"
                            >
                                <a-menu-item
                                    style="cursor:pointer;margin-left:12px;"
                                    class="btnDel"
                                    v-auth="'item_delete'"
                                >
                                    {{ $t('action.delete') }}
                                </a-menu-item>
                            </a-popconfirm>
                        </a-menu>
                        <a-button>
                            {{ $t('action.more') }}
                            <a-icon type="down" />
                        </a-button>
                    </a-dropdown>
                </template>
            </GroupbyTable>
        </a-card>
        <a-card class="margin-y" v-if="current">
            <SellerView
                :seller="current"
                :activeFeeTypes="activeFeeTypes"
            ></SellerView>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import { ReportService } from '../../services/report.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import ProductCateEdit from '@/components/product/product-cate-edit.vue'
import Application from '../../core/application'
import moment from 'moment'
import { SystemService } from '../../services/system.service'
import ProductExtraAttrEdit from '@/components/product/product-extra-attr-edit.vue'
import ProductExtraAttrCopy from '@/components/product/product-extra-attr-copy.vue'
import UploadExcel from '@/shared/common/upload-excel.vue'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'product-category-manage'
})
@Component({
    components: {
        GroupbyTable,
        AutoColumnTable
    }
})
export default class ProductCategoryManage extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private reportService = new ReportService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private systemService = new SystemService()

    // 表格数据源
    private data: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private current = null

    private groupbyList: any = []

    private allNameAuth: any = []

    private columnList: any = []

    private queryUrl: any = 'category/query_all_product_category'

    private queryConsition: any = []

    private orderBy: any = ''

    private menu_code: any = ''

    private sale_dept_list: any = [] //运营部门
    private sale_dept_leader_list: any = [] //运营部门经理
    private operator_list: any = [] //运营人员
    private purchase_list: any = [] //采购人员
    private purchase_follower_list: any = [] //跟单人员
    private develop_team_list: any = [] //开发团队

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private get rules() {
        return {}
    }

    public created() {
        this.getSystemuser()
        this.getSaleDeptList()
        this.getDevelopTeamList()
        this.getPurchaseFollowerList()
        this.getPurchaseList()
        // this.getOperatorList()
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
        this.menu_code = this.dataForm.menu_code
    }

    private getSaleDeptList() {
        let that = this
        this.innerAction.setActionAPI(
            'common_management/query_operator_dept_list',
            CommonService.getMenuCode('department-management')
        )
        this.publicService
            .query(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.sale_dept_list = data.map(x => {
                        let item: any = {}
                        for (let key in x) {
                            item['code'] = key
                            item['name'] = x[key]
                        }
                        return item
                    })
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getDevelopTeamList() {
        this.innerAction.setActionAPI(
            'system/query_sub_department',
            CommonService.getMenuCode('department-management')
        )
        this.publicService
            .query(
                new RequestParams(
                    { parent_id: 0 },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.develop_team_list = data.map(x => {
                        return { code: x.id, name: x.dept_name }
                    })
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    // private getOperatorList() {
    //     this.systemService
    //         .queryRoleUser(
    //             new RequestParams(
    //                 {
    //                     role_code: 'a86f37bc98ce11ea87fd0242ac120002',
    //                     login_name: null
    //                 },
    //                 { loading: this.loadingService }
    //             )
    //         )
    //         .toPromise()
    //         .then(
    //             data => {
    //                 this.operator_list = data.map(x => {
    //                     return {
    //                         code: x.user_id,
    //                         name: x.login_name
    //                     }
    //                 })
    //                 let that = this
    //                 setTimeout(function() {
    //                     that.getPurchaseList()
    //                 }, 1000)
    //             },
    //             err => {
    //                 this.$message.error(err.message)
    //             }
    //         )
    // }

    private getPurchaseList() {
        let service = new SystemService()
        service
            .queryRoleUser(
                new RequestParams(
                    {
                        role_code: '0786befe98d011ea928c0242ac120002',
                        login_name: null
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.purchase_list = data.map(x => {
                        return {
                            code: x.user_id,
                            name: x.login_name
                        }
                    })
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getPurchaseFollowerList() {
        this.innerAction.setActionAPI(
            'system/query_sub_department',
            CommonService.getMenuCode('department-management')
        )
        this.publicService
            .query(
                new RequestParams(
                    { parent_id: 6 },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.purchase_follower_list = data
                        .find(x => x.id == 7)
                        .user_list.map(x => {
                            return { code: x[0], name: x[1] }
                        })
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onGroupbyListChange() {
        this.groupbyList = this.dataForm.checkedGroupbyList
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    /**
     * 获取订单数据
     */
    private getDataList() {
        let params: any = {}
        this.getQueryCondition().then(nowConditions => {
            this.queryConsition = nowConditions
            if (this.groupbyList.length) {
                let groupbyTable: any = this.$refs.groupbyTable
                groupbyTable.getFirstTableData(nowConditions)
            } else {
                params.query_condition = nowConditions
                if (this.orderBy) {
                    params['order_by'] = this.orderBy
                }
                this.innerAction.setActionAPI(
                    this.queryUrl,
                    CommonService.getMenuCode()
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
                            this.data = data.map(x => x)
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
        })
    }

    private onStatusChange(e) {
        this.$nextTick(function() {
            this.getDataList()
        })
    }

    private getQueryCondition() {
        return new Promise((reslove, reject) => {
            this.dataForm
                .validateFields()
                .then((values: any) => {
                    let params: any = CommonService.createQueryCondition(
                        values,
                        {
                            cn_main_category: 'like',
                            de_category: 'like',
                            cn_sub_category: 'like',
                            group_category: 'like',
                            cn_category: 'like',
                            de_sub_category: 'like',
                            department_manager: 'like',
                            department: 'like',
                            purchase_user: 'like',
                            operator: 'like',
                            ...formConfig.condition
                        }
                    )

                    var nowConditions: any[] = []
                    for (var item of params.query_condition) {
                        if (
                            item.value.constructor == Array &&
                            item.operate !== 'in'
                        ) {
                            if (
                                item.value.length == 2 &&
                                item.value[0].constructor.name == 'Moment'
                            ) {
                                let startDate: any = {}
                                for (let key in item.value[0]) {
                                    startDate[key] = item.value[0][key]
                                }
                                nowConditions.push({
                                    query_name: item.query_name,
                                    operate: '>=',
                                    value: new Date(startDate.utc())
                                })
                            }
                            if (
                                item.value.length == 2 &&
                                item.value[1].constructor.name == 'Moment'
                            ) {
                                let endDate: any = {}
                                for (let key in item.value[1]) {
                                    endDate[key] = item.value[1][key]
                                }
                                nowConditions.push({
                                    query_name: item.query_name,
                                    operate: '<=',
                                    value: new Date(endDate.utc())
                                })
                            }
                        } else {
                            nowConditions.push(item)
                        }
                    }
                    reslove(nowConditions)
                })
                .catch(err => {
                    this.$message.error(JSON.stringify(err))
                })
        })
    }

    private onTrClick(record) {
        let info = this.data.find(x => x.id == record)
        // if (info) {
        //     this.onDetail(info)
        // } else if (this.groupbyList.length) {
        //     this.onDetail({ id: record })
        // }
    }

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getDataList()
    }

    private onCreate() {
        this.$modal
            .open(
                ProductCateEdit,
                {
                    saveFlag: 0,
                    row: {},
                    sale_dept_list: this.sale_dept_list,
                    purchase_list: this.purchase_list,
                    purchase_follower_list: this.purchase_follower_list,
                    develop_team_list: this.develop_team_list
                },
                {
                    title: this.$t('action.create'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('save_success')
                this.$message.success(msg)
                this.getDataList()
            })
    }

    private onEdit(row) {
        this.$modal
            .open(
                ProductCateEdit,
                {
                    saveFlag: row.save_flag,
                    row: row,
                    sale_dept_list: this.sale_dept_list,
                    purchase_list: this.purchase_list,
                    purchase_follower_list: this.purchase_follower_list,
                    develop_team_list: this.develop_team_list
                },
                {
                    title: row.save_flag
                        ? this.$t('action.edit')
                        : this.$t('action.create'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('save_success')
                this.$message.success(msg)
                this.getDataList()
            })
    }

    private onBatchDelete() {
        this.innerAction.setActionAPI(
            'category/delete_product_category',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { ids: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('删除成功!')
                    this.data = this.data.filter(
                        x => !this.selectedRowKeys.includes(x.id)
                    )
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDelete(row) {
        this.innerAction.setActionAPI(
            'category/delete_product_category',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { ids: [row.id] },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('删除成功!')
                    this.data = this.data.filter(x => x.id != row.id)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onSelectChange(rowkeys) {
        this.selectedRowKeys = rowkeys
    }

    private moment = moment

    private initialDate: any = []

    private fillToday() {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime())),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()

        this.initialDate = [startDate, endDate]
        values['write_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fill3days() {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 48 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['write_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fill7days() {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 144 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['write_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private formatDate(time) {
        // 空数据处理
        if (time === null || time === undefined || time === '') {
            return ''
        }

        let y = time.getFullYear()
        let m = time.getMonth() + 1
        let d = time.getDate()
        let h = time.getHours()
        let mi = time.getMinutes()
        let s = time.getSeconds()
        m = m < 10 ? `0${m}` : m
        d = d < 10 ? `0${d}` : d
        h = h < 10 ? `0${h}` : h
        mi = mi < 10 ? `0${mi}` : mi
        s = s < 10 ? `0${s}` : s
        return `${y}-${m}-${d} 23:59`
    }

    private onEditCategory() {
        if (this.selectedRowKeys.length > 1) {
            this.$message.error('只能选择一条数据进行操作')
            return
        }
        let row = this.data.find(x => x.id == this.selectedRowKeys[0])
        if (row) {
            row['save_flag'] = 1
            this.onEdit(row)
        } else {
            this.$message.error('数据错误，请联系管理员')
        }
    }

    private onEditCategoryGroupAttr() {
        if (this.selectedRowKeys.length > 1) {
            this.$message.error('只能选择一条数据进行操作')
            return
        }
        let row = this.data.find(x => x.id == this.selectedRowKeys[0])
        if (row) {
            this.getSubCatesAttr(row.id).then(data => {
                var save_flag = 0
                if (data.length == 0) {
                    data.push({
                        id: 0
                    })
                }
                if (data[0].id) {
                    save_flag = 1
                }
                data[0].cn_category = row.cn_category
                data[0].cn_sub_category = row.cn_sub_category
                this.$modal
                    .open(
                        ProductExtraAttrEdit,
                        {
                            row: data[0],
                            saveFlag: save_flag
                        },
                        {
                            title: this.$t('action.edit'),
                            width: '800px'
                        }
                    )
                    .subscribe(
                        data => {
                            this.$message.success('操作成功')
                            this.getDataList()
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
        } else {
            this.$message.error('数据错误，请联系管理员')
        }
    }

    private onCopyCategoryGroupAttr() {
        if (this.selectedRowKeys.length > 1) {
            this.$message.error('只能选择一条数据进行操作')
            return
        }
        let row = this.data.find(x => x.id == this.selectedRowKeys[0])
        if (row) {
            this.getSubCatesAttr(row.id).then(data => {
                if (data.length == 0) {
                    data.push({
                        id: 0
                    })
                }
                data[0].cn_category = row.cn_category
                data[0].cn_sub_category = row.cn_sub_category
                this.$modal
                    .open(
                        ProductExtraAttrCopy,
                        {
                            row: data[0],
                            saveFlag: 0
                        },
                        {
                            title: this.$t('action.copy'),
                            width: '800px'
                        }
                    )
                    .subscribe(
                        data => {
                            this.$message.success('操作成功')
                            this.getDataList()
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
        } else {
            this.$message.error('数据错误，请联系管理员')
        }
    }

    private onImportCategory() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        'xxxxxxxxxxxxxxxxxxxxxxxxxxx&menu_code=' +
                        CommonService.getMenuCode('product-category_manage'),
                    attachmentUrlPath:
                        '/system/download_import_template?type=ProductPriceImport'
                },
                {
                    title: this.$t('action.import_category_group'),
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onImportCategoryGroupAttr() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        'xxxxxxxxxxxxxxxxxxxxxxxxxxx&menu_code=' +
                        CommonService.getMenuCode('product-category_manage'),
                    attachmentUrlPath:
                        '/system/download_import_template?type=ProductPriceImport'
                },
                {
                    title: this.$t('action.import_category_group_attr'),
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private async getSubCatesAttr(id) {
        this.innerAction.setActionAPI(
            'category/query_sub_category_attributes',
            CommonService.getMenuCode('product-cate-attr')
        )
        return await this.publicService
            .query(
                new RequestParams(
                    { category_id: id },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .toPromise()
    }

    private onDeptChange(e) {
        let item = this.sale_dept_list.find(x => x.name == e)
        if (!item) {
            return
        }
        this.innerAction.setActionAPI(
            'common_management/query_dept_users',
            CommonService.getMenuCode('department-management')
        )
        this.publicService
            .query(
                new RequestParams(
                    { dept_id: parseInt(item.code) },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    if (data.users.length) {
                        this.operator_list = data.users.map((x, i) => {
                            return { code: i, name: x }
                        })
                    }
                    if (data.leaders.length) {
                        this.sale_dept_leader_list = data.leaders.map(
                            (x, i) => {
                                return { code: i, name: x }
                            }
                        )
                    }
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
            "requirement_period": "requirement_period",
            "de_category": "de_category",
            "category_state": "category_state",
            "purchase_user": "purchase_user",
            "operator": "operator",
            "develop_team": "develop_team",
            "cn_sub_category": "cn_sub_category",
            "group_category": "group_category",
            "purchase_period": "purchase_period",
            "cn_category": "cn_category",
            "department_manager": "department_manager",
            "purchase_follower": "purchase_follower",
            "de_sub_category": "de_sub_category",
            "department": "department",
            "sub_category_profit": "sub_category_profit",
            "write_date": "Write Date",
            "category_state": "Category State",
            "cn_main_category": "Cn Main Category",
            "status": "Status"
        },
        "action": {
            "create": "Create",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "delete_confirm": "Confirm to Delete?",
            "open": "Enable",
            "close": "Disable",
            "today": "1day",
            "3days": "3day",
            "7days": "7day",
            "edit_category": "Edit",
            "edit_category_group": "Edit Category Group",
            "edit_category_group_attr": "Edit Category Group Attr",
            "copy_category_group_attr": "Copy Category Group Attr",
            "import": "Import",
            "import_category_group": "Import Category Group",
            "import_category_group_attr": "Import Category Group Attr",
            "copy": "Copy"
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
            "requirement_period": "补货周期",
            "de_category": "二级分类-DE",
            "category_state": "品类状态",
            "purchase_user": "采购人员",
            "operator": "运营人员",
            "develop_team": "开发团队",
            "cn_sub_category": "三级分类",
            "purchase_period": "采购周期",
            "cn_category": "二级分类",
            "department_manager": "运营部门经理",
            "purchase_follower": "跟单人员",
            "de_sub_category": "三级分类-DE",
            "department": "运营部门",
            "sub_category_profit": "毛利率",
            "write_date": "更新日期",
            "cn_main_category": "一级分类",
            "status": "启用状态"
        },
        "action": {
            "create": "新建",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "delete_confirm": "确定要删除吗?",
            "open": "启用",
            "close": "停用",
            "today": "1天内",
            "3days": "3天内",
            "7days": "7天内",
            "edit_category": "编辑",
            "edit_category_group": "编辑三级分类",
            "edit_category_group_attr": "编辑品类额外属性",
            "copy_category_group_attr": "复制品类额外属性",
            "import": "导入",
            "import_category_group": "导入三级分类",
            "import_category_group_attr": "导入产品品类属性",
            "copy": "复制"
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
