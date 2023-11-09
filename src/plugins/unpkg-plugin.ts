import * as esbuild from "esbuild-wasm";
import { base } from "../a";

export const unpkgPathPlugin = () => {
    return {
        name: "unpkg-path-plugin",
        setup(build: esbuild.PluginBuild) {
            build.onResolve({ filter: /\.{1,2}\/.*/ }, async (args: any) => {
                return {
                    path: new URL(
                        args.path,
                        args.pluginData.baseUrl + "/"
                    ).toString(),
                    namespace: "http-url",
                };
            });

            build.onResolve({ filter: /.*/ }, async (args: any) => {
                let pluginData;
                if (args.path !== "index.js") {
                    args.path = new URL(args.path, base).toString();
                    pluginData = { baseImport: true };
                }
                return { path: args.path, namespace: "http-url", pluginData };
            });
        },
    };
};
