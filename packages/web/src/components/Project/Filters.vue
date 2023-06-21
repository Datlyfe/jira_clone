<template>
  <div class="flex items-center mt-6">
    <div class="w-40 mr-4">
      <form autocomplete="off" novalidate>
        <j-input
          aria-label="search"
          icon="search"
          :value="projectFilters.searchTerm"
          @input="handleInput"
        />
      </form>
    </div>
    <!-- Avatars -->
    <div class="flex flex-row mr-3">
      <div
        v-for="user in project.users"
        :key="user.id"
        :class="{ active: projectFilters.userIds.includes(user.id) }"
        class="flex -ml-1 transition-transform duration-100 rounded-full lift"
      >
        <j-avatar
          class="cursor-pointer select-none shadow-outline-white"
          :name="user.name"
          :size="36"
          :avatarUrl="user.avatarUrl"
          @click.native="handleUser(user.id)"
        />
      </div>
    </div>
    <j-button
      :isActive="projectFilters.myOnly"
      variant="empty"
      @click="handleOnlyMe"
      >Only My Issues</j-button
    >
    <j-button
      :isActive="projectFilters.recent"
      class="ml-3"
      variant="empty"
      @click="handleRecent"
      >Recently Updated</j-button
    >
    <div class="flex items-center ml-3" v-if="!areFiltersCleared">
      <div class="self-stretch w-px mr-3 bg-backgroundMedium"></div>
      <j-button variant="secondary" @click="handleReset">Clear all</j-button>
    </div>
  </div>
</template>

<script lang="ts">
import xor from 'lodash.xor'
import { defineComponent, computed, ref } from 'vue'
import { getters } from '@/store'
import { Filters } from '@/types/filters'
import { debounce } from 'throttle-debounce'
export default defineComponent({
  setup(_, { emit }) {
    const projectFilters = computed(getters.filters)
    const project = computed(getters.project)

    const filters = ref<Filters>(projectFilters.value || {})

    const newFilter = (filter: Partial<Filters> | Function) => {
      filters.value = { ...filters.value, ...filter }
      emit('change', filters.value)
    }

    const handleInput = debounce(500, (newValue: string) => {
      newFilter({ searchTerm: newValue })
    })

    const handleUser = (id: string) =>
      newFilter({ userIds: xor(projectFilters.value.userIds, [id]) })

    const handleOnlyMe = () =>
      newFilter({ myOnly: !projectFilters.value.myOnly })
    const handleRecent = () =>
      newFilter({ recent: !projectFilters.value.recent })

    const handleReset = () =>
      newFilter({
        searchTerm: '',
        userIds: [],
        myOnly: false,
        recent: false
      })

    const areFiltersCleared = computed(() => {
      return (
        !projectFilters.value.searchTerm &&
        projectFilters.value.userIds.length === 0 &&
        !projectFilters.value.myOnly &&
        !projectFilters.value.recent
      )
    })

    return {
      project,
      projectFilters,
      handleInput,
      handleUser,
      handleOnlyMe,
      handleRecent,
      handleReset,
      areFiltersCleared,
      xor
    }
  }
})
</script>

<style lang="scss" scoped>
.active {
  box-shadow: 0 0 0 4px #1255b9;
}
.lift:hover {
  transform: translateY(-5px);
}
</style>
