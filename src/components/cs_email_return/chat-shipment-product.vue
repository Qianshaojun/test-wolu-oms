<template>
    <section class="component">
        <a-form class="data-form" :form="form">
            <a-form-item>
                <a-textarea :rows="4" v-model="shipment_product" />
            </a-form-item>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('action.cancel')
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
export default class ShipmentProduct extends Vue {
    @Emit('modal.submit')
    private submit() {}

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private shipment_product

    private form: any

    private created() {}
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
