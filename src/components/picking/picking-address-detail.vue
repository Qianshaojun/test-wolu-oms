<template>
    <section class="component order-base-detail">
        <table class="xtb">
            <tr>
                <td class="first-td">
                    {{ $t('email') }}
                </td>
                <td class="sencond-td">
                    {{ detail.email }}
                </td>
                <td class="first-td">
                    {{ $t('seller_code') }}
                </td>
                <td class="sencond-td">
                    {{ detail.stone }}
                </td>
            </tr>
            <tr>
                <td class="first-td">
                    {{ $t('validate_error_text') }}
                </td>
                <td class="sencond-td">
                    <span style="color:red;">{{ detail.validate_err }}</span>
                </td>
                <td class="first-td">
                    {{ $t('instance_code') }}
                </td>
                <td class="sencond-td">
                    {{ detail.instance_code }}
                </td>
            </tr>
            <tr>
                <td class="first-td">
                    {{ $t('state') }}
                </td>
                <td class="sencond-td">
                    {{ detail.state | dict('PickingStatus') | translate }}
                </td>
                <td class="first-td">
                    {{ $t('fake_shipment') }}
                </td>
                <td class="sencond-td">
                    {{ detail.fake_shipment }}
                </td>
            </tr>
            <tr>
                <td class="first-td">
                    {{ $t('weight') }}
                </td>
                <td class="sencond-td">
                    {{ detail.weight1 }}
                </td>
            </tr>
        </table>
    </section>
</template>
<style>
.xtb {
    width: 100%;
    border: none;
    float: left;
}
.xtb .first-td {
    width: 8%;
    border-right: 1px solid #ccc;
}
.xtb .sencond-td {
    width: 41%;
    padding-left: 1%;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component({
    components: {}
})
export default class PickingAddressDetail extends Vue {
    @Prop()
    detail: any
}
</script>

<i18n>
{
  "en-us":{
    "email":"Email",
    "fake_shipment":"Fake shipment",
    "shipment_number":"Shipment Number",
    "state":"State",
    "weight":"Weight/Kg",
    "validate_error_text":"Error Text",
    "seller_code":"Seller code",
    "instance_code":"Instance code"
  },
  "zh-cn":{
     "email":"邮箱",
    "fake_shipment":"假单号",
    "shipment_number":"物流号",
    "state":"状态",
    "weight":"重量/Kg",
    "validate_error_text":"验证错误原因",
    "seller_code":"店铺",
    "instance_code":"实例"
  }
}
</i18n>
