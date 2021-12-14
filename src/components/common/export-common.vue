<template>
    <section class="component edit-customer">
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
                        :filter-option="filterOption"
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
            <a-tab-pane key="tab2" tab="模板导出" force-render>
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
                                        @mouseleave="() => onMouseleave"
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
            <a-alert
                type="error"
                v-if="showTip"
                :message="err_message"
                banner
            />
        </p>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('cancel')
            }}</a-button>
            <a-button type="primary" @click="onSubmit">{{
                $t('exprot')
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
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { GeneralService } from '@/services/general.service'
import ExportTemplateForm from './export-template-form.vue'
import appConfig from '@/config/app.config'
import difference from 'lodash/difference'

@Component({
    components: {}
})
export default class ExportCommon extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private table_name

    @Prop()
    private resource

    @Prop()
    private query_condition

    @Prop()
    private menu_code

    private generalService = new GeneralService()
    private loadingService = new LoadingService()

    private allColumns: any = []

    private showTip: any = false

    private tempTreeData: any = []

    private templateList: any = []

    private currentLi: any = 0

    private currentTemplateData: any = []

    private tempSelectedKeys: any = []

    private tempCheckedKeys: any = []

    private defaultShowSelectValue: any = false

    private type: any = 'self'

    private hoverLi: any = ''

    private isHover: any = ''

    private err_message: any = this.$t('less_one_required')

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

    private targetKeys: any[] = []

    //维护固定导出列和table的对应关系
    private defaultFixedColumns: any = {
        product_template: ['default_code']
    }

    private created() {
        this.getAllColumns()
        this.getTemplateList()
    }

    private mounted() {
        //判断有没有固定要导出的列
        if (this.table_name) {
            this.targetKeys = this.defaultFixedColumns[this.table_name] || []
        }

        if (this.templateList.length > 0) {
            this.currentLi = this.templateList[0].id
            this.getTempCheckedColumns(this.currentLi)
        }
    }

    private onTempSelect(selectedKeys, info) {
        // this.tempSelectedKeys = this.sortByReturnColumn(selectedKeys)
        this.tempSelectedKeys = selectedKeys
    }

    private sortByReturnColumn(selectedKeys) {
        let orderData = this.allColumns
            .filter(x => selectedKeys.includes(x.key))
            .map(x => x.key)

        return orderData
    }

    private onTempLiClick(e) {
        this.currentLi = e
        this.getTempCheckedColumns(e)
    }

    private getTempCheckedColumns(id) {
        this.generalService
            .query_table_schema_export_template_column(
                new RequestParams({
                    table_name: this.table_name,
                    export_id: id
                })
            )
            .subscribe(
                data => {
                    this.currentTemplateData = data
                    this.tempCheckedKeys = this.tempSelectedKeys = data
                        .filter(x => x.checked)
                        .sort(this.compareNum('sort_order'))
                        .map(x => x.attname)
                    //TODO
                    this.defaultShowSelectValue = true
                    this.tempTreeData = data
                        .filter(x => this.tempCheckedKeys.includes(x.attname))
                        .sort(this.compareNum('sort_order'))
                        .map(y => {
                            return {
                                key: y.attname,
                                title: y.description,
                                sort: y.sort_order,
                                scopedSlots: { title: 'custom' }
                            }
                        })
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getAllColumns() {
        this.generalService
            .query_table_schema(
                new RequestParams({
                    table_name: this.table_name
                })
            )
            .subscribe(
                data => {
                    // let sortData = data.sort(this.compare('description'))
                    this.allColumns = data
                        .filter(x => x.attname !== 'id')
                        .map((x, i) => {
                            return {
                                key: x.attname,
                                title: x.description,
                                sort: i,
                                scopedSlots: { title: 'custom' }
                            }
                        })

                    this.tempTreeData = this.allColumns.map(y => y)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private compare(property) {
        return function(a, b) {
            var value1 = a[property].charCodeAt(0)
            var value2 = b[property].charCodeAt(0)
            return value1 - value2
        }
    }

    private getTemplateList() {
        this.generalService
            .query_table_schema_export_template(
                new RequestParams({
                    table_name: this.resource
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

    private onSubmit() {
        this.showTip = false
        if (this.type == 'self' && this.targetKeys.length == 0) {
            this.err_message = this.$t('less_one_required')
            this.showTip = true
            return
        }
        this.export()
    }

    private export() {
        let tempName: any = ''
        if (this.type == 'temp' && this.currentLi) {
            let template = this.templateList.find(x => x.id == this.currentLi)
            if (template) {
                tempName = template.name
            }
        }
        let file_name: any = this.type == 'self' ? '' : tempName

        let export_columns =
            this.type == 'self' ? this.targetKeys : this.tempSelectedKeys

        if (!export_columns.includes('id')) {
            export_columns.unshift('id')
        }

        let fixedColumns = this.defaultFixedColumns[this.table_name] || []
        if (fixedColumns.length) {
            for (let i of fixedColumns) {
                if (!export_columns.includes(i)) {
                    export_columns.push(i)
                }
            }
        }

        //去掉query_condition中的id条件
        if (this.query_condition.query_condition.length) {
            let newConditions: any = []
            for (let item of this.query_condition.query_condition) {
                if (item.query_name !== 'id') {
                    newConditions.push(item)
                }
            }
            this.query_condition.query_condition = newConditions
        }

        let url =
            appConfig.server +
            '/general/export_table_name_data?query_condition=' +
            encodeURIComponent(
                JSON.stringify(this.query_condition.query_condition)
            ) +
            '&file_name=' +
            file_name +
            '&table_name=' +
            this.resource

        if (this.resource == 'product.template') {
            url =
                appConfig.server +
                '/system_api/download?query_condition=' +
                encodeURIComponent(
                    JSON.stringify(this.query_condition.query_condition)
                ) +
                '&inner_action=product_management/export_product_common_info'
        }

        url +=
            '&export_columns=' +
            encodeURIComponent(JSON.stringify(export_columns)) +
            '&menu_code=' +
            this.menu_code

        window.open(url, '_blank')
    }

    private handleChange(nextTargetKeys, direction, moveKeys) {
        let fixedColumns: any = this.defaultFixedColumns[this.table_name] || []
        if (fixedColumns.length && direction === 'left') {
            for (let i of moveKeys) {
                if (fixedColumns.includes(i)) {
                    this.err_message = '不能移除固定列'
                    this.showTip = true
                    return
                }
            }
        }

        if (direction == 'right' && moveKeys.length) {
            nextTargetKeys = nextTargetKeys.filter(x => !moveKeys.includes(x))
            for (let i of moveKeys) {
                nextTargetKeys.push(i)
            }
        }
        this.targetKeys = nextTargetKeys
        if (this.targetKeys.length) {
            this.showTip = false
        }
    }

    // private inverseSort(list) {
    //     let item = list[0]
    //     delete list[0]
    //     list.push(item)
    //     return list
    // }

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

    private tmpTreeList: any = []

    private onTempSelectSearch(e) {
        if (e.target.value == '') {
            this.tempTreeData = this.tmpTreeList.map(x => x)
            this.tmpTreeList = []
            if (this.defaultShowSelectValue) {
                this.tempTreeData = this.allColumns.filter(x =>
                    this.tempSelectedKeys.includes(x.key)
                )
            } else {
                this.tempTreeData = this.allColumns.map(x => x)
            }
        } else {
            if (!this.tmpTreeList.length) {
                this.tmpTreeList = this.tmpTreeList.filter(x =>
                    this.tempSelectedKeys.includes(x.key)
                )
            }
            if (this.defaultShowSelectValue) {
                this.tempTreeData = this.allColumns.filter(x =>
                    this.tempSelectedKeys.includes(x.key)
                )
            } else {
                let filterData = this.allColumns.filter(x =>
                    x.title.toLowerCase().includes(e.target.value.toLowerCase())
                )
                this.tempTreeData = this.allColumns.filter(x =>
                    this.tempSelectedKeys.includes(x.key)
                )
                for (let i in this.tempTreeData) {
                    let find = filterData.find(
                        x => x.title == this.tempTreeData[i].title
                    )
                    if (!find) {
                        filterData.push(this.tempTreeData[i])
                    }
                }
                this.tempTreeData = filterData
            }
        }
    }

    private hoverEvt(item) {
        this.hoverLi = item.id
    }

    private leaveEvt(item) {
        this.hoverLi = ''
    }

    private sortUp(item) {
        let flag: any = 0
        for (let i in this.tempTreeData) {
            if (this.tempTreeData[i].key === item.key) {
                flag = i
                if (flag > 0) {
                    let sort = this.tempTreeData[i].sort
                    this.tempTreeData[i].sort = this.tempTreeData[flag - 1].sort
                    this.tempTreeData[flag - 1].sort = sort
                }
                this.tempSelectedKeys = this.tempTreeData
                    .sort(this.compareNum('sort'))
                    .map(x => x.key)
                break
            }
        }
    }

    private sortDown(item) {
        let flag: any = 0
        for (let i in this.tempTreeData) {
            if (this.tempTreeData[i].key === item.key) {
                flag = i
                if (flag < this.tempTreeData.length - 1) {
                    let sort = this.tempTreeData[i].sort
                    this.tempTreeData[i].sort = this.tempTreeData[
                        parseInt(flag) + 1
                    ].sort
                    this.tempTreeData[parseInt(flag) + 1].sort = sort
                }
                this.tempSelectedKeys = this.tempTreeData
                    .sort(this.compareNum('sort'))
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

    private compareNum(property) {
        return function(a, b) {
            var value1 = a[property]
            var value2 = b[property]
            return value1 - value2
        }
    }

    private filterOption(inputValue, option) {
        return option.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    }

    private onMouseenter(item) {
        this.isHover = item.key
    }

    private onMouseleave(item) {
        this.isHover = ''
    }

    private isHoverTb: any = ''

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
      "exprot": "Export",
      "sort_up": "Sort UP",
      "sort_down": "Sort Down"
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
      "exprot": "导出",
      "sort_up": "上移",
      "sort_down": "下移"
  }
}
</i18n>
