const renderer = new Renderer()


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
                renderer.renderRecipes(recipes)
            })
            .catch((error) => {
                console.log(error)
                alert(error.responseJSON.Error)
            })
    }
}

recipesContainer.on("click", "img", function () {
    const ingredient = $($(this).siblings("ul").children()[0]).text()
    alert(ingredient)
})
