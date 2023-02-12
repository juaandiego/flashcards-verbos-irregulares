import { verbos } from "./verbs.js";
const dificultades = 5;
const longPorDefecto = 20;
let listaActual = [];
let textoFrente = "";
let textoAtras = "";
let textoDesafio = "";

const cardFront = document.getElementById("cardFront");
const cardBack = document.getElementById("cardBack");

const randomizaLista = lista => {
    for (let i = lista.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]];
        // StackOverflow totalmente, para evitar sesgos de órdenes no-tan-random
    }
    return lista;
}

const generaLista = (cantidadVerbos, dificultad) => {
    let puntoMedio;
    if (!dificultad || dificultad < 1) {
        dificultad = 1;
    } else if (dificultad > dificultades) {
        dificultad = dificultades;
    }
    puntoMedio = Math.floor(((dificultad - 1) / (dificultades - 1)) * verbos.length);

    if (!cantidadVerbos || cantidadVerbos < 1) {
        cantidadVerbos = longPorDefecto;
    } else if (cantidadVerbos > verbos.length) {
        cantidadVerbos = verbos.length;
    }

    let limiteInferior = puntoMedio - Math.floor(cantidadVerbos / 2);
    let limiteSuperior = puntoMedio + Math.ceil(cantidadVerbos / 2) - 1;

    if (limiteInferior < 0) {
        limiteSuperior += Math.abs(limiteInferior);
        limiteInferior = 0;
    } else if (limiteSuperior > verbos.length - 1) {
        limiteInferior -= limiteSuperior - verbos.length + 1;
        limiteSuperior = verbos.length - 1;
    }

    textoFrente = `<p class="p-b025">${cantidadVerbos} verbos, dificultad: ${dificultad}/${dificultades}</p>`;
    textoAtras = `<p class="p-b025">${cantidadVerbos} verbos, dificultad: ${dificultad}/${dificultades}</p>`;
    textoDesafio = `Practicando ${cantidadVerbos} verbos. Dificultad: ${dificultad}/${dificultades}\n`;
    return verbos.slice(limiteInferior, limiteSuperior + 1);
}

const cumpleConDesafio2 = (lista, elemento) => {
    /*  Sé que no era necesario manejar el DOM para este desafío,
    pero era más fácil validar todo visualmente así.

    Esta función en sí no será necesaria más adelante, ya que la flashcard tendrá un
    solo verbo de la lista generada a la vez; su trabajo es solo cumplir con la consigna */
    let verboAValidar = elemento.replace("to", ""); // Estandaricemos
    verboAValidar = `to ${verboAValidar.trim().toLowerCase()}`; // Estandaricemos más

    for (let verbo of lista) {
        textoFrente += `
        <p class="p-b025">
            Verb <strong>${verbo.infinitive}</strong> &gt; simple past: <strong>${verbo.simplePast}</strong>
        </p>`;

        textoAtras += `
        <p class="p-b025">
            Verb <strong>${verbo.infinitive}</strong> &gt; past participle: <strong>${verbo.pastParticiple}</strong>
        </p>`;

        textoDesafio += `Verb ${verbo.infinitive} > simple past: ${verbo.simplePast}\n`;
    }

    const verboEncontrado = lista.find((verbo) => verbo.infinitive === verboAValidar);
    const mensajeEncontrado = !verboEncontrado
        ? `El verbo ${verboAValidar} no está en la lista\n`
        : `El verbo ${verboAValidar} sí está en la lista\n`;

    cardFront.innerHTML += textoFrente;
    cardBack.innerHTML += textoAtras;
    console.log(mensajeEncontrado, textoDesafio);
}

listaActual = generaLista(
    parseInt(prompt(`Cantidad de verbos a practicar (máx. ${verbos.length} o ${longPorDefecto} por defecto)`)),
    parseInt(prompt(`Dificultad 1-${dificultades}`))
);
listaActual = randomizaLista(listaActual);

cumpleConDesafio2(
    listaActual,
    prompt("Finalmente, ingresa un verbo en presente para validar si está en la lista a practicar")
);