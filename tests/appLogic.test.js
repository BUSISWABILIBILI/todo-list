import assert from "node:assert/strict";

import {
  addProject,
  addTodoToProject,
  clearCompletedTodos,
  deleteProject,
  deleteTodoFromProject,
  getProject,
  getProjectTodos,
  normalizePriority,
  normalizeProjects,
  setTodoCompleted,
  updateProjectName,
  updateTodoDetails,
} from "../src/domain/appLogic.js";

function test(name, callback) {
  callback();
  console.log(`ok - ${name}`);
}

test("creates projects and tasks with normalized defaults", () => {
  const projects = [];
  const project = addProject(projects, "Launch plan");
  const todo = addTodoToProject(projects, project.id, {
    title: "Draft brief",
    priority: "urgent",
  });

  assert.equal(projects.length, 1);
  assert.equal(project.name, "Launch plan");
  assert.equal(todo.title, "Draft brief");
  assert.equal(todo.priority, "medium");
  assert.equal(todo.completed, false);
  assert.equal(getProjectTodos(projects, project.id).length, 1);
});

test("updates task details and normalizes invalid values", () => {
  const projects = [];
  const project = addProject(projects, "Website");
  const todo = addTodoToProject(projects, project.id, { title: "Audit copy" });

  const updatedTodo = updateTodoDetails(projects, project.id, todo.id, {
    title: "",
    description: "Review all pages",
    dueDate: "2026-05-20",
    priority: "high",
    notes: "Focus on product pages",
    checklist: ["Home", "Pricing"],
  });

  assert.equal(updatedTodo.title, "Untitled task");
  assert.equal(updatedTodo.description, "Review all pages");
  assert.equal(updatedTodo.priority, "high");
  assert.deepEqual(updatedTodo.checklist, ["Home", "Pricing"]);
});

test("toggles, deletes, and clears todos", () => {
  const projects = [];
  const project = addProject(projects, "Ops");
  const firstTodo = addTodoToProject(projects, project.id, { title: "One" });
  const secondTodo = addTodoToProject(projects, project.id, { title: "Two" });

  setTodoCompleted(projects, project.id, firstTodo.id, true);
  assert.equal(firstTodo.completed, true);

  deleteTodoFromProject(projects, project.id, secondTodo.id);
  assert.deepEqual(getProjectTodos(projects, project.id).map((todo) => todo.title), ["One"]);

  clearCompletedTodos(projects, project.id);
  assert.equal(getProjectTodos(projects, project.id).length, 0);
});

test("updates and deletes projects", () => {
  const projects = [];
  const project = addProject(projects, "Old name");

  assert.equal(updateProjectName(projects, project.id, "  New name  ").name, "New name");
  assert.equal(updateProjectName(projects, project.id, "   "), null);

  const remainingProjects = deleteProject(projects, project.id);
  assert.deepEqual(remainingProjects, []);
});

test("normalizes legacy project and todo data", () => {
  const projects = normalizeProjects([
    {
      name: "",
      todos: [
        {
          text: "Legacy task",
          priority: "low",
          completed: 1,
          checklist: "not an array",
        },
      ],
    },
  ]);

  assert.equal(projects[0].name, "Untitled Project");
  assert.equal(projects[0].todos[0].title, "Legacy task");
  assert.equal(projects[0].todos[0].priority, "low");
  assert.equal(projects[0].todos[0].completed, true);
  assert.deepEqual(projects[0].todos[0].checklist, []);
});

test("returns null for missing project operations", () => {
  assert.equal(getProject([], "missing"), null);
  assert.equal(addTodoToProject([], "missing", { title: "Task" }), null);
  assert.equal(clearCompletedTodos([], "missing"), null);
  assert.equal(deleteTodoFromProject([], "missing", "todo"), null);
  assert.equal(setTodoCompleted([], "missing", "todo", true), null);
  assert.equal(updateTodoDetails([], "missing", "todo", { title: "Task" }), null);
});

test("normalizes priority values", () => {
  assert.equal(normalizePriority("low"), "low");
  assert.equal(normalizePriority("medium"), "medium");
  assert.equal(normalizePriority("high"), "high");
  assert.equal(normalizePriority("urgent"), "medium");
});
