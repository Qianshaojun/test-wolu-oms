<template>
    <section class="component order-base-detail;height:">
        <div style="padding:0 20px 10px 20px;height:40px;">
            <a-button @click="addBtn" type="default" size="small"
                ><a-icon type="plus" />{{ $t('actions.add') }}</a-button
            >
            <a-button
                @click="saveData"
                type="primary"
                size="small"
                style="margin-left:10px;"
                ><a-icon type="save" />{{ $t('actions.save') }}</a-button
            >
            <a-button
                @click="addActionBtn"
                type="primary"
                size="small"
                style="margin-left:10px;"
                ><a-icon type="save" />{{
                    $t('actions.add_action_btn')
                }}</a-button
            >
            <a-input
                v-model="columns"
                size="small"
                style="width:71%;margin-left:10px;"
                :placeholder="$t('split_char')"
            />
            <a-button
                @click="splitcolumns"
                type="default"
                size="small"
                style="margin-left:10px;"
                ><a-icon type="bug" />{{ $t('actions.split') }}</a-button
            >
            <a-checkbox
                :defaultValue="append_split_column"
                :checked="append_split_column"
                style="margin-left:10px;"
                @click="appendSplitColumnClick"
                >追加</a-checkbox
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
                :scroll="{ x: 1800, y: 400 }"
                bordered
            >
                <a-table-column
                    :title="$t('column_name')"
                    key="column_name"
                    align="left"
                    :width="100"
                >
                    <template slot-scope="row">
                        <a-input
                            v-decorator="['column_name']"
                            :value="row.column_name"
                            @change="e => onRowChange(row, 'column_name', e)"
                            :style="{ width: '100%', background: '#ecc5e9' }"
                            v-if="currentRow == row.index"
                        />
                        <span v-else>{{ row.column_name }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('sort_order')"
                    key="sort_order"
                    align="center"
                    :width="60"
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
                    :width="60"
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
                    :width="80"
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
                <a-table-column
                    :title="$t('actions.action')"
                    key="action"
                    align="center"
                    fixed="right"
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
export default class EditLines extends Vue {
    @Prop()
    info: any

    @Prop()
    apiID: any

    private append_split_column: any = true

    private currentRow: any = ''

    private columns: any = ''

    private data: any[] = []

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private moment = moment

    private mounted() {
        this.data = this.info.map(x => {
            x['index'] = UUID.generate()
            x['save_flag'] = 1
            x.group_by_period = x.group_by_period
                ? JSON.parse(x.group_by_period)
                : []
            return x
        })
    }

    @Watch('info')
    private onInfoChange() {
        this.data = this.info.map(x => {
            if (!x.index) {
                x['index'] = UUID.generate()
                x['save_flag'] = 1
                x.group_by_period = x.group_by_period
                    ? JSON.parse(x.group_by_period)
                    : []
            }
            return x
        })
    }

    private created() {}

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
            scoped_slot_name: '',
            sorter: false,
            can_group_by: false,
            default_group_by: false,
            group_by_order: 10,
            aggregate_column: '',
            render_function: '',
            can_edit: false,
            can_filter: false,
            can_show: true,
            merge_column_name: '',
            merge_column_name_chn: '',
            merge_column_name_eng: '',
            is_dropdown_list: false,
            dict_name: '',
            data_type: 'string',
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
        }
        this.innerAction.setActionAPI(
            'system_management/save_api_column_info',
            CommonService.getMenuCode('api-url-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { api_id: this.apiID, column_list: this.data },
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
        }
    }

    private appendSplitColumnClick() {
        this.append_split_column = !this.append_split_column
    }

    private cancelBtn(e) {
        e.stopPropagation()
        this.currentRow = -1
    }

    private onDel(row) {
        this.currentRow = -1
        this.data = this.data.filter(x => x.index !== row.index)
    }

    private splitcolumns() {
        let sort: any = this.data.length == 0 ? 1 : this.data.length

        if (!this.append_split_column) {
            this.data = []
            sort = 0
        }

        let arr = this.columns.split(',')
        for (let i in arr) {
            let item = this.data.find(x => x.column_name == arr[i].trim())
            if (item) {
                continue
            }

            this.data.push({
                index: UUID.generate(),
                save_flag: 0,
                id: 0,
                column_name: arr[i].trim(),
                sort_order: ++sort * 10,
                compute_column: false,
                display_name_chn: arr[i].trim(),
                display_name_eng: arr[i].trim(),
                width: '100',
                text_align: 'left',
                scoped_slot_name: '',
                sorter: false,
                can_group_by: false,
                default_group_by: false,
                group_by_order: 10,
                aggregate_column: '',
                render_function: '',
                can_edit: false,
                can_filter: false,
                can_show: true,
                merge_column_name: '',
                merge_column_name_chn: '',
                merge_column_name_eng: '',
                is_dropdown_list: false,
                dict_name: '',
                data_type: 'string',
                allow_null: false,
                group_by_period: []
            })
        }
    }

    private addActionBtn() {
        let sort = Math.max(this.data[this.data.length - 1].sort_order, 100)
        let exist = this.data.find(x => x.column_name === 'operation')
        if (exist) {
            this.$message.warning('The operation line already exists！')
            return
        }
        this.data.push({
            index: UUID.generate(),
            save_flag: 0,
            id: 0,
            column_name: 'operation',
            sort_order: sort + 10,
            compute_column: false,
            display_name_chn: '操作',
            display_name_eng: 'operation',
            width: '100',
            text_align: 'center',
            scoped_slot_name: 'operation',
            sorter: false,
            can_group_by: false,
            default_group_by: false,
            group_by_order: 10,
            aggregate_column: '',
            render_function: '',
            can_edit: false,
            can_filter: false,
            can_show: true,
            merge_column_name: '',
            merge_column_name_chn: '',
            merge_column_name_eng: '',
            is_dropdown_list: false,
            dict_name: '',
            data_type: 'string',
            allow_null: false,
            group_by_period: []
        })
    }
}
</script>

