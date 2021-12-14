<template>
    <div class="editable-cell">
        <div v-if="editable" class="editable-cell-input-wrapper">
            <a-input :value="value" @blur="handleChange" />
        </div>
        <div v-else class="editable-cell-text-wrapper">
            {{ value || ' ' }}
        </div>
    </div>
</template>
<style>
.editable-cell-input-wrapper input:focus {
    background: #fec67a87;
}
</style>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import appConfig from '@/config/app.config'
@Component({
    components: {}
})
export default class TextEditCell extends Vue {
    @Prop()
    private editable: any

    @Prop()
    private text: any

    private value: any

    private created() {
        this.value = this.text
    }

    private handleChange(e) {
        const value = e.target.value
        this.value = value
        this.$emit('change', this.value)
    }
}
</script>
