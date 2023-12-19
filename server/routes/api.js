const ingredient = require('./model/ingredient')
const express = require('express')
const utils = require('./utils')
const info = require('./info')
const router = express.Router()




const IngredientFinder = new ingredient.Ingredient()
const Filter = new utils.Recipes()

// router.get('/', function (req, res) {
//     res.end()
// })
router.get('/recipes/:ingredient', function (req, res) {
    const ingredient = req.params.ingredient.toLowerCase()
    const dairy = req.query.dairyFree
    const gluten = req.query.glutenFree
    const vegeterian = req.query.vegeterian
    if (!ingredient.match(/^[a-z]+$/i)) {
        res.status(405).send({ "Error": "The ingredient has a number or a symbol in it." })
        return;
    }
    if (!vegeterian || !dairy || !vegeterian) {
        res.status(402).send({ "Error": "One or more of the optional parameters is missing." })
        return;
    }
    try {
        IngredientFinder.getRecipe(ingredient, dairy, gluten, vegeterian)
            .then(function (response) {
                const recipes = response.data.results
                const filteredRecipes = Filter.filterRecipes(recipes, info.FILTERED_LIST, IngredientFinder.sensitivity)
                res.status(201).json({ recipes: filteredRecipes })
                return;
            })
    } catch (error) {
        res.status(404).end()
        return
    }

})
// router.post('/wonder', function (req, res) {
//     console.log("Someone's trying to make a post request")
//     wonders.push({ ...req.body, visited: false })
//     res.send("Added wonder")
// })
// router.put('/wonder/:name', function (req, res) {
//     let wonderName = (req.params.name).split("-")[0].trim()
//     let wonderVisited = wonders.find(w => w.name === wonderName)
//     wonderVisited.visited = true
//     res.send("Updated wonder")
// })

// router.delete('/wonder/:name', function (req, res) {
//     let wonderName = (req.params.name).split("-")[0].trim()
//     let wonderIndex = wonders.findIndex(w => w.name === wonderName)
//     wonders.splice(wonderIndex, 1)
//     res.send("Deleted a wonder")
// })

module.exports = router