<template>
    <page-container ref="pageContainer" :showHeader="false">
        <a-card>
            <div style="width:50%;min-height:600px;float:left;">
                <div class="x-mdl-div2" style="min-height:600px;">
                    <div class="header">
                        <span class="title">部门列表</span>
                        <!-- <span class="new" @click="addPart">+ 新增</span> -->
                    </div>
                    <a-tree
                        :show-line="true"
                        :load-data="onLoadData"
                        :tree-data="treeData"
                        @select="e => onSelect(e)"
                    >
                        <template slot="custom" slot-scope="item">
                            <span>[{{ item.key }}]{{ item.title }}</span>
                            <span v-if="defaultPartCode == item.key">
                                <a
                                    type="primary"
                                    class="but_type"
                                    style="right:70px;"
                                    @click="() => addPart(item)"
                                    >新增</a
                                >
                                <a
                                    type="primary"
                                    class="but_type"
                                    style="right:38px;"
                                    @click="() => editPart(item)"
                                    >编辑</a
                                >
                                <a
                                    type="primary"
                                    class="but_type"
                                    style="right:5px;"
                                    v-if="item.key > 0"
                                    @click="e => removePart(item)"
                                    >删除</a
                                >
                            </span>
                        </template>
                    </a-tree>
                </div>
            </div>
            <div style="width:50%;min-height:600px;display:inline-block;">
                <div class="x-mdl-div2" style="min-height:600px;">
                    <div class="header">
                        <span class="title">对应用户</span>
                        <span
                            class="new"
                            @click="addRoleUser"
                            v-if="defaultPartCode"
                            >+ 新增</span
                        >
                        <span class="leader">部门领导</span>
                    </div>
                    <ul class="list" style="min-height:600px;">
                        <li v-for="item of roleUserList" :key="item[0]">
                            <p class="mdl-name">
                                {{ item[1]
                                }}<a
                                    class="delete"
                                    @click="
                                        e => {
                                            e.stopPropagation()
                                            deleteRoleUser(item)
                                        }
                                    "
                                    ><a-icon type="delete"
                                /></a>
                                <a-checkbox
                                    class="edit-leader"
                                    :checked="item[2]"
                                    @click="
                                        e => {
                                            e.stopPropagation()
                                            setRoleUser(e, item)
                                        }
                                    "
                                ></a-checkbox>
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </a-card>
    </page-container>
</template>

