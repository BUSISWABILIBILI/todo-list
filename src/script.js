import {
  addProject,
  addTodoToProject,
  clearCompletedTodos,
  defaultProjectId,
  deleteProject,
  deleteTodoFromProject,
  getProject,
  getProjectTodos,
  normalizeProjects,
  setTodoCompleted,
  updateProjectName,
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
const currentProjectName = document.querySelector("#current-project-name");
const currentProjectMeta = document.querySelector("#current-project-meta");
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
let editingProjectId = null;

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
  const actionButton = event.target.closest("[data-project-action]");
  const projectRow = event.target.closest("[data-project-id]");

  if (actionButton && projectRow) {
    handleProjectAction(actionButton.dataset.projectAction, projectRow.dataset.projectId);
    return;
  }

  if (event.target.closest(".project-edit-form")) {
    return;
  }

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
  editingProjectId = projects.some((project) => project.id === editingProjectId)
    ? editingProjectId
    : null;
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
  updateWorkspaceHeader();
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

function handleProjectAction(action, projectId) {
  if (action === "select") {
    currentProjectId = projectId;
    currentFilter = "all";
    editingTodoId = null;
    editingProjectId = null;
    updateFilterButtons();
    renderTodos();
    return;
  }

  if (action === "edit") {
    editingProjectId = projectId;
    renderTodos();
    return;
  }

  if (action === "cancel-edit") {
    editingProjectId = null;
    renderTodos();
    return;
  }

  if (action === "save-edit") {
    const input = projectList.querySelector(`[data-project-name-input="${projectId}"]`);
    const project = updateProjectName(projects, projectId, input.value);

    if (!project) {
      input.focus();
      return;
    }

    editingProjectId = null;
    saveProjects(projects);
    renderTodos();
    return;
  }

  if (action === "delete") {
    projects = deleteProject(projects, projectId);

    if (currentProjectId === projectId) {
      currentProjectId = defaultProjectId;
    }

    editingProjectId = null;
    saveProjects(projects);
    renderTodos();
  }
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

function updateWorkspaceHeader() {
  const currentProject = getCurrentProject();
  const taskTotal = getCurrentTodos().length;
  const taskLabel = taskTotal === 1 ? "task" : "tasks";

  currentProjectName.textContent = currentProject.name;
  currentProjectMeta.textContent = `${taskTotal} ${taskLabel} in this project`;
}

function renderProjects() {
  projectList.innerHTML = "";

  projects.forEach((project) => {
    const row = document.createElement("div");
    row.className = "project-row";
    row.classList.toggle("is-active", project.id === currentProjectId);
    row.dataset.projectId = project.id;

    if (project.id === editingProjectId) {
      row.append(createProjectEditForm(project));
      projectList.append(row);
      return;
    }

    const button = document.createElement("button");
    button.className = "project-select";
    button.type = "button";
    button.dataset.projectAction = "select";

    const name = document.createElement("span");
    name.textContent = project.name;

    const count = document.createElement("span");
    count.className = "project-count";
    count.textContent = project.todos.length;

    button.append(name, count);
    const actions = document.createElement("div");
    actions.className = "project-actions";

    const editButton = document.createElement("button");
    editButton.className = "project-action-button";
    editButton.type = "button";
    editButton.dataset.projectAction = "edit";
    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.className = "project-action-button danger";
    deleteButton.type = "button";
    deleteButton.dataset.projectAction = "delete";
    deleteButton.disabled = project.id === defaultProjectId || projects.length <= 1;
    deleteButton.textContent = "Delete";

    actions.append(editButton, deleteButton);
    row.append(button, actions);
    projectList.append(row);
  });
}

function createProjectEditForm(project) {
  const form = document.createElement("form");
  form.className = "project-edit-form";

  const input = document.createElement("input");
  input.type = "text";
  input.value = project.name;
  input.dataset.projectNameInput = project.id;
  input.setAttribute("aria-label", "Project name");

  const saveButton = document.createElement("button");
  saveButton.className = "project-save-button";
  saveButton.type = "submit";
  saveButton.textContent = "Save";

  const cancelButton = document.createElement("button");
  cancelButton.className = "project-cancel-button";
  cancelButton.type = "button";
  cancelButton.dataset.projectAction = "cancel-edit";
  cancelButton.textContent = "Cancel";

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleProjectAction("save-edit", project.id);
  });

  form.append(input, saveButton, cancelButton);
  requestAnimationFrame(() => input.focus());

  return form;
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
