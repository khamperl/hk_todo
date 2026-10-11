<script setup lang="ts">
import type { Todo, TodoStatus } from '#shared/types/todo'

const props = defineProps<{
  title: string
  description: string
  status: TodoStatus
  todos: Todo[]
}>()

const emit = defineEmits<{
  move: [id: string, status: TodoStatus]
  remove: [id: string]
}>()

const { draggingTodoId, readDragId, endDrag } = useTodoDrag()
const isDropTarget = ref(false)

const canDrop = computed(() => {
  if (!draggingTodoId.value) {
    return false
  }
  return !props.todos.some(todo => todo.id === draggingTodoId.value)
})

function onDragOver(event: DragEvent) {
  if (!draggingTodoId.value) {
    return
  }
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = canDrop.value ? 'move' : 'none'
  }
  isDropTarget.value = canDrop.value
}

function onDragLeave(event: DragEvent) {
  const current = event.currentTarget as HTMLElement
  const related = event.relatedTarget as Node | null
  if (related && current.contains(related)) {
    return
  }
  isDropTarget.value = false
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  isDropTarget.value = false

  const id = readDragId(event)
  endDrag()

  if (!id || props.todos.some(todo => todo.id === id)) {
    return
  }

  emit('move', id, props.status)
}
</script>

<template>
  <section
    :data-column-status="status"
    class="flex min-h-80 flex-col rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 transition"
    :class="isDropTarget ? 'bg-slate-100 ring-2 ring-slate-900' : ''"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <header class="mb-4">
      <div class="flex items-center justify-between gap-2">
        <h2 class="text-lg font-semibold">{{ title }}</h2>
        <span class="rounded-full bg-white px-2 py-0.5 text-sm text-slate-600 ring-1 ring-slate-200">
          {{ todos.length }}
        </span>
      </div>
      <p class="text-sm text-slate-500">{{ description }}</p>
    </header>

    <div class="flex flex-1 flex-col gap-3">
      <TodoCard
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @move="emit('move', $event.id, $event.status)"
        @remove="emit('remove', $event)"
      />
      <p
        v-if="todos.length === 0"
        class="rounded-lg border border-dashed border-slate-300 px-3 py-6 text-center text-sm text-slate-400"
      >
        {{ isDropTarget ? 'Hier ablegen' : 'Keine Einträge' }}
      </p>
    </div>
  </section>
</template>
