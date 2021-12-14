<template>
    <section class="component">
        <div style="margin:10px 0">
            <a-button @click="saveData" type="primary" size="small">
                <a-icon type="save" />
                {{ $t('actions.save') }}
            </a-button>
        </div>
        <div>
            <a-table
                :dataSource="data"
                :pagination="false"
                :rowKey="
                    (record, index) => {
                        return index
                    }
                "
                :scroll="{ y: 400 }"
                bordered
                class="baseTable"
            >
                <a-table-column
                    :title="$t('base_authority_column')"
                    key="base_authority_column"
                    align="center"
                    :width="100"
                >
                    <template slot-scope="scope">
                        <a-checkbox
                            disabled
                            :checked="scope.base_authority_button"
                        />
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('authority_column')"
                    key="authority_column"
                    align="center"
                    :width="60"
                >
                    <template slot-scope="scope">
                        <a-checkbox
                            :checked="scope.authority_column"
                            @change="
                                e =>
                                    onCheckChange(
                                        scope,
                                        'authority_column',
                                        e.target.checked
                                    )
                            "
                        />
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('display_name_chn')"
                    data-index="button_name_chn"
                    align="left"
                    :width="100"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('display_name_eng')"
                    data-index="button_name_eng"
                    align="left"
                    :width="100"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('column_name')"
                    data-index="button_name"
                    align="center"
                    :width="100"
                >
                </a-table-column>
            </a-table>
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { RequestParams } from '@/core/http'
import { CommonService } from '@/shared/utils/common.service'
import { LoadingService } from '@/bootstrap/services/loading.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

@Component({
    components: {}
})
export default class MenuButtonAuthority extends Vue {
    @Prop()
    menuID: any

    @Prop()
    curKey: any
    @Prop()
    settingType: any

    @Prop({ default: 0 })
    openCount: any

    private data: any[] = []

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    @Watch('openCount')
    private onCntChange() {
        this.getSetButtonData()
    }

    private created() {
        this.getSetButtonData()
    }

    private onCheckChange(row: any, value: string, isCheck: boolean) {
        row[value] = isCheck
    }

    private getSetButtonData() {
        this.innerAction.setActionAPI(
            'common/query_menu_button_authority',
            CommonService.getMenuCode('role-manage')
        )

        let post_data = {
            menu_id: this.menuID,
            key_id: this.curKey,
            settings_type: this.settingType
        }

        this.publicService
            .query(
                new RequestParams(post_data, {
                    loading: this.loadingService,
                    innerAction: this.innerAction
                })
            )
            .subscribe(
                data => {
                    this.data = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private saveData() {
        let list: any = []
        this.data.forEach(v => {
            if (v.authority_column) {
                list.push(v.button_name)
            }
        })
        this.innerAction.setActionAPI(
            'common/save_menu_button_authority',
            CommonService.getMenuCode('role-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        menu_id: this.menuID,
                        key_id: this.curKey,
                        settings_type: this.settingType,
                        authority_column_list: list
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.getSetButtonData()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }
}
</script>

<i18n>
{
    "en-us": {
        "column_name": "Authority Name",
        "base_authority_column": "Base authority",
        "display_name_chn": "Display Name Chn",
        "display_name_eng": "Display Name Eng",
        "authority_column": "Authority",
        "actions": {
            "save": "Save"
        }
    },
    "zh-cn": {
        "column_name": "权限名",
        "base_authority_column": "基本授权",
        "display_name_chn": "中文名",
        "display_name_eng": "英文名",
        "authority_column": "授权",
        "actions": {
            "save": "保存"
        }
    }
}
</i18n>
