<template>
  <IssueLoader v-if="!issueCopy" />
  <div class="w-full h-full" v-else>
    <div class="flex items-center px-3 pt-4 text-textDarkest">
      <!-- Type -->
      <IssueType
        :updateIssue="handleUpdateIssue"
        :issueId="issueCopy.id"
        :value="issueCopy.type"
      />
      <div class="flex-auto"></div>
      <j-button icon="feedback" variant="empty">Give Feedback</j-button>
      <j-button @click="copyIssueLink" icon="link" variant="empty"
        >Copy Link</j-button
      >
      <j-button @click="triggerIssueDelete" icon="trash" variant="empty" />
      <j-button
        v-if="withFullScreenButton"
        @click="goFullScreen"
        icon="expand"
        :iconSize="24"
        variant="empty"
      />
      <j-button
        v-if="withCloseButton"
        @click="$emit('close')"
        icon="times"
        :iconSize="24"
        variant="empty"
      />
    </div>
    <div class="flex w-full flex-wrap pb-16 px-7">
      <!-- LEFT SECTION -->
      <div class="sm:w-full md:w-7/12 lg:w-4/6 pr-10">
        <!-- Title -->
        <IssueTitle :updateIssue="handleUpdateIssue" :value="issueCopy.title" />
        <!-- Description -->
        <IssueDescription
          :updateIssue="handleUpdateIssue"
          :initialValue="issueCopy.description"
        />
        <!-- Comments -->
        <div class="pt-10">
          <div class="font-medium text-15">Comments</div>
          <Comment
            :refetchIssue="refetchIssue"
            isCreate
            :comment="{
              user: currentUser,
              body: 'Add a comment...',
              issueId
            }"
          />
          <Comment
            @delete="triggeCommentDelete"
            :refetchIssue="refetchIssue"
            :comment="comment"
            v-for="comment in commentsSorted"
            :key="comment.id"
          />
        </div>
      </div>
      <!-- RIGHT SECTION -->
      <div class="sm:w-full md:w-5/12 lg:w-2/6 pt-1">
        <!-- STATUS -->
        <IssueStatus
          :updateIssue="handleUpdateIssue"
          :value="issueCopy.status"
        />
        <!-- AssigneesReporter -->
        <IssueAssigneesReporter
          :reporterId="issueCopy.reporterId"
          :userIds="issueCopy.userIds"
          :updateIssue="handleUpdateIssue"
        />
        <!-- PRIORITY -->
        <IssuePriority
          :value="issueCopy.priority"
          :updateIssue="handleUpdateIssue"
        />
        <!-- DATES -->
        <div
          class="mt-3 pt-3 leading-loose border-t border-borderLightest text-textMedium text-13"
        >
          <div>
            Created - {{ formatDateTimeConversational(issueCopy.createdAt) }}
          </div>
          <div>
            Updated - {{ formatDateTimeConversational(issueCopy.updatedAt) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  defineComponent,
  ref,
  computed,
  onUnmounted
} from '@vue/composition-api'
import { useClipboard } from '@/hooks/useClipboard'
import { Issue } from '@/types/issue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import {
  getIssueWithUsersAndComments,
  deleteIssue,
  getProjectIssues,
  updateIssueMutation
} from '@/graphql/queries/issue'
import IssueLoader from '@/components/Project/IssueLoader.vue'
import Comment from './Comment.vue'
import IssueDescription from './Description.vue'
import IssueTitle from './Title.vue'
import IssueType from './Type.vue'
import IssueStatus from './Status.vue'
import IssueAssigneesReporter from './AssigneesReporter.vue'
import IssuePriority from './Priority.vue'
import { formatDateTimeConversational } from '@/utils/date'
import { getters, mutations } from '@/store'
import eventBus from '@/utils/eventBus'
import { deleteComment } from '@/graphql/queries/comment'
import { updateArrayItemById } from '../../../../utils/dnd'

const sortByNewest = (items: any[] = [], sortField: string) =>
  items.sort((a, b) => -a[sortField].localeCompare(b[sortField]))

