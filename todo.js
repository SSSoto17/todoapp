"use strict";

const listSidebar = document.querySelector("aside menu");
const newListBtn = document.querySelector("aside button");

const taskList = document.querySelector("ul.tasks");
const addTask = document.querySelector("#addTask");

const storedTaskLists = localStorage.getItem("taskLists");

// MODEL
let taskLists;
if (storedTaskLists === null) {
  taskLists = [
    {
      title: "Home",
      active: true,
      tasks: ["Do the dishes", "Walk the dog", "Buy groceries"],
    },
    {
      title: "Work",
      active: false,
      tasks: ["Send email", "Write report"],
    },
    {
      title: "School",
      active: false,
      tasks: ["Do the dishes", "Walk the dog", "Buy groceries"],
    },
  ];
} else {
  taskLists = JSON.parse(storedTaskLists);
}

// CONTROLLER

function updateLocalStorage() {
  localStorage.setItem("taskLists", JSON.stringify(taskLists));
}

// VIEW

// TASK LISTS

displayTaskLists();
// displayTasks();

function displayTasks() {
  const activeList = taskLists.findIndex((list) => list.active === true);
  document.querySelector("h1").textContent = taskLists[activeList].title;
  taskLists[activeList].tasks.forEach((task) => {
    const taskTemplate = document.querySelector("template").content;
    const newTask = taskTemplate.cloneNode(true);

    const taskLabel = task;

    newTask.querySelector("label").setAttribute("for", taskLabel);
    newTask.querySelector("label").textContent = taskLabel;

    newTask.querySelector("input").id = taskLabel;
    newTask.querySelector("input").name = taskLabel;

    taskList.appendChild(newTask);
  });
}

function resetActiveList() {
  taskLists.forEach((list) => {
    list.active = false;
  });
}

function displayTaskLists() {
  listSidebar.innerHTML = "";
  taskLists.forEach((list) => {
    listSidebar.innerHTML += `<li class="${list.active && "active"}">${
      list.title
    }</li>`;
  });
  displayTasks();
}

listSidebar.addEventListener("click", (e) => {
  resetActiveList();
  const currentList = taskLists.findIndex(
    (list) => list.title == e.target.textContent
  );
  taskLists[currentList].active = true;
  displayTaskLists();
});

newListBtn.addEventListener("click", (e) => {
  const newList = `<li><input id="addTaskList" type="text" placeholder="New task list..."/></li>`;
  listSidebar.innerHTML += newList;

  const listNameInput = listSidebar.querySelector("input");
  listNameInput.focus();
  listNameInput.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      resetActiveList();
      taskLists.push({ title: e.target.value, active: true, tasks: [] });
      console.log(taskLists);
      updateLocalStorage();
      displayTaskLists();
    }
  });
});

// ADD NEW TASK

addTask.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    tasks.push(e.target.value);
    updateTaskList(e.target.value);
  }
});

function updateTaskList(task) {
  const taskTemplate = document.querySelector("template").content;
  const newTask = taskTemplate.cloneNode(true);

  const taskLabel = task;

  newTask.querySelector("label").textContent = taskLabel;
  newTask.querySelector("label").setAttribute("for", taskLabel);

  newTask.querySelector("input").id = taskLabel;
  newTask.querySelector("input").name = taskLabel;

  taskList.appendChild(newTask);
  clearInput();
}

function clearInput() {
  addTask.value = "";
  addTask.blur();
}

// LATER

taskList.addEventListener("click", (e) => {
  const targetTask = e.target.closest(".task");

  if (e.target.classList.contains("actionDelete")) {
    // targetTask.remove();
    // console.log(targetTask.querySelector("input").id);
  }
});

function removeTask(id) {
  tasks.splice(id, 1);
}
