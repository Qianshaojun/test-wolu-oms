<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action>
            <a-button type="primary" @click="onSave()"
                >{{ $t('action.save') }}
            </a-button>
            <!-- <a-button type="primary" @click="cancelBtn()">{{
                $t('action.cancel')
            }}</a-button> -->
            <a-button
                type="primary"
                disabled="false"
                @click="updateAllSkuPrice()"
                >{{ $t('action.updateAllSkuPrice') }}
            </a-button>
        </template>
        <a-card class="margin-y" style="margin:0 !important">
            <section class="component edit-customer">
                <a-descriptions :title="currenctSku.default_code" :column="2">
                    <a-descriptions-item :label="$t('columns.product_code')">
                        {{
                            currenctSku.default_code
                                ? currenctSku.default_code
                                : '--'
                        }}
                    </a-descriptions-item>
                    <a-descriptions-item :label="$t('columns.z_category')">
                        {{
                            currenctSku.z_category
                                ? currenctSku.z_category
                                : '--'
                        }}
                    </a-descriptions-item>
                    <a-descriptions-item :label="$t('columns.z_sub_category')">
                        {{
                            currenctSku.z_sub_category
                                ? currenctSku.z_sub_category
                                : '--'
                        }}
                    </a-descriptions-item>
                    <a-descriptions-item :label="$t('columns.uom_id')">
                        {{ currenctSku.uom_name ? currenctSku.uom_name : '--' }}
                    </a-descriptions-item>
                </a-descriptions>
            </section>
        </a-card>
        <a-card class="margin-y" style="margin:0 !important;">
            <section class="component edit-customer">
                <a-button type="primary" @click="onSave()"
                    >{{ $t('action.save') }}
                </a-button>
                <a-button
                    style="margin-left:10px"
                    type="primary"
                    @click="addBtn()"
                    >{{ $t('action.addbtn') }}
                </a-button>
                <a-button
                    type="primary"
                    style="margin-left:10px"
                    @click="onSubmit()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.onSubmit') }}
                </a-button>
                <!-- <a-button
                    type="primary"
                    style="margin-left:10px"
                    @click="cancelBtn()"
                    >{{ $t('action.cancel') }}</a-button
                > -->
                <CommonPage
                    :page="pageService"
                    @on-page-change="getVendorProductList"
                    :data="data"
                />
                <a-table
                    :dataSource="data"
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
                    :rowClassName="handleRowClass"
                    :rowSelection="{
                        selectedRowKeys: selectedRowKeys,
                        onChange: keys => (selectedRowKeys = keys)
                    }"
                    bordered
                >
                    <a-table-column
                        :title="$t('columns.name')"
                        key="name"
                        align="center"
                    >
                        <template slot-scope="row">
                            <a-select
                                v-if="
                                    currentRow == row.index &&
                                        editable &&
                                        row.price_state == 'draft'
                                "
                                showSearch
                                v-decorator="['name']"
                                placeholder="Please select"
                                size="small"
                                :value="row.name"
                                :style="{ width: '100%' }"
                                :dropdown-match-select-width="false"
                                :dropdown-style="{ width: '300px' }"
                                :filterOption="filterSelectOption"
                                @change="e => onRowChange(row, 'name', e)"
                            >
                                <a-select-option
                                    :value="item.code"
                                    v-for="item in vendorList"
                                    :key="item.code"
                                >
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                            <span v-else>{{
                                row.name | dict2(vendorList)
                            }}</span>
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.price')"
                        key="price"
                        align="center"
                    >
                        <template slot-scope="row" class="required">
                            <a-input-number
                                decimalSeparator=","
                                v-if="
                                    currentRow == row.index &&
                                        editable &&
                                        row.price_state == 'draft'
                                "
                                v-decorator="['price']"
                                :value="row.price"
                                :style="{
                                    width: '100%',
                                    background: '#ecc5e9'
                                }"
                                :min="0"
                                size="small"
                                @change="e => onRowChange(row, 'price', e)"
                            />
                            <span v-else>{{ row.price }}</span>
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.currency_id')"
                        key="currency_id"
                        align="center"
                    >
                        <template slot-scope="row" class="required">
                            <a-select
                                v-if="
                                    currentRow == row.index &&
                                        editable &&
                                        row.price_state == 'draft'
                                "
                                showSearch
                                v-decorator="['currency_id']"
                                :value="row.currency_id"
                                :style="{ width: '100%' }"
                                :dropdown-match-select-width="false"
                                :dropdown-style="{ width: '300px' }"
                                placeholder="Please select"
                                size="small"
                                :filterOption="filterSelectOption"
                                @change="
                                    e => onRowChange(row, 'currency_id', e)
                                "
                            >
                                <a-select-option
                                    :value="item.code"
                                    v-for="item in currencyList"
                                    :key="item.code"
                                >
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                            <span v-else>{{
                                row.currency_id | dict2(currencyList)
                            }}</span>
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.current_exchange_rate')"
                        key="current_exchange_rate"
                        align="center"
                    >
                        <template slot-scope="row" class="required">
                            <a-input-number
                                decimalSeparator=","
                                v-if="
                                    currentRow == row.index &&
                                        editable &&
                                        row.price_state == 'draft'
                                "
                                v-decorator="['current_exchange_rate']"
                                :value="row.current_exchange_rate"
                                :style="{
                                    width: '100%',
                                    background: '#ecc5e9'
                                }"
                                :min="0"
                                size="small"
                                @change="
                                    e =>
                                        onRowChange(
                                            row,
                                            'current_exchange_rate',
                                            e
                                        )
                                "
                            />
                            <span v-else>{{ row.current_exchange_rate }}</span>
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.price_type')"
                        key="price_type"
                        align="center"
                    >
                        <template slot-scope="row" class="required">
                            <a-select
                                v-if="
                                    currentRow == row.index &&
                                        editable &&
                                        row.price_state == 'draft'
                                "
                                showSearch
                                v-decorator="['price_type']"
                                placeholder="Please select"
                                size="small"
                                :value="row.price_type"
                                :style="{ width: '100%' }"
                                :dropdown-match-select-width="false"
                                :dropdown-style="{ width: '300px' }"
                                @change="e => onRowChange(row, 'price_type', e)"
                            >
                                <a-select-option value="fob">
                                    fob
                                </a-select-option>
                                <a-select-option value="exw">
                                    exw
                                </a-select-option>
                            </a-select>
                            <span v-else>{{ row.price_type }}</span>
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.allocation_ratio')"
                        key="allocation_ratio"
                        align="center"
                    >
                        <template slot-scope="row" class="required">
                            <a-input-number
                                decimalSeparator=","
                                v-if="
                                    currentRow == row.index &&
                                        editable &&
                                        row.price_state == 'draft'
                                "
                                v-decorator="['allocation_ratio']"
                                :value="row.allocation_ratio"
                                :style="{
                                    width: '100%',
                                    background: '#ecc5e9'
                                }"
                                :min="0"
                                size="small"
                                @change="
                                    e => onRowChange(row, 'allocation_ratio', e)
                                "
                            />
                            <span v-else
                                >{{
                                    (row.allocation_ratio * 100).toFixed(2)
                                }}%</span
                            >
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.min_qty')"
                        key="min_qty"
                        align="center"
                    >
                        <template slot-scope="row" class="required">
                            <a-input-number
                                decimalSeparator=","
                                v-if="
                                    currentRow == row.index &&
                                        editable &&
                                        row.price_state == 'draft'
                                "
                                v-decorator="['min_qty']"
                                :value="row.min_qty"
                                :style="{
                                    width: '100%',
                                    background: '#ecc5e9'
                                }"
                                :min="0"
                                size="small"
                                @change="e => onRowChange(row, 'min_qty', e)"
                            />
                            <span v-else>{{ row.min_qty }}</span>
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.state')"
                        key="price_state"
                        align="center"
                    >
                        <template slot-scope="row" class="required">
                            <a-select
                                v-if="
                                    currentRow == row.index &&
                                        editable &&
                                        row.price_state == 'draft'
                                "
                                showSearch
                                v-decorator="['price_state']"
                                placeholder="Please select"
                                size="small"
                                :value="row.price_state"
                                :style="{ width: '100%' }"
                                :dropdown-match-select-width="false"
                                :dropdown-style="{ width: '300px' }"
                                @change="
                                    e => onRowChange(row, 'price_state', e)
                                "
                            >
                                <a-select-option
                                    :value="item.code"
                                    v-for="item in stateList"
                                    :key="item.code"
                                >
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                            <span v-else>{{
                                row.price_state | dict2(stateList)
                            }}</span>
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.export_rebate_rate')"
                        key="export_rebate_rate"
                        align="center"
                    >
                        <template slot-scope="row" class="required">
                            <a-input-number
                                decimalSeparator=","
                                v-if="
                                    currentRow == row.index &&
                                        editable &&
                                        row.price_state == 'draft'
                                "
                                v-decorator="['export_rebate_rate']"
                                :value="row.export_rebate_rate"
                                :style="{
                                    width: '100%',
                                    background: '#ecc5e9'
                                }"
                                :min="0"
                                size="small"
                                @change="
                                    e =>
                                        onRowChange(
                                            row,
                                            'export_rebate_rate',
                                            e
                                        )
                                "
                            />
                            <span v-else
                                >{{
                                    (row.export_rebate_rate * 100).toFixed(2)
                                }}%</span
                            >
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.export_rebate_rate_de')"
                        key="export_rebate_rate_de"
                        align="center"
                    >
                        <template slot-scope="row" class="required">
                            <a-input-number
                                decimalSeparator=","
                                v-if="
                                    currentRow == row.index &&
                                        editable &&
                                        row.price_state == 'draft'
                                "
                                v-decorator="['export_rebate_rate_de']"
                                :value="row.export_rebate_rate_de"
                                :style="{
                                    width: '100%',
                                    background: '#ecc5e9'
                                }"
                                :min="0"
                                size="small"
                                @change="
                                    e =>
                                        onRowChange(
                                            row,
                                            'export_rebate_rate_de',
                                            e
                                        )
                                "
                            />
                            <span v-else
                                >{{
                                    (row.export_rebate_rate_de * 100).toFixed(
                                        2
                                    )
                                }}%</span
                            >
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.export_rebate_rate_uk')"
                        key="export_rebate_rate_uk"
                        align="center"
                    >
                        <template slot-scope="row" class="required">
                            <a-input-number
                                decimalSeparator=","
                                v-if="
                                    currentRow == row.index &&
                                        editable &&
                                        row.price_state == 'draft'
                                "
                                v-decorator="['export_rebate_rate_uk']"
                                :value="row.export_rebate_rate_uk"
                                :style="{
                                    width: '100%',
                                    background: '#ecc5e9'
                                }"
                                :min="0"
                                size="small"
                                @change="
                                    e =>
                                        onRowChange(
                                            row,
                                            'export_rebate_rate_uk',
                                            e
                                        )
                                "
                            />
                            <span v-else
                                >{{
                                    (row.export_rebate_rate_uk * 100).toFixed(
                                        2
                                    )
                                }}%</span
                            >
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.date_start')"
                        key="date_start"
                        align="center"
                    >
                        <template slot-scope="row">
                            <a-date-picker
                                v-if="
                                    currentRow == row.index &&
                                        editable &&
                                        row.price_state == 'draft'
                                "
                                v-decorator="['date_start']"
                                :value="row.date_start"
                                format="YYYY-MM-DD"
                                @change="e => onRowChange(row, 'date_start', e)"
                            />
                            <span v-else>{{
                                row.date_start
                                    ? row.date_start.format('YYYY-MM-DD')
                                    : ''
                            }}</span>
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.date_end')"
                        key="date_end"
                        align="center"
                    >
                        <template slot-scope="row">
                            <a-date-picker
                                v-if="
                                    currentRow == row.index &&
                                        editable &&
                                        row.price_state == 'draft'
                                "
                                v-decorator="['date_end']"
                                :value="row.date_end"
                                format="YYYY-MM-DD"
                                @change="e => onRowChange(row, 'date_end', e)"
                            />
                            <span v-else>{{
                                row.date_end
                                    ? row.date_end.format('YYYY-MM-DD')
                                    : ''
                            }}</span>
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.state')"
                        key="state"
                        align="center"
                    >
                        <template slot-scope="scope">
                            {{ scope.active ? '未归档' : '已归档' }}
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('columns.memo')"
                        key="memo"
                        align="center"
                    >
                        <template slot-scope="row" class="required">
                            <a-input
                                v-if="
                                    currentRow == row.index &&
                                        editable &&
                                        row.price_state == 'draft'
                                "
                                v-decorator="['memo']"
                                :value="row.memo"
                                :style="{ width: '100%' }"
                                size="small"
                                @change="e => onRowChange(row, 'memo', e)"
                            />
                            <span v-else>{{ row.memo }}</span>
                        </template>
                    </a-table-column>
                    <a-table-column
                        :title="$t('action.action')"
                        key="action"
                        align="center"
                    >
                        <template slot-scope="row">
                            <a v-if="row.id" @click="e => onInvalidate(row)">
                                {{ $t('action.onInvalidate') }}
                            </a>
                            <a v-if="row.id" @click="e => onExtension(row)">
                                {{ $t('action.onExtension') }}
                            </a>
                            <a-popconfirm
                                title="确定要删除吗？"
                                okText="确定"
                                cancelText="取消"
                                placement="top"
                                @confirm="onDel(row)"
                            >
                                <a href="javascript:;" @click.stop="">
                                    {{ $t('action.delete') }}
                                </a>
                            </a-popconfirm>
                        </template>
                    </a-table-column>
                </a-table>
            </section>
        </a-card>
    </page-container>
