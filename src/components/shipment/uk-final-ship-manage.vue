<template>
    <section class="component order-base-detail">
        <a-card style="margin:0;">
            <h3 style="padding:10px 0;color:#000;font-weight:600;">
                各站点自发货理论运费
                <span style="float:right;">
                    <a-button type="primary" @click="updateCalcResult"
                        >更新计算结果</a-button
                    >
                    <a-button
                        type="primary"
                        style="margin-left:10px;"
                        @click="setRatio"
                        >编辑物流比例</a-button
                    >
                </span>
            </h3>
            <a-table
                :columns="columns"
                :dataSource="data"
                :pagination="false"
                rowKey="id"
                :scroll="{ x: 1500 }"
                bordered
            >
            </a-table>
        </a-card>
        <a-card style="margin:0;">
            <h3 style="padding:10px 0;color:#000;font-weight:600;">
                操作日志
            </h3>
            <FinalLogView
                :sku="data[0].sku"
                warehouse="uk"
                :cnt="cnt"
                pageName="final-shipping-uk"
            ></FinalLogView>
        </a-card>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { PickingService } from '../../services/picking.service'
import { RequestParams } from '../../core/http'
import { Mutation, namespace } from 'vuex-class'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { Form } from 'ant-design-vue'
import moment from 'moment'
import EditShipRatio from '../picking/edit-ship-ratio.vue'
import FinalLogView from '@/components/shipment/final-log-view.vue'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { CommonService } from '@/shared/utils/common.service'
import { PageService } from '../../bootstrap/services/page.service'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')

