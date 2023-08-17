<script lang="ts" setup>
import VPNavBarTitle from 'vitepress/dist/client/theme-default/components/VPNavBarTitle.vue';
import VPNavBarSearch from 'vitepress/dist/client/theme-default/components/VPNavBarSearch.vue';
import VPNavBarMenu from 'vitepress/dist/client/theme-default/components/VPNavBarMenu.vue';
import VPNavBarAppearance from 'vitepress/dist/client/theme-default/components/VPNavBarAppearance.vue';
import VPNavBarSocialLinks from 'vitepress/dist/client/theme-default/components/VPNavBarSocialLinks.vue';
import VPNavBarExtra from 'vitepress/dist/client/theme-default/components/VPNavBarExtra.vue';
import VPNavBarHamburger from 'vitepress/dist/client/theme-default/components/VPNavBarHamburger.vue';
import { useData } from 'vitepress';
import type { Config } from '../config';

const { theme } = useData<Config>();

defineProps<{
    isScreenOpen: boolean;
}>();
</script>

<template>
    <div class="VPNavBar">
        <div class="container">
            <VPNavBarTitle>
                <template #navbar-title>
                    <slot name="navbar-title" />
                </template>
            </VPNavBarTitle>
            <div class="content">
                <VPNavBarSearch class="search" />
                <VPNavBarMenu class="menu" />
                <VPNavBarAppearance class="appearance" />
                <VPNavBarSocialLinks
                    v-if="!theme?.mineInfo?.showSocialLinks"
                    class="social-links"
                />
                <VPNavBarExtra class="extra" />
                <VPNavBarHamburger
                    class="hamburger"
                    :active="isScreenOpen"
                    @click="$emit('toggle-screen')"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.VPNavBar {
    position: relative;
    border-bottom: 1px solid var(--vt-c-divider-light);
    padding: 0 12px 0 24px;
    height: var(--vt-nav-height);
    background-color: var(--vt-c-bg);
    white-space: nowrap;
    transition: border-color 0.5s, background-color 0.5s;
}

@media (min-width: 768px) {
    .VPNavBar {
        padding: 0 12px 0 32px;
    }
}

@media (min-width: 1280px) {
    .VPNavBar {
        padding: 0 32px;
    }
}

.container {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    max-width: var(--vp-screen-max-width);
}

.content {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-grow: 1;
}

.menu + .appearance {
    margin-left: 8px;
}
.menu + .social-links {
    margin-left: 12px;
}
.appearance + .social-links {
    margin-left: 12px;
}
</style>
