<template>
    <section class="component order-base-detail">
        <a-row :gutter="24">
            <a-col :span="4">
                <span>毛利率：</span>
            </a-col>
            <a-col :span="5">
                <a-radio-group
                    :value="defaultProfitType"
                    button-style="solid"
                    @change="e => onPriceCalcChange(e)"
                    size="small"
                >
                    <a-radio-button value="multi">
                        多档
                    </a-radio-button>
                    <a-radio-button value="one">
                        固定
                    </a-radio-button>
                </a-radio-group>
            </a-col>
            <a-col :span="14" :offset="1">
                <a-row :gutter="4" v-if="defaultProfitType == 'one'">
                    <a-col :span="6">
                        <span>值/毛利率：</span>
                    </a-col>
                    <a-col :span="17">
                        <a-radio-group
                            :value="defaultValueType"
                            button-style="solid"
                            @change="e => onValueTypeChange(e)"
                            size="small"
                        >
                            <a-radio value="value">
                                固定值
                            </a-radio>
                            <a-radio value="profit">
                                固定毛利率
                            </a-radio>
                        </a-radio-group>
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
        <a-row :gutter="24">
            <a-col :span="4" v-if="defaultProfitType == 'one'">
                <!-- <span style="float:left;">毛利率：</span> -->
                <a-input-number
                    :value="defaultProfit"
                    :min="0"
                    @change="e => onProfitChange(e)"
                    size="small"
                />
            </a-col>
        </a-row>
        <a-form class="data-form" layout="inline" :form="form">
            <a-row
                :gutter="24"
                style="margin-top:30px;"
                v-if="defaultProfitType == 'multi'"
            >
                <a-col :span="4" v-for="item in profitList" :key="item">
                    <a-form-item>
                        <a-input-number
                            v-decorator="[item]"
                            size="small"
                            :min="0"
                            style="margin-top: 5px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="4">
                    <a-button
                        size="small"
                        @click="addProfitInput"
                        style="margin-top: 5px;"
                        >+ 添加</a-button
                    >
                </a-col>
            </a-row>
            <div
                style="margin-top:20px;padding-top:10px;width: 100%;border-top: 1px solid #ccc;"
            >
                多档海运费
            </div>
            <a-row :gutter="24">
                <a-col :span="4" v-for="item in seaFeeList" :key="item">
                    <a-form-item>
                        <a-input-number
                            v-decorator="[item]"
                            size="small"
                            :min="0"
                            style="margin-top: 5px;"
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
            <div
                style="margin-top:20px;padding:20px 0;width: 100%;border-top: 1px solid #ccc;"
            >
                是否试算FBA最低定价：

                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item>
                            <a-switch v-decorator="['is_fba']" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="导出最新采购价">
                            <a-switch v-decorator="['is_purchase_price']" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </div>
            <div
                style="margin-top:10px;padding-top:10px;width: 100%;border-top: 1px solid #ccc;"
            ></div>
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item label="DE产品状态">
                        <a-select
                            size="small"
                            v-decorator="[`de_sale_status`]"
                            style="width: 200px;"
                        >
                            <a-select-option
                                :value="item.value"
                                v-for="item of $dict.PriceCheckProdStatus"
                                :key="item.value"
                            >
                                {{ $t(item.label) }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="UK产品状态">
                        <a-select
                            size="small"
                            v-decorator="[`uk_sale_status`]"
                            style="width: 200px;"
                        >
                            <a-select-option
                                :value="item.value"
                                v-for="item of $dict.PriceCheckProdStatus"
                                :key="item.value"
                            >
                                {{ $t(item.label) }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="归档状态">
                        <a-select
                            size="small"
                            v-decorator="[`active`]"
                            style="width: 200px;"
                        >
                            <a-radio-button value>
                                {{ $t('dict.all') }}
                            </a-radio-button>
                            <a-radio-button :value="true">
                                未归档
                            </a-radio-button>
                            <a-radio-button :value="false">
                                已归档
                            </a-radio-button>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="运营">
                        <a-select
                            showSearch
                            size="small"
                            v-decorator="[`operator`]"
                            style="width: 200px;"
                            mode="multiple"
                            :filterOption="filterSelectOption"
                        >
                            <a-select-option
                                :value="item.code"
                                v-for="item of systemUsers"
                                :key="item.code"
                            >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="产品品类">
                        <a-select
                            v-decorator="['z_category']"
                            style="width: 110px"
                            @change="handleFatherCateChange"
                            size="small"
                            allowClear
                        >
                            <a-select-option
                                v-for="cate in fatherCates"
                                :key="cate"
                            >
                                {{ cate }}
                            </a-select-option>
                        </a-select>
                        <a-select
                            v-model="selectedList"
                            mode="multiple"
                            style="width: 220px;margin-left:25px"
                            size="small"
                        >
                            <a-select-option
                                v-for="cate in sonCates"
                                :key="cate"
                            >
                                {{ cate }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="SKU">
                        <a-textarea
                            size="small"
                            placeholder="多个sku以英文逗号隔开"
                            v-decorator="[`sku`]"
                            style="width: 400px;"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <div
            class="flex-row justify-content-end margin-top"
            style="margin-top:35px !important;"
        >
            <a-button type="default" @click="cancel">{{
                $t('cancel')
            }}</a-button>
            <a-button
                type="primary"
                @click="onSubmit"
                style="margin-left: 5px;"
                >{{ $t('export') }}</a-button
            >
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { PickingService } from '../../services/picking.service'
import { RequestParams } from '../../core/http'
import { Mutation, namespace } from 'vuex-class'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { Form } from 'ant-design-vue'
import moment from 'moment'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { CommonService } from '@/shared/utils/common.service'
import { formConfig } from '@/config/form.config'
import appConfig from '@/config/app.config'

const datasModule = namespace('datasModule')

@Component({
    components: {}
})
export default class TestCalc extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    private form: any

    @Prop()
    private info

    @Prop()
    private fatherCates

    @Prop()
    private sonCates

    @Prop()
    private cateDict

    @Prop()
    private departmentList

    @Prop()
    private systemUsers

    private data: any = {}

    private subDeptList: any = []

    @Watch('info')
    private onInfoChange() {
        this.data = Object.assign({}, this.info[0])
        this.defaultProfitType = this.data.is_dynamic_calculation
            ? 'multi'
            : 'one'
        this.setFormValues()
    }

    private mounted() {
        if (this.info) {
            this.data = Object.assign({}, this.info[0])
            this.defaultProfitType = this.data.is_dynamic_calculation
                ? 'multi'
                : 'one'
            this.setFormValues()
        }
    }

    private assign_to_user: any = ''

    private defaultProfitType: any = 'multi'

    private defaultValueType: any = 'value'

    private defaultProfit: any = 0

    private profitList: any = [
        'profit-1',
        'profit-2',
        'profit-3',
        'profit-4',
        'profit-5'
    ]
    private seaFeeList: any = ['sea-1', 'sea-2', 'sea-3', 'sea-4', 'sea-5']

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private selectedList: any = []

    private pickingService = new PickingService()
    private loadingService = new LoadingService()
    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    public created() {
        this.form = this.$form.createForm(this)
        this.getSubDepartmentList()
    }

    public setFormValues() {
        this.form.setFieldsValue(this.data)
    }

    private handleChange(value) {
        //console.log(value)
    }

    private onProfitChange(e) {
        this.defaultProfit = e
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                let gross_profit_list: any = []
                let shipping_fee_list: any = []
                let params: any = {}
                for (let i in values) {
                    if (
                        i.indexOf('profit-') === 0 &&
                        values[i] !== undefined &&
                        values[i]
                    ) {
                        gross_profit_list.push(values[i])
                        delete values[i]
                    }
                    if (
                        i.indexOf('sea-') === 0 &&
                        values[i] !== undefined &&
                        values[i]
                    ) {
                        shipping_fee_list.push(values[i])
                        delete values[i]
                    }
                }
                if (this.defaultProfitType === 'one') {
                    gross_profit_list = [this.defaultProfit]
                }

                if (
                    gross_profit_list.length == 0 ||
                    shipping_fee_list.length == 0
                ) {
                    this.$message.error('毛利率和海运费为必填项')
                    return
                }

                params['gross_profit_list'] = gross_profit_list
                params['shipping_fee_list'] = shipping_fee_list
                params['is_fba'] = values['is_fba']
                params['is_purchase_price'] = values['is_purchase_price']
                params['is_gross_margin'] =
                    this.defaultProfitType === 'multi' ||
                    (this.defaultProfitType === 'one' &&
                        this.defaultValueType == 'profit')
                delete values['is_fba']
                delete values['is_purchase_price']
                delete values['z_category']
                if (this.selectedList.length) {
                    values['z_sub_category'] = this.selectedList
                }

                delete values['prod_status']
                delete values['dept_id']

                values['sku'] = values['sku'] ? values['sku'].split(',') : []

                let querys: any = CommonService.createQueryCondition(values, {
                    active: '=',
                    z_sub_category: 'in',
                    operator: 'in',
                    sku: 'in',
                    ...formConfig.condition
                })

                params['query_condition'] = querys.query_condition

                this.submitData(params)
            }
        })
    }

    private onPriceCalcChange(e) {
        this.defaultProfitType = e.target.value
    }

    private onValueTypeChange(e) {
        this.defaultValueType = e.target.value
    }

    private addProfitInput(e) {
        let lth = this.profitList.length + 1
        this.profitList.push('profit-' + lth)
    }

    private addSeaFeeInput(e) {
        let lth = this.seaFeeList.length + 1
        this.seaFeeList.push('sea-' + lth)
    }

    private submitData(params) {
        let url =
            appConfig.server +
            '/system_api/download?inner_action=product_management/export_multi_profit_shipping_fee_calculate&menu_code=' +
            CommonService.getMenuCode('product_price_check') +
            '&json_data=' +
            encodeURIComponent(JSON.stringify(params))

        window.open(url, '_blank')
    }

    private calculation() {
        let params = {
            is_dynamic_calculation: true,
            product_id: this.data.product_template_logistic_id,
            instance: 'GB',
            warehouse: 'uk'
        }
        if (this.data.id) {
            params['id'] = this.data.id
        }
        this.submitData(params)
    }

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }

    private getSubDepartmentList() {
        this.subDeptList = this.departmentList.filter(x => x.dept_type == 30)
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }
}
</script>
<i18n>
{
    "en-us": {
        "columns":{
            "dynamic_price_calc": "Dynamic Price Calc",
            "multi": "Open",
            "close": "Close",
            "latest_calc_time": "Latest Calc Time",
            "start_end_time": "Start and End Time",
            "ratio_set": "Ratio Setting",
            "calculation": "Calculate"
        },
        "err_msg":"The sum Ratio mast be 100",
        "cancel":"Cancel",
        "export":"Export"
    },
    "zh-cn": {
        "columns":{
            "dynamic_price_calc":"动态价格计算",
            "multi": "开启",
            "close": "关闭",
            "latest_calc_time": "最新计算时间",
            "start_end_time": "起止时间",
            "ratio_set": "物流比例设置",
            "calculation": "计算"
        },
        "err_msg":"总比例数必须等于100",
        "cancel":"取消",
        "export":"导出"
    }
}
</i18n>
