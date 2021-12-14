<template>
    <section class="component edit-customer">
        <div class="editable-cell-input-wrapper">
            <div class="clearfix">
                <a-upload-dragger
                    name="file"
                    :multiple="false"
                    :file-list="fileList"
                    :remove="handleRemove"
                    :before-upload="beforeUpload"
                    style="width:100%;height:80px;display:inline-block;"
                >
                    <p style="line-height:0;">
                        {{ $t('attach_or_drag_file') }}
                    </p>
                </a-upload-dragger>
                <a-button
                    type="primary"
                    @click="handleUpload"
                    :disabled="fileList.length === 0"
                    :loading="uploading"
                    style="margin-top: 40px"
                >
                    {{ uploading ? '上传中' : '上传' }}
                </a-button>
            </div>
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

@Component({
    components: {}
})
export default class UploadFile extends Vue {
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
    private info

    @Prop()
    private uploadParams

    private uploading: any = false

    private fileList: any[] = []

    private attachemntFileExt: string = '.*'
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

    private mounted() {
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
        this.fileList = [...this.fileList, file]
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
            formData.append('info', this.info)
            num++
        })
        this.uploading = true
        let symbol: any = this.urlPath.indexOf('?') == -1 ? '?' : '&'

        reqwest({
            url:
                this.url_pre +
                this.urlPath +
                symbol +
                'csrf_token=' +
                userModule.token +
                '&customer_key=' +
                localStorage.getItem('session_id'),
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
                        this.submit(obj)
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
}
</script>

<i18n>
{
  "en-us":{
      "columns":{
            "code":"WareHouse Code",
            "name":"Customer Info"
      },
      "containfirstRow":"The first row contains the label of the column",
      "attach_or_drag_file":"Click or drag file to this area to upload"
  },
  "zh-cn":{
       "columns":{    
           "code":"仓库编码",
           "name":"仓库名称"
      },
      "containfirstRow":"第一行包含该列的标签",
      "attach_or_drag_file":"点击选择或拖动文件到此区域"
  }
}
</i18n>
