export const TODO_STATUSES = ['todo', 'progress', 'done'] as const

export type TodoStatus = (typeof TODO_STATUSES)[number]

export interface Todo {
  id: string
  title: string
  status: TodoStatus
  createdAt: string
}

export function isTodoStatus(value: unknown): value is TodoStatus {
  return typeof value === 'string' && TODO_STATUSES.includes(value as TodoStatus)
}
