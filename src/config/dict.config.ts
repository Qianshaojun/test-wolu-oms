// 客户状态
export const CustomerStatus = [
    {
        label: 'dict.customer-status.pending',
        value: 10
    },
    {
        label: 'dict.customer-status.reject',
        value: 20
    },
    {
        label: 'dict.customer-status.accept',
        value: 30
    },
    {
        label: 'dict.customer-status.suspend',
        value: 100
    }
]

// seller instance 状态
export const SellerInstanceStatus = [
    {
        label: 'dict.seller-instance-status.draft',
        value: 10
    },
    {
        label: 'dict.seller-instance-status.active',
        value: 20
    },
    {
        label: 'dict.seller-instance-status.cancel',
        value: 60
    },
    {
        label: 'dict.seller-instance-status.suspend',
        value: 100
    },
    {
        label: 'dict.seller-instance-status.inactive',
        value: 200
    }
]

// seller platform
export const SellerPlatform = [
    {
        label: 'dict.seller-platform.b2c',
        value: 10
    },
    {
        label: 'dict.seller-platform.amz',
        value: 20
    },
    {
        label: 'dict.seller-platform.eBay',
        value: 30
    },
    {
        label: 'dict.seller-platform.wish',
        value: 40
    },
    {
        label: 'dict.seller-platform.cd',
        value: 50
    },
    {
        label: 'dict.seller-platform.aliexpress',
        value: 60
    },
    {
        label: 'dict.seller-platform.wayfair',
        value: 100
    }
]

