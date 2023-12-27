const renderer = new Renderer()


let recipes_page = []
let length = 0
let page = 0
const searchIngredient = function () {
    const ingredient = ingredientInput.val()
    if (!ingredient) {
        alert(ingredientError)
    }
    else {
        const dairy = dairyCheckBox.prop('checked');
        const gluten = glutenCheckBox.prop('checked');
        const vegeterian = vegeterianCheckBox.prop('checked');
        const recipesURL = `/recipes/${ingredient}?dairyFree=${dairy}&glutenFree=${gluten}&vegeterian=${vegeterian}`
        $.get(recipesURL)
            .then((recipes) => {
                console.log(recipes)
                recipes_page = recipes.recipes
                length = recipes_page.length
                page = 0
                renderer.renderRecipes(recipes_page.slice(0,5),length)
            })
            .catch((error) => {
                console.log(error)
                alert(error.responseJSON.Error)
            })
    }
}
recipesContainer.on("click", ".share", function(){
    const ahref = $(this).siblings(".titlemoji").find(".title")
    console.log(ahref)
    const youtube_url = ahref.attr('href').replace("?", "%3F");
    const url = `mailto:?subject=Check%20out%20this%20recipe! ${ahref.text()}&body=You%20can%20see%20this%20recipe%20in%20this%20video%3A ${youtube_url}`
    $(this).attr('href',url)
})


recipesContainer.on("click", "img", function () {
    const ingredient = $($(this).siblings("ul").children()[0]).text()
    alert(ingredient)
})

const navigation_next = function(recipes){
    if(recipes_page.length>((page+1)*5))
    {
        page++;
        renderer.renderRecipes(recipes_page.slice(page*5,(page+1)*5),length)
    }
    
}
const navigation_prev = function(recipes){
    if(page > 0){
        page--;
        renderer.renderRecipes(recipes_page.slice(page*5,(page+1)*5),length)
    }
}


