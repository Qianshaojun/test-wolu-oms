<template>
    <section class="component order-detail">
        <a-card>
            <a-descriptions
                title="Detail Info"
                :column="2"
                size="small"
                class="depo_detail"
                bordered
            >
                <a-descriptions-item label="Name">
                    {{ data.name }}
                </a-descriptions-item>
                <a-descriptions-item label="Invoice No.">
                    {{ data.invoice_no }}
                </a-descriptions-item>
                <a-descriptions-item label="Vendor">
                    {{ data.vendor | dict2(vendorList) }}
                </a-descriptions-item>
                <a-descriptions-item label="Create User">
                    {{ data.create_user | dict2(systemUsers) }}
                </a-descriptions-item>
                <a-descriptions-item label="Ref No.">
                    {{ data.ref_no }}
                </a-descriptions-item>
                <a-descriptions-item label="Create Date">
                    {{ data.create_date }}
                </a-descriptions-item>
                <a-descriptions-item label="Company Name">
                    {{ data.company_name | dict2(companyList) }}
                </a-descriptions-item>
                <a-descriptions-item label="Shipment Item">
                    {{ data.shipment_item | dict2(shipmentItemList) }}
                </a-descriptions-item>
                <a-descriptions-item label="Extra File">
                    {{ data.extra_fee }}
                </a-descriptions-item>
                <a-descriptions-item label="From Port">
                    {{ data.from_port | dict2(fromPortList) }}
                </a-descriptions-item>
                <a-descriptions-item label=""> </a-descriptions-item>
                <a-descriptions-item label="To Port">
                    {{ data.to_port | dict2(toPortList) }}
                </a-descriptions-item>
            </a-descriptions>

            <h3 style="font-weight:600;">Order Lines</h3>
            <a-table
                :dataSource="orderDetail"
                :pagination="false"
                rowKey="id"
                :columns="detailColumns"
                style="table-layout:fixed;"
                :scroll="{ y: 400 }"
                bordered
            >
            </a-table>
        </a-card>
    </section>
</template>

<style>
.max300 {
    max-height: 300px;
    overflow-y: scroll;
}
.depo_detail .ant-descriptions-item-label {
    width: 150px !important;
    color: #000000;
}
/* .depo_detail .ant-descriptions-view {
    padding: 10px 20px;
} */
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Page } from '@/core/decorators'
import { PageService } from '~/bootstrap/services/page.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { RequestParams } from '~/core/http'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { PickingService } from '../../services/picking.service'
import { namespace } from 'vuex-class'
import router from '../../router'

const datasModule = namespace('datasModule')

@Component({
    components: {}
})
export default class DePoDetail extends Vue {
    @Prop()
    private detail: any

    @Prop()
    id: any

    private data: any = {}
    private orderDetail: any[] = []
    private detailColumns: any = []

    private companyList: any = []
    private fromPortList: any = []
    private toPortList: any = []
    private vendorList: any = []
    private shipmentItemList: any = []

    private summaryList: any = [
        'product_qty',
        'product_box',
        'weight_netto',
        'weight_brutto',
        'volume'
    ]

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @Watch('detail')
    private onDetailChange() {
        if (this.detail.id) {
            this.data = Object.assign({}, this.detail)
            this.orderDetail = this.data.de_po_line || []
            this.calcSummaryLine()
        }
    }

    private created() {
        this.getSystemuser()
    }

