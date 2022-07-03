export const state = () => ({
    newDevices: [],
    newDevice: null,
    devices: [],
    blocked: [],
    device: null,
    types: [],
    functionalities: [],
})

export const actions = {
    getDevices({commit}) {
        return new Promise((resolve, reject) => {
            this.$axios.$get('api/devices').then((result) => {
                commit('setDevices', result.devices)
                commit('setBlocked', result.blocked)
                resolve(result)
            }).catch((err) => reject(err));
        })
    },
    getDevice({commit}, deviceId) {
        return new Promise((resolve, reject) => {
            this.$axios.$get('api/devices/' + deviceId).then((result) => {
                commit('setDevice', result.device)
                resolve(result.device)
            }).catch((err) => reject(err));
        })
    },
    getNewDevices({commit}) {
        return new Promise((resolve, reject) => {
            this.$axios.$get('api/devices/new').then((result) => {
                commit('setNewDevices', result.new_devices)
                resolve(result.new_devices)
            }).catch((err) => reject(err));
        })
    },
    getNewDevice({commit}, deviceId) {
        return new Promise((resolve, reject) => {
            this.$axios.$get('api/devices/new/' + deviceId).then((result) => {
                commit('setNewDevice', result.new_device)
                resolve(result.new_device)
            }).catch((err) => reject(err));
        })
    },
    addDevice({commit}, newDevice) {
        return new Promise((resolve, reject) => {
            this.$axios.$post('api/devices/add', newDevice).then((result) => {
                commit('addDevice', result.added);

                resolve(result.added);
            }).catch((err) => reject(err));
        });
    },
    blockDevice({dispatch}, piholeId) {
        const device = {
            pihole_device_id: piholeId,
            rules: [{service: 'block'}]
        }
        return dispatch('addDevice', device);
    },
    updateDevice({commit}, device) {
        return new Promise((resolve, reject) => {
            this.$axios.$post('api/devices/update/' + device.id, device).then((result) => {
                commit('updateDevice', result.device);
                resolve(result.device)
            }).catch((err) => reject(err));
        })
    },
    updateDevices({dispatch, state}, devices) {
        const promises = devices.map((device) => {
            return dispatch('updateDevice', device);
        })
        return Promise.all(promises);
    },
    getDeviceTypes({commit}, withFunctionalities = false){
        return new Promise((resolve, reject) => {
            this.$axios.$get('api/devices/types' + (withFunctionalities?'?include=functionalities':''))
                .then((result) => {
                    commit('setTypes', result.device_types)
                    resolve(result.device_types)
                }).catch((err) => reject(err));
        })
    },
    getDeviceTypeFunctionalities({commit}, deviceTypeId) {
        return new Promise((resolve, reject) => {
            this.$axios.$get('api/devices/types/' + deviceTypeId + '/functionalities').then((result) => {
                commit('setFunctionalities', result.functionalities)
                resolve(result.functionalities)
            }).catch((err) => reject(err));
        })
    },
    getAbstractions({commit}) {
        return new Promise((resolve, reject) => {
            this.$axios.$get('api/devices/abstractions').then((result) => {
                resolve(result.abstractions)
            }).catch((err) => reject(err));
        })
    }
}
export const mutations = {
    setDevices(state, devices) {
        state.devices = devices;
    },
    setBlocked(state, devices) {
        state.blocked = devices;
    },
    setDevice(state, device) {
        state.device = device;
    },
    addDevice(state, device) {
        if(device.rules.length && device.rules[0].service === 'block') {
            state.device = device;
            state.devices.push(device)
        } else {
            state.blocked.push(device);
        }
        const newDeviceIndex = state.newDevices.map(device => device.id).indexOf(device.pihole_device_id);
        if(newDeviceIndex !== -1) {
            state.newDevices.splice(newDeviceIndex, 1);
        }
        if(state.newDevice?.id === device.pihole_device_id) {
            state.newDevice = null;
        }
    },
    updateDevice(state, device) {
        const deviceIndex = state.devices.map(device => device.id).indexOf(device.id);
        if(deviceIndex !== -1) {
            state.devices[deviceIndex] = {
                ...state.devices[deviceIndex],
                ...device
            };
        }
        if(state.device && state.device.id === device.id) {
            state.device = {
            ...state.device,
            ...device
            };
        }
    },
    setNewDevices(state, newDevices) {
        state.newDevices = newDevices;
    },
    selectNewDevice(state, newDeviceId) {
        const newDevice = state.newDevices.find(device => device.id === newDeviceId)
        if(newDevice) {
            state.newDevice = newDevice;
        }
    },
    setNewDevice(state, newDevice) {
        state.newDevice = newDevice;
    },
    setTypes(state, types) {
        state.types = types;
    },
    setFunctionalities(state, functionalities) {
        state.functionalities = functionalities;
    }
}

