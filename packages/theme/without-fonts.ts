import Layout from './Layout.vue';
import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';

/**
 * @ref https://vitepress.dev/guide/custom-theme#distributing-a-custom-theme
 *
 * Distributing a Custom Theme
 * The easiest way to distribute a custom theme is by providing it as a template repository on GitHub.
 *
 * If you wish to distribute the theme as an npm package, follow these steps:
 *
 * Export the theme object as the default export in your package entry.
 *
 * If applicable, export your theme config type definition as ThemeConfig.
 *
 * If your theme requires adjusting the VitePress config, export that config under a package sub-path (e.g. my-theme/config) so the user can extend it.
 *
 * Document the theme config options (both via config file and frontmatter).
 *
 * Provide clear instructions on how to consume your theme (see below).
 */

const theme: Theme = {
    ...DefaultTheme,
    Layout,
};

export default theme;
