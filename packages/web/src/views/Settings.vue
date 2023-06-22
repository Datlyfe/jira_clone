<template>
  <div class="flex flex-col w-full h-full py-8 pl-10 pr-6">
    <j-breadcrumbs :items="['Projects', project.name, 'Project Details']" />
    <header class="flex justify-between mt-3 text-textDarkest">
      <div class="text-2xl font-medium">Project Details</div>
    </header>
    <form
      @submit.prevent
      style="max-width: 640px"
      autocomplete="off"
      novalidate
    >
      <div class="pt-5">
        <label class="label" for="name">Name</label>
        <j-input
          :value="projectUpdateDTO.name"
          id="name"
          placeholder="Project name"
          @input="(v:string) => (projectUpdateDTO.name = v)"
        />
      </div>
      <div class="pt-5">
        <label class="label" for="url">URL</label>
        <j-input
          :value="projectUpdateDTO.url"
          id="url"
          placeholder="URL"
          @input="(v:string) => (projectUpdateDTO.url = v)"
        />
      </div>
      <div class="pt-5">
        <label class="label" for="desc">Description</label>
        <j-textarea
          placeholder="No description"
          class="text-15 bg-backgroundLightest"
          :value="projectUpdateDTO.description"
          @input="(v:string) => (projectUpdateDTO.description = v)"
        />
        <div class="tip">
          Describe the project in as much detail as you'd like.
        </div>
      </div>
      <div class="pt-5">
        <label class="label" for="name">Project Category</label>
        <j-select
          :value="projectUpdateDTO.category"
          searchable
          :options="projectCategoryOptions"
          @change="(v:ProjectCategory) => (projectUpdateDTO.category = v)"
        />
      </div>
      <div class="pt-7">
        <j-button
          :isWorking="isWorking"
          :disabled="!isValid"
          @click.prevent="handleUpdateProject"
          variant="primary"
          >Save changes</j-button
        >
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, ref } from 'vue'
import { ProjectCategoryCopy, ProjectCategory } from '@/types/project'
import { getters, mutations } from '@/store'
import pick from 'lodash.pick'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  updateProject,
  getProjectWithUsersAndIssues,
} from '@/graphql/queries/project'
import { successToast, errorToast } from '@/plugins/toast'

export default defineComponent({
  setup() {
    const project = computed(getters.project)
    const isWorking = ref<boolean>(false)
    const queryEnabled = ref<boolean>(false)

    const projectUpdateDTO = reactive(
      pick(project.value, ['name', 'url', 'description', 'category'])
    )

    const isRequired = (value: string) =>
      ['', null, undefined].indexOf(value) === -1

    const isValid = computed(
      () =>
        isRequired(projectUpdateDTO.name) &&
        isRequired(projectUpdateDTO.category)
    )
    const projectCategoryOptions = Object.values(ProjectCategory).map(
      (category) => ({
        value: category,
        label: ProjectCategoryCopy[category],
      })
    )

    const { mutate } = useMutation(updateProject)
    const { refetch } = useQuery(getProjectWithUsersAndIssues, {}, () => ({
      fetchPolicy: 'network-only',
      enabled: queryEnabled.value,
    }))
    const handleUpdateProject = async () => {
      try {
        isWorking.value = true
        queryEnabled.value = true
        // eslint-disable-next-line
        await mutate({ project: projectUpdateDTO } as any)
        const res = await refetch()
        if (res?.data) {
          mutations.setProject(res.data.getProjectWithUsersAndIssues)
        }
        successToast('Changes have been saved successfully.').showToast()
        isWorking.value = false
      } catch (error) {
        isWorking.value = false
        errorToast('An error has occurred').showToast()
      }
    }
    return {
      project,
      isWorking,
      projectUpdateDTO,
      handleUpdateProject,
      isValid,
      projectCategoryOptions,
    }
  },
})
</script>

<style lang="scss" scoped>
.label {
  @apply pb-2 font-medium text-[13px] text-textMedium block;
}
.tip {
  @apply pt-1-5 text-textMedium text-[13px];
}
</style>
