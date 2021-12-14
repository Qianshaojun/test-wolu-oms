/**
 * 空字符占位渲染
 * @param value
 */
export default function(value): any {
    if (value === null || value === undefined || value === '') {
        return '--'
    }
    return value
}