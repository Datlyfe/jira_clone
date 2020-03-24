import { createGuestAccount, fetchMe } from '../graphql/queries/auth'
import { apolloClient } from '../graphql/client'
import { storeAuthToken } from '../utils/authToken'
import store from '../store'

export const authenticate = async () => {
  try {
    const result = await apolloClient.query<{ createGuestAccount: string }>({
      query: createGuestAccount
    })
    const { createGuestAccount: authToken } = result.data
    storeAuthToken(authToken)
    store.mutations.setIsAuthenticated(true)
    const currentUser = await fetchMe()
    store.mutations.setCurrentUser(currentUser)
  } catch (error) {
    // toast.error(error);
    console.error(error)
  }
}
