<template>
    <section class="component order-detail">
        <a-tabs
            defaultActiveKey="base"
            :v-model="activeKey"
            @change="e => onPanelChange(e)"
        >
            <a-tab-pane :tab="$t('base')" key="base">
                <ProductBaseDetail
                    :info="data"
                    :id="id"
                    :systemUsers="systemUsers"
                ></ProductBaseDetail>
            </a-tab-pane>
            <a-tab-pane :tab="$t('instock')" key="instock">
                <InstockInfo :id="id"></InstockInfo>
            </a-tab-pane>
            <a-tab-pane :tab="$t('shipment')" key="shipment">
                <ShipmentInfo :id="id"></ShipmentInfo>
            </a-tab-pane>
            <a-tab-pane :tab="$t('record')" key="record">
                <ProductInoutRecord :id="id"></ProductInoutRecord>
            </a-tab-pane>
            <a-tab-pane :tab="$t('depart')" key="depart">
                <ProductDepartInfo
                    :id="id"
                    :editAble="true"
                    :departmentList="departmentList"
                    :systemUsers="systemUsers"
                ></ProductDepartInfo>
            </a-tab-pane>
            <a-tab-pane :tab="$t('log')" key="log">
                <ProductLogDetail :id="id"></ProductLogDetail>
            </a-tab-pane>
        </a-tabs>
    </section>
</template>

<style>
.max300 {
    max-height: 300px;
    overflow-y: scroll;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ProductBaseDetail from './product-base-detail.vue'
import InstockInfo from './instock-info.vue'
import ShipmentInfo from './shipment-info.vue'
import ProductDepartInfo from './product-depart-info.vue'
import ProductInoutRecord from './product-inout-record.vue'
import ProductLogDetail from './product-log-detail.vue'
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
    components: {
        ProductBaseDetail,
        InstockInfo,
        ShipmentInfo,
        ProductInoutRecord,
        ProductLogDetail,
        ProductDepartInfo
    }
})
export default class ProductDetail extends Vue {
    @Prop()
    private detail: any

    @Prop()
    id: any

    @Prop()
    systemUsers

    private object_name: any = 'product_changed_log'

    private record_code: any = '1'

    private activeKey: any = 'base'

    private data: any = {}

    private orderID: any = ''

    private saveDetail: any = 0

    private order_info: any[] = []
    private saveShipment: any = 0
    private invoice: any[] = []

    @datasModule.State
    private departmentList

    @datasModule.Action
    private getDepartmentList

    @Watch('detail')
    private onDetailChange() {
        // if (!this.data.id || (this.data.id && this.detail.id != this.data.id)) {
        if (this.detail.id) {
            this.data = Object.assign({}, this.detail)
            this.handleUnit()
            this.orderID = this.data.order_id
        }
    }

    handleUnit() {
        this.data.max_size = `${
            this.data.package_length ? this.data.package_length : ''
        }${this.data.package_width ? 'x' + this.data.package_width : ''}${
            this.data.package_height ? 'x' + this.data.package_height : ''
        }`
        this.data.carton_size = `${
            this.data.carton_length ? this.data.carton_length : ''
        }${this.data.carton_width ? 'x' + this.data.carton_width : ''}${
            this.data.carton_height ? 'x' + this.data.carton_height : ''
        }`
        this.data.package_size_container = `${
            this.data.size1 ? this.data.size1 : ''
        }${this.data.size2 ? 'x' + this.data.size2 : ''}${
            this.data.size3 ? 'x' + this.data.size3 : ''
        }`
    }

    private created() {
        this.getDepartmentList()
    }

    private mounted() {
        this.data = Object.assign({}, this.detail)
    }

    private editable: any = false

    private pickingService = new PickingService()

    private loadingService = new LoadingService()

    private onPanelChange(e) {
        this.activeKey = e
        if (!this.id) {
            return
        }
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private editBtn() {
        this.editable = !this.editable
    }

    public handleChange(value, key) {
        this.data[key] = value
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
