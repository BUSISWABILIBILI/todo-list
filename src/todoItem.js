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

  const editButton = document.createElement("button");
  editButton.className = "edit-button";
  editButton.type = "button";
  editButton.textContent = "Edit";

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

  const input = document.createElement("input");
  input.type = "text";
  input.value = todo.title;
  input.setAttribute("aria-label", "Edit task");

  const prioritySelect = document.createElement("select");
  prioritySelect.setAttribute("aria-label", "Edit task priority");

  ["low", "medium", "high"].forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority;
    option.textContent = getPriorityLabel(priority);
    option.selected = (todo.priority || "medium") === priority;
    prioritySelect.append(option);
  });

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

    const updatedText = input.value.trim();

    if (!updatedText) {
      return;
    }

    options.onSaveEdit(todo.id, updatedText, prioritySelect.value);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    options.onCancelEdit();
  });

  cancelButton.addEventListener("click", () => {
    options.onCancelEdit();
  });

  form.append(input, prioritySelect, saveButton, cancelButton);

  requestAnimationFrame(() => {
    input.focus();
    input.select();
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
