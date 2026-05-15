# Todo Project

A small todo app built one step at a time with HTML, CSS, and JavaScript.

## How to Open

Run the app with npm:

```bash
npm run start
```

Then open `http://localhost:3000` in a browser.

GitHub Pages can serve the root `index.html` directly from the `main` branch.

To use another port in PowerShell:

```powershell
$env:PORT=4000; npm run dev
```

## Scripts

- `npm run dev` starts the local server for development
- `npm run start` starts the local server
- `npm run test` checks JavaScript syntax

## Features

- Add tasks
- Mark tasks complete
- Delete tasks
- Save tasks in localStorage
- Set task priority
- Filter all, active, and completed tasks
- Clear completed tasks
- Edit task names

## Project Structure

- `public/` contains the HTML and CSS files served to the browser
- `src/` contains ES module JavaScript for the todo app
- `src/appLogic.js` contains todo and project factories plus data normalization
- `index.html` is the GitHub Pages entry file
- `server.config.json` sets the default server port
- `server.js` runs the local Node server used by `npm run dev` and `npm run start`

## Assignment Progress

- Done: todo objects are created with a factory
- Done: todos include title, description, dueDate, priority, notes, checklist, and completed state
- Done: app logic is separated from DOM rendering modules
- Done: data is persisted with localStorage
- In progress: project UI for viewing and creating separate projects
- Next: add description and due date fields to the visible todo form

## Manual Test Checklist

- Add a task and confirm it appears in the list
- Refresh the page and confirm the task is still there
- Mark a task complete and confirm it moves between filters correctly
- Edit a task, save it, and confirm the new name stays after refresh
- Edit a task, press `Escape`, and confirm the old name is kept
- Clear completed tasks and confirm only active tasks remain

## Current Step

Step 22 adds todo and project factories in a separate app logic module.
