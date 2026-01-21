import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
  // Browser-friendly UMD build
  {
    input: 'src/index.ts',
    output: {
      name: 'XMInstallSDK',
      file: pkg.main,
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      resolve({ browser: true }),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser(),
    ],
  },
  // ES module build
  {
    input: 'src/index.ts',
    output: {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser(),
    ],
  },
];
