<template>
    <section class="component customer-detail">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 16, offset: 1 }"
        >
            <a-row :gutter="24">
                <a-col :span="30">
                    <a-form-item :label="$t('columns.sub_category')" required>
                        <a-select
                            v-model="selectedList"
                            style="width: 80%;"
                            placeholder=""
                            size="small"
                            allowClear
                            :disabled="true"
                        >
                            <a-select-option
                                v-for="cate in subCates"
                                :key="cate.cn_sub_category"
                            >
                                {{ cate.cn_sub_category }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="30">
                    <a-form-item :label="$t('columns.sub_category_attr')">
                        <template v-for="(tag, index) in tags">
                            <a-tooltip
                                v-if="tag.length > 20"
                                :key="tag"
                                :title="tag"
                            >
                                <a-tag
                                    :key="tag"
                                    :closable="index !== 0"
                                    @close="() => handleClose(tag)"
                                >
                                    {{ `${tag.slice(0, 20)}...` }}
                                </a-tag>
                            </a-tooltip>
                            <a-tag
                                v-else
                                :key="tag"
                                :closable="index !== 0"
                                @close="() => handleClose(tag)"
                            >
                                {{ tag }}
                            </a-tag>
                        </template>
                        <a-input
                            v-if="inputVisible"
                            ref="input"
                            type="text"
                            size="small"
                            :style="{ width: '78px' }"
                            :value="inputValue"
                            @change="handleInputChange"
                            @blur="handleInputConfirm"
                            @keyup.enter="handleInputConfirm"
                        />
                        <a-tag
                            v-else
                            style="background: #fff; borderStyle: dashed;"
                            @click="showInput"
                        >
                            <a-icon type="plus" /> New Tag
                        </a-tag>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('action.cancel')
            }}</a-button>
            <a-button type="primary" @click="onSubmit">{{
                $t('action.commit')
            }}</a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { Page } from '~/core/decorators'
import { PageService } from '~/bootstrap/services/page.service'
import PageContainer from '../../shared/components/page-container.vue'
import { SystemService } from '~/services/system.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import UUID from 'uuidjs'
import { ProductService } from '../../services/product.service'
import { CommonService } from '@/shared/utils/common.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

@Component({
    components: {}
})
export default class ProductExtraAttrEdit extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {}

    @Prop()
    row: any

    @Prop()
    saveFlag: any

    private subCates: any = []
    private selectedList: any = ''

    private form: any
    private originRow: any = ''

    private tags: any = []
    private inputVisible: any = false
    private inputValue: any = ''

    private sonCates: any = []

    private productService = new ProductService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()
    private loadService = new LoadingService()

    public setFormValues() {
        this.form.setFieldsValue(this.originRow)
    }

    private index: any = 0
    // 表格数据源
    private ruleData: any[] = []

    public created() {
        this.getSubCates()
        this.form = this.$form.createForm(this)
    }

    private mounted() {
        var objString = JSON.stringify(this.row)
        this.originRow = JSON.parse(objString)
        this.selectedList = this.originRow.cn_sub_category
        if (this.saveFlag == 0) {
            delete this.originRow.id
            if (this.originRow.extra_attributes) {
                this.selectedList = ''
            }
        }
        if (this.originRow.extra_attributes) {
            this.tags = JSON.parse(
                this.originRow.extra_attributes.replace(/'/g, '"')
            )
        }
        this.setFormValues()
    }

    private addRule() {
        let ruleParam = {
            query_name: '',
            operate: '=',
            value: '',
            index: UUID.generate()
        }
        this.ruleData.push(ruleParam)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                // values['save_flag'] = this.saveFlag
                values['extra_attributes'] = this.tags
                values['cn_sub_category'] = this.selectedList
                values['cn_category'] = this.row.cn_category
                this.saveInfo(values)
            }
        })
    }

    private saveInfo(params) {
        params.extra_attributes = JSON.stringify(
            params.extra_attributes
        ).replace(/"/g, "'")
        // this.productService
        //     .save_sub_category_attributes(new RequestParams(params))
        //     .subscribe(
        //         () => {
        //             this.submit()
        //         },
        //         err => {
        //             this.$message.error(err.message)
        //         }
        //     )
        this.innerAction.setActionAPI(
            'category/save_category_extra_attributes',
            CommonService.getMenuCode('product-category-manage')
        )
        this.publicService
            .modify(
                new RequestParams(params, {
                    loading: this.loadService,
                    innerAction: this.innerAction
                })
            )
            .subscribe(data2 => {
                this.submit()
            })
    }

    private handleClose(removedTag) {
        const tags = this.tags.filter(tag => tag !== removedTag)
        this.tags = tags
    }

    private showInput() {
        this.inputVisible = true
        this.$nextTick(function() {
            let ipt: any = this.$refs.input
            ipt.focus()
        })
    }

    private handleInputChange(e) {
        this.inputValue = e.target.value
    }

    private handleInputConfirm() {
        const inputValue = this.inputValue
        let tags = this.tags
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue]
        }
        Object.assign(this, {
            tags,
            inputVisible: false,
            inputValue: ''
        })
    }

    private getSubCates() {
        this.productService
            .query_all_sub_category_attributes(
                new RequestParams({
                    page_index: 1,
                    page_size: 1000
                })
            )
            .subscribe(
                data => {
                    this.subCates = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }
}
</script>

<i18n>
{
  "en-us": {
    "desc": "",
    "columns":{
        "sub_category":"Sub Category",
        "sub_category_attr":"Attributes",
        "value":"Value"
    },
      "action":{
        "create":"Create",
        "edit":"Edit",
        "delete":"Delete",
        "ok":"Ok",
        "cancel":"Cancel",
        "commit":"Commit"
    }
  },
  "zh-cn": {
    "desc": "",
    "columns":{
        "sub_category":"子类",
        "sub_category_attr":"属性",
        "value":"值"
    },
    "action":{
      "create":"新建",
      "edit":"编辑查询条件",
      "delete":"删除",
      "ok":"确定",
      "cancel":"取消",
      "commit":"提交"
    }
  }
}
</i18n>
