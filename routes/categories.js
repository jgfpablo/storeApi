const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const authenticateToken = require("../middlewares/authToken");

router.post("/category", authenticateToken, async (req, res) => {
    try {
        const existingUser = await Category.findOne({
            nombre: req.body.nombre,
        });
        if (existingUser) {
            return res.status(409).json({ error: "La categoria ya existe" });
        }

        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const category = await Category.find();
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
