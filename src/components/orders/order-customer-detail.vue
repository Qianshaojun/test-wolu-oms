<template>
    <section
        class="component order-customer-detail"
        :style="{ height: divHeight + 'px', 'overflow-y': 'auto' }"
    >
        <div style="padding:0 20px 10px 20px;">
            <a-button @click="addBtn" type="primary"
                >{{ $t('actions.add') }}
            </a-button>
            <a-button @click="saveBtn" style="margin-left:10px;"
                >{{ $t('actions.save') }}
            </a-button>
            <a-button @click="cancelBtn" style="margin-left:10px;"
                >{{ $t('actions.cancel') }}
            </a-button>
        </div>
        <a-table
            :dataSource="data"
            :pagination="false"
            style="table-layout:fixed;"
            :scroll="{ x: 1500 }"
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
                :title="$t('product')"
                key="name"
                align="left"
                class="tip-color"
            >
                <template slot-scope="row">
                    <a-select
                        v-if="currentRow == row.index && editable"
                        v-decorator="['name']"
                        :value="row.name"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '300px' }"
                        size="small"
                        @change="e => onRowChange(row, 'name', e)"
                    >
                        <a-select-option
                            v-for="i of productList"
                            :key="i.id"
                            :value="i.id"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                        <a-select-option key="all" disabled class="show-all">
                            <a @click="searchMore(row)">
                                Search More
                            </a>
                        </a-select-option>
                    </a-select>
                    <span
                        :title="row.name"
                        :class="calculateRowStyle(row)"
                        v-else
                        >{{
                            row.name
                                ? row.name.substr(0, 20) +
                                  (row.name.length > 17 ? '...' : '')
                                : ''
                        }}</span
                    >
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
                        :style="{ width: '100%' }"
                        :min="0"
                        size="small"
                        @change="e => onRowChange(row, 'product_qty', e)"
                    />
                    <span :class="calculateRowStyle(row)" v-else>{{
                        row.product_qty
                    }}</span>
                </template>
            </a-table-column>
            <a-table-column :title="$t('ship')" key="ship_type" align="center">
                <template slot-scope="row">
                    <a-select
                        v-if="currentRow == row.index && editable"
                        v-decorator="['ship_type']"
                        :value="row.ship_type"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '300px' }"
                        size="small"
                        @change="e => onRowChange(row, 'ship_type', e)"
                    >
                        <a-select-option value=""
                            >{{ $t('null') }}
                        </a-select-option>
                        <a-select-option
                            v-for="i of reasonList.ship_type"
                            :key="i.code"
                            :value="i.code"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select>
                    <span :class="calculateRowStyle(row)" v-else>{{
                        row.ship_type | dict2(reasonList.ship_type)
                    }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('ship_num')"
                key="ship_num"
                align="center"
            >
                <template slot-scope="row">
                    <a-input
                        decimalSeparator=","
                        v-if="currentRow == row.index && editable"
                        v-decorator="['ship_num']"
                        :value="row.ship_num"
                        :style="{ width: '100%' }"
                        :min="0"
                        size="small"
                        @change="e => onRowChange(row, 'ship_num', e)"
                    />
                    <span :class="calculateRowStyle(row)" v-else>{{
                        row.ship_num
                    }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('state')"
                key="product_status"
                align="center"
            >
                <template slot-scope="row">
                    <a-select
                        v-if="currentRow == row.index && editable"
                        v-decorator="['product_status']"
                        :value="row.product_status"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '200px' }"
                        size="small"
                        @change="e => onRowChange(row, 'product_status', e)"
                    >
                        <a-select-option value=""
                            >{{ $t('null') }}
                        </a-select-option>
                        <a-select-option
                            v-for="i of reasonList.product_status"
                            :key="i.code"
                            :value="i.code"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select>
                    <span :class="calculateRowStyle(row)" v-else>{{
                        row.product_status | dict2(reasonList.product_status)
                    }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('product_info')"
                key="info1"
                data-index="info1"
                align="center"
            >
            </a-table-column>
            <a-table-column
                :title="$t('w_warehouse_reason')"
                key="w_warehouse_reason"
                align="center"
            >
                <template slot-scope="row">
                    <a-select
                        v-if="currentRow == row.index && editable"
                        v-decorator="['w_warehouse_reason']"
                        :value="row.w_warehouse_reason"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '300px' }"
                        size="small"
                        @change="e => onRowChange(row, 'w_warehouse_reason', e)"
                    >
                        <a-select-option value=""
                            >{{ $t('null') }}
                        </a-select-option>
                        <a-select-option
                            v-for="i of reasonList.w_warehouse_reason"
                            :key="i.code"
                            :value="i.code"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select>
                    <span :class="calculateRowStyle(row)" v-else>{{
                        row.w_warehouse_reason
                            | dict2(reasonList.w_warehouse_reason)
                    }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('w_return_reason')"
                key="w_return_reason"
                align="center"
            >
                <template slot-scope="row">
                    <a-select
                        v-if="currentRow == row.index && editable"
                        v-decorator="['w_return_reason']"
                        :value="row.w_return_reason"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '300px' }"
                        size="small"
                        @change="e => onRowChange(row, 'w_return_reason', e)"
                    >
                        <a-select-option value=""
                            >{{ $t('null') }}
                        </a-select-option>
                        <a-select-option
                            v-for="i of reasonList.w_return_reason"
                            :key="i.code"
                            :value="i.code"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select>
                    <span :class="calculateRowStyle(row)" v-else>{{
                        row.w_return_reason | dict2(reasonList.w_return_reason)
                    }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('customer_reason')"
                key="customer_reason"
                align="center"
            >
                <template slot-scope="row">
                    <a-select
                        v-if="currentRow == row.index && editable"
                        v-decorator="['customer_reason']"
                        :value="row.customer_reason"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '300px' }"
                        size="small"
                        @change="e => onRowChange(row, 'customer_reason', e)"
                    >
                        <a-select-option value=""
                            >{{ $t('null') }}
                        </a-select-option>
                        <a-select-option
                            v-for="i of reasonList.customer_reason"
                            :key="i.code"
                            :value="i.code"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select>
                    <span :class="calculateRowStyle(row)" v-else>{{
                        row.customer_reason | dict2(reasonList.customer_reason)
                    }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('sale_tag')"
                key="sale_tag"
                align="center"
            >
                <template slot-scope="row">
                    <a-select
                        v-if="currentRow == row.index && editable"
                        v-decorator="['sale_tag']"
                        :value="row.sale_tag"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '300px' }"
                        size="small"
                        @change="e => onRowChange(row, 'sale_tag', e)"
                    >
                        <a-select-option value=""
                            >{{ $t('null') }}
                        </a-select-option>
                        <a-select-option
                            v-for="i of productReason[row.default_code]"
                            :key="i"
                            :value="i"
                            :title="i"
                        >
                            {{ i }}
                        </a-select-option>
                    </a-select>
                    <span :class="calculateRowStyle(row)" v-else>{{
                        row.sale_tag | dict2(productReason[row.default_code])
                    }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('logistic_reason')"
                key="logistic_reason"
                align="center"
            >
                <template slot-scope="row">
                    <a-select
                        v-if="currentRow == row.index && editable"
                        v-decorator="['logistic_reason']"
                        :value="row.logistic_reason"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '300px' }"
                        size="small"
                        @change="e => onRowChange(row, 'logistic_reason', e)"
                    >
                        <a-select-option value=""
                            >{{ $t('null') }}
                        </a-select-option>
                        <a-select-option
                            v-for="i of reasonList.logistic_reason"
                            :key="i.code"
                            :value="i.code"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select>
                    <span :class="calculateRowStyle(row)" v-else>{{
                        row.logistic_reason | dict2(reasonList.logistic_reason)
                    }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('warehouse_reason')"
                key="warehouse_reason"
                align="center"
            >
                <template slot-scope="row">
                    <a-select
                        v-if="currentRow == row.index && editable"
                        v-decorator="['warehouse_reason']"
                        :value="row.warehouse_reason"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '300px' }"
                        size="small"
                        @change="e => onRowChange(row, 'warehouse_reason', e)"
                    >
                        <a-select-option value=""
                            >{{ $t('null') }}
                        </a-select-option>
                        <a-select-option
                            v-for="i of reasonList.warehouse_reason"
                            :key="i.code"
                            :value="i.code"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select>
                    <span :class="calculateRowStyle(row)" v-else>{{
                        row.warehouse_reason
                            | dict2(reasonList.warehouse_reason)
                    }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('solution_type')"
                key="solution_type"
                align="center"
            >
                <template slot-scope="row">
                    <a-select
                        v-if="currentRow == row.index && editable"
                        mode="multiple"
                        v-decorator="['solution_type']"
                        :value="row.solution_type"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '300px' }"
                        size="small"
                        @change="e => onRowChange(row, 'solution_type', e)"
                    >
                        <a-select-option
                            v-for="i of reasonList.solution_type"
                            :key="i.code"
                            :value="i.code"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select>
                    <span :class="calculateRowStyle(row)" v-else>
                        <p v-for="x of row.solution_type" :key="x">
                            {{ (x ? x : '') | dict2(reasonList.solution_type) }}
                        </p>
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('stock_processed')"
                key="stock_processed"
                align="center"
            >
                <template slot-scope="row">
                    <a-date-picker
                        v-if="currentRow == row.index && editable"
                        v-decorator="['stock_processed']"
                        :value="row.stock_processed"
                        format="YYYY-MM-DD HH:mm:ss"
                        @change="e => onRowChange(row, 'stock_processed', e)"
                    />
                    <span :class="calculateRowStyle(row)" v-else>{{
                        row.stock_processed
                            ? row.stock_processed.format('YY-MM-DD HH:mm')
                            : ''
                    }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('create_time')"
                key="create_time"
                align="center"
            >
                <template slot-scope="row">
                    <span
                        :class="calculateRowStyle(row)"
                        v-if="row.save_flag"
                        >{{ row.create_time.toString() | datetolocal }}</span
                    >
                    <span :class="calculateRowStyle(row)" v-else>{{
                        row.create_time.format('YY-MM-DD HH:mm')
                    }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('create_user')"
                key="create_user"
                align="center"
            >
                <template slot-scope="row">
                    <span :class="calculateRowStyle(row)">{{
                        row.create_user | dict2(systemUsers)
                    }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('is_return_user')"
                key="is_return_user"
                align="center"
            >
                <template slot-scope="row">
                    <a-checkbox
                        :disabled="currentRow !== row.index"
                        v-decorator="['is_return_user']"
                        :checked="row.is_return_user"
                        @change="
                            e =>
                                onRowChange(
                                    row,
                                    'is_return_user',
                                    e.target.checked
                                )
                        "
                    />
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('actions.action')"
                key="action"
                align="center"
            >
                <template slot-scope="row">
                    <a @click="onDel(row)">
                        {{ $t('actions.delete') }}
                    </a>
                </template>
            </a-table-column>
        </a-table>
    </section>
</template>

<style>
.red-text {
    color: red;
}

.green-text {
    color: green;
}

.default-text {
    color: #333;
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
import { CustomProblemService } from '@/services/custom_problem.service'
import moment from 'moment'
import UUID from 'uuidjs'
import { OrderService } from '../../services/order.service'
import store from '@/store'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

@Component({
    components: {}
})
export default class OrderCustomerDetail extends Vue {
    @Prop()
    private info

    @Prop()
    private height

    @Prop()
    private orderId

    @Prop()
    private systemUsers

    @Prop()
    private changeSpinning

    private divHeight: any = 100

    private currentRow: any = ''

    private editable: any = true

    private data: any[] = []

    private skuSource: any[] = []

    private skuQueryResult: any[] = []

    private reasonList: any[] = []

    private productList: any[] = []

    private deleteList: any[] = []

    private moment: any

    private productService = new ProductService()

    private pickingService = new PickingService()

    private customProblemService = new CustomProblemService()

    private loadingService = new LoadingService()

    private orderService = new OrderService()

    private get loading() {
        let loading: any = {}
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }
        return loading
    }

    private closeLoading() {
        if (this.changeSpinning) {
            this.changeSpinning(false)
        }
    }

    private created() {
        this.getSelectList()
        this.getProductList()
    }

    @Watch('height')
    private onHeightChange() {
        this.divHeight = this.height
    }

    private mounted() {
        this.moment = moment
        this.divHeight = this.height
        if (this.info.length) {
            this.data = this.info.map(x => {
                if (x.stock_processed) {
                    x.stock_processed = this.moment(
                        this.datetolocal(x.stock_processed),
                        'YYYY-MM-DD hh:mm:ss'
                    )
                } else {
                    x.stock_processed = ''
                }
                if (x.create_time) {
                    x.create_time = this.moment(
                        x.create_time,
                        'YYYY-MM-DD hh:mm:ss'
                    )
                } else {
                    x.create_time = ''
                }
                // if (!(x.solution_type instanceof Array)) {
                //     x.solution_type = [x.solution_type]
                // }
                x['save_flag'] = 1
                x['index'] = UUID.generate()
                x.w_warehouse_reason = x.w_warehouse_reason
                    ? x.w_warehouse_reason
                    : ''
                x.w_return_reason = x.w_return_reason ? x.w_return_reason : ''
                x.customer_reason = x.customer_reason ? x.customer_reason : ''
                x.sale_tag = x.sale_tag ? x.sale_tag : ''
                x.logistic_reason = x.logistic_reason ? x.logistic_reason : ''
                x.warehouse_reason = x.warehouse_reason
                    ? x.warehouse_reason
                    : ''
                x.stock_processed = x.stock_processed ? x.stock_processed : ''
                x.ship_type = x.ship_type ? x.ship_type : ''
                x.product_status = x.product_status ? x.product_status : ''
                x.solution_type = x.solution_type ? x.solution_type : []
                return x
            })

            let skus = this.data.map(x => x.default_code)
            this.getProductReason(skus)
        }
    }

    @Watch('info')
    private onInfoChange() {
        this.deleteList = []
        if (this.info.length) {
            this.data = this.info.map(x => {
                if (x.stock_processed) {
                    x.stock_processed = this.moment(
                        this.datetolocal(x.stock_processed),
                        'YYYY-MM-DD hh:mm:ss'
                    )
                } else {
                    x.stock_processed = ''
                }
                if (x.create_time) {
                    x.create_time = this.moment(
                        x.create_time,
                        'YYYY-MM-DD hh:mm:ss'
                    )
                } else {
                    x.create_time = ''
                }
                // if (!(x.solution_type instanceof Array)) {
                //     x.solution_type = [x.solution_type]
                // }
                x['save_flag'] = 1
                x['index'] = UUID.generate()
                x.w_warehouse_reason = x.w_warehouse_reason
                    ? x.w_warehouse_reason
                    : ''
                x.w_return_reason = x.w_return_reason ? x.w_return_reason : ''
                x.customer_reason = x.customer_reason ? x.customer_reason : ''
                x.sale_tag = x.sale_tag ? x.sale_tag : ''
                x.logistic_reason = x.logistic_reason ? x.logistic_reason : ''
                x.warehouse_reason = x.warehouse_reason
                    ? x.warehouse_reason
                    : ''
                x.stock_processed = x.stock_processed ? x.stock_processed : ''
                x.ship_type = x.ship_type ? x.ship_type : ''
                x.product_status = x.product_status ? x.product_status : ''
                x.solution_type = x.solution_type ? x.solution_type : []
                return x
            })
            let skus = this.info.map(x => x.default_code)
            this.getProductReason(skus)
        } else {
            this.data = []
        }
    }

    @Watch('orderId')
    private onOrderIdChange() {
        if (this.orderId) {
            this.getProductList()
        } else {
            this.productList = []
        }
    }

    private getSelectList() {
        this.customProblemService
            .queryCpReasonEnum(new RequestParams({}))
            .subscribe(
                data => {
                    if (data.length) {
                        this.reasonList = data[0]
                    }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getProductList() {
        this.productList = []
        this.customProblemService
            .queryCustomerProblemProduct(
                new RequestParams({
                    order_id: this.orderId
                })
            )
            .subscribe(
                data => {
                    this.productList = data
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
            create_time: moment(new Date()),
            create_user: store.state.userModule.id,
            customer_reason: '',
            default_code: '',
            info1: '',
            is_return_user: false,
            logistic_reason: '',
            name: '',
            note: '',
            product: 0,
            product_qty: 1,
            product_status: '',
            sale_tag: '',
            ship_type: '',
            stock_processed: '',
            w_return_reason: '',
            w_warehouse_reason: '',
            warehouse_reason: '',
            is_warehouse_in: false,
            solution_type: []
        })
        this.currentRow = this.data.length
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

        if (column === 'name') {
            let item = this.productList.find(x => x.id === value)
            if (item) {
                row.name = item.name
                row.product = item.product_id
                row.default_code = item.default_code

                if (this.productReason[item.default_code] === undefined) {
                    this.getProductReason([item.default_code])
                }
            }
        }
    }

    private saveBtn() {
        let list: any = []
        let beforeSaveData: any = JSON.parse(JSON.stringify(this.data))
        for (var i of this.data) {
            i.solution_type = i.solution_type.filter(x => x != null)
            delete i.index
            delete i.default_code
            delete i.name
            delete i.product_name
            delete i.is_warehouse_in
            if (i.save_flag) {
                delete i.create_time
            }

            if (!i.ship_type) {
                delete i.ship_type
            }
            if (!i.product_status) {
                delete i.product_status
            }
            if (!i.stock_processed) {
                i.stock_processed = null
            }
            list.push(i)
        }
        if (this.deleteList.length) {
            for (var j of this.deleteList) {
                j.solution_type = j.solution_type.filter(x => x != null)
                delete j.index
                delete j.default_code
                delete j.name
                delete j.product_name
                delete j.is_warehouse_in
                if (j.save_flag) {
                    delete j.create_time
                }

                if (!j.ship_type) {
                    delete j.ship_type
                }
                if (!j.product_status) {
                    delete j.product_status
                }
                if (!j.stock_processed) {
                    j.stock_processed = null
                }
                list.push(j)
            }
        }

        this.pickingService
            .saveCustomerProblemByOrderId(
                new RequestParams(
                    {
                        order_id: parseInt(this.orderId),
                        problem_list: list
                    },
                    this.loading
                )
            )
            .subscribe(
                () => {
                    this.deleteList = []
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.getCustomerList()
                },
                err => {
                    this.closeLoading()
                    this.$message.error(err.message)
                    this.data = JSON.parse(JSON.stringify(beforeSaveData))
                }
            )
    }

    private cancelBtn() {
        this.currentRow = -1
        this.getCustomerList()
    }

    private onDel(row) {
        this.currentRow = -1
        let item = this.data.find(x => x.index === row.index)
        if (item.save_flag == 1) {
            item['save_flag'] = 2
            this.deleteList.push(item)
        }
        item['save_flag'] = 2
        this.data = this.data.filter(x => !x.save_flag || x.save_flag < 2)
    }

    private onSkuSearch(key) {
        let params: any = CommonService.createQueryCondition(
            { product_number: key },
            {
                product_number: 'like',
                ...formConfig.condition
            }
        )
        params['page_index'] = 1
        params['page_size'] = 10
        this.productService
            .queryProducForStockMove(new RequestParams(params))
            .subscribe(data => {
                this.skuSource = data.map(
                    x => '[' + x.default_code + ']' + x.name
                )
                this.skuQueryResult = data
            })
    }

    private onSkuChange(key, row) {
        if (key && key.length > 1) {
            var productItem = this.skuQueryResult.find(
                x => '[' + x.default_code + ']' + x.name === key
            )
            row.product = productItem ? productItem.id : ''
        }
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
                if (this.productReason[data.default_code] === undefined) {
                    this.getProductReason([data.default_code])
                }

                //sku不能重复
                let item = this.data.find(x => x.index === row.index)
                item['name'] = '[' + data.default_code + ']' + data.name
                item['product'] = data.product_id
                item['default_code'] = data.default_code

                this.currentRow = -1
                setTimeout(function() {
                    _that.currentRow = row.index
                }, 1000)
            })
    }

    private getCustomerList() {
        this.orderService
            .getCustomerList(
                new RequestParams(
                    {
                        order_id: this.orderId
                    },
                    this.loading
                )
            )
            .subscribe(
                data => {
                    this.data = data.map(x => {
                        if (x.stock_processed) {
                            x.stock_processed = this.moment(
                                x.stock_processed,
                                'YYYY-MM-DD hh:mm:ss'
                            )
                        } else {
                            x.stock_processed = ''
                        }
                        if (x.create_time) {
                            x.create_time = this.moment(
                                x.create_time,
                                'YYYY-MM-DD hh:mm:ss'
                            )
                        } else {
                            x.create_time = ''
                        }
                        if (!(x.solution_type instanceof Array)) {
                            x.solution_type = [x.solution_type]
                        }
                        x['save_flag'] = 1
                        x['index'] = UUID.generate()
                        return x
                    })
                    this.closeLoading()
                },
                err => {
                    this.closeLoading()
                    // this.$message.error(err.message)
                }
            )
    }

    private calculateRowStyle(row) {
        if (row.is_return_user) {
            return 'red-text'
        } else if (row.is_warehouse_in) {
            return 'green-text'
        } else {
            return 'default-text'
        }
    }

    private datetolocal(date, fmt = 'yyyy-MM-dd hh:mm'): string {
        // 空数据处理
        if (date === null || date === undefined || date === '') {
            return ''
        }

        // 如果是时间戳则转化为时间
        if (typeof date === 'number') {
            date = new Date(date)
        }

        date = new Date(Date.parse(date.replace(/-/g, '/')))

        let utc = Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        )

        date = new Date(utc)

        const o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            S: date.getMilliseconds() // 毫秒
        }

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, date.getFullYear() + '')
        }

        for (const k in o) {
            // tslint:disable-next-line:max-line-length
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1
                        ? o[k]
                        : ('00' + o[k]).substr(('' + o[k]).length)
                )
            }
        }
        return fmt
    }

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private productReason: any = {}

    private getProductReason(sku) {
        // this.productReason = [
        //     'B-WARE 收到二手退货产品',
        //     'AR01-große Beschädigung 大面积破损',
        //     'AR02-kleine Macke小瑕疵/破损',
        //     'AR03-Geruch有气味',
        //     'AR07-Funktion beeinträchtigt 功能受损不能用',
        //     'PN-Passt nicht 不适合',
        //     'AN-Artikeln nicht wie angegeben 产品与描述不符',
        //     'IU-Inkompatibel oder ungeeignet 与客人家居不匹配',
        //     'LQ-Leistung oder Qualität ungenügend 质量不好',
        //     'OI-Oder ID 批次问题',
        //     'ZW-Zu Wenig Verschickt 少发货',
        //     'FP-von Produktion falsch gepackt工厂包错'
        // ]

        let that = this
        that.innerAction.setActionAPI(
            'product_management/query_product_reason_enum',
            CommonService.getMenuCode('common-menu')
        )
        this.loading['innerAction'] = this.innerAction
        this.publicService
            .query(
                new RequestParams(
                    {
                        sku_list: sku
                    },
                    this.loading
                )
            )
            .subscribe(
                data => {
                    this.closeLoading()
                    if (!Object.keys(this.productReason).length) {
                        this.productReason = data
                    } else {
                        for (let i in data) {
                            if (this.productReason[i] === undefined) {
                                this.productReason[i] = data[i]
                            }
                        }
                    }
                },
                err => {
                    this.closeLoading()
                    this.$message.error(err.message)
                }
            )
    }
}
</script>

