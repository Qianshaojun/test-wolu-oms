import { Component, Ref, Vue, Watch } from 'vue-property-decorator'
import { PageService } from '@/bootstrap/services/page.service'
import { namespace } from 'vuex-class'

const datasModule = namespace('datasModule')

@Component
export default class CPStatisticsHandleMixin extends Vue {
    @datasModule.State
    private vendorFullNameList

    public getVendorName(val) {
        let ret: any = val
        let item = this.vendorFullNameList.find(x => x.code == val)
        if (item) {
            ret = item.name
        }
        return ret
    }

    @Watch('$app.state.locale')
    private onLocaleChange(val) {
        if (val === 'zh-cn') {
            for (let i = 0; i < (this as any).ownAllNameAuth.length; i++) {
                for (let j = 0; j < (this as any).ownColumnList.length; j++) {
                    if (
                        (this as any).ownColumnList[j].dataIndex ===
                        (this as any).ownAllNameAuth[i].column_name
                    ) {
                        ;(this as any).ownColumnList[
                            j
                        ].title = (this as any).ownAllNameAuth[
                            i
                        ].display_name_chn
                    }
                }
            }
        } else {
            for (let i = 0; i < (this as any).ownAllNameAuth.length; i++) {
                for (let j = 0; j < (this as any).ownColumnList.length; j++) {
                    if (
                        (this as any).ownColumnList[j].dataIndex ===
                        (this as any).ownAllNameAuth[i].column_name
                    ) {
                        ;(this as any).ownColumnList[
                            j
                        ].title = (this as any).ownAllNameAuth[
                            i
                        ].display_name_eng
                    }
                }
            }
        }
    }

    // public ownColumnList: any = []
    // public ownAllNameAuth: any = []

    public updated() {
        //重新计算autoFlex页面高度
        let height: number = 0
        let pageHeaderHeight: number = 0
        const dataForm = document.querySelector('.data-form') as HTMLElement //dataForm 区域
        const autoFlex = document.querySelector('.autoFlex') as HTMLElement //设置了autoFlex类名的区域
        const pageHeader = document.querySelector('.page-header') as HTMLElement //头部标题区域
        const cardTabsDom = document.querySelector('.cardTabs') as HTMLElement //中间tabs高度
        const tableDom = document.querySelector(
            '.ant-table-body'
        ) as HTMLElement
        if (pageHeader) {
            pageHeaderHeight = pageHeader.clientHeight
        }
        if (dataForm && autoFlex) {
            height =
                document.documentElement.clientHeight -
                dataForm.clientHeight -
                pageHeaderHeight -
                80
            if (cardTabsDom) {
                height -= 28
            }
            autoFlex.style.height = height + 'px'
            if (tableDom) {
                tableDom.style.maxHeight = autoFlex.clientHeight - 120 + 'px'
            }
        }
    }

