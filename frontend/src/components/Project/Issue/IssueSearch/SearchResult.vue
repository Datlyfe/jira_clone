<template>
  <div
    @click="selectResult"
    class="flex items-center py-1 px-3 rounded transition duration-100 cursor-pointer select-none hover:bg-backgroundLight"
  >
    <j-icon :size="24" class="flex-shrink-0" :name="issue.type"></j-icon>
    <div class="pl-4">
      <div class="text-textDark text-15">{{ issue.title }}</div>
      <div class="uppercase text-xs text-textMedium">
        {{ `${issue.type}-${issue.id}` }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { Issue } from '@/types/issue'
import Modal from '@/components/Modals/Modal.vue'
import IssueDetails from '@/components/Project/Issue/IssueDetails/IssueDetails.vue'
import eventBus from '@/utils/eventBus'

export default defineComponent({
  components: {
    Modal
  },
  props: {
    issue: {
      type: Object as () => Issue,
      default: null
    }
  },
  setup(props) {
    const selectResult = () => {
      eventBus.$emit('close-search-modal')
      eventBus.$emit('toggle-issue-details', true, props.issue.id)
    }
    return {
      selectResult,
      IssueDetails
    }
  }
})
</script>

<style></style>