<i18n>
{
    "en-us": {
        "product": "Product",
        "quantity": "Quantity",
        "ship": "Ship",
        "state": "State",
        "product_info": "Product Info",
        "w_warehouse_reason": "WareHouse Reason(rt)",
        "w_return_reason": "Grund Ruckgabe",
        "customer_reason": "Customer Reason",
        "product_problem": "Customer Problem(cs)",
        "logistic_reason": "Logistic Reason",
        "warehouse_reason": "Warehouse Reason(cs)",
        "solution_type": "Solution Type",
        "stock_processed": "Stock Processed",
        "create_time": "Create Time",
        "create_user": "Create User",
        "is_return_user": "Is Return User",
        "sale_tag": "Product Problem",
        "null": "None",
        "ship_num": "Shipment Number",
        "actions": {
            "add": "Add",
            "action": "Action",
            "save": "Save",
            "delete": "Delete",
            "cancel": "Discard"
        }
    },
    "zh-cn": {
        "product": "产品",
        "quantity": "数量",
        "ship": "物流",
        "state": "产品状态",
        "product_info": "产品信息",
        "w_warehouse_reason": "仓库原因(rt)",
        "w_return_reason": "退货原因",
        "customer_reason": "客户原因",
        "product_problem": "客户原因(cs)",
        "logistic_reason": "物流原因",
        "warehouse_reason": "仓库原因(cs)",
        "solution_type": "解决方案类型",
        "stock_processed": "库存处理",
        "create_time": "创建时间",
        "create_user": "创建者",
        "is_return_user": "Is Return User",
        "sale_tag": "产品问题",
        "null": "无",
        "ship_num": "运单号",
        "actions": {
            "add": "新增",
            "action": "操作",
            "save": "保存",
            "delete": "删除",
            "cancel": "丢弃"
        }
    }
}
</i18n>
