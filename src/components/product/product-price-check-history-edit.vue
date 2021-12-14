<template>
    <section class="component edit-customer">
        <ProductPriceCheckEditDetail
            ref="fromDetail"
            :info="order"
            :history="true"
        />
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { GeneralCodeService } from '~/services/generate_code.service'
import LogView from '~/shared/common/log-view.vue'
import { ReportService } from '../../services/report.service'
import ProductPriceCheckEditDetail from '~/components/product/product-price-check-edit-detail.vue'

@Component({
    components: {
        LogView,
        ProductPriceCheckEditDetail
    }
})
export default class ProductPriceCheckHistoryEdit extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private info

    private form: any

    private order: any = []

    private originData: any = []

    private historyList: any = []

    private editAble: any = false

    private activeKey: any = 'base'

    private save_flag: any = 1

    private loadingService = new LoadingService()

    private generalCodeService = new GeneralCodeService()

    private reportService = new ReportService()

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    @Watch('info')
    onInfoChange() {
        if (this.info) {
            this.editAble = false
            this.updateOrder(this.info)
        }
    }

    private updateOrder(order) {
        this.originData = order
        this.$nextTick(() => {
            this.order = order[0]
            this.save_flag = 1
            this.editAble = false
        })
    }

    private created() {
        this.getCn_cate()
        this.form = this.$form.createForm(this)
    }

    private mounted() {
        if (this.info.length) {
            this.updateOrder(this.info)
        }
    }

    private getCn_cate() {
        this.reportService.query_category_dict(new RequestParams()).subscribe(
            data => {
                this.cateDict = data[0]
                let cateData = data[0]
                for (let i in cateData) {
                    this.fatherCates.push(i)
                }
            },
            error => {
                this.$message.error(error.message)
            }
        )
    }

    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }
}
</script>
<i18n>
{
  "en-us": {
    "desc": "",
    "columns":{
        "ae_commission_rate":"ae_commission_rate",
        "after_refund_tax":"after_refund_tax",
        "at_ae_lowest_price":"at_ae_lowest_price",
        "at_mfn_shipment_fee":"at_mfn_shipment_fee",
        "au_mfn_shipment_fee":"au_mfn_shipment_fee",
        "be_ae_lowest_price":"be_ae_lowest_price",
        "be_mfn_shipment_fee":"be_mfn_shipment_fee",
        "cn_category":"cn_category",
        "cn_sub_category":"cn_sub_category",
        "compute_state":"compute_state",
        "custom_fee":"custom_fee",
        "custom_tax":"custom_tax",
        "de_ae_lowest_price":"de_ae_lowest_price",
        "de_b2c_lowest_price":"de_b2c_lowest_price",
        "de_fba_fee":"de_fba_fee",
        "de_fba_lowest_price":"de_fba_lowest_price",
        "de_lowest_profit":"de_lowest_profit",
        "de_mfn_lowest_price":"de_mfn_lowest_price",
        "de_mfn_shipment_fee":"de_mfn_shipment_fee",
        "de_prime_discount_price":"de_prime_discount_price",
        "de_prime_fee":"de_prime_fee",
        "de_prime_normal_price":"de_prime_normal_price",
        "discount_end":"discount_end",
        "discount_percent":"discount_percent",
        "discount_start":"discount_start",
        "dollar_to_cn":"dollar_to_cn",
        "ero_to_cn":"ero_to_cn",
        "es_ae_lowest_price":"es_ae_lowest_price",
        "es_b2c_lowest_price":"es_b2c_lowest_price",
        "es_fba_fee":"es_fba_fee",
        "es_fba_lowest_price":"es_fba_lowest_price",
        "es_float_price":"es_float_price",
        "es_mfn_lowest_price":"es_mfn_lowest_price",
        "es_mfn_shipment_fee":"es_mfn_shipment_fee",
        "float_platform":"float_platform",
        "float_price":"float_price",
        "fr_ae_lowest_price":"fr_ae_lowest_price",
        "fr_b2c_lowest_price":"fr_b2c_lowest_price",
        "fr_cd_fbc_fee":"fr_cd_fbc_fee",
        "fr_cd_fbc_price":"fr_cd_fbc_price",
        "fr_cd_mfn_price":"fr_cd_mfn_price",
        "fr_fba_fee":"fr_fba_fee",
        "fr_fba_lowest_price":"fr_fba_lowest_price",
        "fr_float_price":"fr_float_price",
        "fr_mfn_lowest_price":"fr_mfn_lowest_price",
        "fr_mfn_shipment_fee":"fr_mfn_shipment_fee",
        "gb_ae_lowest_price":"gb_ae_lowest_price",
        "gb_b2c_lowest_price":"gb_b2c_lowest_price",
        "gb_fba_fee":"gb_fba_fee",
        "gb_fba_lowest_price":"gb_fba_lowest_price",
        "gb_mfn_lowest_price":"gb_mfn_lowest_price",
        "gb_mfn_shipment_fee":"gb_mfn_shipment_fee",
        "gb_own_ae_lowest_price":"gb_own_ae_lowest_price",
        "gb_own_fba_fee":"gb_own_fba_fee",
        "gb_own_fba_lowest_price":"gb_own_fba_lowest_price",
        "gb_own_lowest_price":"gb_own_lowest_price",
        "girth":"girth",
        "header_fee":"header_fee",
        "id":"id",
        "it_ae_lowest_price":"it_ae_lowest_price",
        "it_b2c_lowest_price":"it_b2c_lowest_price",
        "it_fba_fee":"it_fba_fee",
        "it_fba_lowest_price":"it_fba_lowest_price",
        "it_float_price":"it_float_price",
        "it_mfn_lowest_price":"it_mfn_lowest_price",
        "it_mfn_shipment_fee":"it_mfn_shipment_fee",
        "latest_compute_time":"latest_compute_time",
        "lu_ae_lowest_price":"lu_ae_lowest_price",
        "lu_mfn_shipment_fee":"lu_mfn_shipment_fee",
        "money_type":"money_type",
        "nl_ae_lowest_price":"nl_ae_lowest_price",
        "nl_b2c_lowest_price":"nl_b2c_lowest_price",
        "nl_fba_fee":"nl_fba_fee",
        "nl_fba_lowest_price":"nl_fba_lowest_price",
        "nl_float_price":"nl_float_price",
        "nl_mfn_lowest_price":"nl_mfn_lowest_price",
        "nl_mfn_shipment_fee":"nl_mfn_shipment_fee",
        "operator":"operator",
        "other_fee":"other_fee",
        "pack_num":"pack_num",
        "pl_ae_lowest_price":"pl_ae_lowest_price",
        "pl_fba_fee":"pl_fba_fee",
        "pl_fba_lowest_price":"pl_fba_lowest_price",
        "pl_float_price":"pl_float_price",
        "pl_mfn_lowest_price":"pl_mfn_lowest_price",
        "pl_mfn_shipment_fee":"pl_mfn_shipment_fee",
        "refund_tax":"refund_tax",
        "se_fba_fee":"se_fba_fee",
        "se_fba_lowest_price":"se_fba_lowest_price",
        "size1":"size1",
        "size2":"size2",
        "size3":"size3",
        "sku":"sku",
        "uk_float_price":"uk_float_price",
        "volume":"volume"
    },
    "action":{
        "edit":"Edit",
        "cancel":"Cancel",
        "more":"More",
        "action":"Action",
        "add":"Add",
        "export":"Export",
        "save":"Save",
        "pre_check":"Pre Check",
        "deal_update_for_check":"处理更新核价(update)",
        "deal_new":"处理新加核价(new)",
        "deal_allnew":"处理新加数据获取核价(allnew)",
        "flag_to_update":"标注为update",
        "flag_to_new":"标注为new",
        "flag_to_allnew":"标注为allnew",
        "recheck_for_ship":"物流费用变动后一键重新核价",
        "recheck_for_sku":"插入相同通用货号基础产品核价",
        "recheck_for_update":"一键更新相同通用货号核价数据"
    },
    "delete":"Are you sure delete?",
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Delete Success",
    "please_choose":"Please Choose",
    "sku":"SKU",
    "check_type":"Check Type",
    "memo":"Memo",
    "check_date":"Check Date",
    "approve_state":"Approve State",
    "actions":"Action",
    "view":"View"
  },
  "zh-cn": {
    "desc": "",
    "columns":{
       "ae_commission_rate":"ae_commission_rate",
        "after_refund_tax":"退后税",
        "at_mfn_shipment_fee":"AT-MFN运费",
        "au_mfn_shipment_fee":"AU-MFN运费",
        "be_mfn_shipment_fee":"BE-MFN运费",
        "cn_category":"中文分类",
        "cn_sub_category":"中文子类",
        "compute_state":"compute_state",
        "custom_fee":"custom_fee",
        "custom_tax":"custom_tax",
        "de_fba_fee":"DE-FBA费用",
        "de_lowest_profit":"DE-MFN最低毛利率",
        "de_mfn_shipment_fee":"DE-MFN运费",
        "de_prime_discount_price":"de_prime_discount_price",
        "discount_end":"折扣结束时间",
        "discount_percent":"折扣百分比",
        "discount_start":"折扣开始时间",
        "dollar_to_cn":"美金对人民币汇率",
        "ero_to_cn":"欧元对人民币汇率",
        "es_fba_fee":"ES-FBA费用",
        "es_float_price":"ES站点浮动值",
        "es_mfn_shipment_fee":"ES-MFN运费",
        "float_platform":"平台",
        "float_price":"float_price",
        "fr_cd_fbc_fee":"fr_cd_fbc_fee",
        "fr_cd_fbc_price":"fr_cd_fbc_price",
        "fr_cd_mfn_price":"fr_cd_mfn_price",
        "fr_fba_fee":"FR-FBA费用",
        "fr_float_price":"FR站点浮动值",
        "fr_mfn_shipment_fee":"FR-MFN运费",
        "gb_fba_fee":"GB-FBA费用",
        "gb_mfn_shipment_fee":"GB-MFN运费",
        "gb_own_fba_fee":"英国仓发FBA费用",
        "girth":"周长",
        "header_fee":"头程",
        "id":"id",
        "it_fba_fee":"IT-FBA费用",
        "it_float_price":"IT站点浮动值",
        "it_mfn_shipment_fee":"IT-MFN运费",
        "latest_compute_time":"latest_compute_time",
        "lu_mfn_shipment_fee":"LU-MFN运费",
        "money_type":"币种",
        "nl_fba_fee":"NL-FBA费用",
        "nl_float_price":"NL站点浮动值",
        "nl_mfn_shipment_fee":"NL-MFN运费",
        "operator":"运营",
        "other_fee":"杂费",
        "pack_num":"pack_num",
        "pl_fba_fee":"PL-FBA费用",
        "pl_float_price":"PL站点浮动值",
        "pl_mfn_shipment_fee":"PL-MFN运费",
        "refund_tax":"refund_tax",
        "se_fba_fee":"SE-FBA费用",
        "size1":"包装尺寸1",
        "size2":"包装尺寸2",
        "size3":"包装尺寸3",
        "sku":"sku",
        "uk_float_price":"uk_float_price",
        "volume":"体积",
        "at_ae_lowest_price":"AT-速卖通最低定价",
        "be_ae_lowest_price":"BE-速卖通最低定价",
        "de_ae_lowest_price":"DE-速卖通最低定价",
        "de_b2c_lowest_price":"DE-B2C最低定价",
        "de_fba_lowest_price":"DE-FBA最低定价",
        "de_mfn_lowest_price":"DE-MFN最低定价",
        "de_prime_fee":"DE-Prime折扣定价",
        "de_prime_normal_price":"DE-Prime正常定价",
        "es_ae_lowest_price":"ES-速卖通最低定价",
        "es_b2c_lowest_price":"ES-B2C最低定价",
        "es_fba_lowest_price":"ES-FBA最低定价",
        "es_mfn_lowest_price":"ES-MFN最低定价",
        "fr_ae_lowest_price":"FR-速卖通最低定价",
        "fr_b2c_lowest_price":"FR-B2C最低定价",
        "fr_cd_fbc_price":"FR-CD-FBC最低定价",
        "fr_cd_mfn_price":"FR-CD-MFN最低定价",
        "fr_fba_lowest_price":"FR-FBA最低定价",
        "fr_mfn_lowest_price":"FR-最低定价",
        "gb_ae_lowest_price":"GB-速卖通最低定价",
        "gb_b2c_lowest_price":"GB-B2C最低定价",
        "gb_own_ae_lowest_price":"GB英仓速卖通最低定价",
        "gb_own_fba_lowest_price":"英国仓发FBA最低定价",
        "gb_own_lowest_price":"GB-英仓最低定价",
        "it_ae_lowest_price":"IT-速卖通最低定价",
        "it_b2c_lowest_price":"IT-B2C最低定价",
        "it_fba_lowest_price":"IT-FBA最低定价",
        "it_mfn_lowest_price":"IT-MFN最低定价",
        "lu_ae_lowest_price":"LU-速卖通最低定价",
        "nl_b2c_lowest_price":"NL-B2C最低定价",
        "nl_fba_lowest_price":"NL-FBA最低定价",
        "nl_mfn_lowest_price":"NL-MFN最低定价",
        "pl_fba_lowest_price":"PL-FBA最低定价",
        "pl_mfn_lowest_price":"PL-MFN最低定价",
        "se_fba_lowest_price":"SE-FBA最低定价"
    },
    "action":{
        "edit":"编辑",
        "cancel":"取消",
        "more":"更多操作",
        "action":"Action",
        "add":"新增",
        "export":"导出",
        "save":"保存",
        "pre_check":"预调价",
        "deal_update_for_check":"处理更新核价(update)",
        "deal_new":"处理新加核价(new)",
        "deal_allnew":"处理新加数据获取核价(allnew)",
        "flag_to_update":"标注为update",
        "flag_to_new":"标注为new",
        "flag_to_allnew":"标注为allnew",
        "recheck_for_ship":"物流费用变动后一键重新核价",
        "recheck_for_sku":"插入相同通用货号基础产品核价",
        "recheck_for_update":"一键更新相同通用货号核价数据"
    },
    "delete":"是否确认删除?",
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "delete_success":"删除成功",
    "please_choose":"请选择",
    "sku":"产品SKU",
    "check_type":"核价类型",
    "memo":"备注",
    "check_date":"核价时间",
    "approve_state":"审核状况",
    "actions":"操作",
    "view":"查看"
  }
}
</i18n>
