<template>
    <section class="component customer-detail">
        <a-form class="data-form" layout="inline" :form="form">
            <a-row>
                <a-col :span="4">
                    <a-form-item
                        label="SKU"
                        style="height:35px;margin:0;"
                        :labelCol="{ span: 3 }"
                        :wrapperCol="{ span: 20 }"
                    >
                        <a-input
                            v-decorator="['default_code']"
                            size="small"
                        ></a-input>
                    </a-form-item>
                </a-col>
                <!-- <a-col :span="7">
                    <a-form-item
                        label="名称"
                        style="height:35px;margin:0;"
                        :labelCol="{ span: 8 }"
                        :wrapperCol="{ span: 16 }"
                    >
                        <a-input
                            v-decorator="['prod_name']"
                            size="small"
                        ></a-input>
                    </a-form-item>
                </a-col> -->
                <a-col :span="3">
                    <a-form-item style="height:35px;margin:0;">
                        <a-button
                            type="primary"
                            @click="getProdList()"
                            size="small"
                            >查询
                        </a-button>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <data-table
            :data="data"
            :page="pageService"
            @on-page-change="getProdList"
            rowKey="default_code"
            :scroll="{ y: 400 }"
        >
            <a-table-column
                title="SKU"
                dataIndex="default_code"
                key="default_code"
                width="20%"
            ></a-table-column>
            <a-table-column
                title="名称"
                dataIndex="name"
                key="name"
                width="70%"
            ></a-table-column>
            <a-table-column title="操作" key="action" align="center">
                <template slot-scope="row">
                    <a @click="select(row)">选择</a>
                </template>
            </a-table-column>
        </data-table>
        <div class="flex-row justify-content-end margin-y">
            <a-button class="margin-x" @click="cancel()">取消</a-button>
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
import { LoadingService } from '../../bootstrap/services/loading.service'
import { ProductService } from '../../services/product.service'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '@/config/form.config'

@Component({
    components: {}
})
export default class SearchProduct extends Vue {
    @Emit('modal.submit')
    private submit(values) {
        return values
    }

    @Emit('modal.cancel')
    private cancel() {}

    @Prop()
    changeSpinning

    private form: any

    private data: any[] = []

    private selectedRowKeys: any[] = []

    private productService = new ProductService()
    // 分页服务
    private pageService = new PageService()

    private loadingService = new LoadingService()

    public created() {
        this.form = this.$form.createForm(this)
    }

    public mounted() {}

    private get loading() {
        let loading: any = { page: this.pageService }
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { page: this.pageService, loading: this.loadingService }
        }
        return loading
    }

    private closeLoading() {
        if (this.changeSpinning) {
            this.changeSpinning(false)
        }
    }

    private getProdList() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                this.productService
                    .queryAsyncProductInfo(
                        new RequestParams(
                            CommonService.createQueryCondition(values, {
                                default_code: 'like',
                                ...formConfig.condition
                            }),
                            this.loading
                        )
                    )
                    .subscribe(
                        data => {
                            this.closeLoading()
                            this.data = data
                        },
                        err => {
                            this.closeLoading()
                            this.$message.error(err.message)
                        }
                    )
            }
        })
    }

    private select(item) {
        this.submit(item)
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
