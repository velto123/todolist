// Change theme
document.body.querySelector(".theme").addEventListener("click", (e) => {
    document.body.classList.toggle("light-theme");
});

// Show time
const showTime = () => {
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        // hour12: false,
    };
    const date = new Date().toLocaleString("en-GB", options);

    document.querySelector(".time").textContent = date.charAt(0).toUpperCase() + date.slice(1);
};
setInterval(showTime, 1000);

// Global variables
const tasks = [];
const checkboxStatuses = [];
let dataKey = 0;

// Get key
const getKey = (e) => e.target.parentNode.dataset.key;

// Update list
const updateList = (list) => {
    dataKey = 0;
    document.querySelector(".tasks-container").textContent = "";
    list.forEach((item) => {
        createTask(item);
        listen(dataKey);
        dataKey++;
    });
    document.querySelector(".task-input").value = "";
    document.querySelector(".task-search").value = "";
};

// Search a task
const searchTask = (e) => {
    const searchValue = e.target.value;

    if (searchValue !== "") {
        const idsTasks = [];
        const searchingTasks = document.querySelectorAll(".task-content");
        searchingTasks.forEach((task) => {
            if (task.textContent.includes(searchValue)) {
                idsTasks.push(task.dataset.key);
            }
        });
        const deletingTasks = document.querySelectorAll(".task-wrapper");
        deletingTasks.forEach((task) => {
            if (!idsTasks.includes(task.dataset.key)) {
                task.style.display = "none";
            } else {
                task.style.display = "contents";
            }
        });
    } else {
        updateList(tasks);
    }
};

// Create task
const createTask = (content) => {
    const tasksContainer = document.querySelector(".tasks-container");
    const newTask = document.createElement("li");
    newTask.setAttribute("data-key", `${dataKey}`);
    newTask.className = "task-wrapper";
    newTask.innerHTML = `
    <label data-key="${dataKey}" class="task">
        <input data-key="${dataKey}" class="task-checkbox" type="checkbox" name="checkbox" />
        <span data-key="${dataKey}" class="task-content ${
        checkboxStatuses[dataKey] ? "task-completed" : ""
    }">${content}</span>
        <button data-key=${dataKey} class="task-btn task-edit"><span class="material-icons"> edit </span></button>
        <button data-key=${dataKey} class="task-btn task-moveup"><span class="material-icons"> move_up </span></button>
        <button data-key=${dataKey} class="task-btn task-movedown"><span class="material-icons"> move_down </span></button>
        <button data-key="${dataKey}" class="task-btn task-delete"><span class="material-icons"> delete_forever </span></button>
    </label>`;
    tasksContainer.appendChild(newTask);
    newTask.children[0].children[0].checked = checkboxStatuses[dataKey];
    document.querySelector(".task-search").value = "";
};

// Add task
const addTask = (e) => {
    e.preventDefault();
    const taskInputValue = document.querySelector(".task-input").value;

    if (taskInputValue !== "" && !tasks.includes(taskInputValue)) {
        console.log("jestem");
        e.target.parentNode.setAttribute("data-key", `${dataKey}`);
        createTask(taskInputValue);
        tasks.push(taskInputValue);
        checkboxStatuses.push(false);
        dataKey++;
        document.querySelector(".task-input").value = "";
        listen(getKey(e));
    } else if (taskInputValue === "") {
        alert("You cannot add a task without providing a title!");
    } else {
        alert("You have already added such a task");
        document.querySelector(".task-input").value = "";
    }
};

// Mark the task as complete / incomplete
const markTask = (e) => {
    const id = getKey(e);
    const taskCheckbox = e.target;
    const taskContent = document.querySelector(`.task-content[data-key="${id}"]`);

    // add class completed
    taskCheckbox.checked ? taskContent.classList.add("task-completed") : taskContent.classList.remove("task-completed");

    // remember status
    taskCheckbox.checked ? (checkboxStatuses[id] = true) : (checkboxStatuses[id] = false);
};

// Edit task
const editTask = (e) => {
    const newContent = window.prompt("Edit the task");
    const id = getKey(e);

    tasks[id] = newContent;
    document.querySelector(`.task-content[data-key="${id}"]`).textContent = newContent;
};

// Move task up
const moveUp = (e) => {
    if (document.querySelector(".task-search").value === "") {
        const id = ~~getKey(e);

        if (tasks[id - 1]) {
            const tmp = tasks[id - 1];
            tasks[id - 1] = tasks[id];
            tasks[id] = tmp;

            const tmp2 = checkboxStatuses[id - 1];
            checkboxStatuses[id - 1] = checkboxStatuses[id];
            checkboxStatuses[id] = tmp2;

            updateList(tasks);
        } else {
            alert("You cannot move this task higher!");
        }
    } else {
        alert("You cannot use item move while searching");
    }
};

// Move task down
const moveDown = (e) => {
    if (document.querySelector(".task-search").value === "") {
        const id = ~~getKey(e);

        if (tasks[id + 1]) {
            const tmp = tasks[id + 1];
            tasks[id + 1] = tasks[id];
            tasks[id] = tmp;

            const tmp2 = checkboxStatuses[id + 1];
            checkboxStatuses[id + 1] = checkboxStatuses[id];
            checkboxStatuses[id] = tmp2;

            updateList(tasks);
        } else {
            alert("You cannot move this task lower!");
        }
    } else {
        alert("You cannot use item move while searching");
    }
};

// Delete task
const deleteTask = (e) => {
    const id = getKey(e);
    const taskWrapper = document.querySelector(`.task-wrapper[data-key="${id}"]`);
    const taskContent = document.querySelector(`.task-content[data-key="${id}"]`);
    const taskIndex = tasks.findIndex((task) => task === taskContent.textContent);

    tasks.splice(taskIndex, 1);
    checkboxStatuses.splice(taskIndex, 1);

    taskWrapper.remove();
    updateList(tasks);
};

// Listeners
const listen = (key) => {
    // checkbox
    document.querySelector(`.task-checkbox[data-key="${key}"]`).addEventListener("click", markTask);

    // edit
    document.querySelector(`.task-edit[data-key="${key}"]`).addEventListener("click", editTask);

    // move up
    document.querySelector(`.task-moveup[data-key="${key}"]`).addEventListener("click", moveUp);

    // move down
    document.querySelector(`.task-movedown[data-key="${key}"]`).addEventListener("click", moveDown);

    // delete
    document.querySelector(`.task-delete[data-key="${key}"]`).addEventListener("click", deleteTask);
};

// add task
document.querySelector(".task-add").addEventListener("click", addTask);
document.querySelector(".task-input").addEventListener("submit", addTask);

// search task
document.querySelector(".task-search").addEventListener("input", searchTask);
