<template>
    <section class="component edit-customer">
        <div style="margin-bottom:20px;">
            <label style="float:left;">选择分类：</label>
            <a-select
                v-model="cnCategory"
                style="width: 30%;float:left;"
                placeholder="中文分类"
                size="small"
                @change="e => onMainCateChange(e)"
                showSearch
                allowClear
            >
                <a-select-option v-for="cate in cnCates" :key="cate">
                    {{ cate }}
                </a-select-option>
            </a-select>
            <a-select
                v-model="selectedList"
                style="width: 40%;"
                placeholder="中文子类"
                size="small"
                showSearch
                allowClear
            >
                <a-select-option v-for="cate in subCates" :key="cate">
                    {{ cate }}
                </a-select-option>
            </a-select>
        </div>
        <div class="editable-cell-input-wrapper">
            <div class="clearfix">
                <a-upload
                    :fileList="fileList"
                    :multiple="false"
                    name="file"
                    :remove="handleRemove"
                    :beforeUpload="beforeUpload"
                    :accept="attachemntFileExt"
                >
                    <a-button>
                        <a-icon type="upload" /> 请选择Excel文件
                    </a-button>
                    <a
                        v-show="selectedList"
                        style="margin-left: 20px;text-decoration:underline;"
                        @click="downLoadTemplate"
                        >{{ $t('action.downLoadTemplate') }}</a
                    >
                </a-upload>
                <a-button
                    type="primary"
                    @click="handleUpload"
                    :disabled="fileList.length === 0"
                    :loading="uploading"
                    style="margin-top: 16px"
                >
                    {{ uploading ? '上传中' : '导入' }}
                </a-button>
            </div>
        </div>
        <div
            style="width:100%;min-height:300px;"
            :style="{ display: showView }"
        >
            <p v-if="this.columns.length" style="margin-top: 10px;">
                <a-checkbox
                    v-decorator="['firstRowIsLabel']"
                    v-model="firstRowIsLabel"
                    @change="e => onfirstRowIsLabelChange(e)"
                ></a-checkbox>
                {{ $t('containfirstRow') }}
            </p>
            <a-table
                :columns="columns"
                :dataSource="data"
                :pagination="false"
                rowKey="id"
                :scroll="{ x: width, y: 400 }"
            >
                <span
                    v-for="(ct, i) of columns"
                    :key="ct.key"
                    :slot="'customTitle' + i"
                    ><a-checkbox
                        v-if="firstRowIsLabel"
                        :checked="ct.checked"
                        @change="e => onSelectRowChange(ct.key, e)"
                    />
                    {{ ct.key }}</span
                >
            </a-table>
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { UserService } from '~/services/user.service'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import reqwest from 'reqwest'
import appConfig from '../../config/app.config'
import { OrderService } from '../../services/order.service'
import xlsx from 'xlsx'
import store from '~/store'
import { ProductService } from '../../services/product.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { CommonService } from '@/shared/utils/common.service'
import { LoadingService } from '@/bootstrap/services/loading.service'

@Component({
    components: {}
})
export default class ImportProductAttr extends Vue {
    @Emit('modal.submit')
    private submit(values) {
        return values
    }

    @Emit('modal.cancel')
    private cancel() {}

    @Prop()
    private urlPath

    @Prop()
    private fileExt

    @Prop()
    private attachmentUrlPath

    private subCates: any = []
    private selectedList: any = ''

    private uploading: any = false

    private fileList: any[] = []

    private attachemntFileExt: string = '.xls,.xlsx,.csv'
    private existsTemplateUrlPath: boolean = false

    private excelParam: any = []

    private excelParamNoFirstRow: any = []

    private data: any = []

    private columns: any = []

    private firstRows: any = []

    private columnLabels: any = []

    private width: any = 1000

    private showView: any = 'none'

    private firstRowIsLabel: any = true

    private productService = new ProductService()
    private publicService = new PublicService()
    private innerAction = new InnerActionService()
    private loadingService = new LoadingService()

    private created() {
        this.getMainCates()
    }

    private mounted() {
        if (this.attachmentUrlPath) {
            this.existsTemplateUrlPath = true
        }

        if (this.fileExt) {
            this.attachemntFileExt = this.fileExt
        }
    }

