<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form ref="dataForm" @submit="getPresaleList" :column="1">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.pre_sale_start')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        v-decorator="['pre_sale_start']"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.sku')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['sku']"
                        :style="{ width: '323px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.basic_sku')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['basic_sku']"
                        :style="{ width: '323px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.package_num')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['package_num']"
                        :style="{ width: '323px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.department')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['department']"
                        :style="{ width: '323px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
            </template>
            <template #action>
                <a-button type="primary" @click="uploadFile()"
                    >{{ $t('action.upload_file') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="release()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.release') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="getInfo()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.get_info') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="save()"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.save') }}
                </a-button>
            </template>
        </data-form>
        <a-card class="margin-y" style="margin:0 !important">
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
                    @on-page-change="getPresaleList"
                    @onClick="
                        record => {
                            selectedRowKeys = [record]
                            onTrClick(record)
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 1560, y: 500 }"
                    :queryUrl="queryUrl"
                    :menu_code="menu_code"
                    :queryCondition="queryConsition"
                >
                    <span slot="check_render" slot-scope="text"
                        ><a-checkbox disabled :checked="text" />
                    </span>
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <template slot="sku" slot-scope="text, row">
                        <a-input
                            v-if="editRow.id == row.id"
                            :value="editRow.sku"
                            @change="
                                e => handleChange(e.target.value, row, 'sku')
                            "
                        />
                        <span v-else>{{ text }}</span>
                    </template>
                    <template slot="basic_sku" slot-scope="basic_sku, row">
                        <a-input
                            v-if="editRow.id == row.id"
                            :value="editRow.basic_sku"
                            @change="
                                e =>
                                    handleChange(
                                        e.target.value,
                                        row,
                                        'basic_sku'
                                    )
                            "
                        />
                        <span v-else>{{ basic_sku }}</span>
                    </template>
                    <template
                        slot="pre_sale_start"
                        slot-scope="pre_sale_start, row"
                    >
                        <a-date-picker
                            showTime
                            v-if="editRow.id == row.id"
                            valueFormat="YYYY-MM-DD HH:mm:ss"
                            :style="{ minWidth: '100%', width: '100%' }"
                            :value="editRow.pre_sale_start | datetolocal"
                            @change="
                                e => handleChange(e, row, 'pre_sale_start')
                            "
                        />
                        <span v-else>{{ pre_sale_start | datetolocal }}</span>
                    </template>
                    <template
                        slot="pre_sale_end"
                        slot-scope="pre_sale_end, row"
                    >
                        <a-date-picker
                            showTime
                            v-if="editRow.id == row.id"
                            valueFormat="YYYY-MM-DD HH:mm:ss"
                            :style="{ minWidth: '100%', width: '100%' }"
                            :value="editRow.pre_sale_end | datetolocal"
                            @change="e => handleChange(e, row, 'pre_sale_end')"
                        />
                        <span v-else>{{ pre_sale_end | datetolocal }}</span>
                    </template>
                    <template
                        slot="pre_sale_update"
                        slot-scope="pre_sale_update, row"
                    >
                        <a-date-picker
                            v-if="editRow.id == row.id"
                            valueFormat="YYYY-MM-DD"
                            :value="editRow.pre_sale_update | datetolocal"
                            @change="
                                e => handleChange(e, row, 'pre_sale_update')
                            "
                        />
                        <span v-else>{{ pre_sale_update | datetolocal }}</span>
                    </template>
                    <template
                        slot="pre_sale_delay"
                        slot-scope="pre_sale_delay, row"
                    >
                        <a-date-picker
                            v-if="editRow.id == row.id"
                            valueFormat="YYYY-MM-DD"
                            :value="editRow.pre_sale_delay | datetolocal"
                            @change="
                                e => handleChange(e, row, 'pre_sale_delay')
                            "
                        />
                        <span v-else>{{ pre_sale_delay | datetolocal }}</span>
                    </template>
                    <template
                        slot="warning_state"
                        slot-scope="warning_state, row"
                    >
                        <span v-if="editRow.id == row.id">
                            <a-checkbox
                                @change="
                                    e =>
                                        handleChange(
                                            e.target.checked,
                                            row,
                                            'warning_state'
                                        )
                                "
                                :checked="editRow.warning_state"
                            />
                        </span>
                        <span v-else>
                            <a-checkbox :checked="warning_state" disabled />
                        </span>
                    </template>
                    <template
                        slot="finish_create_release"
                        slot-scope="finish_create_release, row"
                    >
                        <span v-if="editRow.id == row.id">
                            <a-checkbox
                                @change="
                                    e =>
                                        handleChange(
                                            e.target.checked,
                                            row,
                                            'finish_create_release'
                                        )
                                "
                                :checked="editRow.finish_create_release"
                            />
                        </span>
                        <span v-else>
                            <a-checkbox
                                :checked="finish_create_release"
                                disabled
                            />
                        </span>
                    </template>
                    <template slot="package_num" slot-scope="package_num, row">
                        <a-input
                            v-if="editRow.id == row.id"
                            :value="editRow.package_num"
                            @change="
                                e =>
                                    handleChange(
                                        e.target.value,
                                        row,
                                        'package_num'
                                    )
                            "
                        />
                        <span v-else>{{ package_num }}</span>
                    </template>
                    <template
                        slot="pre_sale_qty"
                        slot-scope="pre_sale_qty, row"
                    >
                        <a-input-number
                            v-if="editRow.id == row.id"
                            :value="editRow.pre_sale_qty"
                            decimalSeparator=","
                            @change="e => handleChange(e, row, 'pre_sale_qty')"
                        />
                        <span v-else>{{ pre_sale_qty }}</span>
                    </template>
                    <template slot="department" slot-scope="department, row">
                        <a-input
                            v-if="editRow.id == row.id"
                            :value="editRow.department"
                            @change="
                                e =>
                                    handleChange(
                                        e.target.value,
                                        row,
                                        'department'
                                    )
                            "
                        />
                        <span v-else>{{ department }}</span>
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
                @rowClick="onTrClick"
            >
                <span slot="check_render" slot-scope="text"
                    ><a-checkbox disabled :checked="text" />
                </span>
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
                <span slot="user_render" slot-scope="text"
                    >{{ text | dict2(systemUsers) }}
                </span>
                <template slot="sku" slot-scope="sku, row">
                    <a-input
                        v-if="editRow.id == row.id"
                        :value="editRow.sku"
                        @change="e => handleChange(e.target.value, row, 'sku')"
                    />
                    <span v-else>{{ sku }}</span>
                </template>
                <template slot="basic_sku" slot-scope="basic_sku, row">
                    <a-input
                        v-if="editRow.id == row.id"
                        :value="editRow.basic_sku"
                        @change="
                            e => handleChange(e.target.value, row, 'basic_sku')
                        "
                    />
                    <span v-else>{{ basic_sku }}</span>
                </template>
                <template
                    slot="pre_sale_start"
                    slot-scope="pre_sale_start, row"
                >
                    <a-date-picker
                        showTime
                        v-if="editRow.id == row.id"
                        valueFormat="YYYY-MM-DD HH:mm:ss"
                        :value="editRow.pre_sale_start | datetolocal"
                        @change="e => handleChange(e, row, 'pre_sale_start')"
                    />
                    <span v-else>{{ pre_sale_start | datetolocal }}</span>
                </template>
                <template slot="pre_sale_end" slot-scope="pre_sale_end, row">
                    <a-date-picker
                        showTime
                        v-if="editRow.id == row.id"
                        valueFormat="YYYY-MM-DD HH:mm:ss"
                        :value="editRow.pre_sale_end | datetolocal"
                        @change="e => handleChange(e, row, 'pre_sale_end')"
                    />
                    <span v-else>{{ pre_sale_end | datetolocal }}</span>
                </template>
                <template
                    slot="pre_sale_update"
                    slot-scope="pre_sale_update, row"
                >
                    <a-date-picker
                        v-if="editRow.id == row.id"
                        valueFormat="YYYY-MM-DD"
                        :value="editRow.pre_sale_update | datetolocal"
                        @change="e => handleChange(e, row, 'pre_sale_update')"
                    />
                    <span v-else>{{ pre_sale_update | datetolocal }}</span>
                </template>
                <template
                    slot="pre_sale_delay"
                    slot-scope="pre_sale_delay, row"
                >
                    <a-date-picker
                        v-if="editRow.id == row.id"
                        valueFormat="YYYY-MM-DD"
                        :value="editRow.pre_sale_delay | datetolocal"
                        @change="e => handleChange(e, row, 'pre_sale_delay')"
                    />
                    <span v-else>{{ pre_sale_delay | datetolocal }}</span>
                </template>
                <template slot="warning_state" slot-scope="warning_state, row">
                    <span v-if="editRow.id == row.id">
                        <a-checkbox
                            @change="
                                e =>
                                    handleChange(
                                        e.target.checked,
                                        row,
                                        'warning_state'
                                    )
                            "
                            :checked="editRow.warning_state"
                        />
                    </span>
                    <span v-else>
                        <a-checkbox :checked="warning_state" disabled />
                    </span>
                </template>
                <template
                    slot="finish_create_release"
                    slot-scope="finish_create_release, row"
                >
                    <span v-if="editRow.id == row.id">
                        <a-checkbox
                            @change="
                                e =>
                                    handleChange(
                                        e.target.checked,
                                        row,
                                        'finish_create_release'
                                    )
                            "
                            :checked="editRow.finish_create_release"
                        />
                    </span>
                    <span v-else>
                        <a-checkbox :checked="finish_create_release" disabled />
                    </span>
                </template>
                <template slot="package_num" slot-scope="package_num, row">
                    <a-input
                        v-if="editRow.id == row.id"
                        :value="editRow.package_num"
                        @change="
                            e =>
                                handleChange(e.target.value, row, 'package_num')
                        "
                    />
                    <span v-else>{{ package_num }}</span>
                </template>
                <template slot="pre_sale_qty" slot-scope="pre_sale_qty, row">
                    <a-input-number
                        v-if="editRow.id == row.id"
                        :value="editRow.pre_sale_qty"
                        decimalSeparator=","
                        @change="e => handleChange(e, row, 'pre_sale_qty')"
                    />
                    <span v-else>{{ pre_sale_qty }}</span>
                </template>
                <template slot="department" slot-scope="department, row">
                    <a-input
                        v-if="editRow.id == row.id"
                        :value="editRow.department"
                        @change="
                            e => handleChange(e.target.value, row, 'department')
                        "
                    />
                    <span v-else>{{ department }}</span>
                </template>
            </GroupbyTable>
        </a-card>
        <a-card v-if="selectedRows[0]">
            <LogView
                :object_name="object_name"
                :record_code="record_code"
            ></LogView>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { PresaleManageService } from '~/services/presale_manage.service'
