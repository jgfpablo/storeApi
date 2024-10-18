const mongoose = require("mongoose");

const AutoIncrement = require("mongoose-sequence")(mongoose);

const ProductSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    colores: { type: [String], required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true },
    imagenes: { type: [String], required: true },
});

ProductSchema.plugin(AutoIncrement, { inc_field: "productId" });

module.exports = mongoose.model("Product", ProductSchema);
