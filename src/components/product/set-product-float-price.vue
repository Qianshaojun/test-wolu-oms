<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 16, offset: 1 }"
        >
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item :label="$t('columns.platform')" required>
                        <a-select
                            v-decorator="[
                                'platform',
                                { initialValue: '' },
                                {
                                    rules: rules.required
                                }
                            ]"
                            style="width: 120px;"
                            size="small"
                        >
                            <a-select-option
                                :value="item.code"
                                v-for="item of platformList"
                                :key="item.code"
                            >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.warehouse')" required>
                        <a-select
                            v-decorator="[
                                'warehouse',
                                { initialValue: '' },
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
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.float_price')">
                        <a-input-number
                            v-decorator="[`float_price`]"
                            size="small"
                            :min="0"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.uk_float_price')">
                        <a-input-number
                            v-decorator="[`uk_float_price`]"
                            size="small"
                            :min="0"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.fr_float_price')">
                        <a-input-number
                            v-decorator="[`fr_float_price`]"
                            size="small"
                            :min="0"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.es_float_price')">
                        <a-input-number
                            v-decorator="[`es_float_price`]"
                            size="small"
                            :min="0"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.it_float_price')">
                        <a-input-number
                            v-decorator="[`it_float_price`]"
                            size="small"
                            :min="0"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.nl_float_price')">
                        <a-input-number
                            v-decorator="[`nl_float_price`]"
                            size="small"
                            :min="0"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.pl_float_price')">
                        <a-input-number
                            v-decorator="[`pl_float_price`]"
                            size="small"
                            :min="0"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.change_reason')">
                        <a-textarea
                            v-decorator="[`change_reason`]"
                            :style="{ width: '300px' }"
                            size="small"
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
import { PublicService } from '~/services/public.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { InnerActionService } from '~/bootstrap/services/inner.action.service'
import { CommonService } from '../../shared/utils/common.service'

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
    private price_id_list

    @Prop()
    private platformList

    @Prop()
    private data

    // 分页服务

    private loadingService = new LoadingService()
    private innerActionService = new InnerActionService()
    private publicService = new PublicService()

    private form: any

    private defaultWarehouse: any = ''

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private warehouseList = [
        {
            code: 'de',
            name: 'DE'
        },
        {
            code: 'uk',
            name: 'UK'
        },
        {
            code: 'all',
            name: 'ALL'
        }
    ]

    private instanceList = [
        {
            code: 'de',
            name: 'DE'
        },
        {
            code: 'nl',
            name: 'NL'
        },
        {
            code: 'fr',
            name: 'FR'
        },
        {
            code: 'es',
            name: 'ES'
        },
        {
            code: 'it',
            name: 'IT'
        },
        {
            code: 'se',
            name: 'SE'
        },
        {
            code: 'pl',
            name: 'PL'
        },
        {
            code: 'all',
            name: 'ALL'
        }
    ]

    private instanceRequired = false

    private onRowChange(e) {
        if (e == 'de' || e == 'all') {
            this.instanceRequired = true
        } else {
            this.instanceRequired = false
        }
    }

    public mounted() {
        if (this.data) {
            this.setFormValues()
        }
    }

    private created() {
        this.form = this.$form.createForm(this)
    }

    public setFormValues() {
        this.form.setFieldsValue(this.data[0])
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['price_id_list'] = this.price_id_list
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        this.innerActionService.setActionAPI(
            'product_management/update_product_float_price',
            CommonService.getMenuCode('product-float-price')
        )
        this.publicService
            .modify(
                new RequestParams(data, {
                    loading: this.loadingService,
                    innerAction: this.innerActionService
                })
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
        "instance_list":"Instances",
        "warehouse":"Warehouse",
       "float_price":"de float_price",
       "uk_float_price":"uk float price",
       "fr_float_price":"fr float price",
       "es_float_price":"es float price",
       "it_float_price":"it float price",
       "nl_float_price":"nl float price",
       "pl_float_price":"pl float price",
       "change_reason":"change reason"
             },
    "action":{
      "submit":"Create",
      "cancel":"Cancel"
    }
  },
  "zh-cn":{
    "columns":{
        "instance_list":"站点",
        "warehouse":"仓库",
       "float_price":"DE站点浮动值",
       "uk_float_price":"UK站点浮动值",
       "fr_float_price":"FR站点浮动值",
       "es_float_price":"ES站点浮动值",
       "it_float_price":"IT站点浮动值",
       "nl_float_price":"NL站点浮动值",
       "pl_float_price":"PL站点浮动值",         
       "float_platform":"德仓浮动平台",
       "change_reason":"浮动价变更备注"  
       },
    "action":{
        "submit":"提交",
        "cancel":"取消"
    }
  }
}
</i18n>
