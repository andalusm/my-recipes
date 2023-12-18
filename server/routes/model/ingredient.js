const axios = require('axios');
const info = require('../info')


class Ingredient {
    constructor(){
        this.sensitivity = []
    }
    
    getRecipe(ingredient,dairy,gluten,vegeterian) {
        this.fillSensitivity(dairy,gluten,vegeterian)
        const find_ingredient_url = info.INGREDIENT_URL + ingredient
        return axios.get(find_ingredient_url)
            
    }
    fillSensitivity(dairy,gluten,vegeterian){
        this.sensitivity = []
        if (gluten === 'true')
            this.sensitivity.push('gluten')
        if (dairy === 'true')
        this.sensitivity.push('dairy')
        if (vegeterian === 'true')
        this.sensitivity.push('vegeterian')
    }
}

module.exports={Ingredient}