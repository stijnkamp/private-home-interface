<template>
    <transition>
        <div v-if="open" class="fixed z-10 inset-0 overflow-y-auto" @close="open = false">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                <div
                    class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                    <div>
                        <div
                            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                            v-if="icon">
                            <i class="la h-6 w-6 text-red-600 text-2xl" :class="['la' + icon]" aria-hidden="true"/>
                        </div>
                        <div>
                            <h3 class="text-lg leading-6 font-medium text-gray-900 flex justify-between items-center">
                                <slot name="title">
                                    {{ title }}
                                </slot>
                                <div v-if="buttonPosition === 'top'" class="sm:flex sm:flex-row-reverse">
                                    <slot name="buttons">
                                        <p-button @click="open = false">
                                            Oke
                                        </p-button>
                                    </slot>
                                    <p-button v-if="$slots.buttons" variant="light" class="mr-2" @click="open = false">
                                        Cancel
                                    </p-button>
                                </div>
                            </h3>
                            <div class="mt-2">
                                <slot></slot>
                            </div>
                        </div>
                    </div>
                    <div v-if="buttonPosition === 'bottom'" class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <slot name="buttons">
                            <p-button @click="open = false">
                                Oke
                            </p-button>
                        </slot>
                        <p-button v-if="$slots.buttons" variant="light" class="mr-2" @click="open = false">
                            Cancel
                        </p-button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>

export default {
    props: {
        'icon': {},
        'title': {},
        'value': {
            'default': false
        },
        'buttonPosition': {
            'default': 'bottom'
        }
    },
    name: "Modal",
    components: {},
    computed: {
        open: {
            set: function (value) {
                this.$emit('input', value);
            },
            get: function () {
                return this.value;
            }
        }
    }
}
</script>
