import { User } from './user'
import { Issue } from './issue'

export interface Comment {
  id: number
  body: string
  createdAt: Date
  updatedAt: Date
  userId: string
  issueId: number
  user: User
  issue: Issue
}

export default Comment
