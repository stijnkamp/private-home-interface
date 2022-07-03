<template>
    <div v-if="serverGroupData">
        <header>
            <div class="py-4">
                <h1 class="text-3xl font-bold leading-tight text-gray-900">{{serverGroupData.name}}</h1>
            </div>
        </header>
        <div class="space-y-8 divide-y divide-gray-200 mt-4">
            <div class="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div>
                    <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label class="block text-sm font-medium text-gray-700"> Name </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <span>{{serverGroupData.name}}</span>
                            </div>
                        </div>
                        <div v-if="companies.length" class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label class="block text-sm font-medium text-gray-700"> Companies </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <div v-for="company in companies" :key="company.id">{{company.name}}
                                    <template v-if="includesTraffic">
                                        ( {{$filters.formatSize(company.traffic)}} )
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div v-if="servers.length" class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label class="block text-sm font-medium text-gray-700"> Locations </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <location-map :locations="locations"></location-map>
                            </div>
                        </div>
                        <div v-if="serverGroupData && serverGroupData.abstractions.length" class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label class="block text-sm font-medium text-gray-700"> Data abstractions </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <ul class="list-disc">
                                    <li v-for="abstraction in serverGroupData.abstractions" :key="abstraction.id">{{abstraction.name}}</li>
                                </ul>
                            </div>
                        </div>
                        <div v-if="serverGroupData && serverGroupData.services.length" class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label class="block text-sm font-medium text-gray-700"> Services </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2" v-for="service in serverGroupData.services" :key="service.id">
                                <div class="relative rounded-lg bg-gray-100 p-4 shadow hover:border-gray-400" style="width: 250px;">
                                    <div>
                                        <div class="flex space-between flex-row items-center">
                                            <div class="flex-1">
                                                Used for
                                                <badge class="w-full" v-for="functionality in service.functionalities" :key="functionality.id">
                                                    {{functionality.devices.join(', ')}} -
                                                    {{functionality.name}}
                                                </badge>
                                            </div>
                                        </div>
                                        <div class="divide-y rounded-xl overflow-hidden mt-2">
                                            <data-card v-for="data in service.service_data" :key="data.id" :data="data"></data-card>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="servers.length" class="sm:grid sm:grid-cols-1 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label class="block text-sm font-medium text-gray-700"> Servers </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <table class="w-full">
                                        <tr>
                                            <th>Domains</th>
                                            <th>Location</th>
                                            <th v-if="includesTraffic">Traffic</th>
                                        </tr>
                                    <tr v-for="server in servers" :key="server.id">
                                        <td>
                                            <div v-for="domain in server.domains" :key="domain.id">{{domain.name}}</div>
                                            <div v-if="server.domains.length === 0">
                                                No domains detected
                                            </div>
                                        </td>
                                        <td v-if="server.location">
                                            {{server.location.city}} {{server.location.country}}
                                        </td>
                                        <td v-else>
                                            -
                                        </td>
                                        <td v-if="includesTraffic">
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
import {cloneDeep} from "lodash";

export default {
    name: "ServerGroupDetail",
    components: {DataCard, LocationMap, Badge},
    props: {
        serverGroup:{
            required: true
        }
    },
    data(){
        return {
        }
    },
    watch:{
        'serverGroup.id': {
            handler(){
                if(this.serverGroup.id) {
                    this.getServerGroup(this.serverGroup.id);
                } else {
                    this.setServerGroup({
                        name: 'Unknown',
                        abstractions: [],
                        services: []
                    })
                }
            },
            immediate: true,
        }
    },
    computed:{
        ...mapState({
            serverGroupData: state => state.server_group.serverGroup
        }),
        locations(){
            const locations = [];
            const existing = [];
            this.servers.forEach((server) => {
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
        },
        companies(){
            const companies = [];
            if(!this.serverGroup.servers && this.serverGroupData.companies) {
                return this.serverGroupData.companies
            } else if (!this.serverGroupData.companies) {
                return [];
            }
            this.serverGroup.servers.forEach(server => {
                if (server.company) {
                    const foundCompany = companies.find(company => company.id === server.company.id);
                    if(this.includesTraffic) {
                        if (foundCompany) {
                            foundCompany.traffic += server.traffic;
                        } else {
                            server.company.traffic = server.traffic;
                            companies.push(server.company);
                        }
                    }

                }
            })
            return companies;
        },
        servers() {
            console.log("ServerGroup", this.serverGroup);
            if(!this.serverGroup.servers && this.serverGroupData.servers) {
                return this.serverGroupData.servers
            } else if (!this.serverGroup.servers && !this.serverGroupData.servers) {
                return [];
            }
            const servers = cloneDeep(this.serverGroup.servers);
            servers.sort(function (a, b) {
                return a.traffic > b.traffic?-1:1;
            });
            return servers;
        },
        includesTraffic(){
            return !!this.serverGroup.servers
        }
    },
    mounted() {
    },
    methods: {
        ...mapActions('server_group', [
            'getServerGroup'
        ]),
        ...mapMutations('server_group', [
            'setServerGroup'
        ])
    }
}
</script>

<style scoped>

</style>
