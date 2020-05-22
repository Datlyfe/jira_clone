<template>
  <div :style="{ width: `${sidebarWidth}px` }" class="sidebar">
    <div class="sidebar-content">
      <div class="flex py-6 px-1">
        <j-icon name="project-avatar" :size="40"></j-icon>
        <div class="pt-1 pl-2">
          <div class="mb-1 text-textDark text-15 font-medium">
            {{ project.name }}
          </div>
          <div class="text-textMedium text-13">
            {{ ProjectCategoryCopy[project.category] }} project
          </div>
        </div>
      </div>

      <div v-for="(link, index) in navLinks" :key="index">
        <component
          :is="link.to ? 'router-link' : 'div'"
          :to="link.to ? link.to : '/not-implemented'"
          exact
          exact-active-class="active"
          tag="a"
          class="link"
          :class="`${!link.to ? 'not-allowed' : 'allowed'}`"
        >
          <j-icon :name="link.icon" :size="24" class="mr-4"></j-icon>

          <div class="text-15 pt-px">{{ link.name }}</div>
          <div v-if="!link.to" class="not-implemented">
            Not implemented
          </div>
        </component>
        <div v-if="index == 1" class="divider"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { navLinks } from '@/components/Navigation/Sidebar.ts'
import { getters } from '../../store'
import { ProjectCategoryCopy } from '@/types/project'

export default defineComponent({
  props: {
    expanded: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const project = computed(getters.project)
    const sidebarWidth = computed(() => (props.expanded ? 240 : 20))

    return {
      ProjectCategoryCopy,
      project,
      navLinks,
      sidebarWidth
    }
  }
})
</script>

<style lang="postcss" scoped>
.sidebar {
  @apply h-full relative;
  will-change: width;
  transition: width 300ms cubic-bezier(0.2, 0, 0, 1) 0s;
}
.sidebar-content {
  @apply px-4 bg-backgroundLightest;
  height: 100%;
  left: 0px;
  min-width: 240px;
  overflow-x: hidden;
  position: absolute;
  top: 0px;
  width: 100%;
}

.sidebar.mini {
  width: 20px;
}
.sidebar.mini .sidebar-content {
  z-index: -1;
}

.link {
  @apply flex items-center relative py-2 px-3 rounded-sm text-textDarkest;
}
.link:hover .not-implemented {
  @apply opacity-100;
}
.active {
  @apply text-textLink bg-backgroundLight;
}
.allowed:hover {
  @apply bg-backgroundLight;
}
.not-allowed {
  cursor: not-allowed;
}
.divider {
  @apply mt-4 pt-4 border-t border-borderLight;
}

.not-implemented {
  @apply bg-backgroundMedium text-textDark inline-block absolute rounded-sm uppercase opacity-0 text-xs font-bold;
  top: 7px;
  left: 40px;
  width: 140px;
  padding: 5px 0 5px 8px;
}
</style>
