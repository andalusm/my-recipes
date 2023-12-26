const ingredient = require('./model/ingredient')
const express = require('express')
const utils = require('./utils')
const config = require('./config')
const errors = require('./errors')
const router = express.Router()




const IngredientFinder = new ingredient.Ingredient()
const RecipesController = new utils.RecipesController()

router.get('/:ingredient', function (req, res) {
    const ingredient = req.params.ingredient.toLowerCase()
    const dairy = req.query.dairyFree
    const gluten = req.query.glutenFree
    const vegeterian = req.query.vegeterian
    try {
        
        RecipesController.checkIngredient(ingredient)
        RecipesController.checkFiltersExist(vegeterian, dairy, gluten)
    } catch (error) {
        if (error instanceof errors.InvalidIngredientError) {
            return res.status(405).send({ "Error": "The ingredient has a number or a symbol in it." })
        }
        if (error instanceof errors.MissingParametersError) {
            return res.status(402).send({ "Error": "One or more of the optional parameters is missing." })
        }
    }
    try {
        IngredientFinder.getRecipe(ingredient, dairy, gluten, vegeterian)
            .then(function (response) {
                const recipes = response.data.results
                const filteredRecipes = RecipesController.filterRecipes(recipes, config.FILTERED_LIST, IngredientFinder.sensitivity)
                return res.status(201).json({ recipes: filteredRecipes })

            })
    } catch (error) {
        return res.status(404).end()

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