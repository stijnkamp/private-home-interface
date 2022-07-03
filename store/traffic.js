import moment from 'moment'
import {cloneDeep} from "lodash";
export const state = () => ({
    mappedTraffic: null,
    allTraffic: [],
    devices: [],
    servers: [],
    filter: {},
    filterOptions: {
        serverGroups: [],
        locations: [],
        companies: [],
    }

})

export const actions = {
    getTrafficData({commit}, filter = {}) {
        return new Promise((resolve, reject) => {
            filter = cloneDeep(filter)
            filter.group_by = filter.group_by??'src'
            this.$axios.$post('/api/traffic', filter).then(res => {
                commit('setAllTraffic', res.traffic);
                console.log(res);
                const mappedTraffic = this.$parsers.mapTraffic(res, filter.group_by);
                commit('setMappedTraffic', mappedTraffic);
                resolve(mappedTraffic);
            }).catch((err) => {
                reject(err);
            })
        })
    },
    getFilters({commit}){
        return new Promise((resolve, reject) => {
            this.$axios.$get('/api/traffic/filters',).then(res => {
                const options = {
                    serverGroups: res.server_groups,
                    locations: res.locations.map(location => location.country).filter(location=>location!==null),
                    companies: res.companies
                }
                commit('setFilterOptions', options);
            }).catch((err) => {
                reject(err);
            })
        })
    }
}
export const mutations = {
    setMappedTraffic(state, traffic) {
        state.mappedTraffic = traffic;
    },
    setAllTraffic(state, traffic) {
        state.allTraffic = traffic;
    },
    setDevices(state, devices) {
        state.devices = devices;
    },
    setServers(state, servers) {
        state.servers = servers;
    },
    setFilterOptions(state, options) {
        state.filterOptions = options;
    }
}

