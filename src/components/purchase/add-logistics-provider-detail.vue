<template>
    <section class="component order-base-detail">
        <div style="padding:0 20px 10px 0px;" v-show="editAble">
            <a-button @click="addBtn" type="default" size="small">
                <a-icon type="plus" />
                {{ $t('actions.add') }}
            </a-button>
        </div>
        <a-table
            :dataSource="data"
            :pagination="false"
            style="table-layout:fixed;"
            rowKey="index"
            :columns="columns"
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
            :scroll="{ x: 2500, y: 500 }"
            bordered
        >
            <template slot="prescription" slot-scope="text, row">
                <a-select
                    class="required"
                    v-if="currentRow == row.index"
                    v-decorator="['prescription']"
                    :value="row.prescription"
                    :style="{ width: '100%' }"
                    size="small"
                    @change="e => handleChange(e, row, 'prescription')"
                >
                    <a-select-option
                        v-for="i of $dict.LogisticsProviderAging"
                        :key="i.value"
                        :value="i.value"
                    >
                        {{ $t(i.label) }}
                    </a-select-option>
                </a-select>
                <span v-else>{{
                    typeof row.prescription == 'object' &&
                    row.prescription.length == 2
                        ? row.prescription[0]
                        : row.prescription
                          | dict('LogisticsProviderAging')
                          | translate
                }}</span></template
            >
            <template slot="dest_country_id" slot-scope="text, row">
                <a-select
                    showSearch
                    class="required"
                    v-if="currentRow == row.index"
                    v-decorator="['dest_country_id']"
                    :value="row.dest_country_id"
                    :dropdown-match-select-width="false"
                    :dropdown-style="{ width: '300px' }"
                    :style="{ width: '100%' }"
                    size="small"
                    :filterOption="filterSelectOption"
                    @change="e => handleChange(e, row, 'dest_country_id')"
                >
                    <a-select-option
                        v-for="i of countryList"
                        :key="i.code"
                        :value="i.code"
                    >
                        {{ i.name }}
                    </a-select-option>
                </a-select>
                <span v-else>{{
                    typeof row.dest_country_id == 'object' &&
                    row.dest_country_id.length == 2
                        ? row.dest_country_id[0]
                        : row.dest_country_id | dict2(countryList)
                }}</span></template
            >
            <template slot="shipping_channel" slot-scope="text, row">
                <a-input
                    class="required"
                    size="small"
                    v-if="currentRow == row.index"
                    :value="row.shipping_channel"
                    @change="
                        e =>
                            handleChange(
                                e.target.value,
                                row,
                                'shipping_channel'
                            )
                    "
                />
                <span v-else>{{ row.shipping_channel }}</span></template
            >
            <template
                slot="shipping_schedule_timeliness"
                slot-scope="text, row"
            >
                <a-input
                    class="required"
                    size="small"
                    v-if="currentRow == row.index"
                    :value="row.shipping_schedule_timeliness"
                    @change="
                        e =>
                            handleChange(
                                e.target.value,
                                row,
                                'shipping_schedule_timeliness'
                            )
                    "
                />
                <span v-else>{{
                    row.shipping_schedule_timeliness
                }}</span></template
            >
            <template slot="payment_method" slot-scope="text, row">
                <a-input
                    class="required"
                    size="small"
                    v-if="currentRow == row.index"
                    :value="row.payment_method"
                    @change="
                        e => handleChange(e.target.value, row, 'payment_method')
                    "
                />
                <span v-else>{{ row.payment_method }}</span></template
            >
            <template slot="is_include_tax" slot-scope="text, row">
                <a-checkbox
                    size="small"
                    v-if="currentRow == row.index"
                    :checked="row.is_include_tax"
                    @change="
                        e =>
                            handleChange(
                                e.target.checked,
                                row,
                                'is_include_tax'
                            )
                    "
                />
                <span v-else
                    ><a-checkbox
                        size="small"
                        :checked="row.is_include_tax"
                        disabled
                /></span>
            </template>
            <template
                slot="is_charged_magnetic_sensitive"
                slot-scope="text, row"
            >
                <a-checkbox
                    size="small"
                    v-if="currentRow == row.index"
                    :checked="row.is_charged_magnetic_sensitive"
                    @change="
                        e =>
                            handleChange(
                                e.target.checked,
                                row,
                                'is_charged_magnetic_sensitive'
                            )
                    "/>
                <span v-else
                    ><a-checkbox
                        size="small"
                        :checked="row.is_charged_magnetic_sensitive"
                        disabled/></span
            ></template>
            <template slot="is_self_mention" slot-scope="text, row">
                <a-checkbox
                    size="small"
                    v-if="currentRow == row.index"
                    :checked="row.is_self_mention"
                    @change="
                        e =>
                            handleChange(
                                e.target.checked,
                                row,
                                'is_self_mention'
                            )
                    "/>
                <span v-else
                    ><a-checkbox
                        size="small"
                        :checked="row.is_self_mention"
                        disabled/></span
            ></template>
            <template slot="is_self_report" slot-scope="text, row">
                <a-checkbox
                    size="small"
                    v-if="currentRow == row.index"
                    :checked="row.is_self_report"
                    @change="
                        e =>
                            handleChange(
                                e.target.checked,
                                row,
                                'is_self_report'
                            )
                    "/>
                <span v-else
                    ><a-checkbox
                        size="small"
                        :checked="row.is_self_report"
                        disabled/></span
            ></template>
            <template slot="overall_aging" slot-scope="text, row">
                <a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :min="0"
                    :value="row.overall_aging"
                    @change="e => handleChange(e, row, 'overall_aging')"
                />
                <span v-else>{{ row.overall_aging }}</span></template
            >
            <template slot="head_aging" slot-scope="text, row">
                <a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :min="0"
                    :value="row.head_aging"
                    @change="e => handleChange(e, row, 'head_aging')"
                />
                <span v-else>{{ row.head_aging }}</span></template
            >
            <template slot="delivery_aging" slot-scope="text, row">
                <a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :min="0"
                    :value="row.delivery_aging"
                    @change="e => handleChange(e, row, 'delivery_aging')"
                />
                <span v-else>{{ row.delivery_aging }}</span></template
            >
            <template slot="loading_aging" slot-scope="text, row">
                <a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :min="0"
                    :value="row.loading_aging"
                    @change="e => handleChange(e, row, 'loading_aging')"
                />
                <span v-else>{{ row.loading_aging }}</span></template
            >
            <template slot="transfer_aging" slot-scope="text, row">
                <a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :min="0"
                    :value="row.transfer_aging"
                    @change="e => handleChange(e, row, 'transfer_aging')"
                />
                <span v-else>{{ row.transfer_aging }}</span></template
            >
            <template slot="unloading_aging" slot-scope="text, row">
                <a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :min="0"
                    :value="row.unloading_aging"
                    @change="e => handleChange(e, row, 'unloading_aging')"
                />
                <span v-else>{{ row.unloading_aging }}</span></template
            >
            <template slot="kg_15_20" slot-scope="text, row">
                <a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :min="0"
                    :value="row.kg_15_20"
                    @change="e => handleChange(e, row, 'kg_15_20')"
                />
                <span v-else>{{ row.kg_15_20 }}</span></template
            >
            <template slot="kg_21_50" slot-scope="text, row">
                <a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :min="0"
                    :value="row.kg_21_50"
                    @change="e => handleChange(e, row, 'kg_21_50')"
                />
                <span v-else>{{ row.kg_21_50 }}</span></template
            >
            <template slot="kg_51_99" slot-scope="text, row">
                <a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :min="0"
                    :value="row.kg_51_99"
                    @change="e => handleChange(e, row, 'kg_51_99')"
                />
                <span v-else>{{ row.kg_51_99 }}</span></template
            >
            <template slot="kg_100_199" slot-scope="text, row">
                <a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :min="0"
                    :value="row.kg_100_199"
                    @change="e => handleChange(e, row, 'kg_100_199')"
                />
                <span v-else>{{ row.kg_100_199 }}</span></template
            >
            <template slot="kg_200_299" slot-scope="text, row">
                <a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :min="0"
                    :value="row.kg_200_299"
                    @change="e => handleChange(e, row, 'kg_200_299')"
                />
                <span v-else>{{ row.kg_200_299 }}</span></template
            >
            <template slot="kg_300_499" slot-scope="text, row">
                <a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :min="0"
                    :value="row.kg_300_499"
                    @change="e => handleChange(e, row, 'kg_300_499')"
                />
                <span v-else>{{ row.kg_300_499 }}</span></template
            >
            <template slot="kg_500_999" slot-scope="text, row">
                <a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :min="0"
                    :value="row.kg_500_999"
                    @change="e => handleChange(e, row, 'kg_500_999')"
                />
                <span v-else>{{ row.kg_500_999 }}</span></template
            >
            <template slot="kg_1000" slot-scope="text, row">
                <a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :min="0"
                    :value="row.kg_1000"
                    @change="e => handleChange(e, row, 'kg_1000')"
                />
                <span v-else>{{ row.kg_1000 }}</span></template
            >
            <template slot="area_zone" slot-scope="text, row">
                <a-input
                    size="small"
                    v-if="currentRow == row.index"
                    :value="row.area_zone"
                    @change="
                        e => handleChange(e.target.value, row, 'area_zone')
                    "
                />
                <span v-else>{{ row.area_zone }}</span></template
            >
            <template slot="cbm_1" slot-scope="text, row">
                <a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :min="0"
                    :value="row.cbm_1"
                    @change="e => handleChange(e, row, 'cbm_1')"
                />
                <span v-else>{{ row.cbm_1 }}</span></template
            >
            <template slot="cbm_2" slot-scope="text, row">
                <a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :min="0"
                    :value="row.cbm_2"
                    @change="e => handleChange(e, row, 'cbm_2')"
                />
                <span v-else>{{ row.cbm_2 }}</span></template
            >
            <template slot="cbm_3" slot-scope="text, row">
                <a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :min="0"
                    :value="row.cbm_3"
                    @change="e => handleChange(e, row, 'cbm_3')"
                />
                <span v-else>{{ row.cbm_3 }}</span></template
            >
            <template slot="cbm_4" slot-scope="text, row">
                <a-input-number
                    size="small"
                    v-if="currentRow == row.index"
                    :min="0"
                    :value="row.cbm_4"
                    @change="e => handleChange(e, row, 'cbm_4')"
                />
                <span v-else>{{ row.cbm_4 }}</span></template
            >
            <template slot="customs_fee" slot-scope="text, row">
                <a-input
                    size="small"
                    v-if="currentRow == row.index"
                    :value="row.customs_fee"
                    @change="
                        e => handleChange(e.target.value, row, 'customs_fee')
                    "
                />
                <span v-else>{{ row.customs_fee }}</span></template
            >
            <template slot="clearance_fee" slot-scope="text, row">
                <a-input
                    size="small"
                    v-if="currentRow == row.index"
                    :value="row.clearance_fee"
                    @change="
                        e => handleChange(e.target.value, row, 'clearance_fee')
                    "
                />
                <span v-else>{{ row.clearance_fee }}</span></template
            >
            <template slot="action" slot-scope="row">
                <a-popconfirm
                    :title="$t('delete')"
                    :okText="$t('actions.ok')"
                    :cancelText="$t('actions.cancel')"
                    placement="left"
                    @confirm="onDel(row)"
                >
                    <a class="btnDel">
                        <a-icon type="delete" />
                    </a>
                </a-popconfirm>
            </template>
        </a-table>
    </section>
