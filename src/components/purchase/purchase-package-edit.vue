<template>
    <section class="component edit-customer" ref="customModal">
        <a-card class="margin-y" style="margin:0 !important">
            <div
                style="padding:0 20px 10px 20px;min-height:40px;display:inline-block;"
            >
                <a-button
                    type="primary"
                    @click="onSubmit()"
                    v-if="editAble"
                    style="margin-right:5px;"
                    size="small"
                    >{{ $t('action.save') }}
                </a-button>
                <a-button
                    @click="editChange"
                    type="default"
                    size="small"
                    v-if="order.id && order.state == 'draft'"
                    style="margin-right:5px;"
                    ><span v-if="!editAble">{{ $t('action.edit') }}</span
                    ><span v-else>{{ $t('action.discard') }}</span>
                </a-button>
                <a-button
                    @click="onVerify('confirm')"
                    style="margin-right:5px;"
                    v-if="order.state == 'draft'"
                    size="small"
                >
                    {{ $t('action.confirm') }}
                </a-button>
                <a-button
                    @click="onVerify('approved')"
                    style="margin-right:5px;"
                    v-if="order.state == 'confirm'"
                    size="small"
                >
                    {{ $t('action.verify') }}
                </a-button>
                <a-button
                    @click="onVerify('ship')"
                    style="margin-right:5px;"
                    size="small"
                    v-if="['approved'].includes(order.state)"
                >
                    {{ $t('action.ship') }}
                </a-button>
                <a-button
                    @click="onVerify('ship')"
                    style="margin-right:5px;"
                    size="small"
                    v-if="['process', 'waiting', 'wait'].includes(order.state)"
                >
                    {{ $t('action.set_to_ship') }}
                </a-button>
                <a-button
                    @click="onVerify('process')"
                    style="margin-right:5px;"
                    v-if="order.state == 'ship'"
                    size="small"
                >
                    {{ $t('action.process_clearance') }}
                </a-button>
                <a-button
                    @click="onVerify('waiting')"
                    style="margin-right:5px;"
                    v-if="order.state == 'process'"
                    size="small"
                >
                    {{ $t('action.waiting_arrange_in') }}
                </a-button>
                <a-button
                    @click="onVerify('wait')"
                    style="margin-right:5px;"
                    v-if="order.state == 'waiting'"
                    size="small"
                >
                    {{ $t('action.waiting_in') }}
                </a-button>
                <a-button
                    @click="onVerify('land')"
                    style="margin-right:5px;"
                    v-if="order.state == 'wait'"
                    size="small"
                >
                    {{ $t('action.land') }}
                </a-button>
                <a-button
                    @click="onVerify('draft')"
                    style="margin-right:5px;"
                    v-if="order.state == 'cancel'"
                    size="small"
                >
                    {{ $t('action.set_to_draft') }}
                </a-button>
                <a-button
                    @click="onVerify('cancel')"
                    style="margin-right:5px;"
                    v-if="['approved', 'confirm', 'ship'].includes(order.state)"
                    size="small"
                >
                    {{ $t('action.cancel') }}
                </a-button>
                <a-button
                    @click="onLandIn()"
                    style="margin-right:5px;"
                    v-if="order.state == 'wait'"
                    size="small"
                >
                    {{ $t('action.land_in') }}
                </a-button>
                <a-button
                    @click="inbound()"
                    style="margin-right:5px;"
                    v-if="order.state == 'wait' || order.state == 'waiting'"
                    size="small"
                >
                    {{ $t('action.inbound') }}
                </a-button>
                <div style="position:absolute;top:10px;right:10px;">
                    <div class="progress-bar">
                        <li
                            :value="item.value"
                            v-for="item of $dict.PackageOrderState"
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
                    :wrapperCol="{ span: 16, offset: 2 }"
                >
                    <a-card class="margin-top order-edit-page">
                        <a-row :gutter="24">
                            <a-col :span="12">
                                <a-form-item :label="$t('name')">
                                    <a-input
                                        v-decorator="[`name`]"
                                        size="small"
                                        style="width: 200px;"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('ship_date')">
                                    <a-date-picker
                                        v-decorator="[`ship_date`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('de_po')">
                                    <a-input
                                        v-decorator="[`de_po`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('land_date')">
                                    <a-date-picker
                                        v-decorator="[`land_date`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('company_name')">
                                    <a-select
                                        v-decorator="[
                                            'company_name',
                                            { initialValue: '' }
                                        ]"
                                        :style="{ width: '200px' }"
                                        size="small"
                                        placeholder="Please select"
                                        :disabled="!editAble"
                                    >
                                        <a-select-option value>
                                            {{ $t('none') }}
                                        </a-select-option>
                                        <a-select-option
                                            value="woltu"
                                            key="woltu"
                                        >
                                            Woltu
                                        </a-select-option>
                                        <a-select-option
                                            value="eugad"
                                            key="eugad"
                                        >
                                            EUGAD
                                        </a-select-option>
                                        <a-select-option
                                            value="situ"
                                            key="situ"
                                        >
                                            Situ
                                        </a-select-option>
                                        <a-select-option
                                            value="elight"
                                            key="elight"
                                        >
                                            Elight
                                        </a-select-option>
                                        <a-select-option
                                            value="wowo"
                                            key="wowo"
                                        >
                                            Wowo
                                        </a-select-option>
                                        <a-select-option
                                            value="meteorsrain"
                                            key="meteorsrain"
                                        >
                                            Meteorsrain
                                        </a-select-option>
                                        <a-select-option
                                            value="brichimon"
                                            key="brichimon"
                                        >
                                            BRICHIMON LIMITED
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('etd_date')">
                                    <a-date-picker
                                        v-decorator="[`etd_date`]"
                                        size="small"
                                        style="width: 200px;"
                                        format="YYYY-MM-DD hh:mm"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('make_user')">
                                    <a-select
                                        showSearch
                                        v-decorator="[
                                            'make_user',
                                            { initialValue: '' }
                                        ]"
                                        :style="{ width: '200px' }"
                                        size="small"
                                        placeholder="Please select"
                                        :filterOption="filterSelectOption"
                                        disabled
                                    >
                                        <a-select-option value>
                                            {{ $t('none') }}
                                        </a-select-option>
                                        <a-select-option
                                            v-for="item of systemUsers"
                                            :key="item.code"
                                            :value="item.code"
                                        >
                                            {{ item.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('af_date')">
                                    <a-date-picker
                                        v-decorator="[`af_date`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('approved_user')">
                                    <a-select
                                        showSearch
                                        v-decorator="[
                                            'approved_user',
                                            { initialValue: '' }
                                        ]"
                                        :style="{ width: '200px' }"
                                        size="small"
                                        placeholder="Please select"
                                        :filterOption="filterSelectOption"
                                        disabled
                                    >
                                        <a-select-option value>
                                            {{ $t('none') }}
                                        </a-select-option>
                                        <a-select-option
                                            v-for="item of systemUsers"
                                            :key="item.code"
                                            :value="item.code"
                                        >
                                            {{ item.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('yd_state')">
                                    <a-checkbox
                                        @change="
                                            e => onCheckboxChange('yd_state', e)
                                        "
                                        v-decorator="[`yd_state`]"
                                        :checked="order.yd_state"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('doc_date')">
                                    <a-date-picker
                                        v-decorator="[`doc_date`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('yd_merge_time')">
                                    <a-date-picker
                                        v-decorator="[`yd_merge_time`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('recv_date')">
                                    <a-date-picker
                                        v-decorator="[`recv_date`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('yd_memo')">
                                    <a-input
                                        v-decorator="[`yd_memo`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('done_date')">
                                    <a-date-picker
                                        v-decorator="[`done_date`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('source_doc1')">
                                    <a-input
                                        v-decorator="[`source_doc1`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('expect_eta')" required>
                                    <a-date-picker
                                        v-decorator="[
                                            `expect_eta`,
                                            {
                                                rule: rules.required
                                            }
                                        ]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('carrier_name')">
                                    <a-input
                                        v-decorator="[`carrier_name`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('expect_etd')" required>
                                    <a-date-picker
                                        v-decorator="[
                                            `expect_etd`,
                                            {
                                                rule: rules.required
                                            }
                                        ]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('bl_code')">
                                    <a-input
                                        v-decorator="[`bl_code`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('predict_eta')">
                                    <a-date-picker
                                        v-decorator="[`predict_eta`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('package_code')">
                                    <a-input
                                        v-decorator="[`package_code`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('predict_eta_memo')">
                                    <a-input
                                        v-decorator="[`predict_eta_memo`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('bl_xingshi')">
                                    <a-select
                                        v-decorator="[
                                            'bl_xingshi',
                                            { initialValue: '' }
                                        ]"
                                        :style="{ width: '200px' }"
                                        size="small"
                                        placeholder="Please select"
                                        :disabled="!editAble"
                                    >
                                        <a-select-option value="zf" key="zf">
                                            OBL
                                        </a-select-option>
                                        <a-select-option value="df" key="df">
                                            TR
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('change_etd_memo')">
                                    <a-input
                                        v-decorator="[`change_etd_memo`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('express_name')">
                                    <a-select
                                        v-decorator="[
                                            'express_name',
                                            { initialValue: '' }
                                        ]"
                                        :style="{ width: '200px' }"
                                        size="small"
                                        placeholder="Please select"
                                        :disabled="!editAble"
                                    >
                                        <a-select-option value="tnt" key="tnt">
                                            TNT
                                        </a-select-option>
                                        <a-select-option value="dhl" key="dhl">
                                            DHL
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('pre_status')">
                                    <a-checkbox
                                        @change="
                                            e =>
                                                onCheckboxChange(
                                                    'pre_status',
                                                    e
                                                )
                                        "
                                        v-decorator="[`pre_status`]"
                                        :checked="order.pre_status"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('shipment_number')">
                                    <a-input
                                        v-decorator="[`shipment_number`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('warehouse_id')">
                                    <a-select
                                        v-decorator="[
                                            'warehouse_id',
                                            { initialValue: '' }
                                        ]"
                                        :style="{ width: '200px' }"
                                        size="small"
                                        placeholder="Please select"
                                        :disabled="!editAble"
                                    >
                                        <a-select-option value>
                                            {{ $t('none') }}
                                        </a-select-option>
                                        <a-select-option
                                            v-for="item of $dict.WarehouseId"
                                            :key="item.value"
                                            :value="item.value"
                                        >
                                            {{ $t(item.label) }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('clearance_data_submit_date')"
                                >
                                    <a-date-picker
                                        v-decorator="[
                                            `clearance_data_submit_date`
                                        ]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('real_date')">
                                    <a-date-picker
                                        v-decorator="[`real_date`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('bl_finish_date')">
                                    <a-date-picker
                                        v-decorator="[`bl_finish_date`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('is_pd')">
                                    <a-checkbox
                                        @change="
                                            e => onCheckboxChange('is_pd', e)
                                        "
                                        v-decorator="[`is_pd`]"
                                        :checked="order.is_pd"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('port_start')">
                                    <a-input
                                        v-decorator="[`port_start`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col
                                :span="12"
                                v-if="!domain.includes('47.254.148.130:58180')"
                            >
                                <a-form-item :label="$t('ist_aushilfe')">
                                    <a-checkbox
                                        @change="
                                            e =>
                                                onCheckboxChange(
                                                    'ist_aushilfe',
                                                    e
                                                )
                                        "
                                        v-decorator="[`ist_aushilfe`]"
                                        :checked="order.ist_aushilfe"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('port_end')">
                                    <a-select
                                        showSearch
                                        v-decorator="[
                                            'port_end',
                                            {
                                                rules: rules.required
                                            }
                                        ]"
                                        :style="{
                                            width: '100%',
                                            'max-width': '240px'
                                        }"
                                        size="small"
                                        :disabled="!editAble"
                                        placeholder="Please Select"
                                    >
                                        <a-select-option
                                            value="Felix"
                                            key="Felix"
                                        >
                                            Felix
                                        </a-select-option>
                                        <a-select-option
                                            value="Rotterdam"
                                            key="Rotterdam"
                                        >
                                            Rotterdam
                                        </a-select-option>
                                        <a-select-option
                                            value="southampton"
                                            key="southampton"
                                        >
                                            SOUTHAMPTON
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col
                                :span="12"
                                v-if="!domain.includes('47.254.148.130:58180')"
                            >
                                <a-form-item :label="$t('aushilfe_note')">
                                    <a-input
                                        v-decorator="[`aushilfe_note`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('note_text')">
                                    <a-input
                                        v-decorator="[`note_text`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('display_stock_in')">
                                    <a-input
                                        v-decorator="[`display_stock_in`]"
                                        size="small"
                                        style="width: 200px;"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('ist_number_qty')">
                                    <a-checkbox
                                        @change="
                                            e =>
                                                onCheckboxChange(
                                                    'ist_number_qty',
                                                    e
                                                )
                                        "
                                        v-decorator="[`ist_number_qty`]"
                                        :checked="order.ist_number_qty"
                                        :disabled="!editAble"
                                    />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-card>
                </a-form>
                <div>
                    <a-button
                        type="primary"
                        @click="addProduct"
                        style="margin-top:20px;"
                        size="small"
                    >
                        {{ $t('action.add_product') }}
                    </a-button>
                    <a-button
                        type="primary"
                        @click="giveAktuValue"
                        :disabled="!selectedRowKeys.length"
                        style="margin:20px 0 0 10px;"
                        size="small"
                    >
                        {{ $t('action.aktu_value') }}
                    </a-button>
                    <a-button
                        type="primary"
                        @click="writeF4"
                        :disabled="!selectedRowKeys.length"
                        style="margin:20px 0 0 10px;"
                        size="small"
                    >
                        {{ $t('action.write_f4') }}
                    </a-button>
                    <a-button
                        type="primary"
                        @click="rWarehouse"
                        :disabled="!selectedRowKeys.length"
                        style="margin:20px 0 0 10px;"
                        size="small"
                    >
                        {{ $t('action.r_warehouse') }}
                    </a-button>
                    <a-button
                        type="primary"
                        @click="tWarehouse"
                        :disabled="!selectedRowKeys.length"
                        style="margin:20px 0 0 10px;"
                        size="small"
                    >
                        {{ $t('action.t_warehouse') }}
                    </a-button>
                    <a-button
                        type="primary"
                        @click="isBoxQty"
                        :disabled="!selectedRowKeys.length"
                        style="margin:20px 0 0 10px;"
                        size="small"
                    >
                        {{ $t('action.is_box_qty') }}
                    </a-button>
                </div>
                <a-tabs
                    defaultActiveKey="base"
                    type="card"
                    style="margin-top:10px;"
                >
                    <a-tab-pane :tab="$t('requirement_lines')" key="base">
                        <div style="margin:10px;">
                            <a-button
                                type="primary"
                                @click="changeLocationId('W-sub1')"
                                :disabled="!selectedRowKeys.length"
                                size="small"
                                >Sub1 W
                            </a-button>
                            <a-button
                                type="primary"
                                style="margin-left:5px;"
                                @click="changeLocationId('M-sub2')"
                                :disabled="!selectedRowKeys.length"
                                size="small"
                                >Sub2 M
                            </a-button>
                            <a-button
                                type="primary"
                                style="margin-left:5px;"
                                @click="changeLocationId('S-sub3')"
                                :disabled="!selectedRowKeys.length"
                                size="small"
                                >Sub3 S
                            </a-button>
                            <a-button
                                type="primary"
                                style="margin-left:5px;"
                                @click="changeLocationId('UK-sub4')"
                                :disabled="!selectedRowKeys.length"
                                size="small"
                                >Sub4 UK
                            </a-button>
                            <a-button
                                type="primary"
                                style="margin-left:5px;"
                                @click="changeLocationId('J-sub5')"
                                :disabled="!selectedRowKeys.length"
                                size="small"
                                >Sub5 J
                            </a-button>
                            <a-button
                                type="primary"
                                style="margin-left:5px;"
                                @click="changeLocationId('E-sub6')"
                                :disabled="!selectedRowKeys.length"
                                size="small"
                                >Sub6 E
                            </a-button>
                            <a-button
                                type="primary"
                                style="margin-left:5px;"
                                @click="changeLocationId('T-sub7')"
                                :disabled="!selectedRowKeys.length"
                                size="small"
                                >Sub7 T
                            </a-button>
                            <a-button
                                type="primary"
                                style="margin-left:5px;"
                                @click="changeLocationId('R-sub8')"
                                :disabled="!selectedRowKeys.length"
                                size="small"
                                >Sub8 R
                            </a-button>
                            <a-button
                                type="primary"
                                style="margin-left:5px;"
                                @click="changeLocationId('F-sub9')"
                                :disabled="!selectedRowKeys.length"
                                size="small"
                                >Sub9 F
                            </a-button>
                            <a-button
                                type="primary"
                                style="margin-left:5px;"
                                @click="changeLocationId('FBA-loc-S')"
                                :disabled="!selectedRowKeys.length"
                                size="small"
                                >FBA-S
                            </a-button>
                            <a-button
                                type="primary"
                                style="margin-left:5px;"
                                @click="changeLocationId('FBA-loc-R')"
                                :disabled="!selectedRowKeys.length"
                                size="small"
                                >FBA-R
                            </a-button>
                            <a-button
                                type="primary"
                                style="margin-left:5px;"
                                @click="changeLocationId('FBA-loc-T')"
                                :disabled="!selectedRowKeys.length"
                                size="small"
                                >FBA-T
                            </a-button>
                            <a-button
                                type="primary"
                                style="margin-left:5px;"
                                @click="changeLocationId('FBA-loc-W')"
                                :disabled="!selectedRowKeys.length"
                                size="small"
                                >FBA-W
                            </a-button>
                            <a-button
                                type="primary"
                                style="margin-left:5px;"
                                @click="changeLocationId('FBA-loc-UK')"
                                :disabled="!selectedRowKeys.length"
                                size="small"
                                >FBA-UK
                            </a-button>
                        </div>
                        <a-table
                            :dataSource="orderDetail"
                            :pagination="false"
                            rowKey="id"
                            :columns="detailColumns"
                            :rowSelection="{
                                selectedRowKeys: selectedRowKeys,
                                onChange: keys => (selectedRowKeys = keys),
                                getCheckboxProps: record => ({
                                    props: {
                                        disabled: record.id === 'summary', // Column configuration not to be checked
                                        id: String(record.id)
                                    }
                                })
                            }"
                            :customRow="
                                record => ({
                                    on: {
                                        click: () => {
                                            this.selectedRowKeys = [record.id]
                                            onTbRowClick(record)
                                        }
                                    }
                                })
                            "
                            style="table-layout:fixed;"
                            :scroll="{ x: 2000, y: 300 }"
                            bordered
                        >
                            <template slot="aktu_box_qty" slot-scope="row">
                                <a-input-number
                                    v-if="
                                        editAble &&
                                            row.id == currentLi &&
                                            row.id != 'summary'
                                    "
                                    v-decorator="[`aktu_box_qty`]"
                                    :value="row.aktu_box_qty"
                                    size="small"
                                    :min="0"
                                    @change="
                                        e => onRowChange(row, 'aktu_box_qty', e)
                                    "
                                    :style="{
                                        width: '100%',
                                        background: '#ecc5e9'
                                    }"
                                />
                                <span v-else>{{ row.aktu_box_qty }}</span>
                            </template>
                            <template slot="aktu_package_qty" slot-scope="row">
                                <a-input-number
                                    v-if="
                                        editAble &&
                                            row.id == currentLi &&
                                            row.id != 'summary'
                                    "
                                    v-decorator="[`aktu_package_qty`]"
                                    :value="row.aktu_package_qty"
                                    size="small"
                                    :min="0"
                                    @change="
                                        e =>
                                            onRowChange(
                                                row,
                                                'aktu_package_qty',
                                                e
                                            )
                                    "
                                    :style="{
                                        width: '100%',
                                        background: '#ecc5e9'
                                    }"
                                />
                                <span v-else>{{ row.aktu_package_qty }}</span>
                            </template>
                            <template slot="cp_note" slot-scope="row">
                                <a-input
                                    v-if="
                                        editAble &&
                                            row.id == currentLi &&
                                            row.id != 'summary'
                                    "
                                    v-decorator="[`cp_note`]"
                                    :value="row.cp_note"
                                    size="small"
                                    @change="
                                        e => onRowChange(row, 'cp_note', e)
                                    "
                                    :style="{
                                        width: '100%',
                                        background: '#ecc5e9'
                                    }"
                                />
                                <span v-else>{{ row.cp_note }}</span>
                            </template>
                            <template slot="import_memo" slot-scope="row">
                                <a-input
                                    v-if="
                                        editAble &&
                                            row.id == currentLi &&
                                            row.id != 'summary'
                                    "
                                    v-decorator="[`import_memo`]"
                                    :value="row.import_memo"
                                    size="small"
                                    @change="
                                        e => onRowChange(row, 'import_memo', e)
                                    "
                                    :style="{
                                        width: '100%',
                                        background: '#ecc5e9'
                                    }"
                                />
                                <span v-else>{{ row.import_memo }}</span>
                            </template>
                            <template slot="note" slot-scope="row">
                                <a-input
                                    v-if="
                                        editAble &&
                                            row.id == currentLi &&
                                            row.id != 'summary'
                                    "
                                    v-decorator="[`note`]"
                                    :value="row.note"
                                    size="small"
                                    @change="e => onRowChange(row, 'note', e)"
                                    :style="{
                                        width: '100%',
                                        background: '#ecc5e9'
                                    }"
                                />
                                <span v-else>{{ row.note }}</span>
                            </template>
                            <template slot="write_product_f4" slot-scope="row">
                                <a-input
                                    v-if="
                                        editAble &&
                                            row.id == currentLi &&
                                            row.id != 'summary'
                                    "
                                    v-decorator="[`write_product_f4`]"
                                    :value="row.write_product_f4"
                                    size="small"
                                    @change="
                                        e =>
                                            onRowChange(
                                                row,
                                                'write_product_f4',
                                                e
                                            )
                                    "
                                    :style="{
                                        width: '100%',
                                        background: '#ecc5e9'
                                    }"
                                />
                                <span v-else>{{ row.write_product_f4 }}</span>
                            </template>
                            <template slot="is_fba" slot-scope="row">
                                <a-checkbox
                                    v-if="row.id != 'summary'"
                                    :disabled="
                                        !editAble || row.id !== currentLi
                                    "
                                    v-decorator="[`is_fba`]"
                                    :checked="row.is_fba"
                                    @change="
                                        e =>
                                            onRowChange(
                                                row,
                                                'is_fba',
                                                e.target.checked
                                            )
                                    "
                                />
                            </template>
                            <template slot="is_change_sku" slot-scope="row">
                                <a-checkbox
                                    v-if="row.id != 'summary'"
                                    :disabled="
                                        !editAble || row.id !== currentLi
                                    "
                                    v-decorator="[`is_change_sku`]"
                                    :checked="row.is_change_sku"
                                    @change="
                                        e =>
                                            onRowChange(
                                                row,
                                                'is_change_sku',
                                                e.target.checked
                                            )
                                    "
                                />
                            </template>
                            <template slot="ist_box_qty" slot-scope="row">
                                <a-checkbox
                                    disabled
                                    v-decorator="[`ist_box_qty`]"
                                    :checked="row && row.ist_box_qty"
                                />
                            </template>
                            <template slot="location_id" slot-scope="row">
                                <a-input
                                    v-if="
                                        editAble &&
                                            row.id == currentLi &&
                                            row.id != 'summary'
                                    "
                                    v-decorator="[`location_id`]"
                                    :value="row.location_id"
                                    size="small"
                                    @change="
                                        e => onRowChange(row, 'location_id', e)
                                    "
                                    :style="{
                                        width: '100%',
                                        background: '#ecc5e9'
                                    }"
                                />
                                <span v-else>{{
                                    locationDict[parseInt(row.location_id)]
                                }}</span>
                            </template>
                            <template slot="action" slot-scope="row">
                                <a-popconfirm
                                    v-if="row.id != 'summary'"
                                    :title="$t('delete')"
                                    :okText="$t('action.ok')"
                                    :cancelText="$t('action.cancel')"
                                    placement="left"
                                    @confirm="onDelete(row)"
                                >
                                    <a class="btnDel">{{
                                        $t('action.delete')
                                    }}</a>
                                </a-popconfirm>
                            </template>
                        </a-table>
                    </a-tab-pane>
                    <a-tab-pane :tab="$t('logistic_info')" key="info">
                        <a-form
                            :form="form2"
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 16, offset: 2 }"
                        >
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <a-form-item :label="$t('ship_line')">
                                        <a-input
                                            v-decorator="[
                                                `ship_line`,
                                                {
                                                    initialValue:
                                                        order.ship_line
                                                }
                                            ]"
                                            size="small"
                                            style="width: 200px;"
                                            :disabled="!editAble"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item :label="$t('seal_num')">
                                        <a-input
                                            v-decorator="[
                                                `seal_num`,
                                                {
                                                    initialValue: order.seal_num
                                                }
                                            ]"
                                            size="small"
                                            style="width: 200px;"
                                            :disabled="!editAble"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item :label="$t('thc_invoice')">
                                        <a-input
                                            v-decorator="[
                                                `thc_invoice`,
                                                {
                                                    initialValue:
                                                        order.thc_invoice
                                                }
                                            ]"
                                            size="small"
                                            style="width: 200px;"
                                            :disabled="!editAble"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item :label="$t('size_type')">
                                        <a-input
                                            v-decorator="[
                                                `size_type`,
                                                {
                                                    initialValue:
                                                        order.size_type
                                                }
                                            ]"
                                            size="small"
                                            style="width: 200px;"
                                            :disabled="!editAble"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item :label="$t('vessel')">
                                        <a-input
                                            v-decorator="[
                                                `vessel`,
                                                {
                                                    initialValue: order.vessel
                                                }
                                            ]"
                                            size="small"
                                            style="width: 200px;"
                                            :disabled="!editAble"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item :label="$t('netto_weight')">
                                        <a-input
                                            v-decorator="[
                                                `netto_weight`,
                                                {
                                                    initialValue:
                                                        order.netto_weight
                                                }
                                            ]"
                                            size="small"
                                            style="width: 200px;"
                                            :disabled="!editAble"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item :label="$t('terminal')">
                                        <a-input
                                            v-decorator="[
                                                `terminal`,
                                                {
                                                    initialValue: order.terminal
                                                }
                                            ]"
                                            size="small"
                                            style="width: 200px;"
                                            :disabled="!editAble"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item
                                        :label="$t('goods_description')"
                                    >
                                        <a-input
                                            v-decorator="[
                                                `goods_description`,
                                                {
                                                    initialValue:
                                                        order.goods_description
                                                }
                                            ]"
                                            size="small"
                                            style="width: 200px;"
                                            :disabled="!editAble"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item :label="$t('trans_model')">
                                        <a-select
                                            v-decorator="[
                                                'trans_model',
                                                {
                                                    initialValue:
                                                        order.trans_model
                                                }
                                            ]"
                                            :style="{ width: '200px' }"
                                            size="small"
                                            placeholder="Please select"
                                            :disabled="!editAble"
                                        >
                                            <a-select-option
                                                value="Barge"
                                                key="Barge"
                                            >
                                                Barge
                                            </a-select-option>
                                            <a-select-option
                                                value="Rail"
                                                key="Rail"
                                            >
                                                Rail
                                            </a-select-option>
                                            <a-select-option
                                                value="Truck"
                                                key="Truck"
                                            >
                                                Truck
                                            </a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item :label="$t('empty_depot')">
                                        <a-input
                                            v-decorator="[
                                                `empty_depot`,
                                                {
                                                    initialValue:
                                                        order.empty_depot
                                                }
                                            ]"
                                            size="small"
                                            style="width: 200px;"
                                            :disabled="!editAble"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item :label="$t('pick_terminal')">
                                        <a-input
                                            v-decorator="[
                                                `pick_terminal`,
                                                {
                                                    initialValue:
                                                        order.pick_terminal
                                                }
                                            ]"
                                            size="small"
                                            style="width: 200px;"
                                            :disabled="!editAble"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item :label="$t('pick_reference')">
                                        <a-input
                                            v-decorator="[
                                                `pick_reference`,
                                                {
                                                    initialValue:
                                                        order.pick_reference
                                                }
                                            ]"
                                            size="small"
                                            style="width: 200px;"
                                            :disabled="!editAble"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item :label="$t('demurrage_time')">
                                        <a-input
                                            v-decorator="[
                                                `demurrage_time`,
                                                {
                                                    initialValue:
                                                        order.demurrage_time
                                                }
                                            ]"
                                            size="small"
                                            style="width: 200px;"
                                            :disabled="!editAble"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-form>
                    </a-tab-pane>
                </a-tabs>
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
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import moment from 'moment'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import ChangeGiveDateForm from '@/components/purchase/change-give-date-form.vue'
import UploadExcel from '@/shared/common/upload-excel.vue'
import AddPackageOrderProduct from '@/components/purchase/add-package-order-product.vue'
import InboundPlan from '@/components/purchase/inboundPlan.vue'
import { LocationService } from '../../services/location.service'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')
const userModule = namespace('userModule')

