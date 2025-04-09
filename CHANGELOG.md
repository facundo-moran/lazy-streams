# 📦 Changelog - lazy-streams

Todas las versiones publicadas se documentarán aquí.

---

## [1.0.0] - 2024-04-03
### 🚀 Versión inicial estable

#### ✅ Funcionalidades principales
- Stream infinito con `from(start, step)`
- Stream finito con `fromArray(array)`
- Transformaciones: `map`, `filter`, `flatMap`, `reduce`, `zip`
- Utilidades: `skip`, `take`, `distinct`, `chunk`, `groupBy`
- Soporte asíncrono: `forEachAsync`, `takeAsync`, `fromAsyncSource`
- Soporte completo para TypeScript y JSDoc
- Sistema de pruebas con Vitest
- Integración CI/CD vía GitHub Actions
- Ejemplo completo en `examples/basic.ts`

#### 📁 Estructura modular
- Organizado por carpetas `src`, `tests`, `examples`, `dist`
- Configuración con `rollup`, `tsconfig`, `vitest`, `.gitignore`

---

## 🛠 Scripting

Para facilitar el versionado, ejecuta:

```bash
npm install --save-dev standard-version
```

Agrega este script en `package.json`:

```json
"scripts": {
  "release": "standard-version"
}
```

Y para generar una nueva versión:

```bash
npm run release
```

Esto actualizará `CHANGELOG.md`, incrementará la versión en `package.json`, y generará un commit + tag automáticamente.

---

> Esta versión marca el lanzamiento estable del proyecto.
> Siguiente paso: recibir feedback de la comunidad e iterar mejoras 🚀
