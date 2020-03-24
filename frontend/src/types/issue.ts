import { User } from './user'

export enum IssueType {
  TASK = 'task',
  BUG = 'bug',
  STORY = 'story'
}

export enum IssueStatus {
  BACKLOG = 'backlog',
  SELECTED = 'selected',
  INPROGRESS = 'inprogress',
  DONE = 'done'
}

export enum IssuePriority {
  HIGHEST = '5',
  HIGH = '4',
  MEDIUM = '3',
  LOW = '2',
  LOWEST = '1'
}

export interface Issue {
  id: string
  title: string
  type: IssueType
  status: IssueStatus
  priority: IssuePriority
  listPosition: number
  description: string | null
  estimate: number | null
  timeSpent: number | null
  timeRemaining: number | null
  createdAt: Date
  updatedAt: Date
  reporterId: string
  userIds: string[]
  comments: Comment[]
  projectId: number | string
}

export interface IssueCreateDTO {
  type: IssueType
  title: string
  description: string | null
  reporterId: string
  userIds: string[]
  priority: IssuePriority
  status?: IssueStatus
  projectId?: number | string
  users?: Partial<User>[]
}

export const IssueStatusCopy = {
  [IssueStatus.BACKLOG]: 'Backlog',
  [IssueStatus.SELECTED]: 'Selected for development',
  [IssueStatus.INPROGRESS]: 'In progress',
  [IssueStatus.DONE]: 'Done'
}
export const IssuePriorityCopy = {
  [IssuePriority.HIGH]: 'High',
  [IssuePriority.HIGHEST]: 'Highest',
  [IssuePriority.MEDIUM]: 'Medium',
  [IssuePriority.LOW]: 'Low',
  [IssuePriority.LOWEST]: 'Lowest'
}

export const IssueTypeCopy = {
  [IssueType.TASK]: 'Task',
  [IssueType.BUG]: 'Bug',
  [IssueType.STORY]: 'Story'
}

export default Issue
