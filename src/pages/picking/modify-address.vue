<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template v-if="picking_id_list.length">
            <div style="text-align:center">
                <!-- <a-progress
                    :percent="((index + 1) / picking_id_list.length) * 100"
                /> -->
                <a-button
                    @click="
                        index =
                            index <= 0 ? picking_id_list.length - 1 : index - 1
                    "
                    >上一个
                </a-button>
                <span
                    style="font-size:15px;margin-left:10px;margin-right:10px"
                    >{{ index + 1 + '/' + picking_id_list.length }}</span
                >
                <a-button
                    :disabled="index >= picking_id_list.length"
                    @click="index = (index + 1) % picking_id_list.length"
                    >下一个
                </a-button>
                <span style="font-size:18px">{{
                    ' Picking ID:' + picking_id_list[index]
                }}</span>
            </div>
        </template>
        <a-card>
            <PickingDetailMulti
                :detail="detailInfo"
                :id="parseInt(picking_id)"
                :cnt="changeCnt"
                :countryList="countryList"
                :systemUsers="systemUsers"
            >
            </PickingDetailMulti>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import PageContainer from '../../shared/components/page-container.vue'
import { RequestParams } from '~/core/http'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { PickingService } from '~/services/picking.service'
import { CountryService } from '~/services/country.service'
import PickingDetailMulti from '~/components/picking/picking-detail-multi.vue'
import { CommonService } from '../../shared/utils/common.service'
import { Mutation, namespace } from 'vuex-class'
import { mapState } from 'vuex'
import router from '../../router'
import { SellerInstanceService } from '../../services/seller-instance.service'

const userModule = namespace('userModule')
const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'modify-address'
})
@Component({
    components: {
        PickingDetailMulti
    }
})
export default class ModifyAddress extends Vue {
    // Loading服务
    private loadingService = new LoadingService()

    private countryService = new CountryService()

    private pickingService = new PickingService()

    private detailInfo: any = null

    private picking_id: any = null

    private changeCnt: any = 0

    // 详情项
    private current: any = null

    //上一个详情项
    private lastInfo: any = null

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @datasModule.State
    private countryList

    @datasModule.Action
    private getcountry

    private picking_id_list: any = []
    private dataLoading: Boolean = true
    private index: any = null

    private created() {
        this.getcountry()
        this.getSystemuser()
        this.OnPickingList()
    }

    // private loadingState = false
    // private loadingMask = false

    // mounted() {
    //     LoadingService.loadingStatus.subscribe(({ state, mask }) => {
    //         this.loadingState = state
    //         this.loadingMask = mask
    //         this.dataLoading = state || mask
    //     })
    // }

    @Watch('$route.params.pickingList')
    OnPickingList() {
        if (this.$route.params.pickingList) {
            this.picking_id_list = JSON.parse(this.$route.params.pickingList)
        }
        this.picking_id = this.picking_id_list[0]
        this.index = 0
    }

    @Watch('index')
    OnPickingId() {
        this.picking_id = this.picking_id_list[this.index]
        this.onDetail()
    }

    private onDetail() {
        this.dataLoading = true
        this.pickingService
            .queryDetail(
                new RequestParams(
                    { picking_id: this.picking_id },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    data[0]['id'] = this.picking_id
                    this.detailInfo = data[0]
                    this.$nextTick(() => {
                        this.dataLoading = false
                    })
                },
                err => {
                    this.$message.error(err.message)
                    this.$nextTick(() => {
                        this.dataLoading = false
                    })
                }
            )
    }
}
</script>

<style lang="less" scoped>
.batch_btn {
    margin-left: 25px;
}
</style>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "reference": "Reference",
            "partner_name": "Partner",
            "company": "Name2/Company",
            "country": "Country",
            "city": "City",
            "zip": "Zip",
            "street": "Street",
            "street2": "Street2",
            "nr_1": "Nr.",
            "phone": "Phone",
            "email": "Email",
            "validate_s": "Validate State",
            "validate_err": "Error Text",
            "operate": " "
        },
        "action": {
            "validate": "Validate",
            "cancel": "Cancel",
            "save": "Save",
            "map": "Google Map"
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "yes": "Yes",
        "no": "No"
    },
    "zh-cn": {
        "desc": "",
        "columns": {
            "reference": "参考号",
            "partner_name": "客 户",
            "company": "公司",
            "country": "国家",
            "city": "城市",
            "zip": "邮编",
            "street": "街道1",
            "street2": "街道2",
            "nr_1": "门牌号",
            "phone": "手机",
            "email": "邮箱",
            "validate_s": "有效状态",
            "validate_err": "验证错误原因",
            "operate": " "
        },
        "action": {
            "validate": "验证",
            "cancel": "取消",
            "save": "保存",
            "map": "谷歌地图"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "yes": "是",
        "no": "否"
    }
}
</i18n>
