import type { Todo } from '#shared/types/todo'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ title?: string }>(event)
  const title = body?.title?.trim() ?? ''

  if (!title) {
    throw createError({ statusCode: 400, statusMessage: 'Titel ist erforderlich' })
  }

  if (title.length > 200) {
    throw createError({ statusCode: 400, statusMessage: 'Titel darf höchstens 200 Zeichen haben' })
  }

  const todos = await readTodos()
  const todo: Todo = {
    id: crypto.randomUUID(),
    title,
    status: 'todo',
    createdAt: new Date().toISOString(),
  }

  todos.push(todo)
  await writeTodos(todos)
  return todo
})
