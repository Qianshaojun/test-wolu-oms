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
                    <a-form-item :label="$t('columns.company')" required>
                        <a-select
                            v-decorator="['company_code_id']"
                            :style="{ width: '200px' }"
                            size="small"
                            placeholder="Please select"
                        >
                            <a-select-option
                                v-for="company of companyList"
                                :key="company.id"
                                :value="company.id"
                            >
                                {{ company.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="30">
                    <a-form-item :label="$t('columns.category')" required>
                        <a-select
                            v-decorator="['category_id']"
                            :style="{ width: '200px' }"
                            size="small"
                            @change="handleCategoryChange"
                            placeholder="Please select"
                        >
                            <a-select-option
                                v-for="category of categoryList"
                                :key="category.id"
                                :value="category.id"
                            >
                                {{ category.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="30">
                    <a-form-item :label="$t('columns.color')">
                        <a-select
                            v-decorator="['color_id']"
                            :style="{ width: '200px' }"
                            size="small"
                            placeholder="Please select"
                        >
                            <a-select-option
                                v-for="color of colorList"
                                :key="color.id"
                                :value="color.id"
                            >
                                {{ color.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="30">
                    <a-form-item :label="$t('columns.size')">
                        <a-select
                            v-decorator="['size_id']"
                            :style="{ width: '200px' }"
                            size="small"
                            placeholder="Please select"
                        >
                            <a-select-option
                                v-for="size of sizeList"
                                :key="size.id"
                                :value="size.id"
                            >
                                {{ size.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="30">
                    <a-form-item :label="$t('columns.plural')">
                        <a-input-number v-decorator="['plural']" :min="0" />
                    </a-form-item>
                </a-col>
                <a-col :span="30">
                    <a-form-item :label="$t('columns.is_fba')">
                        <a-checkbox v-decorator="['is_fba']">
                            是否FBA
                        </a-checkbox>
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
import { GeneralCodeService } from '~/services/generate_code.service'

@Component({
    components: {}
})
export default class GenerateCodeEdit extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private companyList

    @Prop()
    private categoryList

    @Prop()
    private fullSizeList

    @Prop()
    private colorList

    private form: any

    private sizeList: any = []

    private loadingService = new LoadingService()

    private generalCodeService = new GeneralCodeService()

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public setFormValues() {
        this.form.setFieldsValue()
    }

    public created() {
        this.form = this.$form.createForm(this)
    }

    private mounted() {
        this.setFormValues()
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                this.saveInfo(values)
            }
        })
    }

    private saveInfo(data) {
        this.generalCodeService
            .createProductGenerateCode(
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

    private handleCategoryChange(value) {
        this.sizeList = this.fullSizeList.filter(
            item => item.category_id === value
        )
    }
}
</script>
<i18n>
{
  "en-us": {
    "desc": "",
    "columns":{
       "company":"Company",
       "category":"Category",    
       "actions":"Actions",
       "size":"Size",
       "color":"Color",
       "plural":"plural",
       "is_fba":"Is FBA"
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
       "company":"公司",
       "category":"品类",    
       "actions":"Actions",
       "size":"尺寸",
       "color":"颜色",
       "create_date":"创建时间",
       "plural":"复数",
       "is_fba":"是否FBA"
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
