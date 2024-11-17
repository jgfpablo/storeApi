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
    const nombre = req.body; // Suponiendo que envías el id de la categoría a eliminar en el cuerpo de la solicitud

    try {
        // Busca y elimina la categoría
        const { nombre } = req.body;
        const deletedCategory = await Category.findOneAndDelete({
            nombre,
        });

        if (!deletedCategory) {
            // Categoría no encontrada
            return res.status(404).json({ alert: nombre });
        }

        // Aquí puedes agregar lógica adicional si necesitas manejar productos huérfanos
        // Por ejemplo, podrías eliminar productos asociados a esta categoría:
        // await Product.deleteMany({ categoria: id });

        res.status(200).json({ alert: "Categoría eliminada exitosamente" });
    } catch (error) {
        // error.message
        res.status(500).json({ error: `el error esta ak ${nombre}` });
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

router.put("/updateCategory", authenticateToken, async (req, res) => {
    try {
        // Obtener el filamento desde el cuerpo de la solicitud
        const { category } = req.body;

        if (!category || !category.nombre) {
            return res.status(400).json({
                error: "El campo 'nombre' es obligatorio para actualizar el filamento",
            });
        }

        // Buscar el filamento por su color y actualizarlo
        const updateCategory = await Category.findOneAndUpdate(
            { nombre: category.nombre }, // Condición de búsqueda correcta
            categoy, // Datos a actualizar
            { new: true } // Retorna el filamento actualizado
        );

        // Si no se encuentra el filamento
        if (!updateCategory) {
            return res.status(404).json({
                error: "categoria no encontrado",
            });
        }

        // Responder con el filamento actualizado
        res.json({
            alert: "Categoria actualizado exitosamente",
            status: "success",
            data: updateCategory,
        });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({
            error: `Error al actualizar el categoria: ${error.message}`,
            status: "failure",
        });
    }
});
module.exports = router;