<i18n>
{
  "en-us":{
    "column_name":"Column Name",
    "sort_order":"Sort Order",
    "compute_column":"Compute Column",
    "display_name_chn":"Display Name Chn",
    "display_name_eng":"Display Name Eng",
    "width":"Width",
    "text_align":"Text Align",
    "scoped_slot_name":"Scoped Slot Name",
    "sorter":"Sorter",
    "default_group_by":"Default GroupBy",
    "group_by_order":"Group By Order",
    "render_function":"Render Function",
    "can_edit":"Can Edit",
    "can_group_by":"Can Group By",
    "can_filter":"Can Filter",
    "can_show":"Can Show",
    "merge_column_name":"Merge Column Name",
    "merge_column_name_chn":"Merge Column CHN Name",
    "merge_column_name_eng":"Meger Column ENG Name",
    "data_type": "Data Type",
    "is_dropdown": "Is Dropdown",
    "dict_name": "Dict Name",
    "allow_null": "Allow Null",
    "group_by_period": "Group By Period",
    "actions":{
      "add":"Add",
      "action":"Action",
      "save":"Save",
      "delete":"Delete",
      "split":"Split",
      "ok":"Yes",
      "cancel":"Cancel",
      "add_action_btn":"Add Action Btn"
    },
    "split_char":"split by comma",
    "delete":"Are you sure delete?"
  },
  "zh-cn":{
    "column_name":"列名",
    "sort_order":"显示排序",
    "compute_column":"计算列",
    "display_name_chn":"中文名",
    "display_name_eng":"英文名",
    "width":"列宽",
    "text_align":"对齐方式",
    "scoped_slot_name":"插槽名字",
    "sorter":"可排序",
    "default_group_by":"默认分组",
    "group_by_order":"分组排序",
    "render_function":"渲染函数",
    "can_edit":"可编辑列",
    "can_group_by":"可分组列",
    "can_filter":"可过滤",
    "can_show":"表格可见",
    "merge_column_name":"合并列名",
    "merge_column_name_chn":"合并列中文",
    "merge_column_name_eng":"合并列英文",
    "data_type": "数据类型",
    "is_dropdown": "下拉列",
    "dict_name": "下拉值名",
    "allow_null": "允许空值",
    "group_by_period": "分组周期",
    "actions":{
      "add":"新增",
      "action":"操作",
      "save":"保存",
      "delete":"删除",
      "split":"拆分",
      "ok":"确定",
      "cancel":"取消",
      "add_action_btn":"添加操作按钮"
    },
    "split_char":"以英文逗号拆分",
    "delete":"确定要删除吗?"
  }
}
</i18n>
