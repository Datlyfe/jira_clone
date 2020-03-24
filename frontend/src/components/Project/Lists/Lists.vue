<template>
  <div class="flex container mt-7">
    <List
      @drop="onDrop"
      v-for="status in IssueStatus"
      :key="status"
      :status="status"
    >
    </List>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api'
import List from '@/components/Project/Lists/List.vue'
import { IssueStatus } from '@/types/issue'
import { getters, mutations } from '@/store'
import {
  DropResult,
  Target,
  calculateIssueListPosition,
  isPositionChanged,
  updateArrayItemById
} from '@/utils/dnd'
import { useMutation } from '@vue/apollo-composable'
import { updateIssueMutation } from '@/graphql/queries/issue'

export default defineComponent({
  components: {
    List
  },
  setup() {
    const project = computed(getters.project)
    const destination = ref<Target>(null)
    const source = ref<Target>(null)

    const { mutate } = useMutation(updateIssueMutation)

    const handleIssueDrop = (issueId: string, d: Target, s: Target) => {
      if (!isPositionChanged(s, d)) return

      const issueUpdateValues = {
        status: d.droppableId,
        listPosition: calculateIssueListPosition(
          project.value.issues,
          d,
          s,
          issueId
        )
      }

      const issues = updateArrayItemById(
        project.value.issues,
        issueId,
        issueUpdateValues
      )

      const oldProjectValues = getters.project()
      // optimistic update
      mutations.setProject({
        ...project.value,
        issues
      })

      mutate({
        issueId: Number(issueId),
        issue: issueUpdateValues
        // eslint-disable-next-line
      } as any).catch(e => {
        console.error(e)
        mutations.setProject(oldProjectValues)
      })
      destination.value = null
      source.value = null
    }

    const onDrop = (dropResult: DropResult) => {
      const { removedIndex, addedIndex, payload, to } = dropResult

      if (removedIndex == null && addedIndex == null) return

      if (removedIndex != null) {
        source.value = {
          index: removedIndex,
          droppableId: payload.status
        }
      }

      if (addedIndex != null) {
        destination.value = {
          index: addedIndex,
          droppableId: Object.values(IssueStatus)[to]
        }
      }

      if (destination.value != null && source.value != null) {
        handleIssueDrop(payload.id, destination.value, source.value)
      }
    }

    return {
      onDrop,
      IssueStatus
    }
  }
})
</script>
