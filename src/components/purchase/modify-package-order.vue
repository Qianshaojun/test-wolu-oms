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
                    ><a-form-item :label="$t('columns.warehouse_id')"
                        ><a-input
                            v-decorator="[`warehouse_id`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.thc_invoice')"
                        ><a-input
                            v-decorator="[`thc_invoice`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.pick_terminal')"
                        ><a-input
                            v-decorator="[`pick_terminal`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.ship_line')"
                        ><a-input
                            v-decorator="[`ship_line`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.predict_eta')"
                        ><a-date-picker
                            v-decorator="[`predict_eta`]"
                            size="small"
                            format="YYYY-MM-DD"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.vessel')"
                        ><a-input
                            v-decorator="[`vessel`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.predict_eta_memo')"
                        ><a-input
                            v-decorator="[`predict_eta_memo`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.terminal')"
                        ><a-input
                            v-decorator="[`terminal`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.company_name')"
                        ><a-select
                            v-decorator="['company_name']"
                            :style="{
                                width: '100%',
                                'max-width': '240px'
                            }"
                            size="small"
                            placeholder="Please Select"
                        >
                            <a-select-option value="woltu" key="woltu">
                                Woltu
                            </a-select-option>
                            <a-select-option value="eugad" key="eugad">
                                EUGAD
                            </a-select-option>
                            <a-select-option value="situ" key="situ">
                                Situ
                            </a-select-option>
                            <a-select-option value="elight" key="elight">
                                Elight
                            </a-select-option>
                            <a-select-option value="wowo" key="wowo">
                                Wowo
                            </a-select-option>
                            <a-select-option
                                value="meteorsrain"
                                key="meteorsrain"
                            >
                                Meteorsrain
                            </a-select-option>
                        </a-select></a-form-item
                    ></a-col
                >
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.size_type')"
                        ><a-input
                            v-decorator="[`size_type`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.set_etd_null')"
                        ><a-checkbox
                            v-decorator="[`set_etd_null`]"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.goods_description')"
                        ><a-input
                            v-decorator="[`goods_description`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.netto_weight')"
                        ><a-input
                            v-decorator="[`netto_weight`]"
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
export default class ModifyPackageOrder extends Vue {
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
        values['package_id_list'] = this.ids
        this.innerAction.setActionAPI(
            'purchase_management/modify_change_purchase_info',
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
</script>

<i18n>
{
  "en-us":{
      "submit": "Submit",
      "cancel": "Cancel",
      "columns": {
           "warehouse_id":"Warehouse Id",
            "thc_invoice":"Thc Invoice",
            "pick_terminal":"Pick Terminal",
            "ship_line":"Ship Line",
            "predict_eta":"Predict Eta",
            "vessel":"Vessel",
            "predict_eta_memo":"Predict Eta Memo",
            "terminal":"Terminal",
            "company_name":"Company Name",
            "size_type":"Size Type",
            "set_etd_null":"Set Etd Null ",
            "goods_description":"Goods Description",
            "netto_weight":"Netto Weight"
    }
  },
  "zh-cn":{
       "submit": "提交",
       "cancel": "取消",
       "columns":{    
            "warehouse_id":"仓库",
            "thc_invoice":"Thc Invoice",
            "pick_terminal":"Pick Terminal",
            "ship_line":"Ship Line",
            "predict_eta":"Predict Eta",
            "vessel":"Vessel",
            "predict_eta_memo":"Predict Eta Memo",
            "terminal":"Terminal",
            "company_name":"Company Name",
            "size_type":"Size Type",
            "set_etd_null":"Set Etd Null ",
            "goods_description":"Goods Description",
            "netto_weight":"Netto Weight"
        }
  }
}
</i18n>
