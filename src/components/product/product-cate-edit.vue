<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 16, offset: 1 }"
        >
            <a-row :gutter="24">
                <a-col :span="11" style="position:relative;">
                    <a-form-item
                        :label="$t('columns.cn_main_category')"
                        required
                    >
                        <a-select
                            placeholder=""
                            size="small"
                            allowClear
                            v-decorator="[
                                'cn_main_category',
                                {
                                    initialValue: row.cn_main_category
                                }
                            ]"
                            @change="e => onMainCateChange(e)"
                            :disabled="!!saveFlag"
                        >
                            <a-select-option
                                v-for="cate in mainCates"
                                :key="cate"
                            >
                                {{ cate }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a v-if="!saveFlag" @click="addCnMainCategory()">
                        <a-icon
                            type="plus-circle"
                            style="position:absolute;top:13px;right:-5px;color:#1890ff;"
                        />
                    </a>
                </a-col>
                <a-col :span="11">
                    <a-form-item
                        :label="$t('columns.sub_category_profit')"
                        required
                    >
                        <a-input-number
                            v-decorator="[
                                'sub_category_profit',
                                {
                                    initialValue: row.sub_category_profit
                                },
                                {
                                    rules: rules.required
                                }
                            ]"
                            :min="0"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="11" style="position:relative;">
                    <a-form-item :label="$t('columns.cn_category')" required>
                        <a-select
                            placeholder=""
                            size="small"
                            allowClear
                            v-decorator="[
                                'cn_category',
                                {
                                    initialValue: row.cn_category
                                }
                            ]"
                            @change="e => onCnCateChange(e)"
                            :disabled="!!this.saveFlag"
                        >
                            <a-select-option
                                v-for="cate in cnCates"
                                :key="cate"
                            >
                                {{ cate }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a v-if="!saveFlag" @click="addCnCategory()">
                        <a-icon
                            type="plus-circle"
                            style="position:absolute;top:13px;right:-5px;color:#1890ff;"
                        />
                    </a>
                </a-col>
                <a-col :span="11">
                    <a-form-item :label="$t('columns.purchase_user')">
                        <a-select
                            v-decorator="[
                                'purchase_user',
                                {
                                    initialValue: row.purchase_user
                                }
                            ]"
                            size="small"
                            placeholder="Please select"
                        >
                            <a-select-option
                                v-for="item of purchase_list"
                                :key="item.name"
                                :value="item.name"
                            >
                                {{ $t(item.name) }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="11" style="position:relative;">
                    <a-form-item
                        :label="$t('columns.cn_sub_category')"
                        required
                    >
                        <a-input
                            v-decorator="[
                                'cn_sub_category',
                                {
                                    initialValue: row.cn_sub_category
                                },
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            :disabled="!!this.saveFlag"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item :label="$t('columns.purchase_follower')">
                        <a-select
                            v-decorator="[
                                'purchase_follower',
                                {
                                    initialValue: row.purchase_follower
                                }
                            ]"
                            size="small"
                            placeholder="Please select"
                        >
                            <a-select-option
                                v-for="item of purchase_list"
                                :key="item.name"
                                :value="item.name"
                            >
                                {{ $t(item.name) }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item :label="$t('columns.de_category')" required>
                        <a-input
                            v-decorator="[
                                'de_category',
                                {
                                    initialValue: row.de_category
                                },
                                {
                                    rules: rules.required
                                }
                            ]"
                            :disabled="!!this.saveFlag"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item :label="$t('columns.requirement_period')">
                        <a-input
                            v-decorator="[
                                'requirement_period',
                                {
                                    initialValue: row.requirement_period
                                }
                            ]"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item :label="$t('columns.de_sub_category')">
                        <a-input
                            v-decorator="[
                                'de_sub_category',
                                {
                                    initialValue: row.de_sub_category
                                }
                            ]"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item :label="$t('columns.purchase_period')">
                        <a-input
                            v-decorator="[
                                'purchase_period',
                                {
                                    initialValue: row.purchase_period
                                }
                            ]"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item :label="$t('columns.department')" required>
                        <a-select
                            v-decorator="[
                                'department',
                                {
                                    initialValue: row.department
                                },
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            placeholder="Please select"
                            @change="e => onDeptChange(e)"
                        >
                            <a-select-option
                                v-for="item of sale_dept_list"
                                :key="item.name"
                                :value="item.name"
                            >
                                {{ $t(item.name) }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item :label="$t('columns.develop_team')">
                        <a-select
                            v-decorator="[
                                'develop_team',
                                {
                                    initialValue: row.develop_team
                                }
                            ]"
                            size="small"
                            placeholder="Please select"
                        >
                            <a-select-option
                                v-for="item of develop_team_list"
                                :key="item.name"
                                :value="item.name"
                            >
                                {{ $t(item.name) }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item :label="$t('columns.department_manager')">
                        <a-select
                            v-decorator="[
                                'department_manager',
                                {
                                    initialValue: row.department_manager
                                }
                            ]"
                            size="small"
                            placeholder="Please select"
                        >
                            <a-select-option
                                v-for="item of sale_dept_leader_list"
                                :key="item"
                                :value="item"
                            >
                                {{ $t(item) }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item :label="$t('columns.develop_month')">
                        <a-input
                            v-decorator="[
                                'develop_month',
                                {
                                    initialValue: row.develop_month
                                }
                            ]"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item :label="$t('columns.operator')" required>
                        <a-select
                            v-decorator="[
                                'operator',
                                {
                                    initialValue: row.operator
                                },
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            placeholder="Please select"
                        >
                            <a-select-option
                                v-for="item of operator_list"
                                :key="item"
                                :value="item"
                            >
                                {{ $t(item) }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item :label="$t('columns.status')">
                        <a-radio-group
                            v-decorator="['status', { initialValue: 20 }]"
                            size="small"
                            :style="{ height: '20px' }"
                            buttonStyle="solid"
                        >
                            <a-radio-button :value="20">
                                {{ $t('action.open') }}
                            </a-radio-button>
                            <a-radio-button :value="200">
                                {{ $t('action.close') }}
                            </a-radio-button>
                        </a-radio-group>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
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
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { ProductService } from '../../services/product.service'
import { CommonService } from '@/shared/utils/common.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import AddCnMainCategory from '@/components/product/add-cn-main-category.vue'
import AddCnCategory from '@/components/product/add-cn-category.vue'

@Component({
    components: {}
})
export default class ProductCateEdit extends Vue {
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
    private row

    @Prop({ default: Array })
    private sale_dept_list

    @Prop({ default: Array })
    private purchase_list

    @Prop({ default: Array })
    private purchase_follower_list

    @Prop({ default: Array })
    private develop_team_list

    private form: any

    private sonCates: any = []
    private mainCates: any = []
    private cnCates: any = []
    private cnSubCates: any = []

    private sale_dept_leader_list: any = []
    private operator_list: any = []

    private mainCategory: any = ''
    private cnCategory: any = ''

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public setFormValues() {
        this.form.setFieldsValue(this.row)
    }

    public created() {
        this.getCnMainCates()
        if (this.row) {
            this.mainCategory = this.row.cn_main_category
            this.cnCategory = this.row.cn_category
            this.getCnCates(this.mainCategory)
        }
        this.form = this.$form.createForm(this)
    }

    private mounted() {
        this.setFormValues()
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['save_flag'] = this.saveFlag
                values['id'] = 0
                if (this.saveFlag) {
                    values['id'] = this.row.id
                }

                this.saveInfo(values)
            }
        })
    }

    private saveInfo(data) {
        this.innerAction.setActionAPI(
            'category/save_product_category',
            CommonService.getMenuCode('product-category-manage')
        )
        this.publicService
            .modify(
                new RequestParams(data, {
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

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private addCnCategory() {
        if (this.mainCategory == '') {
            this.$message.error('请先选择一级分类')
            return
        }
        this.$modal
            .open(
                AddCnCategory,
                {
                    cn_main_category: this.mainCategory,
                    cn_category: '',
                    mainCates: this.mainCates
                },
                {
                    width: '660px',
                    title: this.$t('action.add_cn_category')
                }
            )
            .subscribe(
                data => {
                    let values = this.form.getFieldsValue()
                    values['cn_main_category'] = data.cn_main_category
                    values['cn_category'] = data.cn_category
                    values['de_category'] = data.de_category

                    this.form.setFieldsValue(values)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private addCnMainCategory() {
        this.$modal
            .open(
                AddCnMainCategory,
                {
                    cn_main_category: ''
                },
                {
                    title: this.$t('action.add_cn_main_category')
                }
            )
            .subscribe(
                data => {
                    this.mainCates.push(data.cn_main_category)
                    this.mainCategory = data.cn_main_category
                    let values = this.form.getFieldsValue()
                    values['cn_main_category'] = data.cn_main_category

                    this.form.setFieldsValue(values)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getCnMainCates() {
        this.innerAction.setActionAPI(
            'product_management/query_category_for_dropdownlist',
            CommonService.getMenuCode('product-category-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    {
                        cn_main_category: '',
                        cn_category: ''
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(data => {
                this.mainCates = data.cn_main_category
            })
    }

    private getCnCates(main) {
        this.innerAction.setActionAPI(
            'product_management/query_category_for_dropdownlist',
            CommonService.getMenuCode('product-category-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    {
                        cn_main_category: main,
                        cn_category: ''
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(data => {
                this.cnCates = data.cn_category
            })
    }

    private onMainCateChange(e) {
        this.mainCategory = e
        this.getCnCates(e)
    }

    private onCnCateChange(e) {
        this.cnCategory = e
    }

    private onDeptChange(e) {
        let item = this.sale_dept_list.find(x => x.name == e)
        if (!item) {
            return
        }
        this.innerAction.setActionAPI(
            'common_management/query_dept_users',
            CommonService.getMenuCode('department-management')
        )
        this.publicService
            .query(
                new RequestParams(
                    { dept_id: parseInt(item.code) },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    if (data.users.length) {
                        this.operator_list = data.users.map(x => x)
                    }
                    if (data.leaders.length) {
                        this.sale_dept_leader_list = data.leaders.map(x => x)
                    }
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
    "desc": "",
    "columns":{
        "requirement_period": "requirement_period",
        "de_category": "de_category",
        "category_state": "category_state",
        "purchase_user": "purchase_user",
        "operator": "operator",
        "develop_team": "develop_team",
        "cn_sub_category": "cn_sub_category",
        "group_category": "group_category",
        "purchase_period": "purchase_period",
        "cn_category": "cn_category",
        "department_manager": "department_manager",
        "purchase_follower": "purchase_follower",
        "de_sub_category": "de_sub_category",
        "department": "department",
        "sub_category_profit": "sub_category_profit",
        "develop_month": "Develop Month",
        "cn_main_category": "Cn Main Category"
    },
    "action":{
        "edit":"Edit",
        "cancel":"Cancel",
        "more":"More",
        "open": "Enable",
        "close": "Disable",
        "add_cn_main_category": "Add Main Category",
        "add_cn_category": "Add Cn Category"
    },
    "rules":{

    },
    "delete":"Are you sure delete?",
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Delete Success",
    "please_choose":"Please Choose"
  },
  "zh-cn": {
    "desc": "",
    "columns":{
        "requirement_period": "补货周期",
        "de_category": "二级分类-DE",
        "category_state": "启用状态",
        "purchase_user": "采购人员",
        "operator": "运营人员",
        "develop_team": "开发团队",
        "cn_sub_category": "三级分类",
        "purchase_period": "采购周期",
        "cn_category": "二级分类",
        "department_manager": "部门经理",
        "purchase_follower": "跟单人员",
        "de_sub_category": "三级分类-DE",
        "department": "运营部门",
        "sub_category_profit": "毛利率",
        "develop_month": "新上月份",
        "cn_main_category": "一级分类"
    },
    "action":{
        "edit":"编辑",
        "cancel":"取消",
        "more":"更多操作",
        "open": "启用",
        "close": "停用",
        "add_cn_main_category": "新增一级分类",
        "add_cn_category": "新增二级分类"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "delete":"是否确认删除?",
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "delete_success":"删除成功",
    "please_choose":"请选择"

  }
}
</i18n>
