import Vue from 'vue'
import 'tippy.js/dist/tippy.css'

import tippy, { Placement, ReferenceElement } from 'tippy.js'

Vue.directive('tippy', {
  bind: function(el, bind) {
    const { value } = bind
    let offset = [0, 20],
      content = '',
      placement: Placement = 'right'
    if (typeof value === 'object') {
      content = value.content
      offset = value.offset || [0, 20]
      placement = value.placement || 'right'
    }
    if (typeof value === 'string') {
      content = value as string
    }
    tippy(el, {
      content,
      placement,
      offset: offset as [number, number]
    })
  },
  unbind: function(el) {
    ;(el as ReferenceElement)._tippy?.destroy()
  }
})
