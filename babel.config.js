module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@": "./src",
            "@/components": "./src/components",
            "@/assets": "./src/assets",
            "@/services": "./src/services",
            "@/store": "./src/store",
            "@/types": "./src/types",
            "@/utils": "./src/utils",
          },
        },
      ],
    ],
  };
};
