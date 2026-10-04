import resolve from '@rollup/plugin-node-resolve';  
import terser from '@rollup/plugin-terser';
import nodePolyfills from 'rollup-plugin-polyfill-node';
 
export default {  
  input: './build/interpreter.js',
  output: {  
    file: './clyde-theme/assets/scripts/interpreter.umd.js',
    format: 'umd',
    name: 'ClydeInterpreter',
    sourcemap: false,
  },  
  plugins: [  
    resolve(), // Locate node_modules dependencies  
    terser(), // Minify the bundle (optional)  
    nodePolyfills(),
  ],  
};  
