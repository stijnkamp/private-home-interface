<template>
    <div class="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
        <button type="button" class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden">
            <span class="sr-only">Open sidebar</span>
            <!-- Heroicon name: outline/menu-alt-2 -->
            <i class="la la-lg la-bars"></i>
        </button>
        <div class="flex-1 px-4 flex justify-between">
            <div class="flex-1 flex items-center">
                <h1 class="text-xl font-bold leading-tight text-gray-900">{{header}}</h1>
<!--                <form class="w-full flex md:ml-0" action="#" method="GET">-->
<!--                    <label for="search-field" class="sr-only">Search</label>-->
<!--                    <div class="relative w-full text-gray-400 focus-within:text-gray-600">-->
<!--                        <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none">-->
<!--                            &lt;!&ndash; Heroicon name: solid/search &ndash;&gt;-->
<!--                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">-->
<!--                                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />-->
<!--                            </svg>-->
<!--                        </div>-->
<!--                        <input id="search-field" class="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm" placeholder="Search" type="search" name="search">-->
<!--                    </div>-->
<!--                </form>-->
            </div>
            <div class="ml-4 flex items-center md:ml-6">
                <div class="ml-3 relative">
                    <div>
                        <button @click="popover = !popover" type="button" class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                            <span class="sr-only">Open user menu</span>
                            {{$auth.user.name}}
                        </button>
                    </div>
                    <div v-if="popover" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                        <button @click="logout" href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign out</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "Navbar",
    data(){
        return {
            popover: false
        }
    },
    computed: {
        ...mapState({
            header: state => state.navigation.header
        })
    },
    methods: {
        logout(){
            this.$auth.logout().then(() => {
               this.$router.push('/login')
            });
        }
    }
}
</script>

<style scoped>

</style>
