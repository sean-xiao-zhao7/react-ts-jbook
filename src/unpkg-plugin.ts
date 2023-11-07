import * as esbuild from "esbuild-wasm";
import axios from "axios";
import { ba, base } from "./a";

export const unpkgPathPlugin = () => {
    return {
        name: "unpkg-path-plugin",
        setup(build: esbuild.PluginBuild) {
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                return { path: args.path, namespace: "http-url" };
            });

            build.onResolve(
                { filter: /^\.\//, namespace: "http-url" },
                async (args: any) => {
                    return { path: new URL(args.path, base).toString() };
                }
            );

            build.onLoad(
                { filter: /.*/, namespace: "http-url" },
                async (args: any) => {
                    if (args.path === "index.js") {
                        return {
                            loader: "jsx",
                            contents: `
              import message from 'medium-test';
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
