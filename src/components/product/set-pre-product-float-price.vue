<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 17, offset: 1 }"
        >
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item :label="$t('columns.platform')" required>
                        <a-select
                            v-decorator="['float_platform']"
                            :style="{ width: '200px' }"
                            size="small"
                            placeholder="Please select"
                            :disabled="!editAble"
                        >
                            <a-select-option key="all" value="all">
                                ALL
                            </a-select-option>
                            <a-select-option key="amazon" value="amazon">
                                Amazon
                            </a-select-option>
                            <a-select-option key="ebay" value="ebay">
                                Ebay
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.warehouse')" required>
                        <a-select
                            v-decorator="['warehouse']"
                            :style="{ width: '200px' }"
                            size="small"
                            placeholder="Please select"
                            :disabled="!editAble"
                        >
                            <a-select-option
                                v-for="version of $dict.WarehouseId"
                                :key="version.value"
                                :value="version.value"
                            >
                                {{ $t(version.label) }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.de_float_price')">
                        <a-input-number
                            v-decorator="['float_price']"
                            size="small"
                            :disabled="!editAble"
                            :min="0"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.uk_float_price')">
                        <a-input-number
                            v-decorator="['uk_float_price']"
                            size="small"
                            :disabled="!editAble"
                            :min="0"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.fr_float_price')">
                        <a-input-number
                            v-decorator="['fr_float_price']"
                            size="small"
                            :disabled="!editAble"
                            :min="0"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.es_float_price')">
                        <a-input-number
                            v-decorator="['es_float_price']"
                            size="small"
                            :disabled="!editAble"
                            :min="0"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.it_float_price')">
                        <a-input-number
                            v-decorator="['it_float_price']"
                            size="small"
                            :disabled="!editAble"
                            :min="0"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.nl_float_price')">
                        <a-input-number
                            v-decorator="['nl_float_price']"
                            size="small"
                            :disabled="!editAble"
                            :min="0"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.pl_float_price')">
                        <a-input-number
                            v-decorator="['pl_float_price']"
                            size="small"
                            :disabled="!editAble"
                            :min="0"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.change_float_memo')">
                        <a-textarea
                            v-decorator="['change_reason']"
                            :style="{ width: '300px' }"
                            size="small"
                            :disabled="!editAble"
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
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { ProductService } from '../../services/product.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { CommonService } from '@/shared/utils/common.service'

@Component({
    components: {}
})
export default class SetPreProductFloatPrice extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private row

    @Prop({ default: false })
    private edit

    private editAble: any = false

    private form: any

    private loadingService = new LoadingService()

    private productService = new ProductService()
    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    @Watch('edit')
    onEditChange() {
        this.editAble = this.edit
    }

    public setFormValues() {
        this.form.setFieldsValue(this.row)
    }

    public created() {
        this.form = this.$form.createForm(this)
    }

    private mounted() {
        this.editAble = this.edit
        this.setFormValues()
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['price_id_list'] = [this.row.id]
                this.saveInfo(values)
            }
        })
    }

    private saveInfo(params) {
        this.innerAction.setActionAPI(
            'product_management/update_product_float_price',
            CommonService.getMenuCode('product_price_check')
        )
        this.publicService
            .modify(
                new RequestParams(params, {
                    loading: this.loadingService,
                    innerAction: this.innerAction
                })
            )
            .subscribe(
                data => {
                    this.$message.success('修改成功!')
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
  "en-us": {
    "desc": "",
    "columns":{
       "platform":"Platform",
       "warehouse":"Warehouse",
       "de_float_price":"DE float price",
       "uk_float_price":"UK float price",
       "fr_float_price":"FR float price",
       "es_float_price":"ES float price",
       "it_float_price":"IT float price",
       "nl_float_price":"NL float price",
       "pl_float_price":"PL float price",
       "change_float_memo":"Change Reason"
    },
    "action":{
        "edit":"Edit",
        "cancel":"Cancel",
        "more":"More"
    },
    "rules":{

    },
    "delete":"Are you sure delete?",
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Delete Success",
    "please_choose":"Please Choose"
  },
  "zh-cn": {
    "desc": "",
    "columns":{
        "platform":"平台",
       "warehouse":"仓库",
       "de_float_price":"DE站点浮动值",
       "uk_float_price":"UK站点浮动值",
       "fr_float_price":"FR站点浮动值",
       "es_float_price":"ES站点浮动值",
       "it_float_price":"IT站点浮动值",
       "nl_float_price":"NL站点浮动值",
       "pl_float_price":"PL站点浮动值",
       "change_float_memo":"浮动价变更备注"
    },
    "action":{
      "edit":"编辑",
      "cancel":"取消",
      "more":"更多操作"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "delete":"是否确认删除?",
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "delete_success":"删除成功",
    "please_choose":"请选择"

  }
}
</i18n>
