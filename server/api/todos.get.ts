export default defineEventHandler(async () => {
  const todos = await readTodos()
  return [...todos].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
})
