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
                    ><a-form-item :label="$t('columns.source_doc1')"
                        ><a-input
                            v-decorator="[`source_doc1`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.carrier_name')"
                        ><a-input
                            v-decorator="[`carrier_name`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.bl_code')"
                        ><a-input
                            v-decorator="[`bl_code`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.package_code')"
                        ><a-input
                            v-decorator="[`package_code`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item
                        :label="$t('columns.clearance_data_submit_date')"
                        ><a-date-picker
                            v-decorator="[`clearance_data_submit_date`]"
                            size="small"
                            format="YYYY-MM-DD"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.bl_finish_date')"
                        ><a-date-picker
                            v-decorator="[`bl_finish_date`]"
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
                    ><a-form-item :label="$t('columns.port_start')"
                        ><a-input
                            v-decorator="[`port_start`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.port_end')"
                        ><a-input
                            v-decorator="[`port_end`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.bl_xingshi')"
                        ><a-select
                            v-decorator="['bl_xingshi']"
                            :style="{
                                width: '100%',
                                'max-width': '240px'
                            }"
                            size="small"
                            placeholder="Please Select"
                        >
                            <a-select-option value="zs" key="zs">
                                ZS
                            </a-select-option>
                            <a-select-option value="df" key="df">
                                DF
                            </a-select-option>
                        </a-select></a-form-item
                    ></a-col
                >
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.express_name')"
                        ><a-select
                            v-decorator="['express_name']"
                            :style="{
                                width: '100%',
                                'max-width': '240px'
                            }"
                            size="small"
                            placeholder="Please Select"
                        >
                            <a-select-option value="tnt" key="tnt">
                                TNT
                            </a-select-option>
                            <a-select-option value="dhl" key="dhl">
                                DHL
                            </a-select-option>
                        </a-select></a-form-item
                    ></a-col
                >
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
export default class ModifyPackageLogistic extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    ids: any

    private form: any

    private publicService = new PublicService()
    private innerAction = new InnerActionService()
    private loadingService = new LoadingService()

    private created() {
        this.form = this.$form.createForm(this)
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
            values['pack_id_list'] = this.ids
            this.innerAction.setActionAPI(
                'purchase_management/update_package_logistics',
                CommonService.getMenuCode('purchase-package-manage')
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
           "source_doc1":"Invoice Number",
            "carrier_name":"Carrier Code",
            "bl_code":"BL Code",
            "package_code":"Package Code",
            "bl_xingshi":"BL Model",
            "express_name":"Express Name",
            "shipment_number":"Shipment Number",
            "clearance_data_submit_date":"Clearance Data Submit Date",
            "bl_finish_date":"BL Finish Date",
            "port_start":"Start Port",
            "port_end":"End Port"
    }
  },
  "zh-cn":{
       "submit": "提交",
       "cancel": "取消",
       "columns":{    
           "source_doc1":"发票号",
            "carrier_name":"船公司简码",
            "bl_code":"提单号",
            "package_code":"集装箱号",
            "bl_xingshi":"BL Model",
            "express_name":"快递公司",
            "shipment_number":"快递单号",
            "clearance_data_submit_date":"清关资料提交时间",
            "bl_finish_date":"电放完成时间",
            "port_start":"始发港",
            "port_end":"到达港"
        }
  }
}
</i18n>
