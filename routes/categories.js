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

router.post("/delete", authenticateToken, async (req, res) => {
    const nombre = req.body.nombre; // Suponiendo que envías el id de la categoría a eliminar en el cuerpo de la solicitud

    try {
        // Busca y elimina la categoría
        const deletedCategory = await Category.findOneAndDelete({
            nombre: nombre,
        });

        if (!deletedCategory) {
            // Categoría no encontrada
            return res.status(404).json({ alert: req.body });
        }

        // Aquí puedes agregar lógica adicional si necesitas manejar productos huérfanos
        // Por ejemplo, podrías eliminar productos asociados a esta categoría:
        // await Product.deleteMany({ categoria: id });

        res.status(200).json({ alert: "Categoría eliminada exitosamente" });
    } catch (error) {
        // error.message
        res.status(500).json({ error: `el error esta ak ${req.body}` });
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
