<template>
  <div class="list">
    <div class="px-3 pb-4 pt-3 uppercase text-textMedium text-13 truncate">
      {{ IssueStatusCopy[status] }}
      <span class="lowercase text-13">{{ formatedIssuesCount }}</span>
    </div>
    <div class="h-full px-2">
      <Container
        class="h-full"
        group-name="board"
        @drop="onDrop"
        drag-class="card-ghost"
        drop-class="card-ghost-drop"
        :get-child-payload="getCardPayload"
        :drop-placeholder="dropPlaceholderOptions"
      >
        <Draggable v-for="(issue, index) in filteredListIssues" :key="issue.id">
          <Issue :issue="issue" :index="index" />
        </Draggable>
      </Container>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import { defineComponent, computed } from '@vue/composition-api'
import { Container, Draggable } from 'vue-smooth-dnd'

import issueComponent from '@/components/Project/Issue/Issue.vue'
import { Filters } from '@/types/filters'
import { Issue, IssueStatusCopy, IssueStatus } from '@/types/issue'
import { getters } from '@/store'
import { DropResult, getSortedListIssues } from '../../../utils/dnd'

const filterIssues = (
  projectIssues: Array<Issue>,
  filters: Filters,
  currentUserId: string
) => {
  const { searchTerm, userIds, myOnly, recent } = filters

  let issues = [...projectIssues]

  if (searchTerm) {
    issues = issues.filter(issue =>
      issue.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }
  if (userIds.length > 0) {
    issues = issues.filter(
      issue =>
        [issue.userIds, userIds].reduce((a, b) => a.filter(c => b.includes(c)))
          .length > 0
    )
  }
  if (myOnly && currentUserId) {
    issues = issues.filter(issue => issue.userIds.includes(currentUserId))
  }
  if (recent) {
    issues = issues.filter(issue =>
      dayjs(issue.updatedAt).isAfter(dayjs().subtract(3, 'day'))
    )
  }
  return issues
}

export default defineComponent({
  props: {
    status: {
      type: String,
      required: true
    }
  },
  components: {
    Issue: issueComponent,
    Container,
    Draggable
  },
  setup(props, { emit }) {
    const project = computed(getters.project)
    const filters = computed(getters.filters)
    const currentUserId = computed(() => getters.currentUser().id)

    const filteredIssues = computed(() =>
      filterIssues(project.value.issues, filters.value, currentUserId.value)
    )
    const filteredListIssues = computed(() =>
      getSortedListIssues(filteredIssues.value, props.status)
    )

    const allListIssues = computed(() =>
      getSortedListIssues(project.value.issues, props.status)
    )

    const formatedIssuesCount = computed(() => {
      if (allListIssues.value.length !== filteredListIssues.value.length) {
        return `${filteredListIssues.value.length} of ${allListIssues.value.length}`
      }
      return allListIssues.value.length
    })

    const dropPlaceholderOptions = {
      className: 'drop-preview',
      animationDuration: '150',
      showOnTop: true
    }

    // eslint-disable-next-line
    const onDrop = (dropResult: any) => {
      const arr = Object.values(IssueStatus)
      const to = arr.indexOf(props.status as IssueStatus)
      emit('drop', { ...dropResult, to } as DropResult)
    }
    const getCardPayload = (index: number) => {
      const issuesByStatus = getSortedListIssues(
        filteredListIssues.value,
        props.status
      )
      return issuesByStatus[index]
    }
    return {
      onDrop,
      getCardPayload,
      dropPlaceholderOptions,
      filteredListIssues,
      formatedIssuesCount,
      IssueStatusCopy
    }
  }
})
</script>

<style lang="postcss" scoped>
.list {
  @apply mr-2 flex flex-col  rounded-sm bg-backgroundLightest flex-shrink-0;
  width: calc(100% / 4 - 8px);
  min-height: 400px;
  min-width: 200px;
}
</style>

<style lang="scss">
.drop-preview {
  background-color: rgba(150, 150, 200, 0.1);
  border: 1px dashed #abc;
  margin: 5px;
}
.card-ghost {
  transition: transform 0.18s ease;
  transform: rotateZ(5deg);
}
.card-ghost-drop {
  transition: transform 0.18s ease-in-out;
  transform: rotateZ(0deg);
}
</style>
