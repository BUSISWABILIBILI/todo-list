import {
  addProject,
  addTodoToProject,
  clearCompletedTodos,
  deleteProject,
  deleteTodoFromProject,
  getProject,
  getProjectTodos,
  normalizeProjects,
  setTodoCompleted,
  updateProjectName,
  updateTodoDetails,
} from "../domain/appLogic.js";
import { loadProjects, saveProjects } from "../storage/projectStorage.js";
import { createAppView } from "../ui/appView.js";
import { createTodoItem } from "../ui/todoItem.js";

const priorityRank = {
  high: 0,
  medium: 1,
  low: 2,
};

export function startApp(root) {
  const view = createAppView(root);
  let projects = loadProjects();
  let currentProjectId = null;
  let currentFilter = "all";
  let editingTodoId = null;
  let editingProjectId = null;
  let isTaskComposerOpen = false;
  let storageErrorMessage = "";

  view.projectInput.addEventListener("input", updateProjectSubmitState);

  view.addTaskButton.addEventListener("click", () => {
    isTaskComposerOpen = !isTaskComposerOpen;
    updateWorkspaceVisibility();

    if (isTaskComposerOpen) {
      view.todoInput.focus();
    }
  });

  view.closeTaskButton.addEventListener("click", closeTaskComposer);

  view.todoForm.addEventListener("click", (event) => {
    if (event.target.dataset.dialogClose === "task") {
      closeTaskComposer();
    }
  });

  view.projectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = view.projectInput.value.trim();

    if (!name) {
      return;
    }

    const project = addProject(projects, name);
    currentProjectId = project.id;
    currentFilter = "all";
    saveAndRender();

    view.projectInput.value = "";
    updateProjectSubmitState();
    view.projectInput.focus();
  });

  view.projectList.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-project-action]");
    const projectRow = event.target.closest("[data-project-id]");

    if (actionButton && projectRow) {
      handleProjectAction(
        actionButton.dataset.projectAction,
        projectRow.dataset.projectId,
      );
      return;
    }

    if (event.target.closest(".project-edit-form")) {
      return;
    }

    if (!projectRow) {
      return;
    }

    currentProjectId = projectRow.dataset.projectId;
    currentFilter = "all";
    editingTodoId = null;
    isTaskComposerOpen = false;
    updateFilterButtons();
    render();
  });

  view.todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = view.todoInput.value.trim();

    if (!title) {
      return;
    }

    addTodoToProject(projects, currentProjectId, {
      title,
      description: view.descriptionInput.value.trim(),
      dueDate: view.dueDateInput.value,
      notes: view.notesInput.value.trim(),
      priority: view.priorityInput.value,
    });

    saveAndRender();

    view.todoInput.value = "";
    view.descriptionInput.value = "";
    view.dueDateInput.value = "";
    view.notesInput.value = "";
    view.priorityInput.value = "medium";
    isTaskComposerOpen = false;
    updateWorkspaceVisibility();
  });

  view.todoFilters.addEventListener("click", (event) => {
    const filterButton = event.target.closest("[data-filter]");

    if (!filterButton) {
      return;
    }

    currentFilter = filterButton.dataset.filter;
    updateFilterButtons();
    render();
  });

  view.clearCompletedButton.addEventListener("click", () => {
    clearCompletedTodos(projects, currentProjectId);
    saveAndRender();
  });

  render();
  updateProjectSubmitState();

  function render() {
    view.todoList.innerHTML = "";
    projects = normalizeProjects(projects);
    currentProjectId = getCurrentProject()?.id || null;
    editingProjectId = projects.some(
      (project) => project.id === editingProjectId,
    )
      ? editingProjectId
      : null;
    persistProjects();

    getFilteredTodos().forEach((todo) => {
      view.todoList.append(
        createTodoItem(todo, {
          editingTodoId,
          onCancelEdit: cancelEdit,
          onDelete: deleteTodo,
          onEdit: editTodo,
          onSaveEdit: saveEdit,
          onToggle: toggleTodo,
        }),
      );
    });

    updateEmptyState();
    updateTodoFooter();
    updateWorkspaceHeader();
    updateWorkspaceVisibility();
    renderProjects();
  }

  function getFilteredTodos() {
    const todos = getCurrentTodos();
    let visibleTodos = todos;

    if (currentFilter === "active") {
      visibleTodos = todos.filter((todo) => !todo.completed);
    } else if (currentFilter === "completed") {
      visibleTodos = todos.filter((todo) => todo.completed);
    }

    return [...visibleTodos].sort(compareTodos);
  }

  function toggleTodo(id, completed) {
    setTodoCompleted(projects, currentProjectId, id, completed);
    saveAndRender();
  }

  function deleteTodo(id) {
    if (!confirmDelete("Delete this task?")) {
      return;
    }

    deleteTodoFromProject(projects, currentProjectId, id);
    saveAndRender();
  }

  function editTodo(id) {
    editingTodoId = id;
    render();
  }

  function saveEdit(id, details, priority) {
    const updatedTodo = updateTodoDetails(projects, currentProjectId, id, {
      ...details,
      priority,
    });

    if (!updatedTodo) {
      return;
    }

    editingTodoId = null;
    saveAndRender();
    view.todoInput.focus();
  }

  function cancelEdit() {
    editingTodoId = null;
    render();
    view.todoInput.focus();
  }

  function closeTaskComposer() {
    isTaskComposerOpen = false;
    updateWorkspaceVisibility();
    view.addTaskButton.focus();
  }

  function handleProjectAction(action, projectId) {
    if (action === "select") {
      currentProjectId = projectId;
      currentFilter = "all";
      editingTodoId = null;
      editingProjectId = null;
      isTaskComposerOpen = false;
      updateFilterButtons();
      render();
      return;
    }

    if (action === "edit") {
      editingProjectId = projectId;
      render();
      return;
    }

    if (action === "cancel-edit") {
      editingProjectId = null;
      render();
      return;
    }

    if (action === "save-edit") {
      const input = view.projectList.querySelector(
        `[data-project-name-input="${projectId}"]`,
      );

      if (!input) {
        editingProjectId = null;
        render();
        return;
      }

      const project = updateProjectName(projects, projectId, input.value);

      if (!project) {
        input.focus();
        return;
      }

      editingProjectId = null;
      saveAndRender();
      return;
    }

    if (action === "delete") {
      if (!confirmDelete("Delete this project and all of its tasks?")) {
        return;
      }

      projects = deleteProject(projects, projectId);
      currentProjectId =
        currentProjectId === projectId ? projects[0]?.id || null : currentProjectId;

      editingProjectId = null;
      editingTodoId = null;
      isTaskComposerOpen = false;
      saveAndRender();
    }
  }

  function updateFilterButtons() {
    const filterButtons = view.todoFilters.querySelectorAll("[data-filter]");

    filterButtons.forEach((button) => {
      button.classList.toggle(
        "is-active",
        button.dataset.filter === currentFilter,
      );
    });
  }

  function updateTodoFooter() {
    const todos = getCurrentTodos();
    const activeTotal = todos.filter((todo) => !todo.completed).length;
    const completedTotal = todos.length - activeTotal;
    const overdueTotal = todos.filter(isOverdueTodo).length;
    const taskLabel = activeTotal === 1 ? "task" : "tasks";

    view.totalCount.textContent = todos.length;
    view.activeCount.textContent = activeTotal;
    view.completedCount.textContent = completedTotal;
    view.overdueCount.textContent = overdueTotal;
    view.todoCount.textContent = `${activeTotal} open ${taskLabel}`;
    view.clearCompletedButton.disabled = completedTotal === 0;
    view.clearCompletedButton.hidden = completedTotal === 0;
  }

  function updateWorkspaceHeader() {
    const currentProject = getCurrentProject();
    const todos = getCurrentTodos();
    const taskTotal = todos.length;
    const completedTotal = todos.filter((todo) => todo.completed).length;
    const completion = getCompletionPercent(todos);
    const taskLabel = taskTotal === 1 ? "task" : "tasks";

    view.currentProjectName.textContent = currentProject
      ? currentProject.name
      : "No project selected";
    view.currentProjectMeta.textContent = currentProject
      ? `${taskTotal} ${taskLabel} - ${completion}% complete`
      : "Create or select a project to add tasks.";
    view.progressBar.style.width = `${completion}%`;
    view.progressText.textContent = `${completion}% complete`;
  }

  function updateWorkspaceVisibility() {
    const hasSelectedProject = Boolean(getCurrentProject());

    view.workspaceHeader.hidden = !hasSelectedProject;
    view.addTaskButton.hidden = !hasSelectedProject;
    view.addTaskButton.setAttribute(
      "aria-expanded",
      String(isTaskComposerOpen),
    );
    view.addTaskButton.title = isTaskComposerOpen
      ? "Hide task form"
      : "Add task";
    view.addTaskButton.setAttribute(
      "aria-label",
      isTaskComposerOpen ? "Hide task form" : "Add task",
    );
    view.todoForm.hidden = !hasSelectedProject || !isTaskComposerOpen;
    view.todoFooter.hidden = !hasSelectedProject;
  }

  function renderProjects() {
    view.projectList.innerHTML = "";

    if (projects.length === 0) {
      view.projectList.append(view.createProjectEmptyState());
      return;
    }

    projects.forEach((project) => {
      view.projectList.append(
        view.createProjectRow(project, {
          currentProjectId,
          editingProjectId,
          isDeleteDisabled: false,
          onSaveEdit: handleProjectAction,
        }),
      );
    });
  }

  function updateEmptyState() {
    const visibleCount = getFilteredTodos().length;
    const currentProject = getCurrentProject();
    view.emptyState.hidden = visibleCount > 0;

    if (visibleCount > 0) {
      return;
    }

    if (getCurrentTodos().length === 0) {
      setEmptyState(
        currentProject ? "project-ready" : "no-project",
        "",
        currentProject
          ? "Use the add task button to capture the first task for this project."
          : "Create or select a project from the sidebar to open a task workspace.",
      );
      return;
    }

    if (currentFilter === "active") {
      setEmptyState(
        "no-active",
        "",
        "Everything in this project is complete. Switch filters to review finished work.",
      );
      return;
    }

    setEmptyState(
      "no-completed",
      "",
      "Finished work will appear here after tasks are marked complete.",
    );
  }

  function updateProjectSubmitState() {
    view.projectSubmitButton.disabled =
      view.projectInput.value.trim().length === 0;
  }

  function setEmptyState(state, kicker, body) {
    view.emptyState.dataset.state = state;
    view.emptyStateKicker.textContent = kicker;
    view.emptyStateBody.textContent = body;
  }

  function saveAndRender() {
    persistProjects();
    render();
  }

  function persistProjects() {
    const saved = saveProjects(projects);
    storageErrorMessage = saved
      ? ""
      : "Changes are visible here but could not be saved in this browser.";
    updateStorageStatus();
    return saved;
  }

  function updateStorageStatus() {
    view.storageStatus.hidden = !storageErrorMessage;
    view.storageStatus.textContent = storageErrorMessage;
  }

  function confirmDelete(message) {
    return window.confirm(message);
  }

  function getCurrentProject() {
    return getProject(projects, currentProjectId);
  }

  function getCurrentTodos() {
    return getProjectTodos(projects, currentProjectId);
  }
}

