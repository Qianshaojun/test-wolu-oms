<template>
    <section class="component order-product-detail">
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                1. {{ $t('title-1') }}
            </h3>
            <a-table
                :dataSource="deList"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="country"
                bordered
            >
                <a-table-column
                    :title="$t('country')"
                    key="country"
                    data-index="country"
                    align="center"
                    width="40%"
                ></a-table-column>
                <a-table-column
                    :title="$t('ship_method')"
                    key="ship_method"
                    data-index="ship_method"
                    align="center"
                    width="30%"
                ></a-table-column>
                <a-table-column
                    :title="$t('price')"
                    key="price"
                    data-index="price"
                    align="center"
                    width="30%"
                >
                    <template slot-scope="price">
                        {{ price > 0 ? price.toFixed(2) : '0' }}
                    </template>
                </a-table-column>
            </a-table>
        </a-card>
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                2. {{ $t('title-2') }}
            </h3>
            <a-table
                :dataSource="ukList"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="country"
                bordered
            >
                <a-table-column
                    :title="$t('country')"
                    key="country"
                    data-index="country"
                    align="center"
                    width="40%"
                ></a-table-column>
                <a-table-column
                    :title="$t('ship_method')"
                    key="ship_method"
                    data-index="ship_method"
                    align="center"
                    width="30%"
                ></a-table-column>
                <a-table-column
                    :title="$t('price')"
                    key="price"
                    data-index="price"
                    align="center"
                    width="30%"
                ></a-table-column>
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
export default class ShipmentInfo extends Vue {
    @Prop()
    private info

    @Prop()
    id: any

    @Prop()
    private systemUsers

    private productService = new ProductService()

    private loadingService = new LoadingService()

    private data: any[] = []

    private deList: any[] = []

    private ukList: any[] = []

    private mounted() {
        this.getDeShipmentInfo()
        this.getUkShipmentInfo()
        this.data = this.info
    }

    @Watch('info')
    private onInfoChange() {
        this.data = this.info
    }

    private compare = function(prop) {
        return function(obj1, obj2) {
            var val1 = obj1[prop]
            var val2 = obj2[prop]
            if (val1 > val2) {
                return -1
            } else if (val1 < val2) {
                return 1
            } else {
                return 0
            }
        }
    }

    private getDeShipmentInfo() {
        this.productService
            .query_de_best_logistic_info(
                new RequestParams(
                    { product_tmpl_id: parseInt(this.id) },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    this.deList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getUkShipmentInfo() {
        this.productService
            .query_uk_best_logistic_info(
                new RequestParams(
                    { product_tmpl_id: parseInt(this.id) },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    this.ukList = data
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
    "title-1":"DE Shipment Info",
    "title-2":"UK Shipment Info",
    "country":"Country",
    "ship_method":"Ship Method",
    "price":"Price"
  },
  "zh-cn":{
    "title-1":"德仓自发货最优物流方式",
    "title-2":"英仓自发货最优物流方式",
    "country":"国家",
    "ship_method":"物流方式",
    "price":"价格"
  }
}
</i18n>
