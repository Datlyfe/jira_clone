<template>
  <div class="dropdown" :style="{ width: `${dropdownWidth}px` }">
    <input
      v-if="searchable"
      class="dropdownInput"
      type="text"
      ref="inputRef"
      placeholder="Search"
      @input="handleSearchValueChange"
      @keydown="handleInputKeyDown"
    />

    <div class="options" ref="optionsRef">
      <div
        class="option text-textDarkest"
        v-for="option in filteredOptions"
        :key="option.value"
        :data-select-option-value="option.value"
        :data-testid="`select-option:${option.label}`"
        @mouseenter="handleOptionMouseEnter"
        @click="selectOptionValue(option.value)"
      >
        <slot name="option" v-bind="option">{{ option.label }}</slot>
      </div>

      <div
        v-if="isOptionCreatable"
        class="option text-textDarkest"
        :data-create-option-label="{ searchValue }"
        @mouseenter="handleOptionMouseEnter"
        @click="createOption(searchValue)"
      >
        {{
          isCreatingOption
            ? `Creating "${searchValue}"...`
            : `Create
        "${searchValue}"`
        }}
      </div>
    </div>

    <div v-if="filteredOptions.length === 0" class="optionsNoResults">
      No results
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from '@vue/composition-api'
const activeOptionClass = 'select-option-is-active'

interface Option {
  label: string
  value: number | string
}

