<template>
    <page-container ref="pageContainer">
        <template #header-action></template>
        <data-form ref="dataForm" @submit="getManualList" :column="1">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.z_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['cn_category']"
                        style="width: 120px"
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
                        style="width: 18%;margin-left:5px"
                        placeholder="子类"
                        size="small"
                    >
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.attr')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['extra_attributes']"
                        :style="{ width: '310px' }"
                        size="small"
                        :placeholder="$t('plzInput')"
                    />
                    <a-select
                        v-decorator="['operator', { initialValue: 'ilike' }]"
                        :style="{ width: '100px', 'margin-left': '5px' }"
                        size="small"
                    >
                        <a-select-option value="ilike">
                            {{ $t('forms.operator_like') }}
                        </a-select-option>
                        <a-select-option value="=">
                            {{ $t('forms.operator_equal') }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.state')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['state', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="not_null" key="not_null">
                            {{ $t('dict.edited') }}
                        </a-radio-button>
                        <a-radio-button value="null" key="null">
                            {{ $t('dict.unedited') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <!-- <template #action> </template> -->
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important;">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="index"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getManualList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                style="table-layout:fixed;"
            >
                <a-table-column title="ID" key="id" width="15%" align="center">
                    <template slot-scope="row">{{ row.id }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.cn_sub_category')"
                    key="cn_sub_category"
                    width="20%"
                    align="left"
                >
                    <template slot-scope="row"
                        >{{ row.cn_sub_category }}
                    </template>
                </a-table-column>
                <a-table-column
                    title="extra_attributes"
                    key="extra_attributes"
                    width="50%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.extra_attributes }}
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
                        <a
                            slot="overlay"
                            style="cursor:pointer;"
                            @click="onEdit(row)"
                            >{{ $t('action.edit') }}
                        </a>
                        <a
                            slot="overlay"
                            style="cursor:pointer;"
                            @click="onCopy(row)"
                            v-if="row.id"
                            >{{ $t('action.copy') }}
                        </a>
                    </template>
                </a-table-column>
            </data-table>
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
import router from '../../router'
import UploadExcel from '~/shared/common/upload-excel.vue'
import ProductExtraAttrEdit from '~/components/product/product-extra-attr-edit.vue'
import ProductExtraAttrCopy from '~/components/product/product-extra-attr-copy.vue'

import { ReportService } from '../../services/report.service'
import { ProductService } from '../../services/product.service'
import appConfig from '@/config/app.config'
import UUID from 'uuidjs'

const userModule = namespace('userModule')
const allUsersModule = namespace('allUsersModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'product-cate-attr'
})
@Component({
    components: {
        ProductExtraAttrEdit,
        ProductExtraAttrCopy
    }
})
export default class ProductCateAttr extends Vue {
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

    // 表格数据源
    private data: any[] = []
    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []
    private attrList: any = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private get rules() {
        return {}
    }

    public created() {
        this.getCn_cate()
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

    /**
     * 获取订单数据
     */
    private getManualList() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                if (this.selectedList.length > 0) {
                    values['cn_sub_category'] = this.selectedList
                }
                let operator = values['operator']
                delete values['operator']

                if (operator == 'in' && values['extra_attributes']) {
                    values['extra_attributes'] = values[
                        'extra_attributes'
                    ].split(',')
                }
                if (values['cn_category']) {
                    delete values['cn_category']
                }
                let params: any = CommonService.createQueryCondition(values, {
                    extra_attributes: operator,
                    cn_sub_category: 'in'
                })

                for (let i of params.query_condition) {
                    if (i.query_name == 'state') {
                        i.operate =
                            i.value == 'null'
                                ? 'null'
                                : i.value == 'not_null'
                                ? 'not null'
                                : '='
                        if (i.operate != '=') {
                            i.value = i.operate
                        }
                    }
                }

                this.productService
                    .query_all_sub_category_attributes(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService
                        })
                    )
                    .subscribe(
                        data => {
                            this.data = data
                            for (let item of this.data) {
                                item.index = UUID.generate()
                            }
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

    private onCopy(row) {
        this.$modal
            .open(
                ProductExtraAttrCopy,
                {
                    row: row,
                    saveFlag: 0
                },
                {
                    title: this.$t('action.copy'),
                    width: '800px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getManualList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onEdit(row) {
        var save_flag = 0
        if (row.id) {
            save_flag = 1
        }
        this.$modal
            .open(
                ProductExtraAttrEdit,
                {
                    row: row,
                    saveFlag: save_flag
                },
                {
                    title: this.$t('action.edit'),
                    width: '800px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getManualList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDelete(row) {
        this.productService
            .delete_prod_manual_info(
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
                    this.getManualList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onBatchDelete(row) {
        let id_list: any = []
        for (let i of this.data) {
            if (this.selectedRowKeys.indexOf(i.index) > -1) {
                id_list.push(i.id)
            }
        }
        this.productService
            .delete_prod_manual_info(
                new RequestParams(
                    {
                        id_list: id_list
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('delete_success')
                    this.$message.success(msg)
                    this.getManualList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "manual_code": "Manual Code",
            "manual_version": "Manual Version",
            "seller_id": "Seller Name",
            "actions": "Actions",
            "view": "View",
            "doc_code": "Document Code",
            "cn_category": "Category",
            "cn_sub_category": "Sub Category",
            "import_date": "Import Date",
            "import_status": "Import Status",
            "attr": "Attributes",
            "state": "State"
        },
        "action": {
            "create": "Create",
            "import_btn": "Import",
            "import_product_manual": "Import Product Manual",
            "export_product_manual": "Export Product Manual",
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
            "not_import": "Not Import"
        },
        "forms": {
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search",
            "operator_list": "Multi Search"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "dict": {
            "all": "All",
            "unedited": "Unedited",
            "edited": "Edited"
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
            "manual_code": "说明书编号",
            "manual_version": "说明书版本",
            "time": "创建时间",
            "actions": "操作",
            "view": "查看",
            "doc_code": "文案编码",
            "cn_category": "分类",
            "cn_sub_category": "子类",
            "import_date": "导入日期",
            "import_status": "说明书上传状态",
            "attr": "属性",
            "state": "状态"
        },
        "action": {
            "create": "新建",
            "import_btn": "导入",
            "import_product_manual": "导入产品说明书",
            "export_product_manual": "导出产品说明书",
            "batch-create": "EXCEL导入",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "copy": "复制",
            "pass": "审核",
            "onApiEdit": "api接口管理",
            "import": "已上传",
            "not_import": "未上传"
        },
        "forms": {
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量查询"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "dict": {
            "all": "全部",
            "unedited": "未编辑",
            "edited": "已编辑"
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功"
    }
}
</i18n>
