/**
 * eslint config
 * @ref http://eslint.cn/
 * @desc generated at 4/28/2023, 2:05:29 AM by streakingman-cli@1.13.0
 */

module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 11,
    },
    env: {
        es6: true,
        node: true,
    },
    plugins: ['eslint-plugin-prettier', '@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    rules: {
        'prettier/prettier': 'error',
    },
};
