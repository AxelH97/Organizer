// script.js

const baseURL = "http://localhost:8888";

document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");

  registerForm.style.display = "block";
  loginForm.style.display = "block";
  taskContainer.style.display = "none";

  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("emailRegister").value;
    const password = document.getElementById("passwordRegister").value;
    registerUser(username, email, password);
  });

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("emailLogin").value;
    const password = document.getElementById("passwordLogin").value;
    loginUser(email, password)
      .then(() => {
        registerForm.style.display = "none";
        loginForm.style.display = "none";
        taskContainer.style.display = "block";
        loadTasks();
      })
      .catch((error) => {
        console.error("Fehler bei der Anmeldung:", error);
      });
  });

  logoutBtn.addEventListener("click", function () {
    fetch(`${baseURL}/api/logout`, {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Abmeldung erfolgreich");
        } else {
          throw new Error("Abmeldung fehlgeschlagen");
        }
      })
      .catch((error) => {
        console.error("Fehler bei der Abmeldung:", error);
      });
  });

  function loadTasks() {
    fetch(`${baseURL}/api/tasks`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fehler beim Laden der Aufgabenliste");
        }
        return response.json();
      })
      .then((tasks) => {
        if (!Array.isArray(tasks)) {
          throw new Error("Ungültiges Aufgabenformat");
        }
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
      .catch((error) =>
        console.error("Fehler beim Laden der Aufgabenliste:", error)
      );
  }

  function deleteTask(taskId) {
    fetch(`${baseURL}/api/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Aufgabe erfolgreich gelöscht");
          loadTasks();
        } else {
          throw new Error("Fehler beim Löschen der Aufgabe");
        }
      })
      .catch((error) =>
        console.error("Fehler beim Löschen der Aufgabe:", error)
      );
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
        .catch((error) =>
          console.error("Fehler beim Hinzufügen der Aufgabe:", error)
        );
    }
  });
});

function registerUser(username, email, password) {
  fetch(`${baseURL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Registrierung erfolgreich");
      } else {
        throw new Error("Registrierung fehlgeschlagen");
      }
    })
    .catch((error) => {
      console.error("Fehler bei der Registrierung:", error);
    });
}

async function loginUser(email, password) {
  fetch(`${baseURL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Anmeldung erfolgreich");
        return response.json();
      } else {
        throw new Error("Anmeldung fehlgeschlagen");
      }
    })
    .catch((error) => {
      console.error("Fehler bei der Anmeldung:", error);
    });
}

function logoutUser() {
  fetch(`${baseURL}/api/logout`, {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Abmeldung erfolgreich");
      } else {
        throw new Error("Abmeldung fehlgeschlagen");
      }
    })
    .catch((error) => {
      console.error("Fehler bei der Abmeldung:", error);
    });
}