@Component({
    components: {}
})
export default class PurchasePackageEdit extends Vue {
    @Prop()
    info: any

    private form: any
    private form2: any

    private moment = moment

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private locationService = new LocationService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()
    // 表格数据源
    private order: any = []

    private orderDetail: any[] = []

    private locationList: any = []
    private locationDict: any = {}

    private save_flag: any = 0

    private originData: any = []

    private isShowDetail: any = false //是否只是详情展示

    private menu_code: any = ''

    private editAble: any = false

    private currentLi: any = ''

    private detailColumns: any = []
    private selectedRowKeys: any = []

    private summaryList: any = ['package_qty', 'aktu_box_qty']

    private domain: any = ''

    @datasModule.State
    private companyList

    @datasModule.Action
    private getcompany

    @pageParamsModule.State
    purchasePackageParams

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @pageParamsModule.State
    private commonPageInfo

    @datasModule.State
    private vendorFullNameList

    @datasModule.Action
    private getVendorFullNameList

    @datasModule.State
    private departmentList

    @datasModule.Action
    private getDepartmentList
    private topDepartmentList: any[] = []

    @Watch('info')
    onInfoChange() {
        if (this.info) {
            this.editAble = false
            this.updateOrder(this.info)
        }
    }

    @Watch('data')
    private onDataChange() {
        if (this.orderDetail.length) {
            let sm = this.orderDetail.find(x => x.id == 'summary')
            if (sm) {
                let ret: any = CommonService.getSummaryData(
                    this.orderDetail,
                    this.summaryList
                )
                for (let i of this.summaryList) {
                    sm[i] = ret[i]
                }
            }
        }
    }

