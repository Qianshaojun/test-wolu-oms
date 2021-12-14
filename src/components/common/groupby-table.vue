<template>
    <div style="position: relative;">
        <!--树形分组表格分页-->
        <a-pagination
            v-if="pageService"
            class="margin-top  text-left"
            :pageSize="pageService.pageSize"
            :total="firstTablePageTotal"
            :showTotal="total => `共 ${total} 条`"
            size="small"
            @change="onFirstTablePageChange"
            style="margin: 10px 0"
        />
        <!--树形分组表格-->
        <a-table
            @expand="onExpand"
            :expandedRowRender="expandedRowRender"
            :expandRowByClick="true"
            :showHeader="true"
            :columns="columns"
            :dataSource="data"
            :rowKey="record => `${record.index}`"
            :pagination="false"
            :scroll="{
                x: this.scrollX ? this.scrollX : '100%',
                y: this.scrollY ? this.scrollY : '100%'
            }"
            class="x-group-first-table"
        >
        </a-table>
        <!--树形分组表格全选按钮-->
        <a-checkbox
            class="check_box"
            style="position:absolute;top:50px !important;left:38px; z-index: 11"
            @change="e => onSelectAllChange(e)"
            size="small"
        />
    </div>
</template>

<style lang="less">
.x-group-table {
    margin-left: -30px;
}

// .x-group-sub-table {
//     padding-left: 250px;
// }

.x-group-sub-table .ant-pagination,
.x-group-table .ant-pagination {
    position: absolute;
    top: -29px;
    right: 20px;
    margin: 0;
}

.x-group-first-table tbody tr:nth-child(even),
.x-group-table tbody tr:nth-child(even) {
    background-color: #fff !important;
}

.x-group-first-table tbody tr td,
.x-group-table tbody tr td {
    word-break: keep-all;
    white-space: nowrap;
}

.x-group-sub-table tbody tr td {
    white-space: normal !important;
}

.x-group-first-table .x-group-sub-table tbody tr {
    background: #ffffff !important;
}

