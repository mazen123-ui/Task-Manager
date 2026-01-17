let addTaskBtn = document.querySelector(".add-task");
let taskContainer = document.querySelector(".task-container");
let addTaskBtnText = document.querySelector(".add");
let tabs = document.querySelectorAll(".tab");
let allTasksSpan = document.querySelector(".num-of-tasks");
let activeTasksSpan = document.querySelector(".num-of-active-tasks");
let completedTasksSpan = document.querySelector(".num-of-completed-tasks");
let modelContainer = document.querySelector(".model-container");
let closeModelBtn = document.querySelector(".close-model");
let addTaskModelForm = document.querySelector(".add-task-model form");
let cancelBtn = document.querySelector(".cancel");
let clearTabsBtn = document.querySelector(".clear-tabs-btn");
let updatedId = null; // Changed to storage the ID instead of index for safer updates

// helper function to get tasks from local storage
function getTasksFromLocalstorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// helpe function to put tasks on local storage
function setTasksFromLocalsorage(tasks) {
  return localStorage.setItem("tasks", JSON.stringify(tasks));
}

// render tasks based on filter
function renderTasks(filter = "all") {
  let tasks = getTasksFromLocalstorage();
  taskContainer.innerHTML = "";
  allTasksSpan.textContent = tasks.length;
  activeTasksSpan.textContent = tasks.filter((task) => task.checked === false).length;
  completedTasksSpan.textContent = tasks.filter((task) => task.checked === true).length;
  let updatedTasks = tasks;
  if (filter === "all") {
    updatedTasks = tasks;
  } else if (filter === "active") {
    updatedTasks = updatedTasks.filter((tab) => {
      return tab.checked === false;
    });
  } else if (filter === "completed") {
    updatedTasks = updatedTasks.filter((tab) => {
      return tab.checked === true;
    });
  }
  // add tasks to the DOM
  updatedTasks.forEach((task) => {
    let cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    if (task.checked) {
      cardDiv.classList.add("completed");
    }
    cardDiv.innerHTML = `
    <div class="content">
        <input type="checkbox" ${
          task.checked ? "checked" : ""
        } class="task-checkbox" />
        <div class="text">
            <h2 class="task-name">${task.name}</h2>
            <p>${task.description}</p>
        </div>
    </div>
    <div class="actions">
        <i class="ri-pencil-line edit" onclick="editTask(${task.id})"></i>
        <i class="ri-delete-bin-line delete" onclick="deleteTask(${
          task.id
        })"></i>
    </div>
    `;
    taskContainer.appendChild(cardDiv);

    let checkbox = cardDiv.querySelector(".task-checkbox");
    checkbox.addEventListener("change", () => toggleCheckbox(task.id));
  });
}

window.addEventListener("load", () => renderTasks());

// function to close the model
function closeModel() {
  modelContainer.style.display = "none";
}

addTaskBtn.addEventListener("click", () => {
  modelContainer.style.display = "block";
  document.querySelector(
    ".add"
  ).innerHTML = `<i class="ri-save-3-line"></i> Add Task`;
});
closeModelBtn.addEventListener("click", closeModel);
cancelBtn.addEventListener("click", closeModel);

// add task from the input model
addTaskModelForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let taskName = document.querySelector("#task-name").value;
  let taskDescription = document.querySelector("#task-description").value;
  if (taskName === "") {
    alert("Task Name Can't Be Empty!!!");
    return;
  } else {
    if (updatedId === null) {
      // add new task
      let tasks = getTasksFromLocalstorage();
      tasks.push({
        id: Date.now(),
        name: taskName,
        description: taskDescription,
        checked: false,
      });
      setTasksFromLocalsorage(tasks);
      renderTasks(document.querySelector(".tab.active").dataset.tab);
      closeModel();
      addTaskModelForm.reset();
      updatedId = null; // reset
    } else {
      // update task
      let tasks = getTasksFromLocalstorage();
      let updatedTasks = tasks.map((task) => {
        if (task.id === updatedId) {
          return { ...task, name: taskName, description: taskDescription }; // same object with updated name and description
        } else {
          return task;
        }
      });
      setTasksFromLocalsorage(updatedTasks);
      alert("Task Updated!!!");
      renderTasks(document.querySelector(".tab.active").dataset.tab);
      closeModel();
      addTaskModelForm.reset();
      updatedId = null;
    }
  }
});

// function for toggling the checkbox
function toggleCheckbox(id) {
  let tasks = getTasksFromLocalstorage();
  let newTasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, checked: !task.checked }; // same object with updated checked status
    } else {
      return task;
    }
  });
  setTasksFromLocalsorage(newTasks);
  renderTasks(document.querySelector(".tab.active").dataset.tab);
}

// clear all tasks
clearTabsBtn.addEventListener("click", () => {
  if (confirm("Do You Really Want To Clear All Your Tasks!!!")) {
    localStorage.removeItem('tasks')
    renderTasks()
  }
});

// manage active tabs
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((tab) => tab.classList.remove("active"));
    tab.classList.add("active");
    renderTasks(tab.getAttribute("data-tab"));
  });
});

// delete task
function deleteTask(id) {
  if (confirm("You Really Wan't To Delete This Task?")) {
    let tasks = getTasksFromLocalstorage();
    tasks = tasks.filter((task) => task.id !== id);
    setTasksFromLocalsorage(tasks);
    renderTasks(document.querySelector(".tab.active").dataset.tab);
  }
}

// edit task
function editTask(id) {
  modelContainer.style.display = "block";
  let tasks = getTasksFromLocalstorage();
  let updatedTask = tasks.find((task) => task.id === id);
  document.querySelector("#task-name").value = updatedTask.name;
  document.querySelector("#task-description").value = updatedTask.description;
  updatedId = id;
  document.querySelector(
    ".add"
  ).innerHTML = `<i class="ri-save-3-line"></i> Update Task`;
}
