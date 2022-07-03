<template>
    <div v-if="device">
        <header>
            <div class="py-4">
                <h1 class="text-3xl font-bold leading-tight text-gray-900">Setup {{name}}</h1>
            </div>
        </header>
        <div class="space-y-8 divide-y divide-gray-200">
            <div class="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div>
                    <div>
                        <h3 class="text-lg leading-6 font-medium text-gray-900">Device type</h3>
                        <p class="mt-1 max-w-2xl text-sm text-gray-500">What kind of device is this?</p>
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
                                <multiselect id="device-type" v-model="device.device_type"  :options="deviceTypes" track-by="id" label="name"></multiselect>
                            </div>
                        </div>

                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> Possible functionalities </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2 space-y-4">
                                <functionality-card :functionality="functionality" v-model="deviceFunctionalities" v-for="functionality in functionalities" :key="functionality.id"></functionality-card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pt-5">
                <div class="flex justify-end">
                    <button @click="$router.back()" type="button" class="bg-white mr-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Cancel</button>
                    <p-button  :disabled="!validDevice" @click="setupDevice()" label="Test">Setup</p-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";
import Multiselect from 'vue-multiselect'
import FunctionalityCard from "@/components/devices/setup/FunctionalityCard";

export default {
    name: "DeviceSetup",
    components: {FunctionalityCard, Multiselect},
    data(){
        return {
            device: null,
            deviceFunctionalities: [],
            loading: false
        }
    },
    async fetch() {
        if(this.$store.state.devices.types.length === 0) {
            this.$store.dispatch('devices/getDeviceTypes');
        }
    },
    watch: {
        'device.device_type': function() {
            if(this.device.device_type) {
                this.$store.dispatch('devices/getDeviceTypeFunctionalities', this.device.device_type.id).then((functionalities) => {
                    this.deviceFunctionalities = functionalities.map(functionality => functionality.id)
                })
            }
        }
    },
    computed:{
        ...mapState({
            deviceTypes: state => state.devices.types,
            functionalities: state => state.devices.functionalities
        }),
        name(){
            if(this.device !== null && this.device.name) {
                const name = this.device.name.replace('.lan', '');
                return this.$filters.parseSlug(name)
            }
            return "Unknown device"
        },
        validDevice(){
            if(!this.device.name) {
                return false;
            }
            if(!this.device.device_type) {
                return false;
            }
            return !this.loading;
        }
    },
    mounted() {
        let name = this.$store.state.devices.newDevice.name
        if(name) {
            name = name.replace('.lan', '');
            name = this.$filters.parseSlug(name)
        }
        this.device = {
            name: name,
            pihole_device_id: this.$store.state.devices.newDevice.id
        }
    },
    methods: {
        setupDevice(){
            this.loading = true;
            const device = this.device;
            device.functionalities = this.deviceFunctionalities;
            device.device_type_id = device.device_type.id;
            this.$store.dispatch('devices/addDevice', device).then((device) => {
                this.$toast.add({severity: 'success', summary: 'Saved', life: 3000})
                this.$router.replace('/devices/' + device.id);
            }).catch((err) => {
                console.log(err);
                this.$toast.add({severity: 'error', summary: 'There has been an error', life: 3000})
                // this.$toast.add(err.response.message);
            }).finally(() => {
                this.loading = false;

            });
        }
    }
}
</script>

<style scoped>

</style>
