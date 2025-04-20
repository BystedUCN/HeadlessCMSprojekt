    
    //henter opskrift med id
    async function getRecipeById(token, theSlug) {
        const options = {
            headers:{
                Authorization: "Bearer " + token
            }
        }
        const res = await fetch(domain + postsEndpoint + "?status=private&total_tid=" + theSlug + getRealImageUrls, options);
        const recipe = await res.json();
        renderRecipesById(recipe);
    }

//filtere igennem de opskrifter der har slug=15
    const hurtigAftensMadSlider = document.querySelector(".hurtigAftensMadSlider");
function renderRecipesById(recipe) {
      console.log('recipe:', recipe)
      if (Array.isArray(recipe))
        recipe.filter(recipe => recipe.acf.total_tid.slug === theSlug).forEach(recipe => {

            console.log('recipe:', recipe)
            
            hurtigAftensMadSlider.innerHTML += `
                
                <img class="billedISlider" src="${recipe.acf.billede.url}" alt="">
            `;
        })
    
    }
    

    // const token = getToken();
    // const recipeId = 274;
    const theSlug = "15"; 
   
    async function fetchAndRenderRecipe() {
        // Vi venter på tokenet inden geTRecipeById køres.
    const token = await getToken(); // Vent på tokenet
    if (token) {
        await getRecipeById(token, theSlug); 
        // Hent opskriften med tokenet og med slug eller måske id! 
    }
}
    fetchAndRenderRecipe();
