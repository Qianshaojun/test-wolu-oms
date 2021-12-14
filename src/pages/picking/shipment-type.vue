<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form ref="dataForm" @submit="getShipmentTypeList" :column="1">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.create_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        v-decorator="['create_date']"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.tms_ship_code')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['tms_ship_code']"
                        :style="{ width: '323px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
            </template>
            <template #action>
                <a-button type="primary" @click="onCreateShipType"
                    >{{ $t('action.create') }}
                </a-button>
            </template>
        </data-form>
        <a-card class="margin-y" style="margin:0 !important">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="rel_code"
                style="table-layout:fixed;"
                :scroll="{ y: 360 }"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: (keys, select_rows) => {
                        selectedRows = select_rows
                        selectedRowKeys = keys
                    }
                }"
                @on-page-change="getShipmentTypeList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                        onTrClick(record)
                    }
                "
            >
                <a-table-column
                    :title="$t('columns.rel_name')"
                    key="rel_name"
                    align="left"
                >
                    <template slot-scope="row">
                        <span>{{ row.rel_name }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.ship_type')"
                    key="ship_type"
                    align="center"
                >
                    <template slot-scope="row">
                        <span>{{ shipTypeDict[row.ship_type] }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.tms_ship_code')"
                    key="tms_ship_code"
                    align="center"
                >
                    <template slot-scope="row">
                        <span>{{ row.tms_ship_code }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.seller_code_list')"
                    key="seller_code_list"
                    align="left"
                >
                    <template slot-scope="row">
                        <span v-for="item of row.seller_code_list" :key="item"
                            >{{
                                sellerDict[item] ? sellerDict[item] : item
                            }}
                            ,</span
                        >
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.warehouse_name_list')"
                    key="warehouse_name_list"
                    align="center"
                >
                    <template slot-scope="row">
                        <span>{{
                            row.warehouse_name_list
                                ? row.warehouse_name_list
                                : ''
                        }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.country_code_list')"
                    key="country_code_list"
                    align="left"
                >
                    <template slot-scope="row">
                        <span v-for="item in row.country_code_list" :key="item"
                            >{{ item | dict2(countryList) }},
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.package_size')"
                    key="package_size"
                    align="center"
                >
                    <template slot-scope="row">
                        <span>{{
                            row.package_size ? row.package_size : ''
                        }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.rel_code')"
                    key="rel_code"
                    align="center"
                >
                    <template slot-scope="row">
                        <span>{{ row.rel_code }}</span>
                    </template>
                </a-table-column>
                <a-table-column title="操作" key="action" align="center">
                    <template slot-scope="row">
                        <a @click="onEdit(row)">编辑</a>
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
        <a-card v-if="selectedRows[0]">
            <LogView
                :object_name="object_name"
                :record_code="record_code"
            ></LogView>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { ShipmentService } from '~/services/shipment.service'
import { CountryService } from '~/services/country.service'
import { GeneralCodeService } from '~/services/general_code.service'
import { SellerInstanceService } from '~/services/seller-instance.service'
import DataForm from '~/shared/components/data-form.vue'
import LogView from '~/shared/common/log-view.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import ShipmentTypeEdit from '@/components/picking/shipment-type-edit.vue'

const datasModule = namespace('datasModule')
const userModule = namespace('userModule')

@Page({
    layout: 'workspace',
    name: 'shipment-type'
})
@Component({
    components: {
        ShipmentTypeEdit,
        LogView
    }
})
export default class ShipmentType extends Vue {
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    private shipmentService = new ShipmentService()

    private countryService = new CountryService()

    private generalCodeService = new GeneralCodeService()

    private sellerInstanceService = new SellerInstanceService()

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    // 表格数据源
    private data: any[] = []

    private object_name = 'ship_type_tms_ship_code_rel'

    private record_code = ''
    // 表格选择项
    private selectedRowKeys: any[] = []

    private selectedRows: any[] = []

    private countryList: any[] = []

    private sellerList: any[] = []

    private shipTypeList: any[] = []

    private sellerDict = {}

    private countryDict = {}

    private shipTypeDict = {}

    private getcountry() {
        this.countryService.getListCode(new RequestParams()).subscribe(data => {
            this.countryList = data
            for (let i of data) {
                this.countryDict[i.code] = i.name
            }
        })
    }

    private getShipTypelist() {
        this.generalCodeService
            .queryShipType(
                new RequestParams({
                    general_code_group: 'ship_type'
                })
            )
            .subscribe(data => {
                this.shipTypeList = data
                for (let i of data) {
                    this.shipTypeDict[i.code] = i.name
                }
            })
    }

    private created() {
        this.getcountry()
        this.getSellerList()
        this.getShipTypelist()
    }

    private mounted() {}

    private getSellerList() {
        this.sellerInstanceService
            .query_seller_name(new RequestParams())
            .subscribe(
                data => {
                    this.sellerList = data
                    for (let i of data) {
                        this.sellerDict[i.code] = i.name
                    }
                },
                err => {
                    this.$message.error('获取Seller列表失败')
                }
            )
    }

    private getShipmentTypeList() {
        this.dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                tms_ship_code: 'like',
                ...formConfig.condition
            })

            var nowConditions: any[] = []
            for (var item of params.query_condition) {
                if (item.value.constructor == Array) {
                    if (
                        item.value.length == 2 &&
                        item.value[0].constructor.name == 'Moment'
                    ) {
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '>=',
                            value: new Date(
                                item.value[0].format('YYYY-MM-DD') + ' 00:00:00'
                            )
                        })
                    }
                    if (
                        item.value.length == 2 &&
                        item.value[1].constructor.name == 'Moment'
                    ) {
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '<=',
                            value: new Date(
                                item.value[1].format('YYYY-MM-DD') +
                                    ' 23:59:59.999999'
                            )
                        })
                    }
                } else {
                    nowConditions.push(item)
                }
            }
            params.query_condition = nowConditions
            this.shipmentService
                .queryAllShipType(
                    new RequestParams(params, {
                        page: this.pageService,
                        loading: this.loadingService
                    })
                )
                .subscribe(
                    data => {
                        for (let row of data) {
                            let country_code_list = row.country_code_list
                                ? row.country_code_list
                                : ''

                            if (country_code_list) {
                                country_code_list = country_code_list
                                    .replace('{', '')
                                    .replace('}', '')
                                    .split(',')
                                row.country_code_list = country_code_list
                            } else {
                                row.country_code_list = []
                            }

                            let seller_code_list = row.seller_code_list
                                ? row.seller_code_list.substring(
                                      1,
                                      row.seller_code_list.length - 1
                                  )
                                : ''

                            if (seller_code_list) {
                                seller_code_list = seller_code_list.split(',')
                                row.seller_code_list = seller_code_list
                            } else {
                                row.seller_code_list = []
                            }
                        }
                        this.data = data
                        if (!this.record_code) {
                            this.record_code = data[0].rel_code
                        }
                        if (!this.selectedRows[0]) {
                            this.selectedRows = [data[0]]
                            this.selectedRowKeys = [data[0].rel_code]
                        }
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private onCreateShipType() {
        this.$modal
            .open(
                ShipmentTypeEdit,
                {
                    saveFlag: 0,
                    countryList: this.countryList,
                    sellerList: this.sellerList,
                    shipTypeList: this.shipTypeList
                },
                {
                    title: '创建',
                    width: '60%'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getShipmentTypeList()
            })
    }

    private onTrClick(record) {
        let info = this.data.find(x => x.rel_code === record)
        this.selectedRows = [info]
        this.record_code = info.rel_code
    }

    private onEdit(row) {
        this.$modal
            .open(
                ShipmentTypeEdit,
                {
                    saveFlag: 1,
                    countryList: this.countryList,
                    sellerList: this.sellerList,
                    shipTypeList: this.shipTypeList,
                    row: row
                },
                {
                    title: '编辑',
                    width: '60%'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getShipmentTypeList()
            })
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "status": "Status",
            "rel_code": "rel_code",
            "rel_name": "rel_name",
            "ship_type": "Ship Type",
            "seller_code_list": "Seller Code List",
            "seller_name_list": "Seller Name List",
            "country_code_list": "Country Code List",
            "warehouse_id_list": "Warehouse Id List",
            "warehouse_name_list": "Warehouse Name List",
            "package_size": "Package Size",
            "tms_ship_code": "Tms Ship Code",
            "create_date": "Create Date",
            "write_uid": "Write Uid",
            "write_date": "Write Date"
        },
        "action": {
            "cancel": "Cancel",
            "edit": "Edit"
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "yes": "Yes",
        "no": "No"
    },
    "zh-cn": {
        "desc": "",
        "columns": {
            "status": "状态",
            "rel_code": "编码",
            "rel_name": "关系名",
            "ship_type": "物流编码",
            "seller_code_list": "店铺编码列表",
            "seller_name_list": "店铺名称列表",
            "country_code_list": "国家列表",
            "warehouse_id_list": "仓库编码列表",
            "warehouse_name_list": "仓库名称列表",
            "package_size": "包裹尺寸",
            "tms_ship_code": "tms物流编码",
            "create_date": "创建时间",
            "write_uid": "修改人",
            "write_date": "修改时间"
        },
        "action": {
            "cancel": "Cancel",
            "edit": "编辑"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "yes": "是",
        "no": "否"
    }
}
</i18n>
