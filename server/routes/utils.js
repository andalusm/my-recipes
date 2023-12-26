const info = require('./info')
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
        return !info.MEAT_INGREDIENTS.includes(category.toLowerCase())
    }
    #filterSensitivities(recipe, sensitivity) {
        for (const sen of sensitivity) {
            if((sen === 'vegeterian' && !this.#vegeterian(recipe.strCategory)) || (sen === 'gluten' && this.#hasSensitivity(recipe.ingredients, info.GLUTEN_INGREDIENTS )) || (sen === 'dairy' && this.#hasSensitivity(recipe.ingredients, info.DAIRY_INGREDIENTS)))
                return false
        }
        return true
        // return !sensitivity.every(sen => ((sen === 'vegeterian' && !this.#vegeterian(recipe.strCategory)) || (sen === 'gluten' && this.#hasGluten(recipe.ingredients)) || (sen === 'dairy' && this.#hasDairy(recipe.ingredients))))

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

    }
    #addSensitivities(newRecipe, recipe){
        newRecipe['vegeterian'] = this.#vegeterian(recipe.strCategory)
        newRecipe['gluten'] = this.#hasSensitivity(recipe.ingredients, info.GLUTEN_INGREDIENTS)
        newRecipe['dairy'] = this.#hasSensitivity(recipe.ingredients, info.DAIRY_INGREDIENTS)
    }

    #addChefName(newRecipe){
        newRecipe['chef'] = faker.person.fullName()
    }
    #addRating(newRecipe){
        const rating = (Math.random() * 4 + 1).toFixed(1) 
        newRecipe['rating'] = rating
    }


    #filterRecipe(recipe, filterOptions) {
        const newRecipe = {}
        filterOptions.forEach(fo => {
            if (recipe[fo] instanceof Array) {
                newRecipe[fo] = this.#removeDuplicates(recipe[fo])
                newRecipe[fo] = newRecipe[fo].map(e => this.#capitalizeFirstLetterInSentence(e))
            }

            else
                newRecipe[fo] = recipe[fo]
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