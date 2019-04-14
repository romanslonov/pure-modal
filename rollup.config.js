import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import banner from 'rollup-plugin-banner';
import { terser } from 'rollup-plugin-terser';

const bannerText = 'Pure Modal v<%= pkg.version %> \n(c) 2019 <%= pkg.author %> \nReleased under the MIT License.';

const baseConfig = {
  input: 'lib/modal.js',
  plugins: [
    commonjs(),
    buble(),
  ],
};

export default [
  {
    ...baseConfig,
    output: {
      file: 'dist/pure-modal.esm.js',
      format: 'esm',
      exports: 'named',
    },
    plugins: [
      ...baseConfig.plugins,
      terser({
        output: {
          ecma: 6,
        },
      }),
      banner(bannerText),
    ],
  },
  {
    ...baseConfig,
    output: {
      compact: true,
      file: 'dist/pure-modal.common.js',
      format: 'cjs',
      name: 'PureModal',
      exports: 'named',
    },
    plugins: [
      ...baseConfig.plugins,
      terser({
        output: {
          ecma: 6,
        },
      }),
      banner(bannerText),
    ],
  },
  {
    ...baseConfig,
    output: {
      compact: true,
      file: 'dist/pure-modal.min.js',
      format: 'iife',
      name: 'PureModal',
    },
    plugins: [
      ...baseConfig.plugins,
      terser({
        output: {
          ecma: 5,
        },
      }),
      banner(bannerText),
    ],
  },
];
