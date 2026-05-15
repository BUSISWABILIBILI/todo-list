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
let editingTodoId = null;

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

  if (editingTodoId === todo.id) {
    item.classList.add("is-editing");
    item.append(createEditForm(todo));
    return item;
  }

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

  const editButton = document.createElement("button");
  editButton.className = "edit-button";
  editButton.type = "button";
  editButton.textContent = "Edit";

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

  editButton.addEventListener("click", () => {
    editingTodoId = todo.id;
    renderTodos();
  });

  label.append(checkbox, text);
  const actions = document.createElement("div");
  actions.className = "todo-actions";
  actions.append(editButton, deleteButton);

  item.append(label, actions);

  return item;
}

function createEditForm(todo) {
  const form = document.createElement("form");
  form.className = "edit-form";

  const input = document.createElement("input");
  input.type = "text";
  input.value = todo.text;
  input.setAttribute("aria-label", "Edit task");

  const saveButton = document.createElement("button");
  saveButton.className = "save-button";
  saveButton.type = "submit";
  saveButton.textContent = "Save";

  const cancelButton = document.createElement("button");
  cancelButton.className = "cancel-button";
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const updatedText = input.value.trim();

    if (!updatedText) {
      return;
    }

    todo.text = updatedText;
    editingTodoId = null;
    saveTodos();
    renderTodos();
  });

  cancelButton.addEventListener("click", () => {
    editingTodoId = null;
    renderTodos();
  });

  form.append(input, saveButton, cancelButton);

  requestAnimationFrame(() => {
    input.focus();
    input.select();
  });

  return form;
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
