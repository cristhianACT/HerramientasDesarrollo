require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const generateRoute = require("./routes/generate")

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use("/api", generateRoute)

const PORT = 5000

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT)
})