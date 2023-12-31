const config = require('./config')
const errors = require('./errors')
const APIkeys = require('./APIkeys')
const { faker } = require('@faker-js/faker');
const axios = require('axios');
class RecipesController {
    checkFiltersExist(vegeterian, dairy, gluten){
        if(!vegeterian || !dairy || !gluten){
            throw new errors.MissingParametersError()
        }
    }
    checkIngredient(ingredient){
        if(!ingredient.match(/^[a-z]+$/i)){
            throw new errors.InvalidIngredientError()
        }
    }


    #capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    #hasSensitivity(ingredients, sensitivity_ingredients) {
        return ingredients.some(ing => sensitivity_ingredients.includes(ing.toLowerCase()))
    }
    #vegeterian(category) {
        return !config.MEAT_INGREDIENTS.includes(category.toLowerCase())
    }
    #getResturants(id){
        const resturants = []
        for (const i of Object.keys(config.RESTURANTS)){
            if(config.RESTURANTS[i].includes(id)){
                resturants.push(i)
            }
        }
        return resturants
    }
    #turnResturantsToString(resturants){
        return resturants.toString()
    }
    #filterSensitivities(recipe, sensitivity) {
        for(const sen of sensitivity) {
            if((sen === 'vegeterian' && !this.#vegeterian(recipe.strCategory)) || (sen === 'gluten' && this.#hasSensitivity(recipe.ingredients, config.GLUTEN_INGREDIENTS )) || (sen === 'dairy' && this.#hasSensitivity(recipe.ingredients, config.DAIRY_INGREDIENTS)))
                return false
        }
        return true
    }
    #removeDuplicates(ingredients) {
        return Array.from(new Set(ingredients))
    }
    #capitalizeFirstLetterInSentence(str) {
        const lowerCaseText = str.toLowerCase();
        const splitWords = lowerCaseText.split(' ');
        const capitalizeWords = splitWords.map(word => this.#capitalizeFirstLetter(word))
        return capitalizeWords.join(' ')
    }
    #changeImageToGIF(recipe){
        const giphy_url = "http://api.giphy.com/v1/gifs/search?q=" + recipe['title'] + " Food&api_key=" + APIkeys.API_KEY + "&limit=1"
        return axios.get(giphy_url).then((data) => { 
            if(data.data.data[0]){
                recipe['gif'] = data.data.data[0].images.original.url
            }
            else{
                recipe['gif'] = recipe["thumbnail"]
            }
            return recipe
            
        })
        .catch((error)=>{
            recipe['gif'] = recipe["thumbnail"]
            return recipe
        })

    }

    #addFeatures(newRecipe, recipe){
        this.#addSensitivities(newRecipe,recipe)
        this.#addChefName(newRecipe)
        this.#addRating(newRecipe)
        this.#addResturants(newRecipe)
        return this.#changeImageToGIF(newRecipe)

    }
    #addResturants(recipe){
        const resturants = this.#getResturants(recipe.idMeal)
        if (resturants.length > 0 )
        {
            recipe['resturants'] = this.#turnResturantsToString(resturants)
        }
        else
        {
            recipe['resturants'] = "No resturants offers this recipe."
        }

    }
    #addSensitivities(newRecipe, recipe){
        newRecipe['vegeterian'] = this.#vegeterian(recipe.strCategory)
        newRecipe['gluten'] = this.#hasSensitivity(recipe.ingredients, config.GLUTEN_INGREDIENTS)
        newRecipe['dairy'] = this.#hasSensitivity(recipe.ingredients, config.DAIRY_INGREDIENTS)
    }

    #addChefName(newRecipe){
        newRecipe['chef'] = faker.person.fullName()
    }
    #addRating(newRecipe){
        const rating = (Math.random() * config.MAX_RATING + config.MIN_RATING).toFixed(1) 
        newRecipe['rating'] = rating
    }


    #filterRecipe(recipe, filterOptions) {
        let newRecipe = {}
        filterOptions.forEach(filterOption => {
            if (recipe[filterOption] instanceof Array) {
                newRecipe[filterOption] = this.#removeDuplicates(recipe[filterOption])
                newRecipe[filterOption] = newRecipe[filterOption].map(e => this.#capitalizeFirstLetterInSentence(e))
            }
            else
                newRecipe[filterOption] = recipe[filterOption]
        })
        return this.#addFeatures(newRecipe,recipe).then((recipe)=>{
            return newRecipe
        })
        
        
    }

    filterRecipes(recipes, filterOptions, sensitivity, page) {
        const sensitivityFreeRecipes = recipes.filter(rec => this.#filterSensitivities(rec, sensitivity))
        const length = sensitivityFreeRecipes.length
        const maxPage = Math.floor((sensitivityFreeRecipes.length)/5) +1
        const pageSensitivityFreeRecipes = sensitivityFreeRecipes.slice(page*config.MAX_RECIPES,(page+1)*config.MAX_RECIPES)
        return Promise.all( pageSensitivityFreeRecipes.map(rec => this.#filterRecipe(rec, filterOptions))).then((filteredRecipes)=>{
            return {filteredRecipes, length, maxPage}
        })
    }

}


module.exports={RecipesController: RecipesController}