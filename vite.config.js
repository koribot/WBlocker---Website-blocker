import { defineConfig } from 'vite';
import { resolve } from 'path';
import { terser } from 'rollup-plugin-terser';
import fs from 'fs';
import path from 'path';
import copy from 'rollup-plugin-copy';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    build: {
      rollupOptions: {
        input: {
          ...Object.fromEntries(
            fs
              .readdirSync('./src/dist/scripts')
              .map((file) => [
                `scripts/${path.basename(file, '.js')}`,
                resolve(__dirname, `src/dist/scripts/${file}`),
              ])
          ),
          ...Object.fromEntries(
            fs
              .readdirSync('./src/dist/lib')
              .map((file) => [
                `lib/${path.basename(file, '.js')}`,
                resolve(__dirname, `src/dist/lib/${file}`),
              ])
          ),
        },
        output: {
          dir: isProduction ? 'bundled-v0.0.1' : 'bundled-v0.0.2',
          entryFileNames: 'dist/[name].js',
          assetFileNames: '[name][extname]',
        },
        plugins: [
          copy({
            targets: [
              { src: 'src/html', dest: 'bundled-v0.0.1/html' },
              { src: 'src/css', dest: 'bundled-v0.0.1/css' },
              { src: 'src/icons', dest: 'bundled-v0.0.1/icons' },
              { src: 'src/manifest.json', dest:'bundled-v0.0.1' },
            ],
          }),
          terser({
            mangle: {
              reserved: [
                'ebexIdentifier',
                'ePvercel',
                'bv',
                'cv',
                'dv',
                'ePpython',
                'bpy',
                'cpy',
                'dpy',
                'showModal',
              ],
            },
            keep_fnames: [
              'ebexIdentifier',
              'ePvercel',
              'bv',
              'cv',
              'dv',
              'ePpython',
              'bpy',
              'cpy',
              'dpy',
              /showModal/,
            ],
          }),
        ],
      },
    },
  };
});
