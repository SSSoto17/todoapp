// LATER

taskListView.addEventListener("click", (e) => {
  const targetTask = e.target.closest(".task");

  if (e.target.classList.contains("actionDelete")) {
    // targetTask.remove();
    // console.log(targetTask.querySelector("input").id);
  }
});

// function removeTask(id) {
//   tasks.splice(id, 1);
// }

function updateTaskList(task) {
  const taskTemplate = document.querySelector("template").content;
  const newTask = taskTemplate.cloneNode(true);

  const taskLabel = task;

  newTask.querySelector("label").textContent = taskLabel;
  newTask.querySelector("label").setAttribute("for", taskLabel);

  newTask.querySelector("input").id = taskLabel;
  newTask.querySelector("input").name = taskLabel;

  taskListView.appendChild(newTask);
  clearInput();
}
