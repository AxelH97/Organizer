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

          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "Löschen";
          deleteBtn.addEventListener("click", function () {
            deleteTask(task.id);
          });

          li.appendChild(deleteBtn);
          taskList.appendChild(li);
        });
      })
      .catch((error) => console.error("Error loading tasks:", error));
  }

  loadTasks();

  function deleteTask(taskId) {
    fetch(`${baseURL}/api/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Task deleted successfully");
          loadTasks();
        } else {
          throw new Error("Failed to delete task");
        }
      })
      .catch((error) => console.error("Error deleting task:", error));
  }

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
        .then(() => {
          taskInput.value = "";
          loadTasks();
        })
        .catch((error) => console.error("Error adding task:", error));
    }
  });
});
