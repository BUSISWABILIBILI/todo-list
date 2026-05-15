import { formatDueDate } from "./dateUtils.js";

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

  const text = document.createElement("span");
  text.textContent = todo.title;

  const priority = document.createElement("span");
  priority.className = `priority-badge priority-${todo.priority || "medium"}`;
  priority.textContent = getPriorityLabel(todo.priority);

  const meta = document.createElement("span");
  meta.className = "task-meta";
  meta.textContent = getTaskMeta(todo);

  const editButton = document.createElement("button");
  editButton.className = "edit-button";
  editButton.type = "button";
  editButton.textContent = "Details";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";

  checkbox.addEventListener("change", () => {
    options.onToggle(todo.id, checkbox.checked);
  });

  editButton.addEventListener("click", () => {
    options.onEdit(todo.id);
  });

  deleteButton.addEventListener("click", () => {
    options.onDelete(todo.id);
  });

  const taskContent = document.createElement("span");
  taskContent.className = "task-content";
  taskContent.append(text, priority);

  if (meta.textContent) {
    taskContent.append(meta);
  }

  label.append(checkbox, taskContent);

  const actions = document.createElement("div");
  actions.className = "todo-actions";
  actions.append(editButton, deleteButton);

  item.append(label, actions);

  return item;
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

function getTaskMeta(todo) {
  const details = [];

  if (todo.dueDate) {
    details.push(`Due ${formatDueDate(todo.dueDate)}`);
  }

  if (todo.description) {
    details.push(todo.description);
  }

  return details.join(" - ");
}
