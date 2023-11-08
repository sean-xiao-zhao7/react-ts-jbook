import * as esbuild from "esbuild-wasm";
import axios from "axios";
import { base } from "./a";
import localforage from "localforage";

const unpkgStaticCache = localforage.createInstance({
    name: "unpkgStaticCache",
});

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

            build.onLoad(
                { filter: /.*/, namespace: "http-url" },
                async (args: any) => {
                    if (args.path === "index.js") {
                        return {
                            loader: "jsx",
                            contents: `
              import message from 'react';
              console.log(message);
            `,
                        };
                    } else {
                        let data, responseURL;
                        const cacheData: any = await unpkgStaticCache.getItem(
                            args.path
                        );
                        if (cacheData) {
                            data = cacheData.data;
                            responseURL = cacheData.responseURL;
                        } else {
                            const result = await axios.get(args.path);
                            data = result.data;
                            responseURL = result.request.responseURL;

                            await unpkgStaticCache.setItem(args.path, {
                                data,
                                responseURL,
                            });
                        }
                        return {
                            loader: "js",
                            contents: data,
                            pluginData:
                                args.pluginData && args.pluginData.baseImport
                                    ? {
                                          baseUrl: responseURL
                                              .split("/")
                                              .slice(0, -1)
                                              .join("/"),
                                      }
                                    : {},
                        };
                    }
                }
            );
        },
    };
};
