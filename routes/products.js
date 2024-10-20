const express = require("express");
const router = express.Router();
const Product = require("../models/product");

router.post("/product", async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/name", async (req, res) => {
    const name = req.query.name;
    try {
        const products = await Product.find({ nombre: name });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/paginate", async (req, res) => {
    const start = parseInt(req.query.start) || 0; //indice
    const limit = parseInt(req.query.limit) || 1; //limit
    const category = req.query.category;

    if (category) {
        try {
            const products = await Product.find({ categoria: category })
                .skip(start)
                .limit(limit);

            const totalProducts = await Product.countDocuments();

            res.json({
                message: "Productos paginados",
                status: "success",
                total: totalProducts, // Número total de productos
                data: products, // Productos paginados
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        try {
            const products = await Product.find().skip(start).limit(limit);

            const totalProducts = await Product.countDocuments();

            res.json({
                message: "Productos paginados",
                status: "success",
                total: totalProducts, // Número total de productos
                data: products, // Productos paginados
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;
