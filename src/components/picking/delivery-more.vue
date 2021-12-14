<template>
    <section class="component order-base-detail">
        <a-row :gutter="24">
            <a-col :span="3">
                <span>{{ $t('columns.deliveryType') }}</span>
            </a-col>
            <a-col :span="21">
                <a-select
                    style="width:60%"
                    v-model="delivery_type"
                    @change="e => onTypeChange(e)"
                    :placeholder="$t('plzSelect')"
                    size="small"
                >
                    <a-select-option value="part" key="Part"
                        >Part
                    </a-select-option>
                    <a-select-option value="one" key="Compelete Product"
                        >Compelete Product
                    </a-select-option>
                </a-select>
            </a-col>
        </a-row>
        <div v-if="showParts">
            <p style="font-weight:600;color:#222;margin-top:10px;">parts:</p>
            <a-table
                :dataSource="productListShow"
                :pagination="false"
                rowKey="product"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => onSelectedChange(keys)
                }"
                :scroll="{ y: 240 }"
            >
                <a-table-column
                    :title="$t('columns.product_name')"
                    key="product"
                    width="40%"
                    align="left"
                >
                    <template slot-scope="row">
                        <span>{{ row.product }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.product_type')"
                    key="type"
                    width="40%"
                    align="center"
                >
                    <template slot-scope="row">
                        <span v-if="row.type == 1">{{
                            $t('columns.base')
                        }}</span>
                        <span style="color:red" v-else-if="row.type == 2">{{
                            $t('columns.similar')
                        }}</span>
                        <span style="color:blue" v-else>{{
                            $t('columns.other')
                        }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.qty')"
                    key="qty"
                    width="30%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-input-number
                            :value="row.qty"
                            @change="e => onQuantityChange(row.product, e)"
                            :min="1"
                            :style="{ width: '80px' }"
                        />
                    </template>
                </a-table-column>
            </a-table>
            <p>
                <span style="font-weight:600;color:#222;margin-right:10px;"
                    >shipment content:</span
                >
                <a-checkbox @change="e => onCheckStatusChange(e)"></a-checkbox>
            </p>
            <p v-if="showShipmentContent">
                <a-textarea
                    rows="3"
                    cols="40"
                    v-decorator="['shipment_content']"
                    @input="e => onShipmentContentChange(e)"
                ></a-textarea>
            </p>
        </div>
        <div v-if="showPartForm" style="margin-top:20px;">
            <ProductPartForm
                ref="partForm"
                :picking_id="picking_id"
                :order_id="order_id"
                @partChange="onPartFormChange"
                @shipTypeChange="onShipmentTypeChange"
                :changeSpinning="changeSpinning"
            />
        </div>
        <!-- <table class="xtb">
            <tr>
                <td class="first-td">{{$t('columns.deliveryType')}}</td>
                <td class="sencond-td">
                    <a-select size="large">
                    </a-select>
                </td>
            </tr>
        </table> -->
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel"
                >{{ $t('action.cancel') }}
            </a-button>
            <a-button type="primary" @click="onSubmit"
                >{{ $t('action.submit') }}
            </a-button>
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

.blueText {
    color: #1890ff;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { OrderService } from '../../services/order.service'
import { RequestParams } from '../../core/http'
import { LoadingService } from '../../bootstrap/services/loading.service'
import router from '../../router'
import { PickingService } from '../../services/picking.service'
import ProductPartForm from '@/components/picking/product-part-form.vue'

@Component({
    components: {
        ProductPartForm
    }
})
export default class DeliveryMore extends Vue {
    @Emit('modal.submit')
    private submit(data) {
        return data
    }

    @Emit('modal.cancel')
    private cancel() {
        if (this.changeSpinning) {
            this.changeSpinning(false)
        }
        return
    }

    @Prop()
    private picking_id

    @Prop()
    private order_id

    @Prop()
    private changeSpinning

    private delivery_type: any = ''
    private tipCount: any = 0
    private shipment_type: any = ''
    private partList: any = []

    private showShipmentContent: any = false
    private showParts: any = false
    private showPartForm: any = false
    private shipmentContent: any = ''
    private productList: any = []
    private productListShow: any = []
    private selectedRowKeys: any = []
    private productListSub1: any = []
    private productListSub2: any = []

    private orderService = new OrderService()
    private loadingService = new LoadingService()
    private pickingService = new PickingService()

    private created() {
        this.delivery_type = undefined
    }

    private onSubmit() {
        const value: any = []
        if (this.delivery_type == '') {
            let err_msg: any = this.$t('err_msg')
            this.$message.error(err_msg)
            return
        }
        if (this.order_id) {
            value['number'] = this.order_id
            value['number_type'] = 'order'
        } else {
            value['number'] = this.picking_id
            value['number_type'] = 'picking'
        }
        value['delivery_type'] = this.delivery_type
        if (
            this.selectedRowKeys.length == 0 &&
            this.delivery_type == 'one' &&
            this.productListShow.length > 0
        ) {
            this.showConfirm(value)
        } else {
            if (this.delivery_type == 'part') {
                let partForm: any = this.$refs.partForm
                if (partForm.showShipmentContent) {
                    if (!partForm.shipmentContent) {
                        this.$message.error('请输入shipment content')
                        return
                    } else {
                        value['shipment_content'] = partForm.shipmentContent
                    }
                }
                value['shipment_type'] = this.shipment_type
                //判断用户填写是否完整
                if (partForm.tempPartList.length) {
                    for (let i of partForm.tempPartList) {
                        if (
                            (i.part_code == '' && i.default_code != '') ||
                            (i.part_code != '' && i.default_code == '')
                        ) {
                            this.$message.error('请先完善配件信息')
                            return
                        }
                    }
                }

                value['part_list'] = []
                if (this.partList.length) {
                    value['part_list'] = this.partList.map(x => ({
                        default_code: x.default_code,
                        quantity: x.quantity,
                        add_part: false
                    }))
                    if (partForm.tempPartList.length) {
                        for (let i in partForm.tempPartList) {
                            if (
                                partForm.tempPartList[i].part_code != '' &&
                                partForm.tempPartList[i].default_code != ''
                            ) {
                                value['part_list'].push(
                                    partForm.tempPartList[i]
                                )
                            }
                        }
                    }
                } else {
                    if (partForm.tempPartList.length) {
                        value['part_list'] = partForm.tempPartList.filter(
                            x => x.part_code != '' && x.default_code != ''
                        )
                    } else {
                        this.$message.error('请选择配件或创建临时配件')
                        return
                    }
                }
                if (value['part_list'].length == 0) {
                    this.$message.error('请选择配件或创建临时配件')
                    return
                }
            }
            console.log('value', value)
            this.deliverMore(value)
        }
    }

    private showConfirm(value) {
        let _that = this
        this.$confirm({
            title: this.$t('tip'),
            content: this.$t('tip_content'),
            onOk() {
                _that.deliverMore(value)
            },
            onCancel() {}
        })
    }

    private deliverMore(value) {
        let loading: any = {}
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }
        if (this.showShipmentContent) {
            if (this.shipmentContent) {
                value['shipment_content'] = this.shipmentContent
            } else {
                this.$message.error('please input shipment content')
                return
            }
        }

        if (this.selectedRowKeys.length) {
            let product_list: any = []
            product_list = this.productListShow.filter(x =>
                this.selectedRowKeys.includes(x.product)
            )
            let products = product_list
                .map(x => {
                    return x.qty + '×' + x.product
                })
                .join('\n')
            if (this.showShipmentContent) {
                value['shipment_content'] =
                    products + '\n' + this.shipmentContent
            }

            value['product_list'] = product_list.map(x => {
                return {
                    product_id: x.product_id,
                    qty: x.qty
                }
            })
        }

        this.orderService
            .deliverMore(new RequestParams(value, loading))
            .subscribe(
                data => {
                    this.submit(data)
                },
                err => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                    this.$message.error(err.message)
                }
            )
    }

    private onTypeChange(e) {
        this.shipmentContent = ''
        this.showShipmentContent = false
        this.showParts = false
        this.showPartForm = false
        this.selectedRowKeys = []
        if (e == 'one') {
            let object_id = this.order_id
            let object_type = 'order'
            if (this.picking_id) {
                object_id = this.picking_id
                object_type = 'picking'
            }

            let loading: any = {}
            if (this.changeSpinning) {
                this.changeSpinning(true)
            } else {
                loading = { loading: this.loadingService }
            }

            this.pickingService
                .query_stock_move_base_product(
                    new RequestParams(
                        {
                            object_id: object_id,
                            object_type: object_type
                        },
                        loading
                    )
                )
                .subscribe(
                    data => {
                        this.productList = data.product_list.map(x => {
                            return {
                                product: x.default_code,
                                product_id: x.product_id,
                                qty: 1
                            }
                        })
                        this.productListSub1 = []
                        this.productListSub2 = []
                        this.productListShow = []
                        for (var i of this.productList) {
                            let contain = 0
                            for (var j of data.default_code_list) {
                                let baseStr = j.default_code
                                let baseArr: any = j.default_code.split('-')
                                if (
                                    baseArr.length > 1 &&
                                    !isNaN(baseArr[baseArr.length - 1])
                                ) {
                                    baseArr.pop()
                                    baseStr = baseArr.join('-')
                                }

                                if (i.product.includes(baseStr)) {
                                    if (i.product == j.default_code) {
                                        i['type'] = 1
                                        i['qty'] = j.prod_qty ? j.prod_qty : 1
                                    } else {
                                        i['type'] = 2
                                    }

                                    this.productListSub1.push(i)
                                    contain = 1
                                    break
                                }
                            }

                            if (contain == 0) {
                                i['type'] = 0
                                this.productListSub2.push(i)
                            }
                        }

                        this.productListSub1.sort((a, b) => {
                            return a.type > b.type ? 1 : -1
                        })

                        this.productListShow = this.productListSub1.map(x => x)

                        for (var p of this.productListSub2) {
                            this.productListShow.push(p)
                        }
                        this.showParts = true
                        for (var x of this.productListShow) {
                            if (x.type == 1) {
                                this.selectedRowKeys.push(x.product)
                            }
                        }

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
        } else {
            this.showPartForm = true
        }
    }

    private onCheckStatusChange(e) {
        if (e.target.checked) {
            this.showShipmentContent = true
        } else {
            this.showShipmentContent = false
            this.shipmentContent = ''
        }
    }

    private onShipmentContentChange(e) {
        this.shipmentContent = e.target.value
    }

    private onQuantityChange(key, e) {
        let item = this.productList.find(x => x.product === key)
        if (item) {
            item.qty = e
        }
    }

    private onSelectedChange(keys) {
        this.selectedRowKeys = keys
    }

    private onPartFormChange(data) {
        this.partList = data
    }

    private onShipmentTypeChange(data) {
        this.shipment_type = data
    }
}
</script>
<i18n>
{
    "en-us": {
        "plzSelect": "Please Select",
        "columns": {
            "deliveryType": "Delivery Type",
            "product_name": "Product Name",
            "product_type": "Product Type",
            "base": "Same",
            "similar": "Similar",
            "other": "Other",
            "qty": "Quantity"
        },
        "err_msg": "Please Select Delivery Type",
        "tip": "Tip",
        "tip_content": "Are you sure not to choose any products?"
    },
    "zh-cn": {
        "plzSelect": "请选择",
        "columns": {
            "deliveryType": "补发类型",
            "product_name": "产品名称",
            "product_type": "产品类型",
            "base": "同款",
            "similar": "相似",
            "other": "其它",
            "qty": "数量"
        },
        "err_msg": "请选择补发类型",
        "tip": "提示",
        "tip_content": "确定不勾选任何补发产品吗？"
    }
}
</i18n>
