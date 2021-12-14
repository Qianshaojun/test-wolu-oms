<template>
    <section class="component edit-customer">
        <div
            style="padding:0 20px 10px 20px;min-height:40px;display:inline-block;"
        >
            <a-button
                type="primary"
                @click="onSubmit()"
                style="margin-right:5px;"
                size="small"
                >{{ $t('action.save') }}</a-button
            >
            <a-button
                @click="onSplit()"
                type="default"
                size="small"
                :disabled="!selectedRowKeys.length"
                style="margin-right:5px;"
                >{{ $t('action.split') }}
            </a-button>

            <a-button
                @click="onDelete()"
                :disabled="!selectedRowKeys.length"
                style="margin-right:5px;"
                size="small"
            >
                {{ $t('action.delete') }}
            </a-button>
        </div>
        <a-table
            :dataSource="orderDetail"
            :pagination="false"
            rowKey="index"
            :columns="detailColumns"
            :rowSelection="{
                selectedRowKeys: selectedRowKeys,
                onChange: keys => (selectedRowKeys = keys)
            }"
            :customRow="
                record => ({
                    on: {
                        click: () => {
                            this.selectedRowKeys = [record.index]
                            onTbRowClick(record)
                        }
                    }
                })
            "
            style="table-layout:fixed;"
            :scroll="{ x: 1300, y: 300 }"
            bordered
        >
            <template slot="product_name" slot-scope="text, row">
                <span :title="row.product_name">{{
                    row.product_name
                        ? row.product_name.length > 24
                            ? row.product_name.substr(0, 27) + '...'
                            : row.product_name
                        : ''
                }}</span>
            </template>
            <template slot="logistics_id" slot-scope="text, row"
                ><a-select
                    showSearch
                    class="required"
                    v-if="currentRow == row.index"
                    v-decorator="['logistics_id']"
                    :value="row.logistics_id ? row.logistics_id : ''"
                    :dropdown-match-select-width="false"
                    :dropdown-style="{ width: '200px' }"
                    :style="{ width: '100%' }"
                    size="small"
                    :filterOption="filterSelectOption"
                    @change="e => handleChange(e, row, 'logistics_id')"
                >
                    <a-select-option
                        v-for="i of providerList"
                        :key="i.code"
                        :value="i.code"
                    >
                        {{ i.name }}
                    </a-select-option>
                </a-select>
                <span v-else>{{
                    (row.logistics_id ? row.logistics_id : '')
                        | dict2(providerList)
                }}</span></template
            >
            <template slot="ship_qty" slot-scope="text, row"
                ><a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :value="row.ship_qty"
                    :min="0"
                    @change="e => handleChange(e, row, 'ship_qty')"
                /><span v-else>{{ row.ship_qty }}</span></template
            >
            <template slot="date_render" slot-scope="text">{{
                text | datetolocal
            }}</template>
            <template slot="ship_aging" slot-scope="text, row">
                <span>{{
                    typeof row.ship_aging == 'object' &&
                    row.ship_aging.length == 2
                        ? row.ship_aging[0]
                        : row.ship_aging
                          | dict('LogisticsProviderAging')
                          | translate
                }}</span></template
            >
            <template slot="dest_location_id" slot-scope="text, row">
                <span>{{
                    typeof row.dest_location_id == 'object' &&
                    row.dest_location_id.length == 2
                        ? row.dest_location_id[0]
                        : row.dest_location_id | dict2(locationList)
                }}</span></template
            >
        </a-table>
    </section>
</template>

<style>
.required {
    background-color: #ecc5e9;
}
</style>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'ant-design-vue'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import moment from 'moment'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { LocationService } from '../../services/location.service'
import UUID from 'uuidjs'

@Component({
    components: {}
})
export default class AssignProvider extends Vue {
    @Prop()
    info: any

    @Prop()
    systemUsers: any

    private providerList: any = []