    private updateOrder(order) {
        this.originData = order
        // this.$nextTick(() => {
        this.order = order[0]
        this.save_flag = 1
        this.editAble = false
        this.orderDetail = this.order.package_lines.map(x => {
            return x
        })

        this.selectedRowKeys = []
        // })
        this.setFormValues()

        if (
            this.summaryList != undefined &&
            this.summaryList.length &&
            this.orderDetail.length
        ) {
            let sm = this.orderDetail.find(x => x.id == 'summary')
            let ret: any = CommonService.getSummaryData(
                this.orderDetail,
                this.summaryList
            )
            if (sm) {
                for (let i of this.summaryList) {
                    sm[i] = ret[i]
                }
            } else {
                ret['id'] = 'summary'
                this.orderDetail.push(ret)

                this.$nextTick(() => {
                    let querySelector = 'tr[data-row-key="summary"]'
                    let tr: any = document.querySelector(querySelector)
                    tr.style.background = '#fdfdfd'
                })
            }
        }
    }

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private created() {
        this.getcompany()
        this.getSystemuser()
        this.getVendorFullNameList()
        this.getLocationList()
        this.getDepartmentList()

        this.topDepartmentList = this.departmentList.filter(
            x => x.dept_type == 30
        )

        this.form = this.$form.createForm(this)
        this.form2 = this.$form.createForm(this)
    }

