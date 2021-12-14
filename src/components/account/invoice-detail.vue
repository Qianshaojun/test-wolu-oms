<template>
    <section class="component order-base-detail">
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
                key="product_id"
                align="center"
            >
                <template slot-scope="row">
                    <a-auto-complete
                        v-if="currentRow == row.index && editable"
                        :dataSource="skuSource"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '300px' }"
                        :defaultValue="row.name"
                        @search="onSkuSearch"
                        @change="e => onRowChange(row, 'name', e)"
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
                    <span v-else>{{ row.name }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('description')"
                key="name"
                align="center"
            >
                <template slot-scope="row">
                    <a-input
                        v-if="currentRow == row.index && editable"
                        v-decorator="['name']"
                        :value="row.name"
                        :style="{ width: '100%', background: '#ecc5e9' }"
                        size="small"
                        @change="e => onRowChange(row, 'name', e)"
                    />
                    <span v-else>{{ row.name }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('quantity')"
                key="quantity"
                align="right"
            >
                <template slot-scope="row">
                    <a-input-number
                        decimalSeparator=","
                        v-if="currentRow == row.index && editable"
                        v-decorator="['quantity']"
                        :value="row.quantity"
                        :style="{ width: '100%', background: '#ecc5e9' }"
                        :min="0"
                        size="small"
                        @change="e => onRowChange(row, 'quantity', e)"
                    />
                    <span v-else>{{ row.quantity }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('price_unit')"
                key="price_unit"
                align="right"
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
                        v-decorator="['tax_id']"
                        :value="row.tax_id"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '300px' }"
                        size="small"
                        @change="e => onRowChange(row, 'tax_id', e)"
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
                        {{ row.tax_id | dict2(taxesList) }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('subtotal')"
                key="price_subtotal"
                data-index="price_subtotal"
                align="center"
            >
            </a-table-column>
            <a-table-column :title="$t('operate')" key="action" align="center">
                <template slot-scope="row">
                    <a @click="onDelete(row)">{{ $t('delete') }}</a>
                </template>
            </a-table-column>
        </a-table>
        <div style="width:100%;display:inline-block;">
            <div style="width:80px;float:left;">
                <a @click="addLine">
                    <a-icon type="plus" />
                    新增</a
                >
            </div>
            <div style="width:200px;float:right;">
                <p style="padding:0;margin:0;">
                    Untaxed Amount： {{ untax.toFixed(2) }}
                </p>
                <p style="padding:0;margin:0;border-bottom:1px solid #aaa;">
                    Taxes： {{ tax.toFixed(2) }}
                </p>
                <p style="padding:0;margin:0;">
                    Total：
                    {{ total.toFixed(2) }}
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
export default class InvoiceDetail extends Vue {
    @Prop()
    info: any

    @Prop()
    amount_tax: any

    @Prop()
    amount_total: any

    @Prop()
    amount_untaxed: any

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

    private mounted() {}

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

        if (column === 'name') {
            let productItem = this.skuQueryResult.find(x => x.name == value)
            if (productItem) {
                row.name = productItem.name
                row.product_id = productItem.product_id
            }
        }
        if (column === 'price_unit' && row.quantity > 0) {
            let total: any = (row.price_unit * row.quantity).toFixed(2)
            row.price_subtotal = total
            this.calcTaxs()
        }

        if (column === 'quantity' && row.price_unit > 0) {
            let total: any = (row.price_unit * row.quantity).toFixed(2)
            row.price_subtotal = total
            this.calcTaxs()
        }

        if (column === 'tax_id') {
            let tax = this.taxesList.find(x => x.id === value)
            if (tax && tax.amount < 0) {
                this.$message.error('税率不能为负数，请重新选择')
                return
            }
            this.data.map(x => {
                x.tax_id = value
                return x
            })
            this.calcTaxs()
        }

        if (column === 'tax_id' && row.quantity > 0 && row.price_unit > 0) {
            this.calcTaxs()
        }

        this.$emit('change', this.data)
    }

    private addLine() {
        let idx = UUID.generate()
        this.data.push({
            id: 0,
            name: '',
            description: '',
            quantity: 1,
            price_unit: 0,
            tax_id: 0,
            price_subtotal: 0,
            product_id: 0,
            index: idx
        })
        this.currentRow = idx
        this.$emit('change', this.data)
    }

    private onDelete(row) {
        this.data = this.data.filter(x => x.index != row.index)
        this.$emit('change', this.data)
    }

    private calcTaxs() {
        if (this.data.length) {
            this.untax = 0
            this.tax = 0
            this.total = 0
            for (var i of this.data) {
                if (i.price_unit && i.quantity) {
                    i.price_subtotal = (i.price_unit * i.quantity).toFixed(2)
                }
                let price_subtotal = i.price_subtotal > 0 ? i.price_subtotal : 0
                this.total += parseFloat(price_subtotal)
                if (i.tax_id > 0) {
                    let amount = 0
                    let tax = this.taxesList.find(x => x.id === i.tax_id)
                    if (tax && tax.amount > 0) {
                        amount = tax.amount
                    }
                    this.tax += (price_subtotal * amount) / (100 + amount)
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
        this.calcTaxs()

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
                this.skuQueryResult = data.map(x => {
                    x.name = '[' + x.default_code + ']' + x.name
                    return x
                })
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
                item['name'] = data.name
                item['product_id'] = data.product_id

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
    "en-us": {
        "product": "Product",
        "quantity": "Quantity",
        "description": "Description",
        "available_qty": "Available Qty",
        "delivered": "Ship Type",
        "invoiced": "Pre Sale",
        "price_unit": "Unit Price",
        "price_tax": "Taxes",
        "subtotal": "Subtotal",
        "fulfillment_center": "Fulfillment Center",
        "operate": "Operate",
        "delete": "Delete",
        "actions": {
            "add": "Add",
            "action": "Action",
            "save": "Save",
            "delete": "Delete",
            "cancel": "Cancel"
        }
    },
    "zh-cn": {
        "product": "产品",
        "quantity": "数量",
        "description": "描述",
        "available_qty": "可用数量",
        "delivered": "发货数量",
        "invoiced": "发票数量",
        "price_unit": "单价",
        "price_tax": "税",
        "subtotal": "合计",
        "fulfillment_center": "履行中心",
        "operate": "操作",
        "delete": "删除",
        "actions": {
            "add": "新增",
            "action": "操作",
            "save": "保存",
            "delete": "删除",
            "cancel": "取消"
        }
    }
}
</i18n>
