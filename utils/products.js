const ConstDataModel = require("../models/constData");

async function calcularPrecio(products) {
    const constData = await ConstDataModel.findOne().sort({ _id: -1 });

    if (!constData) {
        throw new Error("No se encontró constData");
    }

    if (Array.isArray(products)) {
        for (let index = 0; index < products.length; index++) {
            if (products[index].precio == 0) {
                try {
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
                        Number(
                            calcularTiempo(
                                products[index].horas,
                                products[index].minutos
                            )
                        );

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

                    if (total < 200) {
                        total = 200;
                    } else {
                        total = redondear(total);
                    }

                    products[index].precio = total;
                } catch (error) {
                    throw error;
                }
            }
            //este else no sabria si es necesario
            else {
                return;
            }
        }
    } else {
        // Si products no es un array, calcular precio para un único producto
        // console.log("No es un array");
        if (products[index].precio == 0) {
            try {
                const KwH =
                    (Number(constData.consumoKw) / 1000 / 60) *
                    calcularTiempo(products.horas, products.minutos);
                const costoEnergia = KwH * constData.costokwH;
                const costoFilamento =
                    (Number(products.peso) * Number(constData.filamento)) /
                    1000;
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
                const merma =
                    (Number(products.peso) *
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
                products.precio = total;
            } catch (error) {
                console.error(error); // Loguear el error para diagnóstico
                throw error; // Lanzar el error para ser manejado más arriba si es necesario
            }
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
