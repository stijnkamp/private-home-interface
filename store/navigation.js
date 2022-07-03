export const state = () => ({
    header: "Dashboard",
})

export const mutations = {
    setHeader(state, header) {
        state.header = header;
    },
}

