import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '@/store'
import { authenticate } from '@/auth/authenticate'
import { fetchMe } from '@/graphql/queries/auth'

Vue.use(VueRouter)

function loadView(view: string) {
  return () =>
    import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`)
}

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'root',
    redirect: 'project'
  },
  {
    path: '/project',
    meta: { requiresAuth: true },
    component: loadView('Project/Project'),
    children: [
      {
        path: '',
        name: 'board',
        component: loadView('Project/Board')
      },
      {
        path: 'settings',
        name: 'settings',
        component: loadView('Project/Settings')
      },
      {
        path: 'issue/:issueId',
        name: 'issue',
        component: loadView('Project/FullIIssueDetails'),
        props: true
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, _, next) => {
  if (to.matched.some(routeRecord => routeRecord.meta.requiresAuth)) {
    if (!store.getters.isAuthenticated()) {
      await authenticate()
      next({ name: to.name || 'root' })
    } else {
      try {
        const currentUser = await fetchMe()
        store.mutations.setCurrentUser(currentUser)
        next()
      } catch (error) {
        if (
          error.message ===
            'GraphQL error: Authentication token is invalid: User not found.' ||
          error.message === 'GraphQL error: Authentication token is invalid.'
        ) {
          await authenticate()
          next({ name: to.name || 'root' })
        }
      }
    }
  } else {
    next()
  }
})

export default router
