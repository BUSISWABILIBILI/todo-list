# Todo Project

A project-based todo app built with JavaScript modules, localStorage, and webpack.

The app creates its UI with JavaScript, separates application logic from DOM rendering, and builds production files into `docs/` for GitHub Pages.

## Setup

Install dependencies:

```bash
npm install
```

## How to Open

Start the development server:

```bash
npm run start
```

Then open the local URL printed in the terminal.

The webpack dev server uses an available port automatically, so it should not
crash when another project is already using port `3000`.

You can also run the same dev server with:

```bash
npm run dev
```

## Build

```bash
npm run build
```

The production build is generated in `docs/`.

For GitHub Pages, set the repository Pages source to:

- Branch: `main`
- Folder: `/docs`

## Scripts

- `npm run dev` starts the webpack dev server
- `npm run start` starts the webpack dev server
- `npm run build` creates the production files in `docs/`
- `npm run test` checks JavaScript syntax

## Features

- View all projects
- Create separate projects
- Add tasks under the selected project
- Rename projects
- Delete projects
- Mark tasks complete
- Delete tasks
- Save tasks in localStorage
- Set task priority
- Set todo description and due date
- Filter all, active, and completed tasks
- Clear completed tasks
- Expand tasks to edit title, description, due date, priority, notes, and checklist text

## Project Structure

- `public/` contains the app CSS
- `src/app/` contains the application controller that wires events to logic and UI
- `src/domain/` contains todo and project factories, data normalization, and app state changes
- `src/storage/` contains localStorage persistence
- `src/ui/` contains JavaScript modules that create and render the interface
- `src/utils/` contains shared helpers like due date formatting
- `src/index.js` is the webpack entry file
- `src/template.html` is the minimal HTML mount point used by webpack
- `docs/` contains the production build for GitHub Pages
- `webpack.config.js` controls local development and production builds
- `package.json` contains npm scripts and webpack dependencies

## Assignment Progress

- Done: todo objects are created with a factory
- Done: todos include title, description, dueDate, priority, notes, checklist, and completed state
- Done: app logic is separated from DOM rendering modules
- Done: UI is created through JavaScript modules
- Done: data is persisted with localStorage
- Done: visible todo form collects description and due date
- Done: project UI can view and create separate projects
- Done: projects can be renamed and deleted
- Done: todos can expand to edit full details
- Done: due dates are formatted for display
- Done: final assignment review and cleanup
- Done: webpack build outputs to `docs/` for GitHub Pages

## Manual Test Checklist

- Create a project and confirm it appears in the project panel
- Rename a project and confirm the new name stays after refresh
- Delete a non-default project and confirm it is removed
- Add a task and confirm it appears in the list
- Switch projects and confirm each project keeps its own tasks
- Refresh the page and confirm the task is still there
- Mark a task complete and confirm it moves between filters correctly
- Edit a task, save it, and confirm the new name stays after refresh
- Expand a task with Details and confirm description, due date, notes, and checklist can be saved
- Edit a task, press `Escape`, and confirm the old name is kept
- Clear completed tasks and confirm only active tasks remain

## Current Step

Step 36 improves the add-task form into a compact, professional task composer.
