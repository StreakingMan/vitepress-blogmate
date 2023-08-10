import { defineConfigWithTheme } from 'vitepress';
import baseConfig from 'vitepress-blogmate-theme/config';
import type { Config as ThemeConfig } from 'vitepress-blogmate-theme';

export default defineConfigWithTheme<ThemeConfig>({
    extends: baseConfig,
    themeConfig: {
        todo: '123',
    },
});
