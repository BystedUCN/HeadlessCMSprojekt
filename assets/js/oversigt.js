//funktion der indsætter det hente data fra wordpress
function renderRecipes(data) {
     cardsEl.innerHTML = ''; //sørger for at ved ny søgning slettes "indhold" i DOM
        data.forEach(recipe => {
            console.log('recipe:', recipe)
            
            cardsEl.innerHTML += `
            
            <div class="cards">
            <a href="./opskrift.html?slug=${recipe.slug}">

            <img src="${recipe.acf.billede.url}" alt="">
            </a>
            
            <i class="fa-regular fa-bookmark"></i>
            <h2>${recipe.acf.titel}</h2>
            
            <i class="fa-regular fa-clock"></i>
            <p>${recipe.acf.total_tid.name}</p>
            <p>Sværhedsgrad: ${recipe.acf.svaerhedsgrad.name}
            <br>
            </div>

            `;
        })
   
}

// DOM elementer
const cardsEl = document.querySelector(".cardsSektion");
