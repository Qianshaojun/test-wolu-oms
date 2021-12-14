import { Component, Ref, Vue } from 'vue-property-decorator'
import moment from 'moment'
import DataForm from '@/shared/components/data-form.vue'

@Component
export default class handleDateMixin extends Vue {
    @Ref()
    readonly dataForm!: DataForm

    public initialDate: any = []

    private dateEnum: any = ['date', 'create_date'] //date 绑定的字段集合

    /**
     * 一天内
     * @param timeField 绑定的日期值
     */
    public fillToday(timeField: string) {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime())),
            'YYYY-MM-DD 00:00'
        )

        let values = (this as any).dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values[timeField] = this.initialDate
        ;(this as any).dataForm.setValues(values)
    }

    //昨天
    public fillYesterday(timeField: string) {
        let day = new Date()
        let endDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = (this as any).dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values[timeField] = this.initialDate
        ;(this as any).dataForm.setValues(values)
    }

    //前三天
    public fill3day(timeField: string) {
        let day = new Date()
        let endDate = moment(
            this.formatDate(new Date(day.getTime() - 48 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 48 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = (this as any).dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values[timeField] = this.initialDate
        ;(this as any).dataForm.setValues(values)
    }

    //三天内
    public fill3days(timeField: string) {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 48 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = (this as any).dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values[timeField] = this.initialDate
        ;(this as any).dataForm.setValues(values)
    }

    //七天内
    private fill7days(timeField: string) {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 168 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values[timeField] = this.initialDate
        this.dataForm.setValues(values)
    }

    //转换传入接口数据格式
    public transferDate(params) {
        let nowConditions: any[] = []
        for (let item of params.query_condition) {
            if (item.value.constructor == Array && item.operate !== 'in') {
                if (
                    item.value.length == 2 &&
                    item.value[0].constructor.name == 'Moment'
                ) {
                    let startDate: any = {}
                    for (let key in item.value[0]) {
                        startDate[key] = item.value[0][key]
                    }
                    nowConditions.push({
                        query_name: item.query_name,
                        operate: '>=',
                        value: new Date(startDate.utc())
                    })
                }
                if (
                    item.value.length == 2 &&
                    item.value[1].constructor.name == 'Moment'
                ) {
                    let endDate: any = {}
                    for (let key in item.value[1]) {
                        endDate[key] = item.value[1][key]
                    }
                    nowConditions.push({
                        query_name: item.query_name,
                        operate: '<=',
                        value: new Date(endDate.utc())
                    })
                }
            } else {
                nowConditions.push(item)
            }
        }
        return nowConditions
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