// 产品销售趋势仓库分类
export const WarehouseId = [
    {
        label: 'dict.warehouse_id.de',
        value: 'de'
    },
    {
        label: 'dict.warehouse_id.uk',
        value: 'uk'
    },
    {
        label: 'dict.warehouse_id.us',
        value: 'us'
    }
]
// 产品预售类型分类
export const PresaleType = [
    {
        label: 'dict.presale_type.type_category',
        value: 10
    },
    {
        label: 'dict.presale_type.type_sku',
        value: 20
    }
]
// 产品是否预售
export const IsPresale = [
    {
        label: 'dict.is_presale.type_true',
        value: true
    },
    {
        label: 'dict.is_presale.type_false',
        value: false
    }
]
//  产品补货状态
export const PurchaseStatus = [
    {
        label: 'dict.purchase_status.not',
        value: 10
    },
    {
        label: 'dict.purchase_status.need',
        value: 20
    },
    {
        label: 'dict.purchase_status.purchased',
        value: 30
    },
    {
        label: 'dict.purchase_status.cancel',
        value: 40
    }
]
//  产品补货预测状态
export const PredictStatus = [
    {
        label: 'dict.predict_status.new',
        value: 10
    },
    {
        label: 'dict.predict_status.active',
        value: 30
    },
    {
        label: 'dict.predict_status.confirmed',
        value: 50
    },
    {
        label: 'dict.predict_status.completed',
        value: 70
    },
    {
        label: 'dict.predict_status.returned',
        value: 100
    },
    {
        label: 'dict.predict_status.refused',
        value: 200
    }
]
//  产品补货预测状态
export const PredictStatusConfirm = [
    {
        label: 'dict.predict_status.active',
        value: 30
    },
    {
        label: 'dict.predict_status.confirmed',
        value: 50
    },
    {
        label: 'dict.predict_status.completed',
        value: 70
    },
    {
        label: 'dict.predict_status.returned',
        value: 100
    },
    {
        label: 'dict.predict_status.refused',
        value: 200
    }
]
//  产品补货预测状态
export const PredictStatusApprove = [
    {
        label: 'dict.predict_status.confirmed',
        value: 50
    },
    {
        label: 'dict.predict_status.completed',
        value: 70
    },
    {
        label: 'dict.predict_status.refused',
        value: 200
    }
]
//  查询类型
export const SearchType = [
    {
        label: 'dict.search_type.normal',
        value: 10
    },
    {
        label: 'dict.search_type.favourite',
        value: 20
    }
]
//  订单类型
export const OrderStatus = [
    {
        label: 'dict.state.draft',
        value: 'draft'
    },
    {
        label: 'dict.state.sale',
        value: 'sale'
    },
    {
        label: 'dict.state.done',
        value: 'done'
    },
    {
        label: 'dict.state.cancel',
        value: 'cancel'
    }
]
//  包裹规格
export const PackageSize = [
    {
        label: 'dict.package_size.small',
        value: 's'
    },
    {
        label: 'dict.package_size.medium',
        value: 'm'
    },
    {
        label: 'dict.package_size.large',
        value: 'l'
    }
]
//  包裹规格
export const WarehouseList = [
    {
        label: 'dict.warehouse_list.de',
        value: 'de'
    },
    {
        label: 'dict.warehouse_list.uk',
        value: 'uk'
    },
    {
        label: 'dict.warehouse_list.uk_own',
        value: 'uk_own'
    },
    {
        label: 'dict.warehouse_list.fr',
        value: 'fr'
    },
    {
        label: 'dict.warehouse_list.zqlc',
        value: 'zqlc'
    }
]
//  订单类型
export const OrderType = [
    {
        label: 'dict.order_type.a',
        value: 'A'
    },
    {
        label: 'dict.order_type.r',
        value: 'R'
    },
    {
        label: 'dict.order_type.g',
        value: 'G'
    },
    {
        label: 'dict.order_type.service',
        value: 'Service'
    }
]
//  shipping policy
export const ShippingPolicy = [
    {
        label: 'dict.shipping_policy.one',
        value: 'one'
    },
    {
        label: 'dict.shipping_policy.direct',
        value: 'direct'
    }
]
//  invoice policy
export const InvoicePolicy = [
    {
        label: 'dict.invoice_policy.order',
        value: 'order'
    },
    {
        label: 'dict.invoice_policy.delivery',
        value: 'delivery'
    }
]
//违规词汇
export const illegalWords = [
    {
        label: 'dict.illegal_words.active',
        value: 20
    },
    {
        label: 'dict.illegal_words.cancel',
        value: 60
    }
]
//  picking类型
export const PickingStatus = [
    {
        label: 'dict.picking_state.draft',
        value: 'draft'
    },
    {
        label: 'dict.picking_state.waiting',
        value: 'waiting'
    },
    {
        label: 'dict.picking_state.confirmed',
        value: 'confirmed'
    },
    {
        label: 'dict.picking_state.partially_available',
        value: 'partially_available'
    },
    {
        label: 'dict.picking_state.assigned',
        value: 'assigned'
    },
    {
        label: 'dict.picking_state.done',
        value: 'done'
    },
    {
        label: 'dict.picking_state.cancel',
        value: 'cancel'
    }
]
//picking 有效状态
export const PickingValidateState = [
    {
        label: 'dict.picking_validate_status.no_validate',
        value: 'no validate'
    },
    {
        label: 'dict.picking_validate_status.error',
        value: 'error'
    },
    {
        label: 'dict.picking_validate_status.ok',
        value: 'ok'
    }
]

//picking 发票发送状态
export const InvoiceSendStatus = [
    {
        label: 'dict.invoice_send_status.waiting',
        value: '0'
    },
    {
        label: 'dict.invoice_send_status.done',
        value: '1'
    },
    {
        label: 'dict.invoice_send_status.query',
        value: '-1'
    },
    {
        label: 'dict.invoice_send_status.create_invoice',
        value: '-2'
    },
    {
        label: 'dict.invoice_send_status.partner_email',
        value: '-3'
    },
    {
        label: 'dict.invoice_send_status.no_order',
        value: '-4'
    },
    {
        label: 'dict.invoice_send_status.no_template',
        value: '-10'
    },
    {
        label: 'dict.picking_validate_status.other',
        value: -100
    }
]

