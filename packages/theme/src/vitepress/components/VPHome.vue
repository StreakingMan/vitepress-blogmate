<script setup lang="ts">
import VPHomeHero from 'vitepress/dist/client/theme-default/components/VPHomeHero.vue';
import VPHomeFeatures from 'vitepress/dist/client/theme-default/components/VPHomeFeatures.vue';
</script>

<template>
    <div class="VPHome">
        <slot name="home-hero-before" />
        <VPHomeHero>
            <template #home-hero-info><slot name="home-hero-info" /></template>
            <template #home-hero-image><slot name="home-hero-image" /></template>
        </VPHomeHero>
        <slot name="home-hero-after" />

        <slot name="home-features-before" />
        <VPHomeFeatures />
        <slot name="home-features-after" />

        <Content />
    </div>
</template>

<style scoped>
.VPHome {
    padding-bottom: 96px;
}

.VPHome :deep(.VPHomeSponsors) {
    margin-top: 112px;
    margin-bottom: -128px;
}

@media (min-width: 768px) {
    .VPHome {
        padding-bottom: 128px;
    }
}
</style>
