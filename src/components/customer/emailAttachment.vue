<template>
    <a-table :data-source="list" row-key="id">
        <a-table-column
            title="Attachment Name"
            key="name"
            data-index="name"
            align="center"
        >
        </a-table-column>
        <a-table-column
            title="File Name"
            key="fName"
            data-index="datas_fname"
            align="center"
        >
        </a-table-column>
        <a-table-column
            title="Resource Model"
            key="rModel"
            data-index="res_model"
            align="center"
        >
        </a-table-column>
        <a-table-column
            title="Resource Field"
            key="rField"
            data-index="res_field"
            align="center"
        >
        </a-table-column>
        <a-table-column
            title="Resource Id"
            key="rId"
            data-index="res_id"
            align="center"
        >
        </a-table-column>
        <a-table-column
            title="Type"
            key="type"
            data-index="type"
            align="center"
        >
        </a-table-column>
        <a-table-column
            title="Owner"
            key="owner"
            data-index="create_uid"
            align="center"
        >
        </a-table-column>
        <a-table-column
            title="Date Created"
            key="date"
            data-index="create_date"
            align="center"
        >
        </a-table-column>
    </a-table>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Page } from '@/core/decorators'

@Page({
    layout: 'workspace',
    name: 'emailAttachment'
})
@Component({
    components: {}
})
export default class emailAttachment extends Vue {
    @Prop()
    list: any
    @Prop()
    isEdit: any
    private data: [] = []
}
</script>