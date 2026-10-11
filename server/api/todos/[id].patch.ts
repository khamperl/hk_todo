import { isTodoStatus } from '#shared/types/todo'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<{ status?: unknown; title?: unknown }>(event)
  const todos = await readTodos()
  const todo = todos.find(item => item.id === id)

  if (!todo) {
    throw createError({ statusCode: 404, statusMessage: 'Todo nicht gefunden' })
  }

  if (body?.status !== undefined) {
    if (!isTodoStatus(body.status)) {
      throw createError({ statusCode: 400, statusMessage: 'Ungültiger Status' })
    }
    todo.status = body.status
  }

  if (body?.title !== undefined) {
    if (typeof body.title !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'Ungültiger Titel' })
    }

    const title = body.title.trim()
    if (!title) {
      throw createError({ statusCode: 400, statusMessage: 'Titel ist erforderlich' })
    }
    if (title.length > 200) {
      throw createError({ statusCode: 400, statusMessage: 'Titel darf höchstens 200 Zeichen haben' })
    }
    todo.title = title
  }

  await writeTodos(todos)
  return todo
})
