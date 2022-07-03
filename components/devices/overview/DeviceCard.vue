<template>
  <div class="relative rounded-lg bg-gray-100 p-4 shadow hover:border-gray-400 device-card" style="width: 250px;" ref="card">
      <div class="flex justify-between items-start">
          <img v-if="image" class="w-12" :src="image"/>
          <badge v-if="device.pihole_device.macVendor" class="ml-2">
              {{device.pihole_device.macVendor}}
          </badge>
      </div>
      <p class="text-md font-medium text-gray-900 mt-2">
          {{ device.name }}
      </p>
      <p class="text-sm text-gray-500 truncate">
          <functionality-card v-for="functionality in device.localFunctionalities" :key="functionality.id" :functionality="functionality"></functionality-card>
      </p>
  </div>
</template>

<script>
import ServiceCard from "@/components/devices/setup/ServiceCard";
import Dropdown from "@/components/general/Dropdown";
import Badge from "@/components/general/Badge";
import FunctionalityCard from "@/components/devices/setup/FunctionalityCard";
export default {
  name: "DeviceCard",
  components: {FunctionalityCard, ServiceCard, Dropdown, Badge},
  props: {
    device: {
      type: Object,
      required: true,
    },
  },
    data(){
      return {
          listener: null
      }
    },
    mounted() {
      this.listener = this.$bus.$on('localDeviceClicked', (e) => {
          if(this.device.device_type_id === e){
              const el = this.$refs.card;
              console.log(el);
              el.style.animation = 'none';
              el.offsetHeight; /* trigger reflow */
              el.style.animation = null;
          }
      })
    },
    destroyed() {
      this.listener.$off();
    },
    computed: {
      image() {
          if(this.device == null || this.device.device_type.icon == null) {
              return null;
          }
          return this.$axios.defaults.baseURL + this.device.device_type.icon;
      }
  },
  methods: {
  },
};
</script>

<style scoped>
.device-card {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
    transform: scale(1);
    animation: pulse 1s
}
@keyframes pulse {
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3);
    }

    70% {
        transform: scale(1.02);
        box-shadow: 0 0 0 5px rgba(0, 0, 0, 0);
    }

    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
}


</style>
