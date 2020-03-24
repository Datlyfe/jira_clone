<template>
  <div class="navigation">
    <div class="flex flex-row overflow-hidden h-full">
      <NavbarLeft />
      <Sidebar :expanded="expanded" />
    </div>
    <Resizer :expanded="expanded" @onResize="handleResize" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import NavbarLeft from './NavbarLeft.vue'
import Sidebar from './Sidebar.vue'
import Resizer from './Resizer.vue'
export default defineComponent({
  props: {
    expanded: {
      type: Boolean,
      required: true
    }
  },
  components: {
    NavbarLeft,
    Sidebar,
    Resizer
  },
  setup(props, { emit }) {
    const handleResize = (isExpanded: boolean) => {
      emit('onResize', isExpanded)
    }
    return {
      handleResize
    }
  }
})
</script>

<style lang="scss" scoped>
.navigation {
  bottom: 0px;
  left: 0px;
  position: fixed;
  top: 0px;
  z-index: 200;
}
</style>
