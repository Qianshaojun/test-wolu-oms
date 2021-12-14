import { parse } from 'uuidjs'

// import * as dictData from '@/config/dict.config'
// import store from '~/store'

/**
 * 字典转换
 * @param value
 * @param list list数据
 */
export default function(value, list): string {
    try {
        // let code = value
        // if (Number(value) + '' !== NaN + '') {
        //     code = parseInt(value) ? parseInt(value) : value
        // }
        let code = value ? value : ''
        const { name } = list.find(x => x.code == code || x.id == code)
        return name
    } catch (ex) {
        return value
    }
}
