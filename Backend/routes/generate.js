const express = require("express")
const router = express.Router()

const generateReport = require("../ai/generateReport")
const { createWord, createPDF } = require("../services/documentService")

router.post("/generate", async (req, res) => {

    try {

        const { topic, format, minPages, maxPages, reportText } = req.body

        let report = reportText

        if (!report) {
            console.log(`Petición recibida: ${topic} (${minPages}-${maxPages} páginas) usando Ollama 3`)
            report = await generateReport(topic, minPages, maxPages)
            console.log(`Informe generado correctamente (${report.length} caracteres)`)
        } else {
            console.log(`Exportando informe existente (${report.length} caracteres) a ${format}...`)
        }

        if (format === "word") {
            const file = await createWord(report)
            return res.download(file)
        }

        if (format === "pdf") {
            const file = await createPDF(report)
            return res.download(file)
        }

        res.json({ report })

    } catch (error) {

        console.error("Error en /generate:")
        console.error(error)

        res.status(500).json({
            error: "Error generando informe",
            details: error.message
        })

    }

})

module.exports = router