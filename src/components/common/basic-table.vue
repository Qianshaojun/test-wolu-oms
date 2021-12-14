<script lang='tsx'>
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
import appConfig from '@/config/app.config'

@Component({
    components: {
        Vnodes: {
            functional: true,
            render: (h, ctx) => ctx.props.vnodes
        }
    }
})
export default class BasicTable extends Vue {
    @Prop()
    private data: any

    @Prop()
    private columns: any

    @Prop()
    private showHeader: any

    @Prop()
    private pagination: any

    @Prop()
    private selectRowclear: any = 0

    @Prop()
    private slots: any

    @Prop()
    private rowKey: any

    @Prop()
    private rowSelection: any

    //行类名
    @Prop()
    public rowClassName

    private groupData: any = []

    private selectedRowKeys: any = []

    private pageParams: any = {}

    @Watch('selectedRowKeys')
    private onSelectedRowKeysChange() {
        this.$emit('selectChange', this.selectedRowKeys)
    }

    // @Watch('selectRowclear')
    // private onSelectRowclearChange() {
    //     this.selectedRowKeys = []
    // }

    private mounted() {
        this.pageParams = this.pagination
        this.pageParams['onChange'] = this.pageChange
        this.groupData = this.data.map(x => x)
        //动态计算子表格宽度
        const tableHeaderDom = document.querySelector(
            '.ant-table-thead'
        ) as HTMLElement
        const subGroupTableDom = document.querySelector(
            '.x-group-sub-table'
        ) as HTMLElement

        if (subGroupTableDom) {
            subGroupTableDom.style.width = tableHeaderDom.clientWidth + 'px'
        }
    }

    @Watch('data')
    private onDataChange() {
        this.groupData = this.data.map(x => x)
    }

    private pageChange(page, pageSize) {
        this.$emit('pageChange', page, pageSize)
    }

    private onSubRowSelect(record, selected, selectedRows, nativeEvent) {
        this.$emit('subRowSelect', record)
    }

    private customRow = record => {
        return {
            on: {
                // 事件
                click: () => {
                    if (this.rowSelection) {
                        this.onClick(record['id'])
                    }
                }
            }
        }
    }

    @Emit('trClick')
    private onClick(record) {
        return record
    }

    private render(h) {
        let rowSelection: any = {
            onSelect: this.onSubRowSelect
        }
        return (
            <a-table
                bordered
                columns={this.columns}
                data-source={this.groupData}
                showHeader={this.showHeader}
                pagination={this.pageParams}
                rowKey="index"
                rowSelection={this.rowSelection}
                rowClassName={this.rowClassName}
                customRow={this.customRow}
                scopedSlots={this.slots}
            ></a-table>
        )
    }
}
</script>
<i18n>
{
    "en-us": {
        "more": "More",
        "action": {
            "detail": "Detail"
        }
    },
    "zh-cn": {
        "more": "更多",
        "action": {
            "detail": "详情"
        }
    }
}
</i18n>