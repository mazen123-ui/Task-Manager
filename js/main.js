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

  let updatedTasks = tasks
  if (document.querySelector('.tabs .tab').getAttribute('data-tab') === 'all') {
    updatedTasks = tasks  
  }else if (document.querySelector('.tabs .tab').getAttribute('data-tab') === 'active'){
    updatedTasks = updatedTasks.filter((tab) => {tab.checked === false})
  }else if (document.querySelector('.tabs .tab').getAttribute('data-tab') === 'completed'){
    updatedTasks = updatedTasks.filter((tab) => {tab.checked === true})
  }

  updatedTasks.forEach((task) => {
    let cardDiv = document.createElement('div')
    cardDiv.classList.add('card')
    cardDiv.innerHTML = `
    
    `
  })
}
