const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const task = todoInput.value.trim();

  if (!task) {
    return;
  }

  const item = document.createElement("li");
  item.textContent = task;
  todoList.append(item);

  todoInput.value = "";
  todoInput.focus();
});
