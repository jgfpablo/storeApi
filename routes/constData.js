const express = require("express");
const router = express.Router();
const ConstDataModel = require("../models/constData");

router.post("/newConstData", async (req, res) => {
    try {
        const constData = new constDataModel(req.body);
        await constData.save();
        res.status(201).json(constData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const constData = await constDataModel.find();
        res.json(constData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
