/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ref, onMounted, onUnmounted } from 'vue'

export const useOutsideClick = (
  $root: Ref<HTMLElement | undefined>,
  $bound: Ref<HTMLElement | undefined>,
  onOutsideClick: Function
) => {
  const handleClickOutside = (e: MouseEvent) => {
    if ($bound.value && !$bound.value.contains(e.target as any)) {
      onOutsideClick()
    }
  }
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOutsideClick()
    }
  }
  onMounted(() => {
    ;($root.value as HTMLElement)?.addEventListener(
      'mousedown',
      handleClickOutside
    )
    ;($root.value as HTMLElement)?.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    ;($root.value as HTMLElement)?.removeEventListener(
      'mousedown',
      handleClickOutside
    )
    ;($root.value as HTMLElement)?.removeEventListener('keydown', handleKeydown)
  })
}
