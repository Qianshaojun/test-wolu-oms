<template>
    <section class="component order-base-detail">
        <a-card class="margin-top order-edit-page">
            <div style="width:50%;float:left;">
                <a-row :gutter="24" class="height30">
                    <a-col :span="6">
                        <span>{{ $t('reference') }} :</span>
                    </a-col>
                    <a-col :span="16">
                        {{ info.name }}
                    </a-col>
                </a-row>
                <!-- <a-row :gutter="24" class="height30">
                    <a-col :span="8">
                        <span>{{ $t('user_purchase') }} :</span>
                    </a-col>
                    <a-col :span="16">
                        {{ info.user_purchase | dict2(systemUsers) }}
                    </a-col>
                </a-row> -->
                <a-row :gutter="24" class="height30">
                    <a-col :span="8">
                        <span>{{ $t('order_date') }} :</span>
                    </a-col>
                    <a-col :span="16">
                        {{ info.order_date }}
                    </a-col>
                </a-row>
                <a-row :gutter="24" class="height30">
                    <a-col :span="8">
                        <span>{{ $t('warehouse_id') }} :</span>
                    </a-col>
                    <a-col :span="16">
                        <a-select
                            v-decorator="['warehouse_id']"
                            :value="warehouse_id"
                            :style="{ width: '120px' }"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '120px' }"
                            size="small"
                            @change="e => onWareHouseChange(e)"
                        >
                            <a-select-option
                                v-for="i of $dict.WarehouseId"
                                :key="i.value"
                                :value="i.value"
                                :title="$t(i.label)"
                            >
                                {{ $t(i.label) }}
                            </a-select-option>
                        </a-select>
                    </a-col>
                </a-row>
                <a-row :gutter="24" class="height30">
                    <a-col :span="8">
                        <span>{{ $t('force_replace') }}:</span>
                    </a-col>
                    <a-col :span="16">
                        <a-checkbox
                            :checked="defaultForceReplaceValue"
                            @change="
                                e => onForceReplaceChange(e.target.checked)
                            "
                        />
                    </a-col>
                </a-row>
                <a-row :gutter="24" class="height30">
                    <a-col :span="8">
                        <span>{{ $t('create_new_order') }}:</span>
                    </a-col>
                    <a-col :span="16">
                        <a-checkbox
                            :checked="defaultCreateNewOrderValue"
                            @change="
                                e => onCreateNewOrderChange(e.target.checked)
                            "
                        />
                    </a-col>
                </a-row>
            </div>
            <div
                style="width:50%;float:left;"
                v-show="defaultCreateNewOrderValue"
            >
                <a-form
                    :form="form"
                    :labelCol="{ span: 7 }"
                    :wrapperCol="{ span: 16, offset: 1 }"
                >
                    <a-row :gutter="24">
                        <a-col :span="20">
                            <a-form-item :label="$t('supplier')" required>
                                <a-select
                                    show-search
                                    v-decorator="[
                                        `vendor_id`,
                                        { rules: rules.required }
                                    ]"
                                    placeholder="input search text"
                                    style="width: 240px"
                                    size="small"
                                >
                                    <a-select-option
                                        v-for="item in vendorList"
                                        :key="item.code"
                                        :value="item.code"
                                    >
                                        <span>
                                            {{ item.name }}
                                        </span>
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="20">
                            <a-form-item :label="$t('order_company')" required>
                                <a-select
                                    showSearch
                                    v-decorator="[
                                        'order_company_id',
                                        {
                                            rules: rules.required
                                        }
                                    ]"
                                    :style="{
                                        width: '100%',
                                        'max-width': '240px'
                                    }"
                                    size="small"
                                    placeholder="Please Select"
                                >
                                    <a-select-option value="woltu" key="woltu">
                                        Woltu
                                    </a-select-option>
                                    <a-select-option value="eugad" key="eugad">
                                        EUGAD
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="20">
                            <a-form-item
                                :label="$t('make_order_user')"
                                required
                            >
                                <a-select
                                    show-search
                                    v-decorator="[
                                        `make_user`,
                                        { rules: rules.required }
                                    ]"
                                    placeholder="input search text"
                                    style="width: 240px"
                                    size="small"
                                >
                                    <a-select-option
                                        v-for="item in systemUsers"
                                        :key="item.code"
                                        :value="item.code"
                                    >
                                        <span>
                                            {{ item.name }}
                                        </span>
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="20">
                            <a-form-item :label="$t('merchandiser')" required>
                                <a-select
                                    show-search
                                    v-decorator="[
                                        `merchandiser`,
                                        { rules: rules.required }
                                    ]"
                                    placeholder="input search text"
                                    style="width: 240px"
                                    size="small"
                                >
                                    <a-select-option
                                        v-for="item in systemUsers"
                                        :key="item.code"
                                        :value="item.code"
                                    >
                                        <span>
                                            {{ item.name }}
                                        </span>
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="20">
                            <a-form-item :label="$t('user_purchase')" required>
                                <a-select
                                    show-search
                                    v-decorator="[
                                        `user_purchase`,
                                        { rules: rules.required }
                                    ]"
                                    placeholder="input search text"
                                    style="width: 240px"
                                    size="small"
                                >
                                    <a-select-option
                                        v-for="item in systemUsers"
                                        :key="item.code"
                                        :value="item.code"
                                    >
                                        <span>
                                            {{ item.name }}
                                        </span>
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="20">
                            <a-form-item
                                :label="$t('purchase_give_date')"
                                required
                            >
                                <a-date-picker
                                    v-decorator="[
                                        `give_date`,
                                        {
                                            initialValue: moment(Date.now())
                                        },
                                        { rules: rules.required }
                                    ]"
                                    format="YYYY-MM-DD"
                                    size="small"
                                    style="width: 200px;"
                                    @change="e => onCreateDateChange(e)"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="20">
                            <a-form-item :label="$t('split_reason')" required>
                                <a-input
                                    v-decorator="[
                                        `split_reason`,
                                        { rules: rules.required }
                                    ]"
                                    size="small"
                                    style="width: 200px;"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </a-card>
        <div style="padding:20px 20px 0 20px;">
            <a-button @click="addBtn" type="primary" size="small"
                ><a-icon type="plus" />{{ $t('actions.add') }}</a-button
            >
        </div>
        <a-table
            :dataSource="req_line"
            :pagination="false"
            style="table-layout:fixed;"
            rowKey="index"
            :customRow="
                rowKey => ({
                    on: {
                        // 单击每行
                        click: () => {
                            currentRow = rowKey.index
                        }
                    }
                })
            "
            bordered
        >
            <a-table-column
                :title="$t('requirement_line_id')"
                key="id"
                align="center"
            >
                <template slot-scope="row">
                    <span>{{ row.id }}</span>
                </template>
            </a-table-column>
            <a-table-column :title="$t('src_id')" key="src_id" align="center">
                <template slot-scope="row">
                    <a-input-number
                        v-if="currentRow == row.index && editable && !row.id"
                        v-decorator="['src_id']"
                        :value="row.src_id"
                        :style="{ width: '100%', background: '#ecc5e9' }"
                        size="small"
                        @change="e => onRowChange(row, 'src_id', e)"
                    />
                    <span v-else>{{ row.src_id }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('create_new_item')"
                key="create_new_item"
                align="center"
            >
                <template slot-scope="row">
                    <!-- <a-checkbox
                        v-if="currentRow == row.index && editable && !row.id"
                        v-decorator="['create_new_item']"
                        :checked="row.create_new_item"
                        size="small"
                        @change="
                            e =>
                                onRowChange(
                                    row,
                                    'create_new_item',
                                    e.target.checked
                                )
                        "
                    /> -->
                    <span
                        ><a-checkbox disabled :checked="row.create_new_item"
                    /></span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('product')"
                key="default_code"
                align="center"
            >
                <template slot-scope="row">
                    <a-auto-complete
                        v-if="currentRow == row.index && editable && !row.id"
                        :dataSource="skuSource"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '300px' }"
                        :defaultValue="row.default_code"
                        @search="onSkuSearch"
                        @change="e => onRowChange(row, 'default_code', e)"
                        size="small"
                        style="width: 100%;"
                        placeholder="input for search"
                    >
                        <template slot="dataSource">
                            <a-select-option
                                v-for="opt in skuSource"
                                :key="opt"
                                :value="opt"
                                :title="opt"
                            >
                                {{ opt }}
                            </a-select-option>
                            <a-select-option
                                key="all"
                                disabled
                                class="show-all"
                            >
                                <a @click="searchMore(row)">
                                    Search More
                                </a>
                            </a-select-option>
                        </template>
                    </a-auto-complete>
                    <span v-else>{{ row.default_code }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('quantity')"
                key="product_qty"
                align="center"
            >
                <template slot-scope="row">
                    <a-input-number
                        decimalSeparator=","
                        v-if="currentRow == row.index && editable"
                        v-decorator="['product_qty']"
                        :value="row.product_qty"
                        :min="0"
                        size="small"
                        :style="{ width: '100px', background: '#ecc5e9' }"
                        @change="e => onRowChange(row, 'product_qty', e)"
                    />
                    <span v-else>{{ row.product_qty }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('warehouse_id')"
                key="warehouse_id"
                align="center"
            >
                <template slot-scope="row">
                    <a-select
                        v-decorator="['warehouse_id']"
                        :value="row.warehouse_id"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '120px' }"
                        size="small"
                        @change="e => onRowChange(row, 'warehouse_id', e)"
                    >
                        <a-select-option
                            v-for="i of $dict.WarehouseId"
                            :key="i.value"
                            :value="i.value"
                            :title="$t(i.label)"
                        >
                            {{ $t(i.label) }}
                        </a-select-option>
                    </a-select>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('finish_qty')"
                key="finish_qty"
                align="center"
            >
                <template slot-scope="row">
                    <!-- <a-input-number
                        decimalSeparator=","
                        v-if="currentRow == row.index && editable && !row.id"
                        v-decorator="['finish_qty']"
                        :value="row.finish_qty"
                        :min="0"
                        size="small"
                        :style="{ width: '100%', background: '#ecc5e9' }"
                        @change="e => onRowChange(row, 'finish_qty', e)"
                    /> -->
                    <span>{{ row.finish_qty }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('is_finish')"
                key="finish_yn"
                align="center"
            >
                <template slot-scope="row">
                    <!-- <a-checkbox
                        v-if="currentRow == row.index && editable && !row.id"
                        v-decorator="['finish_yn']"
                        :checked="row.finish_yn"
                        size="small"
                        @change="
                            e => onRowChange(row, 'finish_yn', e.target.checked)
                        "
                    /> -->
                    <span><a-checkbox disabled :checked="row.finish_yn"/></span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('factory_finish_qty')"
                key="factory_finish_qty"
                align="center"
            >
                <template slot-scope="row">
                    <!-- <a-input-number
                        decimalSeparator=","
                        v-if="currentRow == row.index && editable && !row.id"
                        v-decorator="['factory_finish_qty']"
                        :value="row.factory_finish_qty"
                        :min="0"
                        size="small"
                        :style="{ width: '100%', background: '#ecc5e9' }"
                        @change="e => onRowChange(row, 'factory_finish_qty', e)"
                    /> -->
                    <span>{{ row.factory_finish_qty }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('actions.action')"
                key="action"
                align="center"
            >
                <template slot-scope="row">
                    <a @click="onDel(row)" v-if="!row.id">
                        {{ $t('actions.delete') }}
                    </a>
                    <a @click="e => cancelBtn(e)" v-if="!row.id">
                        {{ $t('actions.cancel') }}
                    </a>
                </template>
            </a-table-column>
        </a-table>
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

<style>
.ant-select-auto-complete.ant-select-sm .ant-input {
    background-color: #ecc5e9;
}
.height30 {
    height: 30px;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
import { ProductService } from '@/services/product.service'
import { RequestParams } from '@/core/http'
import { CommonService } from '@/shared/utils/common.service'
import { formConfig } from '@/config/form.config'
import SearchProduct from '@/components/product/search-product.vue'
import { PickingService } from '../../services/picking.service'
import { LoadingService } from '@/bootstrap/services/loading.service'
import UUID from 'uuidjs'
import moment from 'moment'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { PublicService } from '@/services/public.service'

@Component({
    components: {}
})
export default class UpdateProductQtyCode extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    info: any

    @Prop()
    systemUsers: any

    @Prop()
    vendorList: any

    private form: any

    private req_line: any = []

    private currentRow: any = ''

    private editable: any = true

    private data: any[] = []

    private skuSource: any[] = []

    private skuQueryResult: any[] = []

    private loadingService = new LoadingService()

    private productService = new ProductService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private operateCnt: any = 0

    private defaultForceReplaceValue: any = false
    private defaultCreateNewOrderValue: any = false
    private warehouse_id: any = 'de'

    private moment = moment

    private ship_info: any = []

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public created() {
        this.form = this.$form.createForm(this)
    }

    public setFormValues() {
        this.form.setFieldsValue(this.info)
    }

    private mounted() {
        if (this.info) {
            if (this.info.warehouse_id) {
                this.warehouse_id = this.info.warehouse_id
            }

            if (this.info.order_line) {
                this.req_line = this.info.order_line.map(x => {
                    x['index'] = UUID.generate()
                    x['create_new_item'] = false
                    x['src_id'] = 0
                    return x
                })
            }
        }
        this.setFormValues()
    }

    @Watch('info')
    private onInfoChange() {
        if (this.info && this.info.order_line) {
            this.req_line = this.info.order_line.map(x => {
                x['index'] = UUID.generate()
                x['create_new_item'] = false
                x['src_id'] = 0
                return x
            })
        }
    }

    private addBtn() {
        let index = UUID.generate()
        this.req_line.push({
            index: index,
            id: 0,
            src_id: 0,
            create_new_item: true,
            default_code: '',
            finish_qty: 0,
            finish_yn: false,
            product_qty: 0,
            factory_finish_qty: 0,
            warehouse_id: 'de',
            product_id: 0
        })
        this.currentRow = index
    }

    private onRowChange(row, column, value) {
        if (
            Object.prototype.toString.call(value) === '[object InputEvent]' ||
            Object.prototype.toString.call(value) === '[object Event]' ||
            Object.prototype.toString.call(value) === '[object Object]'
        ) {
            row[column] = value.target.value
        } else {
            row[column] = value
        }

        if (column === 'default_code') {
            let productItem = this.skuQueryResult.find(
                x => x.default_code == value
            )
            if (productItem) {
                row.default_code = productItem.default_code
                row.product_id = productItem.product_id
            }
        }
    }

    private cancelBtn(e) {
        e.stopPropagation()
        this.currentRow = -1
    }

    private onDel(row) {
        this.currentRow = -1
        let item = this.req_line.find(x => x.index === row.index)
        item['save_flag'] = 2
        this.req_line = this.req_line.filter(
            x => !x.save_flag || x.save_flag < 2
        )
    }

    private onSkuSearch(key) {
        let params: any = CommonService.createQueryCondition(
            { default_code: key },
            {
                default_code: 'like',
                ...formConfig.condition
            }
        )
        params['page_index'] = 1
        params['page_size'] = 10
        this.productService
            .queryAsyncProductInfo(
                new RequestParams(params, { loading: this.loadingService })
            )
            .subscribe(data => {
                this.skuSource = data.map(x => x.default_code)
                this.skuQueryResult = data
            })
    }

    private searchMore(row) {
        let _that = this
        this.$modal
            .open(
                SearchProduct,
                {},
                {
                    title: '搜索产品',
                    width: '60%'
                }
            )
            .subscribe(data => {
                //sku不能重复
                let item = this.req_line.find(x => x.index === row.index)
                item['product_id'] = data.product_id
                item['default_code'] = data.default_code

                this.currentRow = -1
                setTimeout(function() {
                    _that.currentRow = row.index
                }, 100)
            })
    }

    private onSubmit() {
        if (this.defaultCreateNewOrderValue) {
            this.form.validateFields({}, (err, values) => {
                if (!err) {
                    this.ship_info = values
                    this.submitContent()
                }
            })
        } else {
            this.ship_info = ''
            this.submitContent()
        }
    }

    private submitContent() {
        let lines: any = []
        for (let i in this.req_line) {
            lines[i] = Object.assign({}, this.req_line[i])
            if (lines[i].index) {
                delete lines[i].index
            }
            lines[i]['qty'] = lines[i].product_qty
            delete lines[i].product_qty
            if (this.req_line[i].id == 0) {
                if (
                    !this.req_line[i].default_code ||
                    !this.req_line[i].product_qty ||
                    !this.req_line[i].src_id
                ) {
                    this.$message.error('请先完善明细中的信息,深色背景为必填项')
                    this.currentRow = this.req_line[i].id
                    return false
                }
                let findItem = this.req_line.find(
                    x => x.id == this.req_line[i].src_id
                )
                if (!findItem) {
                    this.$message.error('原需求列ID不在所选的范围')
                    return false
                }
                delete lines[i].factory_finish_qty
                delete lines[i].finish_qty
                delete lines[i].finish_yn
                delete lines[i].default_code
            }
        }
        //save
        let datas: any = {
            order_id: this.info.id,
            split_items: lines,
            add_new_order: this.defaultCreateNewOrderValue
        }
        if (this.ship_info) {
            datas['new_purchase_order_info'] = this.ship_info
        }
        this.innerAction.setActionAPI(
            'purchase_management/split_purchase_order',
            CommonService.getMenuCode('purchase-contract-manage')
        )
        this.publicService
            .modify(
                new RequestParams(datas, {
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

    private onWareHouseChange(e) {
        this.warehouse_id = e
        if (this.defaultForceReplaceValue) {
            for (let i of this.req_line) {
                i.warehouse_id = e
            }
        }
    }

    private onForceReplaceChange(e) {
        this.defaultForceReplaceValue = e
    }

    private onCreateNewOrderChange(e) {
        this.defaultCreateNewOrderValue = e
    }
}
</script>

<i18n>
{
  "en-us":{
    "reference":"Name",
    "state":"state",
    "user_purchase":"Purchase user",
    "user_id":"Requirement User",
    "purchase_date":"Purchase Date",
    "src_id": "Src ID",
    "requirement_line_id": "Requirement Line ID",
    "product": "Product",
    "finish_qty": "Finish Qty",
    "is_finish": "Is Finish",
    "quantity":"Quantity",
    "warehouse_id": "Warehouse",
    "create_new_item":"Create New Item",
    "product":"Product",
    "order_date":"Order Date",
    "force_replace":"Force Replace",
    "create_new_order":"Create New Order",
    "factory_finish_qty":"Factory Finish Qty",
    "supplier": "Supplier",
    "order_company": "Order Company",
    "make_order_user":"Make Order User",
    "merchandiser":"Merchandiser",
    "purchase_give_date":"Purchase Give Date",
    "split_reason":"Split Reason",
    "actions":{
      "add":"Add",
      "action":"Action",
      "save":"Save",
      "delete":"Delete",
      "cancel":"Cancel"   
    }
  },
  "zh-cn":{
    "reference":"Name",
    "state":"状态",
    "user_purchase":"采购员",
    "user_id":"需求人",
    "purchase_date":"采购日期",
    "src_id": "原需求列ID",
    "requirement_line_id": "需求列ID",
    "product": "产品",
    "finish_qty": "已发货数量",
    "is_finish": "已完成发货",
    "quantity":"数量",
    "warehouse_id": "仓库",
    "create_new_item":"Create New Item",
    "product":"产品",
    "factory_finish_qty":"工厂完成数量",
    "force_replace":"Force Replace",
    "create_new_order":"Create New Order",
    "order_date":"订单日期",
    "supplier": "供应商",
    "order_company": "公司",
    "make_order_user":"创建人",
    "merchandiser":"跟单员",
    "purchase_give_date":"采购交期",
    "split_reason":"拆分原因",
    "actions":{
      "add":"新增",
      "action":"操作",
      "save":"保存",
      "delete":"删除",
      "cancel":"取消"
    }
  }
}
</i18n>
