<template>
    <page-container ref="pageContainer">
        <template #header-action></template>
        <a-card class="margin-y">
            <section class="component edit-customer">
                <a-form
                    class="data-form"
                    layout="inline"
                    :form="form"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 16, offset: 1 }"
                >
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.instance_name')"
                                required
                            >
                                <a-input
                                    v-decorator="[
                                        `instance_name`,
                                        {
                                            rules: rules.required
                                        }
                                    ]"
                                    :placeholder="$t('columns.instance_name')"
                                    size="small"
                                    style="width: 200px;"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.instance_full_name')"
                                required
                            >
                                <a-input
                                    v-decorator="[
                                        `instance_full_name`,
                                        {
                                            rules: rules.required
                                        }
                                    ]"
                                    :placeholder="
                                        $t('columns.instance_full_name')
                                    "
                                    size="small"
                                    style="width: 200px;"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.seller_name')"
                                required
                            >
                                <a-select
                                    v-decorator="['seller_code']"
                                    show-search
                                    :placeholder="$t('columns.seller_name')"
                                    option-filter-prop="children"
                                    style="width: 200px"
                                    size="small"
                                    :filter-option="false"
                                >
                                    <a-select-option
                                        v-for="d in sellers"
                                        :key="d.code"
                                        :value="d.code"
                                        >{{ d.name }}</a-select-option
                                    >
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.company_id')"
                                required
                            >
                                <a-select
                                    v-decorator="['company_id']"
                                    show-search
                                    :placeholder="$t('columns.company_id')"
                                    style="width: 200px"
                                    :filter-option="false"
                                    size="small"
                                >
                                    <a-select-option
                                        v-for="d in companyList"
                                        :key="d.code"
                                        :value="d.code"
                                        >{{ d.name }}</a-select-option
                                    >
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.seller_id')"
                                required
                            >
                                <a-select
                                    v-decorator="['seller_id']"
                                    show-search
                                    :placeholder="$t('columns.seller_id')"
                                    style="width: 200px"
                                    size="small"
                                    :filter-option="false"
                                >
                                    <a-select-option
                                        v-for="d in sellerList"
                                        :key="d.code"
                                        :value="d.code"
                                        >{{ d.name }}</a-select-option
                                    >
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.instance_id')"
                                required
                            >
                                <a-select
                                    v-decorator="['instance_id']"
                                    show-search
                                    :placeholder="$t('columns.instance_id')"
                                    style="width: 200px"
                                    size="small"
                                    :filter-option="false"
                                >
                                    <a-select-option
                                        v-for="d in sellerInstanceList"
                                        :key="d.code"
                                        :value="d.code"
                                        >{{ d.name }}</a-select-option
                                    >
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.who_responsible')"
                                required
                            >
                                <a-select
                                    v-decorator="['who_responsible']"
                                    show-search
                                    :placeholder="$t('columns.who_responsible')"
                                    style="width: 200px"
                                    size="small"
                                    :filter-option="filterSelectOption"
                                >
                                    <a-select-option
                                        v-for="d in users"
                                        :key="d.code"
                                        :value="d.code"
                                        >{{ d.name }}</a-select-option
                                    >
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.site_id')"
                                required
                            >
                                <a-select
                                    v-decorator="['site_id']"
                                    show-search
                                    :placeholder="$t('columns.site_id')"
                                    style="width: 200px"
                                    size="small"
                                    :filter-option="filterSelectOption"
                                >
                                    <a-select-option
                                        v-for="d in countryList"
                                        :key="d.code"
                                        :value="d.code"
                                        >{{ d.name }}</a-select-option
                                    >
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.encoding')"
                                required
                            >
                                <a-input
                                    v-decorator="[`encoding`]"
                                    :placeholder="$t('columns.encoding')"
                                    :style="{ width: '200px' }"
                                    size="small"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.lang_id')"
                                required
                            >
                                <a-select
                                    :allowClear="true"
                                    v-decorator="['lang_id']"
                                    :style="{ width: '200px' }"
                                    size="small"
                                    :placeholder="$t('columns.select_language')"
                                >
                                    <a-select-option
                                        :value="item.code"
                                        v-for="item of langList"
                                        :key="item.code"
                                        >{{ item.name }}</a-select-option
                                    >
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.memo')">
                                <a-textarea
                                    v-decorator="[`memo`]"
                                    :placeholder="$t('columns.memo')"
                                    size="small"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>

                <div class="flex-row justify-content-end margin-top">
                    <a-button type="primary" @click="onSubmit()">{{
                        $t('columns.save')
                    }}</a-button>
                </div>
            </section>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { CommonService } from '../../shared/utils/common.service'
