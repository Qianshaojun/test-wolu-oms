<template>
    <section class="component edit-customer">
        <a-card class="margin-y" style="margin:0 !important">
            <div
                style="padding:0 20px 10px 0;min-height:40px;display:inline-block;"
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
                <div style="position:absolute;top:10px;right:10px;">
                    <div class="progress-bar">
                        <li
                            :value="item.value"
                            v-for="item of $dict.LogisticsProviderState"
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
                                <a-form-item
                                    :label="$t('columns.name')"
                                    required
                                >
                                    <a-input
                                        v-decorator="[
                                            'name',
                                            { rules: rules.required }
                                        ]"
                                        size="small"
                                        :placeholder="$t('plzInput')"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('columns.code')">
                                    <a-input
                                        v-decorator="['code']"
                                        size="small"
                                        :placeholder="$t('plzInput')"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.contact_person')"
                                    required
                                >
                                    <a-input
                                        v-decorator="[
                                            'contact_person',
                                            { rules: rules.required }
                                        ]"
                                        :placeholder="$t('plzInput')"
                                        size="small"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.contact_tel')"
                                    required
                                >
                                    <a-input
                                        v-decorator="[
                                            'contact_tel',
                                            { rules: rules.required }
                                        ]"
                                        :placeholder="$t('plzInput')"
                                        size="small"
                                        :maxLength="11"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.currency_id')"
                                    required
                                >
                                    <a-select
                                        showSearch
                                        v-decorator="[
                                            'currency_id',
                                            { rules: rules.required }
                                        ]"
                                        :style="{
                                            width: '200px'
                                        }"
                                        size="small"
                                        :filterOption="filterSelectOption"
                                        :placeholder="$t('plzSelect')"
                                        :disabled="!editAble"
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
                                <a-form-item :label="$t('columns.memo')">
                                    <a-textarea
                                        v-decorator="[`memo`]"
                                        :placeholder="$t('plzInput')"
                                        size="small"
                                        :disabled="!editAble"
                                    >
                                    </a-textarea>
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-card>
                    <div class="margin-top">
                        <AddLogisticsProviderDetail
                            :info="orderDetail"
                            :id="
                                order.logistics_providers_id
                                    ? order.logistics_providers_id
                                    : 0
                            "
                            :state="order.id ? 1 : 0"
                            :editAble="editAble"
                            :systemUsers="systemUsers"
                            :countryList="countryList"
                            :currencyList="currencyList"
                            @change="onDetailListChange($event)"
                        ></AddLogisticsProviderDetail>
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

<style scoped>
.order-edit-page .ant-form-item {
    margin-bottom: 10px !important;
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
import AddLogisticsProviderDetail from '~/components/purchase/add-logistics-provider-detail.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import moment from 'moment'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { CurrencyService } from '../../services/currency.service'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')
const userModule = namespace('userModule')

@Component({
    components: {
        AddLogisticsProviderDetail
    }
})
export default class LogisticsProvidersEdit extends Vue {
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

    private currencyService = new CurrencyService()
    private currencyList: any = []
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
    private countryList

    @datasModule.Action
    private getcountry

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
                this.order.channel_list != undefined &&
                this.order.channel_list.length
            ) {
                this.orderDetail = this.order.channel_list.map(x => {
                    return x
                })
            }

            // this.order.is_together_purchase = true
            // this.order.together_require_name = 'Hs00er-2,BF0029'
            // this.order.sale_range_from = '2020-12'

            this.form.setFieldsValue(this.order)
        })
    }

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private created() {
        this.getcurrency()
        this.getcountry()
        this.getSystemuser()
        this.form = this.$form.createForm(this)
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
            this.menu_code = CommonService.getMenuCode(
                'logistics-providers-detail'
            )
        }
    }

    private getcurrency() {
        this.currencyService.getCurrency(new RequestParams({})).subscribe(
            data => {
                this.currencyList = data
            },
            err => {}
        )
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
            item.info[0].channel_list = this.orderDetail
        }
    }

    private onSubmit() {
        this.form.validateFields().then((values: any) => {
            values['save_flag'] = this.save_flag

            if (this.save_flag) {
                values['id'] = this.order.logistics_providers_id
            }

            let details: any = this.orderDetail.filter(x => x.id != 'summary')

            if (!details.length) {
                this.$message.error('明细列表不能为空')
                return false
            }

            for (var i of details) {
                if (
                    !i.prescription ||
                    !i.dest_country_id ||
                    !i.dest_country_id ||
                    !i.shipping_channel ||
                    !i.payment_method
                ) {
                    this.$message.error('请先完善明细信息，深色背景为必填项')
                    return false
                }
            }
            let channel_list: any = JSON.parse(JSON.stringify(details))

            for (let i in channel_list) {
                delete channel_list[i].index
            }
            values['channel_list'] = channel_list
            //TODO
            values['delete_channel_list'] = []

            this.innerAction.setActionAPI(
                '/logistics_providers/modify_record',
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
                        this.$message.success(msg)
                        if (this.save_flag === 0) {
                            this.save_flag = 1
                        }
                        this.order.logistics_providers_id = data.id
                        this.order.code = data.code
                        this.editAble = false
                        this.orderDetail.map(x => {
                            x['save_flag'] = 1
                        })
                        this.onRefreshData(this.order.id)

                        let values = this.form.getFieldsValue()
                        values['code'] = data.code
                        this.form.setFieldsValue(values)
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

    private onRefreshData(id) {
        this.innerAction.setActionAPI(
            '/logistics_providers/query_detail',
            CommonService.getMenuCode('logistics-providers-detail')
        )
        this.publicService
            .query(
                new RequestParams(
                    {
                        logistics_providers_id: this.order
                            .logistics_providers_id
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.orderDetail = data.map(x => x)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getSubDepartmentList() {
        // this.subDepartList = this.departmentList.filter(x => x.dept_type == 100)
        //TODO
        this.subDepartList = this.departmentList
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "name": "Name",
            "code": "Code",
            "contact_person": "Contact Person",
            "contact_tel": "Contact Tel",
            "memo": "Memo",
            "currency_id": "Currency"
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
        "delete_success": "Delete Success",
        "plzInput": "Please Input",
        "plzSelect": "Please Select"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "columns": {
            "name": "物流商名称",
            "code": "物流商编码",
            "contact_person": "联系人",
            "contact_tel": "联系电话",
            "memo": "备注",
            "currency_id": "币种"
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
            "reset": "重置",
            "confirm": "确认",
            "refuse": "确认拒绝"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "plzInput": "请输入",
        "plzSelect": "请选择"
    }
}
</i18n>
