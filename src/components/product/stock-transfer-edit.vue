<template>
    <section class="component stock-transfer-edit">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 12, offset: 2 }"
        >
            <a-row :gutter="24">
                <a-col :span="20">
                    <a-form-item :label="$t('columns.sku')" required>
                        <a-auto-complete
                            :dataSource="skuSource"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '300px' }"
                            v-model="product.name"
                            @search="onSkuSearch"
                            size="small"
                            style="width: 190px;"
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
                <a-col :span="20">
                    <a-form-item :label="$t('columns.warehouse_id')" required>
                        <a-select
                            v-decorator="[
                                'warehouse_id',
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
                                :value="item.code"
                                v-for="item of warehouseList"
                                :key="item.code"
                            >
                                {{ $t(item.name) }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.src_dept_id')" required>
                        <a-select
                            v-decorator="[
                                'src_dept_id',
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
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.dest_dept_id')" required>
                        <a-select
                            v-decorator="[
                                'dest_dept_id',
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
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.qty')" required>
                        <a-input-number
                            v-decorator="[
                                `qty`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            decimalSeparator=","
                            :min="1"
                            :style="{ width: '190px' }"
                            placeholder=""
                            size="small"
                        />
                    </a-form-item>
                </a-col>
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
.required .ant-select-selection {
    background-color: #ecc5e9;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { ProductService } from '../../services/product.service'
import { RequestParams } from '@/core/http'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { CommonService } from '@/shared/utils/common.service'
import { namespace } from 'vuex-class'
import UUID from 'uuidjs'
import { formConfig } from '@/config/form.config'
import SearchProduct from '../product/search-product.vue'

const datasModule = namespace('datasModule')

@Component({
    components: {}
})
export default class StockTransferEdit extends Vue {
    @Emit('modal.submit')
    private submit(values) {
        return values
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    private form: any

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    @Prop({ default: 0 })
    saveFlag: any

    @Prop()
    curData: any

    @Prop()
    departmentList: any

    @Prop()
    warehouseList: any

    private skuSource: any[] = []
    private skuQueryResult: any[] = []
    private product: any = {}

    private loadingService = new LoadingService()
    private productService = new ProductService()

    private created() {
        this.form = this.$form.createForm(this)
    }

    private mounted() {
        this.form.setFieldsValue(this.curData)
    }

    public setFormValues() {
        this.form.setFieldsValue(this.curData)
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

    private getDepartName(department) {
        let ret: any = department
        let item = this.departmentList.find(x => x.id == department)
        if (item) {
            ret = item.dept_name
        }
        return ret
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (values['dest_dept_id'] == values['src_dept_id']) {
                this.$message.info('来源部门与目标部门相同!!!')
                return
            }

            if (values['qty'] <= 0) {
                this.$message.info('转移数量必须大于0')
                return
            }

            if (!this.product['product_id']) {
                this.$message.info('请选择产品')
                return
            }

            if (!err) {
                values['save_flag'] = this.saveFlag
                values['sku'] = this.product['default_code']
                if (this.saveFlag) {
                    values['id'] = this.curData.id
                }
                this.submit(values)
            }
        })
    }

    private onRowChange(row, column, value) {
        if (
            Object.prototype.toString.call(value) === '[object InputEvent]' ||
            Object.prototype.toString.call(value) === '[object Event]' ||
            Object.prototype.toString.call(value) === '[object Object]'
        ) {
            if (value.target && value.target.value) {
                row[column] = value.target.value
            } else {
                row[column] = value
            }
        } else {
            row[column] = value
        }
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
  "en-us":{
    "columns":{
        "sku":"SKU",
        "warehouse_id":"Warehouse",
        "src_dept_id":"Source Department",
        "dest_dept_id":"Destion Department",
        "qty":"QTY"
    },
    "action": {
        "submit": "Submit",
        "cancel": "Cancel"
    }
  },
  "zh-cn":{
    "columns":{
        "sku":"货号",
        "warehouse_id":"仓库",
        "src_dept_id":"来源部门",
        "dest_dept_id":"目标部门",
        "qty":"数量"
    },
    "action": {
        "submit": "提交",
        "cancel": "取消"
    }
  }
}
</i18n>
