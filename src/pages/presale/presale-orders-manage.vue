<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form
            ref="dataForm"
            @submit="getPresaleOrderList"
            :column="1"
            :showSearch="showSearch"
        >
            <!--默认显示项-->
            <template #default>
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
                    :label="$t('columns.product_default_codes')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['product_default_codes']"
                        :style="{ width: '322px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
            </template>
            <template #action>
                <a-button type="primary" @click="onCancelOrders"
                    >{{ $t('action.cancel') }}
                </a-button>
                <a-button type="primary" @click="onDoneShipOrders"
                    >{{ $t('action.done') }}
                </a-button>
            </template>
        </data-form>
        <a-card class="margin-y" style="margin:0 !important">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: (keys, select_rows) => {
                        selectedRows = select_rows
                        selectedRowKeys = keys
                    }
                }"
                @on-page-change="getPresaleOrderList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                        onTrClick(record)
                    }
                "
                style="table-layout:fixed;"
                :scroll="{ y: 460 }"
                @change="sorter => onSortChange(sorter)"
            >
                <!-- <a-table-column
                    :title="$t('columns.id')"
                    key="id"
                    align="left"
                    dataIndex="id"
                >
                </a-table-column> -->
                <a-table-column key="id" align="center" width="40px">
                    <template slot-scope="row">
                        <a-icon
                            type="file-text"
                            @click="showDetailPage(row)"
                            style="color:blue;"
                        />
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.create_date')"
                    key="create_date"
                    align="left"
                    dataIndex="create_date"
                    :sorter="true"
                >
                    <template slot-scope="create_date">
                        {{ create_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.auto_reserve')"
                    key="auto_reserve"
                    align="center"
                    dataIndex="auto_reserve"
                >
                    <template slot-scope="auto_reserve">
                        <a-checkbox disabled :checked="auto_reserve" />
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.auto_create_label')"
                    key="auto_create_label"
                    align="center"
                    dataIndex="auto_create_label"
                >
                    <template slot-scope="auto_create_label">
                        <a-checkbox disabled :checked="auto_create_label" />
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.approve_time')"
                    key="approve_time"
                    align="left"
                    dataIndex="approve_time"
                >
                    <template slot-scope="approve_time">
                        {{ approve_time | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.who_approve')"
                    key="who_approve"
                    align="left"
                >
                    <template slot-scope="row">
                        <span>{{ userDict[row.who_approve] }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.file_name')"
                    key="file_name"
                    align="left"
                    dataIndex="file_name"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.state')"
                    key="state"
                    align="center   "
                    dataIndex="state"
                >
                    <template slot-scope="state">
                        <span
                            :style="
                                state == 'cancel' || state == 'confirm'
                                    ? 'color:red'
                                    : 'color:black'
                            "
                        >
                            {{ state }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.user')"
                    key="user"
                    align="center"
                >
                    <template slot-scope="row">
                        <span>{{ userDict[row.user] }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.product_default_codes')"
                    key="product_default_codes"
                    align="left"
                    dataIndex="product_default_codes"
                    width="20%"
                    ellipsis="true"
                >
                    <template slot-scope="product_default_codes">
                        <span
                            :title="product_default_codes"
                            v-clipboard="product_default_codes"
                            v-clipboard:success="clipboardSuccessHandler"
                            v-clipboard:error="clipboardErrorHandler"
                        >
                            {{ product_default_codes }}
                        </span>
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
        <a-card v-if="selectedRows[0]">
            <template>
                <section class="component customer-detail">
                    <a-tabs
                        defaultActiveKey="product_detail"
                        v-model="activeKey"
                        @change="e => paneChange(e)"
                    >
                        <a-tab-pane
                            :tab="$t('product_detail')"
                            key="product_detail"
                        >
                            <div style="margin-bottom: 8px">
                                Products:
                                <a-input
                                    disabled
                                    size="small"
                                    style="width:25%"
                                    v-model="products"
                                ></a-input>
                            </div>
                            <a-table
                                :dataSource="product_detail"
                                style="table-layout:fixed;"
                                :pagination="false"
                                :scroll="{ y: 300 }"
                                rowKey="id"
                                bordered
                            >
                                <a-table-column
                                    :title="$t('columns.default_code')"
                                    key="default_code"
                                    align="left"
                                >
                                    <template slot-scope="row"
                                        ><span :class="calcStyle(row)">
                                            {{ row.default_code }}</span
                                        ></template
                                    >
                                </a-table-column>
                                <a-table-column
                                    title="Warehouse"
                                    data-index="warehouse_id"
                                    key="warehouse_id"
                                    align="center"
                                >
                                </a-table-column>
                                <a-table-column
                                    :title="$t('columns.start_time')"
                                    key="start_time"
                                    align="center"
                                >
                                    <template slot-scope="row"
                                        ><span :class="calcStyle(row)">
                                            {{
                                                row.start_time | datetolocal
                                            }}</span
                                        ></template
                                    >
                                </a-table-column>
                                <a-table-column
                                    :title="$t('columns.end_time')"
                                    key="end_time"
                                    align="left"
                                >
                                    <template slot-scope="row"
                                        ><span :class="calcStyle(row)">
                                            {{
                                                row.end_time | datetolocal
                                            }}</span
                                        ></template
                                    >
                                </a-table-column>
                                <a-table-column
                                    :title="$t('columns.reserve_running')"
                                    key="reserve_running"
                                    align="center"
                                >
                                    <template
                                        slot-scope="row"
                                        :class="calcStyle(row)"
                                    >
                                        <a-checkbox
                                            disabled
                                            :checked="row.reserve_running"
                                        />
                                    </template>
                                </a-table-column>
                                <a-table-column
                                    :title="$t('columns.reserve_start_time')"
                                    key="reserve_start_time"
                                    align="left"
                                >
                                    <template slot-scope="row"
                                        ><span :class="calcStyle(row)">
                                            {{
                                                row.reserve_start_time
                                                    | datetolocal
                                            }}</span
                                        ></template
                                    >
                                </a-table-column>
                                <a-table-column
                                    :title="$t('columns.reserve_time')"
                                    key="reserve_time"
                                    align="left"
                                >
                                    <template slot-scope="row"
                                        ><span :class="calcStyle(row)">
                                            {{
                                                row.reserve_time | datetolocal
                                            }}</span
                                        ></template
                                    >
                                </a-table-column>
                                <a-table-column
                                    :title="$t('columns.who_reserve')"
                                    key="who_reserve"
                                    align="left"
                                >
                                    <template slot-scope="row"
                                        ><span :class="calcStyle(row)">
                                            {{ row.who_reserve }}</span
                                        ></template
                                    >
                                </a-table-column>
                                <a-table-column
                                    :title="$t('columns.create_label_running')"
                                    key="create_label_running"
                                    align="center"
                                >
                                    <template
                                        slot-scope="row"
                                        :class="calcStyle(row)"
                                    >
                                        <a-checkbox
                                            disabled
                                            :checked="row.create_label_running"
                                        />
                                    </template>
                                </a-table-column>
                                <a-table-column
                                    :title="
                                        $t('columns.create_label_start_time')
                                    "
                                    key="create_label_start_time"
                                    align="left"
                                >
                                    <template slot-scope="row"
                                        ><span :class="calcStyle(row)">
                                            {{
                                                row.create_label_start_time
                                                    | datetolocal
                                            }}</span
                                        ></template
                                    >
                                </a-table-column>
                                <a-table-column
                                    :title="$t('columns.create_label_time')"
                                    key="create_label_time"
                                    align="left"
                                >
                                    <template slot-scope="row"
                                        ><span :class="calcStyle(row)">
                                            {{
                                                row.create_label_time
                                                    | datetolocal
                                            }}</span
                                        ></template
                                    >
                                </a-table-column>
                                <a-table-column
                                    :title="$t('columns.who_create_label')"
                                    key="who_create_label"
                                    align="left"
                                >
                                    <template slot-scope="row"
                                        ><span :class="calcStyle(row)">
                                            {{ row.who_create_label }}</span
                                        ></template
                                    >
                                </a-table-column>
                                <a-table-column
                                    :title="$t('columns.exists_undone_picking')"
                                    key="exists_undone_picking"
                                    align="center"
                                >
                                    <template
                                        slot-scope="row"
                                        :class="calcStyle(row)"
                                    >
                                        <a-checkbox
                                            disabled
                                            :checked="row.exists_undone_picking"
                                        />
                                    </template>
                                </a-table-column>
                                <a-table-column
                                    :title="$t('columns.process_state')"
                                    key="process_state"
                                    align="center"
                                >
                                    <template slot-scope="row">
                                        <span :class="calcStyle(row)">
                                            {{ row.process_state }}
                                        </span>
                                    </template>
                                </a-table-column>
                                <a-table-column
                                    :title="$t('columns.process_info')"
                                    key="process_info"
                                    align="left"
                                    ellipsis="true"
                                >
                                    <template slot-scope="row">
                                        <span
                                            :title="row.process_info"
                                            v-clipboard="row.process_info"
                                            v-clipboard:success="
                                                clipboardSuccessHandler
                                            "
                                            v-clipboard:error="
                                                clipboardErrorHandler
                                            "
                                            :class="calcStyle(row)"
                                            style="cursor: pointer"
                                        >
                                            {{ row.process_info }}
                                        </span>
                                    </template>
                                </a-table-column>
                            </a-table>
                        </a-tab-pane>
                        <a-tab-pane :tab="$t('log')" key="log">
                            <LogView
                                :object_name="object_name"
                                :record_code="record_code"
                            ></LogView>
                        </a-tab-pane>
                    </a-tabs>
                </section>
            </template>
            <!-- <LogView :object_name="object_name" :record_code="record_code"></LogView> -->
        </a-card>
    </page-container>
</template>

<style>
.max300 {
    max-height: 300px;
    overflow-y: scroll;
}

.red-text {
    color: red;
}

.blue-text {
    color: blue;
}
</style>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { ReleasePreSaleService } from '../../services/release_presale.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import LogView from '~/shared/common/log-view.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import moment from 'moment'
import Clipboard from 'v-clipboard'

const datasModule = namespace('datasModule')
const userModule = namespace('userModule')

@Page({
    layout: 'workspace',
    name: 'presale-orders-manage'
})
@Component({
    components: {
        LogView
    }
})
export default class PresaleOrdersManage extends Vue {
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private data: any[] = []

    private releasePreSaleService = new ReleasePreSaleService()
    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private object_name = 'stock_picking_presale_product_wizard'

    private selectedRows: any[] = []

    private selectedRowKeys: any[] = []

    private record_code = ''

    private orderBy: any = 'create_date desc'

    private activeKey: any = 'product_detail'

    private product_detail: any[] = []

    private products: string = ''

    private userDict = {}

    private showSearch: any = true

    private showHideSearch(flag) {
        this.showSearch = flag
    }

    public mounted() {}

    @Watch('selectedRows')
    onselectedRowsChange() {
        if (
            this.activeKey == 'product_detail' &&
            this.selectedRows.length === 1
        ) {
            this.products = this.selectedRows[0].product_default_codes
            this.getProductDetail()
        } else {
            this.record_code = this.selectedRows[0].id
        }
    }

    public created() {
        this.getSystemuser()
        for (let i of this.systemUsers) {
            this.userDict[i.code] = i.name
        }
    }

    private onSortChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }

        this.getPresaleOrderList()
    }

    private getPresaleOrderList() {
        this.dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                product_default_codes: 'like',
                ...formConfig.condition
            })

            var nowConditions: any[] = []
            for (var item of params.query_condition) {
                if (item.value.constructor == Array) {
                    if (
                        item.value.length == 2 &&
                        item.value[0].constructor.name == 'Moment'
                    ) {
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '>=',
                            value: new Date(
                                item.value[0].format('YYYY-MM-DD') + ' 00:00:00'
                            )
                        })
                    }
                    if (
                        item.value.length == 2 &&
                        item.value[1].constructor.name == 'Moment'
                    ) {
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '<=',
                            value: new Date(
                                item.value[1].format('YYYY-MM-DD') +
                                    ' 23:59:59.999999'
                            )
                        })
                    }
                } else {
                    nowConditions.push(item)
                }
            }
            params.query_condition = nowConditions

            if (this.orderBy) {
                params['order_by'] = this.orderBy
            }

            this.releasePreSaleService
                .queryAll(
                    new RequestParams(params, {
                        page: this.pageService,
                        loading: this.loadingService
                    })
                )
                .subscribe(
                    data => {
                        this.data = data
                        if (!this.record_code) {
                            this.record_code = data[0].id
                        }
                        if (!this.selectedRows[0]) {
                            this.selectedRows = [data[0]]
                            this.selectedRowKeys = [data[0].id]
                        }
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private onTrClick(record) {
        let info = this.data.find(x => x.id === record)
        this.selectedRows = [info]
    }

    private paneChange(key) {
        if (key === 'log' && this.record_code != this.selectedRows[0].id) {
            this.record_code = this.selectedRows[0].id
        } else if (key === 'product_detail' && !this.product_detail.length) {
            this.getProductDetail()
        }
    }

    private getProductDetail() {
        this.releasePreSaleService
            .queryProduct(
                new RequestParams(
                    { wizard_id: this.selectedRows[0].id },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    data.map(x => {
                        x.who_reserve = this.userDict[x.who_reserve]
                        x.who_create_label = this.userDict[x.who_create_label]
                    })
                    this.product_detail = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onCancelOrders() {
        this.releasePreSaleService
            .cancel(
                new RequestParams(
                    { wizard_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('取消成功')
                    this.getPresaleOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDoneShipOrders() {
        this.releasePreSaleService
            .done(
                new RequestParams(
                    { wizard_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('手动完成成功')
                    this.getPresaleOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private clipboardSuccessHandler() {
        this.$message.success('已复制到粘贴板')
    }

    private clipboardErrorHandler() {
        this.$message.success('复制失败')
    }

    private showDetailPage(row) {
        this.$router.push({
            name: 'presale-detail',
            path: `/presale/presale-detail/${row.id}`,
            params: {
                id: row.id,
                name: 'Presale Detail ' + row.id
            }
        })
    }

    private calcStyle(row) {
        if (row.exists_undone_picking) {
            return 'blue-text'
        } else if (row.process_state == 'reserve') {
            return 'red-text'
        } else {
            return 'default-text'
        }
    }
}
</script>
<i18n>
{
    "en-us": {
        "desc": "",
        "columns": {
            "id": "id",
            "create_date": "Create Date",
            "auto_reserve": "Auto Reserve",
            "auto_create_label": "Auto Create Label",
            "approve_time": "Approve Time",
            "who_approve": "Who Approve",
            "file_name": "File Name",
            "user": "User",
            "state": "State",
            "product_default_codes": "Product Default Codes",
            "default_code": "Default Code",
            "start_time": "Start Time",
            "end_time": "End Time",
            "reserve_running": "Reserve Running",
            "reserve_start_time": "Reserve Start Time",
            "reserve_time": "Reserve Time",
            "who_reserve": "Who Reserve",
            "create_label_running": "Create Label Running",
            "create_label_start_time": "Create Label Start Time",
            "create_label_time": "Create Label Time",
            "who_create_label": "Who Create Label",
            "exists_undone_picking": "Exists Undone Picking",
            "process_state": "Process State",
            "process_info": "process Info"
        },
        "action": {
            "create": "Create",
            "done": "done",
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
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "yes": "Yes",
        "no": "No"
    },
    "zh-cn": {
        "desc": "",
        "columns": {
            "id": "id",
            "create_date": "创建时间",
            "auto_reserve": "自动预留",
            "auto_create_label": "自动出单",
            "approve_time": "确认时间",
            "who_approve": "确认人",
            "file_name": "文件名",
            "user": "用户",
            "state": "状态",
            "product_default_codes": "产品货号",
            "default_code": "SKU",
            "start_time": "开始时间",
            "end_time": "结束时间",
            "reserve_running": "正在预留",
            "reserve_start_time": "预留开始时间",
            "reserve_time": "预留时间",
            "who_reserve": "预留设置人",
            "create_label_running": "正在生成运单",
            "create_label_start_time": "开始创建运单时间",
            "create_label_time": "创建运单时间",
            "who_create_label": "运单生成人",
            "exists_undone_picking": "存在未完成picking",
            "process_state": "处理状态",
            "process_info": "处理信息"
        },
        "action": {
            "create": "新建",
            "done": "完成",
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
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "yes": "是",
        "no": "否"
    }
}
</i18n>
