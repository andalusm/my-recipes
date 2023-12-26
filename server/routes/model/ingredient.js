const axios = require('axios');
const info = require('../info')


class Ingredient {
    constructor(){
        this.sensitivity = []
    }
    
    getRecipe(ingredient,dairy,gluten,vegeterian) {
        this.#fillSensitivity(dairy,gluten,vegeterian)
        const find_ingredient_url = info.INGREDIENT_URL + ingredient
        return axios.get(find_ingredient_url)
            
    }
    #addSensitivity(sensitivity, sensitivityName){
        if (sensitivity === 'true')
            this.sensitivity.push(sensitivityName)
    }
    #fillSensitivity(dairy,gluten,vegeterian){
        this.sensitivity = []
        this.#addSensitivity(gluten, 'gluten')
        this.#addSensitivity(dairy, 'dairy')
        this.#addSensitivity(vegeterian, 'vegeterian')
    }
}

module.exports={Ingredient}