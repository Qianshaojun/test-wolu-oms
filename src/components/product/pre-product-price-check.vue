<template>
    <section class="component order-detail">
        <div style="max-height:600px;overflow-y: scroll;margin-top:-15px;">
            <div style="text-align:right;">
                <a-button @click="onImportSku" type="default" size="small"
                    ><span>{{ $t('action.import') }}</span>
                </a-button>
                <a-button
                    type="primary"
                    @click="onAddSku()"
                    size="small"
                    style="margin-left:5px;"
                    >{{ $t('action.add') }}</a-button
                >
            </div>
            <a-tabs
                :defaultActiveKey="detail[0]['sku'] ? detail[0]['sku'] : ''"
                :v-model="activeKey"
                type="editable-card"
                hide-add
                @change="e => onPanelChange(e)"
                @edit="onEditPanel"
            >
                <a-tab-pane
                    v-for="item of info"
                    :tab="item['sku']"
                    :key="item['sku']"
                >
                    <PreProductPriceCheckItem
                        :detail="item"
                        @inputChange="onItemChange"
                    />
                </a-tab-pane>
            </a-tabs>
            <a-form
                class="data-form"
                layout="inline"
                :form="form"
                :labelCol="{ span: 8 }"
                :wrapperCol="{ span: 15, offset: 1 }"
            >
                <a-card style="margin-top:5px;">
                    <div style="margin-top:10px;font-weight:600;color:#222;">
                        <span style="color:#ff0000;">* </span>预调价备注
                    </div>
                    <a-row :gutter="24">
                        <a-col :span="8">
                            <a-form-item required>
                                <a-input
                                    v-decorator="[
                                        'memo',
                                        { rules: rules.required }
                                    ]"
                                    size="small"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-card>
                <a-card style="margin-top:5px;">
                    <div style="margin-top:10px;font-weight:600;color:#222;">
                        分档海运费
                    </div>
                    <a-row :gutter="24">
                        <a-col :span="4" v-for="item in seaFeeList" :key="item">
                            <a-form-item>
                                <a-input-number
                                    v-decorator="[
                                        item,
                                        {
                                            initialValue:
                                                item == 'sea-1' ? 2038.24 : ''
                                        }
                                    ]"
                                    size="small"
                                    :min="0"
                                    style="margin-top: 5px;"
                                />
                                <a-icon
                                    type="minus-circle"
                                    style="font-size: 12px;position: absolute;top: 0;right: -15px;cursor: pointer;"
                                    @click="delSeeBtn(item)"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="4">
                            <a-button
                                size="small"
                                @click="addSeaFeeInput"
                                style="margin-top: 5px;"
                                >+ 添加</a-button
                            >
                        </a-col>
                    </a-row>
                </a-card>
                <a-button
                    @click="onTestCalc"
                    type="primary"
                    size="small"
                    style="margin-top:10px;margin-left:800px;margin-bottom:20px;"
                    >{{ $t('action.test_calc') }}</a-button
                >
            </a-form>
            <div v-if="submitData.length">
                <PreProductPriceCheckView :detail="viewData" />
            </div>
        </div>

        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">取消</a-button>
            <a-button type="primary" @click="onSubmit">提交</a-button>
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'

import { OrderService } from '../../services/order.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { RequestParams } from '@/core/http'
import { TaxesService } from '../../services/taxes.service'
import { CommonService } from '@/shared/utils/common.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import PreProductPriceCheckItem from '~/components/product/pre-product-price-check-item.vue'
import PreProductPriceCheckView from '~/components/product/pre-product-price-check-view.vue'
import { Form } from 'ant-design-vue'
import SearchProduct from './search-product.vue'
import UploadSku from '~/components/product/upload-sku.vue'

@Component({
    components: {
        PreProductPriceCheckItem,
        PreProductPriceCheckView,
        UploadSku
    }
})
export default class PreProductPriceCheck extends Vue {
    @Emit('modal.submit')
    private submit(values) {
        return values
    }

    @Emit('modal.cancel')
    private cancel() {}

    @Prop({ default: Array })
    detail: any

    @Prop()
    private systemUsers

    private id: any = 0

    private info: any = []

    private submitData: any = []

    private viewData: any = []

    private activeKey: any = ''

    private activeSubKey: any = ''
    private subDefaultKey: any = ''
    private form: any

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private seaFeeList: any = ['sea-1', 'sea-2', 'sea-3', 'sea-4', 'sea-5']

