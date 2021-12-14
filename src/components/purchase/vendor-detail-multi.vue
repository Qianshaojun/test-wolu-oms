<template>
    <section class="component order-detail">
        <a-card lass="margin-y" style="margin:0 !important">
            <a-descriptions :title="vendor.vendor_name"> </a-descriptions>
            <a-button
                v-if="is_edit && save_flag != 0"
                type="primary"
                @click="onEdit()"
                style="margin-right:10px"
                >{{ $t('action.edit') }}</a-button
            >
            <a-button
                v-if="!is_edit"
                type="primary"
                @click="onSubmit()"
                style="margin-right:10px"
                >{{ $t('action.save') }}</a-button
            >
            <a-button
                style="margin-right:10px"
                v-if="!vendor.active"
                type="primary"
                @click="changeActive()"
                >{{ $t('action.active') }}</a-button
            >
            <a-button
                style="margin-right:10px"
                v-if="vendor.active"
                type="primary"
                @click="changeInactive()"
                >{{ $t('action.inactive') }}</a-button
            >
            <a-button
                v-if="!is_edit"
                type="primary"
                @click="onReturn()"
                style="margin-right:10px"
                >{{ $t('action.return') }}</a-button
            >
        </a-card>
        <a-card class="margin-y" style="margin:0 !important">
            <a-form
                :form="form"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 16, offset: 2 }"
            >
                <!-- <a-card class="margin-top order-edit-page"> -->
                <a-row :gutter="24">
                    <a-card>
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            {{ $t('columns.base_message') }}
                        </h3>

                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.vendor_name')"
                                required
                            >
                                <a-input
                                    v-decorator="[
                                        `vendor_name`,
                                        {
                                            rules: rules.required
                                        }
                                    ]"
                                    size="small"
                                    :disabled="is_edit"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.vendor_full_name')"
                                required
                            >
                                <a-input
                                    v-decorator="[
                                        `vendor_full_name`,
                                        {
                                            rules: rules.required
                                        }
                                    ]"
                                    size="small"
                                    :disabled="is_edit"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.vendor_code')">
                                <a-input
                                    v-decorator="[`vendor_code`]"
                                    size="small"
                                    :disabled="true"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.company_id')">
                                <a-input
                                    v-decorator="[`company_id`]"
                                    size="small"
                                    :disabled="is_edit"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.company_address')">
                                <a-input
                                    v-decorator="[`company_address`]"
                                    size="small"
                                    :disabled="is_edit"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.com_license_url')">
                                <a
                                    @click="
                                        downloadLicense(vendor.com_license_url)
                                    "
                                    v-if="vendor.com_license_url && is_edit"
                                    >下载</a
                                >
                                <a-upload
                                    v-if="!is_edit"
                                    :fileList="fileList"
                                    :multiple="false"
                                    name="file"
                                    :remove="handleRemove"
                                    :beforeUpload="beforeUpload"
                                >
                                    <a-button>
                                        <a-icon type="upload" />
                                        {{ $t('Upload Attachment') }}
                                    </a-button>
                                </a-upload>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.com_license_validate')"
                            >
                                <a-date-picker
                                    v-decorator="[`com_license_validate`]"
                                    format="YYYY-MM-DD HH:mm:ss"
                                    size="small"
                                    style="width: 200px;"
                                    :disabled="is_edit"
                                />
                            </a-form-item>
                        </a-col>

                        <a-col :span="12" required>
                            <a-form-item :label="$t('columns.currency_id')">
                                <a-select
                                    showSearch
                                    v-decorator="[
                                        'currency_id',
                                        {
                                            rules: rules.required
                                        }
                                    ]"
                                    :style="{
                                        width: '100%',
                                        'max-width': '300px'
                                    }"
                                    size="small"
                                    placeholder="Please Select"
                                    :disabled="is_edit"
                                >
                                    <a-select-option
                                        :value="item.code"
                                        v-for="item of currencyList"
                                        :key="item.code"
                                    >
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.active')">
                                <a-checkbox
                                    v-decorator="[
                                        'active',
                                        {
                                            initialValue: true,
                                            valuePropName: 'checked'
                                        }
                                    ]"
                                    :disabled="is_edit"
                                >
                                </a-checkbox>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.user_purchase')"
                                required
                            >
                                <a-select
                                    showSearch
                                    v-decorator="[
                                        `user_purchase`,
                                        {
                                            rules: rules.required
                                        }
                                    ]"
                                    style="width: 300px"
                                    placeholder="Please select"
                                    size="small"
                                    :disabled="is_edit"
                                    :filterOption="filterSelectOption"
                                >
                                    <a-select-option
                                        :value="item.code"
                                        v-for="item in systemUsers"
                                        :key="item.code"
                                    >
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.merchandiser')"
                                required
                            >
                                <a-select
                                    showSearch
                                    v-decorator="[
                                        `merchandiser`,
                                        {
                                            rules: rules.required
                                        }
                                    ]"
                                    style="width: 300px"
                                    placeholder="Please select"
                                    size="small"
                                    :disabled="is_edit"
                                    :filterOption="filterSelectOption"
                                >
                                    <a-select-option
                                        :value="item.code"
                                        v-for="item in systemUsers"
                                        :key="item.code"
                                    >
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.legal_person')">
                                <a-input
                                    v-decorator="[`legal_person`]"
                                    size="small"
                                    :disabled="is_edit"
                                />
                            </a-form-item>
                        </a-col>
                    </a-card>
                    <a-card>
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            {{ $t('columns.contract') }}
                        </h3>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.company_contract')"
                            >
                                <a-input
                                    v-decorator="[`company_contract`]"
                                    size="small"
                                    :disabled="is_edit"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.contract_job')">
                                <a-input
                                    v-decorator="[`contract_job`]"
                                    size="small"
                                    :disabled="is_edit"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.contract_email')">
                                <a-input
                                    v-decorator="[`contract_email`]"
                                    size="small"
                                    :disabled="is_edit"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.contract_phone')">
                                <a-input
                                    v-decorator="[`contract_phone`]"
                                    size="small"
                                    :disabled="is_edit"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.com_telephone')">
                                <a-input
                                    v-decorator="[`com_telephone`]"
                                    size="small"
                                    :disabled="is_edit"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.com_zip')">
                                <a-input
                                    v-decorator="[`com_zip`]"
                                    size="small"
                                    :disabled="is_edit"
                                />
                            </a-form-item>
                        </a-col>
                    </a-card>
                    <a-card>
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            {{ $t('columns.account_message') }}
                        </h3>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.bank_name')">
                                <a-input
                                    v-decorator="[`bank_name`]"
                                    size="small"
                                    :disabled="is_edit"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.bank_account_no')">
                                <a-input
                                    v-decorator="[`bank_account_no`]"
                                    size="small"
                                    :disabled="is_edit"
                                />
                            </a-form-item>
                        </a-col>
                    </a-card>
                    <a-card>
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            {{ $t('columns.others') }}
                        </h3>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.schedule_type')">
                                <a-select
                                    v-decorator="[`schedule_type`]"
                                    style="width: 300px"
                                    size="small"
                                    :disabled="is_edit"
                                >
                                    <a-select-option
                                        :value="item.code"
                                        v-for="item in scheduleTypeList"
                                        :key="item.code"
                                    >
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.schedule_cycle')">
                                <a-input-number
                                    v-decorator="[`schedule_cycle`]"
                                    size="small"
                                    :disabled="is_edit"
                                    :min="0"
                                    decimalSeparator=","
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="23">
                            <a-form-item
                                :label="$t('columns.memo')"
                                :labelCol="{ span: 3 }"
                                :wrapperCol="{ span: 20, offset: 1 }"
                            >
                                <a-textarea
                                    v-decorator="[`memo`]"
                                    size="small"
                                    style="width: 100%;height:100px;"
                                    :disabled="is_edit"
                                />
                            </a-form-item>
                        </a-col>
                        <!-- </a-row> -->

                        <a-col :span="12">
                            <a-form-item :label="$t('columns.write_uid')">
                                <a-select
                                    v-decorator="[`write_uid`]"
                                    style="width: 300px"
                                    size="small"
                                    disabled
                                >
                                    <a-select-option
                                        :value="item.code"
                                        v-for="item in systemUsers"
                                        :key="item.code"
                                    >
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.write_date')">
                                <a-date-picker
                                    v-decorator="[`write_date`]"
                                    format="YYYY-MM-DD HH:mm:ss"
                                    size="small"
                                    style="width: 200px;"
                                    disabled
                                />
                            </a-form-item>
                        </a-col>
                    </a-card>
                </a-row>
            </a-form>
        </a-card>
    </section>
