const axios = require("axios")

async function searchPapers(topic) {
    try {
        const response = await axios.get(
            `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(topic)}&limit=5&fields=title,url,abstract,authors,year`,
            {
                timeout: 10000
            }
        )

        const papers = response.data.data || []

        return papers.map(p => ({
            title: p.title,
            year: p.year,
            authors: (p.authors || []).map(a => a.name).join(", "),
            url: p.url,
            abstract: p.abstract ? p.abstract.substring(0, 300) + "..." : "No disponible"
        }))

    } catch (error) {
        console.warn("Fallo al buscar referencias reales:", error.message)
        return []
    }
}

module.exports = searchPapers