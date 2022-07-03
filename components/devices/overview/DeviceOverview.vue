<template>
    <div v-if="deviceSettings.length">
        <table class="divide-y">
            <tr class="divide-x">
                <th>
                    <div class="flex flex-col justify-center items-center text-gray-700 p-4">
                        <i class="la la-2x la-bullseye"></i>
                        Data on device
                    </div>
                </th>
                <td v-for="deviceSetting in deviceSettings" :key="deviceSetting.device.id">
                    <div class="setup-line setup-line-top">
                        <div class="skeleton-box"></div>
                    </div>
                    <div class="setup-line active" :style="getLinePosition(deviceSetting, 'device')">
                        <div class="skeleton-box"></div>
                    </div>
                    <service-select-toggle :reverse-line="true" :value="true"></service-select-toggle>
                    <device-card class="cursor-pointer" @click.native="goToDevice(deviceSetting.device.id)" :device="deviceSetting.device"></device-card>
                </td>
            </tr>
            <tr class="divide-x">
                <th>
                    <div class="flex flex-col justify-center items-center text-gray-700 p-4">
                        <i class="la la-2x la-home"></i>
                        Data to other<br>
                        local device
                    </div>
                </th>
                <td v-for="deviceSetting in deviceSettings" :key="deviceSetting.device.id">
                    <div class="setup-line">
                        <div class="skeleton-box  delay-2"></div>
                    </div>
                    <div class="setup-line active" :style="getLinePosition(deviceSetting, 'local')">
                        <div class="skeleton-box"></div>
                    </div>
                    <template v-for="localDevice in deviceSetting.localDevices">
                        <service-select-toggle :value="localDevice.active" @input="toggleFunctionalities(localDevice, $event)"></service-select-toggle>
                        <local-device-card :local-device="localDevice" ref="localDeviceCards"></local-device-card>
                    </template>
                </td>
            </tr>
            <tr class="divide-x">
                <th>
                    <div class="flex flex-col justify-center items-center text-gray-700 p-4">
                        <i class="la la-2x la-cloud"></i>
                        Data to cloud
                    </div>
                </th>
                <td v-for="deviceSetting in deviceSettings" :key="deviceSetting.device.id">
                    <div class="setup-line active" :style="getLinePosition(deviceSetting, 'cloud')">
                        <div class="skeleton-box delay-4"></div>
                    </div>
                    <div>
                        <div class="server-group-card" v-for="serverGroup in deviceSetting.serverGroups" :key="serverGroup.id" ref="serverGroupCards">
                            <div class="setup-line" v-if="!serverGroup.active">
                                <div class="skeleton-box delay-4"></div>
                            </div>
                            <service-select-toggle :value="serverGroup.active" @input="toggleFunctionalities(serverGroup, $event)"></service-select-toggle>
                            <server-group-card v-bind:server-group="{...serverGroup}" ></server-group-card>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import FunctionalityCard from "@/components/devices/setup/FunctionalityCard";
