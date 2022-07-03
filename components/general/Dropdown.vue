<template>
    <div>
        <div class="trigger flex flex-row justify-between" @click="toggleShow()">
            <svg v-if="showIcon" class="transform" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 11 14'
                 v-bind:class="{'-rotate-90':show}">
                <path fill='#869AB8'
                      d='M9.148 2.352l-4.148 4.148 4.148 4.148q0.148 0.148 0.148 0.352t-0.148 0.352l-1.297 1.297q-0.148 0.148-0.352 0.148t-0.352-0.148l-5.797-5.797q-0.148-0.148-0.148-0.352t0.148-0.352l5.797-5.797q0.148-0.148 0.352-0.148t0.352 0.148l1.297 1.297q0.148 0.148 0.148 0.352t-0.148 0.352z'></path>
            </svg>
            <slot name="trigger"></slot>
        </div>
        <div class="content">
            <slot v-if="show"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "Dropdown",
    props: {'startOpen': {}, 'showIcon': {default: true}},
    data() {
        return {
            show: false
        }
    },
    methods: {
        toggleShow() {
            this.show = !this.show;
        }
    },
    mounted() {
        if (this.startOpen) {
            this.show = true;
        }
    }
}
</script>

<style lang="scss" scoped>
.trigger {
    position: relative;
    padding-right: 14px;
    svg {
        position: absolute;
        top: 50%;
        right: 0;
        display: block;
        width: 14px;
        height: 14px;
        padding: 0;
        margin-top: -7px;
        transition: transform 0.3s;
    }
}

.content > * {
    display: block;
}
</style>
