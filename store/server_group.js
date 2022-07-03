export const state = () => ({
    serverGroup: null
})

export const actions = {
    getServerGroup({commit}, serverGroupId = 'unknown') {
        return new Promise((resolve, reject) => {
            this.$axios.$get('/api/server-groups/' + serverGroupId).then(res => {
                commit('setServerGroup', res.server_group);
            }).catch((err) => {
                reject(err);
            })
        })
    }
}
export const mutations = {
    setServerGroup(state, serverGroup) {
        console.log("Server", serverGroup)
        state.serverGroup = serverGroup;
    }
}