    /**
     * 处理不同tab显示的不同表格列
     */
    public tempHandleColumnList(list, tabType) {
        let _titleEnum: any = {} //自定义的列名枚举
        let result: any = []
        let arr: any = JSON.parse(JSON.stringify(list))
        arr.forEach(v => {
            if (v.column_name) {
                v.tempColumnName = v.column_name.substring(
                    v.column_name.lastIndexOf('_') + 1
                )
            } else {
                v.tempColumnName = v.key.substring(v.key.lastIndexOf('_') + 1)
            }

            if (tabType === 'total_cp') {
                if (v.tempColumnName === 'total') {
                    result.push(v)
                }
            }
            if (tabType === 'warehouse_rt_cp') {
                if (v.tempColumnName === 'wwarehouse') {
                    _titleEnum = {
                        rate1_wwarehouse:
                            'SS-Falsches Logistikfahrzeug 放错物流车投诉率',
                        rate2_wwarehouse:
                            'FE-Briefmarkenichtausreichend 少贴邮票投诉率',
                        rate3_wwarehouse: 'FL-Falsche Lieferung 发错货投诉率',
                        rate4_wwarehouse: 'ZW-Zu Wenig Verschickt 少发货投诉率',
                        rate1_yoy_wwarehouse:
                            'SS-Falsches Logistikfahrzeug 放错物流车投诉率同比',
                        rate1_mom_wwarehouse:
                            'SS-Falsches Logistikfahrzeug 放错物流车投诉率环比',
                        rate2_yoy_wwarehouse:
                            'FE-Briefmarkenichtausreichend 少贴邮票投诉率同比',
                        rate2_mom_wwarehouse:
                            'FE-Briefmarkenichtausreichend 少贴邮票投诉率环比',
                        rate3_yoy_wwarehouse:
                            'FL-Falsche Lieferung 发错货投诉率同比',
                        rate3_mom_wwarehouse:
                            'FL-Falsche Lieferung 发错货投诉率环比',
                        rate4_yoy_wwarehouse:
                            'ZW-Zu Wenig Verschickt 少发货投诉率同比',
                        rate4_mom_wwarehouse:
                            'ZW-Zu Wenig Verschickt 少发货投诉率环比'
                    }
                    result.push(v)
                }
            }
            if (tabType === 'return_cp') {
                if (v.tempColumnName === 'wreturnreason') {
                    _titleEnum = {
                        rate1_wreturnreason:
                            'AA3-Adresse falsch 地址,邮编错误/门牌号没这个名字投诉率',
                        rate1_yoy_wreturnreason:
                            'AA3-Adresse falsch 地址,邮编错误/门牌号没这个名字投诉率同比',
                        rate1_mom_wreturnreason:
                            'AA3-Adresse falsch 地址,邮编错误/门牌号没这个名字投诉率环比',
                        rate2_wreturnreason:
                            'AA4-nicht Abholung 长时间未取包裹投诉率',
                        rate2_yoy_wreturnreason:
                            'AA4-nicht Abholung 长时间未取包裹投诉率同比',
                        rate2_mom_wreturnreason:
                            'AA4-nicht Abholung 长时间未取包裹投诉率环比',
                        rate3_wreturnreason:
                            'AA5-Annahme verweigern 拒收包裹投诉率',
                        rate3_yoy_wreturnreason:
                            'AA5-Annahme verweigern 拒收包裹投诉率同比',
                        rate3_mom_wreturnreason:
                            'AA5-Annahme verweigern 拒收包裹投诉率环比',
                        rate4_wreturnreason:
                            'LP-Logistisch Problem 物流原因退货投诉率',
                        rate4_yoy_wreturnreason:
                            'LP-Logistisch Problem 物流原因退货投诉率同比',
                        rate4_mom_wreturnreason:
                            'LP-Logistisch Problem 物流原因退货投诉率环比',
                        rate5_wreturnreason:
                            'LK-Transportschaden 物流公司损坏商品投诉率',
                        rate5_yoy_wreturnreason:
                            'LK-Transportschaden 物流公司损坏商品投诉率同比',
                        rate5_mom_wreturnreason:
                            'LK-Transportschaden 物流公司损坏商品投诉率环比',
                        rate6_wreturnreason: 'KG-Kunden grund 客人原因投诉率',
                        rate6_yoy_wreturnreason:
                            'KG-Kunden grund 客人原因投诉率同比',
                        rate6_mom_wreturnreason:
                            'KG-Kunden grund 客人原因投诉率环比'
                    }
                    result.push(v)
                }
            }
            if (tabType === 'product_cp') {
                if (v.tempColumnName === 'saletag') {
                    _titleEnum = {
                        rate1_saletag: 'B-WARE 收到二手退货产品投诉率',
                        rate1_yoy_saletag: 'B-WARE 收到二手退货产品投诉率同比',
                        rate1_mom_saletag: 'B-WARE 收到二手退货产品投诉率环比',
                        rate2_saletag:
                            'AR01-große Beschädigung 大面积破损投诉率',
                        rate2_yoy_saletag:
                            'AR01-große Beschädigung 大面积破损投诉率同比',
                        rate2_mom_saletag:
                            'AR01-große Beschädigung 大面积破损投诉率环比',
                        rate3_saletag: 'AR02-kleine Macke小瑕疵/破损投诉率',
                        rate3_yoy_saletag:
                            'AR02-kleine Macke小瑕疵/破损投诉率同比',
                        rate3_mom_saletag:
                            'AR02-kleine Macke小瑕疵/破损投诉率环比',
                        rate4_saletag: 'AR03-Geruch有气味投诉率',
                        rate4_yoy_saletag: 'AR03-Geruch有气味投诉率同比',
                        rate4_mom_saletag: 'AR03-Geruch有气味投诉率环比',
                        rate5_saletag:
                            'AR07-Funktion beeinträchtigt 功能受损不能用投诉率',
                        rate5_yoy_saletag:
                            'AR07-Funktion beeinträchtigt 功能受损不能用投诉率同比',
                        rate5_mom_saletag:
                            'AR07-Funktion beeinträchtigt 功能受损不能用投诉率环比',
                        rate6_saletag: 'PN-Passt nicht 不适合投诉率',
                        rate6_yoy_saletag: 'PN-Passt nicht 不适合投诉率同比',
                        rate6_mom_saletag: 'PN-Passt nicht 不适合投诉率环比',
                        rate7_saletag:
                            'AN-Artikeln nicht wie angegeben 产品与描述不符投诉率',
                        rate7_yoy_saletag:
                            'AN-Artikeln nicht wie angegeben 产品与描述不符投诉率同比',
                        rate7_mom_saletag:
                            'AN-Artikeln nicht wie angegeben 产品与描述不符投诉率环比',
                        rate8_saletag:
                            'IU-Inkompatibel oder ungeeignet 与客人家居不匹配投诉率',
                        rate8_yoy_saletag:
                            'IU-Inkompatibel oder ungeeignet 与客人家居不匹配投诉率同比',
                        rate8_mom_saletag:
                            'IU-Inkompatibel oder ungeeignet 与客人家居不匹配投诉率环比',
                        rate9_saletag:
                            'LQ-Leistung oder Qualität ungenügend 质量不好投诉率',
                        rate9_yoy_saletag:
                            'LQ-Leistung oder Qualität ungenügend 质量不好投诉率同比',
                        rate9_mom_saletag:
                            'LQ-Leistung oder Qualität ungenügend 质量不好投诉率环比',
                        rate10_saletag: 'ZW-Zu Wenig Verschickt 少发货投诉率',
                        rate10_yoy_saletag:
                            'ZW-Zu Wenig Verschickt 少发货投诉率同比',
                        rate10_mom_saletag:
                            'ZW-Zu Wenig Verschickt 少发货投诉率环比',
                        rate11_saletag:
                            'FP-von Produktion falsch gepackt工厂包错投诉率',
                        rate11_yoy_saletag:
                            'FP-von Produktion falsch gepackt工厂包错投诉率同比',
                        rate11_mom_saletag:
                            'FP-von Produktion falsch gepackt工厂包错投诉率环比',
                        rate12_saletag: 'OI-Oder ID 批次问题投诉率',
                        rate12_yoy_saletag: 'OI-Oder ID 批次问题投诉率同比',
                        rate12_mom_saletag: 'OI-Oder ID 批次问题投诉率环比'
                    }
                    result.push(v)
                }
            }
            if (tabType === 'logistics_cp') {
                if (v.tempColumnName === 'logistic') {
                    _titleEnum = {
                        rate1_logistic: 'Stop 20%投诉率',
                        rate1_yoy_logistic: 'Stop 20%投诉率同比',
                        rate1_mom_logistic: 'Stop 20%投诉率环比',
                        rate2_logistic: 'Stop 40%投诉率',
                        rate2_yoy_logistic: 'Stop 40%投诉率同比',
                        rate2_mom_logistic: 'Stop 40%投诉率环比',
                        rate3_logistic: 'Stop 60%投诉率',
                        rate3_yoy_logistic: 'Stop 60%投诉率同比',
                        rate3_mom_logistic: 'Stop 60%投诉率环比',
                        rate4_logistic: 'Stop 80%投诉率',
                        rate4_yoy_logistic: 'Stop 80%投诉率同比',
                        rate4_mom_logistic: 'Stop 80%投诉率环比',
                        rate5_logistic:
                            'AA3-Adresse falsch 地址,邮编错误/门牌号没这个名字投诉率',
                        rate5_yoy_logistic:
                            'AA3-Adresse falsch 地址,邮编错误/门牌号没这个名字投诉率同比',
                        rate5_mom_logistic:
                            'AA3-Adresse falsch 地址,邮编错误/门牌号没这个名字投诉率环比',
                        rate6_logistic:
                            'AA4-nicht Abholung 长时间未取包裹投诉率',
                        rate6_yoy_logistic:
                            'AA4-nicht Abholung 长时间未取包裹投诉率同比',
                        rate6_mom_logistic:
                            'AA4-nicht Abholung 长时间未取包裹投诉率环比',
                        rate7_logistic: 'AA5-Annahme verweigern 拒收包裹投诉率',
                        rate7_yoy_logistic:
                            'AA5-Annahme verweigern 拒收包裹投诉率同比',
                        rate7_mom_logistic:
                            'AA5-Annahme verweigern 拒收包裹投诉率环比',
                        rate8_logistic:
                            'LP-Logistisch Problem 物流原因包裹滞留或者退货投诉率',
                        rate8_yoy_logistic:
                            'LP-Logistisch Problem 物流原因包裹滞留或者退货投诉率同比',
                        rate8_mom_logistic:
                            'LP-Logistisch Problem 物流原因包裹滞留或者退货投诉率环比',
                        rate9_logistic:
                            'LK-Transportschaden 物流公司损坏商品投诉率',
                        rate9_yoy_logistic:
                            'LK-Transportschaden 物流公司损坏商品投诉率同比',
                        rate9_mom_logistic:
                            'LK-Transportschaden 物流公司损坏商品投诉率环比',
                        rate10_logistic:
                            'NE-Nicht erhalten 签收证明错误/没收到货投诉率',
                        rate10_yoy_logistic:
                            'NE-Nicht erhalten 签收证明错误/没收到货投诉率同比',
                        rate10_mom_logistic:
                            'NE-Nicht erhalten 签收证明错误/没收到货投诉率环比',
                        rate11_logistic: 'COVID-19-2020投诉率',
                        rate11_yoy_logistic: 'COVID-19-2020投诉率同比',
                        rate11_mom_logistic: 'COVID-19-2020投诉率环比'
                    }
                    result.push(v)
                }
            }
            if (tabType === 'customer_cp') {
                if (v.tempColumnName === 'customer') {
                    _titleEnum = {
                        rate1_customer: 'FK-Falsch gekauft 客人买错投诉率',
                        rate1_yoy_customer:
                            'FK-Falsch gekauft 客人买错投诉率同比',
                        rate1_mom_customer:
                            'FK-Falsch gekauft 客人买错投诉率环比',
                        rate2_customer:
                            'ST-Storno vor Sendung 发货前取消投诉率',
                        rate2_yoy_customer:
                            'ST-Storno vor Sendung 发货前取消投诉率同比',
                        rate2_mom_customer:
                            'ST-Storno vor Sendung 发货前取消投诉率环比',
                        rate3_customer: 'GN-Gefällt nicht 客人不喜欢投诉率',
                        rate3_yoy_customer:
                            'GN-Gefällt nicht 客人不喜欢投诉率同比',
                        rate3_mom_customer:
                            'GN-Gefällt nicht 客人不喜欢投诉率环比',
                        rate4_customer: 'KG-Kein Grund 无理由退货投诉率',
                        rate4_yoy_customer:
                            'KG-Kein Grund 无理由退货投诉率同比',
                        rate4_mom_customer:
                            'KG-Kein Grund 无理由退货投诉率环比',
                        rate5_customer: 'VK-Versandkosten 运费投诉率',
                        rate5_yoy_customer: 'VK-Versandkosten 运费投诉率同比',
                        rate5_mom_customer: 'VK-Versandkosten 运费投诉率环比',
                        rate6_customer: 'PR-Prime 亚马逊特快订单投诉率',
                        rate6_yoy_customer: 'PR-Prime 亚马逊特快订单投诉率同比',
                        rate6_mom_customer: 'PR-Prime 亚马逊特快订单投诉率环比',
                        rate7_customer:
                            'MWST/VAT-Mehrwertsteuer GS退增值税投诉率',
                        rate7_yoy_customer:
                            'MWST/VAT-Mehrwertsteuer GS退增值税投诉率同比',
                        rate7_mom_customer:
                            'MWST/VAT-Mehrwertsteuer GS退增值税投诉率环比',
                        rate8_customer:
                            'KL1-kulanz Retourkosten von Kunde GS额外客人自费退运费赔偿投诉率',
                        rate8_yoy_customer:
                            'KL1-kulanz Retourkosten von Kunde GS额外客人自费退运费赔偿投诉率同比',
                        rate8_mom_customer:
                            'KL1-kulanz Retourkosten von Kunde GS额外客人自费退运费赔偿投诉率环比',
                        rate9_customer:
                            'KL2-kulanz Schadensersatz GS超订单金额额外赔偿投诉率',
                        rate9_yoy_customer:
                            'KL2-kulanz Schadensersatz GS超订单金额额外赔偿投诉率同比',
                        rate9_mom_customer:
                            'KL2-kulanz Schadensersatz GS超订单金额额外赔偿投诉率环比',
                        rate10_customer: 'DZ-Doppelzahlung客人重复误付款投诉率',
                        rate10_yoy_customer:
                            'DZ-Doppelzahlung客人重复误付款投诉率同比',
                        rate10_mom_customer:
                            'DZ-Doppelzahlung客人重复误付款投诉率环比',
                        rate11_customer:
                            'CWA-Wrong Address客户给的地址错误投诉率',
                        rate11_yoy_customer:
                            'CWA-Wrong Address客户给的地址错误投诉率同比',
                        rate11_mom_customer:
                            'CWA-Wrong Address客户给的地址错误投诉率环比'
                    }
                    result.push(v)
                }
            }
            if (tabType === 'warehouse_cs_cp') {
                if (v.tempColumnName === 'warehouse') {
                    _titleEnum = {
                        rate1_warehouse:
                            'SS-Falsches Logistikfahrzeug 放错物流车投诉率',
                        rate1_yoy_warehouse:
                            'SS-Falsches Logistikfahrzeug 放错物流车投诉率同比',
                        rate1_mom_warehouse:
                            'SS-Falsches Logistikfahrzeug 放错物流车投诉率环比',
                        rate2_warehouse:
                            'FE-Briefmarkenichtausreichend 少贴邮票投诉率',
                        rate2_yoy_warehouse:
                            'FE-Briefmarkenichtausreichend 少贴邮票投诉率同比',
                        rate2_mom_warehouse:
                            'FE-Briefmarkenichtausreichend 少贴邮票投诉率环比',
                        rate3_warehouse:
                            'FL-Falsche Lieferung vom Lagerpersonal 仓库发错货投诉率',
                        rate3_yoy_warehouse:
                            'FL-Falsche Lieferung vom Lagerpersonal 仓库发错货投诉率同比',
                        rate3_mom_warehouse:
                            'FL-Falsche Lieferung vom Lagerpersonal 仓库发错货投诉率环比',
                        rate4_warehouse:
                            'FL1-Falsche Lieferung wegen div. Anleitung说明书错误发错货投诉率',
                        rate4_yoy_warehouse:
                            'FL1-Falsche Lieferung wegen div. Anleitung说明书错误发错货投诉率同比',
                        rate4_mom_warehouse:
                            'FL1-Falsche Lieferung wegen div. Anleitung说明书错误发错货投诉率环比',
                        rate5_warehouse:
                            'FL2-Falsche Lieferung wegen div. PO/Produktion多批次号发错货投诉率',
                        rate5_yoy_warehouse:
                            'FL2-Falsche Lieferung wegen div. PO/Produktion多批次号发错货投诉率同比',
                        rate5_mom_warehouse:
                            'FL2-Falsche Lieferung wegen div. PO/Produktion多批次号发错货投诉率环比',
                        rate6_warehouse:
                            'FL3-Falsche Lieferung wegen Farbabweichung色差发错货投诉率',
                        rate6_yoy_warehouse:
                            'FL3-Falsche Lieferung wegen Farbabweichung色差发错货投诉率同比',
                        rate6_mom_warehouse:
                            'FL3-Falsche Lieferung wegen Farbabweichung色差发错货投诉率环比',
                        rate7_warehouse: 'AV-Ausverkauft 卖超投诉率',
                        rate7_yoy_warehouse: 'AV-Ausverkauft 卖超投诉率同比',
                        rate7_mom_warehouse: 'AV-Ausverkauft 卖超投诉率环比',
                        rate8_warehouse: 'VVK-Vorverkauf 预售投诉率',
                        rate8_yoy_warehouse: 'VVK-Vorverkauf 预售投诉率同比',
                        rate8_mom_warehouse: 'VVK-Vorverkauf 预售投诉率环比',
                        rate9_warehouse: 'DL-Doppellieferung重复发货投诉率',
                        rate9_yoy_warehouse:
                            'DL-Doppellieferung重复发货投诉率同比',
                        rate9_mom_warehouse:
                            'DL-Doppellieferung重复发货投诉率环比',
                        rate10_warehouse:
                            'ZWV-zu wenig verschickt仓库少发投诉率',
                        rate10_yoy_warehouse:
                            'ZWV-zu wenig verschickt仓库少发投诉率同比',
                        rate10_mom_warehouse:
                            'ZWV-zu wenig verschickt仓库少发投诉率环比'
                    }
                    result.push(v)
                }
            }
        })
        result.forEach(v => {
            v.title = _titleEnum[v.dataIndex]
                ? _titleEnum[v.dataIndex]
                : v.title
        })
        return result
    }

