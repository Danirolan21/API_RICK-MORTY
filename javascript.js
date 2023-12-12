const formulario = document.getElementById("formularioBuscar");
const inputNombre = document.getElementById("busqueda");
const divResultados = document.querySelector(".resultado");
const paginado = document.querySelector(".paginas");
const plantilla = document.querySelector("template.plantilla").content;
let urlCharacters = "https://rickandmortyapi.com/api/character/";
let currentPage = 1; // Variable para almacenar la página actual

const fragment = document.createDocumentFragment();

async function getCharactersByName(name, page = 1) {
    const urlFetch = `${urlCharacters}?name=${name}&page=${page}`;
    const response = await fetch(urlFetch);
    const json = await response.json();
    return json;
}

async function getCharacters(page = 1) {
    const urlFetch = `${urlCharacters}?page=${page}`;
    const response = await fetch(urlFetch);
    const json = await response.json();
    return json;
}

function displayPageNumber(page) {
    paginado.querySelector("h3").textContent = `Página ${page}`;
}

function prev() {
    if (currentPage > 1) {
        currentPage--;
        displayPageNumber(currentPage);
        fetchCharacters();
        scrollToTop();
    } else {
        console.log("Estás en la primera página");
    }
}

function next() {
    currentPage++;
    displayPageNumber(currentPage);
    fetchCharacters();
    scrollToTop();
}

function ExisteSiguientePagina(characters) {
    const nextPageButton = paginado.querySelector(".nextpag");

    if (characters.info.next === null) {
        nextPageButton.disabled = true;
    } else {
        nextPageButton.disabled = false;
    }
}
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Desplazamiento suave hacia arriba
    });
}

function fetchCharacters() {
    const name = inputNombre.value.trim();

    if (name !== "") {
        getCharactersByName(name, currentPage)
            .then(characters => {
                pintaCharacters(characters);
                ExisteSiguientePagina(characters);
            });
    } else {
        getCharacters(currentPage)
            .then(characters => {
                pintaCharacters(characters);
                ExisteSiguientePagina(characters);
            });
    }
}

function pintaCharacters(characters) {
    divResultados.innerHTML = "";

    characters.results.forEach(element => {
        plantilla.querySelector("img").src = element.image;
        plantilla.querySelector("h3").textContent = element.name;
        plantilla.querySelector("p.status").textContent = "Status: " + element.status;
        plantilla.querySelector("p.species").textContent = "Species: " + element.species;
        plantilla.querySelector("p.gender").textContent = "Gender: " + element.gender;

        const clone = plantilla.cloneNode(true);
        clone.querySelector('.card').addEventListener('click', () => {
            showCharacterDetails(element.id);
        });

        fragment.appendChild(clone);
    });

    divResultados.appendChild(fragment);
}
const modal = document.getElementById('characterModal');
const closeModalSpan = document.querySelector('.close');

function showCharacterDetails(characterId) {
    const characterDetailsUrl = `${urlCharacters}/${characterId}`;

    fetch(characterDetailsUrl)
        .then(response => response.json())
        .then(character => {
            const detallePersonajeModal = document.getElementById('detalle-personaje-modal');

            const detailsHTML = `
                <div class="personajeImg"><img src="${character.image}" alt="${character.name}"></div>
                <div class="details"><h3>${character.name}</h3>
                <p>Status: ${character.status}</p>
                <p>Species: ${character.species}</p>
                <p>Gender: ${character.gender}</p>
                <p>Origin: ${character.origin.name}</p>
                <p>Last Known Location: ${character.location.name}</p>
                <p>More Info: <a href="${character.url}" target="_blank">${character.url}</a></p></div>
            `;

            detallePersonajeModal.innerHTML = detailsHTML;

            // Mostrar la modal
            modal.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching character details:', error);
            // Manejar la situación de error, mostrar un mensaje, etc.
        });
}

closeModalSpan.addEventListener('click', () => {
    modal.style.display = 'none';
});

formulario.addEventListener("submit", e => {
    e.preventDefault();
    currentPage = 1; // Resetea la página actual al realizar una nueva búsqueda
    displayPageNumber(currentPage);
    fetchCharacters();
});

paginado.querySelector(".prevpag").addEventListener("click", prev);
paginado.querySelector(".nextpag").addEventListener("click", next);

// Mostrar la primera página al cargar
window.addEventListener("load", () => {
    fetchCharacters();
    displayPageNumber(currentPage);
});

window.addEventListener('click', event => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});