<template>
    <div class="relative rounded-lg bg-gray-100 p-4 shadow hover:border-gray-400" style="width: 250px;" @click="$bus.$emit('localDeviceClicked', localDevice.id)">
        <div>
            <div class="flex space-between flex-row items-center">
                <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">
                        <span class="flex flex-start items-center">
                            <template v-if="deviceImage">
                                <img  class="w-6" :src="deviceImage"/>
                                <i class="la la-arrow-right text-bold mx-1"></i>
                            </template>
                            {{ connectedDevices?connectedDevices:localDevice.name }}
                        </span>
                    </p>
                </div>
            </div>
            <div class="divide-y rounded-xl overflow-hidden mt-2">
                <service-card v-for="service in localDevice.services" :key="service.id" :service="service" :device="localDevice.device"></service-card>
            </div>
        </div>
    </div>
</template>

<script>
import DataCard from "@/components/devices/setup/DataCard";
import Badge from "@/components/general/Badge";
import ServiceCard from "@/components/devices/overview/ServiceCard";
import {mapState} from "vuex";
export default {
    name: "LocalDeviceCard",
    components: {ServiceCard, DataCard, Badge},
    props: {
        localDevice: {
          type: Object,
          required: true,
        },
  },
    computed: {
        ...mapState({
           devices: state => state.devices.devices
        }),
        deviceImage() {
            console.log(this.devices);
            if(this.localDevice == null || this.localDevice.device == null || this.localDevice.device.device_type.icon == null) {
                return null;
            }
            return this.$axios.defaults.baseURL + this.localDevice.device.device_type.icon;
        },
        connectedDevices(){
            const devices = this.devices.filter(device => device.device_type_id === this.localDevice.id);
            return devices.map(device => device.name).join(", ");
        }
    },
  methods: {
  },
};
</script>
