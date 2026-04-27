const axios = require("axios")
const searchPapers = require("./searchService")

async function generateReport(topic, minPages, maxPages) {

    const papers = await searchPapers(topic)

    const papersContext = papers.length > 0
        ? papers.map((p, i) => `Fuente ${i + 1}: "${p.title}" (${p.authors}, ${p.year}). Resumen: ${p.abstract} URL: ${p.url}`).join("\n\n")
        : "No se encontraron fuentes externas. Escribe basándote en conocimiento académico verificado."

    const minWords = Math.floor(minPages * 400)
    const maxWords = Math.floor(maxPages * 500)

    const prompt = `
Actúa como un experto en redacción académica. Tu tarea es escribir un informe profesional sobre:

TEMA: ${topic}

CONTEXTO ACADÉMICO REAL (Debes basarte en esto y citar directamente estas fuentes):
${papersContext}

REQUISITOS DE EXTENSIÓN:
El informe debe tener entre ${minWords} y ${maxWords} palabras. Esto equivale aproximadamente a ${minPages}-${maxPages} páginas.
¡Muy importante! No te detengas pronto, desarrolla profundamente cada sección para cumplir con la extensión.

Formato:
INTRODUCCIÓN (Explicar importancia y objetivos)
MARCO TEÓRICO (Citar las fuentes del contexto académico proporcionado)
DESARROLLO (Análisis técnico detallado)
CONCLUSIONES (Resultados finales)
REFERENCIAS APA (Lista las fuentes del contexto anterior en formato APA)

Reglas:
1. No usar markdown (nada de **, ##, ---, etc).
2. No inventar referencias. Usa las proporcionadas arriba.
3. Usar texto plano formal y coherente.
4. Si el contexto es insuficiente, usa conocimiento académico verídico pero prioriza lo proporcionado.
`

    console.log(`Iniciando generación con Ollama (Llama 3) para "${topic}" (${minWords}-${maxWords} palabras)...`)

    try {

        const response = await axios.post(
            "http://localhost:11434/api/generate",
            {
                model: "llama3",
                prompt: prompt,
                stream: false
            },
            {
                timeout: 240000 // 4 minutos
            }
        )

        console.log(`Generación con Ollama concluida (${response.data.response.length} caracteres).`)

        return response.data.response

    } catch (error) {

        console.error("Error al contactar con Ollama:")
        console.error(error.message)

        if (error.code === "ECONNREFUSED") {
            throw new Error("Ollama no parece estar abierto. Por favor ábrelo en tu computadora.")
        }

        if (error.code === "ETIMEDOUT" || error.code === "ECONNABORTED") {
            throw new Error("Ollama está tardando demasiado. Prueba con menos hojas.")
        }

        throw error

    }

}

module.exports = generateReport