import DataForm from '~/shared/components/data-form.vue'
import LogView from '~/shared/common/log-view.vue'
import UploadExcel from '~/shared/common/upload-excel.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import ShipmentTypeEdit from '@/components/picking/shipment-type-edit.vue'
import { Theme } from '@fullcalendar/core'
import moment from 'moment'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

const datasModule = namespace('datasModule')
const userModule = namespace('userModule')

@Page({
    layout: 'workspace',
    name: 'presale-manage'
})
@Component({
    components: {
        LogView,
        UploadExcel,
        GroupbyTable,
        AutoColumnTable
    }
})
export default class PresaleManage extends Vue {
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private presaleManageService = new PresaleManageService()
    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    // 表格数据源
    private data: any[] = []

    private object_name = 'pre_sale_management'

    private record_code = ''
    // 表格选择项
    private selectedRowKeys: any[] = []

    private selectedRows: any[] = []

    private countryList: any[] = []

    private sellerList: any[] = []

    private shipTypeList: any[] = []

    private moment = moment

    private userDict = {}

    private groupbyList: any = []

    private allNameAuth: any = []

    private columnList: any = []

    private queryUrl: any = '/pre-sale/query_all_pre_sale'

    private queryConsition: any = []

    private menu_code: any = ''

    private editRow: any = {
        id: null
    }

