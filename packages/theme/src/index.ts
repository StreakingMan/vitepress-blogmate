import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import NotFound from './NotFound.vue';
import './styles/index.css';

const VPTheme: Theme = {
    Layout() {
        return h(DefaultTheme.Layout, null, {
            'not-found': () => h(NotFound),
        });
    },
};

export { VPTheme };

export type { Config } from './config';