import { SellerInstanceService } from '~/services/seller-instance.service'
import { GeneralService } from '~/services/general.service'
import { CompanyService } from '~/services/company.service'
import { CountryService } from '~/services/country.service'
import { UserService } from '~/services/user.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import { LoadingService } from '../../bootstrap/services/loading.service'

const pageParamsModule = namespace('pageParamsModule')
const allUsersModule = namespace('allUsersModule')
const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'instance-edit'
})
@Component({
    components: {}
})
export default class instanceEdit extends Vue {
    private instance: any = []
    //类别

    private form: any

    private cate_name: any = ''

    private save_flag: any = 0

    private sellerInstanceService = new SellerInstanceService()
    private countryService = new CountryService()
    private userService = new UserService()
    private companyService = new CompanyService()

    private loadingService = new LoadingService()
    private generalService = new GeneralService()

    private responsible_users: any = []
    private langList: any = []
    private sellers: any = []
    private sellerList: any[] = []
    private countryList: any[] = []
    private companyList: any[] = []
    private sellerInstanceList: any[] = []

    private user_value: any = ''

    private getcountry() {
        this.countryService.getListCode(new RequestParams()).subscribe(data => {
            this.countryList = data
        })
    }

    @pageParamsModule.State
    private instanceEditParams

    @Watch('instanceEditParams')
    oninstanceChange() {
        if (this.instanceEditParams) {
            this.updateinstance(this.instanceEditParams)
        }
    }

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public mounted() {
        if (this.$route.params.instance) {
            this.updateinstance(this.$route.params.instance)
        }
    }

    private updateinstance(instance) {
        this.$nextTick(() => {
            this.save_flag = instance.copy ? 0 : 1
            this.instance = instance
            this.setFormValues()
        })
    }

    public setFormValues() {
        this.form.setFieldsValue(this.instance)
    }

    @allUsersModule.State
    private users

    @allUsersModule.Mutation('changeUsers')
    private changeUsers

    private updateAllUsers() {
        var that = this
        this.userService.all(new RequestParams('')).subscribe(data => {
            that.changeUsers(data)
        })
    }

    private getLangList() {
        this.generalService.queryLangList(new RequestParams()).subscribe(
            data => {
                this.langList = data
            },
            err => {
                let err_msg: any = this.$t('lang_err')
                this.$message.error(err_msg)
            }
        )
    }

    public created() {
        this.form = this.$form.createForm(this)
        this.getSellers()
        this.updateAllUsers()
        this.getCompanyList()
        this.getSellerList()
        this.getSellerInstanceList()
        this.getLangList()
        this.getcountry()
    }

    private getCompanyList() {
        this.companyService.getList(new RequestParams()).subscribe(data => {
            this.companyList = data
        })
    }

    private getSellerInstanceList() {
        this.sellerInstanceService
            .queryOdooSellerInstanceList(new RequestParams())
            .subscribe(data => {
                this.sellerInstanceList = data
            })
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private getSellers() {
        var that = this
        this.sellerInstanceService
            .query_seller_name(new RequestParams())
            .subscribe(data => {
                that.sellers = data
            })
    }

    private getSellerList() {
        var that = this
        this.sellerInstanceService
            .queryOdooSellerList(new RequestParams())
            .subscribe(data => {
                that.sellerList = data
            })
    }

    private userHandleSearch(value) {
        let lv = []
        let reg = new RegExp(value)
        this.responsible_users = this.users.filter(x => reg.test(x.name))
    }

    private userHandleChange(value) {
        this.user_value = value
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['save_flag'] = this.save_flag
                this.saveinstance(values)
            }
        })
    }

    private saveinstance(data) {
        if (this.save_flag === 1) {
            data['instance_code'] = this.instance.instance_code
            data['save_flag'] = this.save_flag
        }
        data['seller_id'] = Number(data['seller_id'].split('_')[1])
        data['instance_id'] = Number(data['instance_id'].split('_')[1])
        this.sellerInstanceService
            .instance_save(
                new RequestParams(data, { loading: this.loadingService })
            )
            .subscribe(
                () => {
                    this.$message.success('Success')
                    this.form.resetFields()
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
            "company_id":"Company",
            "seller_id":"Seller",
            "instance_id":"instance_id",
            "lang_id":"Lang     id",
            "encoding":"Encoding",
            "site_id":"Site id",
            "memo":"memo",
            "save":"Save",
          "select_language": "select_language"
        }
    },
    "zh-cn": {
        "columns":{
            "company_id":"公司",
            "seller_id":"店铺",
            "instance_id":"实例",
            "lang_id":"语言",
            "encoding":"Encoding",
            "site_id":"站点",
            "memo":"备注",
            "save":"保存",
          "select_language": "选择语言"
        }
    }
}
</i18n>
