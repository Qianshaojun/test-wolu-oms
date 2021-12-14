<template>
    <section class="component customer-detail">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 16, offset: 1 }"
        >
            <a-row :gutter="24">
                <a-col :span="30">
                    <a-form-item :label="$t('columns.sub_category')" required>
                        <a-select
                            v-model="cnCategory"
                            style="width: 40%;float:left;margin-top:8px;"
                            placeholder=""
                            size="small"
                            allowClear
                            @change="e => onMainCateChange(e)"
                        >
                            <a-select-option
                                v-for="cate in cnCates"
                                :key="cate"
                            >
                                {{ cate }}
                            </a-select-option>
                        </a-select>
                        <a-select
                            v-model="selectedList"
                            style="width: 50%;margin-left:5px;"
                            placeholder=""
                            size="small"
                            allowClear
                            @change="e => onRowChange(row, 'sub_category', e)"
                        >
                            <a-select-option
                                v-for="cate in subCates"
                                :key="cate"
                            >
                                {{ cate }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-transfer
                class="tree-transfer"
                :data-source="tags"
                :target-keys="targetKeys"
                :show-select-all="false"
                :render="item => item.name"
                @change="onChange"
                :list-style="{
                    width: '250px',
                    height: '300px'
                }"
            >
                <template
                    slot="children"
                    slot-scope="{
                        props: { direction, selectedKeys },
                        on: { itemSelect }
                    }"
                >
                    <template v-if="direction === 'left'">
                        <a-tag
                            v-for="tag in tags"
                            :key="tag.name"
                            :closable="tag.name !== '产品配置明细'"
                            :color="getColor(tag.checked)"
                            @close="() => leftHandleClose(tag.name)"
                            @click="
                                onChecked(
                                    tag,
                                    [...selectedKeys, ...targetKeys],
                                    itemSelect
                                )
                            "
                        >
                            {{ tag.name }}
                        </a-tag>
                    </template>

                    <template v-if="direction === 'right'">
                        <a-tag
                            v-for="tag in targetKeys"
                            :key="tag.name"
                            :closable="tag.name !== '产品配置明细'"
                            @close="() => rightHandleClose(tag)"
                        >
                            {{ tag.name }}
                        </a-tag>
                        <a-input
                            v-if="inputVisible"
                            ref="input"
                            type="text"
                            size="small"
                            :style="{ width: '78px' }"
                            :value="inputValue"
                            @change="handleInputChange"
                            @blur="handleInputConfirm"
                            @keyup.enter="handleInputConfirm"
                        />
                        <a-tag
                            v-else
                            style="background: #fff; borderStyle: dashed;"
                            @click="showInput"
                        >
                            <a-icon type="plus" /> New Tag
                        </a-tag>
                    </template>
                </template>
            </a-transfer>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('action.cancel')
            }}</a-button>
            <a-button type="primary" @click="onSubmit">{{
                $t('action.commit')
            }}</a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { Page } from '~/core/decorators'
import { PageService } from '~/bootstrap/services/page.service'
import PageContainer from '../../shared/components/page-container.vue'
import { SystemService } from '~/services/system.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import UUID from 'uuidjs'
import { ProductService } from '../../services/product.service'
import { CommonService } from '@/shared/utils/common.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

