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
                <a-col :span="20">
                    <a-form-item :label="$t('columns.year')" required>
                        <a-input-number
                            v-decorator="[
                                `year`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.month')" required>
                        <a-input-number
                            v-decorator="[
                                `month`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            :min="0"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.warehouse')" required>
                        <a-select
                            v-decorator="[
                                'warehouse',
                                { initialValue: defaultWarehouse },
                                {
                                    rules: rules.required
                                }
                            ]"
                            style="width: 120px;"
                            size="small"
                        >
                            <a-select-option
                                :value="item.code"
                                v-for="item of warehouseList"
                                :key="item.code"
                            >
                                {{ $t(item.name) }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.shipment_price')" required>
                        <a-input-number
                            v-decorator="[
                                `shipment_price`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            :min="0"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
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
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import moment from 'moment'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { SystemService } from '../../services/system.service'
import { PurchaseService } from '../../services/purchase.service'

@Component({
    components: {}
})
export default class AddOceanShippingFee extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private info

    @Prop()
    private warehouseList

    @Prop()
    private saveFlag

    private systemService = new SystemService()
    // 分页服务
    private pageService = new PageService()

    private loadingService = new LoadingService()

    private purchageService = new PurchaseService()

    private form: any

    private defaultWarehouse: any = ''

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public mounted() {
        if (this.info) {
            this.setFormValues()
        }
        if (this.warehouseList.length) {
            this.defaultWarehouse = this.warehouseList[0].code
        }
    }

    public setFormValues() {
        this.form.setFieldsValue(this.info)
    }

    private created() {
        this.form = this.$form.createForm(this)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['save_flag'] = this.saveFlag
                if (this.info && this.info.id) {
                    values['id'] = this.info.id
                }
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        this.purchageService
            .save_boat_shipping_fee(
                new RequestParams(data, { loading: this.loadingService })
            )
            .subscribe(
                () => {
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
      "columns":{
       "year":"Year",
       "month":"Month",
       "warehouse":"Warehouse",
       "shipment_price":"Shipment Price"
    },
    "action":{
      "submit":"Create",
      "cancel":"Cancel"
    }
  },
  "zh-cn":{
    "columns":{
        "year":"年份",
        "month":"月份",
        "warehouse":"仓库",
        "shipment_price":"海运费"
    },
    "action":{
        "submit":"提交",
        "cancel":"取消"
    }
  }
}
</i18n>
