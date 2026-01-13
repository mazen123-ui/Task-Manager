let addTaskBtn = document.querySelector(".add-task");
let taskContainer = document.querySelector(".task-container");
let tabs = document.querySelectorAll(".tab");
let allTasksSpan = document.querySelector(".num-of-tasks");
let modelContainer = document.querySelector(".model-container");
let closeModelBtn = document.querySelector(".close-model");
let addTaskModelForm = document.querySelector(".add-task-model form");
let cancelBtn = document.querySelector(".cancel");
let clearTabsBtn = document.querySelector(".clear-tabs-btn");
let updatedId = null; // Changed to storage the ID instead of index for safer updates

// helper function to get tasks from local storage
function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// helper function to save tasks to local storage
function saveTasksToStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Global render function to avoid duplicate code - default filte ==> "all"
function renderTasks(filter = "all") {
  let tasks = getTasksFromStorage();
  taskContainer.innerHTML = "";

  // Show the total number of tasks regardless of the filter
  allTasksSpan.textContent = tasks.length;

  // Filter tasks based on the selected tab
  let filteredTasks = tasks;
  if (filter === "active") {
    filteredTasks = tasks.filter((task) => !task.checked);
  } else if (filter === "completed") {
    filteredTasks = tasks.filter((task) => task.checked);
  }

  filteredTasks.forEach((task) => {
    let cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    if (task.checked) cardDiv.classList.add("completed");

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

    // Add event listener for the checkbox
    const checkbox = cardDiv.querySelector(".task-checkbox");
    checkbox.addEventListener("change", () => {
      toggleTaskStatus(task.id);
    });

    taskContainer.appendChild(cardDiv);
  });
}

// Toggle task check status using unique ID
function toggleTaskStatus(id) {
  let tasks = getTasksFromStorage();
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, checked: !task.checked };
    }
    return task;
  });
  saveTasksToStorage(tasks);

  // Re-render based on the current active tab
  const activeFilter = document.querySelector(".tab.active").dataset.tab;
  renderTasks(activeFilter);
}

// Initial render
window.addEventListener("load", () => renderTasks());

// Show modal to add a new task
addTaskBtn.addEventListener("click", () => {
  modelContainer.style.display = "block";
  document.querySelector(
    ".add"
  ).innerHTML = `<i class="ri-save-3-line"></i> Add Task`;
  updatedId = null; // Ensure we are in "Add" mode
});

// Close modal and reset form
const closeModal = () => {
  updatedId = null;
  addTaskModelForm.reset();
  modelContainer.style.display = "none";
};

closeModelBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

// Handle form submission (Add or Update)
addTaskModelForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let taskName = document.querySelector("#task-name").value.trim();
  let taskDescription = document
    .querySelector("#task-description")
    .value.trim();

  if (taskName === "") {
    alert("You Have To At Least Enter The Task Name!!");
    return;
  }

  let tasks = getTasksFromStorage();

  if (updatedId === null) {
    // Add new task with a unique ID (timestamp)
    tasks.push({
      id: Date.now(),
      name: taskName,
      description: taskDescription,
      checked: false,
    });
  } else {
    // Update existing task using its ID
    tasks = tasks.map((task) => {
      if (task.id === updatedId) {
        return { ...task, name: taskName, description: taskDescription };
      }
      return task;
    });
    updatedId = null;
    alert("Task Updated!!!");
  }

  saveTasksToStorage(tasks);
  closeModal();
  renderTasks(document.querySelector(".tab.active").dataset.tab);
});

// Delete task using its unique ID
function deleteTask(id) {
  if (confirm("Do You Really Want To Permanently Delete This Task?")) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter((task) => task.id !== id);
    saveTasksToStorage(tasks);
    renderTasks(document.querySelector(".tab.active").dataset.tab);
  }
}

// Edit task: Populate modal with task data
function editTask(id) {
  let tasks = getTasksFromStorage();
  let task = tasks.find((t) => t.id === id);

  if (task) {
    modelContainer.style.display = "block";
    document.querySelector("#task-name").value = task.name;
    document.querySelector("#task-description").value = task.description;
    updatedId = id;
    document.querySelector(
      ".add"
    ).innerHTML = `<i class="ri-save-3-line"></i> Update Task`;
  }
}

// Handling Tabs: activation and filtering
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove active class from all tabs and add it to the clicked one
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    // Filter tasks based on the tab's data attribute
    const filter = tab.dataset.tab;
    renderTasks(filter);
  });
});

// Clear all tasks
clearTabsBtn.addEventListener("click", () => {
  if (confirm("Do You Really Want To Clear All Tasks?")) {
    localStorage.removeItem("tasks");
    renderTasks();
  }
});
