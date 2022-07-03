<template>
    <div>
        <div class="relative rounded-lg bg-gray-100 p-4 shadow hover:border-gray-400" style="width: 250px;" :style="{opacity: serverGroup.active?1:0.5}">
            <div >
                <div class="flex space-between flex-row items-center">
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900 flex justify-between items-center">
                        <span class="flex flex-start items-center">
                            <template v-if="deviceImage">
                                <img  class="w-6" :src="deviceImage"/>
                                <i class="la la-arrow-right text-bold mx-1"></i>
                            </template>
                            {{ serverGroup.name }}
                        </span>
                            <badge class="cursor-pointer ml-2" icon="info-circle" @click.native="selected = serverGroup" v-if="serverGroup.id">More</badge>
                        </p>
                        <!--                    <badge style="max-width: 200px" icon="map-pin" v-if="serverGroup.locations.length">-->
                        <!--                        {{locations}}-->
                        <!--                    </badge>-->
                    </div>
                </div>
                <div class="mt-2" v-if="serverGroup.abstractions && serverGroup.abstractions.length > 0">
                    <badge class="cursor-pointer" color="yellow" icon="exclamation-circle" @click.native="selected = serverGroup" v-if="serverGroup.id">{{serverGroup.abstractions.length}}x abstracted personal data</badge>
                </div>
                <div class="divide-y rounded-xl overflow-hidden mt-2">
                    <service-card v-for="service in serverGroup.services" :key="service.id" :service="service" :device="serverGroup.device"></service-card>
                </div>
            </div>
        </div>

        <modal v-if="selected" v-model="selected" :title="serverGroup.name">
            <server-group-detail v-if="selected" :server-group="selected"></server-group-detail>
        </modal>
    </div>
</template>

<script>
import DataCard from "@/components/devices/setup/DataCard";
import Badge from "@/components/general/Badge";
import ServiceCard from "@/components/devices/overview/ServiceCard";
import ServerGroupDetail from "@/components/devices/ServerGroupDetail";
import Modal from "@/components/general/Modal";
export default {
    name: "ServerGroupCard",
    components: {Modal, ServerGroupDetail, ServiceCard, DataCard, Badge},
    props: {
        serverGroup: {
          type: Object,
          required: true,
        },
  },
    data() {
        return {
            selected: null
        }
    },
    computed: {
      locations(){
          const countries = {};
          this.serverGroup.locations.forEach((location) => {
              if(location.country !== null) {
                  const country = location.country;
                  if (!countries.hasOwnProperty(country)) {
                      countries[country] = 1
                  } else {
                      countries[country]++;
                  }
              }
          })
          return Object.keys(countries).map((country) => {
              return country + '(' + countries[country] + ')';
          }).join(', ')
      },
        deviceImage() {
            if(this.serverGroup == null || this.serverGroup.device == null || this.serverGroup.device.device_type.icon == null) {
                return null;
            }
            return this.$axios.defaults.baseURL + this.serverGroup.device.device_type.icon;
        }
    },
    mounted(){
    },
  methods: {
  },
};
</script>
