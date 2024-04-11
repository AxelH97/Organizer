const baseURL = "http://localhost:8888";

document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");

  function loadTasks() {
    fetch(`${baseURL}/api/tasks`)
      .then((response) => response.json())
      .then((tasks) => {
        taskList.innerHTML = "";
        tasks.forEach((task) => {
          const li = document.createElement("li");
          li.textContent = task.text;
          taskList.appendChild(li);
        });
      })
      .catch((error) => console.error("Error loading tasks:", error));
  }

  loadTasks();

  addTaskBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
      fetch(`${baseURL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: taskText }),
      })
        .then((response) => response.json())
        .then((newTask) => {
          const li = document.createElement("li");
          li.textContent = newTask.text;
          taskList.appendChild(li);
          taskInput.value = "";
        })
        .catch((error) => console.error("Error adding task:", error));
    }
  });
});
