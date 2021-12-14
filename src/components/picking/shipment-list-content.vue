<template>
    <section class="component edit-customer">
        <data-form
            :extends="extendItems"
            ref="dataForm"
            @submit="getShipmentList"
            :column="2"
            :showSearch="showSearch"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.picking_name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['picking_name']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.shipment_num')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['shipment_num']"
                        :style="{ width: '351px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.pre_sale')"
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
                    :label="$t('columns.merge_time')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['merge_time']"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                </a-form-item>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important;">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getShipmentList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                :scroll="{ y: 499 }"
                style="table-layout:fixed;"
            >
                <a-table-column
                    :title="$t('shipment_order')"
                    key="shipment_num"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.shipment_num }}
                        <a @click="toTrackShip(row)">
                            <a-icon
                                type="search"
                                style="font-size:18px;margin-left:5px;"
                            />
                        </a>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('pdf')"
                    key="ship_url"
                    align="center"
                >
                    <template slot-scope="row">
                        <a @click="downloadPdf(row)" v-show="row.shipment_num"
                            >预览</a
                        >
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('shipment_order_type')"
                    key="smtype"
                    align="center"
                >
                    <template slot-scope="row">
                        <span>
                            {{ row.smtype | dict2(shipTypeList) }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('create_user')"
                    key="user_id"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.user_id | dict2(systemUsers) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('sent_product')"
                    key="display_product"
                    align="center"
                >
                    <template slot-scope="row">
                        <span>{{ row.display_product }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('location_sort')"
                    key="location_product"
                    data-index="location_product"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('prime_item_id')"
                    key="prime_item_id"
                    align="center"
                >
                    <template slot-scope="row">
                        <span>{{ row.prime_item_id }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('ceate_time')"
                    key="ship_date"
                    data-index="ship_date"
                    align="center"
                >
                    <template slot-scope="ship_date">
                        {{ ship_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('merge_time')"
                    key="merge_time"
                    data-index="merge_time"
                    align="center"
                >
                    <template slot-scope="merge_time">
                        {{ merge_time | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('picking_name')"
                    key="picking_name"
                    align="center"
                >
                    <template slot-scope="row">
                        <span>
                            {{ row.picking_name }}
                        </span>
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('actions.action')"
                    key="action"
                    align="center"
                >
                    <template slot-scope="row">
                        <!--                        <a-->
                        <!--                            @click="onDelPickNumber(row)"-->
                        <!--                            :title="$t('actions.delete_pick_number')"-->
                        <!--                        >-->
                        <!--                            <a-icon type="close" />-->
                        <!--                        </a>-->
                        <!--                        <a-->
                        <!--                            @click="onDel(row)"-->
                        <!--                            :title="$t('actions.delete')"-->
                        <!--                            style="margin-left:10px;"-->
                        <!--                        >-->
                        <!--                            <a-icon type="delete" />-->
                        <!--                        </a>-->
                        <a
                            @click="sendRT(row)"
                            :title="$t('actions.send_rt')"
                            style="margin-left:10px;"
                        >
                            <a-icon type="mail" />
                        </a>
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { UserService } from '~/services/user.service'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { CompanyService } from '~/services/company.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import { ShipmentService } from '../../services/shipment.service'
import { GeneralCodeService } from '../../services/general_code.service'
import { PickingService } from '@/services/picking.service'
import SendEmail from '~/components/common/send-email.vue'
import appConfig from '@/config/app.config'

const userModule = namespace('userModule')
const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'shipment-list'
})
@Component({
    components: { SendEmail }
})
export default class ShipmentListContent extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

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

    private pickingService = new PickingService()
    private shipmentService = new ShipmentService()

    private loadingService = new LoadingService()

    private generalCodeService = new GeneralCodeService()
    // 分页服务
    private pageService = new PageService()
    // 表格数据源
    private data: any[] = []
    // 表格选择项
    private selectedRowKeys: any[] = []

    private stateList: any = ''

    private caseTypeList: any = ''

    @userModule.State
    private id

    @userModule.State
    private username

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @datasModule.State
    private shipTypeList

    private get rules() {
        return {}
    }

    private processType: any[] = [
        {
            name: 'STOP',
            code: 'stop'
        },
        {
            name: '40%',
            code: '40'
        },
        {
            name: '60%',
            code: '60'
        },
        {
            name: '80%',
            code: '80'
        }
    ]
    private needProcess: any[] = [
        {
            name: 'Stop 20%',
            code: 'stop20'
        },
        {
            name: 'Stop 40%',
            code: 'stop40'
        },
        {
            name: 'Stop 60%',
            code: 'stop60'
        },
        {
            name: 'Stop 80%',
            code: 'stop80'
        },
        {
            name: 'WrongAA3',
            code: 'wrongaa3'
        },
        {
            name: 'WrongAA4',
            code: 'wrongaa4'
        },
        {
            name: 'WrongAA5',
            code: 'wrongaa5'
        },
        {
            name: 'NE-Nicht erhalten 签收证明错误/没收到货',
            code: 'NE'
        }
    ]

    /**
     * 获取订单数据
     */
    private getShipmentList() {
        this.dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                picking_name: 'in_or_like',
                shipment_num: 'in_or_like',
                smtype: '=',
                ...formConfig.condition
            })

            var nowConditions: any[] = []
            for (var item of params.query_condition) {
                if (item.value.constructor == Array && item.operate !== 'in') {
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
                    nowConditions.push(item)
                }
            }
            params.query_condition = nowConditions
            this.shipmentService
                .getShipmentList(
                    new RequestParams(params, {
                        page: this.pageService,
                        loading: this.loadingService
                    })
                )
                .subscribe(
                    data => {
                        this.data = data
                        this.selectedRowKeys = []
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private onStatusChange(e) {}

    private downloadPdf(row) {
        if (row.ship_url.indexOf('http') !== -1) {
            window.open(row.ship_url)
        } else {
            window.open(
                appConfig.server +
                    '/shipment/get_shipment_pdf?attachment_id=' +
                    row.attachment_id
            )
        }
    }

    private deleteShipment(row) {
        this.shipmentService
            .deleteShipmentOrder(
                new RequestParams(
                    {
                        shipment_id: parseInt(row.id)
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                () => {
                    let msg: any = this.$t('tips.delete_success')
                    this.$message.success(msg)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private deleteShipmentNew(row) {
        this.pickingService
            .deleteDhlShiDpment(
                new RequestParams(
                    {
                        shipment_id: parseInt(row.id)
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                () => {
                    let msg: any = this.$t('tips.delete_success')
                    this.$message.success(msg)
                    this.data = this.data.filter(x => x.id !== row.id)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private sendRT(row) {
        this.shipmentService
            .getSendData(
                new RequestParams(
                    {
                        shipment_id: row.id
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$modal
                        .open(
                            SendEmail,
                            {
                                model: 'shipmentManage',
                                recordID: data[0].id,
                                data: {
                                    orderId: data[0].order_id,
                                    templateId: data[0].template_id,
                                    attachmentList: [data[0].attachment_id],
                                    filename: row.shipment_num + '.pdf'
                                }
                            },
                            {
                                title: this.$t('actions.send_rt'),
                                width: '1000px'
                            }
                        )
                        .subscribe(data => {})
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private toTrackShip(row) {
        if (row.shipment_num) {
            var v = row.shipment_num
            var ship_type = row.smtype
            // var gls_track_id = row_data['gls_track_id'].value;

            if (v.length <= 1) {
                this.$message.error('undefined order name')
            }

            // var url = "http://nolp.dhl.de/nextt-online-public/set_identcodes.do?lang=de&idc=" + v;
            var url =
                'https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=' +
                v
            if (ship_type == 'dpd' || ship_type == 'prime') {
                url = 'https://tracking.dpd.de/status/en_US/parcel/' + v
            }
            if (ship_type == 'gls') {
                url =
                    'https://gls-group.eu/app/service/closed/page/DE/de/witt004#/edit/' +
                    v
            }
            if (ship_type == 'HERM_48') {
                url =
                    'https://new.myhermes.co.uk/track.html#/parcel/' +
                    v +
                    '/details'
            }
            if (ship_type == 'GB_DHL_PAR') {
                url = 'https://track.dhlparcel.co.uk/?con=' + v + '&nav=1'
            }
            if (ship_type == 'RM_TR48') {
                url =
                    'https://www.royalmail.com/track-your-item#/tracking-results/' +
                    v
            }
            if (ship_type == 'return_order2' || ship_type == 'return_order') {
                if (v.length == '56760141212'.length && v.indexOf('5') == 0) {
                    url =
                        'https://www.gls-pakete.de/sendungsverfolgung?trackingNumber=' +
                        v
                } else if (
                    v.length == '01425063371295'.length &&
                    v.indexOf('0') == 0
                ) {
                    url = 'https://tracking.dpd.de/status/en_US/parcel/' + v
                }
            }

            window.open(url)
        }
    }
}
</script>

<i18n>
{
    "en-us": {
        "columns": {
            "picking_name": "Picking Name",
            "shipment_num": "Shipment Num",
            "pre_sale": "Pre Sale",
            "merge_time": "Merge Time"
        },
        "shipment_order": "Shipment Order",
        "search_shipment": "Search Shipment",
        "shipment_order_type": "Shipment Order Type",
        "create_user": "Create User",
        "sent_product": "Sent Product",
        "location_sort": "Location Sort",
        "prime_item_id": "Prime Item ID",
        "ceate_time": "Ceate Time",
        "merge_time": "Merge Time",
        "latest_status": "Latest Status",
        "need_process": "Need Process",
        "need_process_time": "Need Process Time",
        "picking_name": "Picking Mame",
        "processed_time_logi": "Processed Time Logi",
        "processed_time_CS": "Processed Time CS",
        "process_type": "Process Type",
        "pdf": "PDF",
        "null": "None",
        "actions": {
            "add": "Add",
            "action": "Action",
            "save": "Save",
            "delete": "Delete",
            "cancel": "Discard",
            "delete_pick_number": "Delete Picking Number",
            "send_rt": "Send RT"
        }
    },
    "zh-cn": {
        "columns": {
            "picking_name": "拣货单号",
            "shipment_num": "物流单号",
            "pre_sale": "预售",
            "merge_time": "合单时间"
        },
        "shipment_order": "物流单号",
        "search_shipment": "搜索",
        "shipment_order_type": "物流单类型",
        "create_user": "创建用户",
        "sent_product": "已寄出产品",
        "location_sort": "库位顺序",
        "prime_item_id": "Prime ID",
        "ceate_time": "创建时间",
        "merge_time": "合单时间",
        "latest_status": "现在状态",
        "need_process": "需要处理",
        "need_process_time": "需要处理时间",
        "picking_name": "拣货单号",
        "processed_time_logi": "处理时间逻辑",
        "processed_time_CS": "处理时间CS",
        "process_type": "处理类型",
        "pdf": "PDF",
        "null": "无",
        "actions": {
            "add": "新增",
            "action": "操作",
            "save": "保存",
            "delete": "删除",
            "cancel": "丢弃",
            "delete_pick_number": "删除发货单号",
            "send_rt": "发送RT"
        }
    }
}
</i18n>
