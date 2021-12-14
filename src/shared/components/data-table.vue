<template>
    <section class="component data-table">
        <div
            v-if="$slots.action || $slots.extra || exportable"
            class="flex-row justify-content-between padding-bottom"
        >
            <div class="table-action flex-row align-items-center">
                <template v-if="$slots.action">
                    <vnodes
                        :slot="key"
                        v-for="[key, node] of Object.entries($slots.action)"
                        :vnodes="node"
                        :key="key"
                    />
                </template>
            </div>
            <div class="table-extra flex-row align-items-center">
                <template v-if="$slots.extra">
                    <vnodes
                        :slot="key"
                        v-for="[key, node] of Object.entries($slots.extra)"
                        :vnodes="node"
                        :key="key"
                    />
                </template>
                <a @click="exportExcel" v-if="exportable">导出Excel</a>
            </div>
        </div>
        <div style="margin-bottom:5px;overflow: hidden">
            <a-pagination
                v-if="page"
                class="margin-top margin-x text-left"
                v-model="page.pageIndex"
                :pageSize="page.pageSize"
                :total="page.total"
                :showTotal="total => `共 ${total} 条`"
                :showQuickJumper="true"
                :pageSizeOptions="page.pageSizeOpts"
                :showSizeChanger="true"
                size="small"
                @change="onPageChange"
                @showSizeChange="onShowSizeChange"
                style="float:left;"
            />
            <a-button
                v-if="data.length && showExportBtn"
                size="small"
                @click="exportTableData"
                type="primary"
                style="margin-top: 2px;margin-left:10px;"
                >{{ $t('export') }}
            </a-button>
        </div>
        <a-table
            ref="table"
            :class="{ stripe: stripe }"
            :rowClassName="rowClassName"
            :columns="columns"
            :dataSource="data"
            :rowKey="rowKey"
            :loading="loadingState"
            :pagination="false"
            :rowSelection="rowSelection"
            :customRow="customRow"
            :scroll="scroll"
            @change="onTableChange"
            bordered
        >
            <vnodes
                :slot="key"
                v-for="[key, node] of Object.entries($slots)"
                :vnodes="node"
                :key="key"
            />
        </a-table>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref, Emit } from 'vue-property-decorator'
import { Table } from 'ant-design-vue'
import { LoadingService } from '../../bootstrap/services/loading.service'
import XLSX from 'xlsx'
import { XLSXUtil } from '../../shared/utils/xlsx.util'
import router from '../../router'
import { PageService } from '../../bootstrap/services/page.service'
import ExportSelectColumn from '../common/export-select-column.vue'
import { namespace } from 'vuex-class'

const userModule = namespace('userModule')

@Component({
    components: {
        Vnodes: {
            functional: true,
            render: (h, ctx) => ctx.props.vnodes
        },
        ExportSelectColumn
    }
})
export default class DataTable extends Vue {
    @Ref('table')
    public readonly table!: Table

    @Prop()
    public data

    @Prop()
    public page!: PageService

    @Prop()
    public loading!: LoadingService

    @Prop()
    public columns

    @Prop()
    public rowKey

    @Prop()
    public rowSelection

    @Prop()
    public scroll

    @Prop({ default: false })
    public stripe

    @Prop({ default: true })
    public showExportBtn

    @Prop({ default: '' })
    public queryUrl

    @Prop({ default: Array })
    public queryCondition

    // @Prop({ default: false })
    public exportable: boolean = false

    @Prop({
        default: () => (record, index) => {
            return index % 2 == 0 ? 'even-row' : 'odd-row'
        }
    })
    private rowClassName

    @Emit('on-page-change')
    public emitPageChange() {
        return
    }

    @Emit('change')
    public emitTableChange(pagination, filters, sorter) {
        return sorter
    }

    private loadingState = false

    private onPageChange(page, pageSize) {
        this.page.pageIndex = page
        this.emitPageChange()
    }

    private onTableChange(pagination, filters, sorter) {
        this.emitTableChange(pagination, filters, sorter)
    }

    public exportExcel() {
        const excelFile = this.createExcelFile()
        this.saveAs(excelFile, 'excel.xlsx')
    }

    private createExcelFile() {
        const workbook = XLSX.utils.table_to_book(
            this.$el.querySelector('table')
        )
        return new Blob([
            XLSX.write(workbook, {
                bookType: 'xlsx',
                bookSST: false,
                type: 'binary'
            })
        ])
    }

    private saveAs(obj, fileName) {
        const tmpLink = document.createElement('a')
        tmpLink.download = fileName || 'download'
        tmpLink.href = URL.createObjectURL(obj)
        tmpLink.click()
        setTimeout(() => {
            URL.revokeObjectURL(obj)
        }, 1000)
    }

    public onShowSizeChange(current, pageSize) {
        this.page.pageSize = pageSize
        this.emitPageChange()
    }

