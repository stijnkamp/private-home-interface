<template>
    <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <!-- Sidebar component, swap this element with another sidebar if you like -->
        <div class="flex flex-col flex-grow border-r border-gray-200 pt-5 bg-white overflow-y-auto">
            <div class="flex items-center flex-shrink-0 px-4">
                <h2 class="text-heading">Privacy Controller</h2>
            </div>
            <div class="mt-5 flex-grow flex flex-col">
                <nav class="flex-1 px-2 pb-4 space-y-1">
                    <!-- Current: "bg-gray-100 text-gray-900", Default: "text-gray-600 hover:bg-gray-50 hover:text-gray-900" -->
                    <template v-for="location in locations" >

                        <a :href="location.link" v-if="location.target === '_blank'" target="_blank" class="hover:bg-50 text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                            <i class="mr-3 la la-lg" :class="location.icon"></i>
                            {{location.name}}
                        </a>
                        <nuxt-link v-else :to="location.link" class="hover:bg-50 text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                            <i class="mr-3 la la-lg" :class="location.icon"></i>
                            {{location.name}}
                        </nuxt-link>
                    </template>
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
import {mapMutations} from "vuex";

export default {
    name: "Sidebar",
    data(){
        return {
            locations: [
                {
                    icon: 'la-home',
                    name: 'Dashboard',
                    link: '/'
                },
                {
                    icon: 'la-mobile',
                    name: 'Devices',
                    link: '/devices'
                },
                {
                    icon: 'la-chart-line',
                    name: 'Data flows',
                    link: '/flows'
                },
                // {
                //     icon: 'la-external-link-alt',
                //     name: 'Home assistant',
                //     target: '_blank',
                //     link: 'http://localhost:8123'
                // }
            ],
            active: null
        }
    },
    methods: {
        ...mapMutations('navigation', [
            'setHeader'
        ])
    },
    watch: {
        $route: {
            handler() {
                const active = this.locations.find(location => location.link === this.$route.path);
                if (active) {
                    this.setHeader(active.name);
                }
            },
            immediate: true,
        }
    }
}
</script>

<style>
    .nuxt-link-exact-active {
        background: rgb(37, 99, 235);
        color: #ffffff;
    }
</style>
