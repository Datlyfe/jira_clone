<template>
  <div>
    <div class="mt-6 mb-1 uppercase text-textMedium text-13 font-bold">
      status
    </div>
    <j-select
      searchable
      variant="empty"
      :dropdownWidth="300"
      :withClearValue="false"
      :options="issueStatusOptions"
      :value="value"
      @change="updateIssueStatus"
      customRender
      customRenderOption
    >
      <template v-slot:default="{ label }">
        <j-button
          class="uppercase text-textMedium text-13"
          :variant="issueStatusVariants[value]"
        >
          {{ label }}
        </j-button>
      </template>
      <template v-slot:option="{ label }">
        <div class="flex items-center pr-1 pl-2">
          <div class="text-15 pr-1 pl-2">
            {{ label }}
          </div>
        </div>
      </template>
    </j-select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { IssueStatusCopy, IssueStatus } from '@/types/issue'
import { issueStatusVariants } from '@/utils/colors'
export default defineComponent({
  props: {
    value: {
      type: String as () => IssueStatus,
      required: true
    },
    updateIssue: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const issueStatusOptions = Object.values(IssueStatus).map(status => ({
      value: status,
      label: IssueStatusCopy[status]
    }))
    const updateIssueStatus = async (status: IssueStatus) => {
      try {
        await props.updateIssue({ status })
      } catch (error) {
        console.error(error)
      }
    }

    return {
      issueStatusOptions,
      issueStatusVariants,
      updateIssueStatus
    }
  }
})
</script>

<style></style>
