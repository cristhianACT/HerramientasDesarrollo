const { Document, Packer, Paragraph } = require("docx")
const PDFDocument = require("pdfkit")
const fs = require("fs")

async function createWord(report) {

    const doc = new Document({
        sections: [
            {
                children: report.split("\n").map(
                    line => new Paragraph(line)
                )
            }
        ]
    })

    const buffer = await Packer.toBuffer(doc)

    const file = "informe.docx"

    fs.writeFileSync(file, buffer)

    return file
}

function createPDF(report) {

    return new Promise((resolve, reject) => {

        const file = "informe.pdf"

        const doc = new PDFDocument()

        const stream = fs.createWriteStream(file)

        doc.pipe(stream)

        doc.fontSize(12).text(report, { align: "justify" })

        doc.end()

        stream.on("finish", () => {
            resolve(file)
        })

        stream.on("error", (err) => {
            reject(err)
        })

    })

}

module.exports = {
    createWord,
    createPDF
}