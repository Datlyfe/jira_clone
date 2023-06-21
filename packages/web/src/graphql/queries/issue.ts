import gql from 'graphql-tag'

export const getIssueWithUsersAndComments = gql`
  query getIssue($id: Int!) {
    getIssueWithUsersAndComments(issueId: $id) {
      id
      title
      description
      type
      status
      priority
      reporterId
      listPosition
      createdAt
      updatedAt
      userIds
      comments {
        id
        body
        updatedAt
        issueId
        userId
        createdAt
        user {
          id
          name
          avatarUrl
        }
      }
    }
  }
`

export const getProjectIssues = gql`
  query getProjectIssues($searchTerm: String) {
    getProjectIssues(searchTerm: $searchTerm) {
      id
      title
      description
      type
      reporterId
      status
      priority
      listPosition
      createdAt
      updatedAt
      userIds
    }
  }
`

export const createIssue = gql`
  mutation createIssue($issue: IssueCreateInput!) {
    createIssue(issue: $issue) {
      id
      title
      type
      reporterId
      status
      createdAt
      updatedAt
    }
  }
`

export const updateIssueMutation = gql`
  mutation updateIssue($issueId: Float!, $issue: IssueUpdateInput!) {
    updateIssue(id: $issueId, issue: $issue) {
      id
      title
      description
      type
      reporterId
      status
      priority
      listPosition
      createdAt
      updatedAt
      userIds
    }
  }
`

export const deleteIssue = gql`
  mutation deleteIssue($issueId: Float!) {
    deleteIssue(id: $issueId)
  }
`
