<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form ref="dataForm" @submit="getProblemPictureList" :column="2">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.default_code')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['default_code']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.order_name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['order_name']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['z_sub_category']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.create_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        v-decorator="['create_date']"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['name']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.go_amazon_mails2')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['go_amazon_mails2']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.date_order')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker v-decorator="['date_order']" size="small" />
                </a-form-item>
            </template>
            <template #action>
                <a-button @click="downloadZip" type="primary">{{
                    $t('action.downloadZip')
                }}</a-button>
                <a-button @click="uploadFile" type="primary">{{
                    $t('action.upload_zip_file')
                }}</a-button>
            </template>
        </data-form>
        <a-card class="margin-y">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="id"
                style="table-layout:fixed;"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: (keys, select_rows) => {
                        selectedRows = select_rows
                        selectedRowKeys = keys
                    }
                }"
                @on-page-change="getProblemPictureList"
                :scroll="{ x: 2000, y: 400 }"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                        onTrClick(record)
                    }
                "
            >
                <!-- <a-table-column
                    :title="$t('columns.order_id')"
                    key="rel_name"
                    align="left"
                    dataIndex="order_id"
                >
                </a-table-column> -->
                <a-table-column
                    :title="$t('columns.default_code')"
                    key="default_code"
                    align="left"
                    dataIndex="default_code"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.order_name')"
                    key="order_name"
                    align="left"
                    dataIndex="order_name"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.date_order')"
                    key="date_order"
                    align="center"
                    dataIndex="date_order"
                >
                    <template slot-scope="date_order">
                        <span>{{ date_order | datetolocal }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.go_amazon_mails2')"
                    key="go_amazon_mails2"
                    align="left"
                >
                    <template slot-scope="row"
                        ><span :title="row.go_amazon_mails2">{{
                            row.go_amazon_mails2
                                ? row.go_amazon_mails2.substr(0, 20) + '...'
                                : ''
                        }}</span></template
                    >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.product_name')"
                    key="product_name"
                    align="left"
                >
                    <template slot-scope="row"
                        ><span :title="row.product_name">{{
                            row.product_name
                                ? row.product_name.substr(0, 17) + '...'
                                : ''
                        }}</span></template
                    >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.z_sub_category')"
                    key="z_sub_category"
                    align="left"
                    dataIndex="z_sub_category"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.user_id')"
                    key="user_id"
                    align="left"
                    dataIndex="user_id"
                >
                    <template slot-scope="user_id">
                        <span>{{ userDict[user_id] }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.file_name')"
                    key="file_name"
                    :width="200"
                    align="left"
                    dataIndex="file_name"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.remote_file_name')"
                    key="remote_file_name"
                    :width="300"
                    align="left"
                >
                    <template slot-scope="row">
                        <a-popover>
                            <template slot="content">
                                <img
                                    style="max-width:300px"
                                    :src="
                                        url_pre +
                                            '/custom_problem/download_pic?remote_file_name=' +
                                            encodeURIComponent(
                                                row.remote_file_name
                                            )
                                    "
                                />
                            </template>
                            <a @click="showPic(row)">{{
                                row.remote_file_name
                            }}</a>
                        </a-popover>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.cs_memo')"
                    key="cs_memo"
                    align="left"
                    dataIndex="cs_memo"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.ticket_id')"
                    key="ticket_id"
                    align="left"
                    dataIndex="ticket_id"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.create_date')"
                    key="create_date"
                    align="center"
                    dataIndex="create_date"
                >
                    <template slot-scope="create_date">
                        <span>{{ create_date | datetolocal }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.write_uid')"
                    key="write_uid"
                    align="center"
                    dataIndex="write_uid"
                >
                    <template slot-scope="write_uid">
                        <span>{{ write_uid | dict2(systemUsers) }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.write_date')"
                    key="write_date"
                    align="center"
                    dataIndex="write_date"
                >
                    <template slot-scope="write_date">
                        <span>{{ write_date | datetolocal }}</span>
                    </template>
                </a-table-column>
            </data-table>
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
import { Vue, Component, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { PageService } from '~/bootstrap/services/page.service'
import { CustomProblemService } from '../../services/custom_problem.service'
import PageContainer from '../../shared/components/page-container.vue'
import { OperateLogService } from '../../services/operatelog.service'
import { formConfig } from '../../config/form.config'
import LogView from '~/shared/common/log-view.vue'
import DataForm from '~/shared/components/data-form.vue'
import { RequestParams } from '../../core/http'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { CommonService } from '../../shared/utils/common.service'
import { Mutation, namespace } from 'vuex-class'
import appConfig from '../../config/app.config'
import UploadExcel from '~/shared/common/upload-excel.vue'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'problem-picture'
})
@Component({
    components: {
        LogView,
        UploadExcel
    }
})
export default class problemPicture extends Vue {
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private customProblemService = new CustomProblemService()

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    // 表格数据源
    private data: any[] = []

    private object_name = 'customer_problem_pic_list'

    private record_code = ''
    // 表格选择项
    private selectedRowKeys: any[] = []

    private selectedRows: any[] = []

    private userDict = {}

    private url_pre = appConfig.server

    private created() {
        this.getSystemuser()
    }

    private mounted() {
        this.getuserDict()
    }
    @Watch('systemUsers')
    getuserDict() {
        for (let i of this.systemUsers) {
            this.userDict[i.code] = i.name
        }
    }

    private getProblemPictureList() {
        this.dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                order_id: 'like',
                default_code: 'like',
                name: 'like',
                go_amazon_mails2: 'like',
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
            params.query_condition = nowConditions
            this.customProblemService
                .queryAllPic(
                    new RequestParams(params, {
                        page: this.pageService,
                        loading: this.loadingService
                    })
                )
                .subscribe(
                    data => {
                        this.data = data
                        if (!this.record_code) {
                            this.record_code = data[0].id
                        }
                        // if (!this.selectedRows[0]) {
                        this.selectedRows = [data[0]]
                        this.selectedRowKeys = [data[0].id]
                        // }
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private showPic(row) {
        let url =
            appConfig.server +
            '/custom_problem/download_pic?remote_file_name=' +
            encodeURIComponent(row.remote_file_name)

        window.open(url)
    }

    private downloadZip() {
        let cp_pic_id_list: any = []
        this.selectedRows.map(x => cp_pic_id_list.push(x['id']))

        if (cp_pic_id_list.length == 0) {
            this.$info({
                title: 'Info',
                content: this.$t('form.need_selected_rows')
            })
            return
        }

        let url =
            appConfig.server +
            '/custom_problem/batch_download_pic?cp_pic_id_list=' +
            JSON.stringify(cp_pic_id_list)
        window.open(url)
    }

    private uploadFile() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath: '/custom_problem/upload_cp_pic_zipfile',
                    fileExt: '.rar,.zip',
                    multi: true
                },
                {
                    title: this.$t('action.excel_import')
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.selectedRowKeys = []
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
    "columns":{
      "order_id":"Order Id",
      "product_tmp_id":"Product tmp Id",
      "ticket_id":"Ticket Id",
      "file_name":"File Name",
      "user_id":"Customer Service",
      "cs_memo":"Customer Memo",
      "default_code":"Default Code",
      "order_name":"Order Number",
      "write_date":"Write Date",
      "go_amazon_mails2":"Customer Email",
      "name":"Subject",
      "product_name":"Product Name",
      "z_sub_category":"Sub Category",
      "date_order":"Order Date"
    },
    "form":{
       "status":"Status",
       "customer_code":"Customer Code",
       "company_name":"Company Name",
       "contract_start":"Contract Start Date",
       "remote_file_name":"Router url",
       "contract_end":"Contract End Date",
       "female":"Female",
       "field":"Field",
       "need_selected_rows":"Please select at least one row"
    },
    "action":{
      "downloadZip":"Batch Download",
      "delete":"Delete",
      "detail":"Detail",
      "upload_zip_file":"Upload Zip File",
      "excel_import":"Upload Zip File"
    },
    "rules":{
       "date_range_error":"start date can't later start date"
    },
    "delete":"Are you sure delete?",
    "fuzzy_search":"Fuzzy Search"
  },
  "zh-cn": {
    "desc": "这是订单页面1",
    "columns":{
      "order_id":"订单id",
      "product_tmp_id":"产品模板id",
      "ticket_id":"Ticket Id",
      "file_name":"文件名",
      "user_id":"客服",
      "cs_memo":"客服备注",
      "default_code":"产品编码",
      "remote_file_name":"路径名",
      "order_name":"订单号",
      "write_date":"修改时间",
      "go_amazon_mails2":"客户邮箱",
      "name":"主题",
      "product_name":"产品名称",
      "z_sub_category":"中文子类",
      "date_order":"订单日期"
    },
    "form":{
       "status":"状态",
       "customer_code":"客户编号",
       "company_name":"公司名称",
       "contract_start":"合同开始日期",
       "contract_end":"合同结束日期",
       "field":"字段",
       "need_selected_rows":"请至少选择一行"
    },
    "action":{
      "downloadZip":"批量下载",
      "delete":"删除",
      "detail":"详情",
      "upload_zip_file":"上传图片压缩包",
      "excel_import":"上传图片压缩包"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "delete":"是否确认删除?",
    "fuzzy_search":"模糊搜索"
  }
}
</i18n>
