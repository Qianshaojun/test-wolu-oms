<template>
    <section class="component">
        <a-form class="data-form" :form="form">
            <a-form-item required>
                <a-textarea
                    placeholder="Memo"
                    :rows="4"
                    v-decorator="[
                        `memo`,
                        {
                            initialValue: memo
                        },
                        {
                            rules: rules.required
                        }
                    ]"
                />
            </a-form-item>
        </a-form>
        <div class="flex-row" style="margin-top:-15px;margin-bottom:15px;">
            <a-button type="primary" @click="onSubmit">{{
                $t('action.save')
            }}</a-button>
            <a-button
                class="margin-right"
                style="margin-left:5px;"
                @click="cancel"
                >{{ $t('action.cancel') }}</a-button
            >
        </div>
        <div style="width:100%;height:280px;" class="page-container">
            <a-tabs defaultActiveKey="base">
                <a-tab-pane :tab="$t('customer_problem')" key="base">
                    <OrderCustomerDetail
                        :info="customer"
                        :height="200"
                        :systemUsers="systemUsers"
                        :orderId="id"
                    ></OrderCustomerDetail>
                </a-tab-pane>
            </a-tabs>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import OrderCustomerDetail from '~/components/orders/order-customer-detail.vue'
import { OrderService } from '../../services/order.service'
import { LoadingService } from '../../bootstrap/services/loading.service'

@Component({
    components: {
        OrderCustomerDetail
    }
})
export default class OrderModifyMemo extends Vue {
    @Emit('modal.submit')
    private submit(value) {
        return value
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private id

    @Prop()
    private memo

    @Prop()
    private systemUsers

    private customer: any = []

    private orderService = new OrderService()

    private loadingService = new LoadingService()

    private form: any

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private created() {
        this.getCustomerList()
        this.form = this.$form.createForm(this)
    }

    private onSubmit() {
        this.form.validateFields().then((values: any) => {
            this.submit(values.memo)
        })
    }

    private getCustomerList() {
        this.orderService
            .getCustomerList(
                new RequestParams(
                    {
                        order_id: this.id
                    },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    this.customer = data
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
    "action":{
        "save":"Save",
        "cancel":"Cancel"
    },
    "customer_problem":"Customer Problem"
  },
  "zh-cn":{
    "action":{
        "save":"保存",
        "cancel":"取消"
    },
    "customer_problem":"客户问题"
  }
}
</i18n>
