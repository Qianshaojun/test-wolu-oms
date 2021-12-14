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
                <a-col :span="8">
                    <a-form-item :label="$t('columns.discount_price')">
                        <a-input-number
                            v-decorator="['discount_price']"
                            size="small"
                            :min="0"
                            :disabled="!editAble"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="$t('columns.discount_percent')">
                        <a-input
                            v-decorator="['discount_percent']"
                            size="small"
                            :disabled="!editAble"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="$t('columns.discount_warehouse')">
                        <a-select
                            v-decorator="['discount_warehouse']"
                            :style="{ width: '200px' }"
                            size="small"
                            placeholder="Please select"
                            :disabled="!editAble"
                        >
                            <a-select-option key="all" value="all">
                                ALL
                            </a-select-option>
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
                <a-col :span="8">
                    <a-form-item :label="$t('columns.discount_start')">
                        <a-date-picker
                            v-decorator="['discount_start']"
                            format="YYYY-MM-DD"
                            size="small"
                            :disabled="!editAble"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="$t('columns.discount_end')">
                        <a-date-picker
                            v-decorator="['discount_end']"
                            format="YYYY-MM-DD"
                            size="small"
                            :disabled="!editAble"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="$t('columns.discount_change_reason')">
                        <a-textarea
                            v-decorator="['discount_change_reason']"
                            size="small"
                            :disabled="!editAble"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <div class="flex-row justify-content-end margin-top" v-if="showBtn">
            <a-button class="margin-right" @click="cancel">取消</a-button>
            <a-button type="primary" @click="onSubmit">提交</a-button>
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { UserService } from '~/services/user.service'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { CommonService } from '@/shared/utils/common.service'
import { LoadingService } from '../../bootstrap/services/loading.service'

@Component({
    components: {}
})
export default class ProductPriceCheckDiscountForm extends Vue {
    @Emit('modal.submit')
    private submit(values) {
        return values
    }

    @Emit('modal.cancel')
    private cancel() {}

    @Prop({ default: false })
    private edit

    @Prop({ default: true })
    private showBtn

    public editAble: any = false

    @Prop()
    private info

    private form: any

    private userService = new UserService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private loadingService = new LoadingService()

    @Watch('edit')
    onEditChange() {
        this.editAble = this.edit
    }

    public mounted() {
        this.editAble = this.edit
        this.setFormValues()
    }

    public created() {
        this.form = this.$form.createForm(this)
    }

    public setFormValues() {
        this.form.setFieldsValue(this.info)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['id'] = this.info.id
                this.innerAction.setActionAPI(
                    'product_management/update_product_discount_price',
                    CommonService.getMenuCode('product_price_check')
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
                            this.$message.success('修改成功')
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
        })
    }
}
</script>

<i18n>
{
  "en-us":{
      "columns":{
            "discount_warehouse": "Warehouse",
            "discount_percent":"discount_percent",
            "discount_price":"discount_price",
            "discount_start": "discount_start",
            "discount_end": "discount_end",
            "discount_change_reason":"discount_change_reason"
      }
  },
  "zh-cn":{
       "columns":{    
            "discount_warehouse": "折扣仓库",
            "discount_percent":"折扣百分比",
            "discount_price":"折扣价",
            "discount_start": "折扣开始日期",
            "discount_end": "折扣结束日期",
            "discount_change_reason":"折扣变更备注"
      }
  }
}
</i18n>
