module.exports = {
  extends: "airbnb-base",
  root: true,
  env: {
    node: true,
    browser: true,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'strict': 0,
    'no-param-reassign': ["error", {
      "props": false
    }],
    'max-len': ["error", {
      "code": 360
    }],
    'no-plusplus': ["error", {
      "allowForLoopAfterthoughts": true
    }],
    'no-new': 'off',
    'class-methods-use-this': 'off',
    'import/no-unresolved': 0,
  },
  plugins: [
    'html'
  ],
  parser: 'babel-eslint'
};