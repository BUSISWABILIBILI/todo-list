const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const todoFilters = document.querySelector("#todo-filters");
const todoCount = document.querySelector("#todo-count");
const clearCompletedButton = document.querySelector("#clear-completed");
const emptyState = document.querySelector("#empty-state");
const storageKey = "todo-project-tasks";

let todos = loadTodos();
let currentFilter = "all";

renderTodos();

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (!text) {
    return;
  }

  todos.push({
    id: crypto.randomUUID(),
    text,
    completed: false,
  });

  saveTodos();
  renderTodos();

  todoInput.value = "";
  todoInput.focus();
});

todoFilters.addEventListener("click", (event) => {
  const filterButton = event.target.closest("[data-filter]");

  if (!filterButton) {
    return;
  }

  currentFilter = filterButton.dataset.filter;
  updateFilterButtons();
  renderTodos();
});

clearCompletedButton.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

function renderTodos() {
  todoList.innerHTML = "";

  const visibleTodos = getFilteredTodos();

  visibleTodos.forEach((todo) => {
    todoList.append(createTodoItem(todo));
  });

  updateEmptyState(visibleTodos.length);
  updateTodoFooter();
}

function getFilteredTodos() {
  if (currentFilter === "active") {
    return todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === "completed") {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

function createTodoItem(todo) {
  const item = document.createElement("li");
  item.className = "todo-item";
  item.classList.toggle("is-complete", todo.completed);

  const label = document.createElement("label");
  label.className = "todo-check";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;

  const text = document.createElement("span");
  text.textContent = todo.text;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";

  checkbox.addEventListener("change", () => {
    todo.completed = checkbox.checked;
    saveTodos();
    renderTodos();
  });

  deleteButton.addEventListener("click", () => {
    todos = todos.filter((currentTodo) => currentTodo.id !== todo.id);
    saveTodos();
    renderTodos();
  });

  label.append(checkbox, text);
  item.append(label, deleteButton);

  return item;
}

function loadTodos() {
  const savedTodos = localStorage.getItem(storageKey);

  if (!savedTodos) {
    return [];
  }

  return JSON.parse(savedTodos);
}

function saveTodos() {
  localStorage.setItem(storageKey, JSON.stringify(todos));
}

function updateFilterButtons() {
  const filterButtons = todoFilters.querySelectorAll("[data-filter]");

  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === currentFilter);
  });
}

function updateTodoFooter() {
  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;
  const taskLabel = activeCount === 1 ? "task" : "tasks";

  todoCount.textContent = `${activeCount} active ${taskLabel}`;
  clearCompletedButton.disabled = completedCount === 0;
}

function updateEmptyState(visibleCount) {
  emptyState.hidden = visibleCount > 0;

  if (visibleCount > 0) {
    return;
  }

  if (todos.length === 0) {
    emptyState.textContent = "No tasks yet. Add one above.";
    return;
  }

  if (currentFilter === "active") {
    emptyState.textContent = "No active tasks.";
    return;
  }

  emptyState.textContent = "No completed tasks.";
}
