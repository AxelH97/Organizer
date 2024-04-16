const express = require("express");
const bcrypt = require("bcrypt");
const { corsOptions } = require("../config");
const User = require("../userSchema");

const router = express.Router();

router.post("register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Registrierung erfolgreich" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Ungültige Anmeldeinformationen");
    }
    // Setze die Benutzersitzung
    req.session.user = user;
    res.json({ message: "Anmeldung erfolgreich" });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy();

  res.json({ message: "Abmeldung erfolgreich" });
});

module.exports = router;