    /**
     * 处理不分组表格列
     */
    public handleFormTypeColumnList() {
        let arr: any = []
        //按sku
        if ((this as any).statisticsFormType === 'sku') {
            arr = [
                {
                    title: 'SKU',
                    width: 100,
                    dataIndex: 'sent_sku',
                    scopedSlots: { customRender: 'sent_sku' },
                    align: 'center'
                },
                {
                    title: 'Product Name',
                    width: 100,
                    dataIndex: 'sent_sku_rel_name',
                    scopedSlots: { customRender: 'sent_sku_rel_name' },
                    align: 'center'
                },
                {
                    title: this.$t('main_category'),
                    width: 100,
                    dataIndex: 'sent_sku_z_main_category',
                    scopedSlots: { customRender: 'main_category' },
                    align: 'center'
                },
                {
                    title: this.$t('category'),
                    width: 100,
                    dataIndex: 'sent_sku_z_category',
                    scopedSlots: { customRender: 'category' },
                    align: 'center'
                },
                {
                    title: this.$t('sub_category'),
                    width: 100,
                    dataIndex: 'sent_sku_z_sub_category',
                    scopedSlots: { customRender: 'sub_category' },
                    align: 'center'
                },
                {
                    title: this.$t('vendor_no'),
                    width: 100,
                    dataIndex: 'sent_sku_rel_vendor',
                    scopedSlots: { customRender: 'vendor_no' },
                    align: 'center'
                },
                {
                    title: this.$t('edit_group_sku'),
                    width: 100,
                    dataIndex: 'sent_sku_rel_edit_group',
                    scopedSlots: { customRender: 'edit_group_sku' },
                    align: 'center'
                }
            ]
        }
        //按供应商
        if ((this as any).statisticsFormType === 'vendor') {
            arr = [
                {
                    title: this.$t('vendor_no'),
                    width: 100,
                    dataIndex: 'vendor_id',
                    scopedSlots: { customRender: 'vendor_no' },
                    align: 'center'
                }
            ]
        }
        //按维护组sku
        if ((this as any).statisticsFormType === 'edit_group_sku') {
            arr = [
                {
                    title: this.$t('edit_group_sku'),
                    width: 100,
                    dataIndex: 'edit_group_sku',
                    scopedSlots: { customRender: 'edit_group_sku' },
                    align: 'center'
                },
                {
                    title: 'Product Name',
                    width: 100,
                    dataIndex: 'edit_group_sku_rel_name',
                    scopedSlots: { customRender: 'sent_sku_rel_name' },
                    align: 'center'
                },
                {
                    title: this.$t('main_category'),
                    width: 100,
                    dataIndex: 'edit_group_sku_z_main_category',
                    scopedSlots: { customRender: 'main_category' },
                    align: 'center'
                },
                {
                    title: this.$t('category'),
                    width: 100,
                    dataIndex: 'edit_group_sku_z_category',
                    scopedSlots: { customRender: 'category' },
                    align: 'center'
                },
                {
                    title: this.$t('sub_category'),
                    width: 100,
                    dataIndex: 'edit_group_sku_z_sub_category',
                    scopedSlots: { customRender: 'sub_category' },
                    align: 'center'
                },
                {
                    title: this.$t('vendor_no'),
                    width: 100,
                    dataIndex: 'edit_group_sku_rel_vendor',
                    scopedSlots: { customRender: 'vendor_no' },
                    align: 'center'
                }
            ]
        }
        //按三级分类
        if ((this as any).statisticsFormType === 'sub_category') {
            arr = [
                {
                    title: this.$t('category'),
                    width: 100,
                    dataIndex: 'z_category',
                    scopedSlots: { customRender: 'category' },
                    align: 'center'
                },
                {
                    title: this.$t('sub_category'),
                    width: 100,
                    dataIndex: 'z_sub_category',
                    scopedSlots: { customRender: 'sub_category' },
                    align: 'center'
                }
            ]
        }
        ;(this as any).ownColumnList.unshift(...arr)
        ;(this as any).ownColumnList = this.process(
            (this as any).ownColumnList,
            'dataIndex'
        )
    }

