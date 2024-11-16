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
    try {
        // Obtener el filamento desde el cuerpo de la solicitud
        const { filament } = req.body;

        if (!filament || !filament.color) {
            return res.status(400).json({
                error: "El campo 'color' es obligatorio para actualizar el filamento",
            });
        }

        // Buscar el filamento por su color y actualizarlo
        const updatedFilament = await Filament.findOneAndUpdate(
            { color: filament.color }, // Condición de búsqueda correcta
            filament, // Datos a actualizar
            { new: true } // Retorna el filamento actualizado
        );

        // Si no se encuentra el filamento
        if (!updatedFilament) {
            return res.status(404).json({
                error: "Filamento no encontrado",
            });
        }

        // Responder con el filamento actualizado
        res.json({
            alert: "Filamento actualizado exitosamente",
            status: "success",
            data: updatedFilament,
        });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({
            error: `Error al actualizar el filamento: ${error.message}`,
            status: "failure",
        });
    }
});

module.exports = router;
