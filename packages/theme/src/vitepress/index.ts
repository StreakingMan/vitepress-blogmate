import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import VPNotFound from './components/VPNotFound.vue';
import './styles/index.css';

const VPTheme: Theme = {
    Layout() {
        return h(DefaultTheme.Layout, null, {
            'not-found': () => h(VPNotFound),
        });
    },
};

export { VPTheme };

export type { Config } from './config';
