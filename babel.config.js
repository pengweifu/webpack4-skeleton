module.exports = {
  presets: [
    "@babel/preset-env"
  ],
  plugins: [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-transform-async-to-generator",
    "@babel/plugin-transform-regenerator",
    "@babel/plugin-transform-runtime"
  ]
};
