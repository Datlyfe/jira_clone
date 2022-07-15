<template>
  <div class="px-8 pt-6 pb-16">
    <div class="relative mb-10 pr-7">
      <j-input
        ref="searchInputRef"
        class="flat text-textMedium"
        icon="search"
        @input="handleSearchChange"
        :value="searchTerm"
        :iconSize="26"
        placeholder="Search issues by summary, description..."
      />
    </div>
    <div
      class="flex flex-col items-center justify-center pt-10"
      v-if="loading && !isSearchTermEmpty"
    >
      <Spinner />
    </div>
    <div class="fadeIn" v-else>
      <div v-if="isSearchTermEmpty && recentIssues.length > 0">
        <div class="sectionTitle">Recent Issues</div>
        <SearchResult
          v-for="issue in recentIssues"
          :key="issue.id"
          :issue="issue"
        />
      </div>
      <div v-if="!isSearchTermEmpty && matchingIssues.length > 0">
        <div class="sectionTitle">Matching Issues</div>
        <SearchResult
          v-for="issue in matchingIssues"
          :key="issue.id"
          :issue="issue"
        />
      </div>
      <div
        class="flex flex-col items-center justify-center pt-10"
        v-if="!isSearchTermEmpty && !loading && matchingIssues.length === 0"
      >
        <j-icon :size="125" name="no-result"></j-icon>
        <div class="pt-8 text-xl font-medium">
          We couldn&apos;t find anything matching your search
        </div>
        <div class="pt-2 text-15">Try again with a different term.</div>
      </div>
    </div>
  </div>
</template>

<script lang="tsx">
import { defineComponent, ref, computed, onMounted } from '@vue/composition-api'
import SearchResult from './SearchResult.vue'
import Loader from '@/components/Loader.vue'
import { useQuery, useResult } from '@vue/apollo-composable'
import { getProjectIssues } from '@/graphql/queries/issue'
import { Issue } from '@/types/issue'
import { getters } from '@/store'
import { debounce } from 'throttle-debounce'
import {  } from 'vue'
// eslint-disable-next-line
const sortByNewest = (items: any[] = [], sortField: string) =>
  items.sort((a, b) => -a[sortField].localeCompare(b[sortField]))

export default defineComponent({
  components: {
    SearchResult,
    Spinner: Loader
  },
  setup() {
    const isSearchTermEmpty = ref<boolean>(true)
    const searchTerm = ref<string>('')
    const searchInputRef = ref<any>(null)
    const { result, refetch, loading } = useQuery<Issue[]>(getProjectIssues, {
      searchTerm: searchTerm.value
    })

    const project = computed(getters.project)

    const matchingIssues = useResult(result, [])
    const recentIssues = computed(() =>
      sortByNewest(project.value.issues, 'createdAt').slice(0, 10)
    )

    const handleSearchChange = debounce(500, (value: string) => {
      searchTerm.value = value.trim()
      isSearchTermEmpty.value = !searchTerm.value
      if (searchTerm.value) {
        refetch({ searchTerm: searchTerm.value })
      }
    })

    onMounted(() => {
      if (searchInputRef.value) {
        const inputEl = searchInputRef.value.$el.querySelector('input')
        if (inputEl) {
          inputEl.focus()
        }
      }
    })

    return {
      matchingIssues,
      loading,
      recentIssues,
      isSearchTermEmpty,
      handleSearchChange,
      searchTerm,
      searchInputRef
    }
  }
})
</script>

<style lang="postcss" scoped>
.sectionTitle {
  @apply text-textMedium font-bold text-xs uppercase pb-3;
}
</style>

<style lang="scss"></style>
