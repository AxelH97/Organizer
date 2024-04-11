//server.js

require("./config");
const connectMongoDB = require("./db-connect");
const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");

const app = express();

const allowedOrigins = "http://localhost:5173";

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectMongoDB();

let tasks = [];

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: "Registrierung erfolgreich" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      throw new Error("Ungültige Anmeldeinformationen");
    }
    req.session.user = user;
    res.json({ message: "Anmeldung erfolgreich" });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text field is required" });
  }
  const newTask = { id: tasks.length + 1, text };
  tasks.push(newTask);
  res.json(newTask);
});

app.get("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.delete("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const index = tasks.findIndex((task) => task.id === taskId);
  if (index !== -1) {
    tasks.splice(index, 1);
    res.status(200).json({ message: "Task deleted successfully" });
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
