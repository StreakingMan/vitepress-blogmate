/// <reference types="vitepress/client" />

declare module 'vitepress-blogmate-theme/config' {
    import { UserConfig } from 'vitepress';
    const config: () => Promise<UserConfig>;
    export default config;
}
