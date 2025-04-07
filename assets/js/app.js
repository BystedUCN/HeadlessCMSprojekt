const domain ="https://mmd2.kristinahejlesen.dk/";
const postsEndpoint = "wp-json/wp/v2/posts";
const getRealImageUrls = "&acf_format=standard";
const authEndpoint ="/wp-json/jwt-auth/v1/token"; //er kopieret fra JWT info på wordpress.

init()


//overorndet funktion. Starte alle vores applikationer op. 
async function init(){
    try {

        const token = await getToken();
        const recepies = await getPrivateRecipes(token);
        renderRecipes(recepies); //vi sender recepires ned i funktionen renderRecipes, så den looper igennem og vi kalder funktionen her.
    } catch(err){
        console.log('err:', err);
        resultEl.innerHTML = "Der gik noget galt - Øv. Det er vi kede af:(";
    }
}

//token funktionen. Sende en POST request. logind info fra wordpress.
//opretter en ny bruger på wp og laver dem til redaktør. Altså en der ikke kan logge ind på vores wp, men kun se via api. brug ikke din admin koden.
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
        resultEl.innerHTML = "Der gik noget galt med at hente en token..";

    }
}

//henter vores domæne og posts med fetch api. await virker kun fordi vi har skrevet det er en async funktion.
async function getPublicRecipes(){
    const res = await fetch(domain + postsEndpoint); //dette er underforstået en GET request
    const recipes = await res.json(); //recepies her gemmer vi data vi hentet.
    return recipes;
}

//henter private posts, ekstra sikkerhed
async function getPrivateRecipes(token){
    const options = {
        headers: {
            Authorization: "Bearer " + token
        }
    }
    const res = await fetch(domain + postsEndpoint + "?status=private" + getRealImageUrls, options);
    console.log('res:', res)
    const recipes = await res.json(); //recepies her gemmer vi data vi hentet.
    return recipes;
}
//hvis det er sandt at det er et arry af opksrifter, looper den igennem det.

function renderRecipes(data) {
    if (Array.isArray(data)) {
        data.forEach(recipe => {
            console.log('recipe:', recipe)
            resultEl.innerHTML += `
            <article>
                <h2>${recipe.title.rendered}</h2>
                ${recipe.content.rendered}
            </article>
            `;
        })
    } else {
        resultEl.innerHTML += `
            <article>
                <h2>${data.title.rendered}</h2>
                ${data.content.rendered}
            </article>`
    }
}

// DOM hooks
const resultEl = document.querySelector(".result");

