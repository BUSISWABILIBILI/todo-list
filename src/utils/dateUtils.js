export function formatDueDate(dueDate) {
  if (!dueDate) {
    return "";
  }

  const date = new Date(`${dueDate}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dueDate;
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
