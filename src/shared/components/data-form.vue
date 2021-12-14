<script lang="tsx">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { formConfig } from '@/config/form.config'
import { VNode } from 'vue'
import SaveSearchForm from './save-search-form.vue'
import { CommonService } from '../utils/common.service'
import { SystemService } from '../../services/system.service'
import { RequestParams } from '@/core/http'
import { Divider } from 'ant-design-vue'
import { namespace } from 'vuex-class'
import { parse } from 'uuidjs'
import moment from 'moment'
import { SellerInstanceService } from '../../services/seller-instance.service'
import Application from '@/core/application'
import { LoadingService } from '../../bootstrap/services/loading.service'

const userModule = namespace('userModule')
const datasModule = namespace('datasModule')

@Component({
    components: {
        Vnodes: {
            functional: true,
            render: (h, ctx) => ctx.props.vnodes
        }
    }
})
export default class DataForm extends Vue {
    @Prop({ default: true })
    public isQueryCustomShow?: boolean

    @Prop({ default: true })
    public isGroupByQueryCustomShow?: boolean

    @Prop({ default: true })
    public isFavoriteQueryCustomShow?: boolean

    @Prop({ default: false }) //是否自定义布局
    public customLayout?: boolean

    @Prop({ default: formConfig.defaults })
    public extends!: any[]

    @Prop({ default: 4 })
    public column!: number

    @Prop({ default: true })
    public showAction!: boolean

    @Prop()
    public labelCol

    @Prop()
    public wrapperCol

    @Prop({ default: false })
    public actions!: boolean

    @Prop({ default: '' })
    public pageName!: string

    @Prop({ default: false }) //是否显示切换表格图标的切换按钮
    public isSwitchShowMode?: boolean

    @Prop({ default: true }) //是否显示分组条件按钮
    public isShowGroupByButton?: boolean

    private lCol: any = {}

    private wCol: any = {}

    public showSearch: boolean = true

    private showSearchState: any = '隐藏查询条件'

    private showSearchIcon: any = 'caret-up'

    private filterConditionVisible: any = false

    private locale: any = ''

    // Form对象实例
    public formInstance

    @userModule.State
    private menus

    @userModule.State
    private info

    @userModule.State
    private id

    @userModule.Mutation('setDataFormHeight')
    private setDataFormHeight

    @datasModule.Mutation('setTableColumnObj')
    private setTableColumnObj

    // Loading服务
    private loadingService = new LoadingService()

    public querySearchCondition: any = []

    public checkedUserCondition: any = {}

    public queryFileterSearchCondition: any = []

    public checkedFilterConditions: any[] = []

    private fixedQueryConditionsList: any = [] //固定搜索条件list

    public defaultSearchCondition: any = ''

    public allQueryConditions: any[] = []

    public groupbyList: any = []

    public checkedGroupbyList: any = []

    private viewCheckedGroupByList: any = []

    public tsData: any = {
        en_us: {},
        zh_cn: {}
    }

    public queryNameAuth: any = []

    public tableColumns: any = []

    public columnWidthTotal: any = 0

    private systemService = new SystemService()

    private columnListData: any = []

    public beforeCreate() {
        this.formInstance = this.$form.createForm(this)
    }

    public created() {
        this.locale = this.$app.state.locale
        this.getSearchList()
        this.lCol = { span: 3 }
        this.wCol = { span: 17, offset: 0 }
    }

    public mounted() {
        if (this.labelCol) {
            this.lCol = this.labelCol
        }

        if (this.wrapperCol) {
            this.wCol = this.wrapperCol
        }
        this.setI18nAuth()
    }

    @Watch('$app.state.locale')
    private onLocaleChange() {
        this.locale = this.$app.state.locale
        for (let i of this.tableColumns) {
            i.title = this.getColumnTitle(i.key)
        }
    }

    // 输入栏折叠状态
    private collapsed = true

    // FormItem Label Span
    // private labelCol = {
    //     span: 3
    // }

    // FormItem Content Span
    // private wrapperCol = {
    //     span: 17,
    //     offset: 0
    // }

    private moreVisible = false

    private extendFromItems: any[] = []

    public menu_code: any = ''

    private setI18nAuth() {
        let dataAuth: any = this.info.data
        let authZh: any = {}
        let authEn: any = {}
        for (let i of dataAuth.button_list) {
            let menuCode = i.menu_code
            if (i.exists_authority && i.button_list.length) {
                let zh: any = {}
                let us: any = {}
                for (let k of i.button_list) {
                    zh[k.button_name] = k.button_name_cn
                    us[k.button_name] = k.button_name_en
                }
                authZh[menuCode] = zh
                authEn[menuCode] = us
            }
        }

        let msgZh = Application.i18n.messages['zh-cn']
        msgZh['auth'] = authZh
        Application.i18n.setLocaleMessage('zh-cn', msgZh)

        let msgUs = Application.i18n.messages['en-us']
        msgUs['auth'] = authEn
        Application.i18n.setLocaleMessage('en-us', msgUs)
    }

    private changeShowSearch() {
        this.showSearch = this.showSearch ? false : true
        this.showSearchState = this.showSearch ? '隐藏查询条件' : '显示查询条件'
        this.showSearchIcon = this.showSearch ? 'caret-up' : 'caret-down'
        this.$emit('heightChange', this.showSearch)
    }

    private updated() {
        const dataFrom = document.querySelector('.data-form') as HTMLElement
        if (dataFrom) {
            this.setDataFormHeight(dataFrom.clientHeight)
        }
        //计算设置了autoFlex表格的最大高度
        this.calTableDomHeight()
    }

    private calTableDomHeight() {
        const autoFlexDom = document.querySelector('.autoFlex') as HTMLElement
        const tableDom = document.querySelector(
            '.ant-table-body'
        ) as HTMLElement

        const fixedTableDom = document.querySelector(
            '.autoFlex .ant-table-body-inner'
        ) as HTMLElement

        if (autoFlexDom) {
            if (tableDom) {
                tableDom.style.maxHeight = autoFlexDom.clientHeight - 120 + 'px'
            }
            if (fixedTableDom) {
                fixedTableDom.style.maxHeight =
                    autoFlexDom.clientHeight - 111 + 'px'
            }
        }
    }

    private updateExtendFromItems() {
        let items: any[] = []

        this.extends
            .filter(x => x.show)
            .map(x => {
                if (x.component) {
                    items.push(x.component)
                }

                if (x.components) {
                    items.push(...x.components)
                }
            })

        this.extendFromItems = items
    }

    /**
     * 默认表单项
     */
    private get defaultFormItems() {
        return this.$slots.default || []
    }

    /**
     * 折叠表单项
     */
    private get collapseFormItems() {
        return this.$slots.collapse || []
    }

    /**
     * 表单提交
     */
    @Emit('submit')
    onSumbit(e) {
        e.preventDefault()
        return e.target.value
    }

    /**
     * 主题渲染函数
     */
    public render(h) {
        return (
            <section class="component data-form">
                <a-card>
                    <div v-show={this.showSearch} style="float:right">
                        <a-button-group>
                            {this.renderFilterQueryCondition(h)}
                            {this.isShowGroupByButton
                                ? this.renderGroupByCondition(h)
                                : ''}
                            {this.renderFavoriteQueryCondition(h)}
                        </a-button-group>
                    </div>
                    <div style="clear:both;"></div>
                    <a-form
                        form={this.formInstance}
                        ref="form"
                        layout="inline"
                        onSubmit={this.onSumbit}
                        labelCol={this.lCol}
                        wrapperCol={this.wCol}
                    >
                        {this.customLayout ? (
                            <div v-show={this.showSearch}>
                                {this.$slots.default}
                                {this.renderFormSide(h)}
                                {this.collapsed ? '' : this.$slots.collapse}
                            </div>
                        ) : (
                            <div class="flex-row" v-show={this.showSearch}>
                                <a-row gutter={24} class="flex-auto">
                                    {this.renderDefaultFormItems(h)}
                                    {this.renderFormSide(h)}
                                    {this.renderExtendFromItems(h)}
                                    {this.renderCollapseFormItems(h)}
                                </a-row>
                            </div>
                        )}
                        {this.renderFormAction(h)}
                    </a-form>
                </a-card>
            </section>
        )
    }

    /**
     * 处理固定搜索条件
     */
    private handleFixedConditions(conditions, type) {
        let arr: any = []
        if (conditions.length) {
            for (let i of conditions) {
                if (i.value === 'false' || i.value === 'FALSE') {
                    i.value = false
                } else if (i.value === 'true' || i.value === 'TRUE') {
                    i.value = true
                }

                if (
                    [
                        '#user_id#',
                        '#today#',
                        '#yesterday#',
                        '#bfystoday#'
                    ].includes(i.value)
                ) {
                    i.value = this.getQueryConditionValue(i.value)
                }
                i.type = type
                arr.push(i)
            }
        }
        return arr
    }