    private change_msg: string = ''

    private change_value: any = {}

    private orderBy: any = 'pre_sale_start desc'

    private created() {
        this.getSystemuser()
        for (let i of this.systemUsers) {
            this.userDict[i.code] = i.name
        }
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
        this.menu_code = this.dataForm.menu_code
    }

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getPresaleList()
    }

    private getPresaleList() {
        let params: any = {}
        this.getQueryCondition().then(nowConditions => {
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
                            this.data = data
                            this.selectedRowKeys = []
                            this.selectedRows = []
                            if (!this.record_code) {
                                this.record_code = data[0].id
                            }
                            if (!this.selectedRows[0]) {
                                this.selectedRows = [data[0]]
                                this.selectedRowKeys = [data[0].id]
                            }
                            this.editRow = this.data[0]
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
                    let params: any = CommonService.createQueryCondition(
                        values,
                        {
                            sku: 'like',
                            basic_sku: 'like',
                            package_num: 'like',
                            department: 'like',
                            ...formConfig.condition
                        }
                    )

                    var nowConditions: any[] = []
                    for (var item of params.query_condition) {
                        if (item.value.constructor == Array) {
                            if (
                                item.value.length == 2 &&
                                item.value[0].constructor.name == 'Moment'
                            ) {
                                nowConditions.push({
                                    query_name: item.query_name,
                                    operate: '>=',
                                    value: new Date(
                                        item.value[0].format('YYYY-MM-DD') +
                                            ' 00:00:00'
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
                    reslove(nowConditions)
                })
                .catch(err => {
                    this.$message.error(JSON.stringify(err))
                })
        })
    }

    private handleChange(value, row, column) {
        let newdata = {
            ...this.editRow
        }
        newdata[column] = value
        this.editRow = newdata
    }

    private getChangeValue() {
        let last_edit = this.data.find(x => x.id == this.editRow.id)
        if (last_edit) {
            this.change_value['id'] = this.editRow.id
            this.change_msg = ''
            for (let k in last_edit) {
                if (last_edit[k] !== this.editRow[k]) {
                    this.change_value[k] = this.editRow[k]
                    this.change_msg +=
                        this.$t('columns.' + k) +
                        ':' +
                        last_edit[k] +
                        '=>' +
                        this.editRow[k] +
                        '  \n'
                }
            }
        }
    }

    private onTrClick(record) {
        if (record == this.editRow.id) {
            return
        }
        this.getChangeValue()
        if (Object.keys(this.change_value).length > 1) {
            var that = this
            this.$confirm({
                title: '检测到变化,是否进行保存?',
                content: that.change_msg,
                onOk() {
                    that.save()
                },
                onCancel() {
                    that.change_value = {}
                }
            })
        }
        const newData = [...this.data]
        let info = this.data.find(x => x.id === record)
        if (info) {
            this.editRow = {
                ...info
            }
            this.selectedRows = [info]
            this.record_code = info.id
            this.data = newData
        }
    }

    private save() {
        if (this.selectedRows.length > 1) {
            this.$message.error('只限单条保存')
        }

        this.getChangeValue()

        let data = {
            save_flag: 1,
            id: this.editRow.id,
            package_num: this.editRow.package_num,
            pre_sale_end: this.editRow.pre_sale_end,
            pre_sale_start: this.editRow.pre_sale_start,
            sku: this.editRow.sku,
            ...this.change_value
        }
        if (data.hasOwnProperty('pre_sale_start')) {
            data['pre_sale_start'] = moment(data['pre_sale_start'])
                .utc()
                .format('YYYY-MM-DD HH:mm:ss')
        }
        if (data.hasOwnProperty('pre_sale_end')) {
            data['pre_sale_end'] = moment(data['pre_sale_end'])
                .utc()
                .format('YYYY-MM-DD HH:mm:ss')
        }
        this.presaleManageService
            .save(new RequestParams(data, { loading: this.loadingService }))
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getPresaleList()
                    // const newData = [...this.data]
                    // let info = this.data.find(x => x.id === data.id)
                    // this.data = newData
                },
                err => {
                    this.$message.error(err.message)
                }
            )
        this.change_value = {}
    }

    private uploadFile() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath: '/pre_sale_management/upload_file'
                },
                {
                    title: 'Excel导入',
                    width: '1000px'
                }
            )
            .subscribe(data => {})
    }

    private release() {
        this.presaleManageService
            .release(
                new RequestParams(
                    { pre_sale_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('释放成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getInfo() {
        this.presaleManageService
            .getInfo(
                new RequestParams(
                    { pre_sale_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onSelectChange(rowkeys) {
        this.selectedRowKeys = rowkeys
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "",
        "columns": {
            "sku": "sku",
            "is_pack": "Is Pack",
            "basic_sku": "Basic Sku",
            "is_pre_sale": "Is Pre Sale",
            "pre_sale_start": "Pre Sale Start",
            "pre_sale_end": "Pre Sale End",
            "pre_sale_update": "Pre Sale Update",
            "pre_sale_delay": "Pre Sale Delay",
            "warning_state": "Warning State",
            "package_num": "Package Num",
            "warehouse": "Warehouse",
            "pre_sale_qty": "Pre Sale Qty",
            "department": "Department",
            "create_uid": "Create_uid",
            "arrival_qty": "Arrival Qty",
            "eta_date": "Eta Date",
            "eta_update_date": "Eta Update Date",
            "eta_update_count": "Eta Update Count",
            "package_eta_memo": "Package Eta Memo",
            "etd_date": "Etd Date",
            "etd_update_date": "Etd Update Date",
            "etd_update_count": "Etd_update Count",
            "package_etd_memo": "Package_etd Memo",
            "stock_date": "Stock Date",
            "finish_create_release": "Finish Create Release",
            "memo": "Memo",
            "transit_sku": "Transit Sku"
        },
        "action": {
            "cancel": "Cancel",
            "edit": "Edit",
            "upload_file": "upload_file",
            "release": "release",
            "get_info": "get_info",
            "save": "save"
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
            "sku": "预售货号",
            "is_pack": "组合",
            "basic_sku": "基础货号",
            "is_pre_sale": "基础预售",
            "pre_sale_start": "预售开始时间",
            "pre_sale_end": "预售结束时间",
            "pre_sale_update": "预售异常调整日期",
            "pre_sale_delay": "预售结束延迟日期",
            "warning_state": "逾期警告",
            "package_num": "货柜编号",
            "warehouse": "仓库",
            "pre_sale_qty": "已预售数量",
            "department": "所属部门",
            "create_uid": "创建人",
            "arrival_qty": "基础产品数量",
            "eta_date": "ETA",
            "eta_update_date": "ETA更新后日期",
            "eta_update_count": "AC",
            "package_eta_memo": "货柜ETA备注",
            "etd_date": "ETD",
            "etd_update_date": "ETD更新后日期",
            "etd_update_count": "DC",
            "package_etd_memo": "货柜ETD",
            "stock_date": "入库/释放时间",
            "finish_create_release": "完成创建释放",
            "memo": "备注",
            "transit_sku": "过渡货号"
        },
        "action": {
            "cancel": "取消",
            "edit": "编辑",
            "upload_file": "上传Excel",
            "release": "生成释放报告",
            "get_info": "获取货柜及产品信息",
            "save": "保存"
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
