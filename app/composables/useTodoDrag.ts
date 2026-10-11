export function useTodoDrag() {
  const draggingTodoId = useState<string | null>('todo-dragging-id', () => null)

  function startDrag(id: string, event: DragEvent) {
    draggingTodoId.value = id
    event.dataTransfer?.setData('text/plain', id)
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
    }
  }

  function endDrag() {
    draggingTodoId.value = null
  }

  function readDragId(event: DragEvent) {
    return event.dataTransfer?.getData('text/plain') || draggingTodoId.value
  }

  return {
    draggingTodoId,
    startDrag,
    endDrag,
    readDragId,
  }
}
