import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localforage from "localforage";

const unpkgStaticCache = localforage.createInstance({
    name: "unpkgStaticCache",
});

export const fetchPlugin = (userInput: string) => {
    return {
        name: "unpkg-path-plugin",
        setup(build: esbuild.PluginBuild) {
            build.onLoad(
                { filter: /(^index\.js$)/, namespace: "http-url" },
                async (args: any) => {
                    return {
                        loader: args.pluginData.loader
                            ? args.pluginData.loader
                            : "jsx",
                        contents: userInput,
                    };
                }
            );

            build.onLoad(
                { filter: /.*\.css$/, namespace: "http-url" },
                async (args: any) => {
                    let data, responseURL;
                    const cacheData = await unpkgStaticCache.getItem<{
                        data: any;
                        responseURL: string;
                    }>(args.path);
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
                        loader: "css",
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
            );

            build.onLoad(
                { filter: /.*/, namespace: "http-url" },
                async (args: any) => {
                    let data, responseURL;
                    const cacheData = await unpkgStaticCache.getItem<{
                        data: any;
                        responseURL: string;
                    }>(args.path);
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
                        loader: args.pluginData.loader
                            ? args.pluginData.loader
                            : "js",
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
            );
        },
    };
};
