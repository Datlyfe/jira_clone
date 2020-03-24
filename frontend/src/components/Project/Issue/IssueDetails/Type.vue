<template>
  <j-select
    searchable
    variant="empty"
    :dropdownWidth="150"
    :withClearValue="false"
    :options="issueTypeOptions"
    :value="value"
    @change="updateIssueType"
    customRender
    customRenderOption
  >
    <template v-slot:default="{ label, icon }">
      <j-button
        class="uppercase text-textMedium text-13"
        :iconSize="20"
        variant="empty"
        :icon="icon"
      >
        {{ `${label}-${issueId}` }}
      </j-button>
    </template>
    <template v-slot:option="{ label, icon }">
      <div class=" pr-1 pl-2 flex items-center">
        <j-icon :name="icon" :size="20" class="mr-1"></j-icon>

        <div class="text-15 pr-1 pl-2">
          {{ label }}
        </div>
      </div>
    </template>
  </j-select>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { IssueType, IssueTypeCopy } from '@/types/issue'
export default defineComponent({
  props: {
    value: {
      type: String as () => IssueType,
      required: true
    },
    issueId: {
      type: [String, Number],
      required: true
    },
    updateIssue: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const issueTypeOptions = Object.values(IssueType).map(type => ({
      value: type,
      label: IssueTypeCopy[type],
      icon: IssueTypeCopy[type].toLowerCase()
    }))
    const updateIssueType = async (type: IssueType) => {
      try {
        await props.updateIssue({ type })
      } catch (error) {
        console.error(error)
      }
    }

    return {
      issueTypeOptions,
      updateIssueType
    }
  }
})
</script>

<style></style>
