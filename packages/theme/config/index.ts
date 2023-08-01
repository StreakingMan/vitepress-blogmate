import type { DefaultTheme } from 'vitepress/theme';
import { defineConfigWithTheme } from 'vitepress';
import theme from '../without-fonts.js';

export interface ThemeConfig extends DefaultTheme.Config {
    todo: string;
}

const baseConfig = defineConfigWithTheme<ThemeConfig>({
    extends: theme,
    themeConfig: {
        todo: 'todo',
        siteTitle: 'Default Site Title',
        search: {
            provider: 'local',
        },
    },
});
export default baseConfig;