</template>

<style>
.ant-select-auto-complete.ant-select-sm .ant-input {
    background-color: #ecc5e9;
}

.required .ant-calendar-picker-input .ant-input-sm {
    background-color: #ecc5e9;
}

.gray-actived {
    color: #80808080 !important;
}

.black-actived {
    color: black !important;
}
</style>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
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
import { CurrencyService } from '~/services/currency.service'
import { InnerActionService } from '~/bootstrap/services/inner.action.service'
import appConfig from '@/config/app.config'
import UploadExcel from '~/shared/common/upload-excel.vue'
import CommonPage from '~/shared/components/common-page.vue'

import UUID from 'uuidjs'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'vendor-product-detail'
})
@Component({
    components: { CommonPage }
})
export default class VendorProductDetail extends Vue {
    @Ref()
    readonly pageContainer!: PageContainer

    // @Prop()
    private vendorProduct: any

    @pageParamsModule.State
    vendorProductDetailParams

    private getcurrency() {
        let inneraction = new InnerActionService()
        inneraction.setActionAPI(
            '/vendor/get_currency_list',
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
                    this.currencyList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private currencyList: any = []

    private data: any = []

    private loadingService = new LoadingService()
    private publicService = new PublicService()
    private moment = moment
    private pageService = new PageService()

    private vendorList: any = []
    private currentRow: any = ''
    private selectedRowKeys: any[] = []
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

    private stateList: any[] = [
        { code: 'draft', name: this.$t('dict.draft') },
        { code: 'pre_confirm', name: this.$t('dict.wait_approve') },
        { code: 'auto_confirm', name: '' },
        { code: 'confirmed', name: this.$t('dict.approved') },
        { code: 'expired', name: this.$t('dict.expired') }
    ]

    @Watch('vendorProductDetailParams')
    onVendorProductEditPatamsChange() {
        if (this.vendorProductDetailParams) {
            this.updateVendorProduct(this.vendorProductDetailParams)
        }
    }

    private updateVendorProduct(vendorProduct) {
        this.vendorProduct = vendorProduct[0]
        this.getSkuInfo(this.vendorProduct.default_code)
        this.getVendorProductList()
        this.$nextTick(() => {
            this.vendorProduct = vendorProduct[0]
        })
    }

    private created() {
        this.getcurrency()
        this.getVendorList()
    }

    private mounted() {
        if (this.$route.params.vendorProduct) {
            this.updateVendorProduct([this.$route.params.vendorProduct])
        }
    }

    private currenctSku: any = ''

    private handleRowClass(record) {
        if (!record.active) {
            return 'gray-actived'
        } else {
            return 'black-actived'
        }
    }

    private getSkuInfo(product_code) {
        let inneraction = new InnerActionService()

        inneraction.setActionAPI(
            '/vendor/get_sku_info_for_vendor',
            CommonService.getMenuCode('vendor-product-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    { data: product_code },
                    {
                        loading: this.loadingService,
                        innerAction: inneraction
                    }
                )
            )
            .subscribe(
                data => {
                    this.currenctSku = data[0]
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getVendorProductList() {
        let inneraction = new InnerActionService()

        inneraction.setActionAPI(
            '/vendor/query_vendor_product_list',
            CommonService.getMenuCode('vendor-product-manage')
        )

        let params: any = CommonService.createQueryCondition(
            { product_code: this.vendorProduct.default_code },
            {
                product_code: '=',
                ...formConfig.condition
            }
        )
        params['order_by'] = 'date_end desc'
        this.publicService
            .queryPagination(
                new RequestParams(params, {
                    page: this.pageService,
                    loading: this.loadingService,
                    innerAction: inneraction
                })
            )
            .subscribe(
                data => {
                    this.data = data.map(x => {
                        x['save_flag'] = -1
                        x['index'] = UUID.generate()
                        x['date_start'] = this.moment(
                            CommonService.dateToLocal(x.date_start),
                            'YYYY-MM-DD'
                        )
                        x['date_end'] = this.moment(
                            CommonService.dateToLocal(x.date_end),
                            'YYYY-MM-DD'
                        )
                        return x
                    })

                    this.selectedRowKeys = []
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private addBtn() {
        this.data.push({
            save_flag: 0,
            index: UUID.generate(),
            name: '',
            price: 0.0,
            currency_id: '',
            current_exchange_rate: 0.0,
            date_start: moment(new Date()),
            date_end: moment(new Date()),
            price_type: 'fob',
            allocation_ratio: 0.0,
            min_qty: 0,
            price_state: 'draft',
            export_rebate_rate: 0.0,
            export_rebate_rate_de: 0.0,
            export_rebate_rate_uk: 0.0,
            memo: '',
            active: true
        })
        this.currentRow = this.data.length
    }

    private cancelBtn() {
        this.currentRow = -1
        this.getVendorProductList()
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
        if (row.save_flag == -1) {
            row.save_flag = 1
        }
    }

    private deleteList: any[] = []

    private onDel(row) {
        this.currentRow = -1
        let item = this.data.find(x => x.index === row.index)
        if (item.save_flag == 1 || item.save_flag == -1) {
            item['save_flag'] = 2
            this.deleteList.push(item)
        }
        item['save_flag'] = 2
        this.data = this.data.filter(x => !x.save_flag || x.save_flag < 2)
    }

    private onSave() {
        let list: any = []
        for (var i of this.data) {
            delete i.index
            if (i.z_category) {
                delete i.z_category
            }
            if (i.default_code) {
                delete i.default_code
            }
            if (i.z_sub_category) {
                delete i.z_sub_category
            }

            if (i.memo == '') {
                delete i.memo
            }
            if (i.save_flag == 1 || i.save_flag == 0) {
                if (i.save_flag === 0) {
                    for (let k in i) {
                        if (k !== 'save_flag' && k !== 'memo' && !i[k]) {
                            this.$message.error(
                                '除备注外，都是必填字段，请先完善数据项'
                            )
                            return
                        }
                    }
                }
                list.push(i)
            }
        }

        if (this.deleteList.length) {
            for (var j of this.deleteList) {
                delete j.index
                if (j.z_category) {
                    delete j.z_category
                }
                if (j.default_code) {
                    delete j.default_code
                }
                if (j.z_sub_category) {
                    delete j.z_sub_category
                }
                list.push(j)
            }
        }
        if (list.length == 0) {
            this.$message.warning('无数据变化，无需保存')
            return
        }
        let inneraction = new InnerActionService()

        inneraction.setActionAPI(
            '/vendor/save_vendor_product_list',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        product_code: this.vendorProduct.default_code,
                        product_list: list
                    },
                    {
                        loading: this.loadingService,
                        innerAction: inneraction
                    }
                )
            )
            .subscribe(
                () => {
                    this.$message.success('保存成功')
                    this.getVendorProductList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onExtension(row) {
        let inneraction = new InnerActionService()

        inneraction.setActionAPI(
            '/vendor/update_validity_period',
            CommonService.getMenuCode('vendor-product-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { id_list: [row.id] },
                    {
                        loading: this.loadingService,
                        innerAction: inneraction
                    }
                )
            )
            .subscribe(
                () => {
                    this.$message.success('延期成功')
                    this.getVendorProductList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onSubmit() {
        let inneraction = new InnerActionService()

        inneraction.setActionAPI(
            '/vendor/update_vendor_product_state',
            CommonService.getMenuCode('vendor-product-manage')
        )
        let id_list: any = []

        for (let i of this.data.filter(x =>
            this.selectedRowKeys.includes(x.index)
        )) {
            if (i.save_flag == 0 && !i.id) {
                this.$message.error('有新增数据未保存，请先保存')
                return
            }
            if (i.id) {
                id_list.push(i.id)
            }
        }

        this.publicService
            .modify(
                new RequestParams(
                    { id_list: id_list, data: 'pre_confirm' },
                    {
                        loading: this.loadingService,
                        innerAction: inneraction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.selectedRowKeys = []
                    this.getVendorProductList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onInvalidate(row) {
        let inneraction = new InnerActionService()

        inneraction.setActionAPI(
            '/vendor/update_vendor_product_state',
            CommonService.getMenuCode('vendor-product-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { id_list: [row.id], data: 'expired' },
                    {
                        loading: this.loadingService,
                        innerAction: inneraction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getVendorProductList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private updateAllSkuPrice() {}

    private onReturn() {}
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "dict": {
            "all": "All",
            "draft": "Draft",
            "wait_approve": "Wait Approve",
            "approved": "Approved",
            "expired": "Expired"
        },
        "columns": {
            "product_code": "SKU",
            "z_category": "Chinese Category",
            "z_sub_category": "Chinese Sub Category",
            "name": "Vendor",
            "price": "Price",
            "currency_id": "Currency",
            "current_exchange_rate": "Current Exchange Rate",
            "memo": "Memo",
            "allocation_ratio": "Allocation Ratio",
            "min_qty": "Min Order Qty",
            "state": "State",
            "date_start": "Date Start",
            "date_end": "Date End",
            "price_type": "Price Type",
            "export_rebate_rate": "Export Rebate Rate",
            "export_rebate_rate_de": "DE Export Rebate Rate",
            "export_rebate_rate_uk": "UK Export Rebate Rate",
            "uom_id": "Purchase Unit"
        },
        "action": {
            "create": "Create",
            "import_btn": "Import",
            "batch-create": "EXCEL Import",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "copy": "Copy",
            "pass": "Check",
            "onApiEdit": "Api Edit",
            "import": "Import",
            "not_import": "Not Import",
            "approve": "Approve",
            "extension": "Extension",
            "save": "Save",
            "updateAllSkuPrice": "Update All Sku Price",
            "addbtn": "Add",
            "onExtension": "Extension",
            "onInvalidate": "Invalidate",
            "action": "Actions",
            "onSubmit": "Submit"
        },
        "forms": {
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search",
            "operator_list": "Multi Search"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "cancel": "Are you sure cancel?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "dict": {
            "all": "全部",
            "draft": "草稿",
            "wait_approve": "待审批",
            "approved": "已审批",
            "expired": "已过期"
        },
        "columns": {
            "product_code": "SKU",
            "z_category": "中文分类",
            "z_sub_category": "中文子类",
            "name": "供应商",
            "price": "价格",
            "currency_id": "币种",
            "current_exchange_rate": "当时汇率",
            "memo": "备注",
            "allocation_ratio": "分配比例",
            "min_qty": "最小起订量",
            "state": "状态",
            "date_start": "价格有效期从",
            "date_end": "价格有效期至",
            "price_type": "价格类型",
            "export_rebate_rate": "出口退税率",
            "export_rebate_rate_de": "德国进口关税税率",
            "export_rebate_rate_uk": "英国进口关税税率",
            "uom_id": "采购单位"
        },
        "action": {
            "create": "新建",
            "import_btn": "导入",
            "batch-create": "EXCEL导入",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "copy": "复制",
            "pass": "审核",
            "onApiEdit": "api接口管理",
            "import": "已上传",
            "not_import": "未上传",
            "approve": "审批",
            "extension": "延期",
            "save": "保存",
            "updateAllSkuPrice": "一键更新所有SKU价格",
            "addbtn": "新增",
            "onExtension": "延期",
            "onInvalidate": "提前失效",
            "action": "操作",
            "onSubmit": "提交"
        },
        "forms": {
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量查询"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功"
    }
}
</i18n>
