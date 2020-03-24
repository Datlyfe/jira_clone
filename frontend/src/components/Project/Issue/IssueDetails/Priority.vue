<template>
  <div>
    <div class="mt-6 mb-1 uppercase text-textMedium text-13 font-bold">
      Priority
    </div>
    <j-select
      searchable
      variant="empty"
      :dropdownWidth="300"
      :value="value"
      :options="issuePriorityOptions"
      customRender
      customRenderOption
      @change="updateIssuePriority"
    >
      <template v-slot:default="{ label, icon, color }">
        <j-button variant="secondary">
          <div class="flex items-center">
            <j-icon :style="{ color }" :size="18" :name="icon"></j-icon>

            <div class="pr-1 pl-2">
              {{ label }}
            </div>
          </div>
        </j-button>
      </template>
      <template v-slot:option="{ label, icon, color }">
        <div class="my-px mr-4 flex items-center">
          <j-icon :style="{ color }" :size="18" :name="icon"></j-icon>

          <div class="pr-1 pl-2">
            {{ label }}
          </div>
        </div>
      </template>
    </j-select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { IssuePriority, IssuePriorityCopy } from '@/types/issue'
import { issuePriorityColors } from '@/utils/colors'
export default defineComponent({
  props: {
    value: {
      type: String as () => IssuePriority,
      required: true
    },
    updateIssue: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const issuePriorityOptions = Object.values(IssuePriority).map(priority => ({
      value: priority,
      label: IssuePriorityCopy[priority],
      icon: [IssuePriority.LOW, IssuePriority.LOWEST].includes(priority)
        ? 'arrow-down'
        : 'arrow-up',
      color: issuePriorityColors[priority]
    }))
    const updateIssuePriority = async (priority: IssuePriority) => {
      try {
        await props.updateIssue({ priority })
      } catch (error) {
        console.error(error)
      }
    }

    return {
      issuePriorityOptions,
      updateIssuePriority
    }
  }
})
</script>

<style></style>
