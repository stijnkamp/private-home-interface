<template>
    <div class="p-6 flex flex-col">
        <div class="grid grid-cols-4 flex-1 min-h-0 align-stretch">
            <traffic-chart class="col-span-3" :filter="filter"></traffic-chart>
            <traffic-filter class="max-h-full overflow-auto" @update:filter="filter = $event"></traffic-filter>
        </div>
    </div>
</template>

<script>
import DeviceList from "@/components/devices/DeviceList";
import TrafficChart from "@/components/traffic/TrafficChart";
import TrafficFilter from "@/components/traffic/TrafficFilter";
import {mapMutations} from "vuex";
export default {
    components: {TrafficFilter, TrafficChart, DeviceList},
    data() {
        return {
            text: null,
            filter: {}
        }
    }
}
</script>
