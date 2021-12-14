import { ILayoutOption } from '../interfaces/page-option.interface'
import { VueClass } from 'vue-class-component/lib/declarations'

/**
 * 设置布局
 * @param target
 */
export function Layout(option: ILayoutOption) {
    return function(target) {
        Object.defineProperty(target, '$name', {
            writable: false,
            value: option.name
        })

        return target
    }
}
