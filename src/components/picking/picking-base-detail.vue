<template>
    <section class="component order-base-data">
        <div style="padding:0 20px 10px 20px">
            <a-button @click="saveBtn()" type="primary"
                >{{ $t('save') }}
            </a-button>
            <a-button @click="cancelBtn" style="margin-left:10px;"
                >{{ $t('cancel') }}
            </a-button>
            <div style="float:right;">
                <!-- <div style="float:left;margin-right:10px;line-height:25px;">
                    处理进度:
                </div> -->
                <div class="progress-bar" style="float:left;">
                    <li
                        :value="item.value"
                        v-for="item of $dict.PickingStatus"
                        :key="item.value"
                        :class="{ active: data.state == item.value }"
                    >
                        <span>{{ $t(item.label) }}</span>
                    </li>
                    <!-- <li class="active">
                    <span>买家付款</span>
                </li>
                <li>
                    <span>发货</span>
                </li>
                <li>
                    <span>买家确认收货</span>
                </li> -->
                </div>
            </div>
        </div>
        <table class="xgtb2">
            <tr>
                <td class="first-td">{{ $t('partner') }}</td>
                <td class="sencond-td">
                    {{ data.partner_id }}
                </td>
                <td class="first-td">{{ $t('scheduled_date') }}</td>
                <td class="sencond-td">
                    {{ data.min_date | datetolocal }}
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('partner_name') }}</td>
                <td class="sencond-td">
                    <a-input
                        style="width:90%;margin: 3px 0"
                        :value="data.partner_name"
                        size="small"
                        :title="messageTips(data.partner_name)"
                        :style="
                            data.partner_name && data.partner_name.length > 35
                                ? 'color:red'
                                : 'color:#666'
                        "
                        @change="
                            e => handleChange(e.target.value, 'partner_name')
                        "
                    />
                </td>
                <td class="first-td">{{ $t('source_document') }}</td>
                <td class="sencond-td">
                    <a @click="toPageOrder(data.origin)"> {{ data.origin }} </a>
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('company') }}</td>
                <td class="sencond-td">
                    <a-input
                        style="width:90%;margin: 3px 0"
                        :value="data.name2"
                        size="small"
                        :title="messageTips(data.name2)"
                        :style="
                            data.name2 && data.name2.length > 35
                                ? 'color:red'
                                : 'color:#666'
                        "
                        @change="e => handleChange(e.target.value, 'name2')"
                    />
                </td>
                <!-- <td class="first-td">{{ $t('updated_in_wish') }}</td>
                <td class="sencond-td">
                    <a-checkbox
                        style="width:90%;margin: 3px 0"
                        :checked="!!data.updated_in_wish"
                        size="small"
                        @change="
                            e =>
                                handleChange(
                                    e.target.checked,
                                    'updated_in_wish'
                                )
                        "
                    />
                </td> -->
                <td class="first-td">{{ $t('ebay_buyer_id') }}</td>
                <td class="sencond-td">{{ data.ebay_buyer_id }}</td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('street') }}</td>
                <td class="sencond-td">
                    <a-input
                        style="width:90%;margin: 3px 0"
                        :value="data.street"
                        size="small"
                        :title="messageTips(data.street)"
                        :style="
                            data.street && data.street.length > 35
                                ? 'color:red'
                                : 'color:#666'
                        "
                        @change="e => handleChange(e.target.value, 'street')"
                    />
                </td>
                <td class="first-td">{{ $t('payment_date') }}</td>
                <td class="sencond-td">
                    {{ data.payment_date | datetolocal }}
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('nr') }}</td>
                <td class="sencond-td">
                    <a-input
                        style="width:90%;margin: 3px 0"
                        :value="data.nr_1"
                        size="small"
                        @change="e => handleChange(e.target.value, 'nr_1')"
                    />
                </td>
                <td class="first-td">{{ $t('weight') }}</td>
                <td class="sencond-td">
                    <a-input
                        style="width:90%;margin: 3px 0"
                        :value="data.weight1"
                        size="small"
                        @change="e => handleChange(e.target.value, 'weight1')"
                    />
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('street2') }}</td>
                <td class="sencond-td">
                    <a-input
                        style="width:90%;margin: 3px 0"
                        :value="data.street2"
                        size="small"
                        :title="messageTips(data.street2)"
                        :style="
                            data.street2 && data.street2.length > 35
                                ? 'color:red'
                                : 'color:#666'
                        "
                        @change="e => handleChange(e.target.value, 'street2')"
                    />
                </td>
                <td
                    class="first-td"
                    style="font-weight:bold; color:red;vertical-align: top;"
                >
                    {{ $t('shipment_content') }}
                </td>
                <td class="sencond-td">
                    <a-textarea
                        style="width:90%;margin: 3px 0"
                        :value="data.shipment_content"
                        size="small"
                        rows="2"
                        cols="40"
                        @change="
                            e =>
                                handleChange(e.target.value, 'shipment_content')
                        "
                    />
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('zip') }}</td>
                <td class="sencond-td">
                    <a-input
                        style="width:90%;margin: 3px 0"
                        :value="data.zip"
                        size="small"
                        @change="e => handleChange(e.target.value, 'zip')"
                    />
                </td>
                <td class="first-td">{{ $t('validate_state') }}</td>
                <td class="sencond-td">
                    <span :style="{ color: calcStyle(data.validate_s) }">{{
                        data.validate_s
                            | dict('PickingValidateState')
                            | translate
                    }}</span>
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('city') }}</td>
                <td class="sencond-td">
                    <a-input
                        style="width:90%;margin: 3px 0"
                        :value="data.city"
                        size="small"
                        @change="e => handleChange(e.target.value, 'city')"
                    />
                </td>
                <td class="first-td" style="vertical-align: top;">
                    {{ $t('validate_error_text') }}
                </td>
                <td class="sencond-td">
                    <a-textarea
                        style="width:90%;margin: 3px 0"
                        :value="data.validate_err"
                        size="small"
                        rows="2"
                        cols="40"
                        @change="
                            e => handleChange(e.target.value, 'validate_err')
                        "
                    />
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('country') }}</td>
                <td class="sencond-td">
                    <a-select
                        showSearch
                        v-decorator="['country_id']"
                        :value="data.country_id"
                        :style="{ width: '200px' }"
                        size="small"
                        :filterOption="filterSelectOption"
                        placeholder="Select Country"
                        @change="e => handleChange(e, 'country_id')"
                    >
                        <a-select-option
                            :value="item.code"
                            v-for="item of countryList"
                            :key="item.code"
                            >{{ item.name }}
                        </a-select-option>
                    </a-select>
                    <a-button
                        @click="googleMap"
                        type="danger"
                        style="float:right;margin-right:10%;"
                        >Google Map
                    </a-button>
                </td>
                <td class="first-td">{{ $t('pre_sale') }}</td>
                <td class="sencond-td">
                    <a-checkbox
                        style="width:3%;margin: 3px 0"
                        :checked="!!data.pick_pre_sale"
                        size="small"
                        @change="
                            e => handleChange(e.target.checked, 'pick_pre_sale')
                        "
                    />
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('email') }}</td>
                <td class="sencond-td">
                    <a-input
                        style="width:90%;margin: 3px 0"
                        :value="data.email"
                        size="small"
                        @change="e => handleChange(e.target.value, 'email')"
                    />
                </td>
                <td class="first-td">{{ $t('send_gift') }}</td>
                <td class="sencond-td">
                    <a-checkbox
                        style="width:3%;margin: 3px 0"
                        :checked="!!data.send_gift"
                        size="small"
                        @change="
                            e => handleChange(e.target.checked, 'send_gift')
                        "
                    />
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('phone') }}</td>
                <td class="sencond-td">
                    <a-input
                        style="width:90%;margin: 3px 0"
                        :value="data.phone"
                        size="small"
                        @change="e => handleChange(e.target.value, 'phone')"
                    />
                </td>
                <td class="first-td">{{ $t('send_warehouse') }}</td>
                <td class="sencond-td">
                    <a-select
                        v-decorator="['send_warehouse']"
                        :value="data.send_warehouse"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Select Warehouse"
                        @change="e => handleChange(e, 'send_warehouse')"
                    >
                        <a-select-option
                            :value="item.value"
                            v-for="item of $dict.WarehouseList"
                            :key="item.value"
                            >{{ $t(item.label) }}
                        </a-select-option>
                    </a-select>
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('shipment_number') }}</td>
                <td class="sencond-td">
                    {{ data.shipment_number }}
                </td>
                <td class="first-td">{{ $t('updated_in_platform') }}</td>
                <td class="sencond-td">
                    <a-checkbox
                        style="width:3%;margin: 3px 0"
                        :checked="!!data.updated_in_platform"
                        size="small"
                        @change="
                            e =>
                                handleChange(
                                    e.target.checked,
                                    'updated_in_platform'
                                )
                        "
                    />
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('fake_shipment') }}</td>
                <td class="sencond-td">
                    <a-input
                        style="width:90%;margin: 3px 0"
                        :value="data.fake_shipment"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'fake_shipment')
                        "
                    />
                </td>
                <td class="first-td">{{ $t('confirm_return_time') }}</td>
                <td class="sencond-td">
                    <a-date-picker
                        style="width:90%;margin: 3px 0"
                        :value="data.confirm_return_time"
                        size="small"
                        format="YYYY-MM-DD HH:mm:ss"
                        @change="e => handleChange(e, 'confirm_return_time')"
                    />
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('check_shipments') }}</td>
                <td class="sencond-td">
                    <a-checkbox
                        style="width:3%;margin: 3px 0"
                        :checked="!!data.check_number"
                        size="small"
                        @change="
                            e => handleChange(e.target.checked, 'check_number')
                        "
                    />
                </td>
                <td class="first-td">{{ $t('resend') }}</td>
                <td class="sencond-td">
                    <a-checkbox
                        style="width:3%;margin: 3px 0"
                        :checked="!!data.is_resend"
                        size="small"
                        @change="
                            e => handleChange(e.target.checked, 'is_resend')
                        "
                    />
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('sold_out') }}</td>
                <td class="sencond-td">
                    <a-checkbox
                        style="width:3%;margin: 3px 0"
                        :checked="!!data.is_sold_out"
                        size="small"
                        @change="
                            e => handleChange(e.target.checked, 'is_sold_out')
                        "
                    />
                </td>
                <td class="first-td">{{ $t('return_process_time') }}</td>
                <td class="sencond-td">
                    <a-date-picker
                        style="width:90%;margin: 3px 0"
                        :value="data.return_process_time"
                        size="small"
                        format="YYYY-MM-DD HH:mm:ss"
                        @change="e => handleChange(e, 'return_process_time')"
                    />
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('sold_out_time') }}</td>
                <td class="sencond-td">
                    <a-date-picker
                        style="width:90%;margin: 3px 0"
                        :value="data.sold_out_time"
                        size="small"
                        format="YYYY-MM-DD HH:mm:ss"
                        @change="e => handleChange(e, 'sold_out_time')"
                    />
                </td>
                <td class="first-td">{{ $t('assign_to_user') }}</td>
                <td class="sencond-td">
                    <a-select
                        v-decorator="['assign_to_user']"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Select User"
                        @change="e => handleChange(e, 'assign_to_user')"
                    >
                        <a-select-option
                            :value="item.code"
                            v-for="item of systemUsers"
                            :key="item.code"
                            >{{ item.name }}
                        </a-select-option>
                    </a-select>
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('container_time') }}</td>
                <td class="sencond-td">
                    <a-date-picker
                        style="width:90%;margin: 3px 0"
                        :value="data.container_time"
                        size="small"
                        format="YYYY-MM-DD HH:mm:ss"
                        @change="e => handleChange(e, 'container_time')"
                    />
                </td>
                <td class="first-td">{{ $t('remote_district') }}</td>
                <td class="sencond-td">
                    <a-checkbox
                        style="width:3%;margin: 3px 0"
                        :checked="!!data.remote_district"
                        size="small"
                        @change="
                            e =>
                                handleChange(
                                    e.target.checked,
                                    'remote_district'
                                )
                        "
                    />
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('user_continue') }}</td>
                <td class="sencond-td">
                    <a-select
                        v-decorator="['continue_user']"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Select User"
                        @change="e => handleChange(e, 'continue_user')"
                    >
                        <a-select-option
                            :value="item.code"
                            v-for="item of systemUsers"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </td>
                <td class="first-td">{{ $t('ebay_type') }}</td>
                <td class="sencond-td">
                    {{ data.stock_ebay3 }}
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('service_process') }}</td>
                <td class="sencond-td">
                    <a-date-picker
                        style="width:90%;margin: 3px 0"
                        :value="data.cs_process_time"
                        size="small"
                        format="YYYY-MM-DD HH:mm:ss"
                        @change="e => handleChange(e, 'cs_process_time')"
                    />
                </td>
                <td class="first-td">{{ $t('amazon_type') }}</td>
                <td class="sencond-td">
                    {{ data.stock_amazon3 }}
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('stock_process') }}</td>
                <td class="sencond-td">
                    <a-date-picker
                        style="width:90%;margin: 3px 0"
                        :value="data.stock_process_time"
                        size="small"
                        format="YYYY-MM-DD HH:mm:ss"
                        @change="e => handleChange(e, 'stock_process_time')"
                    />
                </td>
                <td class="first-td">{{ $t('instance') }}</td>
                <td class="sencond-td">
                    {{ swichInstanceName(data.instance_code) }}
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('latest_ship_date') }}</td>
                <td class="sencond-td">
                    {{ data.latest_ship_date_new }}
                </td>
                <td class="first-td">{{ $t('latest_delivery_date_new') }}</td>
                <td class="sencond-td">
                    {{ data.latest_delivery_date_new }}
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('ship_method') }}</td>
                <td class="sencond-td">
                    <a-select
                        v-decorator="['ship_method']"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="PLZ Select"
                        @change="e => handleChange(e, 'ship_method')"
                    >
                        <a-select-option
                            :value="item.code"
                            v-for="item of shipMethodList"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </td>
                <td class="first-td">{{ $t('need_resend_memo') }}</td>
                <td class="sencond-td">
                    <a-select
                        v-decorator="['need_resend']"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="PLZ Select"
                        @change="e => handleChange(e, 'need_resend')"
                    >
                        <a-select-option
                            :value="item.code"
                            v-for="item of resendMemoList"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </td>
            </tr>
            <tr>
                <td class="first-td">{{ $t('fee') }}</td>
                <td class="sencond-td">
                    {{ data.shipment_fee }}
                </td>
                <td class="first-td">{{ $t('total') }}</td>
                <td class="sencond-td">
                    {{ data.amount_total ? data.amount_total.toFixed(2) : '' }}
                </td>
            </tr>
            <tr>
                <td class="first-td" style="vertical-align: top;">
                    {{ $t('memo') }}
                </td>
                <td class="sencond-td" colspan="3">
                    <a-textarea
                        style="width:96%;margin: 8px 0;height:160px"
                        :value="data.memo"
                        size="small"
                        @change="e => handleChange(e.target.value, 'memo')"
                    />
                </td>
            </tr>
        </table>
    </section>
