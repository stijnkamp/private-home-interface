<template>
    <div class="py-2">
        <div>
            <div class="flex space-between flex-row items-center">
                <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 flex justify-between">
                        {{ name }}
                        <badge v-if="service.cloud" icon="cloud"> Cloud</badge>
                    </p>
                </div>
                <div>
                    <div class="text-sm text-gray-500" v-if="service.server_group && service.server_group.locations.length">
                        <i class="la la-map-pin"></i>{{service.server_group.locations.map(location => location.country).join(', ')}}
                    </div>
                </div>
            </div>
            <div class="divide-y rounded-xl overflow-hidden mt-2">
                <data-card class="divide-1" :data="data" v-for="data in service.service_data" :key="data.id"></data-card>
            </div>
        </div>
    </div>
</template>

<script>
import DataCard from "@/components/devices/setup/DataCard";
import Badge from "@/components/general/Badge";
export default {
    name: "ServiceCard",
    components: {DataCard, Badge},
    props: {
        service: {
          type: Object,
          required: true,
        },
  },
    computed: {
        name(){
            if(this.service.server_group) {
                return this.service.server_group.name
            } else if(this.service.device_type) {
                return this.service.device_type.name
            } else {
                return 'Any device'
            }
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
</style>