    private mounted() {
        this.detailColumns = [
            {
                key: 'default_code',
                title: this.$t('columns.default_code'),
                dataIndex: 'default_code',
                width: 100
            },
            {
                key: 'package_qty',
                title: this.$t('columns.package_qty'),
                dataIndex: 'package_qty',
                align: 'right',
                width: 100
            },
            {
                key: 'aktu_box_qty',
                title: this.$t('columns.aktu_box_qty'),
                width: 100,
                align: 'right',
                scopedSlots: { customRender: 'aktu_box_qty' }
            },
            {
                key: 'box_qty',
                title: this.$t('columns.box_qty'),
                dataIndex: 'box_qty',
                align: 'right',
                width: 100
            },
            {
                key: 'aktu_package_qty',
                title: this.$t('columns.aktu_package_qty'),
                width: 100,
                align: 'right',
                scopedSlots: { customRender: 'aktu_package_qty' }
            },
            {
                key: 'length',
                title: this.$t('columns.length'),
                dataIndex: 'length',
                align: 'right',
                width: 100
            },
            {
                key: 'width',
                title: this.$t('columns.width'),
                dataIndex: 'width',
                align: 'right',
                width: 100
            },
            {
                key: 'height',
                title: this.$t('columns.height'),
                dataIndex: 'height',
                align: 'right',
                width: 100
            },
            {
                key: 'gewicht',
                title: this.$t('columns.gewicht'),
                dataIndex: 'gewicht',
                align: 'right',
                width: 100
            },
            {
                key: 'is_fba',
                title: this.$t('columns.is_fba'),
                width: 100,
                align: 'center',
                scopedSlots: { customRender: 'is_fba' }
            },
            {
                key: 'is_change_sku',
                title: this.$t('columns.is_change_sku'),
                width: 100,
                align: 'center',
                scopedSlots: { customRender: 'is_change_sku' }
            },
            {
                key: 'change_no',
                title: this.$t('columns.change_no'),
                dataIndex: 'change_no',
                align: 'left',
                width: 120
            },
            {
                key: 'cp_note',
                title: this.$t('columns.cp_note'),
                width: 100,
                scopedSlots: { customRender: 'cp_note' }
            },
            {
                key: 'import_memo',
                title: this.$t('columns.import_memo'),
                width: 100,
                scopedSlots: { customRender: 'import_memo' }
            },
            {
                key: 'ist_box_qty',
                title: this.$t('columns.ist_box_qty'),
                dataIndex: 'ist_box_qty',
                align: 'center',
                width: 100,
                scopedSlots: { customRender: 'ist_box_qty' }
            },
            {
                key: 'location_id',
                title: this.$t('columns.location_id'),
                width: 100,
                scopedSlots: { customRender: 'location_id' }
            },
            {
                key: 'note',
                title: this.$t('columns.note'),
                width: 100,
                scopedSlots: { customRender: 'note' }
            },
            {
                key: 'order2_id',
                title: this.$t('columns.order2_id'),
                dataIndex: 'order2_id',
                width: 100
            },
            {
                key: 'out_number',
                title: this.$t('columns.out_number'),
                dataIndex: 'out_number',
                width: 100
            },
            {
                key: 'pack_qty',
                title: this.$t('columns.pack_qty'),
                dataIndex: 'pack_qty',
                align: 'right',
                width: 100
            },
            {
                key: 'pre_sale',
                title: this.$t('columns.pre_sale'),
                dataIndex: 'pre_sale',
                width: 100
            },
            {
                key: 'product_id',
                title: this.$t('columns.product_id'),
                dataIndex: 'product_id',
                width: 100
            },
            {
                key: 'dept_id',
                title: this.$t('columns.dept_id'),
                dataIndex: 'dept_id',
                width: 100,
                customRender: (value, row, index) => {
                    if (value) {
                        return this.getDepartName(value)
                    }
                    return value
                }
            },

            {
                key: 'state',
                title: this.$t('columns.state'),
                dataIndex: 'state',
                width: 100
            },
            {
                key: 'write_product_f4',
                title: this.$t('columns.write_product_f4'),
                width: 100,
                scopedSlots: { customRender: 'write_product_f4' }
            },
            {
                key: 'action',
                title: this.$t('action.action'),
                width: 80,
                fixed: 'right',
                scopedSlots: { customRender: 'action' }
            }
        ]
        if (this.save_flag == 0) {
            this.editAble = true
        }
        if (this.info) {
            this.updateOrder(this.info)
        }
        if (!this.menu_code) {
            this.menu_code = CommonService.getMenuCode('replenishment-demand')
        }

        this.domain = window.location.host
    }

