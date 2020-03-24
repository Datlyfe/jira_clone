/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ref, ref, onMounted, onUnmounted } from '@vue/composition-api'

export const useOutsideClick = (
  $root: Ref<HTMLElement | null>,
  $bound: Ref<HTMLElement | null>,
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
    ;($root.value as HTMLElement).addEventListener(
      'mousedown',
      handleClickOutside
    )
    ;($root.value as HTMLElement).addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    ;($root.value as HTMLElement).removeEventListener(
      'mousedown',
      handleClickOutside
    )
    ;($root.value as HTMLElement).removeEventListener('keydown', handleKeydown)
  })
}
