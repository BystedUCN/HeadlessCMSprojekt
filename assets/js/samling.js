//henter opskrift med slug
    async function getRecipeById(token, theSlug) {
        //vi definere options og beder om at hente headers med vores token/kode
        const options = {
            headers:{
                Authorization: "Bearer " + token
            }
        }
        //vi venter på at hente vores data. domain og postendpoints er vores url og ?status=private&total_tid= er vores query parameters hvor vi anmoder om at få private post med total_tid og vi henter inkluder opskriftens slug.
        const res = await fetch(domain + postsEndpoint + "?status=private&opskriftssamling0=" + theSlug + getRealImageUrls, options);
        // vi gemme vores data i variabel recipe og får det i JSON
        const recipe = await res.json();
        console.log('recipe:', recipe)
        // vi kalder funktionen i linje 20
        renderRecipesById(recipe);
    }

//filtere igennem de opskrifter der har den rigtige slug værdi. 
   // DOM elementer
const cardsEl = document.querySelector(".cardsSektion");
function renderRecipesById(recipe) {
      
      //hvis det er et array vil if være true og der loopes igennem opskrifterne med forEach. Inden filteres der på om opskriften indholder total_tid med slug = "15" defineret forneden. Men den kan anvendes på de slugs man nu ønsker.
      if (Array.isArray(recipe))
        if (theSlug === familieSlug) {
        recipe.filter(recipe => recipe.acf.opskriftssamling[0].slug === familieSlug).forEach(recipe => {
        

            
            //indsætter i DOM med innerHTML og Indsætter ${recipe.slug} her også, så når man klikker på billeder bliver slug husket og den åbner den rigtige opskrift på opskriftssiden
                 cardsEl.innerHTML += `
            
             <a class="cards" href="./opskrift.html?slug=${recipe.slug}">
            <div>
 
            <img src="${recipe.acf.billede.url}" alt="">
            <i class="fa-regular fa-bookmark"></i>
            <h2>${recipe.acf.titel}</h2>
            
            
            <p><i class="fa-regular fa-clock"></i> ${recipe.acf.total_tid.name}</p>
            <p>Sværhedsgrad: ${recipe.acf.svaerhedsgrad.name}
            </div>
            </a>

            `;
        })}
        else if (theSlug === saesonSlug) {
            recipe.filter(recipe => recipe.acf.opskriftssamling[0].slug === saesonSlug).forEach(recipe => {
        

            
            //indsætter i DOM med innerHTML og Indsætter ${recipe.slug} her også, så når man klikker på billeder bliver slug husket og den åbner den rigtige opskrift på opskriftssiden
                 cardsEl.innerHTML += `
            
               <a class="cards" href="./opskrift.html?slug=${recipe.slug}">
            <div>
 
            <img src="${recipe.acf.billede.url}" alt="">
            <i class="fa-regular fa-bookmark"></i>
            <h2>${recipe.acf.titel}</h2>
            
            
            <p><i class="fa-regular fa-clock"></i> ${recipe.acf.total_tid.name}</p>
            <p>Sværhedsgrad: ${recipe.acf.svaerhedsgrad.name}
            </div>
            </a>

            `;
        })
        } 
    
    }
    

    //gemmer varibalen theSLug og sætter den til være = 15, da det er vores taxonmi med 15-30 min som vi øsnker at hente.
    const familieSlug = "familie-favoritter"; 
    const saesonSlug = "saesonens-favoritter";
    const paramsString = window.location.search;
    const params = new URLSearchParams(window.location.search);
    console.log('params:', params)
    const searchParams = new URLSearchParams(paramsString);
    console.log('searchParams:', searchParams)
            //vi henter slug fra url på den opskrift som vi gerne vil hente
    const theSlug = params.get("slug");
    console.log('theSlug:', theSlug)
   //asynkron funktion der venter på at vi har fået vores token (en form for adgangskode), ellers har vi ikke tilladelse til at hente vores private opskrifter.
    async function fetchAndRenderRecipe() {
        // Vi venter på tokenet inden geTRecipeById køres.
    const token = await getToken(); // Vent på tokenet
    if (token) {
        await getRecipeById(token, familieSlug); 
        // Hent opskriften med tokenet og med slug eller id kan også anvendes! Har valgt med slug her. 
    }
}
//kalder funktionen
    fetchAndRenderRecipe();

