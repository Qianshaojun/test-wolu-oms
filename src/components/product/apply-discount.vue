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
                    <a-form-item :label="$t('columns.discount_start')" required>
                        <a-date-picker
                            v-decorator="[
                                `discount_start`,
                                { initialValue: moment(Date.now()) },
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
                    <a-form-item :label="$t('columns.discount_end')" required>
                        <a-date-picker
                            v-decorator="[
                                `discount_end`,
                                { initialValue: moment().add('days', 180) },
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
                    <a-form-item :label="$t('columns.discount')" required>
                        <a-input
                            v-decorator="[
                                `discount`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">取消</a-button>
            <a-button type="primary" @click="onSubmit">提交</a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { SystemService } from '../../services/system.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { CommonService } from '@/shared/utils/common.service'
import moment from 'moment'

@Component({
    components: {}
})
export default class ApplyDiscount extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private ids

    private systemService = new SystemService()
    // 分页服务
    private pageService = new PageService()

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private form: any

    private moment: any = moment

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private created() {
        this.form = this.$form.createForm(this)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        let params: any[] = this.ids.map(x => {
            return {
                id: x,
                discount_start: data.discount_start,
                discount_end: data.discount_end,
                discount: data.discount
            }
        })
        this.innerAction.setActionAPI(
            '/report/modify_product_unsalable_report',
            CommonService.getMenuCode('product-unsalable-report-leader')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { update_data: params },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                ret => {
                    this.$message.success('操作成功')
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
            "discount_start":"Discount Start",
            "discount_end":"Discount End",
            "discount": "discount"
      }
  },
  "zh-cn":{
       "columns":{    
            "discount_start":"折扣开始时间",
            "discount_end":"折扣结束时间",
            "discount": "折扣"
      }
  }
}
</i18n>