</template>

<style>
/* .order-edit-page .ant-form-item {
    margin-bottom: 0 !important;
}
.order-edit-page .ant-form-item .ant-form-item-control,
.order-edit-page .ant-form-item .ant-form-item-label {
    line-height: 2em !important;
} */
</style>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
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
import { CurrencyService } from '~/services/currency.service'
import { InnerActionService } from '~/bootstrap/services/inner.action.service'
import appConfig from '@/config/app.config'
import UploadExcel from '~/shared/common/upload-excel.vue'

import { UserController } from '../../config/services/user.controller'
import { UserService } from '../../services/user.service'
import reqwest from 'reqwest'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')
const userModule = namespace('userModule')

@Component({
    components: {}
})
export default class VendorDetailMulti extends Vue {
    @Prop()
    private originVendor: any

    private form: any

    private moment = moment

    private is_edit = true

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    private vendorService = new VendorService()
    private publicService = new PublicService()
    private currencyService = new CurrencyService()
    private innerAction = new InnerActionService()

    // 表格数据源
    private vendor: any = []
    private scheduleTypeList = [
        {
            code: 10,
            name: '不可排期'
        },
        {
            code: 20,
            name: '可短期排期'
        },
        {
            code: 30,
            name: '可长期排期'
        }
    ]
    private userList: any[] = []
    private originData: any = []

