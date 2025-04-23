//funktion der indsætter det hente data fra wordpress
function renderRecipes(data) {
     cardsEl.innerHTML = ''; //sørger for at ved ny søgning slettes "indhold" i DOM
        data.forEach(recipe => {
            console.log('recipe:', recipe)
            
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
 
// DOM elementer
const cardsEl = document.querySelector(".cardsSektion");
