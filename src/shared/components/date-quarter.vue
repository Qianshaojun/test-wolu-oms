<template>
    <div :id="id">
        <a-input
            read-only
            :placeholder="placeholder"
            size="small"
            @click="showPickDate"
            v-model="quarterDate"
        >
            <a-icon type="calendar" slot="suffix" />
        </a-input>
        <a-card v-show="showQuarter" size="small" class="pickDateDia">
            <template slot="title">
                <a
                    :class="[
                        'anticon',
                        'anticon-zuoshuangjiantou',
                        isStartDisabledDate ? 'is-disabled' : ''
                    ]"
                    @click="prev"
                    ref="prev"
                    style="width:15%;cursor: pointer"
                ></a>
                <span
                    style="text-align: center;display: inline-block;width: 70%"
                >
                    {{ year }}{{ $t('year') }}
                </span>
                <a
                    :class="[
                        'anticon',
                        'anticon-youshuangjiantou',
                        isEndDisabledDate ? 'is-disabled' : ''
                    ]"
                    @click="next"
                    ref="next"
                    style="width:15%;cursor: pointer;"
                ></a>
            </template>
            <div style="text-align: center">
                <span
                    :class="[
                        'quarterItem',
                        isQuarter1Disabled ? 'is-disabled' : ''
                    ]"
                    @click="selectQuarter(1)"
                    >{{ $t('quarter1') }}</span
                >
                <span
                    :class="[
                        'quarterItem',
                        isQuarter2Disabled ? 'is-disabled' : ''
                    ]"
                    @click="selectQuarter(2)"
                    >{{ $t('quarter2') }}</span
                >
                <span
                    :class="[
                        'quarterItem',
                        isQuarter3Disabled ? 'is-disabled' : ''
                    ]"
                    @click="selectQuarter(3)"
                    >{{ $t('quarter3') }}</span
                >
                <span
                    :class="[
                        'quarterItem',
                        isQuarter4Disabled ? 'is-disabled' : ''
                    ]"
                    @click="selectQuarter(4)"
                    >{{ $t('quarter4') }}</span
                >
            </div>
        </a-card>
    </div>
</template>

<script lang="ts">
/**
 * 按季度选择日期组件
 */
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Page } from '@/core/decorators'

@Page({
    layout: 'workspace',
    name: 'date-quarter'
})
@Component({
    components: {}
})
export default class dateQuarter extends Vue {
    @Prop()
    openQuarter: any
    @Prop()
    id: any
    @Prop({ default: '请选择日期' })
    placeholder: any
    @Prop()
    disabledStartValue: any //禁止选择该日期之前的日期
    @Prop()
    disabledEndValue: any //禁止选择该日期之后的日期
    @Prop()
    quarterDateField: any

    @Watch('quarterDateField')
    handleWeekDateField(val) {
        this.quarterDate = val
    }

    private isStartDisabledDate: boolean = false
    private isEndDisabledDate: boolean = false
    private isQuarter1Disabled: boolean = false
    private isQuarter2Disabled: boolean = false
    private isQuarter3Disabled: boolean = false
    private isQuarter4Disabled: boolean = false

    private showQuarter: boolean = false

    private year: any = new Date().getFullYear()

    private startYear: any = ''
    private startQuarter: any = ''
    private endYear: any = ''
    private endQuarter: any = ''

    private quarterDate: any = ''

    private mounted() {
        document.addEventListener('click', (e: any) => {
            let box = document.querySelector('#' + this.id) as HTMLElement
            if (box && !box.contains(e.target)) {
                this.showQuarter = false
            }
        })
    }

    private showPickDate() {
        this.showQuarter = !this.showQuarter
    }

    private prev() {
        this.year = this.year * 1 - 1
    }

    private next() {
        this.year = this.year * 1 + 1
    }

    private selectQuarter(i) {
        this.quarterDate = `${this.year}年${i}季度`
        this.showQuarter = false
        this.$emit('getQuarterDate', `${this.year}-0${i}`)
    }

    @Watch('disabledStartValue')
    handleDisabledStartValue(val) {
        if (val) {
            let year = val.split('-')[0]
            let quarter = val.split('-')[1]
            //记录开始日期的初始年份及季度
            this.startYear = year
            this.startQuarter = quarter
            //设置结束日期的初始年份
            this.year = year
            //禁止点击开始日期之前的年份
            this.isStartDisabledDate = true
        }
    }

    @Watch('disabledEndValue')
    handleDisabledEndValue(val) {
        if (val) {
            let year = val.split('-')[0]
            let quarter = val.split('-')[1]
            //记录结束日期的初始年份及季度
            this.endYear = year
            this.endQuarter = quarter
            //设置开始日期的初始年份
            this.year = year
            //禁止点击结束日期之后的年份
            this.isEndDisabledDate = true
        }
    }

    @Watch('year')
    handleYear(val) {
        if (this.startYear == val) {
            this.isStartDisabledDate = true
            if (Number(this.startQuarter) === 2) {
                this.isQuarter1Disabled = true
            }
            if (Number(this.startQuarter) === 3) {
                this.isQuarter1Disabled = true
                this.isQuarter2Disabled = true
            }
            if (Number(this.startQuarter) === 4) {
                this.isQuarter1Disabled = true
                this.isQuarter2Disabled = true
                this.isQuarter3Disabled = true
            }
        } else if (this.endYear == val) {
            this.isEndDisabledDate = true
            if (Number(this.endQuarter) === 1) {
                this.isQuarter2Disabled = true
                this.isQuarter3Disabled = true
                this.isQuarter4Disabled = true
            }
            if (Number(this.endQuarter) === 2) {
                this.isQuarter3Disabled = true
                this.isQuarter4Disabled = true
            }
            if (Number(this.endQuarter) === 3) {
                this.isQuarter4Disabled = true
            }
        } else {
            this.isQuarter1Disabled = false
            this.isQuarter2Disabled = false
            this.isQuarter3Disabled = false
            this.isQuarter4Disabled = false
            this.isStartDisabledDate = false
        }
    }
}
</script>

<style scoped>
.quarterItem {
    cursor: pointer;
}

.quarterItem + .quarterItem {
    margin-left: 8px;
}

.quarterItem:hover {
    color: #40a9ff;
}

.pickDateDia {
    width: 300px;
    padding: 10px 0;
    position: absolute;
    z-index: 9999;
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
}

.is-disabled {
    color: #80808061;
    pointer-events: none;
}
</style>

<i18n>
{
    "en-us": {
        "year": "Year",
        "selectDate": "Please Select Date",
        "quarter1": "Quarter 1",
        "quarter2": "Quarter 2",
        "quarter3": "Quarter 3",
        "quarter4": "Quarter 4"
    },
    "zh-cn": {
        "year": "年",
        "selectDate": "请选择日期",
        "quarter1": "第一季度",
        "quarter2": "第二季度",
        "quarter3": "第三季度",
        "quarter4": "第四季度"
    }
}
</i18n>
