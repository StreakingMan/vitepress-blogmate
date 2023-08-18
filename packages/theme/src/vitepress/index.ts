import type { Theme } from 'vitepress';
import './styles/index.css';
import VPApp from './components/VPApp.vue';

const VPTheme: Theme = {
    Layout: VPApp,
};

export { VPTheme };

export type { Config } from './config';
