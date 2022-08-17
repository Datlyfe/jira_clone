import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vc, { provide } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from '@/graphql/client'
// import { registerSharedComponents } from '@/plugins/register'
// import { loadSprites } from '@/plugins/loadSvg'

// import '@/plugins/toast'
import { registerTippy } from '@/plugins/tippy'
import 'quill/dist/quill.snow.css'
import '@/main.scss'

// loadSprites()
// registerSharedComponents()

const app = createApp(App)

app.provide(DefaultApolloClient, apolloClient)
app.use(router)

registerTippy(app)

app.mount('#app')
