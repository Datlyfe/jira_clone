<template>
  <div class="issue-wrap">
    <div
      @click="openIssueDetails"
      class="issue rounded-sm bg-white  transition-all duration-100 select-none hover:bg-backgroundLight "
    >
      <p class="pb-3 text-15 text-textDarkest">
        {{ issue.title }}
      </p>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <j-icon
            :name="issue.type"
            :size="20"
            class="mr-1 text-textMedium"
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
            :key="user?.id"
            :size="24"
            :avatarUrl="user?.avatarUrl"
            :name="user?.name"
            class="-ml-1 shadow-outline-white"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
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
      eventBus.emit('toggle-issue-details', {
        isOpen: true,
        id: props.issue.id
      })
    }

    return {
      assignees,
      issuePriorityStyles,
      openIssueDetails
    }
  }
})
</script>

<style lang="scss" scoped>
.issue-wrap {
  touch-action: manipulation;
  cursor: grab;
  margin-bottom: 5px;
}
.issue {
  padding: 10px;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 2px 0px;
}
</style>
