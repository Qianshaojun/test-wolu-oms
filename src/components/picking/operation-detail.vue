<template>
    <section class="component order-base-detail">
        <a-table
            :dataSource="data"
            :pagination="false"
            style="table-layout:fixed"
            rowKey="sku"
            bordered
        >
            <a-table-column
                :title="$t('source_package')"
                key="package_id"
                data-index="package_id"
                align="center"
            ></a-table-column>
            <a-table-column :title="$t('product')" key="name" align="left">
                <template slot-scope="row">
                    <span :title="row.name">{{
                        row.name
                            ? row.name.length > 20
                                ? row.name.substr(0, 17) + '...'
                                : row.name
                            : ''
                    }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('ordered_qty')"
                align="center"
                key="ordered_qty"
                data-index="ordered_qty"
            >
            </a-table-column>
            <a-table-column
                :title="$t('unit_measure')"
                key="unit_measure"
                data-index="unit_measure"
                align="center"
            >
                <template slot-scope="unit_measure">
                    <span :_id="unit_measure">Unit</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('owner')"
                key="owner_id"
                data-index="owner_id"
                align="center"
            ></a-table-column>
            <a-table-column
                :title="$t('todo')"
                key="todo"
                data-index="todo"
                align="center"
            ></a-table-column>
            <a-table-column
                :title="$t('source_location')"
                key="location_id"
                align="center"
            >
                <template slot-scope="row">
                    {{ row.location_id | dict2(locationList) }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('destination_location')"
                key="location_dest_id"
                align="center"
            >
                <template slot-scope="row">
                    {{ row.location_dest_id | dict2(locationList) }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('destination_package')"
                key="result_package_id"
                data-index="result_package_id"
                align="center"
            ></a-table-column>
        </a-table>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { LocationService } from '../../services/location.service'
import { RequestParams } from '@/core/http'

@Component({
    components: {}
})
export default class OperationDetail extends Vue {
    @Prop()
    info: any

    private data: any[] = []

    private locationList: any[] = []

    private locationService = new LocationService()

    private created() {
        this.getLocationList()
    }

    private mounted() {
        if (this.info.length) {
            this.data = this.info.map(x => {
                x['save_flag'] = 1
                return x
            })
        }
    }

    @Watch('info')
    private onInfoChange() {
        if (this.info.length) {
            this.data = this.info.map(x => {
                x['save_flag'] = 1
                return x
            })
        } else {
            this.data = []
        }
    }

    private getLocationList() {
        this.locationService.getLocationList(new RequestParams()).subscribe(
            data => {
                this.locationList = data
            },
            err => {
                this.$message.error('获取库位列表失败')
            }
        )
    }
}
</script>

<i18n>
{
    "en-us": {
        "source_package": "Source Package",
        "product": "Product",
        "unit_measure": "Unit of Measure",
        "ordered_qty": "Ordered Qty",
        "owner": "Owner",
        "todo": "Todo",
        "source_location": "Source Location",
        "destination_location": "Destination Location",
        "destination_package": "Destination Package"
    },
    "zh-cn": {
        "source_package": "源包裹",
        "product": "产品",
        "unit_measure": "计量单位",
        "ordered_qty": "预留数量",
        "owner": "拥有者",
        "todo": "待做事项",
        "source_location": "源库位",
        "destination_location": "目标库位",
        "destination_package": "包裹目的地"
    }
}
</i18n>
