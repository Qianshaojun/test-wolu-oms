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
                    <a-form-item :label="$t('columns.import_type')">
                        <p style="margin:0;padding:0;line-height:30px;">
                            <a-checkbox v-decorator="['import_track_memo']" />
                            {{ $t('columns.import_track_memo') }}
                        </p>
                        <p style="margin:0;padding:0;line-height:30px;">
                            <a-checkbox v-decorator="['import_finish_time']" />
                            {{ $t('columns.import_finish_time') }}
                        </p>
                        <p style="margin:0;padding:0;line-height:30px;">
                            <a-checkbox v-decorator="['import_finish_qty']" />
                            {{ $t('columns.import_finish_qty') }}
                        </p>
                    </a-form-item>
                </a-col>
                <a-col :span="20" style="margin-top:10px;">
                    <a-form-item :label="$t('columns.import_method')" required>
                        <a-select
                            v-decorator="[
                                'import_method',
                                { rules: rules.required }
                            ]"
                            :style="{ width: '200px' }"
                            size="small"
                            placeholder="Please Select"
                        >
                            <a-select-option
                                value="source_doc"
                                key="source_doc"
                                >{{ $t('columns.source_doc') }}</a-select-option
                            >
                            <a-select-option
                                value="warehouse"
                                key="warehouse"
                                >{{ $t('columns.warehouse') }}</a-select-option
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
                $t('next')
            }}</a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { SystemService } from '../../services/system.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { CommonService } from '@/shared/utils/common.service'
import UploadExcel from '@/shared/common/upload-excel.vue'

@Component({
    components: {}
})
export default class ImportPurchaseProductPlanMemo extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    private form: any

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public created() {
        this.form = this.$form.createForm(this)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                for (let i in values) {
                    if (!values[i]) {
                        delete values[i]
                    }
                }

                this.$modal
                    .open(
                        UploadExcel,
                        {
                            urlPath:
                                '/system_api/upload?inner_action=purchase_order_plan/upload_edit_info&menu_code=' +
                                CommonService.getMenuCode(
                                    'purchase-product-plan'
                                ),
                            uploadParams: values
                        },
                        {
                            title: this.$t('import'),
                            width: '1000px'
                        }
                    )
                    .subscribe(
                        data => {
                            this.$message.success('Import Success')
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )

                this.cancel()
            }
        })
    }
}
</script>

<i18n>
{
  "en-us":{
      "columns":{
            "import_type":"Import Type",
            "import_method":"Import Method",
            "none":"None",
            "source_doc":"Import According To Source Doc",
            "warehouse":"Import According To Warehouse",
            "import_track_memo":"Import Track Memo",
            "import_finish_time":"Import Finish Time",
            "import_finish_qty":"Import Finish Qty"
      },
      "next":"Next Step",
      "cancel":"Cancel",
      "import":"Import"
  },
  "zh-cn":{
       "columns":{    
            "import_type":"导入类型",
            "import_method":"导入方式",
            "none":"无",
            "source_doc":"根据合同号导入",
            "warehouse":"根据仓库导入",
            "import_track_memo":"跟踪备注",
            "import_finish_time":"工厂完成时间",
            "import_finish_qty":"工厂完成备注"
      },
      "next":"下一步",
      "cancel":"取消",
      "import":"导入"
  }
}
</i18n>
