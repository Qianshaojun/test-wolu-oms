<template>
    <section class="component">
        <a-form class="data-form" :form="form">
            <a-form-item :label="$t('name')">
                <a-input placeholder="Name" v-model="name" />
            </a-form-item>
            <a-form-item :label="$t('content')">
                <quill-editor
                    v-model="content"
                    :options="editorOption"
                    style="height:400px;margin-bottom:40px"
                >
                </quill-editor>
            </a-form-item>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('action.cancel')
            }}</a-button>
            <a-button type="primary" @click="submit">{{
                $t('action.save')
            }}</a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { quillEditor } from 'vue-quill-editor'

@Component({
    components: {
        quillEditor
    }
})
export default class ModifyTemplate extends Vue {
    @Emit('modal.submit')
    private submit() {
        let result = {
            name: this.name,
            content: this.content
        }
        return result
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private template
    private editorOption = {
        modules: {
            toolbar: [['clean', 'bold', 'italic', 'underline']]
        },

        placeholder: '输入任何内容，支持html'
    }
    private name: any = ''

    private content: any = ''

    private form: any

    private created() {
        if (this.template) {
            this.name = this.template.name
            this.content = this.template.body_html
        }
    }
}
</script>

<i18n>
{
  "en-us":{
    "name": "Template Name",
    "content": "Template Content",
    "action":{
        "save":"Save",
        "cancel":"Cancel"
    }
  },
  "zh-cn":{
    "name": "模板名称",
    "content": "模板内容",      
    "action":{
        "save":"保存",
        "cancel":"取消"
    }
  }
}
</i18n>
