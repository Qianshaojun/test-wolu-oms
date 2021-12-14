<template>
    <section class="component order-base-detail">
        <a-card class="margin-top order-edit-page">
            <a-row :gutter="24">
                <a-col :span="4">
                    <h3>{{ $t('reference') }} :</h3>
                </a-col>
                <a-col :span="8">
                    {{ info.name }}
                </a-col>
                <a-col :span="4">
                    <h3>{{ $t('user_purchase') }} :</h3>
                </a-col>
                <a-col :span="8">
                    {{ info.user_purchase | dict2(systemUsers) }}
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="4">
                    <h3>{{ $t('user_id') }}:</h3>
                </a-col>
                <a-col :span="8">
                    {{ info.user_id | dict2(systemUsers) }}
                </a-col>
                <a-col :span="4">
                    <h3>{{ $t('state') }}:</h3>
                </a-col>
                <a-col :span="8">
                    {{ info.state | dict('ReplenishmentState') | translate }}
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="4">
                    <h3>{{ $t('purchase_date') }}:</h3>
                </a-col>
                <a-col :span="8">
                    {{ info.date_req.toString().substr(0, 10) }}
                </a-col>
            </a-row>
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
            <a-table-column
                :title="$t('origin_line_id')"
                key="origin_line_id"
                align="center"
            >
                <template slot-scope="row">
                    <a-input-number
                        v-if="currentRow == row.index && editable && !row.id"
                        v-decorator="['origin_line_id']"
                        :value="row.origin_line_id"
                        :style="{ width: '100%', background: '#ecc5e9' }"
                        size="small"
                        :min="0"
                        @change="e => onRowChange(row, 'origin_line_id', e)"
                    />
                    <span v-else>{{ row.origin_line_id }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('product_id')"
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
                        v-if="currentRow == row.index && editable && !row.id"
                        v-decorator="['product_qty']"
                        :value="row.product_qty"
                        :min="0"
                        size="small"
                        align="right"
                        :style="{ width: '100%', background: '#ecc5e9' }"
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
                align="right"
            >
                <template slot-scope="row">
                    <span>{{ row.finish_qty }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('is_finish')"
                key="finish_yn"
                align="center"
            >
                <template slot-scope="row">
                    <span><a-checkbox disabled :checked="row.finish_yn"/></span>
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
export default class ReplenishSplit extends Vue {
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
    taxesList: any

    @Prop()
    systemUsers: any

    private req_line: any = []

    private currentRow: any = ''

    private editable: any = true

    private data: any[] = []

    private skuSource: any[] = []

    private skuQueryResult: any[] = []

    private productService = new ProductService()

    private pickingService = new PickingService()

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private operateCnt: any = 0

    private moment = moment

    private mounted() {
        if (this.info && this.info.req_line) {
            this.req_line = this.info.req_line.map(x => {
                if (!x.index) {
                    x['index'] = UUID.generate()
                    x['origin_line_id'] = 0
                }
                return x
            })
        }
    }

    @Watch('info')
    private onInfoChange() {
        if (this.info && this.info.req_line) {
            this.req_line = this.info.req_line.map(x => {
                if (!x.index) {
                    x['index'] = UUID.generate()
                    x['origin_line_id'] = 0
                }
                return x
            })
        }
    }

    private addBtn() {
        let index = UUID.generate()
        this.req_line.push({
            index: index,
            id: 0,
            origin_line_id: 0,
            default_code: '',
            finish_qty: 0,
            finish_yn: false,
            product_qty: 0,
            warehouse_id: 'de'
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
        let lines: any = []
        if (this.req_line.length == 0) {
            this.$message.error('至少添加一条明细信息')

            return false
        }
        for (let i in this.req_line) {
            if (this.req_line[i].id == 0) {
                if (
                    !this.req_line[i].default_code ||
                    !this.req_line[i].product_qty ||
                    !this.req_line[i].origin_line_id
                ) {
                    this.$message.error('请先完善明细中的信息,深色背景为必填项')
                    this.currentRow = this.data[i].id
                    return false
                }
                let findItem = this.req_line.find(
                    x => x.id == this.req_line[i].origin_line_id
                )
                if (!findItem) {
                    this.$message.error('原需求列ID不在所选的范围')
                    return false
                }
            }
            lines[i] = Object.assign({}, this.req_line[i])
            if (lines[i].index) {
                delete lines[i].index
                delete lines[i].alerts
            }
        }
        //save
        this.innerAction.setActionAPI(
            'purchase_management/split_purchase_prod_quantity_warehouse',
            CommonService.getMenuCode('replenishment-demand')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { req_id: this.info.id, req_lines: lines },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
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
}
</script>

<i18n>
{
  "en-us":{
    "reference":"Reference",
    "state":"state",
    "user_purchase":"Purchase user",
    "user_id":"Requirement User",
    "purchase_date":"Purchase Date",
    "origin_line_id": "Origin Requirement Line ID",
    "requirement_line_id": "Requirement Line ID",
    "product": "Product",
    "product_id": "Product",
    "finish_qty": "Finish Qty",
    "is_finish": "Is Finish",
    "quantity":"Quantity",
    "warehouse_id": "Warehouse",
    "actions":{
      "add":"Add",
      "action":"Action",
      "save":"Save",
      "delete":"Delete",
      "cancel":"Cancel"   
    }
  },
  "zh-cn":{
    "reference":"需求编号",
    "state":"状态",
    "user_purchase":"采购员",
    "user_id":"需求人",
    "purchase_date":"采购日期",
    "origin_line_id": "原需求列ID",
    "requirement_line_id": "需求列ID",
    "product": "产品",
    "product_id": "产品",
    "finish_qty": "已发货数量",
    "is_finish": "已完成发货",
    "quantity":"数量",
    "warehouse_id": "仓库",
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
