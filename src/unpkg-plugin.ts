import * as esbuild from "esbuild-wasm";
import axios from "axios";
import { base } from "./a";

export const unpkgPathPlugin = () => {
    return {
        name: "unpkg-path-plugin",
        setup(build: esbuild.PluginBuild) {
            build.onResolve({ filter: /\.\/.*/ }, async (args: any) => {
                return {
                    path: new URL(args.path, args.importer + "/").toString(),
                    namespace: "http-url",
                };
            });

            build.onResolve({ filter: /.*/ }, async (args: any) => {
                if (args.path !== "index.js")
                    args.path = new URL(args.path, base).toString();
                return { path: args.path, namespace: "http-url" };
            });

            build.onLoad(
                { filter: /.*/, namespace: "http-url" },
                async (args: any) => {
                    if (args.path === "index.js") {
                        return {
                            loader: "jsx",
                            contents: `
              import message from 'medium-test-pkg';
              console.log(message);
            `,
                        };
                    } else {
                        const result = await axios.get(args.path);
                        return { loader: "js", contents: result.data };
                    }
                }
            );
        },
    };
};
