const express = require("express");
const router = express.Router();
const Category = require("../models/category");

router.post("/category", async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/categories", async (req, res) => {
    try {
        const category = await Category.find();
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
