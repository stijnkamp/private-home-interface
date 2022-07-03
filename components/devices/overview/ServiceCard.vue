<template>
    <div class="p-2 bg-white flex">
        <div class="flex-shrink-0 rounded-full flex items-center mr-2">
            <p-checkbox @click.native="updateFunctionalities()" v-model="functionalities" :value="service.functionality.id" name="device_functionalities"/>
        </div>
        <div class="flex-1">
            <div class="flex space-between flex-row items-center">
                <div class="flex-1">
                    <p class="text-sm font-medium text-blue-500">
                        {{ service.functionality.name }}
                    </p>
                </div>
            </div>
            <div class="divide-y rounded-xl overflow-hidden mt-2">
                <data-card v-for="data in service.serviceData" :key="data.id" :data="data"></data-card>
            </div>
        </div>
    </div>
</template>

<script>
import DataCard from "@/components/devices/setup/DataCard";
import Badge from "@/components/general/Badge";
import {cloneDeep} from 'lodash';
import {mapMutations, mapState} from "vuex";
export default {
    name: "ServiceCard",
    components: {DataCard, Badge},
    props: {
        service: {
          type: Object,
          required: true,
        },
        device: {
            type: Object,
            required: true,
        },
  },
    data(){
      return {
          functionalities:[]
      }
    },
    watch: {
      'device.functionalities': {
          immediate: true,
          deep:true,
          handler(){
              const active = this.device.functionalities.map(f => f.id).includes(this.service.functionality.id);
              this.functionalities = active?[this.service.functionality.id]:[];
          }
      }
    },
    computed: {
        ...mapState({
            rawDevices: state => state.devices.devices,
            deviceTypes: state => state.devices.types
        }),
    },
  methods: {
        ...mapMutations('devices', [
            'setDevices'
        ]),
      updateFunctionalities(){
          const devices = cloneDeep(this.rawDevices)
          const functionality = cloneDeep(this.service.functionality);
          const device = devices.find(device => device.id === this.device.id);
          if(this.functionalities.length > 0) {
              device.functionalities.push(functionality);
          } else {
              const index = device.functionalities.map(functionality => functionality.id).indexOf(functionality.id);
              if(index !== -1) {
                  device.functionalities.splice(index, 1);
              }
          }
          this.setDevices(devices);
      }
  },
};
</script>
