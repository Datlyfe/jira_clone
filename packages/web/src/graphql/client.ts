import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { getStoredAuthToken } from '@/utils/authToken'

const httpLink = new HttpLink({
  uri: import.meta.env.DEV
    ? 'http://localhost:5001/graphql'
    : 'https://jira-clone-api.onrender.com/graphql',
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: getStoredAuthToken()
        ? `Bearer ${getStoredAuthToken()}`
        : undefined,
    },
  }
})

const cache = new InMemoryCache()

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
})
