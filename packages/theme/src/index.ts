// import './styles/index.css';
// import VPApp from './components/VPApp.vue';
import Layout from './Layout.vue';
import type { Theme } from 'vitepress';
// import { withConfigProvider } from './composables/config';

const VPTheme: Theme = {
    Layout,
};

export { VPTheme };

export type { Config } from './config';
