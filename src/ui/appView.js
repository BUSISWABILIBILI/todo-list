export function createAppView(root) {
  root.replaceChildren(createAppShell());

  return {
    activeCount: root.querySelector("#active-count"),
    addTaskButton: root.querySelector("#add-task-button"),
    clearCompletedButton: root.querySelector("#clear-completed"),
    completedCount: root.querySelector("#completed-count"),
    overdueCount: root.querySelector("#overdue-count"),
    currentProjectMeta: root.querySelector("#current-project-meta"),
    currentProjectName: root.querySelector("#current-project-name"),
    descriptionInput: root.querySelector("#description-input"),
    dueDateInput: root.querySelector("#due-date-input"),
    emptyState: root.querySelector("#empty-state"),
    emptyStateBody: root.querySelector("#empty-state-body"),
    emptyStateKicker: root.querySelector("#empty-state-kicker"),
    priorityInput: root.querySelector("#priority-input"),
    projectForm: root.querySelector("#project-form"),
    projectSubmitButton: root.querySelector("#project-submit"),
    projectInput: root.querySelector("#project-input"),
    progressBar: root.querySelector("#project-progress-bar"),
    progressText: root.querySelector("#project-progress-text"),
    projectList: root.querySelector("#project-list"),
    todoCount: root.querySelector("#todo-count"),
    todoFilters: root.querySelector("#todo-filters"),
    todoFooter: root.querySelector("#todo-footer"),
    todoForm: root.querySelector("#todo-form"),
    notesInput: root.querySelector("#notes-input"),
    closeTaskButton: root.querySelector("#close-task-button"),
    todoListArea: root.querySelector("#todo-list-area"),
    todoInput: root.querySelector("#todo-input"),
    todoList: root.querySelector("#todo-list"),
    totalCount: root.querySelector("#total-count"),
    storageStatus: root.querySelector("#storage-status"),
    workspaceHeader: root.querySelector("#workspace-header"),
    createProjectEmptyState,
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
    createElement("span", { className: "brand-mark" }, [
      createElement("img", {
        attributes: {
          alt: "",
          src: "https://cdn-icons-png.flaticon.com/512/10314/10314520.png",
        },
      }),
    ]),
    createElement("h1", { id: "app-title", text: "Taskboard" }),
    createElement("a", {
      className: "logo-credit",
      text: "Files and folders icons created by Lagot Design - Flaticon",
      attributes: {
        href: "https://www.flaticon.com/free-icons/files-and-folders",
        rel: "noopener noreferrer",
        target: "_blank",
        title: "files and folders icons",
      },
    }),
  ]);

  panel.append(
    header,
    createProjectComposer(),
    createTipCard()
  );

  return panel;
}

function createTipCard() {
  return createElement("aside", { className: "tip-card" }, [
    createElement("p", { className: "tip-title", text: "Tip" }),
    createElement("p", {
      className: "tip-body",
      text: "Click on a task to view and edit details. Stay organized!",
    }),
  ]);
}

function createStatusPanel() {
  return createElement("div", { className: "status-panel" }, [
    createElement("p", { className: "status-label", text: "Current workload" }),
    createElement("div", { className: "stats-grid", attributes: { "aria-label": "Task summary" } }, [
      createStatCard("total-count", "Total"),
      createStatCard("active-count", "Active"),
      createStatCard("completed-count", "Done"),
      createStatCard("overdue-count", "Overdue"),
    ]),
    createElement("p", {
      className: "todo-count",
      id: "todo-count",
      properties: { hidden: true },
      text: "",
    }),
  ]);
}

