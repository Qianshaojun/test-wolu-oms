export default {
    namespaced: true,
    state: {
        sellers: []
    },
    mutations: {
        changeSellers(state, data) {
            state.sellers = data
        }
    }
}
