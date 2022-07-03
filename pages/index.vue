<template>
    <div class="p-6">
        <new-devices></new-devices>
        <traffic-overview class="mt-4"></traffic-overview>
    </div>
</template>

<script>
import NewDevices from "@/components/dashboard/NewDevices";
import TrafficOverview from "@/components/dashboard/TrafficOverview";
import {mapMutations} from "vuex";
export default {
    components: {TrafficOverview, NewDevices},
    data() {
        return {
        text: null
        }
    }
}
</script>
