<template>
    <section class="component edit-customer">
        <data-form
            :extends="extendItems"
            ref="dataForm"
            @submit="getOrderList"
            :column="2"
            :lCol="{ span: 7 }"
            :wCol="{ span: 16, offset: 1 }"
            :showSearch="showSearch"
            @heightChange="onHeightChange"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('forms.picking_id')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['name', { initialValue: defaultName }]"
                        :style="{ width: '300px' }"
                        size="small"
                        :placeholder="$t('split_query_condition')"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.order_id')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['origin']"
                        :style="{ width: '300px' }"
                        size="small"
                        :placeholder="$t('split_query_condition')"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.quick_search')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="[
                            'fuzzy_search_code',
                            { initialValue: 30 }
                        ]"
                        :style="{ width: '100px' }"
                        size="small"
                    >
                        <a-select-option :value="10">
                            {{ $t('forms.picking_id') }}
                        </a-select-option>
                        <a-select-option :value="20">
                            {{ $t('forms.order_id') }}
                        </a-select-option>
                        <a-select-option :value="30">
                            Email
                        </a-select-option>
                        <a-select-option :value="40">
                            {{ $t('forms.sku') }}
                        </a-select-option>
                        <a-select-option :value="50">
                            {{ $t('forms.shipment_num') }}
                        </a-select-option>
                        <a-select-option :value="60">
                            {{ $t('forms.ebay_buyer_id') }}
                        </a-select-option>
                        <a-select-option :value="70">
                            {{ $t('columns.customer') }}
                        </a-select-option>
                        <a-select-option :value="80">
                            {{ $t('columns.zip') }}
                        </a-select-option>
                        <a-select-option :value="90">
                            {{ $t('columns.street') }}
                        </a-select-option>
                    </a-select>
                    <a-input
                        v-decorator="['fuzzy_search_value']"
                        :style="{ width: '195px', margin: '0 5px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    ></a-input>
                    <a-select
                        v-decorator="[
                            'fuzzy_search_operator',
                            { initialValue: 20 }
                        ]"
                        :style="{ width: '100px' }"
                        size="small"
                    >
                        <a-select-option :value="10">
                            {{ $t('forms.operator_like') }}
                        </a-select-option>
                        <a-select-option :value="20">
                            {{ $t('forms.operator_equal') }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.sku')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['default_code']"
                        :style="{ width: '300px' }"
                        size="small"
                        :placeholder="$t('split_query_condition')"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.validate_state')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['validate_s', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onStatusChange(e)"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of $dict.PickingValidateState"
                            :key="item.value"
                            >{{ $t(item.label) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.payment_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        v-decorator="['payment_date']"
                        show-time
                        :style="{ width: '300px' }"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                    <a-button
                        @click="fillToday"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.today') }}
                    </a-button>
                    <a-button
                        @click="fillYestoday"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.yestoday') }}
                    </a-button>
                    <a-button
                        @click="fill3day"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.3day') }}
                    </a-button>
                    <a-button
                        @click="fill3days"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.3days') }}
                    </a-button>
                </a-form-item>
            </template>
            <!--折叠显示项-->
            <template #collapse>
                <a-form-item
                    :label="$t('columns.status')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['state', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onStatusChange(e)"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of $dict.PickingStatus"
                            :key="item.value"
                            >{{ $t(item.label) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="Email" style="height:35px;margin:0;">
                    <a-input
                        v-decorator="['email']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.seller_code')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['seller_code', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        mode="multiple"
                        size="small"
                        placeholder="Please Select"
                        :filter-option="filterOption"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of sellerCodeList"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.instance_code')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['instance_code', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Please Select"
                        mode="multiple"
                        :filter-option="filterOption"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of sellerInstanceList"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.prime')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['amazon_type_sale', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true">
                            {{ $t('yes') }}
                        </a-radio-button>
                        <a-radio-button :value="false">
                            {{ $t('no') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.pre_sale')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['pick_pre_sale', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true">
                            {{ $t('yes') }}
                        </a-radio-button>
                        <a-radio-button :value="false">
                            {{ $t('no') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>

                <a-form-item
                    :label="$t('forms.is_resend')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['is_resend', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true">
                            {{ $t('yes') }}
                        </a-radio-button>
                        <a-radio-button :value="false">
                            {{ $t('no') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.ebay_plus')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['ebay_plus_type', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true">
                            {{ $t('yes') }}
                        </a-radio-button>
                        <a-radio-button :value="false">
                            {{ $t('no') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.sold_out')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'is_sold_out',
                            { initialValue: defaultSaleOut }
                        ]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onSaleOutChange(e)"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true">
                            {{ $t('yes') }}
                        </a-radio-button>
                        <a-radio-button :value="false">
                            {{ $t('no') }}
                        </a-radio-button>
                    </a-radio-group>
                    <a-range-picker
                        v-if="defaultSaleOut"
                        v-decorator="['sold_out_time']"
                        format="YYYY-MM-DD HH:mm:ss"
                        style="margin-left:5px;"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('forms.shipment_num')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['shipment_num']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.order_from')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['platform', { initialValue: 60 }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        v-if="page_flag == 'aliexpress'"
                    >
                        <a-radio-button :value="60">
                            Aliexpress
                        </a-radio-button>
                    </a-radio-group>
                    <a-radio-group
                        v-decorator="['platform', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onStatusChange(e)"
                        v-else
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of $dict.SellerPlatform"
                            :key="item.value"
                            >{{ $t(item.label) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.ship_type')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['mv_ship_type', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of shipmentList"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.latest_ship_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['latest_ship_date_new']"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('forms.create_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['create_date']"
                        format="YYYY-MM-DD HH:mm:ss"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('forms.ebay_buyer_id')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['ebay_buyer_id']"
                        :style="{ width: '300px' }"
                        size="small"
                        :placeholder="$t('split_query_condition')"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.assign_to_user')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['assign_to_user', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        :filter-option="filterOption"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of customerServiceUser"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-button
                    type="primary"
                    @click="reserve"
                    :disabled="!selectedRowKeys.length"
                >
                    {{ $t('action.reserved') }}
                </a-button>
                <a-button
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="validateAddress"
                    >{{ $t('action.validate_address') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="createShipment"
                    :disabled="!selectedRowKeys.length"
                >
                    {{ $t('action.auto_create') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="donePickingGetLabel"
                    style="display:none"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.done_picking_get_label') }}
                </a-button>
                <a-button
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="modifyAddress"
                    >{{ $t('action.modify_address') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="fake_shipments"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.fake_shipment') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="upload_shipment"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.upload_shipment') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="upload_fake_shipment"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.upload_fake_shipment') }}
                </a-button>
                <a-button
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="createReturn"
                    >{{ $t('action.createReturn') }}
                </a-button>
                <a-button
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="deliveryMore"
                    >{{ $t('action.deliveryMore') }}
                </a-button>
                <a-button
                    v-show="
                        data.length > 0 &&
                            selectedRowKeys.length &&
                            data.find(x => x['id'] == selectedRowKeys[0]) &&
                            data.find(x => x['id'] == selectedRowKeys[0])[
                                'is_resend'
                            ]
                    "
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="productPart"
                    >{{ $t('action.ProductPart') }}
                </a-button>
                <a-button
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="multiCreateInvoice"
                >
                    {{ $t('action.create_invovice') }}
                </a-button>
                <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay">
                        <a-menu-item
                            type="primary"
                            @click="createShipmentByType('dhl')"
                            :disabled="!selectedRowKeys.length"
                        >
                            {{ $t('action.create_dhl') }}
                        </a-menu-item>
                        <a-menu-item
                            type="primary"
                            @click="createShipmentByType('dpd')"
                            :disabled="!selectedRowKeys.length"
                        >
                            {{ $t('action.create_dpd') }}
                        </a-menu-item>
                        <a-menu-item
                            type="primary"
                            @click="createShipmentByType('gls')"
                            :disabled="!selectedRowKeys.length"
                        >
                            {{ $t('action.create_gls') }}
                        </a-menu-item>
                        <a-menu-item
                            type="primary"
                            @click="createShipmentByType('brief')"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.create_brief') }}
                        </a-menu-item>
                        <a-menu-item
                            type="primary"
                            @click="createGift()"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.create_gift') }}
                        </a-menu-item>                        
                        <!-- <a-menu-item
                            type="primary"
                            :disabled="!selectedRowKeys.length"
                            @click="modifyAddress"
                            >{{ $t('action.modify_address') }}</a-menu-item
                        >
                        <a-menu-item
                            type="primary"
                            :disabled="!selectedRowKeys.length"
                            @click="forceVerifyAddress"
                            >{{
                                $t('action.force_verify_address')
                            }}</a-menu-item
                        > -->
                        <a-menu-item
                            type="primary"
                            :disabled="!selectedRowKeys.length"
                            @click="batchSendEmail"
                            >{{ $t('action.batch_send_email') }}
                        </a-menu-item>
                        <a-menu-item
                            type="primary"
                            @click="assignToUser"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.assign_to_user') }}
                        </a-menu-item>
                        <a-menu-item
                            :disabled="selectedRowKeys.length == 0"
                            @click="viewAmazonInvoicePDF"
                            >{{ $t('action.viewAmazonInvoicePDF') }}
                        </a-menu-item>
                        <a-menu-item
                            :disabled="!selectedRowKeys.length"
                            @click="makeDone"
                            v-auth="'make_done'"
                            >{{ $t('action.make_done') }}
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 2px"
                        >Action
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown>
                <a-dropdown :trigger="['click']" ref="dropdown">
                    <a-menu slot="overlay">
                        <a-menu-item
                            @click="deletePicking"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.deletePicking') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="cancelPicking"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.cancelPicking') }}
                        </a-menu-item>
                        <!-- <a-menu-item
                            @click="cancelOrder"
                            :disabled="selectedRowKeys.length != 1"
                            >{{ $t('action.cancelOrder') }}</a-menu-item
                        > -->
                        <a-menu-item
                            @click="setAsDraft"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.setAsDraft') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="setPresale"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.setPresale') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="cancelPresale"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.cancelPresale') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="markSoldOut"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.markSoldOut') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="cancelSoldOut"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.cancelSoldOut') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="checkShipments"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.checkShipmentCount') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="cancelCheckShipments"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.cancelShipmentCount') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="forceAvailability"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.force_available') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="OnRefund"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.refund') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="createCPofAllProduct"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.createCp') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="serviceProcess"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.serviceProcess') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="returnProcess"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.returnProcess') }}
                        </a-menu-item>

                        <a-menu-item
                            :disabled="!selectedRowKeys.length"
                            @click="showStopConfirm"
                            >{{ $t('action.customer_service_stop_plz') }}
                        </a-menu-item>

                        <a-menu-item
                            :disabled="!selectedRowKeys.length"
                            @click="showRefundConfirm"
                            >{{
                                $t(
                                    'action.cancel_stock_picking_for_order_refund'
                                )
                            }}
                        </a-menu-item>
                        <!--                        <a-popconfirm-->
                        <!--                            :title=""-->
                        <!--                            :okText="$t('action.ok')"-->
                        <!--                            :cancelText="$t('action.cancel')"-->
                        <!--                            placement="left"-->
                        <!--                            @confirm="customer_service_stop_plz"-->
                        <!--                            :disabled="!selectedRowKeys.length"-->
                        <!--                            trigger="contextmenu"-->
                        <!--                        >-->
                        <!--                           -->
                        <!--                        </a-popconfirm>-->
                        <!--                        <a-popconfirm-->
                        <!--                            :title="$t('action.confirm_operate_refund_order')"-->
                        <!--                            :okText="$t('action.ok')"-->
                        <!--                            :cancelText="$t('action.cancel')"-->
                        <!--                            placement="left"cancel_stock_picking_for_order_refund-->
                        <!--                            @confirm=""-->
                        <!--                            :disabled="!selectedRowKeys.length"-->
                        <!--                        >-->
                        <!--                        -->
                        <!--                        </a-popconfirm>-->
                    </a-menu>
                    <a-button style="margin-left: 2px"
                        >{{ $t('action.more_btn') }}
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown>
            </template>
        </data-form>
        <DragArea :formShow="isDataFormShow" @traggle="onDragChange">
            <template #up>
                <div v-if="!groupbyList.length">
                    <AutoColumnTable
                        :stripe="true"
                        :data="data"
                        :page="pageService"
                        :queryNameAuth="allNameAuth"
                        rowKey="id"
                        :columns="columnList"
                        :rowSelection="{
                            selectedRowKeys: selectedRowKeys,
                            onChange: keys => (selectedRowKeys = keys)
                        }"
                        @on-page-change="getOrderList"
                        @onClick="
                            record => {
                                selectedRowKeys = [record]
                                onTrClick(record)
                            }
                        "
                        @tbchange="onTableChange"
                        :scroll="{ x: 1800, y: formDivHeight }"
                        :queryUrl="queryUrl"
                        :menu_code="dataForm.menu_code"
                        :queryCondition="queryConsition"
                        :selectedRowCnt="selectedRowKeys.length"
                    >
                        <span slot="check_render" slot-scope="text"
                            ><a-checkbox disabled :checked="text" />
                        </span>
                        <span slot="lock" slot-scope="text, row"
                            ><a-icon
                                type="lock"
                                v-if="
                                    row.state == 'done' &&
                                        row.updated_in_platform
                                "
                                style="margin-right:10px;"
                            />
                        </span>
                        <span
                            slot="show_message_tips"
                            slot-scope="text"
                            :title="text"
                        >
                            {{
                                text
                                    ? text.length > 20
                                        ? text.substr(0, 17) + '...'
                                        : text
                                    : ''
                            }}
                        </span>
                        <template slot="color_render" slot-scope="text, row">
                            <span :class="calcStyle(row)">
                                {{ text != null ? text : '' }}
                            </span>
                        </template>
                        <span slot="date_render" slot-scope="text"
                            >{{ text | datetolocal }}
                        </span>
                        <template slot="name" slot-scope="text, row">
                            <span :class="calcStyle(row)">{{
                                row.name ? row.name : ''
                            }}</span>
                            <a-icon
                                type="file-text"
                                @click="showDetailPage(row)"
                                style="margin-left:10px;color:blue;"
                            />
                        </template>
                        <template slot="product_name" slot-scope="textr, row">
                            <span
                                :class="calcStyle(row)"
                                :title="row.product_name"
                            >
                                {{
                                    row.product_name
                                        ? row.product_name.substr(0, 15) +
                                          (row.product_name.length > 15
                                              ? '...'
                                              : '')
                                        : ''
                                }}
                            </span>
                        </template>
                        <template slot="instance_code" slot-scope="text, row">
                            <span :class="calcStyle(row)">
                                {{
                                    row.instance_code
                                        ? sellerInstanceDict[row.instance_code]
                                        : ''
                                }}
                            </span>
                        </template>
                        <template slot="origin" slot-scope="text, row">
                            <a @click="toPageOrder(row.origin)">{{
                                row.origin ? row.origin : ''
                            }}</a>
                        </template>
                        <template slot="memo" slot-scope="text, row">
                            <a
                                :title="row.memo"
                                style="color:blue"
                                @click="onEditMemo(row)"
                            >
                                {{
                                    row.memo ? row.memo.substr(0, 10) : $t('no')
                                }}
                            </a>
                        </template>
                        <template slot="state" slot-scope="text, row">
                            <span :class="calcStyle(row)">{{
                                row.state
                                    ? row.state
                                    : '' | dict('PickingStatus') | translate
                            }}</span>
                        </template>
                        <template slot="user_render" slot-scope="text">
                            <span v-if="!text"></span>
                            <span v-else>{{ text | dict2(systemUsers) }}</span>
                        </template>
                    </AutoColumnTable>
                </div>
                <GroupbyTable
                    v-else
                    ref="groupbyTable"
                    :groupByColumn="groupbyList"
                    :oColumns="columnList"
                    :queryNameAuth="allNameAuth"
                    :urlStr="queryUrl"
                    @selectChange="onSelectChange"
                    :scrollX="1800"
                    :scrollY="formDivHeight"
                    @rowClick="onTrClick"
                >
                    <span slot="check_render" slot-scope="text"
                        ><a-checkbox disabled :checked="text" />
                    </span>
                    <span
                        slot="show_message_tips"
                        slot-scope="text"
                        :title="text"
                    >
                        {{
                            text
                                ? text.length > 20
                                    ? text.substr(0, 17) + '...'
                                    : text
                                : ''
                        }}
                    </span>
                    <template slot="color_render" slot-scope="text, row">
                        <span :class="calcStyle(row)">
                            {{ text != null ? text : '' }}
                        </span>
                    </template>
                    <span slot="lock" slot-scope="text, row"
                        ><a-icon
                            type="lock"
                            v-if="row.state == 'done'"
                            style="margin-right:10px;"
                        />
                    </span>
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <template slot="name" slot-scope="text, row">
                        <span :class="calcStyle(row)">{{
                            row.name ? row.name : ''
                        }}</span>
                        <a-icon
                            type="file-text"
                            @click="showDetailPage(row)"
                            style="margin-left:10px;color:blue;"
                        />
                    </template>
                    <template slot="product_name" slot-scope="textr, row">
                        <span :class="calcStyle(row)" :title="row.product_name">
                            {{
                                row.product_name
                                    ? row.product_name.substr(0, 15) +
                                      (row.product_name.length > 15
                                          ? '...'
                                          : '')
                                    : ''
                            }}
                        </span>
                    </template>
                    <template slot="instance_code" slot-scope="text, row">
                        <span :class="calcStyle(row)">
                            {{
                                row.instance_code
                                    ? sellerInstanceDict[row.instance_code]
                                    : ''
                            }}
                        </span>
                    </template>
                    <template slot="origin" slot-scope="text, row">
                        <a @click="toPageOrder(row.origin)">{{
                            row.origin ? row.origin : ''
                        }}</a>
                    </template>
                    <template slot="memo" slot-scope="text, row">
                        <a
                            :title="row.memo"
                            style="color:blue"
                            @click="onEditMemo(row)"
                        >
                            {{ row.memo ? row.memo.substr(0, 10) : $t('no') }}
                        </a>
                    </template>
                    <template slot="state" slot-scope="text, row">
                        <span :class="calcStyle(row)">{{
                            row.state
                                ? row.state
                                : '' | dict('PickingStatus') | translate
                        }}</span>
                    </template>
                    <template slot="user_render" slot-scope="text">
                        <span v-if="!text"></span>
                        <span v-else>{{ text | dict2(systemUsers) }}</span>
                    </template>
                </GroupbyTable>
            </template>
            <template #down>
                <PickingDetail
                    :detail="detailInfo"
                    :id="picking_id"
                    :pageShow="false"
                    :cnt="changeCnt"
                    :countryList="countryList"
                    :systemUsers="systemUsers"
                    :divHeight="detailDivHeight"
                ></PickingDetail>
            </template>
        </DragArea>
    </section>
</template>

<style>
.red-text {
    color: red;
}

.blue-text {
    color: blue;
}

.green-text {
    color: green;
}

.gray-text {
    color: rgba(129, 127, 127, 0.719);
}

.default-text {
    color: #333;
}
</style>

<script lang="tsx">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { PickingService } from '~/services/picking.service'
import { ShipmentService } from '~/services/shipment.service'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import PickingDetail from '~/components/picking/picking-detail.vue'
import CreateReturn from '~/components/picking/create-return.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { SellerInstanceService } from '~/services/seller-instance.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import BatchSendEmail from '@/components/picking/batch-send-email.vue'
import DeliveryMore from '@/components/picking/delivery-more.vue'
import ProductPart from '@/components/picking/product-part.vue'
import AssignUser from '@/components/picking/assign_user.vue'
import DragArea from '~/shared/components/drag-area.vue'
import RefundForm from '~/components/common/refund-form.vue'
import { GeneralCodeService } from '../../services/general_code.service'
import moment from 'moment'
import { EmailService } from '~/services/cs-email.service'
import { AccountService } from '../../services/account.service'
import { UserService } from '@/services/user.service'
import appConfig from '@/config/app.config'
import PickingModifyMemo from './picking-modify-memo.vue'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import CancelOrderForm from '~/components/orders/cancel-order-form.vue'

const userModule = namespace('userModule')
const datasModule = namespace('datasModule')

@Component({
    components: {
        CancelOrderForm,
        PickingDetail,
        BatchSendEmail,
        CreateReturn,
        DeliveryMore,
        ProductPart,
        DragArea,
        RefundForm,
        AssignUser,
        GroupbyTable,
        AutoColumnTable
    }
})
export default class PickingManageContent extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    @Prop()
    private page_flag

    private showSearch: any = true

    private showhideSearch(flag) {
        this.showSearch = flag
    }

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    // Loading服务
    private pickingService = new PickingService()

    private shipmentService = new ShipmentService()
    private emailService = new EmailService()
    private accountService = new AccountService()
    private userService = new UserService()

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private sellerInstanceService = new SellerInstanceService()

    private generalCodeService = new GeneralCodeService()
    // 表格数据源
    private data: any[] = []

    private showBtn: any = false

    private sellerInstanceList: any[] = []

    private sellerInstanceDict: any = {}

    // 表格选择项
    private selectedRowKeys: any[] = []

    private sellerCodeList: any[] = []

    private shipmentList: any[] = []

    private customerServiceUser: any[] = []

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private defaultSaleOut: any = ''

    // 详情项
    private detailInfo: any = null

    private picking_id: any = 0

    private changeCnt: any = 0

    private defaultName: any = ''

    private isDataFormShow: any = true

    private formDivHeight: any = 400

    private detailDivHeight: any = 300

    private orderBy: any = 'payment_date desc'

    private groupbyList: any = []

    private allNameAuth: any = []

    private columnList: any = []

    private queryUrl: any = '/stock_picking/query_all'

    private queryConsition: any = []

    @datasModule.State
    private countryList

    @datasModule.Action
    private getcountry

    @datasModule.State
    private currencyList

    @datasModule.Action
    private getcurrency

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @datasModule.Action
    private getMvShipType

    @datasModule.State
    private mvShipTypeList

    private get rules() {
        return {}
    }

    private created() {
        this.getMvShipType()
        this.getcountry()
        this.getcurrency()
        this.getSystemuser()
        this.getSellerInstanceList()
        this.getSellerCodeList()
        this.getShipmentList()
        this.getCustomerServiceUserList()

        let _that = this
        document.onkeydown = function(e) {
            let event =
                e || window.event || arguments.callee.caller.arguments[0]
            if (event.ctrlKey && event.keyCode == 81) {
                _that.getOrderList()
            }
        }
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth

        if (this.$route.params.name2) {
            this.defaultName = this.$route.params.name2
            let values = this.dataForm.getValues()
            values['name'] = this.defaultName
            this.dataForm.setValues(values)
            this.getOrderList()
        }
    }

    private showStopConfirm() {
        let _this = this
        this.$confirm({
            title: this.$t('action.confirm_operate_wrong_address'),
            onOk() {
                _this.customer_service_stop_plz()
            },
            onCancel() {}
        })
    }

    private showRefundConfirm() {
        let _this = this
        this.$confirm({
            title: this.$t('action.confirm_operate_refund_order'),
            onOk() {
                _this.cancel_stock_picking_for_order_refund()
            },
            onCancel() {}
        })
    }

    @Watch('$route')
    onRouteChange(newRoute, oldRoute) {
        if (this.$route.params.name2) {
            let values = this.dataForm.getValues()
            values['name'] = this.$route.params.name2
            this.dataForm.setValues(values)

            if (this.data.length === 0) {
                this.getOrderList()
            }
        }
    }

    private onCreate() {}

    private onSaleOutChange(e) {
        this.defaultSaleOut = e.target.value
    }

    private getCustomerServiceUserList() {
        this.userService.customerServiceUser(new RequestParams({})).subscribe(
            data => {
                this.customerServiceUser = data
            },
            err => {
                this.$message.error(err.message)
            }
        )
    }

    private getSellerCodeList() {
        this.sellerInstanceService
            .query_seller_name(new RequestParams({}))
            .subscribe(
                data => {
                    this.sellerCodeList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getSellerInstanceList() {
        this.sellerInstanceService
            .queryInstanceList(new RequestParams())
            .subscribe(data => {
                this.sellerInstanceList = data

                for (let i of data) {
                    this.sellerInstanceDict[i.code] = i.name
                }
            })
    }

    private getShipmentList() {
        this.generalCodeService.queryShipType(new RequestParams()).subscribe(
            data => {
                this.shipmentList = data
            },
            err => {
                this.$message.error('获取物流方式失败')
            }
        )
    }

    private onHeightChange(key) {
        this.isDataFormShow = key
    }

    private onDragChange(param) {
        this.formDivHeight = param[0] - 110 > 0 ? param[0] - 110 : 0
        this.detailDivHeight = param[1] - 97 > 0 ? param[1] - 97 : 0
    }

    /**
     * 获取订单数据
     */
    private getOrderList() {
        let params: any = {}
        this.getQueryCondition().then(nowConditions => {
            this.queryConsition = nowConditions

            if (this.groupbyList.length) {
                let groupbyTable: any = this.$refs.groupbyTable
                groupbyTable.getFirstTableData(nowConditions)
            } else {
                params.query_condition = nowConditions
                if (this.orderBy) {
                    params['order_by'] = this.orderBy
                }
                this.innerAction.setActionAPI(
                    this.queryUrl,
                    CommonService.getMenuCode('picking-manage')
                )
                this.publicService
                    .queryPagination(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService,
                            innerAction: this.innerAction
                        })
                    )
                    .subscribe(
                        data => {
                            this.data = data
                            this.selectedRowKeys = []
                            if (this.data.length > 0) {
                                this.selectedRowKeys.push(this.data[0].id)
                                this.onDetail(this.data[0])
                            }
                            this.changeCnt += 1
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
        })
    }

    private onEdit(row) {}

    private modifyAddress() {
        let rks = this.selectedRowKeys
        this.selectedRowKeys = []
        router.push({
            name: 'modify-address',
            params: { pickingList: JSON.stringify(rks) }
        })
    }

    private validateAddress() {
        this.pickingService
            .validateAddress(
                new RequestParams(
                    {
                        picking_id_list: this.selectedRowKeys
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private deliveryMore() {
        if (this.selectedRowKeys.length > 1) {
            this.$message.error('只限选择一条')
            return
        }
        this.$modal
            .open(
                DeliveryMore,
                {
                    picking_id: this.selectedRowKeys[0]
                },
                {
                    title: this.$t('action.deliveryMore'),
                    width: '800px'
                }
            )
            .subscribe(data => {
                let orderId = ''
                let order = this.data.find(
                    x => x.id === this.selectedRowKeys[0]
                )
                if (order) {
                    let formValue = this.dataForm.getValues()
                    formValue['origin'] = order.origin

                    this.dataForm.setValues(formValue)
                }

                let msg: any = this.$t('save_success')
                this.$message.success(msg)
                this.getOrderList()

                this.$router.push({
                    name: 'picking-detail',
                    path: `/picking/picking-detail/${data.new_picking_id}`,
                    params: {
                        id: data.new_picking_id,
                        name: data.new_picking_name
                    }
                })
            })
    }

    private productPart() {
        if (this.selectedRowKeys.length > 1) {
            this.$message.error('只限选择一条')
            return
        }
        this.$modal
            .open(
                ProductPart,
                {
                    picking_id: this.selectedRowKeys[0]
                },
                {
                    title: this.$t('action.ProductPart'),
                    width: '800px'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('save_success')
                this.$message.success(msg)
                this.getOrderList()
            })
    }

    private batchSendEmail() {
        this.$modal
            .open(
                BatchSendEmail,
                {
                    stock: this.selectedRowKeys
                },
                {
                    title: this.$t('action.batch_send_email'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('save_success')
                this.$message.success(msg)
                this.getOrderList()
            })
    }

    private createShipmentByType(type) {
        this.pickingService
            .create_shipment_lines_by_ship_type(
                new RequestParams(
                    {
                        picking_id_list: this.selectedRowKeys,
                        ship_type: type
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private createCPofAllProduct() {
        if (this.selectedRowKeys.length > 1) {
            this.$message.error('只限选择一条')
            return
        }

        let row = this.data.find(x => x.id == this.selectedRowKeys[0])
        if (row) {
            router.push({
                name: 'modify-custom-problem',
                params: { orderId: row.order_id }
            })
        }
    }

    private makeDone() {
        this.innerAction.setActionAPI(
            '/stock_picking/make_picking_done_out',
            CommonService.getMenuCode('picking-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        pick_id_list: this.selectedRowKeys
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private showDetailPage(row) {
        this.$router.push({
            name: 'picking-detail',
            path: `/picking/picking-detail/${row.id}`,
            params: {
                id: row.id,
                name: row.name
            }
        })
    }

    private forceAvailability() {
        for (let i of this.selectedRowKeys) {
            let row = this.data.find(x => x.id == i)
            if (!row || row.state !== 'confirmed') {
                this.$message.error('所选的picking的状态必须为等待可用')
                return
            }
        }
        this.pickingService
            .force_available(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private assignToUser() {
        this.$modal
            .open(
                AssignUser,
                {
                    picking_id_list: this.selectedRowKeys,
                    systemUsers: this.systemUsers
                },
                {
                    title: 'Assign To User',
                    width: '60%'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('success')
                this.$message.success(msg)
                this.getOrderList()
            })
    }

    private onDetail(row) {
        this.picking_id = row.id
        this.pickingService
            .queryDetail(
                new RequestParams(
                    { picking_id: row.id },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    if (data.length) {
                        data[0]['id'] = row.id
                        this.detailInfo = data[0]
                    }
                    // this.$nextTick(() => this.pageContainer.scrollToBottom())
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onClose() {
        this.detailInfo = null
    }

    private onTrClick(record) {
        let info = this.data.find(x => x.id == record)
        if (info) {
            this.onDetail(info)
        } else if (this.groupbyList.length) {
            this.onDetail({ id: record })
        }
    }

    private onStatusChange(e) {}

    private calcStyle(row) {
        if (row.pick_pre_sale) {
            return 'blue-text'
        } else if (row.state == 'cancel') {
            return 'gray-text'
        } else {
            var today_end = this.get_endtime()
            var time_old = row.payment_date
                ? row.payment_date.substr(0, 10).replace(/-/g, '') + '235959'
                : ''
            if (today_end == time_old) {
                return 'red-text'
            } else {
                return 'default-text'
            }
        }
    }

    private calcStyle2(row) {
        if (row.validate_s === 'ok') {
            return 'green-text'
        } else if (row.validate_s === 'error') {
            return 'red-text'
        } else {
            return 'blue-text'
        }
    }

    private get_endtime() {
        var time_end = new Date(
            new Date(new Date().toLocaleDateString()).getTime() +
                24 * 60 * 60 * 1000 -
                1
        )
        var time_format = this.format_date(time_end)
        return time_format
    }

    private modifyCP() {
        let order_ids: any = []

        this.selectedRowKeys.forEach(value => {
            order_ids.push(
                this.data.filter(item => value === item.id)[0].order_id
            )
        })

        router.push({
            name: 'modify-custom-problem',
            params: {
                orderList: JSON.stringify(order_ids)
            }
        })
    }

    private format_date(now) {
        var year = now.getFullYear() //年
        var month = now.getMonth() + 1 //月
        var day = now.getDate() //日
        var hh = now.getHours() //时
        var mm = now.getMinutes() //分
        var ss = now.getSeconds() //秒

        var clock = year + ''
        if (month < 10) {
            clock += '0'
        }
        clock += month + ''

        if (day < 10) {
            clock += '0'
        }
        clock += day + ''

        if (hh < 10) {
            clock += '0'
        }
        clock += hh + ''

        if (mm < 10) {
            clock += '0'
        }
        clock += mm

        if (ss < 10) {
            clock += '0'
        }
        clock += ss

        return clock
    }

    private cancelPicking() {
        this.pickingService
            .cancelPicking(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.getOrderList()
                    // let orders: any = []
                    // for(let i in this.selectedRowKeys) {
                    //     let row = this.data.find(x=>x.id === i)
                    //     if(row && row.origin !== undefined && (row.origin.includes('B2C-otto') || row.origin.includes('B2C-eugad') || row.origin.includes('B2C-eugad'))) {
                    //         let ordernumber = ''
                    //         orders.push(ordernumber)
                    //     }
                    // }
                    // if(orders.length) {  //同步到shopware
                    //     //
                    // }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private setAsDraft() {
        this.pickingService
            .setAsDraft(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private setPresale() {
        this.pickingService
            .setPresale(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private createReturn() {
        if (this.selectedRowKeys.length > 1) {
            this.$message.error('只限选择一条')
            return
        }
        this.$modal
            .open(
                CreateReturn,
                {
                    picking_id: this.selectedRowKeys[0]
                },
                {
                    title: this.$t('columns.Create Return Shipment'),
                    width: '50%'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('success')
                this.$message.success(msg)
                this.getOrderList()
            })
    }

    private cancelPresale() {
        this.pickingService
            .cancelPresale(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private markSoldOut() {
        this.pickingService
            .markSoldOut(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private cancelSoldOut() {
        this.pickingService
            .cancelSoldOut(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private checkShipments() {
        this.pickingService
            .checkShipments(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private cancelCheckShipments() {
        this.pickingService
            .cancelCheckShipments(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private serviceProcess() {
        this.pickingService
            .serviceProcess(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private OnRefund() {
        if (this.selectedRowKeys.length > 1) {
            this.$message.error('只限选择一条')
            return
        }
        let row = this.data.find(x => x.id == this.selectedRowKeys[0])
        if (row) {
            this.$modal
                .open(
                    RefundForm,
                    {
                        countryList: this.countryList,
                        order_id: row.order_id
                    },
                    {
                        title: this.$t('action.refund'),
                        width: '1000px'
                    }
                )
                .subscribe(data => {
                    this.changeCnt += 1
                })
        }
    }

    private returnProcess() {
        this.pickingService
            .returnProcess(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private customer_service_stop_plz() {
        this.pickingService
            .customer_service_stop_plz(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private cancel_stock_picking_for_order_refund() {
        this.pickingService
            .cancel_stock_picking_for_order_refund(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private donePickingGetLabel() {
        this.shipmentService
            .donePickingGetLabel(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private createShipment() {
        this.pickingService
            .createShipmentsLines(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                () => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private reserve() {
        this.pickingService
            .reserve(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private toPageOrder(origin) {
        router.push({
            name: 'order-manage',
            params: { origin: origin }
        })
        // this.$router.push({
        //     name: 'order-manage',
        //     path: `/orders/order-manage/${origin}`,
        //     params: {
        //         id: origin,
        //         name: '订单管理' + origin
        //     }
        // })
    }

    private fake_shipments() {
        this.pickingService
            .fake_shipments(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private upload_shipment() {
        this.pickingService
            .upload_shipment(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private upload_fake_shipment() {
        this.pickingService
            .upload_fake_shipment(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private forceVerifyAddress() {
        this.pickingService
            .forceVerifyAddress(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private deletePicking() {
        this.pickingService
            .deleteCancelPicking(
                new RequestParams(
                    { picking_id_list: this.selectedRowKeys },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getOrderList()
    }

    private moment = moment

    private initialDate: any = []

    private fillToday() {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime())),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()

        this.initialDate = [startDate, endDate]
        values['payment_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fillYestoday() {
        let day = new Date()
        let endDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['payment_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fill3day() {
        let day = new Date()
        let endDate = moment(
            this.formatDate(new Date(day.getTime() - 48 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 48 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['payment_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fill3days() {
        let day = new Date()
        let endDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 72 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['payment_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private formatDate(time) {
        // 空数据处理
        if (time === null || time === undefined || time === '') {
            return ''
        }

        let y = time.getFullYear()
        let m = time.getMonth() + 1
        let d = time.getDate()
        let h = time.getHours()
        let mi = time.getMinutes()
        let s = time.getSeconds()
        m = m < 10 ? `0${m}` : m
        d = d < 10 ? `0${d}` : d
        h = h < 10 ? `0${h}` : h
        mi = mi < 10 ? `0${mi}` : mi
        s = s < 10 ? `0${s}` : s
        return `${y}-${m}-${d} 23:59`
    }

    private onEditMemo(record) {
        this.$modal
            .open(
                PickingModifyMemo,
                {
                    memo: record.memo,
                    id: record.id,
                    systemUsers: this.systemUsers,
                    orderID: record.order_id
                },
                {
                    title: this.$t('action.modify_memo'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.modifyMemo(record.order_id, data)
            })
    }

    private modifyMemo(order_id, memo) {
        this.emailService
            .modifyMemo(
                new RequestParams({
                    order_id: order_id,
                    memo: memo
                })
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private cancelOrder() {
        this.$modal
            .open(
                CancelOrderForm,
                {
                    order_id: this.selectedRowKeys[0]
                },
                {
                    title: this.$t('action.cancel_order'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getOrderList()
            })
    }

    private multiCreateInvoice() {
        let order_ids: any = []
        this.selectedRowKeys.forEach(value => {
            order_ids.push(
                this.data.filter(item => value === item.id)[0].order_id
            )
        })
        this.accountService
            .createInvoice(
                new RequestParams(
                    { order_id_list: order_ids },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private filterOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private viewAmazonInvoicePDF() {
        let order_name_list: any[] = []
        for (var selected_code of this.selectedRowKeys) {
            let row = this.data.find(x => x.id === selected_code)

            let pattern = /^[0-9]{3}-[0-9]{7}-[0-9]{7}$/

            if (!pattern.test(row.origin)) {
                this.$message.success(
                    'Only support Amazon Order to view invoice'
                )
                return
            }
            order_name_list.push(row.origin)
        }

        let urlParams = encodeURIComponent(JSON.stringify(order_name_list))

        let url =
            appConfig.server +
            '/account/download_order_invoice_pdf?order_name_list=' +
            urlParams
        window.open(url, '_blank')
    }

    private onSelectChange(rowkeys) {
        this.selectedRowKeys = rowkeys
    }

    private getQueryCondition() {
        return new Promise((reslove, reject) => {
            this.dataForm
                .validateFields()
                .then((values: any) => {
                    if (
                        values['seller_code'] &&
                        values['seller_code'].length > 0
                    ) {
                        values['seller_code'] = values['seller_code'].join(',')
                    }

                    if (
                        values['instance_code'] &&
                        values['instance_code'].length > 0
                    ) {
                        values['instance_code'] = values['instance_code'].join(
                            ','
                        )
                    }

                    let name_operator = 'in_or_='
                    let origin_operator = 'in_or_='
                    let email_operator = '='
                    let default_code_operator = 'in_or_suffix_like'
                    let shipment_num_operator = 'in_or_='
                    let ebay_buyer_id_operator = 'in_or_='
                    let customer_name_operator = 'like'
                    let zip_operator = 'like'
                    let street_operator = 'like'

                    let fuzzy_search_operator = values['fuzzy_search_operator']
                    let operator = 'like'
                    if (fuzzy_search_operator == 20) {
                        operator = '='
                    }

                    let fuzzy_search_value = values['fuzzy_search_value']
                    if (fuzzy_search_value) {
                        let fuzzy_search_code = values['fuzzy_search_code']
                        let search_field_name = 'name'

                        switch (fuzzy_search_code) {
                            case 10:
                                search_field_name = 'name'
                                name_operator = operator
                                break
                            case 20:
                                search_field_name = 'origin'
                                origin_operator = operator
                                break
                            case 30:
                                search_field_name = 'email'
                                email_operator = operator
                                break
                            case 40:
                                search_field_name = 'default_code'
                                default_code_operator = operator
                                break
                            case 50:
                                search_field_name = 'shipment_num'
                                shipment_num_operator = operator
                                break
                            case 60:
                                search_field_name = 'ebay_buyer_id'
                                ebay_buyer_id_operator = operator
                                break
                            case 70:
                                search_field_name = 'partner_name'
                                customer_name_operator = operator
                                break
                            case 80:
                                search_field_name = 'zip'
                                zip_operator = operator
                                break
                            case 90:
                                search_field_name = 'street'
                                street_operator = operator
                                break
                            default:
                                search_field_name = 'name'
                                name_operator = operator
                        }

                        values[search_field_name] = fuzzy_search_value
                    }

                    if (this.page_flag == 'aliexpress') {
                        values['platform'] = 60
                    }

                    delete values['fuzzy_search_value']
                    delete values['fuzzy_search_code']
                    delete values['fuzzy_search_operator']

                    let params: any = CommonService.createQueryCondition(
                        values,
                        {
                            picking_type_id: 'like',
                            name: name_operator,
                            origin: origin_operator,
                            default_code: default_code_operator,
                            ebay_buyer_id: ebay_buyer_id_operator,
                            shipment_num: shipment_num_operator,
                            shipment_time_str: 'null',
                            email: email_operator,
                            seller_code: 'in_or_=',
                            instance_code: 'in_or_=',
                            partner_name: customer_name_operator,
                            zip: zip_operator,
                            street: street_operator,
                            ...formConfig.condition
                        }
                    )

                    var nowConditions: any[] = []
                    for (var item of params.query_condition) {
                        if (
                            item.value.constructor == Array &&
                            item.operate !== 'in'
                        ) {
                            if (
                                item.value.length == 2 &&
                                item.value[0].constructor.name == 'Moment'
                            ) {
                                let startDate: any = {}
                                for (let key in item.value[0]) {
                                    startDate[key] = item.value[0][key]
                                }
                                let vle = new Date(startDate.utc())
                                // if (item.query_name === 'latest_ship_date_new') {
                                //     vle = new Date(
                                //         startDate.format('YYYY-MM-DD HH:mm:ss')
                                //     )
                                // }
                                nowConditions.push({
                                    query_name: item.query_name,
                                    operate: '>=',
                                    value: vle
                                })
                            }
                            if (
                                item.value.length == 2 &&
                                item.value[1].constructor.name == 'Moment'
                            ) {
                                let endDate: any = {}
                                for (let key in item.value[1]) {
                                    endDate[key] = item.value[1][key]
                                }
                                let vle = new Date(endDate.utc())
                                // if (item.query_name === 'latest_ship_date_new') {
                                //     vle = new Date(
                                //         endDate.format('YYYY-MM-DD HH:mm:ss')
                                //     )
                                // }
                                nowConditions.push({
                                    query_name: item.query_name,
                                    operate: '<=',
                                    value: vle
                                })
                            }
                        } else {
                            if (item.query_name === 'ebay_plus_type') {
                                if (item.value) {
                                    item.value = 'eBayPlus'
                                } else {
                                    item.value = 'eBayPlus'
                                    item.operate = '!='
                                }
                            } else if (item.query_name === 'amazon_type_sale') {
                                if (item.value) {
                                    item.value = 'prime'
                                } else {
                                    item.value = 'prime'
                                    item.operate = '!='
                                }
                            }
                            nowConditions.push(item)
                        }
                    }

                    reslove(nowConditions)
                })
                .catch(err => {
                    this.$message.error(JSON.stringify(err))
                })
        })
    }


    private createGift() {
        this.pickingService
            .create_dhl_dpd_gift(
                new RequestParams(
                    {
                        picking_ids: this.selectedRowKeys,
                    },{
                    loading: this.loadingService,
                })
            )
            .subscribe(
                data => {
                    this.$message.success('创建成功!')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }    

    // private getQrCondition() {
    //     this.getQueryCondition()
    //         .then(condition => {
    //             return condition
    //         })
    //         .catch(err => {
    //             return ''
    //         })
    // }
}
</script>

<style>
.dsab {
    color: #ccc;
}
</style>

<i18n>
{
    "en-us": {
        "no": "no",
        "desc": "this is a Order Page1",
        "columns": {
            "status": "Status",
            "reference": "Reference",
            "product_name": "Product Name",
            "instance": "Instance",
            "partner": "Partner",
            "scheduled_date": "Scheduled Date",
            "order_id": "Order ID",
            "state": "State",
            "payment_date": "Payment Date",
            "latest_ship_date": "Latest Ship Date",
            "validate_state": "Validate State",
            "shipment_count": "Shipment Count",
            "shipment_num": "Shipment Num.",
            "shipment_time": "Shipment Time",
            "ebay_type": "Ebay Type",
            "amazon_type": "Amazon Type",
            "order_memo": "Memo",
            "operate": "Operate",
            "Create Return Shipment": "Create Return Shipment",
            "seller_code": "Seller",
            "instance_code": "Instance",
            "ebay_buyer_id": "Buyer ID",
            "amount_total": "Amount",
            "customer": "Customer",
            "zip": "Zip",
            "street": "Street"
        },
        "forms": {
            "prime": "Prime",
            "picking_type": "Picking Type",
            "ebay_plus": "Ebay Plus",
            "picking_id": "PickingID",
            "print_state": "Print State",
            "order_id": "orderID",
            "sold_out": "Sold Out",
            "shipment_num": "Shipment Num",
            "sku": "SKU",
            "validate_state": "Validate State",
            "order_from": "Order From",
            "ship_type": "Ship Type",
            "partner": "Partner",
            "latest_ship_date": "Latest Ship Date",
            "create_date": "Create Date",
            "pre_sale": "Pre Sale",
            "payment_date": "Payment Date",
            "is_resend": "Is Resend",
            "ebay_buyer_id": "Buyer ID",
            "assign_to_user": "Assign User",
            "quick_search": "Quick Search",
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search"
        },
        "action": {
            "create": "Create",
            "batch-create": "EXCEL Import",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "confirm_order": "Confirm Order",
            "cancel_order": "Cancel Order",
            "create_invovice": "Create Invovice",
            "detail": "Detail",
            "auto_create": "Auto Create",
            "create_dhl": "Create DHL",
            "create_dpd": "Create DPD",
            "create_gls": "Create GLS",
            "sold_out": "Sold Out",
            "validate_address": "Validate Address",
            "modify_address": "Modify Address",
            "batch_send_email": "Batch Send Email",
            "fake_shipment": "Fake Shipment",
            "upload_shipment": "Upload Shipment",
            "upload_fake_shipment": "Upload Fake Shipment",
            "createReturn": "Create Return",
            "done_picking_get_label": "Shipping Label",
            "deliveryMore": "Delivery More",
            "ProductPart": "Product Part",
            "createReturn": "Create Return",
            "cancelPicking": "Cancel",
            "setAsDraft": "Set Draft",
            "setPresale": "Set Presale",
            "cancelPresale": "Cancel Presale",
            "markSoldOut": "Mark SoldOut",
            "cancelSoldOut": "Cancel SoldOut",
            "checkShipmentCount": "Check Shipments",
            "cancelShipmentCount": "Cancel Check Shipments",
            "serviceProcess": "Service Process",
            "returnProcess": "Return Process",
            "customer_service_stop_plz": "Wrong Address",
            "cancel_stock_picking_for_order_refund": "Cancel Order For Refund",
            "today": "Today",
            "yestoday": "Yestoday",
            "3day": "3 Day",
            "3days": "3 Days",
            "refund": "Refund",
            "createCp": "Create Cp",
            "create_brief": "Create Brief",
            "assign_to_user": "Assign To User",
            "force_available": "Force Availability",
            "force_verify_address": "Force Verify Address",
            "deletePicking": "Delete Picking",
            "modify_memo": "Modify Memo",
            "reserved": "Reserved",
            "more_btn": "More Buttons",
            "confirm_operate_refund_order": "Are you sure to cancel order for refund?",
            "confirm_operate_wrong_address": "Are you sure to cancel order because wrong address?",
            "viewAmazonInvoicePDF": "view AMA PDF",
            "cancelOrder": "Cancel Order",
            "make_done": "Make Done For Available",
            "create_gift": "Create Gift"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "yes": "Yes",
        "no": "No",
        "success": "success"
    },
    "zh-cn": {
        "no": "无",
        "desc": "这是订单页面1",
        "columns": {
            "status": "状态",
            "reference": "参数",
            "product_name": "产品名称",
            "instance": "实例",
            "partner": "客户",
            "scheduled_date": "约定日期",
            "order_id": "订单号",
            "state": "状态",
            "payment_date": "支付日期",
            "latest_ship_date": "发货时间",
            "validate_state": "有效状态",
            "shipment_count": "面单数量",
            "shipment_num": "物流单号",
            "shipment_time": "物流时间",
            "ebay_type": "Ebay类型",
            "amazon_type": "亚马逊类型",
            "order_memo": "Memo",
            "operate": "操作",
            "Create Return Shipment": "创建回程单",
            "seller_code": "店铺",
            "instance_code": "实例",
            "ebay_buyer_id": "买家ID",
            "amount_total": "金额",
            "customer": "客户",
            "zip": "邮编",
            "street": "街道"
        },
        "forms": {
            "prime": "Prime",
            "picking_type": "拣货类型",
            "ebay_plus": "Ebay +",
            "picking_id": "拣货单号",
            "print_state": "打印状态",
            "order_id": "订单号",
            "sold_out": "卖超",
            "shipment_num": "物流单号",
            "sku": "SKU",
            "validate_state": "有效状态",
            "order_from": "订单来源",
            "ship_type": "物流类型",
            "partner": "客户",
            "latest_ship_date": "发货时间",
            "create_date": "创建时间",
            "pre_sale": "预售单",
            "payment_date": "支付时间",
            "is_resend": "补发单",
            "ebay_buyer_id": "买家ID",
            "assign_to_user": "任务人",
            "quick_search": "快速查找",
            "operator_like": "模糊查找",
            "operator_equal": "精确查找"
        },
        "action": {
            "create": "新建",
            "batch-create": "EXCEL导入",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "confirm_order": "确认订单",
            "cancel_order": "取消订单",
            "create_invovice": "创建发票",
            "detail": "详情",
            "auto_create": "创建运单",
            "create_dhl": "创建DHL",
            "create_dpd": "创建DPD",
            "create_gls": "创建GLS",
            "sold_out": "卖超",
            "validate_address": "验证地址",
            "modify_address": "批量验证",
            "batch_send_email": "批量发邮件",
            "fake_shipment": "假单号",
            "upload_shipment": "上传单号",
            "upload_fake_shipment": "上传假单号",
            "createReturn": "创建回程单",
            "done_picking_get_label": "生成运单号",
            "deliveryMore": "创建补发",
            "ProductPart": "补发零部件",
            "createReturn": "创建回程单",
            "make_done": "Make Done For Available",
            "cancelPicking": "取消",
            "setAsDraft": "设为草稿",
            "setPresale": "设为预售",
            "cancelPresale": "取消预售",
            "markSoldOut": "卖超",
            "cancelSoldOut": "取消卖超",
            "checkShipmentCount": "Check Shipments",
            "cancelShipmentCount": "Cancel Check Shipments",
            "serviceProcess": "Service Process",
            "returnProcess": "Return Process",
            "customer_service_stop_plz": "Wrong Address",
            "cancel_stock_picking_for_order_refund": "Cancel Order For Refund",
            "today": "今天",
            "yestoday": "昨天",
            "3day": "前天",
            "3days": "近3天",
            "refund": "退款",
            "createCp": "创建CP",
            "create_brief": "创建Brief",
            "assign_to_user": "Assign To User",
            "force_available": "强制预留",
            "force_verify_address": "强制验证地址",
            "deletePicking": "删除",
            "modify_memo": "编辑Memo",
            "reserved": "预留",
            "more_btn": "更多按钮",
            "confirm_operate_refund_order": "确定要批量取消订单[直接退款]吗?",
            "confirm_operate_wrong_address": "确定要批量取消订单[错误地址]吗?",
            "viewAmazonInvoicePDF": "查看AMA账单",
            "cancelOrder": "取消订单",
            "create_gift": "创建Gift"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "yes": "是",
        "no": "否",
        "success": "成功"
    }
}
</i18n>