<style lang="stylus">
.x-tb-header {
    font-size:16px;
    font-weight:600;
}
.x-tb-hd-btn-box {
    margin-left:20px;
}
.x-mdl-div2 {
    width:100%;float:left;border:1px solid #ebedf0;
}
.x-mdl-div2 .header {
    width:100%;border-bottom:1px solid #ebedf0;background:#f2f2f2;line-height:35px;
}
.x-mdl-div2 .header .title {
    margin-left:20px;font-weight:600;color:#222;
}
.x-mdl-div2 .header .access_rule {
    margin-left:32%;font-weight:600;color:#222;
}
.x-mdl-div2 .header .leader {
    float:right;
    margin-right: 30px;
}
.x-mdl-div2 .header .new {
    float:right;
    margin-right: 30px;
    color: #0099cc;
    cursor: pointer;
}
.x-mdl-div2 .list {
    width:100%;padding: 0;margin:0;height:100%;display: inline-block;
}
.x-mdl-div2 .list li {
    list-style: none;
    line-height: 40px;
    margin: 0;
    padding: 10px 5% 0 5%;
    border-bottom: 1px solid #f5f5f5;
}
.x-mdl-div2 .list .mdl-name {
    margin:0;line-height:20px;font-weight:600;color:#222;
}
.x-mdl-div2 .list .memo {
    font-size:12px;color:#999;line-height:20px;
}
.x-mdl-div2 .list li .edit {
    float:right;
    margin-right: 15px;
    color: #0099cc;
    font-size:18px;
}
.x-mdl-div2 .list li .delete {
    float:right;
    margin-right: 20px;
    color: red;
    font-size:18px;
}
.x-mdl-div2 .list li .edit-leader {
    float:right;
    margin-right: 50px;
    color: red;
    font-size:18px;
}
.x-mdl-div2 .list .active {
    background: #e6f7ff;
}
.but_type {
  float: right;
  position: absolute;
  right: 40px;
}
</style>

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
import AddDept from '~/components/setting/add-dept.vue'
import AddDeptUser from '~/components/setting/add-dept-user.vue'
import { formConfig } from '../../config/form.config'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { namespace } from 'vuex-class'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'department-management'
})
@Component({
    components: {
        AddDept,
        AddDeptUser
    }
})
export default class DepartmentManagement extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    // 订单服务
    private systemService = new SystemService()
    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()
    // 表格数据源
    private treeData: any[] = []

    private roleUserList: any[] = []

    private userList: any = {}

    // 表格选择项
    private defaultExpandKeys: any[] = []
    private expandedKeys: any = []

    private autoExpandParent: any = false

    // 详情项
    private currentLi: any = ''

    private defaultPartCode: any = ''

    private defaultUserId: any = ''

    private editAble: any = false

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private created() {
        this.getSystemuser()
    }

    private mounted() {
        this.treeData = [
            {
                key: 0,
                title: '部门',
                dept_type: 10,
                scopedSlots: { title: 'custom' }
            }
        ]
    }

    private onLoadData(treeNode) {
        return new Promise(resolve => {
            if (treeNode.dataRef.children) {
                resolve()
                return
            }
            this.getData(treeNode.eventKey).then((data: any) => {
                let parts: any = []
                for (let i of data) {
                    parts.push({
                        title: i.dept_name,
                        key: i.id,
                        dept_type: i.dept_type,
                        scopedSlots: { title: 'custom' }
                    })
                    this.userList[i.id] = i.user_list
                }
                treeNode.dataRef.children = parts
                this.treeData = [...this.treeData]
                resolve()
            })
        })
    }

    private getData(pid) {
        return new Promise((resolve, reject) => {
            this.innerAction.setActionAPI(
                'system/query_sub_department',
                CommonService.getMenuCode()
            )
            this.publicService
                .query(
                    new RequestParams(
                        { parent_id: parseInt(pid) },
                        {
                            loading: this.loadingService,
                            innerAction: this.innerAction
                        }
                    )
                )
                .subscribe(
                    data => {
                        resolve(data)
                    },
                    err => {
                        this.$message.error(err.message)
                        reject(err)
                    }
                )
        })
    }

    private onSelect(e) {
        this.roleUserList = this.userList[e[0]] || []
        this.roleUserList = this.roleUserList.sort(this.compare())
        this.defaultPartCode = e[0]
    }

    private compare = function() {
        return function(obj1, obj2) {
            var val1 = obj1[2]
            var val2 = obj2[2]
            if (val1 > val2) {
                return -1
            } else if (val1 < val2) {
                return 1
            } else {
                return 0
            }
        }
    }

    private addRoleUser() {
        let info: any = this.findKey(this.treeData, this.defaultPartCode)
        this.$modal
            .open(
                AddDeptUser,
                {
                    info: info,
                    systemUsers: this.systemUsers
                },
                { title: '添加用户' }
            )
            .subscribe((data: any) => {
                this.$message.success('操作成功')
                this.userList[this.defaultPartCode].push([
                    data.code,
                    data.name,
                    data.is_leader
                ])
            })
    }

    private findKey(dstData, rid) {
        let ret: any = ''
        for (let i in dstData) {
            if (dstData[i].key == rid) {
                ret = dstData[i]
                return ret
            }
            if (dstData[i].children) {
                ret = this.findKey(dstData[i].children, rid)

                if (ret) {
                    return ret
                }
            }
        }

        return ret
    }

    private deleteRoleUser(row) {
        this.innerAction.setActionAPI(
            'system/delete_dept_user',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { dept_id: this.defaultPartCode, user_list: [row[0]] },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.delete_success')
                    for (let i in this.userList[this.defaultPartCode]) {
                        if (
                            this.userList[this.defaultPartCode][i][0] == row[0]
                        ) {
                            this.userList[this.defaultPartCode].splice(i, 1)
                        }
                    }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private addPart(item) {
        let info = {
            parent_id: item.key,
            parent_name: item.title,
            dept_id: 0
        }
        this.$modal
            .open(
                AddDept,
                {
                    info: info,
                    saveFlag: 0
                },
                { title: '添加部门' }
            )
            .subscribe((data: any) => {
                let node = this.findKey(this.treeData, item.key)
                if (node) {
                    node.children.push({
                        key: data.id,
                        title: data.name,
                        scopedSlots: { title: 'custom' }
                    })
                    this.treeData = [...this.treeData]
                }
            })
    }

    private editPart(item) {
        let pNode: any = this.findParentNode(this.treeData, item.key)
        if (!pNode) {
            return
        }
        let info = {
            parent_id: pNode.key,
            parent_name: pNode.title,
            dept_name: item.title,
            dept_id: item.key,
            dept_type: item.dept_type,
            sort_order: item.sort_order
        }
        this.$modal
            .open(
                AddDept,
                {
                    info: info,
                    saveFlag: 1
                },
                { title: '编辑部门' }
            )
            .subscribe((data: any) => {
                let node = this.findKey(this.treeData, item.key)
                if (node) {
                    node.title = data.name
                    node.dept_type = data.dept_type
                    node.sort_order = data.sort_order
                }
            })
    }

    private removePart(item) {
        if (item.eventKey == 0) {
            this.$message.error('无法删除跟节点')
            return
        }
        let pNode: any = this.findParentNode(this.treeData, item.eventKey)
        if (pNode) {
            this.deleteDept(item.eventKey)
                .then(() => {
                    for (let i in pNode.children) {
                        if (pNode.children[i].key == item.eventKey) {
                            pNode.children.splice(i, 1)
                        }
                    }
                    this.treeData = [...this.treeData]
                })
                .catch(err => {
                    //
                })
        }
    }

    private deleteDept(key) {
        return new Promise((resolve, reject) => {
            this.innerAction.setActionAPI(
                'system/delete_department',
                CommonService.getMenuCode()
            )
            this.publicService
                .modify(
                    new RequestParams(
                        { dept_ids: [parseInt(key)] },
                        {
                            loading: this.loadingService,
                            innerAction: this.innerAction
                        }
                    )
                )
                .subscribe(
                    data => {
                        this.$message.success('删除成功')
                        resolve(data)
                    },
                    err => {
                        reject(err)
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private findParentNode(data, key) {
        let ret: any = ''
        for (let i in data) {
            if (data[i].children != undefined && data[i].children.length > 0) {
                if (data[i].children.find(x => x.key == key)) {
                    ret = data[i]
                    break
                } else {
                    for (let j in data[i].children) {
                        ret = this.findParentNode(data[i].children, key)
                    }
                }
            }
        }
        return ret
    }

    private setRoleUser(e, item) {
        this.innerAction.setActionAPI(
            'system/add_dept_user',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        dept_id: this.defaultPartCode,
                        user_list: [item[0]],
                        is_leader: e.target.checked
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                ret => {
                    let msg: any = this.$t('tips.save_success')
                    let user: any = this.roleUserList.find(x => x[0] == item[0])
                    user[2] = e.target.checked
                    this.roleUserList = [...this.roleUserList]
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
    "desc": "this is a Order Page1"
  },
  "zh-cn": {
    "desc": "这是订单页面1"
  }
}
</i18n>
