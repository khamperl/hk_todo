import type { Todo, TodoStatus } from '#shared/types/todo'

export function useTodos() {
  const { data, refresh, status, error } = useFetch<Todo[]>('/api/todos')

  const todos = computed(() => data.value ?? [])
  const pending = computed(() => status.value === 'pending')

  function byStatus(todoStatus: TodoStatus) {
    return todos.value.filter(todo => todo.status === todoStatus)
  }

  async function createTodo(title: string) {
    await $fetch('/api/todos', {
      method: 'POST',
      body: { title },
    })
    await refresh()
  }

  async function updateStatus(id: string, nextStatus: TodoStatus) {
    const current = todos.value.find(todo => todo.id === id)
    if (!current || current.status === nextStatus) {
      return
    }

    await $fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      body: { status: nextStatus },
    })
    await refresh()
  }

  async function removeTodo(id: string) {
    await $fetch(`/api/todos/${id}`, { method: 'DELETE' })
    await refresh()
  }

  return {
    todos,
    pending,
    error,
    byStatus,
    createTodo,
    updateStatus,
    removeTodo,
  }
}
