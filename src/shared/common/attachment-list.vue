<template>
    <section class="component edit-customer">
        <a-card>
            <a-popconfirm
                :title="$t('cancel')"
                :okText="$t('action.ok')"
                :cancelText="$t('action.delete')"
                placement="left"
                @confirm="onBatchDelete()"
                :disabled="!selectedRowKeys.length"
            >
                <a-button type="primary" :disabled="!selectedRowKeys.length">{{
                    $t('action.delete')
                }}</a-button>
            </a-popconfirm>

            <a-button
                @click="getLogs()"
                type="primary"
                style="margin-left:10px"
                >{{ $t('action.search') }}</a-button
            >

            <a-button
                @click="uploadFile()"
                type="primary"
                style="margin-left:10px"
                >{{ $t('action.uploadFile') }}</a-button
            >
            <a-button
                style="margin-left:10px"
                @click="downloadFile()"
                :disabled="!selectedRowKeys.length"
                type="primary"
                >{{ $t('action.downloadFile') }}</a-button
            >
        </a-card>

        <a-card class="margin-y" style="margin:0 !important;">
            <data-table
                :stripe="true"
                :data="logs"
                :page="pageService"
                rowKey="attachment_code"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getLogs"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                style="table-layout:fixed;"
            >
                <a-table-column
                    :title="$t('columns.attachment_code')"
                    key="attachment_code"
                    data-index="attachment_code"
                    align="left"
                    width="10%"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.attachment_object_code')"
                    key="attachment_object_code"
                    data-index="attachment_object_code"
                    align="center"
                    width="10%"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.virtual_table_name')"
                    key="virtual_table_name"
                    data-index="virtual_table_name"
                    align="center"
                    width="10%"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.local_attachment')"
                    key="local_attachment"
                    align="center"
                    width="10%"
                >
                    <template slot-scope="row">
                        <span v-if="row.local_attachment">
                            <input type="checkbox" checked disabled />
                        </span>
                        <span v-else>
                            <input type="checkbox" disabled />
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.file_name')"
                    key="file_name"
                    data-index="file_name"
                    align="center"
                    width="10%"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.mimetype')"
                    key="mimetype"
                    data-index="mimetype"
                    align="center"
                    width="10%"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.file_size')"
                    key="file_size"
                    data-index="file_size"
                    align="center"
                    width="10%"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.create_uid')"
                    key="create_uid"
                    align="center"
                    width="10%"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.create_date')"
                    key="create_date"
                    data-index="create_date"
                    align="center"
                    width="10%"
                >
                </a-table-column>
            </data-table>
        </a-card>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from 'vue-property-decorator'
import moment from 'moment'
import { RequestParams } from '../../core/http'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { Mutation, namespace } from 'vuex-class'
import store from '~/store'
import { CommonService } from '@/shared/utils/common.service'
import { PageService } from '~/bootstrap/services/page.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import appConfig from '@/config/app.config'
import UploadExcel from '~/shared/common/upload-excel.vue'

@Component({
    components: {
        UploadExcel
    }
})
export default class AttachmentList extends Vue {
    @Prop()
    attachment_object_code: any

    @Prop()
    virtual_table_name: any

    private dataForm: any = this.$form.createForm(this, { name: 'filter' })

    @Ref()
    readonly pageContainer!: PageContainer

    private systemUsers: any = []

    private logs: any[] = []

    private loadingService = new LoadingService()
    private innerAction = new InnerActionService()
    private publicService = new PublicService()
    private pageService = new PageService()

    @Watch('attachment_object_code')
    onRecordCodeChange() {
        this.getLogs()
    }
    private selectedRowKeys: any[] = []

    private onBatchDelete() {
        this.innerAction.setActionAPI(
            'common_management/delete_attachment',
            CommonService.getMenuCode('attachment-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        attachment_code_list: this.selectedRowKeys
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getLogs()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private downloadFile() {
        let urlParams = encodeURIComponent(JSON.stringify(this.selectedRowKeys))
        window.open(
            appConfig.server +
                '/system_api/download?inner_action=common_management/download_attachment&menu_code=' +
                CommonService.getMenuCode('attachment-manage') +
                '&attachment_code_list=' +
                urlParams
        )
    }

    private uploadFile() {
        this.$modal
            .open(
                UploadExcel,
                {
                    urlPath:
                        '/system_api/upload?inner_action=common_management/upload_attachment&menu_code=' +
                        CommonService.getMenuCode('attachment-manage') +
                        '&id=' +
                        this.attachment_object_code +
                        '&virtual_table_name=' +
                        this.virtual_table_name,
                    fileExt: '*'
                },
                {
                    title: '文件上传'
                }
            )
            .subscribe(
                () => {},
                err => {
                    this.$message.error(err)
                }
            )
    }

    private created() {}

    private mounted() {
        store.dispatch('datasModule/getSystemuser')
        this.getLogs()
    }

    private getLogs() {
        let params: any = CommonService.createQueryCondition(
            {
                attachment_object_code: this.attachment_object_code.toString(),
                virtual_table_name: this.virtual_table_name
            },
            {
                attachment_object_code: '=',
                virtual_table_name: '='
            }
        )
        this.innerAction.setActionAPI(
            'common_management/query_all_attachment',
            CommonService.getMenuCode('attachment-manage')
        )
        this.publicService
            .queryPagination(
                new RequestParams(params, {
                    loading: this.loadingService,
                    page: this.pageService,
                    innerAction: this.innerAction
                })
            )
            .subscribe(
                data => {
                    let users: any = store.state.datasModule.systemUsers
                    for (var item of data) {
                        var sysuser = users.find(
                            x => x.code === item.create_uid
                        )
                        item['create_uid'] = sysuser
                            ? sysuser.name
                            : item.who_log
                        let localTime = moment.utc(item['create_date']).toDate()
                        item['create_date'] = moment(localTime).format(
                            'YYYY-MM-DD HH:mm'
                        )
                    }
                    this.logs = data
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
    "desc": "",
    "delete":"Are you sure delete?",
    "cancel":"Are you sure cancel?",    
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Inactive Success",    
    "action":{
        "delete":"delete",
        "search":"search",
        "uploadFile":"uploadFile",
        "downloadFile":"downloadFile"
    },
    "columns":{
       "attachment_code":"attachment_code",
       "attachment_object_code":"attachment_object_code",
       "virtual_table_name":"virtual_table_name",
       "local_attachment":"local_attachment",
       "file_name":"file_name",
       "mimetype":"mimetype",
       "file_size":"file_size",
       "create_uid":"create_uid",
       "create_date":"create_date"
    }
  },
  "zh-cn": {
    "desc": "",
    "delete":"是否确认删除?",
    "cancel":"是否确认取消?",    
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "delete_success":"归档成功",    
    "action":{
        "delete":"删除",
        "search":"查询",
        "uploadFile":"上传",
        "downloadFile":"下载"
    },    
    "columns":{
       "attachment_code":"附件编码",
       "attachment_object_code":"附件所属编号",
       "virtual_table_name":"附件所属表",
       "local_attachment":"是否本地附件",
       "file_name":"文件名",
       "mimetype":"文件类型",
       "file_size":"文件大小",
       "create_uid":"创建人",
       "create_date":"创建时间"
    }
  }
}
</i18n>
