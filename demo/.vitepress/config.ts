import { defineConfigWithTheme } from 'vitepress';
import baseConfig from 'vitepress-blogmate-theme/config';
import type { ThemeConfig } from 'vitepress-blogmate-theme/config';

// https://vitepress.dev/reference/site-config
export default defineConfigWithTheme<ThemeConfig>({
    extends: baseConfig,
    themeConfig: {
        todo: '123',
    },
});
