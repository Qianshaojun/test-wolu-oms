<template>
    <section class="component order-base-detail">
        <div style="padding:0 20px 10px 20px;">
            <a-button @click="addBtn" type="primary">{{
                $t('actions.add')
            }}</a-button>
            <a-button @click="saveBtn" style="margin-left:10px;">{{
                $t('actions.save')
            }}</a-button>
            <a-button @click="cancelBtn" style="margin-left:10px;">{{
                $t('actions.cancel')
            }}</a-button>
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
            <a-table-column :title="$t('product')" key="name" align="left">
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
                    <span v-else :title="row.name">{{
                        row.name
                            ? row.name.length > 20
                                ? row.name.substr(0, 17) + '...'
                                : row.name
                            : ''
                    }}</span>
                </template>
            </a-table-column>
            <a-table-column :title="$t('default_code')" key="default_code">
                <template slot-scope="row">
                    <a
                        title="old version of the Product Manual(老版说明书)"
                        :href="row.product_url"
                        target="_blank"
                        v-if="row.product_url && row.product_url.length > 10"
                        >{{ row.default_code }}</a
                    >
                    <span v-else>
                        {{ row.default_code }}
                    </span>
                    <span
                        title="new version of the Product Manual(新版说明书)"
                        v-if="row.manual_id"
                    >
                        <a :href="row.manual_url" target="_blank">
                            <a-icon
                                type="file-text"
                                style="margin-left:10px;color:blue;"
                        /></a>
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('quantity')"
                key="product_uom_qty"
                align="right"
            >
                <template slot-scope="row">
                    <a-input-number
                        decimalSeparator=","
                        v-if="currentRow == row.index && editable"
                        v-decorator="['product_uom_qty']"
                        :value="row.product_uom_qty"
                        :style="{ width: '100%' }"
                        :min="0"
                        size="small"
                        @change="e => onRowChange(row, 'product_uom_qty', e)"
                    />
                    <span v-else>{{ row.product_uom_qty }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('unit_measure')"
                key="product_uom"
                data-index="product_uom"
                align="center"
            >
                <template slot-scope="product_uom">
                    <span :_id="product_uom">Unit</span>
                </template>
            </a-table-column>
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
                :title="$t('ship_type')"
                key="mv_ship_type"
                align="center"
            >
                <template slot-scope="row">
                    <a-select
                        v-if="currentRow == row.index && editable"
                        v-decorator="['mv_ship_type']"
                        :value="row.mv_ship_type"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '200px' }"
                        size="small"
                        @change="e => onRowChange(row, 'mv_ship_type', e)"
                    >
                        <a-select-option
                            v-for="i of mvShipTypeList"
                            :key="i.code"
                            :value="i.code"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select>
                    <span v-else>
                        {{ row.mv_ship_type | dict2(mvShipTypeList) }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('pre_sale')"
                key="pre_sale"
                align="center"
            >
                <template slot-scope="row">
                    <a-checkbox
                        :disabled="true"
                        v-decorator="['pre_sale']"
                        :checked="row.pre_sale"
                    />
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('max_pack_qty')"
                key="min_pack"
                align="right"
            >
                <template slot-scope="row">
                    {{ row.min_pack }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('packet_category')"
                key="pack_cate"
                align="center"
            >
                <template slot-scope="row">
                    {{ row.pack_cate }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('date_count')"
                key="date_count"
                align="center"
            >
                <template slot-scope="row">
                    {{ row.date_count }}
                </template>
            </a-table-column>
            <a-table-column :title="$t('status')" key="state" align="center">
                <template slot-scope="row">
                    {{ row.state | dict('PickingStatus') | translate }}
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
                </template>
            </a-table-column>
        </a-table>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ProductService } from '@/services/product.service'
import { RequestParams } from '@/core/http'
import { CommonService } from '@/shared/utils/common.service'
import { formConfig } from '@/config/form.config'
import SearchProduct from '@/components/product/search-product.vue'
import { PickingService } from '../../services/picking.service'
import { LoadingService } from '@/bootstrap/services/loading.service'
import { GeneralCodeService } from '@/services/general_code.service'
import UUID from 'uuidjs'
import { namespace } from 'vuex-class'
import store from '~/store'

const datasModule = namespace('datasModule')

@Component({
    components: {}
})
export default class DemandDetail extends Vue {
    @Prop()
    info: any

    @Prop()
    id: any

    @Prop()
    changeSpinning

    private currentRow: any = ''

    private editable: any = true

    private data: any[] = []

    private skuSource: any[] = []

    private skuQueryResult: any[] = []

    // private shipmentList: any[] = []

    private deleteList: any[] = []

    private productService = new ProductService()

    private pickingService = new PickingService()

    private loadingService = new LoadingService()

    private generalCodeService = new GeneralCodeService()

    private mvShipTypeList: any = []

    private sd: any = store

    private mounted() {
        this.mvShipTypeList = this.sd.state.datasModule.mvShipTypeList
        if (this.info.length) {
            this.data = this.info.map(x => {
                x['save_flag'] = 1
                x['index'] = UUID.generate()
                return x
            })
        }
    }

    @Watch('info')
    private onInfoChange() {
        this.deleteList = []
        if (this.info.length) {
            this.data = this.info.map(x => {
                x['save_flag'] = 1
                x['index'] = UUID.generate()
                return x
            })
        } else {
            this.data = []
        }
    }

    private addBtn() {
        this.data.push({
            save_flag: 0,
            index: UUID.generate(),
            date_count: '',
            default_code: '',
            min_pack: 0,
            mv_ship_type: '',
            name: '',
            pack_cate: '',
            pre_sale: false,
            product_uom: 1,
            product_uom_qty: 0,
            state: 'draft',
            stock_available_quantity: 0
        })
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

        if (column === 'name') {
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
    }

    private saveBtn() {
        let list: any = []
        for (var i of this.data) {
            delete i.index
            delete i.default_code
            delete i.min_pack
            delete i.pack_cate
            delete i.stock_available_quantity
            delete i.pre_sale
            delete i.available_qty
            delete i.product_url
            delete i.stock_de_available_qty
            delete i.stock_uk_available_qty
            delete i.manual_id
            delete i.manual_url

            list.push(i)
        }
        if (this.deleteList.length) {
            for (var j of this.deleteList) {
                delete i.index
                delete i.default_code
                delete i.min_pack
                delete i.pack_cate
                delete i.stock_available_quantity
                delete i.pre_sale
                delete i.available_qty
                delete i.product_url
                delete i.stock_de_available_qty
                delete i.stock_uk_available_qty
                delete i.manual_id
                delete i.manual_url

                list.push(j)
            }
        }

        let loading: any = ''
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }

        this.pickingService
            .saveMove(
                new RequestParams(
                    {
                        picking_id: parseInt(this.id),
                        move_list: list
                    },
                    loading
                )
            )
            .subscribe(
                () => {
                    this.deleteList = []
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                },
                err => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                    this.$message.error(err.message)
                }
            )
    }

    private cancelBtn() {
        this.currentRow = -1
        this.getDemands()
    }

    private getDemands() {
        this.pickingService
            .queryStockMove(
                new RequestParams({
                    picking_id: parseInt(this.id)
                })
            )
            .subscribe(
                data => {
                    this.data = data.map((x, i) => ({
                        ...x,
                        index: UUID.generate(),
                        save_flag: 1
                    }))
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDel(row) {
        this.currentRow = -1
        let item = this.data.find(x => x.index === row.index)
        if (item) {
            if (item.save_flag == 1) {
                item['save_flag'] = 2
                this.deleteList.push(item)
            } else {
                item['save_flag'] = 2
            }
        }
        this.data = this.data.filter(x => !x.save_flag || x.save_flag < 2)
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
            .queryAsyncProductInfo(new RequestParams(params))
            .subscribe(data => {
                this.skuSource = data.map(
                    x => '[' + x.default_code + ']' + x.name
                )
                this.skuQueryResult = data
            })
    }

    private onSkuChange(key, row) {
        if (key && key.length > 1) {
            var productItem = this.skuQueryResult.find(
                x => x.default_code === key
            )

            // this.product = productItem ? productItem : []
        }
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

                this.currentRow = -1
                let _t
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
    "unit_measure":"Unit of Measure",
    "available_qty":"Available Qty",
    "ship_type":"Ship Type",
    "pre_sale":"Pre Sale",
    "max_pack_qty":"Max Pack Qty",
    "packet_category":"Packet Category",
    "date_count":"Date Count",
    "status":"Status",
    "default_code":"DefaultCode",
    "stock_de_available_qty": "stock_de_available_qty",
    "stock_uk_available_qty": "stock_uk_available_qty",
    "actions":{
      "add":"Add",
      "action":"Action",
      "save":"Save",
      "delete":"Delete",
      "cancel":"Discard"   
    }
  },
  "zh-cn":{
    "product":"产品",
    "quantity":"数量",
    "unit_measure":"计量单位",
    "available_qty":"可用数量",
    "ship_type":"物流类型",
    "pre_sale":"预售",
    "max_pack_qty":"最大包数",
    "packet_category":"包种类",
    "date_count":"日期统计",
    "status":"状态",
    "default_code":"货号",
    "stock_de_available_qty": "DE可用数量",
    "stock_uk_available_qty": "UK可用数量",
    "actions":{
      "add":"新增",
      "action":"操作",
      "save":"保存",
      "delete":"删除",
      "cancel":"丢弃"
    }
  }
}
</i18n>