    /**
     * 处理自定义搜索条件
     */
    public addQueryCondition(condition, type = 10) {
        //处理时间区间数据
        condition.forEach((v, i) => {
            if (v.operate === 'is between') {
                let startDateTime = v.value.split(' and ')[0]
                let endDateTime = v.value.split(' and ')[1]
                condition.splice(
                    i,
                    1,
                    {
                        query_name: '&',
                        operate: '&',
                        value: '&'
                    },
                    {
                        query_name: v.query_name,
                        operate: '>=',
                        value: startDateTime
                    },
                    {
                        query_name: v.query_name,
                        operate: '<=',
                        value: endDateTime
                    }
                )
            }
            if (v.value === 'false' && v.allow_null) {
                condition.splice(
                    i,
                    1,
                    {
                        query_name: '|',
                        operate: '|',
                        value: '|'
                    },
                    {
                        query_name: v.query_name,
                        operate: 'null',
                        value: ''
                    },
                    {
                        query_name: v.query_name,
                        operate: v.operate,
                        value: v.value
                    }
                )
            }
        })
        this.allQueryConditions = [...this.filterKey(condition, 'allow_null')]
    }

    /**
     * 删除数组对象key
     */
    private filterKey(arr, deleteKey) {
        let newObj: any = {}
        let newArr: any = []
        if (arr.length) {
            arr.forEach(v => {
                for (let key in v) {
                    if (key != deleteKey) {
                        newObj[key] = v[key]
                    }
                }
                newArr.push(newObj)
                newObj = {}
            })
        }
        return newArr
    }

    /**
     * 去重
     */
    private process(arr) {
        const cache: any = []
        for (const t of arr) {
            if (
                cache.find(
                    (c: any) =>
                        c.query_name === t.query_name &&
                        c.operate === t.operate &&
                        c.value === t.value
                )
            ) {
                continue
            }
            cache.push(t)
        }
        return cache
    }

    public delQueryCondition(code: any, type: number) {
        this.allQueryConditions = [] //清空原数据
        this.fixedQueryConditionsList = []
        //固定条件自定义搜索
        let customerArr: any = []
        let fixedArr: any = []
        let favoriteArr: any = []
        if (code) {
            if (this.checkedUserCondition.code === code) {
                this.checkedUserCondition = {}
            }
            this.checkedFilterConditions = this.checkedFilterConditions.filter(
                y => y != code
            )
        }
        //收藏按钮相关
        if (this.checkedUserCondition.code) {
            let userCd = this.querySearchCondition.find(
                x => x.search_code === this.checkedUserCondition.code
            )
            if (userCd) {
                //固定条件自定义条件相关
                favoriteArr = this.handleFixedConditions(
                    JSON.parse(userCd.query_condition),
                    type
                )
            }
        }
        //固定条件按钮相关
        if (this.checkedFilterConditions.length) {
            for (var item of this.checkedFilterConditions) {
                let filterCd = this.queryFileterSearchCondition.find(
                    x => x.search_code === item
                )
                if (filterCd) {
                    fixedArr.push(JSON.parse(filterCd.query_condition))
                }
            }
        }
        //固定条件自定义条件相关
        customerArr = this.handleCustomerConditions(this.customerQueryList)
        //合并
        this.fixedQueryConditionsList = [
            ...this.handleFixedConditions([...fixedArr.flat(Infinity)], 10),
            ...this.handleFixedConditions([...favoriteArr], 20)
        ]

        if (customerArr && customerArr.length) {
            let _data: any = [...customerArr]
            this.addQueryCondition(_data, type)
        }
    }

    public setQueryForm() {
        let fillValues: any = {}
        // for (let i of this.allQueryConditions) {
        //     fillValues[i.query_name] = i.value
        // }
        // this.onReset()
        // this.setValues(fillValues)
    }

    private favoriteGroupByList: any = []
    private favoriteFixedList: any = []

    public setFavoriteQueryCondition(param) {
        let condition = this.querySearchCondition.find(
            x => x.search_code === param
        )
        if (condition) {
            if (
                this.checkedUserCondition.code &&
                this.checkedUserCondition.code === condition.search_code
            ) {
                this.checkedUserCondition = {}
                this.viewCheckedGroupByList = []
                this.checkedGroupbyList.splice(
                    0,
                    this.checkedGroupbyList.length
                )
                this.favoriteGroupByList = []
                this.delQueryCondition(param, 20)
            } else {
                this.checkedUserCondition = {
                    code: condition.search_code,
                    name: condition.search_display_name
                }
                this.resetExtraConditions()
                let obj = this.handleFavoriteList(condition)
                this.favoriteFixedList = obj.favoriteFixedList
                this.favoriteGroupByList = obj.favoriteGroupByList
                this.fixedQueryConditionsList.push(
                    ...this.handleFixedConditions(obj.favoriteFixedList, 20)
                )
            }
        }
    }

    //处理收藏的数据
    private handleFavoriteList(condition) {
        let query_condition: any = []
        let group_condition: any = []
        JSON.parse(condition.query_condition).forEach(v => {
            if (v) {
                if (!v.aggregate_column) {
                    query_condition.push(v)
                } else {
                    group_condition.push(v)
                }
            }
        })

        group_condition.forEach(v => {
            this.checkedGroupbyList.push(v.group_name)
        })
        return {
            favoriteFixedList: query_condition,
            favoriteGroupByList: group_condition
        }
    }

    public setFilterQueryCondition(param) {
        let condition: any = this.queryFileterSearchCondition.find(
            x => x.search_code === param
        )
        if (condition) {
            if (this.checkedFilterConditions.includes(condition.search_code)) {
                this.checkedFilterConditions = this.checkedFilterConditions.filter(
                    x => x != condition.search_code
                )
                this.delQueryCondition(param, 10)
            } else {
                this.checkedFilterConditions.push(condition.search_code)
                let query_condition = this.handleFixedConditions(
                    JSON.parse(condition.query_condition),
                    10
                )
                this.fixedQueryConditionsList.push(...query_condition)
            }
        }
    }

    public recheckQueryCondition(e, code) {
        e.stopPropagation()
        let condition = this.querySearchCondition.find(
            x => x.search_code === code
        )
        if (condition) {
            this.delQueryCondition(code, 20)
        }
        this.checkedUserCondition = {}
    }

    public recheckFilterQueryCondition(e, code) {
        e.stopPropagation()
        let condition = this.queryFileterSearchCondition.find(
            x => x.search_code === code
        )
        if (condition) {
            this.delQueryCondition(code, 10)
            this.setQueryForm()
        }
        this.checkedFilterConditions = this.checkedFilterConditions.filter(
            x => x != code
        )
    }

    public getFilterSearchName(code) {
        let ret = ''
        let condition = this.queryFileterSearchCondition.find(
            x => x.search_code === code
        )
        if (condition) {
            ret = condition.search_display_name
        }
        return ret
    }

