<template>
    <section class="component order-base-detail;height:">
        <div style="padding:0 20px 0 20px;height:30px;">
            <a-button @click="addBtn" type="default" size="small">
                <a-icon type="plus" />
                {{ $t('actions.add') }}
            </a-button>
            <a-button
                @click="saveData"
                type="primary"
                size="small"
                style="margin-left:10px;"
            >
                <a-icon type="save" />
                {{ $t('actions.save') }}
            </a-button>
            <a-button
                @click="updateMenuApiInfo"
                type="primary"
                size="small"
                style="margin-left:10px;"
            >
                <a-icon type="sync" />
                {{ $t('actions.updateMenuApiInfo') }}
            </a-button>
        </div>
        <div>
            <a-table
                :dataSource="data"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="index"
                :customRow="
                    rowKey => ({
                        on: {
                            // 单击每行
                            click: () => {
                                currentRow = rowKey.index
                            }
                        }
                    })
                "
                :scroll="{ y: 400 }"
                bordered
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                class="baseTable"
            >
                <a-table-column
                    title="API"
                    key="api_id"
                    align="center"
                    width="20%"
                >
                    <template slot-scope="row">
                        <a-select
                            showSearch
                            v-decorator="['api_id', { initialValue: '' }]"
                            :value="row.api_id"
                            :style="{ width: '100%' }"
                            v-if="currentRow == row.index"
                            @change="e => onRowChange(row, 'api_id', e)"
                            :filterOption="filterSelectOption"
                        >
                            <a-select-option
                                :value="item.code"
                                v-for="item of apiList"
                                :key="item.code"
                            >
                                {{ $t(item.name) }}
                            </a-select-option>
                        </a-select>
                        <span v-else>{{ row.api_id | dict2(apiList) }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('query_name_list')"
                    key="query_name_list"
                    align="left"
                    width="20%"
                >
                    <template slot-scope="row">
                        <span :title="row.query_name_list">
                            {{
                                row.query_name_list &&
                                row.query_name_list.length > 30
                                    ? row.query_name_list.substr(0, 27) + '...'
                                    : ''
                            }}</span
                        >
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('write_uid')"
                    key="write_uid"
                    dataIndex="write_uid"
                    align="left"
                    width="10%"
                >
                    <template slot-scope="write_uid">
                        {{ write_uid | dict2(systemUsers) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('write_date')"
                    key="write_date"
                    align="left"
                    width="10%"
                >
                    <template slot-scope="row">
                        {{ row.write_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('actions.action')"
                    key="action"
                    align="center"
                >
                    <template slot-scope="row">
                        <a @click="e => onEditLine(e, row)">
                            {{ $t('actions.edit') }}
                        </a>
                        <a-popconfirm
                            :title="$t('delete')"
                            :okText="$t('actions.ok')"
                            :cancelText="$t('actions.cancel')"
                            placement="left"
                            @confirm="e => onDel(e, row)"
                        >
                            <a @click.stop="">
                                {{ $t('actions.delete') }}
                            </a>
                        </a-popconfirm>
                        <a
                            v-if="currentRow == row.index"
                            @click="e => cancelBtn(e)"
                        >
                            {{ $t('actions.cancel') }}
                        </a>
                    </template>
                </a-table-column>
            </a-table>
        </div>
        <a-drawer
            :title="$t('actions.edit')"
            placement="bottom"
            width="100%"
            :height="600"
            :visible="drawerShow"
            :body-style="{
                padding: '10px 30px 30px 30px',
                overflow: 'hidden'
            }"
            :closable="true"
            :maskClosable="false"
            @close="onClose"
        >
            <EditApiLines
                :info="lineInfo"
                :apiID="currentApi"
                :id="currentID"
                :menuID="menuID"
                :cnt="subCnt"
            />
        </a-drawer>
    </section>
</template>

<style>
.ant-select-auto-complete.ant-select-sm .ant-input,
.required .ant-calendar-picker-input,
.required .ant-select-selection--single {
    background-color: #ecc5e9;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ProductService } from '@/services/product.service'
import { RequestParams } from '@/core/http'
import { CommonService } from '@/shared/utils/common.service'
import { formConfig } from '@/config/form.config'
import { LoadingService } from '@/bootstrap/services/loading.service'
import UUID from 'uuidjs'
import moment from 'moment'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import EditApiLines from '~/components/setting/edit-api-lines.vue'

@Component({
    components: {
        EditApiLines
    }
})
export default class MenuApiEdit extends Vue {
    @Prop()
    info: any

    @Prop()
    menuID: any

    @Prop()
    apiList: any

    @Prop()
    systemUsers: any

    @Prop({ default: 0 })
    cnt: any

    private currentRow: any = ''

    private data: any[] = []
    private deleteData: any = []

    private lineInfo: any = []

    private currentApi: any = ''

    private currentID: any = ''

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private moment = moment

    private drawerShow: any = false

    private subCnt: any = 0

    // 表格选择项
    private selectedRowKeys: any[] = []

    @Watch('menuID')
    private onMenuIDChange() {
        this.refreshData()
    }

    @Watch('cnt')
    private onCntChange() {
        this.refreshData()
    }

    private created() {
        this.refreshData()
    }

    private addBtn() {
        this.currentRow = UUID.generate()
        this.data.push({
            index: this.currentRow,
            save_flag: 0,
            api_id: 0
        })
    }

    private saveData() {
        if (this.deleteData.length) {
            for (let i of this.deleteData) {
                this.data.push(i)
            }
        }
        let params: any = this.data.map(x => {
            let item = {
                id: x.id,
                save_flag: x.save_flag,
                query_name_list: x.query_name_list,
                api_id: x.api_id
            }
            return item
        })
        this.innerAction.setActionAPI(
            'system_management/save_menu_api_info',
            CommonService.getMenuCode('menu-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { menu_id: this.menuID, menu_api_list: params },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.currentRow = -1
                    this.refreshData()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
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

        if (column == 'column_name') {
            var reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
            if (reg.test(row[column])) {
                this.$message.error('列名中不能包含中文')
                row[column] = ''
            } else {
                if (
                    this.data.find(
                        x =>
                            x.column_name == row[column] && x.index != row.index
                    )
                ) {
                    this.$message.error('列名不能重复')
                    row[column] = ''
                }
            }
        }
    }

    private cancelBtn(e) {
        e.stopPropagation()
        this.currentRow = -1
    }

    private onDel(e, row) {
        e.stopPropagation()
        this.currentRow = -1
        if (row.id > 0) {
            row.save_flag = 2
            this.deleteData.push(row)
        }
        this.data = this.data.filter(x => x.index !== row.index)
    }

    private onClose() {
        this.drawerShow = false
    }

    private onEditLine(e, row) {
        e.stopPropagation()

        if (!row.api_id) {
            this.$message.error('请先选中API')
            return
        }
        this.currentApi = row.api_id
        this.currentID = row.id
        this.drawerShow = true
        this.subCnt++
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private refreshData() {
        this.innerAction.setActionAPI(
            'system_management/query_menu_api_info_by_menu_code',
            CommonService.getMenuCode('menu-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    { menu_id: this.menuID },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.data = data.map(x => {
                        x['index'] = UUID.generate()
                        x['save_flag'] = 1
                        return x
                    })
                    this.selectedRowKeys = []
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private updateMenuApiInfo() {
        if (this.selectedRowKeys.length != 1) {
            this.$message.info('只能选择一条信息更新！！！')
            return
        }

        let row = this.data.find(X => X.index == this.selectedRowKeys[0])
        if (!row) {
            this.$message.info('请选择需要更新的菜单接口信息')
            return
        }

        let menu_api_id = row.id
        if (!menu_api_id) {
            this.$message.info('id信息不存在。')
            return
        }

        this.innerAction.setActionAPI(
            'system_management/update_menu_pagination_api_info',
            CommonService.getMenuCode('menu-manage')
        )

        this.publicService
            .modify(
                new RequestParams(
                    { menu_api_id: menu_api_id },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.currentRow = -1
                    this.refreshData()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }
}
</script>

<i18n>
{
    "en-us": {
        "query_name_list": "Query Name List",
        "write_uid": "Create User",
        "write_date": "Create date",
        "actions": {
            "add": "Add",
            "action": "Action",
            "save": "Save",
            "delete": "Delete",
            "cancel": "Cancel",
            "copy": "Copy",
            "edit": "Edit",
            "updateMenuApiInfo": "Update Menu API Information",
            "ok": "Yes"
        },
        "delete": "Are you sure delete?"
    },
    "zh-cn": {
        "query_name_list": "查询列名",
        "write_uid": "创建人",
        "write_date": "创建时间",
        "actions": {
            "add": "新增",
            "action": "操作",
            "save": "保存",
            "delete": "删除",
            "cancel": "取消",
            "copy": "复制",
            "edit": "编辑列",
            "updateMenuApiInfo": "更新菜单接口信息",
            "ok": "确定"
        },
        "delete": "确定要删除吗?"
    }
}
</i18n>