@Component({
    components: {
        FinalLogView
    }
})
export default class UkFinalShipManage extends Vue {
    @Emit('modal.submit')
    private submit(data) {
        return data
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    info: any

    private form: any

    @pageParamsModule.State
    private commonPageInfo

    private data: any = []

    private object_name: any = ''

    private record_code: any = ''

    @Watch('info')
    onInfoChange() {
        if (this.info) {
            this.data = this.info.map(x => x)
        }
    }

    private mounted() {
        if (this.info) {
            this.data = this.info.map(x => x)
        }
    }

    private loadingService = new LoadingService()
    private pageService = new PageService()
    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private columns: any = [
        {
            key: 'sku',
            title: 'SKU',
            dataIndex: 'sku',
            width: 100,
            align: 'center'
        },
        {
            key: 'instance',
            title: this.$t('columns.instance'),
            dataIndex: 'instance',
            width: 100,
            align: 'center'
        },
        {
            key: 'is_dynamic_calculation',
            title: this.$t('columns.is_dynamic_calculation'),
            dataIndex: 'is_dynamic_calculation',
            width: 100,
            align: 'center'
        },
        {
            key: 'hermes_percent',
            title: this.$t('columns.hermes_percent'),
            dataIndex: 'hermes_percent',
            width: 100,
            align: 'center'
        },
        {
            key: 'yodel_percent',
            title: this.$t('columns.yodel_percent'),
            dataIndex: 'yodel_percent',
            width: 100,
            align: 'center'
        },
        {
            key: 'dhl_percent',
            title: this.$t('columns.dhl_percent'),
            dataIndex: 'dhl_percent',
            width: 100,
            align: 'center'
        },
        {
            key: 'royalmail_percent',
            title: this.$t('columns.royalmail_percent'),
            dataIndex: 'royalmail_percent',
            width: 100,
            align: 'center'
        },
        {
            key: 'dpd_percent',
            title: this.$t('columns.dpd_percent'),
            dataIndex: 'dpd_percent',
            width: 100,
            align: 'center'
        },
        {
            key: 'dx_percent',
            title: this.$t('columns.dx_percent'),
            dataIndex: 'dx_percent',
            width: 100,
            align: 'center'
        },
        {
            key: 'dx_percent',
            title: this.$t('columns.dx_percent'),
            dataIndex: 'dx_percent',
            width: 100,
            align: 'center'
        },
        {
            key: 'xdp_percent',
            title: this.$t('columns.xdp_percent'),
            dataIndex: 'xdp_percent',
            width: 100,
            align: 'center'
        },
        {
            key: 'tuffnells_percent',
            title: this.$t('columns.tuffnells_percent'),
            dataIndex: 'tuffnells_percent',
            width: 100,
            align: 'center'
        },
        {
            key: 'hermes_theoretical_freight',
            title: this.$t('columns.hermes_theoretical_freight'),
            dataIndex: 'hermes_theoretical_freight',
            width: 100,
            align: 'center'
        },
        {
            key: 'yodel_theoretical_freight',
            title: this.$t('columns.yodel_theoretical_freight'),
            dataIndex: 'yodel_theoretical_freight',
            width: 100,
            align: 'center'
        },
        {
            key: 'dhl_theoretical_freight',
            title: this.$t('columns.dhl_theoretical_freight'),
            dataIndex: 'dhl_theoretical_freight',
            width: 100,
            align: 'center'
        },
        {
            key: 'royalmail_theoretical_freight',
            title: this.$t('columns.royalmail_theoretical_freight'),
            dataIndex: 'royalmail_theoretical_freight',
            width: 100,
            align: 'center'
        },
        {
            key: 'dpd_theoretical_freight',
            title: this.$t('columns.dpd_theoretical_freight'),
            dataIndex: 'dpd_theoretical_freight',
            width: 100,
            align: 'center'
        },
        {
            key: 'dx_theoretical_freight',
            title: this.$t('columns.dx_theoretical_freight'),
            dataIndex: 'dx_theoretical_freight',
            width: 100,
            align: 'center'
        },
        {
            key: 'xdp_theoretical_freight',
            title: this.$t('columns.xdp_theoretical_freight'),
            dataIndex: 'xdp_theoretical_freight',
            width: 100,
            align: 'center'
        },
        {
            key: 'tuffnells_theoretical_freight',
            title: this.$t('columns.tuffnells_theoretical_freight'),
            dataIndex: 'tuffnells_theoretical_freight',
            width: 100,
            align: 'center'
        },
        {
            key: 'mfn_theoretical_freight',
            title: this.$t('columns.mfn_theoretical_freight'),
            dataIndex: 'mfn_theoretical_freight',
            width: 100,
            align: 'center'
        },
        {
            key: 'write_date',
            title: this.$t('columns.write_date'),
            dataIndex: 'write_date',
            width: 100,
            align: 'center',
            customRender: (value, row, index) => {
                if (value) {
                    return CommonService.dateToLocal(value)
                }
                return value
            }
        }
    ]

    public created() {
        this.form = this.$form.createForm(this)
    }

    private setRatio() {
        let that = this
        this.$modal
            .open(
                EditShipRatio,
                {
                    info: this.data
                },
                {
                    title: '编辑物流比例',
                    width: '1000px',
                    closable: false
                }
            )
            .subscribe(data => {
                that.data = data.map(x => x)
                that.getData(that.data[0].sku)
            })
    }

    private updateCalcResult() {
        this.innerAction.setActionAPI(
            'theoretical_final_freight/update_calculation_result',
            CommonService.getMenuCode('final-shipping-uk')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { id_list: [this.data[0].price_id] },
                    {
                        page: this.pageService,
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('修改成功')
                    this.getData(this.data[0].sku)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private exportLog() {}

    private cnt: any = 0

    private getData(sku) {
        let that = this
        this.innerAction.setActionAPI(
            'theoretical_final_freight/query_all',
            CommonService.getMenuCode('final-shipping-uk')
        )
        this.publicService
            .queryPagination(
                new RequestParams(
                    {
                        query_condition: [
                            {
                                query_name: 'warehouse',
                                operate: '=',
                                value: 'uk'
                            },
                            {
                                query_name: 'sku',
                                operate: '=',
                                value: sku
                            }
                        ]
                    },
                    {
                        page: this.pageService,
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    that.data = data.map(x => x)
                    that.cnt++
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
    "en-us": {
        "columns":{
            "is_dynamic_calculation": "Use Dynamic Calc",
            "hermes": "Hermes",
            "instance": "Site",
            "log_content":"Log Content",
            "log_type": "Log Type",
            "write_uid":"Write User",
            "write_date":"Create Date",
            "dpd_percent":"DPD Percent",
            "dhl_percent":"DHL Percent",
            "hermes_percent":"Hermes Percent",
            "yodel_percent":"Yodel Percent",
            "royalmail_percent":"RoyalMail Percent",
            "dx_percent":"DX Percent",
            "xdp_percent":"XDP Percent",
            "tuffnells_percent":"Tuffnells Percent",
            "dpd_theoretical_freight":"DPD Theoretical Freight",
            "dhl_theoretical_freight":"DHL Theoretical Freight",
            "hermes_theoretical_freight":"Hermes Theoretical Freight",
            "yodel_theoretical_freight":"Yodel Theoretical Freight",
            "royalmail_theoretical_freight":"RoyalMail Theoretical Freight",
            "dx_theoretical_freight":"DX Theoretical Freight",
            "xdp_theoretical_freight":"XDP Theoretical Freight",
            "tuffnells_theoretical_freight":"Tuffnells Theoretical Freight",
            "mfn_theoretical_freight":"MFN Theoretical Freight"
        },
        "err_msg":"The sum Ratio mast be 100"
    },
    "zh-cn": {
        "columns":{
            "is_dynamic_calculation":"是否开启动态计算",
            "hermes": "Hermes运单比例",
            "instance": "站点",
            "log_content":"日志",
            "log_type": "类型",
            "write_uid":"操作人",
            "write_date":"操作时间",
            "dpd_percent":"DPD运单比例",
            "dhl_percent":"DHL运单比例",
            "hermes_percent":"Hermes运单比例",
            "yodel_percent":"Yodel运单比例",
            "royalmail_percent":"RoyalMail运单比例",
            "dx_percent":"DX运单比例",
            "xdp_percent":"XDP运单比例",
            "tuffnells_percent":"Tuffnells运单比例",
            "dpd_theoretical_freight":"DPD理论运费",
            "dhl_theoretical_freight":"DHL理论运费",
            "hermes_theoretical_freight":"Hermes理论运费",
            "yodel_theoretical_freight":"Yodel理论运费",
            "royalmail_theoretical_freight":"RoyalMail理论运费",
            "dx_theoretical_freight":"DX Theoretical理论运费",
            "xdp_theoretical_freight":"XDP Theoretical理论运费",
            "tuffnells_theoretical_freight":"Tuffnells理论运费",
            "mfn_theoretical_freight":"MFN理论运费"
        },
        "err_msg":"总比例数必须等于100"
    }
}
</i18n>
