const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const authenticateToken = require("../middlewares/authToken");
const { calcularPrecio } = require("../utils/products");
const product = require("../models/product");

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
        const productosConPrecios = await calcularPrecio(products);

        res.json(productosConPrecios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//productos paginados
router.get("/search", async (req, res) => {
    // console.log("product by search name" + req.query.name);

    //fijate el tipo de dato que recibe en search

    const name = req.query.name;
    const start = parseInt(req.query.start) || 0; //indice
    const limit = parseInt(req.query.limit) || 1; //limit
    try {
        const products = await Product.find({
            nombre: { $regex: name, $options: "i" },
        })
            .skip(start)
            .limit(limit);

        const totalProducts = await Product.countDocuments({
            nombre: { $regex: name, $options: "i" },
        })
            .skip(start)
            .limit(limit);

        //  console.log(products);

        const productosConPrecios = await calcularPrecio(products);

        console.log(productosConPrecios);

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

// router.post("/delete", authenticateToken, async (req, res) => {
//     try {
//         const { nombre } = req.body;
//         const deleteProduct = await product.findOneAndDelete({
//             nombre,
//         });

//         if (!deleteProduct) {
//             return res.status(404).json({ alert: "Producto no encontrado" });
//         }

//         res.status(200).json({ alert: "Producto eliminado exitosamente" });
//     } catch (error) {
//         res.status(500).json({ error: ` error nombre : ${nombre}` });
//     }
// });

router.post("/delete", authenticateToken, async (req, res) => {
    try {
        const { nombre } = req.body;

        const deleteProduct = await product.findOneAndDelete({
            nombre,
        });

        if (!deleteProduct) {
            return res.status(404).json({ alert: "Producto no encontrado" });
        }

        res.status(200).json({ alert: "Producto eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.put("/updateProduct", authenticateToken, async (req, res) => {
    try {
        // Obtener el nombre y los datos del producto desde el cuerpo de la solicitud
        const { name, product } = req.body; // Desestructurar el 'name' y 'product' del cuerpo de la solicitud

        if (!name) {
            return res.status(400).json({
                error: "El campo 'name' es obligatorio para actualizar el producto",
            });
        }

        // Buscar el producto por nombre y actualizarlo con los datos proporcionados
        const updatedProduct = await Product.findOneAndUpdate(
            { nombre: name }, // Condición de búsqueda: producto con el nombre especificado
            product, // Datos a actualizar (product contiene todos los campos nuevos)
            { new: true } // Opción: retorna el producto actualizado
        );

        // Si no se encuentra el producto
        if (!updatedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Responder con el producto actualizado

        res.json({
            alert: "Producto Actualizado exitosamente",
            status: "success",
            data: updatedProduct, // Productos paginados
        });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({
            error: `Error al actualizar el producto: ${error.message}`,
        });
    }
});

module.exports = router;