@Component({
    components: {}
})
export default class ProductExtraAttrCopy extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {}

    @Prop()
    row: any

    @Prop()
    saveFlag: any

    private cnCates: any = []
    private subCates: any = []
    private cnCategory: any = ''
    private cnSubCategory: any = ''
    private selectedList: any = ''

    private form: any
    private originRow: any = ''

    private tags: any = []
    private inputVisible: any = false
    private inputValue: any = ''

    private sonCates: any = []

    private productService = new ProductService()
    private publicService = new PublicService()
    private innerAction = new InnerActionService()
    private loadService = new LoadingService()

    public setFormValues() {
        this.form.setFieldsValue(this.originRow)
    }

    private index: any = 0
    // 表格数据源
    private ruleData: any[] = []

    public created() {
        this.getMainCates()
        this.form = this.$form.createForm(this)
    }

    private isChecked(selectedKeys, eventKey) {
        var flag = false
        for (var item of selectedKeys) {
            if (item.name == eventKey) {
                flag = true
                break
            }
        }

        return flag
    }

    private getColor(checked) {
        if (checked) {
            return '#108ee9'
        } else {
            return ''
        }
    }

    private targetKeys: any = []
    private dataSource: any = []

    private onChange(targetKeys) {
        this.targetKeys = targetKeys
        for (var item_2 of this.targetKeys) {
            for (var i = 0; i < this.tags.length; i++) {
                if (item_2.key == this.tags[i].key) {
                    this.tags.splice(i, 1)
                    i = i - 1
                }
            }
        }
    }

    private onChecked(tag, selectedKeys, itemSelect) {
        tag.checked = !this.isChecked(selectedKeys, tag.key)
        itemSelect(tag, !this.isChecked(selectedKeys, tag.key))
    }

    private onRightChecked(e, tag, selectedKeys, itemSelect) {
        tag.checked = !tag.checked
    }

    private onRowChange(row, column, value) {
        var that = this
        if (that.cnSubCategory !== '') {
            this.$confirm({
                title: '更换子类提示',
                content: '若切换子类则会丢失已有的改动，确认切换？',
                onOk() {
                    if (
                        Object.prototype.toString.call(value) ===
                            '[object InputEvent]' ||
                        Object.prototype.toString.call(value) ===
                            '[object Event]' ||
                        Object.prototype.toString.call(value) ===
                            '[object Object]'
                    ) {
                        row[column] = value.target.value
                    } else {
                        row[column] = value
                    }
                    if (column === 'sub_category') {
                        that.cnSubCategory = row[column]
                        if (that.originRow.extra_attributes) {
                            const tag_names = JSON.parse(
                                that.originRow.extra_attributes.replace(
                                    /'/g,
                                    '"'
                                )
                            )
                            that.tags = []
                            for (var item of tag_names) {
                                that.tags.push({
                                    checked: false,
                                    name: item,
                                    key: item,
                                    title: item
                                })
                            }
                            that.tags.splice(0, 0)
                        }

                        that.targetKeys = []
                    }
                },
                onCancel() {
                    that.selectedList = that.cnSubCategory
                }
            })
        } else {
            if (
                Object.prototype.toString.call(value) ===
                    '[object InputEvent]' ||
                Object.prototype.toString.call(value) === '[object Event]' ||
                Object.prototype.toString.call(value) === '[object Object]'
            ) {
                row[column] = value.target.value
            } else {
                row[column] = value
            }
            if (column === 'sub_category') {
                that.cnSubCategory = row[column]
                that.targetKeys = []
            }
        }
    }

    private mounted() {
        // for (var i = 0; i < this.subCates.length; i++) {
        //     if (this.tags[i].cn_sub_category == this.row.cn_sub_category) {
        //         this.subCates.splice(i, 1)
        //         break
        //     }
        // }
        var objString = JSON.stringify(this.row)
        this.originRow = JSON.parse(objString)
        // this.selectedList = this.originRow.cn_sub_category
        // this.originRow.cn_sub_category = ''
        // if (this.saveFlag == 0) {
        //     delete this.originRow.id
        //     if (this.originRow.extra_attributes) {
        //         this.selectedList = ''
        //     }
        // }
        if (this.originRow.extra_attributes) {
            const tag_names = JSON.parse(
                this.originRow.extra_attributes.replace(/'/g, '"')
            )
            for (var item of tag_names) {
                this.tags.push({
                    checked: false,
                    name: item,
                    key: item,
                    title: item
                })
            }
            this.tags.splice(0, 0)
        }
        this.setFormValues()
    }

    private addRule() {
        let ruleParam = {
            query_name: '',
            operate: '=',
            value: '',
            index: UUID.generate()
        }
        this.ruleData.push(ruleParam)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['extra_attributes'] = []
                for (var item of this.targetKeys) {
                    values['extra_attributes'].push(item.name)
                }
                values['cn_category'] = this.cnCategory
                values['cn_sub_category'] = this.selectedList
                this.saveInfo(values)
            }
        })
    }

    private saveInfo(params) {
        params.extra_attributes = JSON.stringify(
            params.extra_attributes
        ).replace(/"/g, "'")
        this.innerAction.setActionAPI(
            'category/save_category_extra_attributes',
            CommonService.getMenuCode('product-category-manage')
        )
        this.publicService
            .modify(
                new RequestParams(params, {
                    loading: this.loadService,
                    innerAction: this.innerAction
                })
            )
            .subscribe(data2 => {
                this.submit()
            })
    }

    private handleClose(removedTag) {
        const tags = this.tags.filter(tag => tag !== removedTag)
        this.tags = tags
    }

    private rightHandleClose(removedTag) {
        const tags = this.targetKeys.filter(tag => tag.key !== removedTag.key)
        this.targetKeys = tags
        removedTag.checked = false
        var flag = true
        for (var item of this.tags) {
            if (item.key == removedTag.key) {
                flag = false
                break
            }
        }
        if (flag) {
            this.tags.push(removedTag)
        }
    }

    private leftHandleClose(removedTag) {
        const tags = this.tags.filter(tag => tag.key !== removedTag)
        this.tags = tags
    }

    private showInput() {
        this.inputVisible = true
        this.$nextTick(function() {
            let ipt: any = this.$refs.input
            ipt.focus()
        })
    }

    private handleInputChange(e) {
        this.inputValue = e.target.value
    }

    private handleInputConfirm() {
        const inputValue = this.inputValue
        let targetKeys = this.targetKeys
        let tags_list: any = []
        for (var item of targetKeys) {
            tags_list.push(item.key)
        }
        if (inputValue && tags_list.indexOf(inputValue) === -1) {
            targetKeys = [
                ...targetKeys,
                {
                    title: inputValue,
                    key: inputValue,
                    checked: false,
                    name: inputValue
                }
            ]
        } else {
            this.$message.warning('添加的属性已存在！')
        }
        Object.assign(this, {
            targetKeys,
            inputVisible: false,
            inputValue: ''
        })
    }

    private getMainCates() {
        this.innerAction.setActionAPI(
            'product_management/query_category_for_dropdownlist',
            CommonService.getMenuCode('product-category-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    {
                        cn_main_category: 'all',
                        cn_category: ''
                    },
                    {
                        loading: this.loadService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(data => {
                this.cnCates = data.cn_category
            })
    }

    private getSubCates(main) {
        this.innerAction.setActionAPI(
            'product_management/query_category_for_dropdownlist',
            CommonService.getMenuCode('product-category-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    {
                        cn_main_category: '',
                        cn_category: main
                    },
                    {
                        loading: this.loadService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(data => {
                this.subCates = data.cn_sub_category
            })
    }

    private onMainCateChange(e) {
        this.cnCategory = e
        this.getSubCates(e)
    }
}
</script>

<i18n>
{
  "en-us": {
    "desc": "",
    "columns":{
        "sub_category":"Sub Category",
        "sub_category_attr":"Attributes",
        "value":"Value"
    },
      "action":{
        "create":"Create",
        "edit":"Edit",
        "delete":"Delete",
        "ok":"Ok",
        "cancel":"Cancel",
        "commit":"Commit"
    }
  },
  "zh-cn": {
    "desc": "",
    "columns":{
        "sub_category":"子类",
        "sub_category_attr":"属性",
        "value":"值"
    },
    "action":{
      "create":"新建",
      "edit":"编辑查询条件",
      "delete":"删除",
      "ok":"确定",
      "cancel":"取消",
      "commit":"提交"
    }
  }
}
</i18n>
