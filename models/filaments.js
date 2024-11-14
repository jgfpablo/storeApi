const mongoose = require("mongoose");

const AutoIncrement = require("mongoose-sequence")(mongoose);

const FilamentSchema = new mongoose.Schema({
    color: { type: String, required: true },
    imagenes: { type: [String], required: true },
});

FilamentSchema.plugin(AutoIncrement, { inc_field: "FilamentId" });

module.exports = mongoose.model("Filament", FilamentSchema);
