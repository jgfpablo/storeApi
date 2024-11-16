const express = require("express");
const router = express.Router();
const Filament = require("../models/filament");
const authenticateToken = require("../middlewares/authToken");

router.post("/filament", authenticateToken, async (req, res) => {
    try {
        const existingUser = await Filament.findOne({
            color: req.body.color,
        });
        if (existingUser) {
            return res.status(409).json({ error: "El filamento ya existe" });
        }

        const filament = new Filament(req.body);
        await filament.save();

        console.log(filament + "el filamento es este");
        res.status(201).json(filament);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/delete", authenticateToken, async (req, res) => {
    const color = req.body;

    try {
        const { color } = req.body;
        const deletedFilament = await Filament.findOneAndDelete({
            color,
        });

        if (!deletedFilament) {
            return res.status(404).json({ alert: color });
        }

        // Aquí puedes agregar lógica adicional si necesitas manejar productos huérfanos
        // Por ejemplo, podrías eliminar productos asociados a esta categoría:
        // await Product.deleteMany({ categoria: id });

        res.status(200).json({ alert: "Filamento eliminado exitosamente" });
    } catch (error) {
        // error.message
        res.status(500).json({ error: `el error esta ak ${color}` });
    }
});

router.get("/", async (req, res) => {
    try {
        const filament = await Filament.find();
        res.json(filament);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/updateFilament", authenticateToken, async (req, res) => {
    // console.log(req.body);
    // console.log(req.body.filament);

    try {
        // Obtener el nombre y los datos del producto desde el cuerpo de la solicitud
        const { filament } = req.body; // Desestructurar el 'name' y 'product' del cuerpo de la solicitud
        console.log(filament);
        if (!filament.color) {
            return res.status(400).json({
                error: "El campo 'name' es obligatorio para actualizar el producto",
            });
        }

        // Buscar el producto por nombre y actualizarlo con los datos proporcionados
        const updateFilament = await Filament.findOneAndUpdate(
            { filament: color }, // Condición de búsqueda: producto con el nombre especificado
            filament, // Datos a actualizar (product contiene todos los campos nuevos)
            { new: true } // Opción: retorna el producto actualizado
        );

        // Si no se encuentra el producto
        if (!updateFilament) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Responder con el producto actualizado

        res.json({
            alert: "Filamento Actualizado exitosamente",
            status: "success",
            data: req.body.filament.color,
        });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({
            error: `Error al actualizar el producto: ${error.message}`,
            status: "failure",
            data: req.body.filament.color,
        });
    }
});

module.exports = router;
