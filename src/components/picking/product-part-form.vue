<template>
    <section
        class="component order-base-detail"
        style="max-height:600px;overflow-x:hidden;overflow-y:auto;"
    >
        <a-card class="margin-y" style="margin:0 !important;">
            <a-row :gutter="24" style="margin-bottom: 8px">
                <a-col :span="2">
                    <span>{{ $t('columns.product_sku') }}</span>
                </a-col>
                <a-col :span="8">
                    <a-select
                        style="width:100%"
                        v-model="product_part"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option
                            v-for="item of product_list"
                            :value="item.id"
                            :key="item.id"
                            >{{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-col>
                <a-col :span="3" :offset="2">
                    <span>{{ $t('columns.shipment_type') }}</span>
                </a-col>
                <a-col :span="9">
                    <a-select
                        style="width:100%"
                        v-model="shipment_type"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        @change="e => onShipmentTypeChange(e)"
                    >
                        <a-select-option value="dpd" key="dpd"
                            >DPD
                        </a-select-option>
                        <a-select-option value="dhl" key="ship_order"
                            >DHL
                        </a-select-option>
                        <a-select-option value="bri" key="bri"
                            >Brief
                        </a-select-option>
                        <a-select-option value="gls" key="gls"
                            >GLS
                        </a-select-option>
                        <a-select-option value="RM_TR48" key="RM_TR48"
                            >UK_RoyalMail
                        </a-select-option>
                        <a-select-option value="HERM_48" key="HERM_48"
                            >UK_Hermes
                        </a-select-option>
                    </a-select>
                </a-col>
            </a-row>
            <div v-show="listData.length > 0">
                <br />
                <a-list
                    :grid="{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 4,
                        lg: 4,
                        xl: 6,
                        xxl: 3
                    }"
                    :data-source="listData"
                >
                    <a-list-item slot="renderItem" slot-scope="item, index">
                        <span>{{ item.default_code }}</span>
                        <a-input-number
                            decimalSeparator=","
                            :min="1"
                            :value="item.quantity"
                            size="small"
                            style="margin:0 3px"
                            @change="e => handleListChange(e, index)"
                        />
                        <a-icon @click="deleteList(index)" type="delete" />
                    </a-list-item>
                </a-list>
            </div>
            <a-table
                :dataSource="data"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="name"
                bordered
                :scroll="{ y: 300 }"
            >
                <a-table-column
                    :title="$t('forms.default_code')"
                    key="default_code"
                    align="left"
                    data-index="default_code"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('forms.product_name')"
                    key="name"
                    data-index="name"
                    align="left"
                ></a-table-column>
                <a-table-column
                    :title="$t('forms.manual_url')"
                    key="manual_id"
                    align="center"
                >
                    <template slot-scope="row">
                        <span title="老版说明书" v-if="row.product_url"
                            ><a :href="row.product_url" target="_blank">{{
                                product_name
                            }}</a></span
                        >
                        <span v-else
                            ><a>{{ product_name }}</a></span
                        >
                        <!-- <span title="新版说明书" v-if="row.manual_id">
                            <a :href="row.manual_url" target="_blank">
                                <a-icon
                                    type="file-text"
                                    style="margin-left:10px;color:blue;"
                            /></a>
                        </span> -->
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('forms.quantity')"
                    key="quantity"
                    data-index="quantity"
                    align="right"
                >
                    <template slot-scope="quantity, row">
                        <a-input-number
                            decimalSeparator=","
                            :value="quantity"
                            size="small"
                            @change="e => handleChange(e, row, 'quantity')"
                        />
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('forms.Add')"
                    key="delete"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-icon @click="onAdd(row)" type="file-add" />
                    </template>
                </a-table-column>
            </a-table>
        </a-card>
        <div>
            <p style="margin: 10px 0 0 0;">{{ $t('create_tmpl_part_no') }}：</p>
            <ul>
                <li
                    v-for="item of tempPartList"
                    :key="item.id"
                    style="margin:10px 0;"
                >
                    <a-input-number
                        :value="item.quantity"
                        @change="e => handleShipmentChange(e, item, 'quantity')"
                        :min="1"
                    />
                    ×
                    <a-input
                        style="width:270px;"
                        :value="item.part_code"
                        @change="
                            e => handleShipmentChange(e, item, 'part_code')
                        "
                        :placeholder="$t('part_no_name')"
                    />
                    /
                    <a-auto-complete
                        :dataSource="prodList"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '300px' }"
                        :defaultValue="item.default_code"
                        :value="item.default_code"
                        @change="
                            e => handleShipmentChange(e, item, 'default_code')
                        "
                        style="width: 270px"
                        :placeholder="$t('resend_prod_sku')"
                        @search="e => onSearch(e)"
                    >
                        <template slot="dataSource">
                            <a-select-option
                                v-for="opt in prodList"
                                :key="opt.id"
                                :value="opt.id"
                                >{{ opt.name }}
                            </a-select-option>
                            <a-select-option
                                key="all"
                                disabled
                                class="show-all"
                            >
                                <a @click="searchMore(item)">
                                    Search More
                                </a>
                            </a-select-option>
                        </template>
                    </a-auto-complete>
                    <a-icon
                        type="minus-circle"
                        style="margin-left:5px;"
                        @click="deleteShipmentContent(item.id)"
                    />
                </li>
            </ul>
            <a-button
                type="dashed"
                style="width: 660px;margin-left:40px;"
                @click="addShipmentContent"
            >
                <a-icon type="plus" />
                {{ $t('add_tmpl_part_no') }}
            </a-button>
        </div>
        <div>
            <p style="margin:10px 0 0 0;">
                <a-checkbox
                    @change="e => onPartCheckStatusChange(e)"
                ></a-checkbox>
                <span style="font-weight:600;color:#222;margin:10px;"
                    >shipment content:</span
                >
            </p>
            <div v-if="showShipmentContent" style="margin-bottom:20px;">
                <a-textarea
                    row="4"
                    col="40"
                    style="width:760px;"
                    placeholder="备注，如@仓库3333"
                    @input="e => onShipmentContentChange(e)"
                />
            </div>
        </div>
    </section>
