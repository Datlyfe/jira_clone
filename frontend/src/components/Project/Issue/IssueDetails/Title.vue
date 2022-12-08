<template>
  <div class="inline-block w-full h-10 mt-4 -ml-2">
    <j-textarea
      placeholder="Short summary"
      class="title"
      @input="(e:string) => (title = e)"
      @blur="updateIssueDescription"
      :value="value"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  props: {
    value: {
      type: String,
      default: '',
    },
    updateIssue: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const isWorking = ref<boolean>(false)
    const title = ref<string>(props.value)

    const updateIssueDescription = async () => {
      try {
        isWorking.value = true
        await props.updateIssue({ title: title.value })
        isWorking.value = false
      } catch (error) {
        console.error(error)
      }
    }

    return {
      title,
      isWorking,
      updateIssueDescription,
    }
  },
})
</script>

<style lang="postcss" scoped>
.title {
  border-color: transparent !important;
  /* @apply h-auto font-medium text-2xl text-textDarkest; */
}
</style>