function getCompletionPercent(todos) {
  if (!todos.length) {
    return 0;
  }

  return Math.round(
    (todos.filter((todo) => todo.completed).length / todos.length) * 100,
  );
}

function compareTodos(firstTodo, secondTodo) {
  if (firstTodo.completed !== secondTodo.completed) {
    return firstTodo.completed ? 1 : -1;
  }

  const firstDueDate = getSortableDate(firstTodo.dueDate);
  const secondDueDate = getSortableDate(secondTodo.dueDate);

  if (firstDueDate !== secondDueDate) {
    return firstDueDate - secondDueDate;
  }

  const firstPriority = priorityRank[firstTodo.priority] ?? priorityRank.medium;
  const secondPriority =
    priorityRank[secondTodo.priority] ?? priorityRank.medium;

  if (firstPriority !== secondPriority) {
    return firstPriority - secondPriority;
  }

  return (
    new Date(firstTodo.createdAt).getTime() -
    new Date(secondTodo.createdAt).getTime()
  );
}

function getSortableDate(dueDate) {
  if (!dueDate) {
    return Number.POSITIVE_INFINITY;
  }

  const date = new Date(`${dueDate}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? Number.POSITIVE_INFINITY
    : date.getTime();
}

function isOverdueTodo(todo) {
  if (todo.completed || !todo.dueDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(`${todo.dueDate}T00:00:00`);

  return !Number.isNaN(dueDate.getTime()) && dueDate < today;
}
