/* Definiciones generales */
import { verbos } from "./verbs.js";
const dificultades = 5;
const longPorDefecto = 20;
const dificultadPorDefecto = 2;
let textoFrente = "";
let textoAtras = "";


/* Elementos */
const cardFront = document.getElementById("cardFront");
const cardBack = document.getElementById("cardBack");
const overlaySettings = document.getElementById("mainOverlay");
const formularioSettings = document.getElementById("settingsForm");
const selectorDificultad = document.getElementById("selectorDificultad");
const selectorCantidad = document.getElementById("cantidadEscogida");
const inputsActualiza = document.getElementById("actualizaPosicion").elements;
const reinicia = document.getElementById("reinicia");


/* ¿Sesión existente? */
let sesion = JSON.parse(localStorage.getItem("sesion")) || false;
let listaActual = JSON.parse(localStorage.getItem("listaActual")) || [];
let posicionActual = parseInt(localStorage.getItem("posicionActual")) || 0;


/* Funciones */
const iniciaApp = () => {
    if (!sesion || !listaActual) {
        overlaySettings.className = "main-overlay show";
        selectorDificultad.max = dificultades;
        selectorDificultad.value = 0;
        selectorCantidad.max = verbos.length;
    } else {
        imprimeTarjetaActual(posicionActual);
    }
}

const defineSesion = settings => {
    let cantidad = settings.get("cantidad");
    if (!cantidad || cantidad < 1) {
        cantidad = longPorDefecto;
    } else if (cantidad > verbos.length) {
        cantidad = verbos.length;
    }

    let dificultad = settings.get("dificultad");
    if (!dificultad || dificultad < 1) {
        dificultad = dificultadPorDefecto;
    } else if (dificultad > dificultades) {
        dificultad = dificultades;
    }

    let listaGenerada = generaLista(cantidad, dificultad);
    let listaRandomizada = randomizaLista(listaGenerada);

    let sesion = { cantidad, dificultad }
    let sesionJson = JSON.stringify(sesion);
    let listaJson = JSON.stringify(listaRandomizada);
    localStorage.setItem("sesion", sesionJson);
    localStorage.setItem("listaActual", listaJson);
    listaActual = listaRandomizada;
    localStorage.setItem("posicionActual", "0");

    overlaySettings.className = "main-overlay";
    imprimeTarjetaActual(0);
}

const generaLista = (cantidadVerbos, dificultad) => {
    let puntoMedio;
    puntoMedio = Math.floor(((dificultad - 1) / (dificultades - 1)) * verbos.length);

    let limiteInferior = puntoMedio - Math.floor(cantidadVerbos / 2);
    let limiteSuperior = puntoMedio + Math.ceil(cantidadVerbos / 2) - 1;

    if (limiteInferior < 0) {
        limiteSuperior += Math.abs(limiteInferior);
        limiteInferior = 0;
    } else if (limiteSuperior > verbos.length - 1) {
        limiteInferior -= limiteSuperior - verbos.length + 1;
        limiteSuperior = verbos.length - 1;
    }

    return verbos.slice(limiteInferior, limiteSuperior + 1);
}

const randomizaLista = lista => {
    for (let i = lista.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
}

const imprimeTarjetaActual = (pos) => {
    let verbo = listaActual[pos];

    textoFrente = `
        <h2 class="card-title p-b025">Verb: ${verbo.infinitive}</h2>
        <p class="i p-b">${verbo.infinitiveExtraInfo ? verbo.infinitiveExtraInfo : "&nbsp;"}</p>
        <p class="p-b025">
            Verbo ${pos + 1} de ${listaActual.length}
        </p>`;

    textoAtras = `
        <h2 class="card-title p-b025">Verb: ${verbo.infinitive}</h2>
        <p class="i p-b">${verbo.infinitiveExtraInfo ? verbo.infinitiveExtraInfo : "&nbsp;"}</p>

        <h3 class="b">${verbo.simplePast}</h3>
        <p class="p-b025">simple past</p>
        <p class="i p-b"> ${verbo.simplePastExtraInfo} </p>
        
        <h3 class="b">${verbo.pastParticiple}</h3>
        <p class="p-b025">past participle</p>
        <p class="i p-b"> ${verbo.pastParticipleExtraInfo} </p>`;

    cardFront.innerHTML = textoFrente;
    cardBack.innerHTML = textoAtras;
}

const actualizaPosicion = direccion => {
    switch (direccion) {
        case "siguiente":
            posicionActual = posicionActual < (listaActual.length - 1)
                ? posicionActual + 1
                : listaActual.length - 1;
            break;
        case "anterior":
            posicionActual = posicionActual > 0
                ? posicionActual - 1
                : 0;
            break;
        case "inicio":
            posicionActual = 0;
            break;
        case "final":
            posicionActual = listaActual.length - 1;
        default:
            posicionActual = posicionActual < (listaActual.length - 1)
                ? posicionActual + 1
                : listaActual.length - 1;
    }

    imprimeTarjetaActual(posicionActual);
    localStorage.setItem("posicionActual", `${posicionActual}`);
}

const borraSesion = () => {
    localStorage.clear();
    window.location.reload();
}


/* Listeners y ejecuciones */
document.addEventListener("DOMContentLoaded", iniciaApp);

formularioSettings.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = new FormData(settingsForm);
    defineSesion(data)
});

for (let i = 0; i < inputsActualiza.length; i++) {
    inputsActualiza[i].addEventListener("click", () => {
        actualizaPosicion(inputsActualiza[i].value);
    });
}

reinicia.addEventListener("click", borraSesion);