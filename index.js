const express = require("express")
const dotenv = require("dotenv").config()
const port = process.env.PORT || 5000
const app = express()
const path = require('path')

// Enable body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// Set a static folder
app.use(express.static(path.join(__dirname, 'public')))

app.use('/openai', require('./routes/openaiRoutes'))


app.listen(port, () => {
    console.log(`Server started on ${port}`)
})
