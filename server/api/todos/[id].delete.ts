export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const todos = await readTodos()
  const index = todos.findIndex(item => item.id === id)

  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Todo nicht gefunden' })
  }

  const [removed] = todos.splice(index, 1)
  await writeTodos(todos)
  return removed
})
