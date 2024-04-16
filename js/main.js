//Setting up Variables
const itemEntryForm = document.getElementById("item-entry-form");
const newItemInput = document.getElementById("new-item");
const addBtn = document.getElementById("add-item");
const markBtn = document.getElementById("mark-btn");
const clearBtn = document.getElementById("clear-items");
const listItems = document.querySelector(".list-container .list-items");
const totalTasks = document.querySelector(".stats li .total-tasks");
const completedTasks = document.querySelector(".stats li .completed-tasks");
const remainingTasks = document.querySelector(".stats li .remaining-tasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if (localStorage.getItem("tasks")) {
  tasks.map((task) => createTask(task));
}

//Launching App
const initApp = () => {
  itemEntryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const task = {
      id: Date.now(),
      title: newItemInput.value.trim(),
      checked: false,
    };
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    //todo: filterRepeatedTasks();
    createTask(task);
    toggleActivityOfBtn();
    itemEntryForm.reset();
    newItemInput.focus();
  });

  clearBtn.addEventListener("click", () => {
    listItems.innerHTML = "";
    tasks.splice(0);
    toggleActivityOfBtn();
    localStorage.removeItem("tasks");
    countTasks();
    newItemInput.focus();
  });
};

const toggleActivityOfBtn = () => {
  if (tasks?.length) {
    clearBtn.classList.remove("disabled");
  } else {
    clearBtn.classList.add("disabled");
  }
};

toggleActivityOfBtn();

listItems.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-task")) {
    e.target.closest("li").remove();
    tasks.splice(0, 1);
    if (tasks.length === 0) newItemInput.focus();
  }

  if (e.target.classList.contains("edit-task")) {
    e.target.closest("li").firstElementChild.lastElementChild.focus();
  }

  toggleActivityOfBtn();

  localStorage.setItem("tasks", JSON.stringify(tasks));

  countTasks();
});

listItems.addEventListener("input", (e) => {
  const taskId = e.target.closest("li").id;
  updateTask(taskId, e.target);
});

listItems.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    e.target.blur();
  }
});

function createTask(task) {
  const taskEl = document.createElement("li");

  taskEl.setAttribute("id", task.id);

  taskEl.className = "item";

  const taskElMarkup = `
  <div>
      <input class="checkbox" type="checkbox" name="list" id=${task.id} ${
    task.checked ? `checked` : ``
  } />
      <span ${!task.checked ? `contenteditable` : ""} for=${task.id}>${
    task.title
  }</span>
  </div>
  <div class="del-edit">
    <button class="remove-task" title="Remove the task">
      <i class="fa-solid fa-trash remove-task"></i>
    </button>
    <button class="edit-task" title="Edit the task">
      <i class="fa-solid fa-pencil edit-task"></i>
    </button>
  </div>`;

  taskEl.innerHTML = taskElMarkup;

  listItems.appendChild(taskEl);

  countTasks();
}

function countTasks() {
  const completedTasksArr = tasks.filter((task) => task.checked === true);
  totalTasks.textContent = tasks.length;
  completedTasks.textContent = completedTasksArr.length;
  remainingTasks.textContent = tasks.length - completedTasksArr.length;
}

function updateTask(taskId, el) {
  const task = tasks.find((task) => task.id === parseInt(taskId));
  if (el.hasAttribute("contenteditable")) {
    task.title = el.textContent;
  } else {
    const span = el.nextElementSibling;
    task.checked = !task.checked;

    if (task.checked) {
      span.removeAttribute("contenteditable");
    } else {
      span.setAttribute("contenteditable", true);
    }
  }
  countTasks();
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
initApp();
