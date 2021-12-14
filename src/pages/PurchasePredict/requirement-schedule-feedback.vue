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
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['sku']"
                        :style="{ width: '300px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['z_sub_category']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.operator')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['operator', { initialValue: '' }]"
                        :style="{
                            width: '100%',
                            'max-width': '300px'
                        }"
                        size="small"
                        placeholder="Please Select"
                        :filterOption="filterSelectOption"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-select-option
                            :value="item.code"
                            v-for="item of systemUsers"
                            :key="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.warehouse_id')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['warehouse_id', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value
                            >{{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of $dict.WarehouseId"
                            :key="item.value"
                            >{{ $t(item.label) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.vendor_name')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['vendor_name', { initialValue: '' }]"
                        :style="{
                            width: '100%',
                            'max-width': '300px'
                        }"
                        size="small"
                        placeholder="Please Select"
                        :filterOption="filterSelectOption"
                        mode="multiple"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-select-option
                            :value="item.code"
                            v-for="item of vender_data"
                            :key="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
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
                        :style="{ width: '200px' }"
                        size="small"
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
                    :label="$t('columns.create_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        v-decorator="['create_date']"
                        size="small"
                    />
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
                        <a-radio-button value
                            >{{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="10"
                            >{{ $t('form.draft') }}
                        </a-radio-button>
                        <a-radio-button value="20">
                            采购提交
                        </a-radio-button>
                        <a-radio-button value="30">
                            库管提交
                        </a-radio-button>
                        <a-radio-button value="40">
                            运营提交
                        </a-radio-button>
                        <a-radio-button value="50">
                            完成
                        </a-radio-button>
                        <a-radio-button value="100">
                            退回
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </template>
            <template #action>
                <a-button type="primary" @click="import_schedual()"
                    >{{ $t('action.import') }}
                </a-button>
                <a-button
                    @click="update_requirement_schedule_state(20)"
                    :disabled="!selectedRowKeys.length"
                    type="primary"
                    >{{
                        $t('action.update_requirement_schedule_state_purchase')
                    }}
                </a-button>
                <a-button
                    @click="setModal1Visible(true)"
                    :disabled="!selectedRowKeys.length"
                    type="primary"
                    >{{ $t('action.update_requirement_schedule_state_back') }}
                </a-button>
                <a-button
                    @click="update_requirement_schedule_state(50)"
                    :disabled="!selectedRowKeys.length"
                    type="primary"
                    >{{ $t('action.update_requirement_schedule_state_done') }}
                </a-button>
                <a-button
                    @click="open_AttachmentList()"
                    :disabled="selectedRowKeys.length != 1"
                    type="primary"
                    >{{ $t('action.open_AttachmentList') }}
                </a-button>
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
                    <span slot="status" slot-scope="text, row"
                        >{{ row.status | dict2(stateList) }}
                    </span>
                    <template slot="user_render" slot-scope="text">
                        <span v-if="!text"></span>
                        <span v-else>{{ text | dict2(systemUsers) }}</span>
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
                <span slot="status" slot-scope="text, row"
                    >{{ row.status | dict2(stateList) }}
                </span>
                <template slot="user_render" slot-scope="text">
                    <span v-if="!text"></span>
                    <span v-else>{{ text | dict2(systemUsers) }}</span>
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
import UploadExcel from '~/shared/common/upload-excel.vue'
import { VendorService } from '../../services/vendor.service'
import PurchaseFeedback from '../../components/purchase/purchase-feedback.vue'
import AttachmentList from '~/shared/common/attachment-list.vue'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'requirement-schedule-feedback'
})
@Component({
    components: {
        UploadExcel,
        GroupbyTable,
        AutoColumnTable,
        PurchaseFeedback,
        AttachmentList
    }
})
export default class RequirementScheduleFeedback extends Vue {
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

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @datasModule.State
    private departmentList

    @datasModule.Action
    private getDepartmentList

    private innerAction = new InnerActionService()
    private publicService = new PublicService()

    private detail: any = ''

    private orderBy: any = ''

    //分组相关变量
    private groupbyList: any = []
    private columnList: any = []
    private allNameAuth: any = []

    private stateList = [
        {
            code: 10,
            name: '草稿'
        },
        {
            code: 20,
            name: '采购提交'
        },
        {
            code: 30,
            name: '库管提交'
        },
        {
            code: 40,
            name: '运营提交'
        },
        {
            code: 50,
            name: '完成'
        },
        {
            code: 100,
            name: '退回'
        }
    ]
    private queryUrl: any =
        'product_management/query_all_requirement_schedule_feedback'
    private vendorService = new VendorService()
    private vender_data: any = []

    private created() {
        this.getSystemuser()
        this.getDepartmentList()
        this.vendorService
            .get_vendor_ref_list(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    data.push({ code: '未找到', name: '未找到' })
                    this.vender_data = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
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

    private open_AttachmentList() {
        this.$modal
            .open(
                AttachmentList,
                {
                    virtual_table_name: 'purchase_schedule',
                    attachment_object_code: this.selectedRowKeys[0]
                },
                {
                    title: '附件',
                    width: '80%'
                }
            )
            .subscribe(
                () => {},
                err => {
                    this.$message.error(err)
                }
            )
    }

    private import_schedual() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        '/system_api/upload?inner_action=product_management/import_requirement_schedule&menu_code=' +
                        CommonService.getMenuCode()
                },
                {
                    title: 'Excel导入'
                }
            )
            .subscribe(
                () => {},
                err => {
                    this.$message.error(err)
                }
            )
    }

    private getTicketsList() {
        this.dataForm.validateFields().then((values: any) => {
            if (
                values['vendor_name'] == '' ||
                values['vendor_name'].length == 0
            ) {
                delete values['vendor_name']
            }
            let params: any = CommonService.createQueryCondition(values, {
                sku: 'like',
                warehouse_id: '=',
                operate: '=',
                status: '=',
                z_sub_category: 'like',
                vendor_name: 'in'
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

    private purchaseFeedback: any = ''

    private setModal1Visible(value) {
        this.$modal
            .open(
                PurchaseFeedback,
                {},
                {
                    title: '退回反馈'
                }
            )
            .subscribe(
                data => {
                    this.purchaseFeedback = data
                    this.update_requirement_schedule_state(100)
                },
                err => {
                    this.$message.error(err)
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
                        status: state,
                        purchase_feedback: this.purchaseFeedback
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
                    this.selectedRowKeys = []
                    this.purchaseFeedback = ''
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
            "vendor_name": "vendor",
            "warehouse_id": "warehouse",
            "calculate_date": "calculate date",
            "create_date": "schedule_date",
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
            "field": "Field",
            "draft": "Draft"
        },
        "action": {
            "update_requirement_schedule_state_purchase": "Purchase Submit",
            "update_requirement_schedule_state_back": "Back",
            "update_requirement_schedule_state_done": "Done",
            "import": "Import",
            "open_AttachmentList": "open Attachment"
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
            "name": "Name",
            "vendor_name": "供应商",
            "warehouse_id": "仓库",
            "calculate_date": "计算日期",
            "create_date": "排单日期",
            "dept_id": "部门"
        },
        "form": {
            "status": "状态",
            "customer_code": "客户编号",
            "company_name": "公司名称",
            "contract_start": "合同开始日期",
            "contract_end": "合同结束日期",
            "field": "字段",
            "draft": "草稿"
        },
        "action": {
            "update_requirement_schedule_state_purchase": "采购提交",
            "update_requirement_schedule_state_back": "退回",
            "update_requirement_schedule_state_done": "完成",
            "import": "上传排单计划",
            "open_AttachmentList": "打开附件列表"
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
