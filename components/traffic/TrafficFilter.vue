<template>
    <card :icon="{color: 'blue', name:'filter'}" title="Filter">
        <div class="px-4 divide-y divide-gray-200">
            <div>
                <label class="block"><input type="radio" name="group" value="src" v-model="filter.group_by"> Show from which local devices data is send</label>
                <label class="block"><input type="radio" name="group" value="dst" v-model="filter.group_by"> Show to which servers data is send</label>
<!--                <label>Show sending or receiving devices</label>-->
<!--                <div class="py-2">-->
<!--                    <div class="p-inputgroup">-->
<!--                        <p-dropdown v-model="groupToggle" :options="['Sending', 'Receiving']"></p-dropdown>-->
<!--                        <span class="p-inputgroup-addon">Devices</span>-->
<!--                    </div>-->

<!--                </div>-->
            </div>

            <dropdown :start-open="true">
                <template v-slot:trigger>
                    <div class="py-2">
                        Devices
                    </div>
                </template>
                <div>
                    <div class="divide-y divide-gray-200">
                        <div class="relative flex items-center py-2">
                            <div class="flex items-center">
                                <p-checkbox id="device-all" :value="true" v-model="allDevices"></p-checkbox>
                            </div>
                            <label for="device-all" class="min-w-0 flex-1 text-sm ml-3">
                                <div class="font-medium">All devices</div>
                            </label>
                        </div>
                        <div class="relative flex items-center py-2" v-for="device in devices">
                            <div class="flex items-center h-5">
                                <p-checkbox size="sm" :id="'device-'+device.id" name="city" :value="device.id" v-model="filter.devices"></p-checkbox>
                            </div>
                            <label :for="'device-'+device.id" class="min-w-0 flex-1 text-sm ml-3">
                                <div>{{ device.name }}</div>
                            </label>
                        </div>
                    </div>

                </div>
            </dropdown>
            <dropdown>
                <template v-slot:trigger>
                    <div class="py-2">
                        Server groups
                    </div>
                </template>
                <div>
                    <div class="divide-y divide-gray-200">
                        <div class="relative flex items-center py-2">
                            <div class="flex items-center">
                                <p-checkbox id="server-group-all" :value="true" v-model="allServerGroups"></p-checkbox>
                            </div>
                            <label for="server-group-all" class="min-w-0 flex-1 text-sm ml-3">
                                <div class="font-medium">All server groups</div>
                            </label>
                        </div>
                        <div class="relative flex items-center py-2" v-for="serverGroup in serverGroups">
                            <div class="flex items-center h-5">
                                <p-checkbox size="sm" :id="'server-group-'+serverGroup.id" name="city" :value="serverGroup.id" v-model="filter.server_groups"></p-checkbox>
                            </div>
                            <label :for="'server-group-'+serverGroup.id" class="min-w-0 flex-1 text-sm ml-3">
                                <div>{{ serverGroup.name }}</div>
                            </label>
                        </div>
                    </div>

                </div>
            </dropdown>
            <dropdown>
                <template v-slot:trigger>
                    <div class="py-2">
                        Locations
                    </div>
                </template>
                <div>
                    <div class="divide-y divide-gray-200">
                        <div class="relative flex items-center py-2">
                            <div class="flex items-center">
                                <p-checkbox id="location-all" :value="true" v-model="allLocations"></p-checkbox>
                            </div>
                            <label for="location-all" class="min-w-0 flex-1 text-sm ml-3">
                                <div class="font-medium">All locations</div>
                            </label>
                        </div>
                        <div class="relative flex items-center py-2" v-for="location in locations">
                            <div class="flex items-center h-5">
                                <p-checkbox size="sm" :id="'location-'+location" name="city" :value="location" v-model="filter.locations"></p-checkbox>
                            </div>
                            <label :for="'location-'+location" class="min-w-0 flex-1 text-sm ml-3">
                                <div>{{ location }}</div>
                            </label>
                        </div>
                    </div>

                </div>
            </dropdown>
            <dropdown>
                <template v-slot:trigger>
                    <div class="py-2">
                        Companies
                    </div>
                </template>
                <div>
                    <div class="divide-y divide-gray-200">
                        <div class="relative flex items-center py-2">
                            <div class="flex items-center">
                                <p-checkbox id="company-all" :value="true" v-model="allCompanies"></p-checkbox>
                            </div>
                            <label for="company-all" class="min-w-0 flex-1 text-sm ml-3">
                                <div class="font-medium">All companies</div>
                            </label>
                        </div>
                        <div class="relative flex items-center py-2" v-for="company in companies">
                            <div class="flex items-center h-5">
                                <p-checkbox size="sm" :id="'company-'+company.id" name="city" :value="company.id" v-model="filter.companies"></p-checkbox>
                            </div>
                            <label :for="'company-'+company.id" class="min-w-0 flex-1 text-sm ml-3">
                                <div>{{ company.name }}</div>
                            </label>
                        </div>
                    </div>

                </div>
            </dropdown>
<!--            <div class="py-2">-->
<!--                <p-button class="p-button-sm" @click="applyFilter()">Apply</p-button>-->
<!--            </div>-->
        </div>
    </card>
</template>

<script>
import Card from "@/components/general/Card";
import Dropdown from "@/components/general/Dropdown";
import {mapActions, mapState} from "vuex";
import {cloneDeep} from "lodash";
export default {
    name: "TrafficFilter",
    components: {Card, Dropdown},
    data(){
        return {
            filter: {
                devices: [],
                server_groups: [],
                locations: [],
                companies: [],
                group_by: 'src'
            },
        }
    },
    mounted() {
        this.getDevices();
        this.getFilters();
    },
    watch: {
        filter:{
            handler(){
                this.applyFilter();
            },
            deep: true
        }
    },
    computed: {
        ...mapState({
            devices: state => state.devices.devices,
            serverGroups: state => state.traffic.filterOptions.serverGroups,
            locations: state => state.traffic.filterOptions.locations,
            companies: state => state.traffic.filterOptions.companies
        }),
        allDevices: {
            get() { return this.filter.devices.length === this.devices.length?[true]:[] },
            set(val) { return this.filter.devices = val.length > 0?this.devices.map(device => device.id):[] }
        },
        allServerGroups: {
            get() { return this.filter.server_groups.length === this.serverGroups.length?[true]:[] },
            set(val) { return this.filter.server_groups = val.length > 0?this.serverGroups.map(device => device.id):[] }
        },
        allLocations: {
            get() { return this.filter.locations.length === this.locations.length?[true]:[] },
            set(val) { return this.filter.locations = val.length > 0?this.locations.map(device => device.id):[] }
        },
        allCompanies: {
            get() { return this.filter.companies.length === this.companies.length?[true]:[] },
            set(val) { return this.filter.companies = val.length > 0?this.companies.map(device => device.id):[] }
        },
        groupToggle:{
            get() { return this.filter.group_by === 'dst'?'Receiving':'Sending'},
            set(val) { this.filter.group_by = (val === 'Receiving' ? 'dst':'src') }
        },
    },
    methods:{
        ...mapActions('devices', [
            'getDevices'
        ]),
        ...mapActions('traffic', [
            'getFilters'
        ]),
        applyFilter(){
            this.$emit('update:filter', cloneDeep(this.filter))
        }
    }
}
</script>

<style scoped>

</style>
