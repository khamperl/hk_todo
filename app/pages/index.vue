<script setup lang="ts">
import type { TodoStatus } from '#shared/types/todo'

const { pending, error, byStatus, createTodo, updateStatus, removeTodo } = useTodos()

const columns: { status: TodoStatus; title: string; description: string }[] = [
  { status: 'todo', title: 'Todo', description: 'Neu angelegt' },
  { status: 'progress', title: 'Progress', description: 'In Bearbeitung' },
  { status: 'done', title: 'Done', description: 'Abgeschlossen' },
]

const title = ref('')
const submitting = ref(false)
const formError = ref('')

async function onCreate() {
  formError.value = ''
  const nextTitle = title.value.trim()
  if (!nextTitle) {
    formError.value = 'Bitte einen Titel eingeben.'
    return
  }

  submitting.value = true
  try {
    await createTodo(nextTitle)
    title.value = ''
  } catch (err) {
    formError.value = err instanceof Error ? err.message : 'Todo konnte nicht angelegt werden.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-10">
    <header class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight">Todos</h1>
      <p class="mt-1 text-slate-600">Aufgaben anlegen und per Drag-and-Drop oder Buttons durch Todo, Progress und Done schieben.</p>
    </header>

    <form class="mb-8 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-start" @submit.prevent="onCreate">
      <div class="flex-1">
        <label class="sr-only" for="todo-title">Neuer Todo-Titel</label>
        <input
          id="todo-title"
          v-model="title"
          type="text"
          maxlength="200"
          placeholder="Was ist zu tun?"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-400 focus:ring-2"
        >
        <p v-if="formError" class="mt-2 text-sm text-red-600">{{ formError }}</p>
      </div>
      <button
        type="submit"
        class="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-50"
        :disabled="submitting"
      >
        Anlegen
      </button>
    </form>

    <p v-if="pending" class="text-slate-500">Lade Todos…</p>
    <p v-else-if="error" class="text-red-600">Todos konnten nicht geladen werden.</p>

    <section v-else class="grid gap-4 md:grid-cols-3">
      <TodoColumn
        v-for="column in columns"
        :key="column.status"
        :title="column.title"
        :description="column.description"
        :status="column.status"
        :todos="byStatus(column.status)"
        @move="updateStatus"
        @remove="removeTodo"
      />
    </section>
  </main>
</template>
