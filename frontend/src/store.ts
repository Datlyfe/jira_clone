import Vue from 'vue'
import { getStoredAuthToken } from '@/utils/authToken'
import { Filters, Project, User } from '@/types'

const store = Vue.observable({
  currentUser: {} as User,
  project: {} as Project,
  isAuthenticated: !!getStoredAuthToken(),
  filters: {
    searchTerm: '',
    userIds: [],
    myOnly: false,
    recent: false
  } as Filters
})

export const getters = {
  project: () => store.project,
  filters: () => store.filters,
  currentUser: () => store.currentUser,
  isAuthenticated: () => store.isAuthenticated
}

export const mutations = {
  setFilters: (filters: Filters) => (store.filters = filters),
  setCurrentUser: (user: User) => (store.currentUser = user),
  setProject: (project: Project) => (store.project = project),
  setIsAuthenticated: (isAuth: boolean) => (store.isAuthenticated = isAuth)
}

export default {
  store,
  getters,
  mutations
}
