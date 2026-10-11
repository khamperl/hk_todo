import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Todo } from '#shared/types/todo'

const DATA_DIR = join(process.cwd(), 'data')
const DATA_FILE = join(DATA_DIR, 'todos.json')

export async function readTodos(): Promise<Todo[]> {
  try {
    const raw = await readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as Todo[]) : []
  } catch {
    return []
  }
}

export async function writeTodos(todos: Todo[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(DATA_FILE, `${JSON.stringify(todos, null, 2)}\n`, 'utf8')
}
