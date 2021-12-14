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
                    :wrapperCol="{ span: 16 }"
                >
                    <a-row>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.seller_full_name')"
                                required
                            >
                                <a-input
                                    v-decorator="[
                                        `seller_full_name`,
                                        {
                                            rules: rules.required
                                        }
                                    ]"
                                    :placeholder="
                                        $t('columns.seller_full_name')
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
                                <a-input
                                    v-decorator="[
                                        `seller_name`,
                                        {
                                            rules: rules.required
                                        }
                                    ]"
                                    :placeholder="$t('columns.seller_name')"
                                    size="small"
                                    style="width: 200px;"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.platform')"
                                required
                            >
                                <a-select
                                    v-decorator="[
                                        `platform`,
                                        {
                                            rules: rules.required
                                        },
                                        {
                                            initialValue: 10
                                        }
                                    ]"
                                    style="width: 200px"
                                    size="small"
                                    :placeholder="$t('columns.platform')"
                                    @change="platformHandleChange"
                                >
                                    <a-select-option
                                        v-for="d in $dict.SellerPlatform"
                                        :key="d.value"
                                        :value="d.value"
                                        >{{ $t(d.label) }}</a-select-option
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
                                    :filter-option="filterSelectOption"
                                    size="small"
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
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.company_id')"
                                required
                            >
                                <a-select
                                    show-search
                                    v-decorator="['company_id']"
                                    :placeholder="$t('columns.company_id')"
                                    style="width: 200px"
                                    :filter-option="filterSelectOption"
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
                                :label="$t('columns.dept_id')"
                                required
                            >
                                <a-select
                                    v-decorator="['dept_id']"
                                    show-search
                                    :placeholder="$t('columns.dept_id')"
                                    style="width: 200px"
                                    :filter-option="filterSelectOption"
                                    size="small"
                                >
                                    <a-select-option
                                        v-for="i of departmentList"
                                        :key="i.id"
                                        :value="i.id"
                                        :title="i.dept_name"
                                    >
                                        {{ i.dept_name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
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
                            <a-form-item label="Url" required>
                                <a-input
                                    v-decorator="['seller_url']"
                                    placeholder="Url"
                                    style="width: 200px"
                                    size="small"
                                ></a-input>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-item label="Email">
                                <a-input
                                    v-decorator="[`email`]"
                                    placeholder="email"
                                    size="small"
                                    style="width: 200px;"
                                />
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
                    <a-button
                        type="primary"
                        @click="onPass()"
                        style="margin-right:5px"
                        >{{ $t('action.save_and_verify') }}</a-button
                    >
                    <a-button type="primary" @click="onSubmit()">{{
                        $t('action.save')
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
import { CompanyService } from '~/services/company.service'
import { UserService } from '~/services/user.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import { LoadingService } from '../../bootstrap/services/loading.service'

const pageParamsModule = namespace('pageParamsModule')
const allUsersModule = namespace('allUsersModule')

@Page({
    layout: 'workspace',
    name: 'seller-edit'
})
@Component({
    components: {}
})
export default class sellerEdit extends Vue {
    private seller: any = []
    //类别

    @Prop()
    departmentList: any

    private topDepartmentList: any[] = []

    private form: any

    private sellerInstanceService = new SellerInstanceService()
    private companyService = new CompanyService()
    private userService = new UserService()

    private loadingService = new LoadingService()

    private seller_id: any = ''
    private company_id: any = ''
    private responsible_users: any = []

    private companyList: any[] = []
    private sellerList: any[] = []

    private instances: any = []
    private save_flag: any = 0

    private user_value: any = ''
    private platform_value: any = ''

    @pageParamsModule.State
    private sellerEditParams

    @Watch('sellerEditParams')
    onsellerChange() {
        if (this.sellerEditParams) {
            this.updateseller(this.sellerEditParams)
        }
    }

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public mounted() {
        if (this.$route.params.seller) {
            this.updateseller(this.$route.params.seller)
        }

        if (this.$route.params.departmentList) {
            this.updateDepartmentList(this.$route.params.departmentList)
        }
    }

    private getCompanyList() {
        this.companyService.getList(new RequestParams({})).subscribe(data => {
            this.companyList = data
        })
    }

    private getSellerDropDownList() {
        this.sellerInstanceService
            .queryOdooSellerList(new RequestParams())
            .subscribe(data => {
                this.sellerList = data
            })
    }

    private updateseller(seller) {
        this.$nextTick(() => {
            this.save_flag = seller.copy ? 0 : 1
            this.seller = seller

            this.setFormValues()
        })
    }

    private updateDepartmentList(departmentList) {
        this.$nextTick(() => {
            this.departmentList = departmentList
            this.topDepartmentList = this.departmentList.filter(
                x => x.dept_type == 30
            )

            this.setFormValues()
        })
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    public setFormValues() {
        this.form.setFieldsValue(this.seller)
    }

    public created() {
        this.updateAllUsers()
        this.getCompanyList()
        this.getSellerDropDownList()
        this.form = this.$form.createForm(this)
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

    // private userHandleSearch(value) {
    //     let lv = []
    //     let reg = new RegExp(value)
    //     this.responsible_users = this.users.filter(x => reg.test(x.name))
    // }

    private platformHandleChange(value) {
        this.platform_value = value
    }

    // private userHandleChange(value) {
    //     this.user_value = value
    // }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['save_flag'] = this.save_flag
                this.saveseller(values)
            }
        })
    }

    private onPass() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['save_flag'] = this.save_flag
                this.savepassseller(values)
            }
        })
    }

    private saveseller(data) {
        if (this.save_flag === 1) {
            data['seller_code'] = this.seller.seller_code
            data['save_flag'] = this.save_flag
        }

        data['seller_id'] = Number(data['seller_id'].split('_')[1])

        this.sellerInstanceService
            .seller_save(
                new RequestParams(data, { loading: this.loadingService })
            )
            .subscribe(
                data => {
                    this.$message.success('Success')
                    this.seller.seller_code = data.message
                    this.save_flag = 1
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private savepassseller(data) {
        var that = this
        if (this.save_flag === 1) {
            data['seller_code'] = this.seller.seller_code
            data['save_flag'] = this.save_flag
        }

        data['status'] = 20
        data['seller_id'] = Number(data['seller_id'].split('_')[1])

        this.sellerInstanceService
            .seller_save(
                new RequestParams(data, { loading: this.loadingService })
            )
            .subscribe(
                data => {
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
            "dept_id":"Department",
            "memo":"memo"
        },
        "action": {
            "save_and_verify":"Save And Verify",
            "save":"Save"
        }
    },
    "zh-cn": {
        "columns":{
            "company_id":"公司",
            "seller_id":"店铺",
            "dept_id":"部门",
            "memo":"备注"
        },
        "action": {
            "save_and_verify":"保存并审核",
            "save":"保存"
        }
    }
}
</i18n>
