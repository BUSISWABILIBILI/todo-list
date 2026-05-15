import { loadTodos, saveTodos } from "./storage.js";
import { createTodoItem } from "./todoItem.js";

const priorityLevels = ["low", "medium", "high"];

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const priorityInput = document.querySelector("#priority-input");
const todoList = document.querySelector("#todo-list");
const todoFilters = document.querySelector("#todo-filters");
const todoCount = document.querySelector("#todo-count");
const totalCount = document.querySelector("#total-count");
const activeCount = document.querySelector("#active-count");
const completedCount = document.querySelector("#completed-count");
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
    priority: priorityInput.value,
    completed: false,
  });

  saveTodos(todos);
  renderTodos();

  todoInput.value = "";
  priorityInput.value = "medium";
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
  normalizeTodos();

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

function saveEdit(id, text, priority) {
  const todo = todos.find((currentTodo) => currentTodo.id === id);

  if (!todo) {
    return;
  }

  todo.text = text;
  todo.priority = priority;
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
  const activeTotal = todos.filter((todo) => !todo.completed).length;
  const completedTotal = todos.length - activeTotal;
  const taskLabel = activeTotal === 1 ? "task" : "tasks";

  totalCount.textContent = todos.length;
  activeCount.textContent = activeTotal;
  completedCount.textContent = completedTotal;
  todoCount.textContent = `${activeTotal} active ${taskLabel}`;
  clearCompletedButton.disabled = completedTotal === 0;
}

function normalizeTodos() {
  let changed = false;

  todos.forEach((todo) => {
    if (!priorityLevels.includes(todo.priority)) {
      todo.priority = "medium";
      changed = true;
    }
  });

  if (changed) {
    saveTodos(todos);
  }
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
