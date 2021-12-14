<template>
    <section class="component edit-customer">
        <data-form
            ref="dataForm"
            @submit="getDataList"
            :column="2"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 16 }"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('forms.sku')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="[
                            'sku_type',
                            { initialValue: 'default_code' }
                        ]"
                        :style="{ width: '120px' }"
                        size="small"
                    >
                        <a-select-option value="default_code">
                            {{ $t('forms.base_sku') }}
                        </a-select-option>
                        <a-select-option value="common_sku">
                            {{ $t('forms.common_sku') }}
                        </a-select-option>
                    </a-select>
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['sku']"
                        style="width:200px;"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_main_category')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['z_main_category']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('fuzzy_search')"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.warehouse_id')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['warehouse', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value
                            >{{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="DE" key="DE">DE</a-radio-button>
                        <a-radio-button value="UK" key="UK">UK</a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_category')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['z_category']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('fuzzy_search')"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.operator')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['operator']"
                        style="width:200px;"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['z_sub_category']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('fuzzy_search')"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.month')"
                    style="height:35px;margin:0;"
                >
                    <a-month-picker
                        v-decorator="['month', { initialValue: currentMonth }]"
                        size="small"
                    />
                </a-form-item>
            </template>
            <template #collapse>
                <a-form-item
                    :label="$t('columns.origin_prod_status')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="[
                            'product_origin_state',
                            { initialValue: '' }
                        ]"
                        :style="{ width: '200px' }"
                        placeholder="Please Select"
                        :filterOption="filterSelectOption"
                        size="small"
                        allowClear
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="cate in $dict.SaleState"
                            :key="cate.value"
                        >
                            {{ $t(cate.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.is_need_manual_intervetion')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['is_manual_review', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true"
                            >{{ $t('forms.yes') }}
                        </a-radio-button>
                        <a-radio-button :value="false"
                            >{{ $t('forms.no') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.final_result')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['final_result', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        placeholder="Please Select"
                        :filterOption="filterSelectOption"
                        size="small"
                        allowClear
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="cate in $dict.SaleState"
                            :key="cate.value"
                        >
                            {{ $t(cate.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.approve_state')"
                    style="height:35px;margin:0;"
                    v-show="page_flag == 'leader'"
                >
                    <a-select
                        showSearch
                        v-decorator="['approve_state', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        placeholder="Please Select"
                        :filterOption="filterSelectOption"
                        size="small"
                        allowClear
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="cate in $dict.UnsalableApproveState"
                            :key="cate.value"
                        >
                            {{ $t(cate.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.unsalable_judgment')"
                    style="height:35px;margin:0;"
                    v-show="page_flag == 'leader'"
                >
                    <a-radio-group
                        v-decorator="[
                            'unsalable_judgment',
                            { initialValue: '' }
                        ]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="not_null" key="not_null"
                            >{{ $t('forms.yes') }}
                        </a-radio-button>
                        <a-radio-button value="null" key="null"
                            >{{ $t('forms.no') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.department')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['dept_id']"
                        :style="{ width: '180px' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '200px' }"
                        :filterOption="filterSelectOption"
                        size="small"
                        mode="multiple"
                        allowClear
                    >
                        <a-select-option
                            v-for="i of topDepartmentList"
                            :key="i.id"
                            :value="i.id"
                            :title="i.dept_name"
                        >
                            {{ i.dept_name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-button
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="changeNote()"
                >
                    {{ $t('action.save') }}
                </a-button>
                <a-button
                    v-show="page_flag == ''"
                    type="primary"
                    style="margin-left: 2px"
                    @click="applyDiscount()"
                >
                    {{ $t('action.apply_discount') }}
                </a-button>
                <a-button
                    v-show="page_flag == 'leader'"
                    type="primary"
                    style="margin-left: 2px"
                    @click="onApprove()"
                >
                    {{ $t('action.approve') }}
                </a-button>
                <a-button
                    v-show="page_flag == ''"
                    type="primary"
                    style="margin-left: 2px"
                    @click="importUnsaleable()"
                >
                    {{ $t('action.importUnsaleable') }}
                </a-button>

                <a-button
                    v-show="page_flag == 'leader'"
                    type="primary"
                    style="margin-left: 2px"
                    @click="importLeaderUnsaleable()"
                >
                    {{ $t('action.importUnsaleable') }}
                </a-button>
                <!-- <a-button
                    v-show="page_flag == 'leader'"
                    type="primary"
                    style="margin-left: 2px"
                    @click="onCreateReport()"
                >
                    生成报表
                </a-button> -->
                <a-popconfirm
                    :title="$t('action.confirm_cancel')"
                    :okText="$t('action.ok')"
                    :cancelText="$t('action.cancel')"
                    placement="left"
                    @confirm="directApprove()"
                >
                    <a-button
                        v-show="page_flag == 'leader'"
                        type="primary"
                        style="margin-left: 2px"
                        v-auth="'direct_approve'"
                    >
                        {{ $t('action.directApprove') }}
                    </a-button>
                </a-popconfirm>
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
                    :queryUrl="queryUrl"
                    :menu_code="menu_code"
                    :queryCondition="queryConsition"
                    :rowSelection="{
                        selectedRowKeys: selectedRowKeys,
                        onChange: keys => (selectedRowKeys = keys)
                    }"
                    @on-page-change="getDataList"
                    @onClick="
                        record => {
                            selectedRowKeys = [record]
                            onRowClick(record)
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 2000, y: 500 }"
                >
                    <span slot="check_render" slot-scope="text">
                        {{ text | translate }}
                    </span>
                    <span slot="is_danger" slot-scope="text">
                        <a-popover>
                            <template slot="content">
                                <p>3个月内无法将产品全部售出为危险</p>
                            </template>
                            {{ text | translate }}
                        </a-popover>
                    </span>
                    <span
                        slot="show_message_tips"
                        slot-scope="text"
                        :title="text"
                    >
                        {{
                            text
                                ? text.length > 20
                                    ? text.substr(0, 17) + '...'
                                    : text
                                : ''
                        }}
                    </span>
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <span slot="dept_id" slot-scope="text"
                        >{{
                            typeof text == 'object' && text.length == 2
                                ? text[1]
                                : ''
                        }}
                    </span>
                    <span slot="state_range" slot-scope="text"
                        >{{ text | dict('SaleState') | translate }}
                    </span>
                    <template slot="state_range_edit" slot-scope="text, row">
                        <a-select
                            v-if="
                                editRow.id == row.id &&
                                    row.approve_state === 'wait_approve'
                            "
                            v-decorator="[
                                'unsalable_judgment',
                                { initialValue: '' }
                            ]"
                            :style="{ width: '100%' }"
                            placeholder="Please Select"
                            size="small"
                            :value="row.unsalable_judgment"
                            @change="
                                e => handleChange(e, row, 'unsalable_judgment')
                            "
                        >
                            <a-select-option :value="null">
                                {{ $t('action.null') }}
                            </a-select-option>
                            <a-select-option
                                v-for="cate in $dict.SaleState"
                                :key="cate.value"
                            >
                                {{ $t(cate.label) }}
                            </a-select-option>
                        </a-select>
                        <span v-else>{{ row.unsalable_judgment }}</span>
                    </template>
                    <template slot="memo" slot-scope="text, row">
                        <a-textarea
                            size="small"
                            rows="1"
                            style="width:90%;margin: 3px 0;"
                            v-if="
                                editRow.id == row.id &&
                                    row.approve_state === 'wait_approve'
                            "
                            :value="row.memo ? row.memo : ''"
                            @change="
                                e => handleChange(e.target.value, row, 'memo')
                            "
                        />
                        <span :title="row.memo" v-else>{{
                            row.memo
                                ? row.memo.length > 24
                                    ? row.memo.substr(0, 27) + '...'
                                    : row.memo
                                : ''
                        }}</span>
                    </template>
                    <template slot="reason" slot-scope="text, row">
                        <a-textarea
                            size="small"
                            rows="1"
                            style="width:90%;margin: 3px 0"
                            v-if="
                                editRow.id == row.id &&
                                    row.approve_state === 'wait_approve'
                            "
                            :value="row.reason ? row.reason : ''"
                            @change="
                                e => handleChange(e.target.value, row, 'reason')
                            "
                        />
                        <span :title="row.reason" v-else>{{
                            row.reason
                                ? row.reason.length > 24
                                    ? row.reason.substr(0, 27) + '...'
                                    : row.reason
                                : ''
                        }}</span>
                    </template>

                    <template slot="discount" slot-scope="text, row">
                        <a-input
                            v-model="row.discount"
                            size="small"
                            v-if="
                                editRow.id == row.id &&
                                    row.approve_state === 'wait_approve'
                            "
                        />
                        <span v-else>
                            {{ text }}
                        </span>
                    </template>
                    <template slot="discount_start" slot-scope="text, row">
                        <a-date-picker
                            style="width:90%;margin: 3px 0"
                            :value="
                                row.discount_start
                                    ? moment(row.discount_start, 'YYYY-MM-DD')
                                    : null
                            "
                            size="small"
                            format="YYYY-MM-DD"
                            @change="
                                e => handleChange(e, row, 'discount_start')
                            "
                            v-if="
                                editRow.id == row.id &&
                                    row.approve_state === 'wait_approve'
                            "
                        />
                        <span v-else>{{
                            row.discount_start
                                ? moment(row.discount_start).format(
                                      'YYYY-MM-DD'
                                  )
                                : null
                        }}</span>
                    </template>
                    <template slot="discount_end" slot-scope="text, row">
                        <a-date-picker
                            style="width:90%;margin: 3px 0"
                            :value="
                                row.discount_end
                                    ? moment(row.discount_end, 'YYYY-MM-DD')
                                    : null
                            "
                            size="small"
                            format="YYYY-MM-DD"
                            @change="e => handleChange(e, row, 'discount_end')"
                            v-if="
                                editRow.id == row.id &&
                                    row.approve_state === 'wait_approve'
                            "
                        />
                        <span v-else>{{
                            row.discount_end
                                ? moment(row.discount_end).format('YYYY-MM-DD')
                                : null
                        }}</span>
                    </template>

                    <template slot="approve_state" slot-scope="text, row">
                        {{
                            row.approve_state
                                | dict('UnsalableApproveState')
                                | translate
                        }}
                    </template>
                    <template slot="department_review" slot-scope="text, row">
                        <a-select
                            v-if="
                                editRow.id == row.id &&
                                    row.approve_state === 'wait_approve'
                            "
                            v-decorator="[
                                'department_review',
                                { initialValue: '' }
                            ]"
                            :style="{ width: '100%' }"
                            placeholder="Please Select"
                            size="small"
                            :value="row.department_review"
                            @change="
                                e => handleChange(e, row, 'department_review')
                            "
                        >
                            <a-select-option value>
                                {{ $t('action.null') }}
                            </a-select-option>
                            <a-select-option
                                v-for="cate in $dict.SaleState"
                                :key="cate.value"
                            >
                                {{ $t(cate.label) }}
                            </a-select-option>
                        </a-select>
                        <span v-else>{{
                            row.department_review
                                | dict('SaleState')
                                | translate
                        }}</span>
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
                @rowClick="onRowClick"
            >
                <span slot="check_render" slot-scope="text">
                    {{ text | translate }}
                </span>
                <span slot="is_danger" slot-scope="text"
                    ><a-popover>
                        <template slot="content">
                            <p>3个月内无法将产品全部售出为危险</p>
                        </template>
                        {{ text | translate }}
                    </a-popover>
                </span>
                <span slot="show_message_tips" slot-scope="text" :title="text">
                    {{
                        text
                            ? text.length > 20
                                ? text.substr(0, 17) + '...'
                                : text
                            : ''
                    }}
                </span>
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
                <span slot="state_renge" slot-scope="text"
                    >{{ text | dict('SaleState') | translate }}
                </span>

                <template slot="discount" slot-scope="text, row">
                    <a-input
                        v-model="row.discount"
                        size="small"
                        v-if="
                            editRow.id == row.id &&
                                row.approve_state === 'wait_approve'
                        "
                    />
                    <span v-else>
                        {{ text }}
                    </span>
                </template>
                <template slot="discount_start" slot-scope="text, row">
                    <a-date-picker
                        style="width:90%;margin: 3px 0"
                        :value="
                            row.discount_start
                                ? moment(row.discount_start, 'YYYY-MM-DD')
                                : null
                        "
                        size="small"
                        format="YYYY-MM-DD"
                        @change="e => handleChange(e, row, 'discount_start')"
                        v-if="
                            editRow.id == row.id &&
                                row.approve_state === 'wait_approve'
                        "
                    />
                    <span v-else>{{
                        row.discount_start
                            ? moment(row.discount_start).format('YYYY-MM-DD')
                            : null
                    }}</span>
                </template>
                <template slot="discount_end" slot-scope="text, row">
                    <a-date-picker
                        style="width:90%;margin: 3px 0"
                        :value="
                            row.discount_end
                                ? moment(row.discount_end, 'YYYY-MM-DD')
                                : null
                        "
                        size="small"
                        format="YYYY-MM-DD"
                        @change="e => handleChange(e, row, 'discount_end')"
                        v-if="
                            editRow.id == row.id &&
                                row.approve_state === 'wait_approve'
                        "
                    />
                    <span v-else>{{
                        row.discount_end
                            ? moment(row.discount_end).format('YYYY-MM-DD')
                            : null
                    }}</span>
                </template>
                <template slot="state_range_edit" slot-scope="text, row">
                    <a-select
                        v-if="
                            editRow.id == row.id &&
                                row.approve_state === 'wait_approve'
                        "
                        v-decorator="[
                            'unsalable_judgment',
                            { initialValue: '' }
                        ]"
                        :style="{ width: '100%' }"
                        placeholder="Please Select"
                        size="small"
                        :value="row.unsalable_judgment"
                        @change="
                            e => handleChange(e, row, 'unsalable_judgment')
                        "
                    >
                        <a-select-option value>
                            {{ $t('action.null') }}
                        </a-select-option>
                        <a-select-option
                            v-for="cate in $dict.SaleState"
                            :key="cate.value"
                        >
                            {{ $t(cate.label) }}
                        </a-select-option>
                    </a-select>
                    <span v-else>{{ row.unsalable_judgment }}</span>
                </template>
                <template slot="memo" slot-scope="text, row">
                    <a-textarea
                        size="small"
                        rows="2"
                        cols="40"
                        style="width:90%;margin: 3px 0;"
                        v-if="
                            editRow.id == row.id &&
                                row.approve_state === 'wait_approve'
                        "
                        :value="row.memo ? row.memo : ''"
                        @change="e => handleChange(e.target.value, row, 'memo')"
                    />
                    <span :title="row.memo" v-else>{{
                        row.memo
                            ? row.memo.length > 24
                                ? row.memo.substr(0, 27) + '...'
                                : row.memo
                            : ''
                    }}</span>
                </template>
                <template slot="reason" slot-scope="text, row">
                    <a-textarea
                        size="small"
                        rows="2"
                        cols="40"
                        style="width:90%;margin: 3px 0;"
                        v-if="
                            editRow.id == row.id &&
                                row.approve_state === 'wait_approve'
                        "
                        :value="row.reason ? row.reason : ''"
                        @change="
                            e => handleChange(e.target.value, row, 'reason')
                        "
                    />
                    <span :title="row.reason" v-else>{{
                        row.reason
                            ? row.reason.length > 24
                                ? row.reason.substr(0, 27) + '...'
                                : row.reason
                            : ''
                    }}</span>
                </template>
                <template slot="approve_state" slot-scope="text, row">
                    {{
                        row.approve_state
                            | dict('UnsalableApproveState')
                            | translate
                    }}
                </template>
                <template slot="department_review" slot-scope="text, row">
                    <a-select
                        v-if="
                            editRow.id == row.id &&
                                row.approve_state === 'wait_approve'
                        "
                        v-decorator="[
                            'department_review',
                            { initialValue: '' }
                        ]"
                        :style="{ width: '100%' }"
                        placeholder="Please Select"
                        size="small"
                        :value="row.department_review"
                        @change="e => handleChange(e, row, 'department_review')"
                    >
                        <a-select-option value>
                            {{ $t('action.null') }}
                        </a-select-option>
                        <a-select-option
                            v-for="cate in $dict.SaleState"
                            :key="cate.value"
                        >
                            {{ $t(cate.label) }}
                        </a-select-option>
                    </a-select>
                    <span v-else>{{
                        row.department_review | dict('SaleState') | translate
                    }}</span>
                </template>
            </GroupbyTable>
        </a-card>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import router from '../../router'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { namespace } from 'vuex-class'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '@/shared/utils/common.service'
import { formConfig } from '@/config/form.config'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import { VendorService } from '../../services/vendor.service'
import { ReportService } from '../../services/report.service'
import moment from 'moment'
import ApplyDiscount from './apply-discount.vue'
import UploadExcel from '@/shared/common/upload-excel.vue'

const datasModule = namespace('datasModule')

@Component({
    components: {
        GroupbyTable,
        AutoColumnTable
    }
})
export default class ProductUnsalableReportContent extends Vue {
    // 表格组件
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    @Prop()
    private page_flag

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private vendorService = new VendorService()
    private reportService = new ReportService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    // 表格数据源
    private data: any[] = []

    private groupbyList: any = []

    private allNameAuth: any = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private queryConsition: any = []

    private current = null
    private orderBy: any = ''

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @datasModule.State
    private vendorList

    @datasModule.Action
    private getVendorList

    private columnList: any = []

    private menu_code: any = ''

    private editRow: any = {
        id: null
    }

    private queryUrl: any = '/report/query_product_unsalable_report'

    private vender_data: any[] = []
    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}

    private yearPickShow = false
    private moment = moment

    @datasModule.State
    private departmentList

    @datasModule.Action
    private getDepartmentList

    private handleOpenChange(status) {
        this.yearPickShow = status
    }

    // 得到年份选择器的值
    private handlePanelChange(value) {
        let values = this.dataForm.getValues()
        values['years'] = value.format('YYYY')
        this.dataForm.setValues(values)
        this.yearPickShow = false
    }

    private get rules() {
        return {}
    }

    private topDepartmentList: any[] = []
    private currentMonth: any = ''

    public created() {
        this.getSystemuser()
        this.getVendorList()
        this.getDepartmentList()
        this.currentMonth = moment(Date.now()).subtract(1, 'months')

        this.topDepartmentList = this.departmentList.filter(
            x => x.dept_type == 30
        )
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
        this.menu_code = CommonService.getMenuCode()
    }

    private onRowClick(row) {
        this.editRow = {
            id: row
        }
    }

    private onGroupbyListChange() {
        this.groupbyList = this.dataForm.checkedGroupbyList
    }

    /**
     * 获取订单数据
     */
    private getDataList() {
        this.dataForm.validateFields().then((values: any) => {
            let sku_type = values['sku_type']
            values[sku_type] = values['sku']
            delete values['sku_type']
            delete values['sku']

            let params: any = CommonService.createQueryCondition(values, {
                default_code: 'in_or_like',
                z_main_category: 'like',
                z_category: 'like',
                z_sub_category: 'like',
                dept_id: 'in',
                ...formConfig.condition
            })

            var nowConditions: any[] = []
            for (var item of params.query_condition) {
                if (item.value.constructor == Array && item.operate !== 'in') {
                    if (
                        item.value.length == 2 &&
                        item.value[0].constructor.name == 'Moment'
                    ) {
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '>=',
                            value: new Date(
                                item.value[0].format('YYYY-MM-DD') + ' 00:00:00'
                            )
                        })
                    }
                    if (
                        item.value.length == 2 &&
                        item.value[1].constructor.name == 'Moment'
                    ) {
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '<=',
                            value: new Date(
                                item.value[1].format('YYYY-MM-DD') +
                                    ' 23:59:59.999999'
                            )
                        })
                    }
                } else {
                    nowConditions.push(item)
                }
            }

            for (let i of nowConditions) {
                if (i.query_name == 'unsalable_judgment') {
                    i.operate =
                        i.value == 'null'
                            ? 'null'
                            : i.value == 'not_null'
                            ? 'not null'
                            : '='
                    if (i.operate != '=') {
                        i.value = ''
                    }
                }
            }

            this.queryConsition = nowConditions

            if (this.groupbyList.length) {
                let groupbyTable: any = this.$refs.groupbyTable
                groupbyTable.getFirstTableData(nowConditions)
            } else {
                params.query_condition = nowConditions
                if (this.orderBy) {
                    params['order_by'] = this.orderBy
                }
                this.innerAction.setActionAPI(
                    this.queryUrl,
                    CommonService.getMenuCode()
                )
                this.publicService
                    .queryPagination(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService,
                            innerAction: this.innerAction
                        })
                    )
                    .subscribe(
                        data => {
                            let msg: any = this.$t('tips.save_success')
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

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private onTableChange(pagination, filters, sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getDataList()
    }

    private onSelectChange(rowkeys) {
        this.selectedRowKeys = rowkeys
    }

    private onApprove() {
        this.innerAction.setActionAPI(
            '/report/approve_product_unsalable_report',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        id_list: this.selectedRowKeys
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.selectedRowKeys = []
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private applyDiscount() {
        this.$modal
            .open(
                ApplyDiscount,
                {
                    ids: this.selectedRowKeys
                },
                {
                    title: this.$t('action.apply_discount'),
                    width: '60%'
                }
            )
            .subscribe(data => {
                this.selectedRowKeys = []
            })
    }

    private needSaveNotes: any = []

    private handleChange(e, row, column) {
        row[column] = e
        let item = this.needSaveNotes.find(x => x.id == row.id)
        if (item) {
            item[column] = e
        } else {
            let param: any = {
                id: row.id
            }
            param[column] = e
            this.needSaveNotes.push(param)
        }
    }

    private changeNote() {
        let rows: any = this.data.filter(
            x =>
                this.selectedRowKeys.includes(x.id) &&
                x.approve_state === 'wait_approve'
        )
        if (!rows.length) {
            this.$message.error('请选择待审核的数据')
            return
        }
        for (let i in rows) {
            if (rows[i].reason != undefined && rows[i].reason == '') {
                rows[i].reason = null
            }
            if (rows[i].memo != undefined && rows[i].memo == '') {
                rows[i].memo = null
            }
            if (
                rows[i].reason !== undefined ||
                rows[i].unsalable_judgment !== undefined
            ) {
                let item = this.data.find(x => x.id == rows[i].id)
                if (
                    (!item.reason && item.unsalable_judgment) ||
                    (item.reason && !item.unsalable_judgment)
                ) {
                    this.$message.error('原因和该月滞销判断(运营)必须同时填写')
                    return
                }
            }
        }

        let parmas = rows.map(x => {
            return {
                id: x.id,
                unsalable_judgment: x.unsalable_judgment,
                memo: x.memo,
                reason: x.reason,
                department_review: x.department_review,
                discount: x.discount,
                discount_start: x.discount_start,
                discount_end: x.discount_end
            }
        })
        this.innerAction.setActionAPI(
            '/report/modify_product_unsalable_report',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        update_data: parmas
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.needSaveNotes = []
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onCreateReport() {
        this.innerAction.setActionAPI(
            '/report/create_product_unsalable_report',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.needSaveNotes = []
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importUnsaleable() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        '/system_api/upload?inner_action=/report/import_product_unsalable_report&menu_code=' +
                        CommonService.getMenuCode('product-unsalable-report'),
                    uploadParams: {},
                    attachmentUrlPath:
                        '/system/download_import_template?type=ProductUnsaleableImport'
                },
                {
                    title: 'Import',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    if (data.message.create_msg) {
                        this.$message.warning(data.message.create_msg)
                    }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private importLeaderUnsaleable() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        '/system_api/upload?inner_action=/report/import_leader_product_unsalable_report&menu_code=' +
                        CommonService.getMenuCode(
                            'product-unsalable-report-leader'
                        ),
                    uploadParams: {},
                    attachmentUrlPath:
                        '/system/download_import_template?type=ProductUnsaleableImport_leader'
                },
                {
                    title: 'Import',
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    if (data.message.create_msg) {
                        this.$message.warning(data.message.create_msg)
                    }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private directApprove() {
        this.innerAction.setActionAPI(
            '/report/one_click_approve_product_unsalable',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getDataList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "action": {
            "create": "Create",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "export": "Export",
            "import": "Import",
            "replenish_split": "ReplenishSplit",
            "add_replenishment_contract": "Add Replenishment Contract",
            "purchase_return": "Purchase Return",
            "apply_discount": "Apply For Discount",
            "save": "Save",
            "approve": "Approve",
            "null": "Null",
            "importUnsaleable": "Import",
            "directApprove":"Directly Approve",
            "confirm_cancel": "Are you sure aprrove?",
            "ok": "Ok",
            "cancel": "Cancel"
        },
        "columns": {
            "z_main_category": "Main Category",
            "z_category": "Category",
            "z_sub_category": "Sub Category",
            "warehouse_id": "Warehouse",
            "year": "Year",
            "month": "Month",
            "week": "Week",
            "order_id": "Order No.",
            "contact_no": "Contact No.",
            "default_code": "Default Code",
            "operator": "Operator",
            "is_need_manual_intervetion": "Need Manual Intervetion",
            "origin_prod_status": "Product Origin State",
            "final_result": "Final Result",
            "approve_state": "Approve State",
            "unsalable_judgment": "Unsalable Judgment"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "forms": {
            "quick_search": "Quick Search",
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search",
            "operator_list": "Multi Search",
            "sku": "SKU",
            "common_sku": "Common SKU",
            "base_sku": "Base SKU",
            "yes": "Yes",
            "no": "No"
        },
        "delete": "Are you sure delete?",
        "cancel": "Are you sure cancel?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "action": {
            "create": "新建采购合同",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "export": "导出",
            "import": "导入",
            "replenish_split": "拆分补货需求",
            "return_purchase": "退回补货",
            "add_replenishment_contract": "新建采购合同",
            "purchase_return": "退回补货",
            "apply_discount": "折扣申请",
            "save": "保存",
            "approve": "审批",
            "null": "无",
            "importUnsaleable": "导入",
            "directApprove":"一键审批",
            "confirm_cancel": "确认审批吗?",
            "ok": "确认",
            "cancel": "取消"
        },
        "columns": {
            "z_main_category": "中文大类",
            "z_category": "中文分类",
            "z_sub_category": "中文子类",
            "warehouse_id": "仓库",
            "year": "年度",
            "month": "月度",
            "week": "周次",
            "order_id": "订单号",
            "contact_no": "合同号",
            "default_code": "货号",
            "operator": "运营",
            "is_need_manual_intervetion": "是否需要人工干预",
            "origin_prod_status": "产品原状态",
            "final_result": "最终结果",
            "approve_state": "审批状态",
            "unsalable_judgment": "该月滞销判断(运营)"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "forms": {
            "quick_search": "快速查找",
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量查询",
            "sku": "货号",
            "common_sku": "通用货号",
            "base_sku": "基础货号",
            "yes": "是",
            "no": "否"
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功"
    }
}
</i18n>
