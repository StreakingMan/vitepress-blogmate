/**
 * lint-staged config
 * @ref https://www.npmjs.com/package/lint-staged
 * @desc generated at 4/28/2023, 2:05:39 AM by streakingman-cli@1.13.0
 */

module.exports = {
    '*.{[tj]s,[tj]sx,[cm]js}': ['eslint --fix'],
    '*.json': ['prettier --write'],
    '*.md': ['prettier --write'],
    '*.{css,scss}': ['stylelint --fix', 'prettier --write'],
    '*.vue': ['eslint --fix', 'stylelint --fix', 'prettier --write'],
};