    @Emit('onDblClick')
    private onDblClick(record) {
        return record
    }

    @Emit('onClick')
    private onClick(record) {
        return record[this.rowKey]
    }

    private customRow = record => {
        return {
            on: {
                // 事件
                click: () => {
                    if (this.rowSelection) {
                        this.onClick(record[this.rowKey])
                    }
                },
                // 事件
                dblclick: () => {
                    this.onDblClick(record)
                }
            }
        }
    }

    //export
    private allColumns: any = []

    private targetKeys: any = []

    private menu_code: any = ''

    @userModule.State
    private menus

    private getMenuCode() {
        let code = ''
        let path: any = this.$route.path
        let index = path.lastIndexOf('/')
        path = path.substring(index + 1, path.length)
        let menuArr: any = []

        if (this.menus) {
            const menus: any[] = this.menus.map(item => {
                let menu: any[] = []
                if (item.children && item.children.length) {
                    menu = item.children.map(x => {
                        let smenu: any[] = []
                        if (x.children && x.children.length) {
                            smenu = x.children.map(y => ({
                                name: y.name,
                                id: y.id
                            }))
                        }
                        smenu.push(x)
                        return smenu
                    })
                }
                menu.push({ name: item.name, id: item.id })

                let menuTemp: any = []
                for (let i of menu) {
                    if (i && i.id) {
                        menuTemp.push(i)
                    } else {
                        for (let k of i) {
                            menuTemp.push(k)
                        }
                    }
                }

                return menuTemp
            })
            menuArr = [].concat.apply([], menus)
        }
        let finds = menuArr.find(x => x.name === path)
        if (finds) {
            code = finds.id
        }
        this.menu_code = code
        return code
    }

    private exportTableData() {
        this.allColumns = []
        if (this.data.length) {
            for (let i in this.data[0]) {
                this.allColumns.push({
                    key: i.toString(),
                    title: i.toString()
                })
            }
        }

        let slts: any = this.$slots.default
        if (
            slts.length &&
            slts[0].componentOptions.propsData !== undefined &&
            slts[0].data.key !== undefined
        ) {
            for (let i of slts) {
                let item = this.allColumns.find(x => x.key === i.data.key)
                if (item) {
                    if (
                        i.componentOptions.propsData &&
                        i.componentOptions.propsData.title
                    ) {
                        item['title'] = i.componentOptions.propsData.title
                    }
                }
            }
        }

        if (this.data.length) {
            if (!this.allColumns.length) {
                for (let i in this.data[0]) {
                    let title: any = i.toString()

                    this.allColumns.push({
                        key: i.toString(),
                        title: title
                    })
                }
            }

            let myDate = new Date()

            this.$modal
                .open(
                    ExportSelectColumn,
                    {
                        allColumns: this.allColumns,
                        queryUrl: this.queryUrl,
                        selectedRowKeys: this.rowSelection.selectedRowKeys,
                        data: this.data,
                        rowKey: this.table.rowKey,
                        menu_code: this.getMenuCode(),
                        queryCondition: this.queryCondition,
                        fileName:
                            this.$route.name +
                            '-' +
                            myDate.toLocaleDateString().replace(/\//g, '') +
                            '.xlsx'
                    },
                    {
                        title: '选择导出列',
                        width: '590px'
                    }
                )
                .subscribe((data: any) => {
                    // this.targetKeys = data.keys
                    // this.export(data.range)
                    this.$message.success('导出成功')
                })
        } else {
            this.$message.error('列表数据为空')
        }
    }

    private export(range) {
        let exportData: any[] = []
        const table = this.$refs.table as any
        let rowKey = table.rowKey
        if (range == 1) {
            if (this.rowSelection.selectedRowKeys.length) {
                exportData = this.data.filter(x =>
                    this.rowSelection.selectedRowKeys.includes(x[rowKey])
                )
            } else {
                this.$message.error('请先选择数据行')
                return
            }
        } else if (range == 2) {
            exportData = this.data
        } else if (range == 3) {
            this.$message.error('此页面暂不支持全部导出，请联系管理员')
            return
        }

        let myDate = new Date()
        let fileName =
            this.$route.name +
            '-' +
            myDate.toLocaleDateString().replace(/\//g, '') +
            '.xlsx'

        const xlsxUtil = new XLSXUtil()
        let columnList: any = {}
        let params: any = []
        let widths: any = []
        let _that = this
        for (let i of this.targetKeys) {
            columnList[i] = i
            widths.push(20)
            params = exportData.map(x => {
                let rows: any = {}
                for (let k of _that.targetKeys) {
                    rows[k] = x[k]
                }
                return rows
            })
        }

        xlsxUtil.readFromJson(columnList, params, widths)
        xlsxUtil.exportFile(fileName)
    }
}
</script>

<i18n>
{
    "en-us": {
        "export": "Export"
    },
    "zh-cn": {
        "export": "导出"
    }
}
</i18n>
