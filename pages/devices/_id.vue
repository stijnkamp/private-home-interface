<template>
    <div class="p-6">
        <device-detail v-if="device" :for-device="device"></device-detail>
    </div>
</template>

<script>
import DeviceDetail from "@/components/devices/DeviceDetail";
import {mapActions, mapState} from "vuex";
import {cloneDeep} from "lodash";
export default {
    components: {DeviceDetail},
    data() {
        return {
            text: null,
            device: null,
        }
    },
    watch: {
      '$route.params': {
          immediate: true,
          handler(){
              this.getDevice(this.$route.params.id).then((device) => {
                  this.device = cloneDeep(device)
              })
          }
      }
    },
    methods: {
        ...mapActions('devices', [
            'getDevice'
        ])
    }
}
</script>
