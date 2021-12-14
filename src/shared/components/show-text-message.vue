<template>
    <section class="component edit-customer">
        <a-card>
            <label> {{ text }}</label>
        </a-card>
        <div class="flex-row justify-content-end margin-top">
            <a-button
                class="margin-right"
                @click="cancel"
                style="margin-top: 20px;"
            >
                {{ $t('close') }}
            </a-button>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'

@Component({
    components: {}
})
export default class ShowTextMessage extends Vue {
    @Prop({ default: '', type: String })
    private text!: string

    @Emit('modal.cancel')
    private cancel() {
        return
    }
}
</script>
<i18n>
{
    "en-us":{
        "close":"Close"
    },
    "zh-cn":{
        "close":"关闭"
    }
}
</i18n>
