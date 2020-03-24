import { Issue } from './issue'
import { Project } from './project'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string
  createdAt: Date
  updatedAt: Date
  comments: Comment[]
  issues: Issue[]
  project: Project
  projectId: number
}

export default User
