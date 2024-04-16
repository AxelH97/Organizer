//server.js

require("./config");
const connectMongoDB = require("./db-connect");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const User = require("./userSchema");
const authRoutes = require("./routes/auth.js");
const taskRoutes = require("./routes/tasks.js");

const cors = require("cors");

const app = express();

const allowedOrigins = ["http://localhost:5173"];

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
app.use(
  session({
    secret: "geheimnisvollerSchluessel",
    resave: true,
    saveUninitialized: true,
  })
);

connectMongoDB();

app.use("/api", authRoutes);
app.use("/api", taskRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
