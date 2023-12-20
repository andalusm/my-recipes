const express = require('express')
const path = require('path')
const app = express()
const recipesAPI = require('./server/routes/recipesAPI')

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/recipes', recipesAPI)




const port = 2020 
app.listen(port, function () {
    console.log(`Server running on ${port}`)
})