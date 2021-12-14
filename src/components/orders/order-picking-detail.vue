<template>
    <section
        class="component order-product-detail"
        :style="{ height: divHeight + 'px', 'overflow-y': 'auto' }"
    >
        <a-table
            :dataSource="data"
            :pagination="false"
            style="table-layout:fixed"
            rowKey="id"
            bordered
        >
            <a-table-column :title="$t('picking_id')" key="name" align="center">
                <template slot-scope="row">
                    <a @click="toPagePicking(row)">{{ row.name }}</a>
                </template>
            </a-table-column>
            <a-table-column :title="$t('state')" key="state" align="center">
                <template slot-scope="row">
                    {{ row.state | dict('PickingStatus') | translate }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('pre_sale')"
                key="pick_pre_sale"
                data-index="pick_pre_sale"
                align="center"
            ></a-table-column>
            <a-table-column
                :title="$t('send_gift')"
                key="send_gift"
                data-index="send_gift"
                align="center"
            ></a-table-column>
            <a-table-column
                :title="$t('resend')"
                key="is_resend"
                data-index="is_resend"
                align="center"
            ></a-table-column>
            <a-table-column
                :title="$t('remote_distinct')"
                key="remote_distinct"
                data-index="remote_distinct"
                align="center"
            ></a-table-column>
            <a-table-column
                :title="$t('sold_out')"
                key="is_sold_out"
                data-index="is_sold_out"
                align="center"
            ></a-table-column>
            <a-table-column
                :title="$t('sold_out_time')"
                key="sold_out_time"
                align="center"
            >
                <template slot-scope="row"
                    >{{ row.sold_out_time | datetolocal }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('service_process')"
                key="cs_process_time"
                align="center"
            >
                <template slot-scope="row"
                    >{{ row.cs_process_time | datetolocal }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('stock_process')"
                key="stock_process_time"
                align="center"
            >
                <template slot-scope="row"
                    >{{ row.stock_process_time | datetolocal }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('confirm_return_time')"
                key="confirm_return_time"
                align="center"
            >
                <template slot-scope="row"
                    >{{ row.confirm_return_time | datetolocal }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('return_process_time')"
                key="return_process_time"
                align="center"
            >
                <template slot-scope="row"
                    >{{ row.return_process_time | datetolocal }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('validate_state')"
                key="validate_s"
                data-index="validate_s"
                align="center"
            ></a-table-column>
        </a-table>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import router from '@/router'

@Component({
    components: {}
})
export default class OrderPickingDetail extends Vue {
    @Prop()
    private info

    @Prop()
    private height

    private divHeight: any = 100

    @Watch('height')
    private onHeightChange() {
        this.divHeight = this.height
    }

    private data: any[] = []

    private mounted() {
        this.data = this.info.map(x => x)

        this.divHeight = this.height
    }

    @Watch('info')
    private onInfoChange() {
        this.data = this.info.map(x => x)
    }

    private toPagePicking(row) {
        // router.push({
        //     name: 'picking-manage',
        //     params: { name: origin }
        // })
        if (this.$route.name != 'chat-box') {
            this.$router.push({
                name: 'picking-detail',
                path: `/picking/picking-detail/${row.id}`,
                params: {
                    id: row.id,
                    name: row.name
                }
            })
        }
    }
}
</script>

<i18n>
{
    "en-us": {
        "picking_id": "PickingID",
        "state": "State",
        "pre_sale": "Pre Sale",
        "send_gift": "Send Gift",
        "resend": "Resend",
        "remote_distinct": "Remote Distinct",
        "sold_out": "Sold Out",
        "sold_out_time": "Sold Out Time",
        "service_process": "Service Process",
        "stock_process": "Stock Process",
        "confirm_return_time": "Confirm Return Time",
        "return_process_time": "Return Process Time",
        "validate_state": "Validate State"
    },
    "zh-cn": {
        "picking_id": "拣货单号",
        "state": "状态",
        "pre_sale": "预售",
        "send_gift": "送礼物",
        "resend": "补发",
        "remote_distinct": "偏远地区",
        "sold_out": "售罄",
        "sold_out_time": "售罄时间",
        "service_process": "服务进程",
        "stock_process": "库存进程",
        "confirm_return_time": "确认退货时间",
        "return_process_time": "退货时间",
        "validate_state": "验证状态"
    }
}
</i18n>