require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authenticateToken = require("./middlewares/authToken");

const app = express();

const PORT = process.env.PORT || 8080;

// app.use(cors());

app.use(
    cors({
        origin: "*", // Permitir cualquier origen
        methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
        allowedHeaders: ["Content-Type", "Authorization"], // Encabezados permitidos
    })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Conexión exitosa"))
    .catch((err) => console.error("Error al conectar", err));

const productsRoutes = require("./routes/products");
app.use("/apiStore/products", productsRoutes);

const categoryRoutes = require("./routes/categories");
app.use("/apiStore/categories", categoryRoutes);

const constData = require("./routes/constData");
app.use("/apiStore/constData", constData);

const user = require("./routes/users");
app.use("/apiStore/users", user);
//users
// app.use("/apiStore/users", authenticateToken, user);
//users

app.get("/", (req, res) => {
    res.send("¡Servidor Express funcionando!");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
