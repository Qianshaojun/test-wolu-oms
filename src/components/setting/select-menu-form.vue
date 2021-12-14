<template>
    <section class="component edit-customer">
        <div style="max-height:500px;overflow-y:scroll;">
            <a-checkbox-group
                @change="onChange"
                v-model="checkList"
                style="width:100%"
            >
                <a-row
                    v-for="item of allMenus"
                    :key="item.id"
                    :style="{ 'margin-top': '15px' }"
                >
                    <a-col
                        :span="24"
                        :style="{
                            background: '#d7f2fb',
                            'margin-bottom': '5px',
                            'text-indent': '5px'
                        }"
                    >
                        <a-checkbox
                            :value="item.id"
                            @change="e => onParentChange(e)"
                        >
                            {{ $t('menu.' + item.name) }}
                        </a-checkbox>
                    </a-col>
                    <div v-if="item.children && item.children.length">
                        <a-col
                            :span="8"
                            v-for="sub of item.children"
                            :key="sub.id"
                            :style="{ 'text-indent': '10px' }"
                            @change="e => onLeafChange(e)"
                        >
                            <a-checkbox :value="sub.id">
                                {{ sub.name_chn }}
                            </a-checkbox>
                        </a-col>
                    </div>
                </a-row>
            </a-checkbox-group>
        </div>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">取消</a-button>
            <a-button type="primary" @click="onSubmit">提交</a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Ref } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { SystemService } from '../../services/system.service'

@Component({
    components: {}
})
export default class AddModule extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private allMenus

    @Prop()
    private ckList

    @Prop()
    private user_id

    private systemService = new SystemService()
    // 分页服务
    private pageService = new PageService()

    private loadingService = new LoadingService()

    private form: any

    private checkList: any[] = []

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public mounted() {
        this.checkList = this.ckList
    }

    private created() {}

    private onSubmit() {
        if (this.checkList) {
            for (let i of this.allMenus) {
                if (this.checkList.includes(i.id)) {
                    let index = this.checkList.indexOf(i.id)
                    this.checkList.splice(index, 1)
                }
            }
        }
        if (this.checkList) {
            this.saveCustomer(this.checkList)
        }
    }

    private saveCustomer(data) {
        this.systemService
            .addSubAccountMenu(
                new RequestParams(
                    {
                        user_id: this.user_id,
                        menu_code_list: data
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

    private onChange(checkedList) {
        this.checkList = checkedList
    }
    private onParentChange(e) {
        let child = this.allMenus.find(x => x.id === e.target.value)
        if (!child) {
            return
        }
        if (e.target.checked) {
            for (let i of child.children) {
                if (!this.checkList.includes(i.id)) {
                    this.checkList.push(i.id)
                }
            }
        } else {
            for (let i of child.children) {
                if (this.checkList.includes(i.id)) {
                    let index = this.checkList.indexOf(i.id)
                    this.checkList.splice(index, 1)
                }
            }
        }
    }
    private onLeafChange(e) {
        if (!e.target.checked) {
            //寻找父亲节点
            let parant: any
            for (let item of this.allMenus) {
                if (
                    item.children &&
                    item.children.length &&
                    item.children.find(x => x.id === e.target.value)
                ) {
                    parant = item
                }
            }
            if (parent && this.checkList.includes(parant.id)) {
                let index = this.checkList.indexOf(parant.id)
                if (index) {
                    this.checkList.splice(index, 1)
                }
            }
        }
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
