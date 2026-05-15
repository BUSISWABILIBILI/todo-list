const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const storageKey = "todo-project-tasks";

let todos = loadTodos();

renderTodos();

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (!text) {
    return;
  }

  todos.push({
    id: crypto.randomUUID(),
    text,
    completed: false,
  });

  saveTodos();
  renderTodos();

  todoInput.value = "";
  todoInput.focus();
});

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    todoList.append(createTodoItem(todo));
  });
}

function createTodoItem(todo) {
  const item = document.createElement("li");
  item.className = "todo-item";
  item.classList.toggle("is-complete", todo.completed);

  const label = document.createElement("label");
  label.className = "todo-check";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;

  const text = document.createElement("span");
  text.textContent = todo.text;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";

  checkbox.addEventListener("change", () => {
    todo.completed = checkbox.checked;
    saveTodos();
    renderTodos();
  });

  deleteButton.addEventListener("click", () => {
    todos = todos.filter((currentTodo) => currentTodo.id !== todo.id);
    saveTodos();
    renderTodos();
  });

  label.append(checkbox, text);
  item.append(label, deleteButton);

  return item;
}

function loadTodos() {
  const savedTodos = localStorage.getItem(storageKey);

  if (!savedTodos) {
    return [];
  }

  return JSON.parse(savedTodos);
}

function saveTodos() {
  localStorage.setItem(storageKey, JSON.stringify(todos));
}
