<template>
    <page-container ref="pageContainer">
        <template #header-action>
            <a-button type="primary" @click="importOrders()">
                {{ $t('action.import_orders') }}
            </a-button>
            <a-button type="primary" @click="fulfilOrders()">
                {{ $t('action.fulfil_orders') }}
            </a-button>
        </template>
        <a-card class="margin-y" style="margin:0 !important">
            <section class="component edit-aliexpress">
                <a-form
                    :form="form"
                    :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 16, offset: 2 }"
                >
                    <a-card class="margin-top aliexpress-edit-page">
                        <a-row :gutter="24">
                            <a-col :span="12" required>
                                <a-form-item :label="$t('columns.seller_code')">
                                    <a-select
                                        showSearch
                                        v-decorator="[
                                            'seller_code',
                                            {
                                                rules: rules.required
                                            }
                                        ]"
                                        :style="{
                                            width: '100%',
                                            'max-width': '300px'
                                        }"
                                        size="small"
                                        :placeholder="$t('plzSelect')"
                                    >
                                        <a-select-option
                                            :value="item.code"
                                            v-for="item of sellerCodeList"
                                            :key="item.code"
                                        >
                                            {{ item.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.modified_date')"
                                >
                                    <a-range-picker
                                        v-decorator="[
                                            'modified_date',
                                            { initialValue: initialDate }
                                        ]"
                                        format="YYYY-MM-DD HH:mm"
                                        size="small"
                                    />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-card>
                </a-form>
            </section>
        </a-card>
    </page-container>
</template>

<style>
.aliexpress-edit-page .ant-form-item {
    margin-bottom: 0 !important;
}

.aliexpress-edit-page .ant-form-item .ant-form-item-control,
.aliexpress-edit-page .ant-form-item .ant-form-item-label {
    line-height: 2em !important;
}
</style>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Form } from 'ant-design-vue'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import OrderDetail from '~/components/orders/order-detail.vue'
import AddOrderDetail from '~/components/orders/add-order-detail.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import moment from 'moment'
import LogView from '~/shared/common/log-view.vue'
import { OrderService } from '../../services/order.service'
import { AliexpressService } from '../../services/aliexpress.service'
import { SellerInstanceService } from '../../services/seller-instance.service'
import ModifyAddress from '../picking/modify-address.vue'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'aliexpress-manage'
})
@Component({
    components: {
        LogView
    }
})
export default class AliexpressManage extends Vue {
    @Ref()
    readonly pageContainer!: PageContainer

    private form: any

    private moment = moment

    private initialDate: any = []

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    // Loading服务
    private orderService = new OrderService()

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private aliexpressService = new AliexpressService()

    private sellerInstanceService = new SellerInstanceService()
    // 表格数据源
    private order: any = []

    private orderDetail: any[] = []

    private sellerCodeList: any[] = []

    private instanceCodeList: any[] = []

    private partnerName: any = ''

    private save_flag: any = 0

    private defaultOrderType: any = ''

    private currentCustomerValue: any = ''

    private originData: any = []

    @datasModule.State
    private countryList

    @datasModule.Action
    private getcountry

    @datasModule.State
    private currencyList

    @datasModule.Action
    private getcurrency

    @datasModule.State
    private companyList

    @datasModule.Action
    private getcompany

    @pageParamsModule.State
    orderEditParams

    @Watch('orderEditParams')
    onOrderEditPatamsChange() {
        if (this.orderEditParams) {
            this.updateOrder(this.orderEditParams)
        }
    }

    private updateOrder(order) {
        this.originData = order
        this.$nextTick(() => {
            this.order = order[0]
            this.order.modified_date = moment(
                this.order.modified_date,
                'YYYY-MM-DD'
            )
            this.form.setFieldsValue(this.order)
        })
    }

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private created() {
        this.getSellerCodeList()
        this.form = this.$form.createForm(this)
    }

    private mounted() {
        if (this.$route.params.order) {
            this.updateOrder(this.$route.params.order)
        }
    }

    private getSellerCodeList() {
        this.sellerInstanceService
            .query_seller_name(new RequestParams({}))
            .subscribe(
                data => {
                    this.sellerCodeList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private onDetailListChange(data) {
        this.orderDetail = data
    }

    private importOrders() {
        this.form.validateFields().then((values: any) => {
            if (values['modified_date'].length != 2) {
                this.$message.error('导入订单必须要有订单日期！')
            }

            values['modified_date_start'] = new Date(
                values['modified_date'][0].utc().format('YYYY-MM-DD HH:mm:ss')
            )

            values['modified_date_end'] = new Date(
                values['modified_date'][1].utc().format('YYYY-MM-DD HH:mm:ss')
            )

            this.aliexpressService
                .importOrders(new RequestParams(values))
                .subscribe(
                    () => {
                        let msg: any = this.$t('tips.import_success')
                        this.$message.success(msg)
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private fulfilOrders() {
        this.form.validateFields().then((values: any) => {
            delete values.modified_date

            this.aliexpressService
                .fulfilOrders(new RequestParams(values))
                .subscribe(
                    () => {
                        let msg: any = this.$t('tips.fulfil_success')
                        this.$message.success(msg)
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }
}
</script>
<i18n>
{
    "en-us": {
        "columns": {
            "seller_code": "Seller Code",
            "modified_date": "Modified Date"
        },
        "action": {
            "import_orders": "Import Orders",
            "fulfil_orders": "Fulfil Orders"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "import_success": "Import Success",
        "fulfil_success": "Fulfil Success"
    },
    "zh-cn": {
        "columns": {
            "seller_code": "店铺",
            "modified_date": "订单起止日期"
        },
        "action": {
            "import_orders": "手动导入订单",
            "fulfil_orders": "速卖通手动结单"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "import_success": "导入订单成功",
        "fulfil_success": "速卖通结单成功"
    }
}
</i18n>
