<template>
    <div class="px-2 py-1 space-x-1 inline-flex items-center text-xs rounded-full  " :class="colorClasses">
        <i v-if="icon"  :class="['la la-lg la-' + icon]"></i>
        <span v-if="this.$slots.default"><slot></slot></span>
    </div>
</template>

<script>
export default {
    name: 'Badge',
    props: {
        icon: String,
        color: {
            default: 'blue'
        }
    },
    computed:{
        colorClasses(){
            const classes = {
                'blue': 'bg-blue-100 text-blue-800',
                'red': 'bg-red-100 text-red-800',
                'yellow': 'bg-yellow-100 text-yellow-800',
                'green': 'bg-green-100 text-green-800',
            }
            return classes.hasOwnProperty(this.color)?classes[this.color]:classes['blue']
        }
    }
}
</script>

<style>
</style>
