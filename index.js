require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Conexión exitosa"))
    .catch((err) => console.error("Error al conectar", err));

const productsRoutes = require("./routes/products");
app.use("/apiStore/products", productsRoutes);

const categoryRoutes = require("./routes/categories");
app.use("/apiStore/categories", categoryRoutes);

app.get("/", (req, res) => {
    res.send("¡Servidor Express funcionando!");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
