const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const router = express.Router();
const authenticateToken = require("../middlewares/authToken"); // Middleware de autenticación

// Registro
///apiStore/user/register
router.post("/register", authenticateToken, async (req, res) => {
    //router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        // Aquí puedes agregar validaciones para username y password si lo deseas
        const user = new User({ username, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1s",
        });

        res.status(201).json({ token });
        // res.status(201).json("cosa");
    } catch (error) {
        res.status(400).json({ username: username, password: password });
    }
});

// Inicio de sesión
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Credenciales incorrectas" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