    private moment = moment

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private locationService = new LocationService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()
    // 表格数据源
    private order: any = []

    private orderDetail: any[] = []

    private save_flag: any = 0

    private originData: any = []

    private menu_code: any = ''

    private editAble: any = false

    private currentRow: any = ''

    private detailColumns: any = []
    private selectedRowKeys: any = []

    private locationList: any = []

    private splitArr: any = []

    @Watch('info')
    onInfoChange() {
        if (this.info) {
            this.updateOrder()
        }
    }

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private created() {
        this.getLocationList()
        this.getProviders()
    }

    private mounted() {
        this.detailColumns = [
            {
                key: 'purchase_num',
                title: this.$t('columns.purchase_num'),
                dataIndex: 'purchase_num',
                width: 100
            },
            {
                key: 'common_sku',
                title: this.$t('columns.common_sku'),
                dataIndex: 'common_sku',
                align: 'left',
                width: 100
            },
            {
                key: 'product_name',
                title: this.$t('columns.product_name'),
                dataIndex: 'product_name',
                width: 100,
                align: 'right',
                scopedSlots: { customRender: 'product_name' }
            },
            {
                key: 'ship_qty',
                title: this.$t('columns.ship_qty'),
                dataIndex: 'ship_qty',
                align: 'right',
                width: 100,
                scopedSlots: { customRender: 'ship_qty' }
            },
            {
                key: 'ship_date',
                title: this.$t('columns.ship_date'),
                dataIndex: 'ship_date',
                align: 'left',
                width: 120,
                scopedSlots: { customRender: 'ship_date' }
            },
            {
                key: 'ship_aging',
                title: this.$t('columns.ship_aging'),
                dataIndex: 'ship_aging',
                align: 'left',
                width: 100,
                scopedSlots: { customRender: 'ship_aging' }
            },
            {
                key: 'dest_location_id',
                title: this.$t('columns.dest_location_id'),
                dataIndex: 'dest_location_id',
                align: 'left',
                width: 100,
                scopedSlots: { customRender: 'dest_location_id' }
            },
            {
                key: 'logistics_id',
                title: this.$t('columns.logistics_id'),
                dataIndex: 'logistics_id',
                align: 'left',
                width: 100,
                scopedSlots: { customRender: 'logistics_id' }
            },
            {
                key: 'amazon_sku',
                title: this.$t('columns.amazon_sku'),
                dataIndex: 'amazon_sku',
                align: 'left',
                width: 100,
                scopedSlots: { customRender: 'amazon_sku' }
            },
            {
                key: 'amazon_asin',
                title: this.$t('columns.amazon_asin'),
                dataIndex: 'amazon_asin',
                align: 'left',
                width: 100,
                scopedSlots: { customRender: 'amazon_asin' }
            },
            {
                key: 'fn_sku',
                title: this.$t('columns.fn_sku'),
                dataIndex: 'fn_sku',
                align: 'left',
                width: 100,
                scopedSlots: { customRender: 'fn_sku' }
            }
        ]

        if (this.info) {
            this.updateOrder()
        }
    }

    private updateOrder() {
        if (this.info.length) {
            this.orderDetail = JSON.parse(
                JSON.stringify(
                    this.info.map(x => {
                        x['save_flag'] = 1
                        return x
                    })
                )
            )
        }
    }

