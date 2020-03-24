<template>
  <div class="px-10 py-8">
    <div class="pb-4 text-2xl font-medium leading-normal text-textDarkest">
      {{ title }}
    </div>
    <p class="pb-4 whitespace-pre-wrap text-15">{{ message }}</p>
    <div class="flex pt-3">
      <j-button
        :isWorking="isWorking"
        @click="handleConfirmed"
        class="mr-2"
        :variant="variant"
        >{{ confirmText }}</j-button
      >
      <j-button @click="handleClose" class="mr-2" variant="empty"
        >Cancel</j-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onUnmounted } from '@vue/composition-api'
export default defineComponent({
  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      default: undefined
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    variant: {
      type: String,
      default: 'primary'
    }
  },
  setup(props, { emit }) {
    const isWorking = ref<boolean>(false)
    const handleConfirmed = () => {
      if (isWorking.value) return
      isWorking.value = true
      emit('confirm')
    }
    const handleClose = () => emit('close')

    onUnmounted(() => {
      isWorking.value = false
    })

    return {
      isWorking,
      handleClose,
      handleConfirmed
    }
  }
})
</script>
