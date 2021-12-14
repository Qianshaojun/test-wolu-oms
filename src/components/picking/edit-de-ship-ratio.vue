<template>
    <section class="component order-base-detail">
        <a-tabs defaultActiveKey="de" type="card">
            <a-tab-pane
                tab="DE"
                key="de"
                v-if="data.find(x => x.instance == 'DE')"
            >
                <SetShipRatio
                    :info="data.find(x => x.instance == 'DE')"
                    @changeData="updateData"
                    type="de"
                >
                </SetShipRatio>
            </a-tab-pane>
            <a-tab-pane
                tab="FR"
                key="fr"
                v-if="data.find(x => x.instance == 'FR')"
            >
                <SetShipRatio
                    :info="data.find(x => x.instance == 'FR')"
                    @changeData="updateData"
                    type="fr"
                >
                </SetShipRatio>
            </a-tab-pane>
            <a-tab-pane
                tab="ES"
                key="es"
                v-if="data.find(x => x.instance == 'ES')"
            >
                <SetShipRatio
                    :info="data.find(x => x.instance == 'ES')"
                    @changeData="updateData"
                    type="es"
                >
                </SetShipRatio>
            </a-tab-pane>
            <a-tab-pane
                tab="IT"
                key="it"
                v-if="data.find(x => x.instance == 'IT')"
            >
                <SetShipRatio
                    :info="data.find(x => x.instance == 'IT')"
                    @changeData="updateData"
                    type="it"
                >
                </SetShipRatio>
            </a-tab-pane>
            <a-tab-pane
                tab="NL"
                key="nl"
                v-if="data.find(x => x.instance == 'NL')"
            >
                <SetShipRatio
                    :info="data.find(x => x.instance == 'NL')"
                    @changeData="updateData"
                    type="nl"
                >
                </SetShipRatio>
            </a-tab-pane>
            <a-tab-pane
                tab="SE"
                key="se"
                v-if="data.find(x => x.instance == 'SE')"
            >
                <SetShipRatio
                    :info="data.find(x => x.instance == 'SE')"
                    @changeData="updateData"
                    type="se"
                >
                </SetShipRatio>
            </a-tab-pane>
            <a-tab-pane
                tab="PL"
                key="pl"
                v-if="data.find(x => x.instance == 'PL')"
            >
                <SetShipRatio
                    :info="data.find(x => x.instance == 'PL')"
                    @changeData="updateData"
                    type="pl"
                >
                </SetShipRatio>
            </a-tab-pane>
            <a-tab-pane
                tab="AT"
                key="at"
                v-if="data.find(x => x.instance == 'AT')"
            >
                <SetShipRatio
                    :info="data.find(x => x.instance == 'AT')"
                    @changeData="updateData"
                    type="at"
                >
                </SetShipRatio>
            </a-tab-pane>
            <a-tab-pane
                tab="BE"
                key="be"
                v-if="data.find(x => x.instance == 'BE')"
            >
                <SetShipRatio
                    :info="data.find(x => x.instance == 'BE')"
                    @changeData="updateData"
                    type="be"
                >
                </SetShipRatio>
            </a-tab-pane>
            <a-tab-pane
                tab="LU"
                key="lu"
                v-if="data.find(x => x.instance == 'LU')"
            >
                <SetShipRatio
                    :info="data.find(x => x.instance == 'LU')"
                    @changeData="updateData"
                    type="lu"
                >
                </SetShipRatio>
            </a-tab-pane>
        </a-tabs>
        <div class="flex-row justify-content-end margin-top">
            <!-- <a-button class="margin-right" @click="cancel">{{
                $t('action.cancel')
            }}</a-button> -->
            <a-button type="primary" @click="submit">{{
                $t('close')
            }}</a-button>
        </div>
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
import SetShipRatio from '@/components/picking/set-ship-ratio.vue'

const datasModule = namespace('datasModule')

@Component({
    components: {
        SetShipRatio
    }
})
export default class EditDeShipRatio extends Vue {
    @Emit('modal.submit')
    private submit() {
        return this.data
    }

    @Emit('modal.cancel')
    private cancel(params) {
        return params
    }

    private form: any

    private data: any = []

    @Prop()
    private info

    @Watch('info')
    private onInfoChange() {
        this.data = this.info.map(x => x)
    }

    private mounted() {
        if (this.info) {
            this.data = this.info.map(x => x)
        }
    }

    private assign_to_user: any = ''

    private defaultPriceCalcType: any = 'open'

    private startEndTime: any = []

    private pickingService = new PickingService()
    private loadingService = new LoadingService()

    public created() {
        this.form = this.$form.createForm(this)
    }

    private updateData(params) {
        let item = this.data.find(x => x.instance == params.instance)
        if (item) {
            item['id'] = params['id']
            for (let i in params) {
                if (item[i] !== undefined) {
                    item[i] = params[i]
                }
            }
        }
    }
}
</script>
<i18n>
{
    "en-us": {
        "columns":{
            "dynamic_price_calc": "Dynamic Price Calc",
            "open": "Open",
            "close": "Close",
            "latest_calc_time": "Latest Calc Time",
            "start_end_time": "Start and End Time",
            "ratio_set": "Ratio Setting",
            "calculation": "Calculate"
        },
        "err_msg":"The sum Ratio mast be 100",
        "close":"Return"
    },
    "zh-cn": {
        "columns":{
            "dynamic_price_calc":"动态价格计算",
            "open": "开启",
            "close": "关闭",
            "latest_calc_time": "最新计算时间",
            "start_end_time": "起止时间",
            "ratio_set": "物流比例设置",
            "calculation": "计算"
        },
        "err_msg":"总比例数必须等于100",
        "close":"返回"
    }
}
</i18n>
