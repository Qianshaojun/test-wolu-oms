import { IPageOption } from '../interfaces/page-option.interface'
import { VueClass } from 'vue-class-component/lib/declarations'

/**
 * 设置布局
 * @param target
 */
export function Page(option: IPageOption) {
    return function(target) {
        target['options'].name = option.name

        Object.defineProperty(target, '$layout', {
            writable: false,
            value: option.layout || 'default'
        })

        Object.defineProperty(target, '$name', {
            writable: false,
            value: option.name
        })

        return target
    }
}
