const domain ="https://mmd2.kristinahejlesen.dk/";
const postsEndpoint = "wp-json/wp/v2/posts";
const getRealImageUrls = "&acf_format=standard";
const authEndpoint ="/wp-json/jwt-auth/v1/token"; //er kopieret fra JWT info på wordpress.

init()
 //gemmer alle opskrifter i en varibel, som et array.
let AllRecipes = [];

//overorndet funktion. Starte alle vores applikation op. 
async function init(){
    try {

        const token = await getToken();
        const recepies = await getPrivateRecipes(token);
        AllRecipes = recepies;
        renderRecipes(recepies); //vi sender recepires ned i funktionen renderRecipes, så den looper igennem og vi kalder funktionen her.
    } catch(err){
        console.log('err:', err);
    }
}

//token funktionen. Sende en POST request. log ind info fra wordpress.
//opretter en ny bruger på wp og laver dem til redaktør (dette gør vi inde i wordpress). Altså en der ikke kan logge ind på vores wp, men kun se via api. Vi indsætter nu den kode vi får samt brugernavnet vi har valgt. På denne måde kan vi logge ind via denne bruge og få adgang.
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
        // vi gemme vores data i variabel autoResponse og får det i JSON
        const autoResponse = await res.json();
        console.log('autoResponse:', autoResponse)
        //Vi beder den om at returnere vores data og vores token
        return autoResponse.token;
    } catch(err){
        console.log('err:', err)
    }
}


//henter private posts, ekstra sikkerhed
async function getPrivateRecipes(token){
    const options = {
        headers: {
            Authorization: "Bearer " + token
        }
    }
    const res = await fetch(domain + postsEndpoint + "?status=private&per_page=100" + getRealImageUrls, options);
    console.log('res:', res)
    const recipes = await res.json(); //recepies her gemmer vi data vi hentet i variablen recipes.
    return recipes;
}


//FILTER
// Opsat eventlistener (submit) + prevent
//først findes filterForm med Id og gemmer den i filterFormEl. addEventListener lytter efter at brugeren trykker på knappen ("submit form").
//e.preventDefault søger for at siden ikke reloads ved submit.
//dernæst hentes value/værdi fra option i select. vigtig at skrive de præcise values ellers virker det ikke. De skal I vores tilfælde passe samme med acf fra wordpress.
const filterFormEl = document.querySelector("#filterForm") 
if(filterFormEl){
filterFormEl.addEventListener("submit", e =>{
    e.preventDefault();
    const diffValue = filterFormEl.diffFilter.value;
    const cusineValue = filterFormEl.cusineFilter.value;
    const timeValue = filterFormEl.timeFilter.value;
    
//filter metoden bruges til at filtere igennem de forskellige værdier. hvis Alle er valgt, skal alle opskrifter vises. || betyder eller, hvis diffValue (altså værdien i vores option) er lig med den værdi der stemmer overens med en opskrift med i vores acf under sværhedsgrad har name = "samme værdi som valgt i option, f.eks Begynder"
    const FilterRecepies = AllRecipes.filter(recipe => 
        ((diffValue == "Alle" || diffValue === recipe.acf.svaerhedsgrad.name) && (cusineValue == "Alle" || cusineValue == recipe.acf.diaeter[0].name) && (timeValue == "Alle" || timeValue == recipe.acf.total_tid.name))
    )
    //kalder funktionen renderRecipes der står for at vises vores opskrifter i DOM og indsætter vores filterede opskrifter i, så de vises i DOM
    renderRecipes(FilterRecepies);
});
}
