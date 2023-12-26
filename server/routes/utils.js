const config = require('./config')
const errors = require('./errors')
const { faker } = require('@faker-js/faker');
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

    #addFeatures(newRecipe, recipe){
        this.#addSensitivities(newRecipe,recipe)
        this.#addChefName(newRecipe)
        this.#addRating(newRecipe)
        this.#addResturants(newRecipe)

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
        const newRecipe = {}
        filterOptions.forEach(filterOption => {
            if (recipe[filterOption] instanceof Array) {
                newRecipe[filterOption] = this.#removeDuplicates(recipe[filterOption])
                newRecipe[filterOption] = newRecipe[filterOption].map(e => this.#capitalizeFirstLetterInSentence(e))
            }
            else
                newRecipe[filterOption] = recipe[filterOption]
        })
        this.#addFeatures(newRecipe,recipe)
        return newRecipe
    }

    filterRecipes(recipes, filterOptions, sensitivity) {
        const sensitivityFreeRecipes = recipes.filter(rec => this.#filterSensitivities(rec, sensitivity))
        const filteredRecipes = sensitivityFreeRecipes.map(rec => this.#filterRecipe(rec, filterOptions))
        return filteredRecipes
    }

}


module.exports={RecipesController: RecipesController}