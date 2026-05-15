export const priorityLevels = ["low", "medium", "high"];
export const defaultProjectId = "default-project";

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

export function createDefaultProject(todos = []) {
  return createProject({
    id: defaultProjectId,
    name: "Default",
    todos,
  });
}

export function normalizeProjects(projects) {
  if (!Array.isArray(projects) || projects.length === 0) {
    return [createDefaultProject()];
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