    @Watch('detail')
    private onDetailChange() {
        // if (!this.detail.id || (this.detail.id && this.id != this.detail.id)) {
        if (this.detail.length) {
            this.activeKey = this.detail[0]['sku']
            this.info = JSON.parse(JSON.stringify(this.detail))
            this.form.setFieldsValue(this.info[0])
        } else {
            this.info = []
        }
    }

    private created() {
        this.form = this.$form.createForm(this)
    }

    private mounted() {
        if (this.detail.length) {
            this.activeKey = this.detail[0]['sku']
            this.info = JSON.parse(JSON.stringify(this.detail))
            this.form.setFieldsValue(this.info[0])
        }
    }

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private onPanelChange(e) {
        this.activeKey = e
        let item = this.info.find(x => x.sku === e)
        if (item) {
            this.form.setFieldsValue(item)
            this.viewData = this.submitData.filter(
                z => z.sku === this.activeKey
            )
        }
    }

    private onSubPanelChange(e) {
        this.activeSubKey = e
    }

    private onImportSku() {
        this.$modal
            .open(
                UploadSku,
                {
                    attachmentUrlPath:
                        '/system/download_import_template?type=PreProductPriceCheck'
                },
                {
                    title: '导入SKU',
                    width: '1000px'
                }
            )
            .subscribe(data => {
                let sku: any = []
                for (let i of data) {
                    if (
                        i['产品SKU'] !== undefined &&
                        this.info.find(x => x.sku !== i['产品SKU'])
                    ) {
                        let importParam = {
                            sku: i['产品SKU'],
                            refund_tax: i['出口退税率']
                                ? parseInt(i['出口退税率'])
                                : 0,
                            size1: i['包装尺寸1']
                                ? parseInt(i['包装尺寸1'])
                                : 0,
                            size2: i['包装尺寸2']
                                ? parseInt(i['包装尺寸2'])
                                : 0,
                            size3: i['包装尺寸3']
                                ? parseInt(i['包装尺寸3'])
                                : 0,
                            package_size1: i['分摊尺寸1']
                                ? parseInt(i['分摊尺寸1'])
                                : 0,
                            package_size2: i['分摊尺寸2']
                                ? parseInt(i['分摊尺寸2'])
                                : 0,
                            package_size3: i['分摊尺寸3']
                                ? parseInt(i['分摊尺寸3'])
                                : 0,
                            money_type: i['币种'],
                            custom_tax: i['德国关税']
                                ? parseInt(i['德国关税'])
                                : 0,
                            weight: i['毛重'] ? parseInt(i['毛重']) : 0,
                            uk_custom_tax: i['英国关税']
                                ? parseInt(i['英国关税'])
                                : 0,
                            purchase_price: i['采购价']
                                ? parseInt(i['采购价'])
                                : 0,
                            price_type: i['采购价类型']
                                ? i['采购价类型'] == '取核价'
                                    ? 'compute'
                                    : 'purchase'
                                : ''
                        }

                        this.info.push(importParam)
                        sku.push(i['产品SKU'])
                    }
                }
                this.innerAction.setActionAPI(
                    'product_management/query_product_price_check_for_try_calculate',
                    CommonService.getMenuCode('product_price_check')
                )
                this.publicService
                    .query(
                        new RequestParams(
                            { sku_list: sku },
                            {
                                loading: this.loadingService,
                                innerAction: this.innerAction
                            }
                        )
                    )
                    .subscribe(
                        data => {
                            if (data.length) {
                                for (let i of data) {
                                    let item = this.info.find(
                                        x => x.sku === i.sku
                                    )
                                    if (item) {
                                        item['id'] = i.id
                                        for (let it in item) {
                                            if (
                                                (item[it] === '' ||
                                                    item[it] === 0 ||
                                                    item[it] === null) &&
                                                i[it] !== undefined &&
                                                i[it]
                                            ) {
                                                item[it] = i[it]
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
    }

    private onItemChange(param) {
        let item = this.info.find(x => x.sku === param.sku)
        if (item) {
            for (let i in item) {
                item[i] = param[i]
            }
        }
    }

    private onAddSku() {
        let _that = this
        this.$modal
            .open(
                SearchProduct,
                {},
                {
                    title: '搜索产品',
                    width: '60%'
                }
            )
            .subscribe(data => {
                //sku不能重复
                if (this.info.find(x => x.sku === data.default_code)) {
                    this.$message.error('SKU 已存在')
                    return
                }
                this.innerAction.setActionAPI(
                    'product_management/query_product_price_check_for_try_calculate',
                    CommonService.getMenuCode('product_price_check')
                )
                this.publicService
                    .query(
                        new RequestParams(
                            { sku_list: [data.default_code] },
                            {
                                loading: this.loadingService,
                                innerAction: this.innerAction
                            }
                        )
                    )
                    .subscribe(
                        data => {
                            if (data.length) {
                                for (let i of data) {
                                    this.info.push(i)
                                }
                            }
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
    }

    private addSeaFeeInput(e) {
        let lth = this.seaFeeList.length + 1
        this.seaFeeList.push('sea-' + lth)
    }

    private onTestCalc() {
        this.submitData = []
        // this.form.validateFields({}, (err, values) => {
        //     if (!err) {
        let values = this.form.getFieldsValue()
        let sea_list: any = []
        for (let i in values) {
            if (
                i.indexOf('sea-') === 0 &&
                values[i] !== undefined &&
                values[i]
            ) {
                sea_list.push(values[i])
                delete values[i]
            }
        }
        if (!sea_list.length) {
            this.$message.error('请至少填写一个海运费')
            return
        }

        this.innerAction.setActionAPI(
            'product_management/try_calculate_product_price',
            CommonService.getMenuCode('product_price_check')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        product_list: this.info,
                        shipping_fee_list: sea_list
                        // approve_state: sku['approve_state']
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    for (let i in data) {
                        let item = this.info.find(x => x.sku === i)
                        if (item) {
                            for (let y in data[i]) {
                                for (let clm in data[i][y]) {
                                    let param: any = Object.assign({}, item)
                                    for (let j in data[i][y][clm]) {
                                        if (param[j] === undefined) {
                                            param[j] = data[i][y][clm][j]
                                        }
                                    }
                                    param['shipping_fee'] = parseInt(clm)
                                    param['memo'] = values['memo']

                                    this.submitData.push(param)
                                    this.viewData = this.submitData.filter(
                                        z => z.sku === this.activeKey
                                    )
                                }
                            }
                        }
                    }
                    this.$message.success('试算成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onSubmit() {
        if (!this.submitData.length) {
            this.$message.error('请先试算')
            return
        }

        this.form.validateFields({}, (err, values) => {
            if (!err) {
                for (let i of this.submitData) {
                    i.memo = values['memo']
                }

                this.innerAction.setActionAPI(
                    'product_management/save_pre_product_price_check',
                    CommonService.getMenuCode('product_price_check')
                )
                this.publicService
                    .modify(
                        new RequestParams(
                            {
                                product_list: this.submitData
                            },
                            {
                                loading: this.loadingService,
                                innerAction: this.innerAction
                            }
                        )
                    )
                    .subscribe(
                        data => {
                            this.$message.success('保存成功')
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
        })
    }

    private onEditPanel(targetKey, action) {
        if (action === 'remove' && this.info.length > 1) {
            this.info = this.info.filter(x => x.sku !== targetKey)
            this.activeKey = this.info[0].sku
        }
    }

    private delSeeBtn(item) {
        for (let i in this.seaFeeList) {
            if (this.seaFeeList[i] === item) {
                this.seaFeeList.splice(i, 1)
            }
        }
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
    "action":{
        "import":"Import",
        "add":"+ Add",
        "test_calc":"Test Calc"
    },
    "columns":{
        "custom_tax":"Custom Tax",
        "uk_custom_tax":"UK Custom Tax",
        "weight":"Weight",
        "size1":"Size1",
        "size2":"Size2",
        "size3":"Size3",
        "purchase_price":"Purchase Price"
    }
  },
  "zh-cn":{
    "base":"订单详情",
    "customerProblem":"客户问题",
    "pickingList":"拣货列表",
    "invoices":"发票",
    "operateLogs":"操作日志",
    "action":{
        "import":"导入SKU",
        "add":"+ 添加SKU",
        "test_calc":"试算"
    },
    "columns":{
        "custom_tax":"德国关税",
        "uk_custom_tax":"英国关税",
        "weight":"毛重",
        "size1":"包装尺寸1",
        "size2":"包装尺寸2",
        "size3":"包装尺寸3",
        "purchase_price":"采购价"
    }
  }
}
</i18n>
