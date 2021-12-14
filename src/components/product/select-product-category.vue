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
                    <a-form-item :label="$t('columns.category')" required>
                        <a-select
                            showSearch
                            v-decorator="['category_id']"
                            :style="{ width: '200px' }"
                            size="small"
                            placeholder="Please select"
                            :filterOption="filterSelectOption"
                        >
                            <a-select-option
                                v-for="cate of categoryList"
                                :key="cate.id"
                                :value="cate.id"
                            >
                                {{ cate.name }}
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
import { GeneralCodeService } from '~/services/generate_code.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { PublicService } from '@/services/public.service'
import { CommonService } from '@/shared/utils/common.service'

@Component({
    components: {}
})
export default class SelectProductCategory extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private idList

    private categoryList: any = []

    private form: any

    private loadingService = new LoadingService()

    private innerAction = new InnerActionService()
    private publicService = new PublicService()

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public setFormValues() {
        this.form.setFieldsValue()
    }

    public created() {
        this.getCategoryList()
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

    private getCategoryList() {
        this.innerAction.setActionAPI(
            'product_management/query_category_for_sku_dropdownlist',
            CommonService.getMenuCode('product-search')
        )
        this.publicService
            .query(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.categoryList = data.map(x => {
                        return {
                            id: Object.keys(x)[0],
                            name: x[Object.keys(x)[0]]
                        }
                    })
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private saveInfo(params) {
        this.innerAction.setActionAPI(
            'product_management/update_product_category',
            CommonService.getMenuCode('product-search')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        id_list: this.idList,
                        category_id: parseInt(params.category_id)
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
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
