import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vc, { provide } from '@vue/composition-api'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from '@/graphql/client'
import { registerSharedComponents } from '@/plugins/register'
import { loadSprites } from '@/plugins/loadSvg'

// import '@/plugins/toast'
import '@/plugins/tippy'
import 'quill/dist/quill.snow.css'
import '@/main.scss'

Vue.use(vc)
loadSprites()
registerSharedComponents()

Vue.config.productionTip = false

new Vue({
  setup() {
    provide(DefaultApolloClient, apolloClient)
    return {}
  },
  router,
  render: h => h(App)
}).$mount('#app')
