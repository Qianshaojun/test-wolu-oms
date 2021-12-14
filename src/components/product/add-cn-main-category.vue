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
                <a-col :span="20">
                    <a-form-item :label="$t('columns.cn_category')" required>
                        <a-input
                            v-decorator="[
                                'cn_main_category',
                                {
                                    initialValue: cn_main_category
                                },
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel"
                >{{ $t('action.cancel') }}
            </a-button>
            <a-button type="primary" @click="onSubmit"
                >{{ $t('action.submit') }}
            </a-button>
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
export default class AddCnMainCategory extends Vue {
    @Emit('modal.submit')
    private submit(params) {
        return params
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private cn_main_category

    private form: any

    private loadingService = new LoadingService()

    private productService = new ProductService()

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public created() {
        this.form = this.$form.createForm(this)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                this.submit(values)
            }
        })
    }
}
</script>
<i18n>
{
    "en-us": {
        "desc": "",
        "columns": {
            "cn_category": "Category"
        },
        "action": {
            "edit": "Edit",
            "cancel": "Cancel",
            "more": "More"
        },
        "rules": {
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "please_choose": "Please Choose"
    },
    "zh-cn": {
        "desc": "",
        "columns": {
            "cn_category": "一级分类"
        },
        "action": {
            "edit": "编辑",
            "cancel": "取消",
            "more": "更多操作"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "please_choose": "请选择"
    }
}
</i18n>