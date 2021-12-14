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
                <a-col :span="20">
                    <a-form-item :label="$t('name')" required>
                        <a-input
                            v-decorator="[
                                `search_display_name`,
                                {
                                    rules: rules.namerequired
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('default_query')">
                        <a-switch
                            v-decorator="[`default_search`]"
                            :v-model="false"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('is_share')">
                        <a-switch v-decorator="[`is_share`]" :v-model="false" />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('sort')">
                        <a-input-number
                            v-decorator="[`sort_order`]"
                            decimalSeparator=","
                            :min="0"
                            :style="{ width: '100px' }"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('memo')">
                        <a-textarea v-decorator="[`memo`]"></a-textarea>
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
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'

@Component({
    components: {}
})
export default class SaveSearchForm extends Vue {
    @Emit('modal.submit')
    private submit(values) {
        return values
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private customer

    private form: any

    private rules = {
        namerequired: [{ required: true, message: this.$t('name_required') }]
    }

    public mounted() {
        if (this.customer) {
            this.setFormValues()
        }
    }

    public setFormValues() {
        this.form.setFieldsValue(this.customer)
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
  "en-us":{
        "name":"Query Name",
        "is_share":"Is Share",
        "default_query":"Default Query",
        "memo":"Memo",
        "sort":"Sort Order",
        "name_required":"Name Required"
  },
  "zh-cn":{
        "name":"查询名称",
        "is_share":"是否分享",
        "default_query":"默认查询",
        "memo":"备注",
        "sort":"排序",
        "name_required":"请输入查询名称"
  }
}
</i18n>
