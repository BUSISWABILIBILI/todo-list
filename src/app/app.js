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

export function startApp(root) {
  const view = createAppView(root);
  let projects = loadProjects();
  let currentProjectId = null;
  let currentFilter = "all";
  let editingTodoId = null;
  let editingProjectId = null;

  view.projectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = view.projectInput.value.trim();

    if (!name) {
      return;
    }

    addProject(projects, name);
    currentFilter = "all";
    saveAndRender();

    view.projectInput.value = "";
    view.projectInput.focus();
  });

  view.projectList.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-project-action]");
    const projectRow = event.target.closest("[data-project-id]");

    if (actionButton && projectRow) {
      handleProjectAction(actionButton.dataset.projectAction, projectRow.dataset.projectId);
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
      priority: view.priorityInput.value,
    });

    saveAndRender();

    view.todoInput.value = "";
    view.descriptionInput.value = "";
    view.dueDateInput.value = "";
    view.priorityInput.value = "medium";
    view.todoInput.focus();
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

  function render() {
    view.todoList.innerHTML = "";
    projects = normalizeProjects(projects);
    currentProjectId = getCurrentProject()?.id || null;
    editingProjectId = projects.some((project) => project.id === editingProjectId)
      ? editingProjectId
      : null;
    saveProjects(projects);

    getFilteredTodos().forEach((todo) => {
      view.todoList.append(
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

    updateEmptyState();
    updateTodoFooter();
    updateWorkspaceHeader();
    updateWorkspaceVisibility();
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
    saveAndRender();
  }

  function deleteTodo(id) {
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

  function handleProjectAction(action, projectId) {
    if (action === "select") {
      currentProjectId = projectId;
      currentFilter = "all";
      editingTodoId = null;
      editingProjectId = null;
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
      const input = view.projectList.querySelector(`[data-project-name-input="${projectId}"]`);
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
      projects = deleteProject(projects, projectId);
      currentProjectId = currentProjectId === projectId ? null : currentProjectId;

      editingProjectId = null;
      saveAndRender();
    }
  }

  function updateFilterButtons() {
    const filterButtons = view.todoFilters.querySelectorAll("[data-filter]");

    filterButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === currentFilter);
    });
  }

  function updateTodoFooter() {
    const todos = getCurrentTodos();
    const activeTotal = todos.filter((todo) => !todo.completed).length;
    const completedTotal = todos.length - activeTotal;
    const taskLabel = activeTotal === 1 ? "task" : "tasks";

    view.totalCount.textContent = todos.length;
    view.activeCount.textContent = activeTotal;
    view.completedCount.textContent = completedTotal;
    view.todoCount.textContent = `${activeTotal} open ${taskLabel}`;
    view.clearCompletedButton.disabled = completedTotal === 0;
  }

  function updateWorkspaceHeader() {
    const currentProject = getCurrentProject();
    const taskTotal = getCurrentTodos().length;
    const taskLabel = taskTotal === 1 ? "task" : "tasks";

    view.currentProjectName.textContent = currentProject ? currentProject.name : "No project selected";
    view.currentProjectMeta.textContent = currentProject
      ? `${taskTotal} ${taskLabel} in this project`
      : "Create or select a project to add tasks.";
  }

  function updateWorkspaceVisibility() {
    const hasSelectedProject = Boolean(getCurrentProject());

    view.workspaceHeader.hidden = !hasSelectedProject;
    view.todoForm.hidden = !hasSelectedProject;
    view.todoFooter.hidden = !hasSelectedProject;
  }

  function renderProjects() {
    view.projectList.innerHTML = "";

    projects.forEach((project) => {
      view.projectList.append(
        view.createProjectRow(project, {
          currentProjectId,
          editingProjectId,
          isDeleteDisabled: false,
          onSaveEdit: handleProjectAction,
        })
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
      view.emptyStateTitle.textContent = currentProject
        ? `${currentProject.name} has no tasks`
        : "No project selected";
      view.emptyStateBody.textContent = currentProject
        ? "Capture the first task with a due date and priority to start planning this project."
        : "Create a project list on the right, then add tasks inside it.";
      return;
    }

    if (currentFilter === "active") {
      view.emptyStateTitle.textContent = "No open tasks";
      view.emptyStateBody.textContent = "Everything in this project is complete. Switch filters to review finished work.";
      return;
    }

    view.emptyStateTitle.textContent = "No completed tasks";
    view.emptyStateBody.textContent = "Finished work will appear here after tasks are marked complete.";
  }

  function saveAndRender() {
    saveProjects(projects);
    render();
  }

  function getCurrentProject() {
    return getProject(projects, currentProjectId);
  }

  function getCurrentTodos() {
    return getProjectTodos(projects, currentProjectId);
  }
}
