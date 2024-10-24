"use strict";

const listSidebar = document.querySelector("aside menu");
const listTitle = document.querySelector("h1 input");
const newListBtn = document.querySelector("aside button");
const deleteListBtn = document.querySelector("#deleteList");

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

displayTaskLists();

// CONTROLLER

function updateLocalStorage() {
  localStorage.setItem("taskLists", JSON.stringify(taskLists));
}

function resetActiveList() {
  taskLists.forEach((list) => {
    list.active = false;
  });
}

function resetListView() {
  viewTasks.querySelectorAll(".task").forEach((task) => {
    task.remove();
  });
}

function clearInput(input) {
  input.value = "";
  input.blur();
}

function removeTask(activeList, id) {
  taskLists[activeList].tasks.splice(id, 1);
  updateLocalStorage();
  displayTaskLists();
}

function removeList(id) {
  taskLists.splice(id, 1);
  updateLocalStorage();
  displayTaskLists();
}

// SELECTING A LIST
listSidebar.addEventListener("click", (e) => {
  resetActiveList();
  const currentList = taskLists.findIndex(
    (list) => list.title == e.target.textContent
  );
  taskLists[currentList].active = true;
  updateLocalStorage();
  displayTaskLists();
});

// CREATING A NEW LIST
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
  listNameInput.addEventListener("focusout", (e) => {
    if (e.target.value === "") {
      listNameInput.closest("li").remove();
    } else {
      resetActiveList();
      taskLists.push({ title: e.target.value, active: true, tasks: [] });
      updateLocalStorage();
      displayTaskLists();
    }
  });
});

// DELETING A LIST
deleteListBtn.addEventListener("click", (e) => {
  const activeList = taskLists.findIndex((list) => list.active === true);
  taskLists[activeList - 1].active = true;
  removeList(activeList);
});

// EDIT LIST TITLE
listTitle.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    const activeList = taskLists.findIndex((list) => list.active === true);
    const newListTitle = e.target.value;
    taskLists[activeList].title = newListTitle;
    updateLocalStorage();
    displayTaskLists();
    listTitle.blur();
  }
});

listTitle.addEventListener("focusout", (e) => {
  const activeList = taskLists.findIndex((list) => list.active === true);
  const newListTitle = e.target.value;
  taskLists[activeList].title = newListTitle;
  updateLocalStorage();
  displayTaskLists();
  listTitle.blur();
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
    clearInput(e.target);
  }
});

addTaskInput.addEventListener("focusout", () => {
  addTaskInput.value = "";
});

// TASK ACTIONS
viewTasks.addEventListener("click", (e) => {
  const activeList = taskLists.findIndex((list) => list.active === true);
  const targetTask = e.target.closest("li.task");
  const targetTaskOriginal = targetTask.innerHTML;

  // MARK TASK AS DONE
  if (e.target.matches("label")) {
    const currentTaskList = taskLists[activeList].tasks;
    const currentTask = currentTaskList.findIndex(
      (task) => task.title === e.target.textContent
    );
    if (currentTaskList[currentTask].done === false) {
      currentTaskList[currentTask].done = true;
    } else {
      currentTaskList[currentTask].done = false;
    }
    updateLocalStorage();
    displayTasks();
  }

  // DELETE TASK
  if (e.target.classList.contains("actionDelete")) {
    removeTask(activeList, targetTask.dataset.id);
  }

  // EDIT TASK
  if (e.target.classList.contains("actionEdit")) {
    const oldLabel = targetTask.querySelector("label").textContent;
    targetTask.innerHTML = `<label for=""></label><input id="editTask" type="text" placeholder="Edit task..." />`;
    const editingTask = targetTask.querySelector("input");
    editingTask.value = oldLabel;
    editingTask.focus();
    editingTask.addEventListener("focusout", (e) => {
      targetTask.innerHTML = targetTaskOriginal;
    });
    editingTask.addEventListener("keydown", (e) => {
      if (e.code === "Enter") {
        const activeList = taskLists.findIndex((list) => list.active === true);
        const activeTasks = taskLists[activeList].tasks;
        const currentTask = activeTasks.findIndex(
          (task) => task.title == oldLabel
        );
        const newTask = e.target.value;
        console.log(activeTasks[currentTask]);
        activeTasks[currentTask].title = newTask;
        activeTasks[currentTask].done = false;
        updateLocalStorage();
        displayTaskLists();
        clearInput(e.target);
      }
    });
  }
});

// VIEW

// FILL SIDEBAR WITH SAVED LISTS
function displayTaskLists() {
  listSidebar.innerHTML = "";
  taskLists.forEach((list) => {
    listSidebar.innerHTML += `<li class="${list.active && "active"}">${
      list.title
    }</li>`;
  });
  displayTasks();
}

// FILL LIST WITH SELECTED LIST'S TASKS
function displayTasks() {
  const activeList = taskLists.findIndex((list) => list.active === true);
  listTitle.value = taskLists[activeList].title;
  resetListView();
  taskLists[activeList].tasks.forEach((task, i) => {
    const taskTemplate = document.querySelector("template").content;
    const newTask = taskTemplate.cloneNode(true);

    const taskLabel = task.title;
    const taskID = task.id;

    newTask.querySelector("li").setAttribute("data-id", i);

    newTask.querySelector("label").setAttribute("for", taskLabel);
    newTask.querySelector("label").textContent = taskLabel;

    newTask.querySelector("input").id = taskID;
    newTask.querySelector("input").name = taskLabel;
    task.done === true &&
      newTask.querySelector("input").setAttribute("checked", "checked");

    viewTasks.appendChild(newTask);
  });
}
