<template>
  <div class="text-textMedium text-15">
    <span v-for="(item, index) in items" :key="item">
      <span class="relative mx-2 font-lg" v-if="index !== 0">/</span>
      {{ item }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
export default defineComponent({
  name: 'j-breadcrumbs',
  props: {
    items: {
      type: Array as () => string[],
      default: []
    }
  }
})
</script>
