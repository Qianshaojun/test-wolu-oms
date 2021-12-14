<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action>
            <a-button type="primary" @click="onCreateSaleTrend"
                >{{ $t('action.create') }}
            </a-button>
        </template>
        <data-form ref="dataForm" @submit="getPackageData" :column="2">
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.package_name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['package_name']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
            </template>
            <template #action>
                <a-button type="primary">Sub1 W</a-button>
                <a-button type="primary">Sub2 M</a-button>
                <a-button type="primary">Sub3 S</a-button>
                <a-button type="primary">Sub4 UK</a-button>
                <a-button type="primary">Sub5 J</a-button>
                <a-button type="primary">Sub6 E</a-button>
                <a-button type="primary">Sub7 T</a-button>
                <a-button type="primary">Sub8 R</a-button>
                <a-button type="primary">Sub9 F</a-button>
                <a-button type="primary">FBA-S</a-button>
                <a-button type="primary">FBA-R</a-button>
                <a-button type="primary">FBA-T</a-button>
                <a-button type="primary">FBA-W</a-button>
                <a-button type="primary">FBA-UK</a-button>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex">
            <table style="width:800px;">
                <tr>
                    <td style="width:50px;">
                        {{ $t('columns.package_name') }}:
                        {{ packageName }}
                    </td>
                    <td style="width:50px;">DE PO: {{ packageData.de_po }}</td>
                    <td style="width:40px;">
                        {{ $t('columns.warehouse') }}:
                        {{ packageData.warehouse_id }}
                    </td>
                    <td style="width:50px;">ETD: {{ packageData.etd_date }}</td>
                </tr>
            </table>

            <data-table
                :stripe="true"
                :data="packageDataDetail"
                :page="pageService"
                rowKey="id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: (keys, select_rows) => {
                        selectedRows = select_rows
                        selectedRowKeys = keys
                    }
                }"
                @on-page-change="getPackageData"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                    }
                "
                @change="sorter => onTableChange(sorter)"
                :scroll="{ y: 490, x: 400 }"
                style="table-layout:fixed;"
            >
                <a-table-column
                    :title="$t('columns.default_code')"
                    data-index="default_code"
                    key="default_code"
                    width="20%"
                    align="center"
                    :sorter="true"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.package_qty')"
                    data-index="package_qty"
                    key="package_qty"
                    width="20%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.aktu_package_qty')"
                    data-index="aktu_package_qty"
                    key="aktu_package_qty"
                    width="20%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.box_qty')"
                    data-index="box_qty"
                    key="box_qty"
                    width="20%"
                    align="right"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.aktu_box_qty')"
                    data-index="aktu_box_qty"
                    key="aktu_box_qty"
                    width="20%"
                    align="right"
                ></a-table-column>
            </data-table>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { namespace } from 'vuex-class'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '@/shared/utils/common.service'
import { ProductPurchaseService } from '../../services/product.purchase.service'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'purchase-package'
})
@Component({
    components: {}
})
export default class PurchasePackage extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private packageName: any = ''
    private packageData: any = ''

    // 表格数据源
    private packageDataDetail: any[] = []

    private selectedRows: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private productPurchaseService = new ProductPurchaseService()

    private orderBy: any = ''

    private created() {
        this.getSystemuser()
    }

    private getPackageData() {
        this.dataForm
            .validateFields()
            .then((values: any) => {
                if (values['package_name'] == undefined) {
                    this.$message.error('Please input package name.')
                    return
                }

                this.packageName = values['package_name']

                let params: any = CommonService.createQueryCondition(values, {
                    package_name: 'in_or_=',
                    name: '='
                })

                if (this.orderBy) {
                    params['order_by'] = this.orderBy
                }

                this.productPurchaseService
                    .queryRequirementPackage(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService
                        })
                    )
                    .subscribe(
                        data => {
                            if (data.length > 0) {
                                this.packageData = data[0]
                                this.packageDataDetail = data
                            }
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
            .catch(err => {
                // 异常处理
            })
    }

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getPackageData()
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }
}
</script>
<i18n>
{
    "en-us": {
        "desc": "Package info",
        "columns": {
            "package_name": "Package No.",
            "warehouse": "Warehouse",
            "default_code": "Product",
            "package_qty": "数量",
            "aktu_package_qty": "Aktu 数量",
            "box_qty": "箱数",
            "aktu_box_qty": "Aktu 箱数"
        },
        "action": {
            "create": "新建",
            "more": "更多操作"
        },
        "rules": {
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success"
    },
    "zh-cn": {
        "desc": "货柜信息",
        "columns": {
            "package_name": "货柜号",
            "warehouse": "仓库",
            "default_code": "Product",
            "package_qty": "数量",
            "aktu_package_qty": "Aktu 数量",
            "box_qty": "箱数",
            "aktu_box_qty": "Aktu 箱数"
        },
        "action": {
            "create": "新建",
            "more": "更多操作"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功"
    }
}
</i18n>
