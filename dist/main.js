const renderer = new Renderer()


let recipes_page = []
let page = 0
let length = 0
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
                renderer.renderRecipes(recipes_page.slice(0,MAX_RECIPES_IN_PAGE),length,page)
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

const navigation_next = function(){
    if(recipes_page.length>((page+1)*MAX_RECIPES_IN_PAGE))
    {
        page++;
        renderer.renderRecipes(recipes_page.slice(page*MAX_RECIPES_IN_PAGE,(page+1)*MAX_RECIPES_IN_PAGE),length,page)
    }
    
}
const navigation_prev = function(){
    if(page > 0){
        page--;
        renderer.renderRecipes(recipes_page.slice(page*MAX_RECIPES_IN_PAGE,(page+1)*MAX_RECIPES_IN_PAGE),length,page)
    }
}

const navigation_to_page= function(page_number){
    page = page_number
    renderer.renderRecipes(recipes_page.slice(page*MAX_RECIPES_IN_PAGE,(page+1)*MAX_RECIPES_IN_PAGE),length,page)
}


