const axios = require('axios');
const config = require('./config')


class Ingredient {
    constructor(){
        this.sensitivity = []
    }
    
    getRecipe(ingredient,dairy,gluten,vegeterian,page) {
        this.#fillSensitivity(dairy,gluten,vegeterian)
        const find_ingredient_url = config.INGREDIENT_URL + ingredient
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