# Taskboard Todo List

A project-based todo dashboard built with JavaScript modules, localStorage, and webpack.

Taskboard lets you create separate project lists, manage tasks inside each project, track completion progress, and keep work organized with due dates, priorities, filters, and collapsible task details. The app renders its interface with JavaScript modules and builds production files into `docs/` for GitHub Pages.

## Features

- Create, rename, select, and delete project lists
- Add tasks to the selected project
- Mark tasks as active or completed
- Filter tasks by all, active, and completed
- Track total, active, completed, and overdue task counts
- View project completion progress
- Set task descriptions, due dates, notes, checklist text, and priority
- Expand only the tasks that have extra details
- Clear completed tasks
- Persist projects and tasks with localStorage
- Recover safely from corrupt or blocked localStorage data
- Responsive dashboard layout for desktop, tablet, and mobile

## Tech Stack

- HTML
- CSS
- JavaScript modules
- webpack
- localStorage

## Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run start
```

You can also run the same dev server with:

```bash
npm run dev
```

Then open the local URL printed in the terminal. The webpack dev server uses an available port automatically, so it should not crash when another project is already using the default port.

## Build

Create a production build:

```bash
npm run build
```

The production build is generated in `docs/`.

For GitHub Pages, set the repository Pages source to:

- Branch: `main`
- Folder: `/docs`

## Test

Run the project checks and unit tests:

```bash
npm run test
```

The test script checks JavaScript syntax and runs regression tests for the domain logic and localStorage persistence.

## Scripts

- `npm run dev` starts the webpack dev server
- `npm run start` starts the webpack dev server
- `npm run build` creates the production files in `docs/`
- `npm run test` checks syntax and runs tests

## Project Structure

- `public/` contains the app CSS
- `src/app/` contains the application controller that wires events to logic and UI
- `src/domain/` contains todo and project factories, data normalization, and state changes
- `src/storage/` contains localStorage persistence
- `src/ui/` contains JavaScript modules that create and render the interface
- `src/utils/` contains shared helpers like due date formatting
- `src/index.js` is the webpack entry file
- `src/template.html` is the minimal HTML mount point used by webpack
- `tests/` contains regression tests
- `docs/` contains the production build for GitHub Pages
- `webpack.config.js` controls local development and production builds

## Manual Test Checklist

- Create a project and confirm it becomes the selected project
- Rename a project and confirm the new name stays after refresh
- Delete the selected project and confirm another project is selected when available
- Add a task and confirm it appears in the selected project
- Switch projects and confirm each project keeps its own tasks
- Refresh the page and confirm projects and tasks are still there
- Mark a task complete and confirm the counters update
- Use all, active, and completed filters
- Add a due date and confirm overdue tasks are counted correctly
- Edit a task and confirm the updated details persist
- Expand a task with details and confirm the extra information appears
- Confirm tasks without extra details do not show an expand control
- Clear completed tasks and confirm only active tasks remain

## Deployment

This project is configured for GitHub Pages by building webpack output into `docs/`. After running `npm run build`, commit the updated `docs/` folder and publish from the repository Pages settings.