//picking 有效状态
export const Operators = [
    {
        label: '>',
        value: '>'
    },
    {
        label: '=',
        value: '='
    },
    {
        label: '<',
        value: '<'
    },
    {
        label: '>=',
        value: '>='
    },
    {
        label: '<=',
        value: '<='
    },
    {
        label: '!=',
        value: '!='
    },
    {
        label: 'or',
        value: '|'
    },
    {
        label: 'prefix_like',
        value: 'prefix_like'
    },
    {
        label: 'like',
        value: 'like'
    },
    {
        label: 'not like',
        value: 'not like'
    },
    {
        label: 'suffix_like',
        value: 'suffix_like'
    },
    {
        label: 'ilike', //包含
        value: 'ilike'
    },
    {
        label: 'not ilike',
        value: 'not ilike'
    },
    {
        label: 'null', //未设置
        value: 'null'
    },
    {
        label: 'not null',
        value: 'not null'
    },
    {
        label: 'in',
        value: 'in'
    },
    {
        label: 'not in',
        value: 'not in'
    },
    {
        label: 'regular_exp',
        value: 'regular_exp'
    },
    {
        label: 'not regular_exp',
        value: 'not regular_exp'
    },
    {
        label: 'SQL_QC',
        value: 'sql_query'
    },
    {
        label: 'SQL_QC_Para',
        value: 'sql_query_para'
    }
]
//Email Group 状态
export const EmailGroupStatus = [
    {
        label: 'dict.email_group_status.active',
        value: 20
    },
    {
        label: 'dict.email_group_status.stop',
        value: 200
    }
]
//  产品类型
export const ProductType = [
    {
        label: 'dict.product_type.consu',
        value: 'consu'
    },
    {
        label: 'dict.product_type.product',
        value: 'product'
    },
    {
        label: 'dict.product_type.service',
        value: 'service'
    }
]
//  海运费货运状态
export const OceanShipStatus = [
    {
        label: 'dict.ocean_ship_status.ship',
        value: 'ship'
    },
    {
        label: 'dict.ocean_ship_status.process',
        value: 'process'
    },
    {
        label: 'dict.ocean_ship_status.waiting',
        value: 'waiting'
    },
    {
        label: 'dict.ocean_ship_status.wait',
        value: 'wait'
    },
    {
        label: 'dict.ocean_ship_status.land',
        value: 'land'
    }
]
//  货运状态
export const ShipStatus = [
    {
        label: 'dict.ship_status.confirm',
        value: 'confirm'
    },
    {
        label: 'dict.ship_status.approved',
        value: 'approved'
    },
    {
        label: 'dict.ship_status.ship',
        value: 'ship'
    },
    {
        label: 'dict.ship_status.process',
        value: 'process'
    },
    {
        label: 'dict.ship_status.waiting',
        value: 'waiting'
    },
    {
        label: 'dict.ship_status.wait',
        value: 'wait'
    },
    {
        label: 'dict.ship_status.land',
        value: 'land'
    }
]
//  补发类型
export const ReissueType = [
    {
        label: 'dict.reissue_type.complete',
        value: 'one'
    },
    {
        label: 'dict.reissue_type.part',
        value: 'part'
    }
]
// 补货类型
export const ReplenishmentType = [
    {
        label: 'dict.replenishment_type.operational',
        value: 'operational'
    },
    {
        label: 'dict.replenishment_type.development',
        value: 'development'
    },
    {
        label: 'dict.replenishment_type.abnormal_purchase',
        value: 'abnormal_purchase'
    }
]
// 补货需求状态
export const ReplenishmentState = [
    {
        label: 'dict.replenishment_state.draft',
        value: 'draft'
    },
    {
        label: 'dict.replenishment_state.to_approve',
        value: 'to approve'
    },
    {
        label: 'dict.replenishment_state.approved',
        value: 'approved'
    },
    {
        label: 'dict.replenishment_state.order',
        value: 'order'
    },
    {
        label: 'dict.replenishment_state.approved_order',
        value: 'approved/order'
    },
    {
        label: 'dict.replenishment_state.done',
        value: 'done'
    },
    {
        label: 'dict.replenishment_state.cancel',
        value: 'cancel'
    },
    {
        label: 'dict.replenishment_state.refuse',
        value: 'refuse'
    }
]

