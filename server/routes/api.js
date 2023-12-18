const ingredient = require('./model/ingredient')
const express = require('express')
const utils = require('./utils')
const info = require('./info')
const router = express.Router()




const IngredientFinder = new ingredient.Ingredient()
const Filter = new utils.Recipes()

router.get('/', function (req, res) {
    res.end()
})
router.get('/recipes/:ingredient', function (req, res) {
    const ingredient = req.params.ingredient
    const dairy = req.query.dairy
    const gluten = req.query.gluten
    const vegeterian = req.query.vegeterian
    try {
        IngredientFinder.getRecipe(ingredient, dairy, gluten, vegeterian)
            .then(function (response) {
                const recipes = response.data.results
                const filteredRecipes = Filter.filterRecipes(recipes, info.FILTERED_LIST, IngredientFinder.sensitivity)
                res.json({ recipes: filteredRecipes })
            })
    } catch (error) {
        res.status(404).end()
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