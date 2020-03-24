import Vue from 'vue'
import Avatar from '@/components/shared/Avatar/Avatar.vue'
import Breadcrumbs from '@/components/shared/Breadcrumbs/Breadcrumbs.vue'
import Button from '@/components/shared/Button/Button.vue'
import Icon from '@/components/shared/Icon/Icon.vue'
import Input from '@/components/shared/Input/Input.vue'
import Select from '@/components/shared/Select/Select.vue'
import TextEditor from '@/components/shared/TextEditor/TextEditor.vue'
import Textarea from '@/components/shared/Textarea/Textarea.vue'

const sharedComponents = [
  Avatar,
  Breadcrumbs,
  Button,
  Icon,
  Input,
  Select,
  TextEditor,
  Textarea
]

export const registerSharedComponents = () => {
  // eslint-disable-next-line
  sharedComponents.forEach((c: any) => Vue.component(c.name, c))
}
