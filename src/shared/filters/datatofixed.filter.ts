/**
 * 四舍五入数字
 * @param date
 * @param num 默认值 保留两位小数
 */
export default function(date, num = 2): string {
    // 空数据处理
    if (date === null || date === undefined || date === '') {
        return ''
    }

    // 如果是字符串格式转化为数字
    if (typeof date === 'string') {
        date = parseInt(date)
    }

    return date.toFixed(num)
}
