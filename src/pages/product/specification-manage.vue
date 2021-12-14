<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action>
            <!-- <a-button type="primary" @click="onCreate">{{
                $t('action.create')
            }}</a-button> -->
        </template>
        <data-form
            ref="dataForm"
            @submit="getManualList"
            :column="2"
            :lCol="{ span: 7 }"
            :wCol="{ span: 16, offset: 1 }"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.import_status')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'specification_url',
                            { initialValue: '' }
                        ]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="not_null" key="not_null"
                            >{{ $t('action.import') }}
                        </a-radio-button>
                        <a-radio-button value="null" key="null"
                            >{{ $t('action.not_import') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.create_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['create_date']"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.import_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['import_date']"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.final_import_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['final_import_date']"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.specification_code')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['specification_code']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.specification_version')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['specification_version']"
                        :style="{ width: '240px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="version of versionList"
                            :key="version"
                            :value="version"
                        >
                            {{ version }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        v-decorator="['sku']"
                        :style="{ width: '240px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    ></a-input>
                    <a-select
                        v-decorator="['operator', { initialValue: 'ilike' }]"
                        :style="{ width: '100px', 'margin-left': '5px' }"
                        size="small"
                    >
                        <a-select-option value="ilike">
                            {{ $t('forms.operator_like') }}
                        </a-select-option>
                        <a-select-option value="=">
                            {{ $t('forms.operator_equal') }}
                        </a-select-option>
                        <a-select-option value="in">
                            {{ $t('forms.operator_list') }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.seal_sample')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['seal_sample']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['cn_category']"
                        style="width: 120px"
                        @change="handleFatherCateChange"
                        placeholder="品类"
                        size="small"
                        allowClear
                    >
                        <a-select-option
                            v-for="cate in fatherCates"
                            :key="cate"
                        >
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                    <a-select
                        v-model="selectedList"
                        mode="multiple"
                        style="width: 28%;margin-left:5px"
                        placeholder="子类"
                        size="small"
                    >
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.state')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['state', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="draft" key="draft"
                            >{{ $t('dict.draft') }}
                        </a-radio-button>
                        <a-radio-button value="wait_upload" key="wait_upload"
                            >{{ $t('dict.wait_upload') }}
                        </a-radio-button>
                        <a-radio-button value="uploaded" key="uploaded"
                            >{{ $t('dict.uploaded') }}
                        </a-radio-button>
                        <a-radio-button
                            value="uploaded_inactive"
                            key="uploaded_inactive"
                            >{{ $t('dict.uploaded_inactive') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.active_state')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['active_state', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="active" key="active"
                            >{{ $t('dict.active') }}
                        </a-radio-button>
                        <a-radio-button value="inactive" key="inactive"
                            >{{ $t('dict.inactive') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="importProductManual()"
                    v-auth="'import'"
                >
                    {{ $t('action.import_product_specification') }}
                </a-button>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="exportProductManual()"
                    :disabled="!selectedRowKeys.length"
                >
                    {{ $t('action.export_product_specification') }}
                </a-button>
                <!-- <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="importSpecificationSealSample()"
                >
                    {{ $t('action.importSpecificationSealSample') }}
                </a-button> -->
            </template>
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important;">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getManualList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                @change="sorter => onTableChange(sorter)"
                style="table-layout:fixed;"
                :queryUrl="queryUrl"
                :queryCondition="queryCondition"
                :scroll="{ y: 500 }"
            >
                <a-table-column
                    :title="$t('columns.specification_code')"
                    key="specification_code"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.specification_code }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.view')"
                    key="specification_url"
                    width="6%"
                    align="center"
                >
                    <template slot-scope="row"
                        ><a :href="row.specification_url" target="_blank">
                            <a-icon
                                type="file"
                                v-if="row.specification_url"
                            /> </a
                    ></template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.specification_version')"
                    key="specification_version"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.specification_version }}
                    </template>
                </a-table-column>

                <a-table-column
                    title="SKU"
                    key="sku"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.sku }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.cn_category')"
                    key="cn_category"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.cn_category }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.cn_sub_category')"
                    key="cn_sub_category"
                    align="center"
                    width="15%"
                >
                    <template slot-scope="row">
                        {{ row.cn_sub_category }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.seal_sample')"
                    key="seal_sample"
                    align="center"
                    width="15%"
                >
                    <template slot-scope="row">
                        {{ row.seal_sample }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.create_date')"
                    key="create_date"
                    :sorter="true"
                    width="14%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.create_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.import_date')"
                    key="import_date"
                    :sorter="true"
                    width="14%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.import_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.final_import_date')"
                    key="final_import_date"
                    :sorter="true"
                    width="14%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.final_import_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.state')"
                    key="state"
                    align="center"
                    width="15%"
                >
                    <template slot-scope="row">
                        {{ row.state | dict2(stateList) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.active_state')"
                    key="active_state"
                    align="center"
                    width="15%"
                >
                    <template slot-scope="row">
                        {{ row.active_state | dict2(activeStateList) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.memo')"
                    key="memo"
                    align="center"
                    width="15%"
                >
                    <template slot-scope="row">
                        <a :title="row.memo">
                            <a-tooltip>
                                <template slot-scope="row">
                                    {{ row.memo }}
                                </template>
                                {{
                                    row.memo
                                        ? row.memo.substr(0, 10) + '...'
                                        : ''
                                }}
                            </a-tooltip>
                        </a>
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
                                <a-menu-item
                                    style="cursor:pointer;"
                                    @click="onEdit(row)"
                                    v-auth="'edit'"
                                    >{{ $t('action.edit') }}
                                </a-menu-item>
                                <a-menu-item
                                    style="cursor:pointer;"
                                    @click="onInactive(row, 'single')"
                                    v-if="row.active_state == 'active'"
                                    v-auth="'delete'"
                                    >{{ $t('action.onInactive') }}
                                </a-menu-item>
                                <a-menu-item
                                    style="cursor:pointer;"
                                    @click="onActive(row)"
                                    v-if="row.active_state == 'inactive'"
                                    >{{ $t('action.onActive') }}
                                </a-menu-item>
                                <a-menu-item
                                    style="cursor:pointer;"
                                    @click="onInactive(row, 'all')"
                                    v-auth="'delete'"
                                    >{{ $t('action.onInactiveAll') }}
                                </a-menu-item>
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
import UploadExcel from '~/shared/common/upload-excel.vue'
import SellerView from '~/components/seller_instance/seller_view.vue'
import SellerApiEdit from '~/components/seller_instance/seller-api-edit.vue'
import { ReportService } from '../../services/report.service'
import { ProductService } from '../../services/product.service'
import SpecificationEdit from '~/components/product/specification-edit.vue'
import appConfig from '@/config/app.config'
import { InnerActionService } from '~/bootstrap/services/inner.action.service'
import { PublicService } from '~/services/public.service'
import ModifyMemo from '@/components/cs_email_return/chat-modify-memo.vue'

const userModule = namespace('userModule')
const allUsersModule = namespace('allUsersModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'specification-manage'
})
@Component({
    components: {
        SellerView,
        SellerApiEdit,
        SpecificationEdit,
        ModifyMemo
    }
})
export default class SpecificationManage extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private reportService = new ReportService()

    private productService = new ProductService()

    private publicService = new PublicService()
    private innerActionService = new InnerActionService()

    // 表格数据源
    private data: any[] = []
    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []
    private versionList: any = []

    private orderBy: any = ''

    private queryUrl: any = '/product/query_all_product_specification'
    private queryCondition: any = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private stateList = [
        { code: 'draft', name: this.$t('dict.draft') },
        { code: 'wait_upload', name: this.$t('dict.wait_upload') },
        { code: 'draft_delay', name: this.$t('dict.draft_delay') },
        { code: 'uploaded', name: this.$t('dict.uploaded') },
        { code: 'uploaded_inactive', name: this.$t('dict.uploaded_inactive') }
    ]
    private activeStateList = [
        { code: 'active', name: this.$t('dict.active') },
        { code: 'inactive', name: this.$t('dict.inactive') }
    ]

    private get rules() {
        return {}
    }

    private importSpecificationSealSample() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/product/import_specification_seal_sample' },
                {
                    title: '签封样导入'
                }
            )
            .subscribe(
                data => {
                    this.getManualList()
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importProductManual() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/product/import_create_product_specification' },
                {
                    title: '工艺单导入'
                }
            )
            .subscribe(
                data => {
                    this.getManualList()
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private exportProductManual() {
        window.open(
            appConfig.server +
                '/product/export_product_specification?specification_id_list=' +
                this.selectedRowKeys
        )
    }

    public created() {
        this.getCn_cate()
        this.getVersionList()
    }

    private getCn_cate() {
        this.reportService.query_category_dict(new RequestParams()).subscribe(
            data => {
                this.cateDict = data[0]
                let cateData = data[0]
                for (let i in cateData) {
                    this.fatherCates.push(i)
                }
            },
            error => {
                this.$message.error(error.message)
            }
        )
    }

    private getVersionList() {
        this.productService
            .query_specification_version(new RequestParams({}))
            .subscribe(
                data => {
                    this.versionList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    /**
     * 获取订单数据
     */
    private getManualList() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                if (this.selectedList.length > 0) {
                    values['cn_sub_category'] = this.selectedList
                }
                let operator = values['operator']
                delete values['operator']

                if (operator == 'in' && values['sku']) {
                    values['sku'] = values['sku'].split(',')
                }
                let params: any = CommonService.createQueryCondition(values, {
                    sku: operator,
                    specification_code: 'in_or_like',
                    specification_version: '=',
                    cn_sub_category: 'in',
                    seal_sample: 'like',
                    active_state: '=',
                    state: '='
                })

                var nowConditions: any[] = []

                for (let item of params.query_condition) {
                    if (item.query_name == 'specification_url') {
                        item.operate =
                            item.value == 'null'
                                ? 'null'
                                : item.value == 'not_null'
                                ? 'not null'
                                : '='
                        if (item.operate != '=') {
                            item.value = item.operate
                        }
                    }
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
                            let vle = new Date(startDate.utc())
                            nowConditions.push({
                                query_name: item.query_name,
                                operate: '>=',
                                value: vle
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
                            let vle = new Date(endDate.utc())
                            // if (item.query_name === 'latest_ship_date_new') {
                            //     vle = new Date(
                            //         endDate.format('YYYY-MM-DD HH:mm:ss')
                            //     )
                            // }
                            nowConditions.push({
                                query_name: item.query_name,
                                operate: '<=',
                                value: vle
                            })
                        }
                    } else {
                        nowConditions.push(item)
                    }
                }

                params.query_condition = nowConditions
                this.queryCondition = nowConditions

                if (this.orderBy) {
                    params['order_by'] = this.orderBy
                }

                this.innerActionService.setActionAPI(
                    this.queryUrl,
                    CommonService.getMenuCode()
                )
                this.publicService
                    .queryPagination(
                        new RequestParams(params, {
                            loading: this.loadingService,
                            page: this.pageService,
                            innerAction: this.innerActionService
                        })
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
                this.$message.error('请检查查询条件')
            })
    }

    private onEdit(row) {
        this.$modal
            .open(
                SpecificationEdit,
                {
                    row: row,
                    versionList: this.versionList,
                    fatherCates: this.fatherCates,
                    cateDict: this.cateDict
                },
                {
                    title: this.$t('action.edit'),
                    width: '800px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getManualList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onActive(row) {
        this.innerActionService.setActionAPI(
            '/product/change_specification_active_state',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { id_list: [row.id], active_state: 'active' },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerActionService
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getManualList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onInactive(row, type) {
        this.$modal
            .open(
                ModifyMemo,
                {},
                {
                    title: '归档备注'
                }
            )
            .subscribe(
                data => {
                    this.innerActionService.setActionAPI(
                        '/product/change_specification_active_state',
                        CommonService.getMenuCode()
                    )
                    this.publicService
                        .modify(
                            new RequestParams(
                                {
                                    id_list: [row.id],
                                    active_state: 'inactive',
                                    memo: data,
                                    type: type
                                },
                                {
                                    loading: this.loadingService,
                                    innerAction: this.innerActionService
                                }
                            )
                        )
                        .subscribe(
                            data => {
                                this.$message.success('操作成功')
                                this.getManualList()
                            },
                            err => {
                                this.$message.error(err.message)
                            }
                        )
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDelete(row) {
        this.productService
            .delete_prod_specification_info(
                new RequestParams(
                    {
                        id_list: [row.id]
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('delete_success')
                    this.$message.success(msg)
                    this.getManualList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onBatchDelete(row) {
        this.productService
            .delete_prod_specification_info(
                new RequestParams(
                    {
                        id_list: this.selectedRowKeys
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('delete_success')
                    this.$message.success(msg)
                    this.getManualList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }

        this.getManualList()
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "dict": {
            "draft": "Wait draft upload",
            "wait_upload": "Wait final upload",
            "uploaded": "Final Uploaded",
            "draft_delay": "Draft Delay",
            "uploaded_inactive": "Uploaded Inactive",
            "active": "active",
            "inactive": "inactive"
        },
        "columns": {
            "specification_code": "Specification Code",
            "specification_version": "Specification Version",
            "seller_id": "Seller Name",
            "actions": "Actions",
            "view": "View",
            "cn_category": "Category",
            "cn_sub_category": "Sub Category",
            "import_date": "Draft Upload Date",
            "import_status": "Import Status",
            "state": "Upload State",
            "active_state": "Active state",
            "create_date": "Import date",
            "final_import_date": "Final Upload Date",
            "memo": "Memo",
            "seal_sample": "Seal Sample"
        },
        "action": {
            "create": "Create",
            "import_btn": "Import",
            "import_product_specification": "Import Product Specification",
            "export_product_specification": "Export Product Specification",
            "batch-create": "EXCEL Import",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "copy": "Copy",
            "pass": "Check",
            "onApiEdit": "Api Edit",
            "import": "Import",
            "not_import": "Not Import",
            "onActive": "Active",
            "onInactive": "Inactive",
            "onInactiveAll": "Inactive All Sku",
            "importSpecificationSealSample": "Import Seal Sample"
        },
        "forms": {
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search",
            "operator_list": "Multi Search"
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
        "dict": {
            "draft": "初稿待完成",
            "wait_upload": "终稿待上传",
            "uploaded": "终稿已上传",
            "draft_delay": "初稿已延时",
            "uploaded_inactive": "上传文件已归档",
            "active": "正常可用",
            "inactive": "归档不可用"
        },
        "columns": {
            "specification_code": "工艺单编号",
            "specification_version": "工艺单版本",
            "time": "创建时间",
            "actions": "操作",
            "view": "查看",
            "cn_category": "分类",
            "cn_sub_category": "子类",
            "import_date": "初稿上传时间",
            "import_status": "导入状态",
            "state": "上传进度",
            "active_state": "归档状态",
            "create_date": "导入时间",
            "final_import_date": "终稿上传时间",
            "memo": "归档备注",
            "seal_sample": "签封样编号"
        },
        "action": {
            "create": "新建",
            "import_btn": "导入",
            "import_product_specification": "导入工艺单",
            "export_product_specification": "导出工艺单",
            "batch-create": "EXCEL导入",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "copy": "复制",
            "pass": "审核",
            "onApiEdit": "api接口管理",
            "import": "已导入",
            "not_import": "未导入",
            "onActive": "恢复可用",
            "onInactive": "归档",
            "onInactiveAll": "归档所有关联SKU",
            "importSpecificationSealSample": "导入签封样"
        },
        "forms": {
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量查询"
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