    public setFormValues() {
        let values = this.form.getFieldsValue()
        let values2 = this.form2.getFieldsValue()
        for (let i in values) {
            values[i] = this.order[i]
        }
        for (let j in values2) {
            values2[j] = this.order[j]
        }
        this.form.setFieldsValue(values)
        this.form2.setFieldsValue(values2)
        // if (this.order.is_pd) {
        //     let is_pd: any = window.document.getElementById('is_pd')
        //     is_pd.parentNode.className = 'ant-checkbox ant-checkbox-checked'
        // }
    }

    private onCheckboxChange(id, e) {
        let dm: any = window.document.getElementById(id)
        if (e.target.checked) {
            dm.parentNode.className = 'ant-checkbox ant-checkbox-checked'
            dm.checked = true
        } else {
            dm.parentNode.className = 'ant-checkbox'
            dm.checked = false
        }
        let values = this.form.getFieldsValue()
        values[id] = e.target.checked
        this.form.setFieldsValue(values)
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private onSubmit() {
        this.form.validateFields().then((values: any) => {
            values['id'] = this.order.id
            delete values['pre_status']

            // for (let i of this.orderDetail) {
            //     if (
            //         i.aktu_box_qty < 1 ||
            //         i.aktu_package_qty < 1 ||
            //         !i.cp_note ||
            //         !i.import_memo ||
            //         i.location_id < 1 ||
            //         !i.note ||
            //         !i.write_product_f4
            //     ) {
            //         this.$message.error('请先完善明细中的信息,深色背景为必填项')
            //         return
            //     }
            // }
            values['package_lines'] = this.orderDetail
                .filter(y => y.id != 'summary')
                .map(x => {
                    return {
                        aktu_box_qty: x.aktu_box_qty,
                        aktu_package_qty: x.aktu_package_qty,
                        cp_note: x.cp_note,
                        id: x.id,
                        import_memo: x.import_memo,
                        is_fba: x.is_fba,
                        location_id: x.location_id,
                        note: x.note,
                        is_change_sku: x.is_change_sku
                            ? x.is_change_sku
                            : false,
                        write_product_f4: x.write_product_f4
                    }
                })
            this.form2.validateFields().then((values2: any) => {
                for (let i in values2) {
                    values[i] = values2[i]
                }
                this.innerAction.setActionAPI(
                    'purchase_management/save_package_order',
                    CommonService.getMenuCode('purchase-package-manage')
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
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
        })
    }

    private editChange() {
        this.editAble = !this.editAble
        let pageId = 'purchasepackageedit' + this.order.id
        let item = this.commonPageInfo.find(x => x.index == pageId)
        if (item) {
            if (this.editAble) {
                item.edit = 1
            } else {
                item.edit = 0
            }
        }
    }

    private getUserName(code) {
        let ret: any = code
        let item = this.systemUsers.find(x => x.code == code)
        if (item) {
            ret = item.name
        }
        return ret
    }

    private getVendorName(code) {
        let ret: any = code
        let item = this.vendorFullNameList.find(x => x.code == code)
        if (item) {
            ret = item.name
        }
        return ret
    }

    private onDelete(row) {
        this.innerAction.setActionAPI(
            'purchase_management/delete_package_order_line',
            CommonService.getMenuCode('purchase-package-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { line_id_list: [row.id] },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.orderDetail = this.orderDetail.filter(
                        x => x.id != row.id
                    )
                    this.onDataChange()
                    //更新缓存
                    let pageId = 'purchasepackageedit' + this.order.id
                    let item = this.commonPageInfo.find(x => x.index == pageId)
                    if (item) {
                        item.info[0].package_lines = this.orderDetail
                    }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onChangeGiveDate() {
        this.$modal
            .open(
                ChangeGiveDateForm,
                {},
                {
                    title: this.$t('action.change_give_date')
                }
            )
            .subscribe(
                data => {
                    this.innerAction.setActionAPI(
                        'purchase_management/update_purchase_order_line_give_date',
                        CommonService.getMenuCode('purchase-contract-manage')
                    )
                    this.publicService
                        .modify(
                            new RequestParams(
                                {
                                    line_id_list: this.selectedRowKeys,
                                    change_give_date: data.change_give_date,
                                    change_give_date_memo:
                                        data.change_give_date_memo
                                },
                                {
                                    loading: this.loadingService,
                                    innerAction: this.innerAction
                                }
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
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importInfo() {
        this.form.validateFields().then((values: any) => {
            values['id'] = this.order.id

            this.$modal
                .open(
                    UploadExcel,
                    {
                        urlPath:
                            '/ship_order/upload_ship_order_items&menu_code=' +
                            CommonService.getMenuCode('purchase-ship-order'),
                        uploadParams: values
                    },
                    {
                        title: 'Import',
                        width: '1000px'
                    }
                )
                .subscribe(
                    data => {
                        this.$message.success('操作成功')
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private onTbRowClick(row) {
        this.currentLi = row.id
    }

    private onRowChange(row, column, value) {
        if (
            Object.prototype.toString.call(value) === '[object InputEvent]' ||
            Object.prototype.toString.call(value) === '[object Event]' ||
            Object.prototype.toString.call(value) === '[object Object]'
        ) {
            if (value.target != undefined && value.target.value != undefined) {
                row[column] = value.target.value
            } else {
                row[column] = value
            }
        } else {
            row[column] = value
        }

        if (column == 'aktu_box_qty') {
            this.onDataChange()
        }
    }

    private addProduct() {
        this.$modal
            .open(
                AddPackageOrderProduct,
                {
                    package_id: this.order.id,
                    departmentList: this.topDepartmentList
                },
                {
                    title: this.$t('action.add_product'),
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.refreshLines()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private giveAktuValue() {
        this.innerAction.setActionAPI(
            'purchase_management/button_give_aktu_value',
            CommonService.getMenuCode('purchase-package-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { line_ids: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.orderDetail
                        .filter(y => this.selectedRowKeys.includes(y.id))
                        .map(x => {
                            x.aktu_package_qty = x.product_qty
                        })
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private writeF4() {
        this.innerAction.setActionAPI(
            'purchase_management/change_purchase_line_write_product_f4',
            CommonService.getMenuCode('purchase-package-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { line_ids: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
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

    private rWarehouse() {
        this.innerAction.setActionAPI(
            'purchase_management/change_product_f4_W_to_R',
            CommonService.getMenuCode('purchase-package-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { line_ids: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
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

    private tWarehouse() {
        this.innerAction.setActionAPI(
            'purchase_management/change_product_f4_W_to_T',
            CommonService.getMenuCode('purchase-package-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { line_ids: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
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

    private isBoxQty() {
        this.innerAction.setActionAPI(
            'purchase_management/button_is_box_qty',
            CommonService.getMenuCode('purchase-package-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { line_ids: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.orderDetail
                        .filter(y => this.selectedRowKeys.includes(y.id))
                        .map(x => {
                            x.ist_box_qty = !x.ist_box_qty
                            let nowDate = new Date()
                            let cur_date =
                                nowDate.getFullYear().toString() +
                                (nowDate.getMonth() + 1 < 10
                                    ? '0' + (nowDate.getMonth() + 1)
                                    : nowDate.getMonth() + 1
                                ).toString() +
                                (nowDate.getDate() < 10
                                    ? '0' + nowDate.getDate()
                                    : nowDate.getDate()
                                ).toString()

                            if (x.ist_box_qty) {
                                x.write_product_f4 =
                                    cur_date +
                                    'inL(+' +
                                    x.box_qty.toString() +
                                    ',' +
                                    this.locationDict[parseInt(x.location_id)] +
                                    ').sf'
                            } else {
                                x.write_product_f4 =
                                    cur_date +
                                    'inL(+' +
                                    x.box_qty.toString() +
                                    ',' +
                                    '2' +
                                    this.locationDict[parseInt(x.location_id)] +
                                    ').sf'
                            }
                        })
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private changeLocationId(name) {
        this.innerAction.setActionAPI(
            'purchase_management/change_purchase_line_location_id',
            CommonService.getMenuCode('purchase-package-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { line_ids: this.selectedRowKeys, name: name },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
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

    private onVerify(state) {
        this.innerAction.setActionAPI(
            'purchase_management/update_package_order_state',
            CommonService.getMenuCode('purchase-package-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { package_id_list: [this.order.id], state: state },
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

    private onLandIn() {
        this.innerAction.setActionAPI(
            'purchase_management/land_in_warehouse',
            CommonService.getMenuCode('purchase-package-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { package_id: this.order.id },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
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

    private inbound() {
        this.$modal
            .open(
                InboundPlan,
                {
                    name: this.form.getFieldValue('name')
                },
                {
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('success')
                    this.refreshLines()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private refreshLines() {
        this.innerAction.setActionAPI(
            'purchase_management/query_package_order_info',
            CommonService.getMenuCode('purchase-package-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    { package_id: this.order.id },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.orderDetail = data[0].package_lines.map(x => x)

                    if (
                        this.summaryList != undefined &&
                        this.summaryList.length &&
                        this.orderDetail.length
                    ) {
                        let sm = this.orderDetail.find(x => x.id == 'summary')
                        let ret: any = CommonService.getSummaryData(
                            this.orderDetail,
                            this.summaryList
                        )
                        if (sm) {
                            for (let i of this.summaryList) {
                                sm[i] = ret[i]
                            }
                        } else {
                            ret['id'] = 'summary'
                            this.orderDetail.push(ret)

                            this.$nextTick(() => {
                                let querySelector = 'tr[data-row-key="summary"]'
                                let tr: any = document.querySelector(
                                    querySelector
                                )
                                tr.style.background = '#fdfdfd'
                            })
                        }
                    }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getLocationList() {
        this.locationService.getLocationList(new RequestParams()).subscribe(
            data => {
                this.locationList = data
                for (let i of data) {
                    this.locationDict[i.code] = i.name
                }
            },
            err => {
                this.$message.error('获取库位列表失败')
            }
        )
    }

    private getDepartName(department) {
        let ret: any = department
        let item = this.departmentList.find(x => x.id == department)
        if (item) {
            ret = item.dept_name
        }
        return ret
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "aktu_box_qty": "Aktu Box Qty",
            "aktu_package_qty": "Aktu Package Qty",
            "box_qty": "Box Qty",
            "cp_note": "Cp Note",
            "default_code": "Default Code",
            "gewicht": "Gewicht",
            "height": "Height",
            "import_memo": "Import Memo",
            "is_fba": "Is Fba",
            "ist_box_qty": "Ist Box Qty",
            "length": "Length",
            "location_id": "Location",
            "note": "Note",
            "order2_id": "Order2 ID",
            "out_number": "Out Number",
            "pack_qty": "Pack Qty",
            "package_qty": "Package Qty",
            "pre_sale": "Pre Sale",
            "product_id": "Product ID",
            "product_qty": "Product Qty",
            "state": "State",
            "width": "Width",
            "dept_id": "Department",
            "write_product_f4": "Write Product F4",
            "is_change_sku": "Is SKU Changed",
            "change_no": "Change No."
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
            "sync_product_info": "Synchronize Product",
            "change_give_date": "Change Give Date",
            "import": "Import",
            "add_product": "新增产品",
            "write_f4": "Write F4",
            "aktu_value": "Aktu Value",
            "r_warehouse": "R Warehouse",
            "t_warehouse": "T Warehouse",
            "is_box_qty": "Is Box Qty",
            "confirm": "Confirm",
            "cancel": "Cancel",
            "reset": "Reset",
            "ship": "Ship",
            "set_to_ship": "Set To Ship",
            "land": "Land",
            "approved": "Approved",
            "process_clearance": "Process Clearance",
            "waiting_arrange_in": "Waiting Arrange In",
            "waiting_in": "Waiting In",
            "verify": "Verify",
            "cancel": "Cancel",
            "reset": "Reset",
            "ship": "Ship",
            "land": "Land",
            "approved": "Approved",
            "process_clearance": "Process Clearance",
            "waiting_in": "Waiting In",
            "land_in": "Land In",
            "set_to_draft": "To Draft",
            "inbound": "Inbound Plan(no items)"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "none": "None",
        "requirement_lines": "Requirement Lines",
        "logistic_info": "Logistic Info",
        "name": "Name",
        "ship_date": "Ship Date",
        "de_po": "De Po",
        "land_date": "ETA",
        "company_name": "Company Name",
        "etd_date": "ETD",
        "make_user": "Make User",
        "af_date": "Af Date",
        "approved_user": "Approved User",
        "yd_state": "Yd State",
        "doc_date": "Document Date",
        "yd_merge_time": "Yd Merge Time",
        "recv_date": "Recv Date",
        "yd_memo": "Yd Memo",
        "done_date": "Done Date",
        "source_doc1": "Source Doc1",
        "expect_eta": "Expect Eta",
        "carrier_name": "Carrier Name",
        "expect_etd": "Expect Etd",
        "bl_code": "Bl No.",
        "predict_eta": "Predict Eta",
        "package_code": "Package Code",
        "predict_eta_memo": "Predict Eta Memo",
        "bl_xingshi": "Bl Mode",
        "change_etd_memo": "Change Etd Memo",
        "express_name": "Express Name",
        "pre_status": "Pre Sale Symbol",
        "shipment_number": "Shipment Number",
        "warehouse_id": "Warehouse Id",
        "clearance_data_submit_date": "Clearance Data Submit Date",
        "real_date": "IN WH Date",
        "bl_finish_date": "Bl Finish Date",
        "is_pd": "Is Pd",
        "port_start": "Port Start",
        "ist_aushilfe": "Ist Aushilfe",
        "port_end": "Port End",
        "aushilfe_note": "Aushilfe Note",
        "note_text": "Note Text",
        "display_stock_in": "Display Stock In",
        "ist_number_qty": "Ist Number Qty",
        "ship_line": "Ship Line",
        "seal_num": "Seal No.",
        "thc_invoice": "Thc Invoice",
        "size_type": "Size Type",
        "vessel": "Vessel",
        "netto_weight": "Netto Weight",
        "terminal": "Terminal",
        "goods_description": "Goods Description",
        "trans_model": "Trans Model",
        "empty_depot": "Empty Depot",
        "pick_terminal": "Pick Up Time Terminal",
        "pick_reference": "Pick Reference",
        "demurrage_time": "Demurrage Time"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "columns": {
            "aktu_box_qty": "Aktu 箱数",
            "aktu_package_qty": "Aktu 数量",
            "box_qty": "箱数",
            "cp_note": "Cp Note",
            "default_code": "货号",
            "gewicht": "毛重",
            "height": "高",
            "import_memo": "Import Memo",
            "is_fba": "Fba产品",
            "ist_box_qty": "是否箱数",
            "length": "长",
            "location_id": "库位",
            "note": "Note",
            "order2_id": "Order2 ID",
            "out_number": "Out Number",
            "pack_qty": "Pack Qty",
            "package_qty": "Package Qty",
            "pre_sale": "预售",
            "product_id": "产品 ID",
            "product_qty": "产品数量",
            "state": "状态",
            "width": "宽",
            "dept_id": "部门",
            "write_product_f4": "写入产品F4",
            "is_change_sku": "是否变更SKU",
            "change_no": "变更单号"
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
            "sync_product_info": "同步产品信息",
            "change_give_date": "修改采购交期",
            "import": "导入",
            "add_product": "添加货柜明细",
            "write_f4": "Write F4",
            "aktu_value": "Aktu Value",
            "r_warehouse": "R Warehouse",
            "t_warehouse": "T Warehouse",
            "is_box_qty": "Is Box Qty",
            "confirm": "确认",
            "verify": "审核",
            "cancel": "取消",
            "reset": "重置",
            "ship": "Ship",
            "set_to_ship": "Set To Ship",
            "land": "Land",
            "approved": "Approved",
            "process_clearance": "Process Clearance",
            "waiting_arrange_in": "Waiting Arrange In",
            "waiting_in": "Waiting In",
            "land_in": "Land In",
            "set_to_draft": "设为草稿",
            "inbound": "Inbound Plan(no items)"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "none": "无",
        "requirement_lines": "Requirement Lines",
        "logistic_info": "Logistic Info",
        "name": "货柜号",
        "ship_date": "发船日期",
        "de_po": "De Po",
        "land_date": "ETA",
        "company_name": "公司名称",
        "etd_date": "ETD",
        "make_user": "创建人",
        "af_date": "预售结束时间",
        "approved_user": "审批人",
        "yd_state": "Yd State",
        "doc_date": "单据日期",
        "yd_merge_time": "Yd Merge Time",
        "recv_date": "接收日期",
        "yd_memo": "Yd Memo",
        "done_date": "完成日期",
        "source_doc1": "发票号",
        "expect_eta": "期望ETA",
        "carrier_name": "船公司简码",
        "expect_etd": "期望ETD",
        "bl_code": "提单号",
        "predict_eta": "变更ETA",
        "package_code": "集装箱号",
        "predict_eta_memo": "变更ETA原因",
        "bl_xingshi": "Bl Mode",
        "change_etd_memo": "变更ETD备注",
        "express_name": "快递公司",
        "pre_status": "预售标志",
        "shipment_number": "快递单号",
        "warehouse_id": "仓库",
        "clearance_data_submit_date": "清关资料提交时间",
        "real_date": "入库时间",
        "bl_finish_date": "电放完成时间",
        "is_pd": "是否盘点",
        "port_start": "始发港",
        "ist_aushilfe": "Ist Aushilfe",
        "port_end": "到达港",
        "aushilfe_note": "Aushilfe Note",
        "note_text": "备注",
        "display_stock_in": "库存",
        "ist_number_qty": "Ist Number Qty",
        "ship_line": "航线",
        "seal_num": "封条号/货柜号",
        "thc_invoice": "THC发票",
        "size_type": "Size Type",
        "vessel": "船名",
        "netto_weight": "净重",
        "terminal": "终点站",
        "goods_description": "Goods Description",
        "trans_model": "Trans Model",
        "empty_depot": "Empty Depot",
        "pick_terminal": "终点站开放时间",
        "pick_reference": "Pick Reference",
        "demurrage_time": "Demurrage Time"
    }
}
</i18n>
