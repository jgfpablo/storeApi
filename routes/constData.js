const express = require("express");
const router = express.Router();
const ConstDataModel = require("../models/constData");
const authenticateToken = require("../middlewares/authToken");

router.post("/newConstData", authenticateToken, async (req, res) => {
    try {
        const constData = new ConstDataModel(req.body);
        await constData.save();
        res.status(201).json(constData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const constData = await ConstDataModel.find();
        res.json(constData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