// 补货类型
export const PackageOrderState = [
    {
        label: 'dict.package_order_state.draft',
        value: 'draft'
    },
    {
        label: 'dict.package_order_state.confirm',
        value: 'confirm'
    },
    {
        label: 'dict.package_order_state.approved',
        value: 'approved'
    },
    {
        label: 'dict.package_order_state.ship',
        value: 'ship'
    },
    {
        label: 'dict.package_order_state.process',
        value: 'process'
    },
    {
        label: 'dict.package_order_state.waiting',
        value: 'waiting'
    },
    {
        label: 'dict.package_order_state.wait',
        value: 'wait'
    },
    {
        label: 'dict.package_order_state.land',
        value: 'land'
    },
    {
        label: 'dict.package_order_state.cancel',
        value: 'cancel'
    }
]

// 补货类型
export const PurchaseContractState = [
    {
        label: 'dict.purchase_contract_state.draft',
        value: 'draft'
    },
    {
        label: 'dict.purchase_contract_state.confirm',
        value: 'confirm'
    },
    {
        label: 'dict.purchase_contract_state.approved',
        value: 'approved'
    },
    {
        label: 'dict.purchase_contract_state.done',
        value: 'done'
    },
    {
        label: 'dict.purchase_contract_state.refuse',
        value: 'refuse'
    }
]

// 补货类型
export const PurchaseShipOrderState = [
    {
        label: 'dict.purchase_contract_state.draft',
        value: 'draft'
    },
    {
        label: 'dict.purchase_contract_state.confirm',
        value: 'confirm'
    },
    {
        label: 'dict.purchase_contract_state.approved',
        value: 'approved'
    },
    {
        label: 'dict.purchase_contract_state.done',
        value: 'done'
    },
    {
        label: 'dict.purchase_contract_state.cancel',
        value: 'cancel'
    }
]

// 尾程运费涉及站点
export const FinalShipSite = [
    {
        label: 'dict.final_ship_site.de',
        value: 'de'
    },
    {
        label: 'dict.final_ship_site.fr',
        value: 'fr'
    },
    {
        label: 'dict.final_ship_site.es',
        value: 'es'
    },
    {
        label: 'dict.final_ship_site.it',
        value: 'it'
    },
    {
        label: 'dict.final_ship_site.nl',
        value: 'nl'
    },
    {
        label: 'dict.final_ship_site.se',
        value: 'se'
    },
    {
        label: 'dict.final_ship_site.pl',
        value: 'pl'
    },
    {
        label: 'dict.final_ship_site.at',
        value: 'at'
    },
    {
        label: 'dict.final_ship_site.be',
        value: 'be'
    },
    {
        label: 'dict.final_ship_site.lu',
        value: 'lu'
    }
]

// 补货状态
export const SkuReplenishState = [
    {
        label: 'dict.sku_replenish_state.no',
        value: 10
    },
    {
        label: 'dict.sku_replenish_state.single',
        value: 30
    },
    {
        label: 'dict.sku_replenish_state.merge',
        value: 20
    }
]

// 销售状态
export const SaleState = [
    {
        label: 'dict.sale_state.normal',
        value: 10
    },
    {
        label: 'dict.sale_state.weed_out',
        value: 100
    },
    {
        label: 'dict.sale_state.infringement',
        value: 50
    },
    {
        label: 'dict.sale_state.to_be_seen',
        value: 20
    }
]

// 物流商状态
export const LogisticsProviderState = [
    {
        label: 'dict.logistics_provider_state.active',
        value: 'active'
    },
    {
        label: 'dict.logistics_provider_state.inactive',
        value: 'inactive'
    }
]

// 物流商时效
export const LogisticsProviderAging = [
    {
        label: 'dict.logistics_provider_aging.air',
        value: 'air'
    },
    {
        label: 'dict.logistics_provider_aging.truck',
        value: 'truck'
    },
    {
        label: 'dict.logistics_provider_aging.rail',
        value: 'rail'
    },
    {
        label: 'dict.logistics_provider_aging.sea',
        value: 'sea'
    },
    {
        label: 'dict.logistics_provider_aging.delivery',
        value: 'delivery'
    }
]

