<template>
    <a-table
        :columns="columns"
        :data-source="groupData"
        class="components-table-demo-nested"
    >
        <GroupTable
            slot="expandedRowRender"
            slot-scope="text"
            v-if="depth > 1"
            :data="text.subData"
            :columns="columns"
            :innerColumns="innerColumns"
            :depth="depth - 1"
        ></GroupTable>
        <a-table
            v-else
            slot="expandedRowRender"
            slot-scope="text"
            :columns="innerColumns"
            :data-source="text.subData"
            :pagination="false"
            rowKey="id"
            :rowSelection="{
                selectedRowKeys: selectedRowKeys,
                onChange: keys => (selectedRowKeys = keys)
            }"
        >
            <span slot="status"> <a-badge status="success" />Finished </span>
            <span
                slot="operation"
                slot-scope="operation"
                class="table-operation"
            >
                <a-dropdown>
                    <a-menu slot="overlay">
                        <a-menu-item
                            v-for="action of actions"
                            :key="action.action"
                            @click="actione(action.action, operation)"
                        >
                            {{ action.name }}
                        </a-menu-item>
                        <!-- <a-menu-item>
                            edit2
                        </a-menu-item> -->
                    </a-menu>
                    <a> {{ $t('more') }} <a-icon type="down" /> </a>
                </a-dropdown>
            </span>
        </a-table>
    </a-table>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import appConfig from '@/config/app.config'
@Component({
    components: {}
})
export default class GroupTable extends Vue {
    @Prop()
    private data: any

    @Prop()
    private columns: any

    @Prop()
    private innerColumns: any

    @Prop()
    private depth: any

    @Prop()
    private actions: any

    private groupData: any = []

    private selectedRowKeys: any = []

    @Watch('selectedRowKeys')
    private onSelectedRowKeysChange() {
        this.$emit('selectChange', this.selectedRowKeys)
    }

    private mounted() {
        this.groupData = this.data.map(x => x)
    }

    @Watch('data')
    private onDataChange() {
        this.groupData = this.data.map(x => x)
    }

    private actione(action, id) {
        this.$emit('action', { id: id, action: action })
    }
}
</script>
<i18n>
{
  "en-us": {
    "more": "More"
  },
  "zh-cn": {
    "more": "更多"
  }
}
</i18n>
