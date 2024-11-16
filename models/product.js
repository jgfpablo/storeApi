const mongoose = require("mongoose");

const AutoIncrement = require("mongoose-sequence")(mongoose);

const ProductSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    colores: { type: [String], required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true },
    imagenes: { type: [String], required: true },
    peso: { type: [Number], required: true },
    horas: { type: [Number], required: true },
    minutos: { type: [Number], required: true },
    // --
    alto: { type: [String], required: true },
    ancho: { type: [String], required: true },
    grosor: { type: [String], required: true },
    material: { type: [String], required: true },
    multiplicador: { type: Number, required: true },
});

ProductSchema.plugin(AutoIncrement, { inc_field: "productId" });

module.exports = mongoose.model("Product", ProductSchema);
