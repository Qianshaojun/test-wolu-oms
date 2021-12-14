<template>
    <section class="component edit-customer">
        <table class="xtb">
            <tr>
                <td style="color:red; width:15%;">
                    {{ $t('columns.purchase_detail') }}
                </td>
                <td style="padding: 0;">
                    <table class="xtb" style="border:none;">
                        <tr>
                            <th>{{ $t('columns.name') }}</th>
                            <th>{{ $t('columns.quantity') }}</th>
                            <th>{{ $t('columns.finish_qty') }}</th>
                            <th>{{ $t('columns.finish_yn') }}</th>
                            <th>{{ $t('columns.cn_category') }}</th>
                            <th>{{ $t('columns.color') }}</th>
                            <th>{{ $t('columns.material') }}</th>
                        </tr>
                        <tr v-for="(x, i) in info" :key="i">
                            <td :key="x.req_name">{{ x.req_name }}</td>
                            <td :key="x.product_qty">{{ x.product_qty }}</td>
                            <td :key="x.finish_yn">{{ x.finish_yn }}</td>
                            <td :key="x.z_sub_category">
                                {{ x.z_sub_category }}
                            </td>
                            <td :key="x.product_color">
                                {{ x.product_color }}
                            </td>
                            <td :key="x.pack_material">
                                {{ x.pack_material }}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>{{ $t('columns.reason') }}</td>
                <td class="required">
                    <a-input
                        ref="reason"
                        style="width:100%;"
                        size="small"
                        v-decorator="['reason']"
                        v-model="reason"
                    />
                </td>
            </tr>
        </table>

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

<style>
.xtb {
    width: 100%;
    border: 1px solid #ccc;
}
.xtb tr {
    border: 1px solid #ccc;
}
.xtb td,
.xtb th {
    border: 1px solid #ccc;
    padding: 3px 5px;
}
.xtb th {
    background: #f2f2f2;
}
.xtb .required .ant-input-sm {
    height: 35px;
    background: #ecc5e9;
}
</style>
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

@Component({
    components: {}
})
export default class PurchaseFinishItem extends Vue {
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

    private reason: any = ''

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public mounted() {
        this.$nextTick(() => {
            let reasonInput: any = this.$refs.reason
            reasonInput.focus()
        })
    }

    private onSubmit() {
        if (!this.reason) {
            this.$message.error('原因不能为空!')
            let reasonInput: any = this.$refs.reason
            reasonInput.focus()
            return
        }
        this.innerAction.setActionAPI(
            'purchase_order_plan/finish_purchase_item',
            CommonService.getMenuCode('purchase-product-plan')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        id_list: this.info.map(x => x.id),
                        finishItemMemo: this.reason
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.info(data.message)
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
            "purchase_detail":"采购量未达到需求量的90%，无法手动完成",
            "reason":"Finish Reason",
            "name":"Name",
            "quantity":"Quantity",
            "finish_qty":"Finish QTY",
            "finish_yn":"Is Finish",
            "cn_category":"Cn Category",
            "color":"Color",
            "material":"Material"
      },
      "return_reason":"Return Reason",
      "submit":"Submit",
      "cancel":"Cancel"
  },
  "zh-cn":{
       "columns":{    
            "purchase_detail":"采购量未达到需求量的90%，无法手动完成",
            "reason":"完成原因",
            "name":"物品",
            "quantity":"数量",
            "finish_qty":"发货量",
            "finish_yn":"完成情况",
            "cn_category":"中文子类",
            "color":"颜色",
            "material":"材料"
      },
      "return_reason":"返回原因",
      "submit":"提交",
      "cancel":"取消"
  }
}
</i18n>
