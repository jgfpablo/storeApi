const express = require("express");
const router = express.Router();
const Filament = require("../models/filament");
const authenticateToken = require("../middlewares/authToken");

router.post("/filament", authenticateToken, async (req, res) => {
    try {
        const existingUser = await Filament.findOne({
            nombre: req.body.nombre,
        });
        if (existingUser) {
            return res.status(409).json({ error: "El filamento ya existe" });
        }

        const filament = new Filament(req.body);
        await filament.save();
        res.status(201).json(filament);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/delete", authenticateToken, async (req, res) => {
    const nombre = req.body; // Suponiendo que envías el id de la categoría a eliminar en el cuerpo de la solicitud

    try {
        // Busca y elimina la categoría
        const { nombre } = req.body;
        const deletedFilament = await Filament.findOneAndDelete({
            nombre,
        });

        if (!deletedFilament) {
            // Categoría no encontrada
            return res.status(404).json({ alert: nombre });
        }

        // Aquí puedes agregar lógica adicional si necesitas manejar productos huérfanos
        // Por ejemplo, podrías eliminar productos asociados a esta categoría:
        // await Product.deleteMany({ categoria: id });

        res.status(200).json({ alert: "Filamento eliminado exitosamente" });
    } catch (error) {
        // error.message
        res.status(500).json({ error: `el error esta ak ${nombre}` });
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

module.exports = router;
