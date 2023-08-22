import { defineConfigWithTheme } from 'vitepress';
import baseConfig from 'vitepress-blogmate-theme/config';
import type { Config as ThemeConfig } from 'vitepress-blogmate-theme';

export default defineConfigWithTheme<ThemeConfig>({
    extends: baseConfig,
    themeConfig: {
        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/StreakingMan',
            },
        ],
        mineInfo: {
            avatar: 'https://avatars.githubusercontent.com/u/30397306?v=4',
            title: `Hello, I'm StreakingMan`,
            description: '种一棵树最好的时间是十年前，其次是现在。',
            showSocialLinks: true,
        },
        nav: [
            { text: 'Home', link: '/' },
            { text: '标签', link: '/tags' },
            { text: '分类', link: '/categories' },
            { text: '归档', link: '/archives' },
        ],
    },
});
