<template>
    <section class="component edit-customer">
        <table class="xtb">
            <tr>
                <td>{{ $t('columns.contact_no') }}</td>
                <td class="required">
                    {{ contact_no }}
                </td>
            </tr>
            <tr>
                <td>{{ $t('columns.trace_memo') }}</td>
                <td class="required">
                    <a-input
                        ref="trace_memo"
                        style="width:100%;"
                        size="small"
                        v-decorator="['trace_memo']"
                        v-model="trace_memo"
                    />
                </td>
            </tr>
            <tr>
                <td style="color:red; width:15%;">
                    {{ $t('columns.purchase_detail') }}
                </td>
                <td style="padding: 0;">
                    <table class="xtb" style="border:none;">
                        <tr>
                            <th style="text-align:center">
                                {{ $t('columns.select_col') }}
                            </th>
                            <th style="text-align:center">SKU</th>
                            <th style="text-align:center">
                                {{ $t('columns.quantity') }}
                            </th>
                            <th style="text-align:center">
                                {{ $t('columns.order_date') }}
                            </th>
                            <th style="text-align:center">
                                {{ $t('columns.give_date') }}
                            </th>
                            <th style="text-align:center">
                                {{ $t('columns.warehouse_id') }}
                            </th>
                            <th style="text-align:center">
                                {{ $t('columns.id') }}
                            </th>
                        </tr>
                        <tr v-for="(x, i) in info" :key="i">
                            <td style="text-align:center">
                                <input
                                    type="checkbox"
                                    checked="checked"
                                    @change="
                                        e => change_checked(x, e.target.checked)
                                    "
                                />
                            </td>
                            <td :key="x.default_code" style="text-align:right">
                                {{ x.default_code }}
                            </td>
                            <td :key="x.product_qty">{{ x.product_qty }}</td>
                            <td :key="x.order_date">{{ x.order_date }}</td>
                            <td :key="x.give_date">{{ x.give_date }}</td>
                            <td :key="x.warehouser_id">
                                {{ x.warehouser_id }}
                            </td>
                            <td :key="x.id">
                                {{ x.id }}
                            </td>
                        </tr>
                    </table>
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
export default class AddTraceMemoDlg extends Vue {
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

    private trace_memo: any = ''

    @Prop()
    private contact_no

    private ids: any = []

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public mounted() {
        if (this.info.length) {
            this.ids = this.info.map(x => x.id)
        }
        this.$nextTick(() => {
            let reasonInput: any = this.$refs.trace_memo
            reasonInput.focus()
        })
    }

    private change_checked(row, e) {
        if (e) {
            if (!this.ids.includes(row.id)) {
                this.ids.push(row.id)
            }
        } else {
            if (this.ids.includes(row.id)) {
                for (let i in this.ids) {
                    if (this.ids[i] == row.id) {
                        this.ids.splice(i, 1)
                    }
                }
            }
        }
    }

    private onSubmit() {
        if (!this.trace_memo) {
            this.$message.error('跟踪备注不能为空!')
            let reasonInput: any = this.$refs.trace_memo
            reasonInput.focus()
            return
        }
        this.innerAction.setActionAPI(
            'purchase_order_plan/multi_edit_info',
            CommonService.getMenuCode('purchase-product-plan')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        id_list: this.ids,
                        data: { memo: this.trace_memo }
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
            "purchase_detail":"Requiremnet Lines",
            "contact_no":"Contact No.",
            "trace_memo":"Track Memo",
            "name":"Name",
            "quantity":"Quantity",
            "order_date":"Finish QTY",
            "give_date":"Is Finish",
            "warehouse_id":"Cn Category",
            "id":"Line ID",
            "select_col":"Select"
      },
      "submit":"Submit",
      "cancel":"Cancel"
  },
  "zh-cn":{
       "columns":{    
            "purchase_detail":"采购明细",
            "contact_no":"合同号",
            "trace_memo":"跟踪备注",
            "name":"物品",
            "quantity":"数量",
            "order_date":"下单日期",
            "give_date":"合同交期",
            "warehouse_id":"仓库",
            "id":"Line ID",
            "select_col":"选择"
      },
      "submit":"提交",
      "cancel":"取消"
  }
}
</i18n>
