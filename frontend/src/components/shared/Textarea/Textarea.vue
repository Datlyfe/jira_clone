<template>
  <textarea
    @input="handleInput"
    @keydown="$emit('keydown', $event)"
    @blur="$emit('blur', $event)"
    :value="value"
    v-bind="$attrs"
    ref="elementRef"
    rows="1"
    class="textarea"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import autosize from 'autosize'

export default defineComponent({
  name: 'j-textarea',
  props: {
    value: {
      default: undefined
    },
    autoFocus: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const elementRef = ref<HTMLTextAreaElement>(null)
    const handleInput = (e: InputEvent) =>
      emit('input', (e.target as HTMLTextAreaElement).value)
    onMounted(() => {
      autosize(elementRef.value as HTMLElement)
      if (props.autoFocus) {
        if (elementRef.value) {
          elementRef.value.focus()
        }
      }
    })
    return {
      elementRef,
      handleInput
    }
  }
})
</script>

<style lang="postcss" scoped>
.textarea {
  border: 1px solid transparent;
  @apply border-borderLightest;
}
.textarea:hover:not(:focus) {
  @apply bg-backgroundLight;
}
.textarea:focus {
  @apply bg-white border border-borderInputFocus;
  box-shadow: 0 0 0 1px #4c9aff;
}
</style>
<style lang="scss" scoped>
.textarea {
  padding: 7px 7px 8px;
  line-height: 1.28;
  resize: none;
  box-shadow: transparent 0px 0px 0px 1px;
  transition: background 0.1s ease 0s;
  overflow: auto;
  overflow-y: hidden;
  width: 100%;
  border-radius: 3px;
  appearance: none;
}
</style>
