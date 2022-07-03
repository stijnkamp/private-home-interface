<template>
    <div class="p-6">
        <device-setup v-if="newDevice"></device-setup>
    </div>
</template>

<script>
import {mapState} from "vuex";
import DeviceSetup from "@/components/devices/setup/DeviceSetup";

export default {
    components: {DeviceSetup},
    data() {
        return {
            text: null
        }
    },
    computed:{
        ...mapState({
            newDevice: state => state.devices.newDevice
        }),
    },
    async fetch({params, store}) {
        const deviceId = params.id;
        store.commit('devices/selectNewDevice', deviceId);
        if(store.state.devices.newDevice == null) {
            store.dispatch('devices/getNewDevice', deviceId);
        }
    },
    methods: {
        greet() {
            this.$toast.add({severity: 'info', summary: 'Hello '  + this.text});
        }
    }
}
</script>
