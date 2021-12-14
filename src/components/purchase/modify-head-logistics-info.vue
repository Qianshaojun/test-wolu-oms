<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 16, offset: 2 }"
        >
            <a-row :gutter="24">
                <a-col :span="12"
                    ><a-form-item
                        :label="$t('columns.freight_forwarder_ship_owner')"
                        ><a-input
                            v-decorator="[`freight_forwarder_ship_owner`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.shipping_company')"
                        ><a-input
                            v-decorator="[`shipping_company`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.shipping_channel')"
                        ><a-input
                            v-decorator="[`shipping_channel`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.historical_inquiry')"
                        ><a-input-number
                            v-decorator="[`historical_inquiry`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.actual_quotation')"
                        ><a-input-number
                            v-decorator="[`actual_quotation`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.shipping_amount')"
                        ><a-input-number
                            v-decorator="[`shipping_amount`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.tax_amount')"
                        ><a-input-number
                            v-decorator="[`tax_amount`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.insurance_amount')"
                        ><a-input-number
                            v-decorator="[`insurance_amount`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.start_place')"
                        ><a-input
                            v-decorator="[`start_place`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.destination_port')"
                        ><a-input
                            v-decorator="[`destination_port`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.etd_estimated_domestic')"
                        ><a-date-picker
                            v-decorator="[`etd_estimated_domestic`]"
                            size="small"
                            format="YYYY-MM-DD"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.actual_domestic')"
                        ><a-date-picker
                            v-decorator="[`actual_domestic`]"
                            size="small"
                            format="YYYY-MM-DD"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.eta_estimated_arrival')"
                        ><a-date-picker
                            v-decorator="[`eta_estimated_arrival`]"
                            size="small"
                            format="YYYY-MM-DD"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.actual_arrival')"
                        ><a-date-picker
                            v-decorator="[`actual_arrival`]"
                            size="small"
                            format="YYYY-MM-DD"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.estimated_delivery')"
                        ><a-date-picker
                            v-decorator="[`estimated_delivery`]"
                            size="small"
                            format="YYYY-MM-DD"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.shipment_number')"
                        ><a-input
                            v-decorator="[`shipment_number`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.courier_company')"
                        ><a-input
                            v-decorator="[`courier_company`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.customs_clearance_fee')"
                        ><a-input-number
                            v-decorator="[`customs_clearance_fee`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.boat_company_code')"
                        ><a-input
                            v-decorator="[`boat_company_code`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.package_number')"
                        ><a-input
                            v-decorator="[`package_number`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.container_number')"
                        ><a-input
                            v-decorator="[`container_number`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.invoice_number')"
                        ><a-input
                            v-decorator="[`invoice_number`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.lading_number')"
                        ><a-input
                            v-decorator="[`lading_number`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
            </a-row>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('cancel')
            }}</a-button>
            <a-button type="primary" @click="onSubmit">{{
                $t('submit')
            }}</a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import moment from 'moment'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { SystemService } from '../../services/system.service'
import { CommonService } from '@/shared/utils/common.service'
import { formConfig } from '@/config/form.config'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

@Component({
    components: {}
})
export default class ModifyHeadLogisticsInfo extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    inbound_line_id: any

    private form: any

    private publicService = new PublicService()
    private innerAction = new InnerActionService()
    private loadingService = new LoadingService()

    private created() {
        this.form = this.$form.createForm(this)
    }

    private mounted() {
        this.getHeadLogisticsInfo()
    }

    private saveFlag = 0

    private getHeadLogisticsInfo() {
        let that = this
        this.innerAction.setActionAPI(
            '/report/query_head_logistics_info',
            CommonService.getMenuCode('head-logistics-report')
        )
        this.publicService
            .query(
                new RequestParams(
                    {
                        inbound_line_id: this.inbound_line_id
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    if(data.length == 1){
                        that.form.setFieldsValue(data[0])
                        that.saveFlag = 1
                    }
                },
                err => {
                    that.$message.error(err.message)
                }
            )
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                this.saveInfo(values)
            }
        })
    }

    private saveInfo(values) {
        var flag = true
        for (var item in values) {
            if (values[item]) {
                flag = false
            } else {
                delete values[item]
            }
        }
        if (flag) {
            this.$message.error('至少输入一项')
        } else {
            values['inbound_line_id'] = this.inbound_line_id
            values['save_flag'] = this.saveFlag
            this.innerAction.setActionAPI(
                '/report/modify_head_logistics',
                CommonService.getMenuCode('head-logistics-report')
            )
            this.publicService
                .modify(
                    new RequestParams(values, {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    })
                )
                .subscribe(
                    data => {
                        this.submit()
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        }
    }
}
</script>

<i18n>
{
  "en-us":{
      "submit": "Submit",
      "cancel": "Cancel",
      "columns": {
           "freight_forwarder_ship_owner":"freight_forwarder/ship_owner",
            "shipping_company":"shipping_company",
            "shipping_channel":"shipping_channel",
            "historical_inquiry":"historical_inquiry",
            "actual_quotation":"actual_quotation",
            "shipping_amount":"shipping_amount",
            "tax_amount":"tax_amount",
            "insurance_amount":"insurance_amount",
            "start_place":"start_place",
            "destination_port":"destination_port",
            "etd_estimated_domestic":"etd_estimated_domestic",
            "actual_domestic":"actual_domestic",
            "eta_estimated_arrival":"eta_estimated_arrival",
            "actual_arrival":"actual_arrival",
            "estimated_delivery":"estimated_delivery",
            "shipment_number":"shipment_number",
            "courier_company":"courier_company",
            "customs_clearance_fee":"customs_clearance_fee",
            "boat_company_code":"boat_company_code",
            "package_number":"package_number",
            "container_number":"container_number",
            "invoice_number":"invoice_number",
            "lading_number":"lading_number"
    }
  },
  "zh-cn":{
       "submit": "提交",
       "cancel": "取消",
       "columns":{    
           "freight_forwarder_ship_owner":"货代/船东",
            "shipping_company":"发货公司",
            "shipping_channel":"发货渠道",
            "historical_inquiry":"历史询价（单价）",
            "actual_quotation":"实际报价（单价)",
            "shipping_amount":"发货总金额",
            "tax_amount":"税金",
            "insurance_amount":"保险金额",
            "start_place":"出发地点",
            "destination_port":"目的港",
            "etd_estimated_domestic":"ETD预计国内出发时间",
            "actual_domestic":"国内实际出发时间",
            "eta_estimated_arrival":"ETA预计到港时间",
            "actual_arrival":"国外实际到港时间",
            "estimated_delivery":"预计派送时间",
            "shipment_number":"物流单号",
            "courier_company":"快递公司",
            "customs_clearance_fee":"清关尾程费用",
            "boat_company_code":"船公司简码",
            "package_number":"货柜号",
            "container_number":"集装箱号",
            "invoice_number":"发票号",
            "lading_number":"提单号"
        }
  }
}
</i18n>
