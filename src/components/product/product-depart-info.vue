<template>
    <section class="component order-product-detail">
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                1. {{ $t('title.purchaseStatus') }}
            </h3>
            <div
                style="padding:0 20px 10px 20px;;min-height:40px;display:inline-block;"
                v-if="editAble"
            >
                <a-button @click="onCreate" type="default" size="small"
                    >{{ $t('action.create') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="onSave"
                    style="margin-left:5px;"
                    >{{ $t('action.save') }}</a-button
                >
                <a-button
                    @click="onDelete"
                    type="default"
                    size="small"
                    style="margin-left:5px;"
                    >{{ $t('action.delete') }}
                </a-button>
            </div>
            <a-table
                :dataSource="purchaseData"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="index"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                :customRow="
                    rowKey => ({
                        on: {
                            click: () => {
                                currentRow = rowKey.index
                            }
                        }
                    })
                "
                bordered
            >
                <a-table-column
                    :title="$t('department')"
                    key="dept_id"
                    align="left"
                    width="20%"
                >
                    <template slot-scope="row">
                        <a-select
                            class="required"
                            v-if="currentRow == row.index && editAble"
                            v-decorator="['dept_id']"
                            :value="row.dept_id"
                            :style="{ width: '100%' }"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '200px' }"
                            size="small"
                            @change="e => onRowChange(row, 'dept_id', e)"
                        >
                            <a-select-option
                                v-for="i of topDepartmentList"
                                :key="i.id"
                                :value="i.id"
                                :title="i.dept_name"
                            >
                                {{ i.dept_name }}
                            </a-select-option>
                        </a-select>
                        <span v-else>
                            {{ getDepartName(row.dept_id) }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('sub_depart')"
                    key="sub_depart"
                    align="left"
                    width="20%"
                >
                    <template slot-scope="row">
                        <a-select
                            v-if="currentRow == row.index && editAble"
                            v-decorator="['child_dept_id']"
                            :value="row.child_dept_id"
                            :style="{ width: '100%' }"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '200px' }"
                            size="small"
                            @change="e => onRowChange(row, 'child_dept_id', e)"
                        >
                            <a-select-option
                                v-for="i of subDepartList"
                                :key="i.id"
                                :value="i.id"
                                :title="i.dept_name"
                            >
                                {{ i.dept_name }}
                            </a-select-option>
                        </a-select>
                        <span v-else>
                            {{ getSubDepartName(row.child_dept_id) }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('buhuo_state')"
                    key="purchase_status"
                    align="center"
                    width="15%"
                >
                    <template slot-scope="row">
                        <a-select
                            v-if="currentRow == row.index && editAble"
                            v-decorator="['purchase_status']"
                            :value="row.purchase_status"
                            :style="{ width: '100%' }"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '200px' }"
                            size="small"
                            @change="
                                e => onRowChange(row, 'purchase_status', e)
                            "
                        >
                            <a-select-option
                                v-for="item of $dict.SkuReplenishState"
                                :key="item.value"
                                :value="item.value"
                            >
                                {{ $t(item.label) }}
                            </a-select-option>
                        </a-select>
                        <span v-else>
                            {{
                                row.purchase_status
                                    | dict('SkuReplenishState')
                                    | translate
                            }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('saler')"
                    key="sale_list"
                    align="left"
                    width="30%"
                >
                    <template slot-scope="row">
                        <a-select
                            class="required"
                            mode="multiple"
                            v-if="currentRow == row.index && editAble"
                            v-decorator="['sale_list']"
                            :value="row.sale_list"
                            :style="{ width: '100%' }"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '200px' }"
                            size="small"
                            showSearch
                            :filterOption="filterSelectOption"
                            @change="e => onRowChange(row, 'sale_list', e)"
                        >
                            <a-select-option
                                v-for="item of systemUsers"
                                :key="item.code"
                                :value="item.code"
                            >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                        <span v-else>
                            {{ getSalerName(row.sale_list) }}
                        </span>
                    </template>
                </a-table-column>
            </a-table>
        </a-card>
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                2. {{ $t('title.saleStatus') }}
            </h3>
            <div
                style="padding:0 20px 10px 20px;;min-height:40px;display:inline-block;"
                v-if="editAble"
            >
                <a-button
                    @click="onCreateSaleStatus"
                    type="default"
                    size="small"
                    >{{ $t('action.create') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="onSaveSaleStatus"
                    style="margin-left:5px;"
                    >{{ $t('action.save') }}</a-button
                >
                <!-- <a-button
                    @click="onDeleteSaleStatus"
                    type="default"
                    size="small"
                    style="margin-left:5px;"
                    >{{ $t('action.delete') }}
                </a-button> -->
            </div>
            <a-table
                :dataSource="prodStatusList"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="index"
                :rowSelection="{
                    selected2RowKeys: selected2RowKeys,
                    onChange: keys => (selected2RowKeys = keys)
                }"
                :customRow="
                    rowKey => ({
                        on: {
                            click: () => {
                                currentRow = rowKey.index
                            }
                        }
                    })
                "
                bordered
            >
                <a-table-column
                    :title="$t('warehouse_id')"
                    key="warehouse_id"
                    align="center"
                    width="30px"
                >
                    <template slot-scope="row">
                        <a-select
                            class="required"
                            v-if="
                                currentRow == row.index &&
                                    editAble &&
                                    row.id == undefined &&
                                    1 == 2
                            "
                            v-decorator="['warehouse_id']"
                            :value="row.warehouse_id"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '30px' }"
                            size="small"
                            @change="e => onRowChange(row, 'warehouse_id', e)"
                        >
                            <a-select-option
                                v-for="item of $dict.WarehouseId"
                                :key="item.value"
                                :value="item.value"
                            >
                                {{ $t(item.label) }}
                            </a-select-option>
                        </a-select>
                        <span v-else>
                            {{
                                row.warehouse_id
                                    | dict('WarehouseId')
                                    | translate
                            }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('sale_state')"
                    key="sale_status"
                    align="center"
                    width="100px"
                >
                    <template slot-scope="row">
                        <a-select
                            class="required"
                            v-if="currentRow == row.index && editAble"
                            v-decorator="['sale_status']"
                            :value="row.sale_status"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '100px' }"
                            size="small"
                            @change="e => onRowChange(row, 'sale_status', e)"
                        >
                            <a-select-option
                                v-for="item of $dict.CheckProdStatus"
                                :key="item.value"
                                :value="item.value"
                            >
                                {{ $t(item.label) }}
                            </a-select-option>
                        </a-select>
                        <span v-else>
                            {{
                                row.sale_status
                                    | dict('CheckProdStatus')
                                    | translate
                            }}
                        </span>
                    </template>
                </a-table-column>
            </a-table>
        </a-card>
    </section>
</template>

<style>
.required .ant-select-selection {
    background-color: #ecc5e9;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ProductService } from '../../services/product.service'
import { RequestParams } from '@/core/http'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { namespace } from 'vuex-class'
import ProductDepartInfoEdit from './product-depart-info-edit.vue'
import UUID from 'uuidjs'
import { CommonService } from '@/shared/utils/common.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

const datasModule = namespace('datasModule')

@Component({
    components: {}
})
export default class ProductDepartInfo extends Vue {
    @Prop()
    id: any

    @Prop({ default: false })
    editAble: any

    @Prop()
    departmentList: any

    @Prop()
    systemUsers: any

    private topDepartmentList: any[] = []

    private purchaseData: any[] = []
    private prodStatusList: any[] = []

    private currentRow: any = ''

    private selectedRowKeys: any = []

    private selected2RowKeys: any = []

    private subDepartList: any = []

    private productService = new ProductService()
    private loadingService = new LoadingService()
    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private created() {
        this.getProductStatus()

        this.topDepartmentList = this.departmentList.filter(
            x => x.dept_type == 30
        )

        this.getSubDepartmentList()
    }

    private getProductStatus() {
        this.innerAction.setActionAPI(
            'product/query_one_product_department_rel',
            CommonService.getMenuCode('product-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    {
                        prod_tmpl_id: parseInt(this.id)
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    if (data.length) {
                        this.purchaseData = data[0].purchase_status || []
                        this.prodStatusList = data[0].sale_status || []
                    }

                    this.purchaseData = this.purchaseData.map(x => {
                        x.dept_id = x.dept_id[0]
                        x.save_flag = 1
                        x.index = UUID.generate()
                        return x
                    })

                    this.prodStatusList = this.prodStatusList.map(x => {
                        x.index = UUID.generate()
                        return x
                    })
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onCreate() {
        this.purchaseData.push({
            index: UUID.generate(),
            dept_id: '',
            child_dept_id: '',
            purchase_status: 10,
            sale_status: 10,
            save_flag: 0,
            sale_list: []
        })
    }

    private onCreateSaleStatus() {
        let item = this.prodStatusList.find(y => y.warehouse_id == 'de')
        if (!item) {
            this.prodStatusList.push({
                index: UUID.generate(),
                warehouse_id: 'de',
                sale_status: 10
            })
        }

        item = this.prodStatusList.find(y => y.warehouse_id == 'uk')
        if (!item) {
            this.prodStatusList.push({
                index: UUID.generate(),
                warehouse_id: 'uk',
                sale_status: 10
            })
        }

        item = this.prodStatusList.find(y => y.warehouse_id == 'us')
        if (!item) {
            this.prodStatusList.push({
                index: UUID.generate(),
                warehouse_id: 'us',
                sale_status: 10
            })
        }
    }

    private onSave() {
        let params: any = []
        if (this.purchaseData.length == 0) {
            this.$message.error('the list has too few elements,min length is 1')
            return
        }
        for (let i in this.purchaseData) {
            if (!this.purchaseData[i].dept_id) {
                this.$message.error('Department is required(部门为必填项)')
                return
            }
            if (this.purchaseData[i].sale_list.length == 0) {
                this.$message.error('Operator is required(运营人员为必填项)')
                return
            }
            let pm = {
                id: this.purchaseData[i].id ? this.purchaseData[i].id : 0,
                dept_id: this.purchaseData[i].dept_id,
                purchase_status: this.purchaseData[i].purchase_status,
                sale_status: this.purchaseData[i].sale_status,
                sale_list: this.purchaseData[i].sale_list.length
                    ? this.purchaseData[i].sale_list
                    : [],
                save_flag: this.purchaseData[i].save_flag,
                prod_tmpl_id: parseInt(this.id)
            }
            if (this.purchaseData[i].child_dept_id) {
                pm['child_dept_id'] = this.purchaseData[i].child_dept_id
            }
            params.push(pm)
        }
        this.innerAction.setActionAPI(
            'product/save_product_department_rel',
            CommonService.getMenuCode('product-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        prod_tmpl_id: parseInt(this.id),
                        prod_dept_list: params
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    for (let i in data.message) {
                        let item = this.purchaseData.find(x => x.dept_id == i)
                        if (item) {
                            item.id = data.message[i]
                            item.save_flag = 1
                        }
                    }

                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onSaveSaleStatus() {
        let params: any = []

        for (let i in this.prodStatusList) {
            if (!this.prodStatusList[i].warehouse_id) {
                this.$message.error('Warehouse is required(仓库为必填项)')
                return
            }
            if (this.prodStatusList[i].sale_status == 0) {
                this.$message.error(
                    'Product status is required(产品状态为必填项)'
                )
                return
            }
            let pm = {
                id: this.prodStatusList[i].id,
                warehouse_id: this.prodStatusList[i].warehouse_id,
                sale_status: this.prodStatusList[i].sale_status
            }
            params.push(pm)
        }
        this.innerAction.setActionAPI(
            'product/save_product_warehouse_status_rel',
            CommonService.getMenuCode('product-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        prod_tmpl_id: parseInt(this.id),
                        prod_status_list: params
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    for (let i in data.message) {
                        let item = this.prodStatusList.find(
                            x => x.warehouse_id == i
                        )
                        if (item) {
                            item.id = data.message[i]
                        }
                    }

                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDeleteSaleStatus() {
        if (this.selected2RowKeys.length == 0) {
            this.$message.error('Please select the data to be deleted first')
            return
        }
        let ids: any = []
        for (let i of this.selected2RowKeys) {
            let item = this.prodStatusList.find(y => y.index == i)
            if (item.id !== undefined && item.id) {
                ids.push(item.id)
            }
        }
        if (ids.length == 0) {
            let msg: any = this.$t('tips.delete_success')
            this.$message.success(msg)
            this.prodStatusList = this.prodStatusList.filter(
                x => !this.selected2RowKeys.includes(x.index)
            )
            return
        }

        this.innerAction.setActionAPI(
            'product/delete_product_warehouse_status_rel',
            CommonService.getMenuCode('product-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        delete_list: ids
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.prodStatusList = this.prodStatusList.filter(
                        x => !this.selected2RowKeys.includes(x.index)
                    )
                    this.selected2RowKeys = []

                    let msg: any = this.$t('tips.delete_success')
                    this.$message.success(msg)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDelete() {
        if (this.selectedRowKeys.length == 0) {
            this.$message.error('Please select the data to be deleted first')
            return
        }
        let ids: any = []
        for (let i of this.selectedRowKeys) {
            let item = this.purchaseData.find(y => y.index == i)
            if (item.id !== undefined && item.id) {
                ids.push(item.id)
            }
        }
        if (ids.length == 0) {
            let msg: any = this.$t('tips.delete_success')
            this.$message.success(msg)
            this.purchaseData = this.purchaseData.filter(
                x => !this.selectedRowKeys.includes(x.index)
            )
            return
        }

        this.innerAction.setActionAPI(
            'product/delete_product_department_rel',
            CommonService.getMenuCode('product-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        delete_list: ids
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.delete_success')
                    this.$message.success(msg)
                    this.purchaseData = this.purchaseData.filter(
                        x => !this.selectedRowKeys.includes(x.index)
                    )
                    this.selectedRowKeys = []
                },
                err => {
                    this.$message.error(err.message)
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

    private getSubDepartName(department) {
        let ret: any = department
        let item = this.subDepartList.find(x => x.id == department)
        if (item) {
            ret = item.dept_name
        }
        return ret
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

    private getSalerName(saler) {
        let ret: any = []
        for (let i in saler) {
            let item = this.systemUsers.find(x => x.code == saler[i])
            if (item) {
                ret.push(item.name)
            }
        }

        if (ret.length) {
            return ret.join(',')
        } else {
            return ''
        }
    }

    private getSubDepartmentList() {
        this.subDepartList = this.departmentList.filter(x => x.dept_type == 100)
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
  "en-us":{
    "title.purchaseStatus":"Purchase Status",
    "title.saleStatus":"Sale Status",
    "department":"Department",
    "sub_depart":"Sub Department",
    "buhuo_state":"Replenishment State",
    "sale_state":"Sale State",
    "saler":"Saler",
    "warehouse_id":"Warehouse",
    "action": {
        "create": "Create",
        "save": "Save",
        "delete": "Delete"
    }
  },
  "zh-cn":{
    "title.purchaseStatus":"补货状态",
    "title.saleStatus":"销售状态",
    "department":"部门",
    "sub_depart":"子部门",
    "buhuo_state":"补货状态",
    "sale_state":"销售状态",
    "saler":"运营",
    "warehouse_id":"仓库",
    "action": {
        "create": "新增",
        "save": "保存",
        "delete": "删除"
    }
  }
}
</i18n>
