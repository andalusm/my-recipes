class Renderer {
    
    constructor(){
        this.recipeContainer = $("#recipes-container");
        this.recipeTemplate = $("#recipes-template");
    }
    render(container, handleTemplate, attribute){
        container.empty()
        const source = handleTemplate.html();
        const template = Handlebars.compile(source);
        let newHTML = template(attribute);
        container.append(newHTML)
    }

    renderRecipes(recipes){
        this.render(this.recipeContainer,this.recipeTemplate, recipes)

    }

}