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
                style="margin-right:5px;"
                :disabled="!selectedRowKeys.length"
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
            <template slot="ship_aging" slot-scope="text, row"
                ><a-select
                    class="required"
                    v-if="currentRow == row.index"
                    v-decorator="['ship_aging']"
                    :value="row.ship_aging"
                    :style="{ width: '100%' }"
                    size="small"
                    @change="e => handleChange(e, row, 'ship_aging')"
                >
                    <a-select-option
                        v-for="i of $dict.LogisticsProviderAging"
                        :key="i.value"
                        :value="i.value"
                    >
                        {{ $t(i.label) }}
                    </a-select-option>
                </a-select>
                <span v-else>{{
                    typeof row.ship_aging == 'object' &&
                    row.ship_aging.length == 2
                        ? row.ship_aging[0]
                        : row.ship_aging
                          | dict('LogisticsProviderAging')
                          | translate
                }}</span></template
            >
            <template slot="dest_location_id" slot-scope="text, row"
                ><a-select
                    class="required"
                    v-if="currentRow == row.index"
                    v-decorator="['dest_location_id']"
                    :value="row.dest_location_id"
                    :style="{ width: '100%' }"
                    :dropdown-match-select-width="false"
                    :dropdown-style="{ width: '300px' }"
                    size="small"
                    @change="e => handleChange(e, row, 'dest_location_id')"
                >
                    <a-select-option
                        v-for="i of locationList"
                        :key="i.code"
                        :value="i.code"
                    >
                        {{ i.name }}
                    </a-select-option>
                </a-select>
                <span v-else>{{
                    typeof row.dest_location_id == 'object' &&
                    row.dest_location_id.length == 2
                        ? row.dest_location_id[0]
                        : row.dest_location_id | dict2(locationList)
                }}</span></template
            >
            <!-- <template slot="product_qty" slot-scope="text, row"
                ><a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :value="row.product_qty"
                    :min="0"
                    @change="e => handleChange(e, row, 'product_qty')"
                /><span v-else>{{ row.product_qty }}</span></template
            > -->
            <template slot="ship_qty" slot-scope="text, row"
                ><a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :value="row.ship_qty"
                    :min="1"
                    :max="row.product_qty - row.shipped_qty"
                    @change="e => handleChange(e, row, 'ship_qty')"
                /><span v-else>{{ row.ship_qty }}</span></template
            >
            <template slot="available_ship_qty" slot-scope="text, row">{{
                Math.max(0, row.product_qty - row.shipped_qty)
            }}</template>
            <template slot="ship_date" slot-scope="text, row"
                ><a-date-picker
                    class="required"
                    size="small"
                    v-if="currentRow == row.index"
                    format="YYYY-MM-DD"
                    :value="row.ship_date"
                    @change="e => handleChange(e, row, 'ship_date')"
                /><span v-else>{{
                    row.ship_date ? row.ship_date.format('YYYY-MM-DD') : ''
                }}</span></template
            >
            <template slot="date_render" slot-scope="text">{{
                text | datetolocal
            }}</template>
            <template slot="amazon_sku" slot-scope="text, row"
                ><a-input
                    size="small"
                    v-if="currentRow == row.index"
                    :value="row.amazon_sku"
                    @change="
                        e => handleChange(e.target.value, row, 'amazon_sku')
                    "
                /><span v-else>{{ row.amazon_sku }}</span></template
            >
            <template slot="amazon_asin" slot-scope="text, row"
                ><a-input
                    size="small"
                    v-if="currentRow == row.index"
                    :value="row.amazon_asin"
                    @change="
                        e => handleChange(e.target.value, row, 'amazon_asin')
                    "
                /><span v-else>{{ row.amazon_asin }}</span></template
            >
            <template slot="fn_sku" slot-scope="text, row"
                ><a-input
                    class="required"
                    size="small"
                    v-if="currentRow == row.index"
                    :value="row.fn_sku"
                    @change="e => handleChange(e.target.value, row, 'fn_sku')"
                /><span v-else>{{ row.fn_sku }}</span></template
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
import { Component, Vue, Ref, Watch, Prop, Emit } from 'vue-property-decorator'
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
export default class CreateShipPlan extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }
    @Prop()
    info: any

    @Prop()
    systemUsers: any

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
                key: 'give_date',
                title: this.$t('columns.give_date'),
                dataIndex: 'give_date',
                width: 100,
                align: 'right',
                scopedSlots: { customRender: 'date_render' }
            },
            {
                key: 'product_qty',
                title: this.$t('columns.product_qty'),
                dataIndex: 'product_qty',
                width: 100,
                align: 'right',
                scopedSlots: { customRender: 'product_qty' }
            },
            {
                key: 'shipped_qty',
                title: this.$t('columns.shipped_qty'),
                dataIndex: 'shipped_qty',
                align: 'right',
                width: 100
            },
            {
                key: 'available_ship_qty',
                title: this.$t('columns.available_ship_qty'),
                dataIndex: 'available_ship_qty',
                align: 'right',
                width: 100,
                scopedSlots: { customRender: 'available_ship_qty' }
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
                        x['ship_date'] = ''
                        x['dest_location_id'] = ''
                        x['ship_aging'] = ''
                        x['save_flag'] = 0
                        x['ship_qty'] = 0
                        return x
                    })
                )
            )
        }
    }

    private onSplit() {
        for (let i of this.selectedRowKeys) {
            let item = this.orderDetail.find(x => x.index == i)
            if (item) {
                let param: any = Object.assign({}, item)
                param['index'] = UUID.generate()
                this.orderDetail.push(param)
            }
        }
    }

    private onSubmit() {
        let nowDate = new Date().getTime()
        let cur = this.moment(nowDate).format('YYYY-MM-DD')

        for (var i of this.orderDetail) {
            if (
                !i.ship_aging ||
                !i.dest_location_id ||
                !i.ship_date ||
                !i.fn_sku
            ) {
                this.$message.error('请先完善明细信息，深色背景为必填项')
                return false
            }
        }
        let params = JSON.parse(JSON.stringify(this.orderDetail))
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
                    // let msg: any = this.$t('tips.save_success')
                    // this.$message.success(msg)
                    this.submit()
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
}
</script>

<i18n>
{
  "en-us": {
    "desc": "this is a Order Page1",
    "columns":{
        "purchase_num":"purchase_num",
        "common_sku":"common_sku",
        "give_date":"give_date",
        "shipped_qty":"shipped_qty",
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
        "give_date":"订单交期",
        "shipped_qty":"已发货数量",
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
