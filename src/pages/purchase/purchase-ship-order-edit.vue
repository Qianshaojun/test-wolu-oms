<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action> </template>
        <PurchaseShipOrderEdit :info="[]" />
    </page-container>
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
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Form } from 'ant-design-vue'
import { Page } from '~/core/decorators'
import PageContainer from '../../shared/components/page-container.vue'
import PurchaseShipOrderEdit from '~/components/purchase/purchase-ship-order-edit.vue'

@Page({
    layout: 'workspace',
    name: 'purchase-ship-order-edit'
})
@Component({
    components: {
        PurchaseShipOrderEdit
    }
})
export default class PurchaseShipOrderEditPage extends Vue {
    @Ref()
    readonly pageContainer!: PageContainer
}
</script>

<i18n>
{
  "en-us": {
    "desc": "this is a Order Page1",
    "columns":{
        "actual_give_date":"Actual Give Date",
        "actual_give_date_memo":"Actual Give Date Memo",
        "box_qty":"Box Qty",
        "container_group":"Container Group",
        "currency_unit":"Currency Unit",
        "default_code":"Default Code",
        "gewicht":"Gewicht",
        "height":"Height",
        "id":"Id",
        "is_fba":"Is Fba",
        "length":"Length",
        "name":"Name",
        "note":"Note",
        "out_number":"Out Number",
        "pack_qty":"Pack Qty",
        "price_subtotal":"Price Subtotal",
        "price_unit":"Price Unit",
        "prod_name":"Prod Name",
        "product_cate":"Product Cate",
        "product_qty":"Product Qty",
        "product_volume":"Product Volume",
        "product_weight":"Product Weight",
        "state":"State",
        "user_purchase":"User Purchase",
        "warehouse_id":"Warehouse Id",
        "width":"Width",
        "warehouse_id":"warehouse_id",
        "source_doc":"Source Doc",
        "give_date":"Give Date",
        "vendor_id":"vendor",
        "order_date":"Order Date",
        "make_user":"Make User"
    },
    "action":{
      "order_detail":"Order Detail",
      "other_form":"Other Form",
      "edit":"Edit",
      "delete":"Delete",
      "ok":"Yes",
      "cancel":"Cancel",
      "more":"More",
      "confirm_order":"Confirm Order",
      "cancel_order":"Cancel Order",
      "create_invovice":"Create Invovice",
      "detail":"Detail",
      "today":"Today",
      "yestoday":"Yestoday",
      "3day":"3 Day",
      "send_email":"Send Email",
      "refund":"Refund Supplement Wizard",
      "modify_cp":"Modify CP",
      "order_detail":"Order Detail",
      "other_info":"Other Info",
      "save":"Save",
      "sync_product_info":"Synchronize Product",
      "change_give_date":"Change Give Date",
      "import":"Import",
      "verify":"Verify",
      "reset":"Reset",
      "confirm":"Confirm",
      "refuse":"Refuse",
      "verify_mome":"Memo"
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
        "actual_give_date":"实际交期",
        "actual_give_date_memo":"实际交期说明",
        "box_qty":"箱数",
        "container_group":"Container Group",
        "currency_unit":"币种",
        "default_code":"货号",
        "gewicht":"毛重",
        "height":"高",
        "id":"Id",
        "is_fba":"是否Fba",
        "length":"长",
        "name":"Name",
        "note":"Note",
        "out_number":"Out Number",
        "pack_qty":"Pack Qty",
        "price_subtotal":"Price Subtotal",
        "price_unit":"Price Unit",
        "prod_name":"产品名称",
        "product_cate":"产品分类",
        "product_qty":"产品数量",
        "product_volume":"产品体积",
        "product_weight":"产品宽度",
        "state":"状态",
        "user_purchase":"采购员",
        "warehouse_id":"仓库",
        "width":"宽",
         "warehouse_id":"仓库",
        "source_doc":"发票号",
        "give_date":"合同交期",
        "vendor_id":"供应商",
        "order_date":"订单日期",
        "make_user":"制单员"
    },
    "action":{
      "order_detail":"订单详情",
      "other_form":"其它信息",
      "edit":"编辑",
      "delete":"删除",
      "ok":"确定",
      "cancel":"取消",
      "more":"更多操作",
      "confirm_order":"确认订单",
      "cancel_order":"取消订单",
      "create_invovice":"创建发票",
      "detail":"详情",
      "today":"前一天",
      "yestoday":"前两天",
      "3day":"前三天",
      "send_email":"发送邮件",
      "refund":"退款管理",
      "modify_cp":"修改CP",
      "order_detail":"订单明细",
      "other_info":"其它信息",
      "save":"保存",
      "sync_product_info":"同步产品信息",
      "change_give_date":"修改采购交期",
      "import":"导入",
      "verify":"审核",
      "reset":"重置",
      "confirm":"确认",
      "refuse":"确认拒绝",
      "verify_mome":"备注"
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
