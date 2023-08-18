declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent;
    export default component;
}

declare module 'vitepress/dist/client/theme-default/composables/sidebar' {
    import type { Ref } from 'vue';
    export function useCloseSidebarOnEscape(isOpen: Ref<boolean>, close: () => void): void;
}
