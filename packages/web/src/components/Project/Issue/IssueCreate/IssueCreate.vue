<template>
  <div class="w-full h-full px-8 py-5">
    <div class="flex items-center py-3 text-textDarkest">
      <div class="text-xl">Create issue</div>
      <div class="flex-auto"></div>
      <j-button
        @click="$emit('close')"
        icon="x"
        :iconSize="24"
        variant="empty"
      />
    </div>
    <form novalidate autocomplete="off">
      <div class="formField">
        <label for="issuetype" class="formFieldLabel">Issue type</label>
        <j-select
          id="issuetype"
          :value="issueCreateObject.type"
          searchable
          :options="
            Object.values(IssueType).map(type => ({
              value: type,
              label: IssueTypeCopy[type],
              icon: IssueTypeCopy[type].toLowerCase()
            }))
          "
          @change="setFieldValue('type', $event)"
          customRender
        >
          <template v-slot:default="{ label, icon }">
            <div class="flex items-center my-px mr-4">
              <j-icon class="mr-1" :size="16" :name="icon"></j-icon>
              <div class="pl-2 pr-1">
                {{ label }}
              </div>
            </div>
          </template>
        </j-select>
        <div class="formFieldTip">
          Start typing to get a list of possible matches.
        </div>
      </div>
      <div class="sep"></div>
      <div class="formField">
        <label class="formFieldLabel" for="summary">Short Summary</label>
        <div class="relative">
          <j-input
            :value="issueCreateObject.title"
            id="summary"
            @input="setFieldValue('title', $event)"
          />
        </div>

        <div class="formFieldTip">
          Concisely summarize the issue in one or two sentences.
        </div>
      </div>

      <div class="formField">
        <label class="formFieldLabel" for="description">Description</label>
        <j-text-editor
          :mode="`write`"
          @input="setFieldValue('description', $event)"
          class="descriptionEditor"
          id="description"
        />
        <div class="formFieldTip">
          Describe the issue in as much detail as you'd like.
        </div>
      </div>
      <div class="formField">
        <label class="formFieldLabel" for="reporter">Reporter</label>
        <j-select
          id="reporter"
          searchable
          :value="issueCreateObject.reporterId"
          :options="projectUsers"
          customRender
          @change="setFieldValue('reporterId', $event)"
        >
          <template v-slot:default="{ label, user, remove, optionValue }">
            <div class="flex items-center my-px mr-4">
              <j-avatar
                :size="20"
                :avatarUrl="user.avatarUrl"
                :name="user.name"
              />
              <div class="pl-2 pr-1">
                {{ label }}
              </div>
              <j-icon
                v-if="remove"
                @click="remove(optionValue)"
                class="text-textLight"
                :size="20"
                name="times"
              ></j-icon>
            </div>
          </template>
        </j-select>
      </div>
      <div class="formField">
        <label class="formFieldLabel" for="userIds">Assignees</label>
        <j-select
          id="userIds"
          :value="issueCreateObject.userIds"
          searchable
          :options="projectUsers"
          :isMulti="true"
          @change="setFieldValue('userIds', $event)"
          customRender
        >
          <template v-slot:default="{ label, user, remove, optionValue }">
            <div class="flex items-center my-px mr-4">
              <j-avatar
                :size="20"
                :avatarUrl="user.avatarUrl"
                :name="user.name"
              />
              <div class="pl-2 pr-1">
                {{ label }}
              </div>
              <j-icon
                v-if="remove"
                @click="remove(optionValue)"
                class="text-textLight"
                :size="20"
                name="times"
              ></j-icon>
            </div>
          </template>
        </j-select>
      </div>
      <div class="formField">
        <label class="formFieldLabel" for="priority">Priority</label>
        <j-select
          id="priority"
          :value="issueCreateObject.priority"
          searchable
          :options="
            Object.values(IssuePriority).map(p => ({
              value: p,
              label: IssuePriorityCopy[p],
              icon: parseInt(p) < 3 ? 'arrow-down' : 'arrow-up',
              color: issuePriorityColors[p]
            }))
          "
          customRender
          @change="setFieldValue('priority', $event)"
        >
          <template v-slot:default="{ label, icon, color }">
            <div class="flex items-center my-px mr-4">
              <j-icon :style="{ color }" :size="20" :name="icon"></j-icon>

              <div class="pl-2 pr-1">
                {{ label }}
              </div>
            </div>
          </template>
        </j-select>
        <div class="formFieldTip">Priority in relation to other issues.</div>
      </div>
      <div class="flex items-center justify-end formField">
        <j-button
          :isWorking="isWorking"
          @click.prevent="handleSubmit"
          :disabled="!isValidDTO"
          class="ml-3"
          variant="primary"
          >Create</j-button
        >
        <j-button
          @click.prevent="$emit('close')"
          class="ml-3"
          variant="secondary"
          >Cancel</j-button
        >
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, ref } from 'vue'
import { getters, mutations } from '@/store'
import {
  Issue,
  IssueType,
  IssuePriority,
  IssuePriorityCopy,
  IssueTypeCopy,
  IssueStatus,
  IssueCreateDTO
} from '@/types/issue'
import { issuePriorityColors } from '@/utils/colors'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { createIssue, getProjectIssues } from '@/graphql/queries/issue'
import Omit from 'lodash.omit'
import { successToast } from '../../../../plugins/toast'
type fieldType =
  | 'type'
  | 'title'
  | 'description'
  | 'reporterId'
  | 'userIds'
  | 'priority'
  | 'status'
