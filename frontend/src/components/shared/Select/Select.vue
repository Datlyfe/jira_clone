<template>
  <div
    class="select"
    ref="selectRef"
    :class="[variant]"
    @keydown="handleFocusedSelectKeydown"
  >
    <div
      class="valueContainer text-textDarkest"
      :data-testid="name ? `select:${name}` : 'select'"
      @click="activateDropdown"
    >
      <div class="placeholder" v-if="isValueEmpty">{{ placeholder }}</div>

      <slot
        v-if="!isValueEmpty && !isMulti && customRender"
        v-bind="getOption(localValue)"
      />
      <template v-else>
        {{ getOptionLabel(localValue) }}
      </template>

      <div v-if="!isValueEmpty && isMulti" class="valueMulti text-textDarkest">
        <div
          class="my-1 mx-1 flex items-center"
          v-for="optionValue in localValue"
          :key="optionValue"
        >
          <slot
            v-if="customRender"
            v-bind="{
              ...getOption(optionValue),
              optionValue,
              remove: removeOptionValue
            }"
          />
          <div v-else class="valueMultiItem text-textDarkest">
            <div class="valueMultiItemLabel">
              {{ getOptionLabel(optionValue) }}
            </div>
            <div
              @click="removeOptionValue(optionValue)"
              class="valueMultiItemClose"
            >
              <svg class="icon" viewBox="0 0 24 24">
                <path
                  d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="addMore m-1">
          <svg
            class="icon"
            viewBox="0 0 24 24"
            focusable="false"
            role="presentation"
          >
            <path
              d="M13 11V3.993A.997.997 0 0 0 12 3c-.556 0-1 .445-1 .993V11H3.993A.997.997 0 0 0 3 12c0 .557.445 1 .993 1H11v7.007c0 .548.448.993 1 .993.556 0 1-.445 1-.993V13h7.007A.997.997 0 0 0 21 12c0-.556-.445-1-.993-1H13z"
              fill="currentColor"
              fill-rule="evenodd"
            ></path>
          </svg>
          <div class="font-medium">Add more</div>
        </div>
      </div>

      <j-icon
        v-if="(!isMulti || isValueEmpty) && variant !== 'empty'"
        class="ml-auto mr-1"
        name="chevron-down"
      ></j-icon>
    </div>

    <Dropdown
      v-if="isDropdownOpen"
      ref="dropdownRef"
      isValueEmpty
      :dropdownWidth="dropdownWidth"
      :searchable="searchable"
      :searchValue="searchValue"
      :value="localValue"
      :deactivateDropdown="deactivateDropdown"
      :options="options"
      :isMulti="isMulti"
      :withClearValue="withClearValue"
      @change="handleChange"
      @searchValueChange="handleSearchValueChange"
    >
      <template v-slot:option="props">
        <slot v-if="customRenderOption" name="option" v-bind="props" />
        <slot v-else v-bind="props" />
      </template>
    </Dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api'
import Dropdown from './Dropdown.vue'
import { useOutsideClick } from '../../../hooks/useOutsideClick'

interface Option {
  label: string
  value: number | string
}

