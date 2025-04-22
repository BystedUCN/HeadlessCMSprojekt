    
    //henter opskrift med slug
    async function getRecipeById(token) {
        //vi definere options og beder om at hente headers med vores token/kode
        const options = {
            headers:{
                Authorization: "Bearer " + token
            }
        }
        //vi venter på at hente vores data. domain og postendpoints er vores url
        const res = await fetch(domain + postsEndpoint + "?status=private&per_page=100" + getRealImageUrls, options);
        // vi gemmer vores data i variabel recipe og får det i JSON
        const recipe = await res.json();
    }
 
    const hurtigAftensMadSlider = document.querySelector(".hurtigAftensMadSlider");
    function renderHurtigMad(recipe) {
      const hurtigMadContainer = document.createElement("div");
      hurtigMadContainer.classList.add("hurtigMadContainer");
      //hvis det er et array vil if være true og der loopes igennem opskrifterne med forEach. Inden filteres der på om opskriften indholder total_tid med slug = "15" defineret forneden.
        if (Array.isArray(recipe))
            recipe.filter(recipe => recipe.acf.total_tid.slug === slugHurtigMad).forEach(recipe => {
                console.log('recipe:', recipe);
                const link = document.createElement("a");
                link.classList.add("sliderItem");
                link.href = `./opskrift.html?slug=${recipe.slug}`;
            
                const imgEl = document.createElement("img");
                imgEl.classList.add("billedeISlider");
                imgEl.src = recipe.acf.billede.url;
                imgEl.alt = recipe.acf.billede.alt;

                const title = document.createElement("span");
                title.classList.add("recipeTitle");
                title.textContent = recipe.title.rendered;

                link.appendChild(imgEl);
                link.appendChild(title);
                hurtigMadContainer.appendChild(link);
        });
        hurtigAftensMadSlider.appendChild(hurtigMadContainer);
    };
    
    const gaesteMadSlider = document.querySelector(".gaesteMadSlider")
    function renderGaesteMad(recipe) {
        console.log('recipe:', recipe);
        const gaesteMadContainer = document.createElement("div");
        gaesteMadContainer.classList.add("gaesteMadContainer");

        if (Array.isArray(recipe)) {
            recipe.filter(recipe => 
                Array.isArray(recipe.acf.hovedkategori) // Her tjekker den om der er et term_id, som matcher vores slug 
                && recipe.acf.hovedkategori.some(kat => kat.term_id == slugGaesteMad)).forEach(recipe => { // her tjekker vi om der er et term_id som matcher vores slug

            const link = document.createElement("a");
            link.classList.add("sliderItem");
            link.href = `./opskrift.html?slug=${recipe.slug}`;

            const imgEl = document.createElement("img");
            imgEl.classList.add("billedeISlider");
            imgEl.src = recipe.acf.billede.url;
            imgEl.alt = recipe.acf.billede.alt;

            const title = document.createElement("span");
            title.classList.add("recipeTitle");
            title.textContent = recipe.title.rendered;

            link.appendChild(imgEl);
            link.appendChild(title);
            gaesteMadContainer.appendChild(link);
        });
    }

  gaesteMadSlider.appendChild(gaesteMadContainer);
}

    const weekendMadSlider = document.querySelector(".weekendMadSlider");
    function renderWeekendMad(recipe) {
    console.log('recipe:', recipe);

    const weekendMadSlider = document.querySelector(".weekendMadSlider");
    const weekendMadContainer = document.createElement("div");
    weekendMadContainer.classList.add("weekendMadContainer");

    if (Array.isArray(recipe)) {
        recipe
        .filter(recipe =>
            Array.isArray(recipe.acf.hovedkategori) && recipe.acf.hovedkategori.some(kat => kat.term_id == slugWeekendMad)).forEach(recipe => {

            const link = document.createElement("a");
            link.classList.add("sliderItem");
            link.href = `./opskrift.html?slug=${recipe.slug}`;

            const imgEl = document.createElement("img");
            imgEl.classList.add("billedeISlider");
            imgEl.src = recipe.acf.billede.url;
            imgEl.alt = recipe.acf.billede.alt;

            const title = document.createElement("span");
            title.classList.add("recipeTitle");
            title.textContent = recipe.title.rendered;

            link.appendChild(imgEl);
            link.appendChild(title);
            weekendMadContainer.appendChild(link);
        });
    }

  weekendMadSlider.appendChild(weekendMadContainer);
}
    const slugHurtigMad = "15"; 
    const slugGaesteMad = "44";
    const slugWeekendMad = "43";
   //asynkron funktion der venter på at vi har fået vores token (en form for adgangskode), ellers har vi ikke tilladelse til at hente vores private opskrifter.
 async function fetchAndRenderRecipe() {
  const token = await getToken();
  if (token) {
    const options = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    const res = await fetch(
      domain + postsEndpoint + "?status=private&per_page=100" + getRealImageUrls,
      options
    );
    const recipe = await res.json();
 
    renderHurtigMad(recipe);
    renderGaesteMad(recipe);
    renderWeekendMad(recipe);
  }
}
//kalder funktionen
    fetchAndRenderRecipe();
