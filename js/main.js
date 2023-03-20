/* Definiciones generales */
const dificultades = 5;
const longPorDefecto = 20;
const dificultadPorDefecto = 2;
const teclasControl = ["j", "J", "l", "L", "k", "K"]


/* Elementos */
const flipper = document.getElementById("card");
let cardStatus = flipper.classList;
const cardFront = document.getElementById("cardFront");
const cardBack = document.getElementById("cardBack");
const overlaySettings = document.getElementById("mainOverlay");
const formularioSettings = document.getElementById("settingsForm");
const selectorDificultad = document.getElementById("selectorDificultad");
const selectorCantidad = document.getElementById("cantidadEscogida");
const inputsActualiza = document.getElementById("actualizaPosicion").elements;
const reinicia = document.getElementById("reinicia");
const flippeables = [cardFront, cardBack];
const checks = [
    document.getElementById("checkSimple"),
    document.getElementById("checkParticipio")
];
const arrows = [
    document.getElementById("flechaAntes"),
    document.getElementById("flechaDespues")
];


/* ¿Sesión existente? */
let sesion = JSON.parse(localStorage.getItem("sesion")) || false;
let verbos = JSON.parse(localStorage.getItem("verbos")) || [];
let listaActual = JSON.parse(localStorage.getItem("listaActual")) || [];
let posicionActual = parseInt(localStorage.getItem("posicionActual")) || 0;


/* Funciones */
const iniciaApp = async () => {
    if (!sesion || !listaActual) {
        overlaySettings.className = "main-overlay show";
        verbos = await cargaVerbos();
        selectorDificultad.max = dificultades;
        selectorDificultad.value = 0;
        selectorCantidad.max = verbos.length;
    } else {
        imprimeTarjetaActual(posicionActual);
    }
}

const cargaVerbos = async () => {
    try {
        const response = await fetch("./assets/verbs.json");
        const data = await response.json();
        return data;
    } catch (error) {
        Swal.fire({
            title: "Ocurrió un error",
            text: `Regarca la página para intentar de nuevo. Detalles: ${error}`,
            type: "error",
            confirmButtonText: "Intentar de nuevo",
            confirmButtonColor: "#e0ad46"
        }).then(() => { window.location.reload(); });
    }
}

const validaChecks = (check) => {
    let cualCambia = parseInt(check);
    if (!checks[0].checked && !checks[1].checked) {
        if (cualCambia === 0) { checks[1].checked = true }
        else if (cualCambia === 1) { checks[0].checked = true }
    }
}