export default defineComponent({
  name: 'j-select',
  props: {
    dropdownWidth: {
      type: Number,
      default: undefined
    },
    variant: {
      type: String,
      default: 'normal'
    },
    name: {
      type: String,
      default: undefined
    },
    customRender: {
      type: Boolean,
      default: false
    },
    customRenderOption: {
      type: Boolean,
      default: false
    },
    searchable: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Array, String, Number],
      default: undefined
    },
    defaultValue: {
      type: [String, Array, Number],
      default: undefined
    },
    placeholder: {
      type: String,
      default: 'Select'
    },
    invalid: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array as () => Array<Option>,
      required: true
    },
    isMulti: {
      type: Boolean,
      default: false
    },
    withClearValue: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Dropdown
  },
  setup(props, { emit, root }) {
    const selectRef = ref<HTMLDivElement>(null)
    const dropdownRef = ref<HTMLDivElement>(null)
    const isDropdownOpen = ref<boolean>(false)
    const searchValue = ref<string>('')
    const stateValue = ref(props.defaultValue || (props.isMulti ? [] : null))

    const getOption = (
      optionValue: string | number | Array<number | string>
    ) => {
      return props.options.find(option => option.value === optionValue)
    }

    const getOptionLabel = (
      optionValue: string | number | Array<number | string>
    ) => {
      return (getOption(optionValue) || { label: '' }).label
    }
    const isControlled = computed(() => props.value != undefined)

    const localValue = computed(() =>
      isControlled.value ? props.value : stateValue.value
    )

    const preserveValueType = (
      newValue: string | number | Array<number | string>
    ) => {
      const areOptionValuesNumbers = props.options.some(
        option => typeof option.value === 'number'
      )

      if (areOptionValuesNumbers) {
        if (props.isMulti) {
          return (newValue as [string | number]).map(Number)
        }
        if (newValue) {
          return Number(newValue)
        }
      }
      return newValue
    }

    const handleChange = (
      newValue: string | number | Array<number | string>
    ) => {
      if (!isControlled.value) {
        stateValue.value = preserveValueType(newValue)
      }
      emit('change', preserveValueType(newValue))
    }

    const removeOptionValue = (
      optionValue: string | number | Array<number | string>
    ) => {
      handleChange(
        (localValue.value as [string | number]).filter(
          val => val !== optionValue
        )
      )
    }

    const isValueEmpty = computed(() =>
      props.isMulti
        ? !(localValue.value as [string | number]).length
        : !getOption(
            localValue.value as string | number | Array<number | string>
          )
    )

    const handleFocusedSelectKeydown = (event: KeyboardEvent) => {
      if (isDropdownOpen.value) return
      if (event.keyCode === 13) {
        event.preventDefault()
      }
      if (event.keyCode !== 27 && event.keyCode !== 9 && !event.shiftKey) {
        isDropdownOpen.value = true
      }
    }

    const deactivateDropdown = async () => {
      isDropdownOpen.value = false
      searchValue.value = ''
      await root.$nextTick()
      selectRef.value && selectRef.value.focus()
    }
    const activateDropdown = async () => {
      isDropdownOpen.value = true
      await root.$nextTick()
      selectRef.value && selectRef.value.blur()
      // eslint-disable-next-line
      props.searchable && (dropdownRef.value as any).$refs.inputRef.focus()
    }
    const handleSearchValueChange = (newValue: string) => {
      searchValue.value = newValue
    }

    useOutsideClick(ref(document.body), selectRef, deactivateDropdown)

    return {
      selectRef,
      dropdownRef,
      isDropdownOpen,
      searchValue,
      stateValue,
      getOption,
      removeOptionValue,
      getOptionLabel,
      localValue,
      isValueEmpty,
      activateDropdown,
      deactivateDropdown,
      handleFocusedSelectKeydown,
      handleSearchValueChange,
      handleChange
    }
  }
})
</script>

<style lang="scss" scoped>
.select {
  position: relative;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.1s;
  &:focus {
    outline: none;
  }
}

.valueContainer {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 32px;
}
.placeholder {
  color: #8993a4;
}
.valueMulti {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  // padding-top: 5px;
}
.valueMultiItem {
  height: 22px;
  overflow: hidden;
  border-radius: 3px;
  display: flex;
  align-items: center;
  user-select: none;
  background: #f0f0f0;
  font-size: 14px;
  .valueMultiItemLabel {
    flex: auto;
    padding: 0 4px;
    height: 100%;
    display: flex;
    align-items: center;
    border-right: 1px solid #ddd;
  }
  .valueMultiItemClose {
    border-left: none;
    overflow: hidden;
    padding: 0 2px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background: #ff4757;
      color: white;
    }
    .icon {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }
  }
}
.addMore {
  font-size: 12.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #0052cc;
  &:hover,
  &:visited,
  &:active {
    color: #0052cc;
  }
  &:hover {
    text-decoration: underline;
  }
  .icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
    margin-right: 2px;
  }
}
</style>

<style lang="postcss" scoped>
.select.normal {
  @apply w-full px-2 border border-borderLightest bg-backgroundLightest;
}
.select.normal:hover {
  @apply bg-backgroundLight;
}
.select.normal:focus {
  @apply border border-borderInputFocus bg-white text-borderInputFocus;
  box-shadow: 0 0 0 1px currentColor;
}

.select.empty {
  display: inline-block;
}
</style>
