import {
  addProject,
  addTodoToProject,
  clearCompletedTodos,
  defaultProjectId,
  deleteTodoFromProject,
  getProject,
  getProjectTodos,
  normalizeProjects,
  setTodoCompleted,
  updateTodoDetails,
} from "./appLogic.js";
import { loadProjects, saveProjects } from "./storage.js";
import { createTodoItem } from "./todoItem.js";

const projectForm = document.querySelector("#project-form");
const projectInput = document.querySelector("#project-input");
const projectList = document.querySelector("#project-list");
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const descriptionInput = document.querySelector("#description-input");
const dueDateInput = document.querySelector("#due-date-input");
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

projectForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = projectInput.value.trim();

  if (!name) {
    return;
  }

  const project = addProject(projects, name);
  currentProjectId = project.id;
  currentFilter = "all";
  saveProjects(projects);
  updateFilterButtons();
  renderTodos();

  projectInput.value = "";
  projectInput.focus();
});

projectList.addEventListener("click", (event) => {
  const projectButton = event.target.closest("[data-project-id]");

  if (!projectButton) {
    return;
  }

  currentProjectId = projectButton.dataset.projectId;
  currentFilter = "all";
  editingTodoId = null;
  updateFilterButtons();
  renderTodos();
});

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = todoInput.value.trim();

  if (!title) {
    return;
  }

  addTodoToProject(projects, currentProjectId, {
    title,
    description: descriptionInput.value.trim(),
    dueDate: dueDateInput.value,
    priority: priorityInput.value,
  });

  saveProjects(projects);
  renderTodos();

  todoInput.value = "";
  descriptionInput.value = "";
  dueDateInput.value = "";
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
  clearCompletedTodos(projects, currentProjectId);
  saveProjects(projects);
  renderTodos();
});

function renderTodos() {
  todoList.innerHTML = "";
  projects = normalizeProjects(projects);
  currentProjectId = getCurrentProject().id;
  saveProjects(projects);

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
  renderProjects();
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
  setTodoCompleted(projects, currentProjectId, id, completed);
  saveProjects(projects);
  renderTodos();
}

function deleteTodo(id) {
  deleteTodoFromProject(projects, currentProjectId, id);
  saveProjects(projects);
  renderTodos();
}

function editTodo(id) {
  editingTodoId = id;
  renderTodos();
}

function saveEdit(id, details, priority) {
  const updatedTodo = updateTodoDetails(projects, currentProjectId, id, {
    ...details,
    notes: details.notes,
    priority,
  });

  if (!updatedTodo) {
    return;
  }

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

function renderProjects() {
  projectList.innerHTML = "";

  projects.forEach((project) => {
    const button = document.createElement("button");
    button.className = "project-button";
    button.classList.toggle("is-active", project.id === currentProjectId);
    button.type = "button";
    button.dataset.projectId = project.id;

    const name = document.createElement("span");
    name.textContent = project.name;

    const count = document.createElement("span");
    count.className = "project-count";
    count.textContent = project.todos.length;

    button.append(name, count);
    projectList.append(button);
  });
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
  return getProject(projects, currentProjectId);
}

function getCurrentTodos() {
  return getProjectTodos(projects, currentProjectId);
}
