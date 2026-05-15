const storageKey = "todo-project-tasks";

export function loadTodos() {
  const savedTodos = localStorage.getItem(storageKey);

  if (!savedTodos) {
    return [];
  }

  return JSON.parse(savedTodos);
}

export function saveTodos(todos) {
  localStorage.setItem(storageKey, JSON.stringify(todos));
}
