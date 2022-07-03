<template>
    <div v-if="company">
        <header>
            <div class="py-4">
                <h1 class="text-3xl font-bold leading-tight text-gray-900">{{company.name}}</h1>
            </div>
        </header>
        <div class="space-y-8 divide-y divide-gray-200 mt-4">
            <div class="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div>
                    <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                        <div v-if="company.servers.length" class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label class="block text-sm font-medium text-gray-700"> Locations </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <location-map :locations="locations"></location-map>
                            </div>
                        </div>
                        <div v-if="company.servers.length" class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label class="block text-sm font-medium text-gray-700"> Servers </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <table>
                                        <tr>
                                            <th>Domains</th>
                                            <th>Location</th>
                                            <th>Traffic</th>
                                        </tr>
                                    <tr v-for="server in company.servers" :key="server.id">
                                        <td>
                                            <div v-for="domain in server.domains" :key="domain.id">{{domain.name}}</div>
                                        </td>
                                        <td v-if="server.location">
                                            {{server.location.city}} {{server.location.country}}
                                        </td>
                                        <td v-else>
                                            -
                                        </td>
                                        <td>
                                            {{$filters.formatSize(server.traffic)}}
                                        </td>
                                    </tr>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LocationMap from "@/components/devices/LocationMap";
import {mapActions, mapMutations, mapState} from "vuex";
import DataCard from "@/components/devices/setup/DataCard";
import Badge from "@/components/general/Badge";

export default {
    name: "CompanyDetail",
    components: {DataCard, LocationMap, Badge},
    props: {
        company:{
            required: true
        }
    },
    data(){
        return {
        }
    },
    computed: {
        locations(){
            const locations = [];
            const existing = [];
            this.company.servers.forEach((server) => {
                if(server.location && !existing.includes(server.location.id)) {
                    existing.push(server.location.id);
                    const location = {
                        ...server.location,
                        servers: [server]
                    }
                    locations.push(location)
                } else if(server.location) {
                    locations[existing.indexOf(server.location.id)].servers.push(server);
                }
            });
            return locations;
        }
    }
}
</script>

<style scoped>

</style>
