"use strict";

const listSidebar = document.querySelector("aside menu");
const newListBtn = document.querySelector("aside button");
const listTitle = document.querySelector("h1");

const viewTasks = document.querySelector("ul.tasks");
const addTaskInput = document.querySelector("#addTask");

const storedTaskLists = localStorage.getItem("taskLists");

// MODEL
let taskLists;
if (storedTaskLists === null) {
  taskLists = [
    {
      title: "Home",
      active: true,
      tasks: [
        {
          title: "Do the dishes",
          done: false,
          id: self.crypto.randomUUID(),
        },
        {
          title: "Walk the dog",
          done: false,
          id: self.crypto.randomUUID(),
        },
        {
          title: "Buy groceries",
          done: false,
          id: self.crypto.randomUUID(),
        },
      ],
    },
    {
      title: "Work",
      active: false,
      tasks: [
        {
          title: "Send email",
          done: false,
          id: self.crypto.randomUUID(),
        },
        {
          title: "Write report",
          done: false,
          id: self.crypto.randomUUID(),
        },
      ],
    },
    {
      title: "School",
      active: false,
      tasks: [
        {
          title: "Organise notes",
          done: false,
          id: self.crypto.randomUUID(),
        },
        {
          title: "Hand in assignment",
          done: false,
          id: self.crypto.randomUUID(),
        },
      ],
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

displayTaskLists();

function displayTaskLists() {
  listSidebar.innerHTML = "";
  taskLists.forEach((list) => {
    listSidebar.innerHTML += `<li class="${list.active && "active"}">${
      list.title
    }</li>`;
  });
  displayTasks();
}

function displayTasks() {
  const activeList = taskLists.findIndex((list) => list.active === true);
  listTitle.textContent = taskLists[activeList].title;
  viewTasks.querySelectorAll(".task").forEach((task) => {
    task.remove();
  });
  taskLists[activeList].tasks.forEach((task) => {
    console.log(task);
    const taskTemplate = document.querySelector("template").content;
    const newTask = taskTemplate.cloneNode(true);

    const taskLabel = task.title;

    newTask.querySelector("label").setAttribute("for", taskLabel);
    newTask.querySelector("label").textContent = taskLabel;

    newTask.querySelector("input").id = taskLabel;
    newTask.querySelector("input").name = taskLabel;

    viewTasks.appendChild(newTask);
  });
}

function resetActiveList() {
  taskLists.forEach((list) => {
    list.active = false;
  });
}

listSidebar.addEventListener("click", (e) => {
  resetActiveList();
  const currentList = taskLists.findIndex(
    (list) => list.title == e.target.textContent
  );
  taskLists[currentList].active = true;
  updateLocalStorage();
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
      updateLocalStorage();
      displayTaskLists();
    }
  });
});

// ADD NEW TASK

addTaskInput.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    const activeList = taskLists.findIndex((list) => list.active === true);
    const newTask = e.target.value;
    taskLists[activeList].tasks.push({
      title: e.target.value,
      done: false,
      id: self.crypto.randomUUID(),
    });
    updateLocalStorage();
    displayTaskLists();
    clearInput();
  }
});

function clearInput() {
  addTask.value = "";
  addTask.blur();
}

// LATER

// viewTasks.addEventListener("click", (e) => {
//   const targetTask = e.target.closest(".task");

//   if (e.target.classList.contains("actionDelete")) {
// targetTask.remove();
// console.log(targetTask.querySelector("input").id);
//   }
// });

// function removeTask(id) {
//   tasks.splice(id, 1);
// }
