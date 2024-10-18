const mongoose = require("mongoose");

const AutoIncrement = require("mongoose-sequence")(mongoose);

const CategorySchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    imagenes: { type: [String], required: true },
});

CategorySchema.plugin(AutoIncrement, { inc_field: "categoryId" });

module.exports = mongoose.model("Category", CategorySchema);
