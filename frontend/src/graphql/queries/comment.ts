import gql from 'graphql-tag'

export const createComment = gql`
  mutation createComment($comment: CommentInput!) {
    createComment(comment: $comment) {
      id
      body
      issueId
      userId
      createdAt
      updatedAt
    }
  }
`

export const deleteComment = gql`
  mutation deleteComment($commentId: String!) {
    deleteComment(id: $commentId) {
      body
    }
  }
`
export const updateComment = gql`
  mutation updateComment($commentId: String!, $comment: CommentInput!) {
    updateComment(comment: $comment, id: $commentId) {
      body
    }
  }
`
