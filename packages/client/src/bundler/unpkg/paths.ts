import * as esbuild from 'esbuild-wasm';

export const unpkgPaths = () => {
  return {
    name: 'unpkg-paths-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve(
        { filter: /(^index\.js$)/ },
        (args: any) => {
          console.log('\nunpkg | paths.ts | onResolve | args ->', args);

          return { path: 'index.js', namespace: 'a' };
        }
      );

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