export default defineComponent({
  props: {
    dropdownWidth: {
      type: Number,
      default: undefined
    },
    value: {
      type: [Array, String, Number],
      default: undefined
    },
    isValueEmpty: {
      type: Boolean,
      required: true
    },
    searchable: {
      type: Boolean,
      default: false
    },
    searchValue: {
      type: String,
      required: true
    },
    deactivateDropdown: {
      type: Function,
      required: true
    },
    options: {
      type: Array as () => Array<Option>,
      required: true
    },
    onCreate: {
      type: Function,
      default: undefined
    },
    isMulti: {
      type: Boolean,
      required: true
    },
    withClearValue: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit, root }) {
    const isCreatingOption = ref<boolean>(false)
    const optionsRef = ref<HTMLDivElement>(null)

    const optionsFilteredBySearchValue = computed(() =>
      props.options.filter(option =>
        option.label
          .toString()
          .toLowerCase()
          .includes(props.searchValue.toLowerCase())
      )
    )

    const filteredOptions = computed(() =>
      props.isMulti
        ? optionsFilteredBySearchValue.value.filter(
            option => !(props.value as [string | number]).includes(option.value)
          )
        : optionsFilteredBySearchValue.value.filter(
            option => props.value !== option.value
          )
    )

    const isOptionCreatable = computed(
      () =>
        props.onCreate &&
        props.searchValue &&
        !props.options.map(option => option.label).includes(props.searchValue)
    )

    const handleSearchValueChange = (event: InputEvent) => {
      emit('searchValueChange', (event.target as HTMLInputElement).value)
    }

    const getActiveOptionNode = async () => {
      await root.$nextTick()
      return optionsRef.value
        ? optionsRef.value.querySelector(`.${activeOptionClass}`)
        : null
    }

    const selectOptionValue = (
      optionValue: string | Array<number | string> | number
    ) => {
      if (props.isMulti) {
        emit('change', [
          ...new Set([...(props.value as Array<string | number>), optionValue])
        ])
      } else {
        props.deactivateDropdown()
        emit('change', optionValue)
      }
    }

    const createOption = (newOptionLabel: string) => {
      isCreatingOption.value = true
      props.onCreate(
        newOptionLabel,
        (createdOptionValue: string | Array<number | string> | number) => {
          isCreatingOption.value = false
          selectOptionValue(createdOptionValue)
        }
      )
    }

    const handleInputEnterKeyDown = async (event: KeyboardEvent) => {
      event.preventDefault()

      const $active = await getActiveOptionNode()
      if (!$active) return

      const optionValueToSelect = $active.getAttribute(
        'data-select-option-value'
      )
      const optionLabelToCreate = $active.getAttribute(
        'data-create-option-label'
      )

      if (optionValueToSelect) {
        selectOptionValue(optionValueToSelect)
      } else if (optionLabelToCreate) {
        createOption(optionLabelToCreate)
      }
    }

    const handleInputArrowUpOrDownKeyDown = async (event: KeyboardEvent) => {
      const $active = (await getActiveOptionNode()) as HTMLElement
      const $options = optionsRef.value
      if (!$active || !$options) return

      const $optionsHeight = $options.getBoundingClientRect().height
      const $activeHeight = $active.getBoundingClientRect().height

      if (event.keyCode === 40) {
        if ($options.lastElementChild === $active) {
          $active.classList.remove(activeOptionClass)
          $options.firstElementChild?.classList.add(activeOptionClass)
          $options.scrollTop = 0
        } else {
          $active.classList.remove(activeOptionClass)
          $active.nextElementSibling?.classList.add(activeOptionClass)
          if ($active.offsetTop > $options.scrollTop + $optionsHeight / 1.4) {
            $options.scrollTop += $activeHeight
          }
        }
      } else if (event.keyCode === 38) {
        if ($options.firstElementChild === $active) {
          $active.classList.remove(activeOptionClass)
          $options.lastElementChild?.classList.add(activeOptionClass)
          $options.scrollTop = $options.scrollHeight
        } else {
          $active.classList.remove(activeOptionClass)
          $active.previousElementSibling?.classList.add(activeOptionClass)
          if ($active.offsetTop < $options.scrollTop + $optionsHeight / 2.4) {
            $options.scrollTop -= $activeHeight
          }
        }
      }
    }

    const handleInputEscapeKeyDown = (event: KeyboardEvent) => {
      event.stopImmediatePropagation()
      props.deactivateDropdown()
    }
    const handleInputKeyDown = (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        handleInputEscapeKeyDown(event)
      } else if (event.keyCode === 13) {
        handleInputEnterKeyDown(event)
      } else if (event.keyCode === 40 || event.keyCode === 38) {
        handleInputArrowUpOrDownKeyDown(event)
      }
    }

    const handleOptionMouseEnter = async (event: MouseEvent) => {
      const $active = await getActiveOptionNode()
      if ($active) $active.classList.remove(activeOptionClass)
      ;(event.currentTarget as HTMLElement).classList.add(activeOptionClass)
    }

    const setFirstOptionAsActive = async () => {
      const $active = await getActiveOptionNode()
      if (!optionsRef.value) return
      if ($active) $active.classList.remove(activeOptionClass)

      if (optionsRef.value.firstElementChild) {
        optionsRef.value.firstElementChild.classList.add(activeOptionClass)
      }
    }

    onMounted(() => {
      setFirstOptionAsActive()
    })

    return {
      optionsRef,
      isCreatingOption,
      optionsFilteredBySearchValue,
      filteredOptions,
      isOptionCreatable,
      getActiveOptionNode,
      selectOptionValue,
      handleSearchValueChange,
      handleInputEnterKeyDown,
      handleInputArrowUpOrDownKeyDown,
      handleInputKeyDown,
      handleOptionMouseEnter
    }
  }
})
</script>

<style scoped lang="scss">
.dropdown {
  z-index: 101;
  position: absolute;
  top: calc(100% + 4px);
  left: -1px;
  border-radius: 0 0 4px 4px;
  background: #fff;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
    rgba(9, 30, 66, 0.31) 0px 0px 1px;
  width: 100%;
}

.dropdownInput {
  padding: 10px 14px 8px;
  width: 100%;
  border: none;
  color: #172b4d;
  background: none;
  &:focus {
    outline: none;
  }
}

.options {
  padding: 5px 0;
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  // &::-webkit-scrollbar {
  //   width: 7px;
  // }
  // &::-webkit-scrollbar-track {
  //   background: none;
  // }
  // &::-webkit-scrollbar-thumb {
  //   // border-radius: 99px;
  //   background: #d1d1d1;
  // }
}

.option {
  padding: 8px 14px;
  word-break: break-word;
  cursor: pointer;
  &.select-option-is-active {
    background: #e8ecee;
  }
}

.optionsNoResults {
  padding: 0px 15px 10px;
  color: #8993a4;
}
</style>
