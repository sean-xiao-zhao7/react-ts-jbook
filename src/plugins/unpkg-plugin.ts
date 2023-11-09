import * as esbuild from "esbuild-wasm";
import { base } from "../a";

export const unpkgPathPlugin = () => {
    return {
        name: "unpkg-path-plugin",
        setup(build: esbuild.PluginBuild) {
            build.onResolve({ filter: /(^index\..*$)/ }, async (args: any) => {
                return { path: args.path, namespace: "http-url" };
            });

            build.onResolve({ filter: /^.*\.css$/ }, async (args: any) => {
                return {
                    path: new URL(args.path, base).toString(),
                    namespace: "http-url",
                    pluginData: {
                        ...args.pluginData,
                        loader: "css",
                        baseImport: true,
                    },
                };
            });

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
                args.path = new URL(args.path, base).toString();
                return {
                    path: args.path,
                    namespace: "http-url",
                    pluginData: { baseImport: true },
                };
            });
        },
    };
};
