<template>
    <section class="component order-base-detail">
        <ProductPartForm
            ref="partForm"
            :picking_id="picking_id"
            @partChange="onPartFormChange"
            @shipTypeChange="onShipmentTypeChange"
        />
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('action.cancel')
            }}</a-button>
            <a-button type="primary" @click="onSubmit">{{
                $t('action.submit')
            }}</a-button>
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
import ProductPartForm from '@/components/picking/product-part-form.vue'
@Component({
    components: {
        ProductPartForm
    }
})
export default class ProductPart extends Vue {
    @Emit('modal.submit')
    private submit() {
        return
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
    private changeSpinning

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

    private shipment_type: string = ''

    private product_part: string = ''

    private data: any[] = []
    private listData: any[] = []
    private orderService = new OrderService()
    private pickingService = new PickingService()
    private loadingService = new LoadingService()

    @Watch('product_part')
    private onChangeDefaultCode() {
        this.pickingService
            .query_product_part(
                new RequestParams(
                    { default_code: this.product_part },
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

    private onSubmit() {
        const value: any = []
        if (this.shipment_type == '') {
            let err_msg: any = this.$t('shipment_type')
            this.$message.error(err_msg)
            return
        }
        // if (this.listData.length < 1) {
        //     let err_msg: any = this.$t('product_Part')
        //     this.$message.error(err_msg)
        //     return
        // }

        value['picking_id'] = this.picking_id
        value['shipment_type'] = this.shipment_type
        value['part_list'] = []

        let partForm: any = this.$refs.partForm

        //判断用户填写是否完整
        if (partForm.tempPartList.length) {
            for (let i of partForm.tempPartList) {
                for (let i of partForm.tempPartList) {
                    if (
                        (i.part_code == '' && i.default_code != '') ||
                        (i.part_code != '' && i.default_code == '')
                    ) {
                        this.$message.error('请先完善配件信息')
                        return
                    }

                    if (i.part_code != '' && i.default_code != '') {
                        if (i.part_code.length + i.default_code.length > 32) {
                            let msg: any = this.$t('max_length_32')
                            this.$message.error(
                                '[' + i.default_code + ']' + msg
                            )
                            return
                        }
                    }
                }
            }
        }

        if (this.listData.length) {
            value['part_list'] = this.listData.map(x => ({
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
                        value['part_list'].push(partForm.tempPartList[i])
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

        if (partForm.showShipmentContent) {
            if (!partForm.shipmentContent) {
                this.$message.error('请输入shipment content')
                return
            } else {
                value['shipment_content'] = partForm.shipmentContent
            }
        }
        value['shipment_type'] = this.shipment_type

        this.ConfirmProductParts(value)
    }

    private ConfirmProductParts(value) {
        this.pickingService
            .confirmProductParts(new RequestParams(value, this.loading))
            .subscribe(
                () => {
                    this.submit()
                },
                err => {
                    this.closeLoading()
                    this.$message.error(err.message)
                }
            )
    }

    private onPartFormChange(data) {
        this.listData = data
    }

    private onShipmentTypeChange(data) {
        this.shipment_type = data
    }
}
</script>
<i18n>
{
    "en-us": {
        "columns":{
            "shipment_type":"Shipment Type",
            "product_sku":"product Sku"
        },
        "forms":{
            "default_code":"Default Code",
            "quantity":"Quantity",
            "Add":"Add"
        },
        "shipment_type":"Please Select Shipment Type",
        "add_repeatedly":"Please DONT Add repeatedly",
        "product_Part":"At Least Select One Product Part",
        "max_length_32":"Up to 32 characters"
    },
    "zh-cn": {
        "columns":{
            "shipment_type":"包裹类型",
            "product_sku":"产品"
        },
        "forms":{
            "default_code":"sku",
            "quantity":"数量",
            "Add":"添加"
        },
        "shipment_type":"请选择包裹类型",
        "add_repeatedly":"请勿重复添加",
        "product_Part":"至少添加一条产品部件数据",
        "max_length_32":"SKU(含配件号)长度不能超过32个字符"
    }
}
</i18n>
