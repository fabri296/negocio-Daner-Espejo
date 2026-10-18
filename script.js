const API_URL = "https://pokeapi.co/api/v2/pokemon/";
const DESTACADOS = ["bulbasaur", "charmander", "squirtle", "pikachu", "eevee", "snorlax"];

const COLORES_TIPO = {
  normal: "#a8a77a", fire: "#ee8130", water: "#6390f0", electric: "#f7d02c",
  grass: "#7ac74c", ice: "#96d9d6", fighting: "#c22e28", poison: "#a33ea1",
  ground: "#e2bf65", flying: "#a98ff3", psychic: "#f95587", bug: "#a6b91a",
  rock: "#b6a136", ghost: "#735797", dragon: "#6f35fc", dark: "#705746",
  steel: "#b7b7ce", fairy: "#d685ad"
};

const TIPOS_ES = {
  normal: "Normal", fire: "Fuego", water: "Agua", electric: "Eléctrico",
  grass: "Planta", ice: "Hielo", fighting: "Lucha", poison: "Veneno",
  ground: "Tierra", flying: "Volador", psychic: "Psíquico", bug: "Bicho",
  rock: "Roca", ghost: "Fantasma", dragon: "Dragón", dark: "Siniestro",
  steel: "Acero", fairy: "Hada"
};

const DATOS = [
  "El nombre Pokémon viene de la unión de las palabras en inglés Pocket Monsters, monstruos de bolsillo.",
  "Pikachu es el Pokémon número 25 de la Pokédex nacional.",
  "Snorlax pesa 460 kg, más que muchos Pokémon de aspecto mucho más grande.",
  "Mewtwo mide 2 metros y pesa 122 kg.",
  "La primera generación tenía 151 Pokémon. Hoy existen más de mil especies."
];

async function cargarDestacados() {
  const estado = document.getElementById("estado");
  const lista = document.getElementById("lista");

  try {
    const pokemones = await Promise.all(
      DESTACADOS.map(async function (nombre) {
        const response = await fetch(API_URL + nombre);
        if (!response.ok) {
          throw new Error("No se pudo cargar " + nombre);
        }
        return response.json();
      })
    );

    pokemones.forEach(function (datos) {
      lista.appendChild(crearTarjeta(datos));
    });
    estado.textContent = "";
  } catch (error) {
    estado.className = "error";
    estado.textContent = "No se pudieron cargar los Pokémon. Revisa tu conexión e intenta de nuevo.";
  }
}

function crearTarjeta(datos) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "pokemon";

  const tipoPrincipal = datos.types[0].type.name;
  tarjeta.style.borderTopColor = COLORES_TIPO[tipoPrincipal] || "#14213d";

  const imagen = document.createElement("img");
  imagen.src = datos.sprites.other["official-artwork"].front_default || datos.sprites.front_default;
  imagen.alt = datos.name;

  const nombre = document.createElement("h3");
  nombre.textContent = datos.name;

  const numero = document.createElement("p");
  numero.textContent = "N.º " + datos.id;

  const tipos = datos.types.map(function (t) {
    return TIPOS_ES[t.type.name] || t.type.name;
  });
  const tiposTexto = document.createElement("p");
  tiposTexto.textContent = tipos.join(", ");

  tarjeta.append(imagen, nombre, numero, tiposTexto);
  return tarjeta;
}


let indiceDato = 0;

function mostrarDato() {
  document.getElementById("dato").textContent = DATOS[indiceDato];
  indiceDato = (indiceDato + 1) % DATOS.length;
}
const pokebola = document.getElementById("pokebola");
pokebola.addEventListener("click", function () {
  pokebola.classList.remove("sacudir");
  void pokebola.offsetWidth; // reinicia la animación
  pokebola.classList.add("sacudir");
});

document.getElementById("btn-dato").addEventListener("click", mostrarDato);

mostrarDato();
cargarDestacados();