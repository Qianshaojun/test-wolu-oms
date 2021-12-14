<template>
    <section
        class="component order-base-detail"
        :style="{ height: divHeight + 'px', overflow: 'auto' }"
    >
        <a-table
            :dataSource="data"
            :pagination="false"
            style="table-layout:fixed;"
            rowKey="sku"
            bordered
        >
            <a-table-column :title="$t('sku')" key="default_code" align="left">
                <template slot-scope="row">
                    <a
                        title="Download the Product Manual(产品说明书)"
                        :href="row.product_url"
                        target="_blank"
                        v-if="row.product_url && row.product_url.length > 10"
                        >{{ row.default_code }}</a
                    >
                    <span v-else>
                        {{ row.default_code }}
                    </span>
                    <span v-if="row.product_link" style="float:right;">
                        <a-popover placement="right">
                            <template slot="content">
                                <img
                                    :src="row.product_link"
                                    style="width:200px;"
                                />
                            </template>
                            <a-icon type="file-image" />
                        </a-popover>
                    </span>
                </template>
            </a-table-column>
            <a-table-column :title="$t('product_name')" key="name" align="left">
                <template slot-scope="row">
                    <span :title="row.name">{{
                        row.name
                            ? row.name.length > 40
                                ? row.name.substr(0, 37) + '...'
                                : row.name
                            : ''
                    }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('order_qty')"
                key="product_uom_qty"
                data-index="product_uom_qty"
                align="right"
            ></a-table-column>
            <a-table-column
                :title="$t('unit_price')"
                key="price_unit"
                data-index="price_unit"
                align="right"
            ></a-table-column>
            <a-table-column
                :title="$t('stock_de_available_qty')"
                key="stock_de_available_qty"
                align="right"
            >
                <template slot-scope="row">
                    {{ row.stock_de_available_qty }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('stock_uk_available_qty')"
                key="stock_uk_available_qty"
                align="right"
            >
                <template slot-scope="row">
                    {{ row.stock_uk_available_qty }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('taxes')"
                key="tax_name"
                data-index="tax_name"
                align="center"
            ></a-table-column>
            <a-table-column
                :title="$t('fullfilment_center')"
                key="fulfillment_center_id"
                data-index="fulfillment_center_id"
                align="center"
            ></a-table-column>
        </a-table>
        <div style="width:100%;display:inline-block;">
            <div style="width:200px;float:right;">
                <p style="padding:0;margin:0;">
                    Untaxed Amount：
                    {{ parseFloat(untax.toFixed(2)) }}
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

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({
    components: {}
})
export default class OrderBaseDetail extends Vue {
    @Prop()
    private info

    @Prop()
    private height

    private divHeight: any = 100

    @Watch('height')
    private onHeightChange() {
        this.divHeight = this.height
    }

    private data: any[] = []

    private untax: any = 0
    private tax: any = 0
    private total: any = 0

    private mounted() {
        this.data = this.info.map(x => x)
        this.divHeight = this.height
    }

    @Watch('info')
    private onInfoChange() {
        if (this.info.length) {
            this.data = this.info.map(x => x)
            this.untax = 0
            this.tax = 0
            this.total = 0
            for (let i of this.data) {
                this.total += i.price_total
                this.tax += i.price_tax
                this.untax += i.price_subtotal
            }
        } else {
            this.data = []
        }
    }
}
</script>

<i18n>
{
    "en-us": {
        "sku": "SKU",
        "product_name": "Product Name",
        "order_qty": "Order Qty",
        "unit_price": "Unit_Price",
        "available_qty": "Available Qty",
        "taxes": "Taxes",
        "fullfilment_center": "Fullfilment Center",
        "stock_de_available_qty": "stock_de_available_qty",
        "stock_uk_available_qty": "stock_uk_available_qty"
    },
    "zh-cn": {
        "sku": "SKU",
        "product_name": "产品名称",
        "order_qty": "订单数量",
        "unit_price": "单价",
        "available_qty": "可用数量",
        "taxes": "税额",
        "fullfilment_center": "履行中心",
        "stock_de_available_qty": "DE可用数量",
        "stock_uk_available_qty": "UK可用数量"
    }
}
</i18n>
