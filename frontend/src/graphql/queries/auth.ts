import gql from 'graphql-tag'
import { apolloClient } from '../client'
import { User } from '@/types/user'

export const createGuestAccount = gql`
  query createGuestAccount {
    createGuestAccount
  }
`

export const currentUser = gql`
  query currentUser {
    currentUser {
      id
      name
      avatarUrl
    }
  }
`

export const fetchMe = async (): Promise<User> => {
  try {
    const res = await apolloClient.query<{ currentUser: User }>({
      query: currentUser
    })
    return Promise.resolve(res.data.currentUser)
  } catch (error) {
    return Promise.reject(error)
  }
}
