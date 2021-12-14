<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form
            ref="dataForm"
            @submit="getTicketsList"
            :column="2"
            :showHeader="false"
            :actions="true"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['name']"
                        :style="{ width: '300px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.sku_list')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['sku_list']"
                        :style="{ width: '300px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.dept_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="[
                            'dept_id',
                            {
                                initialValue: ''
                            }
                        ]"
                        :style="{ width: '300px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
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
                <a-form-item
                    :label="$t('columns.give_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['give_date']"
                        size="small"
                        format="YYYY-MM-DD HH:mm"
                        :style="{
                            width: '100%',
                            'max-width': '300px'
                        }"
                    />
                </a-form-item>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex">
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
                    @on-page-change="getTicketsList"
                    @onClick="
                        record => {
                            selectedRowKeys = [record]
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 1500, y: 400 }"
                >
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <template slot="sku_list" slot-scope="text, row">
                        <a-tooltip>
                            <template slot-scope="row">
                                {{ row.sku_list }}
                            </template>
                            <span :title="row.sku_list">
                                {{
                                    row.sku_list
                                        ? row.sku_list.length > 41
                                            ? row.sku_list.substr(0, 38) + '...'
                                            : row.sku_list
                                        : ''
                                }}
                            </span>
                        </a-tooltip>
                    </template>
                    <template slot="dept_id" slot-scope="text">
                        <span>{{ getDeptName(text) }}</span>
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
            >
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
                <template slot="sku_list" slot-scope="text, row">
                    <a-tooltip>
                        <template slot-scope="row">
                            {{ row.sku_list }}
                        </template>
                        <span :title="row.sku_list">
                            {{
                                row.sku_list
                                    ? row.sku_list.length > 41
                                        ? row.sku_list.substr(0, 38) + '...'
                                        : row.sku_list
                                    : ''
                            }}
                        </span>
                    </a-tooltip>
                </template>
                <template slot="dept_id" slot-scope="text">
                    <span>{{ getDeptName(text) }}</span>
                </template>
            </GroupbyTable>
        </a-card>
    </page-container>
</template>

<style>
.red-text {
    color: red;
}

.state-text {
    color: #28960c;
}

.orange-text {
    color: orange;
}

.default-text {
    color: #333;
}
</style>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { PageService } from '~/bootstrap/services/page.service'
import { HelpdeskService } from '../../services/helpdesk.service'
import PageContainer from '../../shared/components/page-container.vue'
import { OperateLogService } from '../../services/operatelog.service'
import { formConfig } from '../../config/form.config'
import TicketDetail from '../../components/ticket/ticket-detail.vue'
import DataForm from '~/shared/components/data-form.vue'
import { RequestParams } from '../../core/http'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { CommonService } from '../../shared/utils/common.service'
import { Mutation, namespace } from 'vuex-class'
import appConfig from '../../config/app.config'
import ModifyAddress from '../picking/modify-address.vue'
import { UserService } from '@/services/user.service'
import { MailService } from '../../services/mail.service'
import AssignUser from '../../components/ticket/assign-user.vue'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'requirement-schedule-reference'
})
@Component({
    components: {
        GroupbyTable,
        AutoColumnTable
    }
})
export default class RequirementScheduleReference extends Vue {
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    // 表格数据源
    private data: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private customerServiceUser: any[] = []

    private customerServiceUserDict: any = {}

    private sellerCodeList: any[] = []

    private siteList: any[] = []

    private ticketType: any[] = []

    private ticketDict: any = {}

    private userService = new UserService()

    private mailService = new MailService()

    private innerAction = new InnerActionService()
    private publicService = new PublicService()

    private detail: any = ''

    private orderBy: any = ''

    @datasModule.State
    private departmentList

    @datasModule.Action
    private getDepartmentList

    //分组相关变量
    private groupbyList: any = []
    private columnList: any = []
    private allNameAuth: any = []

    private queryUrl: any =
        'product_management/query_all_requirement_schedule_reference'

    private created() {
        this.getDepartmentList()
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private getTicketsList() {
        this.dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                name: 'like',
                sku_list: 'like',
                ...formConfig.condition
            })

            var nowConditions: any[] = []
            for (var item of params.query_condition) {
                if (item.value.constructor == Array && item.operate !== 'in') {
                    if (
                        item.value.length == 2 &&
                        item.value[0].constructor.name == 'Moment'
                    ) {
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '>=',
                            value: new Date(item.value[0])
                        })
                    }
                    if (
                        item.value.length == 2 &&
                        item.value[1].constructor.name == 'Moment'
                    ) {
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '<=',
                            value: new Date(item.value[1])
                        })
                    }
                } else {
                    nowConditions.push(item)
                }
            }
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
                            let msg: any = this.$t('tips.save_success')
                            this.data = data
                            this.selectedRowKeys = []
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
        })
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

    private getSellerNameList() {
        this.mailService.queryTicketSellerName(new RequestParams({})).subscribe(
            data => {
                this.sellerCodeList = data
            },
            err => {
                this.$message.error(err.message)
            }
        )
    }

    private update_requirement_schedule_state(state) {
        this.innerAction.setActionAPI(
            'product_management/update_requirement_schedule_state',
            CommonService.getMenuCode('product-purchase-schedual')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        schedule_id_list: this.selectedRowKeys,
                        state: state
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.getTicketsList()
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onTableChange(pagination, filters, sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getTicketsList()
    }

    private onSelectChange(rowkeys) {
        this.selectedRowKeys = rowkeys
    }

    private getDeptName(id) {
        let ret = ''
        let item = this.departmentList.find(x => x.id === id)
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
        "columns": {
            "name": "Name",
            "give_date": "give_date",
            "sku_list": "sku_list",
            "dept_id": "Department"
        },
        "form": {
            "status": "Status",
            "customer_code": "Customer Code",
            "company_name": "Company Name",
            "contract_start": "Contract Start Date",
            "remote_file_name": "Router url",
            "contract_end": "Contract End Date",
            "female": "Female",
            "field": "Field"
        },
        "action": {
            "update_requirement_schedule_state_purchase": "Purchase Submit",
            "update_requirement_schedule_state_back": "Back",
            "update_requirement_schedule_state_done": "Done"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "yes": "Yes",
        "no": "No"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "columns": {
            "name": "名称",
            "give_date": "交期",
            "sku_list": "SKU列表",
            "dept_id": "部门"
        },
        "form": {
            "status": "状态",
            "customer_code": "客户编号",
            "company_name": "公司名称",
            "contract_start": "合同开始日期",
            "contract_end": "合同结束日期",
            "field": "字段"
        },
        "action": {
            "update_requirement_schedule_state_purchase": "采购提交",
            "update_requirement_schedule_state_back": "退回",
            "update_requirement_schedule_state_done": "完成"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "yes": "是",
        "no": "否"
    }
}
</i18n>
