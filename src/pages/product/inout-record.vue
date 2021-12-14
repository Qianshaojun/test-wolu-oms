<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action>
            <!-- <a-button type="primary" @click="onCreate">{{
                $t('action.create')
            }}</a-button> -->
            <!-- <a-button type="primary" @click="onBatchUpload">{{
                $t('action.batch-create')
            }}</a-button>-->
        </template>
        <data-form
            :extends="extendItems"
            ref="dataForm"
            @submit="getRecordList"
            :column="1"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item :label="$t('state')" style="height:35px;margin:0;">
                    <a-radio-group
                        v-decorator="['state', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onStatusChange(e)"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.code"
                            v-for="item of stateList"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item :label="$t('usage')" style="height:35px;margin:0;">
                    <a-radio-group
                        v-decorator="['usage', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onStatusChange(e)"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="internal" key="in"
                            >in
                        </a-radio-button>
                        <a-radio-button value="customer" key="out"
                            >out
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('product_sku')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['default_code']"
                        :placeholder="$t('plzInput')"
                        :style="{ width: '300px', 'margin-right': '5px' }"
                        size="small"
                    ></a-input>
                    <a-select
                        v-decorator="['operator', { initialValue: 'ilike' }]"
                        :style="{ width: '100px' }"
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
                    :label="$t('location_dest_name')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        show-search
                        v-decorator="['location_dest_id']"
                        :style="{ width: '300px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        :filter-option="handleSearch"
                    >
                        <a-select-option value="">
                            {{ $t('none') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of locationList"
                            :key="item.code"
                            :title="item.name"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('location_from_name')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        show-search
                        v-decorator="['location_id']"
                        :style="{ width: '300px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        :filter-option="handleSearch"
                    >
                        <a-select-option value="">
                            {{ $t('none') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of locationList"
                            :key="item.code"
                            :title="item.name"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('done_time')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        v-decorator="['done_time']"
                        show-time
                        :style="{ width: '300px' }"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-button type="primary" @click="export_product_in_out_record()"
                    >{{ $t('action.export') }}
                </a-button>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important;">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="index"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getRecordList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                :scroll="{ y: 450 }"
                @change="onTableChange"
                style="table-layout:fixed;"
            >
                <a-table-column
                    :title="$t('product_sku')"
                    key="default_code"
                    data-index="default_code"
                    align="left"
                    width="8%"
                ></a-table-column>
                <a-table-column
                    :title="$t('qty_available')"
                    key="qty_available"
                    data-index="qty_available"
                    align="center"
                    width="6%"
                ></a-table-column>
                <a-table-column
                    :title="$t('product_qty')"
                    key="product_qty"
                    align="center"
                    width="6%"
                >
                    <template slot-scope="row">
                        {{ row.product_qty }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('in_out_warehouse_type')"
                    key="in_out_warehouse_type"
                    data-index="in_out_warehouse_type"
                    align="center"
                    width="6%"
                ></a-table-column>
                <a-table-column
                    :title="$t('location_dest_name')"
                    key="location_dest_name"
                    data-index="location_dest_name"
                    align="center"
                    width="8%"
                ></a-table-column>
                <a-table-column
                    :title="$t('location_from_name')"
                    key="location_from_name"
                    data-index="location_from_name"
                    align="center"
                    width="8%"
                ></a-table-column>
                <a-table-column
                    :title="$t('state')"
                    key="state"
                    data-index="state"
                    align="center"
                    width="6%"
                ></a-table-column>
                <a-table-column
                    :title="$t('qty_done')"
                    key="qty_done"
                    data-index="qty_done"
                    align="center"
                    width="6%"
                ></a-table-column>
                <a-table-column
                    :title="$t('picking_name')"
                    key="picking_name"
                    data-index="picking_name"
                    align="center"
                    width="8%"
                ></a-table-column>
                <a-table-column
                    :title="$t('origin')"
                    key="origin"
                    data-index="origin"
                    align="center"
                    width="8%"
                ></a-table-column>
                <a-table-column
                    :title="$t('operate_user')"
                    key="operate_user"
                    data-index="operate_user"
                    align="center"
                    width="8%"
                >
                    <template slot-scope="user_id" scrope="user_id">
                        <span>{{ user_id | dict2(systemUsers) }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('merge_time')"
                    key="merge_time"
                    align="center"
                    width="6%"
                >
                    <template slot-scope="row">
                        {{ row.merge_time | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('done_time')"
                    key="done_time"
                    align="center"
                    :sorter="true"
                    width="6%"
                >
                    <template slot-scope="row">
                        {{ row.done_time | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('note')"
                    key="note"
                    data-index="note"
                    align="center"
                    width="6%"
                ></a-table-column>
            </data-table>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
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
import ScheduleDetail from '../../components/schedule/schedule-detail.vue'
import ScheduleEdit from '@/components/schedule/schedule-edit.vue'
import { ProductService } from '@/services/product.service'
import { LocationService } from '../../services/location.service'
import appConfig from '../../config/app.config'
import UUID from 'uuidjs'

const userModule = namespace('userModule')
const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'inout-record'
})
@Component({
    components: { ScheduleDetail }
})
export default class InoutRecord extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    private productService = new ProductService()

    private locationService = new LocationService()

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    // 表格数据源
    private data: any[] = []
    // 表格选择项
    private selectedRowKeys: any[] = []

    private locationList: any[] = []

    private stateList: any = []

    private orderBy: any = 'done_time desc'

    @userModule.State
    private id

    @userModule.State
    private username

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private get rules() {
        return {}
    }

    public created() {
        this.getSystemuser()
        this.getStateDict()
        this.getLocationList()
    }

    private getStateDict() {
        this.stateList = [
            {
                code: 'assigned',
                name: 'assigned'
            },
            {
                code: 'cancel',
                name: 'cancel'
            },
            {
                code: 'confirmed',
                name: 'confirmed'
            },
            {
                code: 'done',
                name: 'done'
            },
            {
                code: 'draft',
                name: 'draft'
            },
            {
                code: 'partially_available',
                name: 'partially_available'
            }
        ]
    }

    private getLocationList() {
        this.locationService.getLocationList(new RequestParams()).subscribe(
            data => {
                this.locationList = data
            },
            err => {
                this.$message.error('获取库位列表失败')
            }
        )
    }

    /**
     * 获取订单数据
     */
    private getRecordList() {
        this.dataForm.validateFields().then((values: any) => {
            let operator = values['operator']
            delete values['operator']

            if (operator == 'in' && values['default_code']) {
                values['default_code'] = values['default_code'].split(',')
            }
            let params: any = CommonService.createQueryCondition(values, {
                default_code: operator
            })

            var nowConditions: any[] = []
            for (var item of params.query_condition) {
                if (item.value.constructor == Array && item.operate !== 'in') {
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

            if (this.orderBy) {
                params['order_by'] = this.orderBy
            }

            this.productService
                .query_all_product_in_out_warehouse(
                    new RequestParams(params, {
                        page: this.pageService,
                        loading: this.loadingService
                    })
                )
                .subscribe(
                    data => {
                        this.data = data.map(x => {
                            x['index'] = UUID.generate()
                            return x
                        })
                        this.selectedRowKeys = []
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getRecordList()
    }

    private onEdit(row) {
        router.push({
            name: 'seller-edit',
            params: { seller: row }
        })
    }

    private onStatusChange(e) {}

    private filterUser(userID) {
        let ret = 'user'
        let user = this.systemUsers.find(x => x.code == userID)
        if (user) {
            ret = user.name.split('@')[0]
        }
        return ret
    }

    private handleSearch(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private sortByTime(a, b) {
        let aTimeString = a ? a.replace(/-/g, '/') : 0
        let bTimeString = b ? b.replace(/-/g, '/') : 0
        let aTime = new Date(aTimeString).getTime()
        let bTime = new Date(bTimeString).getTime()
        return aTime - bTime
    }

    private export_product_in_out_record() {
        this.dataForm.validateFields().then((values: any) => {
            let operator = values['operator']
            delete values['operator']

            if (operator == 'in' && values['default_code']) {
                values['default_code'] = values['default_code'].split(',')
            }
            let params: any = CommonService.createQueryCondition(values, {
                default_code: operator
            })

            var nowConditions: any[] = []
            for (var item of params.query_condition) {
                if (item.value.constructor == Array && item.operate !== 'in') {
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

            if (nowConditions.length == 0) {
                this.$confirm({
                    title:
                        'Do you want to export all data? It will take a long time to download.',
                    content:
                        'When clicked the Cancel button, the process will stop.',
                    onOk() {
                        let urlParams = encodeURIComponent(
                            JSON.stringify(nowConditions)
                        )
                        window.open(
                            appConfig.server +
                                '/product/export_product_in_out_warehouse?query_condition=' +
                                urlParams
                        )
                    },
                    onCancel() {}
                })
            } else {
                let urlParams = encodeURIComponent(
                    JSON.stringify(nowConditions)
                )
                window.open(
                    appConfig.server +
                        '/product/export_product_in_out_warehouse?query_condition=' +
                        urlParams
                )
            }
        })
    }
}
</script>

<i18n>
{
    "en-us": {
        "log": "Log",
        "type": "Type",
        "operater": "Operater",
        "date": "Date",
        "product_sku": "Product Sku",
        "qty_available": "Qty Onhand",
        "product_qty": "Product Qty",
        "in_out_warehouse_type": "In Out Warehouse Type",
        "location_dest_name": "Location Dest Name",
        "location_from_name": "Location From  Name",
        "state": "State",
        "qty_done": "Qty Done",
        "picking_name": "Picking Name",
        "operate_user": "Operate User",
        "merge_time": "Merge Time",
        "done_time": "Done Time",
        "note": "Note",
        "origin": "Origin",
        "forms": {
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search",
            "operator_list": "Multi Search"
        },
        "action": {
            "export": "Export"
        }
    },
    "zh-cn": {
        "log": "日志",
        "type": "类型",
        "operater": "操作人",
        "date": "日期",
        "product_sku": "SKU",
        "qty_available": "在手数量",
        "product_qty": "数量",
        "in_out_warehouse_type": "出入库类型",
        "location_dest_name": "目标库位",
        "location_from_name": "来源库位",
        "state": "状态",
        "qty_done": "完成数量",
        "picking_name": "拣货单",
        "operate_user": "操作人员",
        "merge_time": "合并时间",
        "done_time": "完成时间",
        "note": "备注",
        "origin": "来源",
        "forms": {
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量查询"
        },
        "action": {
            "export": "导出"
        }
    }
}
</i18n>
