<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <LogisticsProvidersEdit :info="[]" />
    </page-container>
</template>

<style>
.order-edit-page .ant-form-item {
    margin-bottom: 0 !important;
}

.order-edit-page .ant-form-item .ant-form-item-control,
.order-edit-page .ant-form-item .ant-form-item-label {
    line-height: 2em !important;
}

.progress-bar li {
    padding: 0px 10px;
    line-height: 25px;
    background: #ababab;
    display: inline-block;
    color: #fff;
    position: relative;
    width: initial;
    text-align: center;
}

.progress-bar li:after {
    content: '';
    display: block;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 12px solid #ababab;
    position: absolute;
    right: -12px;
    top: 0;
    z-index: 10;
}

.progress-bar li:before {
    content: '';
    display: block;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 12px solid #fff;
    position: absolute;
    left: 0px;
    top: 0;
}

.progress-bar li {
    padding-left: 25px;
}

.progress-bar li:first-child {
    border-radius: 4px 0 0 4px;
}

.progress-bar li:first-child:before {
    display: none;
}

.progress-bar li.active {
    background-color: #50abe4;
}

.progress-bar li.active:after {
    border-left-color: #50abe4;
}

.bar-date {
    position: absolute;
    color: #000;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
}

.bar-date span {
    font-size: 12px;
    color: #999;
}
</style>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Form } from 'ant-design-vue'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import LogisticsProvidersEdit from '~/components/purchase/logistics-providers-edit.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'

@Page({
    layout: 'workspace',
    name: 'logistics-providers-detail'
})
@Component({
    components: {
        LogisticsProvidersEdit
    }
})
export default class LogisticsProvidersDetail extends Vue {
    @Ref()
    readonly pageContainer!: PageContainer
}
</script>

<i18n>
{
    "en-us": {
    },
    "zh-cn": {
    }
}
</i18n>