</template>
<style>
.xgtb2 {
    width: 100%;
    border: none;
}

.xgtb2 .first-td {
    width: 8%;
    border-right: 1px solid #ccc;
}

.xgtb2 .sencond-td {
    width: 41%;
    padding-left: 1%;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { PickingService } from '../../services/picking.service'
import { GeneralService } from '../../services/general.service'
import { GeneralCodeService } from '../../services/general_code.service'
import { RequestParams } from '../../core/http'
import { LoadingService } from '../../bootstrap/services/loading.service'
import router from '@/router'
import { SellerInstanceService } from '../../services/seller-instance.service'
import { namespace } from 'vuex-class'

const datasModule = namespace('datasModule')

@Component({
    components: {}
})
export default class PickingBasedata extends Vue {
    @Prop()
    info: any

    @Prop()
    id: any

    @Prop()
    countryList

    @Prop()
    systemUsers

    @Prop({ default: 0, type: Number })
    private saveDetail

    @Prop({
        default: false
    })
    private pageShow

    @Prop()
    changeSpinning

    private pickingService = new PickingService()

    private loadingService = new LoadingService()

    private generalService = new GeneralService()

    private generalCodeService = new GeneralCodeService()

    private sellerInstanceService = new SellerInstanceService()

    private data: any = {}

    private editable: any = false

    private pre_sale: any = false

    private resendMemoList: any[] = []

    private shipMethodList: any[] = []

    private instanceCodeList: any[] = []

    private originData: any[] = []

    @datasModule.State
    private pickingNeedSave

    @datasModule.Mutation
    private setPickingSaveStatus

    private created() {
        this.getResendMemoList()
        this.getShipMethodList()
    }

    private mounted() {
        this.data = Object.assign({}, this.info)
        this.originData = Object.assign({}, this.info)
        if (this.data.seller_code) {
            this.getInstanceCodeList(this.data.seller_code)
        }
    }

    @Watch('info')
    private onInfoChange() {
        this.data = Object.assign({}, this.info)
        this.originData = Object.assign({}, this.info)
        if (this.data.seller_code) {
            this.getInstanceCodeList(this.data.seller_code)
        }
    }

    @Watch('saveDetail')
    private onSaveDetailChange() {
        if (this.saveDetail > 0) {
            this.validateAddress()
        }
    }

    private validateAddress() {
        let params: any = []
        params.push({
            id: this.data.id,
            partner_name: this.data.partner_name,
            name2: this.data.name2,
            street: this.data.street,
            nr_1: this.data.nr_1,
            street2: this.data.street2,
            zip: this.data.zip,
            city: this.data.city,
            country_id: this.data.country_id,
            email: this.data.email,
            phone: this.data.phone
        })
        let loading: any = {}
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }
        this.pickingService
            .validateAddress(
                new RequestParams(
                    {
                        picking_id_list: [parseInt(this.id)],
                        picking_address_list: params
                    },
                    loading
                )
            )
            .subscribe(
                data => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                    this.$emit('validateAds')
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    if (this.pageShow) {
                        this.setPickingSaveStatus(
                            this.pickingNeedSave.replace(
                                'p-' + this.data.id,
                                ''
                            )
                        )
                    }
                },
                err => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                    this.$emit('validateAds')
                    this.$message.error(err.message)
                }
            )
    }

    private editBtn() {
        this.editable = !this.editable
    }

    public handleChange(value, key) {
        this.data[key] = value
        if (this.pageShow) {
            if (this.compareData(this.originData, this.data)) {
                if (this.pickingNeedSave.indexOf('p-' + this.data.id) < 0) {
                    this.setPickingSaveStatus(
                        this.pickingNeedSave + 'p-' + this.data.id
                    )
                }
            } else {
                this.setPickingSaveStatus(
                    this.pickingNeedSave.replace('p-' + this.data.id, '')
                )
            }
        }
    }

    private compareData(data1, data2) {
        let ret = 0
        for (var i in data1) {
            if ((data1[i] || data2[i]) && data1[i] !== data2[i]) {
                ret = 1
                break
            }
        }
        return ret
    }

    private getInstanceCodeList(key) {
        this.sellerInstanceService
            .queryInstanceBySellerCode(
                new RequestParams({
                    seller_code: key
                })
            )
            .subscribe(
                data => {
                    this.instanceCodeList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private swichInstanceName(value) {
        let ret: any = value
        let item = this.instanceCodeList.find(x => x.code == value)
        if (item) {
            ret = item.name
        }
        return ret
    }

    private messageTips(value) {
        if (value && value.length > 35) {
            value = value.slice(0, 35) + '@kss' + value.slice(35)
        }
        return value
    }

    private calcStyle(state) {
        if (state === 'ok') {
            return 'green'
        } else if (state === 'error') {
            return 'red'
        } else {
            return 'blue'
        }
    }

    private saveBtn() {
        this.data['save_flag'] = 1
        delete this.data.amount_total
        let loading: any = {}
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }
        this.pickingService
            .save(new RequestParams(this.data, loading))
            .subscribe(
                () => {
                    this.reset_save_data(this.data.id)

                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }

                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                },
                err => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                    this.$message.error(err.message)
                }
            )
        // this.editable = false
    }

    private cancelBtn() {
        this.data = Object.assign({}, this.info)
        // this.editable = false
        this.updatePickingInfo()
        if (this.pageShow) {
            this.setPickingSaveStatus(
                this.pickingNeedSave.replace('p-' + this.data.id, '')
            )
        }
    }

    private createShipment(picking_id) {
        let loading: any = {}
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }

        if (this.pickingNeedSave.indexOf('p-' + picking_id) >= 0) {
            this.data['save_flag'] = 1
            delete this.data.amount_total
            this.pickingService
                .save(new RequestParams(this.data, loading))
                .subscribe(
                    () => {
                        this.reset_save_data(picking_id)

                        this.createShipmentsLines(picking_id, loading)
                    },
                    err => {
                        if (this.changeSpinning) {
                            this.changeSpinning(false)
                        }
                        this.$message.error(err.message)
                    }
                )
        } else {
            this.createShipmentsLines(picking_id, loading)
        }
    }

    private reset_save_data(picking_id) {
        this.originData = Object.assign({}, this.data)
        if (this.pageShow) {
            this.setPickingSaveStatus(
                this.pickingNeedSave.replace('p-' + this.data.id, '')
            )
        }
    }

    private createShipmentsLines(picking_id, loading) {
        this.pickingService
            .createShipmentsLines(
                new RequestParams({ picking_id_list: [picking_id] }, loading)
            )
            .subscribe(
                () => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }

                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                },
                err => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                    this.$message.error(err.message)
                }
            )
    }

    private updatePickingInfo() {
        let loading: any = {}
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }
        this.pickingService
            .queryDetail(
                new RequestParams({ picking_id: parseInt(this.id) }, loading)
            )
            .subscribe(
                data => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                    data[0]['id'] = parseInt(this.id)
                    this.originData = data[0]
                    this.data = Object.assign({}, data[0])
                },
                err => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                    this.$message.error(err.message)
                }
            )
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private getResendMemoList() {
        this.generalService.queryResendMemo(new RequestParams({})).subscribe(
            data => {
                this.resendMemoList = data
            },
            err => {
                this.$message.error(err.message)
            }
        )
    }

    private getShipMethodList() {
        this.generalCodeService.queryShipType(new RequestParams({})).subscribe(
            data => {
                this.shipMethodList = data
            },
            err => {
                this.$message.error(err.message)
            }
        )
    }

    private googleMap() {
        let url = 'http://maps.google.com/maps?oi=map&q='
        if (this.data.street) {
            url += this.data.street.replace(' ', '+')
        }
        if (this.data.nr_1) {
            url += this.data.nr_1.replace(' ', '+')
        }
        if (this.data.zip) {
            url += '+' + this.data.zip.replace(' ', '+')
        }
        if (this.data.city) {
            url += '+' + this.data.city.replace(' ', '+')
        }
        if (this.data.country_id) {
            let country = this.countryList.find(
                x => x.id === this.data.country_id
            )
            if (country) {
                url += '+' + country.replace(' ', '+')
            }
        }
        window.open(url)
    }

    private toPageOrder(origin) {
        //判断如果是邮件页面，在新页面打开订单管理页面
        if (this.changeSpinning) {
            let url = this.$router.resolve({
                name: 'order-manage',
                query: { origin: origin }
            })
            window.open(url.href, '_blank')
        } else {
            router.push({
                name: 'order-manage',
                params: { origin: origin }
            })
        }
    }
}
</script>
<style>
.progress-bar li {
    padding: 0px 10px;
    line-height: 25px;
    background: #ababab;
    display: inline-block;
    color: #fff;
    position: relative;
    width: 100px;
    text-align: center;
}

