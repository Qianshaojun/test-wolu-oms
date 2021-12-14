export default {
    namespaced: true,
    state: {
        users: []
    },
    mutations: {
        changeUsers(state, data) {
            state.users = data
        }
    }
}
