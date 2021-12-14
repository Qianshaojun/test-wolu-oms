<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action>
            <!-- <a-button type="primary" @click="onCreate">{{
                $t('action.create')
            }}</a-button> -->
        </template>
        <data-form
            ref="dataForm"
            @submit="getManualList"
            :column="2"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 18 }"
            @reset="formReset"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.import_status')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['manual_condition', { initialValue: 0 }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button :value="0">
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="1" :key="1"
                            >{{ $t('action.import') }}
                        </a-radio-button>
                        <a-radio-button :value="2" :key="2"
                            >{{ $t('action.not_import') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.specification_import_status')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'specification_condition',
                            { initialValue: 0 }
                        ]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button :value="0">
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="1" :key="1"
                            >{{ $t('action.import') }}
                        </a-radio-button>
                        <a-radio-button :value="2" :key="2"
                            >{{ $t('action.not_import') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.quick_search')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="[
                            'fuzzy_search_code',
                            { initialValue: 10 }
                        ]"
                        :style="{ width: '130px' }"
                        size="small"
                    >
                        <a-select-option :value="10">
                            {{ $t('columns.default_code') }}
                        </a-select-option>
                        <a-select-option :value="20">
                            {{ $t('columns.product_number') }}
                        </a-select-option>
                        <a-select-option :value="30">
                            {{ $t('columns.name') }}
                        </a-select-option>
                        <a-select-option :value="170">
                            {{ $t('columns.product_name') }}
                        </a-select-option>
                        <a-select-option :value="160">
                            {{ $t('columns.common_sku') }}
                        </a-select-option>
                        <a-select-option :value="40">
                            {{ $t('columns.department') }}
                        </a-select-option>
                        <a-select-option :value="50">
                            {{ $t('columns.operator') }}
                        </a-select-option>
                        <a-select-option :value="60">
                            {{ $t('columns.ship_type') }}
                        </a-select-option>
                        <a-select-option :value="70">
                            {{ $t('columns.pack_cate') }}
                        </a-select-option>
                        <a-select-option :value="80">
                            {{ $t('columns.location_code') }}
                        </a-select-option>
                        <a-select-option :value="90">
                            {{ $t('columns.frei_field_1') }}
                        </a-select-option>
                        <a-select-option :value="100">
                            {{ $t('columns.frei_field_2') }}
                        </a-select-option>
                        <a-select-option :value="110">
                            {{ $t('columns.frei_field_3') }}
                        </a-select-option>
                        <a-select-option :value="120">
                            {{ $t('columns.frei_field_5') }}
                        </a-select-option>
                        <a-select-option :value="130">
                            {{ $t('columns.frei_field_8') }}
                        </a-select-option>
                        <a-select-option :value="140">
                            {{ $t('columns.frei_field_9') }}
                        </a-select-option>
                        <a-select-option :value="150">
                            {{ $t('columns.edit_group_sku') }}
                        </a-select-option>
                    </a-select>
                    <a-input
                        v-decorator="['fuzzy_search_value']"
                        :style="{ width: '145px', margin: '0 5px' }"
                        :placeholder="$t('plzInput')"
                        size="small"
                    ></a-input>
                    <a-select
                        v-decorator="[
                            'fuzzy_search_operator',
                            { initialValue: 10 }
                        ]"
                        :style="{ width: '100px' }"
                        size="small"
                    >
                        <a-select-option :value="10">
                            {{ $t('forms.operator_like') }}
                        </a-select-option>
                        <a-select-option :value="20">
                            {{ $t('forms.operator_equal') }}
                        </a-select-option>
                        <a-select-option :value="30">
                            {{ $t('forms.operator_list') }}
                        </a-select-option>
                        <a-select-option :value="40">
                            {{ $t('forms.in_or_like') }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.active')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['active', { initialValue: 't' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="'t'" key="1"
                            >{{ $t('action.active') }}
                        </a-radio-button>
                        <a-radio-button :value="'f'" key="2"
                            >{{ $t('action.inactive') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('forms.ref_bind_search')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="[
                            'ref_bind_type',
                            { initialValue: 'ref_basic_no' }
                        ]"
                        :style="{ width: '130px' }"
                        size="small"
                    >
                        <a-select-option value="ref_basic_no">
                            {{ $t('columns.ref_basic_no') }}
                        </a-select-option>
                        <a-select-option value="ref_combine_no">
                            {{ $t('columns.ref_combine_no') }}
                        </a-select-option>
                    </a-select>
                    <a-input
                        v-decorator="['ref_bind_value']"
                        :placeholder="$t('forms.operator_like')"
                        :style="{ width: '145px', 'margin-left': '5px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.b_part_product')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['b_part_product', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value="">
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="1" :key="1"
                            >{{ $t('action.b_part_product') }}
                        </a-radio-button>
                        <a-radio-button :value="2" :key="2"
                            >{{ $t('action.not_b_part_product') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['z_category']"
                        style="width: 130px;"
                        @change="handleFatherCateChange"
                        placeholder="品类"
                        size="small"
                        allowClear
                    >
                        <a-select-option
                            v-for="cate in fatherCates"
                            :key="cate"
                        >
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                    <a-select
                        v-model="selectedList"
                        mode="multiple"
                        style="width: 145px;margin-left:5px"
                        placeholder="子类"
                        size="small"
                    >
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.is_variant_set')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['is_set', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value="">
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true" :key="1"
                            >{{ $t('action.set') }}
                        </a-radio-button>
                        <a-radio-button :value="false" :key="2"
                            >{{ $t('action.not_set') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.de_prod_status')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        allowClear
                        mode="multiple"
                        v-decorator="['de_prod_status']"
                        :style="{ width: '280px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option
                            v-for="item of $dict.CheckProdStatus"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ $t(item.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.pack_product')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['is_pack', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value="">
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true" :key="'is_pack_true'"
                            >{{ $t('action.pack_product') }}
                        </a-radio-button>
                        <a-radio-button :value="false" :key="'is_pack_false'"
                            >{{ $t('action.not_pack_product') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.uk_prod_status')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['uk_prod_status']"
                        :style="{ width: '280px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        mode="multiple"
                        allowClear
                    >
                        <a-select-option
                            v-for="item of $dict.CheckProdStatus"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ $t(item.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.edit_group_sku')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['is_edit_group', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value="">
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true"
                            >{{ $t('columns.edit_group_sku') }}
                        </a-radio-button>
                        <a-radio-button :value="false"
                            >{{ $t('action.not_edit_group_sku') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.create_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="[
                            'create_date',
                            { initialValue: initialDate }
                        ]"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                    <a-button
                        @click="fillToday"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.today') }}
                    </a-button>
                    <a-button
                        @click="fillYestoday"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.yestoday') }}
                    </a-button>
                    <a-button
                        @click="fill3day"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.3day') }}
                    </a-button>
                    <a-button
                        @click="fill3days"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.3days') }}
                    </a-button>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay">
                        <a-menu-item
                            @click="mergeInactive"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.merge_inactive') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="mergeActive"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.merge_active') }}
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 2px" v-auth="'merge'">
                        {{ $t('action.merge_inactive') }}
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown>
                <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay">
                        <a-menu-item @click="synCommonSkuInfo"
                            >{{ $t('action.syn_common_sku_info') }}
                        </a-menu-item>
                        <a-menu-item @click="synCommonSkuExtraAttributes"
                            >{{ $t('action.syn_common_sku_extra_attributes') }}
                        </a-menu-item>
                        <a-menu-item @click="updatePackProductCategory"
                            >{{ $t('action.update_pack_product_category') }}
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 2px" v-auth="'update'">
                        {{ $t('action.update_btn') }}
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown>
                <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay">
                        <a-menu-item @click="importBasicProduct"
                            >{{ $t('action.import_basic_product') }}
                        </a-menu-item>
                        <a-menu-item @click="importBTypeBasicProduct"
                            >{{ $t('action.import_b_basic_product') }}
                        </a-menu-item>
                        <a-menu-item @click="importETZBasicProduct"
                            >{{ $t('action.import_etz_basic_product') }}
                        </a-menu-item>
                        <a-menu-item @click="importShipmentBasicProduct"
                            >{{ $t('action.import_shipment_basic_product') }}
                        </a-menu-item>
                        <a-menu-item @click="importSetBasicProduct"
                            >{{ $t('action.import_set_basic_product') }}
                        </a-menu-item>
                        <a-menu-item @click="importUpdatePackProduct"
                            >{{ $t('action.import_update_pack_product') }}
                        </a-menu-item>
                        <a-menu-item @click="importCreatePackProduct"
                            >{{ $t('action.import_create_pack_product') }}
                        </a-menu-item>
                        <a-menu-item @click="importProductAttr"
                            >{{ $t('action.import_product_attr') }}
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 2px" v-auth="'import'"
                        >{{ $t('action.import_btn') }}
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown>
                <a-button
                    type="primary"
                    @click="exportBasicInfo"
                    style="margin-left: 2px"
                    v-auth="'export_basic'"
                    >{{ $t('action.export_basic_info') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="importInfoMaintain"
                    style="margin-left: 2px"
                    v-auth="'import_maintain'"
                    >{{ $t('action.import_info_maintain') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="changeCategory"
                    style="margin-left: 2px"
                    :disabled="!selectedRowKeys.length"
                    v-auth="'change_category'"
                    >{{ $t('action.change_category') }}
                </a-button>
                <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay">
                        <a-menu-item @click="updateEditGroupSku('all')"
                            >{{ $t('action.update_edit_group_sku_all') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="updateEditGroupSku('select')"
                            :disabled="!selectedRowKeys.length"
                            >{{ $t('action.update_edit_group_sku_select') }}
                        </a-menu-item>
                    </a-menu>
                    <a-button
                        style="margin-left: 2px"
                        v-auth="'update_edit_group_sku'"
                    >
                        {{ $t('action.update_edit_group_sku') }}
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important;">
            <div v-if="!groupbyList.length">
                <AutoColumnTable
                    :stripe="true"
                    :data="data"
                    :page="pageService"
                    :queryNameAuth="allNameAuth"
                    rowKey="id"
                    :columns="columnList"
                    :rowSelection="{
                        selectedRowKeys: selectedRowKeys,
                        onChange: keys => (selectedRowKeys = keys)
                    }"
                    @on-page-change="getManualList"
                    @onClick="
                        record => {
                            selectedRowKeys = [record]
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 1560, y: 500 }"
                    :queryUrl="queryUrl"
                    :menu_code="menu_code"
                    :queryCondition="queryCondition"
                    :selectedRowCnt="selectedRowKeys.length"
                >
                    <span slot="check_render" slot-scope="text"
                        ><a-checkbox disabled :checked="text" />
                    </span>
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <template slot="user_render" slot-scope="text">
                        <span v-if="typeof text == 'number'">
                            {{ text | dict2(systemUsers) }}
                        </span>
                        <span v-else-if="typeof text == 'object'">
                            <span v-for="item of text" :key="item">
                                {{ item | dict2(systemUsers) }}<br />
                            </span>
                        </span>
                        <span v-else>
                            {{ text }}
                        </span>
                    </template>
                    <template slot="default_code" slot-scope="text, row">
                        <a @click="toPageDetail(row.id, row.default_code)">{{
                            row.default_code
                        }}</a>
                    </template>
                    <template slot="view" slot-scope="text, row">
                        <a @click="showManualDetail(row.default_code)">
                            <a-icon type="file" />
                        </a>
                    </template>
                    <template slot="message_render" slot-scope="text">
                        <span :title="text">{{
                            text
                                ? text.length > 18
                                    ? text.substr(0, 15) + '...'
                                    : text
                                : ''
                        }}</span>
                    </template>
                    <template slot="state_render" slot-scope="text, row">
                        {{ row.prod_status | dict('ProdStatus') | translate }}
                    </template>
                    <template slot="check_prod_render" slot-scope="text">
                        {{ text | dict('CheckProdStatus') | translate }}
                    </template>
                </AutoColumnTable>
            </div>
            <GroupbyTable
                v-else
                ref="groupbyTable"
                :groupByColumn="groupbyList"
                :oColumns="columnList"
                :queryNameAuth="allNameAuth"
                :urlStr="queryUrl"
                @selectChange="onSelectChange"
                :scrollX="1560"
                :scrollY="500"
            >
                <span slot="check_render" slot-scope="text"
                    ><a-checkbox disabled :checked="text" />
                </span>
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
                <template slot="user_render" slot-scope="text">
                    <span v-if="typeof text == 'number'">
                        {{ text | dict2(systemUsers) }}
                    </span>
                    <span v-else-if="typeof text == 'object'">
                        <span v-for="item of text" :key="item">
                            {{ item | dict2(systemUsers) }}<br />
                        </span>
                    </span>
                    <span v-else>
                        {{ text }}
                    </span>
                </template>
                <template slot="default_code" slot-scope="text, row">
                    <a @click="toPageDetail(row.id, row.default_code)">{{
                        row.default_code
                    }}</a>
                </template>
                <template slot="view" slot-scope="text, row">
                    <a @click="showManualDetail(row.default_code)">
                        <a-icon type="file" />
                    </a>
                </template>
                <template slot="message_render" slot-scope="text">
                    <span :title="text">{{
                        text
                            ? text.length > 18
                                ? text.substr(0, 15) + '...'
                                : text
                            : ''
                    }}</span>
                </template>
                <template slot="state_render" slot-scope="text, row">
                    {{ row.prod_status | dict('ProdStatus') | translate }}
                </template>
                <template slot="check_prod_render" slot-scope="text">
                    {{ text | dict('CheckProdStatus') | translate }}
                </template>
            </GroupbyTable>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { SellerInstanceService } from '~/services/seller-instance.service'
import { UserService } from '~/services/user.service'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { CompanyService } from '~/services/company.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import UploadExcel from '~/shared/common/upload-excel.vue'
import router from '../../router'
import moment from 'moment'
import SellerView from '~/components/seller_instance/seller_view.vue'
import SellerApiEdit from '~/components/seller_instance/seller-api-edit.vue'
import { ReportService } from '../../services/report.service'
import { ProductService } from '../../services/product.service'
import ManualDetail from '@/components/product/manual-detail.vue'
import ImportProductAttr from '@/components/product/import-product-attr.vue'
import ExportCommon from '@/components/common/export-common.vue'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { PublicService } from '@/services/public.service'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import SelectProductCategory from '@/components/product/select-product-category.vue'

const userModule = namespace('userModule')
const allUsersModule = namespace('allUsersModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'product-search'
})
@Component({
    components: {
        SellerView,
        UploadExcel,
        SellerApiEdit,
        ImportProductAttr,
        GroupbyTable,
        AutoColumnTable
    }
})
export default class ProductSearch extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private reportService = new ReportService()

    private productService = new ProductService()

    private innerActionService = new InnerActionService()
    private publicService = new PublicService()

    // 表格数据源
    private data: any[] = []
    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []
    // 表格选择项
    private selectedRowKeys: any[] = []

    private query_conditions: any = []

    private menu_code: any = ''

    private groupbyList: any = []

    private allNameAuth: any = []

    private columnList: any = []

    private queryUrl: any = '/product/query_all_product_template'
    private queryCondition: any = []

    private orderBy: any = 'id desc'

    public created() {
        this.getCn_cate()
    }

    public mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
        this.menu_code = this.dataForm.menu_code
    }

    private importBasicProduct() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/product/import_basic_product' },
                {
                    title: '产品基础通用导入',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importBTypeBasicProduct() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/product/import_b_basic_product' },
                {
                    title: '产品基础-B品',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importETZBasicProduct() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/product/import_etz_basic_product' },
                {
                    title: '产品基础-配件',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importShipmentBasicProduct() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/product/import_shipment_basic_product' },
                {
                    title: '产品基础-运费',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importSetBasicProduct() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/product/import_set_basic_product' },
                {
                    title: '产品基础-组序(变体)',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importUpdatePackProduct() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/product/import_update_pack_product' },
                {
                    title: '产品组合通用修改',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importCreatePackProduct() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/product/import_create_pack_product' },
                {
                    title: '产品组合通用创建',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
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

    private moment = moment

    private initialDate: any = []

    private fillToday() {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime())),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()

        this.initialDate = [startDate, endDate]
        values['create_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fillYestoday() {
        let day = new Date()
        let endDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['create_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fill3day() {
        let day = new Date()
        let endDate = moment(
            this.formatDate(new Date(day.getTime() - 48 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 48 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['create_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fill3days() {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 48 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['create_date'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private formatDate(time) {
        // 空数据处理
        if (time === null || time === undefined || time === '') {
            return ''
        }

        let y = time.getFullYear()
        let m = time.getMonth() + 1
        let d = time.getDate()
        let h = time.getHours()
        let mi = time.getMinutes()
        let s = time.getSeconds()
        m = m < 10 ? `0${m}` : m
        d = d < 10 ? `0${d}` : d
        h = h < 10 ? `0${h}` : h
        mi = mi < 10 ? `0${mi}` : mi
        s = s < 10 ? `0${s}` : s
        return `${y}-${m}-${d} 23:59`
    }

    /**
     * 获取订单数据
     */
    private getManualList() {
        let params: any = {}
        this.getQueryCondition().then(nowConditions => {
            this.queryCondition = nowConditions
            if (this.groupbyList.length) {
                let groupbyTable: any = this.$refs.groupbyTable
                groupbyTable.getFirstTableData(nowConditions)
            } else {
                params.query_condition = nowConditions
                if (this.orderBy) {
                    params['order_by'] = this.orderBy
                }
                this.innerActionService.setActionAPI(
                    this.queryUrl,
                    CommonService.getMenuCode()
                )
                this.publicService
                    .queryPagination(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService,
                            innerAction: this.innerActionService
                        })
                    )
                    .subscribe(
                        data => {
                            this.data = data
                            this.selectedRowKeys = []
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
        })
    }

    private getQueryCondition() {
        return new Promise((reslove, reject) => {
            this.dataForm
                .validateFields()
                .then((values: any) => {
                    if (this.selectedList.length > 0) {
                        values['z_sub_category'] = this.selectedList
                    }

                    let default_code_operator = 'in_or_like'
                    let product_number_operator = 'like'
                    let name_operator = 'like'
                    let department_operator = '='
                    let operator_operator = 'suffix_like'
                    let ship_type_operator = 'in_or_prefix_like'
                    let pack_cate_operator = 'in_or_like'
                    let location_code_operator = 'like'
                    let f1_operator = 'like'
                    let f2_operator = 'like'
                    let f3_operator = 'like'
                    let f5_operator = 'like'
                    let f8_operator = 'like'
                    let f9_operator = 'like'
                    let edit_group_operator = 'like'

                    let operator = 'like'
                    let fuzzy_search_value = values['fuzzy_search_value']
                    let fuzzy_search_code = values['fuzzy_search_code']

                    if (fuzzy_search_code == 10) {
                        operator = 'in_or_like'
                    }

                    let fuzzy_search_operator = values['fuzzy_search_operator']
                    if (fuzzy_search_operator == '20') {
                        operator = '='
                    } else if (fuzzy_search_operator == '30') {
                        operator = 'in_or_='
                    } else if (fuzzy_search_operator == '40') {
                        operator = 'in_or_like'
                    }

                    if (fuzzy_search_value) {
                        let search_field_name = 'name'

                        switch (fuzzy_search_code) {
                            case 10:
                                search_field_name = 'default_code'
                                default_code_operator = operator
                                break
                            case 20:
                                search_field_name = 'product_number'
                                product_number_operator = operator
                                break
                            case 30:
                                search_field_name = 'name'
                                name_operator = operator
                                break
                            case 40:
                                search_field_name = 'department'
                                department_operator = operator
                                break
                            case 50:
                                search_field_name = 'operator'
                                operator_operator = operator
                                break
                            case 60:
                                search_field_name = 'ship_type'
                                ship_type_operator = operator
                                break
                            case 70:
                                search_field_name = 'pack_cate'
                                pack_cate_operator = operator
                                break
                            case 80:
                                search_field_name = 'location_code'
                                location_code_operator = operator
                                break
                            case 90:
                                search_field_name = 'frei_field_1'
                                f1_operator = operator
                                break
                            case 100:
                                search_field_name = 'frei_field_2'
                                f2_operator = operator
                                break
                            case 110:
                                search_field_name = 'frei_field_3'
                                f3_operator = operator
                                break
                            case 120:
                                search_field_name = 'frei_field_5'
                                f5_operator = operator
                                break
                            case 130:
                                search_field_name = 'frei_field_8'
                                f8_operator = operator
                                break
                            case 140:
                                search_field_name = 'frei_field_9'
                                f9_operator = operator
                                break
                            case 150:
                                search_field_name = 'edit_group_sku'
                                edit_group_operator = operator
                                break
                            case 160:
                                search_field_name = 'common_sku'
                                edit_group_operator = operator
                                break
                            case 170:
                                search_field_name = 'nameOrSku'
                                edit_group_operator = operator
                                break
                            default:
                                search_field_name = 'name'
                                name_operator = operator
                        }

                        values[search_field_name] = fuzzy_search_value
                    }

                    if (values['ref_bind_value']) {
                        let keyName = values['ref_bind_type']
                        values[keyName] = values['ref_bind_value']
                    }
                    delete values['ref_bind_type']
                    delete values['ref_bind_value']

                    delete values['fuzzy_search_value']
                    delete values['fuzzy_search_code']
                    delete values['fuzzy_search_operator']
                    this.query_conditions = CommonService.createQueryCondition(
                        values,
                        {
                            default_code: default_code_operator,
                            active: '=',
                            z_sub_category: 'in',
                            de_prod_status: 'in',
                            uk_prod_status: 'in',
                            product_number: product_number_operator,
                            name: name_operator,
                            department: department_operator,
                            operator: operator_operator,
                            ship_type: ship_type_operator,
                            pack_cate: pack_cate_operator,
                            loacation_code: location_code_operator,
                            frei_field_1: f1_operator,
                            frei_field_2: f2_operator,
                            frei_field_3: f3_operator,
                            frei_field_5: f5_operator,
                            frei_field_8: f8_operator,
                            frei_field_9: f9_operator,
                            edit_group_sku: edit_group_operator,
                            ref_basic_no: 'like',
                            ref_combine_no: 'like',
                            ...formConfig.condition
                        }
                    )
                    var nowConditions: any[] = []
                    for (var item of this.query_conditions.query_condition) {
                        if (
                            item.value.constructor == Array &&
                            item.operate !== 'in'
                        ) {
                            if (
                                item.value.length == 2 &&
                                item.value[0].constructor.name == 'Moment'
                            ) {
                                let startDate: any = {}
                                for (let key in item.value[0]) {
                                    startDate[key] = item.value[0][key]
                                }
                                nowConditions.push({
                                    query_name: item.query_name,
                                    operate: '>=',
                                    value: new Date(startDate.utc())
                                })
                            }
                            if (
                                item.value.length == 2 &&
                                item.value[1].constructor.name == 'Moment'
                            ) {
                                let endDate: any = {}
                                for (let key in item.value[1]) {
                                    endDate[key] = item.value[1][key]
                                }
                                nowConditions.push({
                                    query_name: item.query_name,
                                    operate: '<=',
                                    value: new Date(endDate.utc())
                                })
                            }
                        } else {
                            if (Array.isArray(item.value)) {
                                if (
                                    [
                                        'de_prod_status',
                                        'uk_prod_status'
                                    ].includes(item.query_name) &&
                                    item.value.includes(10000)
                                ) {
                                    let newValue = item.value.filter(
                                        x => x != 10000
                                    )
                                    if (!newValue.includes(10)) {
                                        newValue.push(10)
                                    }
                                    if (!newValue.includes(20)) {
                                        newValue.push(20)
                                    }
                                    item.value = newValue
                                }
                            }

                            if (
                                item.query_name == 'is_pack' &&
                                item.value == false
                            ) {
                                nowConditions.push({
                                    query_name: 'is_pack',
                                    operate: '|',
                                    value: ''
                                })
                                nowConditions.push({
                                    query_name: 'is_pack',
                                    operate: 'null',
                                    value: ''
                                })
                            }
                            if (item.query_name === 'nameOrSku') {
                                nowConditions.push(
                                    {
                                        query_name: '|',
                                        operate: '|',
                                        value: '|'
                                    },
                                    {
                                        query_name: 'default_code',
                                        operate: 'ilike',
                                        value: item.value
                                    },
                                    {
                                        query_name: 'name',
                                        operate: 'ilike',
                                        value: item.value
                                    }
                                )
                            }

                            nowConditions.push(item)
                        }
                    }

                    let newConditions = nowConditions.filter(
                        v => v.query_name != 'nameOrSku'
                    )
                    reslove(newConditions)
                })
                .catch(err => {
                    this.$message.error(JSON.stringify(err))
                })
        })
    }

    private onEdit(row) {
        router.push({
            name: 'seller-edit',
            params: { seller: row }
        })
    }

    private onDelete(row) {
        // this.sellerInstanceService
        //     .seller_delete(
        //         new RequestParams(
        //             {
        //                 seller_code_list: [row.seller_code]
        //             },
        //             { loading: this.loadingService }
        //         )
        //     )
        //     .subscribe(
        //         data => {
        //             let msg: any = this.$t('delete_success')
        //             this.$message.success(msg)
        //             this.getManualList()
        //         },
        //         err => {
        //             this.$message.error(err.message)
        //         }
        //     )
    }

    private toPageDetail(id, name) {
        this.$router.push({
            name: 'product-detail',
            path: `/product/product-detail/${id}`,
            params: {
                id: id,
                name: name
            }
        })
    }

    private onBatchDelete(row) {}

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }

    private onTypeChange(e) {
        this.$nextTick(function() {
            this.getManualList()
        })
    }

    private mergeInactive() {
        this.productService
            .mergeInactive(
                new RequestParams(
                    { id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('货号归档成功!')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private mergeActive() {
        this.productService
            .mergeActive(
                new RequestParams(
                    { id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('激活货号成功!')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private synCommonSkuInfo() {
        this.productService
            .synCommonSkuInfo(
                new RequestParams(
                    { syn_key: 'syn_common_sku_info' },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('同步通用货号信息成功!')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private synCommonSkuExtraAttributes() {
        this.productService
            .synCommonSkuExtraAttributes(
                new RequestParams(
                    { syn_key: 'syn_common_sku_extra_attributes' },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('同步通用货号通用属性成功!')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private updatePackProductCategory() {
        this.productService
            .updatePackProductCategory(
                new RequestParams(
                    { syn_key: 'update_pack_product_category' },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('更新组合货号分类数据成功!')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private showManualDetail(sku) {
        let params: any = CommonService.createQueryCondition(
            { sku: sku },
            {
                sku: '='
            }
        )
        this.innerActionService.setActionAPI(
            '/product/query_all_product_manual',
            CommonService.getMenuCode('manual-manage')
        )
        this.publicService
            .queryPagination(
                new RequestParams(params, {
                    page: this.pageService,
                    loading: this.loadingService,
                    innerAction: this.innerActionService
                })
            )
            .subscribe(
                data => {
                    this.$modal
                        .open(
                            ManualDetail,
                            {
                                list: data
                            },
                            {
                                title: this.$t('说明书'),
                                width: '1000px'
                            }
                        )
                        .subscribe()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importProductAttr() {
        this.$modal
            .open(
                ImportProductAttr,
                {
                    urlPath: '/product/import_product_attributes',
                    attachmentUrlPath: '',
                    fatherCates: this.fatherCates,
                    cateDict: this.cateDict
                },
                {
                    title: this.$t('action.import_product_attr'),
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private exportBasicInfo() {
        let df: any = this.$refs.dataForm
        this.getQueryCondition().then(data => {
            let query_condition = this.query_conditions
            this.$modal
                .open(
                    ExportCommon,
                    {
                        table_name: 'product_template',
                        resource: 'product.template',
                        query_condition: query_condition,
                        menu_code: df.menu_code
                    },
                    {
                        title: this.$t('action.export_basic_info'),
                        width: '590px'
                    }
                )
                .subscribe(
                    data => {
                        this.$message.success('操作成功')
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private importInfoMaintain() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        '/system_api/upload?menu_code=' +
                        this.menu_code +
                        '&inner_action=product_management/import_product_info',
                    tipText: '*上传的表格文档中必须包含default_code字段',
                    table_name: 'product.template',
                    update_key_columns: 'default_code'
                },
                {
                    title: this.$t('action.import_info_maintain'),
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private formReset(param) {
        this.selectedList = []
    }

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getManualList()
    }

    private updateEditGroupSku(type) {
        let prod_tmpl_id_list: any = ''

        if (type == 'select') {
            prod_tmpl_id_list = this.selectedRowKeys
        }
        this.innerActionService.setActionAPI(
            '/product/update_relate_edit_group_sku_attr',
            CommonService.getMenuCode('product-search')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { prod_tmpl_id_list: prod_tmpl_id_list },
                    {
                        page: this.pageService,
                        loading: this.loadingService,
                        innerAction: this.innerActionService
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('Update Success')
                    this.selectedRowKeys = []
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private changeCategory() {
        this.$modal
            .open(
                SelectProductCategory,
                {
                    idList: this.selectedRowKeys
                },
                {
                    title: this.$t('action.change_category')
                }
            )
            .subscribe(data => {
                this.$message.success('update success')
                this.getManualList()
            })
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "product_name": "Product",
            "manual_code": "Manual Code",
            "manual_version": "Manual Version",
            "seller_id": "Seller Name",
            "actions": "Actions",
            "active": "Active",
            "is_pack": "Is Pack",
            "view": "View",
            "cn_category": "Category",
            "cn_sub_category": "Sub Category",
            "import_date": "Import Date",
            "part": "Parts",
            "b_product": "B Product",
            "n_product": "N Product",
            "type": "Type",
            "de_renew_available_qty": "DE Renew Available Qty",
            "default_code": "Default Code",
            "fba_stock_qty": "Fba Stock Qty",
            "department": "Department",
            "operator": "Operator",
            "ship_type": "Ship Type",
            "pack_cate": "Mix Category",
            "frei_field_4": "F4",
            "frei_field_1": "F1",
            "frei_field_2": "F2",
            "frei_field_3": "F3",
            "frei_field_5": "F5",
            "frei_field_8": "F8",
            "frei_field_9": "F9",
            "common_sku": "Common Sku",
            "location_code": "Location Code",
            "location_quantity": "Location Quantity",
            "min_pack": "Min Pack",
            "name": "Name",
            "pack_product": "Pack Product",
            "pre_sale": "DE Pre Sale",
            "uk_pre_sale": "UK Pre Sale",
            "pre_sale_quantity": "Pre Sale Quantity",
            "product_number": "Product Number",
            "product_url": "Product Url",
            "stock_available_quantity": "Stock Available Quantity",
            "stock_de_available_qty": "Stock DE Available Qty",
            "stock_de_onhand_qty": "Stock DE Onhand Qty",
            "stock_details": "Stock Details",
            "stock_onhand_quantity": "Stock Onhand Quantity",
            "stock_uk_available_qty": "Stock UK Available Qty",
            "stock_uk_onhand_qty": "Stock  UK Onhand Qty",
            "import_status": "Manual Import Status",
            "specification_import_status": "Specification Import Status",
            "prod_status": "Prod Status",
            "prod_status_sale": "Sale",
            "prod_status_stop": "Stop",
            "prod_status_waiting": "Waiting",
            "prod_status_sz_prod": "SZ Prod",
            "prod_status_uk_sale": "UK Sale",
            "prod_status_tort_stop": "Tort Stop",
            "b_part_product": "B Prod/Part Prod",
            "pack_product": "Pack Prod",
            "de_prod_status": "DE Sale Status",
            "uk_prod_status": "UK Sale Status",
            "ref_combine_no": "Ref Combine No.",
            "ref_basic_no": "Ref Badic No.",
            "edit_group_sku": "Edit Group SKU",
            "is_variant_set": "Is Variant Set"
        },
        "action": {
            "create": "Create",
            "batch-create": "EXCEL Import",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "copy": "Copy",
            "pass": "Check",
            "onApiEdit": "Api Edit",
            "import": "Import",
            "active": "Active",
            "today": "Today",
            "yestoday": "Yestoday",
            "3day": "3 Day",
            "3days": "3 Days",
            "inactive": "Inactive",
            "merge_inactive": "Merge Inactive",
            "merge_active": "Merge Active",
            "update_btn": "Update Button",
            "syn_common_sku_info": "Syn Common Sku Info",
            "syn_common_sku_extra_attributes": "Syn Common Sku Extra Attributes",
            "update_pack_product_category": "Update Pack Product Category",
            "not_import": "Not Import",
            "import_btn": "Import",
            "import_basic_product": "import_basic_product",
            "import_b_basic_product": "import_b_basic_product",
            "import_etz_basic_product": "import_etz_basic_product",
            "import_shipment_basic_product": "import_shipment_basic_product",
            "import_set_basic_product": "import_set_basic_product",
            "import_update_pack_product": "import_update_pack_product",
            "import_create_pack_product": "import_create_pack_product",
            "import_product_attr": "Import Product Attr",
            "export_basic_info": "Export Basic Info",
            "import_info_maintain": "Import Info Maintain",
            "b_part_product": "B Prod/Part Prod",
            "pack_product": "Pack Prod",
            "not_b_part_product": "Not B Prod/Part Prod",
            "not_pack_product": "Not Pack Prod",
            "not_edit_group_sku": "Not Edit Group SKU",
            "update_edit_group_sku": "Update Edit Group SKU",
            "import_edit_group_sku": "Import Edit SKU",
            "update_edit_group_sku_all": "Update All Edit Group SKU",
            "update_edit_group_sku_select": "Update Select Edit Group SKU",
            "change_category": "Change Category",
            "set": "Set",
            "not_set": "Not Set"
        },
        "forms": {
            "quick_search": "Quick Search",
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search",
            "operator_list": "Multi Search",
            "in_or_like": "Multi Like Search",
            "ref_bind_search": "Association Search"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "cancel": "Are you sure cancel?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "columns": {
            "product_name": "产品",
            "manual_code": "说明书编号",
            "manual_version": "说明书版本",
            "time": "创建时间",
            "actions": "操作",
            "active": "状态",
            "is_pack": "组合",
            "view": "说明书查看",
            "cn_category": "分类",
            "cn_sub_category": "子类",
            "import_date": "导入日期",
            "part": "配件",
            "b_product": "B品",
            "n_product": "N品",
            "type": "类型",
            "de_renew_available_qty": "德仓Renew库存",
            "default_code": "SKU",
            "product_number": "Product Number",
            "fba_stock_qty": "FBA库存",
            "department": "部门",
            "operator": "运营",
            "ship_type": "运输方式",
            "pack_cate": "Mix Category",
            "frei_field_4": "F4",
            "frei_field_1": "F1",
            "frei_field_2": "F2",
            "frei_field_3": "F3",
            "frei_field_5": "F5",
            "frei_field_8": "F8",
            "frei_field_9": "F9",
            "common_sku": "通用货号",
            "location_code": "库位",
            "location_quantity": "库位数量",
            "min_pack": "最小包装",
            "name": "产品名称",
            "pack_product": "组合基础关系",
            "pre_sale": "DE预售",
            "uk_pre_sale": "UK预售",
            "pre_sale_quantity": "预售库存",
            "product_url": "产品链接",
            "stock_available_quantity": "可用库存",
            "stock_de_available_qty": "德仓可用库存",
            "stock_de_onhand_qty": "德仓在手数量",
            "stock_details": "库存明细",
            "stock_onhand_quantity": "总在手数量",
            "stock_uk_available_qty": "英仓可用库存",
            "stock_uk_onhand_qty": "英仓在手数量",
            "import_status": "说明书导入状态",
            "specification_import_status": "工艺单导入状态",
            "prod_status": "产品状态",
            "prod_status_sale": "正常在售",
            "prod_status_stop": "淘汰停售",
            "prod_status_waiting": "待观察",
            "prod_status_sz_prod": "深圳产品",
            "prod_status_uk_sale": "UK正常在售",
            "prod_status_tort_stop": "侵权停售",
            "b_part_product": "B品与配件",
            "pack_product": "组合货号",
            "de_prod_status": "德仓销售状态",
            "uk_prod_status": "英仓销售状态",
            "ref_combine_no": "关联组合查找",
            "ref_basic_no": "关联基础查找",
            "edit_group_sku": "维护组SKU",
            "is_variant_set": "是否变体"
        },
        "action": {
            "create": "新建",
            "batch-create": "EXCEL导入",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "copy": "复制",
            "pass": "审核",
            "onApiEdit": "api接口管理",
            "import": "已导入",
            "active": "正常可用",
            "today": "今天",
            "yestoday": "昨天",
            "3day": "前天",
            "3days": "近3天",
            "inactive": "归档不可用",
            "merge_inactive": "货号归档",
            "merge_active": "还原归档货号",
            "update_btn": "一键同步",
            "syn_common_sku_info": "一键同步通用货号基础信息",
            "syn_common_sku_extra_attributes": "一键同步通用货号产品属性",
            "update_pack_product_category": "一键同步组合货号分类",
            "not_import": "未导入",
            "import_btn": "导入",
            "import_basic_product": "ERP产品导入-基础-通用",
            "import_b_basic_product": "ERP产品导入-基础-B品",
            "import_etz_basic_product": "ERP产品导入-基础-配件",
            "import_shipment_basic_product": "ERP产品导入-基础-运费",
            "import_set_basic_product": "ERP产品导入-基础-组序变体",
            "import_update_pack_product": "ERP产品导入-组合-通用修改",
            "import_create_pack_product": "ERP产品导入-组合-通用创建",
            "import_product_attr": "ERP产品导入-产品属性",
            "export_basic_info": "基础信息导出",
            "import_info_maintain": "信息维护导入",
            "b_part_product": "B品与配件",
            "pack_product": "组合货号",
            "not_b_part_product": "非B品与配件",
            "not_pack_product": "非组合货号",
            "not_edit_group_sku": "非维护组SKU",
            "update_edit_group_sku": "一键更新维护组SKU属性",
            "import_edit_group_sku": "ERP产品导入-维护组SKU",
            "update_edit_group_sku_all": "更新所有维护组SKU属性",
            "update_edit_group_sku_select": "更新选中维护组SKU属性",
            "change_category": "修改产品品类",
            "set": "变体",
            "not_set": "非变体"
        },
        "forms": {
            "quick_search": "快速查找",
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量查询",
            "in_or_like": "批量模糊",
            "ref_bind_search": "通用关联查找"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功"
    }
}
</i18n>
