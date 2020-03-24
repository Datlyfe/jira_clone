<template>
  <div class="pt-16">
    <div class="bg">
      <div class="box">
        <img src="@/assets/img/mountains.jpg" alt="" />
        <h1 class="mb-4 text-3xl">There’s been a glitch…</h1>
        <p>
          We’re not quite sure what went wrong. Please contact us or try looking
          on our
          <a href="/">Help Center</a>
          if you need a hand.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>

<style lang="postcss" scoped>
.bg {
  @apply my-0 mx-auto bg;
  @media (max-height: 680px) {
    padding: 140px 0;
  }
}
.box {
  position: relative;
  margin: 0 auto;
  max-width: 480px;
  border-radius: 3px;
}
</style>
