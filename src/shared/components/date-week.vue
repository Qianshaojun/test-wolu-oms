<template>
    <div :id="id">
        <a-input
            read-only
            :placeholder="$t('selectWeek')"
            size="small"
            @click="showPickWeek"
            v-model="weekDate"
        >
            <a-icon type="calendar" slot="suffix" />
        </a-input>
        <a-card v-show="showWeek" size="small" class=" pickDateDia">
            <template slot="title">
                <a
                    class="anticon anticon-zuoshuangjiantou"
                    @click="prev"
                    style="width:15%;cursor: pointer"
                ></a>
                <span
                    style="text-align: center;display: inline-block;width: 70%"
                >
                    {{ year }}{{ $t('year') }}
                </span>
                <a
                    class="anticon anticon-youshuangjiantou"
                    @click="next"
                    style="width:15%;cursor: pointer"
                ></a>
            </template>
            <a-select
                size="small"
                :value="week ? week : undefined"
                :dropdownStyle="{ zIndex: 10000 }"
                :placeholder="$t('selectWeek')"
                @change="changeWeek"
            >
                <a-select-option
                    v-for="(item, index) in weekList"
                    :key="index"
                    :value="item"
                >
                    {{ `Week${item}` }}
                </a-select-option>
            </a-select>
        </a-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Page } from '@/core/decorators'

@Page({
    layout: 'workspace',
    name: 'date-week'
})
@Component({
    components: {}
})
export default class dateWeek extends Vue {
    @Prop()
    id: any
    @Prop()
    weekDateField: any
    private showWeek: boolean = false
    private weekDate: string = ''
    private year: any = new Date().getFullYear()
    private week: any = ''

    // private weekList: number[] = []
    @Watch('weekDateField')
    handleWeekDateField(val) {
        this.weekDate = val
    }

    private mounted() {
        document.addEventListener('click', (e: any) => {
            let box = document.querySelector('#' + this.id) as HTMLElement
            if (box && !box.contains(e.target)) {
                this.showWeek = false
            }
        })
    }

    private showPickWeek() {
        this.showWeek = true
    }

    private prev() {
        this.year = this.year * 1 - 1
    }

    private next() {
        this.year = this.year * 1 + 1
    }

    private get weekList() {
        let week: number = this.getDate(this.year)
        let arr: number[] = []
        for (let i = 1; i < week; i++) {
            arr.push(i)
        }
        return arr
    }

    private changeWeek(val) {
        if (!val) return
        this.week = val
        // this.weekDate = `${this.year}年第${val}周`
        this.$emit('getWeekDate', `${this.year}-${val < 10 ? '0' + val : val}`)
    }

    /**
     * 获取某一年有多少周
     */
    private getDate(year) {
        let allYears: number = 0
        // 一年第一天是周几
        let first: number = new Date(year, 0, 1).getDay()
        // 计算一年有多少天
        if (
            (year % 4 == 0 && year % 100 != 0) ||
            (year % 100 == 0 && year % 400 == 0)
        ) {
            allYears = 366
        } else {
            allYears = 365
        }
        // 计算一年有多少周
        let week = Math.floor((allYears + first) / 7)
        if ((allYears + first) % 7 != 0) {
            week += 1
        }
        return week
    }

    private destroyed() {}
}
</script>

<style scoped>
.pickDateDia {
    width: 300px;
    padding: 10px 0;
    position: absolute;
    z-index: 9999;
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
}
</style>
<i18n>
{
    "en-us": {
        "year": "Year",
        "week": "Week",
        "selectWeek": "Please Select Week"
    },
    "zh-cn": {
        "year": "年",
        "week": "周",
        "selectWeek": "请选择周"
    }
}
</i18n>
