<template>
    <section class="component">
        <a-form-model layout="inline">
            <a-form-model-item
                :label="$t('Customer Email')"
                :style="{ width: '100%' }"
                :labelCol="{ span: 3 }"
                :wrapperCol="{ span: 10, offset: 1 }"
            >
                <a-input
                    :placeholder="$t('plzInput')"
                    v-model="customer_email"
                />
            </a-form-model-item>
            <a-form-model-item
                :label="$t('Sale Order')"
                :style="{ width: '100%' }"
                :labelCol="{ span: 3 }"
                :wrapperCol="{ span: 10, offset: 1 }"
            >
                <a-input :placeholder="$t('plzInput')" v-model="order_number" />
            </a-form-model-item>
            <a-form-model-item
                :label="$t('recv datetime')"
                :style="{ width: '100%' }"
                :labelCol="{ span: 3 }"
                :wrapperCol="{ span: 16, offset: 1 }"
            >
                <a-date-picker
                    v-model="startValue"
                    :disabled-date="disabledStartDate"
                    show-time
                    :placeholder="$t('plzSelect')"
                    format="YYYY-MM-DD HH:mm:ss"
                    @openChange="handleStartOpenChange"
                />
                <a-date-picker
                    v-model="endValue"
                    :disabled-date="disabledEndDate"
                    show-time
                    :placeholder="$t('plzSelect')"
                    format="YYYY-MM-DD HH:mm:ss"
                    style="margin-left:7px;"
                    :open="endOpen"
                    @openChange="handleEndOpenChange"
                />
            </a-form-model-item>
            <a-form-model-item
                :label="$t('partner_name')"
                :style="{ width: '100%' }"
                :labelCol="{ span: 3 }"
                :wrapperCol="{ span: 10, offset: 1 }"
            >
                <a-input :placeholder="$t('plzInput')" v-model="partner_name" />
            </a-form-model-item>
        </a-form-model>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel"
                >{{ $t('cancel') }}
            </a-button>
            <a-button type="primary" @click="submit"
                >{{ $t('search') }}
            </a-button>
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { RequestParams } from '~/core/http'
import moment from 'moment'

@Component({
    components: {}
})
export default class ChatHeaderFilter extends Vue {
    private queryCondition: any = []

    @Emit('modal.submit')
    private submit() {
        if (this.order_number !== '') {
            this.queryCondition.push({
                query_name: 'go_amazon_mails1',
                operate: '=',
                value: this.order_number.replace(/(^\s*)|(\s*$)/g, '')
            })
        }
        if (this.customer_email) {
            this.queryCondition.push({
                query_name: 'go_amazon_mails2',
                operate: '=',
                value: this.customer_email.replace(/(^\s*)|(\s*$)/g, '')
            })
        }
        if (this.startValue) {
            this.queryCondition.push({
                query_name: 'recv_datetime',
                operate: '>=',
                value: this.startValue.utc().format('YYYY-MM-DD HH:mm:ss')
            })
        }
        if (this.endValue) {
            this.queryCondition.push({
                query_name: 'recv_datetime',
                operate: '<=',
                value: this.endValue.utc().format('YYYY-MM-DD HH:mm:ss')
            })
        }
        if (this.partner_name !== '') {
            this.queryCondition.push({
                query_name: 'partner_name',
                operate: '=',
                value: this.partner_name
            })
        }
        return this.queryCondition
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    private order_number: any = ''
    private customer_email: any = ''
    private startValue: any = null
    private endValue: any = null
    private endOpen = false
    private partner_name: any = ''

    private disabledStartDate(startValue) {
        const endValue = this.endValue
        if (!startValue || !endValue) {
            return false
        }
        return startValue.valueOf() > endValue.valueOf()
    }

    private disabledEndDate(endValue) {
        const startValue = this.startValue
        if (!endValue || !startValue) {
            return false
        }
        return startValue.valueOf() >= endValue.valueOf()
    }

    private handleStartOpenChange(open) {
        if (!open) {
            this.endOpen = true
        }
    }

    private handleEndOpenChange(open) {
        this.endOpen = open
    }
}
</script>
<i18n>
{
    "en-us": {
        "Sale Order": "Sale Order",
        "Customer Email": "Customer Email",
        "recv datetime": "Recv Datetime",
        "cancel": "Cancel",
        "search": "Search",
        "partner_name": "Ebay BuyerID"
    },
    "zh-cn": {
        "Sale Order": "订  单  号",
        "Customer Email": "客户邮箱",
        "recv datetime": "收件时间",
        "cancel": "取消",
        "search": "搜索",
        "partner_name": "买  家  ID"
    }
}
</i18n>
