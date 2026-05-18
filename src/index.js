import "../public/styles.css";
import { startApp } from "./app/app.js";

const root = document.querySelector("#app");

if (root) {
  startApp(root);
}
