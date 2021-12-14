<template>
    <page-container ref="pageContainer">
        <a-card>
            <div style="width:100%;display:inline;">
                <div style="margin-bottom: 10px;">
                    <span class="x-tb-header" style="float:left;">子系统:</span>
                    <span style="margin:-8px 10px 0 10px;float:left;">
                        <a-form layout="inline" :form="form">
                            <a-form-item>
                                <a-select
                                    v-decorator="[
                                        'sub_system_code',
                                        { initialValue: defaultSubSystemCode }
                                    ]"
                                    style="width: 160px"
                                    size="small"
                                    @change="e => onSubSystemChange(e)"
                                >
                                    <a-select-option
                                        :value="item.sub_system_code"
                                        v-for="item of subSystemList"
                                        :key="item.sub_system_code"
                                    >
                                        {{ item.sub_system_name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-form>
                    </span>
                    <span class="x-tb-hd-btn-box"
                        ><a-button
                            type="primary"
                            size="small"
                            @click="changeSubSystem"
                            >编辑子系统</a-button
                        ></span
                    >
                </div>
                <div style="clear:both;"></div>
                <!-- 模块列表 -->
                <div class="x-mdl-div">
                    <div class="header">
                        <span class="title">模块列表</span>
                        <span
                            class="new"
                            @click="addModule"
                            v-if="this.defaultSubSystemCode"
                            >+ 新增</span
                        >
                    </div>
                    <ul class="list">
                        <li
                            v-for="item of moduleList"
                            :key="item.model_code"
                            :class="
                                currentLi == item.model_code ? 'active' : ''
                            "
                            @click="onLiClick(item.model_code)"
                        >
                            <p class="mdl-name">
                                {{ item.model_name }} [
                                {{ item.model_name_eng }} ]<a
                                    class="delete"
                                    @click="
                                        e => {
                                            e.stopPropagation()
                                            deleteModule(item)
                                        }
                                    "
                                >
                                    <a-icon type="delete" /> </a
                                ><a
                                    class="edit"
                                    @click="
                                        e => {
                                            e.stopPropagation()
                                            editModule(item)
                                        }
                                    "
                                >
                                    <a-icon type="edit" />
                                </a>
                            </p>
                            <p class="memo">{{ item.memo }}</p>
                        </li>
                    </ul>
                </div>
                <!-- 子模块列表 -->
                <div class="x-mdl-div">
                    <div class="header">
                        <span class="title">子模块列表</span>
                        <span
                            class="new"
                            @click="addSubModule"
                            v-if="this.defaultModuleCode"
                            >+ 新增</span
                        >
                    </div>
                    <ul class="list">
                        <li
                            v-for="item of subModuleList"
                            :key="item.sub_model_code"
                        >
                            <p class="mdl-name">
                                {{ item.sub_model_name }} [
                                {{ item.sub_model_name_eng }} ]<a
                                    class="delete"
                                    @click="
                                        e => {
                                            e.stopPropagation()
                                            deleteSubModule(item)
                                        }
                                    "
                                >
                                    <a-icon type="delete" /> </a
                                ><a
                                    class="edit"
                                    @click="
                                        e => {
                                            e.stopPropagation()
                                            editSubModule(item)
                                        }
                                    "
                                >
                                    <a-icon type="edit" />
                                </a>
                            </p>
                            <p class="memo">{{ item.memo }}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </a-card>
    </page-container>
</template>

<style lang="stylus">
.x-tb-header {
    font-size: 16px;
    font-weight: 600;
}

.x-tb-hd-btn-box {
    margin-left: 20px;
}

.x-mdl-div {
    width: 40%;
    float: left;
}

.x-mdl-div .header {
    width: 100%;
    border: 1px solid #ebedf0;
    background: #f2f2f2;
    line-height: 35px;
}

.x-mdl-div .header .title {
    margin-left: 20px;
    font-weight: 600;
    color: #222;
}

.x-mdl-div .header .new {
    float: right;
    margin-right: 30px;
    color: #0099cc;
    cursor: pointer;
}

.x-mdl-div .list {
    width: 100%;
    border: 1px solid #ebedf0;
    padding: 0;
    min-height: 500px;
    display: inline-block;
}

.x-mdl-div .list li {
    list-style: none;
    line-height: 40px;
    margin: 0;
    padding: 10px 1% 0 2%;
    border-bottom: 1px solid #f5f5f5;
}

.x-mdl-div .list .mdl-name {
    margin: 0;
    line-height: 20px;
    font-weight: 600;
    color: #222;
}

.x-mdl-div .list .memo {
    font-size: 12px;
    color: #999;
    line-height: 20px;
}

.x-mdl-div .list li .edit {
    float: right;
    margin-right: 15px;
    color: #0099cc;
    font-size: 18px;
}

.x-mdl-div .list li .delete {
    float: right;
    margin-right: 20px;
    color: red;
    font-size: 18px;
}

.x-mdl-div .list .active {
    background #e6f7ff;
}
</style>
<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import SubSystemEdit from '~/components/setting/sub-system-edit.vue'
import addModule from '~/components/setting/add-module.vue'
import addSubModule from '~/components/setting/add-sub-module.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import router from '../../router'
import { SystemService } from '../../services/system.service'

@Page({
    layout: 'workspace',
    name: 'module-manage'
})
@Component({
    components: {
        SubSystemEdit,
        addModule,
        addSubModule
    }
})
export default class ModuleManage extends Vue {
    @Ref()
    readonly pageContainer!: PageContainer

    // 仓库服务
    private systemService = new SystemService()
    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    // 表格数据源
    private data: any[] = []

    private subSystemList: any[] = []

    private moduleList: any[] = []

    private subModuleList: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private form: any

    // 详情项
    private detail = null

    private defaultSubSystemCode: any = ''

    private defaultModuleCode: any = ''

    private currentLi: any = ''

    private created() {
        this.getSubSystemList()
        this.form = this.$form.createForm(this)
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
                    this.subSystemList = data
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
                    this.moduleList = data.filter(x => x.status === 20)
                },
                () => {
                    this.$message.error('模块获取失败')
                }
            )
    }

    private getSubModule() {
        this.subModuleList = []
        this.systemService
            .queryAllSubSystemModule(
                new RequestParams(
                    { model_code: this.defaultModuleCode },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.subModuleList = data.filter(x => x.status === 20)
                },
                () => {
                    this.$message.error('子模块获取失败')
                }
            )
    }

    private changeSubSystem() {
        this.$modal
            .open(
                SubSystemEdit,
                {
                    saveFlag: 0
                },
                {
                    title: '编辑子系统',
                    width: '60%'
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
                this.getSubSystemList()
            })
    }

    private deleteModule(row) {
        this.systemService
            .deleteModule(
                new RequestParams(
                    { model_code_list: [row.model_code] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                () => {
                    this.$message.success('删除成功')
                    this.getModuleList()
                },
                err => {
                    this.$message.error('模块删除失败' + err.message)
                }
            )
    }

    private editModule(row) {
        this.$modal
            .open(
                addModule,
                {
                    saveFlag: 1,
                    sub_system_code: this.defaultSubSystemCode,
                    warehouse: row
                },
                { title: '编辑模块' }
            )
            .subscribe((data: any[]) => {
                this.$message.success('更新成功')
                this.getModuleList()
            })
    }

    private onSubSystemChange(e) {
        this.defaultSubSystemCode = e
        this.getModuleList()
        this.subModuleList = []
    }

    private addModule() {
        this.$modal
            .open(
                addModule,
                {
                    saveFlag: 0,
                    sub_system_code: this.defaultSubSystemCode
                },
                { title: '新增模块' }
            )
            .subscribe((data: any[]) => {
                this.$message.success('操作成功')
                this.getModuleList()
            })
    }

    private addSubModule() {
        this.$modal
            .open(
                addSubModule,
                {
                    saveFlag: 0,
                    model_code: this.defaultModuleCode
                },
                { title: '新增子模块' }
            )
            .subscribe((data: any[]) => {
                this.$message.success('操作成功')
                this.getSubModule()
            })
    }

    private deleteSubModule(row) {
        this.systemService
            .deleteSubModule(
                new RequestParams(
                    { sub_model_code_list: [row.sub_model_code] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                () => {
                    this.$message.success('删除成功')
                    this.getSubModule()
                },
                err => {
                    this.$message.error('子模块删除失败' + err.message)
                }
            )
    }

    private editSubModule(row) {
        this.$modal
            .open(
                addSubModule,
                {
                    saveFlag: 1,
                    model_code: this.defaultModuleCode,
                    warehouse: row
                },
                { title: '编辑子模块' }
            )
            .subscribe((data: any[]) => {
                this.$message.success('更新成功')
                this.getSubModule()
            })
    }

    private onLiClick(e) {
        this.currentLi = e
        this.defaultModuleCode = e
        this.getSubModule()
    }
}
</script>