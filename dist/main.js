
const renderer = new Renderer()

const searchIngredient = function(){
    const ingredient = ingredientInput.val()
    if(!ingredient){
        return
    }
    const dairy = dairyCheckBox.prop('checked');
    const gluten = glutenCheckBox.prop('checked');
    const vegeterian = vegeterianCheckBox.prop('checked');
    $.get(`/recipes/${ingredient}?dairy=${dairy}&gluten=${gluten}&vegeterian=${vegeterian}`, function (recipes) {
        console.log(recipes)
        renderer.renderRecipes(recipes)        
    })
}

$("#recipes-container").on("click","img",function(){
    const ingredient = $($(this).siblings("ul").children()[0]).text()
    alert(ingredient)
})
