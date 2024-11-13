const ConstDataModel = require("../models/constData"); // Importar tu modelo ConstData

async function calcularPrecio(products) {
    // Obtener el último registro de ConstDataModel
    const constData = await ConstDataModel.findOne().sort({ _id: -1 }); // Esperar el último documento

    if (!constData) {
        throw new Error("No se encontró constData");
    }

    // console.log(constData + "const datovich");
    // console.log(products + "products");

    if (Array.isArray(products)) {
        for (let index = 0; index < products.length; index++) {
            try {
                // Realizar los cálculos basados en los datos obtenidos
                const KwH =
                    (Number(constData.consumoKw) / 1000 / 60) *
                    calcularTiempo(
                        products[index].horas,
                        products[index].minutos
                    );
                // console.log(KwH + "kwh");
                const costoEnergia = KwH * constData.costokwH;
                // console.log(costoEnergia + "costoEnergia");

                const costoFilamento =
                    (Number(products[index].peso) *
                        Number(constData.filamento)) /
                    1000;
                // console.log(costoFilamento + "costoFilamento");

                const depreciacion =
                    (Number(constData.costImpr) /
                        Number(constData.vidaUtil) /
                        60) *
                    Number(
                        calcularTiempo(
                            products[index].horas,
                            products[index].minutos
                        )
                    );
                // console.log(depreciacion + "depreciacion");

                const merma =
                    (Number(products[index].peso) *
                        (Number(constData.merma) / 100) *
                        Number(constData.filamento)) /
                    1000;

                // console.log(merma + "merma");

                const ganancia =
                    (costoEnergia + costoFilamento + depreciacion + merma) *
                    (constData.ganan / 100);
                // console.log(ganancia + "ganancia");

                const gastos =
                    costoEnergia + costoFilamento + depreciacion + merma;
                // console.log(gastos + "gastos");

                let total = gastos + ganancia;

                // console.log("el gastos es  " + gastos);

                // Asegurar que el precio no sea menor que 200
                if (total < 200) {
                    total = 200;
                } else {
                    total = redondear(total); // Redondear al múltiplo de 50 más cercano
                }

                // Asignar el precio al producto
                products[index].precio = total;
            } catch (error) {
                // console.error(error); // Loguear el error para diagnóstico
                throw error; // Lanzar el error para ser manejado más arriba si es necesario
            }
        }
    } else {
        // Si products no es un array, calcular precio para un único producto
        // console.log("No es un array");

        try {
            const KwH =
                (Number(constData.consumoKw) / 1000 / 60) *
                calcularTiempo(products.horas, products.minutos);
            const costoEnergia = KwH * constData.costokwH;
            const costoFilamento =
                (Number(products.peso) * Number(constData.filamento)) / 1000;
            const depreciacion =
                (Number(constData.costImpr) / Number(constData.vidaUtil) / 60) *
                Number(
                    calcularTiempo(
                        products[index].horas,
                        products[index].minutos
                    )
                );
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
            products.precio = total;
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
