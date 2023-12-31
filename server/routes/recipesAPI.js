const ingredient = require('./model/ingredient')
const express = require('express')
const utils = require('./model/utils')
const config = require('./model/config')
const errors = require('./model/errors')
const router = express.Router()




const IngredientFinder = new ingredient.Ingredient()
const RecipesController = new utils.RecipesController()

router.get('/:ingredient', function (req, res) {
    const ingredient = req.params.ingredient.toLowerCase()
    const dairy = req.query.dairyFree
    const gluten = req.query.glutenFree
    const vegeterian = req.query.vegeterian
    let page = req.query.page
    if (page !== undefined){
        page = Number(page)
    }
    else{
        page = 0
    }
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
        IngredientFinder.getRecipe(ingredient, dairy, gluten, vegeterian,page)
            .then(function (response) {
                const recipes = response.data.results
                RecipesController.filterRecipes(recipes, config.FILTERED_LIST, IngredientFinder.sensitivity,page).then((recipes)=>{
                    return res.status(201).json({ recipes: recipes.filteredRecipes,recipesNum: recipes.length, maxPage:recipes.maxPage })
                })
                

            })
    } catch (error) {
        return res.status(500).send({ "Error": "Api server is disconnected." })

    }

})

module.exports = router