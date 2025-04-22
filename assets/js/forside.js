    
    //henter opskrift med slug
    async function getRecipeById(token, theSlug) {
        //vi definere options og beder om at hente headers med vores token/kode
        const options = {
            headers:{
                Authorization: "Bearer " + token
            }
        }
        //vi venter på at hente vores data. domain og postendpoints er vores url og ?status=private&total_tid= er vores query parameters hvor vi anmoder om at få private post med total_tid og vi henter inkluder opskriftens slug.
        const res = await fetch(domain + postsEndpoint + "?status=private&total_tid=" + theSlug + getRealImageUrls, options);
        // vi gemme vores data i variabel recipe og får det i JSON
        const recipe = await res.json();
        // vi kalder funktionen i linje 20
        renderRecipesById(recipe);
    }

//filtere igennem de opskrifter der har den rigtige slug værdi. 
    const hurtigAftensMadSlider = document.querySelector(".hurtigAftensMadSlider");
function renderRecipesById(recipe) {
      console.log('recipe:', recipe)
      //hvis det er et array vil if være true og der loopes igennem opskrifterne med forEach. Inden filteres der på om opskriften indholder total_tid med slug = "15" defineret forneden. Men den kan anvendes på de slugs man nu ønsker.
      if (Array.isArray(recipe))
        recipe.filter(recipe => recipe.acf.total_tid.slug === theSlug).forEach(recipe => {

            console.log('recipe:', recipe)
            //indsætter i DOM med innerHTML og Indsætter ${recipe.slug} her også, så når man klikker på billeder bliver slug husket og den åbner den rigtige opskrift på opskriftssiden
            hurtigAftensMadSlider.innerHTML += `
                <a href="./opskrift.html?slug=${recipe.slug}">
                <img class="billedISlider" src="${recipe.acf.billede.url}" alt="">
                </a>
            `;
        })
    
    }
    

    //gemmer varibalen theSLug og sætter den til være = 15, da det er vores taxonmi med 15-30 min som vi øsnker at hente.
    const theSlug = "15"; 
   //asynkron funktion der venter på at vi har fået vores token (en form for adgangskode), ellers har vi ikke tilladelse til at hente vores private opskrifter.
    async function fetchAndRenderRecipe() {
        // Vi venter på tokenet inden geTRecipeById køres.
    const token = await getToken(); // Vent på tokenet
    if (token) {
        await getRecipeById(token, theSlug); 
        // Hent opskriften med tokenet og med slug eller id kan også anvendes! Har valgt med slug her. 
    }
}
//kalder funktionen
    fetchAndRenderRecipe();
