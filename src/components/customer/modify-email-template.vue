<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form2"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 17, offset: 1 }"
        >
            <a-row :gutter="24">
                <a-col :span="11">
                    <a-form-item :label="$t('columns.name')" required>
                        <a-input v-decorator="[`name`]" size="small" />
                    </a-form-item>
                    <a-form-item :label="$t('columns.seller_code')">
                        <a-select
                            showSearch
                            v-decorator="['seller_code']"
                            :style="{ width: '200px' }"
                            size="small"
                            :filterOption="filterSelectOption"
                            :placeholder="$t('selectSeller')"
                        >
                            <a-select-option
                                :value="item.code"
                                v-for="item of sellerCodeList"
                                :key="item.code"
                                >{{ $t(item.name) }}</a-select-option
                            >
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item :label="$t('columns.lang_code')">
                        <a-select
                            showSearch
                            v-decorator="['lang_code']"
                            :style="{ width: '200px' }"
                            size="small"
                            :placeholder="$t('selectInstance')"
                        >
                        <a-select-option key="uk" value="uk"
                            >uk</a-select-option
                        >
                        <a-select-option key="fr" value="fr"
                            >fr</a-select-option
                        >
                        <a-select-option key="de" value="de"
                            >de</a-select-option
                        >
                        <a-select-option key="es" value="es"
                            >es</a-select-option
                        >
                        <a-select-option key="nl" value="nl"
                            >nl</a-select-option
                        >
                        <a-select-option key="it" value="it"
                            >it</a-select-option
                        >
                        <a-select-option key="pl" value="pl"
                            >pl</a-select-option
                        >
                        </a-select>
                    </a-form-item>
                    <a-form-item
                        :label="$t('columns.active')"
                        style="height:35px;margin:0;"
                    >
                        <a-radio-group
                            v-decorator="['active', { initialValue: true }]"
                            size="small"
                            :style="{ height: '20px' }"
                            buttonStyle="solid"
                        >
                            <a-radio-button :value="true">
                                是
                            </a-radio-button>
                            <a-radio-button :value="false">
                                否
                            </a-radio-button>
                        </a-radio-group>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>

        <quill-editor
            v-model="content"
            :options="editorOption"
            style="height:200px;margin:20px 0;display:inherit;"
        >
        </quill-editor>

        <div class="flex-row justify-content-end" style="margin-top:100px">
            <a-button class="margin-right" @click="cancel">
                {{ $t('action.cancel') }}
            </a-button>
            <a-button type="primary" @click="onSubmit">
                {{ $t('action.submit') }}
            </a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import DataForm from '~/shared/components/data-form.vue'
import { namespace } from 'vuex-class'
import { set } from 'vue/types/umd'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { CommonService } from '@/shared/utils/common.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { quillEditor } from 'vue-quill-editor'

const datasModule = namespace('datasModule')

// interface orderDetail []

@Component({
    components: {
        quillEditor
    }
})
export default class ModifyEmailTemplate extends Vue {
    @Emit('modal.submit')
    private submit(values) {
        return values
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private origin_data

    @Prop()
    private save_flag

    @Prop()
    private sellerCodeList

    private editorOption = {
        placeholder: '输入任何内容，支持html'
    }

    private data: any[] = []
    private publicService = new PublicService()
    private innerAction = new InnerActionService()
    private loadingService = new LoadingService()

    private form2: any

    private rules = {
        companyName: [{ required: true, message: '必填' }]
    }

    private content: any = ''

    public mounted() {
        if (this.origin_data) {
            this.setFormValues()
            this.content = this.origin_data.body_html
        }
    }

    public setFormValues() {
        this.form2.setFieldsValue(this.origin_data)
    }

    public created() {
        this.form2 = this.$form.createForm(this)
    }

    private onSubmit() {
        this.form2.validateFields({}, (err, values) => {
            if (!err) {
                if (this.save_flag == 1) {
                    values['id'] = this.origin_data.id
                }
                values['save_flag'] = this.save_flag
                values['body_html'] = this.content
                this.modifyTemplate(values)
            }
        })
    }

    private modifyTemplate(data) {
        this.innerAction.setActionAPI(
            '/email/modify_mail_template',
            CommonService.getMenuCode('email-template-manage')
        )
        this.publicService
            .modify(
                new RequestParams(data, {
                    loading: this.loadingService,
                    innerAction: this.innerAction
                })
            )
            .subscribe(
                data => {
                    this.submit(true)
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
        "selectSeller": "Select a Seller",
        "selectInstance": "Select a Lang",
        "columns": {
            "name": "Template Name",
            "seller_code": "Seller",
            "lang_code": "Lang",
            "active": "Active"
        },
        "action": {
            "submit": "Submit",
            "cancel": "Cancel"
        }
    },
    "zh-cn": {
        "selectSeller": "选择店铺",
        "selectInstance": "选择语种",
        "columns": {
            "name": "模板名称",
            "seller_code": "店铺",
            "lang_code": "语种",
            "active": "启用"
        },
        "action": {
            "submit": "提交",
            "cancel": "取消"
        }
    }
}
</i18n>
