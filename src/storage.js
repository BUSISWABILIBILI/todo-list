import { createDefaultProject, normalizeProjects } from "./appLogic.js";

const projectsStorageKey = "todo-project-projects";
const legacyTodosStorageKey = "todo-project-tasks";

export function loadProjects() {
  const savedProjects = readStoredJson(projectsStorageKey);

  if (savedProjects) {
    return normalizeProjects(savedProjects);
  }

  const legacyTodos = readStoredJson(legacyTodosStorageKey);

  if (legacyTodos) {
    return [createDefaultProject(legacyTodos)];
  }

  return [createDefaultProject()];
}

export function saveProjects(projects) {
  localStorage.setItem(projectsStorageKey, JSON.stringify(projects));
}

function readStoredJson(key) {
  const savedValue = localStorage.getItem(key);

  if (!savedValue) {
    return null;
  }

  try {
    return JSON.parse(savedValue);
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}
