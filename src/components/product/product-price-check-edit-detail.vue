<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 15, offset: 1 }"
        >
            <a-card>
                <div style="margin-top:10px;font-weight:600;color:#222;">
                    基础信息
                </div>
                <a-row :gutter="24">
                    <a-col :span="8">
                        <a-form-item label="SKU">
                            <a-input
                                v-decorator="['sku']"
                                size="small"
                                disabled
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="product_tmpl_id">
                            <a-input
                                v-decorator="['product_tmpl_id']"
                                size="small"
                                disabled
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.operator')">
                            <a-input
                                v-decorator="['operator']"
                                size="small"
                                disabled
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.z_category')">
                            <a-select
                                v-decorator="['cn_category']"
                                style="width: 120px"
                                @change="handleFatherCateChange"
                                size="small"
                                disabled
                            >
                                <a-select-option
                                    v-for="cate in fatherCates"
                                    :key="cate"
                                >
                                    {{ cate }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.z_sub_category')">
                            <a-select
                                v-decorator="['cn_sub_category']"
                                style="width: 200px;"
                                size="small"
                                disabled
                            >
                                <a-select-option
                                    v-for="cate in sonCates"
                                    :key="cate"
                                >
                                    {{ cate }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.weight')">
                            <a-input-number
                                v-decorator="['weight']"
                                :min="0"
                                size="small"
                                :disabled="!editAble"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.size1')">
                            <a-input-number
                                v-decorator="['size1']"
                                :min="0"
                                size="small"
                                :disabled="!editAble"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.size2')">
                            <a-input-number
                                v-decorator="['size2']"
                                :min="0"
                                size="small"
                                :disabled="!editAble"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.size3')">
                            <a-input-number
                                v-decorator="['size3']"
                                :min="0"
                                size="small"
                                :disabled="!editAble"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.package_size1')">
                            <a-input-number
                                v-decorator="['package_size1']"
                                :min="0"
                                size="small"
                                :disabled="!editAble"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.package_size2')">
                            <a-input-number
                                v-decorator="['package_size2']"
                                :min="0"
                                size="small"
                                :disabled="!editAble"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.package_size3')">
                            <a-input-number
                                v-decorator="['package_size3']"
                                :min="0"
                                size="small"
                                :disabled="!editAble"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.pack_num')">
                            <a-input-number
                                v-decorator="['pack_num']"
                                :min="0"
                                size="small"
                                :disabled="!editAble"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.girth')">
                            <a-input-number
                                v-decorator="['girth']"
                                :min="0"
                                size="small"
                                :disabled="!editAble"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.volume')">
                            <a-input-number
                                v-decorator="['volume']"
                                :min="0"
                                size="small"
                                :disabled="!editAble"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-card>
            <a-card style="margin-top:5px;">
                <div style="margin-top:10px;font-weight:600;color:#222;">
                    采购信息
                </div>
                <a-row :gutter="24">
                    <a-col :span="8">
                        <a-form-item
                            :label="$t('columns.purchase_price')"
                            required
                        >
                            <a-input-number
                                v-decorator="[
                                    'purchase_price',
                                    { rules: rules.required }
                                ]"
                                :min="0"
                                size="small"
                                :disabled="!editAble"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.money_type')">
                            <a-select
                                v-decorator="['money_type']"
                                style="width: 120px"
                                size="small"
                                :disabled="!editAble"
                            >
                                <a-select-option key="人民币" value="人民币">
                                    人民币
                                </a-select-option>
                                <a-select-option key="欧元" value="欧元">
                                    欧元
                                </a-select-option>
                                <a-select-option key="美金" value="美金">
                                    美金
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.refund_tax')">
                            <a-input-number
                                v-decorator="['refund_tax']"
                                :min="0"
                                size="small"
                                :disabled="!editAble"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.ero_to_cn')">
                            <a-input-number
                                v-decorator="['ero_to_cn']"
                                :min="0"
                                size="small"
                                :disabled="!editAble"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.dollar_to_cn')">
                            <a-input-number
                                v-decorator="['dollar_to_cn']"
                                :min="0"
                                size="small"
                                :disabled="!editAble"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.custom_tax')">
                            <a-input-number
                                v-decorator="['custom_tax']"
                                :min="0"
                                size="small"
                                :disabled="!editAble"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.cost_price')">
                            <a-input-number
                                v-decorator="['cost_price']"
                                :min="0"
                                size="small"
                                disabled
                            />
                        </a-form-item>
                    </a-col>
                    <!-- <a-col :span="8">
                        <a-form-item :label="$t('columns.change_reason')">
                            <a-input
                                v-decorator="['change_reason']"
                                size="small"
                                :disabled="!editAble"
                            />
                        </a-form-item>
                    </a-col> -->
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.memo')" required>
                            <a-textarea
                                v-decorator="[
                                    'memo',
                                    { rules: rules.required }
                                ]"
                                size="small"
                                :disabled="!editAble"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-card>
        </a-form>
        <a-card style="margin-top:5px;">
            <a-tabs defaultActiveKey="shipment" @change="e => onPanelChange(e)">
                <a-tab-pane tab="运费" key="shipment">
                    <div style="margin-top:10px;font-weight:600;color:#222;">
                        MFN运费
                    </div>
                    <a-form
                        class="data-form"
                        layout="inline"
                        :form="form2"
                        :labelCol="{ span: 8 }"
                        :wrapperCol="{ span: 15, offset: 1 }"
                    >
                        <a-row :gutter="24">
                            <a-col :span="8">
                                <a-form-item
                                    :label="$t('columns.de_lowest_profit')"
                                >
                                    <a-input-number
                                        v-decorator="['de_lowest_profit']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item
                                    :label="$t('columns.de_mfn_shipment_fee')"
                                >
                                    <a-input-number
                                        v-decorator="['de_mfn_shipment_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item
                                    :label="$t('columns.gb_mfn_shipment_fee')"
                                >
                                    <a-input-number
                                        v-decorator="['gb_mfn_shipment_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item
                                    :label="$t('columns.fr_mfn_shipment_fee')"
                                >
                                    <a-input-number
                                        v-decorator="['fr_mfn_shipment_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item
                                    :label="$t('columns.it_mfn_shipment_fee')"
                                >
                                    <a-input-number
                                        v-decorator="['it_mfn_shipment_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item
                                    :label="$t('columns.gb_own_shipment_fee')"
                                >
                                    <a-input-number
                                        v-decorator="['gb_own_shipment_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item
                                    :label="$t('columns.es_mfn_shipment_fee')"
                                >
                                    <a-input-number
                                        v-decorator="['es_mfn_shipment_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item
                                    :label="$t('columns.nl_mfn_shipment_fee')"
                                >
                                    <a-input-number
                                        v-decorator="['nl_mfn_shipment_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item
                                    :label="$t('columns.pl_mfn_shipment_fee')"
                                >
                                    <a-input-number
                                        v-decorator="['pl_mfn_shipment_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item
                                    :label="$t('columns.at_mfn_shipment_fee')"
                                >
                                    <a-input-number
                                        v-decorator="['at_mfn_shipment_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item
                                    :label="$t('columns.be_mfn_shipment_fee')"
                                >
                                    <a-input-number
                                        v-decorator="['be_mfn_shipment_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item
                                    :label="$t('columns.lu_mfn_shipment_fee')"
                                >
                                    <a-input-number
                                        v-decorator="['lu_mfn_shipment_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <div
                            style="margin-top:10px;font-weight:600;color:#222;"
                        >
                            FBA运费
                        </div>
                        <a-row :gutter="24">
                            <a-col :span="8">
                                <a-form-item :label="$t('columns.de_fba_fee')">
                                    <a-input-number
                                        v-decorator="['de_fba_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item :label="$t('columns.fr_fba_fee')">
                                    <a-input-number
                                        v-decorator="['fr_fba_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item :label="$t('columns.gb_fba_fee')">
                                    <a-input-number
                                        v-decorator="['gb_fba_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item
                                    :label="$t('columns.gb_own_fba_fee')"
                                >
                                    <a-input-number
                                        v-decorator="['gb_own_fba_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item :label="$t('columns.it_fba_fee')">
                                    <a-input-number
                                        v-decorator="['it_fba_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item :label="$t('columns.es_fba_fee')">
                                    <a-input-number
                                        v-decorator="['es_fba_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item :label="$t('columns.nl_fba_fee')">
                                    <a-input-number
                                        v-decorator="['nl_fba_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item :label="$t('columns.se_fba_fee')">
                                    <a-input-number
                                        v-decorator="['se_fba_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item :label="$t('columns.pl_fba_fee')">
                                    <a-input-number
                                        v-decorator="['pl_fba_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item
                                    :label="$t('columns.de_prime_fee')"
                                >
                                    <a-input-number
                                        v-decorator="['de_prime_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item
                                    :label="$t('columns.fr_cd_fbc_fee')"
                                >
                                    <a-input-number
                                        v-decorator="['fr_cd_fbc_fee']"
                                        size="small"
                                        :min="0"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-form>
                </a-tab-pane>
                <a-tab-pane tab="最低定价" key="lowest">
                    <div>
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            基础信息
                        </h3>
                        <a-table
                            :dataSource="[order]"
                            :pagination="false"
                            style="table-layout:fixed;width:700px;"
                            rowKey="index"
                            bordered
                        >
                            <a-table-column
                                :title="$t('columns.after_refund_tax')"
                                key="after_refund_tax"
                                data-index="after_refund_tax"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.header_fee')"
                                key="header_fee"
                                data-index="header_fee"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.other_fee')"
                                key="other_fee"
                                data-index="other_fee"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.custom_fee')"
                                key="custom_tax"
                                data-index="custom_fee"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.ae_commission_rate')"
                                key="custom_tax"
                                data-index="ae_commission_rate"
                                align="center"
                                width="160px"
                            ></a-table-column>
                        </a-table>
                    </div>
                    <div>
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            MFN最低定价
                        </h3>
                        <a-table
                            :dataSource="[order]"
                            :pagination="false"
                            style="table-layout:fixed;max-width:1100px;"
                            rowKey="index"
                            bordered
                        >
                            <a-table-column
                                :title="$t('columns.de_mfn_lowest_price')"
                                key="de_mfn_lowest_price"
                                data-index="de_mfn_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.gb_own_lowest_price')"
                                key="gb_own_lowest_price"
                                data-index="gb_own_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.fr_mfn_lowest_price')"
                                key="fr_mfn_lowest_price"
                                data-index="fr_mfn_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.it_mfn_lowest_price')"
                                key="it_mfn_lowest_price"
                                data-index="it_mfn_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.es_mfn_lowest_price')"
                                key="es_mfn_lowest_price"
                                data-index="es_mfn_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.nl_mfn_lowest_price')"
                                key="nl_mfn_lowest_price"
                                data-index="nl_mfn_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.pl_mfn_lowest_price')"
                                key="pl_mfn_lowest_price"
                                data-index="pl_mfn_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                        </a-table>
                    </div>
                    <div>
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            FBA最低定价
                        </h3>
                        <a-table
                            :dataSource="[order]"
                            :pagination="false"
                            style="table-layout:fixed;"
                            rowKey="index"
                            bordered
                        >
                            <a-table-column
                                :title="$t('columns.de_fba_lowest_price')"
                                key="de_fba_lowest_price"
                                data-index="de_fba_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.fr_fba_lowest_price')"
                                key="fr_fba_lowest_price"
                                data-index="fr_fba_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.gb_own_fba_lowest_price')"
                                key="gb_own_fba_lowest_price"
                                data-index="gb_own_fba_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.it_fba_lowest_price')"
                                key="it_fba_lowest_price"
                                data-index="it_fba_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.es_fba_lowest_price')"
                                key="es_fba_lowest_price"
                                data-index="es_fba_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.nl_fba_lowest_price')"
                                key="nl_fba_lowest_price"
                                data-index="nl_fba_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.se_fba_lowest_price')"
                                key="se_fba_lowest_price"
                                data-index="se_fba_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.pl_fba_lowest_price')"
                                key="pl_fba_lowest_price"
                                data-index="pl_fba_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                        </a-table>
                    </div>
                    <div>
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            B2C最低定价
                        </h3>
                        <a-table
                            :dataSource="[order]"
                            :pagination="false"
                            style="table-layout:fixed;max-width:900px;"
                            rowKey="index"
                            bordered
                        >
                            <a-table-column
                                :title="$t('columns.de_b2c_lowest_price')"
                                key="de_b2c_lowest_price"
                                data-index="de_b2c_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.fr_b2c_lowest_price')"
                                key="fr_b2c_lowest_price"
                                data-index="fr_b2c_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.gb_b2c_lowest_price')"
                                key="gb_b2c_lowest_price"
                                data-index="gb_b2c_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.it_b2c_lowest_price')"
                                key="it_b2c_lowest_price"
                                data-index="it_b2c_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.es_b2c_lowest_price')"
                                key="es_b2c_lowest_price"
                                data-index="es_b2c_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.nl_b2c_lowest_price')"
                                key="nl_b2c_lowest_price"
                                data-index="nl_b2c_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                        </a-table>
                    </div>
                    <div>
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            速卖通最低定价
                        </h3>
                        <a-table
                            :dataSource="[order]"
                            :pagination="false"
                            style="table-layout:fixed;"
                            rowKey="index"
                            bordered
                        >
                            <a-table-column
                                :title="$t('columns.de_ae_lowest_price')"
                                key="de_ae_lowest_price"
                                data-index="de_ae_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.fr_ae_lowest_price')"
                                key="fr_ae_lowest_price"
                                data-index="fr_ae_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <!-- <a-table-column
                                :title="$t('columns.gb_ae_lowest_price')"
                                key="gb_ae_lowest_price"
                                data-index="gb_ae_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column> -->
                            <a-table-column
                                :title="$t('columns.gb_own_ae_lowest_price')"
                                key="gb_own_ae_lowest_price"
                                data-index="gb_own_ae_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.it_ae_lowest_price')"
                                key="it_ae_lowest_price"
                                data-index="it_ae_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.es_ae_lowest_price')"
                                key="es_ae_lowest_price"
                                data-index="es_ae_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.at_ae_lowest_price')"
                                key="at_ae_lowest_price"
                                data-index="at_ae_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.be_ae_lowest_price')"
                                key="be_ae_lowest_price"
                                data-index="be_ae_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.lu_ae_lowest_price')"
                                key="lu_ae_lowest_price"
                                data-index="lu_ae_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                        </a-table>
                    </div>
                    <div>
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            Prime最低定价
                        </h3>
                        <a-table
                            :dataSource="[order]"
                            :pagination="false"
                            style="table-layout:fixed;width:300px;"
                            rowKey="index"
                            bordered
                        >
                            <a-table-column
                                :title="$t('columns.de_prime_normal_price')"
                                key="de_prime_normal_price"
                                data-index="de_prime_normal_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.de_prime_fee')"
                                key="de_prime_discount_price"
                                data-index="de_prime_discount_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                        </a-table>
                    </div>
                    <div>
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            CD最低定价
                        </h3>
                        <a-table
                            :dataSource="[order]"
                            :pagination="false"
                            style="table-layout:fixed;width:300px;"
                            rowKey="index"
                            bordered
                        >
                            <a-table-column
                                :title="$t('columns.fr_cd_mfn_price')"
                                key="fr_cd_mfn_price"
                                data-index="fr_cd_mfn_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.fr_cd_fbc_price')"
                                key="fr_cd_fbc_price"
                                data-index="fr_cd_fbc_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                        </a-table>
                    </div>
                    <div>
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            速卖通不含税最低定价
                        </h3>
                        <a-table
                            :dataSource="[order]"
                            :pagination="false"
                            style="table-layout:fixed;"
                            rowKey="index"
                            bordered
                        >
                            <a-table-column
                                :title="
                                    'DE-速卖通' + $t('columns.bhs_lowest_price')
                                "
                                key="de_ae_untax_lowest_price"
                                data-index="de_ae_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'FR-速卖通' + $t('columns.bhs_lowest_price')
                                "
                                key="fr_ae_untax_lowest_price"
                                data-index="fr_ae_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'GB英仓-速卖通' +
                                        $t('columns.bhs_lowest_price')
                                "
                                key="gb_ae_untax_lowest_price"
                                data-index="gb_ae_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'IT-速卖通' + $t('columns.bhs_lowest_price')
                                "
                                key="it_ae_untax_lowest_price"
                                data-index="it_ae_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'ES-速卖通' + $t('columns.bhs_lowest_price')
                                "
                                key="es_ae_untax_lowest_price"
                                data-index="es_ae_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'AT-速卖通' + $t('columns.bhs_lowest_price')
                                "
                                key="at_ae_untax_lowest_price"
                                data-index="at_ae_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'BE-速卖通' + $t('columns.bhs_lowest_price')
                                "
                                key="be_ae_untax_lowest_price"
                                data-index="be_ae_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'LU-速卖通' + $t('columns.bhs_lowest_price')
                                "
                                key="lu_ae_untax_lowest_price"
                                data-index="lu_ae_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'PL-速卖通' + $t('columns.bhs_lowest_price')
                                "
                                key="pl_ae_untax_lowest_price"
                                data-index="pl_ae_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                        </a-table>
                    </div>
                    <div>
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            Wish Express不含税最低定价
                        </h3>
                        <a-table
                            :dataSource="[order]"
                            :pagination="false"
                            style="table-layout:fixed;"
                            rowKey="index"
                            bordered
                        >
                            <a-table-column
                                :title="
                                    'DE-WishExpress' +
                                        $t('columns.bhs_lowest_price')
                                "
                                key="de_we_untax_lowest_price"
                                data-index="de_we_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'FR-WishExpress' +
                                        $t('columns.bhs_lowest_price')
                                "
                                key="fr_we_untax_lowest_price"
                                data-index="fr_we_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'GB英仓-WishExpress' +
                                        $t('columns.bhs_lowest_price')
                                "
                                key="gb_we_untax_lowest_price"
                                data-index="gb_we_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'IT-WishExpress' +
                                        $t('columns.bhs_lowest_price')
                                "
                                key="it_we_untax_lowest_price"
                                data-index="it_we_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'ES-WishExpress' +
                                        $t('columns.bhs_lowest_price')
                                "
                                key="es_we_untax_lowest_price"
                                data-index="es_we_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'AT-WishExpress' +
                                        $t('columns.bhs_lowest_price')
                                "
                                key="at_we_untax_lowest_price"
                                data-index="at_we_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'NL-WishExpress' +
                                        $t('columns.bhs_lowest_price')
                                "
                                key="nl_we_untax_lowest_price"
                                data-index="nl_we_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'PL-WishExpress' +
                                        $t('columns.bhs_lowest_price')
                                "
                                key="pl_we_untax_lowest_price"
                                data-index="pl_we_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                        </a-table>
                    </div>
                    <div>
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            Wish Express含税最低定价
                        </h3>
                        <a-table
                            :dataSource="[order]"
                            :pagination="false"
                            style="table-layout:fixed;"
                            rowKey="index"
                            bordered
                        >
                            <a-table-column
                                :title="
                                    'DE-WishExpress' +
                                        $t('columns.hs_lowest_price')
                                "
                                key="de_we_lowest_price"
                                data-index="de_we_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'FR-WishExpress' +
                                        $t('columns.hs_lowest_price')
                                "
                                key="fr_we_lowest_price"
                                data-index="fr_we_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'GB英仓-WishExpress' +
                                        $t('columns.hs_lowest_price')
                                "
                                key="gb_we_lowest_price"
                                data-index="gb_we_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'IT-WishExpress' +
                                        $t('columns.hs_lowest_price')
                                "
                                key="it_we_lowest_price"
                                data-index="it_we_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'ES-WishExpress' +
                                        $t('columns.hs_lowest_price')
                                "
                                key="es_we_lowest_price"
                                data-index="es_we_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'AT-WishExpress' +
                                        $t('columns.hs_lowest_price')
                                "
                                key="at_we_lowest_price"
                                data-index="at_we_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'NL-WishExpress' +
                                        $t('columns.hs_lowest_price')
                                "
                                key="nl_we_lowest_price"
                                data-index="nl_we_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'PL-WishExpress' +
                                        $t('columns.hs_lowest_price')
                                "
                                key="pl_we_lowest_price"
                                data-index="pl_we_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                        </a-table>
                    </div>
                    <div>
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            Wish Standard不含税最低定价
                        </h3>
                        <a-table
                            :dataSource="[order]"
                            :pagination="false"
                            style="table-layout:fixed;"
                            rowKey="index"
                            bordered
                        >
                            <a-table-column
                                :title="
                                    'DE-WishStandard' +
                                        $t('columns.bhs_lowest_price')
                                "
                                key="de_ws_untax_lowest_price"
                                data-index="de_ws_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'FR-WishStandard' +
                                        $t('columns.bhs_lowest_price')
                                "
                                key="fr_ws_untax_lowest_price"
                                data-index="fr_ws_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'GB英仓-WishStandard' +
                                        $t('columns.bhs_lowest_price')
                                "
                                key="gb_ws_untax_lowest_price"
                                data-index="gb_ws_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'IT-WishStandard' +
                                        $t('columns.bhs_lowest_price')
                                "
                                key="it_ws_untax_lowest_price"
                                data-index="it_ws_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'ES-WishStandard' +
                                        $t('columns.bhs_lowest_price')
                                "
                                key="es_ws_untax_lowest_price"
                                data-index="es_ws_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'AT-WishStandard' +
                                        $t('columns.bhs_lowest_price')
                                "
                                key="at_ws_untax_lowest_price"
                                data-index="at_ws_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'NL-WishStandard' +
                                        $t('columns.bhs_lowest_price')
                                "
                                key="nl_ws_untax_lowest_price"
                                data-index="nl_ws_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'PL-WishStandard' +
                                        $t('columns.bhs_lowest_price')
                                "
                                key="pl_ws_untax_lowest_price"
                                data-index="pl_ws_untax_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                        </a-table>
                    </div>
                    <div>
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            Wish Standard含税最低定价
                        </h3>
                        <a-table
                            :dataSource="[order]"
                            :pagination="false"
                            style="table-layout:fixed;"
                            rowKey="index"
                            bordered
                        >
                            <a-table-column
                                :title="
                                    'DE-WishStandard' +
                                        $t('columns.hs_lowest_price')
                                "
                                key="de_ws_lowest_price"
                                data-index="de_ws_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'FR-WishStandard' +
                                        $t('columns.hs_lowest_price')
                                "
                                key="fr_ws_lowest_price"
                                data-index="fr_ws_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'GB英仓-WishStandard' +
                                        $t('columns.hs_lowest_price')
                                "
                                key="gb_ws_lowest_price"
                                data-index="gb_ws_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'IT-WishStandard' +
                                        $t('columns.hs_lowest_price')
                                "
                                key="it_ws_lowest_price"
                                data-index="it_ws_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'ES-WishStandard' +
                                        $t('columns.hs_lowest_price')
                                "
                                key="es_ws_lowest_price"
                                data-index="es_ws_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'AT-WishStandard' +
                                        $t('columns.hs_lowest_price')
                                "
                                key="at_ws_lowest_price"
                                data-index="at_ws_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'NL-WishStandard' +
                                        $t('columns.hs_lowest_price')
                                "
                                key="nl_ws_lowest_price"
                                data-index="nl_ws_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="
                                    'PL-WishStandard' +
                                        $t('columns.hs_lowest_price')
                                "
                                key="pl_ws_lowest_price"
                                data-index="pl_ws_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                        </a-table>
                    </div>
                    <div>
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            Manomano最低定价
                        </h3>
                        <a-table
                            :dataSource="[order]"
                            :pagination="false"
                            style="table-layout:fixed;width:300px;"
                            rowKey="index"
                            bordered
                        >
                            <a-table-column
                                :title="$t('columns.de_manomano_lowest_price')"
                                key="de_mano_lowest_price"
                                data-index="de_mano_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                            <a-table-column
                                :title="$t('columns.fr_manomano_lowest_price')"
                                key="fr_mano_lowest_price"
                                data-index="fr_mano_lowest_price"
                                align="center"
                                width="100px"
                            ></a-table-column>
                        </a-table>
                    </div>
                </a-tab-pane>
                <a-tab-pane tab="折扣" key="discount">
                    <ProductPriceCheckDiscountForm
                        ref="discountForm"
                        :info="this.order"
                        :edit="editAble"
                        :showBtn="!history"
                    />
                </a-tab-pane>
                <a-tab-pane tab="浮动" key="float" v-if="!history">
                    <SetPreProductFloatPrice :row="order" :edit="editAble" />
                </a-tab-pane>
                <a-tab-pane tab="日志" key="log"
                    ><LogView
                        object_name="product_price_log"
                        :record_code="order.id"
                        :is_special_table="true"
                    ></LogView
                ></a-tab-pane>
            </a-tabs>
        </a-card>
    </section>