    /**
     * 处理allNameAuth
     */
    public handleAllNameAuthList() {
        let arr: any = []
        //按sku
        if ((this as any).statisticsFormType === 'sku') {
            arr = [
                {
                    display_name_chn: 'SKU',
                    display_name_eng: 'SKU',
                    width: 100,
                    column_name: 'sent_sku',
                    scoped_slot_name: 'sent_sku',
                    align: 'center'
                },
                {
                    display_name_chn: 'Product Name',
                    display_name_eng: 'Product Name',
                    width: 100,
                    column_name: 'sent_sku_rel_name',
                    scoped_slot_name: 'sent_sku_rel_name',
                    align: 'center'
                },
                {
                    display_name_chn: '一级分类',
                    display_name_eng: 'Main Category',
                    width: 100,
                    column_name: 'sent_sku_z_main_category',
                    scoped_slot_name: 'main_category',
                    align: 'center'
                },
                {
                    display_name_chn: '二级分类',
                    display_name_eng: 'Category',
                    width: 100,
                    column_name: 'sent_sku_z_category',
                    scoped_slot_name: 'category',
                    align: 'center'
                },
                {
                    display_name_chn: '三级分类',
                    display_name_eng: 'Sub Category',
                    width: 100,
                    column_name: 'sent_sku_z_sub_category',
                    scoped_slot_name: 'sub_category',
                    align: 'center'
                },
                {
                    display_name_chn: '供应商编码',
                    display_name_eng: 'Vendor No',
                    width: 100,
                    column_name: 'sent_sku_rel_vendor',
                    scoped_slot_name: 'vendor_no',
                    align: 'center'
                },
                {
                    display_name_chn: '维护组SKU',
                    display_name_eng: 'Edit Group SKU',
                    width: 100,
                    column_name: 'sent_sku_rel_edit_group',
                    scoped_slot_name: 'edit_group_sku',
                    align: 'center'
                }
            ]
        }
        //按供应商
        if ((this as any).statisticsFormType === 'vendor') {
            arr = [
                {
                    display_name_chn: '供应商编码',
                    display_name_eng: 'Vendor No',
                    width: 100,
                    column_name: 'vendor_id',
                    scoped_slot_name: 'vendor_no',
                    align: 'center'
                }
            ]
        }
        //按维护组sku
        if ((this as any).statisticsFormType === 'edit_group_sku') {
            arr = [
                {
                    display_name_chn: '维护组SKU',
                    display_name_eng: 'Edit Group SKU',
                    width: 100,
                    column_name: 'edit_group_sku',
                    scoped_slot_name: 'edit_group_sku',
                    align: 'center'
                },
                {
                    display_name_chn: 'Product Name',
                    display_name_eng: 'Product Name',
                    width: 100,
                    column_name: 'edit_group_sku_rel_name',
                    scoped_slot_name: 'sent_sku_rel_name',
                    align: 'center'
                },
                {
                    display_name_chn: '一级分类',
                    display_name_eng: 'Main Category',
                    width: 100,
                    column_name: 'edit_group_sku_z_main_category',
                    scoped_slot_name: 'main_category',
                    align: 'center'
                },
                {
                    display_name_chn: '二级分类',
                    display_name_eng: 'Category',
                    width: 100,
                    column_name: 'edit_group_sku_z_category',
                    scoped_slot_name: 'category',
                    align: 'center'
                },
                {
                    display_name_chn: '三级分类',
                    display_name_eng: 'Sub Category',
                    width: 100,
                    column_name: 'edit_group_sku_z_sub_category',
                    scoped_slot_name: 'sub_category',
                    align: 'center'
                },
                {
                    display_name_chn: '供应商编码',
                    display_name_eng: 'Vendor No',
                    width: 100,
                    column_name: 'edit_group_sku_rel_vendor',
                    scoped_slot_name: 'vendor_no',
                    align: 'center'
                }
            ]
        }
        //按三级分类
        if ((this as any).statisticsFormType === 'sub_category') {
            arr = [
                {
                    display_name_chn: '二级分类',
                    display_name_eng: 'Category',
                    width: 100,
                    column_name: 'z_category',
                    scoped_slot_name: 'category',
                    align: 'center'
                },
                {
                    display_name_chn: '三级分类',
                    display_name_eng: 'Sub Category',
                    width: 100,
                    column_name: 'z_sub_category',
                    scoped_slot_name: 'sub_category',
                    align: 'center'
                }
            ]
        }
        ;(this as any).ownAllNameAuth.unshift(...arr)
        ;(this as any).ownAllNameAuth = this.process(
            (this as any).ownAllNameAuth,
            'column_name'
        )
    }

    /**
     * 去重
     */
    private process(arr, key?) {
        const cache: any = []
        if (key) {
            for (const t of arr) {
                if (cache.find((c: any) => c[key] === t[key])) {
                    continue
                }
                cache.push(t)
            }
        } else {
            for (let index = 0; index < arr.length; index++) {
                if (cache.indexOf(arr[index]) === -1) {
                    cache.push(arr[index])
                }
            }
        }
        return cache
    }

    private pageService = new PageService()

    /**
     * 清除表格data
     */
    clearData() {
        ;(this as any).data = []
        this.pageService.total = 0
        this.pageService.pageSize = 100
        this.pageService.pageIndex = 1
    }
}
