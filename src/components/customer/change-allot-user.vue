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
                    <a-form-item label="客服" required>
                        <a-select
                            v-decorator="[
                                'user_id',
                                {
                                    rules: rules.required
                                }
                            ]"
                            placeholder="PLZ Select"
                            showSearch
                            :filterOption="filterSelectOption"
                        >
                            <a-select-option
                                :key="item.code"
                                :value="item.code"
                                v-for="item of serverList"
                                >{{ item.name }}</a-select-option
                            >
                        </a-select>
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
import { HelpdeskService } from '../../services/helpdesk.service'
import { LoadingService } from '../../bootstrap/services/loading.service'

@Component({
    components: {}
})
export default class ChangeAllotUser extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {}

    @Prop()
    private idList

    @Prop()
    private serverList

    private form: any

    private helpdeskService = new HelpdeskService()

    private loadingService = new LoadingService()

    private created() {
        this.form = this.$form.createForm(this)
    }

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                this.save(values)
            }
        })
    }

    private save(params) {
        this.helpdeskService
            .change_allot_user(
                new RequestParams(
                    {
                        allot_user_id_list: this.idList,
                        user_id: params.user_id
                    },
                    { loading: this.loadingService }
                )
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
