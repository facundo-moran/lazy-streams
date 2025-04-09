/**
 * LazyStream: Librería de evaluación perezosa en TypeScript
 * Ideal para aprendizaje funcional y composición de flujos de datos
 * @template T Tipo del valor contenido en el stream
 */
export class LazyStream<T> {
    private generatorFn: () => Generator<T>;
  
    /**
     * @param generatorFn Función generadora que produce elementos del stream
     */
    constructor(generatorFn: () => Generator<T>) {
      if (typeof generatorFn !== 'function') {
        throw new TypeError("LazyStream requiere una función generadora como argumento.");
      }
      this.generatorFn = generatorFn;
    }
  
    /**
     * Genera un stream infinito a partir de un número inicial y un paso
     * @param start Valor inicial (por defecto 0)
     * @param step Paso entre elementos (por defecto 1)
     */
    static from(start = 0, step = 1): LazyStream<number> {
      return new LazyStream<number>(function* () {
        let i = start;
        while (true) yield i, i += step;
      });
    }
  
    /**
     * Crea un stream finito a partir de un arreglo
     * @param arr Arreglo base para el stream
     */
    static fromArray<U>(arr: U[]): LazyStream<U> {
      return new LazyStream<U>(function* () {
        yield* arr;
      });
    }
  
    /**
     * Aplica una función a cada elemento del stream
     * @param fn Función de transformación
     */
    map<U>(fn: (value: T) => U): LazyStream<U> {
      const self = this;
      return new LazyStream<U>(function* () {
        for (const value of self.generatorFn()) {
          yield fn(value);
        }
      });
    }
  
    /**
     * Aplica una función que retorna múltiples valores y aplana el resultado
     * @param fn Función que retorna un array o un LazyStream
     */
    flatMap<U>(fn: (value: T) => U[] | LazyStream<U>): LazyStream<U> {
      const self = this;
      return new LazyStream<U>(function* () {
        for (const value of self.generatorFn()) {
          const result = fn(value);
          if (result instanceof LazyStream) {
            yield* result.generatorFn();
          } else if (Array.isArray(result)) {
            yield* result;
          } else {
            throw new TypeError("flatMap requiere que la función retorne un array o un LazyStream.");
          }
        }
      });
    }
  
    /**
     * Filtra valores duplicados del stream
     */
    distinct(): LazyStream<T> {
      const self = this;
      return new LazyStream<T>(function* () {
        const seen = new Set<T>();
        for (const value of self.generatorFn()) {
          if (!seen.has(value)) {
            seen.add(value);
            yield value;
          }
        }
      });
    }
  
    /**
     * Filtra elementos del stream según una condición
     * @param predicate Función de predicado
     */
    filter(predicate: (value: T) => boolean): LazyStream<T> {
      const self = this;
      return new LazyStream<T>(function* () {
        for (const value of self.generatorFn()) {
          if (predicate(value)) yield value;
        }
      });
    }
  
    /**
     * Toma los primeros `n` elementos del stream
     * @param n Cantidad de elementos a tomar
     */
    take(n: number): T[] {
      const result: T[] = [];
      const iterator = this.generatorFn();
      for (let i = 0; i < n; i++) {
        const next = iterator.next();
        if (next.done) break;
        result.push(next.value);
      }
      return result;
    }
  
    /**
     * Omite los primeros `n` elementos del stream
     * @param n Cantidad de elementos a omitir
     */
    skip(n: number): LazyStream<T> {
      const self = this;
      return new LazyStream<T>(function* () {
        const iterator = self.generatorFn();
        for (let i = 0; i < n; i++) iterator.next();
        for (const value of iterator) yield value;
      });
    }
  
    /**
     * Reduce el stream a un solo valor
     * @param reducer Función acumuladora
     * @param initialValue Valor inicial del acumulador
     */
    reduce<U>(reducer: (acc: U, value: T) => U, initialValue: U): U {
      let accumulator = initialValue;
      for (const value of this.generatorFn()) {
        accumulator = reducer(accumulator, value);
      }
      return accumulator;
    }
  
    /**
     * Combina dos streams en uno solo
     * @param other Otro LazyStream
     * @param combiner Función combinadora
     */
    zip<U, R>(other: LazyStream<U>, combiner: (a: T, b: U) => R): LazyStream<R> {
      const self = this;
      return new LazyStream<R>(function* () {
        const it1 = self.generatorFn();
        const it2 = other.generatorFn();
        while (true) {
          const v1 = it1.next();
          const v2 = it2.next();
          if (v1.done || v2.done) break;
          yield combiner(v1.value, v2.value);
        }
      });
    }
  
    /**
     * Agrupa los elementos del stream por clave
     * @param keyFn Función que extrae la clave
     */
    groupBy<K>(keyFn: (value: T) => K): Map<K, T[]> {
      const result = new Map<K, T[]>();
      for (const value of this.generatorFn()) {
        const key = keyFn(value);
        if (!result.has(key)) result.set(key, []);
        result.get(key)!.push(value);
      }
      return result;
    }
  
    /**
     * Divide el stream en bloques de tamaño fijo
     * @param size Tamaño de cada chunk
     */
    chunk(size: number): LazyStream<T[]> {
      const self = this;
      return new LazyStream<T[]>(function* () {
        const buffer: T[] = [];
        for (const value of self.generatorFn()) {
          buffer.push(value);
          if (buffer.length === size) {
            yield buffer.slice();
            buffer.length = 0;
          }
        }
        if (buffer.length > 0) yield buffer;
      });
    }
  
    /**
     * Recorre el stream con una función asíncrona
     * @param callback Función que recibe cada elemento
     */
    async forEachAsync(callback: (value: T) => Promise<void>): Promise<void> {
      for (const value of this.generatorFn()) {
        await callback(value);
      }
    }
  
    /**
     * Toma de forma asíncrona los primeros `n` valores del stream
     * @param n Cantidad de elementos
     */
    async takeAsync(n: number): Promise<T[]> {
      const result: T[] = [];
      const iterator = this.generatorFn();
      for (let i = 0; i < n; i++) {
        const next = iterator.next();
        if (next.done) break;
        result.push(await Promise.resolve(next.value));
      }
      return result;
    }
  
    /**
     * Genera un stream desde una fuente externa asíncrona
     * @param sourceFn Función que retorna un Promise con datos
     * @param count Cantidad de iteraciones
     */
    static fromAsyncSource<U>(sourceFn: (index: number) => Promise<U[]>, count: number): LazyStream<Promise<U>> {
      return new LazyStream<Promise<U>>(function* () {
        let index = 0;
        const buffer: Promise<U>[] = [];
        return (function* () {
          while (index < count) {
            if (buffer.length === 0) {
              const data = sourceFn(index);
              buffer.push(...(data as any));
            }
            yield buffer.shift()!;
            index++;
          }
        })();
      });
    }
  }
  