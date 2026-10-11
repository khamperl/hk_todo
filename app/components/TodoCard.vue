<script setup lang="ts">
import type { Todo, TodoStatus } from '#shared/types/todo'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  move: [payload: { id: string; status: TodoStatus }]
  remove: [id: string]
}>()

const { draggingTodoId, startDrag, endDrag } = useTodoDrag()
const isDragging = computed(() => draggingTodoId.value === props.todo.id)

const previousStatus: Record<TodoStatus, TodoStatus | null> = {
  todo: null,
  progress: 'todo',
  done: 'progress',
}

const nextStatus: Record<TodoStatus, TodoStatus | null> = {
  todo: 'progress',
  progress: 'done',
  done: null,
}

function moveTo(status: TodoStatus | null) {
  if (!status) {
    return
  }
  emit('move', { id: props.todo.id, status })
}

function onDragStart(event: DragEvent) {
  startDrag(props.todo.id, event)
}
</script>

<template>
  <article
    draggable="true"
    :data-todo-id="todo.id"
    class="cursor-grab rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200 active:cursor-grabbing"
    :class="isDragging ? 'opacity-50' : ''"
    @dragstart="onDragStart"
    @dragend="endDrag"
  >
    <p class="font-medium">{{ todo.title }}</p>
    <div class="mt-3 flex flex-wrap gap-2">
      <button
        v-if="previousStatus[todo.status]"
        type="button"
        class="rounded-md bg-slate-100 px-2 py-1 text-sm text-slate-700 hover:bg-slate-200"
        @pointerdown.stop
        @click="moveTo(previousStatus[todo.status])"
      >
        Zurück
      </button>
      <button
        v-if="nextStatus[todo.status]"
        type="button"
        class="rounded-md bg-slate-900 px-2 py-1 text-sm text-white hover:bg-slate-700"
        @pointerdown.stop
        @click="moveTo(nextStatus[todo.status])"
      >
        {{ todo.status === 'todo' ? 'In Bearbeitung' : 'Abschließen' }}
      </button>
      <button
        type="button"
        class="ml-auto rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50"
        @pointerdown.stop
        @click="emit('remove', todo.id)"
      >
        Löschen
      </button>
    </div>
  </article>
</template>