// 物流商时效
export const UnsalableApproveState = [
    {
        label: 'dict.unsalable_approve_state.approved',
        value: 'approved'
    },
    {
        label: 'dict.unsalable_approve_state.wait_approve',
        value: 'wait_approve'
    }
]
// 预调价审核状态
export const PreProdPriceApproveState = [
    {
        label: 'dict.pre_prod_price_approve_state.pre_approve',
        value: 10
    },
    {
        label: 'dict.pre_prod_price_approve_state.passed',
        value: 20
    },
    {
        label: 'dict.pre_prod_price_approve_state.not_passed',
        value: 30
    },
    {
        label: 'dict.pre_prod_price_approve_state.time_out',
        value: 40
    }
]
// 产品状态
export const ProdStatus = [
    {
        label: 'dict.prod_status.sale',
        value: 'sale'
    },
    {
        label: 'dict.prod_status.stop',
        value: 'stop'
    },
    {
        label: 'dict.prod_status.waiting',
        value: 'waiting'
    },
    {
        label: 'dict.prod_status.sz_prod',
        value: 'sz_prod'
    },
    {
        label: 'dict.prod_status.uk_sale',
        value: 'uk_sale'
    },
    {
        label: 'dict.prod_status.tort_stop',
        value: 'tort_stop'
    }
]
// 产品状态
export const ShippingPlanState = [
    {
        label: 'dict.shipping_plan_state.draft',
        value: 'draft'
    },
    {
        label: 'dict.shipping_plan_state.confirm',
        value: 'confirm'
    },
    {
        label: 'dict.shipping_plan_state.assigned',
        value: 'assigned'
    }
]
// 核价产品状态
export const PriceCheckProdStatus = [
    {
        label: 'dict.price_check_prod_status.sale',
        value: 10
    },
    {
        label: 'dict.price_check_prod_status.waiting',
        value: 20
    },
    {
        label: 'dict.price_check_prod_status.tort_stop',
        value: 50
    },
    {
        label: 'dict.price_check_prod_status.stop',
        value: 100
    }
]
// 产品状态
export const CheckProdStatus = [
    {
        label: 'dict.check_prod_status.sale',
        value: 10
    },
    {
        label: 'dict.check_prod_status.waiting',
        value: 20
    },
    {
        label: 'dict.check_prod_status.tort_stop',
        value: 50
    },
    {
        label: 'dict.check_prod_status.stop',
        value: 100
    },
    {
        label: 'dict.check_prod_status.not_onshelf',
        value: 200
    },
    {
        label: 'dict.check_prod_status.no_stop',
        value: 10000
    }
]
// 邮件状态
export const SentEmailStatus = [
    {
        label: 'dict.sent_email_state.outgoing',
        value: 'outgoing'
    },
    {
        label: 'dict.sent_email_state.sent',
        value: 'sent'
    },
    {
        label: 'dict.sent_email_state.received',
        value: 'received'
    },
    {
        label: 'dict.sent_email_state.exception',
        value: 'exception'
    },
    {
        label: 'dict.sent_email_state.cancel',
        value: 'cancel'
    }
]
// 补货状态
export const PurchasePriceChangeReportStatus = [
    {
        label: 'dict.purchase_price_change_report_status.pre_handled',
        value: 10
    },
    {
        label: 'dict.purchase_price_change_report_status.handled',
        value: 20
    },
    {
        label: 'dict.purchase_price_change_report_status.price_adjusted',
        value: 30
    },
    {
        label: 'dict.purchase_price_change_report_status.no_handled',
        value: 40
    }
]
// DEPO状态
export const DePoState = [
    {
        label: 'dict.de_po_state.draft',
        value: 'draft'
    },
    {
        label: 'dict.de_po_state.confirmed',
        value: 'confirmed'
    },
    {
        label: 'dict.de_po_state.cancel',
        value: 'cancel'
    }
]
