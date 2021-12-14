<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form ref="dataForm" @submit="getIllegalWordsList" :column="1">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.platform')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="[
                            `platform`,
                            {
                                initialValue: 20
                            }
                        ]"
                        style="width: 240px"
                        :placeholder="$t('columns.platform')"
                        size="small"
                        :allowClear="true"
                    >
                        <a-select-option
                            v-for="d in $dict.SellerPlatform"
                            :key="d.value"
                            :value="d.value"
                            >{{ $t(d.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.lang_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        :allowClear="true"
                        v-decorator="['lang_id']"
                        :style="{ width: '240px' }"
                        :placeholder="$t('select_language')"
                        size="small"
                    >
                        <a-select-option
                            :value="item.code"
                            v-for="item of langList"
                            :key="item.code"
                            >{{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.illegal_words')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['illegal_words']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.status')"
                    v-decorator="['status', { initialValue: '' }]"
                    size="small"
                    :style="{ height: '20px' }"
                    buttonStyle="solid"
                    @change="e => onStatusChange(e)"
                >
                    <a-radio-group
                        v-decorator="['status', { initialValue: 20 }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onStatusChange(e)"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of $dict.illegalWords"
                            :key="item.value"
                            >{{ $t(item.label) }}
                        </a-radio-button>
                    </a-radio-group>
                    <!-- <a-radio-group>
                        <a-radio-button value="20">
                            {{ 20 | dict('illegal_words')
                                | translate }}
                        </a-radio-button>
                    </a-radio-group>
                    <a-radio-group>
                        <a-radio-button value="60">
                            {{ 60 | dict('illegal_words')
                                | translate }}
                        </a-radio-button>
                    </a-radio-group> -->
                </a-form-item>
            </template>
            <template #action>
                <a-button @click="onCreate" type="primary"
                    >{{ $t('action.create') }}
                </a-button>
                <a-popconfirm
                    :title="$t('action.batch_cancel')"
                    :okText="$t('yes')"
                    :cancelText="$t('action.cancel')"
                    placement="left"
                    @confirm="batchDelete()"
                    :disabled="!selectedRowKeys.length"
                >
                    <a-button type="primary" :disabled="!selectedRowKeys.length"
                        >{{ $t('action.batch_cancel') }}
                    </a-button>
                </a-popconfirm>
                <a-button @click="import_excel" type="primary"
                    >{{ $t('action.import_excel') }}
                </a-button>
            </template>
        </data-form>
        <a-card class="margin-y" style="margin:0 !important">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="id"
                style="table-layout:fixed;"
                :scroll="{ y: 360 }"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: (keys, select_rows) => {
                        selectedRows = select_rows
                        selectedRowKeys = keys
                    }
                }"
                @on-page-change="getIllegalWordsList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                        onTrClick(record)
                    }
                "
            >
                <a-table-column
                    :title="$t('columns.platform')"
                    key="rel_name"
                    align="center"
                    dataIndex="platform"
                >
                    <template slot-scope="platform">
                        <span>{{
                            platform | dict('SellerPlatform') | translate
                        }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.lang_id')"
                    key="rel_name"
                    align="left"
                    dataIndex="lang_id"
                >
                    <template slot-scope="lang_id">
                        <span>{{ langDict[lang_id] }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.illegal_words')"
                    key="illegal_words"
                    align="left"
                    dataIndex="illegal_words"
                >
                    <template slot-scope="illegal_words">
                        <span>{{ illegal_words }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.memo')"
                    key="memo"
                    align="left"
                    dataIndex="memo"
                >
                    <template slot-scope="memo">
                        <span>{{ memo }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.status')"
                    key="status"
                    align="center"
                    dataIndex="status"
                >
                    <template slot-scope="status">
                        <span>{{
                            status | dict('illegalWords') | translate
                        }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.operate')"
                    key="action"
                    align="center"
                >
                    <template slot-scope="row">
                        <a @click="onEdit(row)">{{ $t('action.edit') }}</a>
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
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { MailService } from '~/services/mail.service'
import { GeneralService } from '~/services/general.service'
import UploadExcel from '~/shared/common/upload-excel.vue'
import DataForm from '~/shared/components/data-form.vue'
import LogView from '~/shared/common/log-view.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import IllegalWordsEdit from '@/components/basic_manage/illegal-words-edit.vue'

const datasModule = namespace('datasModule')
const userModule = namespace('userModule')

@Page({
    layout: 'workspace',
    name: 'illegal-words'
})
@Component({
    components: {
        LogView,
        UploadExcel
    }
})
export default class illegalWords extends Vue {
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    private generalService = new GeneralService()

    private mailService = new MailService()

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    // 表格数据源
    private data: any[] = []

    private object_name = 'email_illegal_words_list'

    private record_code = ''
    // 表格选择项
    private selectedRowKeys: any[] = []

    private selectedRows: any[] = []

    private langList: any[] = []

    private langDict = {}

    private statusDict = {
        20: '激活',
        60: '取消'
    }

    private created() {
        this.getLangList()
    }

    private mounted() {}

    private getLangList() {
        this.generalService.queryLangList(new RequestParams()).subscribe(
            data => {
                this.langList = data
                for (let i of data) {
                    this.langDict[i.code] = i.name
                }
            },
            err => {
                let err_msg: any = this.$t('lang_err')
                this.$message.error(err_msg)
            }
        )
    }

    private onStatusChange(e) {
        this.$nextTick(function() {
            this.getIllegalWordsList()
        })
    }

    private getIllegalWordsList() {
        this.dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                tms_ship_code: 'like',
                ...formConfig.condition
            })
            var nowConditions: any[] = []
            for (var item of params.query_condition) {
                nowConditions.push(item)
            }
            params.query_condition = nowConditions
            this.mailService
                .queryAllIllegalWords(
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
                        if (!this.selectedRows[0]) {
                            this.selectedRows = [data[0]]
                            this.selectedRowKeys = [data[0].id]
                        }
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private onCreate() {
        this.$modal
            .open(
                IllegalWordsEdit,
                {
                    saveFlag: 0,
                    langList: this.langList
                },
                {
                    title: this.$t('action.create'),
                    width: '1024px'
                }
            )
            .subscribe(data => {
                this.$message.success('Success')
                this.getIllegalWordsList()
            })
    }

    private onTrClick(record) {
        let info = this.data.find(x => x.id === record)
        this.selectedRows = [info]
        this.record_code = info.id
    }

    private onEdit(row) {
        this.$modal
            .open(
                IllegalWordsEdit,
                {
                    saveFlag: 1,
                    langList: this.langList,
                    row: row
                },
                {
                    title: this.$t('action.edit'),
                    width: '60%'
                }
            )
            .subscribe(data => {
                this.$message.success('Success')
                this.getIllegalWordsList()
            })
    }

    private import_excel() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/email/upload_file_for_illegal_words' },
                {
                    title: 'Excel导入'
                }
            )
            .subscribe(
                () => {},
                err => {
                    this.$message.error(err)
                }
            )
    }

    private batchDelete() {
        this.mailService
            .batchDeleteIllegalWords(
                new RequestParams(
                    { id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                () => {
                    this.getIllegalWordsList()
                },
                err => {
                    this.$message.error('err')
                }
            )
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "lang_id": "Language",
            "illegal_words": "Illegal Words",
            "lang_id": "Language",
            "memo": "Memo",
            "status": "Status",
            "create_date": "Create Date",
            "write_uid": "Write Uid",
            "write_date": "Write Date",
            "operate": "Operate"
        },
        "action": {
            "cancel": "Cancel",
            "batch_cancel": "Batch Delete",
            "import_excel": "Import Excel",
            "edit": "Edit",
            "create": "Create"
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "select_language": "Select Language",
        "delete_success": "Delete Success",
        "lang_err": "Select System Language Failed",
        "yes": "Yes",
        "no": "No"
    },
    "zh-cn": {
        "desc": "",
        "columns": {
            "illegal_words": "违禁词",
            "lang_id": "语言",
            "memo": "备注",
            "status": "状态",
            "create_date": "创建时间",
            "write_uid": "修改人",
            "write_date": "修改时间",
            "operate": "操作"
        },
        "action": {
            "cancel": "取消",
            "import_excel": "导入Excel",
            "batch_cancel": "批量删除",
            "edit": "编辑",
            "create": "添加"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "select_language": "选择语言",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "lang_err": "查询系统语言出错",
        "yes": "是",
        "no": "否"
    }
}
</i18n>
