// function calcularPrecio() {

//     const constData = await ConstDataModel.find();
//         res.json(constData);

//      const KwH =
//        (Number(this.dataConst![this.lengthDC]?.consumoKw) / 1000 / 60) *
//        Number(this.tiempo);

//      const costoEnergia = KwH * this.dataConst![this.lengthDC]?.costokwH!;

//      const costoFilamento =
//        (Number(this.peso) * Number(this.dataConst![this.lengthDC]?.filamento)) /
//        1000;
//      const depreciacion =
//        (Number(this.dataConst![this.lengthDC]?.costImpr) /
//          Number(this.dataConst![this.lengthDC]?.vidaUtil) /
//          60) *
//        Number(this.tiempo);
//      const merma =
//        (Number(this.peso) *
//          (Number(this.dataConst![this.lengthDC]?.merma) / 100) *
//          Number(this.dataConst![this.lengthDC]?.filamento)) /
//        1000;
//      const ganancia =
//        (costoEnergia + costoFilamento + depreciacion + merma) *
//        (this.dataConst![this.lengthDC]?.ganan! / 100);
//      const gastos = costoEnergia + costoFilamento + depreciacion + merma;

//      let total = gastos + ganancia;

//      if (total < 200) {
//        return (this.product.precio = 200);
//      } else {
//        return (this.product.precio = this.redondear(total));
//      }
//    }

// calcularPrecio.js (Archivo util)
const ConstDataModel = require("../models/constData"); // Importar tu modelo ConstData
const product = require("../models/product");

async function calcularPrecio(products) {
    if (Array.isArray(products)) {
        for (let index = 0; index < products.length; index++) {
            try {
                // Obtener el último registro de ConstDataModel
                const constData = await ConstDataModel.findOne().sort({
                    _id: -1,
                }); // Obtener el último documento

                if (!constData) {
                    throw new Error("No se encontró constData");
                }

                // Realizar los cálculos basados en los datos obtenidos
                const KwH =
                    (Number(constData.consumoKw) / 1000 / 60) *
                    calcularTiempo(
                        products[index].horas,
                        products[index].minutos
                    );
                const costoEnergia = KwH * constData.costokwH;
                const costoFilamento =
                    (Number(products[index].peso) *
                        Number(constData.filamento)) /
                    1000;
                const depreciacion =
                    (Number(constData.costImpr) /
                        Number(constData.vidaUtil) /
                        60) *
                    Number(products[index].tiempo);
                const merma =
                    (Number(products[index].peso) *
                        (Number(constData.merma) / 100) *
                        Number(constData.filamento)) /
                    1000;
                const ganancia =
                    (costoEnergia + costoFilamento + depreciacion + merma) *
                    (constData.ganan / 100);
                const gastos =
                    costoEnergia + costoFilamento + depreciacion + merma;

                let total = gastos + ganancia;

                // Asegurar que el precio no sea menor que 200
                if (total < 200) {
                    total = 200;
                } else {
                    total = redondear(total); // Redondear al múltiplo de 50 más cercano
                }

                // Asignar el precio al producto
                products[index].precio = total;
            } catch (error) {
                console.error(error); // Loguear el error para diagnóstico
                throw error; // Lanzar el error para ser manejado más arriba si es necesario
            }
        }
    } else {
        try {
            // Obtener el último registro de ConstDataModel
            const constData = await ConstDataModel.findOne().sort({
                _id: -1,
            }); // Obtener el último documento

            if (!constData) {
                throw new Error("No se encontró constData");
            }

            // Realizar los cálculos basados en los datos obtenidos
            const KwH =
                (Number(constData.consumoKw) / 1000 / 60) *
                calcularTiempo(products.horas, products.minutos);
            const costoEnergia = KwH * constData.costokwH;
            const costoFilamento =
                (Number(products.peso) * Number(constData.filamento)) / 1000;
            const depreciacion =
                (Number(constData.costImpr) / Number(constData.vidaUtil) / 60) *
                Number(products.tiempo);
            const merma =
                (Number(products.peso) *
                    (Number(constData.merma) / 100) *
                    Number(constData.filamento)) /
                1000;
            const ganancia =
                (costoEnergia + costoFilamento + depreciacion + merma) *
                (constData.ganan / 100);
            const gastos = costoEnergia + costoFilamento + depreciacion + merma;

            let total = gastos + ganancia;

            // Asegurar que el precio no sea menor que 200
            if (total < 200) {
                total = 200;
            } else {
                total = redondear(total); // Redondear al múltiplo de 50 más cercano
            }

            // Asignar el precio al producto
            product[i].precio = total;
            console.log("el total es :" + total);
        } catch (error) {
            console.error(error); // Loguear el error para diagnóstico
            throw error; // Lanzar el error para ser manejado más arriba si es necesario
        }
    }

    return products; // Retornar los productos con los precios calculados
}

// Función para redondear el precio al múltiplo de 50 más cercano
function redondear(numero) {
    const redondeo50 = Math.ceil(numero / 50) * 50;
    return redondeo50 % 100 === 0 ? redondeo50 : redondeo50;
}

// Función para calcular el tiempo total en minutos
function calcularTiempo(horas, minutos) {
    return Number(horas) * 60 + Number(minutos);
}

// Exportar la función para su reutilización
module.exports = { calcularPrecio };
