<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <data-form
            ref="dataForm"
            @submit="getDetailList"
            :column="2"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 15, offset: 0 }"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.reissue_order_number')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['picking_name']"
                        :style="{ width: '200px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.origin_order_number')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['origin_order_no']"
                        :style="{ width: '200px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.origin_order_articlenumber')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['src_default_code']"
                        :style="{ width: '200px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.manual_number')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['manual_code']"
                        :style="{ width: '200px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.reissue_content')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['default_code']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('fuzzy_search')"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.reissue_object')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['part_no']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('fuzzy_search')"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['z_category']"
                        style="width: 100px"
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
                        v-decorator="['z_sub_category']"
                        v-model="selectedList"
                        mode="multiple"
                        style="width: 200px;margin-left:10px"
                        placeholder="子类"
                        size="small"
                    >
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <template #collapse>
                <a-form-item
                    :label="$t('columns.reissue_type')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['resend_type', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onStatusChange(e)"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of $dict.ReissueType"
                            :key="item.value"
                            >{{ $t(item.label) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.customer_reason')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['customer_reason']"
                        :style="{ width: '200px' }"
                        size="small"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="i of reasonList.customer_reason"
                            :key="i.code"
                            :value="i.code"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.product_reason')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['sale_tag']"
                        :style="{ width: '200px' }"
                        size="small"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="i of productReasonList"
                            :key="i"
                            :value="i"
                            :title="i"
                        >
                            {{ i }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.shipment_reason')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['logistic_reason']"
                        :style="{ width: '200px' }"
                        size="small"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="i of reasonList.logistic_reason"
                            :key="i.code"
                            :value="i.code"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.warehouse_reason')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['warehouse_reason']"
                        :style="{ width: '200px' }"
                        size="small"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="i of reasonList.warehouse_reason"
                            :key="i.code"
                            :value="i.code"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.order_time')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['date_order']"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.reissue_time')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['picking_date']"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.create_uid')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['create_uid', { initialValue: '' }]"
                        :style="{ width: '300px' }"
                        size="small"
                        showSearch
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of customerServiceUser"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <!--操作行为项-->
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
                    @on-page-change="getDetailList"
                    @onClick="
                        record => {
                            selectedRowKeys = [record]
                            onTrClick(record)
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 1560, y: 600 }"
                    :queryUrl="queryUrl"
                    :menu_code="menu_code"
                    :queryCondition="queryConsition"
                    :selectedRowCnt="selectedRowKeys.length"
                >
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
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
                :scrollY="600"
                @rowClick="onTrClick"
            >
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
            </GroupbyTable>
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
import AddOceanShippingFee from '~/components/product/add-ocean-shipping-fee.vue'
import router from '../../router'
import { UserService } from '@/services/user.service'
import { CustomProblemService } from '@/services/custom_problem.service'
import { PickingService } from '../../services/picking.service'
import { ReportService } from '../../services/report.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'

const userModule = namespace('userModule')
const allUsersModule = namespace('allUsersModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'reissue-detail'
})
@Component({
    components: {
        AddOceanShippingFee,
        GroupbyTable,
        AutoColumnTable
    }
})
export default class ReissueDetail extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private pickingService = new PickingService()

    private userService = new UserService()

    private customProblemService = new CustomProblemService()

    private reportService = new ReportService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    // 表格数据源
    private data: any[] = []

    private reasonList: any = []

    private customerServiceUser: any[] = []

    private customerServiceUserDict: any = {}

    // 表格选择项
    private selectedRowKeys: any[] = []

    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []

    private groupbyList: any = []

    private allNameAuth: any = []

    private columnList: any = []

    private queryUrl: any = 'reports/query_all_resend_detail'

    private queryConsition: any = []

    private orderBy: any = ''

    private menu_code: any = ''

    private get rules() {
        return {}
    }

    public created() {
        this.getReasonList()
        this.getCustomerServiceUserList()
        this.getCn_cate()
        this.getProductReason([''])
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
        this.menu_code = this.dataForm.menu_code
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

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private getCustomerServiceUserList() {
        this.userService.customerServiceUser(new RequestParams({})).subscribe(
            data => {
                this.customerServiceUser = data
                for (let i of data) {
                    this.customerServiceUserDict[i.code] = i.name
                }
            },
            err => {
                this.$message.error(err.message)
            }
        )
    }

    private onSelectChange(rowkeys) {
        this.selectedRowKeys = rowkeys
    }

    private getReasonList() {
        this.customProblemService
            .queryCpReasonEnum(new RequestParams({}))
            .subscribe(
                data => {
                    if (data.length) {
                        this.reasonList = data[0]
                    }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    /**
     * 获取订单数据
     */
    private getDetailList() {
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
                            this.data = data.map((x, i) => {
                                x['id'] = i + 1
                                x.customer_reason = this.getReason(
                                    x.customer_reason,
                                    'customer'
                                )
                                x.warehouse_reason = this.getReason(
                                    x.warehouse_reason,
                                    'warehouse'
                                )
                                x.logistic_reason = this.getReason(
                                    x.logistic_reason,
                                    'logistic'
                                )
                                return x
                            })
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
            this.getDetailList()
        })
    }

    private getReason(value, type) {
        let list: any = []
        if (type == 'customer') {
            list = this.reasonList.customer_reason
        } else if (type == 'product') {
            list = this.reasonList.product_reason
        } else if (type == 'logistic') {
            list = this.reasonList.logistic_reason
        } else if (type == 'warehouse') {
            list = this.reasonList.warehouse_reason
        }

        let arr: any = value.split(',')
        arr = this.unique(arr)
        let ret: any = ''
        for (let i in arr) {
            let item = list.find(x => x.code == arr[i])
            if (item) {
                ret += ',' + item.name
            }
        }

        return ret.substring(1)
    }

    private unique(arr: any) {
        var hash: any = []
        for (let i in arr) {
            let item: any = arr[i]
            if (hash.indexOf(item) == -1) {
                hash.push(item)
            }
        }
        return hash
    }

    private getQueryCondition() {
        return new Promise((reslove, reject) => {
            this.dataForm
                .validateFields()
                .then((values: any) => {
                    if (this.selectedList.length > 0) {
                        values['z_sub_category'] = this.selectedList
                    }

                    let params: any = CommonService.createQueryCondition(
                        values,
                        {
                            picking_name: 'in_or_=',
                            default_code: 'like',
                            manual_code: 'in_or_=',
                            part_no: 'like',
                            origin_order_no: 'like',
                            z_sub_category: 'in',
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
        this.getDetailList()
    }

    private productReasonList: any = []

    public getProductReason(sku) {
        this.innerAction.setActionAPI(
            'product_management/query_product_reason_enum',
            CommonService.getMenuCode('common-menu')
        )
        this.publicService
            .query(
                new RequestParams(
                    {
                        sku_list: sku
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.productReasonList = data['']
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
            "reissue_order_number": "Reissue Order Number",
            "origin_order_number": "Origin Order Numbere",
            "origin_order_articlenumber": "Origin Order Articlenumber",
            "manual_number": "Manual Number",
            "reissue_content": "Reissue Content",
            "reissue_object": "Reissue object",
            "reissue_type": "Reissue Type",
            "customer_reason": "Customer Reason",
            "product_reason": "Product Reason",
            "shipment_reason": "Shipment Reason",
            "warehouse_reason": "Warehouse Reason(cs)",
            "order_time": "Order Time",
            "reissue_time": "Reissue Time",
            "reissue_qty": "Reissue Quantity",
            "create_uid": "Resend Customer Service",
            "z_sub_category": "Sub Category"
        },
        "action": {
            "create": "Create",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More"
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
            "reissue_order_number": "补发单号",
            "origin_order_number": "原订单号",
            "origin_order_articlenumber": "原订单货号",
            "manual_number": "说明书编号",
            "reissue_content": "补发内容",
            "reissue_object": "补发对象",
            "reissue_type": "补发类型",
            "customer_reason": "客户原因",
            "product_reason": "产品原因",
            "shipment_reason": "物流原因",
            "warehouse_reason": "仓库原因(cs)",
            "order_time": "订单时间",
            "reissue_time": "补发时间",
            "reissue_qty": "补发数量",
            "create_uid": "补发客服",
            "z_sub_category": "中文子类"
        },
        "action": {
            "create": "新建",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作"
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
