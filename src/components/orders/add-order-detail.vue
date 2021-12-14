<template>
    <section class="component order-base-detail">
        <div style="padding:0 20px 10px 20px;">
            <a-button @click="addBtn" type="default" size="small"
                ><a-icon type="plus" />{{ $t('actions.add') }}</a-button
            >
        </div>
        <a-table
            :dataSource="data"
            :pagination="false"
            style="table-layout:fixed;"
            rowKey="index"
            :customRow="
                rowKey => ({
                    on: {
                        // 单击每行
                        click: () => {
                            currentRow = rowKey.index
                        }
                    }
                })
            "
            bordered
        >
            <a-table-column
                :title="$t('product')"
                key="default_code"
                align="center"
            >
                <template slot-scope="row">
                    <a-auto-complete
                        v-if="currentRow == row.index && editable"
                        :dataSource="skuSource"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '300px' }"
                        :defaultValue="row.default_code"
                        @search="onSkuSearch"
                        @change="e => onRowChange(row, 'default_code', e)"
                        size="small"
                        style="width: 100%;"
                        placeholder="input for search"
                    >
                        <template slot="dataSource">
                            <a-select-option
                                v-for="opt in skuSource"
                                :key="opt"
                                :value="opt"
                                :title="opt"
                            >
                                {{ opt }}
                            </a-select-option>
                            <a-select-option
                                key="all"
                                disabled
                                class="show-all"
                            >
                                <a @click="searchMore(row)">
                                    Search More
                                </a>
                            </a-select-option>
                        </template>
                    </a-auto-complete>
                    <span v-else>{{ row.default_code }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('description')"
                key="name"
                data-index="name"
                align="center"
            >
            </a-table-column>
            <a-table-column
                :title="$t('quantity')"
                key="product_uom_qty"
                align="center"
            >
                <template slot-scope="row">
                    <a-input-number
                        decimalSeparator=","
                        v-if="currentRow == row.index && editable"
                        v-decorator="['product_uom_qty']"
                        :value="row.product_uom_qty"
                        :style="{ width: '100%', background: '#ecc5e9' }"
                        :min="0"
                        size="small"
                        @change="e => onRowChange(row, 'product_uom_qty', e)"
                    />
                    <span v-else>{{ row.product_uom_qty }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('available_qty')"
                key="available_qty"
                data-index="available_qty"
                align="center"
            >
            </a-table-column>
            <a-table-column
                :title="$t('delivered')"
                key="delivered"
                data-index="delivered"
                align="center"
            >
            </a-table-column>
            <a-table-column
                :title="$t('invoiced')"
                key="invoiced"
                data-index="invoiced"
                align="center"
            >
            </a-table-column>
            <a-table-column
                :title="$t('price_unit')"
                key="price_unit"
                align="center"
            >
                <template slot-scope="row">
                    <a-input-number
                        decimalSeparator=","
                        v-if="currentRow == row.index && editable"
                        v-decorator="['price_unit']"
                        :value="row.price_unit"
                        :style="{ width: '100%', background: '#ecc5e9' }"
                        :min="0"
                        size="small"
                        @change="e => onRowChange(row, 'price_unit', e)"
                    />
                    <span v-else>{{ row.price_unit }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('price_tax')"
                key="price_tax"
                align="center"
            >
                <template slot-scope="row">
                    <a-select
                        v-if="currentRow == row.index && editable"
                        v-decorator="['price_tax']"
                        :value="row.price_tax"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '300px' }"
                        size="small"
                        @change="e => onRowChange(row, 'price_tax', e)"
                    >
                        <a-select-option
                            v-for="i of taxesList"
                            :key="i.id"
                            :value="i.id"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select>
                    <span v-else>
                        {{ row.price_tax | dict2(taxesList) }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('subtotal')"
                key="subtotal"
                data-index="subtotal"
                align="center"
            >
            </a-table-column>
            <a-table-column
                :title="$t('fulfillment_center')"
                key="fulfillment_center"
                align="center"
            >
                <template slot-scope="row">
                    <a-input
                        v-if="currentRow == row.index && editable"
                        v-decorator="['fulfillment_center']"
                        :value="row.fulfillment_center"
                        :style="{ width: '100%' }"
                        size="small"
                        @change="e => onRowChange(row, 'fulfillment_center', e)"
                    />
                    <span v-else>{{ row.fulfillment_center }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('actions.action')"
                key="action"
                align="center"
            >
                <template slot-scope="row">
                    <a @click="onDel(row)">
                        {{ $t('actions.delete') }}
                    </a>
                    <a @click="e => cancelBtn(e)">
                        {{ $t('actions.cancel') }}
                    </a>
                </template>
            </a-table-column>
        </a-table>
        <div style="width:100%;display:inline-block;">
            <div style="width:200px;float:right;">
                <p style="padding:0;margin:0;">
                    Untaxed Amount： {{ untax.toFixed(2) }}
                </p>
                <p style="padding:0;margin:0;border-bottom:1px solid #aaa;">
                    Taxes： {{ tax.toFixed(2) }}
                </p>
                <p style="padding:0;margin:0;">
                    Total：
                    {{ parseFloat(total.toFixed(2)).toFixed(2) }}
                </p>
            </div>
        </div>
    </section>
</template>

<style>
.ant-select-auto-complete.ant-select-sm .ant-input {
    background-color: #ecc5e9;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ProductService } from '@/services/product.service'
import { RequestParams } from '@/core/http'
import { CommonService } from '@/shared/utils/common.service'
import { formConfig } from '@/config/form.config'
import SearchProduct from '@/components/product/search-product.vue'
import { PickingService } from '../../services/picking.service'
import { LoadingService } from '@/bootstrap/services/loading.service'
import UUID from 'uuidjs'

@Component({
    components: {}
})
export default class AddOrderDetail extends Vue {
    @Prop()
    info: any

    @Prop()
    taxesList: any

    private currentRow: any = ''

    private editable: any = true

    private data: any[] = []

    private skuSource: any[] = []

    private skuQueryResult: any[] = []

    private productService = new ProductService()

    private pickingService = new PickingService()

    private loadingService = new LoadingService()

    private operateCnt: any = 0

    private untax: any = 0
    private tax: any = 0
    private total: any = 0

    private mounted() {
        if (this.taxesList.length) {
            this.calcTaxs()
        }
    }

    @Watch('info')
    private onInfoChange() {
        if (this.info.length) {
            this.data = this.info.map(x => x)
            this.calcTaxs()
        }
    }

    @Watch('taxesList')
    private onTaxesListChange() {
        if (this.info.length) {
            this.data = this.info.map(x => x)
            this.calcTaxs()
        }
    }

    private addBtn() {
        this.data.push({
            index: UUID.generate(),
            default_code: '',
            name: '',
            product_uom_qty: 1,
            delivered: 0,
            invoiced: 0,
            price_unit: 0,
            price_tax: 0,
            subtotal: 0,
            fulfillment_center: '',
            product_id: 0
        })
        this.$emit('change', this.data)
        this.currentRow = this.data.length
    }

    private onRowChange(row, column, value) {
        if (
            Object.prototype.toString.call(value) === '[object InputEvent]' ||
            Object.prototype.toString.call(value) === '[object Event]' ||
            Object.prototype.toString.call(value) === '[object Object]'
        ) {
            row[column] = value.target.value
        } else {
            row[column] = value
        }

        if (column === 'default_code') {
            let productItem = this.skuQueryResult.find(
                x => '[' + x.default_code + ']' + x.name == value
            )
            if (productItem) {
                row.default_code = productItem.default_code
                row.name = productItem.name
                row.product_id = productItem.product_id
                row.available_qty =
                    productItem.stock_available_quantity > 0
                        ? productItem.stock_available_quantity
                        : 0
            }
        }
        if (column === 'price_unit' && row.product_uom_qty > 0) {
            let total: any = (row.price_unit * row.product_uom_qty).toFixed(2)
            row.subtotal = total
            this.calcTaxs()
        }

        if (column === 'product_uom_qty' && row.price_unit > 0) {
            let total: any = (row.price_unit * row.product_uom_qty).toFixed(2)
            row.subtotal = total
            this.calcTaxs()
        }

        if (column === 'price_tax') {
            let tax = this.taxesList.find(x => x.id === value)
            if (tax && tax.amount < 0) {
                this.$message.error('税率不能为负数，请重新选择')
                return
            }
        }

        if (
            column === 'price_tax' &&
            row.product_uom_qty > 0 &&
            row.price_unit > 0
        ) {
            this.calcTaxs()
        }

        this.$emit('change', this.data)
    }

    private calcTaxs() {
        if (this.data.length) {
            this.untax = 0
            this.total = 0
            this.tax = 0
            for (var i of this.data) {
                let subtotal = i.subtotal ? i.subtotal : 0
                this.total += parseFloat(subtotal)
                if (i.price_tax > 0) {
                    let amount = 0
                    let tax = this.taxesList.find(x => x.id === i.price_tax)
                    if (tax && tax.amount > 0) {
                        amount = tax.amount
                    }
                    this.tax += (subtotal * amount) / (100 + amount)
                }
            }
            this.untax = this.total - this.tax
        }
    }

    private cancelBtn(e) {
        e.stopPropagation()
        this.currentRow = -1
    }

    private onDel(row) {
        this.currentRow = -1
        let item = this.data.find(x => x.index === row.index)
        item['save_flag'] = 2
        this.data = this.data.filter(x => !x.save_flag || x.save_flag < 2)

        this.$emit('change', this.data)
    }

    private onSkuSearch(key) {
        let params: any = CommonService.createQueryCondition(
            { default_code: key },
            {
                default_code: 'like',
                ...formConfig.condition
            }
        )
        params['page_index'] = 1
        params['page_size'] = 10
        this.productService
            .queryAsyncProductInfo(
                new RequestParams(params, { loading: this.loadingService })
            )
            .subscribe(data => {
                this.skuSource = data.map(
                    x => '[' + x.default_code + ']' + x.name
                )
                this.skuQueryResult = data
            })
    }

    private searchMore(row) {
        let _that = this
        this.$modal
            .open(
                SearchProduct,
                {},
                {
                    title: '搜索产品',
                    width: '60%'
                }
            )
            .subscribe(data => {
                //sku不能重复
                let item = this.data.find(x => x.index === row.index)
                item['name'] = '[' + data.default_code + ']' + data.name
                item['product_id'] = data.product_id
                item['default_code'] = data.default_code

                row.available_qty =
                    data.stock_available_quantity > 0
                        ? data.stock_available_quantity
                        : 0

                this.currentRow = -1
                setTimeout(function() {
                    _that.currentRow = row.index
                }, 100)
            })
    }
}
</script>

<i18n>
{
  "en-us":{
    "product":"Product",
    "quantity":"Quantity",
    "description":"Description",
    "available_qty":"Available Qty",
    "delivered":"Ship Type",
    "invoiced":"Pre Sale",
    "price_unit":"Unit Price",
    "price_tax":"Taxes",
    "subtotal":"Subtotal",
    "fulfillment_center":"Fulfillment Center",
    "actions":{
      "add":"Add",
      "action":"Action",
      "save":"Save",
      "delete":"Delete",
      "cancel":"Cancel"   
    }
  },
  "zh-cn":{
    "product":"产品",
    "quantity":"数量",
    "description":"描述",
    "available_qty":"可用数量",
    "delivered":"发货数量",
    "invoiced":"发票数量",
    "price_unit":"单价",
    "price_tax":"税",
    "subtotal":"合计",
    "fulfillment_center":"履行中心",
    "actions":{
      "add":"新增",
      "action":"操作",
      "save":"保存",
      "delete":"删除",
      "cancel":"取消"
    }
  }
}
</i18n>
