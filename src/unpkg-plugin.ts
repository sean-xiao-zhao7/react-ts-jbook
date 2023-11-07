import * as esbuild from "esbuild-wasm";
import axios from "axios";
import { ba } from "./a";

export const unpkgPathPlugin = () => {
    return {
        name: "unpkg-path-plugin",
        setup(build: esbuild.PluginBuild) {
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                return { path: args.path, namespace: "a" };
            });

            build.onLoad({ filter: /.*/ }, async (args: any) => {
                if (args.path === "index.js") {
                    return {
                        loader: "jsx",
                        contents: `
              import message from './message';
              console.log(message);
            `,
                    };
                } else {
                    const result = await axios.get(ba);
                    return { loader: "js", contents: result.data };
                }
            });
        },
    };
};
