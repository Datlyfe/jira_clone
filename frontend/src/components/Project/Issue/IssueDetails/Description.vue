<template>
  <div>
    <div class="pt-5 pb-2 text-15 text-textDarkest">Description</div>
    <j-text-editor
      @changeMode="handleModeChange"
      :mode="mode"
      :value="initialValue"
      ref="editor"
      placeholder="Describe the issue"
    />
    <div v-if="!readOnly" class="pt-3 flex items-center">
      <j-button
        :isWorking="isWorking"
        @click="updateIssueDescription"
        variant="primary"
        class="mr-2"
      >
        Save</j-button
      ><j-button @click="cancelWrite" variant="empty">
        Cancel
      </j-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api'
export default defineComponent({
  props: {
    initialValue: {
      type: String,
      default: ''
    },
    updateIssue: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const mode = ref<string>('read')
    const isWorking = ref<boolean>(false)
    const editor = ref<HTMLDivElement>(null)

    const readOnly = computed(() => mode.value == 'read')

    const handleModeChange = (m: string) => (mode.value = m)

    const cancelWrite = () => {
      handleModeChange('read')
    }

    const updateIssueDescription = async () => {
      try {
        isWorking.value = true
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const description = (editor.value as any).getHTMLValue()
        await props.updateIssue({ description })
        isWorking.value = false
        handleModeChange('read')
      } catch (error) {
        console.error(error)
      }
    }

    return {
      mode,
      readOnly,
      editor,
      isWorking,
      cancelWrite,
      handleModeChange,
      updateIssueDescription
    }
  }
})
</script>

<style></style>
