<template>
    <page-container ref="pageContainer" @changeSearchState="showhideSearch">
        <data-form
            :extends="extendItems"
            ref="dataForm"
            @submit="getAllPage"
            :column="1"
            :showSearch="showSearch"
            :labelCol="{ span: 2 }"
            :wrapperCol="{ span: 16, offset: 0 }"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item :label="$t('columns.sub_system_code')" required>
                    <a-select
                        v-decorator="[
                            'sub_system_code',
                            {
                                initialValue: defaultSubSystemCode
                            },
                            {
                                rules: rules.required
                            }
                        ]"
                        size="small"
                        style="width: 240px;"
                        @change="e => onSystemChange(e)"
                    >
                        <a-select-option
                            :value="item.sub_system_code"
                            v-for="item of subSystemList"
                            :key="item.sub_system_code"
                            >{{ $t(item.sub_system_name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item :label="$t('columns.model_code')">
                    <a-select
                        v-decorator="['model_code', { initialValue: '' }]"
                        size="small"
                        style="width: 240px;"
                        @change="e => onModelChange(e)"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.model_code"
                            v-for="item of modelList"
                            :key="item.model_code"
                            >{{ $t(item.model_name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item :label="$t('columns.sub_model_code')">
                    <a-select
                        v-decorator="['sub_model_code', { initialValue: '' }]"
                        size="small"
                        style="width: 240px;"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.sub_model_code"
                            v-for="item of subModelList"
                            :key="item.sub_model_code"
                        >
                            {{ $t(item.sub_model_name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.menu_name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['menu_name']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.menu_name_eng')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['menu_name_eng']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
            </template>
        </data-form>
        <a-card class="margin-y">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="menu_code"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getAllPage"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                        onTrClick(record)
                    }
                "
                style="table-layout:fixed;"
                :scroll="{ y: 200 }"
            >
                <a-table-column
                    :title="$t('columns.menu_name')"
                    key="menu_name"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.menu_name }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.menu_name_eng')"
                    data-index="menu_name_eng"
                    key="menu_name_eng"
                    width="14%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    title="URL"
                    data-index="menu_url"
                    key="menu_url"
                    width="15%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.sub_system_code')"
                    key="sub_system_code"
                    width="12%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.sub_system_name }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.model_code')"
                    key="model_code"
                    width="12%"
                    align="center"
                >
                    <template slot-scope="row">{{ row.model_name }}</template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.sub_model_code')"
                    key="sub_model_code"
                    width="12%"
                    align="center"
                >
                    <template slot-scope="row"
                        >{{ row.sub_model_name }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.menu_description')"
                    data-index="menu_description"
                    key="menu_description"
                    width="15%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.memo')"
                    data-index="memo"
                    key="memo"
                    width="15%"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('action.action')"
                    key="action"
                    width="10%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-menu slot="overlay">
                            <a-menu-item @click="onEdit(row)"
                                >{{ $t('action.edit') }}
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
        <a-card class="margin-y" v-if="current">
            <QueryConditionView
                :current="current"
                :systemUsers="systemUsers"
            ></QueryConditionView>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { WareHouseService } from '~/services/warehouse.service'
import { SystemService } from '~/services/system.service'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { UserService } from '../../services/user.service'
import QueryConditionView from '~/components/basic_manage/query-condition-view.vue'
import QueryConditionEdit from '~/components/basic_manage/query-condition-edit.vue'
import { formConfig } from '../../config/form.config'
import moment from 'moment'

@Page({
    layout: 'workspace',
    name: 'query-condition-manage'
})
@Component({
    components: {
        QueryConditionView,
        QueryConditionEdit
    }
})
export default class QueryConditionManage extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    private showSearch: any = true

    private showhideSearch(flag) {
        this.showSearch = flag
    }

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    private systemService = new SystemService()
    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    // 表格数据源
    private data: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private selectedRows: any[] = []

    // 详情项
    private current = null

    private subSystemList: any[] = []

    private modelList: any[] = []

    private subModelList: any[] = []

    private defaultSubSystemCode: any = ''

    private defaultModuleCode: any = ''

    private defaultSubModuleCode: any = ''

    private systemUsers: any[] = []

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private created() {
        this.getSubSystemList()
        const userService = new UserService()
        userService.all(new RequestParams()).subscribe(data => {
            this.systemUsers = data
        })
    }

    private getSubSystemList() {
        this.systemService
            .queryAllSubSystem(
                new RequestParams(
                    CommonService.createQueryCondition(
                        { status: 20 },
                        {
                            ...formConfig.condition
                        }
                    ),
                    {
                        page: this.pageService
                    }
                )
            )
            .subscribe(
                data => {
                    this.subSystemList = data.filter(x => x.status === 20)
                    if (data.length) {
                        this.defaultSubSystemCode = data[0].sub_system_code
                        this.getModuleList()
                    }
                },
                () => {
                    this.$message.error('子系统获取失败')
                }
            )
    }

    private getModuleList() {
        this.systemService
            .queryAllSystemModule(
                new RequestParams({
                    sub_system_code: this.defaultSubSystemCode
                })
            )
            .subscribe(
                data => {
                    this.modelList = data.filter(x => x.status === 20)
                    if (data.length) {
                        this.defaultModuleCode = data[0].model_code
                        this.getSubModule()
                    }
                },
                () => {
                    this.$message.error('模块获取失败')
                }
            )
    }

    private getSubModule() {
        this.subModelList = []
        this.systemService
            .queryAllSubSystemModule(
                new RequestParams({ model_code: this.defaultModuleCode })
            )
            .subscribe(
                data => {
                    this.subModelList = data.filter(x => x.status === 20)
                    if (data.length) {
                        this.defaultSubModuleCode = data[0].sub_model_code
                    }
                },
                () => {
                    this.$message.error('子模块获取失败')
                }
            )
    }

    private onEdit(row) {
        this.$modal
            .open(
                QueryConditionEdit,
                {
                    current: row
                },
                {
                    title: '编辑条件查询',
                    width: '60%'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
            })
    }

    private getAllPage() {
        this.dataForm
            .validateFields()
            .then(values => {
                this.systemService
                    .queryAllMenu(
                        new RequestParams(
                            CommonService.createQueryCondition(values, {
                                menu_name: 'like',
                                menu_name_eng: 'like',
                                ...formConfig.condition
                            }),
                            {
                                page: this.pageService,
                                loading: this.loadingService
                            }
                        )
                    )
                    .subscribe(data => {
                        this.data = data
                        this.selectedRowKeys = []
                    })
            })
            .catch(err => {
                // 异常处理
            })
    }

    private onTrClick(record) {
        let info = this.data.find(x => x.menu_code === record)
        this.selectedRows = [info]
        if (info) {
            this.onView(info)
        }
    }

    private onView(row) {
        this.systemService
            .querySearchConditionByMenuCode(
                new RequestParams(
                    {
                        menu_code: row.menu_code
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(data => {
                for (var item of data) {
                    var sysuser = this.systemUsers.find(
                        x => x.code === item.write_uid
                    )
                    item['user_id'] = sysuser ? sysuser.name : item.user_id
                    item['write_uid'] = sysuser ? sysuser.name : item.write_uid
                    let localTime = moment.utc(item['write_date']).toDate()
                    item['write_date'] = moment(localTime).format(
                        'YYYY-MM-DD HH:mm'
                    )
                }
                this.current = data
            })
    }

    private onSystemChange(e) {
        this.defaultSubSystemCode = e
        this.getModuleList()
    }

    private onModelChange(e) {
        this.defaultModuleCode = e
        this.getSubModule()
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "",
        "columns": {
            "sub_system_code": "sub_system_code",
            "model_code": "model_code",
            "sub_model_code": "sub_model_code",
            "menu_name": "menu_name",
            "menu_name_eng": "menu_name_eng",
            "menu_description": "menu_description",
            "memo": "memo"
        },
        "action": {
            "create": "Create",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Ok",
            "cancel": "Cancel",
            "more": "More"
        }
    },
    "zh-cn": {
        "desc": "",
        "columns": {
            "sub_system_code": "子系统",
            "model_code": "模块",
            "sub_model_code": "子模块",
            "menu_name": "菜单名称",
            "menu_name_eng": "英文名称",
            "menu_description": "功能描述",
            "memo": "备注"
        },
        "action": {
            "create": "新建",
            "edit": "编辑查询条件",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作"
        }
    }
}
</i18n>
