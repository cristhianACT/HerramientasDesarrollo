
export const elementos = {
    inputTema: document.getElementById('topic'),
    selectProveedor: document.getElementById('provider'),
    inputPaginasMin: document.getElementById('minPages'),
    inputPaginasMax: document.getElementById('maxPages'),
    botonGenerar: document.getElementById('generateBtn'),
    textoBoton: document.querySelector('#generateBtn .btn-text'),
    cargador: document.querySelector('#generateBtn .loader'),
    infoEstado: document.getElementById('statusInfo'),
    estadoProveedor: document.getElementById('providerStatus'),
    seccionResultado: document.getElementById('resultSection'),
    contenidoInforme: document.getElementById('reportContent'),
    botonDescargarWord: document.getElementById('downloadWord'),
    botonDescargarPdf: document.getElementById('downloadPdf')
};

export function establecerCargando(cargando) {
    const { botonGenerar, textoBoton, cargador, infoEstado, seccionResultado, estadoProveedor } = elementos;

    if (cargando) {
        botonGenerar.disabled = true;
        textoBoton.textContent = "Generando...";
        cargador.classList.remove('hidden');
        infoEstado.classList.remove('hidden');
        seccionResultado.classList.add('hidden');
        estadoProveedor.textContent = "Ollama es local, esto puede tardar de 1 a 4 minutos.";
    } else {
        botonGenerar.disabled = false;
        textoBoton.textContent = "Generar Informe";
        cargador.classList.add('hidden');
        infoEstado.classList.add('hidden');
    }
}

export function mostrarInforme(informe) {
    const { contenidoInforme, seccionResultado } = elementos;
    contenidoInforme.textContent = informe;
    seccionResultado.classList.remove('hidden');
    seccionResultado.scrollIntoView({ behavior: 'smooth' });
}

export function obtenerDatosFormulario() {
    return {
        topic: elementos.inputTema.value.trim(),
        minPages: elementos.inputPaginasMin.value,
        maxPages: elementos.inputPaginasMax.value,
        provider: elementos.selectProveedor.value
    };
}
