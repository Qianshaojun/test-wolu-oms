<template>
    <section class="component">
        <div v-if="flag === '2'" v-html="origin_message"></div>
        <div v-if="flag === '1'">
            <a-card class="margin-y" style="margin:0 !important">
                <data-table
                    :data="origin_message"
                    rowKey="id"
                    :rowSelection="{
                        selectedRowKeys: selectedRowKeys,
                        onChange: keys => (selectedRowKeys = keys)
                    }"
                    @onClick="
                        record => {
                            this.selectedRowKeys = [record]
                        }
                    "
                    style="table-layout:fixed;"
                >
                    <a-table-column
                        :title="$t('attachment')"
                        key="name"
                        align="center"
                    >
                        <template slot-scope="name, row">
                            <img
                                v-if="
                                    row.type == 'png' ||
                                        row.type == 'jpg' ||
                                        row.type == 'gif' ||
                                        row.type == 'jpeg'
                                "
                                :src="imageSrc(row.id)"
                                style="max-height: 500px"
                            />

                            <span v-if="row.type == 'pdf'">
                                <a @click="openPdf(row.id)">
                                    {{ row.name }}
                                </a>
                            </span>
                            <span v-if="row.type == 'doc'">
                                <a @click="openPdf(row.id)">
                                    {{ row.name }}
                                </a>
                            </span>
                            <span v-else-if="row.type != 'exe'">
                                <a @click="openPdf(row.id)">
                                    {{ row.name }}
                                </a>
                            </span>
                        </template>
                    </a-table-column>
                </data-table>
                <br />

                <div v-if="create_type === 'customer'">
                    <span>{{ $t('select_product') }}</span>

                    <a-select
                        v-if="productDropList.length > 0"
                        placeholder="input search text"
                        style="width: 100%"
                        :value="productValue"
                        :default_value="defaultValue"
                        @change="handleChange"
                    >
                        <a-select-option
                            v-for="d in productDropList"
                            :key="d.code"
                            :value="d.code"
                        >
                            {{ d.name }}
                        </a-select-option>
                    </a-select>
                    <a-select
                        v-else
                        show-search
                        :value="productValue"
                        placeholder="input search text"
                        style="width: 100%"
                        :default-active-first-option="false"
                        :show-arrow="false"
                        :filter-option="false"
                        :not-found-content="null"
                        @search="onSkuSearch"
                        @change="handleChange"
                    >
                        <a-select-option
                            v-for="d in skuSource"
                            :key="d.id"
                            :value="d.id"
                        >
                            {{ getFullName(d.default_code, d.name) }}
                        </a-select-option>
                    </a-select>
                </div>
            </a-card>
        </div>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('cancel')
            }}</a-button>
            <a-button type="primary" v-if="flag === '1'" @click="save">{{
                $t('save')
            }}</a-button>
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { RequestParams } from '~/core/http'
import moment from 'moment'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import appConfig from '../../config/app.config'

@Component({
    components: {}
})
export default class ChatMessageAttachment extends Vue {
    private returnData: any[] = []

    @Emit('modal.submit')
    private submit() {
        return
    }

    private imageSrc(id) {
        return (
            appConfig.server + '/attachment/view_attachment?attachment_id=' + id
        )
    }

    private save() {
        if (this.create_type === 'owner') {
            this.submit()
        } else {
            if (this.selectedRowKeys.length < 1) {
                let msg: any = this.$t('no_attachment_selected')
                this.$error({
                    title: 'Error Message',
                    content: msg
                })
            } else if (this.productValue == '') {
                let msg: any = this.$t('no_product_selected')
                this.$error({
                    title: 'Error Message',
                    content: msg
                })
            } else {
                this.returnData.push({
                    product_id: this.productValue,
                    attachment_ids: this.selectedRowKeys
                })
                this.saveAttachmentCp()
            }
        }
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    private selectedRowKeys: any[] = []

    @Prop()
    productService

    @Prop()
    cpService

    @Prop()
    origin_message

    @Prop()
    title

    @Prop()
    ticket_id

    @Prop()
    create_type

    @Prop()
    changeSpinning

    @Prop()
    productList

    private flag = ''

    private defaultValue: any = ''

    private skuSource: any = []
    private productDropList: any = []
    private productValue: any = ''

    private created() {
        this.productDropList = this.productList
        if (this.productDropList.length > 0) {
            this.productValue = this.productDropList[0].code
        }

        if (this.origin_message instanceof Array) {
            if (this.origin_message.length == 1) {
                this.selectedRowKeys.push(this.origin_message[0].id)
            }
            this.flag = '1'
        } else {
            this.flag = '2'
        }
    }

    private getFullName(default_code, name) {
        return '[' + default_code + '] ' + name
    }

    private saveAttachmentCp() {
        this.cpService
            .createCpPic(
                new RequestParams({
                    ticket_id: this.ticket_id,
                    cs_memo: '',
                    product_images: this.returnData
                })
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.submit()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onSkuSearch(key) {
        let params: any = CommonService.createQueryCondition(
            { product_number: key },
            {
                product_number: 'like',
                ...formConfig.condition
            }
        )
        params['page_index'] = 1
        params['page_size'] = 10
        this.productService
            .queryProducForStockMove(new RequestParams(params))
            .subscribe(data => {
                this.skuSource = data
            })
    }

    private handleChange(e) {
        this.productValue = e
    }

    private openPdf(row_id) {
        window.open(
            appConfig.server +
                '/attachment/view_attachment?attachment_id=' +
                row_id
        )
        // this.downloadFileByBase64(
        //     'data:application/pdf;base64,' + db_datas,
        //     name
        // )
    }

    private dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], { type: mime })
    }

    private downloadFile(url, name = 'CreateByLh') {
        var a = document.createElement('a')
        a.setAttribute('href', url)
        a.setAttribute('download', name)
        a.setAttribute('target', '_blank')
        let clickEvent = document.createEvent('MouseEvents')
        clickEvent.initEvent('click', true, true)
        a.dispatchEvent(clickEvent)
    }

    private downloadFileByBase64(base64, name) {
        var myBlob = this.dataURLtoBlob(base64)
        var myUrl = URL.createObjectURL(myBlob)
        this.downloadFile(myUrl, name)
    }
}
</script>
<i18n>
{
  "en-us":{
    "save_success":"Save Success",
    "attachment":"Attachment",
    "select_product":"Select Product",
    "cancel":"Cancel",
    "save":"Save",
    "no_attachment_selected":"No Attachment Selected",
    "no_product_selected":"No Product Selected"
  },
  "zh-cn":{
    "save_success":"操作成功",
    "attachment":"附件",
    "select_product":"选择产品",
    "cancel":"取消",
    "save":"保存",
    "no_attachment_selected":"未选择附件",
    "no_product_selected":"未选择产品"
  }
}
</i18n>
