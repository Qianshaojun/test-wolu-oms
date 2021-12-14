<template>
    <section class="component">
        <a-form class="data-form" :form="form">
            <a-form-item>
                <a-textarea placeholder="Memo" :rows="4" v-model="text" />
            </a-form-item>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('action.cancel')
            }}</a-button>
            <a-button type="primary" @click="onSubmit">{{
                $t('action.save')
            }}</a-button>
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
export default class ModifyMemo extends Vue {
    @Emit('modal.submit')
    private submit() {
        return this.text
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private memo

    private text: any = ''

    private form: any

    private created() {
        this.form = this.$form.createForm(this)
    }

    private onSubmit() {
        if (this.text) {
            this.submit()
        } else {
            this.$message.error('不能为空')
        }
    }

    private mounted() {
        if (this.memo) {
            this.text = this.memo
        }
    }
}
</script>

<i18n>
{
  "en-us":{
    "action":{
        "save":"Save",
        "cancel":"Cancel"
    }
  },
  "zh-cn":{
    "action":{
        "save":"保存",
        "cancel":"取消"
    }
  }
}
</i18n>
