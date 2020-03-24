import { Issue, IssueStatus } from '@/types/issue'

export interface DropResult {
  removedIndex: number | null
  addedIndex: number | null
  to: number
  payload: Issue
}

export interface Target {
  index: number
  droppableId: IssueStatus
}

export const moveItemWithinArray = (
  arr: Issue[],
  item: Issue,
  newIndex: number
) => {
  const arrClone = [...arr]
  const oldIndex = arrClone.indexOf(item)
  arrClone.splice(newIndex, 0, arrClone.splice(oldIndex, 1)[0])
  return arrClone
}

export const insertItemIntoArray = (
  arr: Issue[],
  item: Issue,
  index: number
) => {
  const arrClone = [...arr]
  arrClone.splice(index, 0, item)
  return arrClone
}
export const updateArrayItemById = (
  arr: Issue[],
  itemId: string,
  fields: Partial<Issue>
) => {
  const arrClone = [...arr]
  const item = arrClone.find(({ id }) => id === itemId)
  if (item) {
    const itemIndex = arrClone.indexOf(item)
    arrClone.splice(itemIndex, 1, { ...item, ...fields })
  }
  return arrClone
}

export const isPositionChanged = (destination: Target, source: Target) => {
  if (!destination) return false
  const isSameList = destination.droppableId === source.droppableId
  const isSamePosition = destination.index === source.index
  return !isSameList || !isSamePosition
}

export const getSortedListIssues = (
  issues: Issue[] | readonly Issue[],
  status: string
) =>
  issues
    .filter(issue => issue.status === status)
    .sort((a, b) => a.listPosition - b.listPosition)

const getAfterDropPrevNextIssue = (
  allIssues: Issue[],
  destination: Target,
  source: Target,
  droppedIssueId: string
) => {
  const beforeDropDestinationIssues = getSortedListIssues(
    allIssues,
    destination.droppableId
  )
  const droppedIssue = allIssues.find(issue => issue.id === droppedIssueId)
  const isSameList = destination.droppableId === source.droppableId

  const afterDropDestinationIssues = isSameList
    ? moveItemWithinArray(
        beforeDropDestinationIssues,
        droppedIssue as Issue,
        destination.index
      )
    : insertItemIntoArray(
        beforeDropDestinationIssues,
        droppedIssue as Issue,
        destination.index
      )

  return {
    prevIssue: afterDropDestinationIssues[destination.index - 1],
    nextIssue: afterDropDestinationIssues[destination.index + 1]
  }
}

export const calculateIssueListPosition = (
  allIssues: Issue[],
  destination: Target,
  source: Target,
  droppedIssueId: string
) => {
  const { prevIssue, nextIssue } = getAfterDropPrevNextIssue(
    allIssues,
    destination,
    source,
    droppedIssueId
  )
  let position

  if (!prevIssue && !nextIssue) {
    position = 1
  } else if (!prevIssue) {
    position = nextIssue.listPosition - 1
  } else if (!nextIssue) {
    position = prevIssue.listPosition + 1
  } else {
    position =
      prevIssue.listPosition +
      (nextIssue.listPosition - prevIssue.listPosition) / 2
  }
  return position
}
