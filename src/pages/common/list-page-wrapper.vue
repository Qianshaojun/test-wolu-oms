<template>
    <page-container ref="pageContainer" :showHeader="false">
        <section class="component order-base-detail">
            <a-card>
                <ListPageContent
                    v-for="_id in idList"
                    v-show="_id == id"
                    :key="_id"
                    :pageName="pageName"
                />
            </a-card>
        </section>
    </page-container>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Page } from '@/core/decorators'
import { PageService } from '~/bootstrap/services/page.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { RequestParams } from '~/core/http'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { namespace } from 'vuex-class'
import router from '../../router'
import ListPageContent from '~/components/common/list-page-content.vue'

@Page({
    layout: 'workspace',
    name: 'page-wrapper'
})
@Component({
    components: {
        ListPageContent
    }
})
export default class ListPageWrapper extends Vue {
    @Prop()
    public id

    public idList: any[] = []

    private data: any[] = []

    private pageName: any = ''

    // 分页服务
    private pageService = new PageService()

    private loadingService = new LoadingService()

    @Watch('id')
    private onPropChange(id: string) {
        this.pageName = 'list-page' + '/' + id
        if (!this.idList.find(x => x === id)) {
            this.idList.push(id)
        }
    }

    private created() {
        this.onPropChange(this.id)
    }

    private mounted() {}
}
</script>

<i18n>
{
  "en-us":{
    "sku":"SKU"
  },
  "zh-cn":{
    "sku":"SKU"
  }
}
</i18n>
