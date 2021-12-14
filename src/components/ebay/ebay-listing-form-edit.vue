<template>
    <section class="component order-base-detail">
        <a-row :gutter="24" v-if="type == 'change_user'">
            <a-col :span="4">
                <span>{{ $t('columns.Operator') }}</span>
            </a-col>
            <a-col :span="20">
                <a-select
                    showSearch
                    v-model="user_id"
                    :style="{ width: '70%' }"
                    size="small"
                    placeholder="Select User"
                    :filterOption="filterSelectOption"
                >
                    <a-select-option
                        :value="item.code"
                        v-for="item of systemUsers"
                        :key="item.code"
                        >{{ item.name }}</a-select-option
                    >
                </a-select>
            </a-col>
        </a-row>
        <a-row :gutter="24" v-if="type == 'change_state'">
            <a-col :span="4">
                <span>{{ $t('columns.Status') }}</span>
            </a-col>
            <a-col :span="20">
                <a-checkbox v-model="auto_state" size="small" />
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
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { RequestParams } from '../../core/http'
import { Mutation, namespace } from 'vuex-class'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { CommonService } from '@/shared/utils/common.service'

const datasModule = namespace('datasModule')

@Component({
    components: {}
})
export default class EbayLisitingFormEdit extends Vue {
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
    private id_list

    @Prop()
    private type

    private user_id: any = ''
    private auto_state: any = false

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private created() {}
    private loadingService = new LoadingService()

    private handleChange(value) {
        //console.log(value)
    }

    private onSubmit() {
        const value: any = []
        if (this.type == 'change_user') {
            if (this.user_id == '') {
                let err_msg: any = this.$t('err_msg')
                this.$message.error(err_msg)
                return
            }
            value['id_list'] = this.id_list
            value['user_id'] = this.user_id
        } else {
            value['id_list'] = this.id_list
            value['auto_state'] = this.auto_state
        }
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
        let inneraction = new InnerActionService()
        if (this.type == 'change_user') {
            inneraction.setActionAPI(
                '/ebay/change_ebay_merge_user',
                CommonService.getMenuCode('ebay-listing-stock')
            )
        } else {
            inneraction.setActionAPI(
                '/ebay/change_status',
                CommonService.getMenuCode('ebay-listing-stock')
            )
        }

        this.publicService
            .modify(
                new RequestParams(value, {
                    loading: this.loadingService,
                    innerAction: inneraction
                })
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.submit(data)
                },
                err => {
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
            "Operator":"Operator",
            "Status":"Status"
        },
        "err_msg":"Please Select User"
    },
    "zh-cn": {
        "columns":{
            "Operator":"运营",
            "Status":"托管状态"
        },
        "err_msg":"请选择用户"
    }
}
</i18n>
