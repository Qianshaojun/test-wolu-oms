<template>
    <section class="component edit-customer">
        <div>
            <a-transfer
                :data-source="mockData"
                :titles="['待选择', '已有项']"
                :target-keys="targetKeys"
                :selected-keys="selectedKeys"
                :render="item => item.title + ' [' + item.description + ' ]'"
                show-search
                :locale="{
                    itemUnit: '项',
                    itemsUnit: '项',
                    notFoundContent: '列表为空',
                    searchPlaceholder: '请输入搜索内容'
                }"
                :list-style="{
                    width: '250px',
                    height: '400px'
                }"
                @change="handleChange"
                @selectChange="handleSelectChange"
                @scroll="handleScroll"
            />
        </div>

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

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public mounted() {
        for (let i = 0; i < 20; i++) {
            this.mockData.push({
                key: i.toString(),
                title: `content${i + 1}`,
                description: `description of content${i + 1}`,
                disabled: i % 3 < 1
            })
        }

        const oriTargetKeys = this.mockData
            .filter(item => +item.key % 3 > 1)
            .map(item => item.key)

        this.targetKeys = oriTargetKeys
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
                    this.menuList = data
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
                        menu_code_list: [data.menu_code]
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

    private mockData: any[] = []
    private targetKeys: any[] = []

    private selectedKeys: any[] = []

    private handleChange(nextTargetKeys, direction, moveKeys) {
        this.targetKeys = nextTargetKeys

        console.log('targetKeys: ', nextTargetKeys)
        console.log('direction: ', direction)
        console.log('moveKeys: ', moveKeys)
    }
    private handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
        this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]

        console.log('sourceSelectedKeys: ', sourceSelectedKeys)
        console.log('targetSelectedKeys: ', targetSelectedKeys)
    }
    private handleScroll(direction, e) {
        console.log('direction:', direction)
        console.log('target:', e.target)
    }
}
</script>

<i18n>
{
  "en-us":{
      "columns":{
            "code":"WareHouse Code",
            "name":"Customer Info"
      }
  },
  "zh-cn":{
       "columns":{    
           "code":"仓库编码",
           "name":"仓库名称"
      }
  }
}
</i18n>
