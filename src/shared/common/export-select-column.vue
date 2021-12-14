<template>
    <section class="component edit-customer">
        <div style="margin: 0 0 20px 0;font-weight: 600;">
            {{ $t('export-data-range') }}：
            <a-radio-group
                name="radioGroup"
                :default-value="selectedRowKeys.length ? 1 : 2"
                @change="e => onDataRangeChange(e)"
            >
                <a-radio :value="1">
                    {{ $t('selected-items') }}
                </a-radio>
                <a-radio :value="2">
                    {{ $t('table-datas') }}
                </a-radio>
                <a-radio :value="3" v-if="queryUrl">
                    {{ $t('all-datas') }}
                </a-radio>
            </a-radio-group>
        </div>
        <a-tabs
            default-active-key="tab1"
            type="card"
            @change="e => onPanelChange(e)"
        >
            <a-tab-pane key="tab1" tab="字段导出">
                <div>
                    <a-transfer
                        :data-source="allColumns"
                        :titles="[
                            $t('no_select_columns'),
                            $t('selected_columns')
                        ]"
                        :target-keys="targetKeys"
                        :render="item => item.title"
                        show-search
                        :locale="{
                            itemUnit: $t('item'),
                            itemsUnit: $t('item'),
                            notFoundContent: $t('empty'),
                            searchPlaceholder: $t('input_search')
                        }"
                        :list-style="{
                            width: '250px',
                            height: '400px'
                        }"
                        @change="handleChange"
                    >
                        <template
                            slot="children"
                            slot-scope="{
                                props: {
                                    direction,
                                    filteredItems,
                                    selectedKeys
                                },
                                on: { itemSelectAll, itemSelect }
                            }"
                        >
                            <a-table
                                v-if="direction === 'right'"
                                :row-selection="
                                    getRowSelection({
                                        selectedKeys,
                                        itemSelectAll,
                                        itemSelect
                                    })
                                "
                                :columns="
                                    direction === 'left'
                                        ? leftColumns
                                        : rightColumns
                                "
                                :data-source="filteredItems"
                                :pagination="false"
                                style="height: 300px;overflow-y: scroll;"
                                size="small"
                                :customRow="onTableRowEvent"
                            >
                                <template slot="sort" slot-scope="text, row">
                                    <span v-show="isHoverTb === row.key">
                                        <a
                                            style="float:right;"
                                            :title="$t('sort_up')"
                                            @click="() => sortUpTb(row)"
                                            ><i
                                                class="anticon anticon-sort-up"
                                            ></i
                                        ></a>
                                        <a
                                            style="float:right;"
                                            :title="$t('sort_down')"
                                            @click="() => sortDownTb(row)"
                                        >
                                            <i
                                                class="anticon anticon-sort-down"
                                            ></i
                                        ></a>
                                    </span>
                                </template>
                            </a-table>
                        </template>
                    </a-transfer>
                </div>
            </a-tab-pane>
            <a-tab-pane
                key="tab2"
                tab="模板导出"
                force-render
                :disabled="!menu_code"
            >
                <div class="xg-template-div">
                    <div
                        class="ant-transfer-list left-div"
                        style="width:250px;height:400px;padding-top:0;"
                    >
                        <ul class="list">
                            <li
                                v-for="item of templateList"
                                :key="item.id"
                                :class="currentLi == item.id ? 'active' : ''"
                                @click="onTempLiClick(item.id)"
                                @mouseover="e => hoverEvt(item)"
                                @mouseleave="e => leaveEvt()"
                            >
                                <p class="mdl-name">
                                    <span :title="item.name">
                                        {{ item.name.substr(0, 20) }}
                                        {{ item.name.length > 20 ? '...' : '' }}
                                    </span>
                                    <a
                                        class="edit"
                                        style="display:none;"
                                        v-show="hoverLi == item.id"
                                        title="重命名"
                                        @click="
                                            e => {
                                                e.stopPropagation()
                                                editTemplateName(item)
                                            }
                                        "
                                        ><a-icon type="edit"
                                    /></a>
                                </p>
                            </li>
                        </ul>
                        <div class="xg-btn-div-bottom">
                            <span class="xg-btn" @click="addTemplate"
                                ><a-icon type="plus" /> 新增</span
                            >
                            <span class="xg-btn" @click="deleteTemplate"
                                ><a-icon type="delete" /> 删除</span
                            >
                            <span class="xg-btn" @click="copyTemplate"
                                ><a-icon type="copy" /> 复制</span
                            >
                        </div>
                    </div>
                    <div
                        class="ant-transfer-list right-div"
                        style="width:250px;height:400px;margin-left:40px;padding-top:0;"
                    >
                        <div class="xg-btn-div-top">
                            <span class="xg-btn"
                                ><a-checkbox
                                    @change="e => onSelectAllChange(e)"
                                />
                                {{ tempTreeData.length }}项</span
                            >
                            <span
                                style="width:166px;line-height:38px;padding-left:20px;"
                                @change="e => onShowSelectChange(e)"
                                ><a-checkbox v-model="defaultShowSelectValue" />
                                只显示已选项</span
                            >
                        </div>
                        <div
                            style="width: 100%;height:45px;overflow: auto;padding-top:5px;padding-left:14px;"
                        >
                            <a-input-search
                                placeholder="input search text"
                                style="width: 220px"
                                @change="e => onTempSelectSearch(e)"
                            />
                        </div>
                        <div style="width: 100%;height:280px;overflow: auto;">
                            <a-tree
                                v-model="tempCheckedKeys"
                                checkable
                                :selected-keys="tempSelectedKeys"
                                :tree-data="tempTreeData"
                                @check="onTempSelect"
                            >
                                <template slot="custom" slot-scope="item">
                                    <span
                                        style="position:relative;width:170px;display:block;"
                                        @mouseenter="() => onMouseenter(item)"
                                        @mouseleave="() => onMouseleave(item)"
                                    >
                                        <span>{{ item.title }}</span>
                                        <span
                                            v-show="
                                                defaultShowSelectValue &&
                                                    isHover === item.key
                                            "
                                        >
                                            <a
                                                style="float:right;"
                                                :title="$t('sort_up')"
                                                @click="() => sortUp(item)"
                                                ><i
                                                    class="anticon anticon-sort-up"
                                                ></i
                                            ></a>
                                            <a
                                                style="float:right;"
                                                :title="$t('sort_down')"
                                                @click="() => sortDown(item)"
                                            >
                                                <i
                                                    class="anticon anticon-sort-down"
                                                ></i
                                            ></a>
                                        </span>
                                    </span>
                                </template>
                            </a-tree>
                        </div>
                        <div class="xg-btn-div-bottom">
                            <span
                                class="xg-btn"
                                style="margin-left:67%;"
                                @click="saveTemplate"
                                ><a-icon type="save" /> 保存</span
                            >
                        </div>
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
        <p>
            <a-alert type="error" v-if="showTip" :message="message" banner />
        </p>

        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('cancel')
            }}</a-button>
            <a-button type="primary" @click="onSubmit">{{
                $t('submit')
            }}</a-button>
        </div>
    </section>
