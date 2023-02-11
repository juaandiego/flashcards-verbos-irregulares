import { verbos } from "./verbs.js";
let listaActual = [];
const dificultades = 5;

const cardFront = document.getElementById("cardFront");
const cardBack = document.getElementById("cardBack");

const randomizaLista = lista => {
    for (let i = lista.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
}

const generaLista = (cantidadVerbos, dificultad) => {
    let puntoMedio = Math.floor(((dificultad - 1) / (dificultades - 1)) * (verbos.length));
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

// Sé que no era necesario manejar el DOM para este desafío,
// pero era muuucho más fácil validar todo así
const imprimeListaDesafio2 = lista => {
    let textoFrente = "";
    let textoAtras = "";

    for (let verbo of lista) {
        textoFrente += `
        <p class="p-b025">
            Verb <strong>${verbo.infinitive}</strong> &gt; simple past: <strong>${verbo.simplePast}</strong>
        </p>`;

        textoAtras += `
        <p class="p-b025">
            Verb <strong>${verbo.infinitive}</strong> &gt; past participle: <strong>${verbo.pastParticiple}</strong>
        </p>`;
    }

    cardFront.innerHTML += textoFrente;
    cardBack.innerHTML += textoAtras;
}

listaActual = generaLista(
    parseInt(prompt(`Cantidad de verbos a practicar (máx. ${verbos.length})`)),
    parseInt(prompt(`Dificultad 1-${dificultades}`))
);
// No valido estos inputs en este momento porque la forma de capturar el valor será distinta luego
listaActual = randomizaLista(listaActual);
imprimeListaDesafio2(listaActual);