import * as esbuild from 'esbuild-wasm';

// the plugin's functionality is explained in sec 7/vid 68
export const unpkgPaths = () => {
  return {
    name: 'unpkg-paths-plugin',
    setup(build: esbuild.PluginBuild) {
      // handle "index.js" (the entry-point file specified in App.tsx)
      build.onResolve(
        { filter: /(^index\.js$)/ },
        (args: any) => {
          console.log('\nunpkg | paths.ts | onResolve | args ->', args);

          return { path: 'index.js', namespace: 'a' };
        }
      );

      // handle relative paths in a module (for example: './utils' or '../utils')
      build.onResolve(
        { filter: /^\.+\// },
        async (args: any) => {
          console.log('\nunpkg | paths.ts | onResolve | args ->', args);

          // const baseDomain = args.importer + '/';
          const baseDomain = `https://unpkg.com${args.resolveDir}/`;

          return {
            path: new URL(args.path, baseDomain).href,
            namespace: 'a'
          };
        }
      );

      // handle a module's main file
      build.onResolve(
        { filter: /.*/ },
        async (args: any) => {
          console.log('\nunpkg | paths.ts | onResolve | args ->', args);

          return {
            path: `https://unpkg.com/${args.path}`,
            namespace: 'a'
          };
        }
      );
    }
  };
};