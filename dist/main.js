

const renderer = new Renderer()

const searchIngredient = function(){
    const ingredient = ingredientInput.val()
    if(!ingredient){
        alert("Please write an ingredient.")
    }
    const dairy = dairyCheckBox.prop('checked');
    const gluten = glutenCheckBox.prop('checked');
    const vegeterian = vegeterianCheckBox.prop('checked');
    $.get(`/recipes/${ingredient}?dairyFree=${dairy}&glutenFree=${gluten}&vegeterian=${vegeterian}`)
    .then( (recipes)=> {
        renderer.renderRecipes(recipes)        
    })
    .catch((error)=>{
        console.log(error)
        alert(error.responseJSON.Error)
    })
}

$("#recipes-container").on("click","img",function(){
    const ingredient = $($(this).siblings("ul").children()[0]).text()
    alert(ingredient)
})
