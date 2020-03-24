<template>
  <div class="issue-wrap">
    <div @click="openIssueDetails" class="issue">
      <p class="pb-3 text-15 text-textDarkest">
        {{ issue.title }}
      </p>
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <j-icon
            :name="issue.type"
            :size="20"
            class="text-textMedium mr-1"
          ></j-icon>

          <j-icon
            :style="{ color: issuePriorityStyles.color }"
            :name="issuePriorityStyles.icon"
            :size="20"
          ></j-icon>
        </div>
        <div class="flex flex-row-reverse ml-1">
          <j-avatar
            v-for="user in assignees"
            :key="user.id"
            :size="24"
            :avatarUrl="user.avatarUrl"
            :name="user.name"
            class="shadow-outline-white -ml-1"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { Issue, IssuePriority } from '@/types/issue'
import { getters } from '@/store'
import { issuePriorityColors } from '@/utils/colors'
import eventBus from '@/utils/eventBus'

export default defineComponent({
  props: {
    issue: {
      type: Object as () => Issue,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const project = computed(getters.project)
    const assignees = computed(() =>
      props.issue.userIds.map(userId =>
        project.value.users.find(user => user.id === userId)
      )
    )

    const issuePriorityStyles = computed(() => ({
      icon: [IssuePriority.LOW, IssuePriority.LOWEST].includes(
        props.issue.priority
      )
        ? 'arrow-down'
        : 'arrow-up',
      color: issuePriorityColors[props.issue.priority]
    }))

    const openIssueDetails = () => {
      eventBus.$emit('toggle-issue-details', true, props.issue.id)
    }

    return {
      assignees,
      issuePriorityStyles,
      openIssueDetails
    }
  }
})
</script>

<style lang="postcss" scoped>
.issue-wrap {
  touch-action: manipulation;
  cursor: grab;
  margin-bottom: 5px;
}
.issue {
  @apply rounded-sm bg-white  transition-all duration-100 select-none;
  padding: 10px;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 2px 0px;
}
.issue:hover {
  @apply bg-backgroundLight;
}
</style>