</template>

<style>
.xg-template-div .left-div ul li {
    list-style-type: none;
}
.xg-template-div .left-div ul {
    height: 360px;
    overflow-y: auto;
    padding: 0;
    margin: 0;
}
.xg-template-div .left-div .xg-btn-div {
    width: 250px;
    height: 40px;
    border-top: 1px solid #d9d9d9;
}
.xg-template-div .xg-btn-div-top {
    width: 250px;
    height: 40px;
    border-bottom: 1px solid #d9d9d9;
}
.xg-template-div .xg-btn-div-bottom {
    width: 250px;
    height: 40px;
    border-top: 1px solid #d9d9d9;
}
.xg-template-div .xg-btn-div-top .xg-btn,
.xg-template-div .xg-btn-div-bottom .xg-btn {
    width: 33%;
    line-height: 32px;
    text-align: center;
    display: block;
    float: left;
    cursor: pointer;
}
.xg-template-div .xg-btn-div-top .xg-btn:hover,
.xg-template-div .xg-btn-div-bottom .xg-btn:hover {
    color: #1890ff;
}
.xg-template-div .list {
    width: 100%;
    padding: 0;
    margin: 0;
    height: 100%;
    display: inline-block;
}
.xg-template-div .list li {
    list-style: none;
    line-height: 40px;
    margin: 0;
    padding: 10px 5% 0 5%;
    border-bottom: 1px solid #f5f5f5;
}
.xg-template-div .list .mdl-name {
    margin: 0;
    line-height: 20px;
    font-weight: 600;
    color: #222;
}
.xg-template-div .list .active {
    background: #e6f7ff;
}
.xg-template-div .list li .edit {
    float: right;
    margin-right: 5px;
    color: #0099cc;
    font-size: 18px;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { PublicService } from '@/services/public.service'
import { XLSXUtil } from '../../shared/utils/xlsx.util'
import { PageService } from '../../bootstrap/services/page.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { GeneralService } from '@/services/general.service'
import ExportTemplateForm from '@/components/common/export-template-form.vue'
import difference from 'lodash/difference'

@Component({
    components: {
        ExportTemplateForm
    }
})
export default class ExportSelectColumn extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private allColumns

    @Prop({ default: '' })
    private queryUrl

    @Prop({ default: '' })
    private selectedRowKeys

    @Prop({ default: '' })
    private data

    @Prop({ default: '' })
    private rowKey

    @Prop({ default: '' })
    private queryCondition

    @Prop({ default: '' })
    private menu_code

    @Prop({ default: 'export-file.xlsx' })
    private fileName

    private showTip: any = false

    private dataRange: any = 2

    private message: any = ''

    private resource: any = ''

    private orderBy: any = ''

    private leftColumns = [
        {
            dataIndex: 'title',
            title: 'Name'
        }
    ]

    private rightColumns = [
        {
            dataIndex: 'title',
            title: 'Name',
            ellipsis: true,
            width: 90
        },
        {
            dataIndex: 'key',
            title: 'Sort',
            width: 55,
            scopedSlots: { customRender: 'sort' }
        }
    ]

    private created() {
        this.getTemplateList()
    }

    private mounted() {
        if (this.selectedRowKeys.length) {
            this.dataRange = 1
        }
        if (this.allColumns.length) {
            this.tempTreeData = JSON.parse(JSON.stringify(this.allColumns))
            let id = this.allColumns.find(x => x.key === 'id')
            if (id) {
                this.orderBy = 'id asc'
            } else {
                this.orderBy = this.allColumns[0].key + ' desc'
            }
        }

        if (this.menu_code) this.resource = 'page_export' + this.menu_code
    }

    private onSubmit() {
        this.showTip = false
        if (this.dataRange == 1 && this.selectedRowKeys == '') {
            this.message = '请先选择要导出的数据行'
            this.showTip = true
            return
        }
        if (
            (this.type === 'self' && this.targetKeys.length == 0) ||
            (this.type === 'temp' && this.tempCheckedKeys.length == 0)
        ) {
            this.message = this.$t('less_one_required')
            this.showTip = true
            return
        }

        this.export()
        // this.submit()
    }

    private targetKeys: any[] = []

    private handleChange(nextTargetKeys, direction, moveKeys) {
        this.targetKeys = nextTargetKeys
        if (this.type === 'self' && this.targetKeys.length) {
            this.message = this.$t('less_one_required')
            this.showTip = false
        }
    }

    private onDataRangeChange(e) {
        this.dataRange = e.target.value
    }

    private innerActionService = new InnerActionService()
    private publicService = new PublicService()
    private loadingService = new LoadingService()
    private pageService = new PageService()

    private async getExportData(index) {
        this.pageService.pageSize = 1000
        this.pageService.pageIndex = index
        this.innerActionService.setActionAPI(this.queryUrl, this.menu_code)
        return await this.publicService
            .queryExportPagination(
                new RequestParams(
                    {
                        query_condition: this.queryCondition,
                        order_by: this.orderBy,
                        export_columns:
                            this.type === 'self'
                                ? this.targetKeys
                                : this.tempCheckedKeys
                    },
                    {
                        page: this.pageService,
                        loading: this.loadingService,
                        innerAction: this.innerActionService
                    }
                )
            )
            .toPromise()
    }

    private async digui(num, ret, index) {
        if (index > num) {
            this.export2file(ret)
        } else {
            this.getExportData(index)
                .then((data: any) => {
                    index++
                    if (data.length) {
                        for (let i in data) {
                            ret.push(data[i])
                        }
                    }
                    if (data.length < 1000) {
                        index = num + 1 //终止
                    }

                    this.digui(num, ret, index)
                })
                .catch(e => {
                    this.$message.error(e.message)
                    return
                })
        }
    }

    private export() {
        let exportData: any[] = []
        if (this.dataRange == 1) {
            if (this.selectedRowKeys.length) {
                exportData = this.data.filter(x =>
                    this.selectedRowKeys.includes(x[this.rowKey])
                )
                this.export2file(exportData)
            }
        } else if (this.dataRange == 2) {
            this.export2file(this.data)
        } else if (this.dataRange == 3) {
            this.digui(30, exportData, 1)
        }
    }

    private export2file(exportData) {
        let datas: any = []
        let hasChildren: any = false
        for (let i of exportData) {
            datas.push(i)

            if (i.children !== undefined && i.children.length) {
                hasChildren = true

                for (let j of i.children) {
                    j['is_children'] = true
                    datas.push(j)
                }
            }
        }
        const xlsxUtil = new XLSXUtil()
        let columnList: any = {}
        let params: any = []
        let widths: any = []
        let _that = this

        let clms: any = []
        if (this.type === 'self') {
            clms = this.targetKeys
        } else {
            clms = this.tempCheckedKeys
        }

        if (hasChildren) {
            columnList['Is_Parent'] = '层级'
        }
        for (let i of clms) {
            let title = this.allColumns.find(x => x.key == i)
            columnList[i] = title ? title.title : i
            widths.push(20)
            params = datas.map(x => {
                let rows: any = {}
                if (hasChildren) {
                    rows['Is_Parent'] =
                        x.is_children !== undefined && x.is_children ? '-' : '+'
                }
                for (let k of clms) {
                    let vl: any = x[k]
                    if (
                        x[k] != null &&
                        typeof x[k] == 'object' &&
                        x[k][1] != undefined
                    ) {
                        vl = x[k][1]
                    } else if (x[k] != null && typeof x[k] == 'object') {
                        vl = JSON.stringify(x[k])
                    }
                    rows[k] = vl
                }
                return rows
            })
        }

        xlsxUtil.readFromJson(columnList, params, widths)
        xlsxUtil.exportFile(this.fileName)

        this.submit()
    }

    private templateList: any = []
    private type: any = 'self'
    private currentLi: any = 0
    private hoverLi: any = ''
    private tempTreeData: any = []
    private currentTemplateData: any = []
    private tempSelectedKeys: any = []
    private tempCheckedKeys: any = []
    private defaultShowSelectValue: any = false

    private resouce: any = '' //TODO

    private generalService = new GeneralService()

    private onPanelChange(key) {
        if (key == 'tab1') {
            this.type = 'self'
        } else {
            this.type = 'temp'
            if (this.templateList.length) {
                this.onTempLiClick(this.templateList[0].id)
            }
        }
    }

    private onTempLiClick(e) {
        this.currentLi = e
        this.getTempCheckedColumns(e)
    }

    private hoverEvt(item) {
        this.hoverLi = item.id
    }

    private leaveEvt(item) {
        this.hoverLi = ''
    }

    private onTempSelect(selectedKeys, info) {
        this.tempSelectedKeys = selectedKeys
    }

    private getTempCheckedColumns(id) {
        this.generalService
            .query_table_schema_export_template_column(
                new RequestParams({
                    table_name: this.resource,
                    template_type: 10,
                    export_id: id
                })
            )
            .subscribe(
                data => {
                    this.currentTemplateData = data
                    this.tempCheckedKeys = this.tempSelectedKeys = data
                        .sort(this.compareNum('sort_order'))
                        .map(x => x.attname)
                    this.tempTreeData = data
                        .filter(x => this.tempCheckedKeys.includes(x.attname))
                        .map((y, i) => {
                            let item = this.allColumns.find(
                                z => z.key === y.attname
                            )
                            return {
                                key: y.attname,
                                title: item ? item.title : y.description,
                                sort_order: y.sort_order,
                                scopedSlots: { title: 'custom' }
                            }
                        })
                    this.tempCheckedKeys = this.tempSelectedKeys = data.map(
                        x => x.name
                    )
                    this.defaultShowSelectValue = true
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getTemplateList() {
        this.generalService
            .query_table_schema_export_template(
                new RequestParams({
                    table_name: 'page_export' + this.menu_code,
                    template_type: 10
                })
            )
            .subscribe(
                data => {
                    this.templateList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private addTemplate() {
        if (this.tempCheckedKeys.length <= 0) {
            this.$message.error('请先选择列')
            return
        }
        this.$modal
            .open(
                ExportTemplateForm,
                {},
                {
                    title: '编辑模板'
                }
            )
            .subscribe(
                data => {
                    this.generalService
                        .save_table_schema_export_template(
                            new RequestParams({
                                save_flag: 0,
                                id: 0,
                                name: data.name,
                                resource: this.resource,
                                template_type: 10,
                                column_list: this.tempSelectedKeys
                            })
                        )
                        .subscribe(
                            () => {
                                this.$message.success('保存成功')
                                this.getTemplateList()
                            },
                            err => {
                                this.$message.error(err.message)
                            }
                        )
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private editTemplateName(item) {
        this.onTempLiClick(item.id)
        this.$modal
            .open(
                ExportTemplateForm,
                {
                    template: item
                },
                {
                    title: '编辑模板名称'
                }
            )
            .subscribe(
                data => {
                    this.generalService
                        .save_table_schema_export_template(
                            new RequestParams({
                                save_flag: 1,
                                id: item.id,
                                name: data.name,
                                resource: this.resource,
                                template_type: 10,
                                column_list: this.tempSelectedKeys
                            })
                        )
                        .subscribe(
                            () => {
                                this.$message.success('保存成功')
                                this.getTemplateList()
                            },
                            err => {
                                this.$message.error(err.message)
                            }
                        )
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private deleteTemplate() {
        this.generalService
            .delete_table_schema_export_template(
                new RequestParams({
                    export_id: this.currentLi
                })
            )
            .subscribe(
                () => {
                    this.$message.success('删除成功')
                    this.getTemplateList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private copyTemplate() {
        let template = this.templateList.find(x => x.id == this.currentLi)
        if (!template) {
            this.$message.error('请先选择模板')
            return
        }
        this.generalService
            .save_table_schema_export_template(
                new RequestParams({
                    save_flag: 0,
                    id: 0,
                    name: template.name + '_copy',
                    resource: this.resource,
                    template_type: 10,
                    column_list: this.tempSelectedKeys
                })
            )
            .subscribe(
                () => {
                    this.$message.success('复制成功')
                    this.getTemplateList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private saveTemplate() {
        let template = this.templateList.find(x => x.id == this.currentLi)
        if (!template) {
            this.$message.error('请先选择模板')
            return
        }
        this.generalService
            .save_table_schema_export_template(
                new RequestParams({
                    save_flag: 1,
                    id: template.id,
                    name: template.name,
                    resource: this.resource,
                    template_type: 10,
                    column_list: this.tempSelectedKeys
                })
            )
            .subscribe(
                () => {
                    this.$message.success('保存成功')
                    this.getTemplateList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onSelectAllChange(e) {
        let value = e.target.checked
        if (value) {
            //全选
            this.tempSelectedKeys = this.tempTreeData.map(x => x.key)
        } else {
            this.tempSelectedKeys = []
        }
    }
    private tempOldSelectData: any = [] //保存模板选中项临时排序后的结果
    private onShowSelectChange(e) {
        let value = e.target.checked
        if (value) {
            this.tempTreeData = this.allColumns.filter(x =>
                this.tempSelectedKeys.includes(x.key)
            )

            if (this.tempOldSelectData.length) {
                this.tempTreeData = this.tempTreeData
                    .map(x => {
                        let sort = this.tempOldSelectData.find(
                            y => y.key === x.key
                        )
                        if (sort && sort.sort) {
                            x.sort = sort.sort
                        }
                        return x
                    })
                    .sort(this.compareNum('sort'))
            }
        } else {
            this.tempOldSelectData = JSON.parse(
                JSON.stringify(this.tempTreeData)
            )
            this.tempTreeData = this.allColumns.map(x => x)
        }
    }

    private sortUp(item) {
        let flag: any = 0
        for (let i in this.tempTreeData) {
            if (this.tempTreeData[i].key === item.key) {
                flag = i
                if (flag > 0) {
                    let sort = this.tempTreeData[i].sort_order
                    this.tempTreeData[i].sort_order = this.tempTreeData[
                        flag - 1
                    ].sort_order
                    this.tempTreeData[flag - 1].sort_order = sort
                }
                this.tempSelectedKeys = this.tempTreeData
                    .sort(this.compareNum('sort_order'))
                    .map(x => x.key)
                break
            }
        }
    }

    private compareNum(property) {
        return function(a, b) {
            var value1 = a[property]
            var value2 = b[property]
            return value1 - value2
        }
    }

    private sortDown(item) {
        let flag: any = 0
        for (let i in this.tempTreeData) {
            if (this.tempTreeData[i].key === item.key) {
                flag = i
                if (flag < this.tempTreeData.length - 1) {
                    let sort = this.tempTreeData[i].sort_order
                    this.tempTreeData[i].sort_order = this.tempTreeData[
                        parseInt(flag) + 1
                    ].sort_order
                    this.tempTreeData[parseInt(flag) + 1].sort_order = sort
                }
                this.tempSelectedKeys = this.tempTreeData
                    .sort(this.compareNum('sort_order'))
                    .map(x => x.key)
                break
            }
        }
    }

    private sortUpTb(item) {
        let flag: any = 0
        for (let i in this.targetKeys) {
            if (this.targetKeys[i] === item.key) {
                flag = i
                if (flag > 0) {
                    this.$nextTick(() => {
                        let sort = this.targetKeys[flag]
                        this.targetKeys[i] = this.targetKeys[flag - 1]
                        this.targetKeys[flag - 1] = sort
                    })
                }
                break
            }
        }
        this.targetKeys = this.targetKeys.map(x => x)
    }

    private sortDownTb(item) {
        let flag: any = 0
        for (let i in this.targetKeys) {
            if (this.targetKeys[i] === item.key) {
                flag = i
                if (flag < this.targetKeys.length - 1) {
                    let sort = this.targetKeys[flag]
                    this.targetKeys[i] = this.targetKeys[parseInt(flag) + 1]
                    this.targetKeys[parseInt(flag) + 1] = sort
                }
                break
            }
        }
        this.targetKeys = this.targetKeys.map(x => x)
    }

    private isHoverTb: any = ''
    private isHover: any = ''

    private onMouseenter(item) {
        this.isHover = item.key
    }

    private onMouseleave(item) {
        this.isHover = ''
    }

    private onMouseenterTb(item) {
        this.isHoverTb = item.key
    }

    private onMouseleaveTb() {
        this.isHoverTb = ''
    }

    private getRowSelection({ selectedKeys, itemSelectAll, itemSelect }) {
        return {
            onSelectAll(selected, selectedRows) {
                const treeSelectedKeys = selectedRows
                    .filter(item => !item.disabled)
                    .map(({ key }) => key)
                const diffKeys = selected
                    ? difference(treeSelectedKeys, selectedKeys)
                    : difference(selectedKeys, treeSelectedKeys)
                itemSelectAll(diffKeys, selected)
            },
            onSelect({ key }, selected) {
                itemSelect(key, selected)
            },
            selectedRowKeys: selectedKeys
        }
    }

    private onTableRowEvent(record) {
        return {
            props: {},
            on: {
                mouseenter: event => {
                    this.onMouseenterTb(record)
                },
                mouseleave: event => {
                    this.onMouseleaveTb()
                }
            }
        }
    }
}
</script>

<i18n>
{
  "en-us":{
      "no_select_columns":"Remain Columns",
      "selected_columns":"Selected Columns",
      "item": "Items",
      "empty": "Empty",
      "input_search": "PLZ enter the query content",
      "less_one_required": "Select at least one column",
      "submit": "Submit",
      "cancel": "Cancel",
      "selected-items": "Selected Items",
      "table-datas": "Current Table Page",
      "all-datas": "All Table Datas",
      "export-data-range": "Export data range"
  },
  "zh-cn":{
      "no_select_columns":"未选列",
      "selected_columns":"已选列",
      "item": "项",
      "empty": "列表为空",
      "input_search": "请输入查询内容",
      "less_one_required": "请至少选择一列",
      "submit": "提交",
      "cancel": "取消",
      "selected-items": "表格选中项",
      "table-datas": "表格当前页",
      "all-datas": "表格全部项",
      "export-data-range": "导出数据范围"
  }
}
</i18n>
