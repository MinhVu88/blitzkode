import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const indexedDB = localForage.createInstance({ name: 'sec9' });

export const unpkgFiles = (input: string) => {
  return {
    name: 'unpkg-files-plugin',
    setup(build: esbuild.PluginBuild) {
      // handle loading up "index.js" (the entry-point file specified in App.tsx)
      build.onLoad(
        { filter: /(^index\.js$)/ },
        (args: any) => {
          console.log('unpkg | files.ts | onLoad | args ->', args);

          return { loader: 'jsx', contents: input };
        }
      );

      // handle loading up cached files in IndexedDB (if there's any)
      build.onLoad(
        { filter: /.*/ },
        async (args: any) => {
          console.log('unpkg | files.ts | onLoad | args ->', args);

          // if a file's been fetched from unpkg & already cached in IndexedDB
          // it's returned immediately
          const cachedResponse = await indexedDB.getItem<esbuild.OnLoadResult>(args.path);

          if (cachedResponse) {
            return cachedResponse;
          }
        }
      );

      // handle loading up css files
      build.onLoad(
        { filter: /.css$/ },
        async (args: any) => {
          console.log('unpkg | files.ts | onLoad | args ->', args);

          // otherwise, cache it in IndexedDB
          const { data, request } = await axios.get(args.path);

          console.log('\nunpkg | files.ts | onLoad | request ->', request, '\n\n');

          // version 1
          // const escapedCSS = \`${data}\`;

          // version 2
          const escapedCSS = data.replace(/\n/g, '').replace(/"/g, '\\"').replace(/'/g, "\\'");

          const contents = `const style = document.createElement('style');

                            style.innerText = '${escapedCSS}';

                            document.head.appendChild(style);`;

          const response: esbuild.OnLoadResult = {
            loader: 'jsx',
            contents,
            resolveDir: new URL('./', request.responseURL).pathname
          };

          await indexedDB.setItem(args.path, response);

          return response;
        }
      );

      // handle loading up any arbitrary files, other than css files
      build.onLoad(
        { filter: /.*/ },
        async (args: any) => {
          console.log('unpkg | files.ts | onLoad | args ->', args);

          const { data, request } = await axios.get(args.path);

          console.log('\nunpkg | files.ts | onLoad | request ->', request, '\n\n');

          const response: esbuild.OnLoadResult = {
            loader: 'jsx',
            contents: data,
            resolveDir: new URL('./', request.responseURL).pathname
          };

          await indexedDB.setItem(args.path, response);

          return response;
        }
      );
    }
  };
};