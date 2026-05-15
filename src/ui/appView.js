export function createAppView(root) {
  root.replaceChildren(createAppShell());

  return {
    activeCount: root.querySelector("#active-count"),
    clearCompletedButton: root.querySelector("#clear-completed"),
    completedCount: root.querySelector("#completed-count"),
    currentProjectMeta: root.querySelector("#current-project-meta"),
    currentProjectName: root.querySelector("#current-project-name"),
    descriptionInput: root.querySelector("#description-input"),
    dueDateInput: root.querySelector("#due-date-input"),
    emptyState: root.querySelector("#empty-state"),
    emptyStateBody: root.querySelector("#empty-state-body"),
    emptyStateTitle: root.querySelector("#empty-state-title"),
    priorityInput: root.querySelector("#priority-input"),
    projectForm: root.querySelector("#project-form"),
    projectInput: root.querySelector("#project-input"),
    projectList: root.querySelector("#project-list"),
    todoCount: root.querySelector("#todo-count"),
    todoFilters: root.querySelector("#todo-filters"),
    todoForm: root.querySelector("#todo-form"),
    todoInput: root.querySelector("#todo-input"),
    todoList: root.querySelector("#todo-list"),
    totalCount: root.querySelector("#total-count"),
    workspaceActiveCount: root.querySelector("#workspace-active-count"),
    workspaceCompletedCount: root.querySelector("#workspace-completed-count"),
    workspaceTotalCount: root.querySelector("#workspace-total-count"),
    createProjectRow,
  };
}

function createAppShell() {
  const main = createElement("main", { className: "app" });
  const shell = createElement("section", {
    className: "app-shell",
    attributes: { "aria-labelledby": "app-title" },
  });

  shell.append(createLeftPanel(), createRightPanel());
  main.append(shell);

  return main;
}

function createLeftPanel() {
  const panel = createElement("aside", { className: "left-panel" });

  const header = createElement("header", { className: "app-header" }, [
    createElement("p", { className: "eyebrow", text: "Project planner" }),
    createElement("h1", { id: "app-title", text: "Taskboard" }),
    createElement("p", {
      className: "app-intro",
      text: "Manage project tasks, priorities, and deadlines from one focused workspace.",
    }),
  ]);

  panel.append(
    header,
    createStatusPanel(),
    createFilters(),
    createProjectsPanel(),
    createSidebarFooter()
  );

  return panel;
}

function createStatusPanel() {
  return createElement("div", { className: "status-panel" }, [
    createElement("p", { className: "status-label", text: "Current workload" }),
    createElement("div", { className: "stats-grid", attributes: { "aria-label": "Task summary" } }, [
      createStatCard("total-count", "Total"),
      createStatCard("active-count", "Active"),
      createStatCard("completed-count", "Done"),
    ]),
    createElement("p", { className: "todo-count", id: "todo-count", text: "0 open tasks" }),
  ]);
}

function createStatCard(id, label) {
  return createElement("article", { className: `stat-card stat-${id.replace("-count", "")}` }, [
    createElement("span", { className: "stat-value", id, text: "0" }),
    createElement("span", { className: "stat-label", text: label }),
  ]);
}

function createFilters() {
  return createElement("div", {
    className: "todo-filters",
    id: "todo-filters",
    attributes: { "aria-label": "Todo filters" },
  }, [
    createFilterButton("all", "All", true),
    createFilterButton("active", "Active"),
    createFilterButton("completed", "Completed"),
  ]);
}

function createFilterButton(filter, label, isActive = false) {
  const icons = {
    active: "Pending",
    all: "All",
    completed: "Done",
  };

  return createElement("button", {
    className: isActive ? "filter-button is-active" : "filter-button",
    attributes: {
      "data-filter": filter,
      type: "button",
    },
  }, [
    createElement("span", { className: "filter-icon", text: icons[filter] }),
    createElement("span", { text: label }),
  ]);
}

function createProjectsPanel() {
  const projectInput = createElement("input", {
    id: "project-input",
    attributes: {
      autocomplete: "off",
      name: "project",
      placeholder: "New project",
      type: "text",
    },
  });

  const addButton = createElement("button", {
    text: "Add",
    attributes: { type: "submit" },
  });

  return createElement("section", {
    className: "projects-panel",
    attributes: { "aria-labelledby": "projects-title" },
  }, [
    createElement("div", { className: "section-heading" }, [
      createElement("p", { className: "status-label", id: "projects-title", text: "Project lists" }),
    ]),
    createElement("div", {
      className: "project-list",
      id: "project-list",
      attributes: { "aria-label": "Projects" },
    }),
    createElement("form", { className: "project-form", id: "project-form" }, [
      projectInput,
      addButton,
    ]),
  ]);
}

function createSidebarFooter() {
  return createElement("footer", { className: "sidebar-footer" }, [
    createElement("div", { className: "profile-avatar", text: "TB" }),
    createElement("div", {}, [
      createElement("p", { className: "profile-name", text: "Taskboard workspace" }),
      createElement("p", { className: "profile-meta", text: "Local data saved in browser" }),
    ]),
  ]);
}

function createRightPanel() {
  const panel = createElement("section", {
    className: "right-panel",
    attributes: { "aria-label": "Task workspace" },
  });

  panel.append(createWorkspaceHeader(), createTodoForm(), createTodoList(), createFooter());

  return panel;
}

