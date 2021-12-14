<template>
    <section class="component data-table">
        <div style="margin-bottom:5px;">
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
                @change="onPageChange"
                @showSizeChange="onShowSizeChange"
                style="float:left;"
            />
            <a-button
                v-if="datas.length && showExportBtn"
                size="small"
                @click="exportTableData"
                style="margin-top: 5px;margin-left:10px;"
                >Export</a-button
            >
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref, Emit, Watch } from 'vue-property-decorator'
import { Table } from 'ant-design-vue'
import { LoadingService } from '../../bootstrap/services/loading.service'
import XLSX from 'xlsx'
import { XLSXUtil } from '../../shared/utils/xlsx.util'
import router from '../../router'
import { PageService } from '../../bootstrap/services/page.service'
import ExportSelectColumn from '../common/export-select-column.vue'

@Component({
    components: {
        ExportSelectColumn
    }
})
export default class CommonPage extends Vue {
    @Prop()
    public page!: PageService

    @Prop()
    public loading!: LoadingService

    @Prop({ default: true })
    public showExportBtn

    @Prop()
    public data

    // @Prop({ default: false })
    public exportable: boolean = false

    @Emit('on-page-change')
    public emitPageChange() {
        return
    }

    private datas: any = []

    @Watch('data')
    private onDataChange() {
        this.datas = this.data.map(x => x)
    }

    private loadingState = false

    private mounted() {
        this.datas = this.data.map(x => x)
    }

    // mounted() {
    //     if (this.loading) {
    //         this.loading.status.subscribe(value => (this.loadingState = value))
    //     }
    // }

    private onPageChange(page, pageSize) {
        this.page.pageIndex = page
        this.emitPageChange()
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

    public onShowSizeChange(current, pageSize) {
        this.page.pageSize = pageSize
        this.emitPageChange()
    }

    //export
    private allColumns: any = []

    private targetKeys: any = []

    private exportTableData() {
        this.allColumns = []
        // let translates = this.$parent.$i18n.messages['zh-cn'].columns
        if (this.datas.length) {
            for (let i in this.datas[0]) {
                this.allColumns.push({
                    key: i.toString(),
                    title: i.toString()
                })
            }

            let myDate = new Date()

            this.$modal
                .open(
                    ExportSelectColumn,
                    {
                        allColumns: this.allColumns,
                        queryUrl: '',
                        selectedRowKeys: '',
                        data: this.data,
                        rowKey: '',
                        menu_code: '',
                        queryCondition: '',
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
                .subscribe(data => {
                    this.targetKeys = data
                    this.export()
                })
        } else {
            this.$message.error('列表数据为空')
        }
    }

    private export() {
        let exportData: any[] = []
        const table = this.$refs.table as any
        exportData = this.datas

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
