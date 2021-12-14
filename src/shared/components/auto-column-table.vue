<script lang="tsx">
import { Vue, Component, Prop, Ref, Emit } from 'vue-property-decorator'
import { Table } from 'ant-design-vue'
import { LoadingService } from '../../bootstrap/services/loading.service'
import XLSX from 'xlsx'
import { XLSXUtil } from '../../shared/utils/xlsx.util'
import router from '../../router'
import { PageService } from '../../bootstrap/services/page.service'
import ExportSelectColumn from '../common/export-select-column.vue'
import { RequestParams } from '@/core/http'

@Component({
    components: {
        Vnodes: {
            functional: true,
            render: (h, ctx) => ctx.props.vnodes
        },
        ExportSelectColumn
    }
})
export default class AutoColumnTable extends Vue {
    @Ref('table')
    public readonly table!: Table

    @Prop()
    public data

    @Prop()
    public page!: PageService

    @Prop({ default: false })
    public loading?: boolean

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

    @Prop({ default: '' }) //导出按钮需要的参数
    public queryUrl

    @Prop() //导出按钮需要的参数
    public queryCondition

    @Prop({ default: '' }) //导出按钮需要的参数
    public menu_code

    @Prop({ default: 0 }) //导出按钮需要的参数
    public selectedRowKeys

    // @Prop({ default: false })
    public exportable: boolean = false

    @Prop({
        default: () => (record, index) => {
            return index % 2 == 0 ? 'even-row' : 'odd-row'
        }
    })
    //行类名
    @Prop()
    public rowClassName

    @Prop({ default: Array })
    private queryNameAuth: any

    @Emit('on-page-change')
    public emitPageChange() {
        return
    }

    private loadingState = false

    private renderList: any = []

    private currentRow: any = -1

    private mounted() {
        if (this.queryNameAuth.length) {
            this.renderList = this.queryNameAuth
                .filter(x => x.exists_scoped_slot && x.scoped_slot_name)
                .map(y => {
                    return {
                        slot: y.scoped_slot_name,
                        column: y.column_name,
                        edit: y.can_edit,
                        edit_type: 'input'
                    }
                })
        }
    }

    private onRowChange(row, column, value) {
        if (
            Object.prototype.toString.call(value) === '[object InputEvent]' ||
            Object.prototype.toString.call(value) === '[object Event]' ||
            Object.prototype.toString.call(value) === '[object Object]'
        ) {
            if (value.target != undefined && value.target.value != undefined) {
                row[column] = value.target.value
            } else {
                row[column] = value
            }
        } else {
            row[column] = value
        }
        // this.$emit('change', this.data)
    }

    private onPageChange(page, pageSize) {
        this.page.pageIndex = page
        this.emitPageChange()
    }

    private onTableChange(pagination, filters, sorter) {
        this.$emit('tbchange', pagination, filters, sorter)
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
        if (!record) {
            return
        }
        return record[this.rowKey]
    }

    @Emit('onClick')
    private onClick(record) {
        if (!record) {
            return
        }
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
                    // this.onDblClick(record)
                    if (this.rowSelection) {
                        this.onDblClick(record[this.rowKey])
                    }
                }
            }
        }
    }

    //export
    private allColumns: any = []

    private targetKeys: any = []

    private exportTableData() {
        this.allColumns = []
        if (this.data.length) {
            let clms: any = []
            for (let i in this.data[0]) {
                clms.push(i)
                // let title = this.columns.find(x => x.key == i)
                // this.allColumns.push({
                //     key: i.toString(),
                //     title: title ? title.title : i.toString()
                // })
            }
            this.allColumns = this.columns
                .filter(x => clms.includes(x.key))
                .map(y => {
                    return {
                        key: y.key.toString(),
                        title: y.title ? y.title : y.key.toString()
                    }
                })

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
                        menu_code: this.menu_code,
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

    private render(h) {
        return (
            <div>
                <div style="margin-bottom:5px;overflow:hidden">
                    <a-pagination
                        class="margin-top margin-x text-left"
                        v-model={this.page.pageIndex}
                        pageSize={this.page.pageSize}
                        total={this.page.total}
                        size="small"
                        showTotal={total => `共 ${total} 条`}
                        showQuickJumper={true}
                        pageSizeOptions={this.page.pageSizeOpts}
                        showSizeChanger={true}
                        onChange={this.onPageChange}
                        onShowSizeChange={this.onShowSizeChange}
                        style="float:left;"
                    />
                    <a-button
                        v-show={this.data.length && this.showExportBtn}
                        size="small"
                        onClick={this.exportTableData}
                        style="margin-top: 2px;margin-left:10px;"
                    >
                        {this.$t('export')}
                    </a-button>
                </div>
                <a-table
                    ref="table"
                    rowClassName={this.rowClassName}
                    columns={this.columns}
                    dataSource={this.data}
                    rowKey={this.rowKey}
                    loading={this.loading}
                    pagination={false}
                    rowSelection={this.rowSelection}
                    customRow={this.customRow}
                    scroll={{
                        x:
                            this.scroll && this.scroll.x
                                ? this.scroll.x
                                : '100%',
                        y: this.scroll && this.scroll.y ? this.scroll.y : '100%'
                    }}
                    onChange={this.onTableChange}
                    scopedSlots={this.$scopedSlots}
                    bordered
                ></a-table>
            </div>
        )
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