</template>

<style>
.required {
    background-color: #ecc5e9;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ProductService } from '@/services/product.service'
import { RequestParams } from '@/core/http'
import { CommonService } from '@/shared/utils/common.service'
import { formConfig } from '@/config/form.config'
import SearchProduct from '@/components/product/search-product.vue'
import { PickingService } from '../../services/picking.service'
import { LoadingService } from '@/bootstrap/services/loading.service'
import UUID from 'uuidjs'
import moment from 'moment'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

@Component({
    components: {}
})
export default class AddLogisticsProviderDetail extends Vue {
    @Prop()
    info: any

    @Prop()
    systemUsers: any

    @Prop()
    countryList: any

    @Prop()
    currencyList: any

    @Prop()
    editAble: any

    @Prop()
    state: any

    @Prop()
    id: any

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

    private columns: any = [
        {
            title: this.$t('columns.channel_info'),
            children: [
                {
                    title: this.$t('columns.prescription'),
                    key: 'prescription',
                    dataIndex: 'prescription',
                    width: 100,
                    scopedSlots: { customRender: 'prescription' }
                },
                {
                    title: this.$t('columns.dest_country_id'),
                    key: 'dest_country_id',
                    dataIndex: 'dest_country_id',
                    width: 100,
                    scopedSlots: { customRender: 'dest_country_id' }
                },
                {
                    title: this.$t('columns.shipping_channel'),
                    key: 'shipping_channel',
                    dataIndex: 'shipping_channel',
                    width: 100,
                    scopedSlots: { customRender: 'shipping_channel' }
                },
                {
                    title: this.$t('columns.shipping_schedule_timeliness'),
                    key: 'shipping_schedule_timeliness',
                    dataIndex: 'shipping_schedule_timeliness',
                    width: 100,
                    scopedSlots: {
                        customRender: 'shipping_schedule_timeliness'
                    }
                },
                {
                    title: this.$t('columns.payment_method'),
                    key: 'payment_method',
                    dataIndex: 'payment_method',
                    width: 100,
                    scopedSlots: { customRender: 'payment_method' }
                },
                {
                    title: this.$t('columns.is_include_tax'),
                    key: 'is_include_tax',
                    dataIndex: 'is_include_tax',
                    width: 100,
                    scopedSlots: { customRender: 'is_include_tax' }
                },
                {
                    title: this.$t('columns.is_charged_magnetic_sensitive'),
                    key: 'is_charged_magnetic_sensitive',
                    dataIndex: 'is_charged_magnetic_sensitive',
                    width: 100,
                    scopedSlots: {
                        customRender: 'is_charged_magnetic_sensitive'
                    }
                },
                {
                    title: this.$t('columns.is_self_mention'),
                    key: 'is_self_mention',
                    dataIndex: 'is_self_mention',
                    width: 100,
                    scopedSlots: { customRender: 'is_self_mention' }
                },
                {
                    title: this.$t('columns.is_self_report'),
                    key: 'is_self_report',
                    dataIndex: 'is_self_report',
                    width: 100,
                    scopedSlots: { customRender: 'is_self_report' }
                }
            ]
        },
        {
            title: this.$t('columns.aging_info'),
            children: [
                {
                    title: this.$t('columns.overall_aging'),
                    key: 'overall_aging',
                    dataIndex: 'overall_aging',
                    width: 100,
                    scopedSlots: { customRender: 'overall_aging' }
                },
                {
                    title: this.$t('columns.head_aging'),
                    key: 'head_aging',
                    dataIndex: 'head_aging',
                    width: 100,
                    scopedSlots: { customRender: 'head_aging' }
                },
                {
                    title: this.$t('columns.delivery_aging'),
                    key: 'delivery_aging',
                    dataIndex: 'delivery_aging',
                    width: 100,
                    scopedSlots: { customRender: 'delivery_aging' }
                },
                {
                    title: this.$t('columns.loading_aging'),
                    key: 'loading_aging',
                    dataIndex: 'loading_aging',
                    width: 100,
                    scopedSlots: { customRender: 'loading_aging' }
                },
                {
                    title: this.$t('columns.transfer_aging'),
                    key: 'transfer_aging',
                    dataIndex: 'transfer_aging',
                    width: 100,
                    scopedSlots: { customRender: 'transfer_aging' }
                },
                {
                    title: this.$t('columns.unloading_aging'),
                    key: 'unloading_aging',
                    dataIndex: 'unloading_aging',
                    width: 100,
                    scopedSlots: { customRender: 'unloading_aging' }
                }
            ]
        },
        {
            title: this.$t('columns.price_info'),
            children: [
                {
                    title: this.$t('columns.kg_15_20'),
                    key: 'kg_15_20',
                    dataIndex: 'kg_15_20',
                    width: 100,
                    scopedSlots: { customRender: 'kg_15_20' }
                },
                {
                    title: this.$t('columns.kg_21_50'),
                    key: 'kg_21_50',
                    dataIndex: 'kg_21_50',
                    width: 100,
                    scopedSlots: { customRender: 'kg_21_50' }
                },
                {
                    title: this.$t('columns.kg_51_99'),
                    key: 'kg_51_99',
                    dataIndex: 'kg_51_99',
                    width: 100,
                    scopedSlots: { customRender: 'kg_51_99' }
                },
                {
                    title: this.$t('columns.kg_100_199'),
                    key: 'kg_100_199',
                    dataIndex: 'kg_100_199',
                    width: 100,
                    scopedSlots: { customRender: 'kg_100_199' }
                },
                {
                    title: this.$t('columns.kg_200_299'),
                    key: 'kg_200_299',
                    dataIndex: 'kg_200_299',
                    width: 100,
                    scopedSlots: { customRender: 'kg_200_299' }
                },
                {
                    title: this.$t('columns.kg_300_499'),
                    key: 'kg_300_499',
                    dataIndex: 'kg_300_499',
                    width: 100,
                    scopedSlots: { customRender: 'kg_300_499' }
                },
                {
                    title: this.$t('columns.kg_500_999'),
                    key: 'kg_500_999',
                    dataIndex: 'kg_500_999',
                    width: 100,
                    scopedSlots: { customRender: 'kg_500_999' }
                },
                {
                    title: this.$t('columns.kg_1000'),
                    key: 'kg_1000',
                    dataIndex: 'kg_1000',
                    width: 100,
                    scopedSlots: { customRender: 'kg_1000' }
                }
            ]
        },
        {
            title: this.$t('columns.price_info2'),
            children: [
                {
                    title: this.$t('columns.area_zone'),
                    key: 'area_zone',
                    dataIndex: 'area_zone',
                    width: 100,
                    scopedSlots: { customRender: 'area_zone' }
                },
                {
                    title: this.$t('columns.cbm_1'),
                    key: 'cbm_1',
                    dataIndex: 'cbm_1',
                    width: 100,
                    scopedSlots: { customRender: 'cbm_1' }
                },
                {
                    title: this.$t('columns.cbm_2'),
                    key: 'cbm_2',
                    dataIndex: 'cbm_2',
                    width: 100,
                    scopedSlots: { customRender: 'cbm_2' }
                },
                {
                    title: this.$t('columns.cbm_3'),
                    key: 'cbm_3',
                    dataIndex: 'cbm_3',
                    width: 100,
                    scopedSlots: { customRender: 'cbm_3' }
                },
                {
                    title: this.$t('columns.cbm_4'),
                    key: 'cbm_4',
                    dataIndex: 'cbm_4',
                    width: 100,
                    scopedSlots: { customRender: 'cbm_4' }
                }
            ]
        },
        {
            title: this.$t('columns.fee_info'),
            children: [
                {
                    title: this.$t('columns.customs_fee'),
                    key: 'customs_fee',
                    dataIndex: 'customs_fee',
                    width: 100,
                    scopedSlots: { customRender: 'customs_fee' }
                },
                {
                    title: this.$t('columns.clearance_fee'),
                    key: 'clearance_fee',
                    dataIndex: 'clearance_fee',
                    width: 100,
                    scopedSlots: { customRender: 'clearance_fee' }
                }
            ]
        },
        {
            title: this.$t('actions.action'),
            key: 'action',
            width: 100,
            scopedSlots: { customRender: 'action' }
        }
    ]

    private mounted() {
        this.editable = this.editAble
        if (this.info && this.info.length) {
            this.data = this.info.map(x => {
                x['index'] = UUID.generate()
                x['save_flag'] = 1
                return x
            })
        }
    }

    @Watch('info')
    private onInfoChange() {
        if (this.info && this.info.length) {
            this.data = this.info.map(x => {
                if (!x.index) {
                    x['index'] = UUID.generate()
                    x['save_flag'] = 1
                }
                return x
            })
        }
    }

    @Watch('editAble')
    private onEditAbleChange() {
        this.editable = this.editAble
    }

    private addBtn() {
        this.currentRow = UUID.generate()
        let item = {
            index: this.currentRow,
            save_flag: 0,
            prescription: '',
            dest_country_id: '',
            shipping_channel: '',
            shipping_schedule_timeliness: '',
            payment_method: '',
            is_include_tax: false,
            is_charged_magnetic_sensitive: false,
            is_self_mention: false,
            is_self_report: false,
            overall_aging: 0,
            head_aging: 0,
            delivery_aging: 0,
            loading_aging: 0,
            transfer_aging: 0,
            unloading_aging: 0,
            kg_15_20: 0,
            kg_21_50: 0,
            kg_51_99: 0,
            kg_100_199: 0,
            kg_200_299: 0,
            kg_300_499: 0,
            kg_500_999: 0,
            kg_1000: 0,
            area_zone: '',
            cbm_1: 0,
            cbm_2: 0,
            cbm_3: 0,
            cbm_4: 0,
            customs_fee: '',
            clearance_fee: ''
        }
        let pos = this.data.length > 0 ? this.data.length - 1 : 0
        this.data.splice(pos, 0, item)
        this.$emit('change', this.data)
    }

    private handleChange(e, row, column) {
        row[column] = e
        this.$emit('change', this.data)
    }

    private cancelBtn(e) {
        e.stopPropagation()
        this.currentRow = -1
    }

    private onDel(row) {
        this.currentRow = -1
        if (row.id) {
            let item = this.data.find(x => x.index === row.index)
            this.innerAction.setActionAPI(
                '/logistics_providers/modify_record',
                CommonService.getMenuCode('logistics-providers-detail')
            )
            this.publicService
                .modify(
                    new RequestParams(
                        {
                            id: this.id,
                            delete_channel_list: [item.id],
                            save_flag: 1,
                            channel_list: this.data.map(x => {
                                delete x.index
                                return x
                            })
                        },
                        {
                            loading: this.loadingService,
                            innerAction: this.innerAction
                        }
                    )
                )
                .subscribe(
                    data => {
                        this.$message.success('删除成功')
                        this.data = this.data.filter(x => x.id != row.id)
                        this.$emit('change', this.data)
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        } else {
            this.data = this.data.filter(x => x.index !== row.index)
            this.$emit('change', this.data)
        }
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }
}
</script>

<i18n>
{
    "en-us": {
        "delete": "delete ?",
        "columns": {
            "prescription": "prescription",
            "dest_country_id": "dest_country_id",
            "shipping_channel": "shipping_channel",
            "shipping_schedule_timeliness": "shipping_schedule_timeliness",
            "payment_method": "payment_method",
            "is_include_tax": "is_include_tax",
            "is_charged_magnetic_sensitive": "is_charged_magnetic_sensitive",
            "is_self_mention": "is_self_mention",
            "is_self_report": "is_self_report",
            "overall_aging": "overall_aging",
            "head_aging": "head_aging",
            "delivery_aging": "delivery_aging",
            "loading_aging": "loading_aging",
            "transfer_aging": "transfer_aging",
            "unloading_aging": "unloading_aging",
            "logistics_providers_id": "logistics_providers_id",
            "kg_15_20": "kg_15_20",
            "kg_21_50": "kg_21_50",
            "kg_51_99": "kg_51_99",
            "kg_100_199": "kg_100_199",
            "kg_200_299": "kg_200_299",
            "kg_300_499": "kg_300_499",
            "kg_500_999": "kg_500_999",
            "kg_1000": "kg_1000",
            "area_zone": "area_zone",
            "cbm_1": "cbm_1",
            "cbm_2": "cbm_2",
            "cbm_3": "cbm_3",
            "cbm_4": "cbm_4",
            "customs_fee": "customs_fee",
            "clearance_fee": "clearance_fee",
            "channel_info": "Channel Info",
            "aging_info": "Aging Info",
            "price_info": "Price Info(weight)",
            "price_info2": "Price Info(volume)",
            "fee_info": "Fee Info"
        },
        "actions": {
            "add": "Add",
            "action": "Action",
            "save": "Save",
            "delete": "Delete",
            "cancel": "Cancel",
            "ok": "Ok"
        }
    },
    "zh-cn": {
        "delete": "确定要删除吗?",
        "columns": {
            "prescription": "时效",
            "dest_country_id": "目的国家",
            "shipping_channel": "发货渠道",
            "shipping_schedule_timeliness": "船期/时效",
            "payment_method": "付款方式",
            "is_include_tax": "是否包税",
            "is_charged_magnetic_sensitive": "带电/磁/敏感货",
            "is_self_mention": "是否自提(前端)",
            "is_self_report": "是否自报",
            "overall_aging": "整体时效",
            "head_aging": "头程时效",
            "delivery_aging": "派送时效",
            "loading_aging": "装车时效",
            "transfer_aging": "运输时效",
            "unloading_aging": "卸柜时效",
            "logistics_providers_id": "logistics_providers_id",
            "kg_15_20": "15-20kg",
            "kg_21_50": "21-50kg",
            "kg_51_99": "51-99kg",
            "kg_100_199": "100-199kg",
            "kg_200_299": "200-299kg",
            "kg_300_499": "300-499kg",
            "kg_500_999": "500-999kg",
            "kg_1000": "1000+kg",
            "area_zone": "所在区zone",
            "cbm_1": "1.5-3cbm",
            "cbm_2": "3-5cbm",
            "cbm_3": "5-10cbm",
            "cbm_4": "10cbm+",
            "customs_fee": "报关税",
            "clearance_fee": "情关税",
            "channel_info": "渠道信息",
            "aging_info": "时效(天)",
            "price_info": "价格信息(重量)",
            "price_info2": "价格信息(体积)",
            "fee_info": "其它费用"
        },
        "actions": {
            "add": "新增",
            "action": "操作",
            "save": "保存",
            "delete": "删除",
            "cancel": "取消",
            "ok": "确定"
        }
    }
}
</i18n>
