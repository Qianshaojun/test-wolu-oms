<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form ref="dataForm" @submit="getCaseList" :column="1">
            <!--默认显示项-->
            <template #default>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        v-decorator="['sku']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important;">
            <a-table
                :dataSource="data"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="index"
                :columns="columns"
                :components="components"
                bordered
            >
            </a-table>
        </a-card>
    </page-container>
</template>

<script lang="tsx">
import { Vue, Component, Prop, Emit, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import { OrderService } from '../../services/order.service'
import UUID from 'uuidjs'

import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

Vue.component('vue-draggable-resizable', VueDraggableResizable)

@Page({
    layout: 'workspace',
    name: 'order-test'
})
@Component({
    components: {}
})
export default class OrderTest extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private orderService = new OrderService()
    // 表格数据源
    private data: any[] = []
    private selectedRowKeys: any[] = []

    private columns: any = []

    public mounted() {
        this.columns = [
            {
                key: 'sku',
                title: this.$t('columns.sku'),
                dataIndex: 'sku',
                width: 100
            },
            {
                key: 'note',
                title: this.$t('columns.note'),
                dataIndex: 'note',
                ellipsis: true,
                width: 100
            },
            {
                key: 'street',
                title: this.$t('columns.street'),
                dataIndex: 'street',
                width: 100
            },
            {
                key: 'zip',
                title: this.$t('columns.zip'),
                dataIndex: 'zip',
                width: 100
            }
        ]

        for (let i of this.columns) {
            this.draggingMap[i.key] = i.width
        }
    }

    /**
     * 获取订单数据
     */
    private getCaseList() {
        this.data = [
            {
                id: 1,
                sku: true,
                note: 'dddd',
                zip: '2342423',
                street: 'weiq'
            },
            {
                id: 2,
                sku: false,
                note:
                    'dddd2342342342344444444444444444444444444effffffsdfsdfsdgsdgsdgsdgsdg',
                zip: '5555555',
                street: 'xfgfcf'
            }
        ]
    }

    private draggingMap: any = {}

    private draggingState: any = Vue.observable(this.draggingMap)
    // private draggingState: any = ''
    private components = {
        header: {
            cell: this.resizeableTitle
        }
    }

    private resizeableTitle(h, props, children) {
        let thDom: any = null
        const { key, ...restProps } = props
        const col = this.columns.find(col => {
            const k = col.dataIndex || col.key
            return k === key
        })
        if (!col.width) {
            return <th {...restProps}>{children}</th>
        }
        const onDrag = x => {
            this.draggingState[key] = 0
            col.width = Math.max(x, 1)
        }

        const onDragstop = () => {
            this.draggingState[key] = thDom.getBoundingClientRect().width
        }
        return (
            <th
                {...restProps}
                v-ant-ref={r => (thDom = r)}
                width={col.width}
                class="resize-table-th"
            >
                {children}
                <vue-draggable-resizable
                    key={col.key}
                    class="table-draggable-handle"
                    w={4}
                    x={this.draggingState[key] || col.width}
                    z={1}
                    axis="x"
                    draggable={true}
                    resizable={false}
                    onDragging={onDrag}
                    onDragstop={onDragstop}
                ></vue-draggable-resizable>
            </th>
        )
    }
}
</script>
<style lang="less">
.resize-table-th {
    position: relative;

    .table-draggable-handle {
        transform: none !important;
        position: absolute;
        height: 100% !important;
        bottom: 0;
        left: auto !important;
        right: -2px;
        cursor: col-resize;
        touch-action: none;
    }
}
</style>

<i18n>
{
    "en-us": {
        "columns": {
            "sku": "SKU",
            "note": "Note",
            "street": "Street",
            "zip": "Zip"
        },
        "action": {
            "create": "Create",
            "batch-create": "EXCEL Import",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "copy": "Copy",
            "pass": "Check",
            "onApiEdit": "Api Edit",
            "detail": "Detail"
        }
    },
    "zh-cn": {
        "columns": {
            "sku": "SKU",
            "note": "说明",
            "street": "街道",
            "zip": "邮编"
        },
        "action": {
            "create": "新建",
            "batch-create": "EXCEL导入",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "copy": "复制",
            "pass": "审核",
            "onApiEdit": "api接口管理",
            "detail": "详情"
        }
    }
}
</i18n>
