<template>
    <div>
        <Toast />
        <mobile-sidebar></mobile-sidebar>
        <sidebar></sidebar>
        <div class="md:pl-64 flex flex-col flex-1 max-h-screen">
            <navbar></navbar>
            <main class="flex-1 overflow-auto min-h-0">
                <nuxt/>
            </main>
        </div>
    </div>
</template>
<script>
import MobileSidebar from "~/components/layouts/MobileSidebar";
import Sidebar from "~/components/layouts/Sidebar";
import Navbar from "~/components/layouts/Navbar";
import Toast from "~/node_modules/primevue/toast"
export default {
    components: {Navbar, MobileSidebar, Sidebar, Toast}
}
</script>