.x-group-first-table .x-group-sub-table tbody tr:nth-child(even) {
    background: #efeff8 !important;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Emit, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { formConfig } from '../../config/form.config'
import UUID from 'uuidjs'
import { Table, Icon } from 'ant-design-vue'
import { CreateElement } from 'vue'
import BasicTable from '~/components/common/basic-table.vue'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { PublicService } from '@/services/public.service'
import { CommonService } from '../../shared/utils/common.service'
import { namespace } from 'vuex-class'
import router from '../../router'
import moment from 'moment'

const datasModule = namespace('datasModule')

@Component({
    components: {
        BasicTable
    }
})
export default class GroupbyTable extends Vue {
    @Prop()
    private groupByColumn: any

    @Prop()
    private oColumns: any //表格列数据

    @Prop()
    private queryNameAuth: any

    @Prop()
    private urlStr: any

    @Prop({ default: 'auto' })
    private scrollX: any

    @Prop({ default: 450 })
    private scrollY: any

    //行类名
    @Prop()
    public rowClassName

    @datasModule.State
    private groupbyFlag

    @datasModule.Mutation
    private setGroupbyFlag

    @datasModule.State
    private systemUsers

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private innerActionService = new InnerActionService()

    private publicService = new PublicService()

    // 表格选择项
    private selectedRowKeys: any[] = []

    private data: any = []

    private groupBy: any = []

    private groupCondition: any = {}

    private columns: any = [
        {
            key: 'group',
            title: '',
            dataIndex: 'group',
            width: 85,
            customRender: (value, row, index) => {
                if (value) {
                    if (
                        row[row.group] &&
                        typeof row[row.group] == 'object' &&
                        ((row[row.group][1] != undefined &&
                            row[row.group][1]) ||
                            row[row.group][1] == null)
                    ) {
                        return (
                            row[row.group][1] +
                            '(' +
                            row.cnt +
                            ')' +
                            (row.aggregate != undefined ? row.aggregate : '')
                        )
                    } else {
                        return row[row.group]
                            ? row[row.group] + `(${row.cnt})`
                            : 'undefined' +
                                  '(' +
                                  row.cnt +
                                  ')' +
                                  (row.aggregate != undefined
                                      ? row.aggregate
                                      : '')
                    }
                }
                return ''
            }
        }
    ]

    private sColumns: any = []

    private groupRow: any = ''

    private nextGroupByRow: any = ''

    private menu_code: any

    private firstTablePageTotal: any = 0

    private groupByColumns: any = []

    private queryConditions: any = []
    private originCondition: any = []

    private leafDatas: any = []

    private clearCnt: any = 0

    private defaultCheck: any = false

    public mounted() {
        this.menu_code = CommonService.getMenuCode()
        // this.columns = this.oColumns
        //     .map(x => {
        //         let clm = Object.assign({}, x)
        //         clm.sorter = false
        //         return clm
        //     })
        //     .filter(y => !this.groupByColumn.includes(y.key))
        for (let x of this.oColumns) {
            let clm = Object.assign({}, x)
            clm.sorter = false
            this.columns.push(clm)
        }
        this.columns = this.columns.filter(
            y => !this.groupByColumn.includes(y.key)
        )

        if (this.groupByColumn.length) {
            this.groupByColumns = this.groupByColumn.map(x => x)
            this.groupBy = this.getGroupBy(0)
            this.groupRow = this.groupByColumns[0]
        }

        this.$nextTick(() => {
            let box: any = document.getElementsByClassName('check_box')[0]
            let firstTable = document.getElementsByClassName(
                'x-group-first-table'
            )[0]
            let th: any = firstTable.getElementsByTagName('th')
            let top: any = 40
            // if (th && th.length) {
            //     top =
            //         30 +
            //         Math.floor(Math.floor(parseInt(th[0].offsetHeight) - 3) / 2)
            // }
            box.setAttribute(
                'style',
                'position:absolute;top:' + top + 'px;left:37px;'
            )
        })
    }

    private getGroupBy(next_row_id) {
        let _that = this

        let groupBy = _that.groupByColumns.map((x, i) => {
            let aggregate: any = _that.queryNameAuth.find(
                y => y.column_name == x
            )

            if (
                aggregate &&
                aggregate.aggregate_column &&
                JSON.parse(aggregate.aggregate_column)
            ) {
                aggregate = JSON.parse(aggregate.aggregate_column).map(z => {
                    return {
                        name: Object.keys(z)[0],
                        aggregate_function: z[Object.keys(z)[0]]
                    }
                })
            } else {
                aggregate = []
            }

            return {
                group_name: x,
                is_group: i == next_row_id ? true : false,
                aggregate_column: aggregate
            }
        })

        return groupBy
    }

    @Watch('groupByColumn')
    private onGroupByColumnChange() {
        if (this.groupByColumn) {
            this.groupByColumns = this.groupByColumn.map(x => x)
            this.columns = [
                {
                    key: 'group',
                    title: '',
                    dataIndex: 'group',
                    width: 75 + (this.groupByColumn.length - 1) * 20,
                    customRender: (value, row, index) => {
                        if (value) {
                            if (
                                row[row.group] &&
                                typeof row[row.group] == 'object' &&
                                ((row[row.group][1] != undefined &&
                                    row[row.group][1]) ||
                                    row[row.group][1] == null)
                            ) {
                                return (
                                    row[row.group][1] +
                                    '(' +
                                    row.cnt +
                                    ')' +
                                    (row.aggregate != undefined
                                        ? row.aggregate
                                        : '')
                                )
                            } else {
                                return (
                                    row[row.group] +
                                    '(' +
                                    row.cnt +
                                    ')' +
                                    (row.aggregate != undefined
                                        ? row.aggregate
                                        : '')
                                )
                            }
                        }
                        return ''
                    }
                }
            ]
            for (let x of this.oColumns) {
                let clm = Object.assign({}, x)
                clm.sorter = false
                this.columns.push(clm)
            }
            this.columns = this.columns.filter(
                y => !this.groupByColumn.includes(y.key)
            )

            this.groupBy = this.getGroupBy(0)

            this.groupRow = this.groupByColumns[0]
        }
        this.data = []
    }

    @Watch('selectedRowKeys')
    private onSelectedRowKeysChange() {
        let ids: any = []
        for (let i of this.selectedRowKeys) {
            let item = this.leafDatas.find(x => x.index == i)
            if (item && item.id) {
                ids.push(item.id)
            }
        }
        this.$emit('selectChange', ids)
    }

    /**
     * 获取订单数据
     */
    public getFirstTableData(conditions) {
        this.data = []
        let params: any = []
        this.setGroupbyFlag(0)
        this.originCondition = conditions
        params['query_condition'] = conditions
        params['group_by'] = this.getGroupBy(0)

        this.innerActionService.setActionAPI(this.urlStr, this.menu_code)
        this.publicService
            .queryPagination(
                new RequestParams(params, {
                    page: this.pageService,
                    loading: this.loadingService,
                    innerAction: this.innerActionService
                })
            )
            .subscribe(
                data => {
                    let aggregate: any = this.groupBy[0].aggregate_column
                    let aggregate_arr: any[] = []

                    if (aggregate.length) {
                        let aggregate_column: any = ''
                        let show_name: any = ''

                        for (let item of aggregate) {
                            aggregate_column = item.name

                            let columnData = this.oColumns.find(
                                c => c.key == aggregate_column
                            )
                            if (columnData) {
                                show_name = columnData.title
                            } else {
                                show_name = aggregate_column
                            }

                            aggregate_arr.push({
                                column: aggregate_column,
                                name: show_name
                            })
                        }
                    }

                    this.data = data.map(x => {
                        let aggregate_info: any = ''

                        for (let item of aggregate_arr) {
                            let aggregate_column: any = item.column
                            let show_name: any = item.name

                            aggregate_info +=
                                ' (' +
                                show_name +
                                ': ' +
                                x[aggregate_column] +
                                ')'
                        }

                        let item: any = {
                            index: UUID.generate(),
                            group: this.groupByColumns[0],
                            cnt: x.cnt,
                            aggregate: aggregate_info
                        }

                        let rowInfo = this.oColumns.find(
                            x => x.key === this.groupByColumns[0]
                        )

                        let groupValue: any = x[this.groupByColumns[0]]
                        if (
                            rowInfo &&
                            rowInfo.scopedSlots !== undefined &&
                            rowInfo.scopedSlots.customRender !== undefined &&
                            rowInfo.scopedSlots.customRender ===
                                'user_render' &&
                            typeof x[this.groupByColumns[0]] !== 'object'
                        ) {
                            groupValue = [
                                groupValue,
                                this.getUserName(groupValue)
                            ]
                        }

                        item[this.groupByColumns[0]] = groupValue

                        return item
                    })
                    this.firstTablePageTotal = this.pageService.total
                    this.unSelectAll()
                    this.leafDatas = []
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getData() {
        let _this = this

        if (_this.queryConditions) {
            this.queryConditions = []
            if (this.originCondition) {
                this.queryConditions = this.originCondition.map(x => x)
            }
            for (let i in _this.groupBy) {
                let name = _this.groupByColumns[i]
                if (!_this.groupBy[i].is_group) {
                    if (_this.groupByColumns[i]) {
                        if (_this.groupCondition[name] != undefined) {
                            if (
                                isNaN(_this.groupCondition[name]) &&
                                !isNaN(
                                    Date.parse(_this.groupCondition[name])
                                ) &&
                                _this.groupCondition[name].includes(':') &&
                                _this.groupCondition[name].length >= 16
                            ) {
                                let dateValue: any = moment(
                                    _this.groupCondition[name]
                                )
                                _this.groupCondition[name] = new Date(
                                    dateValue.utc()
                                )
                            }
                            if (name.includes(':')) {
                                let dateArr = name.split(':')
                                let datePeriod = dateArr[1]
                                let datePeriodValue: any =
                                    _this.groupCondition[name]
                                let dateList: any = []
                                let startDay: any = ''
                                let endDay: any = ''
                                if (datePeriod == 'year') {
                                    dateList = CommonService.getStartEndDayByYear(
                                        datePeriodValue
                                    )
                                    startDay = moment(dateList[0])
                                    endDay = moment(dateList[1])
                                } else if (datePeriod == 'month') {
                                    let arr = datePeriodValue.split('-')
                                    dateList = CommonService.getStartEndDayByMonth(
                                        arr[0],
                                        arr[1]
                                    )
                                    startDay = moment(dateList[0])
                                    endDay = moment(dateList[1])
                                } else if (datePeriod == 'quarter') {
                                    let arr = datePeriodValue.split('-')
                                    dateList = CommonService.getStartEndDayByQuarter(
                                        arr[0],
                                        arr[1]
                                    )
                                    startDay = moment(dateList[0])
                                    endDay = moment(dateList[1])
                                } else if (datePeriod == 'week') {
                                    let arr = datePeriodValue.split('-')
                                    dateList = CommonService.getStartEndDayByWeek(
                                        arr[0],
                                        arr[1]
                                    )
                                    startDay = moment(dateList[0])
                                    endDay = moment(dateList[1])
                                } else if (datePeriod == 'day') {
                                    startDay = moment(
                                        datePeriodValue + ' 00:00:00'
                                    )
                                    endDay = moment(
                                        datePeriodValue + ' 23:59:59'
                                    )
                                }

                                this.queryConditions.push({
                                    query_name: dateArr[0],
                                    operate: '>=',
                                    value: new Date(startDay.utc())
                                })

                                this.queryConditions.push({
                                    query_name: dateArr[0],
                                    operate: '<=',
                                    value: new Date(endDay.utc())
                                })
                            } else {
                                this.queryConditions.push({
                                    query_name: name,
                                    operate: '=',
                                    value: _this.groupCondition[name]
                                })
                            }
                        } else {
                            if (_this.groupCondition[name] == null) {
                                this.queryConditions.push({
                                    query_name: name,
                                    operate: 'null',
                                    value: null
                                })
                            }
                        }
                    }
                } else {
                    break
                }
            }
        }
        let params: any = []
        params['query_condition'] = this.queryConditions
        params['group_by'] = _this.groupBy

        _this.innerActionService.setActionAPI(_this.urlStr, _this.menu_code)
        _this.publicService
            .queryPagination(
                new RequestParams(params, {
                    page: _this.pageService,
                    loading: _this.loadingService,
                    innerAction: _this.innerActionService
                })
            )
            .toPromise()
            .then((data: any) => {
                if (!data.length) {
                    this.$message.error('查询出错，返回结果为空')
                    return
                }
                this.setGroupbyFlag(1)

                let lsData = data.map(x => {
                    x['index'] = UUID.generate()
                    if (
                        this.groupRow ==
                            this.groupByColumns[
                                this.groupByColumns.length - 1
                            ] ||
                        !this.groupRow
                    ) {
                        this.leafDatas.push(x)
                    }

                    return x
                })
                if (this.groupRow) {
                    let aggregate_arr: any[] = []

                    if (this.nextGroupByRow) {
                        let aggregate: any = this.groupBy.find(
                            x => x.group_name == this.nextGroupByRow
                        ).aggregate_column

                        if (aggregate.length) {
                            let aggregate_column: any = ''
                            let show_name: any = ''

                            for (let item of aggregate) {
                                aggregate_column = item.name

                                let columnData = this.oColumns.find(
                                    c => c.key == aggregate_column
                                )
                                if (columnData) {
                                    show_name = columnData.title
                                } else {
                                    show_name = aggregate_column
                                }

                                aggregate_arr.push({
                                    column: aggregate_column,
                                    name: show_name
                                })
                            }
                        }
                    }

                    lsData = data.map(x => {
                        x['index'] = UUID.generate()
                        x['group'] = this.nextGroupByRow

                        let aggregate_info: any = ''

                        for (let item of aggregate_arr) {
                            let aggregate_column: any = item.column
                            let show_name: any = item.name

                            aggregate_info +=
                                ' (' +
                                show_name +
                                ': ' +
                                x[aggregate_column] +
                                ')'
                        }

                        if (aggregate_info) {
                            x['aggregate'] = aggregate_info
                        }

                        let rowInfo = this.oColumns.find(
                            y => y.key === this.nextGroupByRow
                        )

                        let groupValue: any = x[this.nextGroupByRow]
                        if (
                            rowInfo &&
                            rowInfo.scopedSlots !== undefined &&
                            rowInfo.scopedSlots.customRender !== undefined &&
                            rowInfo.scopedSlots.customRender ===
                                'user_render' &&
                            typeof x[this.nextGroupByRow] !== 'object'
                        ) {
                            groupValue = [
                                groupValue,
                                this.getUserName(groupValue)
                            ]
                        }

                        x[this.nextGroupByRow] = groupValue

                        return x
                    })
                }

                let item = this.findKey(this.data, this.rid)
                if (item) {
                    if (item.children != undefined) {
                        let arr = item.children.map(x => x.index)
                        this.leafDatas = this.leafDatas.filter(
                            y => !arr.includes(y.index)
                        )
                    }

                    item['children'] = lsData
                    // for (let i in lsData[0]) {
                    if (
                        this.groupRow !== this.groupByColumns[0] &&
                        this.nextGroupByRow
                    ) {
                        this.sColumns.map(x => {
                            x['width'] = 0
                        })
                        this.sColumns.push({
                            key: this.nextGroupByRow,
                            title: '',
                            dataIndex: this.nextGroupByRow,
                            customRender: (value, row, index) => {
                                if (value) {
                                    if (
                                        typeof row[row.group] == 'object' &&
                                        ((row[row.group][1] != undefined &&
                                            row[row.group][1]) ||
                                            row[row.group][1] == null)
                                    ) {
                                        return (
                                            row[row.group][1] +
                                            '(' +
                                            row.cnt +
                                            ')'
                                        )
                                    } else {
                                        return (
                                            row[row.group] + '(' + row.cnt + ')'
                                        )
                                    }
                                }
                                return ''
                            }
                        })
                    } else {
                        this.sColumns = [
                            {
                                key: this.nextGroupByRow,
                                title: '',
                                dataIndex: this.nextGroupByRow,
                                customRender: (value, row, index) => {
                                    if (value) {
                                        if (
                                            typeof row[row.group] == 'object' &&
                                            ((row[row.group][1] != undefined &&
                                                row[row.group][1]) ||
                                                row[row.group][1] == null)
                                        ) {
                                            return (
                                                row[row.group][1] +
                                                '(' +
                                                row.cnt +
                                                ')' +
                                                (row.aggregate != undefined
                                                    ? row.aggregate
                                                    : '')
                                            )
                                        } else {
                                            return (
                                                row[row.group] +
                                                '(' +
                                                row.cnt +
                                                ')' +
                                                (row.aggregate != undefined
                                                    ? row.aggregate
                                                    : '')
                                            )
                                        }
                                    }
                                    return ''
                                }
                            }
                        ]
                    }
                    // }
                }

                this.groupRow = ''
            })
            .catch(e => {
                this.$message.error(e.message)
            })
    }

    private findKey(dstData, rid) {
        let ret: any = ''
        for (let i in dstData) {
            if (dstData[i].index == rid) {
                ret = dstData[i]
                return ret
            }
            if (dstData[i].children) {
                ret = this.findKey(dstData[i].children, rid)

                if (ret) {
                    return ret
                }
            }
        }

        return ret
    }

    private getChildrenData(dstData, rid) {
        let ret: any = ''
        for (let i in dstData) {
            if (dstData[i].index == rid) {
                if (dstData[i].children) {
                    dstData[i].children[0]['page_total'] = dstData[i].cnt
                }

                return dstData[i].children
            } else {
                if (dstData[i].children) {
                    ret = this.getChildrenData(dstData[i].children, rid)

                    if (ret) {
                        return ret
                    }
                }
            }
        }
        return ret
    }

    private onSelectChange(keys) {
        this.selectedRowKeys = keys
    }

    private rid: any = ''

    private onExpand(expanded, record) {
        this.rid = record.index
        if (!expanded) return //如果是关闭就返回
        let cd = this.findKey(this.data, record.index)
        if (cd.children && cd.children.length > 0) return
        this.groupRow = ''
        let groupValue: any
        this.nextGroupByRow = ''
        let curLi: any = 0

        for (let i in this.groupByColumns) {
            for (let j in record) {
                if (this.groupByColumns[i] == j) {
                    curLi = i
                    this.groupRow = j
                    groupValue = record[j]
                    if (
                        groupValue &&
                        typeof groupValue == 'object' &&
                        ((groupValue[0] != undefined && groupValue[0]) ||
                            groupValue[0] == null)
                    ) {
                        groupValue = groupValue[0]
                    }
                    break
                }
            }
        }
        if (curLi) {
            if (curLi < this.groupByColumns.length - 1) {
                this.nextGroupByRow = this.groupByColumns[parseInt(curLi) + 1]
            }

            this.groupBy = this.getGroupBy(parseInt(curLi) + 1)

            //TODO 获取所有的汇总条件
            this.groupCondition[this.groupRow] = groupValue
            this.getData()
        }
    }

    private renderParams: any = {}

    private expandedRowRender(record, index, indent, expanded) {
        let _this = this
        let renderData = _this.getChildrenData(_this.data, record.index)
        //渲染数据时需要去掉数据中的children，否则会出现重复渲染的情况，不能改变原数据

        if (!renderData) {
            if (!_this.groupbyFlag) {
                return null
            }
        } else {
            this.setGroupbyFlag(0)
            let rData: any = []
            for (let i in renderData) {
                let obj = {}
                obj = Object.assign({}, renderData[i])
                rData.push(obj)
            }
            rData = rData.map(y => {
                if (y.children) {
                    delete y.children
                }
                return y
            })
            if (
                record.group ==
                _this.groupByColumns[_this.groupByColumns.length - 1]
            ) {
                let clms = _this.columns.filter(x => x.key != 'group')
                return _this.$createElement('BasicTable', {
                    props: {
                        data: rData,
                        bordered: true,
                        columns: clms,
                        showHeader: false,
                        selectRowclear: _this.clearCnt,
                        rowClassName: _this.rowClassName,
                        rowKey: `${record.index}`,
                        pagination:
                            _this.rid == record.index
                                ? {
                                      showSizeChanger: true,
                                      size: 'small',
                                      pageSizeOptions:
                                          _this.pageService.pageSizeOpts,
                                      pageSize: _this.pageService.pageSize,
                                      total: rData ? rData[0].page_total : 1,
                                      onShowSizeChange: (current, pageSize) =>
                                          _this.onShowSizeChange(
                                              record,
                                              pageSize
                                          )
                                  }
                                : false,
                        rowSelection: {
                            selectedRowKeys: _this.selectedRowKeys,
                            onChange: keys => (_this.selectedRowKeys = keys)
                        },
                        slots: this.$scopedSlots
                    },
                    on: {
                        expand: _this.onExpand,
                        action: _this.onAction,
                        subRowSelect: _this.onSubRowSelect,
                        pageChange: _this.onPageChange,
                        trClick: _this.onTrClick
                    },
                    attrs: {
                        class: 'x-group-sub-table'
                    }
                })
            } else {
                return _this.$createElement('a-table', {
                    props: {
                        dataSource: rData,
                        columns: _this.sColumns,
                        expandedRowRender: _this.expandedRowRender,
                        expandRowByClick: true,
                        rowKey: `${record.index}`,
                        showHeader: false,
                        pagination:
                            _this.rid == record.index
                                ? {
                                      showSizeChanger: true,
                                      size: 'small',
                                      pageSizeOptions:
                                          _this.pageService.pageSizeOpts,
                                      pageSize: _this.pageService.pageSize,
                                      onChange: _this.onPageChange,
                                      onShowSizeChange: (current, pageSize) =>
                                          _this.onShowSizeChange(
                                              record,
                                              pageSize
                                          )
                                  }
                                : false
                    },
                    on: {
                        expand: _this.onExpand
                    },
                    attrs: {
                        class: 'x-group-table'
                    }
                })
            }
        }
    }

    private createNodes({ type, params }) {
        return this.$createElement(type || 'div', params)
    }

    private onPageChange(page, pageSize) {
        this.pageService.pageIndex = page
        this.unSelectAll()
        this.getData()
    }

    public onShowSizeChange(record, pageSize) {
        this.rid = record.index
        let item = this.findKey(this.data, this.rid)
        if (item && item.children) {
            let arr = item.children.map(x => x.index)
            this.leafDatas = this.leafDatas.filter(y => !arr.includes(y.index))
            delete item.children
        }
        //清除所有同级的数据
        this.pageService.pageSize = pageSize
        this.unSelectAll()
        this.getData()
    }

    private onAction(id, action) {
        this.$emit('onAction', id, action)
    }

    private onFirstTablePageChange(page, pageSize) {
        this.pageService.pageIndex = page
        this.getFirstTableData(this.originCondition)
    }

    private onSelectAllChange(e) {
        if (e.target.checked) {
            this.selectAll()
        } else {
            this.unSelectAll()
        }
    }

    private selectAll() {
        let coll: any = document.getElementsByClassName(
            'ant-table-selection-column'
        )
        this.selectedRowKeys = this.leafDatas.map(x => x.index)

        for (
            let i = 0;
            i < coll.length;
            i++ //循环所有
        ) {
            let inputTg = coll[i].querySelectorAll('input')[0]
            inputTg.checked = true
            inputTg.parentNode.className = 'ant-checkbox ant-checkbox-checked'
        }
    }

    private unSelectAll() {
        let coll: any = document.getElementsByClassName(
            'ant-table-selection-column'
        )
        this.selectedRowKeys = []
        for (
            let j = 0;
            j < coll.length;
            j++ //循环所有
        ) {
            let inputTg = coll[j].querySelectorAll('input')[0]
            inputTg.checked = false
            inputTg.parentNode.className = 'ant-checkbox'
        }
    }

    private onSubRowSelect(row) {
        let querySelector = 'tr[data-row-key="' + row.index + '"'
        let tr: any = document.querySelector(querySelector)
        let inputDom: any = tr.getElementsByClassName('ant-checkbox-input')
        if (inputDom) {
            if (this.selectedRowKeys.includes(row.index)) {
                inputDom[0].checked = false
                inputDom[0].parentNode.className = 'ant-checkbox'
                for (let i in this.selectedRowKeys) {
                    if (this.selectedRowKeys[i] == row.index) {
                        this.selectedRowKeys.splice(parseInt(i), 1)
                    }
                }
            } else {
                inputDom[0].checked = true
                inputDom[0].parentNode.className =
                    'ant-checkbox ant-checkbox-checked'
                this.selectedRowKeys.push(row.index)
            }
        }
    }

    private onTrClick(id) {
        this.$emit('rowClick', id)
    }

    private getUserName(code) {
        let ret: any = code
        let item = this.systemUsers.find(x => x.code == code)
        if (item) {
            ret = item.name
        }
        return ret
    }
}
</script>
<i18n>
{
    "en-us": {
        "more": "More",
        "action": {
            "detail": "Detail"
        }
    },
    "zh-cn": {
        "more": "更多",
        "action": {
            "detail": "详情"
        }
    }
}
</i18n>
