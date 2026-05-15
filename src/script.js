import { loadTodos, saveTodos } from "./storage.js";
import { createTodoItem } from "./todoItem.js";

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const todoFilters = document.querySelector("#todo-filters");
const todoCount = document.querySelector("#todo-count");
const clearCompletedButton = document.querySelector("#clear-completed");
const emptyState = document.querySelector("#empty-state");

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

  saveTodos(todos);
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
  saveTodos(todos);
  renderTodos();
});

function renderTodos() {
  todoList.innerHTML = "";

  const visibleTodos = getFilteredTodos();

  visibleTodos.forEach((todo) => {
    todoList.append(
      createTodoItem(todo, {
        editingTodoId,
        onCancelEdit: cancelEdit,
        onDelete: deleteTodo,
        onEdit: editTodo,
        onSaveEdit: saveEdit,
        onToggle: toggleTodo,
      })
    );
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

function toggleTodo(id, completed) {
  const todo = todos.find((currentTodo) => currentTodo.id === id);

  if (!todo) {
    return;
  }

  todo.completed = completed;
  saveTodos(todos);
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos(todos);
  renderTodos();
}

function editTodo(id) {
  editingTodoId = id;
  renderTodos();
}

function saveEdit(id, text) {
  const todo = todos.find((currentTodo) => currentTodo.id === id);

  if (!todo) {
    return;
  }

  todo.text = text;
  editingTodoId = null;
  saveTodos(todos);
  renderTodos();
  todoInput.focus();
}

function cancelEdit() {
  editingTodoId = null;
  renderTodos();
  todoInput.focus();
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
