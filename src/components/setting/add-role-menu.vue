<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 16, offset: 2 }"
        >
            <a-row :gutter="24">
                <a-col :span="20">
                    <a-form-item label="当前角色">
                        <a-input
                            v-decorator="[`role_name`]"
                            size="small"
                            :disabled="true"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item label="菜单" required>
                        <!-- <a-select
                            v-decorator="['menu_code', { initialValue: '' }]"
                            size="small"
                            style="width: 200px;"
                            showSearch
                            :filterOption="filterSelectOption"
                        >
                            <a-select-option value="" key="">
                                --请选择--
                            </a-select-option>
                            <a-select-option
                                :value="item.menu_code"
                                v-for="item of menuList"
                                :key="item.menu_code"
                            >
                                {{ $t(item.menu_name) }}
                            </a-select-option>
                        </a-select> -->
                        <a-tree-select
                            v-model="value"
                            style="width: 100%"
                            :tree-data="menuList"
                            tree-checkable
                            search-placeholder="Please select"
                            :dropdown-style="{
                                maxHeight: '400px',
                                overflow: 'auto'
                            }"
                            show-search
                            treeNodeFilterProp="title"
                            allow-clear
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">取消</a-button>
            <a-button type="primary" @click="onSubmit">提交</a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { SystemService } from '../../services/system.service'

@Component({
    components: {}
})
export default class AddRoleMenu extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private info

    private systemService = new SystemService()
    // 分页服务
    private pageService = new PageService()

    private loadingService = new LoadingService()

    private form: any

    private menuList: any[] = []

    private value: any = []

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public mounted() {
        this.setFormValues()
    }

    public setFormValues() {
        this.form.setFieldsValue(this.info)
    }

    private created() {
        this.getMenuList()
        this.form = this.$form.createForm(this)
    }

    private getMenuList() {
        this.systemService
            .queryRoleNeedAddMenu(
                new RequestParams({ role_code: this.info.role_code })
            )
            .subscribe(
                data => {
                    this.menuList = data.map(x => {
                        return {
                            key: x.menu_code,
                            value: x.menu_code,
                            title: x.menu_name
                        }
                    })
                },
                err => {
                    this.$message.error('获取菜单失败！')
                }
            )
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['role_code'] = this.info.role_code
                values['menu_code'] = this.value
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        this.systemService
            .addRoleMenu(
                new RequestParams(
                    {
                        role_code: this.info.role_code,
                        menu_code_list: data.menu_code
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                () => {
                    this.submit()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private filterSelectOption(input, option) {
        if (this.menuList.length) {
            return (
                option.componentOptions.children[0].text
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
            )
        }
    }
}
</script>

<i18n>
{
    "en-us": {
        "columns": {
            "code": "WareHouse Code",
            "name": "Customer Info"
        }
    },
    "zh-cn": {
        "columns": {
            "code": "仓库编码",
            "name": "仓库名称"
        }
    }
}
</i18n>
