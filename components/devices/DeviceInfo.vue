<template>
    <div v-if="device">
        <header>
            <div class="py-4">
                <h1 class="text-3xl font-bold leading-tight text-gray-900">{{name?name:'Unknown'}}</h1>
            </div>
        </header>

        <div class="space-y-8 divide-y divide-gray-200 mt-4">
            <div class="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div>
                    <div class="space-x-4">
                        <badge  v-if="device.device" @click.native="$router.push('/devices/' + device.device.id)" icon="eye" class="cursor-pointer text-lg leading-6 font-medium text-gray-900">Show device</badge>
                        <badge class="cursor-pointer text-lg leading-6 font-medium" @click.native="blockDevice(device)" icon="ban" color="red">Block device</badge>
                    </div>
                    <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label class="block text-sm font-medium text-gray-700"> First seen </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <span>{{device.firstSeen | formatDate('LLL')}}</span>
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label class="block text-sm font-medium text-gray-700"> Last active </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <span>{{device.lastQuery | formatDate('fromNow')}} ago</span>
                            </div>
                        </div>
                        <div v-if="device.device" class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label class="block text-sm font-medium text-gray-700"> Device Type </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <span>{{device.device.device_type.name}}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Badge from '@/components/general/Badge'
export default {
    name: "DeviceInfo",
    components: {Badge},
    props: {
        device: {
            required: true
        }
    },
    data(){
        return {
        }
    },
    computed:{
        name(){
            return this.device.device?this.device.device.name:this.device.name
        }
    },
    mounted() {
        if(this.device.device) {
            this.$router.push('/devices/' + this.device.device.id)
        }
    },
    methods: {
        blockDevice(device){
            this.$store.dispatch('devices/blockDevice', device.id).finally(() => {
                this.$router.replace('/devices');
            })
        },
    }
}
</script>

<style scoped>

</style>