import {parseDevices} from "@/components/devices/overview/helpers/parseDevices";
import ServerGroupCard from "@/components/devices/overview/ServerGroupCard";
import LocalDeviceCard from "@/components/devices/overview/LocalDeviceCard";
import DeviceCard from "@/components/devices/overview/DeviceCard";
import ServiceSelectToggle from "@/components/devices/overview/ServiceSelectToggle";
import {cloneDeep} from 'lodash';
import ServerGroupDetail from "@/components/devices/ServerGroupDetail";
export default {
    name: "DeviceOverview",
    components: {ServerGroupDetail, ServiceSelectToggle, DeviceCard, LocalDeviceCard, ServerGroupCard, FunctionalityCard},
    data(){
        return {
            linePositions: {}
        }
    },
    watch: {
        rawDevices: {
            handler(newVal, prevVal){
                if(prevVal && prevVal.length) {
                    console.log(prevVal);
                    const changedDevices = [];
                    newVal.forEach((device, index) => {
                        const oldDevice = prevVal.find(d => d.id === device.id);
                        if(!oldDevice) {
                            changedDevices.push(device);
                        } else {
                            const oldFunctionalities = oldDevice.functionalities.map(functionality => functionality.id);
                            const newFunctionalities = device.functionalities.map(functionality => functionality.id);
                            if(JSON.stringify(oldFunctionalities) !== JSON.stringify(newFunctionalities)) {
                               changedDevices.push(device);
                            }
                        }

                    })
                    if(changedDevices.length > 0) {
                        this.saveDevices(changedDevices);
                    }
                }
            },
            deep: true
        },
        deviceSettings: {
            handler() {
                this.setLinePositions();

            },
            deep: true
        },
    },
    computed: {
        ...mapState({
            rawDevices: state => state.devices.devices,
            deviceTypes: state => state.devices.types
        }),
        deviceSettings(){
            if(this.rawDevices.length === 0 || this.deviceTypes.length === 0) {
                return [];
            }
            return parseDevices(this.rawDevices, this.deviceTypes);
        }
    },
    mounted() {
        window.addEventListener('resize', this.setLinePositions);
        this.$store.dispatch('devices/getAbstractions');
    },
    destroyed() {
        window.removeEventListener('resize', this.setLinePositions);
    },
    methods: {
        ...mapMutations('devices', [
            'setDevices'
        ]),
        showDevice(device){
            this.$router.push('/devices/' + device.id);
        },
        blockDevice(device) {
            this.$store.dispatch('devices/blockDevice', device.pihole_device_id);
        },
        toggleFunctionalities(dependency, active) {
            const devices = cloneDeep(this.rawDevices)
            const functionalities = [];
            const functionalityIds = [];
            dependency.services.forEach((service) => {
                if(!functionalityIds.includes(service.functionality.id)) {
                    functionalities.push(service.functionality);
                    functionalityIds.push(service.functionality.id)
                }
            })
            const device = devices.find(device => device.id === dependency.device.id);
            if(active) {
                const existingFunctionalities = device.functionalities.map(functionality => functionality.id);
                functionalities.forEach(functionality => {
                    if(!existingFunctionalities.includes(functionality.id)) {
                        device.functionalities.push(functionality);
                    }
                })
            } else {
                device.functionalities = device.functionalities.filter(functionality => {
                    return !functionalityIds.includes(functionality.id);
                })
            }
            this.setDevices(devices);
        },
        getLinePosition(deviceSetting, position) {
          if(this.linePositions.hasOwnProperty(deviceSetting.device.id)) {
              return this.linePositions[deviceSetting.device.id][position];
          }
          return {}
        },
        setLinePositions() {
            const defaultPositions = {
                device: {height: 0},
                local: {height: 0},
                cloud: {height: 0},
            };
            this.$nextTick(() => {
                if(!this.deviceSettings) {
                    return
                }
                this.deviceSettings.forEach(deviceSetting => {
                    const hasSomeLocal = deviceSetting.localDevices.some(localDevice => localDevice.active)
                    const hasSomeCloud = deviceSetting.serverGroups.some(serverGroup => serverGroup.active)
                    let positions = JSON.parse(JSON.stringify(defaultPositions))
                    //set device line
                    if (hasSomeLocal || hasSomeCloud) {
                        positions.device = {
                            top: '50%',
                            bottom: '-1px'
                        }
                    }
                    //set local line
                    if (hasSomeCloud) {
                        positions.local = {
                            top: 0,
                            bottom: '-1px'
                        }
                    } else if (hasSomeLocal) {
                        let lastActiveIndex = 0;
                        deviceSetting.localDevices.forEach((localDevice, index) => {
                            if (localDevice.active) {
                                lastActiveIndex = index;
                            }
                        })
                        const lastElement = this.$refs.localDeviceCards[lastActiveIndex].$el;
                        if(lastElement) {
                            const parentElement = lastElement.parentElement;
                            const bottom = parentElement.clientHeight - lastElement.offsetTop - lastElement.clientHeight / 2
                            positions.local = {
                                top: 0,
                                bottom: bottom + 'px'
                            }
                        }
                    }
                    //set cloud line
                    if (hasSomeCloud) {
                        let lastActiveIndex = 0;
                        deviceSetting.serverGroups.forEach((serverGroup, index) => {
                            if (serverGroup.active) {
                                lastActiveIndex = index;
                            }
                        })
                        const lastElement = this.$refs.serverGroupCards[lastActiveIndex];
                        if(lastElement) {
                            const parentElement = lastElement.parentElement.parentElement;
                            const bottom = parentElement.clientHeight - lastElement.offsetTop - lastElement.clientHeight / 2
                            positions.cloud = {
                                top: 0,
                                bottom: bottom + 'px'
                            }
                        }
                    }
                    this.linePositions[deviceSetting.device.id] = positions;
                    this.$forceUpdate();
                })
            })
        },
        goToDevice(deviceId) {
            this.$router.push('/devices/' + deviceId);
        },
        saveDevices(devices){
            //Only save functionalities for a device
            const deviceData = devices.map(device => {
                return {
                    id: device.id,
                    functionalities: device.functionalities.map((functionality) => {
                        return {
                            id: functionality.id
                        }
                    })
                }
            });
            this.$store.dispatch('devices/updateDevices', deviceData).then(() => {
                this.$toast.add({severity: 'success', summary: 'Updated', life: 2000})
            })
        }
    },

}
</script>
<style scoped lang="scss">
    table {
        th {
            position: sticky;
            background: #ffffff;
            left: 0;
            z-index: 1;
            min-width: 120px
        }
        td {
            @apply p-3 bg-white;
            padding-left: 50px;
            position: relative;
        }
        .setup-line {
            @apply bg-gray-100;
            position: absolute;
            top: 0;
            left: 22px;
            bottom : -1px;
            width: 6px;
            &-top {
                top: 50%;
            }
            &-bottom {
                bottom: 50%;
            }
            &.active {
                background: var(--primary-color);
            }
        }
        .server-group-card {
            &:last-child .setup-line {
                bottom: 50%;
            }
        }
    }

</style>
