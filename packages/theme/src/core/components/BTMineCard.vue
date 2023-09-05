<script setup lang="ts">
import { useData } from 'vitepress';
import VPNavBarSocialLinks from 'vitepress/dist/client/theme-default/components/VPNavBarSocialLinks.vue';
import type { Config } from '../../vitepress';
import { computed } from 'vue';

const { theme } = useData<Config>();
const mineInfo = computed<Config['mineInfo']>(() => theme.value.mineInfo);
</script>

<template>
    <div class="bt-mine-card">
        <div class="bt-mine-card-header">
            <img class="bt-mine-card-avatar" :src="mineInfo?.avatar" alt="avatar" />
            <div class="bt-mine-card-title">
                {{ mineInfo?.title }}
            </div>
        </div>
        <div class="bt-mine-card-description">{{ mineInfo?.description }}</div>
        <div class="spacer bt-mine-card-skills">
            <div v-for="skill in mineInfo?.skills || []" :key="skill" class="bt-mine-card-skill">
                {{ skill }}
            </div>
        </div>
        <VPNavBarSocialLinks v-if="mineInfo?.showSocialLinks" class="social-links" />
    </div>
</template>