    private save_flag: any = 0

    @userModule.State
    private id

    @userModule.State
    private token

    private getcurrency() {
        this.innerAction.setActionAPI(
            '/vendor/get_currency_list',
            CommonService.getMenuCode('vendor-product-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.currencyList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private currencyList: any = []

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @Watch('originVendor')
    private onDetailChange() {
        if (this.originVendor.id) {
            this.vendor = Object.assign({}, this.originVendor)
            this.reset()
        }
    }

    private reset() {
        this.save_flag = 1
        if (this.vendor.com_license_validate) {
            this.vendor.com_license_validate = moment(
                this.vendor.com_license_validate,
                'YYYY-MM-DD HH:ii:ss'
            )
        }
        this.vendor.write_date = moment(
            this.vendor.write_date,
            'YYYY-MM-DD HH:ii:ss'
        )
        this.form.setFieldsValue(this.vendor)
    }

    private changeActive() {
        this.innerAction.setActionAPI(
            '/vendor/change_active',
            CommonService.getMenuCode('vendor-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { id_list: [this.vendor.id], data: true },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    let vls = this.form.getFieldsValue()
                    vls.write_date = moment(new Date())
                    this.vendor.write_date = moment(new Date())
                    vls.active = true
                    this.vendor.active = true
                    this.form.setFieldsValue(vls)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private changeInactive() {
        this.innerAction.setActionAPI(
            '/vendor/change_active',
            CommonService.getMenuCode('vendor-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { id_list: [this.vendor.id], data: false },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    let vls = this.form.getFieldsValue()
                    vls.write_date = moment(new Date())
                    this.vendor.write_date = moment(new Date())
                    vls.active = false
                    this.vendor.active = false
                    this.form.setFieldsValue(vls)
                    this.$message.success(msg)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onEdit() {
        this.is_edit = false
    }

    private downloadLicense(url) {
        window.open(url)
    }

    private fileList: any[] = []

    private onReturn() {
        if (!this.is_edit) {
            this.form.setFieldsValue(this.vendor)
            this.is_edit = true
        }
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private created() {
        this.getcurrency()
        this.getSystemuser()
        this.form = this.$form.createForm(this)
    }

    private mounted() {
        if (this.originVendor.id) {
            this.vendor = Object.assign({}, this.originVendor)
            this.reset()
        } else {
            this.is_edit = false
        }
    }

    private beforeUpload(file) {
        this.fileList = [...this.fileList, file]
        return false
    }
    private handleRemove(file) {
        const index = this.fileList.indexOf(file)
        const newFileList = this.fileList.slice()
        newFileList.splice(index, 1)
        this.fileList = newFileList
    }
    private onSubmit() {
        this.form.validateFields().then((values: any) => {
            values['save_flag'] = this.save_flag
            if (this.save_flag) {
                values['id'] = this.vendor.id
            } else {
                values['vendor_code'] = '0001'
            }

            if (this.fileList.length > 0) {
                var num = 0
                const { fileList } = this
                const formData = new FormData()
                fileList.forEach(file => {
                    formData.append('files' + num.toString(), file)
                    num++
                })

                reqwest({
                    url:
                        appConfig.server +
                        '/vendor/upload_vendor_license' +
                        '?csrf_token=' +
                        this.token +
                        '&customer_key=' +
                        localStorage.getItem('session_id'),
                    method: 'post',
                    processData: false,
                    data: formData,
                    success: data => {
                        try {
                            var obj = eval('(' + data + ')')
                            this.vendor.com_license_url = obj.com_license_url
                            values.com_license_url = obj.com_license_url
                            this.innerAction.setActionAPI(
                                '/vendor/save_vendor',
                                CommonService.getMenuCode('vendor-detail')
                            )
                            this.publicService
                                .modify(
                                    new RequestParams(values, {
                                        loading: this.loadingService,
                                        innerAction: this.innerAction
                                    })
                                )
                                .subscribe(
                                    data => {
                                        let msg: any = this.$t(
                                            'tips.save_success'
                                        )
                                        this.$message.success(msg)
                                        let vls = this.form.getFieldsValue()
                                        if (this.save_flag === 0) {
                                            this.save_flag = 1
                                            this.vendor.id = data[0].id
                                            this.vendor.vendor_code = this.PrefixInteger(
                                                data[0].id,
                                                4
                                            )

                                            vls.vendor_code = this.vendor.vendor_code
                                        }
                                        vls.write_date = moment(new Date())
                                        this.vendor.write_date = moment(
                                            new Date()
                                        )
                                        vls.com_license_url =
                                            obj.com_license_url
                                        this.vendor.com_license_url =
                                            obj.com_license_url
                                        this.form.setFieldsValue(vls)
                                        // this.form.resetFields()
                                    },
                                    err => {
                                        this.$message.error(err.message)
                                    }
                                )
                        } catch (e) {
                            this.$message.error(data)
                        }
                    },
                    error: err => {
                        this.$message.error('上传失败: ' + err.message)
                    }
                })
            } else {
                this.innerAction.setActionAPI(
                    '/vendor/save_vendor',
                    CommonService.getMenuCode('vendor-detail')
                )
                this.publicService
                    .modify(
                        new RequestParams(values, {
                            loading: this.loadingService,
                            innerAction: this.innerAction
                        })
                    )
                    .subscribe(
                        data => {
                            let msg: any = this.$t('tips.save_success')
                            this.$message.success(msg)
                            let vls = this.form.getFieldsValue()
                            if (this.save_flag === 0) {
                                this.save_flag = 1
                                this.vendor.id = data[0].id
                            }
                            vls.write_date = moment(new Date())
                            this.vendor.write_date = moment(new Date())
                            this.form.setFieldsValue(vls)

                            // this.form.resetFields()
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
            this.is_edit = true
        })
    }

    private PrefixInteger(num, m) {
        return (Array(m).join('0') + num).slice(-m)
    }
}
</script>

<i18n>
{
  "en-us": {
    "desc": "this is a Order Page1",
    "columns":{
       "vendor_name":"Vendor Name",
       "vendor_full_name":"Vendor Full Name",
       "vendor_code":"Vendor Code",
       "company_address":"Company Address",    
       "legal_person":"Legal Person",
       "company_id":"Company Id",
       "company_contract":"Company Contract",
       "contract_phone":"Contract Phone",
       "memo":"Memo",
       "contract_email":"Contract Email",
       "active":"Active",
       "com_license_validate":"License Validate",
       "com_license_url":"License Url",
       "bank_name":"Bank Name",
       "bank_account_no":"Bank Account No",
       "com_telephone":"Telephone",
       "com_zip":"Zip",
       "currency_id":"Currency",
       "user_purchase":"User Purchase",
       "merchandiser":"Merchandiser",
       "contract_job":"Contract Job",
       "base_message":"Base Info",
       "contract":"Contract",
       "account_message":"Account Info",
       "others":"Others",
       "schedule_cycle": "Schedule Cycle",
       "schedule_type": "Schedule Type"
    },
    "action":{
        "edit":"Edit",
        "delete":"Delete",
        "ok":"Yes",
        "cancel":"Cancel",
        "more":"More",
        "save":"Save",
        "return":"Return",
        "active":"Active",
        "inactive":"Inactive"
    },
    "rules":{
       "date_range_error":"start date can't later start date"
    },
    "delete":"Are you sure delete?",
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Delete Success"
  },
  "zh-cn": {
    "desc": "这是订单页面1",
    "columns":{
       "vendor_name":"供应商简称",
       "vendor_full_name":"全称",
       "vendor_code":"供应商编码",
       "company_address":"公司地址",    
       "legal_person":"法人",
       "company_id":"统一社会信用代码",
       "company_contract":"常用联系人",
       "contract_phone":"联系人电话",
       "memo":"备注",
       "contract_email":"联系人邮箱",
       "active":"状态",
       "com_license_validate":"证件有效期",
       "com_license_url":"电子扫描件",
       "bank_name":"开户行",
       "bank_account_no":"开户行账号",
       "com_telephone":"公司电话",
       "com_zip":"公司邮编",
       "currency_id":"币种",
       "user_purchase":"采购员",
       "merchandiser":"跟单员",
       "contract_job":"联系人岗位",
       "base_message":"基础信息",
       "contract":"联系方式",
       "account_message":"财务信息",
       "others":"其他信息",
       "schedule_cycle": "排期周期",
       "schedule_type": "排期类型"     
    },
    "action":{
        "edit":"编辑",
        "delete":"删除",
        "ok":"确定",
        "cancel":"取消",
        "more":"更多操作",
        "save":"保存",
        "return":"返回",
        "active":"还原",
        "inactive":"归档"      
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "delete":"是否确认删除?",
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "delete_success":"删除成功"
  }
}
</i18n>
