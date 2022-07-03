<template>
  <div class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-top space-x-3 hover:border-gray-400">
    <div class="flex-shrink-0 rounded-full flex items-center mr-2">
      <p-checkbox v-model="functionalities" :value="functionality.id" name="device_functionalities"/>
    </div>
    <dropdown class="flex-1 min-w-0">
      <div slot="trigger" class="focus:outline-none">
        <div class="flex space-between flex-row items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">
                {{ functionality.name }}
                <badge v-if="cloud" icon="cloud"></badge>
            </p>
            <p class="text-sm text-gray-500 truncate">
                <template v-for="service in functionality.services">
                    <i v-for="data in service.service_data" :key="data.id" v-if="data.data_type.icon" class="la la-lg" :class="['la-' + data.data_type.icon]"></i>
                </template>
            </p>
          </div>
        </div>
      </div>
      <div class="border-t border-blue-500 mt-1 divide-y-2">
        <service-card :service="service" v-for="service in functionality.services" :key="service.id"></service-card>
      </div>
    </dropdown>
  </div>
</template>

<script>
import ServiceCard from "@/components/devices/setup/ServiceCard";
import Dropdown from "@/components/general/Dropdown";
import Badge from "@/components/general/Badge";
export default {
  name: "FunctionalityCard",
  components: {ServiceCard, Dropdown, Badge},
  props: {
    functionality: {
      type: Object,
      required: true,
    },
      value: {}
  },
    data(){
      return {}
    },
  computed: {
      functionalities:{
          get(){
              return this.value;
          },
          set(val){
              this.$emit('input', val)
          }
      },
      cloud(){
          return this.functionality.services.some(service => service.cloud)
      }
  },
  methods: {
  },
};
</script>

<style scoped>
.flex-wrap.justify-between::after {
  content: "";
  flex: auto;
}
.vertical-align {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 16px;
}
img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
