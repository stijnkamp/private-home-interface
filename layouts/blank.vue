<template>
    <div>
        <Toast></Toast>
        <Nuxt />
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
