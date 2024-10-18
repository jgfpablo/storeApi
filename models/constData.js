const mongoose = require("mongoose");

const constDataSchema = new mongoose.Schema({
    consumoKw: { type: Number, required: true },
    costImpr: { type: Number, required: true },
    vidaUtil: { type: Number, required: true },
    costokwH: { type: Number, required: true },
    costoTiempoHombre: { type: Number, required: true },
    merma: { type: Number, required: true },
    riesgo: { type: Number, required: true },
    ganan: { type: Number, required: true },
    filamento: { type: Number, required: true },
});

module.exports = mongoose.model("constData", constDataSchema);
