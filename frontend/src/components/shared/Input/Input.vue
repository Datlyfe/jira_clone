<template>
  <div :style="Iconstyles" class="inputContainer">
    <div v-if="icon" class="inputIconContainer">
      <j-icon :size="iconSize" :name="icon"></j-icon>
    </div>
    <input
      :class="['input', { invalid, hasIcon: icon }]"
      v-bind="$attrs"
      :value="value"
      @input="handleInput"
      @blur="handleBlur"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
export default defineComponent({
  name: 'j-input',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      default: undefined
    },
    icon: {
      type: String,
      default: null
    },
    iconSize: {
      type: Number,
      default: 16
    },
    invalid: {
      type: Boolean,
      default: false
    },
    filter: {
      default: undefined
    }
  },
  setup(props, { emit }) {
    const handleInput = (event: InputEvent) => {
      emit('input', (event.currentTarget as HTMLInputElement).value)
    }
    const handleBlur = (event: FocusEvent) => {
      emit('blur', (event.currentTarget as HTMLInputElement).value)
    }
    const Iconstyles = computed(() => ({
      '--iconContainerWidth': props.iconSize * 2 + 'px'
    }))
    return {
      handleInput,
      handleBlur,
      Iconstyles
    }
  }
})
</script>

<style lang="scss" scoped>
.inputContainer {
  position: relative;
  display: inline-block;
  height: 32px;
  width: 100%;
}
.input {
  height: 100%;
  width: 100%;
  padding: 0 7px;
  border-radius: 3px;
  border: 1px solid #ddd;
  background: #f4f5f7;
  color: #172b4d;
  transition: background 0.1s;
  font-size: 15px;
  &:hover {
    background: #ebecf0;
  }
  &:focus {
    background: #fff;
    border: 1px solid #4c9aff;
    box-shadow: 0 0 0 1px #4c9aff;
    outline: none;
  }
  &::placeholder {
    font-size: 14px;
  }
}
.invalid {
  &,
  &:focus {
    border: 1px solid #e13c3c;
    box-shadow: none;
  }
}
.hasIcon {
  padding-left: var(--iconContainerWidth);
}

.inputIconContainer {
  position: absolute;
  width: var(--iconContainerWidth);
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inputContainer {
  &.flat {
    height: 40px;
    .input {
      border: none;
      border-bottom: 2px solid #0052cc;
      font-size: 21px;
      background: #fff;

      &::placeholder {
        // @apply text-textLight;
        font-size: 21px;
      }
      &:focus,
      &:hover {
        border: none;
        border-bottom: 2px solid #0052cc;
        box-shadow: none;
        background: #fff;
      }
    }
  }
}
</style>
