<template>
    <div class="bg-white shadow sm:rounded-md">
        <div class="bg-white p-4 border-gray-200 items-center flex justify-between">
            <div class="flex items-center">
                <slot name="title">
                    <i v-if="icon" class="la la-2x" :class="['la-' + icon.name, 'text-'+((icon.color?icon.color:'blue')+'-400')]"></i>
                    <h3 class="text-lg leading-6 font-medium text-gray-900 ml-2">{{ title }}</h3>
                </slot>
            </div>
            <div><slot name="center"></slot></div>
            <div><slot name="end" ></slot></div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'Card',
    props: {
        title: String,
        icon: Object
    }
}
</script>

<style>
</style>
