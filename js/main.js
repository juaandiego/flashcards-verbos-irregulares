/*
Un poco abstracta la idea de esta preentrega,
pero aquí vamos
*/

alert("¡Hola! Vamos a dibujar una grilla en la consola, simulando un tablero con flashcards. Presiona para continuar.");

let numFilas = parseInt(prompt("¿Cuántas filas tendrá la grilla? Mínimo 2, máximo 8"));
while (!numFilas || !(numFilas >= 2 && numFilas <= 8)) {
    numFilas = parseInt(prompt("Valor no válido. Intentemos de nuevo: ¿cuántas filas tendrá la grilla? Mínimo 2, máximo 8"));
}

let numColumnas = parseInt(prompt(`Perfecto, son ${numFilas} filas. ¿Y cuántas columnas?`));
while (!numColumnas || !(numColumnas >= 2 && numColumnas <= 8)) {
    numColumnas = parseInt(prompt("Valor no válido. Intentemos de nuevo: ¿cuántas columnas tendrá la grilla? Mínimo 2, máximo 8"));
}

console.log(`Perfecto, hagamos una grilla de flashcards de ${numFilas}x${numColumnas}`);
let textoFila = "";
for (let i = 0; i < numFilas; i++) {
    for (let j = 0; j < numColumnas; j++) {
        textoFila += "🟩 ";
    }
    console.log(`${(i + 1)}: ${textoFila} `);
    textoFila = "";
}