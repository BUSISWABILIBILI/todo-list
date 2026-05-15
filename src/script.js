import { createTodo, defaultProjectId, normalizeProjects } from "./appLogic.js";
import { loadProjects, saveProjects } from "./storage.js";
import { createTodoItem } from "./todoItem.js";

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

let projects = loadProjects();
let currentProjectId = defaultProjectId;
let currentFilter = "all";
let editingTodoId = null;

renderTodos();

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = todoInput.value.trim();

  if (!title) {
    return;
  }

  getCurrentProject().todos.push(
    createTodo({
      title,
      priority: priorityInput.value,
    })
  );

  saveProjects(projects);
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
  const currentProject = getCurrentProject();
  currentProject.todos = currentProject.todos.filter((todo) => !todo.completed);
  saveProjects(projects);
  renderTodos();
});

function renderTodos() {
  todoList.innerHTML = "";
  projects = normalizeProjects(projects);
  currentProjectId = getCurrentProject().id;

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
  const todos = getCurrentTodos();

  if (currentFilter === "active") {
    return todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === "completed") {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

function toggleTodo(id, completed) {
  const todo = getCurrentTodos().find((currentTodo) => currentTodo.id === id);

  if (!todo) {
    return;
  }

  todo.completed = completed;
  saveProjects(projects);
  renderTodos();
}

function deleteTodo(id) {
  const currentProject = getCurrentProject();
  currentProject.todos = currentProject.todos.filter((todo) => todo.id !== id);
  saveProjects(projects);
  renderTodos();
}

function editTodo(id) {
  editingTodoId = id;
  renderTodos();
}

function saveEdit(id, text, priority) {
  const todo = getCurrentTodos().find((currentTodo) => currentTodo.id === id);

  if (!todo) {
    return;
  }

  todo.title = text;
  todo.priority = priority;
  editingTodoId = null;
  saveProjects(projects);
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
  const todos = getCurrentTodos();
  const activeTotal = todos.filter((todo) => !todo.completed).length;
  const completedTotal = todos.length - activeTotal;
  const taskLabel = activeTotal === 1 ? "task" : "tasks";

  totalCount.textContent = todos.length;
  activeCount.textContent = activeTotal;
  completedCount.textContent = completedTotal;
  todoCount.textContent = `${activeTotal} active ${taskLabel}`;
  clearCompletedButton.disabled = completedTotal === 0;
}

function updateEmptyState(visibleCount) {
  emptyState.hidden = visibleCount > 0;

  if (visibleCount > 0) {
    return;
  }

  if (getCurrentTodos().length === 0) {
    emptyState.textContent = "No tasks yet. Add one above.";
    return;
  }

  if (currentFilter === "active") {
    emptyState.textContent = "No active tasks.";
    return;
  }

  emptyState.textContent = "No completed tasks.";
}

function getCurrentProject() {
  return (
    projects.find((project) => project.id === currentProjectId) ||
    projects[0]
  );
}

function getCurrentTodos() {
  return getCurrentProject().todos;
}
