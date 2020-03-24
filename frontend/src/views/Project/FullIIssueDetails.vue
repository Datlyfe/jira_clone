<template>
  <div
    class="pr-6 py-8 pl-10  h-full w-full flex flex-col h-full w-full flex flex-col"
  >
    <j-breadcrumbs :items="['Projects', project.name, 'Issues', issueId]" />
    <IssueDetails
      :issueId="issueId"
      :withFullScreenButton="false"
      :withCloseButton="false"
      class="full-issue-details mt-5"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import IssueDetails from '@/components/Project/Issue/IssueDetails/IssueDetails.vue'
import { getters } from '@/store'
export default defineComponent({
  props: {
    issueId: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    IssueDetails
  },
  setup() {
    const project = computed(getters.project)
    return {
      project
    }
  }
})
</script>

<style lang="scss">
.full-issue-details {
  max-width: 987px;
}
</style>
