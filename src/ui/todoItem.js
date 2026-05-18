import { formatDueDate } from "../utils/dateUtils.js";

export function createTodoItem(todo, options) {
  const item = document.createElement("li");
  item.className = "todo-item";
  item.classList.toggle("is-complete", todo.completed);

  if (options.editingTodoId === todo.id) {
    item.classList.add("is-editing");
    item.append(createEditForm(todo, options));
    return item;
  }

  const label = document.createElement("label");
  label.className = "todo-check";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;

  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = todo.title;

  const priority = document.createElement("span");
  priority.className = `priority-badge priority-${todo.priority || "medium"}`;
  priority.textContent = getPriorityLabel(todo.priority);

  const dueDate = document.createElement("span");
  dueDate.className = `task-due-date ${getDueDateClass(todo.dueDate, todo.completed)}`;
  dueDate.textContent = todo.dueDate ? `Due ${formatDueDate(todo.dueDate)}` : "No due date";

  const description = document.createElement("span");
  description.className = "task-description";
  description.textContent = todo.description || "No added context";

  const checklistSummary = document.createElement("span");
  checklistSummary.className = "task-checklist-summary";
  checklistSummary.textContent = getChecklistSummary(todo.checklist);

  const editButton = document.createElement("button");
  editButton.className = "icon-button edit-button";
  editButton.type = "button";
  editButton.setAttribute("aria-label", "Edit task details");
  editButton.append(createIcon("edit"));
  editButton.title = "Edit task details";

  const deleteButton = document.createElement("button");
  deleteButton.className = "icon-button delete-button";
  deleteButton.type = "button";
  deleteButton.setAttribute("aria-label", "Delete task");
  deleteButton.append(createIcon("delete"));
  deleteButton.title = "Delete task";

  const expandButton = document.createElement("button");
  expandButton.className = "icon-button expand-button";
  expandButton.type = "button";
  expandButton.setAttribute("aria-label", "Show task details");
  expandButton.setAttribute("aria-expanded", "false");
  expandButton.append(createIcon("chevron"));
  expandButton.title = "Show task details";

  checkbox.addEventListener("change", () => {
    options.onToggle(todo.id, checkbox.checked);
  });

  editButton.addEventListener("click", () => {
    options.onEdit(todo.id);
  });

  deleteButton.addEventListener("click", () => {
    options.onDelete(todo.id);
  });

  expandButton.addEventListener("click", () => {
    const isExpanded = item.classList.toggle("is-expanded");
    expandButton.setAttribute("aria-expanded", String(isExpanded));
    expandButton.setAttribute(
      "aria-label",
      isExpanded ? "Hide task details" : "Show task details"
    );
    expandButton.title = isExpanded ? "Hide task details" : "Show task details";
  });

  const taskContent = document.createElement("span");
  taskContent.className = "task-content";
  const taskHeader = document.createElement("span");
  taskHeader.className = "task-header";
  taskHeader.append(title, priority);

  const taskMeta = document.createElement("span");
  taskMeta.className = "task-meta";
  taskMeta.append(dueDate, description);

  if (checklistSummary.textContent) {
    taskMeta.append(checklistSummary);
  }

  taskContent.append(taskHeader, taskMeta, createTaskDetails(todo));

  label.append(checkbox, taskContent);

  const actions = document.createElement("div");
  actions.className = "todo-actions";
  actions.append(editButton, deleteButton, expandButton);

  item.append(label, actions);

  return item;
}

function createTaskDetails(todo) {
  const details = document.createElement("span");
  details.className = "task-details";

  if (todo.notes) {
    const notes = document.createElement("span");
    notes.className = "task-notes";
    notes.textContent = todo.notes;
    details.append(notes);
  }

  if (todo.checklist?.length) {
    const checklist = document.createElement("span");
    checklist.className = "task-checklist";

    todo.checklist.forEach((item) => {
      const checklistItem = document.createElement("span");
      checklistItem.className = "task-checklist-item";
      checklistItem.textContent = item;
      checklist.append(checklistItem);
    });

    details.append(checklist);
  }

  return details;
}

function createEditForm(todo, options) {
  const form = document.createElement("form");
  form.className = "edit-form";

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = todo.title;
  titleInput.setAttribute("aria-label", "Edit task title");

  const dueDateInput = document.createElement("input");
  dueDateInput.type = "date";
  dueDateInput.value = todo.dueDate || "";
  dueDateInput.setAttribute("aria-label", "Edit due date");

  const prioritySelect = document.createElement("select");
  prioritySelect.setAttribute("aria-label", "Edit task priority");

  ["low", "medium", "high"].forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority;
    option.textContent = getPriorityLabel(priority);
    option.selected = (todo.priority || "medium") === priority;
    prioritySelect.append(option);
  });

  const descriptionInput = document.createElement("textarea");
  descriptionInput.value = todo.description || "";
  descriptionInput.rows = 3;
  descriptionInput.setAttribute("aria-label", "Edit description");
  descriptionInput.placeholder = "Description";

  const notesInput = document.createElement("textarea");
  notesInput.value = todo.notes || "";
  notesInput.rows = 3;
  notesInput.setAttribute("aria-label", "Edit notes");
  notesInput.placeholder = "Notes";

  const checklistInput = document.createElement("textarea");
  checklistInput.value = (todo.checklist || []).join("\n");
  checklistInput.rows = 3;
  checklistInput.setAttribute("aria-label", "Edit checklist");
  checklistInput.placeholder = "Checklist items, one per line";

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

    const updatedTitle = titleInput.value.trim();

    if (!updatedTitle) {
      return;
    }

    options.onSaveEdit(
      todo.id,
      {
        title: updatedTitle,
        description: descriptionInput.value.trim(),
        dueDate: dueDateInput.value,
        notes: notesInput.value.trim(),
        checklist: checklistInput.value
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      },
      prioritySelect.value
    );
  });

  form.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    options.onCancelEdit();
  });

  cancelButton.addEventListener("click", () => {
    options.onCancelEdit();
  });

  const fieldRow = document.createElement("div");
  fieldRow.className = "edit-field-row";
  fieldRow.append(titleInput, dueDateInput, prioritySelect);

  const actions = document.createElement("div");
  actions.className = "edit-actions";
  actions.append(saveButton, cancelButton);

  form.append(
    fieldRow,
    descriptionInput,
    notesInput,
    checklistInput,
    actions
  );

  requestAnimationFrame(() => {
    titleInput.focus();
    titleInput.select();
  });

  return form;
}

function getPriorityLabel(priority) {
  if (priority === "high") {
    return "High";
  }

  if (priority === "low") {
    return "Low";
  }

  return "Medium";
}

function getDueDateClass(dueDate, completed) {
  if (!dueDate) {
    return "is-unscheduled";
  }

  if (completed) {
    return "is-complete";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(`${dueDate}T00:00:00`);

  if (Number.isNaN(taskDate.getTime())) {
    return "is-unscheduled";
  }

  if (taskDate < today) {
    return "is-overdue";
  }

  if (taskDate.getTime() === today.getTime()) {
    return "is-today";
  }

  return "is-upcoming";
}

function getChecklistSummary(checklist = []) {
  if (!checklist.length) {
    return "";
  }

  return `${checklist.length} checklist ${checklist.length === 1 ? "item" : "items"}`;
}

function createIcon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "button-icon");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  const paths = {
    chevron: [
      "M6 9l6 6 6-6",
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
  };

  paths[name].forEach((data) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", data);
    svg.append(path);
  });

  return svg;
}
