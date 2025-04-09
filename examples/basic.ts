import { LazyStream } from '../src/index';

// Ejemplo 1: Números naturales
const naturals = LazyStream.from();
console.log('Naturales:', naturals.take(10));

// Ejemplo 2: Números pares filtrados
const evens = naturals.filter(n => n % 2 === 0);
console.log('Pares:', evens.take(5));

// Ejemplo 3: Cuadrados
const squares = naturals.map(n => n * n);
console.log('Cuadrados:', squares.take(5));

// Ejemplo 4: Agrupando por pares/impares
const grouped = naturals.take(10);
const result = LazyStream.fromArray(grouped).groupBy(n => n % 2 === 0 ? 'par' : 'impar');
console.log('Agrupados:', Object.fromEntries(result));

// Ejemplo 5: Chunk de 3 en 3
const chunks = LazyStream.fromArray([1, 2, 3, 4, 5, 6, 7]).chunk(3);
console.log('Chunks:', chunks.take(3));

// Ejemplo 6: Zip de números y sus cuadrados
const zipped = naturals.zip(squares, (n, sq) => `${n}^2 = ${sq}`);
console.log('Zip:', zipped.take(5));
