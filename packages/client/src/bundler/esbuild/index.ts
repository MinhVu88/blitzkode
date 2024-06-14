import * as esbuild from "esbuild-wasm";
import { unpkgPaths, unpkgFiles } from "../unpkg/index";

let esbuildService: esbuild.Service;

export const startService = async (userInput: string) => {
	// if esbuild service hasn't started yet, start it
	if (!esbuildService) {
		esbuildService = await esbuild.startService({
			worker: true,
			wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm"
		});
	}

	try {
		// otherwise, start the bundling process & return the transpired, bundled code
		const result = await esbuildService.build({
			entryPoints: ["index.js"],
			bundle: true,
			write: false,
			plugins: [
				unpkgPaths(), 
				unpkgFiles(userInput)
			],
			define: {
				"process.env.NODE_ENV": '"production"',
				global: "window"
			},
			jsxFactory: '_React.createElement',
			jsxFragment: '_React.Fragment'
		});

		const bundledOutput = {
			code: result.outputFiles[0].text,
			error: ""
		}

		return bundledOutput;
	} catch (error: any) {
		return {
			code: "",
			error: error.message
		};
	}
};
