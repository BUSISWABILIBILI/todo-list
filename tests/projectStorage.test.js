import assert from "node:assert/strict";

import { loadProjects, saveProjects } from "../src/storage/projectStorage.js";

function test(name, callback) {
  callback();
  console.log(`ok - ${name}`);
}

test("returns an empty list when storage reads fail", () => {
  globalThis.localStorage = {
    getItem() {
      throw new Error("blocked");
    },
  };

  assert.deepEqual(loadProjects(), []);
});

test("returns false when storage writes fail", () => {
  globalThis.localStorage = {
    setItem() {
      throw new Error("blocked");
    },
  };

  assert.equal(saveProjects([]), false);
});

test("removes corrupt storage when possible", () => {
  let removedKey = "";
  globalThis.localStorage = {
    getItem(key) {
      return key === "todo-project-projects" ? "{" : null;
    },
    removeItem(key) {
      removedKey = key;
    },
  };

  assert.deepEqual(loadProjects(), []);
  assert.equal(removedKey, "todo-project-projects");
});
