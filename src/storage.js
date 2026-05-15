import { createDefaultProject, normalizeProjects } from "./appLogic.js";

const projectsStorageKey = "todo-project-projects";
const legacyTodosStorageKey = "todo-project-tasks";

export function loadProjects() {
  const savedProjects = localStorage.getItem(projectsStorageKey);

  if (savedProjects) {
    return normalizeProjects(JSON.parse(savedProjects));
  }

  const legacyTodos = localStorage.getItem(legacyTodosStorageKey);

  if (legacyTodos) {
    return [createDefaultProject(JSON.parse(legacyTodos))];
  }

  return [createDefaultProject()];
}

export function saveProjects(projects) {
  localStorage.setItem(projectsStorageKey, JSON.stringify(projects));
}
