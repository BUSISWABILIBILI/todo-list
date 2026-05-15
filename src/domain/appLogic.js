export const priorityLevels = ["low", "medium", "high"];

export function createTodo({
  title,
  description = "",
  dueDate = "",
  priority = "medium",
  notes = "",
  checklist = [],
}) {
  return {
    id: crypto.randomUUID(),
    title,
    description,
    dueDate,
    priority: normalizePriority(priority),
    notes,
    checklist,
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

export function createProject({ name, id = crypto.randomUUID(), todos = [] }) {
  return {
    id,
    name,
    todos: todos.map(normalizeTodo),
  };
}

export function addProject(projects, name) {
  const project = createProject({ name });
  projects.push(project);
  return project;
}

export function addTodoToProject(projects, projectId, todoData) {
  const project = getProject(projects, projectId);

  if (!project) {
    return null;
  }

  const todo = createTodo(todoData);
  project.todos.push(todo);
  return todo;
}

export function clearCompletedTodos(projects, projectId) {
  const project = getProject(projects, projectId);

  if (!project) {
    return null;
  }

  project.todos = project.todos.filter((todo) => !todo.completed);
  return project;
}

export function deleteTodoFromProject(projects, projectId, todoId) {
  const project = getProject(projects, projectId);

  if (!project) {
    return null;
  }

  project.todos = project.todos.filter((todo) => todo.id !== todoId);
  return project;
}

export function deleteProject(projects, projectId) {
  return projects.filter((project) => project.id !== projectId);
}

export function getProject(projects, projectId) {
  return projects.find((project) => project.id === projectId) || null;
}

export function getProjectTodos(projects, projectId) {
  const project = getProject(projects, projectId);
  return project ? project.todos : [];
}

export function setTodoCompleted(projects, projectId, todoId, completed) {
  const todo = findTodo(projects, projectId, todoId);

  if (!todo) {
    return null;
  }

  todo.completed = completed;
  return todo;
}

export function updateTodoDetails(projects, projectId, todoId, details) {
  const todo = findTodo(projects, projectId, todoId);

  if (!todo) {
    return null;
  }

  Object.assign(todo, {
    title: details.title || "Untitled task",
    description: details.description || "",
    dueDate: details.dueDate || "",
    priority: normalizePriority(details.priority),
    notes: details.notes || "",
    checklist: Array.isArray(details.checklist) ? details.checklist : [],
  });

  return todo;
}

export function updateProjectName(projects, projectId, name) {
  const project = getProject(projects, projectId);
  const trimmedName = name.trim();

  if (!project || !trimmedName) {
    return null;
  }

  project.name = trimmedName;
  return project;
}

export function normalizeProjects(projects) {
  if (!Array.isArray(projects)) {
    return [];
  }

  return projects.map((project) =>
    createProject({
      id: project.id || crypto.randomUUID(),
      name: project.name || "Untitled Project",
      todos: Array.isArray(project.todos) ? project.todos : [],
    })
  );
}

export function normalizeTodo(todo) {
  return {
    id: todo.id || crypto.randomUUID(),
    title: todo.title || todo.text || "Untitled task",
    description: todo.description || "",
    dueDate: todo.dueDate || "",
    priority: normalizePriority(todo.priority),
    notes: todo.notes || "",
    checklist: Array.isArray(todo.checklist) ? todo.checklist : [],
    completed: Boolean(todo.completed),
    createdAt: todo.createdAt || new Date().toISOString(),
  };
}

export function normalizePriority(priority) {
  return priorityLevels.includes(priority) ? priority : "medium";
}

function findTodo(projects, projectId, todoId) {
  return getProjectTodos(projects, projectId).find((todo) => todo.id === todoId);
}