    private handleRemove(file) {
        const index = this.fileList.indexOf(file)
        const newFileList = this.fileList.slice()
        newFileList.splice(index, 1)
        this.fileList = newFileList
        this.excelParam = []
        this.excelParamNoFirstRow = []
        this.data = []
        this.columns = []
        this.columnLabels = []
        this.firstRows = []
        this.width = 1000
    }
    private beforeUpload(file) {
        if (this.fileList.length >= 1) {
            this.$message.error('只能上传一个文件')
            return false
        }
        let ext = file.name.substring(file.name.lastIndexOf('.') + 1)

        this.fileList = [...this.fileList, file]
        if (['xls', 'xlsx', 'csv'].includes(ext) == false) {
            return true
        }
        let _this = this
        _this.excelParam = []
        _this.excelParamNoFirstRow = []
        _this.data = []
        _this.columns = []
        _this.firstRows = []
        _this.columnLabels = []
        _this.firstRowIsLabel = true
        _this.width = 1000
        // 使返回的值变成Promise对象，如果校验不通过，则reject，校验通过，则resolve
        return new Promise(function(resolve, reject) {
            // readExcel方法也使用了Promise异步转同步，此处使用then对返回值进行处理
            _this.readExcel(file).then(
                (result: any) => {
                    if (result) {
                        _this.showView = 'block'

                        if (_this.columnLabels.length > 10) {
                            _this.width = _this.columnLabels.length * 100
                        }

                        _this.columns = _this.firstRows
                        _this.data = _this.excelParamNoFirstRow
                        resolve('校验成功!')
                    } else {
                        reject(false)
                    }
                },
                error => {
                    // 此时为校验失败，为reject返回
                    _this.$message.error(error)
                    reject(false)
                }
            )
        })
    }

    private url_pre = appConfig.server

    private handleUpload() {
        const { fileList } = this
        const formData = new FormData()
        const { userModule } = store.state as any
        let num = 0
        let selectRows: any = []
        if (this.columns.length) {
            for (var i of this.columns) {
                if (this.firstRowIsLabel) {
                    if (i.checked) {
                        selectRows.push(i.key)
                    }
                } else {
                    selectRows.push(i.key)
                }
            }
        }
        fileList.forEach(file => {
            formData.append('files' + num.toString(), file)
            formData.append('selectRows', selectRows)
            num++
        })
        formData.append('cn_sub_category', this.selectedList)
        this.uploading = true

        reqwest({
            url:
                this.url_pre +
                this.urlPath +
                '?csrf_token=' +
                userModule.token +
                '&customer_key=' +
                localStorage.getItem('session_id') +
                '&cn_category=' +
                this.cnCategory +
                '&cn_sub_category=' +
                this.selectedList,
            method: 'post',
            processData: false,
            data: formData,
            success: data => {
                this.uploading = false
                try {
                    var obj = eval('(' + data + ')')

                    if (obj.code == 0) {
                        this.fileList = []
                        this.$message.success('上传成功.')
                    } else {
                        this.$message.error(JSON.stringify(obj.message))
                    }
                } catch (e) {
                    this.$message.error(data)
                }
            },
            error: err => {
                this.uploading = false
                this.$message.error('上传失败: ' + err.message)
            }
        })
    }

    private downLoadTemplate() {
        window.open(
            appConfig.server +
                '/product/generate_product_attributes_template?cn_category=' +
                this.cnCategory +
                '&cn_sub_category=' +
                this.selectedList
        )
    }

