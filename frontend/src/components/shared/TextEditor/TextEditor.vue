<template>
  <div>
    <div v-show="mode == 'write'" class="ql">
      <div ref="editorRef"></div>
    </div>
    <div v-if="mode == 'read'" class="ql-snow">
      <div
        @click="enableWriteMode"
        class="content ql-editor"
        v-html="initialValue ? initialValue : 'Add a description'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from '@vue/composition-api'
import Quill from 'quill'
import { quillConfig } from './editor'
export default defineComponent({
  name: 'j-text-editor',
  props: {
    placeholder: {
      type: String,
      default: undefined
    },
    value: {
      type: String,
      default: undefined
    },
    defaultValue: {
      type: String,
      default: undefined
    },
    mode: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const quill = ref<Quill>(null)
    const editorRef = ref<HTMLDivElement>(null)
    const initialValue = ref<string>(props.value || props.defaultValue)

    const initQuill = () => {
      return new Quill(editorRef.value as HTMLDivElement, {
        placeholder: props.placeholder,
        ...quillConfig
      })
    }

    const enableWriteMode = () => {
      emit('changeMode', 'write')
    }

    const insertValue = (quill: Quill, value: string) => {
      quill.clipboard.dangerouslyPasteHTML(0, value)
      quill.blur()
    }

    const getHTMLValue = () =>
      (editorRef.value as HTMLDivElement).querySelector('.ql-editor')?.innerHTML

    const handleContentsChange = () => {
      emit('input', getHTMLValue())
    }

    watch(
      () => props.mode,
      (_, from) => {
        if (from == 'write') {
          quill.value?.setText('')
          insertValue(quill.value as Quill, props.value)
          initialValue.value = props.value
        }
      },
      {
        lazy: true
      }
    )

    onMounted(() => {
      quill.value = initQuill()
      insertValue(quill.value, initialValue.value)
      quill.value.on('text-change', handleContentsChange)
      return () => {
        quill.value?.off('text-change', handleContentsChange)
        // eslint-disable-next-line
        quill.value = null as any
      }
    })
    return {
      editorRef,
      getHTMLValue,
      initialValue,
      enableWriteMode
    }
  }
})
</script>

<style lang="scss">
.ql {
  .ql-toolbar {
    border-radius: 4px 4px 0px 0px !important;
    border: 1px solid #dfe1e6 !important;
    border-bottom: none !important;
  }
  .ql-container.ql-snow {
    color: #172b4d;
    font-size: 15px;
    border-radius: 0px 0px 4px 4px;
    border: 1px solid #dfe1e6;
    border-top: none;
  }
}
.ql-editor {
  // min-height: 110px;
  font-family: 'CircularStd', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif, 'CircularStd';

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: bold;
  }
  img,
  video {
    display: inline-block;
  }
}
.content {
  padding: 0 !important;
  font-size: 15px;
}
</style>
