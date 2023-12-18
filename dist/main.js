
const renderer = new Renderer()

const searchIngredient = function(){
    const ingredient = $("#ingredient").val()
    // if(!ingredient){
    //     return
    // }
    const dairy = $('#dairy').prop('checked');
    const gluten = $('#gluten').prop('checked');
    const vegeterian = $('#vegeterian').prop('checked');
    $.get(`/recipes/${ingredient}?dairy=${dairy}&gluten=${gluten}&vegeterian=${vegeterian}`, function (recipes) {
        console.log(recipes)
        renderer.renderRecipes(recipes)        
    })
}

$("#recipes-container").on("click","img",function(){
    const ingredient = $($(this).siblings("ul").children()[0]).text()
    alert(ingredient)
})
