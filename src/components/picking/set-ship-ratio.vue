<template>
    <section class="component order-base-detail">
        <a-card style="margin:0;padding:20px 10px 30px 10px;border: none;">
            <a-row :gutter="24">
                <a-col :span="4">
                    <span>{{ $t('columns.dynamic_price_calc') }}：</span>
                </a-col>
                <a-col :span="5">
                    <a-radio-group
                        :value="defaultPriceCalcType"
                        button-style="solid"
                        @change="e => onPriceCalcChange(e)"
                        size="small"
                    >
                        <a-radio-button value="open">
                            {{ $t('columns.open') }}
                        </a-radio-button>
                        <a-radio-button value="close">
                            {{ $t('columns.close') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-col>
                <a-col :span="14" :offset="1">
                    <a-row :gutter="4" v-if="defaultPriceCalcType == 'open'">
                        <a-col :span="10">
                            <span>{{ $t('columns.latest_calc_time') }}：</span>
                        </a-col>
                        <a-col :span="10">
                            <span>{{ data.write_date | datetolocal }}</span>
                        </a-col>
                        <a-col :span="3">
                            <a-button
                                type="primary"
                                size="small"
                                @click="calculation"
                                >{{ $t('columns.calculation') }}</a-button
                            >
                        </a-col>
                    </a-row>
                    <a-row :gutter="4" v-else>
                        <a-col :span="6">
                            <span>{{ $t('columns.start_end_time') }}：</span>
                        </a-col>
                        <a-col :span="16">
                            <a-range-picker
                                v-model="startEndTime"
                                show-time
                                format="YYYY-MM-DD HH:mm:ss"
                                @change="e => onStartEndTimeChange(e)"
                                size="small"
                            />
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
            <a-form
                class="data-form"
                layout="inline"
                :form="form"
                v-if="defaultPriceCalcType == 'close'"
            >
                <a-row :gutter="24" style="margin-top:30px;">
                    <a-col :span="3">
                        <a-form-item :label="$t('columns.ratio_set')">
                        </a-form-item>
                    </a-col>
                    <a-col :span="5">
                        <a-form-item label="DPD:">
                            <a-input-number
                                v-decorator="[
                                    'dpd_percent',
                                    {
                                        initialValue: info.dpd_percent
                                            ? info.dpd_percent
                                            : 0
                                    }
                                ]"
                                size="small"
                                :min="0"
                                :max="100"
                            />%
                        </a-form-item>
                    </a-col>
                    <a-col :span="5">
                        <a-form-item label="DHL:">
                            <a-input-number
                                v-decorator="[
                                    'dhl_percent',
                                    {
                                        initialValue: info.dhl_percent
                                            ? info.dhl_percent
                                            : 0
                                    }
                                ]"
                                size="small"
                                :min="0"
                                :max="100"
                            />%
                        </a-form-item>
                    </a-col>
                    <a-col :span="5">
                        <a-form-item label="GLS:">
                            <a-input-number
                                v-decorator="[
                                    'gls_percent',
                                    {
                                        initialValue: info.gls_percent
                                            ? info.gls_percent
                                            : 0
                                    }
                                ]"
                                size="small"
                                :min="0"
                                :max="100"
                            />%
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <div
                class="flex-row justify-content-end margin-top"
                v-if="defaultPriceCalcType == 'close'"
            >
                <!-- <a-button class="margin-right" @click="cancel">{{
                    $t('action.cancel')
                }}</a-button> -->
                <a-button type="primary" size="small" @click="onSubmit">{{
                    $t('save')
                }}</a-button>
            </div>
        </a-card>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { PickingService } from '../../services/picking.service'
import { RequestParams } from '../../core/http'
import { Mutation, namespace } from 'vuex-class'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { Form } from 'ant-design-vue'
import moment from 'moment'
import { CommonService } from '@/shared/utils/common.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

const datasModule = namespace('datasModule')