function createStatCard(id, label) {
  const type = id.replace("-count", "");
  const descriptions = {
    active: "Tasks in progress",
    completed: "Tasks completed",
    overdue: "Past due tasks",
    total: "All tasks in this project",
  };
  const iconNames = {
    active: "calendar",
    completed: "check",
    overdue: "calendar-alert",
    total: "list",
  };

  return createElement("article", { className: `stat-card stat-${type}` }, [
    createElement("span", { className: "stat-icon" }, [createIcon(iconNames[type])]),
    createElement("span", { className: "stat-copy" }, [
      createElement("span", { className: "stat-label", text: label === "Done" ? "Completed" : label }),
      createElement("span", { className: "stat-value", id, text: "0" }),
      createElement("span", { className: "stat-description", text: descriptions[type] }),
    ]),
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

function createRightPanel() {
  const panel = createElement("section", {
    className: "right-panel",
    attributes: { "aria-label": "Task workspace" },
  });

  panel.append(
    createStatusPanel(),
    createStorageStatus(),
    createWorkspaceHeader(),
    createTodoForm(),
    createTodoList(),
    createFooter()
  );

  return panel;
}

function createStorageStatus() {
  return createElement("p", {
    className: "storage-status",
    id: "storage-status",
    properties: { hidden: true },
    attributes: { role: "status" },
  });
}

function createProjectComposer() {
  const projectInput = createElement("input", {
    id: "project-input",
    attributes: {
      autocomplete: "off",
      name: "project",
      placeholder: "Create a project list",
      type: "text",
    },
  });

  const addButton = createElement("button", {
    id: "project-submit",
    text: "+",
    attributes: {
      "aria-label": "Add project",
      title: "Add project",
      type: "submit",
    },
    properties: { disabled: true },
  });

  return createElement("section", { className: "project-composer" }, [
    createElement("div", { className: "project-composer-copy" }, [
      createElement("p", { className: "status-label", text: "Projects" }),
    ]),
    createElement("form", { className: "project-form", id: "project-form" }, [
      projectInput,
      addButton,
    ]),
    createElement("section", {
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
    ]),
  ]);
}

function createWorkspaceHeader() {
  return createElement("header", { className: "workspace-header", id: "workspace-header" }, [
    createElement("div", { className: "workspace-title" }, [
      createElement("h2", { id: "current-project-name", text: "No project selected" }),
      createElement("p", {
        className: "workspace-meta",
        id: "current-project-meta",
        text: "0 tasks in this project",
      }),
      createElement("div", { className: "project-progress" }, [
        createElement("span", { className: "project-progress-track" }, [
          createElement("span", {
            className: "project-progress-bar",
            id: "project-progress-bar",
          }),
        ]),
        createElement("span", {
          className: "project-progress-text",
          id: "project-progress-text",
          text: "0% complete",
        }),
      ]),
    ]),
    createElement("div", { className: "workspace-actions" }, [
      createFilters(),
      createElement("button", {
        className: "add-task-button",
        id: "add-task-button",
        text: "+ Add Task",
        attributes: {
          "aria-label": "Add task",
          "aria-expanded": "false",
          "aria-controls": "todo-form",
          title: "Add task",
          type: "button",
        },
      }),
    ]),
  ]);
}

function createTodoForm() {
  return createElement("form", { className: "todo-form", id: "todo-form" }, [
    createElement("section", { className: "todo-dialog", attributes: { "aria-label": "New task" } }, [
      createElement("div", { className: "composer-header" }, [
        createElement("h3", { text: "New Task" }),
        createElement("button", {
          className: "icon-button dialog-close-button",
          id: "close-task-button",
          text: "x",
          attributes: {
            "aria-label": "Close task form",
            type: "button",
          },
        }),
      ]),
      createElement("label", { className: "field-label", text: "Title", attributes: { for: "todo-input" } }),
      createElement("input", {
        id: "todo-input",
        attributes: {
          autocomplete: "off",
          name: "todo",
          placeholder: "What needs to be done?",
          type: "text",
        },
      }),
      createElement("label", { className: "field-label", text: "Description", attributes: { for: "description-input" } }),
      createElement("textarea", {
        id: "description-input",
        attributes: {
          name: "description",
          placeholder: "Add more details...",
          rows: "4",
        },
      }),
      createElement("div", { className: "todo-entry" }, [
        createElement("label", { className: "field-group" }, [
          createElement("span", { className: "field-label", text: "Due date" }),
          createElement("input", {
            id: "due-date-input",
            attributes: {
              "aria-label": "Due date",
              name: "dueDate",
              type: "date",
            },
          }),
        ]),
        createElement("label", { className: "field-group" }, [
          createElement("span", { className: "field-label", text: "Priority" }),
          createPrioritySelect(),
        ]),
      ]),
      createElement("label", { className: "field-label", text: "Notes", attributes: { for: "notes-input" } }),
      createElement("textarea", {
        id: "notes-input",
        attributes: {
          name: "notes",
          placeholder: "Any extra notes, links, references...",
          rows: "4",
        },
      }),
      createElement("div", { className: "dialog-actions" }, [
        createElement("button", {
          className: "cancel-button",
          id: "cancel-task-button",
          text: "Cancel",
          attributes: { type: "button", "data-dialog-close": "task" },
        }),
        createElement("button", { className: "save-button", text: "Add Task", attributes: { type: "submit" } }),
      ]),
    ]),
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
  return createElement("div", { id: "todo-list-area" }, [
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
      createElement("p", { className: "empty-state-kicker", id: "empty-state-kicker", text: "Select a project" }),
      createElement("p", {
        className: "empty-state-body",
        id: "empty-state-body",
        text: "Add your first task to start planning this project.",
      }),
    ]),
  ]);
}

function createFooter() {
  return createElement("footer", { className: "todo-footer", id: "todo-footer" }, [
    createElement("button", {
      className: "clear-button",
      id: "clear-completed",
      text: "Clear completed",
      attributes: { type: "button" },
    }),
  ]);
}

function createProjectEmptyState() {
  return createElement("p", {
    className: "project-empty-state",
    text: "No projects",
  });
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
    createIconButton("edit", `Edit ${project.name}`, {
      "data-project-action": "edit",
      title: "Edit project",
    }),
    createIconButton("delete", `Delete ${project.name}`, {
      className: "danger",
      "data-project-action": "delete",
      title: "Delete project",
    }, { disabled: options.isDeleteDisabled }),
  ]);

  row.append(selectButton, actions);

  return row;
}

function createIconButton(iconName, label, attributes = {}, properties = {}) {
  const { className = "", ...buttonAttributes } = attributes;
  const extraClass = className ? ` ${className}` : "";

  return createElement("button", {
    className: `icon-button project-action-button${extraClass}`,
    attributes: {
      ...buttonAttributes,
      "aria-label": label,
      type: "button",
    },
    properties,
  }, [createIcon(iconName)]);
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

function createIcon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "button-icon");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  const paths = {
    calendar: [
      "M8 2v4",
      "M16 2v4",
      "M3 10h18",
      "M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
    ],
    "calendar-alert": [
      "M8 2v4",
      "M16 2v4",
      "M3 10h18",
      "M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
      "M12 14v3",
      "M12 19h.01",
    ],
    check: [
      "M20 6 9 17l-5-5",
    ],
    delete: [
      "M4 7h16",
      "M10 11v6",
      "M14 11v6",
      "M6 7l1 14h10l1-14",
      "M9 7V4h6v3",
    ],
    edit: [
      "M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4Z",
      "M13.5 6.5l4 4",
    ],
    list: [
      "M8 6h13",
      "M8 12h13",
      "M8 18h13",
      "M3 6h.01",
      "M3 12h.01",
      "M3 18h.01",
    ],
  };

  (paths[name] || paths.list).forEach((data) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", data);
    svg.append(path);
  });

  return svg;
}
