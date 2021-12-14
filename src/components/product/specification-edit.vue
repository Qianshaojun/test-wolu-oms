<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 18, offset: 1 }"
        >
            <a-row :gutter="24">
                <a-col :span="30">
                    <a-form-item :label="$t('columns.specification_code')">
                        <a-input
                            v-decorator="[
                                'specification_code',
                                {
                                    initialValue: row.specification_code
                                }
                            ]"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="30">
                    <a-form-item :label="$t('columns.specification_url')">
                        <a-input
                            v-decorator="[
                                'specification_url',
                                {
                                    initialValue: row.specification_url
                                }
                            ]"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="30">
                    <a-form-item label="SKU" required>
                        <a-input
                            v-decorator="[
                                'sku',
                                {
                                    initialValue: row.sku
                                },
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="30">
                    <a-form-item
                        :label="$t('columns.specification_version')"
                        required
                    >
                        <a-select
                            v-decorator="['specification_version']"
                            :style="{ width: '200px' }"
                            size="small"
                            placeholder="Please select"
                        >
                            <a-select-option
                                v-for="version of versionList"
                                :key="version"
                                :value="version"
                            >
                                {{ version }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="30">
                    <a-form-item :label="$t('columns.z_sub_category')">
                        <a-select
                            v-decorator="['cn_category']"
                            style="width: 120px"
                            @change="handleFatherCateChange"
                            placeholder="品类"
                            size="small"
                            :disabled="true"
                        >
                            <a-select-option
                                v-for="cate in fatherCates"
                                :key="cate"
                            >
                                {{ cate }}
                            </a-select-option>
                        </a-select>
                        <a-select
                            v-decorator="['cn_sub_category']"
                            style="width: 60%;margin-left:25px"
                            placeholder="子类"
                            size="small"
                            :disabled="true"
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
            </a-row>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('action.cancel')
            }}</a-button>
            <a-button type="primary" @click="onSubmit">{{
                $t('action.submit')
            }}</a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { ProductService } from '../../services/product.service'

@Component({
    components: {}
})
export default class SpecificationEdit extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private row

    @Prop()
    private versionList

    @Prop()
    private fatherCates

    @Prop()
    private cateDict

    private form: any

    private sonCates: any = []

    private loadingService = new LoadingService()

    private productService = new ProductService()

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public setFormValues() {
        this.form.setFieldsValue(this.row)
    }

    public created() {
        this.form = this.$form.createForm(this)
    }

    private mounted() {
        this.handleFatherCateChange(this.row.cn_category)
        this.setFormValues()
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['save_flag'] = 1
                values['id'] = this.row.id
                this.saveInfo(values)
            }
        })
    }

    private saveInfo(data) {
        this.productService
            .save_prod_specification_info(
                new RequestParams(data, { loading: this.loadingService })
            )
            .subscribe(
                () => {
                    this.submit()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }
}
</script>
<i18n>
{
  "en-us": {
    "desc": "",
    "columns":{
       "specification_code":"Specification Code",
       "specification_version":"Specification Version",
       "specification_url":"Specification Url",
       "actions":"Actions",
       "view":"View",
       "doc_code":"Document Code",
       "cn_category":"Category",
       "cn_sub_category":"Sub Category"
    },
    "action":{
        "edit":"Edit",
        "cancel":"Cancel",
        "more":"More"
    },
    "rules":{

    },
    "delete":"Are you sure delete?",
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Delete Success",
    "please_choose":"Please Choose"
  },
  "zh-cn": {
    "desc": "",
    "columns":{
        "specification_code":"工艺单编号",
       "specification_version":"工艺单版本",
       "specification_url":"工艺单地址",
       "actions":"操作",
       "view":"查看",
       "doc_code":"文案编码",
       "cn_category":"分类",
       "cn_sub_category":"子类"
    },
    "action":{
      "edit":"编辑",
      "cancel":"取消",
      "more":"更多操作"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "delete":"是否确认删除?",
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "delete_success":"删除成功",
    "please_choose":"请选择"

  }
}
</i18n>
