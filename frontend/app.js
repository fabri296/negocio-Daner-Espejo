const API_URL = "https://pokeapi.co/api/v2/pokemon/";

const inputNombre = document.getElementById("nombre-pokemon");
const btnBuscar = document.getElementById("btn-buscar");
const estado = document.getElementById("estado");
const resultado = document.getElementById("resultado");


const TIPOS = {
  normal: "Normal", fire: "Fuego", water: "Agua", electric: "Eléctrico",
  grass: "Planta", ice: "Hielo", fighting: "Lucha", poison: "Veneno",
  ground: "Tierra", flying: "Volador", psychic: "Psíquico", bug: "Bicho",
  rock: "Roca", ghost: "Fantasma", dragon: "Dragón", dark: "Siniestro",
  steel: "Acero", fairy: "Hada"
};

async function buscarPokemon() {
  const nombre = inputNombre.value.trim().toLowerCase();

  // Validación del campo vacío
  if (nombre === "") {
    mostrarError("Escribe el nombre de un Pokémon.");
    return;
  }

  mostrarCargando();

  try {
    const response = await fetch(API_URL + encodeURIComponent(nombre));

    // La API responde 404 cuando el Pokémon no existe
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('No se encontró ningún Pokémon llamado "' + nombre + '".');
      }
      throw new Error("La API respondió con un error (código " + response.status + ").");
    }

    const datos = await response.json();
    mostrarPokemon(datos);
  } catch (error) {
    // TypeError ocurre cuando no hay conexión o la petición no llega al servidor
    if (error instanceof TypeError) {
      mostrarError("No se pudo conectar con la API. Revisa tu conexión a internet.");
    } else {
      mostrarError(error.message);
    }
  } finally {
    btnBuscar.disabled = false;
  }
}

function mostrarCargando() {
  btnBuscar.disabled = true;
  resultado.classList.add("oculto");
  estado.className = "";
  estado.textContent = "Cargando...";
}

function mostrarError(mensaje) {
  resultado.classList.add("oculto");
  estado.className = "error";
  estado.textContent = mensaje;
}

function mostrarPokemon(datos) {
  const imagen =
    datos.sprites.other["official-artwork"].front_default ||
    datos.sprites.front_default;

  // La API entrega el peso en hectogramos y la altura en decímetros
  const pesoKg = datos.weight / 10;
  const alturaM = datos.height / 10;

  const tipos = datos.types.map(function (t) {
    return TIPOS[t.type.name] || t.type.name;
  });

  document.getElementById("imagen").src = imagen;
  document.getElementById("nombre").textContent = datos.name;
  document.getElementById("tipos").textContent = tipos.join(", ");
  document.getElementById("peso").textContent = pesoKg + " kg";
  document.getElementById("altura").textContent = alturaM + " m";

  estado.textContent = "";
  resultado.classList.remove("oculto");
}

btnBuscar.addEventListener("click", buscarPokemon);
inputNombre.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    buscarPokemon();
  }
});