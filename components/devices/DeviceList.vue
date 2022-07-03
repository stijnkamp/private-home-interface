<template>
    <div class="bg-white shadow overflow-hidden sm:rounded-md" v-if="devices.length">
        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 items-center flex">
            <i class="la la-2x la-laptop text-blue-400"></i>
            <h3 class="text-lg leading-6 font-medium text-gray-900 ml-2">Devices</h3>
        </div>
        <ul role="list" class="divide-y divide-gray-200 overflow-auto new-device-list">
            <li class="block hover:bg-gray-50" v-for="device in devices" :key="device.id">
                <div class="px-4 py-4 flex items-center sm:px-6">
                    <div class="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                        <div class="truncate">
                            <div class="flex text-sm">
                                <p class="font-medium text-blue-600 truncate">{{ device.name ? device.name : 'Unknown name' }}</p>
                                <p class="ml-1 flex-shrink-0 font-normal text-gray-500">{{ device.pihole_device.macVendor ? device.macVendor : '' }}</p>
                            </div>
                            <div class="mt-2 flex">
                                <div class="flex items-center text-sm text-gray-500">
                                    <!-- Heroicon name: solid/calendar -->
                                    <i class="la la-lg la-clock mr-2"></i>
                                    <p>
                                        First seen {{device.pihole_device.firstSeen | formatDate('LLL')}}<br>
                                        Last active {{device.pihole_device.lastQuery | formatDate('fromNow')}} ago
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ml-5 flex-shrink-0 flex flex-col">
                        <!-- Heroicon name: solid/chevron-right -->
                        <div @click="showDevice(device)" class="flex justify-between items-center px-4 py-2 rounded-full text-xs font-medium bg-green-100 text-green-800 cursor-pointer">
                            <i class="la la-lg la-eye mr-2"></i>
                            Show
                        </div>
                        <div @click="blockDevice()" class="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-2 cursor-pointer">
                            <i class="la la-lg la-ban mr-2"></i>
                            Block
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "DeviceList",
    data(){
        return {
            interval: null,
        }
    },
    computed: {
        ...mapState({
            devices: state => state.devices.devices
        })
    },
    methods: {
        showDevice(device){
            this.$router.push('/devices/' + device.id);
        },
        blockDevice(device) {
            this.$store.dispatch('devices/blockDevice', device.pihole_device_id);
        }
    }
}
</script>