</template>
<style>
.xtb {
    width: 100%;
    border: none;
}

.xtb .first-td {
    width: 8%;
    border-right: 1px solid #ccc;
}

.xtb .sencond-td {
    width: 70%;
    padding-left: 1%;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { OrderService } from '../../services/order.service'
import { PickingService } from '~/services/picking.service'
import { RequestParams } from '../../core/http'
import { LoadingService } from '../../bootstrap/services/loading.service'
import UUID from 'uuidjs'
import SearchProduct from '../product/search-product.vue'

@Component({
    components: {}
})
export default class ProductPartForm extends Vue {
    @Prop()
    private picking_id

    @Prop()
    private order_id

    @Prop()
    private changeSpinning

    private product_list: any[] = []

    private get loading() {
        let loading: any = {}
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }
        return loading
    }

    private closeLoading() {
        if (this.changeSpinning) {
            this.changeSpinning(false)
        }
    }

    private shipment_type: any = ''

    private product_part: any = ''
    private product_name: string = ''
    private prodList: any = []

    private showShipmentContent: any = false
    private tempPartList: any = []
    private shipmentContent: any = ''

    private data: any[] = []
    private listData: any[] = []
    private orderService = new OrderService()
    private pickingService = new PickingService()
    private loadingService = new LoadingService()

    @Watch('product_part')
    private onChangeDefaultCode() {
        let obj: any = this.product_list.find(x => x.id == this.product_part)
        if (!obj) return
        this.product_name = obj.name
        this.pickingService
            .query_product_part(
                new RequestParams(
                    { default_code: obj.default_code },
                    this.loading
                )
            )
            .subscribe(
                data => {
                    data.map(x => (x['quantity'] = 1))
                    this.data = data
                    this.closeLoading()
                },
                err => {
                    this.closeLoading()
                    this.$message.error('err')
                }
            )
    }

    @Watch('listData')
    private onListDataChange() {
        this.$emit('partChange', this.listData)
    }

    private created() {
        this.product_part = undefined
        this.shipment_type = undefined
        this.getProductList()
    }

    private mounted() {
        this.tempPartList.push({
            id: UUID.generate(),
            quantity: 1,
            part_code: '',
            default_code: '',
            add_part: true
        })
    }

    private onAdd(row) {
        if (
            this.listData.filter(x => x.default_code == row.default_code)
                .length > 0
        ) {
            let err_msg: any = this.$t('add_repeatedly')
            this.$message.error(err_msg)
            return
        }
        this.listData.push(row)
    }

    private handleListChange(value, index) {
        this.listData[index].quantity = value
        this.$emit('partChange', this.listData)
    }

    private handleChange(e, row, column) {
        row[column] = e
    }

    private deleteList(index) {
        this.listData.splice(index, 1)
    }

    private getProductList() {
        let params: any = {}
        if (this.picking_id) {
            params['number'] = this.picking_id
            params['number_type'] = 'picking'
        } else if (this.order_id) {
            params['number'] = this.order_id
            params['number_type'] = 'order'
        } else {
            return
        }
        this.pickingService
            .queryStockMoveForResend(new RequestParams(params, this.loading))
            .subscribe(
                data => {
                    let arr: any = []
                    data.map(x => {
                        if (x.default_code.indexOf('TMPL-EZT') == -1) {
                            arr.push(x)
                        }
                    })
                    if (arr.length) {
                        arr.forEach(v => {
                            v.id = UUID.generate()
                            if (!v.name) {
                                v.name = v.default_code
                            }
                        })
                        this.product_list = arr
                        this.prodList = arr
                    }
                    this.closeLoading()
                },
                err => {
                    this.closeLoading()
                    this.$message.error(err.message)
                }
            )
    }

    // private onSubmit() {
    //     const value: any = []
    //     if (this.shipment_type == '') {
    //         let err_msg: any = this.$t('shipment_type')
    //         this.$message.error(err_msg)
    //         return
    //     }
    //     if (this.listData.length < 1) {
    //         let err_msg: any = this.$t('product_Part')
    //         this.$message.error(err_msg)
    //         return
    //     }
    //
    //     value['picking_id'] = this.picking_id
    //     value['shipment_type'] = this.shipment_type
    //     value['part_list'] = this.listData
    //     this.ConfirmProductParts(value)
    // }
    //
    // private ConfirmProductParts(value) {
    //     this.pickingService
    //         .confirmProductParts(new RequestParams(value, this.loading))
    //         .subscribe(
    //             () => {},
    //             err => {
    //                 this.closeLoading()
    //                 this.$message.error(err.message)
    //             }
    //         )
    // }

    private onPartCheckStatusChange(e) {
        if (e.target.checked) {
            this.showShipmentContent = true
        } else {
            this.showShipmentContent = false
        }
    }

    private handleShipmentChange(e, row, column) {
        if (
            Object.prototype.toString.call(e) === '[object InputEvent]' ||
            Object.prototype.toString.call(e) === '[object Event]' ||
            Object.prototype.toString.call(e) === '[object Object]'
        ) {
            row[column] = e.target.value
        } else {
            row[column] = e
        }
        let _row = JSON.parse(JSON.stringify(row))
        let obj: any = this.prodList.find(v => v.id == row.default_code)
        if (!obj) return
        if (column == 'default_code') {
            let default_code = obj.name
            row.default_code = obj.default_code
            let part_code = row['part_code']
            if (!part_code) {
                part_code = ''
            }

            let total_length = part_code.length + default_code
            if (total_length > 32) {
                let msg: any = this.$t('max_length_32')
                this.$message.error('[' + default_code + ']' + msg)
            }
        }

        if (column == 'part_code') {
            if (row[column].includes('-')) {
                this.$message.error('部件部位号不能包含"-"')
            }

            let default_code = obj.name
            if (!default_code) {
                default_code = ''
            }

            let part_code = row['part_code']
            if (!part_code) {
                part_code = ''
            }

            let total_length = default_code.length + part_code.length

            if (total_length > 32) {
                let msg: any = this.$t('max_length_32')
                this.$message.error('[' + default_code + ']' + msg)
            }
        }
    }

    private getPlaceholderCount(strSource) {
        //统计字符串中包含{}或{xxXX}的个数
        var thisCount = 0
        strSource.replace(/-/g, function(m, i) {
            //m为找到的{xx}元素、i为索引
            thisCount++
        })
        return thisCount
    }

    private addShipmentContent() {
        this.tempPartList.push({
            id: UUID.generate(),
            quantity: 1,
            part_code: '',
            default_code: '',
            add_part: true
        })
    }

    private deleteShipmentContent(id) {
        this.tempPartList = this.tempPartList.filter(x => x.id != id)
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
                let item = _that.tempPartList.find(x => x.id == row.id)
                item.default_code = data.default_code

                let partCode = ''
                if (this.getPlaceholderCount(data.default_code) >= 2) {
                    partCode = data.default_code.slice(
                        data.default_code.lastIndexOf('-') + 1
                    )
                }
                item.part_code = partCode
            })
    }

    private onShipmentTypeChange(e) {
        this.$emit('shipTypeChange', this.shipment_type)
    }

    private onShipmentContentChange(e) {
        this.shipmentContent = e.target.value
    }

    private onSearch(e) {
        this.prodList = this.product_list.filter(x =>
            x.name.toLowerCase().includes(e.toLowerCase())
        )
    }
}
</script>
<i18n>
{
    "en-us": {
        "plzSelect": "Please Select",
        "columns": {
            "shipment_type": "Shipment Type",
            "product_sku": "product Sku"
        },
        "forms": {
            "default_code": "Default Code",
            "quantity": "Quantity",
            "Add": "Add",
            "manual_url": "New Manual",
            "product_name": "Product Name"
        },
        "shipment_type": "Please Select Shipment Type",
        "add_repeatedly": "Please DONT Add repeatedly",
        "product_Part": "At Least Select One Product Part",
        "max_length_32": "Up to 32 characters",
        "create_tmpl_part_no": "TMPL Ersatzteile hinzufügen",
        "add_tmpl_part_no": "TMPL Ersatzteile hinzufügen",
        "part_no_name": "TMPL Ersatzteile",
        "resend_prod_sku": "SKU"
    },
    "zh-cn": {
        "plzSelect": "请选择",
        "columns": {
            "shipment_type": "包裹类型",
            "product_sku": "产品"
        },
        "forms": {
            "default_code": "sku",
            "quantity": "数量",
            "Add": "添加",
            "manual_url": "说明书查看",
            "product_name": "产品名称"
        },
        "shipment_type": "请选择包裹类型",
        "add_repeatedly": "请勿重复添加",
        "product_Part": "至少添加一条产品部件数据",
        "max_length_32": "SKU(含配件号)长度不能超过32个字符",
        "create_tmpl_part_no": "创建临时配件号",
        "add_tmpl_part_no": "添加临时配件号",
        "part_no_name": "配件部位号",
        "resend_prod_sku": "补发产品货号"
    }
}
</i18n>