    private getProviders() {
        this.innerAction.setActionAPI(
            '/logistics_providers/query_logistics_code',
            CommonService.getMenuCode('shipping-plan-manage')
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
                    this.providerList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onSplit() {
        for (let i of this.selectedRowKeys) {
            let item = this.orderDetail.find(x => x.index == i)
            if (item) {
                let param: any = Object.assign({}, item)
                param['index'] = UUID.generate()
                param['save_flag'] = 0
                param['origin_id'] = param.id
                param['id'] = 0
                this.orderDetail.push(param)

                let origin: any = this.splitArr.find(x => x.id == item.id)
                if (!origin) {
                    this.splitArr.push({
                        id: item.id,
                        ship_qty: item.ship_qty
                    })
                }
            }
        }
    }

    private onSubmit() {
        let nowDate = new Date().getTime()
        let cur = this.moment(nowDate).format('YYYY-MM-DD')

        for (var i of this.orderDetail) {
            if (!i.ship_qty || !i.logistics_id) {
                this.$message.error('请先完善明细信息，深色背景为必填项')
                return false
            }
        }
        let params = JSON.parse(JSON.stringify(this.orderDetail))

        for (let i in params) {
            let split = this.splitArr.find(x => x.id == params[i].id)
            if (split) {
                let qty: any = params
                    .filter(
                        y =>
                            (y.id == 0 && y.origin_id == split.id) ||
                            y.id == split.id
                    )
                    .reduce((total, item) => {
                        return total + parseInt(item.ship_qty)
                    }, 0)

                if (qty != split.ship_qty) {
                    this.$message.error(
                        '拆分后的本次发货数量总和和拆分前的不一致(' +
                            params[i].purchase_num +
                            ')！'
                    )
                    return
                }
            }
        }
        for (let i in params) {
            delete params[i].index
            delete params[i].origin_id
        }
        this.innerAction.setActionAPI(
            '/shipping_plan/save_shipping_plan',
            CommonService.getMenuCode('create-shipping-plan')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        date_list: params.map(x => {
                            delete x.index
                            return x
                        }),
                        cur_date: cur
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDelete() {
        this.$message.success('操作成功')
        this.orderDetail = this.orderDetail.filter(
            x => !this.selectedRowKeys.includes(x.index)
        )
    }

    private onTbRowClick(row) {
        this.currentRow = row.index
    }

    private handleChange(e, row, column) {
        row[column] = e
        if (column == 'product_qty') {
            row.available_ship_qty = e - row.shipped_qty
        }
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

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }
}
</script>

<i18n>
{
  "en-us": {
    "desc": "this is a Order Page1",
    "columns":{
        "purchase_num":"purchase_num",
        "common_sku":"common_sku",
        "product_name":"product_name",
        "logistics_id":"logistics_id",
        "ship_qty":"ship_qty",
        "product_qty":"product_qty",
        "available_ship_qty":"available_ship_qty",
        "ship_date":"ship_date",
        "ship_aging":"ship_aging",
        "dest_location_id":"dest_location_id",
        "amazon_sku":"amazon_sku",
        "amazon_asin":"amazon_asin",
        "fn_sku":"fn_sku"
    },
    "action":{
        "split":"Split",
        "edit":"Edit",
        "delete":"Delete",
        "ok":"Yes",
        "more":"More",
        "save":"Save",
        "confirm":"Confirm",
        "cancel":"Cancel",
        "cancel":"Cancel"
    },
    "rules":{
       "date_range_error":"start date can't later start date"
    },
    "delete":"Are you sure delete?",
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Delete Success"
  },
  "zh-cn": {
    "desc": "这是订单页面1",
    "columns":{
        "purchase_num":"采购订单编号",
        "common_sku":"通用SKU",
        "product_name":"产品名称",
        "logistics_id":"物流商",
        "ship_qty":"本次发货数量",
        "product_qty":"数量",
        "available_ship_qty":"可发货数量",
        "ship_date":"发货日期",
        "ship_aging":"发货时效",
        "dest_location_id":"目的地",
        "amazon_sku":"Amazon SKU",
        "amazon_asin":"ASIN",
        "fn_sku":"FN SKU"
    },
    "action":{
      "split":"拆分",
      "edit":"编辑",
      "delete":"删除",
      "ok":"确定",
      "more":"更多操作",
      "save":"保存",
      "cancel":"取消"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "delete":"是否确认删除?",
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "delete_success":"删除成功"
  }
}
</i18n>
