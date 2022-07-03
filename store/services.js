export const state = () => ({
    services: [],
})

export const actions = {
    _getServices({commit}) {
        return new Promise((resolve, reject) => {
            this.$axios.$get('api/services').then((result) => {
                commit('_setServices', result.services)
                resolve(result.services)
            }).catch((err) => reject(err));
        })
    }
}
export const mutations = {
    _setServices(state, services) {
        state.services = services;
    }
}