</template>

<style>
.ant-input-number-disabled .ant-input-number-input {
    cursor: not-allowed;
    color: #666;
}
</style>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { GeneralCodeService } from '~/services/generate_code.service'
import LogView from '~/shared/common/log-view.vue'
import { ReportService } from '../../services/report.service'
import SetPreProductFloatPrice from '@/components/product/set-pre-product-float-price.vue'
import ProductPriceCheckDiscountForm from '@/components/product/product-price-check-discount-form.vue'

@Component({
    components: {
        LogView,
        SetPreProductFloatPrice,
        ProductPriceCheckDiscountForm
    }
})
export default class ProductPriceCheckEditDetail extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private info

    @Prop({ default: false })
    private edit

    @Prop({ default: false })
    private history

    private form: any

    private form2: any

    private order: any = []

    private originData: any = []

    private save_flag: any = 1

    private editAble: any = false

    private loadingService = new LoadingService()

    private generalCodeService = new GeneralCodeService()

    private reportService = new ReportService()

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    @Watch('info')
    onInfoChange() {
        if (this.info) {
            this.editAble = false
            this.updateOrder(this.info)
        }
    }

    @Watch('edit')
    onEditChange() {
        this.editAble = this.edit
    }

    private updateOrder(order) {
        order.volume = order.volume ? parseFloat(order.volume.toFixed(2)) : ''
        this.originData = order
        this.form.setFieldsValue(order)
        this.form2.setFieldsValue(order)
        this.$nextTick(() => {
            this.order = order
            this.save_flag = 1
            this.editAble = false
        })
    }

    private created() {
        this.getCn_cate()
        this.form = this.$form.createForm(this)
        this.form2 = this.$form.createForm(this)
    }

    private mounted() {
        this.editAble = this.edit
        if (this.info.length) {
            this.updateOrder(this.info)
        }
    }

    private getCn_cate() {
        this.reportService.query_category_dict(new RequestParams()).subscribe(
            data => {
                this.cateDict = data[0]
                let cateData = data[0]
                for (let i in cateData) {
                    this.fatherCates.push(i)
                }
            },
            error => {
                this.$message.error(error.message)
            }
        )
    }

    public getFormData() {
        let values = this.form.getFieldsValue()
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                //
            }
        })
        return values
    }

    private saveInfo(data) {
        this.generalCodeService
            .createProductGenerateCode(
                new RequestParams(data, { loading: this.loadingService })
            )
            .subscribe(
                () => {
                    this.submit()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }
    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }

    private activePanel: any = ''

    private onPanelChange(e) {
        this.activePanel = e
    }
}
</script>
<i18n>
{
  "en-us": {
    "desc": "",
    "columns":{
        "ae_commission_rate":"ae_commission_rate",
        "after_refund_tax":"after_refund_tax",
        "at_ae_lowest_price":"at_ae_lowest_price",
        "at_mfn_shipment_fee":"at_mfn_shipment_fee",
        "au_mfn_shipment_fee":"au_mfn_shipment_fee",
        "be_ae_lowest_price":"be_ae_lowest_price",
        "be_mfn_shipment_fee":"be_mfn_shipment_fee",
        "cn_category":"cn_category",
        "cn_sub_category":"cn_sub_category",
        "compute_state":"compute_state",
        "custom_fee":"custom_fee",
        "custom_tax":"custom_tax",
        "de_ae_lowest_price":"de_ae_lowest_price",
        "de_b2c_lowest_price":"de_b2c_lowest_price",
        "de_fba_fee":"de_fba_fee",
        "de_fba_lowest_price":"de_fba_lowest_price",
        "de_lowest_profit":"de_lowest_profit",
        "de_mfn_lowest_price":"de_mfn_lowest_price",
        "de_mfn_shipment_fee":"de_mfn_shipment_fee",
        "de_prime_discount_price":"de_prime_discount_price",
        "de_prime_fee":"de_prime_fee",
        "de_prime_normal_price":"de_prime_normal_price",
        "discount_end":"discount_end",
        "discount_percent":"discount_percent",
        "discount_start":"discount_start",
        "dollar_to_cn":"dollar_to_cn",
        "ero_to_cn":"ero_to_cn",
        "es_ae_lowest_price":"es_ae_lowest_price",
        "es_b2c_lowest_price":"es_b2c_lowest_price",
        "es_fba_fee":"es_fba_fee",
        "es_fba_lowest_price":"es_fba_lowest_price",
        "es_float_price":"es_float_price",
        "es_mfn_lowest_price":"es_mfn_lowest_price",
        "es_mfn_shipment_fee":"es_mfn_shipment_fee",
        "float_platform":"float_platform",
        "float_price":"float_price",
        "fr_ae_lowest_price":"fr_ae_lowest_price",
        "fr_b2c_lowest_price":"fr_b2c_lowest_price",
        "fr_cd_fbc_fee":"fr_cd_fbc_fee",
        "fr_cd_fbc_price":"fr_cd_fbc_price",
        "fr_cd_mfn_price":"fr_cd_mfn_price",
        "fr_fba_fee":"fr_fba_fee",
        "fr_fba_lowest_price":"fr_fba_lowest_price",
        "fr_float_price":"fr_float_price",
        "fr_mfn_lowest_price":"fr_mfn_lowest_price",
        "fr_mfn_shipment_fee":"fr_mfn_shipment_fee",
        "gb_ae_lowest_price":"gb_ae_lowest_price",
        "gb_b2c_lowest_price":"gb_b2c_lowest_price",
        "gb_fba_fee":"gb_fba_fee",
        "gb_fba_lowest_price":"gb_fba_lowest_price",
        "gb_mfn_lowest_price":"gb_mfn_lowest_price",
        "gb_mfn_shipment_fee":"gb_mfn_shipment_fee",
        "gb_own_ae_lowest_price":"gb_own_ae_lowest_price",
        "gb_own_fba_fee":"gb_own_fba_fee",
        "gb_own_fba_lowest_price":"gb_own_fba_lowest_price",
        "gb_own_lowest_price":"gb_own_lowest_price",
        "girth":"girth",
        "header_fee":"header_fee",
        "id":"id",
        "it_ae_lowest_price":"it_ae_lowest_price",
        "it_b2c_lowest_price":"it_b2c_lowest_price",
        "it_fba_fee":"it_fba_fee",
        "it_fba_lowest_price":"it_fba_lowest_price",
        "it_float_price":"it_float_price",
        "it_mfn_lowest_price":"it_mfn_lowest_price",
        "it_mfn_shipment_fee":"it_mfn_shipment_fee",
        "latest_compute_time":"latest_compute_time",
        "lu_ae_lowest_price":"lu_ae_lowest_price",
        "lu_mfn_shipment_fee":"lu_mfn_shipment_fee",
        "money_type":"money_type",
        "nl_ae_lowest_price":"nl_ae_lowest_price",
        "nl_b2c_lowest_price":"nl_b2c_lowest_price",
        "nl_fba_fee":"nl_fba_fee",
        "nl_fba_lowest_price":"nl_fba_lowest_price",
        "nl_float_price":"nl_float_price",
        "nl_mfn_lowest_price":"nl_mfn_lowest_price",
        "nl_mfn_shipment_fee":"nl_mfn_shipment_fee",
        "operator":"operator",
        "other_fee":"other_fee",
        "pack_num":"pack_num",
        "pl_ae_lowest_price":"pl_ae_lowest_price",
        "pl_fba_fee":"pl_fba_fee",
        "pl_fba_lowest_price":"pl_fba_lowest_price",
        "pl_float_price":"pl_float_price",
        "pl_mfn_lowest_price":"pl_mfn_lowest_price",
        "pl_mfn_shipment_fee":"pl_mfn_shipment_fee",
        "refund_tax":"refund_tax",
        "se_fba_fee":"se_fba_fee",
        "se_fba_lowest_price":"se_fba_lowest_price",
        "size1":"size1",
        "size2":"size2",
        "size3":"size3",
        "package_size1":"package_size1",
        "package_size2":"package_size2",
        "package_size3":"package_size3",
        "sku":"sku",
        "uk_float_price":"uk_float_price",
        "volume":"volume",
        "purchase_price":"purchase_price",
        "cost_price":"cost_price",
        "change_reason":"Change Reason",
        "warehouse":"Waerhouse",
        "weight":"Weight",
        "memo":"Memo",
        "fr_cd_fbc_fee":"FR CD FBC Fee",
        "de_prime_fee":"DE Prime Fee",
        "de_manomano_lowest_price":"de_manomano_lowest_price",
        "fr_manomano_lowest_price":"fr_manomano_lowest_price",
        "hs_lowest_price": "-hs-Lowest-Price",
        "bhs_lowest_price": "-bhs-Lowest-Price",
        "gb_own_shipment_fee":"GB own shipment fee",
        "ae_commission_rate":"AE commission rate"
    },
    "action":{
        "edit":"Edit",
        "cancel":"Cancel",
        "more":"More",
        "action":"Action",
        "add":"Add",
        "export":"Export",
        "save":"Save",
        "pre_check":"Pre Check",
        "deal_update_for_check":"处理更新核价(update)",
        "deal_new":"处理新加核价(new)",
        "deal_allnew":"处理新加数据获取核价(allnew)",
        "flag_to_update":"标注为update",
        "flag_to_new":"标注为new",
        "flag_to_allnew":"标注为allnew",
        "recheck_for_ship":"物流费用变动后一键重新核价",
        "recheck_for_sku":"插入相同通用货号基础产品核价",
        "recheck_for_update":"一键更新相同通用货号核价数据"
    },
    "delete":"Are you sure delete?",
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Delete Success",
    "please_choose":"Please Choose",
    "sku":"SKU",
    "check_type":"Check Type",
    "memo":"Memo",
    "check_date":"Check Date",
    "approve_state":"Approve State",
    "actions":"Action",
    "view":"View"
  },
  "zh-cn": {
    "desc": "",
    "columns":{
       "ae_commission_rate":"ae_commission_rate",
        "after_refund_tax":"退后税",
        "at_mfn_shipment_fee":"AT-MFN运费",
        "au_mfn_shipment_fee":"AU-MFN运费",
        "be_mfn_shipment_fee":"BE-MFN运费",
        "cn_category":"中文分类",
        "cn_sub_category":"中文子类",
        "compute_state":"compute_state",
        "custom_fee":"关税",
        "custom_tax":"关税税率",
        "de_fba_fee":"DE-FBA费用",
        "de_lowest_profit":"DE-MFN最低毛利率",
        "de_mfn_shipment_fee":"DE-MFN运费",
        "de_prime_discount_price":"de_prime_discount_price",
        "discount_end":"折扣结束时间",
        "discount_percent":"折扣百分比",
        "discount_start":"折扣开始时间",
        "dollar_to_cn":"美金对人民币汇率",
        "ero_to_cn":"欧元对人民币汇率",
        "es_fba_fee":"ES-FBA费用",
        "es_float_price":"ES站点浮动值",
        "es_mfn_shipment_fee":"ES-MFN运费",
        "float_platform":"平台",
        "float_price":"DE站点浮动值",
        "fr_cd_fbc_fee":"fr_cd_fbc_fee",
        "fr_cd_fbc_price":"fr_cd_fbc_price",
        "fr_cd_mfn_price":"fr_cd_mfn_price",
        "fr_fba_fee":"FR-FBA费用",
        "fr_float_price":"FR站点浮动值",
        "fr_mfn_shipment_fee":"FR-MFN运费",
        "gb_fba_fee":"GB-FBA费用",
        "gb_mfn_shipment_fee":"GB-MFN运费",
        "gb_own_fba_fee":"英国仓发FBA费用",
        "girth":"周长",
        "header_fee":"头程",
        "id":"id",
        "it_fba_fee":"IT-FBA费用",
        "it_float_price":"IT站点浮动值",
        "it_mfn_shipment_fee":"IT-MFN运费",
        "latest_compute_time":"latest_compute_time",
        "lu_mfn_shipment_fee":"LU-MFN运费",
        "money_type":"币种",
        "nl_fba_fee":"NL-FBA费用",
        "nl_float_price":"NL站点浮动值",
        "nl_mfn_shipment_fee":"NL-MFN运费",
        "operator":"运营",
        "other_fee":"杂费",
        "pack_num":"装箱率",
        "pl_fba_fee":"PL-FBA费用",
        "pl_float_price":"PL站点浮动值",
        "pl_mfn_shipment_fee":"PL-MFN运费",
        "refund_tax":"出口退税率",
        "se_fba_fee":"SE-FBA费用",
        "size1":"包装尺寸1",
        "size2":"包装尺寸2",
        "size3":"包装尺寸3",
        "package_size1":"分摊尺寸1",
        "package_size2":"分摊尺寸2",
        "package_size3":"分摊尺寸3",
        "sku":"sku",
        "uk_float_price":"UK站点浮动值",
        "volume":"体积",
        "at_ae_lowest_price":"AT-速卖通最低定价",
        "be_ae_lowest_price":"BE-速卖通最低定价",
        "de_ae_lowest_price":"DE-速卖通最低定价",
        "de_b2c_lowest_price":"DE-B2C最低定价",
        "de_fba_lowest_price":"DE-FBA最低定价",
        "de_mfn_lowest_price":"DE-MFN最低定价",
        "de_prime_fee":"DE-Prime折扣定价",
        "de_prime_normal_price":"DE-Prime正常定价",
        "es_ae_lowest_price":"ES-速卖通最低定价",
        "es_b2c_lowest_price":"ES-B2C最低定价",
        "es_fba_lowest_price":"ES-FBA最低定价",
        "es_mfn_lowest_price":"ES-MFN最低定价",
        "fr_ae_lowest_price":"FR-速卖通最低定价",
        "fr_b2c_lowest_price":"FR-B2C最低定价",
        "fr_cd_fbc_price":"FR-CD-FBC最低定价",
        "fr_cd_mfn_price":"FR-CD-MFN最低定价",
        "fr_fba_lowest_price":"FR-FBA最低定价",
        "fr_mfn_lowest_price":"FR-最低定价",
        "gb_ae_lowest_price":"GB-速卖通最低定价",
        "gb_b2c_lowest_price":"GB-B2C最低定价",
        "gb_own_ae_lowest_price":"GB英仓速卖通最低定价",
        "gb_own_fba_lowest_price":"英国仓发FBA最低定价",
        "gb_own_lowest_price":"GB-英仓最低定价",
        "it_ae_lowest_price":"IT-速卖通最低定价",
        "it_b2c_lowest_price":"IT-B2C最低定价",
        "it_fba_lowest_price":"IT-FBA最低定价",
        "it_mfn_lowest_price":"IT-MFN最低定价",
        "lu_ae_lowest_price":"LU-速卖通最低定价",
        "nl_b2c_lowest_price":"NL-B2C最低定价",
        "nl_fba_lowest_price":"NL-FBA最低定价",
        "nl_mfn_lowest_price":"NL-MFN最低定价",
        "pl_fba_lowest_price":"PL-FBA最低定价",
        "pl_mfn_lowest_price":"PL-MFN最低定价",
        "se_fba_lowest_price":"SE-FBA最低定价",
        "purchase_price":"采购价",
        "cost_price":"成本价",
        "change_reason":"浮动价格变动原因",
        "warehouse":"仓库",
        "weight":"重量",
        "memo":"核价备注",
        "fr_cd_fbc_fee":"FR-CD-FBC费用",
        "de_prime_fee":"DE-Prime费用",
        "de_manomano_lowest_price":"DE Manomano最低定价",
        "fr_manomano_lowest_price":"FR Manomano最低定价",
        "hs_lowest_price": "含税最低定价",
        "bhs_lowest_price": "不含税最低定价",
        "gb_own_shipment_fee":"GB英仓运费",
        "ae_commission_rate":"速卖通佣金率"
    },
    "action":{
        "edit":"编辑",
        "cancel":"取消",
        "more":"更多操作",
        "action":"Action",
        "add":"新增",
        "export":"导出",
        "save":"保存",
        "pre_check":"预调价",
        "deal_update_for_check":"处理更新核价(update)",
        "deal_new":"处理新加核价(new)",
        "deal_allnew":"处理新加数据获取核价(allnew)",
        "flag_to_update":"标注为update",
        "flag_to_new":"标注为new",
        "flag_to_allnew":"标注为allnew",
        "recheck_for_ship":"物流费用变动后一键重新核价",
        "recheck_for_sku":"插入相同通用货号基础产品核价",
        "recheck_for_update":"一键更新相同通用货号核价数据"
    },
    "delete":"是否确认删除?",
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "delete_success":"删除成功",
    "please_choose":"请选择",
    "sku":"产品SKU",
    "check_type":"核价类型",
    "memo":"备注",
    "check_date":"核价时间",
    "approve_state":"审核状况",
    "actions":"操作",
    "view":"查看"
  }
}
</i18n>
