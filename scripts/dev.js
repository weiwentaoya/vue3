
const { build } = require('esbuild');
const { resolve } = require('path');
const target = 'reactive'
build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
  bundle: true,
  // minify: true,
  format: 'esm',
  sourcemap: true,
  platform: 'browser',
  // target: 'node14',
  
}).then(() => {
  console.log('done');
})

