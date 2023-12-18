const info = require('./info')
class Recipes {
    #capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    #hasDairy(ingredients) {
        return ingredients.some(ing => info.DAIRY_INGREDIENTS.includes(ing.toLowerCase()))
    }
    #hasGluten(ingredients) {
        return ingredients.some(ing => info.GLUTEN_INGREDIENTS.includes(ing.toLowerCase()))
    }
    #vegeterian(category) {
        return !info.MEAT_INGREDIENTS.includes(category.toLowerCase())
    }
    #filterSensitivities(recipe, sensitivity) {
        for (const sen of sensitivity) {
            if((sen === 'vegeterian' && !this.#vegeterian(recipe.strCategory)) || (sen === 'gluten' && this.#hasGluten(recipe.ingredients)) || (sen === 'dairy' && this.#hasDairy(recipe.ingredients)))
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
        newRecipe['vegeterian'] = this.#vegeterian(recipe.strCategory)
        newRecipe['gluten'] = this.#hasGluten(recipe.ingredients)
        newRecipe['dairy'] = this.#hasDairy(recipe.ingredients)
        return newRecipe
    }

    filterRecipes(recipes, filterOptions, sensitivity) {
        const sensitivityFreeRecipes = recipes.filter(rec => this.#filterSensitivities(rec, sensitivity))
        const filteredRecipes = sensitivityFreeRecipes.map(rec => this.#filterRecipe(rec, filterOptions))
        return filteredRecipes
    }

}


module.exports={Recipes}