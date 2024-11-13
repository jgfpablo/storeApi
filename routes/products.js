const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const authenticateToken = require("../middlewares/authToken");
const { calcularPrecio } = require("../utils/products");

//Funcion anadir producto
router.post("/product", authenticateToken, async (req, res) => {
    try {
        const existingUser = await Product.findOne({ nombre: req.body.nombre });
        if (existingUser) {
            return res.status(409).json({ error: "El producto ya existe" });
        }
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: req.body });
        error.message;
    }
});

//all products
router.get("/", async (req, res) => {
    console.log("soy all products");
    try {
        const products = await Product.find();
        const productosConPrecios = await calcularPrecio(products);
        res.json(productosConPrecios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//product by name
router.get("/name", async (req, res) => {
    console.log("product by name");

    const name = req.query.name;
    try {
        const products = await Product.find({ nombre: name });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//productos paginados
router.get("/search", async (req, res) => {
    console.log("product by search");

    const name = req.query.name;
    const start = parseInt(req.query.start) || 0; //indice
    const limit = parseInt(req.query.limit) || 1; //limit
    try {
        const products = await Product.find({
            nombre: { $regex: name, $options: "i" },
        })
            .skip(start)
            .limit(limit);

        // const totalProducts = await Product.countDocuments({
        //     nombre: { $regex: name, $options: "i" },
        // })
        //     .skip(start)
        //     .limit(limit);

        const productosConPrecios = await calcularPrecio(totalProducts);

        res.json({
            message: "Productos paginados",
            status: "success",
            total: totalProducts, // Número total de productos
            data: productosConPrecios, // Productos paginados
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/paginate", async (req, res) => {
    console.log("product by paginate");

    const start = parseInt(req.query.start) || 0; //indice
    const limit = parseInt(req.query.limit) || 1; //limit
    const category = req.query.category;

    if (category) {
        try {
            const products = await Product.find({ categoria: category })
                .skip(start)
                .limit(limit);

            const totalProducts = await Product.countDocuments({
                categoria: category, // Asegúrate de que el campo se llame 'categoria'
            });

            const productosConPrecios = await calcularPrecio(products);

            res.json({
                message: "Productos paginados",
                status: "success",
                total: totalProducts, // Número total de productos
                data: productosConPrecios, // Productos paginados
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        try {
            const products = await Product.find().skip(start).limit(limit);

            const totalProducts = await Product.countDocuments();

            const productosConPrecios = await calcularPrecio(products);

            res.json({
                message: "Productos paginados",
                status: "success",
                total: totalProducts, // Número total de productos
                data: productosConPrecios, // Productos paginados
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
});

router.post("/delete", authenticateToken, async (req, res) => {
    const nombre = req.body;
    try {
        const { nombre } = req.body;
        const deletedCategory = await product.findOneAndDelete({
            nombre,
        });

        if (!deletedCategory) {
            return res.status(404).json({ alert: "Producto no encontrado" });
        }

        res.status(200).json({ alert: "Producto eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: `error` });
    }
});

module.exports = router;