export default defineComponent({
  setup(_, { emit }) {
    const project = computed(getters.project)
    const currentUser = computed(getters.currentUser)
    const projectUsers = computed(() => {
      if (!project.value) return []
      return project.value.users.map(user => ({
        value: user.id,
        label: user.name,
        user
      }))
    })

    const defaultIssueValues = {
      type: IssueType.TASK,
      title: '',
      description: '',
      reporterId: currentUser.value.id,
      userIds: [],
      priority: IssuePriority.MEDIUM
    }

    const issueCreateObject = reactive<IssueCreateDTO>(defaultIssueValues)
    const isRequired = (value: string) =>
      ['', null, undefined].indexOf(value) === -1

    const isValidDTO = computed(
      () =>
        isRequired(issueCreateObject.type) &&
        isRequired(issueCreateObject.title) &&
        isRequired(issueCreateObject.reporterId) &&
        isRequired(issueCreateObject.priority)
    )

    // eslint-disable-next-line
    const setFieldValue = (field: fieldType, value: any) => {
      issueCreateObject[field] = (value as unknown) as never
    }

    const loading = ref<boolean>(false)

    const { mutate, loading: isMutationLoading } = useMutation(createIssue)
    const {
      refetch: fetchProjectIssues,
      loading: isFetchIssuesLoading
    } = useQuery<{
      getProjectIssues: Issue[]
    }>(getProjectIssues)

    const isWorking = computed(
      () => loading.value && isFetchIssuesLoading && isMutationLoading
    )

    const getUserById = (userId: string) =>
      Omit(
        project.value.users.find(user => user.id === userId),
        ['__typename', 'name', 'avatarUrl', 'projectId']
      )

    const handleSubmit = async () => {
      loading.value = true
      const issue: IssueCreateDTO = {
        ...issueCreateObject,
        status: IssueStatus.BACKLOG,
        projectId: project.value.id,
        users: issueCreateObject.userIds.map(getUserById)
      }
      try {
        // eslint-disable-next-line
        await mutate({ issue } as any)
        const res = await fetchProjectIssues()
        if (res?.data) {
          mutations.setProject({
            ...project.value,
            issues: res.data.getProjectIssues
          })
        }
        loading.value = false
        emit('close')
        successToast('Issue has been successfully created').showToast()
      } catch (error) {
        console.error(error)
        emit('close')
      }
    }

    return {
      issueCreateObject,
      projectUsers,
      IssueType,
      isValidDTO,
      IssueTypeCopy,
      IssuePriority,
      IssuePriorityCopy,
      issuePriorityColors,
      setFieldValue,
      handleSubmit,
      isWorking
    }
  }
})
</script>

<style lang="scss" scoped>
.formField {
  margin-top: 20px;
}
.sep {
  margin-top: 20px;
  background-color: rgb(244 245 247);
}
.formFieldLabel {
  display: block;
  padding-bottom: 5px;
  color: rgb(94 108 132);
  font-size: 13px;
  font-weight: 500;
}
.formFieldTip {
  padding-top: 6px;
  color: rgb(94 108 132);
  font-size: 13px;
}

.descriptionEditor .ql-editor {
  min-height: 110px;
}
</style>
