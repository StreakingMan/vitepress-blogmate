declare module 'vibrancy-vitepress-theme/config' {
    import { UserConfig } from 'vitepress';
    const config: () => Promise<UserConfig>;
    export default config;
}
