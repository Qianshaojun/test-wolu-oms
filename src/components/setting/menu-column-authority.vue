<template>
    <section class="component order-base-detail;height:">
        <div style="padding:0 20px 0 20px;height:30px;">
            <a-button
                @click="saveData"
                type="primary"
                size="small"
                style="margin-left:10px;"
                ><a-icon type="save" />{{ $t('actions.save') }}</a-button
            >
        </div>
        <div>
            <a-table
                :dataSource="data"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="index"
                :customRow="
                    rowKey => ({
                        on: {
                            // 单击每行
                            click: () => {
                                currentRow = rowKey.index
                            }
                        }
                    })
                "
                :scroll="{ x: 300, y: 400 }"
                bordered
            >
                <a-table-column
                    :title="$t('base_authority_column')"
                    key="base_authority_column"
                    align="center"
                    :width="100"
                >
                    <span slot-scope="row"
                        ><a-checkbox
                            disabled
                            :checked="row.base_authority_column"
                    /></span>
                </a-table-column>
                <a-table-column
                    :title="$t('authority_column')"
                    key="authority_column"
                    align="center"
                    :width="60"
                >
                    <template slot-scope="row">
                        <a-checkbox
                            v-if="currentRow == row.index"
                            v-decorator="['authority_column']"
                            :checked="row.authority_column"
                            @change="
                                e =>
                                    onRowChange(
                                        row,
                                        'authority_column',
                                        e.target.checked
                                    )
                            "
                        />
                        <span v-else
                            ><a-checkbox
                                disabled
                                :checked="row.authority_column"
                        /></span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('compute_column')"
                    key="compute_column"
                    align="center"
                    :width="100"
                    ><template slot-scope="row">
                        <span
                            ><a-checkbox
                                disabled
                                :checked="row.compute_column"/></span
                    ></template>
                </a-table-column>
                <a-table-column
                    :title="$t('display_name_chn')"
                    key="display_name_chn"
                    align="left"
                    :width="100"
                >
                    <template slot-scope="row">
                        <span>{{ row.display_name_chn }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('display_name_eng')"
                    key="display_name_eng"
                    align="left"
                    :width="100"
                >
                    <template slot-scope="row">
                        <span>{{ row.display_name_eng }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('column_name')"
                    key="column_name"
                    align="left"
                    :width="100"
                >
                    <template slot-scope="row">
                        <span>{{ row.column_name }}</span>
                    </template>
                </a-table-column>
            </a-table>
        </div>
    </section>
</template>

<style>
.ant-select-auto-complete.ant-select-sm .ant-input,
.required .ant-calendar-picker-input,
.required .ant-select-selection--single {
    background-color: #ecc5e9;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ProductService } from '@/services/product.service'
import { RequestParams } from '@/core/http'
import { CommonService } from '@/shared/utils/common.service'
import { formConfig } from '@/config/form.config'
import { LoadingService } from '@/bootstrap/services/loading.service'
import UUID from 'uuidjs'
import moment from 'moment'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

@Component({
    components: {}
})
export default class MenuColumnAuthority extends Vue {
    @Prop()
    menuID: any

    @Prop()
    curKey: any

    @Prop()
    settingType: any

    @Prop({ default: 0 })
    openCount: any

    private currentRow: any = ''

    private data: any[] = []

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private moment = moment

    private mounted() {}

    private created() {
        this.getData()
    }

    @Watch('openCount')
    private onCntChange() {
        this.getData()
    }

    private saveData() {
        let post_data = this.data.map(x => {
            if (x.authority_column && !x.compute_column) {
                return x.column_name
            }
        })

        post_data = post_data.filter(x => x)

        this.innerAction.setActionAPI(
            'common/save_menu_column_authority',
            CommonService.getMenuCode('role-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        menu_id: this.menuID,
                        key_id: this.curKey,
                        settings_type: this.settingType,
                        authority_column_list: post_data
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
                    this.currentRow = -1
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onRowChange(row, column, value) {
        if (
            Object.prototype.toString.call(value) === '[object InputEvent]' ||
            Object.prototype.toString.call(value) === '[object Event]' ||
            Object.prototype.toString.call(value) === '[object Object]'
        ) {
            if (value.target != undefined && value.target.value != undefined) {
                row[column] = value.target.value
            } else {
                row[column] = value
            }
        } else {
            row[column] = value
        }
    }

    private cancelBtn(e) {
        e.stopPropagation()
        this.currentRow = -1
    }

    private getData() {
        this.innerAction.setActionAPI(
            'common/query_menu_column_authority',
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
                    this.data = data.map(x => {
                        x['index'] = UUID.generate()
                        return x
                    })
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
  "en-us":{
    "column_name":"Column Name",
    "compute_column":"Compute Column",
    "base_authority_column":"Base authority",
    "display_name_chn":"Display Name Chn",
    "display_name_eng":"Display Name Eng",
    "authority_column":"Authority",
    "actions":{
      "save":"Save"
    }
  },
  "zh-cn":{
    "column_name":"列名",
    "compute_column":"计算列",
    "base_authority_column":"基本授权",
    "display_name_chn":"中文名",
    "display_name_eng":"英文名",
    "authority_column":"授权",
    "actions":{
      "save":"保存"
    }
  }
}
</i18n>
