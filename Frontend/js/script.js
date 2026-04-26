import { obtenerInforme, descargarArchivo } from './api.js';
import { elementos, establecerCargando, mostrarInforme, obtenerDatosFormulario } from './ui.js';

let informeActual = "";

async function manejarGeneracion() {
    const datos = obtenerDatosFormulario();

    if (!datos.topic) {
        alert("Por favor escribe un tema");
        elementos.inputTema.focus();
        return;
    }

    establecerCargando(true);
    informeActual = "";

    try {
        informeActual = await obtenerInforme(datos);
        mostrarInforme(informeActual);
    } catch (error) {
        console.error(error);
        const detalles = error.respuesta?.data?.details || "";
        const mensaje = detalles
            ? `Error: ${detalles}`
            : "No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo y Ollama esté abierto.";
        alert(mensaje);
    } finally {
        establecerCargando(false);
    }
}

async function manejarExportacion(formato) {
    if (!informeActual) return;

    const datos = {
        ...obtenerDatosFormulario(),
        format: formato,
        reportText: informeActual
    };

    try {
        const datosArchivo = await descargarArchivo(datos);
        const blob = new Blob([datosArchivo]);
        const url = window.URL.createObjectURL(blob);
        const enlace = document.createElement("a");
        enlace.href = url;
        enlace.download = `informe.${formato === 'word' ? 'docx' : 'pdf'}`;
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error(error);
        alert("Error al descargar el archivo.");
    }
}

elementos.botonGenerar.addEventListener('click', manejarGeneracion);
elementos.botonDescargarWord.addEventListener('click', () => manejarExportacion("word"));
elementos.botonDescargarPdf.addEventListener('click', () => manejarExportacion("pdf"));
elementos.inputTema.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') manejarGeneracion();
});
