<template>
  <svg v-on="$listeners" :style="iconStyles">
    <use
      xmlns:xlink="http://www.w3.org/1999/xlink"
      :xlink:href="'#' + name"
    ></use>
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
export default defineComponent({
  name: 'j-icon',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 16
    },
    fill: {
      type: String,
      default: 'currentColor'
    }
  },
  setup(props) {
    const iconStyles = computed(() => ({
      width: props.size + 'px',
      height: props.size + 'px',
      fill: props.fill
    }))

    return {
      iconStyles
    }
  }
})
</script>
