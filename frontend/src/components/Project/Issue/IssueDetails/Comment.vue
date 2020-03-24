<template>
  <div class="relative mt-6 text-15">
    <!-- user-avatar -->
    <j-avatar
      class="absolute top-0 left-0"
      :name="comment.user.name"
      :avatarUrl="comment.user.avatarUrl"
    />
    <!-- content -->
    <div class="pl-10">
      <!-- username -->
      <div
        v-if="!isCreate"
        v-text="comment.user.name"
        class="inline-block mr-3 mb-2 text-textDark font-medium"
      />
      <!-- createdAt -->
      <div
        v-if="!isCreate"
        v-text="createdAt"
        class="inline-block pb-2 text-textDark text-sm"
      />
      <!-- body-form -->
      <div v-if="isFormOpen">
        <j-textarea
          v-model="newComment"
          autoFocus
          rows="2"
          @keydown="handleKeyDown"
          placeholder="Add a comment..."
        />
        <div class="flex pt-2 items-center">
          <j-button
            class="mr-2"
            variant="primary"
            type="submit"
            @click="handleSubmit"
            :isWorking="isWorking"
          >
            Save
          </j-button>
          <j-button variant="empty" @click="handleCancel">
            Cancel
          </j-button>
        </div>
      </div>
      <div v-else>
        <!-- comment-body -->
        <p
          v-if="isCreate"
          @click="isFormOpen = true"
          class="fakeTa pb-2 whitespace-pre-wrap"
        >
          Add a comment...
        </p>
        <p v-else v-text="comment.body" class="pb-2 whitespace-pre-wrap"></p>
        <!-- edit-link -->
        <div v-if="!isCreate && !readOnly">
          <div
            @click="isFormOpen = true"
            class="mr-3 inline-block py-1 text-textMedium text-sm cursor-pointer select-none hover:underline"
          >
            Edit
          </div>
          <div
            @click="triggerCommentDelete"
            class="mr-3 inline-block py-1 text-textMedium text-sm cursor-pointer select-none hover:underline"
          >
            Delete
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api'

import { Comment } from '@/types/comment'
import { formatDateTimeConversational } from '@/utils/date'
import { useMutation } from '@vue/apollo-composable'
import { createComment, updateComment } from '@/graphql/queries/comment'
import { getters } from '@/store'

export default defineComponent({
  props: {
    comment: {
      type: Object as () => Comment,
      required: true
    },
    isCreate: {
      type: Boolean,
      default: false
    },
    refetchIssue: {
      type: Function,
      required: true
    }
  },
  setup(props, { root, emit }) {
    const currentUser = computed(getters.currentUser)
    const newComment = ref<string>(props.isCreate ? '' : props.comment.body)
    const isWorking = ref<boolean>(false)
    const isFormOpen = ref<boolean>(false)
    const isCommentDeleteConfirmOpen = ref<boolean>(false)
    const readOnly = computed(
      () => currentUser.value.id != props.comment.userId
    )

    const { mutate: createMutation } = useMutation(createComment)
    const { mutate: updateMutation } = useMutation(updateComment)

    const handleCommentCreate = async () => {
      if (isWorking.value) return
      try {
        isWorking.value = true
        const comment = {
          body: newComment.value,
          issueId: props.comment.issueId,
          userId: props.comment.user.id
        }
        // eslint-disable-next-line
        await createMutation({ comment } as any)
        await props.refetchIssue()
        newComment.value = ''
        isFormOpen.value = false
        isWorking.value = false
      } catch (error) {
        console.error(error)
        // root.$vToastify('Error', {
        //   type: 'error',
        //   timeout: 2500
        // })
      }
    }

    const handleCommentUpdate = async () => {
      if (isWorking.value) return
      try {
        isWorking.value = true
        const comment = {
          body: newComment.value,
          issueId: props.comment.issueId,
          userId: props.comment.user.id
        }
        // eslint-disable-next-line
        await updateMutation({ comment, commentId: props.comment.id } as any)
        await props.refetchIssue()
        isFormOpen.value = false
        isWorking.value = false
      } catch (error) {
        console.error(error)
        // root.$toast('Error', {
        //   type: 'error',
        //   timeout: 2500
        // })
      }
    }

    const triggerCommentDelete = () => {
      emit('delete', props.comment.id)
    }

    const handleSubmit = () => {
      props.isCreate ? handleCommentCreate() : handleCommentUpdate()
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode == 13 && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    }
    const handleCancel = () => {
      isFormOpen.value = false
    }

    const createdAt = computed(() =>
      formatDateTimeConversational(props.comment.createdAt)
    )

    const handleFakeTextareaClicked = () => {
      if (props.isCreate) {
        isFormOpen.value = true
      }
    }

    return {
      createdAt,
      readOnly,
      newComment,
      isWorking,
      isCommentDeleteConfirmOpen,
      isFormOpen,
      triggerCommentDelete,
      handleSubmit,
      handleKeyDown,
      handleCancel,
      handleFakeTextareaClicked,
      handleCommentUpdate
    }
  }
})
</script>

<style lang="scss" scoped>
.fakeTa {
  color: rgb(137, 147, 164);
  border: 1px solid rgb(223, 225, 230);
  cursor: text;
  user-select: none;
  padding: 12px 16px;
  border-radius: 4px;
}
</style>
