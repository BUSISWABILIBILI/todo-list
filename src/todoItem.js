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
  text.textContent = todo.text;

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

  label.append(checkbox, text);

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
  input.value = todo.text;
  input.setAttribute("aria-label", "Edit task");

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

    options.onSaveEdit(todo.id, updatedText);
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

  form.append(input, saveButton, cancelButton);

  requestAnimationFrame(() => {
    input.focus();
    input.select();
  });

  return form;
}
