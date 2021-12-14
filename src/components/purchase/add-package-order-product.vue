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
                <a-col :span="12">
                    <a-form-item :label="$t('columns.product_id')" required>
                        <a-auto-complete
                            :dataSource="skuSource"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '350px' }"
                            v-model="product.name"
                            @search="onSkuSearch"
                            size="small"
                            style="width: 200px;"
                            placeholder="input for search"
                            @change="e => onProductChange(e)"
                        >
                            <template slot="dataSource">
                                <a-select-option
                                    v-for="opt in skuSource"
                                    :key="opt"
                                    :value="opt"
                                    :title="opt"
                                >
                                    {{ opt }}
                                </a-select-option>
                                <a-select-option
                                    key="all"
                                    disabled
                                    class="show-all"
                                >
                                    <a @click="searchMore(row)">
                                        Search More
                                    </a>
                                </a-select-option>
                            </template>
                        </a-auto-complete>
                    </a-form-item>
                </a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.product_qty')" required
                        ><a-input-number
                            v-decorator="[
                                `product_qty`,
                                { rules: rules.required }
                            ]"
                            size="small"
                            :min="0"
                            :style="{
                                width: '200px',
                                background: '#ecc5e9'
                            }"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.package_qty')" required
                        ><a-input-number
                            v-decorator="[
                                `package_qty`,
                                { rules: rules.required }
                            ]"
                            size="small"
                            :min="0"
                            :style="{
                                width: '200px',
                                background: '#ecc5e9'
                            }"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.box_qty')"
                        ><a-input-number
                            v-decorator="[`box_qty`]"
                            size="small"
                            :min="0"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.dept_id')"
                        ><a-select
                            v-decorator="[
                                'dept_id',
                                {
                                    initialValue: ''
                                },
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            style="width: 190px;"
                            :filterOption="filterSelectOption"
                        >
                            <a-select-option
                                :value="item.id"
                                v-for="item of departmentList"
                                :key="item.id"
                            >
                                {{ $t(item.dept_name) }}
                            </a-select-option>
                        </a-select></a-form-item
                    ></a-col
                >
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.order2_id')"
                        ><a-input
                            v-decorator="[`order2_id`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.pack_qty')"
                        ><a-input-number
                            v-decorator="[`pack_qty`]"
                            size="small"
                            :min="0"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.out_number')"
                        ><a-input
                            v-decorator="[`out_number`]"
                            size="small"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.width')"
                        ><a-input-number
                            v-decorator="[`width`]"
                            size="small"
                            :min="0"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.height')"
                        ><a-input-number
                            v-decorator="[`height`]"
                            size="small"
                            :min="0"
                            style="width: 200px;"/></a-form-item
                ></a-col>
                <a-col :span="12"
                    ><a-form-item :label="$t('columns.length')"
                        ><a-input-number
                            v-decorator="[`length`]"
                            size="small"
                            :min="0"
                            style="width: 200px;"/></a-form-item
                ></a-col>
            </a-row>
        </a-form>
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
.ant-select-auto-complete.ant-select-sm .ant-input,
.required .ant-calendar-picker-input,
.required .ant-select-selection--single {
    background-color: #ecc5e9;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import moment from 'moment'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { SystemService } from '../../services/system.service'
import { CommonService } from '@/shared/utils/common.service'
import { formConfig } from '@/config/form.config'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { ProductService } from '../../services/product.service'
import SearchProduct from '../product/search-product.vue'

@Component({
    components: {}
})
export default class AddPackageOrderProduct extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    package_id: any

    @Prop()
    departmentList: any

    private form: any

    private publicService = new PublicService()
    private innerAction = new InnerActionService()
    private loadingService = new LoadingService()
    private productService = new ProductService()

    private skuSource: any[] = []
    private skuQueryResult: any[] = []
    private product: any = {}

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private created() {
        this.form = this.$form.createForm(this)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!this.product || !this.product.product_id) {
                this.$message.info('请选择产品再添加')
                return
            }

            if (!values['dept_id']) {
                delete values['dept_id']
            }

            if (!err) {
                values['package_id'] = this.package_id
                values['product_id'] = this.product.product_id
                this.saveInfo(values)
            }
        })
    }

    private saveInfo(values) {
        this.innerAction.setActionAPI(
            'purchase_management/create_package_order_line',
            CommonService.getMenuCode('purchase-package-manage')
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

    private onSkuSearch(key) {
        let params: any = CommonService.createQueryCondition(
            { default_code: key },
            {
                default_code: 'like',
                ...formConfig.condition
            }
        )
        params['page_index'] = 1
        params['page_size'] = 10
        this.productService
            .queryAsyncProductInfo(
                new RequestParams(params, { loading: this.loadingService })
            )
            .subscribe(data => {
                this.skuSource = data.map(
                    x => '[' + x.default_code + ']' + x.name
                )
                this.skuQueryResult = data
            })
    }

    private searchMore() {
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
                this.product['name'] = '[' + data.default_code + ']' + data.name
                this.product['product_id'] = data.product_id
                this.product['default_code'] = data.default_code

                this.skuSource.push(this.product['name'])
                this.skuQueryResult.push(data)
            })
    }

    private onProductChange(e) {
        let item = this.skuQueryResult.find(
            x => '[' + x.default_code + ']' + x.name == e
        )
        if (item) {
            this.product['name'] = '[' + item.default_code + ']' + item.name
            this.product['product_id'] = item.product_id
            this.product['default_code'] = item.default_code
        } else {
            this.product['product_id'] = 0
        }
    }
}
</script>

<i18n>
{
  "en-us":{
      "submit": "Submit",
      "cancel": "Cancel",
      "columns": {
           "product_id":"Product Id",
            "product_qty":"Product Qty",
            "package_qty":"Package Qty",
            "box_qty":"Box Qty",
            "order2_id":"Final Purchase Order",
            "pack_qty":"Pack Qty",
            "out_number":"Out Number",
            "width":"Width",
            "length":"Length",
            "height":"Height",
            "dept_id":"Department"
    }
  },
  "zh-cn":{
       "submit": "提交",
       "cancel": "取消",
       "columns":{    
            "product_id":"产品",
            "product_qty":"产品数量",
            "package_qty":"实际数量",
            "box_qty":"实际箱数",
            "order2_id":"Final Purchase Order",
            "pack_qty":"装箱量",
            "out_number":"外箱合同号",
            "width":"宽度",
            "length":"长度",
            "height":"高度",
            "dept_id":"部门"
        }
  }
}
</i18n>
