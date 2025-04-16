const domain ="https://mmd2.kristinahejlesen.dk/";
const postsEndpoint = "wp-json/wp/v2/posts";
const getRealImageUrls = "&acf_format=standard";
const authEndpoint ="/wp-json/jwt-auth/v1/token"; //er kopieret fra JWT info på wordpress.
//token funktionen. Sende en POST request. logind info fra wordpress.
//opretter en ny bruger på wp og laver dem til redaktør. Altså en der ikke kan logge ind på vores wp, men kun se via api. brug ikke din admin koden.

const opskriftAPI = document.querySelector(".opskriftAPI");


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

document.addEventListener("DOMContentLoaded", () =>{

    async function init() {
        try{
            const token = await getToken();
            // const paramsString = window.location.search;
            const params = new URLSearchParams(window.location.search);
            // const searchParams = new URLSearchParams(paramsString);
            // console.log('searchParams:', searchParams)
            const theSlug = params.get("slug");
            console.log('theSlug:', theSlug)
            const currentRecipe = await getRecipeBySlug(token, theSlug);
            console.log('currentRecipe:', currentRecipe)
            renderSingleRecipes(currentRecipe, ".opskriftAPI");
        } catch (err) {
            console.log('err:', err);
            opskriftAPI.innerHTML = `Der er sket endnu en fejl!"`
            
        }
    }
    
    
    //henter opskrift med slug
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
        opskriftAPI.innerHTML += `
        <article class="opskriftLayout">
        <div class="introTilOpskrift">
        <h1 class="overskriftOpskrift">${recipe[0].acf.titel}</h1>
        <p>den korte beskrivelse
        ${recipe[0].acf.kort_beskrivelse}
        </p>
        <p class="Small">Total tid: 4 timer</p>
        <p class="">Arbejdstid: 2 timer</p>
        <p class="">Portioner: 4 portioner</p>
        
        <span class="material-symbols-outlined">
        bookmark_add
        </span>
        <span class="material-symbols-outlined">
        send
        </span>
        <span class="material-symbols-outlined">
        print
        </span>
        </div>
        <img class="billedeOpskrift" src="./assets/img/creamy-asparagus-soup.webp" alt="">
        
        <!--ikoner her? er det fra google?-->
        <div class="ingrediensListe">
        <h2>Ingredienser:</h2>
        <ul class="ingredienser">
        <li><input type="checkbox"> Tomater</li>
        <li><input type="checkbox"> Løg</li>
        <li><input type="checkbox"> Hvidløg</li>
        <li><input type="checkbox"> Oregano</li>
        </ul>
        </div>
        <div class="Fremgangsmåde">
        <h2>Fremgangsmåde:</h2>
        <h3>Tips til retten:</h3>
        <p>Her står alle tips til opskriften!</p>
        </div>
        </article>
        `;
        
    }
    init();
})
