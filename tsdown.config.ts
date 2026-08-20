/**
 * Standalone tsdown config for the dsh-tetris bundle, mirroring the shared
 * clientBundle preset contract from the DeepSeek Harness monorepo
 * (packages/client/tsdown.client.ts):
 *
 *  - node half:  src/index.js         → lib/index.js   (esm, node)
 *  - client half: src/client/index.js → lib/client.js  (cjs, browser) wrapped
 *    as `window.__ModuleLoader__.load({ id, factory: (require) => {...} })`,
 *    with module-table specifiers ('react') left external so the browser
 *    loader resolves them from its seed table.
 */
import { defineConfig } from 'tsdown'

// Specifiers the loader module table answers; everything else gets bundled
// into the closure factory.
const EXTERNALS = new Set(['react'])

export default defineConfig([
  {
    name: 'dsh-tetris',
    entry: { index: 'src/index.js' },
    outDir: 'lib',
    format: ['esm'],
    platform: 'node',
    target: 'es2022',
    dts: false,
    clean: false,
    fixedExtension: false,
  },
  {
    name: 'dsh-tetris/client',
    entry: { client: 'src/client/index.js' },
    outDir: 'lib',
    format: 'cjs',
    platform: 'browser',
    target: 'es2022',
    dts: false,
    clean: false,
    sourcemap: true,
    outputOptions: {
      entryFileNames: 'client.js',
      banner: 'window.__ModuleLoader__.load({ id: "dsh-tetris", factory: (require) => {',
      footer: 'return module.exports; } });',
      intro: 'var module = { exports: {} }; var exports = module.exports;',
    },
    deps: {
      neverBundle: (specifier) => EXTERNALS.has(specifier),
      alwaysBundle: (specifier) => !EXTERNALS.has(specifier),
    },
  },
])
