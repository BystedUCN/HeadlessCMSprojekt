const domain ="https://mmd2.kristinahejlesen.dk/";
const postsEndpoint = "wp-json/wp/v2/posts";
const getRealImageUrls = "&acf_format=standard";
const authEndpoint ="/wp-json/jwt-auth/v1/token"; //er kopieret fra JWT info på wordpress.
//token funktionen. Sende en POST request. logind info fra wordpress.
//opretter en ny bruger på wp og laver dem til redaktør. Altså en der ikke kan logge ind på vores wp, men kun se via api. brug ikke din admin koden.
 
const opskriftAPI = document.querySelector(".opskriftAPI");
 
//askynkron funktion der henter vores token ("adgangskode"), altså den henter login info fra vores wordpress API.
async function getToken(){
    const userInfo = {
        username:"API user",
        password:"k5AZ yJuM qxU0 cJPg FY5k 3yW7"
    }
 
    const options = {
        method: "POST", //Vi vil SENDE data til WP
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo) //vi laver vores JS objekt om til en string.
    }
    try{
 
        const res = await fetch(domain + authEndpoint, options);
        const autoResponse = await res.json();
        console.log('autoResponse:', autoResponse)
        return autoResponse.token;
    } catch(err){
        console.log('err:', err)
        opskriftAPI.innerHTML = "Der gik noget galt med at hente en token..";
 
    }
}
 
//vi tilføjer en addEventListener uden om hele vores funktion, for at være sikker på vi har hentet data inden vi indsætter det i DOM.
document.addEventListener("DOMContentLoaded", () =>{
 
    async function init() {
        try{
            const token = await getToken();
            // const paramsString = window.location.search;
            const params = new URLSearchParams(window.location.search);
            // const searchParams = new URLSearchParams(paramsString);
            // console.log('searchParams:', searchParams)
            //vi henter slug fra url på den opskrift som vi gerne vil hente
            const theSlug = params.get("slug");
            console.log('theSlug:', theSlug)
            //vi gemme currentRecipe i , vent på at køre funktionen getRecipebyslug, der henter vores data og vores token
            const currentRecipe = await getRecipeBySlug(token, theSlug);
            console.log('currentRecipe:', currentRecipe)
            //vi kalder funktionen der skal indsætte vores data i DOM ved class = "opskriftsAPI"
            renderSingleRecipes(currentRecipe, ".opskriftAPI");
        } catch (err) {
            //logger i console at der sket en fejl, samt indsætter teksten i DOM ved class = opskriftAPI
            console.log('err:', err);
            opskriftAPI.innerHTML = `Der er sket endnu en fejl!"`
            
        }
    }
    
    
    //henter opskrift med slug og med token
    async function getRecipeBySlug(token, theSlug) {
        const options = {
            headers:{
                Authorization: "Bearer " + token
            }
        }
        const res = await fetch(domain + postsEndpoint + "?status=private&slug=" + theSlug + getRealImageUrls, options);
        const recipe = await res.json();
        return recipe;
    }
    function renderSingleRecipes(recipe) {
    const steps = recipe[0].acf.fremgangsmade;
    const ingredients = recipe[0].acf.ingredienser;
 
    const stepsList = `<ol>${Object.values(steps).filter(step => step && step.trim() !='').map(step => `<li>${step}</li>`).join('')}</ol>`;
    const ingredientsList = `<ul class="ingredienser">${Object.values(ingredients).filter(ingredients => ingredients && ingredients.trim() !='').map(ing => `<li><input type="checkbox">${ing}</li>`).join('')}</ul>`;
 
        opskriftAPI.innerHTML += `
        <article class="opskriftLayout">
        <div class="introTilOpskrift">
        <h1 class="overskriftOpskrift">${recipe[0].acf.titel}</h1>
        <p class= "pIntro">${recipe[0].acf.kort_beskrivelse}</p>
        <p class= "pIntro">Total tid: ${recipe[0].acf.total_tid.name}</p>
        <p class= "pIntro">Arbejdstid: 2 timer</p>
        <p class= "pIntro">Portioner: 4 portioner</p>
        <div class ="iconerOpskrift">
        <div>
        <span class="material-symbols-outlined">
        bookmark_add
        </span>
        <p>Gem</p>
        </div>
        <div>
        <span class="material-symbols-outlined">
        send
        </span>
        <p>Del</p>
        </div>
        <div>
        <span class="material-symbols-outlined">
        print
        </span>
        <p>Print</p>
        </div>
        </div>
        </div>
        <img class="billedeOpskrift" src="${recipe[0].acf.billede.url}" alt="">
        
        <div class="ingrediensListe">
        <h2>Ingredienser:</h2>
        ${ingredientsList}
        <ul class="ingredienser">
       
        </div>
        <div class="Fremgangsmade">
        <h2>Fremgangsmåde:</h2>
        ${stepsList}
        <h3>Tips til retten:</h3>
        <p>Her står alle tips til opskriften!</p>
        </div>
        </article>
        `;
        
    }
    //vi kalder funktionen der henter vores data og kører vores funktioner
    init();
})