export default defineComponent({
  components: {
    IssueLoader,
    Comment,
    IssueDescription,
    IssueTitle,
    IssueType,
    IssueStatus,
    IssueAssigneesReporter,
    IssuePriority
  },
  props: {
    issueId: {
      type: [String, Number],
      required: true
    },
    withCloseButton: {
      type: Boolean,
      default: true
    },
    withFullScreenButton: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { root, emit }) {
    const issueCopy = ref<Issue>(null)
    const project = computed(getters.project)
    const currentUser = computed(getters.currentUser)

    const { onResult, loading, refetch: refetchIssue } = useQuery<{
      getIssueWithUsersAndComments: Issue
    }>(getIssueWithUsersAndComments, {
      id: Number(props.issueId)
    })

    onResult(res => {
      if (res && res.data && !res.loading) {
        issueCopy.value = res.data.getIssueWithUsersAndComments
      }
    })

    const commentsSorted = computed(() => {
      if (!issueCopy.value) {
        return []
      }
      return sortByNewest(issueCopy.value.comments, 'createdAt')
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setClipboard] = useClipboard()

    const copyIssueLink = async () => {
      const path =
        window.location.origin +
        root.$router.resolve({
          name: 'issue',
          params: { issueId: `${props.issueId}` }
        }).href

      await setClipboard(path)
    }

    const goFullScreen = () => {
      root.$router.push({
        name: 'issue',
        params: { issueId: `${props.issueId}` }
      })
      emit('close')
    }

    const { mutate: mutateIssue } = useMutation<{
      updateIssue: Issue
    }>(updateIssueMutation)

    const handleUpdateIssue = async (fields: Partial<Issue>) => {
      issueCopy.value = { ...issueCopy.value, ...fields } as Issue

      mutations.setProject({
        ...project.value,
        issues: updateArrayItemById(
          project.value.issues,
          props.issueId as string,
          fields
        )
      })
      await mutateIssue({
        issueId: Number(props.issueId),
        issue: { ...fields }
      } as any)
      await refetchIssue()
    }

    const { mutate } = useMutation<{ deleteIssue: boolean }>(deleteIssue)
    const { refetch: fetchProjectIssues } = useQuery<{
      getProjectIssues: Issue[]
    }>(getProjectIssues)

    /* -------- Delete Issue -------- */

    const isDeleteConfirmOpen = ref<boolean>(false)
    const triggerIssueDelete = () => {
      eventBus.$emit('toggle-issue-delete', true, props.issueId)
    }

    const deleteIssueHandler = async () => {
      await mutate({ issueId: Number(props.issueId) } as any)
      const res = await fetchProjectIssues()
      if (res.data) {
        mutations.setProject({
          ...project.value,
          issues: res.data.getProjectIssues
        })
      }
      eventBus.$emit('toggle-issue-delete', false)
      eventBus.$emit('toggle-issue-details', false)
      eventBus.$emit('toggle-issue-search', false)
      if (root.$route.name != 'board') {
        root.$router.replace({ name: 'board' })
      }
    }

    /* -------- Delete Comment -------- */

    const { mutate: deleteMutation } = useMutation(deleteComment)

    const triggeCommentDelete = (id: string | number) => {
      eventBus.$emit('toggle-comment-delete', true, id)
    }

    const deleteCommentHandler = async (id: string | number) => {
      await deleteMutation({ commentId: `${id}` } as any)
      await refetchIssue()
      eventBus.$emit('toggle-comment-delete', false)
    }

    eventBus.$on('confirm-issue-delete', deleteIssueHandler)

    eventBus.$on('confirm-comment-delete', deleteCommentHandler)

    onUnmounted(() => {
      eventBus.$off('confirm-issue-delete', deleteIssueHandler)
      eventBus.$off('confirm-comment-delete', deleteCommentHandler)
    })

    return {
      currentUser,
      project,
      loading,
      refetchIssue,
      IssueStatus,
      issueCopy,
      handleUpdateIssue,
      copyIssueLink,
      goFullScreen,
      triggerIssueDelete,
      triggeCommentDelete,
      commentsSorted,
      isDeleteConfirmOpen,
      formatDateTimeConversational
    }
  }
})
</script>

<style lang="postcss" scoped>
.formField {
  @apply mt-5;
}
.sep {
  @apply mt-5 border border-backgroundLightest;
}
.formFieldLabel {
  @apply block pb-1-25 text-textMedium text-13 font-medium;
}
.formFieldTip {
  @apply pt-1-5 text-textMedium text-13;
}
</style>

<style lang="scss" scoped>
.error {
  position: absolute;
  right: 0;
  top: 0;
  padding: 2px 10px;
  background: #f53b57;
  color: white;
  font-size: 12px;
  border-bottom-left-radius: 3px;
  border-top-right-radius: 3px;
}
</style>
