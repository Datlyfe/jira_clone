<template>
  <div :style="{ width: `${sidebarWidth}px` }" class="relative h-full sidebar">
    <div class="px-4 sidebar-content bg-backgroundLightest">
      <div class="flex px-1 py-6">
        <j-icon name="project-avatar" :size="40"></j-icon>
        <div class="pt-1 pl-2">
          <div class="mb-1 font-medium text-textDark text-[15px]">
            {{ project.name }}
          </div>
          <div class="text-textMedium text-[13px]">
            {{ ProjectCategoryCopy[project.category] }} project
          </div>
        </div>
      </div>

      <div v-for="(link, index) in navLinks" :key="index">
        <component
          :is="link.to ? 'router-link' : 'div'"
          :to="link.to ? link.to : '/not-implemented'"
          exact-active-class="text-textLink bg-backgroundLight"
          tag="a"
          class="relative flex items-center px-3 py-2 rounded-sm link text-textDarkest"
          :class="`${
            !link.to ? 'cursor-not-allowed' : 'hover:bg-backgroundLight'
          }`"
        >
          <j-icon :name="link.icon" :size="24" class="mr-4"></j-icon>

          <div class="pt-px text-[15px]">{{ link.name }}</div>
          <div
            v-if="!link.to"
            class="absolute inline-block text-xs font-bold uppercase rounded-sm opacity-0 not-implemented bg-backgroundMedium text-textDark"
          >
            Not implemented
          </div>
        </component>
        <div
          v-if="index == 1"
          class="pt-4 mt-4 divider border-borderLight"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { navLinks } from '@/components/Navigation/Sidebar'
import { getters } from '../../store'
import { ProjectCategoryCopy } from '@/types/project'

export default defineComponent({
  props: {
    expanded: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const project = computed(getters.project)
    const sidebarWidth = computed(() => (props.expanded ? 240 : 20))

    return {
      ProjectCategoryCopy,
      project,
      navLinks,
      sidebarWidth,
    }
  },
})
</script>

<style lang="scss" scoped>
.sidebar {
  will-change: width;
  transition: width 300ms cubic-bezier(0.2, 0, 0, 1) 0s;
}
.sidebar-content {
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

.link:hover .not-implemented {
  opacity: 1;
}

.not-implemented {
  top: 7px;
  left: 40px;
  width: 140px;
  padding: 5px 0 5px 8px;
}
</style>
