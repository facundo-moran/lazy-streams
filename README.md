# 📦 lazy-streams

![Coverage](./coverage/badge.svg)

**LazyStreams** es una pequeña y poderosa librería escrita en **TypeScript** para trabajar con flujos de datos de manera **perezosa (lazy)** y **funcional**. Está diseñada para ser minimalista, expresiva y fácil de extender.

✅ Compatible con **TypeScript** 100%  
✅ Inspirada en principios de programación funcional  
✅ Permite trabajar con **streams infinitos, finitos y asíncronos**  
✅ Operaciones como `map`, `filter`, `reduce`, `flatMap`, `zip`, `groupBy`, `chunk`, entre otras

---

## 🚀 Instalación

```bash
npm install lazy-streams
```

---

## 🧠 Ejemplo básico

```ts
import { LazyStream } from 'lazy-streams';

// Números naturales
const naturals = LazyStream.from();
console.log(naturals.take(5)); // [0, 1, 2, 3, 4]

// Cuadrados
const squares = naturals.map(n => n * n);
console.log(squares.take(5)); // [0, 1, 4, 9, 16]

// Pares filtrados
const evens = naturals.filter(n => n % 2 === 0);
console.log(evens.take(5)); // [0, 2, 4, 6, 8]
```

---

## ⛓️ Funcionalidades destacadas

- `from(start, step)` — Stream infinito
- `fromArray(array)` — Stream finito
- `map(fn)`, `filter(fn)`, `flatMap(fn)`
- `reduce(fn, initialValue)`
- `zip(stream2, combiner)`
- `distinct()`, `skip(n)`, `take(n)`, `chunk(size)`
- `groupBy(fn)` para clasificaciones
- `forEachAsync(fn)`, `takeAsync(n)` para flujos asíncronos
- `fromAsyncSource(fn, count)` para integraciones con APIs externas

---

## 💡 Ejemplo práctico
Consulta el archivo [`examples/basic.ts`](./examples/basic.ts) para ver cómo usar LazyStream en contextos reales.

---

## 🤝 Contribuciones
Esta librería es **open source** y recibe con gusto mejoras, issues o nuevas ideas de operadores. 

- ¿Tienes una mejora? ¡Haz un fork y abre un PR!
- ¿Encontraste un bug o falta documentación? ¡Abre un issue!

> LazyStreams es una invitación a explorar la belleza de los flujos infinitos de forma simple y elegante 💚

---

## 📄 Licencia

MIT © 2024 [Facundo Morán](https://github.com/facundo-moran)