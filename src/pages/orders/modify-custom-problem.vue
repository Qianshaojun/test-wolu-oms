<template>
    <page-container ref="pageContainer">
        <a-card class="margin-y">
            <a-button
                type="primary"
                :disabled="!selectedRowKeys.length"
                @click="batchSaveCP"
            >
                {{ $t('action.save') }}
            </a-button>
            <a-button type="primary" @click="uploadFile()" class="batch_btn"
                >{{ $t('action.excel_import') }}
            </a-button>
            <data-table
                :stripe="true"
                :data="data"
                rowKey="id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: (keys, select_rows) => {
                        selectedRows = select_rows
                        selectedRowKeys = keys
                    }
                }"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                        onTrClick(record)
                    }
                "
                style="table-layout:fixed;"
                :scroll="{ y: 380 }"
            >
                <a-table-column
                    :title="$t('columns.order')"
                    key="order"
                    data-index="order"
                    align="center"
                    width="7%"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.product')"
                    key="product"
                    data-index="product"
                    align="center"
                    width="7%"
                >
                    <!-- <template>
                        <a-select
                            :default-value="product"
                            size="small"
                            @change="
                                value =>
                                    handleChange(value, row.id, 'product')
                            "
                            style="width: 100%"
                        >
                            <a-select-option
                                :key="item.code"
                                v-for="item of productDropList"
                                :value="item.code"
                                >{{ item.name }}</a-select-option
                            >                                                                                                                                        
                        </a-select>                        
                    </template> -->
                </a-table-column>
                <a-table-column
                    :title="$t('columns.product_qty')"
                    key="product_qty"
                    data-index="product_qty"
                    align="center"
                    width="7%"
                >
                    <template slot-scope="product_qty, row">
                        <a-input-number
                            :default_value="product_qty"
                            @change="
                                e => handleChange(e, row.id, 'product_qty')
                            "
                            size="small"
                            decimalSeparator=","
                        />
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.ship_type')"
                    key="ship_type"
                    align="center"
                    width="7%"
                    data-index="ship_type"
                >
                    <template slot-scope="ship_type, row">
                        <a-select
                            :default-value="ship_type"
                            size="small"
                            @change="
                                value =>
                                    handleChange(value, row.id, 'ship_type')
                            "
                            style="width: 100%"
                        >
                            <a-select-option
                                :key="item.code"
                                v-for="item of dropList.ship_type"
                                :value="item.code"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.product_status')"
                    key="product_status"
                    align="center"
                    width="7%"
                    data-index="product_status"
                >
                    <template slot-scope="product_status, row">
                        <a-select
                            showSearch
                            :default-value="product_status"
                            size="small"
                            @change="
                                value =>
                                    handleChange(
                                        value,
                                        row.id,
                                        'product_status'
                                    )
                            "
                            style="width: 100%"
                            :filterOption="filterSelectOption"
                        >
                            <a-select-option
                                :key="item.code"
                                v-for="item of dropList.product_status"
                                :value="item.code"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.product_info')"
                    key="product_info"
                    data-index="product_info"
                    align="center"
                    width="7%"
                >
                    <template slot-scope="product_info, row">
                        <a-textarea
                            :value="product_info"
                            @change="
                                e =>
                                    handleChange(
                                        e.target.value,
                                        row.id,
                                        'product_info'
                                    )
                            "
                            size="small"
                            :rows="3"
                            :title="messageTips(product_info)"
                        />
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.w_warehouse_reason')"
                    key="w_warehouse_reason"
                    align="center"
                    width="7%"
                    data-index="w_warehouse_reason"
                >
                    <template slot-scope="w_warehouse_reason, row">
                        <a-select
                            showSearch
                            :default-value="w_warehouse_reason"
                            size="small"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '300px' }"
                            @change="
                                value =>
                                    handleChange(
                                        value,
                                        row.id,
                                        'w_warehouse_reason'
                                    )
                            "
                            style="width: 100%"
                            :filterOption="filterSelectOption"
                        >
                            <a-select-option
                                :key="item.code"
                                v-for="item of dropList.w_warehouse_reason"
                                :value="item.code"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.w_return_reason')"
                    key="w_return_reason"
                    align="center"
                    width="7%"
                    data-index="w_return_reason"
                >
                    <template slot-scope="w_return_reason, row">
                        <a-select
                            showSearch
                            :default-value="w_return_reason"
                            size="small"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '300px' }"
                            @change="
                                value =>
                                    handleChange(
                                        value,
                                        row.id,
                                        'w_return_reason'
                                    )
                            "
                            style="width: 100%"
                            :filterOption="filterSelectOption"
                        >
                            <a-select-option
                                :key="item.code"
                                v-for="item of dropList.w_return_reason"
                                :value="item.code"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.customer_reason')"
                    key="customer_reason"
                    align="center"
                    width="7%"
                    data-index="customer_reason"
                >
                    <template slot-scope="customer_reason, row">
                        <a-select
                            showSearch
                            :default-value="customer_reason"
                            size="small"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '300px' }"
                            @change="
                                value =>
                                    handleChange(
                                        value,
                                        row.id,
                                        'customer_reason'
                                    )
                            "
                            style="width: 100%"
                            :filterOption="filterSelectOption"
                        >
                            <a-select-option
                                :key="item.code"
                                v-for="item of dropList.customer_reason"
                                :value="item.code"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.product_reason')"
                    key="product_reason"
                    align="center"
                    width="7%"
                    data-index="product_reason"
                >
                    <template slot-scope="product_reason, row">
                        <a-select
                            showSearch
                            :default-value="product_reason"
                            size="small"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '300px' }"
                            @change="
                                value =>
                                    handleChange(
                                        value,
                                        row.id,
                                        'product_reason'
                                    )
                            "
                            style="width: 100%"
                            :filterOption="filterSelectOption"
                        >
                            <a-select-option
                                :key="item.code"
                                v-for="item of dropList.product_reason"
                                :value="item.code"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.logistic_reason')"
                    key="logistic_reason"
                    align="center"
                    width="7%"
                    data-index="logistic_reason"
                >
                    <template slot-scope="logistic_reason, row">
                        <a-select
                            showSearch
                            :default-value="logistic_reason"
                            size="small"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '300px' }"
                            @change="
                                value =>
                                    handleChange(
                                        value,
                                        row.id,
                                        'logistic_reason'
                                    )
                            "
                            style="width: 100%"
                            :filterOption="filterSelectOption"
                        >
                            <a-select-option
                                :key="item.code"
                                v-for="item of dropList.logistic_reason"
                                :value="item.code"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.warehouse_reason')"
                    key="warehouse_reason"
                    align="center"
                    width="7%"
                    data-index="warehouse_reason"
                >
                    <template slot-scope="warehouse_reason, row">
                        <a-select
                            showSearch
                            :default-value="warehouse_reason"
                            size="small"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '300px' }"
                            @change="
                                value =>
                                    handleChange(
                                        value,
                                        row.id,
                                        'warehouse_reason'
                                    )
                            "
                            style="width: 100%"
                            :filterOption="filterSelectOption"
                            1
                        >
                            <a-select-option
                                :key="item.code"
                                v-for="item of dropList.warehouse_reason"
                                :value="item.code"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.solution_type')"
                    key="solution_type"
                    align="center"
                    width="7%"
                    data-index="solution_type"
                >
                    <template slot-scope="solution_type, row">
                        <a-select
                            showSearch
                            mode="multiple"
                            :default-value="solution_type"
                            size="small"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '300px' }"
                            @change="
                                value =>
                                    handleChange(value, row.id, 'solution_type')
                            "
                            style="width: 100%"
                            :filterOption="filterSelectOption"
                        >
                            <a-select-option
                                :key="item.code"
                                v-for="item of dropList.solution_type"
                                this
                                :value="item.code"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </template>
                </a-table-column>
                <!-- <a-table-column
                    :title="$t('columns.stock_processed')"
                    key="stock_processed"
                    data-index="stock_processed"
                    align="center"
                    width="7%"
                >
                    <template slot-scope="stock_processed">
                        <a-date-picker
                            show-time
                            :default-value="
                                moment(
                                    stock_processed | datetolocal,
                                    'YYYY-MM-DD HH:mm'
                                )
                            "
                            @change="
                                value,
                                    dateString =>
                                        handleChange(
                                            dateString,
                                            row.id,
                                            'stock_processed'
                                        )
                            "
                        />
                    </template>
                </a-table-column> -->
                <!-- <a-table-column
                    :title="$t('columns.is_return_user')"
                    key="is_return_user"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="is_return_user">
                        <a-checkbox :checked="is_return_user" disabled>
                        </a-checkbox>
                    </template>                
                </a-table-column> -->
                <a-table-column
                    :title="$t('columns.operation')"
                    key="action"
                    align="center"
                    width="7%"
                >
                    <template slot-scope="row">
                        <!-- <a @click="inReturnWH(row)"> {{ $t('action.in_return_wh') }} </a> -->
                        <a @click="deleteCP(row)">
                            {{ $t('action.delete') }}
                        </a>
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { CustomProblemService } from '~/services/custom_problem.service'
import { UserService } from '~/services/user.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import UploadExcel from '~/shared/common/upload-excel.vue'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import { mapState } from 'vuex'
import router from '../../router'
import moment from 'moment'

