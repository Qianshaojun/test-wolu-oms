/**
 * 获取字符串中小括号里面的字符
 * @param str
 */
export default function(str): string {
    let result = ''
    if (str === null || str === undefined || str === '') {
        return result
    }
    let regex = /\((.+?)\)/g
    let options = str.match(regex)
    if (options && options.length) {
        let option = options[0]
        if (option !== null || option !== undefined || option !== '') {
            result = option.substring(1, option.length - 1)
        }
    }
    return result
}
