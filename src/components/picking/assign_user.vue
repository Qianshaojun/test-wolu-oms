<template>
    <section class="component order-base-detail">
        <a-row :gutter="24">
            <a-col :span="4">
                <span>{{ $t('columns.Assign to User') }}</span>
            </a-col>
            <a-col :span="20">
                <a-select
                    showSearch
                    v-model="assign_to_user"
                    :style="{ width: '70%' }"
                    size="small"
                    placeholder="Select User"
                    :filterOption="filterSelectOption"
                >
                    <a-select-option value="" key="null">null</a-select-option>
                    <a-select-option
                        :value="item.code"
                        v-for="item of systemUsers"
                        :key="item.code"
                        >{{ item.name }}</a-select-option
                    >
                </a-select>
            </a-col>
        </a-row>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('action.cancel')
            }}</a-button>
            <a-button type="primary" @click="onSubmit">{{
                $t('action.submit')
            }}</a-button>
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { PickingService } from '../../services/picking.service'
import { RequestParams } from '../../core/http'
import { Mutation, namespace } from 'vuex-class'
import { LoadingService } from '../../bootstrap/services/loading.service'

const datasModule = namespace('datasModule')

@Component({
    components: {}
})
export default class AssignUser extends Vue {
    @Emit('modal.submit')
    private submit(data) {
        return data
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private systemUsers

    @Prop()
    private picking_id_list

    @Prop()
    private changeSpinning

    private assign_to_user: any = ''

    private pickingService = new PickingService()
    private loadingService = new LoadingService()

    private created() {}

    private handleChange(value) {
        //console.log(value)
    }

    private onSubmit() {
        const value: any = []
        if (this.assign_to_user == '') {
            this.assign_to_user = null
            // let err_msg: any = this.$t('err_msg')
            // this.$message.error(err_msg)
            // return
        }
        value['picking_id_list'] = this.picking_id_list
        value['assign_to_user'] = this.assign_to_user
        this.assignToUser(value)
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private assignToUser(value) {
        let loading: any = {}
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }
        this.pickingService
            .assign_to_user(new RequestParams(value, loading))
            .subscribe(
                data => {
                    this.submit(data)
                },
                err => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                    this.$message.error(err.message)
                }
            )
    }
}
</script>
<i18n>
{
    "en-us": {
        "columns":{
            "Assign to User":"Assign to User"
        },
        "err_msg":"Please Select User"
    },
    "zh-cn": {
        "columns":{
            "Assign to User":"Assign to User"
        },
        "err_msg":"请选择用户"
    }
}
</i18n>
