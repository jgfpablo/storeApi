const mongoose = require("mongoose");

const AutoIncrement = require("mongoose-sequence")(mongoose);

const FilamentSchema = new mongoose.Schema({
    color: { type: String, required: true },
    // marca: { type: String, required: true }, // de momento no voy a guardar la marca hasta tener una mejor idea de como utilizar el campo
    imagenes: { type: [String], required: true },
});

FilamentSchema.plugin(AutoIncrement, { inc_field: "FilamentId" });

module.exports = mongoose.model("Filament", FilamentSchema);
