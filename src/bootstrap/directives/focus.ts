export default store => {
    /**
     * v-focus input自动焦点
     */
    return (el, binding, vnode) => {
        const able = binding.value
        if (able) {
            el.focus()
        } else {
            return
        }
    }
}
