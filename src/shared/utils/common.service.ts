import appConfig from '~/config/app.config'
import store from '~/store'
import UUID from 'uuidjs'
import router from '../../router'
import moment from 'moment'

/**
 * 公共函数
 */
export class CommonService {
    public static createQueryCondition(values, operations) {
        let self_conditions: any = ''
        if (values && values.self_conditions) {
            self_conditions = values.self_conditions
            delete values.self_conditions
        }
        const defaultOperation = '='
        const conditions: any[] = []

        //去除values有多选项并且多选项中有''值
        for (let i in values) {
            if (Array.isArray(values[i]) && values[i].length) {
                values[i] = values[i].filter(v => v !== '')
            }
        }
        const data = values ? Object.entries(values) : []

        if (data.length) {
            data.filter(
                ([key, value]) =>
                    value !== null && value !== undefined && value !== ''
            ).forEach(([key, value]) => {
                if (typeof value == 'string') {
                    value = value.replace(/(^\s*)|(\s*$)/g, '')
                }
                let operate =
                    key in operations ? operations[key] : defaultOperation

                if (
                    operate.slice(0, 6) == 'in_or_' &&
                    operate.indexOf('like') == -1
                ) {
                    let value2: any = value
                    if (value2.indexOf(',') != -1) {
                        value = value2.split(',')
                        operate = 'in'
                    } else {
                        let new_operate = operate.replace('in_or_', '')
                        operate = new_operate
                    }
                }
                if (operate === 'null') {
                    value = ''
                }

                if (typeof value == 'object') {
                    let vl: any = value
                    if (vl.length == 0) {
                        return
                    }
                }

                conditions.push({
                    query_name: key,
                    operate,
                    value
                })
            })

            if (self_conditions) {
                for (var item of self_conditions) {
                    conditions.push(item)
                }
            }

            return {
                query_condition: conditions
            }
        }
    }

    public static dateToLocal(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
        if (date === null || date === undefined || date === '') {
            return ''
        }

        // 如果是时间戳则转化为时间
        if (typeof date === 'number') {
            date = new Date(date)
        }

        date = new Date(Date.parse(date.replace(/-/g, '/')))

        let utc = Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        )

        date = new Date(utc)

        const o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            S: date.getMilliseconds() // 毫秒
        }

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(2, 2))
        }

        for (const k in o) {
            // tslint:disable-next-line:max-line-length
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1
                        ? o[k]
                        : ('00' + o[k]).substr(('' + o[k]).length)
                )
            }
        }
        return '20' + fmt
    }

    public static getMenuCode(name: any = '') {
        let code = ''
        if (!name) {
            name = router.currentRoute.name
        }
        let state: any = store.state
        let menu_dict = state.userModule.menu_dict
        code = menu_dict[name]
        return code
    }

    public static exportData(url, params) {
        let arr: any = []
        if (params) {
            for (let i in params) {
                let value = params[i]
                if (typeof value !== 'number' && typeof value !== 'string') {
                    value = encodeURIComponent(JSON.stringify(value))
                }
                arr.push(i + '=' + value)
            }
        }

        let hUrl = appConfig.server + url + '?' + arr.join('&')

        window.open(hUrl, '_blank')
    }

    public static getSummaryData(data, summarys) {
        let ret: any = {}
        if (data.length) {
            for (let i of summarys) {
                let sum: any = 0
                sum = data.reduce((total, item) => {
                    return total + (item.id != 'summary' ? item[i] * 1000 : 0)
                }, 0)
                ret[i] = sum / 1000
            }
        }

        return ret
    }

    /**
     *  form表单数据保留新值 去除旧值
     */
    public static diffFormData(
        oldVal: object,
        newVal: object,
        componentName: string
    ) {
        let diffData: object = {} //差异对象
        let oldData = { ...oldVal } //原始值
        for (let i in oldData) {
            if (oldData[i] !== newVal[i]) {
                diffData[i] = newVal[i]
            }
        }
        //去除value为undefined的key
        for (let k in diffData) {
            if (typeof diffData[k] === 'undefined') {
                delete diffData[k]
            }
        }
        return diffData
    }

    //根据年份和第几周反推起止日期
    public static getStartEndDayByWeek(year, week) {
        if (year == null || year == '' || week == null || week == '') {
            return
        }
        let d = new Date(year, 0, 1)
        while (d.getDay() != 1) {
            d.setDate(d.getDate() + 1)
        }
        let to = new Date(year + 1, 0, 1)
        let i = 1
        let arr: any = []
        for (let from = d; from < to; ) {
            if (i == week) {
                let startDay =
                    from.getFullYear() +
                    '-' +
                    (from.getMonth() + 1) +
                    '-' +
                    from.getDate()
                arr.push(moment(startDay).format('YYYY-MM-DD'))
            }
            let j = 6
            while (j > 0) {
                from.setDate(from.getDate() + 1)
                if (i == week && j == 1) {
                    let endDay =
                        from.getFullYear() +
                        '-' +
                        (from.getMonth() + 1) +
                        '-' +
                        from.getDate()
                    arr.push(moment(endDay).format('YYYY-MM-DD'))
                }
                j--
            }
            if (i == week) {
                return arr
            }
            from.setDate(from.getDate() + 1)
            i++
        }
    }

    //根据年份反推起止日期
    public static getStartEndDayByYear(year) {
        if (year == null || year == '') {
            return
        }
        let arr: any = []

        let start: any = year + '-01-01'
        let end: any = year + '-12-31'
        arr.push(start, end)

        return arr
    }

    //根据季节反推起止日期
    public static getStartEndDayByQuarter(year, quarter) {
        if (year == null || year == '' || quarter == null || quarter == '') {
            return
        }
        let arr: any = []
        let qt = parseInt(quarter)
        if (![1, 2, 3, 4].includes(qt)) {
            return
        }

        let start: any = ''
        let end: any = ''
        if (qt == 1) {
            start = year + '-01-01'
            end = year + '-03-31'
        } else if (qt == 2) {
            start = year + '-04-01'
            end = year + '-06-30'
        } else if (qt == 3) {
            start = year + '-07-01'
            end = year + '-09-30'
        } else if (qt == 4) {
            start = year + '-10-01'
            end = year + '-12-31'
        }

        arr.push(start, end)

        return arr
    }

    //根据月份反推起止日期
    public static getStartEndDayByMonth(year, month) {
        if (year == null || year == '' || month == null || month == '') {
            return
        }
        let m = parseInt(month)
        if (m < 1 || m > 12) {
            return
        }
        let arr: any = []

        let endDay: any = 30
        if ([1, 3, 5, 7, 8, 10, 12].includes(m)) {
            endDay = 31
        }
        if (m == 2) {
            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                endDay = 29
            } else {
                endDay = 28
            }
        }

        let start: any = moment(year + '-' + m + '-01').format('YYYY-MM-DD')
        let end: any = moment(year + '-' + m + '-' + endDay).format(
            'YYYY-MM-DD'
        )
        arr.push(start, end)

        return arr
    }
}