    private mounted() {
        this.data = Object.assign({}, this.detail)
        this.orderDetail = this.data.de_po_line || []
        this.calcSummaryLine()
        this.detailColumns = [
            {
                title: 'Product',
                width: 100,
                dataIndex: 'default_code',
                scopedSlots: { customRender: 'default_code' },
                align: 'left'
            },
            {
                title: 'Qty',
                width: 100,
                dataIndex: 'product_qty',
                align: 'right'
            },
            {
                title: 'Box',
                width: 100,
                dataIndex: 'product_box',
                align: 'right'
            },
            {
                title: 'Category',
                width: 100,
                dataIndex: 'product_cate',
                align: 'left'
            },
            {
                title: 'G.W.(KGS)',
                width: 100,
                dataIndex: 'weight_netto',
                align: 'right'
            },
            {
                title: 'N.W.(KGS)',
                width: 100,
                dataIndex: 'weight_brutto',
                align: 'right'
            },
            {
                title: 'CBM',
                width: 100,
                dataIndex: 'volume',
                align: 'right'
            },
            {
                title: 'C/S No.',
                width: 100,
                dataIndex: 'container_no',
                align: 'left'
            }
        ]
        this.companyList = [
            {
                code: 'woltu',
                name: 'Woltu'
            },
            {
                code: 'eugad',
                name: 'Eugad'
            },
            {
                code: 'situ',
                name: 'Situ'
            },
            {
                code: 'elight',
                name: 'Elight'
            },
            {
                code: 'wowo',
                name: 'WoWo'
            },
            {
                code: 'meteorsRain',
                name: 'MeteorsRain'
            },
            {
                code: 'brichimon',
                name: 'BRICHIMON LIMITED'
            }
        ]
        this.fromPortList = [
            {
                code: 'QINGDAO',
                name: 'QINGDAO'
            },
            {
                code: 'TIANJIN',
                name: 'TIANJIN'
            },
            {
                code: 'XIAMEN',
                name: 'XIAMEN'
            },
            {
                code: 'FUZHOU',
                name: 'FUZHOU'
            },
            {
                code: 'NINGBO',
                name: 'NINGBO'
            },
            {
                code: 'YANTIAN',
                name: 'YANTIAN'
            },
            {
                code: 'SHANGHAI',
                name: 'SHANGHAI'
            },
            {
                code: 'XIAOLAN',
                name: 'XIAOLAN'
            },
            {
                code: 'SHENZHEN',
                name: 'SHENZHEN'
            }
        ]
        this.toPortList = [
            {
                code: 'FELIXSTOWE',
                name: 'FELIXSTOWE'
            },
            {
                code: 'ROTTERDAM',
                name: 'ROTTERDAM'
            },
            {
                code: 'SOUTHAMPTON',
                name: 'SOUTHAMPTON'
            },
            {
                code: 'DUISBURG',
                name: 'DUISBURG'
            },
            {
                code: 'NEUSS',
                name: 'NEUSS'
            }
        ]
        this.vendorList = [
            {
                code: 'wawa',
                name: 'WAWAHOME'
            },
            {
                code: 'ye',
                name: 'YEMELEK'
            },
            {
                code: 'situ',
                name: 'ST-SITU'
            },
            {
                code: 'runheng',
                name: 'RH-RUNHENG'
            },
            {
                code: 'andong',
                name: 'AD-ANDONG'
            },
            {
                code: 'cheng',
                name: 'OH-ORANGE'
            },
            {
                code: 'dy',
                name: 'DY-DEALCRAFTS'
            },
            {
                code: 'ice',
                name: 'ICE-ICEBERG'
            },
            {
                code: 'kd',
                name: 'KD-KENDA'
            },
            {
                code: 'wt',
                name: 'WT-HENAN PROSPER SKINS AND LEATHER'
            },
            {
                code: 'yt',
                name: 'YT-YUTONG'
            },
            {
                code: 'zl',
                name: 'ZL-JINHUA RUNCHN'
            },
            {
                code: 'ykzh',
                name: 'YKZH-YONGKANG ZEHUI'
            },
            {
                code: 'anji',
                name: 'BY-BAOYOU'
            },
            {
                code: 'wj',
                name: 'WJ-WORKING'
            }
        ]
        this.shipmentItemList = [
            {
                code: 'FOB',
                name: 'FOB'
            },
            {
                code: 'CIF',
                name: 'CIF'
            }
        ]
    }

    private editable: any = false

    private pickingService = new PickingService()

    private loadingService = new LoadingService()

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private calcSummaryLine() {
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
                ret['index'] = 'summary'

                this.orderDetail.push(ret)

                this.$nextTick(() => {
                    let querySelector = 'tr[data-row-key="summary"]'
                    let tr: any = document.querySelector(querySelector)
                    tr.style.background = '#fdfdfd'
                })
            }
        }
    }
}
</script>

<i18n>
{
    "en-us": {
        "instock": "Inventory Info",
        "base": "Product Info",
        "shipment": "Shipment Info",
        "record": "In and Out Record",
        "log": "Operate Log",
        "depart": "Product Status",
        "action": {
            "create": "Create",
            "batch-create": "EXCEL Import",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Discard"
        }
    },
    "zh-cn": {
        "instock": "库存信息",
        "base": "产品详情",
        "shipment": "物流信息",
        "record": "出入库记录",
        "log": "日志",
        "depart": "产品状态",
        "action": {
            "create": "新建",
            "batch-create": "EXCEL导入",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "丢弃"
        }
    }
}
</i18n>
