<template>
    <section class="component customer-detail">
        <a-tabs
            defaultActiveKey="base"
            v-model="activeKey"
            @change="e => paneChange(e)"
        >
            <a-tab-pane :tab="$t('columns.instance_info')" key="base">
                <!-- <h3 style="width:100%;border-bottom: 1px solid #ccc;">
                    入库单详情：
                </h3>-->
                <label-container :column="3">
                    <a-row>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                :label="$t('columns.instance_code')"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ instance.instance_code }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                :label="$t('columns.instance_name')"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ instance.instance_name }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                :label="$t('columns.instance_full_name')"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ instance.instance_full_name }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                :label="$t('columns.who_responsible')"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{
                                    searchUserName(instance.who_responsible)
                                }}</label-item
                            >
                        </a-col>
                        <!-- <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                label="f0"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                            >
                                {{ instance.f0 }}
                            </label-item>
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                label="f1"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ instance.f1 }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                label="f2"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ instance.f2 }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                label="f3"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ instance.f3 }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                label="f4"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ instance.f4 }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                label="f5"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ instance.f5 }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                label="f6"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ instance.f6 }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                label="f7"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ instance.f7 }}</label-item
                            >
                        </a-col>-->
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item :label="$t('columns.status')">
                                {{
                                    instance.status
                                        | dict('SellerInstanceStatus')
                                        | translate
                                }}
                            </label-item>
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                label="memo"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ instance.memo }}</label-item
                            >
                        </a-col>
                    </a-row>
                </label-container>
            </a-tab-pane>

            <a-tab-pane :tab="$t('columns.seller_info')" key="seller">
                <label-container :column="3">
                    <a-row>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                :label="$t('columns.seller_code')"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ seller.seller_code }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                :label="$t('columns.seller_name')"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ seller.seller_name }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                :label="$t('columns.seller_full_name')"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ seller.seller_full_name }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                :label="$t('columns.platform')"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ seller.platform }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                label="Url"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ seller.seller_url }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                :label="$t('columns.who_responsible')"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                            >
                                {{ searchUserName(seller.who_responsible) }}
                            </label-item>
                        </a-col>
                        <!-- <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                label="f0"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ seller.ref_no }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                label="f1"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ seller.f1 }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                label="f2"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ seller.f2 }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                label="f3"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ seller.f3 }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                label="f4"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ seller.f4 }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                label="f5"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ seller.f5 }}</label-item
                            >
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item label="f6">{{ seller.f6 }}</label-item>
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                label="f7"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ seller.f7 }}</label-item
                            >
                        </a-col>-->
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item :label="$t('columns.status')">
                                {{
                                    seller.status
                                        | dict('SellerInstanceStatus')
                                        | translate
                                }}
                            </label-item>
                        </a-col>
                        <a-col :span="8" :style="{ height: '30px' }">
                            <label-item
                                label="memo"
                                :style="{
                                    width: '100%',
                                    'max-width': '100% !important'
                                }"
                                >{{ seller.memo }}</label-item
                            >
                        </a-col>
                    </a-row>
                </label-container>
            </a-tab-pane>
            <a-tab-pane :tab="$t('columns.operate_log')" key="log">
                <a-table
                    :dataSource="logs"
                    :pagination="false"
                    style="table-layout:fixed;max-height:300px;overflow-y:scroll;"
                    rowKey="log_content"
                    bordered
                >
                    <a-table-column
                        :title="$t('columns.log')"
                        key="log_content"
                        data-index="log_content"
                        align="left"
                        width="40%"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.type')"
                        key="log_type"
                        data-index="log_type"
                        align="center"
                        width="15%"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.operate_user')"
                        key="who_log"
                        data-index="who_log"
                        align="center"
                        width="15%"
                    ></a-table-column>
                    <a-table-column
                        :title="$t('columns.date')"
                        key="create_date"
                        align="center"
                        width="20%"
                    >
                        <template slot-scope="row">{{
                            row.create_date | datetolocal
                        }}</template>
                    </a-table-column>
                    <a-table-column
                        title="IP"
                        key="log_ip"
                        data-index="log_ip"
                        align="center"
                    ></a-table-column>
                </a-table>
            </a-tab-pane>
        </a-tabs>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { PageService } from '~/bootstrap/services/page.service'
import { SellerInstanceService } from '../../services/seller-instance.service'
import { OperateLogService } from '../../services/operatelog.service'
import { RequestParams } from '../../core/http'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { CommonService } from '../../shared/utils/common.service'
import { Mutation, namespace } from 'vuex-class'

const allUsersModule = namespace('allUsersModule')

@Component({
    components: {}
})
export default class instanceView extends Vue {
    @Prop()
    instance: any

    @Prop()
    activeFeeTypes: any
    private activeKey: any = 'base'
    // 分页服务
    private pageService = new PageService()
    private sellerInstanceService = new SellerInstanceService()
    private loadingService = new LoadingService()
    private operateLogService = new OperateLogService()
    private logs: any[] = []
    private seller: any[] = []

    @Watch('instance')
    oninstanceChange() {
        this.logs = []
        this.seller = []
        if (this.activeKey == 'log') {
            this.getLogs()
        } else if (this.activeKey == 'seller') {
            this.getSeller()
        }
    }
    private paneChange(key) {
        if (key === 'log' && !this.logs.length) {
            this.getLogs()
        }
        if (key === 'seller' && !this.seller.length) {
            this.getSeller()
        }
    }
    private getLogs() {
        this.operateLogService
            .viewUserOperateChangedLog(
                new RequestParams({
                    record_code: this.instance.instance_code,
                    object_name: 'base_instance_list'
                })
            )
            .subscribe(data => {
                this.logs = data
            })
    }
    private getSeller() {
        var that = this
        let vl = []
        vl['seller_code'] = this.instance.seller_code
        this.sellerInstanceService
            .seller_query_one(
                new RequestParams(
                    {
                        seller_code: this.instance.seller_code
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(data => {
                that.seller = data[0]
            })
    }

    @allUsersModule.State
    private users

    private searchUserName(user_id) {
        if (user_id) {
            return this.users.filter(x => x.code === user_id)[0].name
        } else {
            return ''
        }
    }
}
</script>

<i18n>
{
  "en-us":{
    "base":"Order Info",
    "customer":"Customer Info",
    "product":"Product Info"
  },
  "zh-cn":{
    "base":"产品信息",
    "customer":"客户信息",
    "product":"产品信息"
  }
}
</i18n>
