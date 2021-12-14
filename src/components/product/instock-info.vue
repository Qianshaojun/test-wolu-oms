<template>
    <section class="component order-product-detail">
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                1. {{ $t('title-1') }}
            </h3>
            <a-table
                :dataSource="stockInfo"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="index"
                bordered
            >
                <a-table-column
                    :title="$t('default_code')"
                    key="default_code"
                    data-index="default_code"
                    align="left"
                    width="7%"
                ></a-table-column>
                <a-table-column
                    :title="$t('stock_available_quantity')"
                    key="stock_available_quantity"
                    data-index="stock_available_quantity"
                    align="left"
                    width="7%"
                ></a-table-column>
                <a-table-column
                    :title="$t('stock_de_available_qty')"
                    key="stock_de_available_qty"
                    data-index="stock_de_available_qty"
                    align="left"
                    width="7%"
                ></a-table-column>
                <a-table-column
                    :title="$t('stock_uk_available_qty')"
                    key="stock_uk_available_qty"
                    data-index="stock_uk_available_qty"
                    align="left"
                    width="7%"
                ></a-table-column>
                <a-table-column
                    :title="$t('stock_onhand_quantity')"
                    key="stock_onhand_quantity"
                    data-index="stock_onhand_quantity"
                    align="left"
                    width="7%"
                ></a-table-column>
                <a-table-column
                    :title="$t('stock_de_onhand_qty')"
                    key="stock_de_onhand_qty"
                    data-index="stock_de_onhand_qty"
                    align="left"
                    width="7%"
                ></a-table-column>
                <a-table-column
                    :title="$t('stock_uk_onhand_qty')"
                    key="stock_uk_onhand_qty"
                    data-index="stock_uk_onhand_qty"
                    align="left"
                    width="7%"
                ></a-table-column>
                <a-table-column
                    :title="$t('fba_stock_qty')"
                    key="fba_stock_qty"
                    data-index="fba_stock_qty"
                    align="left"
                    width="7%"
                ></a-table-column>
                <a-table-column
                    :title="$t('all_shipping_product_qty')"
                    key="all_shipping_product_qty"
                    data-index="all_shipping_product_qty"
                    align="left"
                    width="7%"
                ></a-table-column>
                <a-table-column
                    :title="$t('de_shipping_product_qty')"
                    key="de_shipping_product_qty"
                    data-index="de_shipping_product_qty"
                    align="left"
                    width="7%"
                ></a-table-column>
                <a-table-column
                    :title="$t('uk_shipping_product_qty')"
                    key="uk_shipping_product_qty"
                    data-index="uk_shipping_product_qty"
                    align="left"
                    width="7%"
                ></a-table-column>
                <a-table-column
                    :title="$t('all_factory_product_qty')"
                    key="all_factory_product_qty"
                    data-index="all_factory_product_qty"
                    align="left"
                    width="7%"
                ></a-table-column>
                <a-table-column
                    :title="$t('de_factory_product_qty')"
                    key="de_factory_product_qty"
                    data-index="de_factory_product_qty"
                    align="left"
                    width="7%"
                ></a-table-column>
                <a-table-column
                    :title="$t('uk_factory_product_qty')"
                    key="uk_factory_product_qty"
                    data-index="uk_factory_product_qty"
                    align="left"
                    width="7%"
                ></a-table-column>
            </a-table>
        </a-card>
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                2. {{ $t('title-2') }}
            </h3>
            <a-table
                :dataSource="locationList"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="location_name"
                bordered
            >
                <a-table-column
                    :title="$t('location_name')"
                    key="log_clocation_nameontent"
                    data-index="location_name"
                    align="left"
                    width="50%"
                ></a-table-column>
                <a-table-column
                    :title="$t('location_stock_qty')"
                    key="location_stock_qty"
                    data-index="location_stock_qty"
                    align="center"
                    width="50%"
                ></a-table-column>
            </a-table>
        </a-card>
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                3. {{ $t('title-3') }}
            </h3>
            <a-table
                :dataSource="shippingList"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="default_code"
                bordered
            >
                <a-table-column
                    :title="$t('default_code')"
                    key="default_code"
                    data-index="default_code"
                    align="left"
                    width="12%"
                ></a-table-column>
                <a-table-column
                    :title="$t('package_qty')"
                    key="package_qty"
                    data-index="package_qty"
                    align="center"
                    width="10%"
                ></a-table-column>
                <a-table-column
                    :title="$t('hg_name')"
                    key="hg_name"
                    data-index="hg_name"
                    align="center"
                    width="16%"
                ></a-table-column>
                <a-table-column
                    :title="$t('warehouse_id')"
                    key="warehouse_id"
                    data-index="warehouse_id"
                    align="center"
                    width="10%"
                ></a-table-column>
                <a-table-column
                    :title="$t('port_start')"
                    key="port_start"
                    data-index="port_start"
                    align="center"
                    width="12%"
                ></a-table-column>
                <a-table-column
                    :title="$t('port_end')"
                    key="port_end"
                    data-index="port_end"
                    align="center"
                    width="12%"
                ></a-table-column>
                <a-table-column
                    :title="$t('state')"
                    key="state"
                    data-index="state"
                    align="center"
                    width="12%"
                ></a-table-column>
                <a-table-column
                    :title="$t('land_date')"
                    key="land_date"
                    data-index="land_date"
                    align="center"
                    width="16%"
                >
                    <template slot-scope="land_date">
                        {{ land_date | datetolocal }}
                    </template>
                </a-table-column>
            </a-table>
        </a-card>
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                4. {{ $t('title-4') }}
            </h3>
            <a-table
                :dataSource="amazonList"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="default_code"
                bordered
            >
                <a-table-column
                    :title="$t('default_code')"
                    key="default_code"
                    data-index="default_code"
                    align="left"
                    width="14%"
                ></a-table-column>
                <a-table-column
                    :title="$t('woltu_amazon')"
                    key="woltu_amazon"
                    data-index="woltu_amazon"
                    align="center"
                    width="10%"
                ></a-table-column>
                <a-table-column
                    :title="$t('woltu_amazon_uk')"
                    key="woltu_amazon_uk"
                    data-index="woltu_amazon_uk"
                    align="center"
                    width="10%"
                ></a-table-column>
                <a-table-column
                    :title="$t('eugad_amazon')"
                    key="eugad_amazon"
                    data-index="eugad_amazon"
                    align="center"
                    width="10%"
                ></a-table-column>
                <a-table-column
                    :title="$t('eugad_amazon_uk')"
                    key="eugad_amazon_uk"
                    data-index="eugad_amazon_uk"
                    align="center"
                    width="10%"
                ></a-table-column>
                <a-table-column
                    :title="$t('situ_amazon')"
                    key="situ_amazon"
                    data-index="situ_amazon"
                    align="center"
                    width="12%"
                ></a-table-column>
                <a-table-column
                    :title="$t('eucashbox_amazon')"
                    key="eucashbox_amazon"
                    data-index="eucashbox_amazon"
                    align="center"
                    width="12%"
                ></a-table-column>
                <a-table-column
                    :title="$t('elight_amazon')"
                    key="elight_amazon"
                    data-index="elight_amazon"
                    align="center"
                    width="12%"
                ></a-table-column>
                <a-table-column
                    :title="$t('meteorsrain_amazon')"
                    key="meteorsrain_amazon"
                    data-index="meteorsrain_amazon"
                    align="center"
                    width="10%"
                ></a-table-column>
            </a-table>
        </a-card>
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                5. {{ $t('title-5') }}
            </h3>
            <a-table
                :dataSource="factoryList"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="default_code"
                bordered
            >
                <a-table-column
                    :title="$t('default_code')"
                    key="default_code"
                    data-index="default_code"
                    align="left"
                    width="15%"
                ></a-table-column>
                <a-table-column
                    :title="$t('product_qty')"
                    key="product_qty"
                    data-index="product_qty"
                    align="center"
                    width="15%"
                ></a-table-column>
                <a-table-column
                    :title="$t('is_fba')"
                    key="is_fba"
                    data-index="is_fba"
                    align="center"
                    width="15%"
                >
                    <template slot-scope="is_fba">
                        <a-checkbox :ckecked="is_fba" :disabled="true" />
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('warehouse_id')"
                    key="warehouse_id"
                    data-index="warehouse_id"
                    align="center"
                    width="15%"
                ></a-table-column>
                <a-table-column
                    :title="$t('date_expected')"
                    key="date_expected"
                    data-index="date_expected"
                    align="center"
                    width="20%"
                >
                    <template slot-scope="date_expected">
                        {{ date_expected | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('order_date')"
                    key="order_date"
                    data-index="order_date"
                    align="center"
                    width="20%"
                >
                    <template slot-scope="order_date">
                        {{ order_date | datetolocal }}
                    </template>
                </a-table-column>
            </a-table>
        </a-card>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ProductService } from '../../services/product.service'
import { RequestParams } from '@/core/http'
import { LoadingService } from '../../bootstrap/services/loading.service'
@Component({
    components: {}
})
export default class InstockInfo extends Vue {
    @Prop()
    private info

    @Prop()
    id: any

    @Prop()
    private systemUsers

    private data: any[] = []

    private stockInfo: any[] = []

    private locationList: any[] = []

    private factoryList: any[] = []

    private shippingList: any[] = []

    private amazonList: any[] = []

    private productService = new ProductService()

    private loadingService = new LoadingService()

    private mounted() {
        this.data = this.info
        this.getInstock()
        this.getLocationInstock()
        this.getFactoryInstock()
        this.getShippingInstock()
        this.getAmazonInstock()
    }

    @Watch('info')
    private onInfoChange() {
        this.data = this.info
    }

    private getInstock() {
        this.productService
            .query_product_stock_info(
                new RequestParams(
                    { product_tmpl_id: parseInt(this.id) },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    this.stockInfo = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getLocationInstock() {
        this.productService
            .query_location_stock_detail(
                new RequestParams(
                    { product_tmpl_id: parseInt(this.id) },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    this.locationList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getFactoryInstock() {
        this.productService
            .query_factory_product_detail(
                new RequestParams(
                    { product_tmpl_id: parseInt(this.id) },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    this.factoryList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getShippingInstock() {
        this.productService
            .query_shipping_product_detail(
                new RequestParams(
                    { product_tmpl_id: parseInt(this.id) },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    this.shippingList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getAmazonInstock() {
        this.productService
            .query_amazon_listing_detail(
                new RequestParams(
                    { product_tmpl_id: parseInt(this.id) },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    this.amazonList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }
}
</script>

<i18n>
{
  "en-us":{
    "default_code":"Default Code",
    "all_factory_product_qty":"All factory product qty",
    "all_shipping_product_qty":"All shipping product qty",
    "de_factory_product_qty":"De factory product qty",
    "de_shipping_product_qty":"De shipping product qty",
    "default_code":"Default code",
    "fba_stock_qty":"Fba stock qty",
    "stock_available_quantity":"Stock available quantity",
    "stock_de_available_qty":"Stock de available qty",
    "stock_de_onhand_qty":"Stock de onhand qty",
    "stock_onhand_quantity":"Stock onhand quantity",
    "stock_uk_available_qty":"Stock uk available qty",
    "stock_uk_onhand_qty":"Stock uk onhand qty",
    "uk_factory_product_qty":"Uk factory product qty",
    "uk_shipping_product_qty":"Uk shipping product qty",
    "location_name":"Location name",
    "location_stock_qty":"Location stock qty",
    "date_expected":"Date expected",
    "is_fba":"Is fba",
    "order_date":"Order date",
    "product_qty":"Product qty",
    "warehouse_id":"Warehouse id",
    "hg_name":"Package name",
    "land_date":"ETA",
    "package_qty":"Package qty",
    "port_end":"Port end",
    "port_start":"Port start",
    "state":"State",
    "elight_amazon":"Elight Amazon",
    "eucashbox_amazon":"Eucashbox Amazon",
    "eugad_amazon":"Eugad Amazon",
    "meteorsrain_amazon":"Meteorsrain Amazon",
    "situ_amazon":"Situ Amazon",
    "woltu_amazon":"Woltu Amazon",
    "woltu_amazon_uk":"Woltu Amazon UK",
    "eugad_amazon_uk":"Eugad Amazon UK",
    "title-1":"库存数据汇总",
    "title-2":"库存详情",
    "title-3":"在途数据详情",
    "title-4":"在架数据详情",
    "title-5":"在厂数据详情"
  },
  "zh-cn":{
    "default_code":"货号SKU",
    "all_factory_product_qty":"在厂产品总数",
    "all_shipping_product_qty":"在途产品总数",
    "de_factory_product_qty":"德仓在厂产品数量",
    "de_shipping_product_qty":"德仓在途产品数量",
    "fba_stock_qty":"FBA仓",
    "stock_available_quantity":"总可用数量",
    "stock_de_available_qty":"德仓可用数量",
    "stock_de_onhand_qty":"德仓在手数量",
    "stock_onhand_quantity":"总在手数量",
    "stock_uk_available_qty":"英仓可用数量",
    "stock_uk_onhand_qty":"英仓在手数量",
    "uk_factory_product_qty":"英仓在厂数量",
    "uk_shipping_product_qty":"英仓在途数量",
    "location_name":"库位名称",
    "location_stock_qty":"库位产品数量",
    "date_expected":"期望入库",
    "is_fba":"是否FBA",
    "order_date":"下单日期",
    "product_qty":"产品数量",
    "warehouse_id":"仓库",
    "hg_name":"货柜名称",
    "land_date":"ETA",
    "package_qty":"产品数量",
    "port_end":"目的港口",
    "port_start":"发船港口",
    "state":"状态",
    "elight_amazon":"Elight Amazon",
    "eucashbox_amazon":"Eucashbox Amazon",
    "eugad_amazon":"Eugad Amazon",
    "meteorsrain_amazon":"Meteorsrain Amazon",
    "situ_amazon":"Situ Amazon",
    "woltu_amazon":"Woltu Amazon",
    "woltu_amazon_uk":"Woltu Amazon UK",
    "eugad_amazon_uk":"Eugad Amazon UK",
    "title-1":"库存数据汇总",
    "title-2":"库存详情",
    "title-3":"在途数据详情",
    "title-4":"在架数据详情",
    "title-5":"在厂数据详情"
  }
}
</i18n>
