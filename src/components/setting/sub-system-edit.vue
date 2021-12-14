<template>
    <section class="component edit-customer">
        <div>
            <span style="margin-left:97%;"
                ><a-button type="primary" size="small" @click="addSubSystem"
                    >新增</a-button
                ></span
            >
        </div>
        <data-table
            :data="subSystemList"
            rowKey="sub_system_code"
            :showExportBtn="false"
        >
            <a-table-column
                title="名称"
                dataIndex="sub_system_name"
                key="sub_system_name"
                style="line-height:30px;height:30px;"
                width="20%"
            ></a-table-column>
            <a-table-column
                title="英文名称"
                dataIndex="sub_system_name_eng"
                key="sub_system_name_eng"
                style="line-height:30px;height:30px;"
                width="20%"
            ></a-table-column>
            <a-table-column
                :title="$t('columns.menuIcon')"
                dataIndex="sub_system_icon"
                key="sub_system_icon"
                style="line-height:30px;height:30px;"
                width="10%"
            ></a-table-column>
            <a-table-column
                title="状态"
                key="status"
                style="line-height:30px;height:30px;"
                width="20%"
                align="center"
            >
                <template slot-scope="row">
                    {{ row.status | dict('SubSystemStatus') | translate }}
                </template>
            </a-table-column>
            <a-table-column
                title="备注"
                dataIndex="memo"
                key="memo"
                style="line-height:30px;height:30px;"
                width="20%"
            ></a-table-column>
            <a-table-column title="操作" key="action" align="center">
                <template slot-scope="row">
                    <a @click="onEdit(row)" v-if="row.status == 20">编辑 </a>
                    <a @click="onDelete(row)" v-if="row.status < 60"> 删除</a>
                </template>
            </a-table-column>
        </data-table>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { SystemService } from '../../services/system.service'
import addSubSystem from '~/components/setting/add-sub-system.vue'
import { CommonService } from '@/shared/utils/common.service'
import { formConfig } from '@/config/form.config'

@Component({
    components: {
        addSubSystem
    }
})
export default class UserEdit extends Vue {
    @Emit('modal.submit')
    private submit(data) {
        return data
    }

    @Prop()
    private user

    @Prop()
    private saveFlag

    private systemService = new SystemService()
    // 分页服务
    private pageService = new PageService()

    private loadingService = new LoadingService()

    private form: any

    private company_account: any = false

    private subSystemList: any[] = []

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public mounted() {
        if (this.user) {
            this.setFormValues()
        }
    }

    public setFormValues() {
        this.form.setFieldsValue(this.user)
    }

    private created() {
        this.getSubSystemList()
        this.form = this.$form.createForm(this)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                this.submit(values)
            }
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
                },
                () => {
                    this.$message.error('子系统获取失败')
                }
            )
    }

    private addSubSystem() {
        this.$modal
            .open(
                addSubSystem,
                {
                    saveFlag: 0
                },
                { title: '新增子系统' }
            )
            .subscribe((data: any[]) => {
                this.$message.success('操作成功')
                this.getSubSystemList()
            })
    }

    private onEdit(row) {
        this.$modal
            .open(
                addSubSystem,
                {
                    saveFlag: 1,
                    warehouse: row
                },
                { title: '编辑子系统' }
            )
            .subscribe((data: any[]) => {
                this.$message.success('更新成功')
                this.getSubSystemList()
            })
    }

    private onDelete(row) {
        this.systemService
            .deleteSubSystem(
                new RequestParams({
                    sub_system_code_list: [row.sub_system_code]
                })
            )
            .subscribe(
                () => {
                    this.$message.success('删除成功')
                    this.getSubSystemList()
                },
                err => {
                    this.$message.error('删除失败' + err.message)
                }
            )
    }
}
</script>

<i18n>
{
    "en-us": {
        "columns": {
            "code": "WareHouse Code",
            "name": "Customer Info",
            "menuIcon": "MenuIcon"
        }
    },
    "zh-cn": {
        "columns": {
            "code": "仓库编码",
            "name": "仓库名称",
            "menuIcon": "图标"
        }
    }
}
</i18n>