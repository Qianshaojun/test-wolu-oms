<template>
    <section class="component order-base-detail">
        <div style="padding:0 20px 10px 20px;">
            <a-button @click="saveBtn" style="margin-left:10px;">{{
                $t('actions.save')
            }}</a-button>
            <a-button @click="cancelBtn" style="margin-left:10px;">{{
                $t('actions.cancel')
            }}</a-button>
        </div>
        <a-table
            :dataSource="data"
            :pagination="false"
            style="table-layout:fixed;"
            rowKey="index"
            :scroll="{ x: 1500 }"
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
                :title="$t('shipment_order')"
                key="shipment_num"
                align="center"
            >
                <template slot-scope="row">
                    {{ row.shipment_num }}
                    <a @click="toTrackShip(row)"
                        ><a-icon
                            type="search"
                            style="font-size:18px;margin-left:5px;"
                    /></a>
                </template>
            </a-table-column>
            <a-table-column :title="$t('pdf')" key="ship_url" align="center">
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
                    <a-select
                        v-if="
                            currentRow == row.index &&
                                editable &&
                                !row.shipment_num
                        "
                        v-decorator="['smtype']"
                        :value="row.smtype"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '200px' }"
                        size="small"
                        @change="e => onRowChange(row, 'smtype', e)"
                    >
                        <a-select-option
                            v-for="i of shipTypeList"
                            :key="i.code"
                            :value="i.code"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select>
                    <span v-else>
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
                    <a-input
                        v-if="
                            currentRow == row.index &&
                                editable &&
                                !row.shipment_num
                        "
                        v-decorator="['display_product']"
                        :value="row.display_product"
                        :style="{ width: '100%' }"
                        size="small"
                        @change="e => onRowChange(row, 'display_product', e)"
                    />
                    <span v-else>{{ row.display_product }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('location_sort')"
                key="location_product"
                data-index="location_product"
                :ellipsis="true"
                align="center"
            >
            </a-table-column>
            <a-table-column
                :title="$t('prime_item_id')"
                key="prime_item_id"
                align="center"
            >
                <template slot-scope="row">
                    <a-input
                        v-if="currentRow == row.index && editable"
                        v-decorator="['prime_item_id']"
                        :value="row.prime_item_id"
                        :style="{ width: '100%' }"
                        size="small"
                        @change="e => onRowChange(row, 'prime_item_id', e)"
                    />
                    <span v-else>{{ row.prime_item_id }}</span>
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
                :title="$t('latest_status')"
                key="latest_status"
                align="center"
            >
                <template slot-scope="row">
                    <a-input
                        v-if="currentRow == row.index && editable"
                        v-decorator="['latest_status']"
                        :value="row.latest_status"
                        :style="{ width: '100%' }"
                        size="small"
                        @change="e => onRowChange(row, 'latest_status', e)"
                    />
                    <span v-else>
                        {{ row.latest_status }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('need_process')"
                key="need_process"
                align="center"
            >
                <template slot-scope="row">
                    <a-select
                        v-if="currentRow == row.index && editable"
                        v-decorator="['need_process']"
                        :value="row.need_process"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '200px' }"
                        size="small"
                        @change="e => onRowChange(row, 'need_process', e)"
                    >
                        <a-select-option value=""
                            >{{ $t('null') }}
                        </a-select-option>
                        <a-select-option
                            v-for="i of needProcess"
                            :key="i.code"
                            :value="i.code"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select>
                    <span v-else>
                        {{ row.need_process | dict2(needProcess) }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('need_process_time')"
                key="need_process_time"
                data-index="need_process_time"
                align="center"
            >
                <template slot-scope="need_process_time">
                    {{ need_process_time | datetolocal }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('processed_time_logi')"
                key="processed_time_logi"
                align="center"
            >
                <template slot-scope="row">
                    <a-date-picker
                        v-if="currentRow == row.index && editable"
                        :value="row.processed_time_logi"
                        size="small"
                        format="YYYY-MM-DD HH:mm:ss"
                        @change="
                            e => onRowChange(row, 'processed_time_logi', e)
                        "
                    />
                    <span v-else>
                        {{ row.processed_time_logi | datetolocal }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('processed_time_CS')"
                key="processed_time_cs"
                align="center"
            >
                <template slot-scope="row">
                    <a-date-picker
                        v-if="currentRow == row.index && editable"
                        :value="row.processed_time_cs"
                        size="small"
                        format="YYYY-MM-DD HH:mm:ss"
                        @change="e => onRowChange(row, 'processed_time_cs', e)"
                    />
                    <span v-else>
                        {{ row.processed_time_cs | datetolocal }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('process_type')"
                key="process_type"
                align="center"
            >
                <template slot-scope="row">
                    <a-select
                        v-if="currentRow == row.index && editable"
                        v-decorator="['process_type']"
                        :value="row.process_type"
                        :style="{ width: '100%' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '200px' }"
                        size="small"
                        @change="e => onRowChange(row, 'process_type', e)"
                    >
                        <a-select-option value=""
                            >{{ $t('null') }}
                        </a-select-option>
                        <a-select-option
                            v-for="i of processType"
                            :key="i.code"
                            :value="i.code"
                            :title="i.name"
                        >
                            {{ i.name }}
                        </a-select-option>
                    </a-select>
                    <span v-else>
                        {{ row.process_type | dict2(processType) }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('actions.action')"
                key="action"
                align="center"
                width="100px"
            >
                <template slot-scope="row">
                    <a-popconfirm
                        :title="$t('actions.delete_shipment_number')"
                        :okText="$t('actions.ok')"
                        :cancelText="$t('action.cancel')"
                        placement="left"
                        @confirm="onDelPickNumber(row)"
                    >
                        <a><a-icon type="close"/></a>
                    </a-popconfirm>

                    <a-popconfirm
                        :title="$t('actions.delete_shipment')"
                        :okText="$t('actions.ok')"
                        :cancelText="$t('action.cancel')"
                        placement="left"
                        @confirm="onDel(row)"
                    >
                        <a style="margin-left:10px;">
                            <a-icon type="delete" />
                        </a>
                    </a-popconfirm>
                    <a
                        @click="sendRT(row)"
                        :title="$t('actions.send_rt')"
                        style="margin-left:10px;"
                    >
                        <a-icon type="mail" />
                    </a>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('actions.sceenshot_operate')"
                key="sceenshot_operate"
                align="center"
                width="80px"
            >
                <template slot-scope="row">
                    <a
                        @click="onUpload(row)"
                        :title="$t('actions.upload')"
                        style="margin-left:10px;"
                    >
                        <a-icon type="upload" />
                    </a>
                    <a
                        @click="revertPdf(row)"
                        :title="$t('actions.revert')"
                        style="margin-left:10px;"
                    >
                        <a-icon type="redo" />
                    </a>
                </template>
            </a-table-column>
        </a-table>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import appConfig from '@/config/app.config'
import TextEditCell from '~/components/common/text-edit-cell.vue'
import { PickingService } from '@/services/picking.service'
import { LoadingService } from '@/bootstrap/services/loading.service'
import { RequestParams } from '@/core/http'
import SendEmail from '~/components/common/send-email.vue'
import { ShipmentService } from '../../services/shipment.service'
import { GeneralCodeService } from '../../services/general_code.service'
import UUID from 'uuidjs'
import { namespace } from 'vuex-class'
import UploadFile from '@/shared/common/upload-file.vue'
import { CommonService } from '@/shared/utils/common.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

const datasModule = namespace('datasModule')

@Component({
    components: {
        TextEditCell,
        SendEmail,
        UploadFile
    }
})
export default class ShipmentDetail extends Vue {
    @Prop()
    info: any

    @Prop()
    id: any

    @Prop()
    private systemUsers

    @Prop()
    private shipTypeList

    @Prop({ default: 0, type: Number })
    private saveShipment

    private currentRow: any = ''

    private editable: any = true

    private data: any[] = []

    private selectedRowKeys: any = []

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

    private pickingService = new PickingService()
    private shipmentService = new ShipmentService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private loadingService = new LoadingService()

    private generalCodeService = new GeneralCodeService()

    private created() {}

    private mounted() {
        if (this.info.length) {
            this.data = this.info.map(x => {
                x['save_flag'] = 1
                x['index'] = UUID.generate()
                x.need_process = x.need_process ? x.need_process : ''
                x.process_type = x.process_type ? x.process_type : ''
                return x
            })
        }
    }

    @Watch('info')
    private onInfoChange() {
        if (this.info.length) {
            this.data = this.info.map(x => {
                x['save_flag'] = 1
                x['index'] = UUID.generate()
                x.need_process = x.need_process ? x.need_process : ''
                x.process_type = x.process_type ? x.process_type : ''
                return x
            })
        } else {
            this.data = []
        }
    }

    @Watch('saveShipment')
    private onSaveShipmentChange() {
        if (this.saveShipment > 0) {
            this.saveBtn(false)
        }
    }

    @Prop()
    changeSpinning

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

    private onDelPickNumber(row) {
        row.shipment_num = ''
        this.deleteShipment(row)
    }

    private onDel(row) {
        this.deleteShipmentNew(row)
    }

    private deleteShipment(row) {
        let loading: any = {}
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }
        this.shipmentService
            .deleteShipmentOrder(
                new RequestParams(
                    {
                        shipment_id: parseInt(row.id)
                    },
                    loading
                )
            )
            .subscribe(
                () => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                    let msg: any = this.$t('tips.delete_success')
                    this.$message.success(msg)
                },
                err => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                    this.$message.error(err.message)
                }
            )
    }

    private deleteShipmentNew(row) {
        let loading: any = {}
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }
        this.pickingService
            .deleteDhlShiDpment(
                new RequestParams(
                    {
                        shipment_id: parseInt(row.id)
                    },
                    loading
                )
            )
            .subscribe(
                () => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                    let msg: any = this.$t('tips.delete_success')
                    this.$message.success(msg)

                    if (
                        [
                            'dpd',
                            'ship_order',
                            'gls',
                            'return_order',
                            'bri',
                            'prime'
                        ].indexOf(row.smtype) != -1
                    ) {
                        this.data = this.data.filter(x => x.id !== row.id)
                    } else {
                        this.getShipments()
                    }
                },
                err => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                    this.$message.error(err.message)
                }
            )
    }

    private sendRT(row) {
        let loading: any = {}
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }
        this.shipmentService
            .getSendData(
                new RequestParams(
                    {
                        shipment_id: row.id
                    },
                    loading
                )
            )
            .subscribe(
                data => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
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
                                },
                                changeSpinning: this.changeSpinning
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
            if (ship_type == 'HERM_48' || ship_type == 'HERM_48_LL') {
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
            if (ship_type == 'GB_DX') {
                url =
                    'https://my.dxdelivery.com?t=' +
                    v +
                    '&p=' +
                    (row.postcode ? row.postcode : '') //加邮编
            }
            if (ship_type == 'XDPUK') {
                url =
                    'https://www.xdp.co.uk/track.php?c=' +
                    v +
                    '&code=' +
                    (row.postcode ? row.postcode : '') //加邮编
            }
            if (ship_type == 'GB_DPD_C1') {
                url = 'https://t.17track.net/en#nums=' + v + '&fc=100010'
            }
            if (ship_type == 'TUFFNELLS_P1') {
                url = 'https://www.tuffnells.co.uk/track-and-trace/' + v
            }
            if (['YDL_MP48S', 'YDL_LP48S', 'YDL_XL'].includes(ship_type)) {
                url =
                    'https://www.yodel.co.uk/track?error=5&parcel_id=' +
                    v +
                    '&postcode=' +
                    (row.postcode ? row.postcode : '') //加邮编
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

    private saveBtn(showMessage = true) {
        let list: any = []
        for (var i of this.data) {
            list.push({
                save_flag: 1,
                id: i.id,
                smtype: i.smtype,
                display_product: i.display_product,
                prime_item_id: i.prime_item_id,
                latest_status: i.latest_status,
                need_process: i.need_process,
                processed_time_logi: i.processed_time_logi,
                processed_time_cs: i.processed_time_cs,
                process_type: i.process_type
            })
        }

        let loading: any = {}
        if (showMessage) {
            if (this.changeSpinning) {
                this.changeSpinning(true)
            } else {
                loading = { loading: this.loadingService }
            }
        }

        this.pickingService
            .saveShipmentInfo(
                new RequestParams(
                    {
                        picking_id: parseInt(this.id),
                        shipment_list: list
                    },
                    loading
                )
            )
            .subscribe(
                () => {
                    if (showMessage) {
                        let msg: any = this.$t('tips.save_success')
                        this.$message.success(msg)
                        if (this.changeSpinning) {
                            this.changeSpinning(false)
                        }
                    }
                },
                err => {
                    if (showMessage) {
                        if (this.changeSpinning) {
                            this.changeSpinning(false)
                        }
                        this.$message.error(err.message)
                    }
                }
            )
    }

    private cancelBtn() {
        this.currentRow = -1
        this.getShipments()
    }

    private getShipments() {
        this.pickingService
            .queryShipment(
                new RequestParams({
                    picking_id: parseInt(this.id)
                })
            )
            .subscribe(
                data => {
                    this.data = data.map((x, i) => ({
                        ...x,
                        index: UUID.generate()
                    }))
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onRowChange(row, column, value) {
        if (
            Object.prototype.toString.call(value) === '[object InputEvent]' ||
            Object.prototype.toString.call(value) === '[object Event]'
        ) {
            row[column] = value.target.value
        } else {
            row[column] = value
        }
    }

    private onUpload(row) {
        this.$modal
            .open(
                UploadFile,
                {
                    urlPath:
                        '/system_api/upload?inner_action=/shipment/upload_shipment_pic&menu_code=' +
                        CommonService.getMenuCode('picking-manage'),
                    info: row.id
                },
                {
                    title: 'Upload Files',
                    width: '800px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('上传成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private revertPdf(row) {
        this.innerAction.setActionAPI(
            '/shipment/revert_shipment_pic',
            CommonService.getMenuCode('picking-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { id: row.id },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('修改成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }
}
</script>

<i18n>
{
  "en-us":{
    "shipment_order":"Shipment Order",
    "search_shipment":"Search Shipment",
    "shipment_order_type":"Shipment Order Type",
    "create_user":"Create User",
    "sent_product":"Sent Product",
    "location_sort":"Location Sort",
    "prime_item_id":"Prime Item ID",
    "ceate_time":"Ceate Time",
    "merge_time":"Merge Time",
    "latest_status":"Latest Status",
    "need_process":"Need Process",
    "need_process_time":"Need Process Time",
    "processed_time_logi":"Processed Time Logi",
    "processed_time_CS":"Processed Time CS",
    "process_type":"Process Type",
    "pdf":"PDF",
    "null":"None",
    "actions":{
      "add":"Add",
      "action":"Action",
      "save":"Save",
      "delete":"Delete",
      "cancel":"Discard",
      "delete_shipment_number":"Confirm delete Shipment Number?",
      "delete_shipment":"Confirm delete shipment line?",
      "send_rt":"Send RT",
      "ok":"OK",
      "upload":"Upload",
      "revert":"Revert",
      "sceenshot_operate":"Sceenshot Operate"
    }
  },
  "zh-cn":{
    "shipment_order":"物流单号",
    "search_shipment":"搜索",
    "shipment_order_type":"物流单类型",
    "create_user":"创建用户",
    "sent_product":"已寄出产品",
    "location_sort":"库位顺序",
    "prime_item_id":"Prime ID",
    "ceate_time":"创建时间",
    "merge_time":"合单时间",
    "latest_status":"现在状态",
    "need_process":"需要处理",
    "need_process_time":"需要处理时间",
    "processed_time_logi":"处理时间逻辑",
    "processed_time_CS":"处理时间CS",
    "process_type":"处理类型",
    "pdf":"PDF",
    "null":"无",
    "actions":{
      "add":"新增",
      "action":"操作",
      "save":"保存",
      "delete":"删除",
      "cancel":"丢弃",
      "delete_shipment_number":"确认删除运单的物流单号?",
      "delete_shipment":"确认删除运单行数据?",
      "send_rt":"发送RT",
      "ok":"确认",
      "upload":"上传",
      "revert":"还原",
      "sceenshot_operate":"截图操作"
    }
  }
}
</i18n>