const defineSesion = settings => {
    let checkSimple = settings.get("checkSimple") ? true : false;
    let checkParticipio = settings.get("checkParticipio") ? true : false;
    if (!checkSimple && !checkParticipio) { checkSimple = true; }

    let checkRandom = settings.get("checkRandom") ? true : false;

    let cantidad = settings.get("cantidad");
    if (!cantidad || cantidad < 1) { cantidad = longPorDefecto; }
    else if (cantidad > verbos.length) { cantidad = verbos.length; }

    let dificultad = settings.get("dificultad");
    if (!dificultad || dificultad < 1) { dificultad = dificultadPorDefecto; }
    else if (dificultad > dificultades) { dificultad = dificultades; }

    let listaGenerada = generaLista(cantidad, dificultad);
    listaActual = checkRandom
        ? randomizaLista(listaGenerada)
        : listaGenerada;

    sesion = { cantidad, dificultad, checkSimple, checkParticipio, checkRandom };
    let sesionJson = JSON.stringify(sesion);
    let verbosJson = JSON.stringify(verbos);
    let listaJson = JSON.stringify(listaActual);
    localStorage.setItem("sesion", sesionJson);
    localStorage.setItem("verbos", verbosJson);
    localStorage.setItem("listaActual", listaJson);
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
    let textoFrente = "";
    let textoAtras = "";
    let verbo = listaActual[pos];

    textoFrente = `
        <h2 class="card-title p-b025">
            Verb<br />
            <span class="card-title-verb-big">${verbo.infinitive}</span>
        </h2>
        <p class="i p-b">${verbo.infinitiveExtraInfo ? verbo.infinitiveExtraInfo : "&nbsp;"}</p>
        <p class="p-b025">
            Verb ${pos + 1} out of ${listaActual.length}
        </p>
    `;

    textoAtras += `
        <h2 class="card-title p-b025">
            Verb<br />
            <span class="card-title-verb-big">${verbo.infinitive}</span>
        </h2>
        <p class="i p-b">${verbo.infinitiveExtraInfo ? verbo.infinitiveExtraInfo : "&nbsp;"}</p>
    `;

    if (sesion.checkSimple === true) {
        textoAtras += `
            <h3 class="card-title-verb">${verbo.simplePast}
            ${verbo.simplePastAlt ? " / " + verbo.simplePastAlt : ""}</h3>
            <p class="p-b025">simple past</p>
            <p class="i p-b"> ${verbo.simplePastExtraInfo ? verbo.simplePastExtraInfo : "&nbsp;"} </p>
        `;
    }

    if (sesion.checkParticipio === true) {
        textoAtras += `
            <h3 class="card-title-verb">${verbo.pastParticiple}
            ${verbo.pastParticipleAlt ? " / " + verbo.pastParticipleAlt : ""}</h3>
            <p class="p-b025">past participle</p>
            <p class="i p-b"> ${verbo.pastParticipleExtraInfo ? verbo.pastParticipleExtraInfo : "&nbsp;"} </p>
        `;
    }

    cardFront.innerHTML = textoFrente;
    cardBack.innerHTML = textoAtras;
}

const actualizaPosicion = direccion => {
    let huboCambios = true;
    let estaVolteada = cardStatus.contains("flip");

    switch (direccion) {
        case "siguiente":
        case "l":
            if (posicionActual < (listaActual.length - 1)) {
                posicionActual++;
            } else {
                borraSesion();
                posicionActual = 0;
            }
            break;
        case "anterior":
        case "j":
            if (posicionActual > 0) {
                posicionActual--;
            } else {
                posicionActual = listaActual.length - 1;
            }
            break;
        case "flip":
        case "k":
            estaVolteada
                ? cardStatus.remove("flip")
                : cardStatus.add("flip");
            huboCambios = false;
            break;
    }

    if (huboCambios) {
        let timeOut = estaVolteada ? 200 : 0;
        estaVolteada && cardStatus.remove("flip");
        localStorage.setItem("posicionActual", `${posicionActual}`);
        // Para compensar por transición en CSS
        setTimeout(() => { imprimeTarjetaActual(posicionActual); }, timeOut);
    }
}

const borraSesion = () => {
    Swal.fire({
        title: "¿Iniciar nuevamente?",
        text: "Podrás configurar nuevamente tus tarjetas, pero perderás el progreso actual",
        showCancelButton: true,
        type: "warning",
        cancelButtonText: "Quedarme aquí",
        confirmButtonColor: "#e0ad46"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            window.location.reload();
        }
    });
}


/* Listeners y ejecuciones */
document.addEventListener("DOMContentLoaded", iniciaApp);
reinicia.addEventListener("click", borraSesion);

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

checks.forEach((e) => {
    e.addEventListener("change", () => {
        validaChecks(e.value);
    });
});

flippeables.forEach((e) => {
    e.addEventListener("click", () => {
        actualizaPosicion("flip");
    });
});

arrows.forEach((e) => {
    let accion = e.dataset.action;
    e.addEventListener("click", () => {
        actualizaPosicion(accion);
    });
});

document.addEventListener("keypress", (e) => {
    let tecla = e.key.toLowerCase();
    if (teclasControl.indexOf(tecla) !== -1) { actualizaPosicion(tecla); }
});