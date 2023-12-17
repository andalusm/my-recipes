const info = require('./info')
const express = require('express')
const router = express.Router()
const axios = require('axios');
const { inArray } = require('jquery');



class Recipes {
    #capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    #dairyFree(ingredients) {
        ingredients.forEach(ing=>{
            if(info.DAIRY_INGREDIENTS.includes(ing.toLowerCase()))
                return false
        })
        return true
    }
    #glutenFree(ingredients) {
        ingredients.forEach(ing=>{
            if(info.GLUTEN_INGREDIENTS.includes(ing.toLowerCase()))
                return false
        })
        return true
    }
    #vegeterian(category){
        return category === "Vegetarian"
    }
    #filterSensitivities(recipe, sensitivity) {
        sensitivity.forEach(sen => {
            if (sen === 'dairy' && !this.#dairyFree(recipe.ingredients))
                return false
            if (sen === 'gluten' && !this.#glutenFree(recipe.ingredients))
                return false
            if (sen === 'vegeterian' && !this.#vegeterian(recipe.strCategory))
                return false
        })
        return true
    }
    #removeDuplicates(ingredients){
        return Array.from(new Set(ingredients))
    }
    #capitalizeFirstLetterInSentence(str){
            const lowerCaseText = str.toLowerCase();
            const splitWords = lowerCaseText.split(' ');
            const capitalizeWords = splitWords.map(word=> this.#capitalizeFirstLetter(word))
            return capitalizeWords.join(' ')
    }


    #filterRecipe(recipe, filterOptions) {
        const newRecipe = {}
        filterOptions.forEach(fo => {
            if(recipe[fo] instanceof Array)
            {
                newRecipe[fo] = this.#removeDuplicates(newRecipe[fo])
                newRecipe[fo]= newRecipe[fo].map(e=>{ this.#capitalizeFirstLetterInSentence(e)})
            }

            else
                newRecipe[fo] = recipe[fo]
        })
        return newRecipe
    }

    filterRecipes(recipes, filterOptions, sensitivity) {
        const sensitivityFreeRecipes = recipes.filter(rec => this.#filterSensitivities(rec, sensitivity))
        const filteredRecipes = sensitivityFreeRecipes.map(rec=> this.#filterRecipe(rec, filterOptions))
        return filteredRecipes
    }

}

const Filter = new Recipes()






router.get('/', function (req, res) {
    res.end()
})

router.get('/recipes/:ingredient', function (req, res) {
    const ingredient = req.params.ingredient
    const dairy = req.query.dairy
    const gluten = req.query.gluten
    const vegeterian = req.query.vegeterian
    sensitivity = []
    if (gluten === 'true')
        sensitivity.push('gluten')
    if (dairy === 'true')
        sensitivity.push('dairy')
    if (vegeterian === 'true')
        sensitivity.push('vegeterian')
    const find_ingredient_url = info.INGREDIENT_URL + ingredient
    axios.get(find_ingredient_url)
        .then(function (response) {
            const recipes = response.data.results
            const filterOptions = ['idMeal', 'ingredients', 'title', 'thumbnail', 'href']
            const filteredRecipes = Filter.filterRecipes(recipes, filterOptions, sensitivity)
            console.log(filteredRecipes)
            res.json({ recipes: filteredRecipes })
        })
        .catch(function (error) {
            res.status(404)
        })

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