<template>
    <div v-if="device">
        <header>
            <div class="py-4 flex justify-between">
                <h1 class="text-3xl font-bold leading-tight text-gray-900">{{device.name}}</h1>
                <badge @click.native="blockDevice(device)" icon="ban" color="red">Block device</badge>
            </div>
        </header>
        <traffic-chart :filter="{devices: [device.id], group_by: 'dst'}"></traffic-chart>
        <div class="space-y-8 divide-y divide-gray-200 mt-4">
            <div class="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div>
                    <div>
                        <h3 class="text-lg leading-6 font-medium text-gray-900">Edit device</h3>
                    </div>
                    <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="device-name" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> Name </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <p-input-text class="w-full" id="device-name" v-model="device.name"></p-input-text>
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="device-type" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> Device Type </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <multiselect @change="retrieveFunctionalities()" id="device-type" v-model="device.device_type"  :options="deviceTypes" track-by="id" label="name"></multiselect>
                            </div>
                        </div>

                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> Functionalities </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <functionality-card :functionality="functionality" v-model="deviceFunctionalities" v-for="functionality in functionalities" :key="functionality.id"></functionality-card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pt-5">
                <div class="flex justify-end">
                    <button @click="$router.back()" type="button" class="bg-white mr-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Cancel</button>
                    <p-button  @click="saveDevice()" label="Test">Save</p-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";
import Multiselect from 'vue-multiselect'
import FunctionalityCard from "@/components/devices/setup/FunctionalityCard";
import TrafficChart from "@/components/traffic/TrafficChart";
import Badge from "@/components/general/Badge";

export default {
    name: "DeviceDetail",
    components: {TrafficChart, FunctionalityCard, Multiselect, Badge},
    props: {
        forDevice: {
            default: null
        }
    },
    data(){
        return {
            device: null,
            deviceFunctionalities: [],
            loading: false
        }
    },
    async fetch() {
        if(this.$store.state.devices.types.length === 0) {
            await this.$store.dispatch('devices/getDeviceTypes');
        }
    },
    watch: {
        'device.functionalities': {
            handler(){
                this.deviceFunctionalities = this.device.functionalities.map(functionality => functionality.id)
            },
            deep: true
        }
    },
    computed:{
        ...mapState({
            deviceTypes: state => state.devices.types,
            functionalities: state => state.devices.functionalities
        }),
    },
    mounted() {
        if(this.forDevice !== null) {
            this.device = this.forDevice
        } else {
            this.device = this.$store.state.devices.device;
        }
        this.retrieveFunctionalities();
    },
    methods: {
        saveDevice(){
            this.loading = true;
            const device = this.device;
            device.functionalities = this.deviceFunctionalities.map((functionalityId) => {
                return {id: functionalityId}
            });
            device.device_type_id = device.device_type.id;
            this.$store.dispatch('devices/updateDevice', device).then((device) => {
                this.device = device;
                // this.$router.replace('/devices/' + device.id);
            }).catch((err) => {
                this.$toast.add(err.response.message);
            }).finally(() => {
                this.loading = false;
            });
        },
        blockDevice(device){
            this.$store.dispatch('devices/blockDevice', device.pihole_device_id).finally(() => {
                this.$router.replace('/devices');
            })
        },
        retrieveFunctionalities(){
            this.$store.dispatch('devices/getDeviceTypeFunctionalities', this.device.device_type.id);
        }
    }
}
</script>

<style scoped>

</style>
