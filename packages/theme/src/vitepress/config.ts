import type { DefaultTheme } from 'vitepress/theme';

export interface Config extends DefaultTheme.Config {
    mineInfo?: MineInfo;
}

interface MineInfo {
    avatar: string;
    title: string;
    description: string;
    // 开启后，NavBar 中的 socialLinks 将隐藏
    showSocialLinks?: boolean;
}
