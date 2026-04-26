const URL_API = "http://localhost:5000/api/generate";

export async function obtenerInforme(datos) {
    const respuesta = await axios.post(URL_API, datos, {
        timeout: 240000
    });
    return respuesta.data.report;
}

export async function descargarArchivo(datos) {
    const respuesta = await axios.post(URL_API, datos, {
        responseType: "blob",
        timeout: 240000
    });
    return respuesta.data;
}
