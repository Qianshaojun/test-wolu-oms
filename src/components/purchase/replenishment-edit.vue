<template>
    <section class="component edit-customer">
        <a-card class="margin-y" style="margin:0 !important">
            <div
                style="padding:0 20px 10px 0px;min-height:40px;display:inline-block;"
            >
                <a-button
                    @click="editChange"
                    type="default"
                    size="small"
                    v-if="order.id"
                    ><span v-if="!editAble">{{ $t('action.edit') }}</span
                    ><span v-else>{{ $t('action.discard') }}</span>
                </a-button>
                <a-button
                    type="primary"
                    size="small"
                    v-if="editAble || !order.id"
                    @click="onSubmit()"
                    style="margin-left:5px;"
                    >{{ $t('action.save') }}
                </a-button>
                <a-button
                    @click="onVerify('approved')"
                    v-if="order.state == 'to approve'"
                    style="margin-left:5px;"
                    size="small"
                >
                    {{ $t('action.verify') }}
                </a-button>
                <a-button
                    @click="onVerify('draft')"
                    v-if="order.state == 'cancel'"
                    style="margin-left:5px;"
                    size="small"
                >
                    {{ $t('action.reset') }}
                </a-button>
                <a-button
                    @click="onVerify('to approve')"
                    v-if="order.id && order.state == 'draft'"
                    style="margin-left:5px;"
                    size="small"
                >
                    {{ $t('action.confirm') }}
                </a-button>
                <a-button
                    @click="onVerify('cancel')"
                    v-if="
                        order.id &&
                            (order.state == 'to approve' ||
                                order.state == 'draft')
                    "
                    style="margin-left:5px;"
                    size="small"
                >
                    {{ $t('action.cancel') }}
                </a-button>
                <a-button
                    @click="onVerify('refuse')"
                    v-if="order.state == 'refuse'"
                    style="margin-left:5px;"
                    size="small"
                >
                    {{ $t('action.refuse') }}
                </a-button>
                <div style="position:absolute;top:10px;right:10px;">
                    <div class="progress-bar">
                        <li
                            :value="item.value"
                            v-for="item of $dict.ReplenishmentState"
                            :key="item.value"
                            :class="{ active: order.state == item.value }"
                            style="font-size: 12px;"
                        >
                            <span>{{ $t(item.label) }}</span>
                        </li>
                    </div>
                </div>
            </div>

            <section class="component edit-customer">
                <a-form
                    :form="form"
                    :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 16, offset: 1 }"
                >
                    <a-card class="margin-top order-edit-page">
                        <a-row :gutter="24">
                            <a-col :span="12">
                                <a-form-item :label="$t('columns.make_user')">
                                    <a-select
                                        showSearch
                                        v-decorator="[
                                            'user_id',
                                            { initialValue: defaultMakeUser }
                                        ]"
                                        :style="{
                                            width: '100%',
                                            'max-width': '300px'
                                        }"
                                        size="small"
                                        :filterOption="filterSelectOption"
                                        :disabled="
                                            !editAble ||
                                                !(
                                                    (order.state != undefined &&
                                                        order.state ==
                                                            'draft') ||
                                                    (order.state ==
                                                        'to approve' &&
                                                        order.req_type ==
                                                            'abnormal_purchase')
                                                )
                                        "
                                    >
                                        <a-select-option
                                            :value="item.code"
                                            v-for="item of systemUsers"
                                            :key="item.code"
                                        >
                                            {{ item.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.user_approve')"
                                >
                                    <a-select
                                        showSearch
                                        v-decorator="['user_approve']"
                                        :style="{
                                            width: '100%',
                                            'max-width': '300px'
                                        }"
                                        size="small"
                                        :filterOption="filterSelectOption"
                                        disabled
                                    >
                                        <a-select-option
                                            :value="item.code"
                                            v-for="item of systemUsers"
                                            :key="item.code"
                                        >
                                            {{ item.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.date_req')"
                                    required
                                >
                                    <a-date-picker
                                        v-decorator="[
                                            `date_req`,
                                            {
                                                initialValue: moment(Date.now())
                                            },
                                            {
                                                rules: rules.required
                                            }
                                        ]"
                                        format="YYYY-MM-DD"
                                        size="small"
                                        style="width: 200px;"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.date_approve')"
                                >
                                    <a-date-picker
                                        v-decorator="[`date_approve`]"
                                        format="YYYY-MM-DD HH:mm:ss"
                                        size="small"
                                        style="width: 200px;"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.warehouse')"
                                    required
                                >
                                    <a-select
                                        show-search
                                        v-decorator="[
                                            `warehouse_id`,
                                            {
                                                initialValue:
                                                    $dict.WarehouseId[0].value
                                            },
                                            {
                                                rules: rules.required
                                            }
                                        ]"
                                        style="width: 300px"
                                        size="small"
                                        :disabled="
                                            !editAble ||
                                                (order.state != undefined &&
                                                    order.state != 'draft')
                                        "
                                    >
                                        <a-select-option
                                            :value="item.value"
                                            v-for="item of $dict.WarehouseId"
                                            :key="item.value"
                                        >
                                            {{ $t(item.label) }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.company_id')"
                                    required
                                >
                                    <a-select
                                        showSearch
                                        v-decorator="[
                                            'company_id',
                                            {
                                                initialValue:
                                                    companyList[0].code
                                            },
                                            {
                                                rules: rules.required
                                            }
                                        ]"
                                        :style="{
                                            width: '100%',
                                            'max-width': '300px'
                                        }"
                                        size="small"
                                        :filterOption="filterSelectOption"
                                        placeholder="Please Select"
                                        :disabled="
                                            !editAble ||
                                                (order.state != undefined &&
                                                    order.state != 'draft')
                                        "
                                    >
                                        <a-select-option
                                            :value="item.code"
                                            v-for="item of companyList"
                                            :key="item.code"
                                        >
                                            {{ item.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('columns.change_date')">
                                    <a-date-picker
                                        v-decorator="[`change_give_date`]"
                                        format="YYYY-MM-DD"
                                        size="small"
                                        style="width: 200px;"
                                        @change="e => onGiveDateChange(e)"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.req_type')"
                                    required
                                >
                                    <a-select
                                        showSearch
                                        v-decorator="[
                                            'req_type',
                                            {
                                                initialValue:
                                                    $dict.ReplenishmentType[0]
                                                        .value
                                            },
                                            {
                                                rules: rules.required
                                            }
                                        ]"
                                        size="small"
                                        placeholder="Please Select"
                                        :checked="order.req_type"
                                        :v-model="order.req_type"
                                        @change="e => onReqypeChange(e)"
                                        :disabled="
                                            !editAble ||
                                                (order.state != undefined &&
                                                    order.state != 'draft')
                                        "
                                    >
                                        <a-select-option
                                            :value="item.value"
                                            v-for="item of $dict.ReplenishmentType"
                                            :key="item.value"
                                        >
                                            {{ $t(item.label) }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.change_date_memo')"
                                >
                                    <a-textarea
                                        v-decorator="[`change_give_date_memo`]"
                                        size="small"
                                        @change="e => onGiveDateMemoChange(e)"
                                        :disabled="!editAble"
                                    >
                                    </a-textarea>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('columns.dept_id')">
                                    <a-select
                                        showSearch
                                        v-decorator="['dept_id']"
                                        size="small"
                                        placeholder="Please Select"
                                        disabled
                                    >
                                        <a-select-option
                                            :value="item.id"
                                            v-for="item of subDepartList"
                                            :key="item.id"
                                        >
                                            {{ item.dept_name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.is_together_purchase')"
                                >
                                    <a-checkbox
                                        v-decorator="['is_together_purchase']"
                                        size="small"
                                        :checked="order.is_together_purchase"
                                        :v-model="order.is_together_purchase"
                                        @change="
                                            e =>
                                                onTogetherPurchaseChange(
                                                    e.target.checked
                                                )
                                        "
                                        :disabled="
                                            !editAble ||
                                                (order.state != undefined &&
                                                    order.state != 'draft')
                                        "
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.together_require_name')"
                                >
                                    <a-input
                                        v-decorator="['together_require_name']"
                                        size="small"
                                        :disabled="
                                            !editAble ||
                                                !order.is_together_purchase ||
                                                (order.state != undefined &&
                                                    order.state != 'draft')
                                        "
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="7">
                                <a-form-item
                                    :label="$t('columns.plan_sale_month')"
                                    :labelCol="{ span: 12 }"
                                    :wrapperCol="{ span: 10, offset: 2 }"
                                >
                                    <a-month-picker
                                        v-decorator="['sale_range_from']"
                                        size="small"
                                        @change="e => onSaleMonthFromChange(e)"
                                        :disabled="
                                            !editAble ||
                                                (order.state != undefined &&
                                                    order.state != 'draft')
                                        "
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="5">
                                <a-form-item
                                    label="--"
                                    :labelCol="{ span: 2 }"
                                    :wrapperCol="{ span: 20, offset: 1 }"
                                >
                                    <a-month-picker
                                        v-decorator="['sale_range_to']"
                                        size="small"
                                        @change="e => onSaleMonthToChange(e)"
                                        :disabled="
                                            !editAble ||
                                                (order.state != undefined &&
                                                    order.state != 'draft')
                                        "
                                    />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-card>
                    <div class="margin-top">
                        <AddReplenishDetail
                            :info="orderDetail"
                            :state="
                                (order.state && order.state == 'draft') ||
                                !order.id
                                    ? 1
                                    : 0
                            "
                            :editAble="editAble && order.state == 'draft'"
                            :systemUsers="systemUsers"
                            @change="onDetailListChange($event)"
                        ></AddReplenishDetail>
                    </div>
                </a-form>
                <!-- <div class="flex-row justify-content-end margin-top">
                    <a-button type="primary" @click="onSubmit()">{{
                        $t('action.save')
                    }}</a-button>
                </div> -->
            </section>
        </a-card>
    </section>
</template>

<style>
.order-edit-page .ant-form-item {
    margin-bottom: 0 !important;
}

.order-edit-page .ant-form-item .ant-form-item-control,
.order-edit-page .ant-form-item .ant-form-item-label {
    line-height: 2em !important;
}

.progress-bar li {
    padding: 0px 10px;
    line-height: 25px;
    background: #ababab;
    display: inline-block;
    color: #fff;
    position: relative;
    width: initial;
    text-align: center;
}

.progress-bar li:after {
    content: '';
    display: block;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 12px solid #ababab;
    position: absolute;
    right: -12px;
    top: 0;
    z-index: 10;
}

.progress-bar li:before {
    content: '';
    display: block;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 12px solid #fff;
    position: absolute;
    left: 0px;
    top: 0;
}

.progress-bar li {
    padding-left: 25px;
}

.progress-bar li:first-child {
    border-radius: 4px 0 0 4px;
}

.progress-bar li:first-child:before {
    display: none;
}

.progress-bar li.active {
    background-color: #50abe4;
}

.progress-bar li.active:after {
    border-left-color: #50abe4;
}

.bar-date {
    position: absolute;
    color: #000;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
}

.bar-date span {
    font-size: 12px;
    color: #999;
}
</style>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'ant-design-vue'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import AddReplenishDetail from '~/components/purchase/add-replenish-detail.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import moment from 'moment'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')
const userModule = namespace('userModule')

@Component({
    components: {
        AddReplenishDetail
    }
})
export default class ReplenishmentEdit extends Vue {
    @Prop()
    info: any

    private form: any

    private moment = moment

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()
    // 表格数据源
    private order: any = {
        id: 0,
        state: 'draft'
    }

    private orderDetail: any[] = []

    private save_flag: any = 0

    private originData: any = []

    private isShowDetail: any = false //是否只是详情展示

    private menu_code: any = ''

    private editAble: any = false

    private defaultMakeUser: any = ''

    @datasModule.State
    private companyList

    @datasModule.Action
    private getcompany

    @pageParamsModule.State
    replenishEditParams

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @pageParamsModule.State
    private commonPageInfo

    @datasModule.State
    private departmentList

    @datasModule.Action
    private getDepartmentList

    @userModule.State
    private id

    private subDepartList: any = []

    @Watch('info')
    onInfoChange() {
        if (this.info) {
            this.editAble = false
            if (this.info) {
                this.updateOrder(this.info)
            }
        }
    }

    private updateOrder(order) {
        this.originData = order

        this.$nextTick(() => {
            this.order = order[0]
            this.save_flag = 1
            this.editAble = false
            if (
                this.order.req_line != undefined &&
                this.order.req_line.length
            ) {
                this.orderDetail = this.order.req_line.map(x => {
                    return x
                })
            }

            this.order.dept_id = this.orderDetail[0].dept_id

            this.order.is_together_purchase = this.order.is_together_purchase
                ? true
                : false
            // this.order.together_require_name = 'Hs00er-2,BF0029'

            this.form.setFieldsValue(this.order)
        })
    }

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private created() {
        this.getcompany()
        this.getSystemuser()
        this.form = this.$form.createForm(this)
        this.getDepartmentList()
        this.getSubDepartmentList()
    }

    private mounted() {
        if (this.save_flag == 0) {
            this.editAble = true
            this.defaultMakeUser = this.id
        }
        if (this.info.length) {
            this.updateOrder(this.info)
            this.defaultMakeUser = this.info[0].user_id
        }
        if (!this.menu_code) {
            this.menu_code = CommonService.getMenuCode('replenishment-demand')
        }
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private onDetailListChange(data) {
        this.orderDetail = data
        //更新缓存
        let pageId = 'replenishmentedit' + this.order.id
        let item = this.commonPageInfo.find(x => x.index == pageId)
        if (item) {
            item.info[0].req_line = this.orderDetail
        }
    }

    private onSubmit() {
        this.form.validateFields().then((values: any) => {
            values['save_flag'] = this.save_flag

            if (this.save_flag) {
                values['id'] = this.order.id
            }

            if (
                values['is_together_purchase'] &&
                !values['together_require_name']
            ) {
                this.$message.error(
                    'together_require_name(主部门补货需求编号) is required'
                )
                return
            }

            let details: any = this.orderDetail.filter(x => x.id != 'summary')

            if (!details.length) {
                this.$message.error('明细列表不能为空')
                return false
            }

            for (var i of details) {
                if (
                    !i.default_code ||
                    !i.product_qty ||
                    !i.sales_expected_give_date ||
                    !i.date_expected ||
                    !i.warehouse_id ||
                    !i.sale_range_from ||
                    !i.sale_range_to
                ) {
                    this.$message.error('请先完善明细信息，深色背景为必填项')
                    return false
                }
            }
            values['sale_range_from'] = values['sale_range_from']
                ? values['sale_range_from'].format('YYYY-MM')
                : ''
            values['sale_range_to'] = values['sale_range_to']
                ? values['sale_range_to'].format('YYYY-MM')
                : ''
            let req_lines: any = JSON.parse(JSON.stringify(details))

            for (let i in req_lines) {
                delete req_lines[i].index
                if (req_lines[i].date_expected) {
                    req_lines[i].date_expected = req_lines[
                        i
                    ].date_expected.substring(0, 10)
                }
                if (req_lines[i].buyer_change_give_date) {
                    req_lines[i].buyer_change_give_date = req_lines[
                        i
                    ].buyer_change_give_date.substring(0, 10)
                }
                if (req_lines[i].give_date) {
                    req_lines[i].give_date = req_lines[i].give_date.substring(
                        0,
                        10
                    )
                }
                if (req_lines[i].sales_expected_give_date) {
                    req_lines[i].sales_expected_give_date = req_lines[
                        i
                    ].sales_expected_give_date.substring(0, 10)
                }

                if (!req_lines[i].sale_range_from) {
                    this.$message.info('请输入销售起始日期!')
                    return
                }

                if (!req_lines[i].sale_range_to) {
                    this.$message.info('请输入销售结束日期!')
                    return
                }
                // req_lines[i].sale_range_from = values['sale_range_from']
                // req_lines[i].sale_range_to = values['sale_range_to']
            }
            values['req_lines'] = req_lines

            this.innerAction.setActionAPI(
                'purchase_management/save_purchase_requirement',
                this.menu_code
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
                        if (data.message.special_check) {
                            msg += ': ' + data.message.special_check
                        }
                        this.$message.success(msg)
                        if (this.save_flag === 0) {
                            this.save_flag = 1
                        }
                        this.order.id = data.message.id
                        this.editAble = false
                        this.orderDetail.map(x => {
                            x['save_flag'] = 1
                        })
                        this.onRefreshData(this.order.id)

                        // this.form.resetFields()
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private editChange() {
        this.editAble = !this.editAble
        let pageId = 'replenishmentedit' + this.order.id
        let item = this.commonPageInfo.find(x => x.index == pageId)
        if (item) {
            if (this.editAble) {
                item.edit = 1
            } else {
                item.edit = 0
            }
        }
    }

    private onChangeGiveDate() {
        let values = this.form.getFieldsValue()
        if (!values['change_give_date']) {
            this.$message.error('请输入变更交期')
            return
        }
        if (!values['change_give_date_memo']) {
            this.$message.error('请输入变更交期备注')
            return
        }
        this.innerAction.setActionAPI(
            'purchase_management/update_requirement_change_give_date',
            this.menu_code
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        req_id_list: [this.order.id],
                        change_give_date: values.change_give_date,
                        change_give_date_memo: values.change_give_date_memo
                    },
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
                    if (this.save_flag === 0) {
                        this.save_flag = 1
                    }
                    this.order.id = data.message.id

                    // this.form.resetFields()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onGiveDateChange(e) {
        for (let i in this.orderDetail) {
            this.orderDetail[i].sales_change_give_date = e.format('YYYY-MM-DD')
        }
    }

    private onGiveDateMemoChange(e) {
        for (let i in this.orderDetail) {
            this.orderDetail[i].sales_change_give_date_memo = e.target.value
        }
    }

    private onVerify(state) {
        this.innerAction.setActionAPI(
            'purchase_management/update_purchase_requirement_state',
            CommonService.getMenuCode('replenishment-demand')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { req_id_list: [this.order.id], state: state },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')

                    this.order.state = state
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onRefreshData(id) {
        this.innerAction.setActionAPI(
            'purchase_management/query_purchase_requirement_info',
            CommonService.getMenuCode('replenishment-demand')
        )
        this.publicService
            .query(
                new RequestParams(
                    { req_id: id },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    if (
                        data[0].req_line != undefined &&
                        data[0].req_line.length
                    ) {
                        this.orderDetail = data[0].req_line.map(x => {
                            return x
                        })
                    }
                },
                err => {
                    // this.$message.error(err.message)
                }
            )
    }

    private getSubDepartmentList() {
        // this.subDepartList = this.departmentList.filter(x => x.dept_type == 100)
        //TODO
        this.subDepartList = this.departmentList
    }

    private onTogetherPurchaseChange(e) {
        this.order.is_together_purchase = e
        if (e === false) {
            let values = this.form.getFieldsValue()
            values['together_require_name'] = ''
            this.form.setFieldsValue(values)
        }
    }

    private onSaleMonthFromChange(e) {
        for (let i of this.orderDetail) {
            i['sale_range_from'] = e.format('YYYY-MM')
        }
    }

    private onReqypeChange(e) {
        this.order.req_type = e
    }

    private onSaleMonthToChange(e) {
        for (let i of this.orderDetail) {
            i['sale_range_to'] = e.format('YYYY-MM')
        }
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "company_id": "Company",
            "date_approve": "Approve Date",
            "date_expected": "Expected Date",
            "date_req": "Req Date",
            "id": "Id",
            "merchandiser": "Merchandiser",
            "name": "Name",
            "real_state": "Real State",
            "req_type": "Req Type",
            "state": "State",
            "user_approve": "Approve User",
            "user_id": "Created User",
            "user_purchase": "Purchase User",
            "warehouse": "Warehouse",
            "change_date": "Change Date",
            "change_date_memo": "Change Date Memo",
            "product_qty": "Product Qty",
            "make_user": "Make User",
            "dept_id": "Department",
            "together_require_name": "together_require_name",
            "is_together_purchase": "is_together_purchase",
            "plan_sale_month": "plan_sale_month"
        },
        "action": {
            "order_detail": "Order Detail",
            "other_form": "Other Form",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "confirm_order": "Confirm Order",
            "cancel_order": "Cancel Order",
            "create_invovice": "Create Invovice",
            "detail": "Detail",
            "today": "Today",
            "yestoday": "Yestoday",
            "3day": "3 Day",
            "send_email": "Send Email",
            "refund": "Refund Supplement Wizard",
            "modify_cp": "Modify CP",
            "order_detail": "Order Detail",
            "other_info": "Other Info",
            "save": "Save",
            "verify": "Verify",
            "reset": "Reset",
            "confirm": "Confirm",
            "refuse": "Refuse"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "columns": {
            "company_id": "公司",
            "date_approve": "审批日期",
            "date_expected": "期望入库",
            "date_req": "需求日期",
            "id": "Id",
            "merchandiser": "跟单员",
            "name": "需求编号",
            "real_state": "Real State",
            "req_type": "补货类型",
            "state": "状态",
            "user_approve": "审批人",
            "user_id": "创建人",
            "user_purchase": "采购员",
            "warehouse": "仓库",
            "change_date": "变更交期",
            "change_date_memo": "变更交期备注",
            "product_qty": "产品数量",
            "make_user": "需求人",
            "dept_id": "部门",
            "together_require_name": "主部门补货需求编号",
            "is_together_purchase": "合并补货",
            "plan_sale_month": "预计销售月份"
        },
        "action": {
            "order_detail": "订单详情",
            "other_form": "其它信息",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "confirm_order": "确认订单",
            "cancel_order": "取消订单",
            "create_invovice": "创建发票",
            "detail": "详情",
            "today": "前一天",
            "yestoday": "前两天",
            "3day": "前三天",
            "send_email": "发送邮件",
            "refund": "退款管理",
            "modify_cp": "修改CP",
            "order_detail": "订单明细",
            "other_info": "其它信息",
            "save": "保存",
            "verify": "审核",
            "reset": "设置为草稿",
            "confirm": "提交需求",
            "refuse": "确认拒绝",
            "cancel": "取消需求"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功"
    }
}
</i18n>
