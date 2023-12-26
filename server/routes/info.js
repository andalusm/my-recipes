const INGREDIENT_URL = "https://recipes-goodness-elevation.herokuapp.com/recipes/ingredient/"
const DAIRY_INGREDIENTS = ["cream", "cheese", "milk", "butter", "creme", "ricotta", "mozzarella", "custard", "cream cheese", "sour cream", "heavy cream"]
const GLUTEN_INGREDIENTS = ["flour", "bread", "spaghetti", "biscuits", "beer", "plain flour"]
const MEAT_INGREDIENTS = ["seafood", "beef", "chicken", "pork", "lamb"]
const FILTERED_LIST = ['idMeal', 'ingredients', 'title', 'thumbnail', 'href']
const RESTURANTS = {
    "Inna Di Morrows": ["52937", "52944"],
    "Belle Vie": ["52908", "52776", "52909", "52910"],
    "Osteria": ["52849", "52961", "52771", "52770"],
    "Flavor Fusion": ["52858", "52857", "52856", "52817", "52818"],
    "Chentro": ["52815", "52897", "52937"],
    "Zaki": ["52878", "52908", "52909"],
    "Kafroon": ["52776", "52972"],
    "Kalamata": ["52973", "52772"]

}


module.exports = { INGREDIENT_URL, DAIRY_INGREDIENTS, GLUTEN_INGREDIENTS, MEAT_INGREDIENTS, FILTERED_LIST, RESTURANTS }