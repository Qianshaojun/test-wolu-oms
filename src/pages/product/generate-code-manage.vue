<template>
    <page-container ref="pageContainer">
        <template #header-action>
            <!-- <a-button type="primary" @click="onCreateGenerateCode">{{
                $t('action.onCreateGenerateCode')
            }}</a-button> -->
        </template>
        <data-form ref="dataForm" @submit="getAllCodeList" :column="1">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.code')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['code']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.company')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['company_code_id']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option
                            v-for="company of companyList"
                            :key="company.id"
                            :value="company.id"
                        >
                            {{ company.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['category_id']"
                        :style="{ width: '200px' }"
                        size="small"
                        @change="handleCategoryChange"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option
                            v-for="category of categoryList"
                            :key="category.id"
                            :value="category.id"
                        >
                            {{ category.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.size')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['size_id']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option
                            v-for="size of sizeList"
                            :key="size.id"
                            :value="size.id"
                        >
                            {{ size.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.color')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['color_id']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option
                            v-for="color of colorList"
                            :key="color.id"
                            :value="color.id"
                        >
                            {{ color.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-popconfirm
                    :title="$t('cancel')"
                    :okText="$t('action.ok')"
                    :cancelText="$t('action.delete')"
                    placement="left"
                    @confirm="onBatchDelete()"
                    :disabled="!selectedRowKeys.length"
                >
                    <a-button
                        type="primary"
                        :disabled="!selectedRowKeys.length"
                        v-auth="'delete'"
                    >
                        {{ $t('action.delete') }}
                    </a-button>
                </a-popconfirm>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="importCreateGenerateCode()"
                    v-auth="'create_generate_code'"
                >
                    {{ $t('action.import_create_generate_code') }}
                </a-button>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="createGenerateCode()"
                    v-auth="'manual_generate_code'"
                >
                    {{ $t('action.create_generate_code') }}
                </a-button>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important;">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getAllCodeList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                style="table-layout:fixed;"
            >
                <a-table-column
                    :title="$t('columns.code')"
                    key="code"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.code }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.ean')"
                    key="ean"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.ean }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.company')"
                    key="company_code_id"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ getSelecterName(companyList, row.company_code_id) }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.category')"
                    key="category_id"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ getSelecterName(categoryList, row.category_id) }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.color')"
                    key="color_id"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ getSelecterName(colorList, row.color_id) }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.size')"
                    key="size_id"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ getSelecterName(sizeList, row.size_id) }}
                    </template>
                </a-table-column>

                <a-table-column
                    :title="$t('columns.create_date')"
                    key="create_date"
                    :sorter="true"
                    width="14%"
                    align="center"
                >
                    <template slot-scope="row">
                        {{ row.create_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.actions')"
                    key="action"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-dropdown>
                            <a-menu slot="overlay">
                                <!-- <a-menu-item
                                    style="cursor:pointer;"
                                    @click="onEdit(row)"
                                    >{{ $t('action.edit') }}</a-menu-item
                                > -->
                                <a-popconfirm
                                    :title="$t('cancel')"
                                    :okText="$t('action.ok')"
                                    :cancelText="$t('action.delete')"
                                    placement="left"
                                    @confirm="onDelete(row)"
                                >
                                    <a-menu-item
                                        style="cursor:pointer;margin-left:12px;"
                                        class="btnDel"
                                        >{{ $t('action.delete') }}
                                    </a-menu-item>
                                </a-popconfirm>
                            </a-menu>
                            <a-button>
                                {{ $t('action.more') }}
                                <a-icon type="down" />
                            </a-button>
                        </a-dropdown>
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { GeneralCodeService } from '~/services/generate_code.service'
import { UserService } from '~/services/user.service'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import UploadExcel from '~/shared/common/upload-excel.vue'
import appConfig from '@/config/app.config'
import GenerateCodeEdit from '~/components/product/generate-code-edit.vue'

const userModule = namespace('userModule')
const allUsersModule = namespace('allUsersModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'generate-code-manage'
})
@Component({
    components: {
        GenerateCodeEdit
    }
})
export default class GenerateCodeManage extends Vue {
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

    private generalCodeService = new GeneralCodeService()

    // 表格数据源
    private data: any[] = []

    private colorList: any = []
    private companyList: any = []
    private categoryList: any = []
    private sizeList: any = []
    private fullSizeList: any = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private get rules() {
        return {}
    }

    public created() {
        this.getSelectList()
    }

    private importCreateGenerateCode() {
        this.$modal
            .open(
                UploadExcel,
                { urlPath: '/code_generate/import_create_generate_code' },
                {
                    title: '导入创建编码'
                }
            )
            .subscribe(
                data => {
                    this.getSelectList()
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getSelectList() {
        this.generalCodeService.querySelectCode(new RequestParams()).subscribe(
            data => {
                this.companyList = data.company
                this.colorList = data.color
                this.fullSizeList = data.size
                this.categoryList = data.category
            },
            error => {
                this.$message.error(error.message)
            }
        )
    }

    /**
     * 获取订单数据
     */
    private getAllCodeList() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                let params: any = CommonService.createQueryCondition(values, {
                    code: 'like',
                    company_code_id: '=',
                    size_id: '=',
                    color_id: '=',
                    category_id: '='
                })

                this.generalCodeService
                    .queryAllCodeList(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService
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
            })
            .catch(err => {
                this.$message.error('请检查查询条件')
            })
    }

    private createGenerateCode() {
        this.$modal
            .open(
                GenerateCodeEdit,
                {
                    companyList: this.companyList,
                    categoryList: this.categoryList,
                    colorList: this.colorList,
                    fullSizeList: this.fullSizeList
                },
                {
                    title: this.$t('action.create_generate_code'),
                    width: '800px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getAllCodeList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDelete(row) {
        this.generalCodeService
            .deleteCode(
                new RequestParams(
                    {
                        id_list: [row.id]
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('delete_success')
                    this.$message.success(msg)
                    this.getAllCodeList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onBatchDelete(row) {
        this.generalCodeService
            .deleteCode(
                new RequestParams(
                    {
                        id_list: this.selectedRowKeys
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('delete_success')
                    this.$message.success(msg)
                    this.getAllCodeList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getSelecterName(data, id) {
        let result: any = ''
        if (data.length > 0) {
            result = data.filter(item => item.id === id)[0].name
        }
        return result
    }

    private handleCategoryChange(value) {
        this.sizeList = this.fullSizeList.filter(
            item => item.category_id === value
        )
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "code": "Code",
            "company": "Company",
            "category": "Category",
            "actions": "Actions",
            "size": "Size",
            "color": "Color",
            "create_date": "Create Date",
            "ean": "EAN"
        },
        "action": {
            "create": "Create",
            "import_btn": "Import",
            "import_create_generate_code": "Import Create Generate Code",
            "create_generate_code": "Generate Code",
            "batch-create": "EXCEL Import",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "copy": "Copy",
            "pass": "Check"
        },
        "forms": {
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search",
            "operator_list": "Multi Search"
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
            "code": "编码",
            "company": "公司",
            "category": "品类",
            "actions": "Actions",
            "size": "尺寸",
            "color": "颜色",
            "create_date": "创建时间",
            "ean": "EAN"
        },
        "action": {
            "create": "新建",
            "import_btn": "导入",
            "import_create_generate_code": "导入创建编码",
            "create_generate_code": "手动生成编码",
            "export_product_manual": "导出产品说明书",
            "batch-create": "EXCEL导入",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "copy": "复制",
            "pass": "审核"
        },
        "forms": {
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量查询"
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