    private async readExcel(file) {
        let _this = this
        return new Promise(function(resolve, reject) {
            // 返回Promise对象
            const reader = new FileReader()
            reader.onload = (e: any) => {
                // 异步执行
                try {
                    // 以二进制流方式读取得到整份excel表格对象
                    var data = e.target.result
                    var workbook: any = xlsx.read(data, { type: 'binary' })
                } catch (e) {
                    reject(e.message)
                } // 表格的表格范围，可用于判断表头是否数量是否正确
                var fromTo = ''
                // 遍历每张表读取
                for (var sheet in workbook.Sheets) {
                    let sheetInfos = workbook.Sheets[sheet]
                    let locations: any = [] // A1,B1,C1...
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        fromTo = sheetInfos['!ref'] // A1:B5
                        locations = _this.getLocationsKeys(fromTo)
                    }
                    for (let i = 0; i < locations.length; i++) {
                        let row: any = {}
                        let row2: any = {}
                        for (let j = 0; j < locations[i].length; j++) {
                            // let value: any = {}
                            let rowName = _this.columnLabels[j].key
                            row[rowName] = ''
                            if (sheetInfos[locations[i][j]]) {
                                row[rowName] = sheetInfos[locations[i][j]].v
                            }
                            if (i == 0) {
                                _this.firstRows.push({
                                    dataIndex: row[rowName]
                                        ? row[rowName]
                                        : 'Column' + j,
                                    key: row[rowName]
                                        ? row[rowName]
                                        : 'Column' + j,
                                    slots: { title: 'customTitle' + j },
                                    checked: true
                                })
                            } else {
                                let rowName2 = _this.firstRows[j].key
                                row2[rowName2] = ''
                                if (sheetInfos[locations[i][j]]) {
                                    row2[rowName2] =
                                        sheetInfos[locations[i][j]].v
                                }
                            }
                        }
                        if (JSON.stringify(row) !== '{}') {
                            _this.excelParam.push(row)
                        }
                        if (JSON.stringify(row2) !== '{}') {
                            _this.excelParamNoFirstRow.push(row2)
                        }
                    }

                    // 校验成功resolve
                    resolve(_this.excelParam)
                }
            }
            reader.readAsBinaryString(file)
        })
    }

    private getLocationsKeys(range) {
        let rangeArr = range.split(':')

        // let startString = rangeArr[0]

        let endString = rangeArr[1]

        var reg = /[A-Z]{1,}/g

        let end = endString.match(reg)[0]

        let endMath = endString.split(endString.match(reg)[0])[1]

        let total = 0 // 共有多少个

        for (let index = 0; index < end.length; index++) {
            total +=
                Math.pow(26, end.length - index - 1) *
                (end.charCodeAt(index) - 64)
        }

        let result: any = []

        for (let j = 1; j <= endMath; j++) {
            let excelKey: any = []

            for (let i = 0; i < total; i++) {
                let clum = this.getCharByNum(i)
                if (j === 1) {
                    this.columnLabels.push({
                        title: clum,
                        dataIndex: clum,
                        key: clum
                    })
                }

                excelKey.push(clum + j)
            }

            if (excelKey.length) {
                result[j - 1] = excelKey
            }
        }

        return result
    }

    private getCharByNum(index) {
        let a: any = index / 26
        let aInt: any = parseInt(a)

        let b: any = index % 26

        let returnChar = String.fromCharCode(b + 65)

        while (aInt > 0) {
            b = aInt % 26

            a = aInt / 26

            // 从后生成字符，向前推进

            returnChar = String.fromCharCode(b + 65 - 1) + returnChar
        }
        return returnChar
    }

    private getCookies() {
        var ca = document.cookie.split(';')

        var name = 'session_id='
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i]
            while (c.charAt(0) == ' ') c = c.substring(1)
            if (c.indexOf(name) != -1) {
                let r = c.split('=')[1]
                return r
            }
        }
        return false
    }

    private onfirstRowIsLabelChange(e) {
        this.firstRowIsLabel = e.target.checked
        if (this.firstRowIsLabel) {
            this.columns = this.firstRows
            this.data = this.excelParamNoFirstRow
        } else {
            this.columns = this.columnLabels
            this.data = this.excelParam
        }
    }

    private onSelectRowChange(rowName, e) {
        let item = this.columns.find(x => x.key == rowName)
        if (item) {
            item.checked = e.target.checked
        }
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
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(data => {
                this.cnCates = data.cn_category
            })
    }

    private cnCategory: any = ''
    private cnCates: any = []

    private onMainCateChange(e) {
        this.cnCategory = e
        this.getSubCates(e)
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
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(data => {
                this.subCates = data.cn_sub_category
            })
    }
}
</script>

<i18n>
{
  "en-us":{
      "columns":{
            "code":"WareHouse Code",
            "name":"Customer Info"
      },
      "containfirstRow":"The first row contains the label of the column"
  },
  "zh-cn":{
       "columns":{    
           "code":"仓库编码",
           "name":"仓库名称"
      },
      "containfirstRow":"第一行包含该列的标签"
  }
}
</i18n>
