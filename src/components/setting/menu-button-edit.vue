<template>
    <section class="component">
        <div style="margin:10px 0;">
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
        </div>
        <div>
            <a-table
                :dataSource="data"
                :pagination="false"
                :rowKey="
                    (record, index) => {
                        return index
                    }
                "
                :customRow="handleCustomRow"
                :scroll="{ y: 400 }"
                bordered
                class="baseTable"
            >
                <a-table-column
                    :title="$t('columns.authorityName')"
                    align="center"
                    width="20%"
                    key="authorityName"
                >
                    <template slot-scope="row">
                        <a-input
                            v-if="row.editable"
                            size="small"
                            :placeholder="$t('plzInput')"
                            v-model="row.button_name"
                            @keyup.native="btKeyUp"
                        ></a-input>
                        <span v-else>
                            {{ row.button_name }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.button_cnName')"
                    width="20%"
                    key="button_cnName"
                >
                    <template slot-scope="row">
                        <a-input
                            v-if="row.editable"
                            size="small"
                            :placeholder="$t('plzInput')"
                            v-model="row.button_name_chn"
                        ></a-input>
                        <span v-else>
                            {{ row.button_name_chn }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.button_enName')"
                    width="20%"
                    key="button_enName"
                >
                    <template slot-scope="row">
                        <a-input
                            v-if="row.editable"
                            size="small"
                            :placeholder="$t('plzInput')"
                            v-model="row.button_name_eng"
                        ></a-input>
                        <span v-else>
                            {{ row.button_name_eng }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.isAuthority')"
                    width="10%"
                    align="center"
                    key="isAuthority"
                >
                    <template slot-scope="row">
                        <a-checkbox
                            v-if="row.editable"
                            :checked="row.authority_button"
                            @change="
                                e =>
                                    onCheckChange(
                                        row,
                                        'authority_button',
                                        e.target.checked
                                    )
                            "
                        />
                        <span v-else
                            ><a-checkbox
                                disabled
                                :checked="row.authority_button"
                        /></span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.createName')"
                    width="15%"
                    key="create_uid"
                >
                    <template slot-scope="scope">
                        {{ scope.create_uid[1] }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.createDate')"
                    width="15%"
                    align="center"
                    key="createDate"
                >
                    <template slot-scope="scope">
                        {{ scope.create_date | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.operation')"
                    key="operation"
                    width="15%"
                >
                    <template slot-scope="row, record, index">
                        <!--                        <a @click="e => onEditLine(e)">-->
                        <!--                            {{ $t('actions.edit') }}-->
                        <!--                        </a>-->
                        <a
                            href="javascript:;"
                            v-if="row.editable"
                            @click="e => cancelBtn(e, index)"
                        >
                            {{ $t('actions.cancel') }}
                        </a>
                        <a-popconfirm
                            :title="$t('delete')"
                            :okText="$t('actions.ok')"
                            :cancelText="$t('actions.cancel')"
                            placement="top"
                            @confirm="e => onDel(e, index)"
                        >
                            <a @click.stop="">
                                {{ $t('actions.delete') }}
                            </a>
                        </a-popconfirm>
                    </template>
                </a-table-column>
            </a-table>
        </div>
    </section>
</template>
<style lang="less">
.baseTable {
    .ant-table-header {
        overflow-y: auto !important;
    }
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { RequestParams } from '@/core/http'
import { CommonService } from '@/shared/utils/common.service'
import { LoadingService } from '@/bootstrap/services/loading.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

@Component({
    components: {}
})
export default class MenuButtonEdit extends Vue {
    @Prop()
    menuID: any

    @Prop({ default: 0 })
    cnt: any

    private data: any[] = []

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

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

    private handleCustomRow(record, index) {
        return {
            on: {
                click: () => {
                    const newData = [...this.data]
                    const target = newData.filter((item, i) => index === i)[0]
                    if (target) {
                        target.editable = true
                        this.data = newData
                    }
                }
            }
        }
    }

    //禁止输入中文
    private btKeyUp(e) {
        e.target.value = e.target.value.replace(/[\u4e00-\u9fa5/\s+/]/g, '')
    }

    private onCheckChange(row: any, value: string, isCheck: boolean) {
        row[value] = isCheck
    }

    private addBtn() {
        this.data.push({
            authority_button: true,
            button_name: '',
            button_name_chn: '',
            create_uid: ['', ''],
            button_name_eng: ''
        })
    }

    private saveData() {
        for (let i = 0; i < this.data.length; i++) {
            let item = this.data[i]
            if (!item.button_name) {
                this.$message.error('请输入按钮权限名！')
                return
            }
            if (!item.button_name_chn) {
                this.$message.error('请输入按钮中文名！')
                return
            }
            if (!item.button_name_eng) {
                this.$message.error('请输入按钮英文名！')
                return
            }
        }

        let params: any = this.data.map(x => {
            let item = {
                button_name: x.button_name,
                button_name_chn: x.button_name_chn,
                button_name_eng: x.button_name_eng,
                authority_button: x.authority_button,
                sort_order: 10
            }
            return item
        })
        this.innerAction.setActionAPI(
            'system_management/save_menu_button',
            CommonService.getMenuCode('menu-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { menu_id: this.menuID, menu_button_list: params },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.data.map(v => {
                        v.editable = false
                    })
                    this.refreshData()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onEditLine(e) {
        e.stopPropagation()
    }

    private cancelBtn(e, index) {
        e.stopPropagation()
        const newData = [...this.data]
        const target = newData.filter((item, i) => index === i)[0]
        if (target) {
            delete target.editable
            this.data = newData
        }
    }

    private onDel(e, index) {
        e.stopPropagation()
        this.data.splice(index, 1)
    }

    private cacheData: any = []

    private refreshData() {
        this.innerAction.setActionAPI(
            'system_management/query_button_by_menu_code',
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
                    this.data = data
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
        "actions": {
            "add": "Add",
            "action": "Action",
            "save": "Save",
            "delete": "Delete",
            "cancel": "Cancel",
            "copy": "Copy",
            "edit": "Edit",
            "ok": "Yes"
        },
        "columns": {
            "authorityName": "Authority Name",
            "button_cnName": "Button cnName",
            "button_enName": "Button enName",
            "isAuthority": "IsAuthorization",
            "createName": "Edit Name",
            "createDate": "Edit Date",
            "operation": "Operation"
        },
        "delete": "Are you sure delete?",
        "plzInput": "Please Input",
        "save_success": "Success"
    },
    "zh-cn": {
        "actions": {
            "add": "新增",
            "action": "操作",
            "save": "保存",
            "delete": "删除",
            "cancel": "取消",
            "copy": "复制",
            "edit": "编辑列",
            "ok": "确定"
        },
        "columns": {
            "authorityName": "权限名",
            "button_cnName": "中文名",
            "button_enName": "英文名",
            "isAuthority": "是否授权",
            "createName": "修改人",
            "createDate": "修改时间",
            "operation": "操作"
        },
        "delete": "确定要删除吗?",
        "plzInput": "请输入",
        "save_success": "成功"
    }
}
</i18n>
