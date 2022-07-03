<template>
    <div class="p-6">

        <device-overview></device-overview>
        <blocked-list class="mt-4"></blocked-list>
    </div>
</template>

<script>
import BlockedList from "@/components/devices/BlockedList";
import DeviceOverview from "@/components/devices/overview/DeviceOverview";
export default {
    components: {DeviceOverview, BlockedList},
    async fetch() {
        await this.$store.dispatch('devices/getDevices')
        await this.$store.dispatch('devices/getDeviceTypes', true)
    },
    data() {
        return {
        text: null
        }
    },
    methods: {}
}
</script>
