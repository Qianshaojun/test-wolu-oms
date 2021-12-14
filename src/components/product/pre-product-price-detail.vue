<template>
    <section class="component order-detail">
        <div style="max-height:600px;overflow-y:scroll;">
            <a-tabs
                :defaultActiveKey="detail[0]['sku'] ? detail[0]['sku'] : ''"
                :v-model="activeKey"
                type="card"
                @change="e => onPanelChange(e)"
            >
                <a-tab-pane
                    v-for="item of detail"
                    :tab="item['sku']"
                    :key="item['sku']"
                >
                    <PreProductPriceCheckView :detail="info" />
                </a-tab-pane>
            </a-tabs>
            <a-card class="x-form">
                <h3 style="margin-top:10px;color:#000;font-weight:600;">
                    {{ $t('action.title-7') }}
                </h3>
                <a-form
                    class="data-form"
                    layout="inline"
                    :form="form"
                    :labelCol="{ span: 3 }"
                    :wrapperCol="{ span: 19, offset: 0 }"
                >
                    <a-row :gutter="24">
                        <a-col :span="22">
                            <a-form-item :label="$t('memo')">
                                <a-textarea
                                    v-decorator="['memo']"
                                    rows="2"
                                    disabled
                                ></a-textarea>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <h3 style="margin-top:10px;color:#000;font-weight:600;">
                        {{ $t('action.title-8') }}
                    </h3>
                    <a-row :gutter="24">
                        <a-col :span="11">
                            <a-form-item
                                :label="$t('de_mfn_price')"
                                style="overflow:visible;"
                            >
                                <a-input-number
                                    v-decorator="['ref_de_mfn_price']"
                                    size="small"
                                    style="margin-left:80px;"
                                    :min="0"
                                ></a-input-number>
                            </a-form-item>
                        </a-col>
                        <a-col :span="11">
                            <a-form-item
                                :label="$t('uk_mfn_price')"
                                style="overflow:visible;"
                            >
                                <a-input-number
                                    v-decorator="['ref_uk_mfn_price']"
                                    size="small"
                                    style="margin-left:80px;"
                                    :min="0"
                                ></a-input-number>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <h3 style="margin-top:10px;color:#000;font-weight:600;">
                        {{ $t('action.title-9') }}
                    </h3>
                    <a-row :gutter="24">
                        <a-col :span="22">
                            <a-form-item :label="$t('is_pass')">
                                <a-radio-group
                                    v-decorator="[
                                        'approve_state',
                                        { initialValue: 20 }
                                    ]"
                                    size="small"
                                    buttonStyle="solid"
                                >
                                    <a-radio :value="20">{{
                                        $t('pass')
                                    }}</a-radio>
                                    <a-radio :value="30">{{
                                        $t('no_pass')
                                    }}</a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="22">
                            <a-form-item :label="$t('reason')">
                                <a-textarea
                                    v-decorator="['approve_memo']"
                                    rows="2"
                                ></a-textarea>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </a-card>
        </div>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">取消</a-button>
            <a-button type="primary" @click="onSubmit">提交</a-button>
        </div>
    </section>
</template>

<style>
.ant-table-bordered .ant-table-thead > tr > th,
.ant-table-bordered .ant-table-tbody > tr > td {
    border-right: 1px solid #eeeeee !important;
}
.x-form .ant-form-inline .ant-form-item > .ant-form-item-label {
    overflow: visible;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'

import { OrderService } from '../../services/order.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { RequestParams } from '@/core/http'
import { TaxesService } from '../../services/taxes.service'
import { CommonService } from '@/shared/utils/common.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import PreProductPriceCheckView from '~/components/product/pre-product-price-check-view.vue'
import { Form } from 'ant-design-vue'

@Component({
    components: {
        PreProductPriceCheckView
    }
})
export default class PreProductPriceDetail extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {}

    @Prop({ default: Array })
    detail: any

    @Prop()
    private systemUsers

    private id: any = 0

    private info: any = []

    private activeKey: any = ''
    private form: any

    private activeSubKey: any = ''
    private subDefaultKey: any = ''

    private created() {
        this.form = this.$form.createForm(this)
    }

    @Watch('detail')
    private onDetailChange() {
        // if (!this.detail.id || (this.detail.id && this.id != this.detail.id)) {
        if (this.detail.length) {
            this.activeKey = this.detail[0]['sku']
            this.getDetail(this.detail[0])
        } else {
            this.info = []
        }
    }

    private mounted() {
        if (this.detail.length) {
            this.activeKey = this.detail[0]['sku']
            this.getDetail(this.detail[0])
        }
    }

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private getDetail(sku) {
        this.innerAction.setActionAPI(
            'product_management/query_pre_product_price_check_detail',
            CommonService.getMenuCode('pre_product_price_check')
        )
        this.publicService
            .query(
                new RequestParams(
                    {
                        sku: sku['sku'],
                        approve_state: sku['approve_state']
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.info = data.pre_price_list.map(x => {
                        x.shipping_fee = x.shipping_fee + ''
                        return x
                    })
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onPanelChange(e) {
        this.activeKey = e
        let item = this.detail.find(x => x.sku === e)
        if (item) {
            this.getDetail(item)
        }
    }

    private onSubPanelChange(e) {
        this.activeSubKey = e
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['sku_list'] = this.detail.map(x => x.sku)
                this.innerAction.setActionAPI(
                    'product_management/approve_pre_product_price_check',
                    CommonService.getMenuCode('pre_product_price_check')
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
        })
    }
}
</script>

<i18n>
{
  "en-us":{
    "base":"Order Detail",
    "customerProblem":"Customer Problem",
    "pickingList":"Picking List",
    "invoices":"Invoices",
    "operateLogs":"Operate Logs",
    "de_mfn_price":"de_mfn_price",
    "uk_mfn_price":"uk_mfn_price",
    "pass":"passed",
    "no_pass":"not_passed",
    "memo":"Memo",
    "reason":"Approve Reason",
    "is_pass":"Is Pass",
    "action": {
        "title-7":"预调价备注",
        "title-8":"参考市价",
        "title-9":"运营审核意见"
    }
  },
  "zh-cn":{
    "base":"订单详情",
    "customerProblem":"客户问题",
    "pickingList":"拣货列表",
    "invoices":"发票",
    "operateLogs":"操作日志",
    "de_mfn_price":"参考DE-MFN-市价",
    "uk_mfn_price":"参考UK-MFN-市价",
    "pass":"通过",
    "no_pass":"不通过",
    "memo":"备注",
    "reason":"审核原因",
    "is_pass":"是否通过",
    "action": {
        "title-7":"预调价备注",
        "title-8":"参考市价",
        "title-9":"运营审核意见"
    }
  }
}
</i18n>