const userModule = namespace('userModule')
const datasModule = namespace('datasModule')
const allUsersModule = namespace('allUsersModule')

@Page({
    layout: 'workspace',
    name: 'modify-custom-problem'
})
@Component({
    components: {
        UploadExcel
    }
})
export default class ModifyCustomProblem extends Vue {
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

    private cpService = new CustomProblemService()

    private userService = new UserService()
    // 表格数据源
    private data: any[] = []

    // 详情项
    private current: any = null

    private save_flag: any = 0

    private productDropList: any[] = []

    private showBtn: any = false
    //上一个详情项
    private lastInfo: any = null

    private from_flag: any = 0

    private handleChange(value, id, column) {
        const newData = [...this.data]
        const [target] = newData.filter(item => id === item.id)
        if (target) {
            target[column] = value
            this.data = newData
        }
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private messageTips(value) {
        if (value && value.length > 35) {
            value = value.slice(0, 35) + '@kss' + value.slice(35)
        }
        return value
    }

    // 表格选择项
    private selectedRowKeys: any[] = []

    private selectedRows: any[] = []

    private get rules() {
        return {}
    }

    private created() {
        this.updateAllUsers()
        this.queryCpReasonEnum()
        this.order_id = this.$route.params.orderId
        if (this.$route.params.orderList) {
            this.getCustomProblemList()
        } else if (this.$route.params.orderId) {
            this.getInitalCP()
        }
    }

    private order_id: any = ''

    private queryProductDropList() {
        this.cpService
            .queryProductDropList(
                new RequestParams(
                    {
                        order_id_list: [this.order_id]
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(data => {
                this.productDropList = data
            })
    }

    private dropList: any[] = []

    private queryCpReasonEnum() {
        this.cpService
            .queryCpReasonEnum(new RequestParams())
            .subscribe(data => {
                this.dropList = data[0]
            })
    }

    @allUsersModule.State
    private users

    @userModule.State
    private id

    @allUsersModule.Mutation('changeUsers')
    private changeUsers

    private searchUserName(user_id) {
        return this.users.filter(x => x.code === user_id)[0].name
    }

    private updateAllUsers() {
        var that = this
        this.userService.all(new RequestParams('')).subscribe(data => {
            that.changeUsers(data)
        })
    }

    private mounted() {}

    @Watch('$route.params.orderList')
    OnOrderList() {
        this.getCustomProblemList()
    }

    @Watch('$route.params.orderId')
    OnCreateNewCP() {
        // this.data = []
        this.order_id = this.$route.params.orderId
        this.getInitalCP()
    }

    /**
     * 获取CP
     */
    private getCustomProblemList() {
        if (this.$route.params.orderList) {
            let order_id_list = JSON.parse(this.$route.params.orderList)
            this.save_flag = 1
            this.cpService
                .queryByOrderList(
                    new RequestParams(
                        {
                            order_id_list: order_id_list
                        },
                        { loading: this.loadingService }
                    )
                )
                .subscribe(
                    data => {
                        this.data = data
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        }
    }

    private getInitalCP() {
        if (this.$route.params.orderId) {
            this.cpService
                .getInitalCP(
                    new RequestParams(
                        {
                            order_id: this.$route.params.orderId
                        },
                        { loading: this.loadingService }
                    )
                )
                .subscribe(data => {
                    this.data = data
                })
        }
    }

    private deleteCP(row) {
        let index = this.data.indexOf(row)
        this.data.splice(index, 1)
    }

    private batchInReturnWH() {
        this.cpService
            .batchInReturnWH(
                new RequestParams(
                    {
                        id_list: this.selectedRowKeys
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.getCustomProblemList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private batchSaveCP() {
        let save_data: any = []
        const newData = [...this.data]
        save_data = newData.filter(item =>
            this.selectedRowKeys.includes(item.id)
        )
        this.cpService
            .csSave(
                new RequestParams(
                    {
                        save_data: save_data,
                        save_flag: this.save_flag
                    },
                    { loading: this.loadingService }
                )
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

    private uploadFile() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/custom_problem/upload_file' },
                {
                    title: this.$t('action.excel_import')
                }
            )
            .subscribe(data => {})
    }
}
</script>

<style lang="less" scoped>
.batch_btn {
    margin-left: 25px;
}
</style>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "order": "Order",
            "product": "Product",
            "product_qty": "Quantity",
            "ship_type": "Ship",
            "product_status": "Product Status",
            "product_info": "Product Info",
            "customer_reason": "Customer Reason",
            "product_reason": "Product Reason",
            "logistic_reason": "Logistic Reason",
            "warehouse_reason": "Warehouse Reason",
            "solution_type": "Solution",
            "operation": "Operation",
            "w_warehouse_reason": "Lager Info",
            "w_return_reason": "Grund Ruckgabe",
            "validate_err": "Error Text",
            "operate": " "
        },
        "action": {
            "delete": "Delete",
            "save": "Save",
            "excel_import": "Excel Import"
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "yes": "Yes",
        "no": "No"
    },
    "zh-cn": {
        "desc": "",
        "columns": {
            "order": "订单",
            "product": "产品",
            "product_qty": "数量",
            "ship_type": "物流方式",
            "product_status": "产品状态",
            "product_info": "产品信息",
            "customer_reason": "客户原因",
            "product_reason": "产品原因",
            "logistic_reason": "物流原因",
            "warehouse_reason": "仓库原因",
            "solution_type": "处理方法",
            "operation": "操作",
            "w_warehouse_reason": "Lager Info",
            "w_return_reason": "Grund Ruckgabe",
            "validate_err": "Error Text",
            "operate": " "
        },
        "action": {
            "delete": "删除",
            "save": "保存",
            "excel_import": "Excel导入"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "yes": "是",
        "no": "否"
    }
}
</i18n>