@Component({
    components: {}
})
export default class SetShipRatio extends Vue {
    @Emit('modal.submit')
    private submit(data) {
        return data
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    private form: any

    @Prop()
    private info

    @Prop()
    private type

    private data: any = {}

    private assign_to_user: any = ''

    private defaultPriceCalcType: any = 'open'

    private startEndTime: any = []

    private pickingService = new PickingService()
    private loadingService = new LoadingService()
    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    @Watch('info')
    private onInfoChange() {
        this.data = Object.assign({}, this.info)
        this.defaultPriceCalcType = this.info.is_dynamic_calculation
            ? 'open'
            : 'close'
        this.setFormValues()
    }

    private mounted() {
        if (this.info) {
            this.data = Object.assign({}, this.info)
            this.defaultPriceCalcType = this.info.is_dynamic_calculation
                ? 'open'
                : 'close'
            this.setFormValues()
        }
    }

    public created() {
        this.form = this.$form.createForm(this)
    }

    public setFormValues() {
        this.form.setFieldsValue(this.data)
    }

    private handleChange(value) {
        //console.log(value)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            let sum: any = 0
            for (let i in values) {
                if (values[i] > 0) {
                    sum += parseInt(values[i])
                }
            }

            if (this.defaultPriceCalcType == 'close') {
                if (sum !== 100) {
                    let err_msg: any = this.$t('err_msg')
                    this.$message.error(err_msg)
                    return
                }

                if (this.startEndTime.length == 0) {
                    this.$message.error('请输入起止时间')
                    return
                } else {
                    let start: any = new Date(
                        this.startEndTime[0].format('YYYY-MM-DD HH:mm:ss')
                    )
                    let end: any = new Date(
                        this.startEndTime[1].format('YYYY-MM-DD HH:mm:ss')
                    )
                    let now = new Date()
                    if (end < now) {
                        this.$message.error('开始和结束时间不能小于当前时间')
                        return
                    }
                    if (start < now) {
                        start = now
                    }

                    values['start_date'] = moment(start).format(
                        'YYYY-MM-DD HH:mm:ss'
                    )
                    values['end_date'] = moment(end).format(
                        'YYYY-MM-DD HH:mm:ss'
                    )
                }
            }
            for (let i in values) {
                values[i] = values[i] ? values[i] : 0
            }
            values['instance'] = this.type.toUpperCase()
            values['warehouse'] = 'de'
            values['is_dynamic_calculation'] =
                this.defaultPriceCalcType == 'open' ? true : false
            if (this.data.id) {
                values['id'] = this.data.id
            }
            values['product_id'] = this.data.product_template_logistic_id

            this.submitData(values)
        })
    }

    private onPriceCalcChange(e) {
        this.defaultPriceCalcType = e.target.value
    }

    private onStartEndTimeChange(e) {
        this.startEndTime = e
    }

    private submitData(params) {
        this.innerAction.setActionAPI(
            'theoretical_final_freight/modify_freight',
            CommonService.getMenuCode('final-shipping-de')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { modify_data: [params] },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('修改成功!')
                    params['id'] = data.message
                    this.data.id = data.message
                    this.$emit('changeData', params)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private calculation() {
        let params = {
            is_dynamic_calculation: true,
            product_id: this.data.product_template_logistic_id,
            instance: this.type.toUpperCase(),
            warehouse: 'de'
        }
        if (this.data.id) {
            params['id'] = this.data.id
        }
        this.submitData(params)
    }
}
</script>
<i18n>
{
    "en-us": {
        "columns":{
            "dynamic_price_calc": "Dynamic Price Calc",
            "open": "Open",
            "close": "Close",
            "latest_calc_time": "Latest Calc Time",
            "start_end_time": "Start and End Time",
            "ratio_set": "Ratio Setting",
            "calculation": "Calculate"
        },
        "err_msg":"The sum Ratio mast be 100",
        "save":"Save"
    },
    "zh-cn": {
        "columns":{
            "dynamic_price_calc":"动态价格计算",
            "open": "开启",
            "close": "关闭",
            "latest_calc_time": "最新计算时间",
            "start_end_time": "起止时间",
            "ratio_set": "物流比例设置",
            "calculation": "计算"
        },
        "err_msg":"总比例数必须等于100",
        "save":"保存"
    }
}
</i18n>
