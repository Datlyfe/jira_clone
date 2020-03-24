<template>
  <div ref="$rootRef" class="scrollOverlay">
    <div :class="['clickableOverlay', variant]">
      <div ref="$modalRef" :style="modalStyles" :class="['modal', variant]">
        <component
          @close="$emit('close')"
          @confirm="$emit('confirm')"
          v-bind="componentProps"
          :is="component"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  computed
} from '@vue/composition-api'
import { useOutsideClick } from '../../hooks/useOutsideClick'
type ModalVariant = 'center' | 'aside'
export default defineComponent({
  props: {
    variant: {
      type: String as () => ModalVariant,
      default: 'center'
    },
    width: {
      type: Number,
      default: 600
    },
    component: {
      type: [Object, String],
      required: true
    },
    componentProps: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const $modalRef = ref<HTMLDivElement>(null)
    const $rootRef = ref<HTMLDivElement>(null)
    const modalStyles = computed(() => ({
      '--width': `${props.width}px`
    }))
    const handleModalClose = (e: string) => emit('close', e)
    const handleConfirm = () => emit('confirm')

    useOutsideClick($rootRef, $modalRef, handleModalClose)
    onMounted(() => {
      document.body.style.overflow = 'hidden'
    })
    onUnmounted(() => {
      document.body.style.overflow = 'visible'
    })

    return {
      $modalRef,
      $rootRef,
      modalStyles,
      handleConfirm,
      handleModalClose
    }
  }
})
</script>

<style lang="scss">
.scrollOverlay {
  z-index: 10001;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.clickableOverlay {
  min-height: 100%;
  background: rgba(9, 30, 66, 0.54);
  &.center {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px;
  }
}

.modal {
  display: inline-block;
  position: relative;
  width: 100%;
  background: #fff;

  &.center {
    max-height: 100%;
    max-width: var(--width);
    border-radius: 3px;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  }
  &.aside {
    min-height: 100vh;
    max-width: var(--width);
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
  }
}
</style>
