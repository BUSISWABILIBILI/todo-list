const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const task = todoInput.value.trim();

  if (!task) {
    return;
  }

  const item = createTodoItem(task);
  todoList.append(item);

  todoInput.value = "";
  todoInput.focus();
});

function createTodoItem(task) {
  const item = document.createElement("li");
  item.className = "todo-item";

  const label = document.createElement("label");
  label.className = "todo-check";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  const text = document.createElement("span");
  text.textContent = task;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";

  checkbox.addEventListener("change", () => {
    item.classList.toggle("is-complete", checkbox.checked);
  });

  deleteButton.addEventListener("click", () => {
    item.remove();
  });

  label.append(checkbox, text);
  item.append(label, deleteButton);

  return item;
}
