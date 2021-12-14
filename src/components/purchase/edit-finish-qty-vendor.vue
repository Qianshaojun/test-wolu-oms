<template>
    <section class="component order-base-detail">
        <a-card class="margin-y" style="margin:0 !important;">
            <a-table
                :dataSource="data"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="id"
                :customRow="
                    rowKey => ({
                        on: {
                            // 单击每行
                            click: () => {
                                currentRow = rowKey.id
                            }
                        }
                    })
                "
                bordered
            >
                <a-table-column
                    :title="$t('columns.default_code')"
                    key="default_code"
                    align="center"
                >
                    <template slot-scope="row">
                        <span>{{ row.default_code }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.real_pre_purchase_order')"
                    key="real_pre_purchase_order"
                    align="center"
                >
                    <template slot-scope="row">
                        <span>{{ row.real_pre_purchase_order }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.order_id')"
                    key="order_id"
                    align="center"
                >
                    <template slot-scope="row">
                        <span>{{ row.order_id }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.product_qty')"
                    key="product_qty"
                    align="center"
                >
                    <template slot-scope="row">
                        <span>{{ row.product_qty }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.finish_yn')"
                    key="finish_yn"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-checkbox
                            v-decorator="[
                                'finish_yn',
                                {
                                    initialValue: row.finish_yn,
                                    valuePropName: 'checked'
                                }
                            ]"
                            :disabled="true"
                        >
                        </a-checkbox>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.finish_qty')"
                    key="finish_qty"
                    align="center"
                >
                    <template slot-scope="row">
                        <span>{{ row.finish_qty }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.new_finish_qty')"
                    key="new_finish_qty"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-input-number
                            decimalSeparator=","
                            v-decorator="['new_finish_qty']"
                            :value="row.new_finish_qty"
                            :style="{ width: '100%', background: '#ecc5e9' }"
                            :min="0"
                            size="small"
                            @change="e => onRowChange(row, 'new_finish_qty', e)"
                        />
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.vendor_id')"
                    key="vendor_id"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-select
                            showSearch
                            v-decorator="['vendor_id']"
                            placeholder="Please select"
                            size="small"
                            :value="row.vendor_id"
                            :style="{ width: '100%' }"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '300px' }"
                            :filterOption="filterSelectOption"
                            @change="e => onRowChange(row, 'vendor_id', e)"
                        >
                            <a-select-option
                                :value="item.code"
                                v-for="item in vendorList"
                                :key="item.code"
                            >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </template>
                </a-table-column>
            </a-table>
        </a-card>
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
import { Component, Vue, Ref, Watch, Prop, Emit } from 'vue-property-decorator'
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
import { InnerActionService } from '~/bootstrap/services/inner.action.service'
import appConfig from '@/config/app.config'
import CommonPage from '~/shared/components/common-page.vue'

@Component({
    components: {}
})
export default class EditFinishQtyVendor extends Vue {
    @Prop()
    data: any

    private loadingService = new LoadingService()
    private publicService = new PublicService()
    private vendorList: any = []
    private editable: any = true

    private getVendorList() {
        let inneraction = new InnerActionService()
        inneraction.setActionAPI(
            '/vendor/get_vendor_list',
            CommonService.getMenuCode('vendor-product-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService,
                        innerAction: inneraction
                    }
                )
            )
            .subscribe(
                data => {
                    this.vendorList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private created() {
        this.getVendorList()
        if (this.data) {
            for (var i in this.data) {
                this.data[i]['new_finish_qty'] = this.data[i].finish_qty
            }
        }
    }

    private mounted() {
        if (this.data) {
            for (var i in this.data) {
                this.data[i]['new_finish_qty'] = this.data[i].finish_qty
            }
        }
    }

    private onRowChange(row, column, value) {
        if (
            Object.prototype.toString.call(value) === '[object InputEvent]' ||
            Object.prototype.toString.call(value) === '[object Event]' ||
            Object.prototype.toString.call(value) === '[object Object]'
        ) {
            if (value.target && value.target.value) {
                row[column] = value.target.value
            } else {
                row[column] = value
            }
        } else {
            row[column] = value
        }
    }

    @Emit('modal.submit')
    private onSubmit() {
        const new_data: any = []
        for (var i of this.data) {
            new_data.push({
                id: i.id,
                finish_qty: i.finish_qty,
                new_finish_qty: i.new_finish_qty,
                vendor_id: i.vendor_id,
                default_code: i.default_code
            })
        }

        let inneraction = new InnerActionService()
        inneraction.setActionAPI(
            'purchase_order_plan/confirm_change_finish_pty',
            CommonService.getMenuCode('purchase-product-plan')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { req_lines: new_data },
                    {
                        loading: this.loadingService,
                        innerAction: inneraction
                    }
                )
            )
            .subscribe(
                data => {
                    return true
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }
}
</script>
<i18n>
{
  "en-us": {
    "desc": "this is a Order Page1",
    "columns":{
       "default_code":"SKU",
       "real_pre_purchase_order":"Real Pre Purchase Order",
       "order_id":"Make Requirement Order",
       "product_qty":"Product Qty",    
       "finish_yn":"Is Finish",
       "finish_qty":"Finish Qty",
       "new_finish_qty":"New Finish Qty",
       "vendor_id":"Vendor"
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
        "inactive":"Inactive",
        "submit":"Submit"
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
       "default_code":"货号",
       "real_pre_purchase_order":"合同号",
       "order_id":"订单号",
       "product_qty":"数量",    
       "finish_yn":"跟踪完成",
       "finish_qty":"原发货数量",
       "new_finish_qty":"先发货数量",
       "vendor_id":"供应商"    
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
        "inactive":"归档",
        "submit":"提交"        
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
