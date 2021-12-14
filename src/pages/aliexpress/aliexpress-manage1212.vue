<template>
    <page-container ref="pageContainer">
        <data-form
            :extends="extendItems"
            ref="dataForm"
            :column="1"
            :showHeader="false"
        >
            <!--默认查询-->
            <template #default>
                <a-form-item :label="$t('columns.seller_code')">
                    <a-select
                        showSearch
                        v-decorator="[
                            'seller_code',
                            {
                                rules: rules.required
                            }
                        ]"
                        :style="{
                            width: '100%',
                            'max-width': '300px'
                        }"
                        size="small"
                        placeholder="Please Select"
                    >
                        <a-select-option
                            :value="item.code"
                            v-for="item of sellerCodeList"
                            :key="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.modified_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        v-decorator="[
                            'modified_date',
                            { initialValue: initialDate }
                        ]"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                </a-form-item>
            </template>
            <template #action>
                <a-button type="primary" @click="importOrders()">
                    {{ $t('action.import_orders') }}
                </a-button>
                <a-button type="primary" @click="fulfilOrders()">
                    {{ $t('action.fulfil_orders') }}
                </a-button>
            </template>
        </data-form>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { SellerInstanceService } from '../../services/seller-instance.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import LogView from '~/shared/common/log-view.vue'
// import router from '../../router'
import moment from 'moment'
import { AliexpressService } from '../../services/aliexpress.service'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'aliexpress-manage1212'
})
@Component({
    components: {
        LogView
    }
})
export default class AliexpressManage1212 extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    private form: any

    private aliexpressService = new AliexpressService()

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    // 表格数据源
    private data: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    // @datasModule.State
    // private sellerCodeList

    // @datasModule.Action
    // private getSellerCodeList

    private get rules() {
        return {}
    }

    private created() {
        this.getSellerCodeList()
        this.form = this.$form.createForm(this)
    }

    private moment = moment

    private modified_date_start: any = ''
    private modified_date_end: any = ''

    private object_name = 'aliexpress-manage'

    private initialDate: any = []

    private sellerCodeList: any[] = []
    private selectedRows: any[] = []
    private sellerInstanceService = new SellerInstanceService()

    private getSellerCodeList() {
        this.sellerInstanceService
            .query_seller_name(new RequestParams({}))
            .subscribe(
                data => {
                    this.sellerCodeList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }
    private importOrders() {
        this.form.validateFields().then((values: any) => {
            values['modified_date_start'] = this.modified_date_start
            values['modified_date_end'] = this.modified_date_end
            this.aliexpressService
                .importOrders(new RequestParams(values))
                .subscribe(
                    () => {
                        let msg: any = this.$t('tips.import_success')
                        this.$message.success(msg)
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }
    private fulfilOrders() {
        this.form.validateFields().then((values: any) => {
            this.aliexpressService
                .fulfilOrders(new RequestParams(values))
                .subscribe(
                    () => {
                        let msg: any = this.$t('tips.fulfil_success')
                        this.$message.success(msg)
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }
}
</script>
