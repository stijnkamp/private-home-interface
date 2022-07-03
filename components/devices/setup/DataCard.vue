<template>
    <div>
      <div class="block bg-gray-50">
        <dropdown class="p-2 sm:p-4">
            <template v-slot:trigger>
              <div class="flex items-center justify-between" >
                <p class="text-sm font-medium text-blue-600">
                    <i v-if="data.data_type.icon" class="la la-lg" :class="['la-' + data.data_type.icon]"></i>
                    {{ data.data_type.name }}
                </p>
              </div>
            </template>
          <div class="mt-2 sm:flex sm:justify-between">
            <div class="sm:grid" :class="['sm:grid-cols-'+data.storage?'2':'1']">
              <p class="flex  items-center text-sm text-gray-500" v-if="data.trigger">
                <i class="flex-shrink-0 mr-1.5 text-gray-400 la la-lg la-clock"/>
                {{ data.trigger }}
              </p>
              <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6" v-if="data.storage">
                  <i class="flex-shrink-0 mr-1.5 text-gray-400 la la-lg la-save"/>
                  {{ data.storage }}
              </p>
            </div>
          </div>
        </dropdown>
      </div>
    </div>
</template>

<script>
import Dropdown from '@/components/general/Dropdown'
export default {
  name: "DataCard",
  components: {Dropdown},
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data(){
    return {
    }
  },
  computed: {
  },
  methods: {
  },
};
</script>

<style scoped>
.flex-wrap.justify-between::after {
  content: "";
  flex: auto;
}
.vertical-align {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 16px;
}
img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
