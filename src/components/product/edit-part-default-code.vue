<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 17, offset: 1 }"
        >
            <a-row :gutter="24">
                <a-col :span="22">
                    <a-form-item label="修正后编号">
                        <a-auto-complete
                            :dataSource="prodList"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '300px' }"
                            :defaultValue="code"
                            :value="code"
                            style="width: 270px"
                            @change="e => onSelectChange(e)"
                            @search="e => onSearch(e)"
                            @select="e => test(e)"
                        >
                            <template slot="dataSource">
                                <a-select-option
                                    v-for="opt in prodList"
                                    :key="opt.default_code"
                                    :value="opt.default_code"
                                    :title="opt.default_code"
                                >
                                    {{ opt.default_code }}
                                </a-select-option>
                                <a-select-option
                                    key="all"
                                    disabled
                                    class="show-all"
                                >
                                    <a @click="searchMore(item)">
                                        Search More
                                    </a>
                                </a-select-option>
                            </template>
                        </a-auto-complete>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">取消</a-button>
            <a-button type="primary" @click="onSubmit">提交</a-button>
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { UserService } from '~/services/user.service'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import SearchProduct from './search-product.vue'
import { ProductService } from '../../services/product.service'
import { LoadingService } from '../../bootstrap/services/loading.service'

@Component({
    components: {}
})
export default class EditPartDefaultCode extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {}

    @Prop()
    private product_list

    @Prop()
    private row

    private code: any = ''

    private product_tmp_id: any = 0

    private changeFlag: any = false
    private selectFlag: any = false

    private prodList: any = []

    private productService = new ProductService()
    private loadingService = new LoadingService()

    private form: any

    public mounted() {
        if (this.row) {
            this.code = this.row.default_code
        }
        if (this.product_list) {
            this.prodList = this.product_list.map(x => x)
        }
    }

    public created() {
        this.form = this.$form.createForm(this)
    }

    public setFormValues() {
        this.form.setFieldsValue(this.code)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                this.save()
            }
        })
    }

    private save() {
        let param = {
            id: this.row.id,
            sku: this.code,
            product_tmp_id: this.product_tmp_id
        }
        if (this.changeFlag && !this.selectFlag) {
            delete param.product_tmp_id
        }

        this.productService
            .save_cs_tmp_product_part(
                new RequestParams(
                    { cs_tmp_list: [param] },
                    { loading: this.loadingService }
                )
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

    private searchMore(row) {
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
                _that.code = data.default_code
                _that.product_tmp_id = data.id
                _that.changeFlag = true
                _that.selectFlag = true
            })
    }

    private onSelectChange(e) {
        this.code = e
        let item = this.product_list.find(x => x.default_code == e)
        if (item) {
            this.product_tmp_id = item.id
        }
        this.changeFlag = true
        this.selectFlag = false
    }

    private onSearch(e) {
        this.prodList = this.product_list.filter(x =>
            x.default_code.toLowerCase().includes(e.toLowerCase())
        )
    }

    private test(e) {
        this.selectFlag = true
    }
}
</script>

<i18n>
{
  "en-us":{
      "columns":{
            "code":"WareHouse Code",
            "name":"Customer Info"
      }
  },
  "zh-cn":{
       "columns":{    
           "code":"仓库编码",
           "name":"仓库名称"
      }
  }
}
</i18n>
