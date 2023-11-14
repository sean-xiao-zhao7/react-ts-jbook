// esbuild
import * as esbuild from "esbuild-wasm";
// esbuild plugins
import { unpkgPathPlugin } from "../plugins/unpkg-plugin";
import { fetchPlugin } from "../plugins/fetch-plugins";

const ESBuildService = async (sourceCode: string, loader: string) => {
    try {
        await esbuild.initialize({
            wasmURL: "/esbuild.wasm",
        });
    } catch (err: any) {
        console.log(err.message);
    }

    const result = await esbuild.build({
        entryPoints: [`index.${loader}`],
        bundle: true,
        write: false,
        plugins: [unpkgPathPlugin(), fetchPlugin(sourceCode)],
        outfile: "out.js",
    });

    return result;
};

export default ESBuildService;
