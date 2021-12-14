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
        <div
            style="width:100%;height:340px;overflow-y:auto;"
            class="page-container"
        >
            <a-tabs>
                <a-tab-pane :tab="$t('customer_problem')" key="base">
                    <ReturnDetail
                        :info="returns"
                        :picking_id="id"
                        :orderID="orderID"
                        :systemUsers="systemUsers"
                    ></ReturnDetail>
                </a-tab-pane>
            </a-tabs>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import ReturnDetail from '~/components/picking/return-detail.vue'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { PickingService } from '../../services/picking.service'

@Component({
    components: {
        ReturnDetail
    }
})
export default class PickingModifyMemo extends Vue {
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

    @Prop()
    private orderID

    @Prop({ default: '' })
    private open_from

    private returns: any = []

    private pickingService = new PickingService()

    private loadingService = new LoadingService()

    private form: any

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private created() {
        this.form = this.$form.createForm(this)

        this.getReturns()
    }

    private mounted() {}

    private onSubmit() {
        this.form.validateFields().then((values: any) => {
            this.submit(values.memo)
        })
    }

    private getReturns() {
        this.pickingService
            .queryReturnInfo(
                new RequestParams(
                    {
                        picking_id: parseInt(this.id)
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.returns = data.map((x, i) => ({
                        ...x,
                        index: i + 1
                    }))
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
