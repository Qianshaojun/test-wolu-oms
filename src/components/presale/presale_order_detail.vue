<template>
    <section class="component order-detail">
        <a-card>
            <div style="margin-left:30px;">
                <a-button type="default" @click="onCancelOrders"
                    >{{ $t('action.cancel') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="onDoneShipOrders"
                    style="margin-left:10px;"
                    >{{ $t('action.done') }}
                </a-button>
            </div>
            <div>
                <label-container :column="1">
                    <label-item
                        :label="$t('columns.product_default_codes')"
                        style="word-break:break-all;"
                        ><span :title="data.product_default_codes">{{
                            data.product_default_codes &&
                            data.product_default_codes.length > 95
                                ? data.product_default_codes.substr(0, 92) +
                                  '...'
                                : data.product_default_codes
                        }}</span>
                    </label-item>
                </label-container>
                <label-container :column="2">
                    <label-item :label="$t('columns.create_date')">
                        {{ data.create_date | datetolocal }}
                    </label-item>
                    <label-item :label="$t('columns.approve_time')"
                        >{{ data.approve_time | datetolocal }}
                    </label-item>
                    <label-item :label="$t('columns.who_approve')">
                        {{ data.who_approve | dict2(systemUsers) }}
                    </label-item>
                    <label-item :label="$t('columns.user')">
                        {{ data.user | dict2(systemUsers) }}
                    </label-item>
                </label-container>
                <label-container :column="3">
                    <label-item :label="$t('columns.state')">
                        {{ data.state }}
                    </label-item>
                    <label-item :label="$t('columns.auto_reserve')">
                        <a-checkbox
                            :checked="data.auto_reserve"
                            :disabled="true"
                        ></a-checkbox>
                    </label-item>
                    <label-item :label="$t('columns.auto_create_label')">
                        <a-checkbox
                            :checked="data.auto_create_label"
                            :disabled="true"
                        ></a-checkbox>
                    </label-item>
                </label-container>
                <label-container :column="1">
                    <label-item label="products">
                        {{ data.product_default_codes }}
                    </label-item>
                </label-container>
            </div>
        </a-card>
        <a-table
            :dataSource="products"
            style="table-layout:fixed;"
            :pagination="false"
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
                        {{ row.start_time | datetolocal }}</span
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
                        {{ row.end_time | datetolocal }}</span
                    ></template
                >
            </a-table-column>
            <a-table-column
                :title="$t('columns.reserve_running')"
                key="reserve_running"
                align="center"
            >
                <template slot-scope="row" :class="calcStyle(row)">
                    <a-checkbox disabled :checked="row.reserve_running" />
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('columns.reserve_start_time')"
                key="reserve_start_time"
                align="left"
            >
                <template slot-scope="row"
                    ><span :class="calcStyle(row)">
                        {{ row.reserve_start_time | datetolocal }}</span
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
                        {{ row.reserve_time | datetolocal }}</span
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
                <template slot-scope="row" :class="calcStyle(row)">
                    <a-checkbox disabled :checked="row.create_label_running" />
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('columns.create_label_start_time')"
                key="create_label_start_time"
                align="left"
            >
                <template slot-scope="row"
                    ><span :class="calcStyle(row)">
                        {{ row.create_label_start_time | datetolocal }}</span
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
                        {{ row.create_label_time | datetolocal }}</span
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
                <template slot-scope="row" :class="calcStyle(row)">
                    <a-checkbox disabled :checked="row.exists_undone_picking" />
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
                        v-clipboard:success="clipboardSuccessHandler"
                        v-clipboard:error="clipboardErrorHandler"
                        :class="calcStyle(row)"
                        style="cursor: pointer"
                    >
                        {{ row.process_info }}
                    </span>
                </template>
            </a-table-column>
        </a-table>
    </section>
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Page } from '@/core/decorators'
import { PageService } from '~/bootstrap/services/page.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { RequestParams } from '~/core/http'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { PickingService } from '../../services/picking.service'
import { namespace } from 'vuex-class'
import router from '../../router'
import { ReleasePreSaleService } from '../../services/release_presale.service'

const datasModule = namespace('datasModule')

@Component({
    components: {}
})
export default class PresaleOrderDetail extends Vue {
    @Prop()
    private detail: any

    @Prop()
    id: any

    @Prop()
    systemUsers

    private data: any = {}

    private products: any = []

    private userDict: any = {}

    @Watch('detail')
    private onDetailChange() {
        if (this.detail) {
            this.data = Object.assign({}, this.detail)
            this.getPresaleInfo()
        }
        // this.data = this.detail
    }

    private created() {
        for (let i of this.systemUsers) {
            this.userDict[i.code] = i.name
        }
    }

    private mounted() {
        this.data = Object.assign({}, this.detail)
        if (this.id) {
            this.getPresaleInfo()
        }
    }

    private releasePreSaleService = new ReleasePreSaleService()

    private loadingService = new LoadingService()

    private getPresaleInfo() {
        this.releasePreSaleService
            .queryProduct(
                new RequestParams(
                    { wizard_id: parseInt(this.id) },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    data.map(x => {
                        x.who_reserve = this.userDict[x.who_reserve]
                        x.who_create_label = this.userDict[x.who_create_label]
                    })
                    this.products = data
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

    private onCancelOrders() {
        this.releasePreSaleService
            .cancel(
                new RequestParams(
                    { wizard_id_list: [parseInt(this.id)] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('取消成功')
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
                    { wizard_id_list: [parseInt(this.id)] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('手动完成成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
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
        "instock": "Inventory Info",
        "base": "Product Info",
        "shipment": "Shipment Info",
        "record": "In and Out Record",
        "log": "Operate Log",
        "action": {
            "create": "Create",
            "batch-create": "EXCEL Import",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "done": "Done"
        },
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
        }
    },
    "zh-cn": {
        "instock": "库存信息",
        "base": "产品详情",
        "shipment": "物流信息",
        "record": "出入库记录",
        "log": "日志",
        "action": {
            "create": "新建",
            "batch-create": "EXCEL导入",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "done": "完成"
        },
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
        }
    }
}
</i18n>
