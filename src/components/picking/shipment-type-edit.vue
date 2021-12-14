<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 16, offset: 2 }"
        >
            <a-form-item :label="$t('columns.ship_type')" required>
                <a-select
                    showSearch
                    v-decorator="[
                        'ship_type',
                        {
                            rules: rules.required
                        }
                    ]"
                    size="small"
                >
                    <a-select-option
                        :value="item.code"
                        v-for="item of shipTypeList"
                        :key="item.code"
                    >
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="$t('columns.rel_name')" required>
                <a-input
                    v-decorator="[
                        `rel_name`,
                        {
                            rules: rules.required
                        }
                    ]"
                    size="small"
                />
            </a-form-item>
            <a-form-item :label="$t('columns.tms_ship_code')" required>
                <a-input
                    v-decorator="[
                        'tms_ship_code',
                        {
                            rules: rules.required
                        }
                    ]"
                    style="width: 120px;"
                    size="small"
                />
            </a-form-item>
            <a-form-item :label="$t('columns.seller_code_list')">
                <a-select
                    showSearch
                    mode="multiple"
                    v-decorator="['seller_code_list']"
                    size="small"
                    :filterOption="filterSelectOption"
                >
                    <a-select-option
                        :value="item.code"
                        v-for="item of sellerList"
                        :key="item.code"
                    >
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="$t('columns.warehouse_name_list')">
                <a-input v-decorator="[`warehouse_name_list`]" size="small" />
            </a-form-item>
            <a-form-item :label="$t('columns.country_code_list')">
                <a-select
                    showSearch
                    mode="multiple"
                    :filterOption="filterSelectOption"
                    size="small"
                    v-decorator="['country_code_list']"
                >
                    <a-select-option
                        :value="item.code"
                        v-for="item of countryList"
                        :key="item.code"
                    >
                        [{{ item.code }}]{{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="$t('columns.package_size')">
                <a-select size="small" v-decorator="['package_size']">
                    <a-select-option
                        :value="item.value"
                        v-for="item of $dict.PackageSize"
                        :key="item.value"
                    >
                        {{ $t(item.label) }}
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">取消</a-button>
            <a-button type="primary" @click="onSubmit">提交</a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import moment from 'moment'
import { ShipmentService } from '../../services/shipment.service'
import { UserService } from '../../services/user.service'
import { LoadingService } from '../../bootstrap/services/loading.service'

@Component({
    components: {}
})
export default class ShipmentTypeEdit extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private saveFlag

    @Prop()
    private shipTypeList

    @Prop()
    private row

    @Prop()
    private countryList

    @Prop()
    private sellerList

    private form: any

    private shipmentService = new ShipmentService()

    private loadingService = new LoadingService()

    private seller_list: any[] = []

    private country_code_list: any[] = []

    private rel_code: string = ''

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public created() {
        this.form = this.$form.createForm(this)
    }

    public mounted() {
        if (this.row) {
            this.rel_code = this.row.rel_code
            this.setFormValues()
        }
    }

    public setFormValues() {
        this.form.setFieldsValue(this.row)
    }

    private saveShipType(data) {
        this.shipmentService
            .saveShipType(
                new RequestParams(data, { loading: this.loadingService })
            )
            .subscribe(
                () => {
                    this.submit()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['save_flag'] = this.saveFlag
                values['rel_code'] = this.rel_code

                if (values['country_code_list']) {
                    values['country_code_list'] = values['country_code_list']
                        .length
                        ? values['country_code_list']
                        : null
                } else {
                    values['country_code_list'] = null
                }

                this.saveShipType(values)
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
    "desc": "this is a Order Page1",
    "columns":{
       "rel_name":"rel_name",
       "ship_type":"ship_type",
       "seller_code_list":"seller_code_list",
       "seller_name_list":"seller_name_list",
       "country_code_list":"country_code_list",
       "warehouse_id_list":"warehouse_id_list",
       "warehouse_name_list":"warehouse_name_list",
       "package_size":"package_size",
       "tms_ship_code":"tms_ship_code"
    },
    "action":{
      "cancel":"Cancel",
      "save":"Save"
    },
    "delete":"Are you sure delete?",
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Delete Success",
    "yes":"Yes",
    "no":"No"
  },
  "zh-cn": {
    "desc": "",
    "columns":{
       "rel_name":"关系名",
       "ship_type":"物流编码",
       "seller_code_list":"店铺列表",
       "country_code_list":"国家列表",
       "warehouse_name_list":"仓库列表",
       "package_size":"包裹尺寸",
       "tms_ship_code":"tms物流编码"
    },
    "action":{
      "cancel":"取消",
      "save":"保存"
    },
    "delete":"是否确认删除?",
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "delete_success":"删除成功",
    "yes":"是",
    "no":"否"
  }
}
</i18n>
