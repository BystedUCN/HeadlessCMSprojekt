function renderRecipes(data) {
     
        data.forEach(recipe => {
            
            


            cardsEl.innerHTML += `
            <div class="cards">
            <img src="${recipe.acf.billede.url}" alt="">
            <i class="fa-regular fa-bookmark"></i>
            <h2>${recipe.acf.titel}</h2>

            <p>${recipe.acf.total_tid}</p>
            <i class="fa-regular fa-clock"></i>
            <a href="./opskrift.html?slug=${recipe.slug}">klik her</a>
            </div>
            `;
        })
   
}

// DOM hooks
const cardsEl = document.querySelector(".cardsSektion");