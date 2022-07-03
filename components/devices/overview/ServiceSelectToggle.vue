<template>
    <div class="middle">
        <div class="line"  :class="{'active': value}">
            <div class="skeleton-box skeleton-box-x" v-if="value" :class="{'reverse': reverseLine}"></div>
        </div>
        <div class="toggle">
            <!--:class="{'pulse': value}"-->
            <p-radio-button  :value="true" v-model="toggle"></p-radio-button>
        </div>
    </div>
</template>

<script>
import DataCard from "@/components/devices/setup/DataCard";
import Badge from "@/components/general/Badge";
export default {
    name: "ServiceSelectToggle",
    components: {DataCard, Badge},
    props: {
        value: {
          type: Boolean,
          required: true,
        },
        reverseLine: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
        }
    },
    computed: {
        toggle: {
            get(){
                return this.value??null;
            },
            set(val) {
                val = !this.value;
                console.log(val);
                this.$emit('input', val);
            }
        }
    },
    methods: {
        change(el) {
            console.log(el);
        }
    },
};
</script>
<style lang="scss" scoped>
    .middle {
        position: absolute;
        top: 50%;
        left: 25px;
        transform: translate(-50%, -50%);
    }
    .line {
        @apply bg-gray-100;
        width: 25px;
        height: 6px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%);
        z-index: -1;
        &.active {
            background: var(--primary-color);
        }
    }
</style>
