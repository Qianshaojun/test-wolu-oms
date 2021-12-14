<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 16, offset: 2 }"
        >
            <a-form-item :label="$t('columns.platform')" required>
                <a-select
                    v-decorator="[
                        `platform`,
                        {
                            rules: rules.required
                        },
                        {
                            initialValue: default_platform
                        }
                    ]"
                    style="width: 200px"
                    :placeholder="$t('columns.platform')"
                >
                    <a-select-option
                        v-for="d in $dict.SellerPlatform"
                        :key="d.value"
                        :value="d.value"
                        >{{ $t(d.label) }}</a-select-option
                    >
                </a-select>
            </a-form-item>
            <a-form-item :label="$t('columns.lang_id')" required>
                <a-select
                    showSearch
                    v-decorator="[
                        'lang_id',
                        { initialValue: default_lang_id },
                        {
                            rules: rules.required
                        }
                    ]"
                    size="small"
                >
                    <a-select-option
                        :value="item.code"
                        v-for="item of langList"
                        :key="item.code"
                    >
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="$t('columns.illegal_words')" required>
                <a-input
                    v-decorator="[
                        `illegal_words`,
                        {
                            rules: rules.required
                        }
                    ]"
                    size="small"
                />
            </a-form-item>
            <a-form-item :label="$t('columns.status')" required>
                <a-radio-group
                    v-decorator="['status', { initialValue: 20 }]"
                    size="small"
                    :style="{ height: '20px' }"
                    buttonStyle="solid"
                >
                    <a-radio-button
                        :value="item.value"
                        v-for="item of $dict.illegalWords"
                        :key="item.value"
                        >{{ $t(item.label) }}</a-radio-button
                    >
                </a-radio-group>
            </a-form-item>
            <a-form-item :label="$t('columns.memo')">
                <a-input v-decorator="[`memo`]" size="small" />
            </a-form-item>
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
import moment from 'moment'
import { MailService } from '~/services/mail.service'
// import { UserService } from '../../services/user.service'
import { LoadingService } from '../../bootstrap/services/loading.service'

@Component({
    components: {}
})
export default class IllegalWordsEdit extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private saveFlag

    @Prop()
    private langList

    @Prop()
    private row

    private form: any

    private default_platform: any = 20
    private default_lang_id: any = 1
    private default_status: any = false

    private mailService = new MailService()

    private loadingService = new LoadingService()

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public created() {
        this.form = this.$form.createForm(this)
    }

    public mounted() {
        if (this.row) {
            this.default_status = this.row.status
            this.default_lang_id = this.row.lang_id
            this.default_platform = this.row.platform

            this.setFormValues()
        }
    }

    public setFormValues() {
        this.form.setFieldsValue(this.row)
    }

    private saveIllegalWords(data) {
        this.mailService
            .saveIllegalWords(
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

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['save_flag'] = this.saveFlag
                if (this.row) {
                    values['id'] = this.row['id']
                }
                this.saveIllegalWords(values)
            }
        })
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
    "desc": "this is a Order Page1",
    "columns":{
       "lang_id":"Language",
       "illegal_words":"Illegal Words",
       "lang_id":"Language",
       "status":"Status",
       "memo":"Memo"
    },
    "action":{
      "cancel":"Cancel",
      "save":"Save"
    },
    "cancel":"Are you sure Cancel?",
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "cancel_success":"Cancel Success",
    "yes":"Yes",
    "no":"No"
  },
  "zh-cn": {
    "desc": "",
    "columns":{
       "illegal_words":"违禁词",
       "lang_id":"语言",
       "memo":"备注",
       "status":"状态",
       "memo":"备注"
    },
    "action":{
      "cancel":"取消",
      "save":"保存"
    },
    "cancel":"是否确认取消?",
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "cancel_success":"取消成功",
    "yes":"是",
    "no":"否"
  }
}
</i18n>
