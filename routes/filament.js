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

module.exports = router;