    public deleteQueryCondition(e, code) {
        e.stopPropagation()
        this.systemService
            .DeleteOneSearchCondition(
                new RequestParams({
                    search_code: code
                })
            )
            .subscribe(
                data => {
                    this.$message.success('删除成功')
                    this.querySearchCondition = this.querySearchCondition.filter(
                        x => x.search_code !== code
                    )
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    public renderGroupByCondition(h) {
        if (this.groupbyList.length || this.columnListData.length) {
            return (
                <div>
                    <a-popover
                        placement="bottomLeft"
                        trigger="click"
                        v-model={this.groupVisible}
                        overlayStyle={this.popoverGroupByStyle}
                    >
                        <template slot="content">
                            <ul style="padding:0;margin:0 0 0 5px">
                                {this.groupbyList.map((item: any) => (
                                    <li
                                        style="cursor:pointer;"
                                        class="filterItem"
                                        key={item}
                                        onClick={() =>
                                            this.setGroupbyItem(item)
                                        }
                                    >
                                        <div style="float:left">
                                            <span style="width:8px;margin-right:10px;display:inline-block">
                                                <a-icon
                                                    type="anticon anticon-gou"
                                                    v-show={
                                                        this
                                                            .viewCheckedGroupByList &&
                                                        this.viewCheckedGroupByList.includes(
                                                            item
                                                        )
                                                    }
                                                />
                                            </span>
                                            <span
                                                style={
                                                    this
                                                        .viewCheckedGroupByList &&
                                                    this.viewCheckedGroupByList.includes(
                                                        item
                                                    )
                                                        ? { fontWeight: 'bold' }
                                                        : ''
                                                }
                                            >
                                                {this.getColumnTitle(item)}
                                            </span>
                                        </div>
                                        <div
                                            v-show={
                                                this.viewCheckedGroupByList &&
                                                this.viewCheckedGroupByList.includes(
                                                    item
                                                )
                                            }
                                            style="float:right;font-weight:bold"
                                        >
                                            {' '}
                                            {this.checkedGroupbyList.findIndex(
                                                v => {
                                                    return v === item
                                                }
                                            ) + 1}
                                        </div>
                                        <div style="clear:both"></div>
                                    </li>
                                ))}
                            </ul>
                            {this.customerGroupByQueryList.length ? (
                                <a-divider style="margin:3px 0;" />
                            ) : (
                                ''
                            )}
                            {/*临时分组搜索数据*/}
                            <ul style="padding:0;margin:0 0 0 5px">
                                {this.customerGroupByQueryList.map(
                                    (item: any, index: number) => (
                                        <li
                                            style="cursor:pointer;"
                                            class="filterItem"
                                            key={index}
                                            onClick={e =>
                                                this.setCustomGroupByItem(
                                                    e,
                                                    item
                                                )
                                            }
                                        >
                                            <div style="float:left">
                                                <span style="width:8px;margin-right:10px;display:inline-block">
                                                    <a-icon
                                                        type="anticon anticon-gou"
                                                        v-show={item.checked}
                                                    />
                                                </span>
                                                <span
                                                    style={
                                                        item.checked
                                                            ? {
                                                                  fontWeight:
                                                                      'bold'
                                                              }
                                                            : ''
                                                    }
                                                >
                                                    {item.name}
                                                </span>
                                            </div>
                                            <div
                                                v-show={item.checked}
                                                style="float:right;font-weight:bold"
                                            >
                                                {this.checkedGroupbyList.findIndex(
                                                    v => {
                                                        return (
                                                            v ===
                                                            item.firstConditionValue
                                                        )
                                                    }
                                                ) + 1}
                                            </div>
                                            <div style="clear:both"></div>
                                        </li>
                                    )
                                )}
                            </ul>
                            {this.columnListData.length &&
                            this.isGroupByQueryCustomShow ? (
                                <div>
                                    <a-divider style="margin:5px 0 0 0;" />
                                    <a-collapse
                                        bordered={false}
                                        style="background: none;"
                                        v-model={this.groupByActiveKey}
                                    >
                                        <a-collapse-panel
                                            key="1"
                                            header={this.$t('add_filter')}
                                            class="customColl"
                                        >
                                            <div style="max-height:600px;overflow-y: auto">
                                                <div style="margin-left: 18px;width:90%">
                                                    <a-select
                                                        style="width: 86%"
                                                        value={
                                                            this
                                                                .customerGroupByObj
                                                                .firstConditionValue
                                                        }
                                                        placeholder={this.$t(
                                                            'plzSelect'
                                                        )}
                                                        onChange={value =>
                                                            this.changeGroupByFirstCondition(
                                                                value
                                                            )
                                                        }
                                                        size="small"
                                                    >
                                                        {this.columnListData.map(
                                                            (v: any) =>
                                                                v.column_name ===
                                                                'id' ? (
                                                                    ''
                                                                ) : (
                                                                    <a-select-option
                                                                        value={
                                                                            v.column_name
                                                                        }
                                                                    >
                                                                        {this
                                                                            .locale ===
                                                                        'zh-cn'
                                                                            ? v.display_name_chn
                                                                            : v.display_name_eng}
                                                                    </a-select-option>
                                                                )
                                                        )}
                                                    </a-select>
                                                </div>
                                                <div style="text-align: left;margin-top: 10px;margin-left: 18px;">
                                                    <a-button
                                                        type="primary"
                                                        size="small"
                                                        onClick={e =>
                                                            this.applyGroupByItem(
                                                                e
                                                            )
                                                        }
                                                    >
                                                        {this.$t('apply')}
                                                    </a-button>
                                                </div>
                                            </div>
                                        </a-collapse-panel>
                                    </a-collapse>
                                </div>
                            ) : (
                                ''
                            )}
                        </template>
                        <a-badge count={this.calGroupByBadge}>
                            <a-button icon="menu" dot={true}>
                                {this.$t('groupby')}
                                <a-icon type="caret-down" />
                            </a-button>
                        </a-badge>
                    </a-popover>
                </div>
            )
        } else {
            return ''
        }
    }

    private customerGroupByQueryList: any = [] //新增的分组list
    private groupByActiveKey: any = []
    private customerGroupByObj: any = {
        firstConditionValue: '',
        firstConditionName: ''
    }

    private get popoverGroupByStyle() {
        return {
            width: '10%'
        }
    }

    /**
     * 计算分组搜索个数
     */
    private get calGroupByBadge() {
        let arr: any = []
        this.groupbyList.forEach(v => {
            if (this.viewCheckedGroupByList.includes(v)) {
                arr.push(v)
            }
        })
        this.customerGroupByQueryList.forEach(v => {
            if (v.checked) {
                arr.push(v)
            }
        })
        return arr.length
    }

    private setGroupbyItem(item) {
        this.uniqueGroupByList()
        if (!this.viewCheckedGroupByList.includes(item)) {
            this.checkedGroupbyList.push(item)
            this.viewCheckedGroupByList.push(item)
        } else {
            for (let i in this.viewCheckedGroupByList) {
                if (this.viewCheckedGroupByList[i] == item) {
                    this.checkedGroupbyList.splice(i, 1)
                    this.viewCheckedGroupByList.splice(i, 1)
                }
                if (!this.checkedGroupbyList.length) {
                    if (this.favoriteGroupByList.length) {
                        this.favoriteGroupByList.forEach(v => {
                            this.checkedGroupbyList.push(v.group_name)
                        })
                    }
                }
            }
        }
    }

    /**
     * 去重分组数据
     */
    uniqueGroupByList() {
        for (let i = 0; i < this.checkedGroupbyList.length; i++) {
            for (let j = i + 1; j < this.checkedGroupbyList.length; j++) {
                if (this.checkedGroupbyList[i] == this.checkedGroupbyList[j]) {
                    this.checkedGroupbyList.splice(j, 1)
                    j--
                }
            }
        }
    }

    /**
     * 勾选添加自定义分组项
     */
    private setCustomGroupByItem(e, item) {
        e.stopPropagation()
        item.checked = !item.checked
        this.uniqueGroupByList()
        if (item.checked) {
            this.checkedGroupbyList.push(item.firstConditionValue)
            this.viewCheckedGroupByList.push(item.firstConditionValue)
        } else {
            this.viewCheckedGroupByList.forEach((v, i) => {
                if (v === item.firstConditionValue) {
                    this.checkedGroupbyList.splice(i, 1)
                    this.viewCheckedGroupByList.splice(i, 1)
                }
            })
        }
    }

    private changeGroupByFirstCondition(value) {
        this.customerGroupByObj.firstConditionValue = value
    }

    /**
     * 确定添加自定义分组项
     */
    private applyGroupByItem(e) {
        e.stopPropagation()
        let groupByObj: any = JSON.parse(
            JSON.stringify(this.customerGroupByObj)
        )
        let obj: any = this.columnListData.find(z => {
            return groupByObj.firstConditionValue === z.column_name
        })
        if (obj) {
            groupByObj.firstConditionName =
                this.locale === 'zh-cn'
                    ? obj.display_name_chn
                    : obj.display_name_eng
        }
        groupByObj.name = groupByObj.firstConditionName
        groupByObj.checked = true
        this.customerGroupByQueryList.push(groupByObj)
        this.checkedGroupbyList.push(groupByObj.firstConditionValue)
        this.viewCheckedGroupByList.push(groupByObj.firstConditionValue)
        this.groupByActiveKey = []
    }

    public renderFavoriteQueryCondition(h) {
        if (this.querySearchCondition.length || this.columnListData.length) {
            return (
                <div>
                    <a-popover
                        placement="bottomRight"
                        trigger="click"
                        v-model={this.favoriteVisible}
                        overlayStyle={this.popoverStyle}
                    >
                        <template slot="content">
                            <ul style="padding:0;margin:0 0 0 5px">
                                {this.querySearchCondition.map(
                                    (item: any, index: number) => (
                                        <li
                                            style="cursor:pointer;display:flex"
                                            class="filterItem"
                                            key={`${item}-${index}`}
                                            onClick={() =>
                                                this.setFavoriteQueryCondition(
                                                    item.search_code
                                                )
                                            }
                                        >
                                            <div style="width:8px;margin-right:10px">
                                                <a-icon
                                                    type="anticon anticon-gou"
                                                    v-show={
                                                        this
                                                            .checkedUserCondition
                                                            .code &&
                                                        item.search_code ==
                                                            this
                                                                .checkedUserCondition
                                                                .code
                                                    }
                                                />
                                            </div>
                                            <div
                                                style={
                                                    this.checkedUserCondition
                                                        .code &&
                                                    item.search_code ==
                                                        this
                                                            .checkedUserCondition
                                                            .code
                                                        ? { fontWeight: 'bold' }
                                                        : ''
                                                }
                                            >
                                                {item.search_display_name}
                                                <a-icon
                                                    type="share-alt"
                                                    v-show={item.is_share}
                                                    style="margin-left:3px;color:blue"
                                                />
                                            </div>
                                            <div style="width:8px;color:#4c4c4c;flex:1;text-align:right;margin-right:5px">
                                                <a-icon
                                                    onClick={e =>
                                                        this.deleteQueryCondition(
                                                            e,
                                                            item.search_code
                                                        )
                                                    }
                                                    type="delete"
                                                    style="cursor:pointer;"
                                                />
                                            </div>
                                        </li>
                                    )
                                )}
                            </ul>
                            <a-divider style="margin:5px 0 0 0;" />
                            {this.isFavoriteQueryCustomShow ? (
                                <a-collapse
                                    bordered={false}
                                    style="background: none;"
                                    v-model={this.favoritesActiveKey}
                                >
                                    <a-collapse-panel
                                        key="1"
                                        header={this.$t('save_current_search')}
                                        class="customColl"
                                    >
                                        <div style="max-height:600px;overflow-y: auto">
                                            <div style="margin-left: 18px;width:90%">
                                                <a-input
                                                    placeholder={this.$t(
                                                        'plzInput'
                                                    )}
                                                    v-model={
                                                        this
                                                            .customerFavoritesObj
                                                            .search_display_name
                                                    }
                                                    size="small"
                                                />
                                                <div style="margin-top:10px">
                                                    <a-checkbox
                                                        onChange={
                                                            this.onDefaultChange
                                                        }
                                                    >
                                                        {this.$t(
                                                            'default_query'
                                                        )}
                                                    </a-checkbox>
                                                    <a-checkbox
                                                        onChange={
                                                            this.onShareChange
                                                        }
                                                    >
                                                        {this.$t('is_share')}
                                                    </a-checkbox>
                                                </div>
                                                <div style="text-align: left;margin-top: 10px">
                                                    <a-button
                                                        type="primary"
                                                        size="small"
                                                        onClick={e =>
                                                            this.applyFavoritesItem(
                                                                e
                                                            )
                                                        }
                                                    >
                                                        {this.$t('save')}
                                                    </a-button>
                                                </div>
                                            </div>
                                        </div>
                                    </a-collapse-panel>
                                </a-collapse>
                            ) : (
                                ''
                            )}
                        </template>
                        <a-badge count={this.calFavoriteListBadge}>
                            <a-button
                                icon="anticon anticon-shoucang"
                                dot={true}
                            >
                                {this.$t('conditions')}
                                <a-icon type="caret-down" />
                            </a-button>
                        </a-badge>
                    </a-popover>
                </div>
            )
        } else {
            return ''
        }
    }

    private favoritesActiveKey: any = []
    private customerFavoritesObj: any = {
        search_display_name: '',
        isDefault: false,
        isShare: false
    }

    private onDefaultChange(e) {
        this.customerFavoritesObj.isDefault = e.target.checked
    }

    private onShareChange(e) {
        this.customerFavoritesObj.isShare = e.target.checked
    }

    private get calFavoriteListBadge() {
        let arr: any = []
        this.querySearchCondition.forEach(v => {
            if (v.search_code === this.checkedUserCondition.code) {
                arr.push(v)
            }
        })
        return arr.length
    }

    /**
     * 获取分组数据
     */
    private getGroupBy(next_row_id) {
        let _that = this

        let groupBy = _that.checkedGroupbyList.map((x, i) => {
            let aggregate: any = _that.queryNameAuth.find(
                y => y.column_name == x
            )

            if (
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

    private applyFavoritesItem(e) {
        e.stopPropagation()
        if (!this.customerFavoritesObj.search_display_name) {
            this.$message.error(`${this.$t('name_required')}`)
            return
        }
        let formValues = this.getValues() //获取表单数据
        let groupArr: any = this.getGroupBy(0) //获取分组条件数据
        let validFeilds: any = []
        for (var i in formValues) {
            if (
                formValues[i] !== undefined &&
                formValues[i] !== '' &&
                formValues[i] !== null
            ) {
                if (Array.prototype.isPrototypeOf(formValues[i])) {
                    if (formValues[i].length > 0 && formValues[i][0]) {
                        validFeilds.push({ [i]: formValues[i] })
                    }
                } else {
                    validFeilds.push({ [i]: formValues[i] })
                }
            }
        }
        let menu_code = this.getMenuCode()
        let conditions: any = CommonService.createQueryCondition(formValues, {
            customer_code: 'like',
            ...formConfig.condition
        })

        //去掉查询条件中的“快速查询”
        let newConditions: any = []
        if (conditions.query_condition.length) {
            for (let i of conditions.query_condition) {
                if (
                    !['fuzzy_search_code', 'fuzzy_search_operator'].includes(
                        i.query_name
                    )
                ) {
                    newConditions.push(i)
                }
            }
        }

        let arr: any = []

        this.validateFields().then((res: any) => {
            //todo 去除固定搜索条件中包含收藏的条件
            this.checkedUserCondition = {} //去除勾选的收藏选项
            arr = [...newConditions, ...groupArr, ...res.self_conditions]
            if (!arr.length) {
                this.$message.error(`${this.$t('conditions_required')}`)
                return
            }

            this.systemService
                .CreateSearchCondition(
                    new RequestParams({
                        menu_code: menu_code,
                        is_share: this.customerFavoritesObj.isShare,
                        default_search: this.customerFavoritesObj.isDefault,
                        search_display_name: this.customerFavoritesObj
                            .search_display_name,
                        query_condition: JSON.stringify(arr),
                        sort_order: 10
                    })
                )
                .subscribe(
                    data => {
                        this.$message.success(`${this.$t('success')}`)
                        this.favoritesActiveKey = []
                        this.tableColumns = []
                        this.getSearchList()
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    public renderFilterQueryCondition(h) {
        if (
            this.queryFileterSearchCondition.length ||
            this.columnListData.length
        ) {
            return (
                <div>
                    <a-popover
                        placement="bottomLeft"
                        trigger="click"
                        v-model={this.filterVisible}
                        overlayStyle={this.popoverStyle}
                    >
                        <template slot="content">
                            <ul style="padding:0;margin:0 0 0 5px">
                                {this.queryFileterSearchCondition.map(
                                    (item: any) => (
                                        <li
                                            style="cursor:pointer;display:flex"
                                            class="filterItem"
                                            key={item.search_code}
                                            onClick={() =>
                                                this.setFilterQueryCondition(
                                                    item.search_code
                                                )
                                            }
                                        >
                                            <div style="width:8px;padding-right:22px">
                                                <a-icon
                                                    type="anticon anticon-gou"
                                                    v-show={this.checkedFilterConditions.includes(
                                                        item.search_code
                                                    )}
                                                />
                                            </div>

                                            <div
                                                style={
                                                    this.checkedFilterConditions.includes(
                                                        item.search_code
                                                    )
                                                        ? { fontWeight: 'bold' }
                                                        : ''
                                                }
                                            >
                                                {item.search_display_name}
                                            </div>
                                        </li>
                                    )
                                )}
                            </ul>
                            {this.customerQueryList.length ? (
                                <a-divider style="margin:3px 0;" />
                            ) : (
                                ''
                            )}
                            {/*临时搜索数据*/}
                            {this.customerQueryList.map((v: any, i: number) => (
                                <ul style="padding:0;margin:0 0 0 5px">
                                    {i != 0 ? (
                                        <a-divider style="margin:3px 0;" />
                                    ) : (
                                        ''
                                    )}
                                    {v.groupArr.map(
                                        (item: any, index: number) => (
                                            <li
                                                style="cursor:pointer;display:flex"
                                                class="filterItem"
                                                key={`${i}+${index}`}
                                                onClick={e =>
                                                    this.setCustomItem(e, item)
                                                }
                                            >
                                                <div style="width:8px;padding-right:22px">
                                                    <a-icon
                                                        type="anticon anticon-gou"
                                                        v-show={item.checked}
                                                    />
                                                </div>
                                                <div
                                                    style={
                                                        item.checked
                                                            ? {
                                                                  fontWeight:
                                                                      'bold'
                                                              }
                                                            : ''
                                                    }
                                                >
                                                    {item.name}
                                                </div>
                                            </li>
                                        )
                                    )}
                                </ul>
                            ))}

                            {this.columnListData.length &&
                            this.isQueryCustomShow ? (
                                <div>
                                    <a-divider style="margin:5px 0 0 0;" />
                                    <a-collapse
                                        bordered={false}
                                        style="background: none;"
                                        v-model={this.activeKey}
                                    >
                                        <a-collapse-panel
                                            key="1"
                                            header={this.$t('add_filter')}
                                            class="customColl"
                                        >
                                            <div style="max-height:600px;overflow-y: auto">
                                                {this.customAddFilterList
                                                    .length ? (
                                                    this.customAddFilterList.map(
                                                        (
                                                            item: any,
                                                            index: number
                                                        ) => (
                                                            <div
                                                                style="display: flex;"
                                                                class="filterItem"
                                                            >
                                                                <div style="width:6%">
                                                                    {index >
                                                                    0 ? (
                                                                        <span>
                                                                            or
                                                                        </span>
                                                                    ) : (
                                                                        <span>
                                                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div style="margin-left: 5px;width:94%">
                                                                    <a-select
                                                                        style="width: 86%"
                                                                        value={
                                                                            item.firstConditionValue
                                                                        }
                                                                        show-search
                                                                        filter-option={
                                                                            this
                                                                                .filterOption
                                                                        }
                                                                        placeholder={this.$t(
                                                                            'plzSelect'
                                                                        )}
                                                                        onChange={value =>
                                                                            this.changeFirstCondition(
                                                                                value,
                                                                                item
                                                                            )
                                                                        }
                                                                        size="small"
                                                                    >
                                                                        {this.columnListData.map(
                                                                            (
                                                                                v: any
                                                                            ) => (
                                                                                <a-select-option
                                                                                    value={
                                                                                        v.column_name
                                                                                    }
                                                                                >
                                                                                    {this
                                                                                        .locale ===
                                                                                    'zh-cn'
                                                                                        ? v.display_name_chn
                                                                                        : v.display_name_eng}
                                                                                </a-select-option>
                                                                            )
                                                                        )}
                                                                    </a-select>
                                                                    <a-icon
                                                                        type="delete"
                                                                        style="color:#4c4c4c;margin-left: 5%"
                                                                        onClick={e =>
                                                                            this.delFilterItem(
                                                                                e,
                                                                                index
                                                                            )
                                                                        }
                                                                    />
                                                                    <a-select
                                                                        value={
                                                                            item.secondConditionValue
                                                                        }
                                                                        placeholder={this.$t(
                                                                            'plzSelect'
                                                                        )}
                                                                        style="width: 86%;margin:8px 0"
                                                                        onChange={value =>
                                                                            this.changeSecondCondition(
                                                                                value,
                                                                                item
                                                                            )
                                                                        }
                                                                        size="small"
                                                                    >
                                                                        {item.secondConditionList.map(
                                                                            (
                                                                                v: any
                                                                            ) => (
                                                                                <a-select-option
                                                                                    value={
                                                                                        v.value
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        v.label
                                                                                    }
                                                                                </a-select-option>
                                                                            )
                                                                        )}
                                                                    </a-select>
                                                                    {item.data_type !=
                                                                        'bool' &&
                                                                    item.secondConditionValue !=
                                                                        'null' &&
                                                                    item.secondConditionValue !=
                                                                        'not null' ? (
                                                                        <div>
                                                                            {item.is_dropdown_list
                                                                                ? this.renderFilterSelect(
                                                                                      h,
                                                                                      item
                                                                                  )
                                                                                : item.data_type ===
                                                                                      'date' ||
                                                                                  item.data_type ===
                                                                                      'datetime'
                                                                                ? this.renderFilterDateTime(
                                                                                      h,
                                                                                      item
                                                                                  )
                                                                                : item.data_type ===
                                                                                      'int' ||
                                                                                  item.data_type ===
                                                                                      'float'
                                                                                ? this.renderFilterInputNumber(
                                                                                      h,
                                                                                      item
                                                                                  )
                                                                                : !item.is_dropdown_list
                                                                                ? this.renderFilterInput(
                                                                                      h,
                                                                                      item
                                                                                  )
                                                                                : ''}
                                                                        </div>
                                                                    ) : (
                                                                        ''
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <div style="text-align:center;font-weight:bold">
                                                        {this.$t('plzAdd')}
                                                    </div>
                                                )}
                                            </div>

                                            <div style="text-align: center;margin-top: 20px">
                                                <a-button
                                                    icon="plus"
                                                    size="small"
                                                    onClick={e =>
                                                        this.addFilterList(e)
                                                    }
                                                >
                                                    {this.$t('add_condition')}
                                                </a-button>
                                                <a-button
                                                    style="margin-left: 10px;"
                                                    type="primary"
                                                    size="small"
                                                    onClick={e =>
                                                        this.applyAddItem(e)
                                                    }
                                                >
                                                    {this.$t('apply')}
                                                </a-button>
                                            </div>
                                        </a-collapse-panel>
                                    </a-collapse>
                                </div>
                            ) : (
                                ''
                            )}
                        </template>
                        <a-badge count={this.calQueryBadge}>
                            <a-button icon="filter" dot={true}>
                                {this.$t('filter_conditions')}
                                <a-icon type="caret-down" />
                            </a-button>
                        </a-badge>
                    </a-popover>
                </div>
            )
        } else {
            return ''
        }
    }

    private renderFilterInput(h, item) {
        return (
            <a-input
                style="width: 86%"
                placeholder={this.$t('plzInput')}
                v-model={item.inputValue}
                size="small"
            ></a-input>
        )
    }

    private renderFilterInputNumber(h, item) {
        return (
            <a-input-number
                v-model={item.inputValue}
                style="width: 86%"
                placeholder={this.$t('plzInput')}
                size="small"
            />
        )
    }

    private renderFilterSelect(h, item) {
        return (
            <a-select
                v-model={item.selectValue}
                placeholder={this.$t('plzSelect')}
                style="width: 86%;"
                show-search
                filter-option={this.filterOption}
                size="small"
            >
                {this.$dict[item.dict_name].map(v => (
                    <a-select-option value={v.value}>
                        {this.$t(v.label)}
                    </a-select-option>
                ))}
            </a-select>
        )
    }

    private renderFilterDateTime(h, item) {
        return (
            <div>
                <a-date-picker
                    show-time
                    placeholder={this.$t('plzSelect')}
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ minWidth: item.dateWidth }}
                    v-model={item.startDateTime}
                    disabled-date={value => this.disabledStartDate(value, item)}
                    allowClear={false}
                    size="small"
                ></a-date-picker>
                {item.secondConditionValue === 'is between' ? (
                    <a-date-picker
                        show-time
                        placeholder={this.$t('plzSelect')}
                        format="YYYY-MM-DD HH:mm:ss"
                        v-model={item.endDateTime}
                        allowClear={false}
                        disabled-date={value =>
                            this.disabledEndDate(value, item)
                        }
                        style={{ minWidth: item.dateWidth, marginTop: '8px' }}
                        size="small"
                    ></a-date-picker>
                ) : (
                    ''
                )}
            </div>
        )
    }

    private filterVisible: boolean = false
    private groupVisible: boolean = false
    private favoriteVisible: boolean = false
    private customerQueryList: any = []
    private activeKey: any = []

    private get popoverStyle() {
        return {
            width: '14%'
        }
    }

    /**
     * 默认数据
     */
    private isIdList: any = [{ label: 'is', value: '=' }]
    private isBooleanList: any = [
        { label: 'is true', value: 'isTrue' },
        { label: 'is false', value: 'isFalse' }
    ]
    private isDropdownList: any = [
        { label: '=', value: '=' },
        { label: '!=', value: '!=' }
    ]
    private isNumberList: any = [
        {
            label: '>',
            value: '>'
        },
        {
            label: '=',
            value: '='
        },
        {
            label: '<',
            value: '<'
        },
        {
            label: '>=',
            value: '>='
        },
        {
            label: '<=',
            value: '<='
        },
        {
            label: '!=',
            value: '!='
        }
    ]
    private isStringList: any = [
        {
            label: 'contains', //包含
            value: 'ilike'
        },
        {
            label: "doesn't contain",
            value: 'not ilike'
        },
        {
            label: '=',
            value: '='
        },
        {
            label: '!=',
            value: '!='
        }
    ]

    private isDateList: any = [
        {
            label: '=',
            value: '='
        },
        {
            label: '!=',
            value: '!='
        },
        {
            label: '>',
            value: '>'
        },
        {
            label: '<',
            value: '<'
        },
        {
            label: '>=',
            value: '>='
        },
        {
            label: '<=',
            value: '<='
        },
        {
            label: 'is between',
            value: 'is between'
        }
    ]
    private customAddFilterList: any = [
        {
            firstConditionValue: '',
            secondConditionValue: '',
            data_type: '',
            is_dropdown_list: false,
            secondConditionList: [],
            startDateTime: moment(Date.now()),
            endDateTime: null,
            dateWidth: '86%'
        }
    ]

    private filterOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    /**
     * 日期范围约束
     */
    private disabledStartDate(startValue, item) {
        const endValue = item.endDateTime
        if (!startValue || !endValue) {
            return false
        }
        return startValue.valueOf() > endValue.valueOf()
    }

    private disabledEndDate(endValue, item) {
        const startValue = item.startDateTime
        if (!endValue || !startValue) {
            return false
        }
        return startValue.valueOf() >= endValue.valueOf()
    }

    /**
     * 计算固定条件勾选数
     */
    private get calQueryBadge() {
        let arr: any = []
        this.queryFileterSearchCondition.forEach(v => {
            if (this.checkedFilterConditions.includes(v.search_code)) {
                arr.push(v)
            }
        })
        this.customerQueryList.forEach(v => {
            v.groupArr.forEach(z => {
                if (z.checked) {
                    arr.push(z)
                }
            })
        })
        return arr.length
    }

    /**
     * 处理自定义添加项数据结构
     */
    private handleCustomerConditions(conditions) {
        let customerArr: any = []
        if (conditions.length) {
            conditions.forEach(z => {
                z.delArr = []
                z.groupArr.forEach(v => {
                    if (v.checked) {
                        z.delArr.push({
                            query_name: v.firstConditionValue || '|',
                            operate: v.secondConditionValue || '|',
                            value: v.thirdConditionValue || '|'
                        })
                    }
                })
                z.delArrLength = z.delArr.length
                for (let i = 0; i < z.delArrLength - 1; i++) {
                    z.delArr.unshift({
                        query_name: '|',
                        operate: '|',
                        value: '|'
                    })
                }
                z.delArr.forEach(j => {
                    customerArr.push(j)
                })
            })
            return customerArr
        }
    }

    /**
     * 添加临时搜索项
     */

    private setCustomItem(e, item) {
        e.stopPropagation()
        item.checked = !item.checked
        if (item.checked) {
            let arr: any = this.handleCustomerConditions(this.customerQueryList)
            this.addQueryCondition(arr, 10)
        } else {
            this.delQueryCondition(null, 10)
        }
    }

    /**
     * 添加项
     */
    private addFilterList(e) {
        e.stopPropagation()
        let list = JSON.parse(
            JSON.stringify(this.calSecondFilterList(this.columnListData[0]))
        )
        this.customAddFilterList.push({
            firstConditionValue:
                this.columnListData.length &&
                this.columnListData[0].column_name,
            secondConditionValue: list.length && list[0].value,
            secondConditionList: list,
            data_type: this.columnListData[0].data_type,
            startDateTime: moment(Date.now()),
            endDateTime: null,
            dateWidth: '86%'
        })
    }

    /**
     * 删除项
     */
    private delFilterItem(e, index) {
        e.stopPropagation()
        this.customAddFilterList.splice(index, 1)
    }

    /**
     * 改变第一个select
     */
    private changeFirstCondition(value, item) {
        if (!value) {
            return
        }
        item.firstConditionValue = value
        let obj: any = this.columnListData.find(
            v => v.column_name == item.firstConditionValue
        )
        item.data_type = obj.data_type
        item.is_dropdown_list = obj.is_dropdown_list
        item.allow_null = obj.allow_null
        item.dict_name = obj.dict_name
        item.secondConditionList = this.calSecondFilterList(item)
        if (item.secondConditionList.length) {
            item.secondConditionValue = item.secondConditionList[0].value
        }
    }

    /**
     * 获取第二个select-option
     */
    private calSecondFilterList(item) {
        let _data = {
            int: this.isNumberList,
            float: this.isNumberList,
            bool: this.isBooleanList,
            string: this.isStringList,
            date: this.isDateList,
            datetime: this.isDateList
        }
        let arr: any = []
        if (item.data_type) {
            if (
                item.firstConditionValue === 'id' ||
                item.column_name === 'id'
            ) {
                return this.isIdList
            } else {
                if (item.is_dropdown_list) {
                    arr = this.isDropdownList
                } else {
                    arr = _data[item.data_type].map(v => v)
                }
                if (item.allow_null && item.data_type !== 'bool') {
                    arr.push(
                        {
                            label: 'is no set', //未设置
                            value: 'null'
                        },
                        {
                            label: 'is set',
                            value: 'not null'
                        }
                    )
                }
                return arr
            }
        } else {
            return []
        }
    }

    /**
     * 改变第二个条件
     */
    private changeSecondCondition(value, item) {
        if (!value) {
            return
        }
        item.secondConditionValue = value
    }

    /**
     * 提交增加项
     */
    private applyAddItem(e) {
        e.stopPropagation()
        let listData: any = [] //添加的list
        let groupArr: any = [] //组list
        listData = JSON.parse(JSON.stringify(this.customAddFilterList))
        if (listData.length) {
            listData.forEach(v => {
                let obj: any = {}
                let text: string = ''
                obj = this.columnListData.find(z => {
                    return v.firstConditionValue === z.column_name
                })
                //第一个条件项name处理
                if (obj) {
                    v.firstConditionName =
                        this.locale === 'zh-cn'
                            ? obj.display_name_chn
                            : obj.display_name_eng
                }
                //第二个条件项name的处理
                if (v.secondConditionList.length) {
                    v.secondConditionName = v.secondConditionList.find(
                        (x: any) => x.value === v.secondConditionValue
                    ).label
                }
                if (v.data_type != 'bool') {
                    //第三个条件项日期及input类型name的处理
                    if (
                        (v.data_type === 'date' ||
                            v.data_type === 'datetime') &&
                        !v.is_dropdown_list
                    ) {
                        if (v.secondConditionValue === 'is between') {
                            v.thirdConditionName = `${moment(
                                v.startDateTime
                            ).format('YYYY-MM-DD HH:mm:ss')} and ${moment(
                                v.endDateTime
                            ).format('YYYY-MM-DD HH:mm:ss')}`
                            v.thirdConditionValue = `${v.startDateTime} and ${v.endDateTime}`
                        } else {
                            v.thirdConditionName = `${moment(
                                v.startDateTime
                            ).format('YYYY-MM-DD HH:mm:ss')}`
                            v.thirdConditionValue = v.startDateTime
                        }
                    } else {
                        v.thirdConditionValue = v.inputValue
                        v.thirdConditionName = v.inputValue
                    }
                    if (v.is_dropdown_list) {
                        let dropObj: any = this.$dict[v.dict_name].find(j => {
                            return j.value == v.selectValue
                        })
                        v.thirdConditionValue = v.selectValue
                        v.thirdConditionName = this.$t(dropObj.label)
                    }
                } else {
                    v.thirdConditionValue =
                        v.secondConditionName === 'isTrue' ? 'true' : 'false'
                    v.secondConditionValue = '='
                }
                text = `${v.firstConditionName} ${v.secondConditionName} ${
                    v.thirdConditionName &&
                    v.thirdConditionName != 'true' &&
                    v.thirdConditionName != 'false'
                        ? v.thirdConditionName
                        : ''
                }`
                v.name = text
                v.checked = true
                groupArr.push(v)
            })
            //调整传入后端数据结构
            if (groupArr.length > 1) {
                let groupArrLength: number = groupArr.length
                for (let i = 0; i < groupArrLength - 1; i++) {
                    groupArr.unshift({
                        query_name: '|',
                        operate: '|',
                        value: '|'
                    })
                }
                this.customerQueryList.push({
                    isGroup: true,
                    groupArr: groupArr
                })
            } else {
                this.customerQueryList.push({
                    isGroup: false,
                    groupArr: groupArr
                })
            }
            let arr: any = []
            arr = this.handleCustomerConditions(this.customerQueryList)
            this.addQueryCondition(arr, 10)
            this.resetQueryFilterDataStatus()
        }
    }

    /**
     * 重置自定义搜索数据状态
     * @private
     */
    private resetQueryFilterDataStatus() {
        this.activeKey = ['']
        this.customAddFilterList = []
        let list = JSON.parse(
            JSON.stringify(this.calSecondFilterList(this.columnListData[0]))
        )
        this.customAddFilterList.push({
            firstConditionValue:
                this.columnListData.length &&
                this.columnListData[0].column_name,
            secondConditionValue: list.length && list[0].value,
            secondConditionList: list,
            data_type: this.columnListData[0].data_type,
            startDateTime: moment(Date.now()),
            endDateTime: null,
            dateWidth: '86%'
        })
    }

    /**
     * 获取默认显示项
     */
    public renderDefaultFormItems(h) {
        return this.defaultFormItems.map((node: any, index) => (
            <a-col
                class="form-item-wrapper"
                span={
                    (node.data.attrs && node.data.attrs.span) ||
                    24 / this.column
                }
                key={`default-${index}`}
            >
                <vnodes vnodes={node} />
            </a-col>
        ))
    }

    /**
     * 扩展项渲染项
     */
    public renderExtendFromItems(h) {
        return this.extendFromItems.map((node: any, index) => (
            <a-col
                class="form-item-wrapper"
                span={24 / this.column}
                key={`extend-${index}`}
            >
                {h(node)}
            </a-col>
        ))
    }

    /**
     * 折叠项渲染项
     */
    public renderCollapseFormItems(h) {
        if (this.collapsed) {
            return ''
        } else {
            return this.collapseFormItems.map((node: any, index) => (
                <a-col
                    style={{ display: 'block' }}
                    span={
                        (node.data.attrs && node.data.attrs.span) ||
                        24 / this.column
                    }
                    key={`collapse-${index}`}
                >
                    <vnodes vnodes={node} />
                </a-col>
            ))
        }
    }

    /**
     * 侧边栏渲染项目
     */
    public renderFormSide(h) {
        return (
            <div class="form-side">
                {this.$slots.collapse && (
                    <a onClick={this.onToggle}>
                        {this.$t('more_conditions')}{' '}
                        <a-icon type={this.collapsed ? 'down' : 'up'} />
                    </a>
                )}
            </div>
        )
    }

    /**
     * 操作项渲染项
     */
    public renderFormAction(h) {
        if (this.showAction) {
            return (
                <div class="flex-row justify-content-between margin-top">
                    <div
                        class="form-button"
                        v-show={this.showSearch}
                        style="width:100%;text-align:right;"
                    >
                        <a-button
                            type="primary"
                            htmlType="submit"
                            icon="search"
                        >
                            {this.$t('search')}
                        </a-button>
                        <a-button icon="undo" onClick={this.onReset}>
                            {this.$t('reset')}
                        </a-button>
                        {this.isSwitchShowMode ? (
                            <a-button-group>
                                <a-button
                                    icon="anticon anticon-liebiao1"
                                    class="whiteButton"
                                    onClick={e => this.showModel(e, 'table')}
                                ></a-button>
                                <a-button
                                    icon="anticon anticon-tubiao-bingtu"
                                    class="whiteButton"
                                    onClick={e => this.showModel(e, 'graph')}
                                ></a-button>
                            </a-button-group>
                        ) : (
                            ''
                        )}
                        <a-dropdown
                            trigger={['click']}
                            v-model={this.moreVisible}
                            v-show={false}
                        >
                            <a-menu
                                slot="overlay"
                                onClick={({ domEvent }) =>
                                    domEvent.key === '3' &&
                                    (this.moreVisible = false)
                                }
                            >
                                {this.extends.map(item => (
                                    <a-menu-item key={item.label}>
                                        <a-checkbox
                                            onChange={e => (
                                                (item.show = e.target.checked),
                                                this.updateExtendFromItems()
                                            )}
                                        >
                                            {item.label}
                                        </a-checkbox>
                                    </a-menu-item>
                                ))}
                            </a-menu>
                            <a-button>
                                {this.$t('more')}
                                <a-icon type="down" />
                            </a-button>
                        </a-dropdown>
                    </div>
                    <div class="form-action">
                        <a-button
                            icon={this.showSearchIcon}
                            type="primary"
                            title={this.showSearchState}
                            style="min-width: 30px;"
                            onClick={this.changeShowSearch}
                        />
                        {this.$slots.action}
                    </div>
                </div>
            )
        } else {
            return (
                <div class="flex-row justify-content-between margin-top">
                    <div class="form-action">{this.$slots.action}</div>
                </div>
            )
        }
    }

    private showModel(e, type) {
        e.stopPropagation()
        this.$emit('showCurrentModel', type)
    }

    /**
     * 折叠状态切换
     */
    private onToggle() {
        this.collapsed = !this.collapsed
    }

    /**
     * 重置表单状态
     */
    private onReset() {
        this.formInstance.resetFields()
        this.resetAllConditions()
        this.$emit('reset', '')
    }

    /***
     * 清空全部搜索条件
     */
    private resetAllConditions() {
        //清空分组搜索
        this.checkedGroupbyList.splice(0, this.checkedGroupbyList.length)
        this.viewCheckedGroupByList = []
        this.customerGroupByQueryList.forEach(z => {
            z.checked = false
        })
        //清空收藏
        this.checkedUserCondition = {}
        //清空固定条件搜索
        this.customerQueryList.forEach(v => {
            v.groupArr.forEach(z => {
                z.checked = false
            })
        })
        this.allQueryConditions = []
        this.checkedFilterConditions = []
        this.fixedQueryConditionsList = []
    }

    /***
     * 清空全部搜索条件
     */
    private resetExtraConditions() {
        this.formInstance.resetFields()
        //清空分组搜索
        this.checkedGroupbyList.splice(0, this.checkedGroupbyList.length)
        this.viewCheckedGroupByList = []
        this.customerGroupByQueryList.forEach(z => {
            z.checked = false
        })
        //清空固定条件搜索
        this.customerQueryList.forEach(v => {
            v.groupArr.forEach(z => {
                z.checked = false
            })
        })
        this.allQueryConditions = []
        this.checkedFilterConditions = []
        this.fixedQueryConditionsList = []
    }

    private getMenuCode() {
        let code = ''
        let path: any = this.$route.path
        let index = path.lastIndexOf('/')
        path = path.substring(index + 1, path.length)
        if (this.pageName) {
            path = this.pageName
        }
        let menuArr: any = []

        if (this.menus) {
            const menus: any[] = this.menus.map(item => {
                let menu: any[] = []
                if (item.children && item.children.length) {
                    menu = item.children.map(x => {
                        let smenu: any[] = []
                        if (x.children && x.children.length) {
                            smenu = x.children.map(y => ({
                                name: y.name,
                                id: y.id
                            }))
                        }
                        smenu.push(x)
                        return smenu
                    })
                }
                menu.push({ name: item.name, id: item.id })

                let menuTemp: any = []
                for (let i of menu) {
                    if (i && i.id) {
                        menuTemp.push(i)
                    } else {
                        for (let k of i) {
                            menuTemp.push(k)
                        }
                    }
                }

                return menuTemp
            })
            menuArr = [].concat.apply([], menus)
        }
        let finds = menuArr.find(x => x.name === path)
        if (finds) {
            code = finds.id
        }
        this.menu_code = code
        return code
    }

    private groupbyColumns: any = []

    public getSearchList() {
        let menu_code = this.getMenuCode()
        this.systemService
            .queryUserSearchCondition(
                new RequestParams(
                    {
                        user_id: this.id,
                        menu_code: menu_code
                    },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    this.columnListData = []
                    this.queryFileterSearchCondition = []
                    this.querySearchCondition = []

                    this.groupbyList = []
                    this.checkedGroupbyList.splice(
                        0,
                        this.checkedGroupbyList.length
                    )
                    this.viewCheckedGroupByList = []

                    for (let i of data[0].search_condition) {
                        if (i.search_type == 10) {
                            this.queryFileterSearchCondition.push(i)
                            if (i.default_search) {
                                this.checkedFilterConditions.push(i.search_code)
                                let query_condition = JSON.parse(
                                    i.query_condition
                                )
                                let arr: any = this.handleFixedConditions(
                                    query_condition,
                                    10
                                )
                                this.fixedQueryConditionsList.push(...arr)
                            }
                            //排序
                            this.queryFileterSearchCondition.sort(this.sortId)
                        } else {
                            this.querySearchCondition.push(i)
                            if (i.default_search) {
                                this.checkedUserCondition = {
                                    code: i.search_code,
                                    name: i.search_display_name
                                }
                                this.resetExtraConditions()
                                let obj = this.handleFavoriteList(i)
                                this.favoriteGroupByList =
                                    obj.favoriteGroupByList
                                this.fixedQueryConditionsList.push(
                                    ...this.handleFixedConditions(
                                        obj.favoriteFixedList,
                                        20
                                    )
                                )
                            }
                            //排序
                            this.querySearchCondition.sort(this.sortId)
                        }
                    }
                    this.setQueryForm()
                    if (
                        data[0].query_name_auth != undefined &&
                        data[0].query_name_auth.length
                    ) {
                        //获取自定义搜索数据
                        this.columnListData = data[0].query_name_auth
                            .map(x => x)
                            .filter(y => y.compute_column == false)
                        //设置select默认值
                        if (this.columnListData) {
                            this.customAddFilterList[0].firstConditionValue = this.columnListData[0].column_name
                            this.customAddFilterList[0].data_type = this.columnListData[0].data_type
                            //自定义分组搜索默认值去除id项
                            let _tempArr: any = this.columnListData.filter(
                                v => v.column_name !== 'id'
                            )
                            this.customerGroupByObj.firstConditionValue =
                                _tempArr[0].column_name
                        }
                        this.customAddFilterList[0].secondConditionList = this.calSecondFilterList(
                            this.customAddFilterList[0]
                        )
                        this.customAddFilterList[0].secondConditionValue = ''
                        if (
                            this.customAddFilterList[0].secondConditionList !=
                                undefined &&
                            typeof this.customAddFilterList[0]
                                .secondConditionList == 'object' &&
                            this.customAddFilterList[0].secondConditionList
                                .length
                        ) {
                            this.customAddFilterList[0].secondConditionValue = this.customAddFilterList[0].secondConditionList[0].value
                        }

                        let groupbyColumns: any = []
                        let lies: any = data[0].query_name_auth
                            .map(x => x)
                            .filter(y => y.can_show == true)
                        lies.sort(this.compare('sort_order'))
                        let fixed_left: any[] = lies.filter(
                            x => x.fixed_type == -1
                        )
                        let fixed_center: any[] = lies.filter(
                            x => x.fixed_type == 0
                        )
                        let fixed_right: any[] = lies.filter(
                            x => x.fixed_type == 1
                        )
                        let clms: any = []
                        if (fixed_left.length) {
                            for (let i of fixed_left) {
                                clms.push(i)
                            }
                        }
                        if (fixed_center.length) {
                            for (let i of fixed_center) {
                                clms.push(i)
                            }
                        }
                        if (fixed_right.length) {
                            for (let i of fixed_right) {
                                clms.push(i)
                            }
                        }
                        let en_us: any = {}
                        let zh_cn: any = {}
                        for (let i in clms) {
                            this.columnWidthTotal +=
                                parseInt(clms[i].width) > 0
                                    ? parseInt(clms[i].width)
                                    : 100
                            this.queryNameAuth.push(clms[i])
                            this.tsData.en_us[clms[i].column_name] =
                                clms[i].display_name_eng
                            this.tsData.zh_cn[clms[i].column_name] =
                                clms[i].display_name_chn
                            if (clms[i].is_merge_column) {
                                this.tsData.en_us[clms[i].merge_column_name] =
                                    clms[i].merge_column_name_eng

                                this.tsData.zh_cn[clms[i].merge_column_name] =
                                    clms[i].merge_column_name_chn
                            }
                            if (clms[i].can_group_by) {
                                // if (clms[i].column_name == 'state') {
                                //     clms[i]['group_by_period'] = [
                                //         'year',
                                //         'month'
                                //     ]
                                // }
                                //TODO 按年，按月，按周, ...
                                if (clms[i].group_by_period) {
                                    for (let dateType of JSON.parse(
                                        clms[i].group_by_period
                                    )) {
                                        let addItem: any =
                                            clms[i].column_name + ':' + dateType
                                        this.groupbyList.push(addItem)
                                    }
                                } else {
                                    this.groupbyList.push(clms[i].column_name)
                                }
                            }

                            if (
                                clms[i].can_group_by &&
                                clms[i].default_group_by
                            ) {
                                groupbyColumns.push(clms[i])
                            }
                            let columnParams: any = {
                                key: clms[i].column_name,
                                title: this.getColumnTitle(clms[i].column_name),
                                dataIndex: clms[i].column_name,
                                width:
                                    clms[i].width != undefined &&
                                    clms[i].width.indexOf('%') !== -1
                                        ? clms[i].width
                                        : parseInt(clms[i].width),
                                sorter: clms[i].sorter,
                                align: clms[i].text_align,
                                date_type: clms[i].date_type
                            }

                            if (clms[i].exists_scoped_slot) {
                                columnParams['scopedSlots'] = {
                                    customRender:
                                        clms[i].scoped_slot_name +
                                        (clms[i].can_edit ? '_edit' : '')
                                }
                            }
                            if (
                                !clms[i].exists_scoped_slot &&
                                !clms[i].use_custom_render
                            ) {
                                columnParams['customRender'] = (
                                    value,
                                    row,
                                    index
                                ) => {
                                    if (
                                        value &&
                                        typeof value === 'object' &&
                                        value.constructor === Array &&
                                        value.length == 2
                                    ) {
                                        return value[1]
                                    }

                                    return value
                                }
                            }

                            if (clms[i].fixed_type == -1) {
                                columnParams['fixed'] = 'left'
                            }
                            if (clms[i].fixed_type == 1) {
                                columnParams['fixed'] = 'right'
                            }

                            if (clms[i].is_merge_column) {
                                let cName: any = this.getColumnTitle(
                                    clms[i].merge_column_name
                                )
                                let mergeClm: any = this.tableColumns.find(
                                    c => c.title == cName
                                )
                                if (mergeClm) {
                                    mergeClm.children.push(columnParams)
                                } else {
                                    mergeClm = {
                                        title: cName,
                                        children: [columnParams]
                                    }

                                    this.tableColumns.push(mergeClm)
                                }
                            } else {
                                this.tableColumns.push(columnParams)
                            }
                        }

                        let action_line = clms.find(
                            x => x.column_name === 'operation'
                        )

                        if (this.actions && !action_line) {
                            this.tableColumns.push({
                                key: 'operation',
                                title: this.$t('action.operation'),
                                width: 100,
                                scopedSlots: { customRender: 'operation' },
                                align: 'center'
                            })
                        }
                        if (groupbyColumns.length) {
                            //排序
                            groupbyColumns.sort(this.compare('group_by_order'))
                            this.groupbyColumns = groupbyColumns
                            for (let y of groupbyColumns) {
                                this.checkedGroupbyList.push(y.column_name)
                                this.viewCheckedGroupByList.push(y.column_name)
                            }
                        }
                    }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private compare = function(prop) {
        return function(obj1, obj2) {
            var val1 = obj1[prop]
            var val2 = obj2[prop]
            if (val1 < val2) {
                return -1
            } else if (val1 > val2) {
                return 1
            } else {
                return 0
            }
        }
    }

    private sortId(a, b) {
        return a.sort_order - b.sort_order
    }

    private getColumnTitle(columnName) {
        //TODO :year
        let suffix: any = ''
        let clmName: any = columnName
        if (columnName.includes(':')) {
            let arr = columnName.split(':')
            if (arr.length == 2) {
                clmName = arr[0]
                suffix =
                    this.locale === 'zh-cn'
                        ? this.getTranslateValue(arr[1])
                        : 'by ' + arr[1]
            }
        }
        let dict: any =
            this.locale === 'zh-cn' ? this.tsData.zh_cn : this.tsData.en_us
        let name = dict[clmName] ? dict[clmName] : ''
        return (name ? name : clmName) + (suffix ? ':' + suffix : '')
    }

    private getTranslateValue(type) {
        let ret = ''
        switch (type) {
            case 'year': {
                ret = '按年'
                break
            }
            case 'month': {
                ret = '按月'
                break
            }
            case 'day': {
                ret = '按天'
                break
            }
            case 'quarter': {
                ret = '按季'
                break
            }
            case 'week': {
                ret = '按周'
                break
            }
            default:
                break
        }
        return ret
    }

    /**
     * 获取Form表单值
     */
    public getValues() {
        return this.formInstance.fieldsStore.getAllValues()
    }

    /**
     * 设置Form表单值
     */
    public setValues(fields) {
        return this.formInstance.setFieldsValue(fields)
    }

    /**
     * 验证Form表单
     */
    public validateFields(option?) {
        return new Promise((resolve, reject) => {
            this.formInstance.validateFields(option, (err, values) => {
                if (err) {
                    reject(err)
                } else {
                    let allValues: any = values
                    if (
                        this.allQueryConditions.length ||
                        this.fixedQueryConditionsList.length
                    ) {
                        let arr: any = []
                        this.filterKey(
                            this.fixedQueryConditionsList,
                            'type'
                        ).forEach(v => {
                            if (!v.aggregate_column) {
                                arr.push(v)
                            }
                        })
                        allValues['self_conditions'] = [
                            ...this.allQueryConditions,
                            ...arr
                        ]
                    }
                    resolve(allValues)
                }
            })
        })
    }

    /**
     * 操作Form表单
     */
    public form(callback?: (form) => void) {
        if (callback) {
            return callback(this.formInstance)
        } else {
            return this.formInstance
        }
    }

    private getQueryConditionValue(key) {
        let ret: any
        switch (key) {
            case '#user_id#': {
                ret = this.id
                break
            }

            case '#today#': {
                let day = new Date()
                let endDate: any = moment(
                    this.formatDate(day),
                    'YYYY-MM-DD HH:mm'
                )
                let startDate: any = moment(
                    this.formatDate(new Date(day.getTime())),
                    'YYYY-MM-DD 00:00'
                )
                ret = [startDate, endDate]
                break
            }

            case '#yesterday#': {
                let day2 = new Date()
                let endDate2: any = moment(
                    this.formatDate(
                        new Date(day2.getTime() - 24 * 60 * 60 * 1000)
                    ),
                    'YYYY-MM-DD HH:mm'
                )
                let startDate2: any = moment(
                    this.formatDate(
                        new Date(day2.getTime() - 24 * 60 * 60 * 1000)
                    ),
                    'YYYY-MM-DD 00:00'
                )

                ret = [startDate2, endDate2]
                break
            }

            case '#bfystoday#': {
                let day2 = new Date()
                let endDate2: any = moment(
                    this.formatDate(
                        new Date(day2.getTime() - 48 * 60 * 60 * 1000)
                    ),
                    'YYYY-MM-DD HH:mm'
                )
                let startDate2: any = moment(
                    this.formatDate(
                        new Date(day2.getTime() - 48 * 60 * 60 * 1000)
                    ),
                    'YYYY-MM-DD 00:00'
                )

                ret = [startDate2, endDate2]
                break
            }

            default:
                ret = ''
        }
        return ret
    }

    private formatDate(time) {
        // 空数据处理
        if (time === null || time === undefined || time === '') {
            return ''
        }

        let y = time.getFullYear()
        let m = time.getMonth() + 1

        let d = time.getDate()
        let h = time.getHours()

        let mi = time.getMinutes()
        let s = time.getSeconds()

        m = m < 10 ? `0${m}` : m

        d = d < 10 ? `0${d}` : d
        h = h < 10 ? `0${h}` : h
        mi = mi < 10 ? `0${mi}` : mi

        s = s < 10 ? `0${s}` : s
        return `${y}-${m}-${d} 23:59`
    }
}
</script>

<style lang="less">
.customColl {
    border-bottom: none;

    .ant-collapse-arrow {
        top: 45% !important;
        left: 0 !important;
    }

    .ant-collapse-header {
        padding: 0 0 0px 20px !important;
    }

    .ant-collapse-header:focus {
        background: #eee;
    }

    .ant-collapse-content-box {
        padding: 10px 0;
    }
}

.filterItem + .filterItem {
    margin-top: 5px;
}

.data-form.component {
    .form-item-wrapper {
        max-height: 45px;
    }

    & /deep/ .ant-form-item {
        width: 100%;
        margin-right: 24px;
        margin-bottom: 24px;
    }

    .form-side {
        flex: 0 1 180px;
        text-align: left;
        padding-top: 5px;
        padding-left: 10%;
        font-size: 14px;
    }

    & /deep/ .form-button,
    & /deep/ .form-action {
        & > * {
            margin-right: 16px;
            margin-bottom: 5px;
            min-width: 100px;
        }
    }
}
</style>

<i18n>
{
    "en-us": {
        "search": "Search",
        "reset": "Reset",
        "more": "More",
        "save_search": "Save Search",
        "conditions": "Favorites",
        "filter_conditions": "Filters",
        "more_conditions": "More Search Conditions",
        "groupby": "Group By",
        "action": {
            "operation": "Action"
        },
        "plzInput": "Please Input",
        "plzSelect": "Please Select",
        "add_filter": "Add Custom Filter",
        "add_condition": "Add a condition",
        "apply": "Apply",
        "plzAdd": "Please Add!",
        "is_share": "Is Share",
        "default_query": "Default Query",
        "save": "Save",
        "name_required": "Name Required",
        "conditions_required": "Select or enter the search criteria first",
        "save_current_search": "Save current search",
        "success": "Success！"
    },
    "zh-cn": {
        "search": "查询",
        "reset": "重置",
        "more": "更多",
        "save_search": "收藏",
        "conditions": "用户收藏",
        "filter_conditions": "固定条件",
        "more_conditions": "更多搜索条件",
        "groupby": "分组条件",
        "action": {
            "operation": "操作"
        },
        "plzInput": "请输入",
        "plzSelect": "请选择",
        "add_filter": "添加自定义筛选项",
        "add_condition": "新增筛选",
        "apply": "确定",
        "plzAdd": "请添加！",
        "is_share": "是否分享",
        "default_query": "默认查询",
        "save": "保存",
        "name_required": "请输入查询名称",
        "conditions_required": "请先选择或输入查询条件",
        "save_current_search": "保存当前查询",
        "success": "成功！"
    }
}
</i18n>
