<template>
  <div>
    <Modal
      v-if="isIssueCreateOpen"
      @close="isIssueCreateOpen = false"
      :width="700"
      :component="IssueCreate"
    />
    <Modal
      v-if="isIssueSearchOpen"
      @close="isIssueSearchOpen = false"
      variant="aside"
      :width="600"
      :component="IssueSearch"
    />

    <Modal
      v-if="isIssueDetailsOpen"
      @close="isIssueDetailsOpen = false"
      :width="1040"
      :component="IssueDetails"
      :componentProps="{ issueId }"
    />
    <Modal
      v-if="isIssueDeleteOpen"
      @confirm="confirmIssueDelete"
      @close="isIssueDeleteOpen = false"
      :width="600"
      :component="Confirm"
      :componentProps="issueDeleteProps"
    />

    <Modal
      v-if="isCommentDeleteOpen"
      @confirm="confirmCommentDelete"
      @close="isCommentDeleteOpen = false"
      :width="600"
      :component="Confirm"
      :componentProps="commentDeleteProps"
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineComponent, ref } from '@vue/composition-api'
import IssueCreate from '@/components/Project/Issue/IssueCreate/IssueCreate.vue'
import IssueSearch from '@/components/Project/Issue/IssueSearch/IssueSearch.vue'
import IssueDetails from '@/components/Project/Issue/IssueDetails/IssueDetails.vue'
import Confirm from './Confirm.vue'
import Modal from './Modal.vue'
import eventBus from '@/utils/eventBus'
export default defineComponent({
  components: {
    Modal
  },
  setup() {
    const isIssueCreateOpen = ref<boolean>(false)
    const isIssueSearchOpen = ref<boolean>(false)
    const isIssueDetailsOpen = ref<boolean>(false)
    const isIssueDeleteOpen = ref<boolean>(false)
    const isCommentDeleteOpen = ref<boolean>(false)
    const issueId = ref<string>(false)
    const commentId = ref<string>(false)

    eventBus.$on(
      'toggle-issue-details',
      (isOpen: boolean, id: string | number) => {
        if (isOpen) {
          issueId.value = `${id}`
        }
        isIssueDetailsOpen.value = isOpen
      }
    )
    eventBus.$on('toggle-issue-search', (isOpen: boolean) => {
      isIssueSearchOpen.value = isOpen
    })
    eventBus.$on('toggle-issue-create', (isOpen: boolean) => {
      isIssueCreateOpen.value = isOpen
    })
    eventBus.$on('toggle-issue-delete', (isOpen: boolean) => {
      isIssueDeleteOpen.value = isOpen
    })
    eventBus.$on(
      'toggle-comment-delete',
      (isOpen: boolean, id: string | number) => {
        if (isOpen) {
          commentId.value = `${id}`
        }
        isCommentDeleteOpen.value = isOpen
      }
    )

    const issueDeleteProps = {
      title: 'Are you sure you want to delete this issue?',
      message: "Once you delete, it's gone for good.",
      confirmText: 'Delete issue',
      variant: 'primary'
    }
    const commentDeleteProps = {
      title: 'Are you sure you want to delete this comment?',
      message: "Once you delete, it's gone for good.",
      confirmText: 'Delete comment',
      variant: 'primary'
    }

    const confirmIssueDelete = () => {
      eventBus.$emit('confirm-issue-delete')
    }
    const confirmCommentDelete = () => {
      eventBus.$emit('confirm-comment-delete', commentId.value)
    }

    return {
      IssueCreate,
      IssueDetails,
      IssueSearch,
      Confirm,
      isIssueCreateOpen,
      isIssueSearchOpen,
      isIssueDetailsOpen,
      isIssueDeleteOpen,
      isCommentDeleteOpen,
      issueDeleteProps,
      commentDeleteProps,
      confirmIssueDelete,
      confirmCommentDelete,
      issueId
    }
  }
})
</script>
