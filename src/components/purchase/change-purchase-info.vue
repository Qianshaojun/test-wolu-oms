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
                    <a-form-item :label="$t('user_purchase')">
                        <a-select
                            showSearch
                            v-decorator="['user_purchase']"
                            :style="{ width: '200px' }"
                            size="small"
                            placeholder="Please Select"
                            :filterOption="filterSelectOption"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '300px' }"
                        >
                            <a-select-option
                                :value="item.code"
                                v-for="item of userList"
                                :key="item.code"
                                >{{ item.name }}</a-select-option
                            >
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('merchandiser')">
                        <a-select
                            showSearch
                            v-decorator="['merchandiser']"
                            :style="{ width: '200px' }"
                            size="small"
                            placeholder="Please Select"
                            :filterOption="filterSelectOption"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '300px' }"
                        >
                            <a-select-option
                                :value="item.code"
                                v-for="item of userList"
                                :key="item.code"
                                >{{ item.name }}</a-select-option
                            >
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('vendor_id')">
                        <a-select
                            showSearch
                            v-decorator="['vendor_id']"
                            :style="{ width: '200px' }"
                            size="small"
                            placeholder="Please Select"
                            :filterOption="filterSelectOption"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '300px' }"
                        >
                            <a-select-option
                                :value="item.code"
                                v-for="item of vendorList"
                                :key="item.code"
                                >{{ item.name }}</a-select-option
                            >
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('cancel')
            }}</a-button>
            <a-button type="primary" @click="onSubmit">{{
                $t('submit')
            }}</a-button>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop, Emit } from 'vue-property-decorator'
import { Form } from 'ant-design-vue'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import moment from 'moment'
import { PublicService } from '~/services/public.service'
import { VendorService } from '~/services/vendor.service'
import { InnerActionService } from '~/bootstrap/services/inner.action.service'
import appConfig from '@/config/app.config'
import CommonPage from '~/shared/components/common-page.vue'

const datasModule = namespace('datasModule')

@Component({
    components: {}
})
export default class ChangePurchaseInfo extends Vue {
    @Emit('modal.cancel')
    private cancel() {}

    @Prop()
    id_list: any

    @Prop()
    vendorList: any

    @Prop()
    userList: any

    private form: any

    private getVendorList() {
        let inneraction = new InnerActionService()
        inneraction.setActionAPI(
            '/vendor/get_vendor_list',
            CommonService.getMenuCode('vendor-product-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService,
                        innerAction: inneraction
                    }
                )
            )
            .subscribe(
                data => {
                    this.vendorList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private loadingService = new LoadingService()
    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    public mounted() {}

    private moment = moment

    public created() {
        this.form = this.$form.createForm(this)
    }

    @Emit('modal.submit')
    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                let inneraction = new InnerActionService()
                inneraction.setActionAPI(
                    'purchase_order_plan/confirm_change',
                    CommonService.getMenuCode('purchase-product-plan')
                )
                this.publicService
                    .modify(
                        new RequestParams(
                            { id_list: this.id_list, data: values },
                            {
                                loading: this.loadingService,
                                innerAction: inneraction
                            }
                        )
                    )
                    .subscribe(
                        data => {
                            return true
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
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
    "user_purchase":"Purchase User",
    "merchandiser":"Merchandiser",
    "vendor_id":"Vendor",
    "submit":"Submit",
    "cancel":"Cancel"
  },
  "zh-cn": {
    "user_purchase":"采购员",
    "merchandiser":"跟单员",
    "vendor_id":"供应商",
    "submit":"提交",
    "cancel":"取消"
  }
}
</i18n>
