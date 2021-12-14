<template>
    <section class="component order-base-detail;height:">
        <div style="padding:0 20px 0 20px;height:30px;">
            <a-button @click="onCopy" type="default" size="small">
                <a-icon type="copy" />
                {{ $t('actions.copy') }}
            </a-button>
            <a-button
                @click="addBtn"
                type="default"
                size="small"
                style="margin-left:10px;"
            >
                <a-icon type="plus" />
                {{ $t('actions.add') }}
            </a-button>
            <a-button
                @click="saveData"
                type="primary"
                size="small"
                style="margin-left:10px;"
            >
                <a-icon type="save" />
                {{ $t('actions.save') }}
            </a-button>
            <a-button
                @click="resetSort"
                type="primary"
                size="small"
                style="margin-left:10px;"
            >
                <a-icon type="save" />
                {{ $t('actions.reset_sort') }}
            </a-button>
            <a-button
                @click="addOperationBtn"
                v-if="operationInfo"
                type="primary"
                size="small"
                style="margin-left:10px;"
            >
                <a-icon type="save" />
                {{ $t('actions.add_operation_btn') }}
            </a-button>
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
                :scroll="{ x: 1860, y: 400 }"
                bordered
            >
                <a-table-column
                    :title="$t('actions.action')"
                    key="action"
                    align="center"
                    fixed="left"
                    :width="80"
                >
                    <template slot-scope="row">
                        <a-popconfirm
                            :title="$t('delete')"
                            :okText="$t('actions.ok')"
                            :cancelText="$t('actions.cancel')"
                            placement="left"
                            @confirm="onDel(row)"
                        >
                            <a>
                                {{ $t('actions.delete') }}
                            </a>
                        </a-popconfirm>
                        <a
                            v-if="currentRow == row.index"
                            @click="e => cancelBtn(e)"
                        >
                            {{ $t('actions.cancel') }}
                        </a>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('column_name')"
                    key="column_name"
                    align="left"
                    :width="100"
                >
                    <template slot-scope="row">
                        <a-select
                            v-decorator="['column_name']"
                            :value="row.column_name"
                            :style="{ width: '100%' }"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '260px' }"
                            showSearch
                            :filterOption="filterSelectOption"
                            v-if="currentRow == row.index"
                            @change="e => onRowChange(row, 'column_name', e)"
                        >
                            <a-select-option
                                v-for="item of columnInfo"
                                :value="item.column_name"
                                :key="item.column_name"
                                :title="item.column_name"
                            >
                                {{ item.column_name }}
                            </a-select-option>
                        </a-select>
                        <span v-else>{{ row.column_name }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('sort_order')"
                    key="sort_order"
                    align="center"
                    :sorter="
                        (a, b) => {
                            return a.sort_order - b.sort_order
                        }
                    "
                    :width="100"
                >
                    <template slot-scope="row">
                        <a-input-number
                            v-if="currentRow == row.index"
                            v-decorator="['sort_order']"
                            :value="row.sort_order"
                            :min="0"
                            @change="e => onRowChange(row, 'sort_order', e)"
                        />
                        <span v-else>{{ row.sort_order }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('compute_column')"
                    key="compute_column"
                    align="center"
                    :width="60"
                >
                    <template slot-scope="row">
                        <a-checkbox
                            v-if="currentRow == row.index"
                            v-decorator="['compute_column']"
                            :checked="row.compute_column"
                            @change="
                                e =>
                                    onRowChange(
                                        row,
                                        'compute_column',
                                        e.target.checked
                                    )
                            "
                        />
                        <span v-else
                            ><a-checkbox disabled :checked="row.compute_column"
                        /></span>
                    </template>
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
                    :title="$t('display_name_chn')"
                    key="display_name_chn"
                    align="left"
                    :width="80"
                >
                    <template slot-scope="row">
                        <a-input
                            v-decorator="['display_name_chn']"
                            :value="row.display_name_chn"
                            @change="
                                e => onRowChange(row, 'display_name_chn', e)
                            "
                            :style="{ width: '100%', background: '#ecc5e9' }"
                            v-if="currentRow == row.index"
                        />
                        <span v-else>{{ row.display_name_chn }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('display_name_eng')"
                    key="display_name_eng"
                    align="left"
                    :width="80"
                >
                    <template slot-scope="row">
                        <a-input
                            v-decorator="['display_name_eng']"
                            :value="row.display_name_eng"
                            @change="
                                e => onRowChange(row, 'display_name_eng', e)
                            "
                            :style="{ width: '100%', background: '#ecc5e9' }"
                            v-if="currentRow == row.index"
                        />
                        <span v-else>{{ row.display_name_eng }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('data_type')"
                    key="data_type"
                    align="left"
                    :width="80"
                >
                    <template slot-scope="row">
                        <a-select
                            v-decorator="[
                                'data_type',
                                { initialValue: 'string' }
                            ]"
                            :value="row.data_type"
                            :style="{ width: '100%' }"
                            v-if="currentRow == row.index"
                            @change="e => onRowChange(row, 'data_type', e)"
                        >
                            <a-select-option value="string" key="string">
                                String
                            </a-select-option>
                            <a-select-option value="int" key="int">
                                Int
                            </a-select-option>
                            <a-select-option value="float" key="float">
                                Float
                            </a-select-option>
                            <a-select-option value="bool" key="bool">
                                Bool
                            </a-select-option>
                            <a-select-option value="date" key="date">
                                Date
                            </a-select-option>
                            <a-select-option value="datetime" key="datetime">
                                Datetime
                            </a-select-option>
                        </a-select>
                        <span v-else>{{ row.data_type }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('group_by_period')"
                    key="group_by_period"
                    align="left"
                    :width="160"
                >
                    <template slot-scope="row">
                        <a-select
                            mode="multiple"
                            v-decorator="['group_by_period']"
                            :value="row.group_by_period"
                            :style="{ width: '100%' }"
                            :disabled="currentRow !== row.index"
                            @change="
                                e => onRowChange(row, 'group_by_period', e)
                            "
                        >
                            <a-select-option value="year" key="year">
                                按年
                            </a-select-option>
                            <a-select-option value="quarter" key="quarter">
                                按季
                            </a-select-option>
                            <a-select-option value="month" key="month">
                                按月
                            </a-select-option>
                            <a-select-option value="week" key="week">
                                按周
                            </a-select-option>
                            <a-select-option value="day" key="day">
                                按天
                            </a-select-option>
                        </a-select>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('width')"
                    key="width"
                    align="center"
                    :width="60"
                >
                    <template slot-scope="row">
                        <a-input
                            v-if="currentRow == row.index"
                            v-decorator="['width']"
                            :value="row.width"
                            @change="e => onRowChange(row, 'width', e)"
                        />
                        <span v-else>{{ row.width }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('text_align')"
                    key="text_align"
                    align="left"
                    :width="80"
                >
                    <template slot-scope="row">
                        <a-select
                            v-decorator="[
                                'text_align',
                                { initialValue: 'left' }
                            ]"
                            :value="row.text_align"
                            :style="{ width: '100%' }"
                            v-if="currentRow == row.index"
                            @change="e => onRowChange(row, 'text_align', e)"
                        >
                            <a-select-option value="left" key="left">
                                Left
                            </a-select-option>
                            <a-select-option value="center" key="center">
                                Center
                            </a-select-option>
                            <a-select-option value="right" key="right">
                                Right
                            </a-select-option>
                        </a-select>
                        <span v-else>{{ row.text_align }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('scoped_slot_name')"
                    key="scoped_slot_name"
                    align="left"
                    :width="80"
                >
                    <template slot-scope="row">
                        <a-input
                            v-decorator="['scoped_slot_name']"
                            :value="row.scoped_slot_name"
                            @change="
                                e => onRowChange(row, 'scoped_slot_name', e)
                            "
                            v-if="currentRow == row.index"
                        />
                        <span v-else>{{ row.scoped_slot_name }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('render_function')"
                    key="render_function"
                    align="left"
                    :width="80"
                >
                    <template slot-scope="row">
                        <a-input
                            v-decorator="['render_function']"
                            :value="row.render_function"
                            @change="
                                e => onRowChange(row, 'render_function', e)
                            "
                            v-if="currentRow == row.index"
                        />
                        <span v-else>{{ row.render_function }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('fixed_type')"
                    key="fixed_type"
                    align="left"
                    :width="80"
                >
                    <template slot-scope="row">
                        <a-select
                            v-decorator="['fixed_type', { initialValue: '0' }]"
                            :value="row.fixed_type.toString()"
                            :style="{ width: '100%' }"
                            :disabled="currentRow !== row.index"
                            @change="e => onRowChange(row, 'fixed_type', e)"
                        >
                            <a-select-option value="-1" key="-1">
                                Left
                            </a-select-option>
                            <a-select-option value="0" key="0">
                                None
                            </a-select-option>
                            <a-select-option value="1" key="1">
                                Right
                            </a-select-option>
                        </a-select>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('is_dropdown')"
                    key="is_dropdown_list"
                    align="center"
                    :width="60"
                >
                    <template slot-scope="row">
                        <a-checkbox
                            v-if="currentRow == row.index"
                            v-decorator="['is_dropdown_list']"
                            :checked="row.is_dropdown_list"
                            @change="
                                e =>
                                    onRowChange(
                                        row,
                                        'is_dropdown_list',
                                        e.target.checked
                                    )
                            "
                        />
                        <span v-else
                            ><a-checkbox
                                disabled
                                :checked="row.is_dropdown_list"
                        /></span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('dict_name')"
                    key="dict_name"
                    align="left"
                    :width="80"
                >
                    <template slot-scope="row">
                        <a-input
                            v-decorator="['dict_name']"
                            :value="row.dict_name"
                            @change="e => onRowChange(row, 'dict_name', e)"
                            v-if="currentRow == row.index"
                        />
                        <span v-else>{{ row.dict_name }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('sorter')"
                    key="sorter"
                    align="center"
                    :width="60"
                >
                    <template slot-scope="row">
                        <a-checkbox
                            v-if="currentRow == row.index"
                            v-decorator="['sorter']"
                            :checked="row.sorter"
                            @change="
                                e =>
                                    onRowChange(row, 'sorter', e.target.checked)
                            "
                        />
                        <span v-else
                            ><a-checkbox disabled :checked="row.sorter"
                        /></span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('can_group_by')"
                    key="can_group_by"
                    align="center"
                    :width="60"
                >
                    <template slot-scope="row">
                        <a-checkbox
                            v-if="currentRow == row.index"
                            v-decorator="['can_group_by']"
                            :checked="row.can_group_by"
                            @change="
                                e =>
                                    onRowChange(
                                        row,
                                        'can_group_by',
                                        e.target.checked
                                    )
                            "
                        />
                        <span v-else
                            ><a-checkbox disabled :checked="row.can_group_by"
                        /></span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('default_group_by')"
                    key="default_group_by"
                    align="center"
                    :width="60"
                >
                    <template slot-scope="row">
                        <a-checkbox
                            v-if="currentRow == row.index"
                            v-decorator="['default_group_by']"
                            :checked="row.default_group_by"
                            @change="
                                e =>
                                    onRowChange(
                                        row,
                                        'default_group_by',
                                        e.target.checked
                                    )
                            "
                        />
                        <span v-else
                            ><a-checkbox
                                disabled
                                :checked="row.default_group_by"
                        /></span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('group_by_order')"
                    key="group_by_order"
                    align="left"
                    :width="100"
                >
                    <template slot-scope="row">
                        <a-input-number
                            v-decorator="['group_by_order']"
                            :value="row.group_by_order"
                            :min="0"
                            @change="e => onRowChange(row, 'group_by_order', e)"
                            v-if="currentRow == row.index"
                        />
                        <span v-else>{{ row.group_by_order }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('aggregate_column')"
                    key="aggregate_column"
                    align="left"
                    :width="160"
                >
                    <template slot-scope="row">
                        <a-input
                            v-decorator="['aggregate_column']"
                            :value="row.aggregate_column"
                            @change="
                                e => onRowChange(row, 'aggregate_column', e)
                            "
                            v-if="currentRow == row.index"
                        />
                        <span v-else>{{ row.aggregate_column }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('can_show')"
                    key="can_show"
                    align="center"
                    :width="60"
                >
                    <template slot-scope="row">
                        <a-checkbox
                            v-if="currentRow == row.index"
                            v-decorator="['can_show']"
                            :checked="row.can_show"
                            @change="
                                e =>
                                    onRowChange(
                                        row,
                                        'can_show',
                                        e.target.checked
                                    )
                            "
                        />
                        <span v-else
                            ><a-checkbox disabled :checked="row.can_show"
                        /></span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('can_edit')"
                    key="can_edit"
                    align="center"
                    :width="60"
                >
                    <template slot-scope="row">
                        <a-checkbox
                            v-if="currentRow == row.index"
                            v-decorator="['can_edit']"
                            :checked="row.can_edit"
                            @change="
                                e =>
                                    onRowChange(
                                        row,
                                        'can_edit',
                                        e.target.checked
                                    )
                            "
                        />
                        <span v-else
                            ><a-checkbox disabled :checked="row.can_edit"
                        /></span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('can_filter')"
                    key="can_filter"
                    align="center"
                    :width="60"
                >
                    <template slot-scope="row">
                        <a-checkbox
                            v-if="currentRow == row.index"
                            v-decorator="['can_filter']"
                            :checked="row.can_filter"
                            @change="
                                e =>
                                    onRowChange(
                                        row,
                                        'can_filter',
                                        e.target.checked
                                    )
                            "
                        />
                        <span v-else
                            ><a-checkbox disabled :checked="row.can_filter"
                        /></span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('allow_null')"
                    key="allow_null"
                    align="center"
                    :width="60"
                >
                    <template slot-scope="row">
                        <a-checkbox
                            v-if="currentRow == row.index"
                            v-decorator="['allow_null']"
                            :checked="row.allow_null"
                            @change="
                                e =>
                                    onRowChange(
                                        row,
                                        'allow_null',
                                        e.target.checked
                                    )
                            "
                        />
                        <span v-else
                            ><a-checkbox disabled :checked="row.allow_null"
                        /></span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('merge_column_name')"
                    key="merge_column_name"
                    align="left"
                    :width="100"
                >
                    <template slot-scope="row">
                        <a-input
                            v-decorator="['merge_column_name']"
                            :value="row.merge_column_name"
                            @change="
                                e => onRowChange(row, 'merge_column_name', e)
                            "
                            v-if="currentRow == row.index"
                        />
                        <span v-else>{{ row.merge_column_name }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('merge_column_name_chn')"
                    key="merge_column_name_chn"
                    align="left"
                    :width="80"
                >
                    <template slot-scope="row">
                        <a-input
                            v-decorator="['merge_column_name_chn']"
                            :value="row.merge_column_name_chn"
                            @change="
                                e =>
                                    onRowChange(row, 'merge_column_name_chn', e)
                            "
                            v-if="currentRow == row.index"
                        />
                        <span v-else>{{ row.merge_column_name_chn }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('merge_column_name_eng')"
                    key="merge_column_name_eng"
                    align="left"
                >
                    <template slot-scope="row">
                        <a-input
                            v-decorator="['merge_column_name_eng']"
                            :value="row.merge_column_name_eng"
                            @change="
                                e =>
                                    onRowChange(row, 'merge_column_name_eng', e)
                            "
                            v-if="currentRow == row.index"
                        />
                        <span v-else>{{ row.merge_column_name_eng }}</span>
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
export default class EditApiLines extends Vue {
    @Prop()
    info: any

    @Prop()
    apiID: any

    @Prop()
    id: any

    @Prop()
    menuID: any

    @Prop({ default: 0 })
    cnt: any

    private currentRow: any = ''

    private data: any[] = []

    private columnInfo: any = []

    private operationInfo: any = null

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private moment = moment

    private mounted() {
        if (this.id) {
            this.getData()
        }
    }

    @Watch('id')
    private onIdChange() {
        if (this.id) {
            this.getData()
            this.getColumnInfo()
        }
    }

    @Watch('cnt')
    private onCntChange() {
        this.getData()
    }

    private created() {
        this.getColumnInfo()
    }

    private addBtn() {
        this.currentRow = UUID.generate()
        this.data.push({
            index: this.currentRow,
            save_flag: 0,
            id: 0,
            column_name: '',
            sort_order: 10,
            compute_column: false,
            display_name_chn: '',
            display_name_eng: '',
            width: '100',
            text_align: 'left',
            is_dropdown_list: false,
            dict_name: '',
            data_type: 'string',
            scoped_slot_name: '',
            sorter: false,
            can_group_by: false,
            default_group_by: false,
            group_by_order: 10,
            aggregate_column: '',
            render_function: '',
            can_edit: false,
            can_filter: false,
            api_column_id: 0,
            can_show: true,
            fixed_type: '0',
            authority_column: true,
            merge_column_name: '',
            merge_column_name_chn: '',
            merge_column_name_eng: '',
            allow_null: false,
            group_by_period: []
        })
    }

    private saveData() {
        for (let i in this.data) {
            if (
                !this.data[i].column_name ||
                !this.data[i].display_name_chn ||
                !this.data[i].display_name_eng
            ) {
                this.$message.error('请先完善列中的信息,深色背景为必填项')
                this.currentRow = this.data[i].index
                return false
            }
            this.data[i].fixed_type = parseInt(this.data[i].fixed_type)
        }
        this.innerAction.setActionAPI(
            'common/save_menu_api_column_info',
            CommonService.getMenuCode('menu-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { menu_api_id: this.id, column_list: this.data },
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

        if (column == 'column_name') {
            var reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
            if (reg.test(row[column])) {
                this.$message.error('列名中不能包含中文')
                row[column] = ''
            } else {
                if (
                    this.data.find(
                        x =>
                            x.column_name == row[column] && x.index != row.index
                    )
                ) {
                    this.$message.error('列名不能重复')
                    row[column] = ''
                }
            }
            let clm: any = this.columnInfo.find(
                x => x.column_name == row[column]
            )
            if (clm) {
                row.api_column_id = clm.id
                for (let i in clm) {
                    if (i != 'id') {
                        row[i] = clm[i]
                    }
                }
            }
        }
    }

    private cancelBtn(e) {
        e.stopPropagation()
        this.currentRow = -1
    }

    private onDel(row) {
        this.currentRow = -1
        this.data = this.data.filter(x => x.index !== row.index)
    }

    private onCopy() {
        this.innerAction.setActionAPI(
            'common/copy_menu_table_column_from_api_column',
            CommonService.getMenuCode('menu-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { menu_api_id: this.id },
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
                    this.getData()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getData() {
        this.innerAction.setActionAPI(
            'common/query_menu_api_column_info',
            CommonService.getMenuCode('menu-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    { menu_api_id: this.id, menu_id: this.menuID },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.data = data.map(x => {
                        x['index'] = UUID.generate()
                        x['save_flag'] = 1
                        x.group_by_period = x.group_by_period
                            ? JSON.parse(x.group_by_period)
                            : []
                        return x
                    })
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getColumnInfo() {
        this.innerAction.setActionAPI(
            'system_management/query_api_column_info',
            CommonService.getMenuCode('api-url-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    { api_id: this.apiID },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.columnInfo = data.map(x => x)
                    this.operationInfo = data.find(
                        x => x.column_name === 'operation'
                    )
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private resetSort() {
        let index = 10
        this.data = this.data.sort(this.compare('sort_order'))
        for (let i of this.data) {
            i.sort_order = index
            index += 10
        }
        // this.saveData()
    }

    private compare = function(prop) {
        return function(obj1, obj2) {
            var val1 = obj1[prop]
            var val2 = obj2[prop]
            if (val1 < val2) {
                return -1
            } else if (val1 < val2) {
                return 1
            } else {
                return 0
            }
        }
    }

    private addOperationBtn() {
        let exist: any = this.data.find(x => x.column_name === 'operation')
        if (!exist) {
            this.operationInfo['fixed_type'] = 0
            this.data.push(this.operationInfo)
        }
    }
}
</script>

<i18n>
{
    "en-us": {
        "column_name": "Column Name",
        "sort_order": "Sort Order",
        "compute_column": "Compute Column",
        "authority_column": "Authority",
        "display_name_chn": "Display Name Chn",
        "display_name_eng": "Display Name Eng",
        "width": "Width",
        "text_align": "Text Align",
        "scoped_slot_name": "Scoped Slot Name",
        "sorter": "Sorter",
        "can_group_by": "Can Group By",
        "default_group_by": "Default GroupBy",
        "group_by_order": "Group By Order",
        "aggregate_column": "Aggregate Function",
        "render_function": "Render Function",
        "can_edit": "Can Edit",
        "can_filter": "Can Filter",
        "can_show": "Can Show",
        "merge_column_name": "Merge Column Name",
        "merge_column_name_chn": "Merge Column CHN Name",
        "merge_column_name_eng": "Meger Column ENG Name",
        "delete": "Are you sure delete?",
        "fixed_type": "Fixed Type",
        "data_type": "Data Type",
        "is_dropdown": "Is Dropdown",
        "dict_name": "Dict Name",
        "allow_null": "Allow Null",
        "group_by_period": "Group By Period",
        "actions": {
            "add": "Add",
            "action": "Action",
            "save": "Save",
            "delete": "Delete",
            "cancel": "Cancel",
            "copy": "Copy",
            "ok": "Yes",
            "reset_sort": "Reset Sort No.",
            "add_operation_btn": "Add Operation Btn"
        }
    },
    "zh-cn": {
        "column_name": "列名",
        "sort_order": "显示排序",
        "compute_column": "计算列",
        "authority_column": "授权",
        "display_name_chn": "中文名",
        "display_name_eng": "英文名",
        "width": "列宽",
        "text_align": "对齐方式",
        "scoped_slot_name": "插槽名字",
        "sorter": "可排序",
        "can_group_by": "可分组",
        "default_group_by": "默认分组",
        "group_by_order": "分组排序",
        "aggregate_column": "聚合函数",
        "render_function": "渲染函数",
        "can_edit": "可编辑列",
        "can_filter": "可过滤",
        "can_show": "表格可见",
        "merge_column_name": "合并列名",
        "merge_column_name_chn": "合并列中文",
        "merge_column_name_eng": "合并列英文",
        "delete": "确定要删除吗?",
        "fixed_type": "固定列",
        "data_type": "数据类型",
        "is_dropdown": "下拉列",
        "dict_name": "下拉值名",
        "allow_null": "允许空值",
        "group_by_period": "分组周期",
        "actions": {
            "add": "新增",
            "action": "操作",
            "save": "保存",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "copy": "复制",
            "reset_sort": "重置排序序号",
            "add_operation_btn": "添加操作按钮"
        }
    }
}
</i18n>