function createWorkspaceHeader() {
  return createElement("header", { className: "workspace-header" }, [
    createElement("div", { className: "workspace-title" }, [
      createElement("p", { className: "status-label", text: "Selected project" }),
      createElement("h2", { id: "current-project-name", text: "Default" }),
      createElement("p", {
        className: "workspace-meta",
        id: "current-project-meta",
        text: "0 tasks in this project",
      }),
    ]),
    createElement("div", {
      className: "workspace-summary",
      attributes: { "aria-label": "Selected project summary" },
    }, [
      createWorkspaceStat("workspace-total-count", "Total"),
      createWorkspaceStat("workspace-active-count", "Active"),
      createWorkspaceStat("workspace-completed-count", "Done"),
    ]),
  ]);
}

function createWorkspaceStat(id, label) {
  return createElement("article", {
    className: `workspace-stat workspace-stat-${id.replace("workspace-", "").replace("-count", "")}`,
  }, [
    createElement("span", { className: "workspace-stat-value", id, text: "0" }),
    createElement("span", { className: "workspace-stat-label", text: label }),
  ]);
}

function createTodoForm() {
  return createElement("form", { className: "todo-form", id: "todo-form" }, [
    createElement("div", { className: "composer-header" }, [
      createElement("div", {}, [
        createElement("p", { className: "status-label", text: "New task" }),
        createElement("label", { text: "Capture work", attributes: { for: "todo-input" } }),
      ]),
      createElement("span", { className: "composer-hint", text: "Added to selected project" }),
    ]),
    createElement("div", { className: "todo-entry" }, [
      createElement("input", {
        id: "todo-input",
        attributes: {
          autocomplete: "off",
          name: "todo",
          placeholder: "What needs to be done?",
          type: "text",
        },
      }),
      createElement("input", {
        id: "due-date-input",
        attributes: {
          "aria-label": "Due date",
          name: "dueDate",
          type: "date",
        },
      }),
      createPrioritySelect(),
      createElement("button", { text: "Add", attributes: { type: "submit" } }),
    ]),
    createElement("textarea", {
      id: "description-input",
      attributes: {
        name: "description",
        placeholder: "Add context or next steps",
        rows: "3",
      },
    }),
  ]);
}

function createPrioritySelect() {
  const select = createElement("select", {
    id: "priority-input",
    attributes: {
      "aria-label": "Task priority",
      name: "priority",
    },
  });

  [
    ["low", "Low"],
    ["medium", "Medium"],
    ["high", "High"],
  ].forEach(([value, label]) => {
    const option = createElement("option", { text: label, attributes: { value } });
    option.selected = value === "medium";
    select.append(option);
  });

  return select;
}

function createTodoList() {
  return createElement("div", {}, [
    createElement("ul", {
      className: "todo-list",
      id: "todo-list",
      attributes: { "aria-label": "Todo list" },
    }),
    createElement("section", {
      className: "empty-state",
      id: "empty-state",
      properties: { hidden: true },
    }, [
      createElement("p", { className: "empty-state-kicker", text: "Workspace clear" }),
      createElement("h3", { id: "empty-state-title", text: "No tasks yet" }),
      createElement("p", {
        className: "empty-state-body",
        id: "empty-state-body",
        text: "Add your first task to start planning this project.",
      }),
    ]),
  ]);
}

function createFooter() {
  return createElement("footer", { className: "todo-footer" }, [
    createElement("button", {
      className: "clear-button",
      id: "clear-completed",
      text: "Clear completed",
      attributes: { type: "button" },
    }),
  ]);
}

function createProjectRow(project, options) {
  const row = createElement("div", {
    className: project.id === options.currentProjectId ? "project-row is-active" : "project-row",
    attributes: { "data-project-id": project.id },
  });

  if (project.id === options.editingProjectId) {
    row.append(createProjectEditForm(project, options.onSaveEdit));
    return row;
  }

  const selectButton = createElement("button", {
    className: "project-select",
    attributes: {
      "data-project-action": "select",
      type: "button",
    },
  }, [
    createElement("span", { className: "project-name", text: project.name }),
    createElement("span", { className: "project-count", text: project.todos.length }),
  ]);

  const actions = createElement("div", { className: "project-actions" }, [
    createElement("button", {
      className: "project-action-button",
      text: "Edit",
      attributes: {
        "aria-label": `Edit ${project.name}`,
        "data-project-action": "edit",
        title: "Edit project",
        type: "button",
      },
    }),
    createElement("button", {
      className: "project-action-button danger",
      text: "Delete",
      attributes: {
        "aria-label": `Delete ${project.name}`,
        "data-project-action": "delete",
        title: "Delete project",
        type: "button",
      },
      properties: { disabled: options.isDeleteDisabled },
    }),
  ]);

  row.append(selectButton, actions);

  return row;
}

function createProjectEditForm(project, onSaveEdit) {
  const input = createElement("input", {
    attributes: {
      "aria-label": "Project name",
      "data-project-name-input": project.id,
      type: "text",
    },
    properties: { value: project.name },
  });

  const form = createElement("form", { className: "project-edit-form" }, [
    input,
    createElement("button", {
      className: "project-save-button",
      text: "Save",
      attributes: { type: "submit" },
    }),
    createElement("button", {
      className: "project-cancel-button",
      text: "Cancel",
      attributes: {
        "data-project-action": "cancel-edit",
        type: "button",
      },
    }),
  ]);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    onSaveEdit("save-edit", project.id);
  });

  requestAnimationFrame(() => input.focus());

  return form;
}

function createElement(tagName, options = {}, children = []) {
  const element = document.createElement(tagName);

  if (options.id) {
    element.id = options.id;
  }

  if (options.className) {
    element.className = options.className;
  }

  if (options.text !== undefined) {
    element.textContent = options.text;
  }

  Object.entries(options.attributes || {}).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });

  Object.assign(element, options.properties || {});
  element.append(...children);

  return element;
}
