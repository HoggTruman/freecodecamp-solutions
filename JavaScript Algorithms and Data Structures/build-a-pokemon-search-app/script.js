// get references to elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

const pokemonId = document.getElementById("pokemon-id");
const pokemonName = document.getElementById("pokemon-name");
const pokemonWeight = document.getElementById("weight");
const pokemonHeight = document.getElementById("height");
const pokemonSprite = document.getElementById("sprite");
const pokemonTypes = document.getElementById("types")

const pokemonHP = document.getElementById("hp");
const pokemonAttack = document.getElementById("attack");
const pokemonDefense = document.getElementById("defense");
const pokemonSpecialAttack = document.getElementById("special-attack");
const pokemonSpecialDefense = document.getElementById("special-defense");
const pokemonSpeed = document.getElementById("speed");

// base url
const baseUrl = `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/`;


async function getPokemonData(input) {
  try {
    const requestUrl = baseUrl + input;
    const res = await fetch(requestUrl);
    const data = await res.json();
    return data;
  }
  catch (err) {
    alert("Pokémon not found");
  }
}


function cleanInput(input) {
  return input.toLowerCase().trim();
}


function updateValues({height, id, name, sprites, stats, types, weight}) {

  // update info
  pokemonId.innerText = id;
  pokemonName.innerText = name.toUpperCase();
  pokemonWeight.innerText = weight;
  pokemonHeight.innerText = height;

  pokemonSprite.src = sprites.front_default;

  // update base stats
  pokemonHP.innerText = stats[0].base_stat;
  pokemonAttack.innerText = stats[1].base_stat;
  pokemonDefense.innerText = stats[2].base_stat;
  pokemonSpecialAttack.innerText = stats[3].base_stat;
  pokemonSpecialDefense.innerText = stats[4].base_stat;
  pokemonSpeed.innerText = stats[5].base_stat;

  // reset and update types
  pokemonTypes.innerHTML = "";
  for (const type in types) {
    pokemonTypes.innerHTML += `<p>${types[type].type.name.toUpperCase()}</p>`;
  }
}


async function searchButtonPressed() {
  if (searchInput.value === "") {
    alert("Enter a pokemon name or id");
    return;
  }

  const cleanedInput = cleanInput(searchInput.value);
  const pokemonData = await getPokemonData(cleanedInput);
  updateValues(pokemonData);
}

// add event listeners
searchButton.addEventListener("click", searchButtonPressed);
