<template>
    <div>
        <a-form-model
            :model="inboundForm"
            :rules="inboundRules"
            ref="inboundForm"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 14 }"
        >
            <a-form-model-item :label="$t('whs_id')" prop="whs_id">
                <a-select
                    v-model="inboundForm.whs_id"
                    style="width:240px;"
                    size="small"
                    :placeholder="$t('plzSelectWhs')"
                >
                    <a-select-option
                        :value="item.id"
                        v-for="item of whsIDList"
                        :key="item.id"
                        >{{ item.whs_name }}
                    </a-select-option>
                </a-select>
            </a-form-model-item>

            <a-form-model-item :label="$t('plan_date')" prop="plan_finish_date">
                <a-date-picker
                    v-model="inboundForm.plan_finish_date"
                    :placeholder="$t('plzSelectDate')"
                    :style="{ width: '240px' }"
                />
            </a-form-model-item>
        </a-form-model>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel"
                >{{ $t('cancel') }}
            </a-button>
            <a-button type="primary" @click="onSubmit"
                >{{ $t('submit') }}
            </a-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop, Emit } from 'vue-property-decorator'
import { Page } from '@/core/decorators'
import { CommonService } from '@/shared/utils/common.service'
import { RequestParams } from '@/core/http'
import { PublicService } from '@/services/public.service'
import moment from 'moment'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { LoadingService } from '@/bootstrap/services/loading.service'

@Page({
    layout: 'workspace',
    name: 'inboundPlan'
})
@Component({
    components: {}
})
export default class inboundPlan extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    name: any

    private inboundForm: any = {
        whs_id: undefined,
        plan_finish_date: ''
    }
    private inboundRules: any = {
        whs_id: [
            {
                required: true,
                message: this.$t('plzSelectWhs'),
                trigger: 'change'
            }
        ],
        plan_finish_date: [
            {
                required: true,
                message: this.$t('plzSelectDate'),
                trigger: 'change'
            }
        ]
    }
    private publicService = new PublicService()
    private innerAction = new InnerActionService()
    private loadingService = new LoadingService()
    private moment = moment
    private whsIDList: any = []

    private created() {
        this.getWhsList()
    }

    private getWhsList() {
        this.innerAction.setActionAPI(
            'wms/whs/query_whs',
            CommonService.getMenuCode('purchase-package-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    {},
                    {
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(data => {
                this.whsIDList = data
            })
    }

    private onSubmit() {
        let ref: any = this.$refs['inboundForm']
        ref.validate(valid => {
            if (valid) {
                this.innerAction.setActionAPI(
                    'wms/purchase/create_product_location_operation_no_items',
                    CommonService.getMenuCode('purchase-package-manage')
                )
                this.inboundForm.package_name = this.name
                this.inboundForm.plan_finish_date = moment(
                    this.inboundForm.plan_finish_date
                ).format('YYYY-MM-DD')
                this.publicService
                    .modify(
                        new RequestParams(this.inboundForm, {
                            loading: this.loadingService,
                            innerAction: this.innerAction
                        })
                    )
                    .subscribe(
                        data => {
                            this.submit()
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
        })
    }
}
</script>

<i18n>
{
    "en-us": {
        "whs_id": "Warehouse",
        "plan_date": "Planned Time",
        "plzSelectWhs": "Please Select Warehouse",
        "plzSelectDate": "Please Select Date",
        "submit": "Submit",
        "cancel": "Cancel"
    },
    "zh-cn": {
        "whs_id": "仓库",
        "plan_date": "计划时间",
        "plzSelectWhs": "请选择仓库",
        "plzSelectDate": "请选择日期",
        "submit": "提交",
        "cancel": "取消"
    }
}
</i18n>