.progress-bar li:after {
    content: '';
    display: block;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 12px solid #ababab;
    position: absolute;
    right: -12px;
    top: 0;
    z-index: 10;
}

.progress-bar li:before {
    content: '';
    display: block;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 12px solid #fff;
    position: absolute;
    left: 0px;
    top: 0;
}

.progress-bar li {
    padding-left: 25px;
}

.progress-bar li:first-child {
    border-radius: 4px 0 0 4px;
}

.progress-bar li:first-child:before {
    display: none;
}

.progress-bar li.active {
    background-color: #50abe4;
}

.progress-bar li.active:after {
    border-left-color: #50abe4;
}

.bar-date {
    position: absolute;
    color: #000;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
}

.bar-date span {
    font-size: 12px;
    color: #999;
}
</style>

<i18n>
{
    "en-us": {
        "partner": "Partner",
        "partner_name": "Partner Name",
        "company": "Name2/Company",
        "street": "Street",
        "nr": "Nr.",
        "street2": "Street2/Postnumber",
        "zip": "Zip",
        "city": "City",
        "country": "Country",
        "email": "Email",
        "phone": "Phone",
        "shipment_number": "Shipment Number",
        "fake_shipment": "Fake Shipment",
        "check_shipments": "Check Shipments",
        "exception": "Exception",
        "sold_out": "Sold Out",
        "sold_out_time": "Sold Out Time",
        "container_time": "Container Time",
        "user_continue": "User Continue",
        "service_process": "Service Process",
        "stock_process": "Stock Process",
        "latest_ship_date": "Latest Ship Date",
        "latest_delivery_date_new": "Latest Delivery Date",
        "picking_shipment": "Picking Shipment",
        "fee": "Fee",
        "need_resend_memo": "Need Resend Memo",
        "scheduled_date": "Scheduled Date",
        "source_document": "Source Document",
        "updated_in_wish": "Updated in Wish",
        "payment_date": "Payment Date",
        "weight": "Weight(KG)",
        "shipment_content": "Shipment Content",
        "validate_state": "Validate State",
        "validate_error_text": "Validate Error Text",
        "pre_sale": "Pre Sale",
        "send_gift": "Send Gift",
        "send_warehouse": "Send Warehouse",
        "updated_in_platform": "Updated in Platform",
        "resend": "Resend",
        "confirm_return_time": "Confirm Return Time",
        "return_process_time": "Return Process Time",
        "assign_to_user": "Assign to User",
        "remote_district": "Remote District",
        "ebay_type": "Ebay Type",
        "amazon_type": "Amazon Type",
        "nstance": "Instance",
        "total": "Total",
        "ship_method": "Ship Method",
        "save": "Save",
        "cancel": "Discard",
        "ebay_buyer_id": "eBay Buyer ID"
    },
    "zh-cn": {
        "partner": "Partner",
        "partner_name": "Partner Name",
        "company": "Name2/Company",
        "street": "街道",
        "nr": "门牌号",
        "street2": "Street2/Postnumber",
        "zip": "邮编",
        "city": "城市",
        "country": "国家",
        "email": "邮箱",
        "phone": "电话",
        "shipment_number": "物流单号",
        "fake_shipment": "Fake Shipment",
        "check_shipments": "Check Shipments",
        "exception": "异常",
        "sold_out": "卖超",
        "sold_out_time": "卖超时间",
        "container_time": "装箱时间",
        "user_continue": "User Continue",
        "service_process": "Service Process",
        "stock_process": "Stock Process",
        "latest_ship_date": "最晚发货时间",
        "latest_delivery_date_new": "最晚投递时间",
        "picking_shipment": "Picking Shipment",
        "fee": "费用",
        "need_resend_memo": "补发理由",
        "scheduled_date": "约定日期",
        "source_document": "Source Document",
        "updated_in_wish": "Updated in Wish",
        "payment_date": "支付日期",
        "weight": "重量(KG)",
        "shipment_content": "Shipment Content",
        "validate_state": "有效状态",
        "validate_error_text": "Validate Error Text",
        "pre_sale": "预售",
        "send_gift": "送礼品",
        "send_warehouse": "发货仓库",
        "updated_in_platform": "Updated in Platform",
        "resend": "补发",
        "confirm_return_time": "确认退货时间",
        "return_process_time": "退货处理时间",
        "assign_to_user": "分配给用户",
        "remote_district": "偏远地区",
        "ebay_type": "Ebay类型",
        "amazon_type": "Amazon类型",
        "instance": "实例",
        "total": "总计",
        "ship_method": "物流方式",
        "save": "保存",
        "cancel": "丢弃",
        "ebay_buyer_id": "eBay Buyer ID"
    }
}
</i18n>
